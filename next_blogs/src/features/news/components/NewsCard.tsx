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
      <div className=" flex py-1 gap-2 items-start border border-transparent border-b-black">
        {news.image && (
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover rounded"
              unoptimized={true}
            />
          </div>
        )}
        <div>
          <Link href={news.url} target="_blank">
            <div
              className={`${textStyles.headline} hover:underline text-sm !mb-2`}
            >
              {news.title}
            </div>
          </Link>
          <div className="flex !justify-between">
            <span className={textStyles.mark}>{news.source?.name}</span>
            <span className={textStyles.mark}>{getDate(news.publishedAt)}</span>
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
}

export default NewsCard;
