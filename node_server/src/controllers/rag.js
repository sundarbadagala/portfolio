require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { createStuffDocumentsChain } = require("@langchain/classic/chains/combine_documents");
const { RunnableBranch, RunnablePassthrough, RunnableSequence } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } = require("@langchain/core/prompts");
const { AIMessage, HumanMessage } = require("@langchain/core/messages");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { Document } = require("@langchain/core/documents");
const { model } = require('../utils/llm');

const {
  createVectorStoreFromDocs,
  getVectorStore,
  sanitizeCollectionName,
} = require("../utils/vectorstore/chroma");

const generateId = () => crypto.randomUUID();

// Safety / cost-control limits
const MAX_CONTENT_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 20;

// In-memory chat history map keyed by session ID
const messageHistories = new Map();

async function getMessageHistory(sessionId) {
  if (!messageHistories.has(sessionId)) {
    messageHistories.set(sessionId, new InMemoryChatMessageHistory());
  }
  return messageHistories.get(sessionId);
}

/**
 * Clean and normalize raw text extracted from PDF
 */
function cleanExtractedText(text) {
  if (!text) return "";
  return text
    // Fix hyphenated line breaks (e.g. "instruc-\ntion" -> "instruction")
    .replace(/(\w+)-\n(\w+)/g, "$1$2")
    // Replace multiple newlines with double newline
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    // Replace tabs or multiple spaces with a single space
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * @desc Process uploaded PDF, clean text, generate high-quality chunks, and store in ChromaDB
 * @route POST /api/v1/rag/upload
 */
async function ragUploadPDF(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const sessionId = req.body?.sessionId || generateId();
    const collectionName = sanitizeCollectionName(sessionId);

    // 1. Load PDF pages
    const loader = new PDFLoader(req.file.path, {
      splitPages: true,
    });
    const rawDocs = await loader.load();

    if (!rawDocs || rawDocs.length === 0) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Uploaded PDF appears to be empty or unreadable." });
    }

    // 2. Clean and structure page documents
    const originalFileName = req.file.originalname || "document.pdf";
    const uploadedAt = new Date().toISOString();

    const cleanedDocs = rawDocs
      .map((doc, idx) => {
        const cleanedText = cleanExtractedText(doc.pageContent);
        if (!cleanedText) return null;
        const pageNum = doc.metadata?.loc?.pageNumber || doc.metadata?.page || idx + 1;

        return new Document({
          pageContent: cleanedText,
          metadata: {
            source: originalFileName,
            page: Number(pageNum),
          },
        });
      })
      .filter(Boolean);

    // 3. Split into optimal semantic chunks preserving sentence and paragraph boundaries
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 150,
      separators: ["\n\n", "\n", ". ", "; ", ", ", " ", ""],
    });

    const splitDocs = await splitter.splitDocuments(cleanedDocs);

    // 4. Enrich chunk content with explicit page context for grounded LLM retrieval
    const enrichedChunks = splitDocs.map((doc, idx) => {
      const pageNum = doc.metadata?.page || 1;
      return new Document({
        pageContent: `[Page ${pageNum}]\n${doc.pageContent}`,
        metadata: {
          source: String(originalFileName),
          page: Number(pageNum),
          chunkIndex: Number(idx),
          sessionId: String(sessionId),
          uploadedAt: String(uploadedAt),
        },
      });
    });

    // 5. Ingest into ChromaDB
    await createVectorStoreFromDocs(enrichedChunks, collectionName);

    // 6. Reset conversation history for fresh upload
    if (messageHistories.has(sessionId)) {
      const history = messageHistories.get(sessionId);
      await history.clear();
    }

    // 7. Cleanup temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      message: "PDF processed and indexed in ChromaDB successfully!",
      chunks: enrichedChunks.length,
      sessionId,
      collectionName,
    });
  } catch (error) {
    console.error("RAG upload error:", error);
    let status = 500;
    let message = "Something went wrong during PDF processing. Please try again.";

    if (
      error.status === 429 ||
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      status = 429;
      message = "Quota exceeded for the free tier. Please try again in a few seconds.";
    } else if (error.message) {
      message = error.message;
    }

    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }
    }

    res.status(status).json({ error: message });
  }
}

/**
 * @desc High-accuracy multi-turn RAG retrieval and streaming answer generation
 * @route POST /api/v1/rag/ask
 */
async function ragAsk(req, res, next) {
  let headersSent = false;
  try {
    const { question, content, sessionId: customSessionId } = req.body;
    const query = content || question;
    const sessionId = customSessionId || generateId();
    const collectionName = sanitizeCollectionName(sessionId);

    // 1. Validate inputs
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    if (query.length > MAX_CONTENT_LENGTH) {
      return res.status(400).json({
        error: `Message too long. Max ${MAX_CONTENT_LENGTH} characters allowed.`,
      });
    }

    // 2. Retrieve VectorStore from ChromaDB
    let vectorStore = await getVectorStore(collectionName);
    if (!vectorStore && customSessionId) {
      vectorStore = await getVectorStore("rag_default_docs");
    }

    if (!vectorStore) {
      return res.status(400).json({
        error: "Please upload a PDF document first before asking questions.",
      });
    }

    // 3. Initialize SSE Headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    headersSent = true;

    // 4. Retrieve backend message history
    const history = await getMessageHistory(sessionId);
    const chatHistoryMessages = await history.getMessages();

    // 5. Setup Chroma Retriever with top 8 chunks for comprehensive recall
    const retriever = vectorStore.asRetriever({
      k: 8,
    });

    // 6. Contextualize query prompt for multi-turn conversations
    const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Given the chat history and the latest user question, rephrase the question into a standalone query that includes all relevant context, entities, numbers, and references from the conversation.\n" +
        "- Maintain the user's original terminology, technical terms, and intent precisely.\n" +
        "- Do NOT answer the question, only reformulate it.\n" +
        "- If the question is already complete and standalone, return it exactly as is.",
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
    ]);

    const historyAwareRetriever = RunnableBranch.from([
      [
        (input) => !input.chat_history || input.chat_history.length === 0,
        RunnableSequence.from([(input) => input.input, retriever]),
      ],
      RunnableSequence.from([
        contextualizeQPrompt,
        model,
        new StringOutputParser(),
        retriever,
      ]),
    ]);

    // 7. Grounded QA Prompt with high-accuracy instructions and formatting
    const qaPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a knowledgeable and precise document assistant. Your job is to answer the user's questions with high accuracy and depth based on the provided PDF context passages.

CRITICAL GUIDELINES FOR ACCURACY:
1. **Factuality & Groundedness**: Base your entire response on the provided Context below. Extract all relevant details, facts, numbers, dates, names, metrics, formulas, and explanations.
2. **Synthesize Thoroughly**: Look across all context passages (and different pages) to formulate a complete, cohesive answer.
3. **Structured & Clear**: Use markdown formatting (bullet points, bold text, numbered lists, code blocks, or tables) to make your explanation clear and readable.
4. **Page References**: When referencing specific facts from a page, cite the page number (e.g., "[Page 2]").
5. **Honesty on Missing Info**: If the context does not contain the answer or only contains partial information, answer the parts you can find and explicitly state what is missing. Never hallucinate facts outside the provided document.

Context:
{context}`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
    ]);

    const documentPrompt = PromptTemplate.fromTemplate(
      "--- Document Excerpt ({source}, Page {page}) ---\n{page_content}\n"
    );

    const combineDocsChain = await createStuffDocumentsChain({
      llm: model,
      prompt: qaPrompt,
      documentPrompt,
    });

    const retrievalChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        context: historyAwareRetriever.withConfig({ runName: "retrieve_documents" }),
        chat_history: (input) => input.chat_history ?? [],
      }),
      RunnablePassthrough.assign({
        answer: combineDocsChain,
      }),
    ]).withConfig({ runName: "retrieval_chain" });

    // 8. Stream answer
    const stream = await retrievalChain.stream({
      input: query,
      chat_history: chatHistoryMessages,
    });

    let fullAssistantResponse = "";

    for await (const chunk of stream) {
      if (chunk && chunk.answer !== undefined) {
        fullAssistantResponse += chunk.answer;
        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: chunk.answer,
          })}\n\n`
        );
      }
    }

    // 9. Persist conversation turn to backend history
    await history.addMessage(new HumanMessage(query));
    await history.addMessage(new AIMessage(fullAssistantResponse));

    // 10. Trim history
    const messages = await history.getMessages();
    if (messages.length > MAX_HISTORY_MESSAGES) {
      const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);
      await history.clear();
      await history.addMessages(trimmed);
    }

    res.write(
      `data: ${JSON.stringify({
        type: "done",
        sessionId,
      })}\n\n`
    );

    res.end();
  } catch (error) {
    console.error("RAG ask error:", error);
    let message = "Something went wrong. Please try again.";
    if (
      error.status === 429 ||
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED")
    ) {
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

module.exports = { ragUploadPDF, ragAsk };
