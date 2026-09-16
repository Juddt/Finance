import Link from "next/link";
import { categories, chapters, concepts } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getUserId } from "@/lib/session";
import { getCatalogStats } from "@/lib/store";
import { notFound } from "next/navigation";
import { getPublishedConceptIds } from "@/lib/content-registry";

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const userId = await getUserId();
  const stats = await getCatalogStats(userId);
  const statsByCategory = new Map(stats.map((s) => [s.categoryId, s]));

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
        <StatTile label={dict.home.statsPublished} value={`${totals.publishedConcepts}/${totals.totalConcepts}`} />
        <StatTile label={dict.home.statsStudied} value={String(totals.studiedConcepts)} />
        <StatTile label={dict.home.statsMastered} value={String(totals.masteredConcepts)} />
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
                            <li key={concept.id} className="flex items-center justify-between gap-2">
                              {concept.status === "published" ? (
                                <Link
                                  href={`/${locale}/lessons/${concept.id}`}
                                  className="text-neutral-800 underline-offset-2 hover:underline dark:text-neutral-100"
                                >
                                  {concept.title[locale]}
                                </Link>
                              ) : (
                                <span className="text-neutral-500 dark:text-neutral-400">{concept.title[locale]}</span>
                              )}
                              <span className="shrink-0 text-xs text-neutral-400">
                                {concept.status === "published" ? "" : dict.home.comingSoon}
                              </span>
                            </li>
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

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-sm text-neutral-600 dark:text-neutral-300">{label}</div>
    </div>
  );
}
