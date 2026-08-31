import type { Metadata } from "next";
import Page from "@/features/ai/components/chat";
import { constructMetadata, getSoftwareAppSchema } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "AI Assistant Chat",
  description:
    "Interactive AI chat assistant powered by Gemini. Ask coding questions, get architectural advice, debug issues, and generate solutions.",
  canonical: "/ai/chat",
  keywords: [
    "AI Chat",
    "Sundar AI",
    "Gemini AI Assistant",
    "Coding Assistant",
    "Interactive AI",
    "Programming Help",
  ],
});

export default function ChatPage() {
  const softwareSchema = getSoftwareAppSchema(
    "Sundar AI Assistant",
    "Intelligent conversational assistant for programming and general queries.",
    "/ai/chat",
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