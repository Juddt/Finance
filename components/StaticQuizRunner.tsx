"use client";

import type { Locale } from "@/i18n/config";
import {
  createLocalSession,
  getLocalNextQuestion,
  getLocalSimilarQuestion,
  submitLocalAttempt,
} from "@/lib/quiz-engine-client";
import type { SessionSpec } from "@/lib/session-spec";
import { QuizShell, type QuizBackend, type QuizDict } from "./QuizShell";

/**
 * Build GitHub Pages (export statique) : correction 100% locale, persistée en
 * localStorage (voir lib/quiz-engine-client.ts). Rendu par components/
 * QuizSlot.tsx à la place de QuizRunner quand NEXT_PUBLIC_STATIC_EXPORT
 * === "1" — voir README, "Déploiement GitHub Pages".
 */
export function StaticQuizRunner({
  spec,
  locale,
  dict,
  emptyMessage,
}: {
  spec: SessionSpec;
  locale: Locale;
  dict: QuizDict;
  emptyMessage?: string;
}) {
  const backend: QuizBackend = {
    async start() {
      return createLocalSession(locale, spec);
    },
    async submitAttempt({ sessionId, instanceId, answer, counted }) {
      return submitLocalAttempt({
        sessionId,
        instanceId,
        answer,
        counted,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    },
    async next(sessionId) {
      return getLocalNextQuestion(sessionId);
    },
    async similar(sessionId) {
      return getLocalSimilarQuestion(sessionId);
    },
  };

  return <QuizShell locale={locale} dict={dict} backend={backend} emptyMessage={emptyMessage} />;
}
