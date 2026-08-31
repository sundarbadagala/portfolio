import type { MetadataRoute } from "next";
import { getBlogs } from "@/features/blogs/services";
import { SITE_CONFIG } from "@/shared/lib/seo";

const STATIC_GAMES = [
  "avalance",
  "billy_and_mandy_spell_book",
  "bullet_bill",
  "charlie_the_duck",
  "crazy_nut",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_CONFIG.url;
  const now = new Date();

  // Static Application Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/q&a`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ai/chat`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/ai/rag`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/compiler`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/games`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/all-blogs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic Game Entries
  const gameEntries: MetadataRoute.Sitemap = STATIC_GAMES.map((gameId) => ({
    url: `${siteUrl}/games/${gameId}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Dynamic Blog Entries
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getBlogs();
    blogEntries = blogs.map((blog) => ({
      url: `${siteUrl}/blogs/${blog.slug}-${blog.content_id}`,
      lastModified: blog.date ? new Date(blog.date) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // Graceful fallback if backend is unreachable during build
  }

  return [...staticRoutes, ...blogEntries, ...gameEntries];
}
