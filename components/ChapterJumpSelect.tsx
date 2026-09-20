"use client";

import { useRouter } from "next/navigation";
import { categories } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import type { OrderedChapter } from "@/lib/chapter-nav";

/** Sélecteur natif pour sauter directement à un autre chapitre, groupé par module. */
export function ChapterJumpSelect({
  locale,
  chapters,
  currentChapterId,
  label,
}: {
  locale: Locale;
  chapters: OrderedChapter[];
  currentChapterId: string;
  label: string;
}) {
  const router = useRouter();
  const categoryTitle = new Map(categories.map((c) => [c.id, c.title[locale]]));
  const grouped = new Map<string, OrderedChapter[]>();
  for (const ch of chapters) {
    const list = grouped.get(ch.categoryId) ?? [];
    list.push(ch);
    grouped.set(ch.categoryId, list);
  }

  return (
    <select
      aria-label={label}
      value={currentChapterId}
      onChange={(e) => router.push(`/${locale}/chapters/${e.target.value}`)}
      className="interactive-lift w-full max-w-xs rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
    >
      {[...grouped.entries()].map(([categoryId, list]) => (
        <optgroup key={categoryId} label={categoryTitle.get(categoryId) ?? categoryId}>
          {list.map((ch) => (
            <option key={ch.chapterId} value={ch.chapterId}>
              {ch.title[locale]}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
