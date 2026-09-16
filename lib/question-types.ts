import type { Bi } from "@/content/catalog/types";

export type QuestionKind = "mcq" | "true_false" | "numeric";

export interface ChoiceOption {
  /** ID stable, jamais réutilisé pour la position (mélanger les options ne doit pas changer la correction). */
  id: string;
  label: Bi;
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
  explanation: Bi;
  calculation?: Bi;
  commonMistake: Bi;
}

export type SubmittedAnswer =
  | { kind: "mcq" | "true_false"; choiceId: string }
  | { kind: "numeric"; value: number };

export interface QuestionView {
  id: string;
  kind: QuestionKind;
  prompt: string;
  choices?: { id: string; label: string }[];
  numericUnit?: string;
  numericTolerance?: string;
  hint?: string;
}

export function toQuestionView(q: QuestionPublic, locale: "fr" | "en"): QuestionView {
  return {
    id: q.id,
    kind: q.kind,
    prompt: q.prompt[locale],
    choices: q.choices?.map((c) => ({ id: c.id, label: c.label[locale] })),
    numericUnit: q.numericUnit?.[locale],
    numericTolerance: q.numericTolerance,
    hint: q.hint?.[locale],
  };
}
