const { ChatGoogleGenerativeAI } = require('@langchain/google-genai')
require('dotenv').config()

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0
})

module.exports = { model }
