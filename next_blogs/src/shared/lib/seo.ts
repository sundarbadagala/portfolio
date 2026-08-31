import type { Metadata } from "next";

export const SITE_CONFIG = {
  siteName: "Sundararao | Tech Blog & AI Playground",
  shortName: "Sundararao",
  title: "Sundararao | Software Engineer, Tech Blog & AI Hub",
  description:
    "Explore in-depth software engineering articles, modern tech tutorials, interview Q&A, interactive AI assistant, RAG document search, JS compiler, and classic retro arcade games.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: {
    name: "Sundararao Badagala",
    role: "Software Engineer",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
  keywords: [
    "Software Engineering",
    "Full Stack Development",
    "Next.js",
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "LangChain",
    "ChromaDB",
    "RAG",
    "AI Chat",
    "Tech Tutorials",
    "Coding Interview Preparation",
    "JavaScript Compiler",
    "Web Development",
  ],
  locale: "en_US",
  twitterHandle: "@sundararao",
  defaultOgImage: "/favicon.ico",
};

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}

/**
 * Construct market-standard, unified Next.js Metadata
 */
export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  keywords = [],
  canonical,
  ogType = "website",
  ogImage = SITE_CONFIG.defaultOgImage,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
}: MetadataOptions = {}): Metadata {
  const siteUrl = SITE_CONFIG.url;
  const pageTitle = title ? `${title} | ${SITE_CONFIG.shortName}` : SITE_CONFIG.title;
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${siteUrl}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : siteUrl;

  const allKeywords = Array.from(new Set([...keywords, ...SITE_CONFIG.keywords]));

  return {
    title: title || {
      default: SITE_CONFIG.title,
      template: `%s | ${SITE_CONFIG.shortName}`,
    },
    description,
    keywords: allKeywords,
    applicationName: SITE_CONFIG.siteName,
    authors: (authors || [SITE_CONFIG.author.name]).map((name) => ({
      name,
      url: siteUrl,
    })),
    creator: SITE_CONFIG.author.name,
    publisher: SITE_CONFIG.author.name,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.siteName,
      locale: SITE_CONFIG.locale,
      type: ogType,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      ...(ogType === "article" && {
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors: authors || [SITE_CONFIG.author.name],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      creator: SITE_CONFIG.twitterHandle,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

/**
 * JSON-LD: WebSite Schema with Site Search potentialAction
 */
export function getWebSiteSchema() {
  const siteUrl = SITE_CONFIG.url;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.siteName,
    url: siteUrl,
    description: SITE_CONFIG.description,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.author.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blogs?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * JSON-LD: Person / Profile Schema
 */
export function getPersonSchema() {
  const siteUrl = SITE_CONFIG.url;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.role,
    url: siteUrl,
    sameAs: [
      "https://github.com/sundarbadagala",
    ],
  };
}

/**
 * JSON-LD: BlogPosting Article Schema
 */
export function getBlogPostingSchema(blog: {
  title: string;
  headlines?: string;
  date?: string;
  username?: string;
  tags?: Array<{ label?: string; value?: string } | string>;
  slug: string;
}) {
  const siteUrl = SITE_CONFIG.url;
  const tagValues = (blog.tags || []).map((tag) =>
    typeof tag === "string" ? tag : tag?.value || tag?.label || ""
  ).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.headlines || blog.title,
    datePublished: blog.date,
    dateModified: blog.date,
    author: {
      "@type": "Person",
      name: blog.username || SITE_CONFIG.author.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blogs/${blog.slug}`,
    },
    keywords: tagValues.join(", "),
    url: `${siteUrl}/blogs/${blog.slug}`,
  };
}

/**
 * JSON-LD: SoftwareApplication / WebApplication Schema
 */
export function getSoftwareAppSchema(name: string, description: string, path: string, applicationCategory: string = "DeveloperApplication") {
  const siteUrl = SITE_CONFIG.url;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${siteUrl}${path}`,
    applicationCategory,
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * JSON-LD: VideoGame Schema
 */
export function getGameSchema(game: {
  game_id: string;
  game_title: string;
  description: string;
  rating?: number;
  year?: string;
  tags?: string[];
}) {
  const siteUrl = SITE_CONFIG.url;
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.game_title,
    description: game.description,
    genre: game.tags,
    url: `${siteUrl}/games/${game.game_id}`,
    datePublished: game.year,
    ...(game.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: game.rating,
        bestRating: 5,
        ratingCount: 120,
      },
    }),
  };
}

/**
 * JSON-LD: BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  const siteUrl = SITE_CONFIG.url;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
