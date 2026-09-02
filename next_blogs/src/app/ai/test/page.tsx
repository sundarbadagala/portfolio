import type { Metadata } from "next";
import { Test } from "@/features/ai/components";
import { constructMetadata, getSoftwareAppSchema } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "AI Online Tests & Skill Assessment",
  description:
    "Test and benchmark your frontend and backend skills with adaptive AI-generated assessments across JavaScript, React.js, Next.js, CSS, HTML, TypeScript, and Node.js.",
  canonical: "/ai/test",
  keywords: [
    "AI Online Test",
    "Technical Assessment",
    "JavaScript Quiz",
    "React Assessment",
    "Next.js Test",
    "CSS Assessment",
    "Coding Skills Test",
    "AI Quiz Generator",
  ],
});

export default function AiTestPage() {
  const softwareSchema = getSoftwareAppSchema(
    "Sundar AI Technical Assessment",
    "Adaptive AI-powered online testing platform for developers to evaluate and level up technical skills.",
    "/ai/test",
    "EducationalApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Test />
    </>
  );
}
