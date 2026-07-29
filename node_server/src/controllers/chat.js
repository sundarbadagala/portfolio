const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ---- Safety / cost-control limits (server is the source of truth, never trust client) ----
const MAX_HISTORY_ITEMS = 12; // last 12 messages (~6 user+assistant exchanges)
const MAX_MESSAGE_LENGTH = 4000; // per-message character cap
const MAX_CONTENT_LENGTH = 4000; // current prompt character cap

const customQuestions = [
  {
    keywords: [
      "what is your name",
      "your name",
      "tell me your name",
      "who are you",
    ],
    response:
      "I am Sundar AI, your personal AI assistant. How can I help you today?",
  },
  {
    keywords: [
      "who created you",
      "your creator",
      "who made you",
      "who built you",
    ],
    response: "I was created by Sundar using React, Node.js, and Gemini AI.",
  },
  {
    keywords: [
      "tell me about yourself",
      "about yourself",
      "introduce yourself",
    ],
    response:
      "I am Sundar AI, an intelligent assistant designed to help with programming, learning, problem-solving, and productivity tasks.",
  },
  {
    keywords: ["what can you do", "your capabilities", "how can you help me"],
    response:
      "I can help with coding, debugging, frontend development, backend development, interview preparation, learning new technologies, content creation, and much more.",
  },
];

async function streamResponse(res, text) {
  for (const char of text) {
    res.write(
      `data: ${JSON.stringify({
        type: "chunk",
        content: char,
      })}\n\n`,
    );

    await new Promise((resolve) => setTimeout(resolve, 15));
  }

  res.write(
    `data: ${JSON.stringify({
      type: "done",
    })}\n\n`,
  );

  res.end();
}

/**
 * Sanitizes and caps the incoming history array so a malicious or buggy
 * client can never blow up token costs or crash the server.
 */
function buildSafeContents(history, currentContent) {
  const contents = [];

  if (Array.isArray(history)) {
    const safeHistory = history
      .filter(
        (msg) =>
          msg &&
          typeof msg.content === "string" &&
          msg.content.trim().length > 0 &&
          (msg.role === "user" || msg.role === "assistant"),
      )
      .slice(-MAX_HISTORY_ITEMS); // server-side cap regardless of what client sent

    safeHistory.forEach((msg) => {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content.slice(0, MAX_MESSAGE_LENGTH) }],
      });
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: currentContent }],
  });

  return contents;
}

async function chat(req, res, next) {
  let headersSent = false;
  try {
    const { content, history } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      res.status(400);
      throw new Error("Chat content is required");
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      res.status(400);
      throw new Error(
        `Message too long. Max ${MAX_CONTENT_LENGTH} characters allowed.`,
      );
    }

    if (history !== undefined && !Array.isArray(history)) {
      res.status(400);
      throw new Error("History must be an array");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();
    headersSent = true;

    const question = content.toLowerCase().trim();

    const matchedQuestion = customQuestions.find((item) =>
      item.keywords.some((keyword) => question.includes(keyword)),
    );

    if (matchedQuestion) {
      return await streamResponse(res, matchedQuestion.response);
    }

    // Build conversation history in Gemini contents format (validated + capped)
    const contents = buildSafeContents(history, content);

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    for await (const chunk of stream) {
      const text = chunk.text || "";

      res.write(
        `data: ${JSON.stringify({
          type: "chunk",
          content: text,
        })}\n\n`,
      );
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