import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { newsRequest } from "../slice.news";
import { HeaderText } from "@/share/atoms/text";
import NewsCard from "@/share/molecule/NewsCard";
import { INewsCardProps } from "../interface";

function NewsSection() {
  const dispatch = useAppDispatch();
  const { isLoading, data: news } = useAppSelector((state) => state.news);
  useEffect(() => {
    dispatch(newsRequest());
  }, []);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <HeaderText>Latest News</HeaderText>
      {news.map((newsItem: INewsCardProps) => (
        <NewsCard {...newsItem} />
      ))}
    </>
  );
}

export default NewsSection;
