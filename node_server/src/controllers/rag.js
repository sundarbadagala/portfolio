import 'dotenv/config';
import multer from 'multer';
import fs from 'fs';
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
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
        const { question } = req.body;

        if (!globalVectorStore) {
            return res.status(400).json({ error: "Please upload a PDF first." });
        }
        if (!question) {
            return res.status(400).json({ error: "Question is required." });
        }

        const retriever = globalVectorStore.asRetriever({ k: 3 });

        const prompt = ChatPromptTemplate.fromTemplate(`
            Answer the user's question based ONLY on the provided context below. 
            If you don't know the answer, just say "I couldn't find the answer in the document."
            
            Context: {context}
            
            Question: {input}
        `);

        const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt });
        const retrievalChain = await createRetrievalChain({ combineDocsChain, retriever });

        const response = await retrievalChain.invoke({ input: question });

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
