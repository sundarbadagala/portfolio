"use client";
import React, { useState } from "react";

interface AccordionItemProps {
  id: string | number;
  title: React.ReactNode;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isHtml?: boolean;
}

export function AccordionItem({ title, content, isOpen, onToggle, isHtml = false }: AccordionItemProps) {
  return (
    <div className={`border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all duration-200 overflow-hidden mb-4 ${isOpen ? 'bg-neutral-100/70 dark:bg-neutral-800/60 border-neutral-300 dark:border-neutral-700' : 'bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/30'}`}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex !justify-start items-center !text-left font-bold text-gray-700 dark:text-gray-200 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-semibold">?</span>
          {isHtml && typeof title === "string" ? (
            <span dangerouslySetInnerHTML={{ __html: title }} className="!text-left" />
          ) : (
            <span className="text-left">{title}</span>
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 animate-fadeIn">
          {isHtml && typeof content === "string" ? (
            <div
              className="prose prose-neutral dark:prose-invert text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-none text-left"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 text-left">
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  items: {
    id: string | number;
    title: React.ReactNode;
    content: React.ReactNode;
  }[];
  isHtml?: boolean;
}

export function Accordion({ items, isHtml = false }: AccordionProps) {
  const [openId, setOpenId] = useState<string | number | null>(null);

  return (
    <div className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          isHtml={isHtml}
        />
      ))}
    </div>
  );
}
