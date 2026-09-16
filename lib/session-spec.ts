import type { CategoryDef, ChapterDef, ConceptDef } from "@/content/catalog";

export type SessionLength = 5 | 10 | 20 | "continuous";

export type SessionSpec =
  | { mode: "concept"; conceptIds: string[] }
  | { mode: "chapter"; chapterId: string; length: SessionLength }
  | { mode: "category"; categoryId: string; length: SessionLength }
  | { mode: "custom"; conceptIds: string[]; length: SessionLength }
  | { mode: "review-mistakes"; length: SessionLength };

export interface CatalogSlice {
  categories: CategoryDef[];
  chapters: ChapterDef[];
  concepts: ConceptDef[];
}

/**
 * Résout un SessionSpec en liste de conceptId concernés (indépendant de tout
 * état utilisateur). Le mode "review-mistakes" n'a pas de notion fixe — sa
 * résolution se fait ailleurs, directement sur les cartes de révision de
 * l'utilisateur (voir lib/store.ts et lib/quiz-engine-client.ts).
 */
export function resolveConceptIdsForSpec(spec: SessionSpec, catalog: CatalogSlice): string[] {
  switch (spec.mode) {
    case "concept":
      return spec.conceptIds;
    case "custom":
      return spec.conceptIds;
    case "chapter":
      return catalog.concepts.filter((c) => c.chapterId === spec.chapterId).map((c) => c.id);
    case "category": {
      const chapterIds = new Set(catalog.chapters.filter((ch) => ch.categoryId === spec.categoryId).map((ch) => ch.id));
      return catalog.concepts.filter((c) => chapterIds.has(c.chapterId)).map((c) => c.id);
    }
    case "review-mistakes":
      return [];
  }
}

export function sessionLengthToNumber(length: SessionLength | undefined): number | null {
  if (!length || length === "continuous") return null;
  return length;
}
