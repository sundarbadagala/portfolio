import { http } from "@/shared/lib/http";
import type { Blog, BlogsResponse } from "@/features/blogs/types";

export async function getBlogs(): Promise<Blog[]> {
  const data = await http<BlogsResponse>("/content");
  return data.data ?? [];
}

export async function getBlogById(id: string): Promise<Blog> {
  return http<Blog>(`/content/${id}`);
}
