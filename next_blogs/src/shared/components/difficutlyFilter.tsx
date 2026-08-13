import { Filter } from "lucide-react";

interface DifficultyFilterProps {
    handleSelectDifficulty: (value: "all" | "beginner" | "medium" | "high") => void;
    difficultyFilter: "all" | "beginner" | "medium" | "high";
}

function DifficultyFilter({ handleSelectDifficulty, difficultyFilter }: DifficultyFilterProps) {
    return (
        <>
            <div className="mb-6" id='difficulty-level'>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-neutral-500 text-xs flex items-center gap-1">
                        <Filter size={12} /> Difficulty:
                    </span>
                    {[
                        { value: "all", label: "All" },
                        { value: "beginner", label: "Basic", dotColor: "bg-emerald-500" },
                        { value: "medium", label: "Medium", dotColor: "bg-amber-500" },
                        { value: "high", label: "Advanced", dotColor: "bg-rose-500" }
                    ].map(opt => (
                        <button
                            key={opt.value}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectDifficulty(opt.value as "all" | "beginner" | "medium" | "high")
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${difficultyFilter === opt.value
                                ? "bg-primary-600 text-white shadow-sm"
                                : "bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
                                }`}
                        >
                            {opt.dotColor && <span className={`w-1.5 h-1.5 rounded-full ${opt.dotColor}`} />}
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default DifficultyFilter;