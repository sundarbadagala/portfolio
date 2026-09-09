"use client";

import React, { ReactNode } from "react";
import { PanelLeftClose } from "lucide-react";

interface ChatSidebarProps {
  isExpandedMobile: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onCloseMobile: () => void;
  headerAction?: ReactNode;
  searchBar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function ChatSidebar({
  isExpandedMobile,
  onMouseEnter,
  onMouseLeave,
  onCloseMobile,
  headerAction,
  searchBar,
  children,
  footer,
  className = "",
}: ChatSidebarProps) {
  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute lg:relative inset-y-0 left-0 z-40 w-72 sm:w-80 lg:w-80 flex flex-col h-full bg-[var(--background)] border-r border-[var(--foreground)] shrink-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
        isExpandedMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${className}`}
    >
      {/* Sidebar Header */}
      {headerAction && (
        <div className="p-3 sm:p-4 border-b border-[var(--foreground)] flex items-center gap-2">
          <div className="flex-1 min-w-0">{headerAction}</div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:!hidden p-2.5 rounded-xl border border-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 text-xs transition shrink-0"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search Bar Slot */}
      {searchBar}

      {/* Main Sidebar Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-sm" data-lenis-prevent>
        {children}
      </div>

      {/* Sidebar Footer */}
      {footer && (
        <div className="p-3 border-t border-[var(--foreground)] flex items-center justify-between text-xs">
          {footer}
        </div>
      )}
    </aside>
  );
}
