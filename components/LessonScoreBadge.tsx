"use client";

import { useEffect, useState } from "react";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export interface ConceptScore {
  correct: number;
  total: number;
}

function colorClasses(pct: number): string {
  if (pct >= 80) return "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100";
  if (pct >= 50) return "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100";
  return "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100";
}

/**
 * Badge affiché en haut de la page notion, rappelant le résultat du dernier
 * quiz complété pour cette notion (voir ConceptListEntry pour la même note
 * dans le catalogue). Même pattern serveur/statique que ConceptListEntry.
 */
export function LessonScoreBadge({
  conceptId,
  label,
  retryHref,
  retryLabel,
  serverScore,
}: {
  conceptId: string;
  label: string;
  retryHref: string;
  retryLabel: string;
  serverScore?: ConceptScore | null;
}) {
  const [score, setScore] = useState<ConceptScore | null>(serverScore ?? null);

  useEffect(() => {
    if (!isStaticExport) return;
    import("@/lib/quiz-engine-client").then(({ getLocalConceptQuizScores }) => {
      const local = getLocalConceptQuizScores()[conceptId];
      if (local) setScore({ correct: local.correct, total: local.total });
    });
  }, [conceptId]);

  if (!score || score.total === 0) return null;
  const pct = Math.round((score.correct / score.total) * 100);

  return (
    <div className={`mb-6 flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-sm ${colorClasses(pct)}`}>
      <span className="font-medium">
        {label}: {score.correct}/{score.total} ({pct}%)
      </span>
      <a href={retryHref} className="text-xs font-semibold underline-offset-2 hover:underline">
        {retryLabel}
      </a>
    </div>
  );
}
