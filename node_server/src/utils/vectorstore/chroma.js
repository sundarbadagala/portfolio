const { CloudClient, ChromaClient } = require("chromadb");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { Document } = require("@langchain/core/documents");
require("dotenv").config();

let clientInstance = null;
let embeddingsInstance = null;

/**
 * Get or initialize Google Generative AI Embeddings
 */
function getEmbeddings() {
  if (!embeddingsInstance) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required for generating embeddings.");
    }
    embeddingsInstance = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey,
    });
  }
  return embeddingsInstance;
}

/**
 * Get or initialize Chroma Client (CloudClient for Chroma Cloud, ChromaClient for self-hosted)
 */
function getChromaClient() {
  if (!clientInstance) {
    const apiKey = process.env.CHROMA_API_KEY;
    const tenant = process.env.CHROMA_TENANT;
    const database = process.env.CHROMA_DATABASE;
    const host = process.env.CHROMA_HOST || process.env.CHROMA_URL;

    if (apiKey) {
      // Connect to Chroma Cloud
      clientInstance = new CloudClient({
        apiKey,
        ...(tenant && { tenant }),
        ...(database && { database }),
      });
    } else {
      // Connect to local / self-hosted Chroma instance
      clientInstance = new ChromaClient({
        ...(host && { path: host }),
        ...(tenant && { tenant }),
        ...(database && { database }),
      });
    }
  }
  return clientInstance;
}

/**
 * Sanitizes collection name to meet ChromaDB collection naming rules:
 * 3-63 characters, must begin and end with alphanumeric, only [a-zA-Z0-9._-]
 */
function sanitizeCollectionName(name) {
  if (!name) return "rag_default_docs";
  const clean = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 55);
  const trimmed = clean.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
  return trimmed.length >= 3 ? `rag_${trimmed}` : `rag_docs_${Date.now()}`;
}

/**
 * Sanitizes metadata for ChromaDB:
 * ChromaDB strictly allows only scalar primitive types (string, number, boolean)
 * or 1D arrays of primitives. Nested objects/dictionaries are flattened or stripped.
 */
function sanitizeMetadata(rawMeta) {
  if (!rawMeta || typeof rawMeta !== "object") return {};
  const clean = {};

  for (const [key, value] of Object.entries(rawMeta)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      clean[key] = value;
    } else if (Array.isArray(value)) {
      if (value.every((v) => typeof v === "string" || typeof v === "number" || typeof v === "boolean")) {
        clean[key] = value;
      } else {
        clean[key] = JSON.stringify(value);
      }
    } else if (typeof value === "object") {
      // Handle nested structures from PDFLoader like loc: { pageNumber: 1 }, pdf: { ... }
      if (key === "loc" && value.pageNumber) {
        clean["pageNumber"] = Number(value.pageNumber);
      } else if (key === "pdf" && value.totalPages) {
        clean["totalPages"] = Number(value.totalPages);
      }
      // Omit arbitrary nested dictionaries to satisfy ChromaDB schema
    }
  }

  return clean;
}

/**
 * Checks whether a collection exists in Chroma
 */
async function hasCollection(collectionName) {
  try {
    const client = getChromaClient();
    const collections = await client.listCollections();
    return collections.some((c) => (typeof c === "string" ? c === collectionName : c.name === collectionName));
  } catch (err) {
    console.error("Error checking collection existence:", err.message);
    return false;
  }
}

/**
 * Deletes a collection from Chroma if it exists
 */
async function deleteCollection(collectionName) {
  try {
    const client = getChromaClient();
    const exists = await hasCollection(collectionName);
    if (exists) {
      await client.deleteCollection({ name: collectionName });
    }
    return true;
  } catch (err) {
    console.warn(`Could not delete collection ${collectionName}:`, err.message);
    return false;
  }
}

/**
 * Creates and populates a Chroma vectorstore with documents
 */
async function createVectorStoreFromDocs(documents, collectionName) {
  const client = getChromaClient();
  const embeddings = getEmbeddings();
  const validName = sanitizeCollectionName(collectionName);

  // Sanitize all document metadatas
  const sanitizedDocs = documents.map((doc) => {
    return new Document({
      pageContent: doc.pageContent,
      metadata: sanitizeMetadata(doc.metadata),
    });
  });

  // If previous collection exists with this name, reset it for fresh document indexing
  await deleteCollection(validName);

  const vectorStore = await Chroma.fromDocuments(sanitizedDocs, embeddings, {
    index: client,
    collectionName: validName,
  });

  return { vectorStore, collectionName: validName };
}

/**
 * Loads an existing Chroma vectorstore by collection name
 */
async function getVectorStore(collectionName) {
  const client = getChromaClient();
  const embeddings = getEmbeddings();
  const validName = sanitizeCollectionName(collectionName);

  const exists = await hasCollection(validName);
  if (!exists) {
    return null;
  }

  return new Chroma(embeddings, {
    index: client,
    collectionName: validName,
  });
}

module.exports = {
  getChromaClient,
  getEmbeddings,
  sanitizeCollectionName,
  sanitizeMetadata,
  hasCollection,
  deleteCollection,
  createVectorStoreFromDocs,
  getVectorStore,
};
