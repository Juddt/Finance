"use client";

import { useEffect, useState } from "react";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export interface ConceptScore {
  correct: number;
  total: number;
}

function scoreTone(pct: number): { border: string; bg: string; text: string } {
  if (pct >= 80) return { border: "border-gain", bg: "bg-gain-soft", text: "text-gain" };
  if (pct >= 50) return { border: "border-mid", bg: "bg-mid-soft", text: "text-mid" };
  return { border: "border-loss", bg: "bg-loss-soft", text: "text-loss" };
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
  const tone = scoreTone(pct);

  return (
    <div className={`mb-8 flex flex-wrap items-center justify-between gap-3 border-l-2 ${tone.border} ${tone.bg} px-4 py-3`}>
      <span className={`font-mono text-[12px] font-semibold tracking-[0.06em] ${tone.text}`}>
        {label}: {score.correct}/{score.total} &middot; {pct}%
      </span>
      <a href={retryHref} className="tick-underline font-mono text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
        {retryLabel}
      </a>
    </div>
  );
}
