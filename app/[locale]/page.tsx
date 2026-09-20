import { categories, chapters, concepts } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getUserId } from "@/lib/session";
import { getCatalogStats, getConceptQuizScores, getDueReviews } from "@/lib/store";
import { notFound } from "next/navigation";
import { getPublishedConceptIds } from "@/lib/content-registry";
import { LiveStatTile } from "@/components/LiveStatTile";
import { ConceptListEntry } from "@/components/ConceptListEntry";
import { ResumeCard } from "@/components/ResumeCard";
import { NextReviewCard } from "@/components/NextReviewCard";
import { ModuleIcon } from "@/components/ModuleIcon";

// Build GitHub Pages (export statique) : cookies() n'est pas disponible (pas de
// serveur) — la progression personnelle est alors lue en localStorage, côté
// client, via LiveStatTile. Voir README, "Déploiement GitHub Pages".
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const userId = isStaticExport ? null : await getUserId();
  const stats = await getCatalogStats(userId);
  const statsByCategory = new Map(stats.map((s) => [s.categoryId, s]));
  const conceptScores = await getConceptQuizScores(userId);
  const dueCount = userId ? (await getDueReviews(userId, new Date())).length : 0;

  const totals = stats.reduce(
    (acc, s) => ({
      totalConcepts: acc.totalConcepts + s.totalConcepts,
      publishedConcepts: acc.publishedConcepts + s.publishedConcepts,
      studiedConcepts: acc.studiedConcepts + s.studiedConcepts,
      masteredConcepts: acc.masteredConcepts + s.masteredConcepts,
    }),
    { totalConcepts: 0, publishedConcepts: 0, studiedConcepts: 0, masteredConcepts: 0 }
  );

  const publishedIds = getPublishedConceptIds();
  const sortedCategories = categories.sort((a, b) => a.position - b.position);

  return (
    <div className="flex-1">
      {/* Accueil compact : priorité à la reprise du travail, pas à un grand hero décoratif (voir demande section 5). */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6">
        <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.3em] text-text-faint uppercase">{dict.home.resumeTitle}</p>
        <ResumeCard locale={locale} dict={dict.home} firstPublishedId={publishedIds[0] ?? null} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NextReviewCard locale={locale} dict={dict.home} serverCount={dueCount} />
          <LiveStatTile index={1} label={dict.home.statsPublished} value={`${totals.publishedConcepts}/${totals.totalConcepts}`} />
          <LiveStatTile index={2} label={dict.home.statsStudied} value={String(totals.studiedConcepts)} liveKind="studied" />
          <LiveStatTile index={3} label={dict.home.statsMastered} value={String(totals.masteredConcepts)} liveKind="mastered" />
        </section>

        <h2 className="mb-4 text-lg font-bold tracking-tight text-text">{dict.home.catalogButton}</h2>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map((category, i) => {
            const categoryChapters = chapters
              .filter((ch) => ch.categoryId === category.id)
              .sort((a, b) => a.position - b.position);
            const s = statsByCategory.get(category.id) ?? {
              totalConcepts: 0,
              publishedConcepts: 0,
              studiedConcepts: 0,
              masteredConcepts: 0,
            };
            const totalMinutes = concepts
              .filter((c) => categoryChapters.some((ch) => ch.id === c.chapterId))
              .reduce((sum, c) => sum + c.estimatedMinutes, 0);
            const complete = s.totalConcepts > 0 && s.publishedConcepts === s.totalConcepts;
            const code = `M${String(category.position).padStart(2, "0")}`;

            return (
              <article key={category.id} className="flex flex-col rounded-xl border border-line bg-surface p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2 text-accent">
                    <ModuleIcon categoryId={category.id} className="h-6 w-6" />
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide ${
                      complete ? "bg-success-soft text-success" : "bg-surface-2 text-text-dim"
                    }`}
                  >
                    {s.publishedConcepts}/{s.totalConcepts}
                  </span>
                </div>
                <p className="mb-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-text-faint">{code}</p>
                <h2 className="text-xl font-bold tracking-tight text-text">{category.title[locale]}</h2>
                <p className="mt-1.5 mb-3 text-sm text-text-dim">{category.summary[locale]}</p>
                <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-text-faint">
                  <div>
                    <dt className="inline font-medium text-text-dim">{dict.home.level}: </dt>
                    <dd className="inline">{category.level[locale]}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-text-dim">{dict.home.prerequisites}: </dt>
                    <dd className="inline">{category.prerequisites[locale]}</dd>
                  </div>
                  <div className="col-span-2">
                    {categoryChapters.length} {dict.home.chapters} &middot; {s.totalConcepts} {dict.home.concepts} &middot; ~
                    {totalMinutes} {dict.lesson.minutes}
                  </div>
                </dl>

                <div className="mt-auto space-y-1 border-t border-line pt-2">
                  {categoryChapters.map((chapter) => (
                    <details key={chapter.id} className="group rounded-lg py-1.5 open:bg-surface-2 open:px-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-text">
                        {chapter.title[locale]}
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-2 font-mono text-text-faint transition-transform group-open:rotate-45"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <ul className="mt-2 space-y-0.5 pl-1 text-sm">
                        {concepts
                          .filter((c) => c.chapterId === chapter.id)
                          .map((concept) => (
                            <ConceptListEntry
                              key={concept.id}
                              conceptId={concept.id}
                              href={`/${locale}/lessons/${concept.id}`}
                              title={concept.title[locale]}
                              isPublished={concept.status === "published"}
                              comingSoonLabel={dict.home.comingSoon}
                              completedTitle={dict.home.completedTitle}
                              serverScore={conceptScores[concept.id] ?? null}
                            />
                          ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
