import type { QuestionSolution, SubmittedAnswer } from "./question-types";

export interface GradingResult {
  isCorrect: boolean;
  score: number; // 0 ou 1 pour le MVP (pas de score partiel)
}

/**
 * Parse une saisie numérique : "5,2" (FR) ou "5.2" (EN) sont acceptées
 * indifféremment (un utilisateur bilingue peut taper l'un ou l'autre), avec
 * un "%" optionnel converti en valeur décimale (ex: "5%" -> 0.05, distinct de
 * "5" -> 5). Rejette toute entrée non numérique plutôt que de deviner (voir
 * doc section 4).
 */
export function parseLocaleNumber(raw: string): number {
  const trimmed = raw.trim();
  const isPercent = trimmed.endsWith("%");
  const body = (isPercent ? trimmed.slice(0, -1) : trimmed).trim();
  const normalized = body.replace(/\s/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    throw new RangeError(`Invalid numeric input: "${raw}"`);
  }
  const value = Number(normalized);
  return isPercent ? value / 100 : value;
}

/** Correction strictement côté serveur : jamais un booléen envoyé par le client (voir doc section 7). */
export function gradeAnswer(solution: QuestionSolution, answer: SubmittedAnswer): GradingResult {
  if (solution.kind !== answer.kind) {
    throw new RangeError(`Answer kind ${answer.kind} does not match question kind ${solution.kind}`);
  }
  if (answer.kind === "mcq" || answer.kind === "true_false") {
    const isCorrect = Boolean(solution.correctChoiceIds?.includes(answer.choiceId));
    return { isCorrect, score: isCorrect ? 1 : 0 };
  }
  if (answer.kind === "numeric") {
    if (!solution.numeric) throw new RangeError("Missing numeric answer spec");
    if (!Number.isFinite(answer.value)) throw new TypeError("Invalid numeric answer");
    const isCorrect = Math.abs(answer.value - solution.numeric.value) <= solution.numeric.tolerance;
    return { isCorrect, score: isCorrect ? 1 : 0 };
  }
  throw new RangeError(`Unsupported answer kind`);
}
