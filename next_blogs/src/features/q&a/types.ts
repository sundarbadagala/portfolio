export interface Question {
  question_id: string;
  question: string;
  answer: string;
  category: string;
  sub_category: string;
  level: "beginner" | "medium" | "high";
}

export interface CategoriesResponse {
  status: string;
  message: string;
  data: string[];
}

export interface SubCategoriesResponse {
  status: string;
  message: string;
  data: string[];
}

export interface QuestionsResponse {
  status: string;
  message: string;
  data: Question[];
}
