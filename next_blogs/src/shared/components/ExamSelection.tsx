"use client";

import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Check,
  Atom,
  Globe,
  Palette,
  FileCode,
  Code2,
  Terminal,
  Zap,
  Cpu,
} from "lucide-react";
import type {
  ITestSubject,
  DifficultyLevel,
  QuestionCount,
} from "@/features/ai/types";

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

export interface ExamSelectionProps {
  subjects: ITestSubject[];
  loadingSubjects: boolean;
  subjectsError?: string | null;
  selectedSubject: string;
  onSelectSubject: (subjectId: string) => void;
  selectedLevel: DifficultyLevel;
  onSelectLevel: (level: DifficultyLevel) => void;
  selectedCount: QuestionCount;
  onSelectCount: (count: QuestionCount) => void;
  isGenerating?: boolean;
  generationError?: string | null;
  onStartTest: () => void;
}

export default function ExamSelection({
  subjects,
  loadingSubjects,
  subjectsError,
  selectedSubject,
  onSelectSubject,
  selectedLevel,
  onSelectLevel,
  selectedCount,
  onSelectCount,
  isGenerating = false,
  generationError,
  onStartTest,
}: ExamSelectionProps) {
  const selectedSubjectObj = subjects.find((s) => s.id === selectedSubject);

  return (
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
                    onClick={() => onSelectSubject(sub.id)}
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
                  onClick={() => onSelectLevel(lvl)}
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
                  onClick={() => onSelectCount(count)}
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
            onClick={onStartTest}
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
  );
}
