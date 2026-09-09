const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { HumanMessage, AIMessage, SystemMessage, ToolMessage } = require("@langchain/core/messages");
const crypto = require("crypto");
const { model } = require("../utils/llm");
const { webSearchTool, searchWeb } = require("../utils/tools/webSearch");
const { dateTimeTool, getCurrentDateTime } = require("../utils/tools/dateTime");
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

function buildSystemPrompt() {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZoneName: "short",
  });
  const utcFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZoneName: "short",
  });

  return `You are Sundar AI, a helpful, intelligent, and friendly AI assistant created by Sundar. You assist users with programming, learning, problem-solving, productivity, and general questions accurately and concisely.

Real-Time Clock & Reference Date:
- Current UTC Time: ${utcFormatter.format(now)} (${now.toISOString()})
- Current India Standard Time (IST / Hyderabad / New Delhi / Mumbai / Bengaluru): ${istFormatter.format(now)}
- Current Unix Timestamp: ${now.getTime()}

Available Tools:
1. 'get_current_time': Retrieve the exact current time, date, day of week, and timezone for any city, country, or timezone worldwide (e.g. Hyderabad, New York, London, Tokyo, UTC).
2. 'web_search': Search the live web for active job openings, recent news, latest tech documentation, company updates, or current web data.

Instructions:
- For questions about current time, today's date, day of week, or time differences in any location (such as "what is the current time in Hyderabad?"): Use the exact real-time clock reference above or invoke 'get_current_time'. Provide the exact accurate time, date, and timezone.
- For search-grounded or job queries, format findings clearly with structured Markdown (bullet points, clear headings, key requirements, salary/experience ranges if available, and direct links/platforms).
- NEVER output raw tool syntax or tags like <|tool_call_start|> or [google(...)] to the user.`;
}

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
    const history = await getMessageHistory(sessionId, userId);
    const pastMessages = await history.getMessages();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();
    headersSent = true;

    // Prepare message sequence for model
    const messagesForModel = [
      new SystemMessage(buildSystemPrompt()),
      ...pastMessages.slice(-MAX_HISTORY_MESSAGES),
      new HumanMessage(inputContent),
    ];

    let fullAssistantResponse = "";

    // Check if tool binding is supported
    const availableTools = [webSearchTool, dateTimeTool];
    let boundModel = model;
    if (typeof model.bindTools === "function") {
      try {
        boundModel = model.bindTools(availableTools);
      } catch (bindErr) {
        console.warn("Could not bind tools to model:", bindErr.message);
      }
    }

    try {
      const initialResponse = await boundModel.invoke(messagesForModel);

      // 1. Check for native tool calls
      if (initialResponse.tool_calls && initialResponse.tool_calls.length > 0) {
        for (const toolCall of initialResponse.tool_calls) {
          let toolResult = "";
          if (
            toolCall.name === "get_current_time" ||
            toolCall.name.includes("time") ||
            toolCall.name.includes("clock")
          ) {
            const locArg = toolCall.args?.location || inputContent;
            const timeData = getCurrentDateTime(locArg);
            toolResult = JSON.stringify(timeData, null, 2);
          } else if (
            toolCall.name === "web_search" ||
            toolCall.name.includes("search") ||
            toolCall.name.includes("google")
          ) {
            const queryArg = toolCall.args?.query || toolCall.args?.q || inputContent;
            const searchResults = await searchWeb(queryArg, 5);
            toolResult = JSON.stringify(searchResults, null, 2);
          } else {
            toolResult = "Tool not recognized.";
          }

          messagesForModel.push(
            new AIMessage({
              content: initialResponse.content || "",
              tool_calls: [toolCall],
            })
          );
          messagesForModel.push(
            new ToolMessage({
              tool_call_id: toolCall.id || `call_${toolCall.name}`,
              content: toolResult,
            })
          );
        }
      } else if (typeof initialResponse.content === "string") {
        // 2. Check if model emitted raw tool syntax in content
        const toolSyntaxMatch = initialResponse.content.match(
          /(?:<\|tool_call_start\|>)?\[?(?:google|web_search|get_current_time)\(query=['"]([^'"]+)['"]\)?\]?(?:<\|tool_call_end\|>)?/i
        );

        if (toolSyntaxMatch && toolSyntaxMatch[1]) {
          const queryArg = toolSyntaxMatch[1];
          const searchResults = await searchWeb(queryArg, 5);

          messagesForModel.push(
            new HumanMessage(
              `Here are the latest live web search results for "${queryArg}":\n\n${JSON.stringify(
                searchResults,
                null,
                2
              )}\n\nPlease synthesize a clear, comprehensive, and well-structured response based on these search results without mentioning tool tags.`
            )
          );
        } else {
          // 3. Proactive time check for explicit date/time queries
          const isTimeQuery =
            /\b(current\s+time|what\s+time|today'?s\s+date|current\s+date|time\s+in|time\s+now|date\s+today)\b/i.test(
              inputContent
            );
          if (isTimeQuery) {
            const timeData = getCurrentDateTime(inputContent);
            messagesForModel.push(
              new HumanMessage(
                `[Verified Clock Lookup: ${JSON.stringify(
                  timeData
                )}]\nPlease state the exact current time and date clearly from this verified clock data.`
              )
            );
          }
        }
      }
    } catch (invokeErr) {
      console.warn("Initial tool check note:", invokeErr.message);
    }

    // Stream LLM response
    const stream = await model.stream(messagesForModel);

    for await (const chunk of stream) {
      let textChunk = "";
      if (typeof chunk === "string") {
        textChunk = chunk;
      } else if (chunk && typeof chunk.content === "string") {
        textChunk = chunk.content;
      } else if (Array.isArray(chunk?.content)) {
        textChunk = chunk.content
          .map((c) => (typeof c === "string" ? c : c?.text || ""))
          .join("");
      }

      // Sanitize out any stray tool call markup
      textChunk = textChunk
        .replace(/<\|tool_call_start\|>[\s\S]*?<\|tool_call_end\|>/gi, "")
        .replace(/<\|tool_call_start\|>/gi, "")
        .replace(/<\|tool_call_end\|>/gi, "");

      if (textChunk) {
        fullAssistantResponse += textChunk;
        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content: textChunk,
          })}\n\n`
        );
      }
    }

    // Update in-memory history
    await history.addMessage(new HumanMessage(inputContent));
    await history.addMessage(new AIMessage(fullAssistantResponse));

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