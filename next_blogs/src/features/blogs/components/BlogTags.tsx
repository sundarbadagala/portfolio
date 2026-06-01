"use client";

import NeuroTag from "@/shared/tag";
import { useRouter } from "next/navigation";

interface BlogTagsProps {
  tags: string[];
}

export default function BlogTags({ tags }: BlogTagsProps) {
  const router = useRouter();

  if (tags.length === 0) return null;

  const handleTagClick = (e: React.MouseEvent<HTMLButtonElement>, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blogs?tags=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <NeuroTag key={tag} isDisableAnimation={true} onClick={(e) => handleTagClick(e, tag)}>
          {tag}
        </NeuroTag>
      ))}
    </div>
  );
}
