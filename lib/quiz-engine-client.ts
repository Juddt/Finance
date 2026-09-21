/**
 * Moteur de quiz 100% client, utilisé uniquement par le build statique
 * GitHub Pages (voir lib/content-registry-client.ts et README). Rejoue en
 * local, dans le navigateur, la même logique que le serveur (lib/store.ts) :
 * sélection adaptative + gradeAnswer + scheduleReview + deriveConceptStatus,
 * mais persiste la progression durable (cartes de révision, statut des
 * notions) dans localStorage — par navigateur, sans synchronisation entre
 * appareils. Les sessions de quiz elles-mêmes sont éphémères (en mémoire,
 * le temps de la page), comme côté serveur.
 */
import { categories, chapters, concepts } from "@/content/catalog";
import { detectDifficultyShift, pickNextTemplate, resolveTargetDifficulty, type DifficultyShift, type SessionAnswerRecord } from "./adaptive-quiz";
import { templateById, templatesByConceptId } from "./content-registry-client";
import { gradeAnswer } from "./grading";
import { mulberry32, randomSeed } from "./prng";
import {
  instantiateTemplate,
  toGeneratedQuestionView,
  toSolution,
  type Difficulty,
  type GeneratedQuestion,
  type GeneratedQuestionView,
} from "./question-templates";
import { localizeRationale, type SubmittedAnswer } from "./question-types";
import { resolveConceptIdsForSpec, sessionLengthToNumber, type SessionSpec } from "./session-spec";
import { deriveConceptStatus, scheduleReview, type ConceptStatus, type ReviewState } from "./srs";

const STORAGE_KEY = "finance-academy:progress:v2";

interface LocalReviewCard extends ReviewState {
  conceptId: string;
}

interface CachedAttempt {
  isCorrect: boolean;
  explanation: string;
  calculation?: string;
  commonMistake: string;
  correctChoiceIds?: string[];
  distractorRationale?: Record<string, string>;
}

/** Miroir localStorage de ConceptQuizScoreRecord (lib/store.ts) : note du dernier quiz complété d'une notion. */
export interface LocalConceptQuizScore {
  correct: number;
  total: number;
  completedAt: string;
}

interface LocalData {
  reviewCards: Record<string, LocalReviewCard>; // templateId -> card
  conceptProgress: Record<string, ConceptStatus>; // conceptId -> status
  conceptQuizScores: Record<string, LocalConceptQuizScore>; // conceptId -> score
  attemptCache: Record<string, CachedAttempt>; // instanceId -> résultat (idempotence)
}

function emptyData(): LocalData {
  return { reviewCards: {}, conceptProgress: {}, conceptQuizScores: {}, attemptCache: {} };
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

interface AnsweredEntry {
  templateId: string;
  isCorrect: boolean;
  difficulty: Difficulty;
  counted: boolean;
}

interface LocalSession {
  id: string;
  locale: "fr" | "en";
  length: number | null;
  templatePoolIds: string[];
  answered: AnsweredEntry[];
  recentTemplateIds: string[];
  currentInstance: GeneratedQuestion | null;
  /** conceptId si mode "concept" à une seule notion (quiz de la page notion) — sert à figer la note à la complétion. */
  scoreConceptId: string | null;
}

// Sessions éphémères, en mémoire pour la durée de la page (pas de backend à interroger).
const sessions = new Map<string, LocalSession>();

export function createLocalSessionId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface SessionProgress {
  index: number;
  total: number | null;
  correctCount: number;
}

function computeProgress(session: LocalSession): SessionProgress {
  const counted = session.answered.filter((a) => a.counted);
  return { index: counted.length, total: session.length, correctCount: counted.filter((a) => a.isCorrect).length };
}

function isSessionDone(session: LocalSession): boolean {
  const { index, total } = computeProgress(session);
  return total !== null && index >= total;
}

function resolveMistakeTemplateIds(data: LocalData): string[] {
  return Object.entries(data.reviewCards)
    .filter(([templateId, card]) => card.lapses > 0 && templateById[templateId])
    .map(([templateId]) => templateId);
}

function resolveTemplatePool(spec: SessionSpec, data: LocalData): string[] {
  if (spec.mode === "review-mistakes") return resolveMistakeTemplateIds(data);
  const conceptIds = resolveConceptIdsForSpec(spec, { categories, chapters, concepts });
  return conceptIds.flatMap((id) => (templatesByConceptId[id] ?? []).map((t) => t.id));
}

function generateNextQuestion(session: LocalSession): { instance: GeneratedQuestion; difficultyShift: DifficultyShift } {
  const pool = session.templatePoolIds.map((id) => templateById[id]).filter(Boolean);
  if (pool.length === 0) throw new RangeError("Empty template pool for session");

  const history: SessionAnswerRecord[] = session.answered.map((a) => ({
    templateId: a.templateId,
    isCorrect: a.isCorrect,
    difficulty: a.difficulty,
  }));
  const previousDifficulty = resolveTargetDifficulty(history);

  const rng = mulberry32(randomSeed());
  const template = pickNextTemplate(pool, history, rng, session.recentTemplateIds);
  const instance = instantiateTemplate(template, rng, createLocalSessionId());
  const difficultyShift = detectDifficultyShift(previousDifficulty, instance.difficulty);

  return { instance, difficultyShift };
}

export interface CreateSessionResult {
  sessionId: string;
  question: GeneratedQuestionView | null;
  progress: SessionProgress;
  empty: boolean;
}

export function createLocalSession(locale: "fr" | "en", spec: SessionSpec): CreateSessionResult {
  const data = loadData();
  const templatePoolIds = resolveTemplatePool(spec, data);
  const id = createLocalSessionId();

  const scoreConceptId = spec.mode === "concept" && spec.conceptIds.length === 1 ? spec.conceptIds[0] : null;

  if (templatePoolIds.length === 0) {
    sessions.set(id, { id, locale, length: 0, templatePoolIds: [], answered: [], recentTemplateIds: [], currentInstance: null, scoreConceptId });
    return { sessionId: id, question: null, progress: { index: 0, total: 0, correctCount: 0 }, empty: true };
  }

  const length = spec.mode === "concept" ? templatePoolIds.length : sessionLengthToNumber(spec.length);
  const session: LocalSession = {
    id,
    locale,
    length,
    templatePoolIds,
    answered: [],
    recentTemplateIds: [],
    currentInstance: null,
    scoreConceptId,
  };
  const { instance } = generateNextQuestion(session);
  session.currentInstance = instance;
  session.recentTemplateIds = [instance.templateId, ...session.recentTemplateIds].slice(0, 2);
  sessions.set(id, session);

  return { sessionId: id, question: toGeneratedQuestionView(instance, locale), progress: computeProgress(session), empty: false };
}

export interface NextQuestionResult {
  question: GeneratedQuestionView | null;
  progress: SessionProgress;
  done: boolean;
  difficultyShift: DifficultyShift;
}

export function getLocalNextQuestion(sessionId: string): NextQuestionResult {
  const session = sessions.get(sessionId);
  if (!session) throw new RangeError("Unknown session");

  if (isSessionDone(session)) {
    return { question: null, progress: computeProgress(session), done: true, difficultyShift: null };
  }

  const { instance, difficultyShift } = generateNextQuestion(session);
  session.currentInstance = instance;
  session.recentTemplateIds = [instance.templateId, ...session.recentTemplateIds].slice(0, 2);

  return { question: toGeneratedQuestionView(instance, session.locale), progress: computeProgress(session), done: false, difficultyShift };
}

export function getLocalSimilarQuestion(sessionId: string): { question: GeneratedQuestionView } {
  const session = sessions.get(sessionId);
  if (!session) throw new RangeError("Unknown session");
  if (!session.currentInstance) throw new RangeError("No current question to build a similar exercise from");

  const template = templateById[session.currentInstance.templateId];
  if (!template) throw new RangeError("Unknown template");

  const rng = mulberry32(randomSeed());
  const instance = instantiateTemplate(template, rng, createLocalSessionId());
  session.currentInstance = instance;

  return { question: toGeneratedQuestionView(instance, session.locale) };
}

export interface LocalAttemptInput {
  sessionId: string;
  instanceId: string;
  answer: SubmittedAnswer;
  timezone: string;
  counted: boolean;
}

export interface LocalAttemptResult {
  isCorrect: boolean;
  explanation: string;
  calculation?: string;
  commonMistake: string;
  correctChoiceIds?: string[];
  distractorRationale?: Record<string, string>;
  conceptStatus: ConceptStatus;
  nextDueAt: string | null;
  requeueAtSessionEnd: boolean;
  progress: SessionProgress;
  done: boolean;
}

export function submitLocalAttempt(input: LocalAttemptInput): LocalAttemptResult {
  const session = sessions.get(input.sessionId);
  if (!session) throw new RangeError("Unknown session");
  if (!session.currentInstance || session.currentInstance.instanceId !== input.instanceId) {
    throw new RangeError("This question is not the session's current question");
  }
  const instance = session.currentInstance;
  const data = loadData();

  // Idempotence : une même instanceId ne doit être notée (SRS, progression, longueur de
  // session) qu'une seule fois, même si submitLocalAttempt est rappelée (double-clic, retry).
  const existingCache = data.attemptCache[input.instanceId];
  const isFirstSubmission = !existingCache;

  let cached: CachedAttempt;
  if (existingCache) {
    cached = existingCache;
  } else {
    const solution = toSolution(instance);
    const graded = gradeAnswer(solution, input.answer);
    cached = {
      isCorrect: graded.isCorrect,
      explanation: solution.explanation[session.locale],
      calculation: solution.calculation?.[session.locale],
      commonMistake: solution.commonMistake[session.locale],
      correctChoiceIds: solution.correctChoiceIds,
      distractorRationale: localizeRationale(solution.distractorRationale, session.locale),
    };
    data.attemptCache[input.instanceId] = cached;
  }
  const isCorrect = cached.isCorrect;

  let status: ConceptStatus;
  let nextDueAt: string | null;
  let requeueAtSessionEnd: boolean;

  if (isFirstSubmission) {
    const now = new Date();
    const previousCard: ReviewState | null = data.reviewCards[instance.templateId] ?? null;
    const scheduled = scheduleReview(previousCard, isCorrect, now, input.timezone);
    data.reviewCards[instance.templateId] = { ...scheduled.progress, conceptId: instance.conceptId };
    nextDueAt = scheduled.progress.dueAt;
    requeueAtSessionEnd = scheduled.requeueAtSessionEnd;

    const conceptTemplateIds = (templatesByConceptId[instance.conceptId] ?? []).map((t) => t.id);
    const cardsForConcept = conceptTemplateIds
      .map((tid) => data.reviewCards[tid])
      .filter((c): c is LocalReviewCard => Boolean(c));
    status = deriveConceptStatus(cardsForConcept, now);
    data.conceptProgress[instance.conceptId] = status;

    session.answered.push({ templateId: instance.templateId, isCorrect, difficulty: instance.difficulty, counted: input.counted });

    // Le quiz d'une notion (mode "concept") a une longueur fixe (voir
    // createLocalSession) : sa complétion marque le cours comme "fait" et
    // fige sa note, affichée dans le catalogue avant même d'ouvrir le cours.
    if (session.scoreConceptId && isSessionDone(session)) {
      const p = computeProgress(session);
      data.conceptQuizScores[session.scoreConceptId] = {
        correct: p.correctCount,
        total: p.total ?? p.index,
        completedAt: now.toISOString(),
      };
    }

    saveData(data);
  } else {
    status = data.conceptProgress[instance.conceptId] ?? "to-discover";
    const existingCard = data.reviewCards[instance.templateId];
    nextDueAt = existingCard?.dueAt ?? null;
    requeueAtSessionEnd = false;
  }

  const done = isSessionDone(session);

  return {
    isCorrect,
    explanation: cached.explanation,
    calculation: cached.calculation,
    commonMistake: cached.commonMistake,
    correctChoiceIds: cached.correctChoiceIds,
    distractorRationale: cached.distractorRationale,
    conceptStatus: status,
    nextDueAt,
    requeueAtSessionEnd,
    progress: computeProgress(session),
    done,
  };
}

export interface DueReviewView {
  conceptId: string;
  dueAt: string;
}

export function getLocalDueReviews(now: Date): DueReviewView[] {
  const data = loadData();
  const conceptIds = new Set<string>();
  const result: DueReviewView[] = [];
  for (const card of Object.values(data.reviewCards)) {
    if (!card.dueAt) continue;
    if (Date.parse(card.dueAt) > now.getTime()) continue;
    if (conceptIds.has(card.conceptId)) continue;
    conceptIds.add(card.conceptId);
    result.push({ conceptId: card.conceptId, dueAt: card.dueAt });
  }
  return result.sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));
}

export function hasLocalMistakesToReview(): boolean {
  return resolveMistakeTemplateIds(loadData()).length > 0;
}

/** Lu côté client après montage (localStorage n'existe pas pendant le rendu statique). */
export function getLocalConceptProgress(): Record<string, ConceptStatus> {
  return loadData().conceptProgress;
}

/** Note du dernier quiz complété pour chaque notion (voir submitLocalAttempt), lue côté client après montage. */
export function getLocalConceptQuizScores(): Record<string, LocalConceptQuizScore> {
  return loadData().conceptQuizScores;
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
