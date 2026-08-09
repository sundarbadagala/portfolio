"use client";

import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 w-full max-h-[75vh] bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 rounded-t-3xl p-6 z-50 flex flex-col gap-6 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <span className="font-semibold text-base flex items-center gap-2 text-neutral-850 dark:text-neutral-100">
            {title}
          </span>
          <button
            onClick={onClose}
            className="p-2 opacity-70 hover:opacity-100 transition-opacity text-neutral-800 dark:text-neutral-200"
            aria-label="Close bottom sheet"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="overflow-y-auto pb-8">
          {children}
        </div>
      </div>
    </>
  );
}
