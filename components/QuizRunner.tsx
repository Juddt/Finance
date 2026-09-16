"use client";

import type { Locale } from "@/i18n/config";
import type { QuestionView } from "@/lib/question-types";
import { QuizShell, type AttemptResponse, type QuizBackend, type QuizDict } from "./QuizShell";

/** Build normal (npm run dev / npm run build) : correction via les route handlers serveur. */
export function QuizRunner({
  conceptId,
  locale,
  questions,
  dict,
}: {
  conceptId: string;
  locale: Locale;
  questions: QuestionView[];
  dict: QuizDict;
}) {
  const backend: QuizBackend = {
    async createSession() {
      const res = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "course", locale, conceptIds: [conceptId] }),
      });
      const data = await res.json();
      return data.sessionId as string;
    },
    async submitAttempt({ sessionId, questionId, clientAttemptKey, answer, durationMs }) {
      const res = await fetch(`/api/study-sessions/${sessionId}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, clientAttemptKey, answer, durationMs }),
      });
      if (!res.ok) throw new Error("attempt_failed");
      return (await res.json()) as AttemptResponse;
    },
  };

  return <QuizShell locale={locale} questions={questions} dict={dict} backend={backend} />;
}
