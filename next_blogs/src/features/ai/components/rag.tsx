"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Trash,
  Info,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Modal from "@/shared/components/Modal";
import { RAG_PDF_NOTE } from "@/shared/helper/constants";
import { postPdf, getRagChat } from "@/features/ai/services";
import type { IChatHistoryItem } from "@/features/ai/types";
import {
  ChatLayout,
  ChatSidebar,
  ChatMobileHeader,
  ChatMessageList,
  ChatInput,
  DocumentDropzone,
} from "@/shared/components/chat";

export default function RagPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [chunksCount, setChunksCount] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sidebar responsive & hover state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<IChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Combined sidebar expanded state for mobile/tab
  const isExpandedMobile = isSidebarOpen || isSidebarHovered;

  // 1. Handle File Upload
  const handleFileUpload = async (selectedFile: File) => {
    setFileName(selectedFile.name);
    setIsUploading(true);
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setChatHistory([]);

    try {
      const data = await postPdf(selectedFile, newSessionId);
      setUploaded(true);
      setChunksCount(data.chunks || null);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error) {
      console.error("error::", error);
      const errMsg = error instanceof Error ? error.message : String(error);
      alert(`Upload failed: ${errMsg}`);
      setFileName("");
      setUploaded(false);
      setChunksCount(null);
    } finally {
      setIsUploading(false);
    }
  };

  // 2. Handle Ask Question
  const handleAskQuestion = async () => {
    if (!question.trim() || !uploaded || isLoading) return;

    const currentQuestion = question.trim();
    const assistantId = crypto.randomUUID();
    const newHistory: IChatHistoryItem[] = [
      ...chatHistory,
      { role: "user", content: currentQuestion },
      { id: assistantId, role: "assistant", content: "" },
    ];
    setChatHistory(newHistory);
    setQuestion("");
    setIsLoading(true);

    try {
      await getRagChat({
        content: currentQuestion,
        sessionId,
        onChunk: (response) => {
          setChatHistory((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: response } : msg
            )
          );
        },
      });
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : String(error);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: `Something went wrong while retrieving answer: ${errMsg}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Clear Chat and Trigger New PDF Select
  const handleResetDocument = () => {
    setUploaded(false);
    setFileName("");
    setChunksCount(null);
    setChatHistory([]);
    setQuestion("");
    setSessionId(crypto.randomUUID());
  };

  const handleOpenFileDialog = () => {
    setIsSidebarOpen(false);
    setIsSidebarHovered(false);
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden Permanent File Input for Document Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        hidden
        disabled={isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
          e.target.value = "";
        }}
      />

      {/* Information / Guidelines Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-semibold">{RAG_PDF_NOTE.header}</span>
          </div>
        }
      >
        <p>{RAG_PDF_NOTE.note}</p>
        <ul className="list-disc list-outside mt-2 text-sm space-y-1">
          {RAG_PDF_NOTE.note_points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </Modal>

      <ChatLayout
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarHovered={isSidebarHovered}
        setIsSidebarHovered={setIsSidebarHovered}
        sidebar={
          <ChatSidebar
            isExpandedMobile={isExpandedMobile}
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
            onCloseMobile={() => {
              setIsSidebarOpen(false);
              setIsSidebarHovered(false);
            }}
            headerAction={
              <button
                onClick={handleOpenFileDialog}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                <span>{uploaded ? "Change PDF" : "Upload PDF"}</span>
              </button>
            }
            footer={
              <>
                {uploaded || chatHistory.length > 0 ? (
                  <button
                    onClick={handleResetDocument}
                    className="flex items-center gap-1.5 text-xs text-red-500 opacity-75 hover:opacity-100 py-1 px-2 rounded-lg hover:bg-red-500/10 transition"
                  >
                    <Trash className="h-3.5 w-3.5" />
                    <span>Reset Document</span>
                  </button>
                ) : (
                  <span className="opacity-40 text-[11px]">No active doc</span>
                )}

                <div className="flex items-center gap-2">
                  {uploaded && (
                    <span className="opacity-40 text-[11px]">1 document</span>
                  )}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition"
                    title="Guidelines & Information"
                  >
                    <Info className="h-4 w-4 text-blue-500" />
                  </button>
                </div>
              </>
            }
          >
            {/* Active Document Card or Empty State */}
            {uploaded ? (
              <div className="space-y-3">
                <span className="px-2 text-[11px] font-semibold uppercase tracking-wider opacity-40">
                  Active Document
                </span>

                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--foreground)] space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0 mt-0.5">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold truncate" title={fileName}>
                        {fileName}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-500 mt-0.5 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Ready for Q&A</span>
                      </div>
                    </div>
                  </div>

                  {chunksCount !== null && (
                    <div className="flex items-center gap-2 text-[11px] opacity-70 px-2 py-1.5 rounded-lg bg-black/5 dark:bg-white/5">
                      <Layers className="h-3.5 w-3.5 text-blue-500" />
                      <span>{chunksCount} processed chunks</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto opacity-50">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium opacity-80">No document loaded</p>
                  <p className="text-[11px] opacity-40">
                    Upload a PDF document to start conversational retrieval.
                  </p>
                </div>
              </div>
            )}
          </ChatSidebar>
        }
      >
        {/* Mobile Header */}
        <ChatMobileHeader
          title="Document"
          badge={uploaded ? "Ready" : undefined}
          icon={<FileText className="h-4 w-4 text-blue-500" />}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onHoverSidebar={() => setIsSidebarHovered(true)}
          onOpenInfo={() => setIsModalOpen(true)}
        />

        {/* Message Container / Dropzone */}
        <ChatMessageList
          messages={chatHistory}
          loading={isLoading}
          welcomeTitle={uploaded ? "Document Ready!" : undefined}
          welcomeSubtitle={
            uploaded
              ? `Ask any question about "${fileName}" below to start exploring.`
              : undefined
          }
          headerBanner={
            uploaded ? (
              <div className="w-full max-w-4xl mx-auto mb-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="font-semibold truncate">{fileName}</span>
                  {chunksCount && (
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-500 text-[10px] font-medium">
                      {chunksCount} chunks
                    </span>
                  )}
                </div>
                <button
                  onClick={handleOpenFileDialog}
                  className="shrink-0 text-blue-500 font-medium hover:underline text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Change</span>
                </button>
              </div>
            ) : undefined
          }
          emptyState={
            !uploaded ? (
              <DocumentDropzone
                onFileSelect={handleFileUpload}
                onTriggerUpload={handleOpenFileDialog}
                isUploading={isUploading}
              />
            ) : undefined
          }
        />

        {/* Chat Input Bar */}
        <ChatInput
          textareaRef={textareaRef}
          value={question}
          onChange={setQuestion}
          onSubmit={handleAskQuestion}
          placeholder={
            uploaded
              ? `Ask anything about ${fileName}...`
              : "Upload a PDF document first..."
          }
          loading={isLoading}
          disabled={!uploaded || isLoading || isUploading}
          extraActions={
            !uploaded ? (
              <button
                type="button"
                onClick={handleOpenFileDialog}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-[var(--foreground)] opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition shrink-0"
                title="Upload PDF"
                aria-label="Upload PDF"
              >
                <Upload className="h-4 w-4 text-blue-500" />
              </button>
            ) : undefined
          }
        />
      </ChatLayout>
    </>
  );
}