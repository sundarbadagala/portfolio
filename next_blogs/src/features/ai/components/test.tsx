"use client";

import { useEffect, useState, useMemo } from "react";
import Container from "@/shared/components/Container";
import OnlineExam from "@/shared/components/OnlineExam";
import ExamResult from "@/shared/components/ExamResult";
import ExamSelection from "@/shared/components/ExamSelection";
import {
  getTestSubjects,
  generateTest,
  submitTest,
} from "@/features/ai/services";
import type {
  ITestSubject,
  ITestQuestion,
  ITestResult,
  DifficultyLevel,
  QuestionCount,
  ViewMode,
  IStoredActiveTest,
} from "@/features/ai/types";

const ACTIVE_TEST_STORAGE_KEY = "ai_active_test_session";

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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [testResult, setTestResult] = useState<ITestResult | null>(null);

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

  return (
    <Container className="px-4 py-8 max-w-6xl">
      {/* ========================================================================= */}
      {/* 1. SELECTION & CONFIGURATION VIEW (SHARED REUSABLE COMPONENT)              */}
      {/* ========================================================================= */}
      {viewMode === "config" && (
        <ExamSelection
          subjects={subjects}
          loadingSubjects={loadingSubjects}
          subjectsError={subjectsError}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          selectedLevel={selectedLevel}
          onSelectLevel={setSelectedLevel}
          selectedCount={selectedCount}
          onSelectCount={setSelectedCount}
          isGenerating={isGenerating}
          generationError={generationError}
          onStartTest={handleStartTest}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. TAKING ASSESSMENT VIEW (SHARED REUSABLE COMPONENT)                     */}
      {/* ========================================================================= */}
      {viewMode === "taking" && questions.length > 0 && (
        <OnlineExam
          questions={questions}
          userAnswers={userAnswers}
          onSelectOption={handleSelectOption}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionChange={setCurrentQuestionIndex}
          elapsedSeconds={elapsedSeconds}
          level={selectedLevel}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitTest}
          onQuit={() => {
            if (confirm("Are you sure you want to quit this assessment? Your progress will not be saved.")) {
              handleResetToConfig();
            }
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. RESULT & REVIEW VIEW (SHARED REUSABLE COMPONENT)                       */}
      {/* ========================================================================= */}
      {viewMode === "result" && testResult && (
        <ExamResult
          result={testResult}
          timeSpent={formattedTime}
          onReset={handleResetToConfig}
          onRetake={handleStartTest}
        />
      )}
    </Container>
  );
}
