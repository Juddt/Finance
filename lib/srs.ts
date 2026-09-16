/**
 * Moteur de répétition espacée — règle explicite et testable pour le MVP
 * (voir document de cadrage, section 5). Ce n'est pas FSRS ni SM-2 : un point
 * de départ, pas une garantie pédagogique optimale.
 *
 * Intervalles de 1, 3, 7, 14, 30 et 60 jours après réussites espacées ;
 * échec = retour en fin de session puis nouvelle révision à J+1. Une réussite
 * juste après correction ou une révision anticipée ne fait pas monter
 * artificiellement les intervalles.
 */

export const ALGORITHM_VERSION = "simple-v1";
export const INTERVAL_DAYS = [1, 3, 7, 14, 30, 60] as const;
const DAY_MS = 86_400_000;
const MAX_STEP = INTERVAL_DAYS.length; // step 6 = "mature", au-delà du dernier palier

export interface ReviewState {
  step: number; // 0..6
  dueAt: string | null; // ISO timestamp, ou null si jamais révisé
  lastStudyDay: string | null; // "YYYY-MM-DD" dans le fuseau utilisateur
  lapses: number;
}

export interface ScheduleResult {
  progress: ReviewState;
  /** Une notion ratée doit être revue en fin de session courante, en plus de J+1. */
  requeueAtSessionEnd: boolean;
}

function studyDay(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  const year = get("year");
  const month = get("month");
  const day = get("day");
  if (!year || !month || !day) throw new RangeError("Invalid timeZone");
  return `${year}-${month}-${day}`;
}

export function scheduleReview(
  previous: ReviewState | null,
  correct: boolean,
  now: Date,
  timeZone = "Europe/Paris"
): ScheduleResult {
  if (typeof correct !== "boolean") throw new TypeError("Boolean required");
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new TypeError("Valid Date required");
  }
  const state: ReviewState = previous ?? { step: 0, dueAt: null, lastStudyDay: null, lapses: 0 };
  if (!Number.isInteger(state.step) || state.step < 0 || state.step > MAX_STEP) {
    throw new RangeError(`Step must be in [0, ${MAX_STEP}]`);
  }
  if (!Number.isInteger(state.lapses) || state.lapses < 0) {
    throw new RangeError("Invalid lapses");
  }
  const dueMs = state.dueAt === null ? null : Date.parse(state.dueAt);
  if (dueMs !== null && !Number.isFinite(dueMs)) {
    throw new TypeError("Invalid dueAt");
  }

  const day = studyDay(now, timeZone);
  const afterDays = (days: number) => new Date(now.getTime() + days * DAY_MS).toISOString();

  if (!correct) {
    return {
      progress: { step: 0, dueAt: afterDays(1), lastStudyDay: day, lapses: state.lapses + 1 },
      requeueAtSessionEnd: true,
    };
  }

  // Pas d'inflation de maîtrise après une correction déjà vue le même jour, ni après révision anticipée.
  if (state.lastStudyDay === day || (dueMs !== null && now.getTime() < dueMs)) {
    return { progress: { ...state }, requeueAtSessionEnd: false };
  }

  const interval = INTERVAL_DAYS[Math.min(state.step, INTERVAL_DAYS.length - 1)];
  return {
    progress: {
      step: Math.min(state.step + 1, MAX_STEP),
      dueAt: afterDays(interval),
      lastStudyDay: day,
      lapses: state.lapses,
    },
    requeueAtSessionEnd: false,
  };
}

export type ConceptStatus = "to-discover" | "in-progress" | "fragile" | "mastered" | "to-reactivate";

/**
 * Statut affichable d'une notion à partir de l'agrégat de ses cartes de révision.
 * La maîtrise repose sur plusieurs variantes et plusieurs jours (règle affichée, configurable).
 */
export function deriveConceptStatus(cards: ReviewState[], now: Date): ConceptStatus {
  if (cards.length === 0) return "to-discover";
  const anyLapseRecent = cards.some((c) => c.lapses > 0 && c.step <= 1);
  if (anyLapseRecent) return "fragile";
  const overdue = cards.some((c) => c.dueAt !== null && Date.parse(c.dueAt) < now.getTime() - 7 * DAY_MS);
  if (overdue) return "to-reactivate";
  const allMature = cards.every((c) => c.step >= 4); // step 4 = intervalle 30j atteint
  if (allMature && cards.length >= 2) return "mastered";
  return "in-progress";
}
