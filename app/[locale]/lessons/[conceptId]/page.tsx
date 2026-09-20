import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { chapters, categories, getConceptById } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getPublishedConceptIds, lessonsByConceptId } from "@/lib/content-registry";
import { getUserId } from "@/lib/session";
import { getConceptQuizScore } from "@/lib/store";
import { getLessonNeighbors } from "@/lib/lesson-nav";
import { Formula } from "@/components/Formula";
import { QuizSlot } from "@/components/QuizSlot";
import { LessonScoreBadge } from "@/components/LessonScoreBadge";
import { LessonChart } from "@/components/LessonChart";
import { TrackLastVisited } from "@/components/TrackLastVisited";
import { FocusModeToggle } from "@/components/FocusModeToggle";

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
  const category = chapter ? categories.find((cat) => cat.id === chapter.categoryId) : undefined;
  const { prev, next } = getLessonNeighbors(conceptId);

  const userId = isStaticExport ? null : await getUserId();
  const score = await getConceptQuizScore(userId, conceptId);

  return (
    <div className="flex-1">
      <TrackLastVisited conceptId={conceptId} />

      <div className="mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <nav aria-label="breadcrumb" className="focus-mode-hide flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-text-faint">
            <Link href={`/${locale}`} className="hover:text-accent-bright hover:underline">
              {dict.lesson.breadcrumbCourses}
            </Link>
            {category && (
              <>
                <span aria-hidden="true">/</span>
                <span>{category.title[locale]}</span>
              </>
            )}
            {chapter && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-text-dim">{chapter.title[locale]}</span>
              </>
            )}
          </nav>
          <FocusModeToggle enterLabel={dict.lesson.focusModeEnter} exitLabel={dict.lesson.focusModeExit} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <p className="mb-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-text-faint uppercase">
          {chapter?.title[locale]} &middot; {dict.lesson.essential} &middot; {concept.estimatedMinutes} {dict.lesson.minutes}
        </p>
        <h1 className="text-3xl leading-[1.1] font-extrabold tracking-tight sm:text-4xl">{concept.title[locale]}</h1>
        <p className="mt-4 max-w-xl text-text-dim">
          <span className="font-semibold text-text">{dict.lesson.objective}: </span>
          {concept.objective[locale]}
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-8 sm:px-6">
        <LessonScoreBadge
          conceptId={conceptId}
          label={dict.lesson.lastScore}
          retryHref="#quiz"
          retryLabel={dict.lesson.retryQuiz}
          serverScore={score}
        />

        {lesson.prerequisiteReminder && (
          <div className="mb-8 rounded-xl border border-line bg-surface p-4">
            <p className="mb-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-text-dim uppercase">
              {dict.lesson.prerequisiteReminder}
            </p>
            <p className="text-sm text-text">{lesson.prerequisiteReminder.text[locale]}</p>
            {lesson.prerequisiteReminder.conceptIds.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {lesson.prerequisiteReminder.conceptIds.map((id) => {
                  const prereq = getConceptById(id);
                  if (!prereq) return null;
                  return (
                    <li key={id}>
                      <Link
                        href={`/${locale}/lessons/${id}`}
                        className="rounded-full bg-surface-2 px-3 py-1 font-mono text-[11px] font-medium text-text hover:text-accent-bright"
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
          <div className="mb-10 rounded-xl border border-line bg-surface p-4">
            <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-text-dim uppercase">{dict.lesson.glossary}</p>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {lesson.glossary.map((g) => (
                <div key={g.term.fr}>
                  <dt className="font-mono text-[12px] font-semibold text-text">{g.term[locale]}</dt>
                  <dd className="text-sm text-text-dim">{g.definition[locale]}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="space-y-10">
          <section>
            <SectionLabel icon="intuition">{dict.lesson.intuition}</SectionLabel>
            <p className="text-xl leading-snug font-semibold text-text">{lesson.intuition[locale]}</p>
          </section>

          <Section icon="definition" title={dict.lesson.definition} body={lesson.definition[locale]} />
          <Section icon="utility" title={dict.lesson.utility} body={lesson.utility[locale]} />

          <section className="rounded-xl border-l-2 border-accent bg-surface p-4">
            <SectionLabel icon="example">{dict.lesson.example}</SectionLabel>
            <p className="text-[15px] leading-relaxed text-text">{lesson.example[locale]}</p>
          </section>

          {lesson.alternativeExplanation && (
            <details className="group rounded-xl bg-surface p-4 open:bg-surface-2">
              <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] font-semibold tracking-[0.14em] text-text uppercase">
                {dict.lesson.alternativeExplanation}
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-2 font-mono text-text-faint transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-text-dim">{lesson.alternativeExplanation[locale]}</p>
            </details>
          )}

          <section>
            <SectionLabel icon="formula">{dict.lesson.formula}</SectionLabel>
            <div className="scroll-x-container rounded-xl bg-bg px-5 py-6 text-lg text-text ring-1 ring-line">
              <Formula latex={lesson.formula.latex} />
            </div>
            <div className="mt-3 space-y-2 rounded-xl border border-line bg-surface p-4 text-sm text-text-dim">
              <p className="font-mono text-[11px] font-semibold tracking-[0.1em] text-text uppercase">{dict.lesson.variables}</p>
              <ul className="space-y-1">
                {lesson.formula.variables.map((v) => (
                  <li key={v.symbol} className="flex gap-2">
                    <span className="shrink-0 text-text-faint" aria-hidden="true">
                      &middot;
                    </span>
                    <span>
                      <Formula latex={v.symbol} inline /> — {v.description[locale]}
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                <span className="font-semibold text-text">{locale === "fr" ? "Hypothèses" : "Assumptions"}: </span>
                {lesson.formula.assumptions[locale]}
              </p>
              <p>
                <span className="font-semibold text-text">{locale === "fr" ? "Unités" : "Units"}: </span>
                {lesson.formula.units[locale]}
              </p>
              <p className="font-mono text-[13px] text-text">
                <span className="font-sans font-semibold text-text-dim">{dict.lesson.example}: </span>
                {lesson.formula.example[locale]}
              </p>
            </div>
          </section>

          <Section icon="calculation" title={dict.lesson.calculation} body={lesson.calculation[locale]} mono />

          {lesson.chart && <LessonChart chart={lesson.chart} locale={locale} />}

          {lesson.pythonExample && (
            <section>
              <SectionLabel icon="code">{dict.lesson.pythonExample}</SectionLabel>
              <pre className="scroll-x-container rounded-xl bg-bg p-4 text-xs text-text ring-1 ring-line">
                <code className="font-mono">{lesson.pythonExample[locale]}</code>
              </pre>
            </section>
          )}

          <Section icon="interpretation" title={dict.lesson.interpretation} body={lesson.interpretation[locale]} />

          <section className="rounded-xl border-l-2 border-danger bg-danger-soft p-4">
            <p className="mb-1 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-danger uppercase">
              <BlockIcon kind="pitfall" />
              {dict.lesson.pitfalls}
            </p>
            <p className="text-sm text-text">{lesson.pitfalls[locale]}</p>
          </section>

          {lesson.businessApplication && (
            <section className="rounded-xl border-l-2 border-success bg-success-soft p-4">
              <p className="mb-1 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-success uppercase">
                <BlockIcon kind="business" />
                {dict.lesson.businessApplication}
              </p>
              <p className="text-sm text-text">{lesson.businessApplication[locale]}</p>
            </section>
          )}

          {lesson.interviewQuestion && (
            <div className="overflow-hidden rounded-xl border border-line">
              <p className="bg-surface-2 px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-text uppercase">
                {dict.lesson.interviewQuestion}
              </p>
              <div className="bg-surface p-4">
                <p className="flex gap-2 text-sm font-medium text-text">
                  <span className="font-mono font-bold text-accent-bright">Q.</span>
                  {lesson.interviewQuestion.question}
                </p>
                <details className="mt-3">
                  <summary className="cursor-pointer font-mono text-[11px] font-semibold tracking-[0.1em] text-text-dim uppercase hover:text-accent-bright">
                    {dict.lesson.interviewAnswerReveal}
                  </summary>
                  <p className="mt-2 flex gap-2 text-sm text-text-dim">
                    <span className="font-mono font-bold text-text">A.</span>
                    {lesson.interviewQuestion.answer}
                  </p>
                </details>
              </div>
            </div>
          )}

          <section>
            <SectionLabel icon="keyPoints">{dict.lesson.keyPoints}</SectionLabel>
            <ol className="space-y-2">
              {lesson.keyPoints[locale].map((point, i) => (
                <li key={point} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[12px] font-semibold text-ink-on-accent">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-text">{point}</span>
                </li>
              ))}
            </ol>
          </section>

          <details className="group rounded-xl bg-surface p-4 open:bg-surface-2">
            <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] font-semibold tracking-[0.14em] text-text uppercase">
              {dict.lesson.advanced}
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-2 font-mono text-text-faint transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-text-dim">{lesson.advancedDemonstration[locale]}</p>
          </details>
        </div>

        <div className="my-10 border-t border-line" />

        <h2 id="quiz" className="mb-5 scroll-mt-24 text-2xl font-extrabold tracking-tight sm:text-3xl">
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
            <Link
              href={`/${locale}/quiz/session?mode=chapter&chapterId=${chapter.id}&length=10`}
              className="text-text hover:text-accent-bright hover:underline"
            >
              {dict.lesson.chapterQuizLink}
            </Link>
            <Link
              href={`/${locale}/quiz/session?mode=category&categoryId=${chapter.categoryId}&length=10`}
              className="text-text hover:text-accent-bright hover:underline"
            >
              {dict.lesson.categoryQuizLink}
            </Link>
          </div>
        )}

        {(prev || next) && (
          <div className="focus-mode-hide mt-12 grid grid-cols-1 gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {prev ? (
              <Link href={`/${locale}/lessons/${prev.conceptId}`} className="interactive-lift rounded-xl border border-line bg-surface p-4">
                <p className="mb-1 font-mono text-[11px] font-semibold tracking-[0.1em] text-text-faint uppercase">
                  &larr; {dict.lesson.prevNotion}
                  {prev.categoryChanged ? ` · ${dict.lesson.newModule}` : prev.chapterChanged ? ` · ${dict.lesson.newChapter}` : ""}
                </p>
                <p className="font-semibold text-text">{prev.title[locale]}</p>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/${locale}/lessons/${next.conceptId}`}
                className="interactive-lift rounded-xl border border-line bg-surface p-4 sm:text-right"
              >
                <p className="mb-1 font-mono text-[11px] font-semibold tracking-[0.1em] text-text-faint uppercase">
                  {dict.lesson.nextNotion} &rarr;
                  {next.categoryChanged ? ` · ${dict.lesson.newModule}` : next.chapterChanged ? ` · ${dict.lesson.newChapter}` : ""}
                </p>
                <p className="font-semibold text-text">{next.title[locale]}</p>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type BlockKind = "intuition" | "definition" | "utility" | "example" | "formula" | "calculation" | "code" | "interpretation" | "keyPoints";

function BlockIcon({ kind }: { kind: BlockKind | "pitfall" | "business" }) {
  const common = { viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;
  switch (kind) {
    case "intuition":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.7.5 1.1V16h6v-1c0-.4.1-.8.5-1.1A6 6 0 0 0 12 3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "formula":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M18 4H8l4 8-4 8h10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "example":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "pitfall":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3 2 20h20L12 3z" strokeLinejoin="round" />
          <path d="M12 10v4M12 17v.01" strokeLinecap="round" />
        </svg>
      );
    case "business":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
        </svg>
      );
    case "calculation":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h8.01" strokeLinecap="round" />
        </svg>
      );
    case "code":
      return (
        <svg {...common} aria-hidden="true">
          <path d="m9 8-4 4 4 4M15 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "keyPoints":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M5 6h14M5 12h14M5 18h9" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 12h16" strokeLinecap="round" />
        </svg>
      );
  }
}

function SectionLabel({ icon, children }: { icon: BlockKind; children: React.ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-text-dim uppercase">
      <span className="text-accent">
        <BlockIcon kind={icon} />
      </span>
      {children}
    </p>
  );
}

function Section({ icon, title, body, mono }: { icon: BlockKind; title: string; body: string; mono?: boolean }) {
  return (
    <section>
      <SectionLabel icon={icon}>{title}</SectionLabel>
      <p className={`text-[15px] leading-relaxed text-text ${mono ? "font-mono text-[13px] leading-relaxed" : ""}`}>{body}</p>
    </section>
  );
}
