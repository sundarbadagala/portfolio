interface BlogTagsProps {
  tags: string[];
}

export default function BlogTags({ tags }: BlogTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-xs px-3 py-1 rounded-full
            text-gray-500 dark:text-gray-400
            shadow-[inset_3px_3px_6px_#c9c7c8,inset_-3px_-3px_6px_#ffffff]
            dark:shadow-[inset_3px_3px_6px_#1a1a1a,inset_-3px_-3px_6px_#3d3d3d]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
