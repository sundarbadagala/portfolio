import type { News } from "@/features/news/types";
import React from "react";
import { getNews } from "../services";
import NewsCard from "./NewsCard";
import { textStyles } from "@/theme/typography";

export default async function NewsList() {
  let news: News[] = [];
  let error: string | null = null;
  try {
    news = await getNews();
  } catch (err) {
    error = err instanceof Error ? err.message : "Something went wrong!";
  }
  if (error) {
    return (
      <div
        className="m-4 p-4 rounded-2xl text-sm text-red-500
          shadow-[inset_4px_4px_10px_#c9c7c8,inset_-4px_-4px_10px_#ffffff]
          dark:shadow-[inset_4px_4px_10px_#1a1a1a,inset_-4px_-4px_10px_#3d3d3d]"
      >
        {error}
      </div>
    );
  }
  return (
    <div>
      <div className={textStyles.headline}>Latest News</div>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}
