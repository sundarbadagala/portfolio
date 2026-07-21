"use client";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Container from "@/shared/components/Container";
import { getChat } from "@/features/chat/services";
import MarkdownRenderer from "@/shared/components/MarkdownRenderer";
import Modal from "@/shared/components/Modal";
import { GEN_AI_NOTE } from "@/shared/helper/constants";

interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [messages]);

  const sendMessage = async () => {
    const question = input.trim();

    if (!question) return;

    setInput("");
    setLoading(true);

    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      },
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    try {
      await getChat({
        content: question,
        onChunk: (response) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                  ...message,
                  content: response,
                }
                : message,
            ),
          );
        },
      });
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
              ...message,
              content: "Something went wrong. Please try again.",
            }
            : message,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuery = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    await sendMessage();
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <main className="h-[90vh] overflow-hidden">
      <Container className="h-full">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} header={
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{GEN_AI_NOTE.header}</span>
          </div>
        }>
          <p>
            {GEN_AI_NOTE.note}
          </p>
          <ul className="list-disc list-outside mt-2 text-sm" >
            {GEN_AI_NOTE.note_points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </Modal>
        <div
          className={`h-full flex flex-col ${messages.length ? "justify-between py-6" : "justify-center"
            }`}
        >
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto pb-8 scroll-smooth">
              <div className="mx-auto max-w-4xl space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex transition-all duration-300 ${message.role === "user"
                      ? "!justify-end"
                      : "!justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap break-words shadow-sm ${message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-black"
                        }`}
                    >
                      <MarkdownRenderer content={message.content} />

                      {loading &&
                        message.role === "assistant" &&
                        !message.content && (
                          <span className="ml-1 animate-pulse">▋</span>
                        )}
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <div
            className={`w-full ${messages.length ? "max-w-4xl mx-auto" : "max-w-3xl mx-auto"
              }`}
          >
            {!messages.length && (
              <h1 className="mb-8 text-center text-4xl font-semibold">
                How can I help you today?
              </h1>
            )}

            <form
              onSubmit={handleSendQuery}
              className="
                flex
                items-end
                gap-3
                rounded-3xl
                border
                border-gray-300
                bg-white
                p-3
                shadow-sm
                relative
              "
            >
              <textarea
                value={input}
                rows={1}
                placeholder="Message AI..."
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="
                  flex-1
                  resize-none
                  overflow-hidden
                  bg-transparent
                  outline-none
                  max-h-40
                  text-black
                "
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  absolute
                  right-1
                  top-1
                "
              >
                ↑
              </button>
            </form>

            <p className="mt-2 text-center text-xs text-gray-500">
              Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
