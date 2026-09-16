import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { chapters, getConceptById } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getPublishedConceptIds, lessonsByConceptId } from "@/lib/content-registry";
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
  const chapter = chapters.find((ch) => ch.id === concept.chapterId);

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

      {lesson.prerequisiteReminder && (
        <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-100">
          <p className="mb-1 font-medium">{dict.lesson.prerequisiteReminder}</p>
          <p>{lesson.prerequisiteReminder.text[locale]}</p>
          {lesson.prerequisiteReminder.conceptIds.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {lesson.prerequisiteReminder.conceptIds.map((id) => {
                const prereq = getConceptById(id);
                if (!prereq) return null;
                return (
                  <li key={id}>
                    <Link
                      href={`/${locale}/lessons/${id}`}
                      className="rounded-full border border-sky-300 bg-white px-2.5 py-1 text-xs font-medium hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-900/40 dark:hover:bg-sky-900"
                    >
                      {prereq.title[locale]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {lesson.glossary && lesson.glossary.length > 0 && (
        <div className="mb-6 rounded-xl border border-black/10 bg-neutral-50 p-4 text-sm dark:border-white/10 dark:bg-neutral-900">
          <p className="mb-2 font-medium text-neutral-800 dark:text-neutral-100">{dict.lesson.glossary}</p>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {lesson.glossary.map((g) => (
              <div key={g.term.fr}>
                <dt className="inline font-medium text-neutral-800 dark:text-neutral-100">{g.term[locale]}: </dt>
                <dd className="inline text-neutral-600 dark:text-neutral-300">{g.definition[locale]}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="space-y-6">
        <Section title={dict.lesson.intuition} body={lesson.intuition[locale]} emphasize />
        <Section title={dict.lesson.definition} body={lesson.definition[locale]} />
        <Section title={dict.lesson.utility} body={lesson.utility[locale]} />
        <Section title={dict.lesson.example} body={lesson.example[locale]} />

        {lesson.alternativeExplanation && (
          <details className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/20">
            <summary className="cursor-pointer text-sm font-semibold text-violet-900 dark:text-violet-200">
              {dict.lesson.alternativeExplanation}
            </summary>
            <p className="mt-3 text-sm text-violet-900 dark:text-violet-100">{lesson.alternativeExplanation[locale]}</p>
          </details>
        )}

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

        {lesson.pythonExample && (
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">{dict.lesson.pythonExample}</h2>
            <pre className="overflow-x-auto rounded-xl border border-black/10 bg-neutral-900 p-4 text-xs text-neutral-100 dark:border-white/10">
              <code>{lesson.pythonExample[locale]}</code>
            </pre>
          </section>
        )}

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
        <QuizSlot
          spec={{ mode: "concept", conceptIds: [conceptId] }}
          locale={locale}
          dict={dict.quiz}
          emptyMessage={dict.quizHub.noQuestionsYet}
        />
      </Suspense>

      {chapter && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/${locale}/quiz/session?mode=chapter&chapterId=${chapter.id}&length=10`}
            className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
          >
            {dict.lesson.chapterQuizLink}
          </Link>
          <Link
            href={`/${locale}/quiz/session?mode=category&categoryId=${chapter.categoryId}&length=10`}
            className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
          >
            {dict.lesson.categoryQuizLink}
          </Link>
        </div>
      )}
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
