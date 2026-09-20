import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { chapters, getConceptById } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getPublishedConceptIds, lessonsByConceptId } from "@/lib/content-registry";
import { getUserId } from "@/lib/session";
import { getConceptQuizScore } from "@/lib/store";
import { Formula } from "@/components/Formula";
import { QuizSlot } from "@/components/QuizSlot";
import { LessonScoreBadge } from "@/components/LessonScoreBadge";
import { LessonChart } from "@/components/LessonChart";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

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

  const userId = isStaticExport ? null : await getUserId();
  const score = await getConceptQuizScore(userId, conceptId);

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-ink-muted uppercase">
          {chapter?.title[locale]} &middot; {dict.lesson.essential} &middot; {concept.estimatedMinutes} {dict.lesson.minutes}
        </p>
        <h1 className="font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl">{concept.title[locale]}</h1>
        <p className="mt-4 max-w-xl text-ink-muted">
          <span className="font-semibold text-ink">{dict.lesson.objective}: </span>
          {concept.objective[locale]}
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6">
        <LessonScoreBadge
          conceptId={conceptId}
          label={dict.lesson.lastScore}
          retryHref="#quiz"
          retryLabel={dict.lesson.retryQuiz}
          serverScore={score}
        />

        {lesson.prerequisiteReminder && (
          <div className="mb-8 rounded-2xl bg-paper-raised p-4">
            <p className="mb-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-muted uppercase">
              {dict.lesson.prerequisiteReminder}
            </p>
            <p className="text-sm text-ink">{lesson.prerequisiteReminder.text[locale]}</p>
            {lesson.prerequisiteReminder.conceptIds.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {lesson.prerequisiteReminder.conceptIds.map((id) => {
                  const prereq = getConceptById(id);
                  if (!prereq) return null;
                  return (
                    <li key={id}>
                      <Link
                        href={`/${locale}/lessons/${id}`}
                        className="rounded-full bg-paper-sunken px-3 py-1 font-mono text-[11px] font-medium text-ink hover:text-accent"
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
          <div className="mb-10 rounded-2xl bg-paper-raised p-4">
            <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-muted uppercase">{dict.lesson.glossary}</p>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {lesson.glossary.map((g) => (
                <div key={g.term.fr}>
                  <dt className="font-mono text-[12px] font-semibold text-ink">{g.term[locale]}</dt>
                  <dd className="text-sm text-ink-muted">{g.definition[locale]}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="space-y-10">
          <section>
            <SectionLabel>{dict.lesson.intuition}</SectionLabel>
            <p className="font-display text-xl leading-snug font-semibold">{lesson.intuition[locale]}</p>
          </section>

          <Section title={dict.lesson.definition} body={lesson.definition[locale]} />
          <Section title={dict.lesson.utility} body={lesson.utility[locale]} />

          <section className="ticket bg-paper-raised p-4">
            <SectionLabel>{dict.lesson.example}</SectionLabel>
            <p className="text-[15px] leading-relaxed text-ink">{lesson.example[locale]}</p>
          </section>

          {lesson.alternativeExplanation && (
            <details className="group rounded-2xl bg-paper-raised p-4 open:bg-paper-sunken">
              <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] font-semibold tracking-[0.14em] text-ink uppercase">
                {dict.lesson.alternativeExplanation}
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-paper-sunken font-mono text-ink-faint transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-ink-muted">{lesson.alternativeExplanation[locale]}</p>
            </details>
          )}

          <section>
            <SectionLabel>{dict.lesson.formula}</SectionLabel>
            <div className="rounded-2xl bg-ink px-5 py-6 text-lg text-paper">
              <Formula latex={lesson.formula.latex} />
            </div>
            <div className="mt-3 space-y-2 rounded-2xl bg-paper-raised p-4 text-sm text-ink-muted">
              <p className="font-mono text-[11px] font-semibold tracking-[0.1em] text-ink uppercase">{dict.lesson.variables}</p>
              <ul className="space-y-1">
                {lesson.formula.variables.map((v) => (
                  <li key={v.symbol} className="flex gap-2">
                    <span className="shrink-0 text-ink-faint" aria-hidden="true">
                      &middot;
                    </span>
                    <span>
                      <Formula latex={v.symbol} inline /> — {v.description[locale]}
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                <span className="font-semibold text-ink">{locale === "fr" ? "Hypothèses" : "Assumptions"}: </span>
                {lesson.formula.assumptions[locale]}
              </p>
              <p>
                <span className="font-semibold text-ink">{locale === "fr" ? "Unités" : "Units"}: </span>
                {lesson.formula.units[locale]}
              </p>
              <p className="font-mono text-[13px] text-ink">
                <span className="font-sans font-semibold text-ink-muted">{dict.lesson.example}: </span>
                {lesson.formula.example[locale]}
              </p>
            </div>
          </section>

          <Section title={dict.lesson.calculation} body={lesson.calculation[locale]} mono />

          {lesson.chart && <LessonChart chart={lesson.chart} locale={locale} />}

          {lesson.pythonExample && (
            <section>
              <SectionLabel>{dict.lesson.pythonExample}</SectionLabel>
              <pre className="overflow-x-auto rounded-2xl bg-ink p-4 text-xs text-paper">
                <code className="font-mono">{lesson.pythonExample[locale]}</code>
              </pre>
            </section>
          )}

          <Section title={dict.lesson.interpretation} body={lesson.interpretation[locale]} />

          <section className="rounded-2xl bg-loss-soft p-4">
            <p className="mb-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-loss uppercase">{dict.lesson.pitfalls}</p>
            <p className="text-sm text-ink">{lesson.pitfalls[locale]}</p>
          </section>

          {lesson.businessApplication && (
            <section className="rounded-2xl bg-gain-soft p-4">
              <p className="mb-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-gain uppercase">{dict.lesson.businessApplication}</p>
              <p className="text-sm text-ink">{lesson.businessApplication[locale]}</p>
            </section>
          )}

          {lesson.interviewQuestion && (
            <div className="overflow-hidden rounded-2xl bg-paper-raised">
              <p className="bg-ink px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-paper uppercase">
                {dict.lesson.interviewQuestion}
              </p>
              <div className="p-4">
                <p className="flex gap-2 text-sm font-medium text-ink">
                  <span className="font-mono font-bold text-accent">Q.</span>
                  {lesson.interviewQuestion.question}
                </p>
                <details className="mt-3">
                  <summary className="cursor-pointer font-mono text-[11px] font-semibold tracking-[0.1em] text-ink-muted uppercase hover:text-accent">
                    {dict.lesson.interviewAnswerReveal}
                  </summary>
                  <p className="mt-2 flex gap-2 text-sm text-ink-muted">
                    <span className="font-mono font-bold text-ink">A.</span>
                    {lesson.interviewQuestion.answer}
                  </p>
                </details>
              </div>
            </div>
          )}

          <section>
            <SectionLabel>{dict.lesson.keyPoints}</SectionLabel>
            <ol className="space-y-2">
              {lesson.keyPoints[locale].map((point, i) => (
                <li key={point} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[12px] font-semibold text-accent-ink">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{point}</span>
                </li>
              ))}
            </ol>
          </section>

          <details className="group rounded-2xl bg-paper-raised p-4 open:bg-paper-sunken">
            <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] font-semibold tracking-[0.14em] text-ink uppercase">
              {dict.lesson.advanced}
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-paper-sunken font-mono text-ink-faint transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-ink-muted">{lesson.advancedDemonstration[locale]}</p>
          </details>
        </div>

        <div className="my-10 border-t border-rule" />

        <h2 id="quiz" className="mb-5 scroll-mt-24 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {dict.lesson.startQuiz}
        </h2>
        <Suspense fallback={null}>
          <QuizSlot
            spec={{ mode: "concept", conceptIds: [conceptId] }}
            locale={locale}
            dict={dict.quiz}
            emptyMessage={dict.quizHub.noQuestionsYet}
          />
        </Suspense>

        {chapter && (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] font-medium">
            <Link href={`/${locale}/quiz/session?mode=chapter&chapterId=${chapter.id}&length=10`} className="text-ink hover:text-accent hover:underline">
              {dict.lesson.chapterQuizLink}
            </Link>
            <Link
              href={`/${locale}/quiz/session?mode=category&categoryId=${chapter.categoryId}&length=10`}
              className="text-ink hover:text-accent hover:underline"
            >
              {dict.lesson.categoryQuizLink}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-muted uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </p>
  );
}

function Section({ title, body, mono }: { title: string; body: string; mono?: boolean }) {
  return (
    <section>
      <SectionLabel>{title}</SectionLabel>
      <p className={`text-[15px] leading-relaxed text-ink ${mono ? "font-mono text-[13px] leading-relaxed" : ""}`}>{body}</p>
    </section>
  );
}
