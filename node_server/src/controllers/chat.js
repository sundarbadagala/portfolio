const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnableWithMessageHistory } = require("@langchain/core/runnables");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const crypto = require("crypto");
const { model } = require("../utils/llm");
const ChatSession = require("../models/chatSession");

const generateId = () => crypto.randomUUID();

// ---- Safety / cost-control limits ----
const MAX_CONTENT_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 20;

// In-memory chat history map keyed by session ID
const messageHistories = new Map();

async function getMessageHistory(sessionId, userId = null) {
  if (!messageHistories.has(sessionId)) {
    const history = new InMemoryChatMessageHistory();
    // If sessionId exists in MongoDB, populate memory history
    if (userId) {
      try {
        const session = await ChatSession.findOne({ userId, sessionId });
        if (session && session.messages && session.messages.length > 0) {
          const recentMessages = session.messages.slice(-MAX_HISTORY_MESSAGES);
          for (const msg of recentMessages) {
            if (msg.role === "user") {
              await history.addMessage(new HumanMessage(msg.content));
            } else {
              await history.addMessage(new AIMessage(msg.content));
            }
          }
        }
      } catch (err) {
        console.error("Error hydrating chat history from DB:", err);
      }
    }
    messageHistories.set(sessionId, history);
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
  getMessageHistory: (sessionId) => {
    if (!messageHistories.has(sessionId)) {
      messageHistories.set(sessionId, new InMemoryChatMessageHistory());
    }
    return messageHistories.get(sessionId);
  },
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

/**
 * @desc Stream Chat response and persist user chat history in DB
 * @route POST /api/v1/chat
 * @access Private (authenticated user)
 */
async function chat(req, res, next) {
  let headersSent = false;
  try {
    const { content, message, question: qParam, sessionId: customSessionId, userMessageId, assistantMessageId } = req.body;
    const inputContent = content || message || qParam;

    if (!inputContent || typeof inputContent !== "string" || !inputContent.trim()) {
      res.status(400);
      throw new Error("Chat content is required");
    }

    if (inputContent.length > MAX_CONTENT_LENGTH) {
      res.status(400);
      throw new Error(`Message too long. Max ${MAX_CONTENT_LENGTH} characters allowed.`);
    }

    const userId = req.user?.id;
    const sessionId = customSessionId || generateId();
    const uMsgId = userMessageId || generateId();
    const aMsgId = assistantMessageId || generateId();

    // Ensure memory history is initialized (hydrating from DB if needed)
    await getMessageHistory(sessionId, userId);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();
    headersSent = true;

    let fullAssistantResponse = "";

    // Stream LLM response
    const stream = await conversationalChain.stream(
      { input: inputContent },
      { configurable: { sessionId } }
    );

    for await (const chunk of stream) {
      if (chunk) {
        fullAssistantResponse += chunk;
        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: chunk,
          })}\n\n`
        );
      }
    }

    // Cap in-memory history to avoid unbounded memory growth
    const sessionHistory = messageHistories.get(sessionId);
    if (sessionHistory) {
      const messages = await sessionHistory.getMessages();
      if (messages.length > MAX_HISTORY_MESSAGES) {
        const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);
        await sessionHistory.clear();
        await sessionHistory.addMessages(trimmed);
      }
    }

    let sessionTitle = "New Chat";

    // Persist messages to MongoDB if user is authenticated
    if (userId) {
      try {
        let session = await ChatSession.findOne({ userId, sessionId });
        const now = new Date();

        if (!session) {
          // Generate clean title from first message
          sessionTitle = inputContent.trim().replace(/[\r\n]+/g, " ").slice(0, 45);
          if (inputContent.length > 45) sessionTitle += "...";

          session = new ChatSession({
            userId,
            sessionId,
            title: sessionTitle,
            messages: [
              {
                id: uMsgId,
                role: "user",
                content: inputContent,
                createdAt: now,
              },
              {
                id: aMsgId,
                role: "assistant",
                content: fullAssistantResponse,
                createdAt: now,
              },
            ],
          });
          await session.save();
        } else {
          // If session title was default "New Chat", generate title
          if (!session.title || session.title === "New Chat") {
            session.title = inputContent.trim().replace(/[\r\n]+/g, " ").slice(0, 45);
            if (inputContent.length > 45) session.title += "...";
          }
          sessionTitle = session.title;

          session.messages.push({
            id: uMsgId,
            role: "user",
            content: inputContent,
            createdAt: now,
          });
          session.messages.push({
            id: aMsgId,
            role: "assistant",
            content: fullAssistantResponse,
            createdAt: now,
          });
          session.updatedAt = now;
          await session.save();
        }
      } catch (dbErr) {
        console.error("Failed to save chat session to MongoDB:", dbErr);
      }
    }

    res.write(
      `data: ${JSON.stringify({
        type: "done",
        sessionId,
        title: sessionTitle,
      })}\n\n`
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
          errMsg = "\n\nAI Assistant: Quota exceeded for the free tier. Please try again in a few seconds.";
        } else if (err.message) {
          errMsg = `\n\nAI Assistant Error: ${err.message}`;
        }

        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: errMsg,
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
      next(err);
    }
  }
}

/**
 * @desc Get all chat sessions of the logged in user
 * @route GET /api/v1/chat/sessions
 * @access Private
 */
async function getUserChatSessions(req, res, next) {
  try {
    const userId = req.user.id;
    const sessions = await ChatSession.find({ userId })
      .select("sessionId title createdAt updatedAt messages")
      .sort({ updatedAt: -1 })
      .lean();

    const formattedSessions = sessions.map((s) => ({
      sessionId: s.sessionId,
      title: s.title || "New Chat",
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: s.messages ? s.messages.length : 0,
      preview: s.messages && s.messages.length > 0 ? s.messages[0].content.slice(0, 60) : "",
    }));

    return res.sendSuccess(formattedSessions, "User chat sessions retrieved successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Get messages for a specific chat session
 * @route GET /api/v1/chat/sessions/:sessionId
 * @access Private
 */
async function getChatSessionById(req, res, next) {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const session = await ChatSession.findOne({ userId, sessionId }).lean();

    if (!session) {
      res.status(404);
      throw new Error("Chat session not found");
    }

    return res.sendSuccess(
      {
        sessionId: session.sessionId,
        title: session.title,
        messages: session.messages || [],
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      "Chat session retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Rename a chat session title
 * @route PATCH /api/v1/chat/sessions/:sessionId
 * @access Private
 */
async function renameChatSession(req, res, next) {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error("Title is required");
    }

    const session = await ChatSession.findOneAndUpdate(
      { userId, sessionId },
      { title: title.trim() },
      { new: true }
    );

    if (!session) {
      res.status(404);
      throw new Error("Chat session not found");
    }

    return res.sendSuccess(
      { sessionId: session.sessionId, title: session.title },
      "Chat session renamed successfully"
    );
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Delete a specific chat session
 * @route DELETE /api/v1/chat/sessions/:sessionId
 * @access Private
 */
async function deleteChatSession(req, res, next) {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const session = await ChatSession.findOneAndDelete({ userId, sessionId });

    if (!session) {
      res.status(404);
      throw new Error("Chat session not found");
    }

    // Clean up memory history
    messageHistories.delete(sessionId);

    return res.sendSuccess({ sessionId }, "Chat session deleted successfully");
  } catch (error) {
    next(error);
  }
}

/**
 * @desc Clear all chat sessions of the user
 * @route DELETE /api/v1/chat/sessions
 * @access Private
 */
async function clearAllChatSessions(req, res, next) {
  try {
    const userId = req.user.id;
    const sessions = await ChatSession.find({ userId }).select("sessionId");
    
    for (const s of sessions) {
      messageHistories.delete(s.sessionId);
    }

    await ChatSession.deleteMany({ userId });

    return res.sendSuccess(null, "All chat sessions cleared successfully");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  chat,
  getUserChatSessions,
  getChatSessionById,
  renameChatSession,
  deleteChatSession,
  clearAllChatSessions,
};