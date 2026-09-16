/**
 * Moteur de quiz 100% client, utilisé uniquement par le build statique
 * GitHub Pages (voir lib/content-registry-client.ts et README). Rejoue en
 * local, dans le navigateur, exactement la même logique que le serveur
 * (lib/store.ts) : gradeAnswer + scheduleReview + deriveConceptStatus, mais
 * persiste dans localStorage au lieu d'une base de données — donc par
 * navigateur, sans synchronisation entre appareils, et effacé si le visiteur
 * vide ses données de site.
 */
import { concepts } from "@/content/catalog";
import { gradeAnswer } from "./grading";
import { questionById, questionsByConceptId, solutionByQuestionId } from "./content-registry-client";
import type { SubmittedAnswer } from "./question-types";
import { deriveConceptStatus, scheduleReview, type ConceptStatus, type ReviewState } from "./srs";

const STORAGE_KEY = "finance-academy:progress:v1";

interface LocalReviewCard extends ReviewState {
  conceptId: string;
}

interface CachedAttempt {
  isCorrect: boolean;
  explanation: string;
  calculation?: string;
  commonMistake: string;
}

interface LocalData {
  reviewCards: Record<string, LocalReviewCard>; // questionId -> card
  conceptProgress: Record<string, ConceptStatus>; // conceptId -> status
  attemptCache: Record<string, CachedAttempt>; // clientAttemptKey -> résultat (idempotence)
}

function emptyData(): LocalData {
  return { reviewCards: {}, conceptProgress: {}, attemptCache: {} };
}

function loadData(): LocalData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    return { ...emptyData(), ...JSON.parse(raw) };
  } catch {
    return emptyData();
  }
}

function saveData(data: LocalData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Stockage indisponible (navigation privée, quota) : la session continue sans persistance.
  }
}

export function createLocalSessionId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface LocalAttemptInput {
  questionId: string;
  clientAttemptKey: string;
  answer: SubmittedAnswer;
  locale: "fr" | "en";
  timezone: string;
}

export interface LocalAttemptResult {
  isCorrect: boolean;
  explanation: string;
  calculation?: string;
  commonMistake: string;
  conceptStatus: ConceptStatus;
  nextDueAt: string | null;
  requeueAtSessionEnd: boolean;
}

export function submitLocalAttempt(input: LocalAttemptInput): LocalAttemptResult {
  const data = loadData();
  const question = questionById[input.questionId];
  const solution = solutionByQuestionId[input.questionId];
  if (!question || !solution) throw new RangeError("Unknown question");

  let cached = data.attemptCache[input.clientAttemptKey];
  if (!cached) {
    const graded = gradeAnswer(solution, input.answer);
    cached = {
      isCorrect: graded.isCorrect,
      explanation: solution.explanation[input.locale],
      calculation: solution.calculation?.[input.locale],
      commonMistake: solution.commonMistake[input.locale],
    };
    data.attemptCache[input.clientAttemptKey] = cached;
  }

  const previousCard: ReviewState | null = data.reviewCards[input.questionId] ?? null;
  const now = new Date();
  const { progress, requeueAtSessionEnd } = scheduleReview(previousCard, cached.isCorrect, now, input.timezone);
  data.reviewCards[input.questionId] = { ...progress, conceptId: question.conceptId };

  const conceptQuestionIds = (questionsByConceptId[question.conceptId] ?? []).map((q) => q.id);
  const cardsForConcept = conceptQuestionIds
    .map((qid) => data.reviewCards[qid])
    .filter((c): c is LocalReviewCard => Boolean(c));
  const status = deriveConceptStatus(cardsForConcept, now);
  data.conceptProgress[question.conceptId] = status;

  saveData(data);

  return {
    isCorrect: cached.isCorrect,
    explanation: cached.explanation,
    calculation: cached.calculation,
    commonMistake: cached.commonMistake,
    conceptStatus: status,
    nextDueAt: progress.dueAt,
    requeueAtSessionEnd,
  };
}

export interface LocalCategoryStats {
  categoryId: string;
  studiedConcepts: number;
  masteredConcepts: number;
}

/** Lu côté client après montage (localStorage n'existe pas pendant le rendu statique). */
export function getLocalConceptProgress(): Record<string, ConceptStatus> {
  return loadData().conceptProgress;
}

/** Trois mesures globales (voir doc section 1), calculées depuis le catalogue + la progression locale. */
export function getLocalGlobalStats(): { studiedConcepts: number; masteredConcepts: number } {
  const progress = getLocalConceptProgress();
  let studiedConcepts = 0;
  let masteredConcepts = 0;
  for (const concept of concepts) {
    const status = progress[concept.id];
    if (!status || status === "to-discover") continue;
    studiedConcepts += 1;
    if (status === "mastered") masteredConcepts += 1;
  }
  return { studiedConcepts, masteredConcepts };
}
