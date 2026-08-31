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

export interface IChatSession {
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview?: string;
}

export interface IChatSessionDetail {
  sessionId: string;
  title: string;
  messages: IMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface IChatStreamDoneData {
  type: "done";
  sessionId?: string;
  title?: string;
}

export interface IGetChatPayload {
  content: string;
  sessionId?: string;
  userMessageId?: string;
  assistantMessageId?: string;
  history?: IMessage[];
  onChunk: (response: string) => void;
  onDone?: (data: { sessionId?: string; title?: string }) => void;
}

export interface IGetRagChatPayload {
  content: string;
  sessionId?: string;
  history?: IChatHistoryItem[];
  onChunk: (response: string) => void;
  onDone?: (data: { sessionId?: string }) => void;
}

export interface IPostPdfResponse {
  message?: string;
  chunks: number;
  sessionId?: string;
}
