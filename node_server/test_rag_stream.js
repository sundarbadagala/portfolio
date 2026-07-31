const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require("./node_modules/@langchain/google-genai");
const { MemoryVectorStore } = require("./node_modules/@langchain/classic/vectorstores/memory");
const { createStuffDocumentsChain } = require("./node_modules/@langchain/classic/chains/combine_documents");
const { ChatPromptTemplate, MessagesPlaceholder } = require("./node_modules/@langchain/core/prompts");
const { AIMessage, HumanMessage } = require("./node_modules/@langchain/core/messages");
const { RunnableBranch, RunnableSequence, RunnablePassthrough } = require("./node_modules/@langchain/core/runnables");
const { StringOutputParser } = require("./node_modules/@langchain/core/output_parsers");
require("dotenv").config();

async function runTest() {
  console.log("Setting up LLM and Embeddings...");
  const model = new ChatGoogleGenerativeAI({ model: "gemini-2.5-flash", apiKey: process.env.GEMINI_API_KEY });
  const embeddings = new GoogleGenerativeAIEmbeddings({ model: "gemini-embedding-001", apiKey: process.env.GEMINI_API_KEY });

  console.log("Creating memory vector store...");
  const vectorStore = await MemoryVectorStore.fromTexts(
    ["LangChain is a framework for building applications with LLMs.", "Gemini 2.5 Flash is a fast model from Google."],
    [{}, {}],
    embeddings
  );

  const retriever = vectorStore.asRetriever({ k: 1 });

  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", "Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is."],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const historyAwareRetriever = RunnableBranch.from([
    [
      (input) => !input.chat_history || input.chat_history.length === 0,
      RunnableSequence.from([(input) => input.input, retriever])
    ],
    RunnableSequence.from([
      contextualizeQPrompt,
      model,
      new StringOutputParser(),
      retriever
    ])
  ]);

  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", "Answer the user's question based ONLY on the provided context below. If you don't know the answer, just say \"I couldn't find the answer in the document.\"\n\nContext:\n{context}"],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const combineDocsChain = await createStuffDocumentsChain({ llm: model, prompt: qaPrompt });
  const retrievalChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: historyAwareRetriever.withConfig({ runName: "retrieve_documents" }),
      chat_history: (input) => input.chat_history ?? []
    }),
    RunnablePassthrough.assign({
      answer: combineDocsChain
    })
  ]).withConfig({ runName: "retrieval_chain" });

  console.log("Streaming retrieval chain...");
  const stream = await retrievalChain.stream({
    input: "What is Gemini 2.5 Flash?",
    chat_history: [],
  });

  for await (const chunk of stream) {
    console.log("Chunk received:", typeof chunk, JSON.stringify(chunk));
  }
}

runTest().catch(console.error);
