import { api } from "@/shared/lib/apiHandler";
import type { Blog, BlogsResponse } from "@/features/blogs/types";
import { API_CONTENT, API_CONTENT_SEARCH, API_SEARCH } from '@/shared/lib/endpoints'

const REVALIDATE_BLOGS = 1000; // 1 hour

export async function getBlogs(): Promise<Blog[]> {
  const res = await api.get(API_CONTENT);
  const data = res.data as BlogsResponse;
  return (Array.isArray(data?.data) ? data.data : []) ?? [];
}

export async function getSearchBlogs(query: { tags?: string; title?: string }): Promise<Blog[]> {
  const params: Record<string, string> = {};
  if (query.tags) params.tags = query.tags;
  if (query.title) params.title = query.title;
  const res = await api.get(API_CONTENT_SEARCH, { params, next: { revalidate: REVALIDATE_BLOGS } });
  const data = res.data as BlogsResponse;
  return (Array.isArray(data?.data) ? data.data : []) ?? [];
}

export async function getAiSearch(query: string | { q?: string }): Promise<Blog[]> {
  const q = typeof query === "string" ? query : query?.q;
  const params: Record<string, string> = {};
  if (q) params.q = q;
  const res = await api.get(API_SEARCH, { params, next: { revalidate: REVALIDATE_BLOGS } });
  const data = res.data as BlogsResponse;
  return (Array.isArray(data?.data) ? data.data : []) ?? [];
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const res = await api.get(`${API_CONTENT}/${encodeURIComponent(slug)}`, { next: { revalidate: REVALIDATE_BLOGS } });
  const data = res.data as { data: Blog };
  return data?.data || {} as Blog;
}
