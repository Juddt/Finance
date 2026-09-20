"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export interface ConceptScore {
  correct: number;
  total: number;
}

function scoreTone(pct: number): { text: string; badgeBg: string; badgeText: string } {
  if (pct >= 80) return { text: "text-gain", badgeBg: "bg-gain-soft", badgeText: "text-gain" };
  if (pct >= 50) return { text: "text-mid", badgeBg: "bg-mid-soft", badgeText: "text-mid" };
  return { text: "text-loss", badgeBg: "bg-loss-soft", badgeText: "text-loss" };
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
  const tone = pct !== null ? scoreTone(pct) : null;

  return (
    <li className="flex items-center justify-between gap-2 py-1">
      {isPublished ? (
        <Link
          href={href}
          title={score ? completedTitle : undefined}
          className={`tick-underline pb-0.5 ${tone ? tone.text : "text-ink"}`}
        >
          {score && (
            <span aria-hidden="true" className="mr-1 font-mono text-[10px]">
              &#9632;
            </span>
          )}
          {title}
        </Link>
      ) : (
        <span className="text-ink-faint">{title}</span>
      )}
      <span className="shrink-0 font-mono text-[10px] text-ink-faint">
        {!isPublished ? (
          comingSoonLabel
        ) : score && tone ? (
          <span className={`px-1.5 py-0.5 font-semibold tracking-wide ${tone.badgeBg} ${tone.badgeText}`}>
            {score.correct}/{score.total}
          </span>
        ) : null}
      </span>
    </li>
  );
}
