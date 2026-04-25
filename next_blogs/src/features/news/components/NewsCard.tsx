import Divider from "@/shared/divider";
import { getDate } from "@/shared/utils";
import { textStyles } from "@/theme/typography";
import type { News } from "@/features/news/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function NewsCard({ news }: { news: News }) {
  return (
    <>
      <div className=" flex py-2 gap-4">
        <Image
          src={news.image}
          alt=""
          width={70}
          height={70}
          className="rounded-lg"
        />
        <div>
          <Link href={news.url} target="_blank">
            <div className={`${textStyles.headline} pb-2 hover:underline`}>
              {news.title}
            </div>
          </Link>
          <div className="flex !justify-between">
            <span className={textStyles.mark}>{news.source.name}</span>
            <span className={textStyles.mark}>{getDate(news.publishedAt)}</span>
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
}

export default NewsCard;
