import { Suspense } from "react";
import type { Metadata } from "next";
import Container from "@/shared/components/Container";
import BlogList from "@/features/blogs/components/BlogList";
import NewsList from "@/features/news/components/NewsList";
import SearchBar from "@/features/blogs/components/SearchBar";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Articles on software engineering, technology, and programming by Sundararao.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Blogs | Sundararao",
    description:
      "Articles on software engineering, technology, and programming by Sundararao.",
    url: "/blogs",
    type: "website"
  }
};

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ tags?: string; title?: string }>;
}) {
  const { tags, title } = await searchParams;
  return (
    <main className="min-h-screen">
      <Container>
        <div className="flex flex-wrap">
          <div className="hidden min-[960px]:block w-1/6 px-4" id="left-section">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
          <div className="w-full min-[960px]:w-1/2" id="main-section">
            <BlogList tags={tags} title={title} />
          </div>
          <div className="w-1/3 px-4" id="right-section">
            <NewsList />
          </div>
        </div>
      </Container>
    </main>
  );
}
