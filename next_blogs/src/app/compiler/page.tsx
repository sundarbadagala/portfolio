"use client";

import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Container from "@/shared/components/Container";
import { textStyles } from "@/theme/typography";

interface OutputMessage {
  type: "OUTPUT";
  data: string;
}

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [code, setCode] = useState<string>(
    `console.log("Hello World!");`
  );

  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    const handler = (event: MessageEvent<OutputMessage>) => {
      if (event.data?.type === "OUTPUT") {
        setOutput(event.data.data);
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  const runCode = (): void => {
    setOutput("");

    const iframe = iframeRef.current;

    if (!iframe) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <script>
          const logs = [];

          const sendOutput = () => {
            parent.postMessage({
              type: "OUTPUT",
              data: logs.join("\\n")
            }, "*");
          };

          console.log = (...args) => {
            logs.push(
              args
                .map(arg =>
                  typeof arg === "object"
                    ? JSON.stringify(arg, null, 2)
                    : String(arg)
                )
                .join(" ")
            );

            sendOutput();
          };

          console.error = (...args) => {
            logs.push(
              "ERROR: " +
              args.map(arg => String(arg)).join(" ")
            );

            sendOutput();
          };

          try {
            ${code}
          } catch (error) {
            logs.push("ERROR: " + error.message);
            sendOutput();
          }
        </script>
      </body>
      </html>
    `;

    iframe.srcdoc = html;
  };

  return (
    <main className="min-h-screen mt-6">
      <Container>
        <div className="grid h-[70vh] grid-cols-2">
          <div>
            <div className='flex !justify-between items-start'>
          <h3 className={`${textStyles.title} py-2`}>
              JavaScript Compiler
            </h3>
            <button
              onClick={runCode}
              className="btn-primary btn-sm"
            >
              Run Code
            </button>

            </div>
          <Editor
            height="70vh"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value ?? "")}
          />
          
          </div>

          <div className="px-5 text-white">
            

            <h3 className={`${textStyles.title} py-2`}>
              Output
            </h3>

            <pre className="min-h-[60vh] whitespace-pre-wrap bg-black p-4">
              {output || <span className='text-[#838383]'>Click on Run Code to execute code </span>}
            </pre>
          </div>
        </div>

        <iframe
          ref={iframeRef}
          sandbox="allow-scripts"
          style={{ display: "none" }}
        />
      </Container>
    </main>
  );
}