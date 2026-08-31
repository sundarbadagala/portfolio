import { Suspense } from "react";
import type { Metadata } from "next";
import Container from "@/shared/components/Container";
import BlogList from "@/features/blogs/components/BlogList";
import NewsList from "@/features/news/components/NewsList";
import AdvSearchBar from '@/features/blogs/components/SearchBar2'
import Link from "next/link";
import CardTags from "@/features/tags/components/card-tags";
import GroupTags from "@/features/tags/components/group-tags";

import { constructMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Engineering & Tech Blogs",
  description:
    "Explore in-depth articles on software architecture, Next.js, React, Node.js, LangChain, RAG, and modern web development by Sundararao.",
  canonical: "/blogs",
  keywords: [
    "Tech Blog",
    "Software Engineering Articles",
    "Full Stack Tutorials",
    "React Blog",
    "Next.js Development",
    "Node.js Backend",
  ],
});

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ tags?: string; title?: string, query?: string, groupby?: string }>;
}) {
  const { tags, title, query, groupby } = await searchParams;
  return (
    <main className="min-h-screen mt-4">
      <Container>
        <div className="flex flex-wrap">
          <div
            className="hidden min-[960px]:block w-1/6 pr-1 mt-4"
            id="left-section"
          >
            {/* Left Content */}
            <CardTags />
            <GroupTags />
          </div>
          <div className="w-full min-[960px]:w-1/2" id="main-section">
            <Suspense>
              <AdvSearchBar />
            </Suspense>
            <BlogList tags={tags} title={title} query={query} groupby={groupby} />
          </div>
          <div
            className="w-full min-[960px]:w-1/3 px-4 mt-4"
            id="right-section"
          >
            <Link href={"/all-blogs"}>
              <button className="btn-primary w-full rounded-sm">
                Blogs (v0)
              </button>
            </Link>
            <NewsList />
          </div>
        </div>
      </Container>
    </main>
  );
}
