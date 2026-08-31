"use client";

import { useEffect, useState } from "react";
import Container from "@/shared/components/Container";
import { getQandACategories, getQandASubCategories, getQandABySubCategory } from "@/features/q&a/services";
import type { Question } from "@/features/q&a/types";
import { motion, AnimatePresence } from "framer-motion";
import DifficultyFilter from "@/shared/components/difficutlyFilter";
import QAndAAccordion from "@/features/q&a/components/accordion";
import QAndASearch from "@/features/q&a/components/search";
import SubCategoryCard from "@/features/q&a/components/subCategoryCard";

export default function QuestionsHub() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [showSubCategoriesContent, setShowSubCategoriesContent] = useState(false);
    const [showQuestionsContent, setShowQuestionsContent] = useState(false);

    // Data states
    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);

    // Search & Filter states 
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState<"all" | "beginner" | "medium" | "high">("all");

    // Loading states
    const [loading, setLoading] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const fetched = await getQandACategories();
                setCategories(fetched);
            } catch (err) {
                console.error("Failed to load Q&A categories:", err);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Handle Category click: load subcategories
    const handleCategoryClick = async (category: string) => {
        setSelectedCategory(category);
        setShowSubCategoriesContent(false);
        setSelectedSubCategory(null);
        setShowQuestionsContent(false);
        setSearchQuery("");
        setLoading(true);

        setTimeout(() => {
            setShowSubCategoriesContent(true);
        }, 500);

        try {
            const fetched = await getQandASubCategories(category);
            setSubcategories(fetched);
        } catch (err) {
            console.error(`Failed to load subcategories for ${category}:`, err);
            setSubcategories([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle Subcategory click: load questions
    const handleSubCategoryClick = async (subCategory: string) => {
        setSelectedSubCategory(subCategory);
        setShowQuestionsContent(false);
        setSearchQuery("");
        setDifficultyFilter("all");
        setLoading(true);

        setTimeout(() => {
            setShowQuestionsContent(true);
        }, 500);

        try {
            const fetched = await getQandABySubCategory(subCategory);
            setQuestions(fetched);
        } catch (err) {
            console.error(`Failed to load questions for ${subCategory}:`, err);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Filters calculation
    const filteredCategories = categories.filter(cat =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredSubcategories = subcategories.filter(sub =>
        sub.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = difficultyFilter === "all" || q.level === difficultyFilter;
        return matchesSearch && matchesLevel;
    });

    return (
        <main className="min-h-screen py-10 ">
            <style dangerouslySetInnerHTML={{
                __html: `
        .accordion-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 240ms ease-out;
          opacity: 0;
        }
        .accordion-content.open {
          grid-template-rows: 1fr;
          opacity: 1;
        }
        .accordion-inner {
          overflow: hidden;
        }
      `}} />

            <Container>
                {/* Breadcrumb Navigation Trail */}
                {selectedCategory && (
                    <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm max-w-fit text-xs font-semibold text-neutral-400 dark:text-neutral-500 animate-slide-up select-none">
                        <button
                            onClick={() => { setSelectedCategory(null); setShowSubCategoriesContent(false); setSelectedSubCategory(null); setShowQuestionsContent(false); setSearchQuery(""); }}
                            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            Categories
                        </button>
                        <span>/</span>
                        <button
                            onClick={() => { handleCategoryClick(selectedCategory); setSelectedSubCategory(null); setSearchQuery(""); }}
                            className={`hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${!selectedSubCategory ? "text-primary-600 dark:text-primary-400 font-bold" : ""}`}
                        >
                            {selectedCategory}
                        </button>
                        {selectedSubCategory && (
                            <>
                                <span>/</span>
                                <span className="text-primary-600 dark:text-primary-400 font-bold">{selectedSubCategory}</span>
                            </>
                        )}
                    </div>
                )}

                {/* Categories Grid (Inline Expansion Container) */}
                <div>
                    {/* Header Title block: Only visible when no category is expanded */}
                    {!selectedCategory && (
                        <div className="text-left max-w-2xl mb-12 animate-slide-up">
                            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
                                Q&A Knowledge Hub
                            </h1>
                            <p className="mt-4 text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Select a category card to expand and explore topics, difficulty-rated questions, and interview problems.
                            </p>
                            <QAndASearch searchQuery={searchQuery} handleSearch={setSearchQuery} />
                        </div>
                    )}

                    {loading && categories.length === 0 ? (
                        <div className="flex flex-col items-start py-24">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
                            <p className="text-sm text-neutral-400 mt-4">Loading catalog...</p>
                        </div>
                    ) : !selectedCategory && filteredCategories.length === 0 ? (
                        <div className="text-left py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 max-w-md">
                            <p className="text-neutral-400 font-semibold text-lg">No categories found</p>
                            <p className="text-xs text-neutral-400 mt-1">Try refining your search query.</p>
                        </div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {categories.map((cat) => {
                                const isCatSelected = selectedCategory === cat;
                                const isSomeCatSelected = selectedCategory !== null;

                                if (isSomeCatSelected && !isCatSelected) {
                                    return null;
                                }

                                const meta = {
                                    icon: "📚",
                                    bg: "bg-primary-50 dark:bg-primary-950/20 border-primary-100",
                                    text: "text-primary-600 dark:text-primary-400",
                                    desc: "Explore interview questions, answers, and standard coding structures."
                                };

                                return (
                                    <motion.div
                                        layout
                                        key={cat}
                                        onClick={() => {
                                            if (!isCatSelected) handleCategoryClick(cat);
                                        }}
                                        className={
                                            isCatSelected
                                                ? "col-span-full w-full bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 p-6 md:p-8 rounded-3xl shadow-lg cursor-default"
                                                : "col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-primary-500/40 dark:hover:border-primary-500/30 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden relative group"
                                        }
                                    >
                                        {!isCatSelected && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        )}

                                        {/* Nested Subcategories List inside Expanded Category Card */}
                                        {isCatSelected ? (
                                            <div className="animate-slide-up">
                                                {/* Expanded Category Header */}
                                                <div className="flex flex-col md:flex-row md:items-center !justify-start gap-4 pb-6 border-b border-neutral-150 dark:border-neutral-800">
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${meta.bg} text-xl shadow-sm shrink-0`}>
                                                            {meta.icon}
                                                        </div>
                                                        <div>
                                                            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                                                {cat}
                                                            </h2>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Subcategory Grid Section */}
                                                <AnimatePresence>
                                                    {showSubCategoriesContent && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 15 }}
                                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                                            className="mt-8"
                                                        >
                                                            {loading && subcategories.length === 0 ? (
                                                                <div className="flex flex-col items-start py-16">
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                                                                    <p className="text-xs text-neutral-400 mt-3">Loading subtopics...</p>
                                                                </div>
                                                            ) : !selectedSubCategory && filteredSubcategories.length === 0 ? (
                                                                <div className="text-left py-12 bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-6">
                                                                    <p className="text-neutral-400 text-sm">No topics match search query.</p>
                                                                </div>
                                                            ) : (
                                                                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                                                    {filteredSubcategories.map((sub) => {
                                                                        const isSubSelected = selectedSubCategory === sub;
                                                                        const isSomeSubSelected = selectedSubCategory !== null;

                                                                        if (isSomeSubSelected && !isSubSelected) {
                                                                            return null;
                                                                        }

                                                                        return (
                                                                            <motion.div
                                                                                layout
                                                                                key={sub}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    if (!isSubSelected) handleSubCategoryClick(sub);
                                                                                }}
                                                                                className={
                                                                                    isSubSelected
                                                                                        ? "col-span-full w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-6 rounded-2xl shadow-inner cursor-default text-left"
                                                                                        : "col-span-1 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800/60 hover:border-primary-500/20 dark:hover:border-primary-500/10 hover:bg-neutral-50 dark:hover:bg-neutral-950 p-5 rounded-2xl shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer flex items-center justify-between text-left group"
                                                                                }
                                                                            >
                                                                                {isSubSelected ? (
                                                                                    <div className="animate-slide-up w-full">
                                                                                        {/* Subcategory Header */}
                                                                                        <div className="flex !justify-start md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                                                                            <div className="flex items-center gap-3" >
                                                                                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 text-lg shadow-sm border border-neutral-200/40 dark:border-neutral-800">
                                                                                                    📂
                                                                                                </span>
                                                                                                <div>
                                                                                                    <h4 className="font-bold text-lg text-neutral-800 dark:text-neutral-100">
                                                                                                        {sub}
                                                                                                    </h4>
                                                                                                    <p className="text-[10px] text-neutral-450 dark:text-neutral-500">
                                                                                                        {filteredQuestions.length} Questions found in this topic
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>

                                                                                        </div>

                                                                                        {/* Difficulty level filter & search row */}
                                                                                        <AnimatePresence>
                                                                                            {showQuestionsContent && (
                                                                                                <motion.div
                                                                                                    initial={{ opacity: 0, y: 15 }}
                                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                                    exit={{ opacity: 0, y: 15 }}
                                                                                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                                                                                    className="mt-6"
                                                                                                >
                                                                                                    <DifficultyFilter handleSelectDifficulty={(value: "all" | "beginner" | "medium" | "high") => {
                                                                                                        setDifficultyFilter(value);
                                                                                                    }}
                                                                                                        difficultyFilter={difficultyFilter}
                                                                                                    />

                                                                                                    {/* Questions accordion list */}
                                                                                                    <div className="space-y-4">
                                                                                                        {loading ? (
                                                                                                            <div className="flex items-center justify-start py-10">
                                                                                                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
                                                                                                            </div>
                                                                                                        ) : filteredQuestions.length === 0 ? (
                                                                                                            <div className="text-left py-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl">
                                                                                                                <p className="text-xs text-neutral-450">No questions match filter criteria.</p>
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <QAndAAccordion filteredQuestions={filteredQuestions} />
                                                                                                        )}
                                                                                                    </div>
                                                                                                </motion.div>
                                                                                            )}
                                                                                        </AnimatePresence>
                                                                                    </div>
                                                                                ) : (
                                                                                    /* Normal Subcategory Card Content */
                                                                                    <SubCategoryCard sub={sub} />
                                                                                )}
                                                                            </motion.div>
                                                                        );
                                                                    })}
                                                                </motion.div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            /* Normal Category Card Content */
                                            <div className="text-left flex flex-col justify-between h-full">
                                                <div className="flex items-center">
                                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${meta.bg} text-xl shadow-sm`}>
                                                        {meta.icon}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                        {cat}
                                                    </h3>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </Container>
        </main>
    );
}
