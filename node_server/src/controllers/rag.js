import 'dotenv/config';
import multer from 'multer';
import fs from 'fs';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "@langchain/classic/chains/history_aware_retriever";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";


const upload = multer({ dest: 'uploads/' });

// ప్రొడక్షన్ లో దీని బదులు Pinecone లేదా ChromaDB వాడాలి
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

        // డేటాని వెక్టార్ స్టోర్ లోకి పంపుతున్నాం
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
    try {
        const { question, history } = req.body;

        if (!globalVectorStore) {
            return res.status(400).json({ error: "Please upload a PDF first." });
        }
        if (!question) {
            return res.status(400).json({ error: "Question is required." });
        }

        // Convert raw history to LangChain message instances
        const chatHistoryMessages = (history || []).map((msg) => {
            if (msg.role === 'user') {
                return new HumanMessage(msg.text);
            } else {
                return new AIMessage(msg.text);
            }
        });

        const retriever = globalVectorStore.asRetriever({ k: 3 });

        // Prompt to reformulate the user query into a standalone question using history
        const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
            ["system", "Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is."],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);

        const historyAwareRetriever = await createHistoryAwareRetriever({
            llm: model,
            retriever,
            rephrasePrompt: contextualizeQPrompt,
        });

        // Prompt for final document answering
        const qaPrompt = ChatPromptTemplate.fromMessages([
            ["system", "Answer the user's question based ONLY on the provided context below. If you don't know the answer, just say \"I couldn't find the answer in the document.\"\n\nContext:\n{context}"],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);

        const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt: qaPrompt });
        const retrievalChain = await createRetrievalChain({
            retriever: historyAwareRetriever,
            combineDocsChain,
        });

        const response = await retrievalChain.invoke({
            input: question,
            chat_history: chatHistoryMessages,
        });

        res.json({ answer: response.answer });

    } catch (error) {
        console.error("RAG ask error:", error);
        let status = 500;
        let message = "Something went wrong. Please try again.";
        if (error.status === 429 || error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
            status = 429;
            message = "Quota exceeded for the free tier. Please try again in a few seconds.";
        } else if (error.message) {
            message = error.message;
        }
        res.status(status).json({ error: message });
    }
}



export { ragUploadPDF, ragAsk };
