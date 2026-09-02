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

// ---- AI Online Test Types ----

export interface ITestSubject {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
}

export interface ITestOption {
  options_id: string;
  option_1: string;
  is_correct: boolean;
}

export interface ITestQuestion {
  question: string;
  question_id: string;
  test_id?: string;
  options: ITestOption[];
  subject: string;
  concept: string;
  hint: string;
  level: "beginner" | "medium" | "advanced";
  marks: number;
  question_type: string;
}

export interface IGenerateTestPayload {
  subject: string;
  level: "beginner" | "medium" | "advanced";
  number_questions: number;
}

export interface ISubmitTestPayload {
  test_id: string;
  questions: ITestQuestion[];
}

export interface IQuestionResult {
  question_id: string;
  question: string;
  concept: string;
  hint: string;
  attempted: boolean;
  user_selected_option?: {
    options_id: string;
    option_1: string;
  } | null;
  correct_option?: {
    options_id: string;
    option_1: string;
  } | null;
  is_correct: boolean;
  marks_awarded: number;
}

export interface ITestResult {
  test_id: string;
  subject: string;
  level: string;
  total_questions: number;
  total_marks: number;
  score: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  attempted: number;
  percentage: string;
  results: IQuestionResult[];
}

