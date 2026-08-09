"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/shared/lib/apiHandler";
import BottomSheet from "@/shared/components/BottomSheet";

function GroupTags() {
    const [groups, setGroups] = useState<string[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch groupby values from API on mount
    useEffect(() => {
        async function fetchGroups() {
            try {
                const res = await api.get("/api/v1/filters/groupby");
                const data = res.data as any;
                const fetchedGroups = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];
                setGroups(fetchedGroups);
            } catch (err) {
                console.error("Failed to fetch groupby values:", err);
            }
        }
        fetchGroups();
    }, []);

    // Close sheet when search filters (url query) change
    useEffect(() => {
        setIsSheetOpen(false);
    }, [searchParams]);

    const firstFive = groups.slice(0, 5);
    const remainingGroups = groups.slice(5);

    return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-4 shadow-sm mt-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                📁 Group Tags
            </h3>

            {groups.length > 0 ? (
                <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        {firstFive.map((g) => (
                            <button
                                key={g}
                                className="text-xs px-2.5 py-1 rounded-full border border-gray-300 dark:border-neutral-700 bg-transparent text-gray-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors font-medium"
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                    {groups.length > 5 && (
                        <button
                            onClick={() => setIsSheetOpen(true)}
                            className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all text-neutral-800 dark:text-neutral-200 w-full text-center"
                        >
                            All Groups (+{remainingGroups.length})
                        </button>
                    )}
                </div>
            ) : (
                <span className="text-xs text-neutral-400">Loading groups...</span>
            )}

            {/* Reusable Bottom Sheet component */}
            <BottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title={
                    <span className="font-semibold text-base flex items-center gap-2 text-neutral-850 dark:text-neutral-100">
                        📁 All Groups ({groups.length})
                    </span>
                }
            >
                <div className="flex flex-wrap gap-2 pt-2">
                    {groups.map((g) => (
                        <button
                            key={g}
                            className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-neutral-700 bg-transparent text-gray-650 dark:text-gray-450 hover:bg-neutral-100 dark:hover:bg-neutral-850 hover:text-neutral-800 dark:hover:text-neutral-150 transition-colors font-medium"
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </BottomSheet>
        </div>
    );
}

export default GroupTags;