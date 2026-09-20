import Link from "next/link";
import { categories, chapters, concepts } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getUserId } from "@/lib/session";
import { getCatalogStats, getConceptQuizScores } from "@/lib/store";
import { notFound } from "next/navigation";
import { getPublishedConceptIds } from "@/lib/content-registry";
import { LiveStatTile } from "@/components/LiveStatTile";
import { ConceptListEntry } from "@/components/ConceptListEntry";

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
  const continueHref = publishedIds.length > 0 ? `/${locale}/lessons/${publishedIds[0]}` : null;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{dict.home.title}</h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-300">{dict.home.subtitle}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {continueHref && (
            <Link
              href={continueHref}
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {dict.home.continueButton}
            </Link>
          )}
          <input
            type="search"
            placeholder={dict.home.searchPlaceholder}
            disabled
            title={locale === "fr" ? "Recherche : à venir" : "Search: coming soon"}
            className="w-64 max-w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-neutral-500 dark:border-white/15 dark:bg-neutral-900"
          />
        </div>
      </section>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <LiveStatTile label={dict.home.statsPublished} value={`${totals.publishedConcepts}/${totals.totalConcepts}`} />
        <LiveStatTile label={dict.home.statsStudied} value={String(totals.studiedConcepts)} liveKind="studied" />
        <LiveStatTile label={dict.home.statsMastered} value={String(totals.masteredConcepts)} liveKind="mastered" />
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories
          .sort((a, b) => a.position - b.position)
          .map((category) => {
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

            return (
              <article
                key={category.id}
                className="flex flex-col rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold">{category.title[locale]}</h2>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {s.publishedConcepts}/{s.totalConcepts}
                  </span>
                </div>
                <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">{category.summary[locale]}</p>
                <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <div>
                    <dt className="inline font-medium">{dict.home.level}: </dt>
                    <dd className="inline">{category.level[locale]}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">{dict.home.prerequisites}: </dt>
                    <dd className="inline">{category.prerequisites[locale]}</dd>
                  </div>
                  <div>
                    {categoryChapters.length} {dict.home.chapters} · {s.totalConcepts} {dict.home.concepts} · ~
                    {totalMinutes} {dict.lesson.minutes}
                  </div>
                </dl>

                <div className="mt-auto divide-y divide-black/5 border-t border-black/5 dark:divide-white/10 dark:border-white/10">
                  {categoryChapters.map((chapter) => (
                    <details key={chapter.id} className="group py-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                        {chapter.title[locale]}
                        <span className="text-neutral-400 transition-transform group-open:rotate-90">›</span>
                      </summary>
                      <ul className="mt-2 space-y-1 pl-3 text-sm">
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
  );
}
