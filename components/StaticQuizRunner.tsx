"use client";

import type { Locale } from "@/i18n/config";
import { createLocalSessionId, submitLocalAttempt } from "@/lib/quiz-engine-client";
import type { QuestionView } from "@/lib/question-types";
import { QuizShell, type QuizBackend, type QuizDict } from "./QuizShell";

/**
 * Build GitHub Pages (export statique) : correction 100% locale, persistée en
 * localStorage (voir lib/quiz-engine-client.ts). Rendu par
 * app/[locale]/lessons/[conceptId]/page.tsx à la place de QuizRunner quand
 * NEXT_PUBLIC_STATIC_EXPORT === "1" — voir README, "Déploiement GitHub Pages".
 */
export function StaticQuizRunner({
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
      return createLocalSessionId();
    },
    async submitAttempt({ questionId, clientAttemptKey, answer }) {
      return submitLocalAttempt({
        questionId,
        clientAttemptKey,
        answer,
        locale,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    },
  };

  return <QuizShell locale={locale} questions={questions} dict={dict} backend={backend} />;
}
