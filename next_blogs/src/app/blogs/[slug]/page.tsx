import React from "react";
import type { Metadata } from "next";
import Container from "@/shared/components/Container";
import BlogDetails from "@/features/blog-details/components/BlogDetails";
import { PageProps } from "@/features/blog-details/types";
import { getBlogBySlug } from "@/features/blogs/services";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const blog = await getBlogBySlug(params.slug);
    const description = blog.headlines || blog.title;
    const path = `/blogs/${blog.slug}`;

    return {
      title: blog.title,
      description,
      keywords: blog.tags,
      authors: [{ name: blog.username }],
      openGraph: {
        title: blog.title,
        description,
        url: path,
        type: "article",
        publishedTime: blog.date,
        authors: [blog.username],
        tags: blog.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description,
      },
      alternates: {
        canonical: path,
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

async function Page({ params }: PageProps) {
  let jsonLd: object | null = null;
  try {
    const blog = await getBlogBySlug(params.slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.headlines || blog.title,
      datePublished: blog.date,
      author: { "@type": "Person", name: blog.username },
      keywords: blog.tags?.join(", "),
      url: `${siteUrl}/blogs/${params.slug}`,
    };
  } catch {
    // structured data is best-effort
  }

  return (
    <main className="min-h-screen">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Container>
        <div className="flex flex-wrap">
          <div className="hidden min-[960px]:block w-1/6" id="left-section" />
          <div className="w-1/2" id="main-section">
            <BlogDetails params={params} />
          </div>
          <div className="w-1/3" id="right-section" />
        </div>
      </Container>
    </main>
  );
}

export default Page;
