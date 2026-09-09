"use client";

import React, { ReactNode } from "react";
import Container from "@/shared/components/Container";

interface ChatLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isSidebarHovered?: boolean;
  setIsSidebarHovered?: (hovered: boolean) => void;
  className?: string;
}

export default function ChatLayout({
  sidebar,
  children,
  isSidebarOpen,
  setIsSidebarOpen,
  isSidebarHovered = false,
  setIsSidebarHovered,
  className = "",
}: ChatLayoutProps) {
  const isExpandedMobile = isSidebarOpen || isSidebarHovered;

  return (
    <div className={`py-2 sm:py-4 md:py-6 h-[calc(100dvh-70px)] md:h-[calc(100vh-80px)] overflow-hidden ${className}`}>
      <Container className="h-full">
        <div className="relative flex h-full w-full overflow-hidden bg-[var(--background)] rounded-2xl md:rounded-3xl border border-[var(--foreground)] shadow-sm">
          {/* Mobile/Tablet Edge Hover Sensor Strip */}
          <div
            onMouseEnter={() => setIsSidebarHovered?.(true)}
            className="absolute inset-y-0 left-0 w-3 z-30 lg:!hidden cursor-pointer"
            aria-hidden="true"
          />

          {/* Mobile/Tablet Backdrop Overlay */}
          <div
            onClick={() => {
              setIsSidebarOpen(false);
              setIsSidebarHovered?.(false);
            }}
            className={`absolute inset-0 bg-black/40 backdrop-blur-xs z-30 lg:!hidden transition-opacity duration-300 ${
              isExpandedMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Sidebar */}
          {sidebar}

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col h-full min-w-0 relative">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}
