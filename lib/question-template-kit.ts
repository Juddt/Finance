import type { Bi } from "@/content/catalog/types";
import { buildChoices, type Difficulty, type QuestionTemplate } from "./question-templates";

/**
 * Fabriques mutualisées pour les familles de questions qualitatives
 * (compréhension, comparaison, raisonnement conditionnel, erreur fréquente).
 * Réduit le boilerplate répété des templates qui n'ont pas besoin de tirage
 * aléatoire (contenu fixe, comme buildChoices l'autorise déjà). Les templates
 * numériques ou fortement randomisés restent écrits à la main (voir les
 * fichiers content/question-templates/*.ts existants) : ce kit ne couvre que
 * les cas répétitifs, pas tous les templates.
 */

interface SharedOpts {
  id: string;
  conceptId: string;
  difficulty: Difficulty;
  hint?: Bi;
  isScenario?: boolean;
  calculation?: Bi;
}

export function mcqTemplate(
  opts: SharedOpts & {
    prompt: Bi;
    choices: { id: string; label: Bi }[];
    correctId: string;
    explanation: Bi;
    commonMistake: Bi;
  }
): QuestionTemplate {
  return {
    id: opts.id,
    conceptId: opts.conceptId,
    kind: "mcq",
    difficulty: opts.difficulty,
    generate: () => ({
      isScenario: opts.isScenario,
      prompt: opts.prompt,
      choices: buildChoices(opts.choices),
      correctChoiceIds: [opts.correctId],
      hint: opts.hint,
      calculation: opts.calculation,
      explanation: opts.explanation,
      commonMistake: opts.commonMistake,
    }),
  };
}

export function trueFalseTemplate(
  opts: SharedOpts & {
    statement: Bi;
    correct: boolean;
    explanation: Bi;
    commonMistake: Bi;
  }
): QuestionTemplate {
  return {
    id: opts.id,
    conceptId: opts.conceptId,
    kind: "true_false",
    difficulty: opts.difficulty,
    generate: () => ({
      isScenario: opts.isScenario,
      prompt: opts.statement,
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: [opts.correct ? "true" : "false"],
      hint: opts.hint,
      calculation: opts.calculation,
      explanation: opts.explanation,
      commonMistake: opts.commonMistake,
    }),
  };
}

export function fillBlankTemplate(
  opts: SharedOpts & {
    prompt: Bi;
    placeholder?: Bi;
    acceptedAnswers: string[];
    explanation: Bi;
    commonMistake: Bi;
  }
): QuestionTemplate {
  return {
    id: opts.id,
    conceptId: opts.conceptId,
    kind: "fill_blank",
    difficulty: opts.difficulty,
    generate: () => ({
      isScenario: opts.isScenario,
      prompt: opts.prompt,
      fillBlankPlaceholder: opts.placeholder ?? { fr: "un mot", en: "one word" },
      acceptedAnswers: opts.acceptedAnswers,
      hint: opts.hint,
      calculation: opts.calculation,
      explanation: opts.explanation,
      commonMistake: opts.commonMistake,
    }),
  };
}
