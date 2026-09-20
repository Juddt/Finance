"use client";

import { useEffect, useState } from "react";
import { getConceptById } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import { ButtonLink } from "./Button";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export interface RevisionsDict {
  empty: string;
  dueSince: string;
  reviewNow: string;
}

interface DueItem {
  conceptId: string;
  dueAt: string;
  title: string;
}

export function RevisionsList({ locale, dict }: { locale: Locale; dict: RevisionsDict }) {
  const [items, setItems] = useState<DueItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (isStaticExport) {
        const { getLocalDueReviews } = await import("@/lib/quiz-engine-client");
        const due = getLocalDueReviews(new Date());
        if (cancelled) return;
        setItems(
          due.map((d) => ({ conceptId: d.conceptId, dueAt: d.dueAt, title: getConceptById(d.conceptId)?.title[locale] ?? d.conceptId }))
        );
      } else {
        const res = await fetch(`/api/reviews/due?locale=${locale}`);
        const data = await res.json();
        if (cancelled) return;
        setItems(data.due ?? []);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (items === null) return null;
  if (items.length === 0) {
    return <p className="rounded-xl border border-line bg-surface p-4 text-sm text-text-dim">{dict.empty}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.conceptId} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
          <div>
            <p className="font-medium text-text">{item.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-text-faint">
              {dict.dueSince.replace("{date}", new Date(item.dueAt).toLocaleDateString(locale))}
            </p>
          </div>
          <ButtonLink href={`/${locale}/lessons/${item.conceptId}`} variant="primary" className="shrink-0 px-4 py-2 text-[13px]">
            {dict.reviewNow}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
}
