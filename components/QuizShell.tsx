"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { parseLocaleNumber } from "@/lib/grading";
import type { GeneratedQuestionView } from "@/lib/question-templates";
import type { SubmittedAnswer } from "@/lib/question-types";
import type { AttemptResponse, DifficultyShift, SessionProgress } from "@/lib/quiz-session-types";
import { PayoffChart } from "./PayoffChart";
import { Button } from "./Button";

export interface QuizDict {
  questionOf: string;
  questionCount: string;
  difficulty: { easy: string; medium: string; hard: string };
  validate: string;
  next: string;
  finish: string;
  correct: string;
  incorrect: string;
  explanation: string;
  calculation: string;
  commonMistake: string;
  hint: string;
  showHint: string;
  showSolution: string;
  similarExercise: string;
  numericPlaceholder: string;
  fillBlankPlaceholder: string;
  sessionDone: string;
  sessionDoneSummary: string;
  nextReview: string;
  continueSession: string;
  endSession: string;
  difficultyAdjustedUp: string;
  difficultyAdjustedDown: string;
  reviewChartLabel: string;
}

export interface StartResult {
  sessionId: string;
  question: GeneratedQuestionView | null;
  progress: SessionProgress;
  empty: boolean;
}

export interface NextResult {
  question: GeneratedQuestionView | null;
  progress: SessionProgress;
  done: boolean;
  difficultyShift: DifficultyShift;
}

export interface QuizBackend {
  start(): Promise<StartResult>;
  submitAttempt(params: {
    sessionId: string;
    instanceId: string;
    answer: SubmittedAnswer;
    durationMs: number;
    counted: boolean;
  }): Promise<AttemptResponse>;
  next(sessionId: string): Promise<NextResult>;
  similar(sessionId: string): Promise<{ question: GeneratedQuestionView }>;
}

function conceptLabel(locale: Locale, conceptId: string): string {
  // Résolu côté serveur normalement ; ici on affiche juste un lien vers le cours.
  void conceptId;
  return locale === "fr" ? "Voir le cours de cette notion" : "See this concept's lesson";
}

export function QuizShell({
  locale,
  dict,
  backend,
  emptyMessage,
}: {
  locale: Locale;
  dict: QuizDict;
  backend: QuizBackend;
  emptyMessage?: string;
}) {
  const [phase, setPhase] = useState<"loading" | "question" | "empty" | "finished">("loading");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<GeneratedQuestionView | null>(null);
  const [progress, setProgress] = useState<SessionProgress>({ index: 0, total: null, correctCount: 0 });
  const [isSimilar, setIsSimilar] = useState(false);

  const [selected, setSelected] = useState("");
  const [numericValue, setNumericValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [difficultyShift, setDifficultyShift] = useState<DifficultyShift>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAtRef = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startedAtRef.current = Date.now();
    backend
      .start()
      .then((res) => {
        setSessionId(res.sessionId);
        setProgress(res.progress);
        if (res.empty || !res.question) {
          setPhase("empty");
        } else {
          setQuestion(res.question);
          setPhase("question");
        }
      })
      .catch(() => setError("session_error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetAnswerState() {
    setSelected("");
    setNumericValue("");
    setTextValue("");
    setShowHint(false);
    setResult(null);
    setDifficultyShift(null);
    startedAtRef.current = Date.now();
  }

  async function submit() {
    if (!sessionId || !question) return;
    let answer: SubmittedAnswer;
    if (question.kind === "numeric") {
      try {
        answer = { kind: "numeric", value: parseLocaleNumber(numericValue) };
      } catch {
        setError("invalid_number");
        return;
      }
    } else if (question.kind === "fill_blank") {
      if (!textValue.trim()) return;
      answer = { kind: "fill_blank", text: textValue };
    } else {
      if (!selected) return;
      answer = { kind: question.kind, choiceId: selected };
    }

    setSubmitting(true);
    setError(null);
    try {
      const data = await backend.submitAttempt({
        sessionId,
        instanceId: question.instanceId,
        answer,
        durationMs: Date.now() - startedAtRef.current,
        counted: !isSimilar,
      });
      setResult(data);
      setProgress(data.progress);
    } catch {
      setError("attempt_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function goNext() {
    if (!sessionId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await backend.next(sessionId);
      setProgress(res.progress);
      setDifficultyShift(res.difficultyShift);
      setIsSimilar(false);
      if (res.done || !res.question) {
        setPhase("finished");
      } else {
        setQuestion(res.question);
        resetAnswerState();
        setPhase("question");
      }
    } catch {
      setError("attempt_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function trySimilar() {
    if (!sessionId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await backend.similar(sessionId);
      setQuestion(res.question);
      setIsSimilar(true);
      resetAnswerState();
    } catch {
      setError("attempt_failed");
    } finally {
      setSubmitting(false);
    }
  }

  function endEarly() {
    setPhase("finished");
  }

  if (phase === "loading") {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 font-mono text-sm text-text-faint">
        <span className="animate-pulse-dim">…</span>
      </div>
    );
  }

  if (phase === "empty") {
    return <div className="rounded-xl border border-line bg-surface p-6 text-sm text-text-dim">{emptyMessage ?? "—"}</div>;
  }

  if (phase === "finished") {
    return (
      <div className="rounded-xl border border-accent/40 bg-surface p-8 text-center">
        <p className="text-2xl font-bold text-text">{dict.sessionDone}</p>
        <p className="mt-2 text-text-dim">
          {dict.sessionDoneSummary.replace("{correct}", String(progress.correctCount)).replace("{total}", String(progress.index))}
        </p>
      </div>
    );
  }

  if (!question) return null;
  const isLastCounted = progress.total !== null && progress.index >= progress.total && !isSimilar;
  // progress.index compte les questions déjà répondues : tant que la correction de la
  // question courante est affichée, son propre numéro reste index (pas index+1).
  const displayNumber = result ? progress.index : progress.index + 1;
  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-text-dim uppercase">
        <span>
          {isSimilar
            ? dict.similarExercise
            : progress.total !== null
              ? dict.questionOf.replace("{current}", String(displayNumber)).replace("{total}", String(progress.total))
              : dict.questionCount.replace("{current}", String(displayNumber))}
        </span>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] tracking-[0.1em] text-text-faint">
          {dict.difficulty[question.difficulty]}
        </span>
      </div>

      {difficultyShift && (
        <p className="mb-4 rounded-lg bg-info-soft px-3 py-1.5 font-mono text-[11px] text-info">
          {difficultyShift === "up" ? dict.difficultyAdjustedUp : dict.difficultyAdjustedDown}
        </p>
      )}

      {question.chart && <PayoffChart chart={question.chart} label={dict.reviewChartLabel} />}

      <p className="mb-5 text-xl leading-snug font-semibold text-text">{question.prompt}</p>

      {(question.kind === "mcq" || question.kind === "true_false") && question.choices && (
        <fieldset className="mb-5 space-y-2" disabled={Boolean(result)}>
          {question.choices.map((choice, i) => {
            const isSelected = selected === choice.id;
            const showAsWrong = Boolean(result) && isSelected && !result!.isCorrect;
            const showAsRight = Boolean(result) && isSelected && result!.isCorrect;
            return (
              <label
                key={choice.id}
                className={`interactive-lift flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-[15px] ${
                  showAsRight
                    ? "border-success bg-success-soft text-success"
                    : showAsWrong
                      ? "border-danger bg-danger-soft text-danger"
                      : isSelected
                        ? "border-accent bg-surface-2 text-text"
                        : "border-line bg-surface-2 text-text hover:border-accent/40"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${
                    showAsRight
                      ? "bg-success text-ink-on-accent"
                      : showAsWrong
                        ? "bg-danger text-ink-on-accent"
                        : isSelected
                          ? "bg-accent text-ink-on-accent"
                          : "bg-bg text-text-faint"
                  }`}
                >
                  {showAsRight ? "✓" : showAsWrong ? "✗" : (letters[i] ?? i + 1)}
                </span>
                <input
                  type="radio"
                  name={question.instanceId}
                  value={choice.id}
                  checked={selected === choice.id}
                  onChange={() => setSelected(choice.id)}
                  className="sr-only"
                />
                {choice.label}
              </label>
            );
          })}
        </fieldset>
      )}

      {question.kind === "numeric" && (
        <div className="mb-5">
          <input
            type="text"
            inputMode="decimal"
            placeholder={dict.numericPlaceholder}
            value={numericValue}
            disabled={Boolean(result)}
            onChange={(e) => setNumericValue(e.target.value)}
            className="w-48 rounded-xl border border-line bg-surface-2 px-4 py-2.5 font-mono text-sm text-text outline-none focus:border-accent"
          />
          {question.numericUnit && <span className="ml-2 text-sm text-text-dim">{question.numericUnit}</span>}
          {question.numericTolerance && <p className="mt-1 font-mono text-xs text-text-faint">{question.numericTolerance}</p>}
        </div>
      )}

      {question.kind === "fill_blank" && (
        <div className="mb-5">
          <input
            type="text"
            placeholder={question.fillBlankPlaceholder ?? dict.fillBlankPlaceholder}
            value={textValue}
            disabled={Boolean(result)}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-64 rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
        </div>
      )}

      {question.hint && !result && (
        <div className="mb-5">
          {showHint ? (
            <p className="font-mono text-xs text-text-dim">
              {dict.hint}: {question.hint}
            </p>
          ) : (
            <button type="button" onClick={() => setShowHint(true)} className="font-mono text-xs font-medium text-accent-bright hover:underline">
              {dict.showHint}
            </button>
          )}
        </div>
      )}

      {error && <p className="mb-3 font-mono text-sm text-danger">{error}</p>}

      {!result ? (
        <Button onClick={submit} disabled={submitting || !sessionId} variant="primary">
          {dict.validate}
        </Button>
      ) : (
        <div className="space-y-3">
          <p
            className={`flex items-center gap-1.5 text-sm font-semibold tracking-[0.02em] uppercase ${result.isCorrect ? "text-success" : "text-danger"}`}
          >
            <span aria-hidden="true">{result.isCorrect ? "✓" : "✗"}</span>
            {result.isCorrect ? dict.correct : dict.incorrect}
          </p>
          <p className="text-sm text-text">
            <span className="font-semibold">{dict.explanation}: </span>
            {result.explanation}
          </p>
          {result.calculation && (
            <p className="font-mono text-[13px] text-text">
              <span className="font-sans font-semibold">{dict.calculation}: </span>
              {result.calculation}
            </p>
          )}
          <p className="text-sm text-text-dim">
            <span className="font-semibold text-text">{dict.commonMistake}: </span>
            {result.commonMistake}
          </p>
          <Link
            href={`/${locale}/lessons/${question.conceptId}`}
            className="inline-block font-mono text-xs font-medium text-accent-bright hover:underline"
          >
            {conceptLabel(locale, question.conceptId)}
          </Link>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button onClick={trySimilar} disabled={submitting} variant="secondary">
              {dict.similarExercise}
            </Button>
            <Button onClick={goNext} disabled={submitting} variant="primary">
              {isLastCounted ? dict.finish : progress.total === null ? dict.continueSession : dict.next}
            </Button>
            {progress.total === null && (
              <Button onClick={endEarly} variant="tertiary">
                {dict.endSession}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
