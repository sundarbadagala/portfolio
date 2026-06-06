import { http } from "@/shared/lib/http";
import type { News, NewsResponse } from "@/features/news/types";
import { API_NEWS } from "@/shared/lib/endpoints";

export async function getNews(): Promise<News[]> {
  const data = await http<NewsResponse>(API_NEWS);
  return (Array.isArray(data?.data) ? data.data : []) ?? [];
}
