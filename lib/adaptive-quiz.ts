import type { Rng } from "./prng";
import { pick } from "./prng";
import type { Difficulty, QuestionTemplate } from "./question-templates";

export interface SessionAnswerRecord {
  templateId: string;
  isCorrect: boolean;
  difficulty: Difficulty;
}

/**
 * Démarre au niveau intermédiaire ("medium"). Deux échecs consécutifs font
 * redescendre en "easy" (rappel + exercice plus guidé) ; trois réussites
 * consécutives font monter en "hard". Sinon, on reste au niveau de la
 * dernière question (voir doc section 5 : "Une progression adaptée").
 */
export function resolveTargetDifficulty(answered: SessionAnswerRecord[]): Difficulty {
  if (answered.length === 0) return "medium";
  const last = answered[answered.length - 1];

  const lastTwoWrong = answered.length >= 2 && !answered[answered.length - 1].isCorrect && !answered[answered.length - 2].isCorrect;
  if (lastTwoWrong) return "easy";

  const lastThreeRight =
    answered.length >= 3 &&
    answered[answered.length - 1].isCorrect &&
    answered[answered.length - 2].isCorrect &&
    answered[answered.length - 3].isCorrect;
  if (lastThreeRight) return "hard";

  return last.difficulty;
}

export type DifficultyShift = "up" | "down" | null;

export function detectDifficultyShift(previous: Difficulty, next: Difficulty): DifficultyShift {
  const order: Difficulty[] = ["easy", "medium", "hard"];
  const diff = order.indexOf(next) - order.indexOf(previous);
  if (diff > 0) return "up";
  if (diff < 0) return "down";
  return null;
}

/**
 * Choisit le prochain template : priorité au niveau de difficulté cible,
 * jamais le(s) dernier(s) template(s) déjà posé(s) (sauf s'il ne reste que ça
 * dans le pool) — voir doc section 2 : "évite les répétitions trop
 * rapprochées, sauf lorsqu'elles servent volontairement à retravailler une
 * erreur" (ce cas volontaire passe par requestSimilar, pas par cette fonction).
 */
export function pickNextTemplate(
  pool: QuestionTemplate[],
  answered: SessionAnswerRecord[],
  rng: Rng,
  recentTemplateIds: string[] = []
): QuestionTemplate {
  if (pool.length === 0) throw new RangeError("Empty template pool");

  const targetDifficulty = resolveTargetDifficulty(answered);
  const atTargetDifficulty = pool.filter((t) => t.difficulty === targetDifficulty);
  const baseCandidates = atTargetDifficulty.length > 0 ? atTargetDifficulty : pool;

  const nonRecent = baseCandidates.filter((t) => !recentTemplateIds.includes(t.id));
  if (nonRecent.length > 0) return pick(rng, nonRecent);

  // Le niveau cible n'offre que des templates récents : élargir à tout le pool.
  const widerNonRecent = pool.filter((t) => !recentTemplateIds.includes(t.id));
  if (widerNonRecent.length > 0) return pick(rng, widerNonRecent);

  // Le pool entier a été posé récemment (pool très petit) : répéter est inévitable.
  return pick(rng, pool);
}
