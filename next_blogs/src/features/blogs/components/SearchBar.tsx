"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from 'lucide-react';


export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("title") ?? "");
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const text = "search";
    let i = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      setPlaceholder(text.slice(0, i));
      if (!deleting) {
        i++;
        if (i > text.length) {
          deleting = true;
          timer = setTimeout(tick, 1400);
          return;
        }
      } else {
        i--;
        if (i < 0) {
          deleting = false;
          i = 0;
          timer = setTimeout(tick, 500);
          return;
        }
      }
      timer = setTimeout(tick, deleting ? 80 : 130);
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    const trimmed = query.trim();
    router.push(trimmed ? `/blogs?title=${encodeURIComponent(trimmed)}` : "/blogs");
  };

  return (
    <div className="pt-4 pb-2 overflow-hidden">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={placeholder}
          className="w-full pl-2 pr-16 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors"
        />
        <button
          onClick={handleSearch}
          style={{ borderRadius: "12px" }}
          className="absolute right-0.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
        >
           <Search/>
        </button>
      </div>
    </div>
  );
}
