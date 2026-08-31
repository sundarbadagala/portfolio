export type MessageRole = "user" | "assistant";

export interface IMessage {
  id?: string;
  role: MessageRole;
  content: string;
}

export interface IChatHistoryItem {
  id?: string;
  role: MessageRole;
  content: string;
}

export interface IGetChatPayload {
  content: string;
  sessionId?: string;
  history?: IMessage[];
  onChunk: (response: string) => void;
}

export interface IGetRagChatPayload {
  content: string;
  history?: IChatHistoryItem[];
  onChunk: (response: string) => void;
}

export interface IPostPdfResponse {
  message?: string;
  chunks: number;
}
