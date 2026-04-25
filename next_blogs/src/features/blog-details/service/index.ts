import { http } from "@/shared/lib/http";
import type { Blog, BlogsResponse } from "@/features/blogs/types";

export async function getSearchBlogs(): Promise<Blog[]> {
  const data = await http<BlogsResponse>("/content/search");
  return data.data ?? [];
}

