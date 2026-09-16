import type { Bi } from "@/content/catalog/types";
import type { Rng } from "./prng";
import type { ChartSpec, ChoiceOption, QuestionKind, QuestionSolution } from "./question-types";

export type Difficulty = "easy" | "medium" | "hard";

/** Un exercice concret, déjà tiré au sort (nombres, contexte) et déjà corrigé. */
export interface GeneratedQuestion {
  instanceId: string;
  /** Famille stable, utilisée pour la révision espacée et le suivi des erreurs (voir doc section 4/5). */
  templateId: string;
  conceptId: string;
  kind: QuestionKind;
  difficulty: Difficulty;
  prompt: Bi;
  choices?: ChoiceOption[];
  numericUnit?: Bi;
  numericTolerance?: string;
  fillBlankPlaceholder?: Bi;
  chart?: ChartSpec;
  isScenario?: boolean;
  hint?: Bi;
  correctChoiceIds?: string[];
  numeric?: { value: number; tolerance: number };
  acceptedAnswers?: string[];
  explanation: Bi;
  calculation?: Bi;
  commonMistake: Bi;
}

export type GeneratedQuestionBody = Omit<GeneratedQuestion, "instanceId" | "templateId" | "conceptId" | "kind" | "difficulty">;

export interface QuestionTemplate {
  id: string;
  conceptId: string;
  kind: QuestionKind;
  difficulty: Difficulty;
  /** Doit recalculer systématiquement énoncé, réponse et explication à partir des valeurs tirées (voir doc section 2). */
  generate: (rng: Rng) => GeneratedQuestionBody;
}

export function instantiateTemplate(template: QuestionTemplate, rng: Rng, instanceId: string): GeneratedQuestion {
  return {
    instanceId,
    templateId: template.id,
    conceptId: template.conceptId,
    kind: template.kind,
    difficulty: template.difficulty,
    ...template.generate(rng),
  };
}

export interface GeneratedQuestionView {
  instanceId: string;
  templateId: string;
  conceptId: string;
  kind: QuestionKind;
  difficulty: Difficulty;
  prompt: string;
  choices?: { id: string; label: string }[];
  numericUnit?: string;
  numericTolerance?: string;
  fillBlankPlaceholder?: string;
  chart?: ChartSpec;
  isScenario?: boolean;
  hint?: string;
}

export function toGeneratedQuestionView(q: GeneratedQuestion, locale: "fr" | "en"): GeneratedQuestionView {
  return {
    instanceId: q.instanceId,
    templateId: q.templateId,
    conceptId: q.conceptId,
    kind: q.kind,
    difficulty: q.difficulty,
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

export function toSolution(q: GeneratedQuestion): QuestionSolution {
  return {
    questionId: q.instanceId,
    kind: q.kind,
    correctChoiceIds: q.correctChoiceIds,
    numeric: q.numeric,
    acceptedAnswers: q.acceptedAnswers,
    explanation: q.explanation,
    calculation: q.calculation,
    commonMistake: q.commonMistake,
  };
}

/** Construit des choix MCQ à IDs stables ("a", "b", "c"...) — jamais par position (voir doc section 4). */
export function buildChoices(labels: { id: string; label: Bi }[]): ChoiceOption[] {
  return labels;
}
