import { api } from "@/shared/lib/apiHandler";
import { API_CHAT, API_RAG_PDF_ASK, API_RAG_PDF_UPLOAD } from "@/shared/lib/endpoints";

import type {
  IGetChatPayload,
  IGetRagChatPayload,
  IPostPdfResponse,
} from "./types";

export type {
  IGetChatPayload,
  IGetRagChatPayload,
  IPostPdfResponse,
};

// Chat Service
export async function getChat({
  content,
  sessionId,
  history,
  onChunk,
}: IGetChatPayload): Promise<void> {
  await api.stream(API_CHAT, {
    payload: { content, sessionId, history },
    onChunk,
  });
}

// RAG Services
export async function postPdf(file: File): Promise<{ chunks: number }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(API_RAG_PDF_UPLOAD, { payload: formData });
  return res.data as { chunks: number };
}

export async function getRagChat({
  content,
  history,
  onChunk,
}: IGetRagChatPayload): Promise<void> {
  await api.stream(API_RAG_PDF_ASK, {
    payload: { content, history },
    onChunk,
  });
}
