import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getConceptById } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getPublishedConceptIds, lessonsByConceptId, questionsByConceptId } from "@/lib/content-registry";
import { toQuestionView } from "@/lib/question-types";
import { Formula } from "@/components/Formula";
import { QuizSlot } from "@/components/QuizSlot";

// Requis par `output: "export"` (build GitHub Pages) : toutes les valeurs de
// conceptId doivent être connues au build. Sans effet sur le build normal.
export async function generateStaticParams() {
  return getPublishedConceptIds().map((conceptId) => ({ conceptId }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; conceptId: string }>;
}) {
  const { locale: rawLocale, conceptId } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const concept = getConceptById(conceptId);
  const lesson = lessonsByConceptId[conceptId];
  if (!concept || !lesson || concept.status !== "published") notFound();

  const questions = (questionsByConceptId[conceptId] ?? []).map((q) => toQuestionView(q, locale));

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
        {dict.lesson.essential} · {concept.estimatedMinutes} {dict.lesson.minutes}
      </p>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight sm:text-3xl">{concept.title[locale]}</h1>
      <p className="mb-6 text-neutral-600 dark:text-neutral-300">
        <span className="font-medium">{dict.lesson.objective}: </span>
        {concept.objective[locale]}
      </p>

      <div className="space-y-6">
        <Section title={dict.lesson.intuition} body={lesson.intuition[locale]} emphasize />
        <Section title={dict.lesson.definition} body={lesson.definition[locale]} />
        <Section title={dict.lesson.utility} body={lesson.utility[locale]} />
        <Section title={dict.lesson.example} body={lesson.example[locale]} />

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">{dict.lesson.formula}</h2>
          <div className="rounded-xl border border-black/10 bg-neutral-50 p-4 text-lg dark:border-white/10 dark:bg-neutral-900">
            <Formula latex={lesson.formula.latex} />
          </div>
          <div className="mt-3 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
            <p className="font-medium text-neutral-800 dark:text-neutral-100">{dict.lesson.variables}</p>
            <ul className="ml-4 list-disc space-y-1">
              {lesson.formula.variables.map((v) => (
                <li key={v.symbol}>
                  <Formula latex={v.symbol} inline /> — {v.description[locale]}
                </li>
              ))}
            </ul>
            <p>
              <span className="font-medium">{locale === "fr" ? "Hypothèses" : "Assumptions"}: </span>
              {lesson.formula.assumptions[locale]}
            </p>
            <p>
              <span className="font-medium">{locale === "fr" ? "Unités" : "Units"}: </span>
              {lesson.formula.units[locale]}
            </p>
            <p>
              <span className="font-medium">{dict.lesson.example}: </span>
              {lesson.formula.example[locale]}
            </p>
          </div>
        </section>

        <Section title={dict.lesson.calculation} body={lesson.calculation[locale]} />
        <Section title={dict.lesson.interpretation} body={lesson.interpretation[locale]} />
        <Section title={dict.lesson.pitfalls} body={lesson.pitfalls[locale]} warn />

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">{dict.lesson.keyPoints}</h2>
          <ul className="ml-4 list-disc space-y-1 text-sm">
            {lesson.keyPoints[locale].map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        <details className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <summary className="cursor-pointer text-sm font-semibold">{dict.lesson.advanced}</summary>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{lesson.advancedDemonstration[locale]}</p>
        </details>
      </div>

      <hr className="my-8 border-black/10 dark:border-white/10" />

      <h2 className="mb-4 text-xl font-semibold">{dict.lesson.startQuiz}</h2>
      <Suspense fallback={null}>
        <QuizSlot conceptId={conceptId} locale={locale} questions={questions} dict={dict.quiz} />
      </Suspense>
    </div>
  );
}

function Section({ title, body, emphasize, warn }: { title: string; body: string; emphasize?: boolean; warn?: boolean }) {
  return (
    <section>
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      <p
        className={
          emphasize
            ? "text-lg font-medium"
            : warn
              ? "text-amber-700 dark:text-amber-400"
              : "text-neutral-700 dark:text-neutral-200"
        }
      >
        {body}
      </p>
    </section>
  );
}
