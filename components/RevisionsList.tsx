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
    return <p className="text-sm text-neutral-600 dark:text-neutral-300">{dict.empty}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.conceptId}
          className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900"
        >
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-neutral-500">{dict.dueSince.replace("{date}", new Date(item.dueAt).toLocaleDateString(locale))}</p>
          </div>
          <Link
            href={`/${locale}/lessons/${item.conceptId}`}
            className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            {dict.reviewNow}
          </Link>
        </li>
      ))}
    </ul>
  );
}
