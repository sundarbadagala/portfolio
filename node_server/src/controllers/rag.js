require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { MemoryVectorStore } = require("@langchain/classic/vectorstores/memory");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { createStuffDocumentsChain } = require("@langchain/classic/chains/combine_documents");
const { RunnableBranch, RunnablePassthrough, RunnableSequence } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { AIMessage, HumanMessage } = require("@langchain/core/messages");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");

const generateId = () => crypto.randomUUID();

// Safety / cost-control limits
const MAX_CONTENT_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 20;

// In-memory chat history map keyed by session ID
const messageHistories = new Map();

// In-memory vector store map (keyed by session ID and fallback to global)
const vectorStores = new Map();
let globalVectorStore = null;

// LLM & Embeddings Setup
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

async function getMessageHistory(sessionId) {
  if (!messageHistories.has(sessionId)) {
    messageHistories.set(sessionId, new InMemoryChatMessageHistory());
  }
  return messageHistories.get(sessionId);
}

async function ragUploadPDF(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const sessionId = req.body?.sessionId;

    const loader = new PDFLoader(req.file.path);
    const rawDocs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(rawDocs);

    // Storing data in vector store
    const store = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    globalVectorStore = store;

    if (sessionId) {
      vectorStores.set(sessionId, store);
      // Reset chat history for this new upload
      if (messageHistories.has(sessionId)) {
        const history = messageHistories.get(sessionId);
        await history.clear();
      }
    }

    fs.unlinkSync(req.file.path);

    res.json({
      message: "PDF processed successfully!",
      chunks: splitDocs.length,
      sessionId,
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
    const { question, content, sessionId: customSessionId } = req.body;
    const query = content || question;
    const sessionId = customSessionId || generateId();

    const targetVectorStore = (customSessionId && vectorStores.get(customSessionId)) || globalVectorStore;

    if (!targetVectorStore) {
      return res.status(400).json({ error: "Please upload a PDF first." });
    }
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    if (query.length > MAX_CONTENT_LENGTH) {
      return res.status(400).json({
        error: `Message too long. Max ${MAX_CONTENT_LENGTH} characters allowed.`,
      });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();
    headersSent = true;

    // Retrieve backend message history
    const history = await getMessageHistory(sessionId);
    const chatHistoryMessages = await history.getMessages();

    const retriever = targetVectorStore.asRetriever({ k: 3 });

    // Prompt to reformulate the user query into a standalone question using history
    const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is.",
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

    // Prompt for final document answering
    const qaPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Answer the user's question based ONLY on the provided context below. If you don't know the answer, just say \"I couldn't find the answer in the document.\"\n\nContext:\n{context}",
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: model,
      prompt: qaPrompt,
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

    // Persist user and assistant messages into backend history
    await history.addMessage(new HumanMessage(query));
    await history.addMessage(new AIMessage(fullAssistantResponse));

    // Cap in-memory history
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
