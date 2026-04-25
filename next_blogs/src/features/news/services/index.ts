import { http } from "@/shared/lib/http";
import type { News, NewsResponse } from "@/features/news/types";

export async function getNews(): Promise<News[]> {
  const data = await http<NewsResponse>("/news");
  return data.data ?? [];
}
