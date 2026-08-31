import type { Metadata } from "next";
import Compiler from "@/features/compiler/components/Compiler";
import { constructMetadata, getSoftwareAppSchema } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Online JavaScript Compiler & Sandbox",
  description:
    "Run and test modern JavaScript ES6+ code online with real-time console output, Monaco code editor, and secure sandboxed execution.",
  canonical: "/compiler",
  keywords: [
    "JavaScript Compiler",
    "JS Sandbox",
    "Online Code Editor",
    "Run JavaScript Online",
    "Monaco Editor JS",
    "Web Development Tools",
  ],
});

export default function CompilerPage() {
  const compilerSchema = getSoftwareAppSchema(
    "Online JavaScript Compiler",
    "Interactive browser-based JavaScript sandbox and code executor.",
    "/compiler",
    "DeveloperApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compilerSchema) }}
      />
      <Compiler />
    </>
  );
}
