"use client";

import NeuroTag from "@/shared/tag";
import { useRouter } from "next/navigation";

interface TagObject {
  value: string;
  label: string;
}

interface BlogTagsProps {
  tags: (TagObject | string)[];
}

export default function BlogTags({ tags }: BlogTagsProps) {
  const router = useRouter();

  if (!tags || tags.length === 0) return null;

  const handleTagClick = (e: React.MouseEvent<HTMLButtonElement>, tagValue: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blogs?tags=${encodeURIComponent(tagValue)}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const tagValue = typeof tag === "string" ? tag : tag.value;
        const tagLabel = typeof tag === "string" ? tag : tag.label;
        return (
          <NeuroTag key={tagValue} isDisableAnimation={false} onClick={(e) => handleTagClick(e, tagValue)}>
            {tagLabel}
          </NeuroTag>
        );
      })}
    </div>
  );
}
