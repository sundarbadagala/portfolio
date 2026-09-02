"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  Zap,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Code2,
  Atom,
  Globe,
  Palette,
  FileCode,
  Terminal,
  Cpu,
  Layers,
  ChevronRight,
  RefreshCw,
  Eye,
  Check,
  Flag,
} from "lucide-react";
import Container from "@/shared/components/Container";
import {
  getTestSubjects,
  generateTest,
  submitTest,
} from "@/features/ai/services";
import type {
  ITestSubject,
  ITestQuestion,
  ITestResult,
} from "@/features/ai/types";

type DifficultyLevel = "beginner" | "medium" | "advanced";
type QuestionCount = 5 | 10 | 15 | 20;
type ViewMode = "config" | "taking" | "result";

const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { label: string; badge: string; desc: string; color: string; ringColor: string }
> = {
  beginner: {
    label: "Beginner",
    badge: "Foundational",
    desc: "Core syntax, basic concepts & fundamental patterns",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    ringColor: "ring-emerald-500/50 border-emerald-500",
  },
  medium: {
    label: "Medium",
    badge: "Intermediate",
    desc: "Real-world scenarios, common pitfalls & best practices",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    ringColor: "ring-amber-500/50 border-amber-500",
  },
  advanced: {
    label: "Advanced",
    badge: "Expert",
    desc: "Architecture, internals, edge cases & performance optimization",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    ringColor: "ring-purple-500/50 border-purple-500",
  },
};

const QUESTION_COUNTS: QuestionCount[] = [5, 10, 15, 20];

const ACTIVE_TEST_STORAGE_KEY = "ai_active_test_session";

interface IStoredActiveTest {
  questions: ITestQuestion[];
  userAnswers: Record<string, string>;
  currentQuestionIndex: number;
  elapsedSeconds: number;
  selectedSubject: string;
  selectedLevel: DifficultyLevel;
  selectedCount: QuestionCount;
  timestamp: number;
}

// Dynamic subject icons
function getSubjectIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("react")) return <Atom className="w-6 h-6 text-sky-400" />;
  if (s.includes("next")) return <Globe className="w-6 h-6 text-white" />;
  if (s.includes("css")) return <Palette className="w-6 h-6 text-pink-400" />;
  if (s.includes("html")) return <FileCode className="w-6 h-6 text-orange-400" />;
  if (s.includes("type") || s.includes("ts")) return <Code2 className="w-6 h-6 text-blue-400" />;
  if (s.includes("node")) return <Terminal className="w-6 h-6 text-emerald-400" />;
  if (s.includes("java") || s.includes("js")) return <Zap className="w-6 h-6 text-yellow-400" />;
  return <Cpu className="w-6 h-6 text-primary-400" />;
}

export default function AiTestFeature() {
  // Screen state
  const [viewMode, setViewMode] = useState<ViewMode>("config");

  // Config selections
  const [subjects, setSubjects] = useState<ITestSubject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>("beginner");
  const [selectedCount, setSelectedCount] = useState<QuestionCount>(5);

  // Active test state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ITestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // question_id -> options_id
  const [showHint, setShowHint] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [testResult, setTestResult] = useState<ITestResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect">("all");

  // Fetch available subjects on mount
  useEffect(() => {
    let isMounted = true;

    async function loadSubjects() {
      setLoadingSubjects(true);
      setSubjectsError(null);
      try {
        const data = await getTestSubjects();
        if (isMounted) {
          setSubjects(data);
          if (data.length > 0) {
            setSelectedSubject(data[0].id);
          }
        }
      } catch (err) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Failed to load subjects";
          setSubjectsError(msg);
        }
      } finally {
        if (isMounted) {
          setLoadingSubjects(false);
        }
      }
    }

    loadSubjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Restore active test session from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_TEST_STORAGE_KEY);
      if (saved) {
        const parsed: IStoredActiveTest = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          setQuestions(parsed.questions);
          setUserAnswers(parsed.userAnswers || {});
          setCurrentQuestionIndex(
            typeof parsed.currentQuestionIndex === "number" &&
            parsed.currentQuestionIndex >= 0 &&
            parsed.currentQuestionIndex < parsed.questions.length
              ? parsed.currentQuestionIndex
              : 0
          );
          setElapsedSeconds(typeof parsed.elapsedSeconds === "number" ? parsed.elapsedSeconds : 0);
          if (parsed.selectedSubject) setSelectedSubject(parsed.selectedSubject);
          if (parsed.selectedLevel) setSelectedLevel(parsed.selectedLevel);
          if (parsed.selectedCount) setSelectedCount(parsed.selectedCount);
          setViewMode("taking");
        }
      }
    } catch (err) {
      console.warn("Failed to restore test session from localStorage:", err);
    }
  }, []);

  // Synchronize active test state with localStorage whenever in taking mode
  useEffect(() => {
    if (viewMode === "taking" && questions.length > 0) {
      const sessionData: IStoredActiveTest = {
        questions,
        userAnswers,
        currentQuestionIndex,
        elapsedSeconds,
        selectedSubject,
        selectedLevel,
        selectedCount,
        timestamp: Date.now(),
      };
      try {
        localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(sessionData));
      } catch (err) {
        console.warn("Failed to persist active test session to localStorage:", err);
      }
    }
  }, [
    viewMode,
    questions,
    userAnswers,
    currentQuestionIndex,
    elapsedSeconds,
    selectedSubject,
    selectedLevel,
    selectedCount,
  ]);

  // Timer for active test
  useEffect(() => {
    if (viewMode !== "taking" || isGenerating || isSubmitting) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, isGenerating, isSubmitting]);

  // Format timer
  const formattedTime = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [elapsedSeconds]);

  // Start Assessment
  const handleStartTest = async () => {
    if (!selectedSubject) return;

    setIsGenerating(true);
    setGenerationError(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setElapsedSeconds(0);
    setShowHint(false);

    try {
      const generated = await generateTest({
        subject: selectedSubject,
        level: selectedLevel,
        number_questions: selectedCount,
      });

      if (!generated || generated.length === 0) {
        throw new Error("No questions returned from generator");
      }

      setQuestions(generated);
      setViewMode("taking");

      // Save initial active session to localStorage
      try {
        const sessionData: IStoredActiveTest = {
          questions: generated,
          userAnswers: {},
          currentQuestionIndex: 0,
          elapsedSeconds: 0,
          selectedSubject,
          selectedLevel,
          selectedCount,
          timestamp: Date.now(),
        };
        localStorage.setItem(ACTIVE_TEST_STORAGE_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.warn("Could not cache initial session:", e);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate assessment";
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Option selection
  const handleSelectOption = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Current question data
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  // Submit test
  const handleSubmitTest = async () => {
    if (questions.length === 0) return;

    const testId = questions[0].test_id;
    if (!testId) {
      alert("Missing test session ID");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build submission questions with user's selected choice marked is_correct: true
      const submissionQuestions: ITestQuestion[] = questions.map((q) => {
        const selectedOptId = userAnswers[q.question_id];
        return {
          ...q,
          options: q.options.map((opt) => ({
            ...opt,
            is_correct: opt.options_id === selectedOptId,
          })),
        };
      });

      const result = await submitTest({
        test_id: testId,
        questions: submissionQuestions,
      });

      // Clear active test from localStorage upon successful submission
      try {
        localStorage.removeItem(ACTIVE_TEST_STORAGE_KEY);
      } catch (e) {
        console.warn("Failed to clear test session from localStorage:", e);
      }

      setTestResult(result);
      setViewMode("result");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit assessment";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to config
  const handleResetToConfig = () => {
    try {
      localStorage.removeItem(ACTIVE_TEST_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear test session from localStorage:", e);
    }
    setViewMode("config");
    setQuestions([]);
    setUserAnswers({});
    setTestResult(null);
    setElapsedSeconds(0);
    setGenerationError(null);
  };

  // Filtered review results
  const filteredReviewResults = useMemo(() => {
    if (!testResult?.results) return [];
    if (reviewFilter === "correct") {
      return testResult.results.filter((r) => r.is_correct);
    }
    if (reviewFilter === "incorrect") {
      return testResult.results.filter((r) => !r.is_correct);
    }
    return testResult.results;
  }, [testResult, reviewFilter]);

  const selectedSubjectObj = subjects.find((s) => s.id === selectedSubject);

  return (
    <Container className="px-4 py-8 max-w-6xl">
      {/* ========================================================================= */}
      {/* 1. CONFIGURATION VIEW                                                     */}
      {/* ========================================================================= */}
      {viewMode === "config" && (
        <div className="space-y-10 animate-fade-in">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-mono-800/80 via-mono-900 to-black p-8 md:p-12 shadow-2xl backdrop-blur-xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-400/30 bg-primary-500/10 text-primary-300 text-xs font-semibold mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Technical Assessments</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                Test Your Skills with{" "}
                <span className="bg-gradient-to-r from-primary-400 via-sky-300 to-secondary-400 bg-clip-text text-transparent">
                  Adaptive AI
                </span>
              </h1>
              <p className="text-base sm:text-lg text-text-300 leading-relaxed max-w-2xl">
                Generate tailored, real-world assessments for modern programming stacks.
                Choose your subject, target difficulty, and question count to begin.
              </p>
            </div>
          </div>

          {/* Setup Form */}
          <div className="space-y-8">
            {/* Step 1: Select Subject */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-500 text-white text-xs font-bold shadow-md shadow-primary-500/30">
                    1
                  </span>
                  <h2 className="text-xl font-bold text-white">Select Subject</h2>
                </div>
                {subjects.length > 0 && (
                  <span className="text-xs text-text-400 font-medium">
                    {subjects.length} subjects available
                  </span>
                )}
              </div>

              {loadingSubjects ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-32 rounded-2xl border border-white/5 bg-mono-800/40 animate-pulse p-5"
                    />
                  ))}
                </div>
              ) : subjectsError ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                  <p className="text-sm text-rose-200 font-medium mb-3">{subjectsError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((sub) => {
                    const isSelected = selectedSubject === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubject(sub.id)}
                        className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? "border-primary-400 bg-primary-500/15 shadow-lg shadow-primary-500/15 ring-2 ring-primary-400/40"
                            : "border-white/10 bg-mono-800/60 hover:border-white/25 hover:bg-mono-800/90"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="p-2.5 rounded-xl border border-white/10 bg-mono-900/80 group-hover:scale-105 transition-transform">
                            {getSubjectIcon(sub.slug || sub.id)}
                          </div>
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-text-300">
                            {sub.category || "Development"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                              {sub.name}
                            </h3>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-primary-400 animate-scale-in" />
                            )}
                          </div>
                          <p className="text-xs text-text-400 line-clamp-2 leading-relaxed">
                            {sub.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Select Level */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-500 text-white text-xs font-bold shadow-md shadow-primary-500/30">
                  2
                </span>
                <h2 className="text-xl font-bold text-white">Choose Difficulty</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["beginner", "medium", "advanced"] as DifficultyLevel[]).map((lvl) => {
                  const cfg = DIFFICULTY_CONFIG[lvl];
                  const isSelected = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? `bg-mono-800/90 shadow-xl ring-2 ${cfg.ringColor}`
                          : "border-white/10 bg-mono-800/50 hover:border-white/20 hover:bg-mono-800/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${cfg.color}`}
                        >
                          {cfg.badge}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{cfg.label}</h3>
                      <p className="text-xs text-text-400 leading-relaxed">{cfg.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Select Number of Questions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-500 text-white text-xs font-bold shadow-md shadow-primary-500/30">
                  3
                </span>
                <h2 className="text-xl font-bold text-white">Number of Questions</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {QUESTION_COUNTS.map((count) => {
                  const isSelected = selectedCount === count;
                  const approxMinutes = count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setSelectedCount(count)}
                      className={`p-5 rounded-2xl border text-center transition-all duration-200 ${
                        isSelected
                          ? "border-primary-400 bg-primary-500/20 text-white shadow-lg shadow-primary-500/20 ring-2 ring-primary-400"
                          : "border-white/10 bg-mono-800/50 text-text-300 hover:border-white/20 hover:bg-mono-800/80"
                      }`}
                    >
                      <div className="text-3xl font-extrabold mb-1 text-white">{count}</div>
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2">
                        Questions
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] text-text-400">
                        <Clock className="w-3 h-3" />
                        <span>~{approxMinutes} mins</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {generationError && (
              <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span>{generationError}</span>
              </div>
            )}

            {/* Launch Action Bar */}
            <div className="p-6 rounded-2xl border border-white/10 bg-mono-900/90 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
              <div className="flex flex-wrap items-center gap-3 text-sm text-text-300">
                <span className="text-white font-semibold">Configured:</span>
                <span className="px-3 py-1 rounded-lg border border-white/10 bg-mono-800 text-white font-medium text-xs">
                  {selectedSubjectObj?.name || selectedSubject}
                </span>
                <span className="px-3 py-1 rounded-lg border border-white/10 bg-mono-800 text-white font-medium capitalize text-xs">
                  {selectedLevel}
                </span>
                <span className="px-3 py-1 rounded-lg border border-white/10 bg-mono-800 text-white font-medium text-xs">
                  {selectedCount} Questions
                </span>
              </div>

              <button
                type="button"
                onClick={handleStartTest}
                disabled={!selectedSubject || isGenerating || loadingSubjects}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-lg shadow-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing with AI...</span>
                  </>
                ) : (
                  <>
                    <span>Start Assessment</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAKING ASSESSMENT VIEW                                                 */}
      {/* ========================================================================= */}
      {viewMode === "taking" && currentQuestion && (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          {/* Top Status Bar */}
          <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-mono-800/80 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl border border-white/10 bg-mono-900">
                {getSubjectIcon(currentQuestion.subject)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white capitalize">
                    {currentQuestion.subject} Assessment
                  </h3>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_CONFIG[selectedLevel].color}`}
                  >
                    {selectedLevel}
                  </span>
                </div>
                <div className="text-xs text-text-400">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-mono-900/80 text-xs font-mono font-medium text-white">
                <Clock className="w-3.5 h-3.5 text-primary-400" />
                <span>{formattedTime}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to quit this assessment? Your progress will not be saved.")) {
                    handleResetToConfig();
                  }
                }}
                className="text-xs text-text-400 hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10 transition-colors"
              >
                Quit
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-mono-800 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-primary-500 to-sky-400 h-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>

          {/* Main Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-mono-900/90 shadow-2xl backdrop-blur-xl relative">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white px-3 py-1 rounded-lg border border-white/10 bg-mono-800">
                  Q{currentQuestionIndex + 1}
                </span>
                {currentQuestion.concept && (
                  <span className="text-xs font-medium text-primary-300 px-3 py-1 rounded-lg border border-primary-400/20 bg-primary-500/10">
                    Concept: {currentQuestion.concept}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-text-400">
                Marks: {currentQuestion.marks || 1}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-8">
              {currentQuestion.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((opt, optIndex) => {
                const isSelected = userAnswers[currentQuestion.question_id] === opt.options_id;
                const letter = String.fromCharCode(65 + optIndex); // A, B, C, D

                return (
                  <button
                    key={opt.options_id}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.question_id, opt.options_id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                      isSelected
                        ? "border-primary-400 bg-primary-500/15 ring-2 ring-primary-400/30 text-white shadow-lg shadow-primary-500/10"
                        : "border-white/10 bg-mono-800/50 hover:border-white/25 hover:bg-mono-800 text-text-200"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold text-xs flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary-500 text-white shadow-md shadow-primary-500/40"
                          : "border border-white/10 bg-mono-900 text-text-400"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base font-medium leading-normal flex-1">
                      {opt.option_1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hint Accordion */}
            {currentQuestion.hint && (
              <div className="pt-4 border-t border-white/10">
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 font-medium transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Need a hint?</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-200 text-xs flex items-start gap-2.5">
                    <Zap className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold mr-1">Hint:</span>
                      <span>{currentQuestion.hint}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation & Question Grid Palette */}
          <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-mono-900/90 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                  setShowHint(false);
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 bg-mono-800 hover:bg-mono-700 disabled:opacity-30 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                disabled={currentQuestionIndex === totalQuestions - 1}
                onClick={() => {
                  setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                  setShowHint(false);
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/10 bg-mono-800 hover:bg-mono-700 disabled:opacity-30 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick jump dots */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.question_id];
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.question_id}
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setShowHint(false);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? "border-2 border-primary-400 bg-primary-500 text-white shadow-md shadow-primary-500/40 scale-110"
                        : isAnswered
                        ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                        : "border border-white/10 bg-mono-800 text-text-400 hover:border-white/20"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                if (answeredCount < totalQuestions) {
                  const unanswered = totalQuestions - answeredCount;
                  if (
                    !confirm(
                      `You still have ${unanswered} unanswered question(s). Are you sure you want to submit?`
                    )
                  ) {
                    return;
                  }
                }
                handleSubmitTest();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Grading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submit ({answeredCount}/{totalQuestions})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RESULT & REVIEW VIEW                                                   */}
      {/* ========================================================================= */}
      {viewMode === "result" && testResult && (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
          {/* Score Header Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-mono-800 via-mono-900 to-black p-8 md:p-10 shadow-2xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-4">
              <Award className="w-4 h-4" />
              <span>Assessment Completed</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Your Performance Score
            </h2>
            <p className="text-text-400 text-xs sm:text-sm mb-6">
              Subject: <span className="text-white capitalize font-semibold">{testResult.subject}</span> • Difficulty: <span className="text-white capitalize font-semibold">{testResult.level}</span>
            </p>

            {/* Score Big Display */}
            <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-primary-500/40 bg-gradient-to-b from-primary-500/10 to-transparent mb-6 shadow-xl shadow-primary-500/15">
              <span className="text-4xl sm:text-5xl font-extrabold text-white">
                {testResult.percentage}
              </span>
              <span className="text-xs font-semibold text-text-400 mt-1">
                {testResult.score} / {testResult.total_marks} Marks
              </span>
            </div>

            {/* Stats Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-3 rounded-xl border border-white/10 bg-mono-900/60">
                <div className="text-xs text-text-400 mb-1">Total Questions</div>
                <div className="text-xl font-bold text-white">{testResult.total_questions}</div>
              </div>
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <div className="text-xs text-emerald-300 mb-1">Correct</div>
                <div className="text-xl font-bold text-emerald-400">{testResult.correct}</div>
              </div>
              <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10">
                <div className="text-xs text-rose-300 mb-1">Incorrect</div>
                <div className="text-xl font-bold text-rose-400">{testResult.incorrect}</div>
              </div>
              <div className="p-3 rounded-xl border border-white/10 bg-mono-900/60">
                <div className="text-xs text-text-400 mb-1">Time Spent</div>
                <div className="text-xl font-bold text-white">{formattedTime}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button
                type="button"
                onClick={handleResetToConfig}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-primary-500/25 flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Assessment</span>
              </button>
              <button
                type="button"
                onClick={handleStartTest}
                className="px-6 py-3 rounded-xl border border-white/10 bg-mono-800 hover:bg-mono-700 text-white font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake This Subject</span>
              </button>
            </div>
          </div>

          {/* Question Review Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary-400" />
                <span>Detailed Question Review</span>
              </h3>

              {/* Review Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-mono-900 text-xs">
                <button
                  type="button"
                  onClick={() => setReviewFilter("all")}
                  className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                    reviewFilter === "all" ? "bg-white/10 text-white" : "text-text-400 hover:text-white"
                  }`}
                >
                  All ({testResult.results.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("correct")}
                  className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                    reviewFilter === "correct"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "text-text-400 hover:text-white"
                  }`}
                >
                  Correct ({testResult.correct})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("incorrect")}
                  className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                    reviewFilter === "incorrect"
                      ? "bg-rose-500/20 text-rose-300"
                      : "text-text-400 hover:text-white"
                  }`}
                >
                  Incorrect ({testResult.incorrect})
                </button>
              </div>
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {filteredReviewResults.map((r, idx) => (
                <div
                  key={r.question_id || idx}
                  className={`p-6 rounded-2xl border transition-all ${
                    r.is_correct
                      ? "border-emerald-500/30 bg-mono-900/90"
                      : "border-rose-500/30 bg-mono-900/90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white px-2.5 py-1 rounded-lg border border-white/10 bg-mono-800">
                        Q{idx + 1}
                      </span>
                      {r.concept && (
                        <span className="text-xs font-medium text-text-400">
                          {r.concept}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                        r.is_correct
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {r.is_correct ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct (+{r.marks_awarded || 1})</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect (0)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-white mb-4 leading-relaxed">
                    {r.question}
                  </h4>

                  <div className="space-y-2 text-xs sm:text-sm">
                    {/* User Answer */}
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-2 ${
                        r.is_correct
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                      }`}
                    >
                      <span className="font-bold flex-shrink-0">Your Answer:</span>
                      <span>
                        {r.user_selected_option
                          ? r.user_selected_option.option_1
                          : "Unattempted"}
                      </span>
                    </div>

                    {/* Correct Answer if user was wrong */}
                    {!r.is_correct && r.correct_option && (
                      <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 flex items-center gap-2">
                        <span className="font-bold flex-shrink-0">Correct Answer:</span>
                        <span>{r.correct_option.option_1}</span>
                      </div>
                    )}
                  </div>

                  {/* Hint / Explanation */}
                  {r.hint && (
                    <div className="mt-4 pt-3 border-t border-white/5 text-xs text-text-400 flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-text-200">Explanation:</strong> {r.hint}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
