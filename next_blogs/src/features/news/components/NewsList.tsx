import type { News } from "@/features/news/types";
import React from "react";
import { getNews } from "../services";
import NewsCard from "./NewsCard";
import ErrorBox from "@/shared/components/ErrorBox";
import { textStyles } from "@/theme/typography";

export default async function NewsList() {
  let news: News[] = [];
  let error: string | null = null;
  try {
    news = await getNews();
  } catch (err) {
    error = err instanceof Error ? err.message : "Something went wrong!";
  }
  if (error) return <ErrorBox message={error} />;
  return (
    <div>
      <div className={textStyles.headline}>Latest News</div>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}
