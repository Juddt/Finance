/**
 * Types partagés entre les deux moteurs de session (lib/store.ts côté
 * serveur, lib/quiz-engine-client.ts côté statique) et l'UI (components/
 * QuizShell.tsx). Fichier sans dépendance runtime (ni node:fs, ni
 * localStorage) : peut être importé aussi bien par un composant client que
 * par du code serveur.
 */
import type { DifficultyShift } from "./adaptive-quiz";
import type { ConceptStatus } from "./srs";

export interface SessionProgress {
  index: number;
  total: number | null;
  correctCount: number;
}

export interface AttemptResponse {
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

export type { DifficultyShift };
