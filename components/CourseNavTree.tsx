"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories, chapters, concepts } from "@/content/catalog";
import type { Locale } from "@/i18n/config";

/**
 * Arborescence Module → Chapitre → Notion, fidèle au catalogue réel.
 * Utilisée à la fois par la nav latérale desktop et le panneau mobile
 * "Plan du cours" (même composant, même comportement) — voir demande
 * navigation section 4.
 */
export function CourseNavTree({ locale, onNavigate }: { locale: Locale; onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeConceptId = pathname?.startsWith(`/${locale}/lessons/`) ? pathname.split("/")[3] : null;
  const activeConcept = activeConceptId ? concepts.find((c) => c.id === activeConceptId) : null;
  const activeChapter = activeConcept ? chapters.find((ch) => ch.id === activeConcept.chapterId) : null;
  const activeCategoryId = activeChapter?.categoryId ?? null;

  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);

  return (
    <nav className="text-sm">
      <ul className="space-y-1">
        {sortedCategories.map((category) => {
          const categoryChapters = chapters.filter((ch) => ch.categoryId === category.id).sort((a, b) => a.position - b.position);
          const isActiveModule = category.id === activeCategoryId;
          const code = `M${String(category.position).padStart(2, "0")}`;

          return (
            <li key={category.id}>
              <details open={isActiveModule} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 font-semibold text-text-dim hover:bg-surface hover:text-text">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center text-text-faint transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 3l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="font-mono text-[10px] text-text-faint">{code}</span>
                  <span className="truncate">{category.title[locale]}</span>
                </summary>
                <ul className="mt-1 ml-[26px] space-y-2 border-l border-line pl-3">
                  {categoryChapters.map((chapter) => {
                    const chapterConcepts = concepts.filter((c) => c.chapterId === chapter.id);
                    return (
                      <li key={chapter.id}>
                        <p className="px-1 py-1 text-[12px] font-semibold text-text-faint uppercase tracking-wide">{chapter.title[locale]}</p>
                        <ul className="space-y-0.5">
                          {chapterConcepts.map((concept) => {
                            const isActive = concept.id === activeConceptId;
                            const isPublished = concept.status === "published";
                            if (!isPublished) {
                              return (
                                <li key={concept.id} className="truncate px-2 py-1.5 text-text-faint">
                                  {concept.title[locale]}
                                </li>
                              );
                            }
                            return (
                              <li key={concept.id}>
                                <Link
                                  href={`/${locale}/lessons/${concept.id}`}
                                  onClick={onNavigate}
                                  aria-current={isActive ? "page" : undefined}
                                  className={`block truncate rounded-md border-l-2 px-2 py-1.5 transition-colors ${
                                    isActive
                                      ? "border-accent bg-surface font-medium text-text"
                                      : "border-transparent text-text-dim hover:border-line hover:bg-surface hover:text-text"
                                  }`}
                                >
                                  {concept.title[locale]}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
