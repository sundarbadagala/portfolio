import type { Blog } from "@/features/blogs/types";
import BlogTags from "./BlogTags";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div
      className="rounded-2xl p-6 transition-shadow duration-300
        shadow-[8px_8px_20px_#c9c7c8,-8px_-8px_20px_#ffffff]
        hover:shadow-[4px_4px_10px_#c9c7c8,-4px_-4px_10px_#ffffff]
        dark:shadow-[8px_8px_20px_#1a1a1a,-8px_-8px_20px_#3d3d3d]
        dark:hover:shadow-[4px_4px_10px_#1a1a1a,-4px_-4px_10px_#3d3d3d]"
    >
      <h2 className="text-lg font-bold tracking-wide mb-1 text-gray-600 dark:text-gray-300">
        {blog.title}
      </h2>

      <p className="text-sm leading-relaxed mb-4 text-gray-500 dark:text-gray-400">
        {blog.headlines}
      </p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold uppercase
              text-gray-500 dark:text-gray-400
              shadow-[3px_3px_6px_#c9c7c8,-3px_-3px_6px_#ffffff]
              dark:shadow-[3px_3px_6px_#1a1a1a,-3px_-3px_6px_#3d3d3d]"
          >
            {blog.username.charAt(0)}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {blog.username}
          </span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(blog.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <BlogTags tags={blog.tags} />
    </div>
  );
}
