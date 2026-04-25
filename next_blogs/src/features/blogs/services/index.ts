import { http } from "@/shared/lib/http";
import type { Blog, BlogsResponse } from "@/features/blogs/types";

export async function getBlogs(): Promise<Blog[]> {
  const data = await http<BlogsResponse>("/content");
  return data.data ?? [];
}

export async function getSearchBlogs(query: { tags: string }): Promise<Blog[]> {
  const queries = `tags=${query.tags}`
  const data = await http<BlogsResponse>(`/content/search?${queries}`);
  return data.data ?? [];
}

export async function getBlogById(id: string): Promise<Blog> {
  return http<Blog>(`/content/${id}`);
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const res = await http<{ data: Blog }>(`/content/${encodeURIComponent(slug)}`);
  return res.data;
}
