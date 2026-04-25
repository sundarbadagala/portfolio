import { http } from "@/shared/lib/http";
import type { Blog, BlogsResponse } from "@/features/blogs/types";

const REVALIDATE_BLOGS = 3600; // 1 hour

export async function getBlogs(): Promise<Blog[]> {
  const data = await http<BlogsResponse>("/content", { next: { revalidate: REVALIDATE_BLOGS } });
  return data.data ?? [];
}

export async function getSearchBlogs(query: { tags: string }): Promise<Blog[]> {
  const queries = `tags=${query.tags}`;
  const data = await http<BlogsResponse>(`/content/search?${queries}`, { next: { revalidate: REVALIDATE_BLOGS } });
  return data.data ?? [];
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const res = await http<{ data: Blog }>(`/content/${encodeURIComponent(slug)}`, { next: { revalidate: REVALIDATE_BLOGS } });
  return res.data;
}
