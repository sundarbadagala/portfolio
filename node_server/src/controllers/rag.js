import 'dotenv/config';
import multer from 'multer';
import fs from 'fs';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { RunnableBranch, RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


const upload = multer({ dest: 'uploads/' });

//use Pinecone/ ChromaDB for production
let globalVectorStore = null;

// LLM & Embeddings Setup
const model = new ChatGoogleGenerativeAI({ model: "gemini-2.5-flash", apiKey: process.env.GEMINI_API_KEY });
const embeddings = new GoogleGenerativeAIEmbeddings({ model: "gemini-embedding-001", apiKey: process.env.GEMINI_API_KEY });


async function ragUploadPDF(req, res, next) {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const loader = new PDFLoader(req.file.path);
        const rawDocs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(rawDocs);

        // Storing in data in vector db
        globalVectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

        fs.unlinkSync(req.file.path);

        res.json({ message: "PDF processed successfully!", chunks: splitDocs.length });
    } catch (error) {
        console.error("RAG upload error:", error);
        let status = 500;
        let message = "Something went wrong during PDF processing. Please try again.";
        if (error.status === 429 || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
            status = 429;
            message = "Quota exceeded for the free tier. Please try again in a few seconds.";
        } else if (error.message) {
            message = error.message;
        }
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error("Cleanup error:", err);
            }
        }
        res.status(status).json({ error: message });
    }
}

async function ragAsk(req, res, next) {
    let headersSent = false;
    try {
        const { question, content, history } = req.body;
        const query = question || content;

        if (!globalVectorStore) {
            return res.status(400).json({ error: "Please upload a PDF first." });
        }
        if (!query) {
            return res.status(400).json({ error: "Question is required." });
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        res.flushHeaders();
        headersSent = true;

        // Convert raw history to LangChain message instances
        const chatHistoryMessages = (history || []).map((msg) => {
            const role = msg.role;
            const text = msg.text || msg.content;
            if (role === 'user') {
                return new HumanMessage(text);
            } else {
                return new AIMessage(text);
            }
        });

        const retriever = globalVectorStore.asRetriever({ k: 3 });

        // Prompt to reformulate the user query into a standalone question using history
        const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
            ["system", "Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is."],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);

        const historyAwareRetriever = RunnableBranch.from([
            [
                (input) => !input.chat_history || input.chat_history.length === 0,
                RunnableSequence.from([(input) => input.input, retriever])
            ],
            RunnableSequence.from([
                contextualizeQPrompt,
                model,
                new StringOutputParser(),
                retriever
            ])
        ]);

        // Prompt for final document answering
        const qaPrompt = ChatPromptTemplate.fromMessages([
            ["system", "Answer the user's question based ONLY on the provided context below. If you don't know the answer, just say \"I couldn't find the answer in the document.\"\n\nContext:\n{context}"],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);

        const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt: qaPrompt });
        const retrievalChain = RunnableSequence.from([
            RunnablePassthrough.assign({
                context: historyAwareRetriever.withConfig({ runName: "retrieve_documents" }),
                chat_history: (input) => input.chat_history ?? []
            }),
            RunnablePassthrough.assign({
                answer: combineDocsChain
            })
        ]).withConfig({ runName: "retrieval_chain" });

        const stream = await retrievalChain.stream({
            input: query,
            chat_history: chatHistoryMessages,
        });

        for await (const chunk of stream) {
            if (chunk.answer !== undefined) {
                res.write(
                    `data: ${JSON.stringify({
                        type: "chunk",
                        content: chunk.answer,
                    })}\n\n`
                );
            }
        }

        res.write(
            `data: ${JSON.stringify({
                type: "done",
            })}\n\n`
        );

        res.end();

    } catch (error) {
        console.error("RAG ask error:", error);
        let message = "Something went wrong. Please try again.";
        if (error.status === 429 || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
            message = "Quota exceeded for the free tier. Please try again in a few seconds.";
        } else if (error.message) {
            message = error.message;
        }

        if (headersSent) {
            try {
                res.write(
                    `data: ${JSON.stringify({
                        type: "chunk",
                        content: `\n\nError: ${message}`,
                    })}\n\n`
                );
                res.write(
                    `data: ${JSON.stringify({
                        type: "done",
                    })}\n\n`
                );
            } catch (writeErr) {
                console.error("Failed to write error chunk:", writeErr);
            }
            res.end();
        } else {
            res.status(500).json({ error: message });
        }
    }
}



export { ragUploadPDF, ragAsk };
