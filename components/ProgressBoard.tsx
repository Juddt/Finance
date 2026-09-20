"use client";

import { useEffect, useState } from "react";
import { categories, chapters, concepts } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import type { ConceptStatus } from "@/lib/srs";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export interface ProgressDict {
  statusToDiscover: string;
  statusInProgress: string;
  statusFragile: string;
  statusMastered: string;
  statusToReactivate: string;
}

const STATUS_ORDER: ConceptStatus[] = ["mastered", "in-progress", "fragile", "to-reactivate", "to-discover"];
const STATUS_COLOR: Record<ConceptStatus, string> = {
  mastered: "bg-gain",
  "in-progress": "bg-accent",
  fragile: "bg-mid",
  "to-reactivate": "bg-loss",
  "to-discover": "bg-rule",
};

export function ProgressBoard({ locale, dict }: { locale: Locale; dict: ProgressDict }) {
  const [progress, setProgress] = useState<Record<string, ConceptStatus> | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (isStaticExport) {
        const { getLocalConceptProgress } = await import("@/lib/quiz-engine-client");
        if (!cancelled) setProgress(getLocalConceptProgress());
      } else {
        const res = await fetch("/api/progress");
        const data = await res.json();
        if (!cancelled) setProgress(data.progress ?? {});
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (progress === null) return null;

  const statusLabel: Record<ConceptStatus, string> = {
    "to-discover": dict.statusToDiscover,
    "in-progress": dict.statusInProgress,
    fragile: dict.statusFragile,
    mastered: dict.statusMastered,
    "to-reactivate": dict.statusToReactivate,
  };

  return (
    <div className="space-y-4">
      {categories
        .sort((a, b) => a.position - b.position)
        .map((category, i) => {
          const categoryConceptIds = new Set(
            chapters.filter((ch) => ch.categoryId === category.id).flatMap((ch) => concepts.filter((c) => c.chapterId === ch.id).map((c) => c.id))
          );
          const publishedIds = concepts.filter((c) => categoryConceptIds.has(c.id) && c.status === "published").map((c) => c.id);
          if (publishedIds.length === 0) return null;

          const counts: Record<ConceptStatus, number> = {
            "to-discover": 0,
            "in-progress": 0,
            fragile: 0,
            mastered: 0,
            "to-reactivate": 0,
          };
          for (const id of publishedIds) {
            const status = progress[id] ?? "to-discover";
            counts[status] += 1;
          }

          return (
            <article key={category.id} className="ticket bg-paper-raised p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="font-mono text-[12px] font-semibold tracking-[0.04em] text-ink">{category.title[locale]}</h2>
                <span className="font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-paper-sunken">
                {STATUS_ORDER.map(
                  (status) =>
                    counts[status] > 0 && (
                      <div
                        key={status}
                        className={STATUS_COLOR[status]}
                        style={{ width: `${(counts[status] / publishedIds.length) * 100}%` }}
                        title={`${statusLabel[status]}: ${counts[status]}`}
                      />
                    )
                )}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-ink-muted">
                {STATUS_ORDER.map(
                  (status) =>
                    counts[status] > 0 && (
                      <li key={status} className="flex items-center gap-1.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${STATUS_COLOR[status]}`} />
                        {statusLabel[status]} ({counts[status]})
                      </li>
                    )
                )}
              </ul>
            </article>
          );
        })}
    </div>
  );
}
