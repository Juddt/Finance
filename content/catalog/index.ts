import { categories } from "./categories";
import { chapters } from "./chapters";
import { concepts } from "./concepts/index";
import type { ChapterDef, ConceptDef } from "./types";

export type { CategoryDef, ChapterDef, ConceptDef, Bi, ConceptLevel, ContentStatus } from "./types";
export { categories, chapters, concepts };

export function getConceptById(id: string): ConceptDef | undefined {
  return concepts.find((c) => c.id === id);
}

export function getChaptersForCategory(categoryId: string): ChapterDef[] {
  return chapters.filter((ch) => ch.categoryId === categoryId).sort((a, b) => a.position - b.position);
}

export function getConceptsForChapter(chapterId: string): ConceptDef[] {
  return concepts.filter((c) => c.chapterId === chapterId);
}

export interface CategoryStats {
  totalConcepts: number;
  publishedConcepts: number;
}

/** Couverture éditoriale réelle : notions publiées / notions du catalogue, par catégorie. Jamais de chiffre inventé. */
export function getCategoryStats(categoryId: string): CategoryStats {
  const chapterIds = new Set(getChaptersForCategory(categoryId).map((c) => c.id));
  const relevant = concepts.filter((c) => chapterIds.has(c.chapterId));
  return {
    totalConcepts: relevant.length,
    publishedConcepts: relevant.filter((c) => c.status === "published").length,
  };
}

export interface CoverageMatrixRow {
  requirement: string; // sourceRef, ex "M02-4"
  conceptId: string;
  chapterId: string;
  categoryId: string;
  status: "published" | "upcoming";
  needsClarification: boolean;
}

/**
 * Matrice de couverture : exigence source (sourceRef) -> notion -> chapitre -> catégorie -> statut.
 * Générée depuis le catalogue lui-même (pas de saisie manuelle dupliquée) : voir section 8 du document.
 */
export function getCoverageMatrix(): CoverageMatrixRow[] {
  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  return concepts
    .map((concept) => {
      const chapter = chapterById.get(concept.chapterId);
      if (!chapter) throw new Error(`Unknown chapter for concept ${concept.id}: ${concept.chapterId}`);
      return {
        requirement: concept.sourceRef,
        conceptId: concept.id,
        chapterId: chapter.id,
        categoryId: chapter.categoryId,
        status: concept.status,
        needsClarification: Boolean(concept.needsClarification),
      };
    })
    .sort((a, b) => a.requirement.localeCompare(b.requirement));
}
