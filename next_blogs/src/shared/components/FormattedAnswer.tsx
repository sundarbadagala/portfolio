import React from "react";
import CodeBlock from "./CodeBlock";

interface FormattedAnswerProps {
  content: string;
}

const formatBoldText = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\`(.*?)\`/g, "<code class='px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-primary-500 font-mono text-xs'>$1</code>");
};

export default function FormattedAnswer({ content }: FormattedAnswerProps) {
  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  if (isHtml) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: content }} 
        className="prose prose-neutral dark:prose-invert max-w-none text-left text-neutral-600 dark:text-neutral-300 text-sm space-y-4" 
      />
    );
  }

  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-left text-neutral-600 dark:text-neutral-300 text-sm space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const code = match ? match[2].trim() : part.slice(3, -3).trim();
          const language = match ? match[1] : "javascript";

          return (
            <CodeBlock key={index} code={code} language={language} />
          );
        }

        return (
          <div key={index} className="space-y-2">
            {part.split("\n").map((line, lIdx) => {
              if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                const listContent = line.trim().substring(2);
                return (
                  <ul key={lIdx} className="list-disc pl-5 space-y-1 my-1">
                    <li className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatBoldText(listContent) }} />
                  </ul>
                );
              }
              if (line.trim().startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mt-4 mb-2">
                    {line.trim().substring(4)}
                  </h4>
                );
              }
              if (line.trim().startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="text-base font-bold text-neutral-900 dark:text-white mt-4 mb-2">
                    {line.trim().substring(3)}
                  </h3>
                );
              }
              if (line.trim().startsWith("1. ") || line.trim().startsWith("2. ") || line.trim().startsWith("3. ")) {
                return (
                  <ol key={lIdx} className="list-decimal pl-5 space-y-1 my-1">
                    <li className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatBoldText(line.trim().substring(3)) }} />
                  </ol>
                );
              }
              if (!line.trim()) return null;
              return (
                <p key={lIdx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatBoldText(line) }} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
