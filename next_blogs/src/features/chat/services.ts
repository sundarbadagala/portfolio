import { api } from "@/shared/lib/apiHandler";
import { API_CHAT } from "@/shared/lib/endpoints";

interface IGetChatPayload {
  content: string;
  sessionId?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  onChunk: (response: string) => void;
}

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
