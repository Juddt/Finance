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

/** Point (x,y) d'une série pour un graphique "line" ou "scatter". */
export interface LessonChartPoint {
  x: number;
  y: number;
  /** Étiquette optionnelle du point (utile pour un scatter). */
  label?: Bi;
}

export interface LessonChartSeries {
  label: Bi;
  points: LessonChartPoint[];
}

/** Ligne de référence verticale (x fixe) ou horizontale (y fixe), ex. strike, seuil, breakeven. */
export interface LessonChartRefLine {
  label: Bi;
  x?: number;
  y?: number;
}

export interface LessonChartBar {
  label: Bi;
  value: number;
}

/**
 * Graphique statique et illustratif d'un cours (pas un graphique de quiz
 * randomisé — voir ChartSpec dans lib/question-types.ts pour celui-là).
 * Rendu en SVG pur par components/LessonChart.tsx, pas de librairie externe.
 */
export type LessonChart =
  | { kind: "line"; xLabel: Bi; yLabel: Bi; series: LessonChartSeries[]; refLines?: LessonChartRefLine[] }
  | { kind: "bar"; yLabel: Bi; bars: LessonChartBar[] }
  | { kind: "scatter"; xLabel: Bi; yLabel: Bi; points: LessonChartPoint[]; trendLine?: boolean };

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
  /**
   * Graphique statique illustrant l'exemple ou la formule (courbe, payoff,
   * série temporelle, nuage de points, barres) — optionnel, seulement quand
   * il apporte réellement quelque chose (voir doc : "un graphique lorsque
   * cela aide", pas systématique).
   */
  chart?: LessonChart;
  /**
   * Mini-code Python commenté (un bloc par langue, commentaires traduits),
   * réservé aux notions qui l'exigent (ex. module M12, machine learning) —
   * voir doc : chaque famille de modèle doit inclure un exemple de code.
   */
  pythonExample?: Bi;
  interpretation: Bi;
  pitfalls: Bi;
  keyPoints: { fr: string[]; en: string[] };
  /** Section "Approfondir / démonstration", dépliable, non résumée par souci de brièveté. */
  advancedDemonstration: Bi;
  /**
   * Application métier concrète : comment cette notion est réellement
   * utilisée sur un desk / dans un rôle donné.
   */
  businessApplication?: Bi;
  /**
   * Question d'entretien type et sa réponse modèle, en ANGLAIS uniquement
   * (volontairement non bilingue : l'objectif est de s'entraîner à
   * répondre en anglais, langue de la plupart des entretiens en finance de
   * marché) — voir doc : "une question d'entretien en anglais".
   */
  interviewQuestion?: { question: string; answer: string };
}
