import type { Bi } from "@/content/catalog/types";

export interface LessonFormula {
  latex: string;
  /** Chaque variable: symbole -> description bilingue. */
  variables: { symbol: string; description: Bi }[];
  assumptions: Bi;
  units: Bi;
  example: Bi;
}

export interface LessonContent {
  conceptId: string;
  /** Ordre imposé par le document (section 3) : objectif -> ... -> mini-quiz. */
  intuition: Bi;
  definition: Bi;
  utility: Bi;
  example: Bi;
  formula: LessonFormula;
  calculation: Bi;
  interpretation: Bi;
  pitfalls: Bi;
  keyPoints: { fr: string[]; en: string[] };
  /** Section "Approfondir / démonstration", dépliable, non résumée par souci de brièveté. */
  advancedDemonstration: Bi;
}
