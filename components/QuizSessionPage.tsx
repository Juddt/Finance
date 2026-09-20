"use client";

import { useSearchParams } from "next/navigation";
import { categories, chapters } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import type { SessionLength, SessionSpec } from "@/lib/session-spec";
import type { QuizDict } from "./QuizShell";
import { QuizSlot } from "./QuizSlot";

function parseLength(raw: string | null): SessionLength {
  if (raw === "continuous") return "continuous";
  const n = Number(raw);
  if (n === 5 || n === 10 || n === 20) return n;
  return 10;
}

export interface QuizHubDict {
  title: string;
  noQuestionsYet: string;
  reviewMistakesEmpty: string;
}

/**
 * Lit la spécification de session depuis l'URL côté client (?mode=...) : un
 * Server Component ne peut pas s'appuyer sur searchParams pour le build
 * GitHub Pages (export statique, pas de serveur pour lire la query string à
 * la demande) — voir README, "Déploiement GitHub Pages".
 */
export function QuizSessionPage({ locale, dict, hubDict }: { locale: Locale; dict: QuizDict; hubDict: QuizHubDict }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const length = parseLength(searchParams.get("length"));

  let spec: SessionSpec | null = null;
  let title = hubDict.title;
  let emptyMessage = hubDict.noQuestionsYet;

  if (mode === "chapter") {
    const chapterId = searchParams.get("chapterId");
    const chapter = chapterId ? chapters.find((c) => c.id === chapterId) : undefined;
    if (chapterId) spec = { mode: "chapter", chapterId, length };
    if (chapter) title = chapter.title[locale];
  } else if (mode === "category") {
    const categoryId = searchParams.get("categoryId");
    const category = categoryId ? categories.find((c) => c.id === categoryId) : undefined;
    if (categoryId) spec = { mode: "category", categoryId, length };
    if (category) title = category.title[locale];
  } else if (mode === "custom") {
    const conceptIds = searchParams.get("conceptIds");
    if (conceptIds) spec = { mode: "custom", conceptIds: conceptIds.split(","), length };
  } else if (mode === "review-mistakes") {
    spec = { mode: "review-mistakes", length };
    title = hubDict.title;
    emptyMessage = hubDict.reviewMistakesEmpty;
  }

  if (!spec) {
    return <p className="font-mono text-sm text-ink-faint">{hubDict.noQuestionsYet}</p>;
  }

  return (
    <div>
      <h1 className="mb-5 font-display text-2xl font-semibold tracking-tight italic sm:text-3xl">{title}</h1>
      <QuizSlot spec={spec} locale={locale} dict={dict} emptyMessage={emptyMessage} />
    </div>
  );
}
