import { categories, chapters, concepts, type Bi } from "@/content/catalog";
import { lessonsByConceptId } from "./content-registry";

export interface OrderedConcept {
  conceptId: string;
  chapterId: string;
  categoryId: string;
  title: Bi;
}

/**
 * Notions publiées (avec cours écrit), ordonnées comme le catalogue lui-même :
 * position de catégorie puis de chapitre, puis ordre d'apparition dans le
 * fichier de contenu. Base commune pour la nav latérale, le fil d'Ariane et
 * le précédent/suivant — un seul ordre de vérité, dérivé des données.
 */
export function getOrderedPublishedConcepts(): OrderedConcept[] {
  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const categoryPosition = new Map(categories.map((c) => [c.id, c.position]));

  return concepts
    .map((concept, sourceIndex) => ({ concept, sourceIndex }))
    .filter(({ concept }) => concept.status === "published" && lessonsByConceptId[concept.id])
    .map(({ concept, sourceIndex }) => {
      const chapter = chapterById.get(concept.chapterId);
      if (!chapter) throw new Error(`Unknown chapter for concept ${concept.id}: ${concept.chapterId}`);
      return {
        conceptId: concept.id,
        chapterId: chapter.id,
        categoryId: chapter.categoryId,
        title: concept.title,
        sourceIndex,
        chapterPosition: chapter.position,
        categoryPosition: categoryPosition.get(chapter.categoryId) ?? 0,
      };
    })
    .sort((a, b) => a.categoryPosition - b.categoryPosition || a.chapterPosition - b.chapterPosition || a.sourceIndex - b.sourceIndex)
    .map(({ conceptId, chapterId, categoryId, title }) => ({ conceptId, chapterId, categoryId, title }));
}

export interface LessonNeighbors {
  prev: (OrderedConcept & { chapterChanged: boolean; categoryChanged: boolean }) | null;
  next: (OrderedConcept & { chapterChanged: boolean; categoryChanged: boolean }) | null;
}

/** Notion précédente/suivante dans l'ordre du catalogue, avec un indicateur de changement de chapitre/module. */
export function getLessonNeighbors(conceptId: string): LessonNeighbors {
  const ordered = getOrderedPublishedConcepts();
  const index = ordered.findIndex((c) => c.conceptId === conceptId);
  if (index === -1) return { prev: null, next: null };

  const current = ordered[index];
  const prevItem = index > 0 ? ordered[index - 1] : null;
  const nextItem = index < ordered.length - 1 ? ordered[index + 1] : null;

  return {
    prev: prevItem
      ? { ...prevItem, chapterChanged: prevItem.chapterId !== current.chapterId, categoryChanged: prevItem.categoryId !== current.categoryId }
      : null,
    next: nextItem
      ? { ...nextItem, chapterChanged: nextItem.chapterId !== current.chapterId, categoryChanged: nextItem.categoryId !== current.categoryId }
      : null,
  };
}
