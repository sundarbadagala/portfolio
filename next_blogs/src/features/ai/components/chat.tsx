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
} from "lucide-react";
import MarkdownRenderer from "@/shared/components/MarkdownRenderer";
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

  // Sidebar & Sessions state
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Rename session state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleSelectSession = async (sessionId: string) => {
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
    setEditingSessionId(session.sessionId);
    setEditingTitle(session.title);
  };

  const handleSaveRename = async (sessionId: string, e?: React.MouseEvent | React.FormEvent) => {
    e?.stopPropagation();
    if (!editingTitle.trim()) {
      setEditingSessionId(null);
      return;
    }

    try {
      const res = await renameChatSession(sessionId, editingTitle.trim());
      if (res) {
        setSessions((prev) =>
          prev.map((s) => (s.sessionId === sessionId ? { ...s, title: res.title } : s))
        );
      }
    } catch (err) {
      console.error("Failed to rename session:", err);
    } finally {
      setEditingSessionId(null);
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
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-[var(--background)]">
      {/* Chat History Sidebar (Permanently Expanded) */}
      <aside className="w-64 sm:w-72 lg:w-80 flex flex-col h-full bg-[var(--background)] border-r border-[var(--foreground)]/15 shrink-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[var(--foreground)]/10">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
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
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[var(--foreground)]/15 bg-transparent outline-none focus:border-blue-500 transition"
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
                          onClick={() => handleSelectSession(session.sessionId)}
                          className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-all ${
                            isActive
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
                                  if (e.key === "Enter") handleSaveRename(session.sessionId, e);
                                  if (e.key === "Escape") setEditingSessionId(null);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-transparent border-b border-blue-500 outline-none text-xs"
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
                                  onClick={(e) => handleSaveRename(session.sessionId, e)}
                                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-emerald-500"
                                  title="Save"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                                className={`flex items-center gap-1 ${
                                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
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
        {sessions.length > 0 && (
          <div className="p-3 border-t border-[var(--foreground)]/10 flex items-center justify-between text-xs">
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 text-xs text-red-500 opacity-75 hover:opacity-100 py-1 px-2 rounded-lg hover:bg-red-500/10 transition"
            >
              <Trash className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
            <span className="opacity-40 text-[11px]">
              {sessions.length} {sessions.length === 1 ? "chat" : "chats"}
            </span>
          </div>
        )}
      </aside>

      {/* Main Chat Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" data-lenis-prevent>
          {loadingHistory ? (
            <div className="h-full flex flex-col items-center justify-center py-24 space-y-3 opacity-60">
              <Loader2 className="h-7 w-7 animate-spin" />
              <p className="text-sm">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            /* Clean Empty / Welcome State */
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-16">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-7 w-7" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                How can I help you today?
              </h1>
              <p className="text-sm opacity-60 max-w-sm">
                Ask coding questions, learn complex concepts, brainstorm ideas, or debug issues.
              </p>
            </div>
          ) : (
            /* Messages List */
            <div className="w-full max-w-4xl mx-auto space-y-5">
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`w-full !flex items-start gap-3 transition-all ${
                      isUser ? "!justify-end" : "!justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                        isUser
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-black/5 dark:bg-neutral-800 text-[var(--foreground)] rounded-tl-none border border-[var(--foreground)]/10"
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
        <div className="p-4 border-t border-[var(--foreground)]/10 bg-[var(--background)] shrink-0">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSendQuery}
              className="relative flex items-end gap-2 p-2 rounded-2xl border border-[var(--foreground)]/20 bg-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm"
            >
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                placeholder="Ask anything..."
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 max-h-36 resize-none bg-transparent px-3 py-2 text-sm outline-none text-[var(--foreground)] placeholder:opacity-40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] opacity-40">
              Sundar AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}