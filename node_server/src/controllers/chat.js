const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function chat(req, res, next) {
  try {
    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: "hello",
    // });

    // return res.sendSuccess(response.text);
    return res.sendSuccess("Hello! How can I help you today?");
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
