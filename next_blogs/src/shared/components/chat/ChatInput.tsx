"use client";

import React, { ChangeEvent, KeyboardEvent, FormEvent, ReactNode, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  extraActions?: ReactNode;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  maxHeight?: number;
  className?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask anything...",
  disabled = false,
  loading = false,
  extraActions,
  textareaRef: externalRef,
  maxHeight = 160,
  className = "",
}: ChatInputProps) {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const activeRef = externalRef || localRef;

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (activeRef.current) {
      activeRef.current.style.height = "auto";
      activeRef.current.style.height = `${Math.min(activeRef.current.scrollHeight, maxHeight)}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !loading && value.trim()) {
        onSubmit();
        if (activeRef.current) {
          activeRef.current.style.height = "auto";
        }
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!disabled && !loading && value.trim()) {
      onSubmit();
      if (activeRef.current) {
        activeRef.current.style.height = "auto";
      }
    }
  };

  // Reset height when value is cleared
  useEffect(() => {
    if (!value && activeRef.current) {
      activeRef.current.style.height = "auto";
    }
  }, [value, activeRef]);

  return (
    <div className={`p-2.5 sm:p-4 border-t border-[var(--foreground)] bg-[var(--background)] shrink-0 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 p-1.5 sm:p-2 rounded-2xl border border-[var(--foreground)] bg-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm"
        >
          {extraActions}

          <textarea
            ref={activeRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            rows={1}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            className="flex-1 max-h-36 resize-none bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none text-[var(--foreground)] placeholder:opacity-40 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!value.trim() || disabled || loading}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
