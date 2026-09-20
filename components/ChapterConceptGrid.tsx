"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { ConceptStatus } from "@/lib/srs";
import { STATUS_DOT_COLOR, STATUS_TEXT_COLOR } from "@/lib/concept-status-style";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export interface ChapterConceptGridDict {
  upcoming: string;
  statusToDiscover: string;
  statusInProgress: string;
  statusFragile: string;
  statusMastered: string;
  statusToReactivate: string;
  masteredCount: string;
}

export interface ChapterGridConcept {
  id: string;
  title: string;
  published: boolean;
}

/**
 * Mosaïque des notions d'un chapitre : 3 colonnes desktop, 2 tablette,
 * 1 petit mobile. Toute la carte est cliquable ; le statut vient des
 * mêmes données que ProgressBoard (voir demande section 2).
 */
export function ChapterConceptGrid({
  locale,
  concepts,
  serverProgress,
  dict,
}: {
  locale: Locale;
  concepts: ChapterGridConcept[];
  serverProgress: Record<string, ConceptStatus>;
  dict: ChapterConceptGridDict;
}) {
  const [progress, setProgress] = useState<Record<string, ConceptStatus>>(serverProgress);

  useEffect(() => {
    if (!isStaticExport) return;
    import("@/lib/quiz-engine-client").then(({ getLocalConceptProgress }) => {
      setProgress(getLocalConceptProgress());
    });
  }, []);

  const statusLabel: Record<ConceptStatus, string> = {
    "to-discover": dict.statusToDiscover,
    "in-progress": dict.statusInProgress,
    fragile: dict.statusFragile,
    mastered: dict.statusMastered,
    "to-reactivate": dict.statusToReactivate,
  };

  const masteredCount = concepts.filter((c) => c.published && progress[c.id] === "mastered").length;

  return (
    <div>
      {masteredCount > 0 && (
        <p className="mb-3 flex items-center gap-1.5 font-mono text-[11px] text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          {dict.masteredCount.replace("{count}", String(masteredCount))}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {concepts.map((concept, i) => {
        const number = String(i + 1).padStart(2, "0");
        const status = progress[concept.id];

        if (!concept.published) {
          return (
            <div key={concept.id} className="rounded-2xl border border-line bg-surface p-4 opacity-60">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-text-faint">{number}</span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-text-faint">{dict.upcoming}</span>
              </div>
              <p className="text-[15px] leading-snug font-semibold text-text-dim">{concept.title}</p>
            </div>
          );
        }

        return (
          <Link
            key={concept.id}
            href={`/${locale}/lessons/${concept.id}`}
            className="interactive-lift flex flex-col rounded-2xl border border-line bg-surface p-4 hover:border-accent/40 hover:bg-surface-2"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-text-faint">{number}</span>
              {status && (
                <span className={`flex items-center gap-1.5 font-mono text-[10px] ${STATUS_TEXT_COLOR[status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_COLOR[status]}`} aria-hidden="true" />
                  {statusLabel[status]}
                </span>
              )}
            </div>
            <p className="text-[15px] leading-snug font-semibold text-text">{concept.title}</p>
          </Link>
        );
      })}
      </div>
    </div>
  );
}
