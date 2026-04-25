import { getBlogBySlug } from "@/features/blogs/services";
import type { Blog } from "@/features/blogs/types";
import { textStyles } from "@/theme/typography";
import { getDate } from "@/shared/utils";
import Divider from "@/shared/divider";
import NeuroTag from "@/shared/tag";
import ErrorBox from "@/shared/components/ErrorBox";
import Link from "next/link";
import "@/styles/hljs.css";

interface PageProps {
  params: { slug: string };
}

export default async function BlogDetails({ params }: PageProps) {
  const { slug } = params;
  let blog: Blog | null = null;
  let error: string | null = null;

  try {
    blog = await getBlogBySlug(slug);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load blog.";
  }

  if (error || !blog) return <ErrorBox message={error ?? "Blog not found."} />;

  return (
    <>
      <div className={textStyles.title}>{blog.title}</div>
      <span className={textStyles.headline}>{getDate(blog.date)}</span>
      <div className="flex gap-2 pt-4">
        {blog.tags.map((item: string) => (
          <Link key={item} href={`/blogs?tags=${item}`}>
            <NeuroTag>{item}</NeuroTag>
          </Link>
        ))}
      </div>
      <div className="py-4">
        <Divider />
      </div>
      {/* Content is HTML from a controlled internal API */}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </>
  );
}
