import { http } from "@/shared/lib/http";
import type { Blog, BlogsResponse } from "@/features/blogs/types";
import {API_CONTENT, API_CONTENT_SEARCH} from '@/shared/lib/endpoints'

const REVALIDATE_BLOGS = 1000; // 1 hour

export async function getBlogs(): Promise<Blog[]> {
  const data = await http<BlogsResponse>(API_CONTENT);
  return (Array.isArray(data?.data) ? data.data : []) ?? [];
}

export async function getSearchBlogs(query: { tags?: string; title?: string }): Promise<Blog[]> {
  const params = new URLSearchParams();
  if (query.tags) params.set("tags", query.tags);
  if (query.title) params.set("title", query.title);
  const data = await http<BlogsResponse>(`${API_CONTENT_SEARCH}?${params}`, { next: { revalidate: REVALIDATE_BLOGS } });
  return (Array.isArray(data?.data) ? data.data : []) ?? [];
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const res = await http<{ data: Blog }>(`${API_CONTENT}/${encodeURIComponent(slug)}`, { next: { revalidate: REVALIDATE_BLOGS } });
  return res?.data || {} as Blog;
}
