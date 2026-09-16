import type { Bi } from "@/content/catalog/types";

export interface LessonFormula {
  latex: string;
  /** Chaque variable: symbole -> description bilingue. */
  variables: { symbol: string; description: Bi }[];
  assumptions: Bi;
  units: Bi;
  example: Bi;
}

export interface GlossaryTerm {
  term: Bi;
  definition: Bi;
}

export interface LessonContent {
  conceptId: string;
  /**
   * Rappel condensé des notions prérequises, avec lien vers leur page (voir
   * doc : « prévois des rappels de prérequis »). Absent si la notion n'a pas
   * de prérequis fort.
   */
  prerequisiteReminder?: { text: Bi; conceptIds: string[] };
  /** Vocabulaire technique défini simplement avant utilisation, affiché en tête de cours. */
  glossary?: GlossaryTerm[];
  /** Ordre imposé par le document (section 3) : objectif -> ... -> mini-quiz. */
  intuition: Bi;
  definition: Bi;
  utility: Bi;
  example: Bi;
  /**
   * Deuxième façon d'expliquer la même notion (analogie, angle différent) —
   * pour un lecteur toujours bloqué après l'explication principale.
   */
  alternativeExplanation?: Bi;
  formula: LessonFormula;
  calculation: Bi;
  interpretation: Bi;
  pitfalls: Bi;
  keyPoints: { fr: string[]; en: string[] };
  /** Section "Approfondir / démonstration", dépliable, non résumée par souci de brièveté. */
  advancedDemonstration: Bi;
}
