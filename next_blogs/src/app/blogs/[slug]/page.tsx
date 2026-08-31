import React from "react";
import type { Metadata } from "next";
import Container from "@/shared/components/Container";
import BlogDetails from "@/features/blog-details/components/BlogDetails";
import { PageProps } from "@/features/blog-details/types";
import { getBlogBySlug } from "@/features/blogs/services";
import type { Tag } from "@/features/blogs/types";
import { constructMetadata, getBlogPostingSchema, getBreadcrumbSchema } from "@/shared/lib/seo";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const blog = await getBlogBySlug(params.slug);
    const description = blog.headlines || blog.title;
    const path = `/blogs/${params.slug}`;

    // Extract tag values for keywords
    const tagValues = (blog.tags || []).map((tag: Tag | string) =>
      typeof tag === "string" ? tag : tag?.value || tag?.label || ""
    ).filter(Boolean);

    return constructMetadata({
      title: blog.title,
      description,
      keywords: tagValues,
      canonical: path,
      ogType: "article",
      publishedTime: blog.date,
      authors: [blog.username || "Sundararao"],
      tags: tagValues,
    });
  } catch {
    return constructMetadata({
      title: "Blog Article",
      description: "Read engineering articles on technology and software development.",
      canonical: `/blogs/${params.slug}`,
    });
  }
}

async function Page({ params }: PageProps) {
  let blogPostingSchema: object | null = null;
  let breadcrumbSchema: object | null = null;

  try {
    const blog = await getBlogBySlug(params.slug);
    blogPostingSchema = getBlogPostingSchema({
      ...blog,
      slug: params.slug,
    });
    breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", path: "/blogs" },
      { name: "Blogs", path: "/blogs" },
      { name: blog.title || "Article", path: `/blogs/${params.slug}` },
    ]);
  } catch {
    // structured data is best-effort
  }

  return (
    <main className="min-h-screen mt-6">
      {blogPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <Container>
        <div className="flex flex-wrap">
          <div className="hidden min-[960px]:block w-1/6" id="left-section" />
          <div className="w-full min-[960px]:w-1/2" id="main-section">
            <BlogDetails params={params} />
          </div>
          <div className="hidden min-[960px]:block min-[960px]:w-1/3" id="right-section" />
        </div>
      </Container>
    </main>
  );
}

export default Page;
