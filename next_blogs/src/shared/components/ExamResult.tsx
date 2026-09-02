"use client";

import { useState, useMemo } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RefreshCw,
  Eye,
  Zap,
} from "lucide-react";
import type { ITestResult } from "@/features/ai/types";

export interface ExamResultProps {
  result: ITestResult;
  timeSpent?: string;
  onReset: () => void;
  onRetake: () => void;
}

export default function ExamResult({
  result,
  timeSpent = "00:00",
  onReset,
  onRetake,
}: ExamResultProps) {
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect">("all");

  const filteredResults = useMemo(() => {
    if (!result?.results) return [];
    if (reviewFilter === "correct") {
      return result.results.filter((r) => r.is_correct);
    }
    if (reviewFilter === "incorrect") {
      return result.results.filter((r) => !r.is_correct);
    }
    return result.results;
  }, [result, reviewFilter]);

  return (
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
          Subject: <span className="text-white capitalize font-semibold">{result.subject}</span> • Difficulty: <span className="text-white capitalize font-semibold">{result.level}</span>
        </p>

        {/* Score Big Display */}
        <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-primary-500/40 bg-gradient-to-b from-primary-500/10 to-transparent mb-6 shadow-xl shadow-primary-500/15">
          <span className="text-4xl sm:text-5xl font-extrabold text-white">
            {result.percentage}
          </span>
          <span className="text-xs font-semibold text-text-400 mt-1">
            {result.score} / {result.total_marks} Marks
          </span>
        </div>

        {/* Stats Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <div className="p-3 rounded-xl border border-white/10 bg-mono-900/60">
            <div className="text-xs text-text-400 mb-1">Total Questions</div>
            <div className="text-xl font-bold text-white">{result.total_questions}</div>
          </div>
          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <div className="text-xs text-emerald-300 mb-1">Correct</div>
            <div className="text-xl font-bold text-emerald-400">{result.correct}</div>
          </div>
          <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10">
            <div className="text-xs text-rose-300 mb-1">Incorrect</div>
            <div className="text-xl font-bold text-rose-400">{result.incorrect}</div>
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-mono-900/60">
            <div className="text-xs text-text-400 mb-1">Time Spent</div>
            <div className="text-xl font-bold text-white">{timeSpent}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-primary-500/25 flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take Another Assessment</span>
          </button>
          <button
            type="button"
            onClick={onRetake}
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
              All ({result.results.length})
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
              Correct ({result.correct})
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
              Incorrect ({result.incorrect})
            </button>
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-4">
          {filteredResults.map((r, idx) => (
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
  );
}
