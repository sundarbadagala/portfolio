import type { MetadataRoute } from "next";
import { getBlogs } from "@/features/blogs/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getBlogs();
    blogEntries = blogs.map((blog) => ({
      url: `${siteUrl}/blogs/${blog.slug}-${blog.content_id}`,
      lastModified: blog.date ? new Date(blog.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // sitemap generated without blog entries on fetch failure
  }

  return [
    {
      url: `${siteUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...blogEntries,
  ];
}
