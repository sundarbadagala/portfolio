"use client";

import { KeyboardEvent, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";


export default function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<"search" | "ai">("search");

    const handleSearch = () => {
        try {
            const trimmed = query.trim();
            if (!trimmed) return router.push("/blogs")
            if (mode === 'search') return router.push(`/blogs?title=${encodeURIComponent(trimmed)}`);
            if (mode === 'ai') return router.push(`/blogs?query=${encodeURIComponent(trimmed)}`);
        } catch (error) {
            console.error(error);
            router.push("/blogs")
        }
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex justify-center mt-4">
            <div className="w-full max-w-4xl">
                <div className="flex items-center rounded-full border border-neutral-300 bg-white px-5 py-3 shadow-sm transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:focus-within:border-violet-500 dark:focus-within:ring-violet-500/20">
                    {/* Left Icon */}
                    {mode === "search" ? (
                        <Search
                            size={20}
                            className="text-neutral-500 dark:text-neutral-400"
                        />
                    ) : (
                        <Sparkles
                            size={20}
                            className="text-violet-500"
                        />
                    )}

                    {/* Input */}
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder={
                            mode === "search"
                                ? "Search By Title..."
                                : "Search By AI..."
                        }
                        className="flex-1 bg-transparent px-4 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500"
                    />

                    {/* Search / AI Toggle */}
                    <div className="flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
                        <button
                            onClick={() => setMode("search")}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${mode === "search"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-neutral-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700"
                                }`}
                        >
                            Search
                        </button>

                        <button
                            onClick={() => setMode("ai")}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${mode === "ai"
                                ? "bg-violet-600 text-white shadow-sm"
                                : "text-neutral-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700"
                                }`}
                        >
                            AI Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}