const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnableWithMessageHistory } = require("@langchain/core/runnables");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { model } = require("../utils/llm/gemini");

// ---- Safety / cost-control limits ----
const MAX_CONTENT_LENGTH = 4000; // current prompt character cap
const MAX_HISTORY_MESSAGES = 20; // retain last 20 messages per session

// In-memory chat history map keyed by session ID
const messageHistories = new Map();

function getMessageHistory(sessionId) {
  if (!messageHistories.has(sessionId)) {
    messageHistories.set(sessionId, new InMemoryChatMessageHistory());
  }
  return messageHistories.get(sessionId);
}

// Build LangChain Prompt & Chain
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are Sundar AI, a helpful, intelligent, and friendly AI assistant created by Sundar. You assist users with programming, learning, problem-solving, productivity, and general questions accurately and concisely."
  ],
  new MessagesPlaceholder("history"),
  ["human", "{input}"]
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const conversationalChain = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (sessionId) => getMessageHistory(sessionId),
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

async function chat(req, res, next) {
  let headersSent = false;
  try {
    const { content, message, question: qParam, sessionId: customSessionId } = req.body;
    const inputContent = content || message || qParam;

    if (!inputContent || typeof inputContent !== "string" || !inputContent.trim()) {
      res.status(400);
      throw new Error("Chat content is required");
    }

    if (inputContent.length > MAX_CONTENT_LENGTH) {
      res.status(400);
      throw new Error(
        `Message too long. Max ${MAX_CONTENT_LENGTH} characters allowed.`,
      );
    }

    // Determine session ID for server-side memory persistence across calls
    const sessionId =
      customSessionId ||
      req.headers["x-session-id"] ||
      req.cookies?.sessionId ||
      req.ip ||
      "default_session";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();
    headersSent = true;

    // Stream LLM response with conversational memory
    const stream = await conversationalChain.stream(
      { input: inputContent },
      { configurable: { sessionId } }
    );

    for await (const chunk of stream) {
      if (chunk) {
        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: chunk,
          })}\n\n`,
        );
      }
    }

    // Cap message history to avoid unbounded memory growth
    const sessionHistory = getMessageHistory(sessionId);
    const messages = await sessionHistory.getMessages();
    if (messages.length > MAX_HISTORY_MESSAGES) {
      const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);
      await sessionHistory.clear();
      await sessionHistory.addMessages(trimmed);
    }

    res.write(
      `data: ${JSON.stringify({
        type: "done",
      })}\n\n`,
    );

    res.end();
  } catch (err) {
    console.error("Chat error:", err);
    if (headersSent) {
      try {
        let errMsg = "\n\nSomething went wrong. Please try again.";
        if (
          err.status === 429 ||
          err.message?.includes("quota") ||
          err.message?.includes("RESOURCE_EXHAUSTED")
        ) {
          errMsg =
            "\n\nAI Assistant: Quota exceeded for the free tier. Please try again in a few seconds.";
        } else if (err.message) {
          errMsg = `\n\nAI Assistant Error: ${err.message}`;
        }

        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: errMsg,
          })}\n\n`,
        );
        res.write(
          `data: ${JSON.stringify({
            type: "done",
          })}\n\n`,
        );
      } catch (writeErr) {
        console.error("Failed to write error chunk:", writeErr);
      }
      res.end();
    } else {
      next(err);
    }
  }
}

module.exports = { chat };