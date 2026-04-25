import NeuroTag from "@/shared/tag";

interface BlogTagsProps {
  tags: string[];
}

export default function BlogTags({ tags }: BlogTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <NeuroTag key={tag} isDisableAnimation={true}>{tag}</NeuroTag>
      ))}
    </div>
  );
}
