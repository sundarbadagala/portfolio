const { ChatOpenRouter } = require("@langchain/openrouter");
require('dotenv').config()

const model = new ChatOpenRouter({
    model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    temperature: 0,
    apiKey: process.env.OPENROUTER_API_KEY,
});

module.exports = { model };

