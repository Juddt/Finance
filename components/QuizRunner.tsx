"use client";

import type { Locale } from "@/i18n/config";
import type { SessionSpec } from "@/lib/session-spec";
import { QuizShell, type QuizBackend, type QuizDict } from "./QuizShell";

/** Build normal (npm run dev / npm run build) : correction via les route handlers serveur. */
export function QuizRunner({
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
      const res = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec, locale }),
      });
      return res.json();
    },
    async submitAttempt({ sessionId, instanceId, answer, durationMs, counted }) {
      const res = await fetch(`/api/study-sessions/${sessionId}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId, answer, durationMs, counted }),
      });
      if (!res.ok) throw new Error("attempt_failed");
      return res.json();
    },
    async next(sessionId) {
      const res = await fetch(`/api/study-sessions/${sessionId}/next`, { method: "POST" });
      if (!res.ok) throw new Error("next_failed");
      return res.json();
    },
    async similar(sessionId) {
      const res = await fetch(`/api/study-sessions/${sessionId}/similar`, { method: "POST" });
      if (!res.ok) throw new Error("similar_failed");
      return res.json();
    },
  };

  return <QuizShell locale={locale} dict={dict} backend={backend} emptyMessage={emptyMessage} />;
}
