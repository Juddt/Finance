import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { categories, chapters, concepts, getConceptById } from "@/content/catalog";
import { templateById, templatesByConceptId } from "./content-registry";
import { gradeAnswer } from "./grading";
import { pickNextTemplate, resolveTargetDifficulty, detectDifficultyShift, type SessionAnswerRecord, type DifficultyShift } from "./adaptive-quiz";
import { mulberry32, randomSeed } from "./prng";
import { instantiateTemplate, toGeneratedQuestionView, toSolution, type GeneratedQuestion, type GeneratedQuestionView, type Difficulty } from "./question-templates";
import type { SubmittedAnswer } from "./question-types";
import { resolveConceptIdsForSpec, sessionLengthToNumber, type SessionSpec } from "./session-spec";
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

interface AnsweredEntry {
  templateId: string;
  isCorrect: boolean;
  difficulty: Difficulty;
  /** false pour un "exercice similaire" immédiat : ne compte pas dans la longueur de session. */
  counted: boolean;
  answeredAt: string;
}

interface StudySession {
  id: string;
  userId: string;
  locale: "fr" | "en";
  spec: SessionSpec;
  length: number | null;
  templatePoolIds: string[];
  answered: AnsweredEntry[];
  recentTemplateIds: string[];
  currentInstance: GeneratedQuestion | null;
  startedAt: string;
  completedAt: string | null;
}

interface AttemptRecord {
  id: string;
  userId: string;
  sessionId: string;
  instanceId: string;
  templateId: string;
  isCorrect: boolean;
  score: number;
  answeredAt: string;
  durationMs: number;
}

interface ReviewCardRecord extends ReviewState {
  userId: string;
  templateId: string;
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
  attemptIdempotency: Record<string, string>; // `${userId}:${instanceId}` -> attempt id
  reviewCards: Record<string, ReviewCardRecord>; // `${userId}:${templateId}`
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
function reviewKey(userId: string, templateId: string) {
  return `${userId}:${templateId}`;
}

export interface SessionProgress {
  index: number;
  total: number | null;
  correctCount: number;
}

function computeProgress(session: StudySession): SessionProgress {
  const counted = session.answered.filter((a) => a.counted);
  return {
    index: counted.length,
    total: session.length,
    correctCount: counted.filter((a) => a.isCorrect).length,
  };
}

function isSessionDone(session: StudySession): boolean {
  const { index, total } = computeProgress(session);
  return total !== null && index >= total;
}

/** Cartes de révision "en échec récent" (au moins un lapse) pour le mode "Revoir mes erreurs". */
function resolveMistakeTemplateIds(userId: string, data: PersistedData): string[] {
  return Object.values(data.reviewCards)
    .filter((c) => c.userId === userId && c.lapses > 0 && templateById[c.templateId])
    .map((c) => c.templateId);
}

function resolveTemplatePool(spec: SessionSpec, userId: string, data: PersistedData): string[] {
  if (spec.mode === "review-mistakes") return resolveMistakeTemplateIds(userId, data);
  const conceptIds = resolveConceptIdsForSpec(spec, { categories, chapters, concepts });
  return conceptIds.flatMap((id) => (templatesByConceptId[id] ?? []).map((t) => t.id));
}

function generateNextQuestion(
  session: StudySession
): { instance: GeneratedQuestion; difficultyShift: DifficultyShift } {
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
  const instance = instantiateTemplate(template, rng, randomUUID());
  const difficultyShift = detectDifficultyShift(previousDifficulty, instance.difficulty);

  return { instance, difficultyShift };
}

export interface CreateSessionResult {
  sessionId: string;
  question: GeneratedQuestionView | null;
  progress: SessionProgress;
  empty: boolean;
}

export async function createStudySession(userId: string, locale: "fr" | "en", spec: SessionSpec): Promise<CreateSessionResult> {
  return withWriteLock((data) => {
    const templatePoolIds = resolveTemplatePool(spec, userId, data);
    const id = randomUUID();

    if (templatePoolIds.length === 0) {
      const session: StudySession = {
        id,
        userId,
        locale,
        spec,
        length: 0,
        templatePoolIds: [],
        answered: [],
        recentTemplateIds: [],
        currentInstance: null,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      data.studySessions[id] = session;
      return { sessionId: id, question: null, progress: { index: 0, total: 0, correctCount: 0 }, empty: true };
    }

    const length = spec.mode === "concept" ? templatePoolIds.length : sessionLengthToNumber(spec.length);
    const session: StudySession = {
      id,
      userId,
      locale,
      spec,
      length,
      templatePoolIds,
      answered: [],
      recentTemplateIds: [],
      currentInstance: null,
      startedAt: new Date().toISOString(),
      completedAt: null,
    };

    const { instance } = generateNextQuestion(session);
    session.currentInstance = instance;
    session.recentTemplateIds = [instance.templateId, ...session.recentTemplateIds].slice(0, 2);
    data.studySessions[id] = session;

    return {
      sessionId: id,
      question: toGeneratedQuestionView(instance, locale),
      progress: computeProgress(session),
      empty: false,
    };
  });
}

export interface NextQuestionResult {
  question: GeneratedQuestionView | null;
  progress: SessionProgress;
  done: boolean;
  difficultyShift: DifficultyShift;
}

export async function getNextQuestion(userId: string, sessionId: string): Promise<NextQuestionResult> {
  return withWriteLock((data) => {
    const session = data.studySessions[sessionId];
    if (!session || session.userId !== userId) throw new RangeError("Session not found for this user");

    if (isSessionDone(session)) {
      session.completedAt = session.completedAt ?? new Date().toISOString();
      return { question: null, progress: computeProgress(session), done: true, difficultyShift: null };
    }

    const { instance, difficultyShift } = generateNextQuestion(session);
    session.currentInstance = instance;
    session.recentTemplateIds = [instance.templateId, ...session.recentTemplateIds].slice(0, 2);

    return {
      question: toGeneratedQuestionView(instance, session.locale),
      progress: computeProgress(session),
      done: false,
      difficultyShift,
    };
  });
}

export interface SimilarQuestionResult {
  question: GeneratedQuestionView;
}

/** Regénère une variante du même template que la question courante — l'"exercice similaire" après correction. */
export async function getSimilarQuestion(userId: string, sessionId: string): Promise<SimilarQuestionResult> {
  return withWriteLock((data) => {
    const session = data.studySessions[sessionId];
    if (!session || session.userId !== userId) throw new RangeError("Session not found for this user");
    if (!session.currentInstance) throw new RangeError("No current question to build a similar exercise from");

    const template = templateById[session.currentInstance.templateId];
    if (!template) throw new RangeError("Unknown template");

    const rng = mulberry32(randomSeed());
    const instance = instantiateTemplate(template, rng, randomUUID());
    session.currentInstance = instance;

    return { question: toGeneratedQuestionView(instance, session.locale) };
  });
}

export interface AttemptInput {
  userId: string;
  sessionId: string;
  instanceId: string;
  answer: SubmittedAnswer;
  durationMs: number;
  counted: boolean;
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
  progress: SessionProgress;
  done: boolean;
}

export async function submitAttempt(input: AttemptInput): Promise<AttemptResult> {
  return withWriteLock((data) => {
    const session = data.studySessions[input.sessionId];
    if (!session || session.userId !== input.userId) {
      throw new RangeError("Session not found for this user");
    }
    if (!session.currentInstance || session.currentInstance.instanceId !== input.instanceId) {
      throw new RangeError("This question is not the session's current question");
    }
    const instance = session.currentInstance;

    const idempotencyKey = `${input.userId}:${input.instanceId}`;
    const existingAttemptId = data.attemptIdempotency[idempotencyKey];
    const solution = toSolution(instance);

    let attempt: AttemptRecord;
    let alreadyAnswered = false;
    if (existingAttemptId && data.attempts[existingAttemptId]) {
      attempt = data.attempts[existingAttemptId];
      alreadyAnswered = true;
    } else {
      const graded = gradeAnswer(solution, input.answer);
      attempt = {
        id: randomUUID(),
        userId: input.userId,
        sessionId: input.sessionId,
        instanceId: input.instanceId,
        templateId: instance.templateId,
        isCorrect: graded.isCorrect,
        score: graded.score,
        answeredAt: new Date().toISOString(),
        durationMs: input.durationMs,
      };
      data.attempts[attempt.id] = attempt;
      data.attemptIdempotency[idempotencyKey] = attempt.id;
    }

    // Idempotence : une même instanceId ne doit être notée (SRS, progression, longueur de
    // session) qu'une seule fois, même si submitAttempt est rappelée (double-clic, retry réseau).
    let status: ConceptStatus;
    let nextDueAt: string | null;
    let requeueAtSessionEnd: boolean;

    if (!alreadyAnswered) {
      const rKey = reviewKey(input.userId, instance.templateId);
      const previousCard = data.reviewCards[rKey] ?? null;
      const scheduled = scheduleReview(previousCard, attempt.isCorrect, new Date(attempt.answeredAt), input.timezone);
      data.reviewCards[rKey] = {
        ...scheduled.progress,
        userId: input.userId,
        templateId: instance.templateId,
        conceptId: instance.conceptId,
      };
      nextDueAt = scheduled.progress.dueAt;
      requeueAtSessionEnd = scheduled.requeueAtSessionEnd;

      const conceptTemplateIds = (templatesByConceptId[instance.conceptId] ?? []).map((t) => t.id);
      const cardsForConcept = conceptTemplateIds
        .map((tid) => data.reviewCards[reviewKey(input.userId, tid)])
        .filter((c): c is ReviewCardRecord => Boolean(c));
      status = deriveConceptStatus(cardsForConcept, new Date(attempt.answeredAt));
      data.conceptProgress[progressKey(input.userId, instance.conceptId)] = {
        userId: input.userId,
        conceptId: instance.conceptId,
        status,
        lastStudiedAt: attempt.answeredAt,
      };

      session.answered.push({
        templateId: instance.templateId,
        isCorrect: attempt.isCorrect,
        difficulty: instance.difficulty,
        counted: input.counted,
        answeredAt: attempt.answeredAt,
      });
    } else {
      status = data.conceptProgress[progressKey(input.userId, instance.conceptId)]?.status ?? "to-discover";
      nextDueAt = data.reviewCards[reviewKey(input.userId, instance.templateId)]?.dueAt ?? null;
      requeueAtSessionEnd = false;
    }
    const done = isSessionDone(session);
    if (done) session.completedAt = session.completedAt ?? new Date().toISOString();

    return {
      isCorrect: attempt.isCorrect,
      explanation: solution.explanation[session.locale],
      calculation: solution.calculation?.[session.locale],
      commonMistake: solution.commonMistake[session.locale],
      conceptStatus: status,
      nextDueAt,
      requeueAtSessionEnd,
      progress: computeProgress(session),
      done,
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

export async function hasMistakesToReview(userId: string): Promise<boolean> {
  const data = await readData();
  return resolveMistakeTemplateIds(userId, data).length > 0;
}

/** Statut par notion (à découvrir/en cours/fragile/maîtrisée/à réactiver) — voir doc section 5. */
export async function getConceptProgressMap(userId: string): Promise<Record<string, ConceptStatus>> {
  const data = await readData();
  const result: Record<string, ConceptStatus> = {};
  for (const [key, record] of Object.entries(data.conceptProgress)) {
    if (!key.startsWith(`${userId}:`)) continue;
    result[record.conceptId] = record.status;
  }
  return result;
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
