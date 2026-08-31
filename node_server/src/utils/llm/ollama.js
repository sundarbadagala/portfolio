const { ChatOllama } = require('@langchain/ollama')

const model = new ChatOllama({
    model: "llama3.2:1b",
    temperature: 0
})

module.exports = { model }