import type { Blog } from "@/features/blogs/types";
import BlogTags from "./BlogTags";
import Card from "@/shared/card";
import { getDate } from "@/shared/utils";
import Link from "next/link";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const href = `/blogs/${blog.slug}-${blog.content_id}`;
  return (
    <Link href={href} className="block">
      <Card>
        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2 sm:gap-4 mb-2">
          <h1 className="text-base sm:text-lg font-bold tracking-wide text-gray-600 dark:text-gray-300 leading-snug flex-1">
            {blog.title}
          </h1>
          <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 italic whitespace-nowrap self-start sm:self-center">
            {getDate(blog.date)}
          </span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed mb-5 text-gray-500 dark:text-gray-400 line-clamp-3">
          {blog.headlines}...
        </p>

        {/* Tags in recessed well */}
        {blog.tags && blog.tags.length > 0 && <BlogTags tags={blog.tags} />}
      </Card>
    </Link>
  );
}
