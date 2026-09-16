import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { chapters, concepts, getConceptById } from "@/content/catalog";
import { getPublishedConceptIds, questionById, questionsByConceptId, solutionByQuestionId } from "./content-registry";
import { gradeAnswer } from "./grading";
import type { QuestionPublic, SubmittedAnswer } from "./question-types";
import { deriveConceptStatus, scheduleReview, type ConceptStatus, type ReviewState } from "./srs";

/**
 * Store MVP fichier local, tenant lieu de PostgreSQL/Supabase le temps du
 * scaffold (voir db/migrations/0001_init.sql pour le schéma cible). Respecte
 * le même contrat que la section B du document : correction côté serveur,
 * écritures idempotentes, isolation par utilisateur. À remplacer par des
 * appels Supabase (avec RLS) sans changer la forme des fonctions exportées.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

interface Profile {
  locale: "fr" | "en";
  timezone: string;
  dailyMinutes: number;
}

interface StudySession {
  id: string;
  userId: string;
  mode: "course" | "training" | "exam";
  locale: "fr" | "en";
  startedAt: string;
  completedAt: string | null;
  questionIds: string[];
}

interface AttemptRecord {
  id: string;
  userId: string;
  sessionId: string;
  questionId: string;
  answer: SubmittedAnswer;
  isCorrect: boolean;
  score: number;
  answeredAt: string;
  durationMs: number;
}

interface ReviewCardRecord extends ReviewState {
  userId: string;
  questionId: string;
  conceptId: string;
}

interface ConceptProgressRecord {
  userId: string;
  conceptId: string;
  status: ConceptStatus;
  lastStudiedAt: string | null;
}

interface PersistedData {
  profiles: Record<string, Profile>;
  studySessions: Record<string, StudySession>;
  attempts: Record<string, AttemptRecord>;
  attemptIdempotency: Record<string, string>; // `${userId}:${clientAttemptKey}` -> attempt id
  reviewCards: Record<string, ReviewCardRecord>; // `${userId}:${questionId}`
  conceptProgress: Record<string, ConceptProgressRecord>; // `${userId}:${conceptId}`
  bookmarks: Record<string, true>; // `${userId}:${conceptId}`
}

function emptyData(): PersistedData {
  return {
    profiles: {},
    studySessions: {},
    attempts: {},
    attemptIdempotency: {},
    reviewCards: {},
    conceptProgress: {},
    bookmarks: {},
  };
}

async function readData(): Promise<PersistedData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return { ...emptyData(), ...JSON.parse(raw) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return emptyData();
    throw err;
  }
}

async function writeDataAtomic(data: PersistedData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmpFile = `${DATA_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmpFile, DATA_FILE);
}

// Sérialise les écritures pour éviter une course entre deux requêtes concurrentes
// (équivalent applicatif d'une transaction, en attendant Postgres).
let writeQueue: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: (data: PersistedData) => Promise<T> | T): Promise<T> {
  const run = writeQueue.then(async () => {
    const data = await readData();
    const result = await fn(data);
    await writeDataAtomic(data);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

export async function getProfile(userId: string): Promise<Profile> {
  const data = await readData();
  return data.profiles[userId] ?? { locale: "fr", timezone: "Europe/Paris", dailyMinutes: 10 };
}

export async function updateProfile(userId: string, patch: Partial<Profile>): Promise<Profile> {
  return withWriteLock((data) => {
    const current = data.profiles[userId] ?? { locale: "fr", timezone: "Europe/Paris", dailyMinutes: 10 };
    const next = { ...current, ...patch };
    data.profiles[userId] = next;
    return next;
  });
}

export interface CategoryStatsView {
  categoryId: string;
  totalConcepts: number;
  publishedConcepts: number;
  studiedConcepts: number;
  masteredConcepts: number;
}

/**
 * Trois mesures distinctes exigées par le document : couverture du programme
 * publié (édition), notions étudiées, notions maîtrisées (progression réelle
 * de l'utilisateur). Jamais de chiffre inventé : tout est dérivé des données.
 */
export async function getCatalogStats(userId: string | null): Promise<CategoryStatsView[]> {
  const data = userId ? await readData() : null;
  const byCategory = new Map<string, CategoryStatsView>();
  for (const concept of concepts) {
    const category = getCategoryIdForConcept(concept.chapterId);
    if (!category) continue;
    const stats = byCategory.get(category) ?? {
      categoryId: category,
      totalConcepts: 0,
      publishedConcepts: 0,
      studiedConcepts: 0,
      masteredConcepts: 0,
    };
    stats.totalConcepts += 1;
    if (concept.status === "published") stats.publishedConcepts += 1;
    const progress = data && userId ? data.conceptProgress[progressKey(userId, concept.id)] : undefined;
    if (progress && progress.status !== "to-discover") stats.studiedConcepts += 1;
    if (progress && progress.status === "mastered") stats.masteredConcepts += 1;
    byCategory.set(category, stats);
  }
  return Array.from(byCategory.values());
}

function getCategoryIdForConcept(chapterId: string): string | null {
  return chapters.find((c) => c.id === chapterId)?.categoryId ?? null;
}

function progressKey(userId: string, conceptId: string) {
  return `${userId}:${conceptId}`;
}
function reviewKey(userId: string, questionId: string) {
  return `${userId}:${questionId}`;
}

export interface CreateSessionInput {
  userId: string;
  mode: "course" | "training" | "exam";
  locale: "fr" | "en";
  conceptIds?: string[];
}

export async function createStudySession(input: CreateSessionInput): Promise<{ sessionId: string; questionCount: number }> {
  const conceptIds = input.conceptIds && input.conceptIds.length > 0 ? input.conceptIds : getPublishedConceptIds();
  const questionIds = conceptIds.flatMap((id) => (questionsByConceptId[id] ?? []).map((q) => q.id));
  if (questionIds.length === 0) {
    throw new RangeError("No published questions for the requested concepts");
  }
  return withWriteLock((data) => {
    const id = randomUUID();
    data.studySessions[id] = {
      id,
      userId: input.userId,
      mode: input.mode,
      locale: input.locale,
      startedAt: new Date().toISOString(),
      completedAt: null,
      questionIds,
    };
    return { sessionId: id, questionCount: questionIds.length };
  });
}

export interface SessionItemView {
  questionId: string;
  question: QuestionPublic;
}

export async function getSessionItems(userId: string, sessionId: string): Promise<SessionItemView[]> {
  const data = await readData();
  const session = data.studySessions[sessionId];
  if (!session || session.userId !== userId) {
    throw new RangeError("Session not found for this user");
  }
  return session.questionIds
    .map((qid) => questionById[qid])
    .filter((q): q is QuestionPublic => Boolean(q))
    .map((question) => ({ questionId: question.id, question: stripToLocale(question) }));
}

function stripToLocale(q: QuestionPublic): QuestionPublic {
  // Les deux langues sont déjà présentes dans Bi ; le tri par locale se fait à l'affichage.
  return q;
}

export interface AttemptInput {
  userId: string;
  sessionId: string;
  questionId: string;
  clientAttemptKey: string;
  answer: SubmittedAnswer;
  durationMs: number;
  timezone: string;
}

export interface AttemptResult {
  isCorrect: boolean;
  explanation: string;
  calculation?: string;
  commonMistake: string;
  conceptStatus: ConceptStatus;
  nextDueAt: string | null;
  requeueAtSessionEnd: boolean;
}

export async function submitAttempt(input: AttemptInput): Promise<AttemptResult> {
  return withWriteLock((data) => {
    const session = data.studySessions[input.sessionId];
    if (!session || session.userId !== input.userId) {
      throw new RangeError("Session not found for this user");
    }
    if (!session.questionIds.includes(input.questionId)) {
      throw new RangeError("Question does not belong to this session");
    }

    const idempotencyKey = `${input.userId}:${input.clientAttemptKey}`;
    const existingAttemptId = data.attemptIdempotency[idempotencyKey];
    const question = questionById[input.questionId];
    const solution = solutionByQuestionId[input.questionId];
    if (!question || !solution) throw new RangeError("Unknown question");

    let attempt: AttemptRecord;
    if (existingAttemptId && data.attempts[existingAttemptId]) {
      attempt = data.attempts[existingAttemptId];
    } else {
      const graded = gradeAnswer(solution, input.answer);
      attempt = {
        id: randomUUID(),
        userId: input.userId,
        sessionId: input.sessionId,
        questionId: input.questionId,
        answer: input.answer,
        isCorrect: graded.isCorrect,
        score: graded.score,
        answeredAt: new Date().toISOString(),
        durationMs: input.durationMs,
      };
      data.attempts[attempt.id] = attempt;
      data.attemptIdempotency[idempotencyKey] = attempt.id;
    }

    const rKey = reviewKey(input.userId, input.questionId);
    const previousCard = data.reviewCards[rKey] ?? null;
    const { progress, requeueAtSessionEnd } = scheduleReview(
      previousCard,
      attempt.isCorrect,
      new Date(attempt.answeredAt),
      input.timezone
    );
    data.reviewCards[rKey] = {
      ...progress,
      userId: input.userId,
      questionId: input.questionId,
      conceptId: question.conceptId,
    };

    const conceptQuestionIds = (questionsByConceptId[question.conceptId] ?? []).map((q) => q.id);
    const cardsForConcept = conceptQuestionIds
      .map((qid) => data.reviewCards[reviewKey(input.userId, qid)])
      .filter((c): c is ReviewCardRecord => Boolean(c));
    const status = deriveConceptStatus(cardsForConcept, new Date(attempt.answeredAt));
    data.conceptProgress[progressKey(input.userId, question.conceptId)] = {
      userId: input.userId,
      conceptId: question.conceptId,
      status,
      lastStudiedAt: attempt.answeredAt,
    };

    return {
      isCorrect: attempt.isCorrect,
      explanation: solution.explanation[session.locale],
      calculation: solution.calculation?.[session.locale],
      commonMistake: solution.commonMistake[session.locale],
      conceptStatus: status,
      nextDueAt: progress.dueAt,
      requeueAtSessionEnd,
    };
  });
}

export interface DueReviewView {
  conceptId: string;
  dueAt: string;
}

export async function getDueReviews(userId: string, now: Date): Promise<DueReviewView[]> {
  const data = await readData();
  const conceptIds = new Set<string>();
  const result: DueReviewView[] = [];
  for (const card of Object.values(data.reviewCards)) {
    if (card.userId !== userId || !card.dueAt) continue;
    if (Date.parse(card.dueAt) > now.getTime()) continue;
    if (conceptIds.has(card.conceptId)) continue;
    conceptIds.add(card.conceptId);
    result.push({ conceptId: card.conceptId, dueAt: card.dueAt });
  }
  return result.sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));
}

export async function toggleBookmark(userId: string, conceptId: string): Promise<boolean> {
  if (!getConceptById(conceptId)) throw new RangeError("Unknown concept");
  return withWriteLock((data) => {
    const key = progressKey(userId, conceptId);
    const isBookmarked = Boolean(data.bookmarks[key]);
    if (isBookmarked) delete data.bookmarks[key];
    else data.bookmarks[key] = true;
    return !isBookmarked;
  });
}
