import { getBlogs, getSearchBlogs } from "@/features/blogs/services";
import type { Blog } from "@/features/blogs/types";
import BlogCard from "./BlogCard";

export default async function BlogList({ tags }: { tags?: string }) {
  let blogs: Blog[] = [];
  let error: string | null = null;

  try {
    blogs = tags ? await getSearchBlogs({ tags }) : await getBlogs();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load blogs.";
  }

  if (error) {
    return (
      <div
        className="m-4 p-4 rounded-2xl text-sm text-red-500
          shadow-[inset_4px_4px_10px_#c9c7c8,inset_-4px_-4px_10px_#ffffff]
          dark:shadow-[inset_4px_4px_10px_#1a1a1a,inset_-4px_-4px_10px_#3d3d3d]"
      >
        {error}
      </div>
    );
  }

  console.log('-----', blogs)
  return (
    <div className="min-h-screen py-4 flex flex-col gap-6">
      {blogs.length === 0 && (
        <p className="text-gray-400 text-sm pl-2">No blogs found.</p>
      )}
      {blogs.map((blog: Blog) => (
        <BlogCard key={blog.content_id} blog={blog} />
      ))}
    </div>
  );
}
