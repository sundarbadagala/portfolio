const { ChatOpenRouter } = require("@langchain/openrouter");
require('dotenv').config();

const model = new ChatOpenRouter({
    model: process.env.OPENROUTER_MODEL || 'liquid/lfm-2.5-2.6b:free',
    temperature: 0,
    apiKey: process.env.OPENROUTER_API_KEY,
});

module.exports = { model };
