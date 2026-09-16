"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { parseLocaleNumber } from "@/lib/grading";
import type { QuestionView, SubmittedAnswer } from "@/lib/question-types";

export interface QuizDict {
  questionOf: string;
  validate: string;
  next: string;
  finish: string;
  correct: string;
  incorrect: string;
  explanation: string;
  calculation: string;
  commonMistake: string;
  hint: string;
  numericPlaceholder: string;
  sessionDone: string;
  nextReview: string;
}

export interface AttemptResponse {
  isCorrect: boolean;
  explanation: string;
  calculation?: string;
  commonMistake: string;
  conceptStatus: string;
  nextDueAt: string | null;
}

export interface QuizBackend {
  createSession(): Promise<string>;
  submitAttempt(params: {
    sessionId: string;
    questionId: string;
    clientAttemptKey: string;
    answer: SubmittedAnswer;
    durationMs: number;
  }): Promise<AttemptResponse>;
}

/**
 * UI et logique de déroulé du quiz, indépendantes de l'origine de la
 * correction. `backend` fournit soit des appels serveur (components/
 * QuizRunner.tsx, build normal), soit un moteur local localStorage
 * (components/StaticQuizRunner.tsx, build GitHub Pages) — voir README.
 */
export function QuizShell({
  locale,
  questions,
  dict,
  backend,
}: {
  locale: Locale;
  questions: QuestionView[];
  dict: QuizDict;
  backend: QuizBackend;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialIndex = Math.min(Math.max(Number(searchParams.get("q") ?? 0) || 0, 0), questions.length - 1);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [index, setIndex] = useState(initialIndex);
  const [selected, setSelected] = useState<string>("");
  const [numericValue, setNumericValue] = useState<string>("");
  const [result, setResult] = useState<AttemptResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAtRef = useRef<number>(0);
  const sessionCreated = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (sessionCreated.current) return;
    sessionCreated.current = true;
    backend
      .createSession()
      .then((id) => setSessionId(id))
      .catch(() => setError("session_error"));
    // backend identity is stable per mount (conceptId/locale change remounts the whole subtree via key).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const question = questions[index];

  function goTo(nextIndex: number) {
    setIndex(nextIndex);
    setSelected("");
    setNumericValue("");
    setResult(null);
    startedAtRef.current = Date.now();
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", String(nextIndex));
    router.replace(`?${params.toString()}`, { scroll: false });
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
    } else {
      if (!selected) return;
      answer = { kind: question.kind, choiceId: selected };
    }

    setSubmitting(true);
    setError(null);
    try {
      const data = await backend.submitAttempt({
        sessionId,
        questionId: question.id,
        clientAttemptKey: `${sessionId}:${question.id}`,
        answer,
        durationMs: Date.now() - startedAtRef.current,
      });
      setResult(data);
    } catch {
      setError("attempt_failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!question) return null;
  const isLast = index === questions.length - 1;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
        {dict.questionOf.replace("{current}", String(index + 1)).replace("{total}", String(questions.length))}
      </p>
      <p className="mb-4 text-base font-medium">{question.prompt}</p>

      {question.kind !== "numeric" && question.choices && (
        <fieldset className="mb-4 space-y-2" disabled={Boolean(result)}>
          {question.choices.map((choice) => {
            const isSelected = selected === choice.id;
            const showAsWrong = Boolean(result) && isSelected && !result!.isCorrect;
            const showAsRight = Boolean(result) && isSelected && result!.isCorrect;
            return (
              <label
                key={choice.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  isSelected ? "border-neutral-900 dark:border-white" : "border-black/10 dark:border-white/10"
                } ${showAsWrong ? "bg-red-50 dark:bg-red-950/30" : ""} ${showAsRight ? "bg-emerald-50 dark:bg-emerald-950/30" : ""}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={choice.id}
                  checked={selected === choice.id}
                  onChange={() => setSelected(choice.id)}
                />
                {choice.label}
              </label>
            );
          })}
        </fieldset>
      )}

      {question.kind === "numeric" && (
        <div className="mb-4">
          <input
            type="text"
            inputMode="decimal"
            placeholder={dict.numericPlaceholder}
            value={numericValue}
            disabled={Boolean(result)}
            onChange={(e) => setNumericValue(e.target.value)}
            className="w-48 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/15 dark:bg-neutral-800"
          />
          {question.numericUnit && <span className="ml-2 text-sm text-neutral-500">{question.numericUnit}</span>}
          {question.numericTolerance && <p className="mt-1 text-xs text-neutral-400">{question.numericTolerance}</p>}
        </div>
      )}

      {question.hint && !result && (
        <p className="mb-4 text-xs text-neutral-500">
          💡 {dict.hint}: {question.hint}
        </p>
      )}

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {!result ? (
        <button
          onClick={submit}
          disabled={submitting || !sessionId}
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {dict.validate}
        </button>
      ) : (
        <div className="space-y-2">
          <p className={`font-semibold ${result.isCorrect ? "text-emerald-600" : "text-red-600"}`}>
            {result.isCorrect ? `✓ ${dict.correct}` : `✗ ${dict.incorrect}`}
          </p>
          <p className="text-sm">
            <span className="font-medium">{dict.explanation}: </span>
            {result.explanation}
          </p>
          {result.calculation && (
            <p className="text-sm">
              <span className="font-medium">{dict.calculation}: </span>
              {result.calculation}
            </p>
          )}
          <p className="text-sm text-neutral-500">
            <span className="font-medium">{dict.commonMistake}: </span>
            {result.commonMistake}
          </p>

          {isLast ? (
            <p className="pt-2 text-sm font-medium">
              {dict.sessionDone}
              {result.nextDueAt && (
                <>
                  {" "}
                  — {dict.nextReview}: {new Date(result.nextDueAt).toLocaleDateString(locale)}
                </>
              )}
            </p>
          ) : (
            <button
              onClick={() => goTo(index + 1)}
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
            >
              {dict.next}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
