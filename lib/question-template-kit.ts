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

/**
 * QCM standard (voir demande "uniformise tous les quiz") : exactement 4 choix, une seule
 * bonne réponse, une explication par proposition fausse (distractorRationale, une clé par
 * choix qui n'est pas correctId). Non imposé au type (choices reste un tableau, pas un
 * tuple ; distractorRationale reste optionnel) pour que les fichiers pas encore migrés
 * continuent de compiler pendant la conversion progressive — c'est
 * content/question-templates.test.ts qui fait respecter ces règles à l'exécution, pour
 * tout template kind === "mcq".
 */
export function mcqTemplate(
  opts: SharedOpts & {
    prompt: Bi;
    choices: { id: string; label: Bi }[];
    correctId: string;
    explanation: Bi;
    commonMistake: Bi;
    distractorRationale?: Record<string, Bi>;
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
      distractorRationale: opts.distractorRationale,
    }),
  };
}

/**
 * @deprecated Vrai/Faux supprimé du standard quiz (voir demande "uniformise tous les
 * quiz") : migrer vers mcqTemplate (4 choix). Conservé uniquement le temps de convertir
 * les fichiers content/question-templates/*.ts qui l'utilisent encore.
 */
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

/**
 * @deprecated Texte à trous supprimé du standard quiz (voir demande "uniformise tous les
 * quiz") : migrer vers mcqTemplate (4 choix). Non utilisé actuellement — tous les
 * fill_blank existants sont écrits à la main, pas via ce helper.
 */
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
