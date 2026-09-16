"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { chapters, concepts } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import type { SessionLength } from "@/lib/session-spec";

export interface CustomQuizDict {
  selectCategories: string;
  chooseLength: string;
  length5: string;
  length10: string;
  length20: string;
  lengthContinuous: string;
  startButton: string;
  noQuestionsYet: string;
}

export function CustomQuizBuilder({
  locale,
  categories,
  dict,
}: {
  locale: Locale;
  categories: { id: string; label: string; count: number }[];
  dict: CustomQuizDict;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [length, setLength] = useState<SessionLength>(10);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function start() {
    if (selected.size === 0) return;
    const chapterIds = new Set(chapters.filter((ch) => selected.has(ch.categoryId)).map((ch) => ch.id));
    const conceptIds = concepts
      .filter((c) => chapterIds.has(c.chapterId) && c.status === "published")
      .map((c) => c.id);
    if (conceptIds.length === 0) return;
    router.push(`/${locale}/quiz/session?mode=custom&conceptIds=${conceptIds.join(",")}&length=${length}`);
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">{dict.selectCategories}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <label
            key={c.id}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
              selected.has(c.id) ? "border-neutral-900 dark:border-white" : "border-black/10 dark:border-white/10"
            }`}
          >
            <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="h-3.5 w-3.5" />
            {c.label} ({c.count})
          </label>
        ))}
      </div>

      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">{dict.chooseLength}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {([5, 10, 20, "continuous"] as SessionLength[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLength(l)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              length === l
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-black/10 dark:border-white/10"
            }`}
          >
            {l === 5 ? dict.length5 : l === 10 ? dict.length10 : l === 20 ? dict.length20 : dict.lengthContinuous}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={start}
        disabled={selected.size === 0}
        className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
      >
        {dict.startButton}
      </button>
    </div>
  );
}
