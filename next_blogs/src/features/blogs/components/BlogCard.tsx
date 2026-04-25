import type { Blog } from "@/features/blogs/types";
import BlogTags from "./BlogTags";
import NeuroCard from "@/shared/card";
import { getDate } from "@/shared/utils";
import { textStyles } from "@/theme/typography";
import Link from "next/link";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const href = `/blogs/${blog.slug}-${blog.content_id}`;
  return (
    <Link href={href} className="block">
      <NeuroCard>
        <div className="flex items-center gap-3">
          <div className="flex flex-row w-full !justify-between items-center">
            <h1 className={textStyles.title}>{blog.title}</h1>
            <span className={textStyles.mark}>{getDate(blog.date)}</span>
          </div>
        </div>
        <p className={textStyles.headline}>{blog.headlines}</p>

        {/* Tags in recessed well */}
        {blog.tags.length > 0 && <BlogTags tags={blog.tags} />}
      </NeuroCard>
    </Link>
  );
}
