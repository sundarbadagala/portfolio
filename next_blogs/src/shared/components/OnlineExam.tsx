"use client";

import { useState, useMemo } from "react";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Zap,
  Atom,
  Globe,
  Palette,
  FileCode,
  Code2,
  Terminal,
  Cpu,
} from "lucide-react";
import type { ITestQuestion, DifficultyLevel } from "@/features/ai/types";

const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { label: string; badge: string; color: string }
> = {
  beginner: {
    label: "Beginner",
    badge: "Foundational",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  medium: {
    label: "Medium",
    badge: "Intermediate",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  advanced: {
    label: "Advanced",
    badge: "Expert",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
};

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

export interface OnlineExamProps {
  questions: ITestQuestion[];
  userAnswers: Record<string, string>;
  onSelectOption: (questionId: string, optionId: string) => void;
  currentQuestionIndex: number;
  onQuestionChange: (index: number) => void;
  elapsedSeconds: number;
  level?: DifficultyLevel;
  isSubmitting?: boolean;
  onSubmit: () => void;
  onQuit: () => void;
}

export default function OnlineExam({
  questions,
  userAnswers,
  onSelectOption,
  currentQuestionIndex,
  onQuestionChange,
  elapsedSeconds,
  level = "beginner",
  isSubmitting = false,
  onSubmit,
  onQuit,
}: OnlineExamProps) {
  const [showHint, setShowHint] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;

  const formattedTime = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [elapsedSeconds]);

  if (!currentQuestion) {
    return null;
  }

  const diffConfig = DIFFICULTY_CONFIG[level] || DIFFICULTY_CONFIG.beginner;

  return (
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
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${diffConfig.color}`}
              >
                {diffConfig.label}
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
            onClick={onQuit}
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
                onClick={() => onSelectOption(currentQuestion.question_id, opt.options_id)}
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
              onQuestionChange(Math.max(0, currentQuestionIndex - 1));
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
              onQuestionChange(Math.min(totalQuestions - 1, currentQuestionIndex + 1));
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
                  onQuestionChange(idx);
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
            onSubmit();
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5"
        >
          {isSubmitting ? (
            <>
              <Clock className="w-3.5 h-3.5 animate-spin" />
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
  );
}
