import { categories, chapters, type Bi } from "@/content/catalog";

export interface OrderedChapter {
  chapterId: string;
  categoryId: string;
  title: Bi;
}

/** Chapitres ordonnés comme le catalogue (position catégorie puis position chapitre). */
export function getOrderedChapters(): OrderedChapter[] {
  const categoryPosition = new Map(categories.map((c) => [c.id, c.position]));
  return [...chapters]
    .sort((a, b) => (categoryPosition.get(a.categoryId) ?? 0) - (categoryPosition.get(b.categoryId) ?? 0) || a.position - b.position)
    .map((ch) => ({ chapterId: ch.id, categoryId: ch.categoryId, title: ch.title }));
}

export interface ChapterNeighbors {
  prev: OrderedChapter | null;
  next: OrderedChapter | null;
}

export function getChapterNeighbors(chapterId: string): ChapterNeighbors {
  const ordered = getOrderedChapters();
  const index = ordered.findIndex((c) => c.chapterId === chapterId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
