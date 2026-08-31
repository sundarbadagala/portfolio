import type { Metadata } from "next";
import Page from "@/features/ai/components/rag";
import { constructMetadata, getSoftwareAppSchema } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "AI Document Search & RAG",
  description:
    "Upload PDF documents and chat interactively with your content using ChromaDB vector store, semantic embeddings, and Gemini RAG pipeline.",
  canonical: "/ai/rag",
  keywords: [
    "AI Document Search",
    "RAG",
    "Retrieval Augmented Generation",
    "ChromaDB",
    "PDF Search AI",
    "LangChain RAG",
  ],
});

export default function RagPage() {
  const softwareSchema = getSoftwareAppSchema(
    "AI Document RAG Assistant",
    "Semantic search and conversational document Q&A powered by ChromaDB and LangChain.",
    "/ai/rag",
    "BusinessApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Page />
    </>
  );
}