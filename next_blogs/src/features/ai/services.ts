import { api } from "@/shared/lib/apiHandler";
import {
  API_CHAT,
  API_CHAT_SESSIONS,
  API_RAG_PDF_ASK,
  API_RAG_PDF_UPLOAD,
} from "@/shared/lib/endpoints";

import type {
  IChatSession,
  IChatSessionDetail,
  IGetChatPayload,
  IGetRagChatPayload,
  IPostPdfResponse,
} from "./types";

export type {
  IChatSession,
  IChatSessionDetail,
  IGetChatPayload,
  IGetRagChatPayload,
  IPostPdfResponse,
};

interface ApiResponseData<T> {
  status: string;
  message?: string;
  data: T;
}

// ---- Chat Services ----

export async function getChat({
  content,
  sessionId,
  userMessageId,
  assistantMessageId,
  history,
  onChunk,
  onDone,
}: IGetChatPayload): Promise<void> {
  await api.stream(API_CHAT, {
    payload: {
      content,
      sessionId,
      userMessageId,
      assistantMessageId,
      history,
    },
    onChunk,
    onDone: (data) => {
      onDone?.({
        sessionId: data.sessionId as string | undefined,
        title: data.title as string | undefined,
      });
    },
  });
}

export async function getChatSessions(): Promise<IChatSession[]> {
  const res = await api.get(API_CHAT_SESSIONS);
  const data = res.data as ApiResponseData<IChatSession[]>;
  return (data && data.status === "success" && data.data) ? data.data : [];
}

export async function getChatSession(sessionId: string): Promise<IChatSessionDetail | null> {
  const res = await api.get(`${API_CHAT_SESSIONS}/${sessionId}`);
  const data = res.data as ApiResponseData<IChatSessionDetail>;
  return (data && data.status === "success" && data.data) ? data.data : null;
}

export async function renameChatSession(
  sessionId: string,
  title: string
): Promise<{ sessionId: string; title: string } | null> {
  try {
    const res = await api.patch(`${API_CHAT_SESSIONS}/${sessionId}`, {
      payload: { title },
    });
    const resData = res.data as ApiResponseData<{ sessionId: string; title: string }>;
    if (resData && resData.status === "success" && resData.data) {
      return resData.data;
    }
    const raw = res.data as { sessionId?: string; title?: string };
    if (raw && raw.title) {
      return { sessionId, title: raw.title };
    }
    return { sessionId, title };
  } catch (err) {
    console.error("renameChatSession error:", err);
    return null;
  }
}

export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const res = await api.delete(`${API_CHAT_SESSIONS}/${sessionId}`);
  const data = res.data as ApiResponseData<{ sessionId: string }>;
  return data && data.status === "success";
}

export async function clearAllChatSessions(): Promise<boolean> {
  const res = await api.delete(API_CHAT_SESSIONS);
  const data = res.data as ApiResponseData<null>;
  return data && data.status === "success";
}

// ---- RAG Services ----

export async function postPdf(
  file: File,
  sessionId?: string
): Promise<IPostPdfResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (sessionId) {
    formData.append("sessionId", sessionId);
  }
  const res = await api.post(API_RAG_PDF_UPLOAD, { payload: formData });
  return res.data as IPostPdfResponse;
}

export async function getRagChat({
  content,
  sessionId,
  onChunk,
  onDone,
}: IGetRagChatPayload): Promise<void> {
  await api.stream(API_RAG_PDF_ASK, {
    payload: { content, sessionId },
    onChunk,
    onDone: (data) => {
      onDone?.({
        sessionId: data.sessionId as string | undefined,
      });
    },
  });
}
