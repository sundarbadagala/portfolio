import Container from "@/shared/components/Container";
import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Blog Archive (v0)",
  description: "Browse the complete archive of tech articles, software engineering writeups, and legacy posts.",
  canonical: "/all-blogs",
});

function Page() {
  return (
    <main className="min-h-screen">
      <Container>
        <iframe
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs.html`}
          className="w-full h-[100vh]"
        ></iframe>
      </Container>
    </main>
  );
}

export default Page;
