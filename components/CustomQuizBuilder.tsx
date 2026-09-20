"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { chapters, concepts } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import type { SessionLength } from "@/lib/session-spec";
import { Button } from "./Button";

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
      <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-text-dim uppercase">{dict.selectCategories}</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <label
            key={c.id}
            className={`interactive-lift flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] ${
              selected.has(c.id) ? "border-accent bg-surface-2 text-text" : "border-line bg-surface-2 text-text-dim hover:border-accent/40"
            }`}
          >
            <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="sr-only" />
            {c.label} ({c.count})
          </label>
        ))}
      </div>

      <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-text-dim uppercase">{dict.chooseLength}</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {([5, 10, 20, "continuous"] as SessionLength[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLength(l)}
            className={`interactive-lift rounded-full border px-3.5 py-2 text-[13px] ${
              length === l ? "border-accent bg-surface-2 text-text" : "border-line bg-surface-2 text-text-dim hover:border-accent/40"
            }`}
          >
            {l === 5 ? dict.length5 : l === 10 ? dict.length10 : l === 20 ? dict.length20 : dict.lengthContinuous}
          </button>
        ))}
      </div>

      <Button onClick={start} disabled={selected.size === 0} variant="primary">
        {dict.startButton}
      </Button>
    </div>
  );
}
