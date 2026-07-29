import { api } from "@/shared/lib/apiHandler";
import type { News, NewsResponse } from "@/features/news/types";
import { API_NEWS } from "@/shared/lib/endpoints";

export async function getNews(): Promise<News[]> {
  const res = await api.get(API_NEWS);
  const data = res.data as NewsResponse;
  return (Array.isArray(data?.data) ? data.data : []) ?? [];
}
