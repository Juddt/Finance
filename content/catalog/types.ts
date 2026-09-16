/** Texte bilingue FR/EN. Une notion a le même ID dans les deux langues. */
export interface Bi {
  fr: string;
  en: string;
}

export type ConceptLevel = "essential" | "advanced";
export type ContentStatus = "published" | "upcoming";

export interface CategoryDef {
  id: string;
  slug: string;
  icon: string;
  /** Couleur d'accent (classe Tailwind, ex: "amber"). */
  color: string;
  position: number;
  title: Bi;
  summary: Bi;
  level: Bi;
  prerequisites: Bi;
}

export interface ChapterDef {
  id: string;
  categoryId: string;
  position: number;
  title: Bi;
  summary: Bi;
}

export interface ConceptDef {
  id: string;
  chapterId: string;
  /** Référence à la ligne source du cadrage (ex: "M02-4"), pour la matrice de couverture. */
  sourceRef: string;
  level: ConceptLevel;
  estimatedMinutes: number;
  status: ContentStatus;
  /** Intitulé ambigu du cadrage, conservé tel quel en attendant confirmation (doc section E). */
  needsClarification?: boolean;
  prerequisiteIds?: string[];
  title: Bi;
  objective: Bi;
}
