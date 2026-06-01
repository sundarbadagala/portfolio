import { getBlogs, getSearchBlogs } from "@/features/blogs/services";
import type { Blog } from "@/features/blogs/types";
import ErrorBox from "@/shared/components/ErrorBox";
import BlogCard from "./BlogCard";

export default async function BlogList({ tags, title }: { tags?: string; title?: string }) {
  let blogs: Blog[] = [];
  let error: string | null = null;

  try {
    blogs = tags || title ? await getSearchBlogs({ tags, title }) : await getBlogs();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load blogs.";
  }

  if (error) return <ErrorBox message={error} />;

  return (
    <div className="min-h-screen py-4 flex flex-col gap-2">
      {blogs.length === 0 && (
        <p className="text-gray-400 text-sm pl-2">No blogs found.</p>
      )}
      {blogs.map((blog: Blog) => (
        <BlogCard key={blog.content_id} blog={blog} />
      ))}
    </div>
  );
}
