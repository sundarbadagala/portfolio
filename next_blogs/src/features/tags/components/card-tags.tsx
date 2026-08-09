"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BlogTags from "@/features/blogs/components/BlogTags";
import BottomSheet from "@/shared/components/BottomSheet";
import { getAllContentTags, type Tag } from "../services";

function CardTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const searchParams = useSearchParams();

  // Fetch tags from API on mount
  useEffect(() => {
    async function fetchTags() {
      try {
        const fetchedTags = await getAllContentTags();
        setTags(fetchedTags);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    }
    fetchTags();
  }, []);

  // Close sheet when search filters (url query) change
  useEffect(() => {
    setIsSheetOpen(false);
  }, [searchParams]);

  const firstFive = tags.slice(0, 5);
  const remainingTags = tags.slice(5);

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-4 shadow-sm">
      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
        🏷️ Popular Tags
      </h3>

      {tags.length > 0 ? (
        <div className="flex flex-col items-start gap-2">
          <BlogTags tags={firstFive} />
          {tags.length > 5 && (
            <button
              onClick={() => setIsSheetOpen(true)}
              className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all text-neutral-800 dark:text-neutral-200 w-full text-center"
            >
              All Tags (+{remainingTags.length})
            </button>
          )}
        </div>
      ) : (
        <span className="text-xs text-neutral-400">Loading tags...</span>
      )}

      {/* Reusable Bottom Sheet component */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={
          <span className="font-semibold text-base flex items-center gap-2 text-neutral-850 dark:text-neutral-100">
            🏷️ All Tags ({tags.length})
          </span>
        }
      >
        <BlogTags tags={tags} />
      </BottomSheet>
    </div>
  );
}

export default CardTags;