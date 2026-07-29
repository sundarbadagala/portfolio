const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

async function chat(req, res, next) {
  let headersSent = false;
  try {
    const { content } = req.body;

    if (!content) {
      res.status(400);
      throw new Error("Chat content is required");
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

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: content,
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
        if (err.status === 429 || err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED")) {
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

module.exports = { chat };
