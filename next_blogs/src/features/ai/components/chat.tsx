"use client";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Sparkles,
  Send,
  Loader2,
  Trash,
  Info,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import MarkdownRenderer from "@/shared/components/MarkdownRenderer";
import Container from "@/shared/components/Container";
import Modal from "@/shared/components/Modal";
import { GEN_AI_NOTE } from "@/shared/helper/constants";
import {
  getChat,
  getChatSessions,
  getChatSession,
  renameChatSession,
  deleteChatSession,
  clearAllChatSessions,
} from "@/features/ai/services";
import type { IChatSession, IMessage } from "@/features/ai/types";

export default function ChatPage() {
  // Chat state
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sidebar responsive & hover state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Sidebar & Sessions state
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Rename session state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Combined sidebar expanded state for mobile/tab
  const isExpandedMobile = isSidebarOpen || isSidebarHovered;

  // Initialize first new session & load sessions on mount
  useEffect(() => {
    startNewChat();
    loadSessions();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages, loading]);

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to load chat sessions:", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const startNewChat = () => {
    const newId = crypto.randomUUID();
    setCurrentSessionId(newId);
    setMessages([]);
    setInput("");
    setIsSidebarOpen(false);
    setIsSidebarHovered(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    setIsSidebarOpen(false);
    setIsSidebarHovered(false);

    if (sessionId === currentSessionId && messages.length > 0) {
      return;
    }

    setCurrentSessionId(sessionId);
    setLoadingHistory(true);

    try {
      const sessionDetail = await getChatSession(sessionId);
      if (sessionDetail && sessionDetail.messages) {
        setMessages(sessionDetail.messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load session details:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStartRename = (session: IChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingSessionId(session.sessionId);
    setEditingTitle(session.title);
  };

  const handleSaveRename = async (sessionId: string, e?: React.MouseEvent | React.FormEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const newTitle = editingTitle.trim();
    if (!newTitle) {
      setEditingSessionId(null);
      return;
    }

    const previousTitle = sessions.find((s) => s.sessionId === sessionId)?.title;

    // Optimistic UI update
    setSessions((prev) =>
      prev.map((s) => (s.sessionId === sessionId ? { ...s, title: newTitle } : s))
    );
    setEditingSessionId(null);

    try {
      const res = await renameChatSession(sessionId, newTitle);
      if (res && res.title) {
        setSessions((prev) =>
          prev.map((s) => (s.sessionId === sessionId ? { ...s, title: res.title } : s))
        );
      }
    } catch (err) {
      console.error("Failed to rename session:", err);
      // Revert if API failed
      if (previousTitle) {
        setSessions((prev) =>
          prev.map((s) => (s.sessionId === sessionId ? { ...s, title: previousTitle } : s))
        );
      }
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat session?")) return;

    try {
      const success = await deleteChatSession(sessionId);
      if (success) {
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
        if (currentSessionId === sessionId) {
          startNewChat();
        }
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete all chat history? This cannot be undone.")) return;

    try {
      const success = await clearAllChatSessions();
      if (success) {
        setSessions([]);
        startNewChat();
      }
    } catch (err) {
      console.error("Failed to clear all sessions:", err);
    }
  };

  const sendMessage = async () => {
    if (loading) return;

    const question = input.trim();
    if (!question) return;

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    const userMsgId = crypto.randomUUID();
    const assistantMsgId = crypto.randomUUID();

    const newMessages: IMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: "user",
        content: question,
      },
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
      },
    ];

    setMessages(newMessages);

    try {
      await getChat({
        content: question,
        sessionId: currentSessionId,
        userMessageId: userMsgId,
        assistantMessageId: assistantMsgId,
        history: messages,
        onChunk: (response) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMsgId
                ? {
                  ...message,
                  content: response,
                }
                : message
            )
          );
        },
        onDone: (data) => {
          if (data && data.title) {
            setSessions((prev) => {
              const existingIndex = prev.findIndex((s) => s.sessionId === currentSessionId);
              const updatedSession: IChatSession = {
                sessionId: currentSessionId,
                title: data.title || "New Chat",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messageCount: newMessages.length,
                preview: question.slice(0, 60),
              };

              if (existingIndex >= 0) {
                const copy = [...prev];
                copy.splice(existingIndex, 1);
                return [updatedSession, ...copy];
              } else {
                return [updatedSession, ...prev];
              }
            });
          }
        },
      });
    } catch (error) {
      console.error("Chat streaming error:", error);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMsgId
            ? {
              ...message,
              content: "Something went wrong while generating response. Please try again.",
            }
            : message
        )
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  // Filter sessions by search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.preview && s.preview.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    const groups: { [key: string]: IChatSession[] } = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: [],
    };

    for (const session of filteredSessions) {
      const sessionDate = new Date(session.updatedAt || session.createdAt);
      if (sessionDate >= today) {
        groups.Today.push(session);
      } else if (sessionDate >= yesterday) {
        groups.Yesterday.push(session);
      } else if (sessionDate >= last7Days) {
        groups["Previous 7 Days"].push(session);
      } else {
        groups.Older.push(session);
      }
    }

    return groups;
  }, [filteredSessions]);

  return (
    <div className="py-2 sm:py-4 md:py-6 h-[calc(100dvh-70px)] md:h-[calc(100vh-80px)] overflow-hidden">
      {/* Information / Guidelines Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-semibold">{GEN_AI_NOTE.header}</span>
          </div>
        }
      >
        <p>{GEN_AI_NOTE.note}</p>
        <ul className="list-disc list-outside mt-2 text-sm space-y-1">
          {GEN_AI_NOTE.note_points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </Modal>

      <Container className="h-full">
        <div className="relative flex h-full w-full overflow-hidden bg-[var(--background)] rounded-2xl md:rounded-3xl border border-[var(--foreground)] shadow-sm">
          {/* Mobile/Tablet Edge Hover Sensor Strip */}
          <div
            onMouseEnter={() => setIsSidebarHovered(true)}
            className="absolute inset-y-0 left-0 w-3 z-30 lg:!hidden cursor-pointer"
            aria-hidden="true"
          />

          {/* Mobile/Tablet Backdrop Overlay */}
          <div
            onClick={() => {
              setIsSidebarOpen(false);
              setIsSidebarHovered(false);
            }}
            className={`absolute inset-0 bg-black/40 backdrop-blur-xs z-30 lg:!hidden transition-opacity duration-300 ${isExpandedMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
          />

          {/* Chat History Sidebar */}
          <aside
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
            className={`absolute lg:relative inset-y-0 left-0 z-40 w-72 sm:w-80 lg:w-80 flex flex-col h-full bg-[var(--background)] border-r border-[var(--foreground)] shrink-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isExpandedMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              }`}
          >
            {/* Sidebar Header */}
            <div className="p-3 sm:p-4 border-b border-[var(--foreground)] flex items-center gap-2">
              <button
                onClick={startNewChat}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsSidebarHovered(false);
                }}
                className="lg:!hidden p-2.5 rounded-xl border border-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 text-xs transition shrink-0"
                title="Close chat history"
                aria-label="Close chat history"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>

            {/* Search Bar (if > 3 sessions) */}
            {sessions.length > 3 && (
              <div className="px-3 pt-3">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-3.5 w-3.5 opacity-40" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[var(--foreground)] bg-transparent outline-none focus:border-blue-500 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 p-0.5 opacity-50 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Sessions List */}
            <div
              className="flex-1 overflow-y-auto p-3 space-y-4 text-sm"
              data-lenis-prevent
            >
              {loadingSessions ? (
                <div className="flex flex-col items-center justify-center py-12 text-xs opacity-50 space-y-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading chat history...</span>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-12 px-4 text-xs opacity-40">
                  {searchQuery ? "No matching chats found." : "No chat history yet."}
                </div>
              ) : (
                Object.entries(groupedSessions).map(([groupTitle, groupItems]) => {
                  if (groupItems.length === 0) return null;
                  return (
                    <div key={groupTitle} className="space-y-1">
                      <span className="px-2 text-[11px] font-semibold uppercase tracking-wider opacity-40">
                        {groupTitle}
                      </span>
                      <div className="space-y-1 pt-1">
                        {groupItems.map((session) => {
                          const isActive = session.sessionId === currentSessionId;
                          const isEditing = editingSessionId === session.sessionId;

                          return (
                            <div
                              key={session.sessionId}
                              onClick={() => {
                                if (!isEditing) handleSelectSession(session.sessionId);
                              }}
                              className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-all ${isActive
                                ? "bg-black/10 dark:bg-white/15 font-medium opacity-100 shadow-sm"
                                : "opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                                }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                                <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
                                {isEditing ? (
                                  <input
                                    autoFocus
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSaveRename(session.sessionId, e);
                                      }
                                      if (e.key === "Escape") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setEditingSessionId(null);
                                      }
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                    }}
                                    className="w-full bg-transparent border-b border-blue-500 outline-none text-xs text-[var(--foreground)]"
                                  />
                                ) : (
                                  <span className="truncate">{session.title}</span>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1 shrink-0">
                                {isEditing ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleSaveRename(session.sessionId, e);
                                      }}
                                      className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-emerald-500"
                                      title="Save"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setEditingSessionId(null);
                                      }}
                                      className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100"
                                      title="Cancel"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <div
                                    className={`flex items-center gap-1 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                      } transition-opacity`}
                                  >
                                    <button
                                      onClick={(e) => handleStartRename(session, e)}
                                      className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition"
                                      title="Rename Chat"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={(e) => handleDeleteSession(session.sessionId, e)}
                                      className="p-1 rounded hover:bg-red-500/10 text-red-500 opacity-70 hover:opacity-100 transition"
                                      title="Delete Chat"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-[var(--foreground)] flex items-center justify-between text-xs">
              {sessions.length > 0 ? (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 text-xs text-red-500 opacity-75 hover:opacity-100 py-1 px-2 rounded-lg hover:bg-red-500/10 transition"
                >
                  <Trash className="h-3.5 w-3.5" />
                  <span>Clear History</span>
                </button>
              ) : (
                <span className="opacity-40 text-[11px]">0 chats</span>
              )}

              <div className="flex items-center gap-2">
                {sessions.length > 0 && (
                  <span className="opacity-40 text-[11px]">
                    {sessions.length} {sessions.length === 1 ? "chat" : "chats"}
                  </span>
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition"
                  title="Guidelines & Information"
                >
                  <Info className="h-4 w-4 text-blue-500" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Chat Content Area */}
          <main className="flex-1 flex flex-col h-full min-w-0 relative">
            {/* Mobile/Tablet Header Bar with Toggle (Hidden on Desktop) */}
            <div className="flex lg:!hidden items-center !justify-start px-3 py-2 border-b border-[var(--foreground)] bg-[var(--background)] shrink-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                onMouseEnter={() => setIsSidebarHovered(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[var(--foreground)] text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all shadow-xs"
                aria-label="Open chat history"
              >
                <PanelLeft className="h-4 w-4 text-blue-500" />
                <span>Chats</span>
                {sessions.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--foreground)] text-[var(--background)] font-semibold">
                    {sessions.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition"
                title="Guidelines & Information"
              >
                <Info className="h-4 w-4 text-blue-500" />
              </button>
            </div>

            {/* Message Container */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6" data-lenis-prevent>
              {loadingHistory ? (
                <div className="h-full flex flex-col items-center justify-center py-24 space-y-3 opacity-60">
                  <Loader2 className="h-7 w-7 animate-spin" />
                  <p className="text-sm">Loading conversation...</p>
                </div>
              ) : messages.length === 0 ? (
                /* Clean Empty / Welcome State */
                <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 sm:py-16 px-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center mb-4 sm:mb-5 shadow-lg shadow-blue-500/20">
                    <Sparkles className="h-6 w-6 sm:h-7 sm:s-7" />
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                    How can I help you today?
                  </h1>
                </div>
              ) : (
                /* Messages List */
                <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-5">
                  {messages.map((message) => {
                    const isUser = message.role === "user";
                    return (
                      <div
                        key={message.id}
                        className={`w-full !flex items-start gap-2.5 sm:gap-3 transition-all ${isUser ? "!justify-end" : "!justify-start"
                          }`}
                      >
                        {!isUser && (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                            <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                          </div>
                        )}
                        <div
                          className={`max-w-[88%] sm:max-w-[85%] md:max-w-[78%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words ${isUser
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

            {/* Input Bar */}
            <div className="p-2.5 sm:p-4 border-t border-[var(--foreground)] bg-[var(--background)] shrink-0">
              <div className="max-w-4xl mx-auto">
                <form
                  onSubmit={handleSendQuery}
                  className="relative flex items-end gap-2 p-1.5 sm:p-2 rounded-2xl border border-[var(--foreground)] bg-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm"
                >
                  <textarea
                    ref={textareaRef}
                    value={input}
                    rows={1}
                    placeholder="Ask anything..."
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    className="flex-1 max-h-36 resize-none bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none text-[var(--foreground)] placeholder:opacity-40 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
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
          </main>
        </div>
      </Container>
    </div>
  );
}
