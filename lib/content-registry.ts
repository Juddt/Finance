import type { LessonContent } from "./lesson-types";
import type { QuestionPublic, QuestionSolution } from "./question-types";
import { m02ForwardContractValue } from "@/content/lessons/m02-forward-contract-value";
import { m02ForwardContractValueQuestions } from "@/content/questions/m02-forward-contract-value";
// SERVEUR UNIQUEMENT (voir avertissement dans ce fichier de solutions) : ce
// module ne doit être importé que par lib/store.ts et les route handlers.
import { m02ForwardContractValueSolutions } from "@/content/questions/m02-forward-contract-value.solutions";

/**
 * Registre des contenus publiés. Un seul concept est publié dans ce MVP
 * (m02-forward-contract-value) ; ajouter une entrée ici pour chaque nouveau
 * concept rédigé et validé (voir doc section 8, "publication progressive").
 */
export const lessonsByConceptId: Record<string, LessonContent> = {
  "m02-forward-contract-value": m02ForwardContractValue,
};

export const questionsByConceptId: Record<string, QuestionPublic[]> = {
  "m02-forward-contract-value": m02ForwardContractValueQuestions,
};

const allQuestions: QuestionPublic[] = Object.values(questionsByConceptId).flat();

export const questionById: Record<string, QuestionPublic> = Object.fromEntries(
  allQuestions.map((q) => [q.id, q])
);

const allSolutions: QuestionSolution[] = [...m02ForwardContractValueSolutions];

export const solutionByQuestionId: Record<string, QuestionSolution> = Object.fromEntries(
  allSolutions.map((s) => [s.questionId, s])
);

export function getPublishedConceptIds(): string[] {
  return Object.keys(lessonsByConceptId);
}
