/**
 * ATTENTION — réservé au build statique GitHub Pages (voir README, section
 * "Déploiement GitHub Pages"). GitHub Pages ne sert que des fichiers
 * statiques : il n'y a pas de serveur pour garder les solutions cachées, donc
 * ce module les inclut volontairement dans le bundle navigateur. C'est
 * l'inverse du contrat de lib/content-registry.ts (solutions strictement
 * serveur) utilisé par le build normal (npm run dev / npm run build) — ne
 * jamais importer ce fichier depuis un composant utilisé par ce build-là.
 */
import type { LessonContent } from "./lesson-types";
import type { QuestionPublic, QuestionSolution } from "./question-types";
import { m02ForwardContractValue } from "@/content/lessons/m02-forward-contract-value";
import { m02ForwardContractValueQuestions } from "@/content/questions/m02-forward-contract-value";
import { m02ForwardContractValueSolutions } from "@/content/questions/m02-forward-contract-value.solutions";

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
