"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import MarkdownRenderer from "@/shared/components/MarkdownRenderer";

export interface IDisplayChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageListProps {
  messages: IDisplayChatMessage[];
  loading?: boolean;
  loadingHistory?: boolean;
  loadingHistoryText?: string;
  emptyState?: ReactNode;
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  welcomeIcon?: ReactNode;
  assistantAvatar?: ReactNode;
  headerBanner?: ReactNode;
  className?: string;
}

export default function ChatMessageList({
  messages,
  loading = false,
  loadingHistory = false,
  loadingHistoryText = "Loading conversation...",
  emptyState,
  welcomeTitle = "How can I help you today?",
  welcomeSubtitle,
  welcomeIcon,
  assistantAvatar,
  headerBanner,
  className = "",
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages or loading updates
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages, loading]);

  return (
    <div
      className={`flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6 ${className}`}
      data-lenis-prevent
    >
      {/* Optional Top Header Banner (e.g. active document bar) */}
      {headerBanner}

      {loadingHistory ? (
        <div className="h-full flex flex-col items-center justify-center py-24 space-y-3 opacity-60">
          <Loader2 className="h-7 w-7 animate-spin" />
          <p className="text-sm">{loadingHistoryText}</p>
        </div>
      ) : messages.length === 0 ? (
        emptyState ? (
          emptyState
        ) : (
          /* Clean Empty / Welcome State */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 sm:py-16 px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center mb-4 sm:mb-5 shadow-lg shadow-blue-500/20">
              {welcomeIcon || <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              {welcomeTitle}
            </h1>
            {welcomeSubtitle && (
              <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-neutral-400 max-w-md">
                {welcomeSubtitle}
              </p>
            )}
          </div>
        )
      ) : (
        /* Messages List */
        <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-5">
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id || index}
                className={`w-full !flex items-start gap-2.5 sm:gap-3 transition-all ${
                  isUser ? "!justify-end" : "!justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    {assistantAvatar || <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5" />}
                  </div>
                )}
                <div
                  className={`max-w-[88%] sm:max-w-[85%] md:max-w-[78%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-black/5 dark:bg-neutral-800 text-[var(--foreground)] rounded-tl-none border border-[var(--foreground)]"
                  }`}
                >
                  <MarkdownRenderer content={message.content} />
                  {loading && !isUser && !message.content && (
                    <div className="flex items-center gap-1.5 py-1 text-xs opacity-60 animate-pulse">
                      <span>Thinking</span>
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce [animation-delay:0.2s]">●</span>
                      <span className="animate-bounce [animation-delay:0.4s]">●</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
