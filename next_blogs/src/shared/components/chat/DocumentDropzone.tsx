"use client";

import React, { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

interface DocumentDropzoneProps {
  onFileSelect: (file: File) => void;
  onTriggerUpload?: () => void;
  isUploading?: boolean;
  uploadingTitle?: string;
  uploadingSubtitle?: string;
  title?: string;
  subtitle?: string;
  hint?: string;
  accept?: string;
  className?: string;
}

export default function DocumentDropzone({
  onFileSelect,
  onTriggerUpload,
  isUploading = false,
  uploadingTitle = "Processing PDF Document",
  uploadingSubtitle = "Extracting content & building semantic index...",
  title = "Upload your PDF Document",
  subtitle = "Drag & drop your PDF here or click to browse",
  hint = "PDF only • Max 20MB",
  accept = ".pdf",
  className = "",
}: DocumentDropzoneProps) {
  const localInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    if (isUploading) return;
    if (onTriggerUpload) {
      onTriggerUpload();
    } else {
      localInputRef.current?.click();
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    e.target.value = "";
  };

  return (
    <div className={`h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-10 px-4 ${className}`}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full group relative cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-12 transition-all duration-300 ${
          isDragOver
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]"
            : "border-[var(--foreground)]/20 hover:border-blue-500/80 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
                {uploadingTitle}
              </h3>
              <p className="mt-1 text-xs sm:text-sm opacity-60 animate-pulse">
                {uploadingSubtitle}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Upload className="h-7 w-7" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)]">
              {title}
            </h2>

            <p className="mt-2 text-xs sm:text-sm opacity-60 max-w-sm">
              {subtitle}
            </p>

            <div className="mt-6 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 py-2 px-5 rounded-xl font-medium text-xs sm:text-sm bg-[var(--foreground)] text-[var(--background)] group-hover:opacity-90 transition-all shadow-sm">
                <FileText className="h-4 w-4" />
                <span>Select PDF File</span>
              </span>
            </div>

            {hint && (
              <p className="mt-4 text-[11px] opacity-40">
                {hint}
              </p>
            )}
          </div>
        )}

        {!onTriggerUpload && (
          <input
            ref={localInputRef}
            hidden
            type="file"
            accept={accept}
            disabled={isUploading}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}
