"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export interface ConceptScore {
  correct: number;
  total: number;
}

function colorClasses(pct: number): { text: string; badge: string } {
  if (pct >= 80) return { text: "text-emerald-700 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" };
  if (pct >= 50) return { text: "text-amber-700 dark:text-amber-400", badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" };
  return { text: "text-red-700 dark:text-red-400", badge: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300" };
}

/**
 * Ligne "notion" de la liste catalogue : lien coloré + note du dernier quiz
 * complété (voir lib/store.ts / lib/quiz-engine-client.ts), pour repérer une
 * mauvaise note et y retourner AVANT même d'ouvrir le cours (voir demande
 * utilisateur). Build serveur : score reçu en prop (calculé côté serveur).
 * Build statique GitHub Pages : pas de score en prop, lu en localStorage
 * après montage (même pattern que LiveStatTile).
 */
export function ConceptListEntry({
  href,
  title,
  conceptId,
  isPublished,
  comingSoonLabel,
  completedTitle,
  serverScore,
}: {
  href: string;
  title: string;
  conceptId: string;
  isPublished: boolean;
  comingSoonLabel: string;
  completedTitle: string;
  serverScore?: ConceptScore | null;
}) {
  const [score, setScore] = useState<ConceptScore | null>(serverScore ?? null);

  useEffect(() => {
    if (!isStaticExport || !isPublished) return;
    import("@/lib/quiz-engine-client").then(({ getLocalConceptQuizScores }) => {
      const local = getLocalConceptQuizScores()[conceptId];
      if (local) setScore({ correct: local.correct, total: local.total });
    });
  }, [conceptId, isPublished]);

  const pct = score && score.total > 0 ? Math.round((score.correct / score.total) * 100) : null;
  const colors = pct !== null ? colorClasses(pct) : null;

  return (
    <li className="flex items-center justify-between gap-2">
      {isPublished ? (
        <Link
          href={href}
          title={score ? completedTitle : undefined}
          className={`underline-offset-2 hover:underline ${colors ? colors.text : "text-neutral-800 dark:text-neutral-100"}`}
        >
          {score && <span aria-hidden="true">✓ </span>}
          {title}
        </Link>
      ) : (
        <span className="text-neutral-500 dark:text-neutral-400">{title}</span>
      )}
      <span className="shrink-0 text-xs text-neutral-400">
        {!isPublished ? (
          comingSoonLabel
        ) : score && colors ? (
          <span className={`rounded-full px-2 py-0.5 font-medium ${colors.badge}`}>
            {score.correct}/{score.total}
          </span>
        ) : null}
      </span>
    </li>
  );
}
