export interface NewsSource {
  id: string;
  name: string;
  url: string;
}

export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  lang: string;
  source: NewsSource;
}

export interface NewsResponse {
  success: string;
  message: string;
  data: News[];
}
