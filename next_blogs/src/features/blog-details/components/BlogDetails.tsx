import { getBlogBySlug } from "@/features/blogs/services";
import { textStyles } from "@/theme/typography";
import { getDate } from "@/shared/utils";
import Divider from "@/shared/divider";
import NeuroTag from "@/shared/tag";
import Link from "next/link";
import '@/styles/hljs.css'

interface PageProps {
  params: { slug: string };
}

export default async function BlogDetails({ params }: PageProps) {
  const { slug } = params;
  let blog: any = {};
  let error: string | null = null;

  try {
    blog = await getBlogBySlug(slug);
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
  return (
    <>
      <div className={textStyles.title}>{blog.title}</div>
      <span className={textStyles.headline}>{getDate(blog.date)}</span>
      <div className="flex gap-2 pt-4">
        {blog?.tags.map((item: string) => (
          <Link href={`/blogs?tags=${item}`}>
            <NeuroTag>{item}</NeuroTag>
          </Link>
        ))}
      </div>
      <div className="py-4">
        <Divider />
      </div>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </>
  );
}
