"use client";
import { useEffect, useState } from "react";
import Container from "@/shared/components/Container";
import { api } from "@/shared/lib/apiHandler";
import { Accordion } from "@/shared/components/Accordion";

interface QandAType {
    question_id: string;
    question: string;
    answer: string;
    category: string;
    sub_category: string;
}

function QandA() {
    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [questions, setQuestions] = useState<QandAType[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isSubcategoriesOpen, setIsSubcategoriesOpen] = useState(false);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        (async () => {
            setLoadingCategories(true);
            try {
                const res = await api.get("/api/v1/qanda/categories");
                const payload = res.data as { data: string[] };
                setCategories(payload?.data || []);
            } catch (err) {
                console.error("Failed to load Q&A categories:", err);
            } finally {
                setLoadingCategories(false);
            }
        })();
    }, []);

    // Fetch subcategories when selectedCategory changes
    const handleCategoryClick = async (category: string) => {
        setSelectedCategory(category);
        setSelectedSubCategory(null);
        setLoadingSubcategories(true);
        setIsSubcategoriesOpen(true); // Open subcategories drawer
        try {
            const res = await api.get("/api/v1/qanda/subcategories", {
                params: { category }
            });
            const payload = res.data as { data: string[] };
            setSubcategories(payload?.data || []);
        } catch (err) {
            console.error("Failed to load subcategories:", err);
        } finally {
            setLoadingSubcategories(false);
        }
    };

    // Fetch questions when selectedSubCategory changes
    const handleSubCategoryClick = async (subCategory: string) => {
        setSelectedSubCategory(subCategory);
        setLoadingQuestions(true);
        setIsSubcategoriesOpen(false); // Close drawers
        setIsCategoriesOpen(false);
        try {
            const res = await api.get("/api/v1/qanda/by-subcategory", {
                params: { sub_category: subCategory }
            });
            const payload = res.data as { data: QandAType[] };
            setQuestions(payload?.data || []);
        } catch (err) {
            console.error("Failed to load Q&As by subcategory:", err);
        } finally {
            setLoadingQuestions(false);
        }
    };

    return (
        <main className="min-h-screen mt-4 pb-12">
            <Container>
                {/* Topbar */}
                <div className="flex flex-col md:flex-row !justify-between items-start md:items-center gap-4 mb-4 mt-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Interview Questions</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Interview Preparation Questions
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsCategoriesOpen(true);
                            setIsSubcategoriesOpen(false);
                        }}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                    >
                        Browse Categories
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm min-h-[400px]">
                    {selectedSubCategory ? (
                        <div>
                            {/* Breadcrumbs */}
                            <div className="mb-4 text-xs font-semibold text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
                                <span>{selectedCategory}</span>
                                <span>&rarr;</span>
                                <span className="text-primary-600 dark:text-primary-400">{selectedSubCategory}</span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Questions in &ldquo;{selectedSubCategory}&rdquo;
                                </h3>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Total of {questions.length} question(s) found
                                </p>
                            </div>

                            {loadingQuestions ? (
                                <p className="text-sm text-neutral-400 text-center py-12">Loading questions...</p>
                            ) : questions.length === 0 ? (
                                <p className="text-sm text-neutral-400 text-center py-12">No questions found under this subcategory.</p>
                            ) : (
                                <Accordion
                                    items={questions.map((item) => ({
                                        id: item.question_id,
                                        title: item.question,
                                        content: item.answer,
                                    }))}
                                    isHtml={true}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[350px] text-center">
                            <span className="text-5xl mb-4">📂</span>
                            <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-300">Browse Q&A Topics</h3>
                            <p className="text-sm text-neutral-400 mt-2 max-w-[340px] leading-relaxed">
                                Click the &ldquo;Browse Categories&rdquo; button above to open the drawers and select a category and subcategory.
                            </p>
                        </div>
                    )}
                </div>

                {/* Categories Side Drawer */}
                {isCategoriesOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => {
                                setIsCategoriesOpen(false);
                                setIsSubcategoriesOpen(false);
                            }}
                        />

                        {/* Drawer body */}
                        <div className="relative w-80 max-w-sm bg-white dark:bg-neutral-900 h-full p-6 shadow-2xl flex flex-col transition-transform duration-300 z-10 border-r border-neutral-200 dark:border-neutral-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Categories</h2>
                                <button
                                    onClick={() => {
                                        setIsCategoriesOpen(false);
                                        setIsSubcategoriesOpen(false);
                                    }}
                                    className="p-1 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2">
                                {loadingCategories ? (
                                    <p className="text-sm text-neutral-400">Loading categories...</p>
                                ) : categories.length === 0 ? (
                                    <p className="text-sm text-neutral-400">No categories found.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {categories.map((cat) => (
                                            <li key={cat}>
                                                <button
                                                    onClick={() => handleCategoryClick(cat)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${selectedCategory === cat
                                                        ? "bg-primary-600 text-white shadow-sm"
                                                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                        }`}
                                                >
                                                    <span>{cat}</span>
                                                    <span>&rarr;</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Subcategories Drawer (attached next to categories drawer) */}
                        {isSubcategoriesOpen && selectedCategory && (
                            <div className="relative w-80 max-w-sm bg-neutral-50 dark:bg-neutral-950 h-full p-6 shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800 z-20">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Subcategories</h2>
                                        <p className="text-xs text-neutral-400 mt-1">{selectedCategory}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsSubcategoriesOpen(false)}
                                        className="p-1 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2">
                                    {loadingSubcategories ? (
                                        <p className="text-sm text-neutral-400">Loading subcategories...</p>
                                    ) : subcategories.length === 0 ? (
                                        <p className="text-sm text-neutral-400">No subcategories found.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {subcategories.map((sub) => (
                                                <li key={sub}>
                                                    <button
                                                        onClick={() => handleSubCategoryClick(sub)}
                                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between"
                                                    >
                                                        <span>{sub}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </main>
    );
}

export default QandA;