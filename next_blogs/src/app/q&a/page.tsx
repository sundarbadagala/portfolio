import type { Metadata } from "next";
import QuestionsHub from "@/features/q&a/components/QuestionsHub";
import { constructMetadata, getBreadcrumbSchema } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Coding & Engineering Interview Q&A Hub",
  description:
    "Comprehensive interview questions, answers, coding solutions, and system architecture problems categorized by topic and difficulty level.",
  canonical: "/q&a",
  keywords: [
    "Interview Questions",
    "Coding Interview Preparation",
    "JavaScript Questions",
    "React Q&A",
    "Node.js Interview",
    "Data Structures",
    "Algorithms",
    "System Design",
  ],
});

export default function QnAPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/blogs" },
    { name: "Q&A Knowledge Hub", path: "/q&a" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <QuestionsHub />
    </>
  );
}