"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConceptById } from "@/content/catalog";
import type { Locale } from "@/i18n/config";

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
    return <p className="rounded-2xl bg-paper-raised p-4 text-sm text-ink-muted">{dict.empty}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.conceptId} className="ticket flex items-center justify-between gap-3 bg-paper-raised p-4">
          <div>
            <p className="font-medium text-ink">{item.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
              {dict.dueSince.replace("{date}", new Date(item.dueAt).toLocaleDateString(locale))}
            </p>
          </div>
          <Link
            href={`/${locale}/lessons/${item.conceptId}`}
            className="shrink-0 rounded-full bg-accent px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.06em] text-accent-ink uppercase transition-transform active:scale-[0.97]"
          >
            {dict.reviewNow}
          </Link>
        </li>
      ))}
    </ul>
  );
}
