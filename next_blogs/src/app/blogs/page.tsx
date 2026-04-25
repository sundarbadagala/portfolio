import type { Metadata } from "next";
import Container from "@/shared/components/Container";
import BlogList from "@/features/blogs/components/BlogList";
import NewsList from "@/features/news/components/NewsList";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Articles on software engineering, technology, and programming by Sundararao.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Blogs | Sundararao",
    description: "Articles on software engineering, technology, and programming by Sundararao.",
    url: "/blogs",
    type: "website",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string }>;
}) {
  const { tags } = await searchParams;
  return (
    <main className="min-h-screen">
      <Container>
        <div className="flex flex-wrap">
          <div className="hidden min-[960px]:block w-1/6" id="left-section" />
          <div className="w-1/2" id="main-section">
            <BlogList tags={tags} />
          </div>
          <div className="w-1/3" id="right-section">
            <NewsList />
          </div>
        </div>
      </Container>
    </main>
  );
}
