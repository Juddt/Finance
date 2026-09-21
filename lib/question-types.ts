import type { Bi } from "@/content/catalog/types";

export type QuestionKind = "mcq" | "true_false" | "numeric" | "fill_blank";

export interface ChoiceOption {
  /** ID stable, jamais réutilisé pour la position (mélanger les options ne doit pas changer la correction). */
  id: string;
  label: Bi;
}

/** Petit graphique généré (pas une image décorative) pour les questions de lecture de graphique. */
export interface ChartSpec {
  type: "payoff_call" | "payoff_put" | "bond_price_yield";
  params: Record<string, number>;
}

export interface QuestionPublic {
  id: string;
  conceptId: string;
  kind: QuestionKind;
  prompt: Bi;
  choices?: ChoiceOption[];
  numericUnit?: Bi;
  /** Tolérance affichée à l'utilisateur pour une question numérique (ex: "± 0,001"). */
  numericTolerance?: string;
  fillBlankPlaceholder?: Bi;
  chart?: ChartSpec;
  /** Mise en situation narrative plutôt qu'énoncé sec ; n'affecte pas la correction. */
  isScenario?: boolean;
  hint?: Bi;
}

export interface NumericAnswerSpec {
  value: number;
  tolerance: number;
}

export interface QuestionSolution {
  questionId: string;
  kind: QuestionKind;
  correctChoiceIds?: string[];
  numeric?: NumericAnswerSpec;
  /** Réponses acceptées pour fill_blank, normalisées (minuscules, sans accents) — mots-clés/variantes. */
  acceptedAnswers?: string[];
  explanation: Bi;
  calculation?: Bi;
  commonMistake: Bi;
  /** QCM à 4 choix : pourquoi chaque proposition fausse est fausse (clé = id du choix, jamais celui de correctChoiceIds). */
  distractorRationale?: Record<string, Bi>;
}

export type SubmittedAnswer =
  | { kind: "mcq" | "true_false"; choiceId: string }
  | { kind: "numeric"; value: number }
  | { kind: "fill_blank"; text: string };

export interface QuestionView {
  id: string;
  kind: QuestionKind;
  prompt: string;
  choices?: { id: string; label: string }[];
  numericUnit?: string;
  numericTolerance?: string;
  fillBlankPlaceholder?: string;
  chart?: ChartSpec;
  isScenario?: boolean;
  hint?: string;
}

/** Traduit un Record<id, Bi> (ex: distractorRationale) dans une langue — utilisé côté serveur et statique avant d'envoyer la réponse au client. */
export function localizeRationale(rationale: Record<string, Bi> | undefined, locale: "fr" | "en"): Record<string, string> | undefined {
  if (!rationale) return undefined;
  return Object.fromEntries(Object.entries(rationale).map(([id, bi]) => [id, bi[locale]]));
}

export function toQuestionView(q: QuestionPublic, locale: "fr" | "en"): QuestionView {
  return {
    id: q.id,
    kind: q.kind,
    prompt: q.prompt[locale],
    choices: q.choices?.map((c) => ({ id: c.id, label: c.label[locale] })),
    numericUnit: q.numericUnit?.[locale],
    numericTolerance: q.numericTolerance,
    fillBlankPlaceholder: q.fillBlankPlaceholder?.[locale],
    chart: q.chart,
    isScenario: q.isScenario,
    hint: q.hint?.[locale],
  };
}
