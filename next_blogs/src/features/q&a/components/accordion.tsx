import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import FormattedAnswer from "@/shared/components/FormattedAnswer";
import type { Question } from "@/features/q&a/types";

interface QAndAAccordionProps {
    filteredQuestions: Question[];
}

function QAndAAccordion({ filteredQuestions }: QAndAAccordionProps) {
    const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
    const getLevelBadge = (level: string) => {
        switch (level) {
            case "beginner":
                return { text: "Basic", bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30", dot: "bg-emerald-500" };
            case "medium":
                return { text: "Medium", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30", dot: "bg-amber-500" };
            case "high":
                return { text: "Advanced", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30", dot: "bg-rose-500" };
            default:
                return { text: "Basic", bg: "bg-neutral-50 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 border border-neutral-200/50", dot: "bg-neutral-400" };
        }
    };
    return (
        <>
            {
                filteredQuestions.map((q: Question, qIdx: number) => {
                    const isQuestionOpen = openQuestionId === q.question_id;
                    const badge = getLevelBadge(q.level);
                    const displayIndex = String(qIdx + 1).padStart(2, "0");

                    return (
                        <div
                            key={q.question_id}
                            className={`border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 bg-white dark:bg-neutral-900 ${isQuestionOpen
                                ? "border-primary-500/25 ring-2 ring-primary-500/5"
                                : "hover:border-neutral-350 dark:hover:border-neutral-700"
                                }`}
                            onClick={(e) => e.stopPropagation()} // Prevent toggling parent subcategory
                        >
                            {/* Question Header button */}
                            <button
                                onClick={() => setOpenQuestionId(isQuestionOpen ? null : q.question_id)}
                                className="w-full px-5 py-4 flex items-center !justify-between !text-left focus:outline-none"

                            >
                                <div className="flex items-center gap-3 pr-4">
                                    <span className="font-mono text-xs font-bold text-neutral-300 dark:text-neutral-600">
                                        {displayIndex}
                                    </span>
                                    <span className="font-bold text-sm text-neutral-800 dark:text-neutral-100 leading-snug">
                                        {/* {q.question} */}
                                        <FormattedAnswer content={q.question} />
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 shrink-0">
                                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${badge.bg}`}>
                                        {badge.text}
                                    </span>
                                    <span className="text-neutral-400">
                                        {isQuestionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </span>
                                </div>
                            </button>

                            {/* Expanded Answer Body */}
                            <div className={`accordion-content ${isQuestionOpen ? "open" : ""}`}>
                                <div className="accordion-inner">
                                    <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                        <FormattedAnswer content={q.answer} />

                                        {/* <div dangerouslySetInnerHTML={{ __html: q.answer }} /> */}


                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </>
    )
}

export default QAndAAccordion;