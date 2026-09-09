"use client";

import React, { ReactNode } from "react";
import { PanelLeft, Info } from "lucide-react";

interface ChatMobileHeaderProps {
  title: string;
  badge?: string | number;
  icon?: ReactNode;
  onToggleSidebar: () => void;
  onHoverSidebar?: () => void;
  onOpenInfo?: () => void;
  infoTitle?: string;
  extraActions?: ReactNode;
}

export default function ChatMobileHeader({
  title,
  badge,
  icon,
  onToggleSidebar,
  onHoverSidebar,
  onOpenInfo,
  infoTitle = "Guidelines & Information",
  extraActions,
}: ChatMobileHeaderProps) {
  return (
    <div className="flex lg:!hidden items-center justify-between px-3 py-2 border-b border-[var(--foreground)] bg-[var(--background)] shrink-0">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          onMouseEnter={onHoverSidebar}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[var(--foreground)] text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all shadow-xs"
          aria-label={`Open ${title}`}
        >
          {icon || <PanelLeft className="h-4 w-4 text-blue-500" />}
          <span>{title}</span>
          {badge !== undefined && badge !== null && badge !== "" && (
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--foreground)] text-[var(--background)] font-semibold">
              {badge}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {extraActions}
        {onOpenInfo && (
          <button
            type="button"
            onClick={onOpenInfo}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition"
            title={infoTitle}
            aria-label={infoTitle}
          >
            <Info className="h-4 w-4 text-blue-500" />
          </button>
        )}
      </div>
    </div>
  );
}
