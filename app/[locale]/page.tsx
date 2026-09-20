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

  const sortedCategories = categories.sort((a, b) => a.position - b.position);

  return (
    <div className="flex-1">
      <section className="grid-ledger relative overflow-hidden border-b border-rule">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="mb-4 font-mono text-[11px] font-semibold tracking-[0.3em] text-ink-muted uppercase">
            {locale === "fr" ? "Programme complet — 8 catégories" : "Full curriculum — 8 categories"}
          </p>
          <h1 className="max-w-3xl font-display text-[2.75rem] leading-[0.98] font-semibold tracking-tight italic sm:text-6xl lg:text-7xl">
            {dict.home.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-muted">{dict.home.subtitle}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {continueHref && (
              <Link
                href={continueHref}
                className="clip-corner-sm inline-flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[12px] font-semibold tracking-[0.08em] text-paper uppercase transition-colors hover:bg-accent hover:text-accent-ink"
              >
                {dict.home.continueButton}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
            <div className="relative">
              <input
                type="search"
                placeholder={dict.home.searchPlaceholder}
                disabled
                title={locale === "fr" ? "Recherche : à venir" : "Search: coming soon"}
                className="w-64 max-w-full border-0 border-b border-rule bg-transparent px-1 py-3 text-sm text-ink-faint placeholder:text-ink-faint focus:border-ink focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <section className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <LiveStatTile index={1} label={dict.home.statsPublished} value={`${totals.publishedConcepts}/${totals.totalConcepts}`} />
          <LiveStatTile index={2} label={dict.home.statsStudied} value={String(totals.studiedConcepts)} liveKind="studied" />
          <LiveStatTile index={3} label={dict.home.statsMastered} value={String(totals.masteredConcepts)} liveKind="mastered" />
        </section>

        <section className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2 xl:grid-cols-3">
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

            return (
              <article key={category.id} className="flex flex-col bg-paper p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide ${
                      complete ? "bg-gain-soft text-gain" : "bg-paper-raised text-ink-muted"
                    }`}
                  >
                    {s.publishedConcepts}/{s.totalConcepts}
                  </span>
                </div>
                <h2 className="font-display text-xl font-semibold tracking-tight">{category.title[locale]}</h2>
                <p className="mt-1.5 mb-3 text-sm text-ink-muted">{category.summary[locale]}</p>
                <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-ink-faint">
                  <div>
                    <dt className="inline font-medium text-ink-muted">{dict.home.level}: </dt>
                    <dd className="inline">{category.level[locale]}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-ink-muted">{dict.home.prerequisites}: </dt>
                    <dd className="inline">{category.prerequisites[locale]}</dd>
                  </div>
                  <div className="col-span-2">
                    {categoryChapters.length} {dict.home.chapters} &middot; {s.totalConcepts} {dict.home.concepts} &middot; ~
                    {totalMinutes} {dict.lesson.minutes}
                  </div>
                </dl>

                <div className="mt-auto divide-y divide-rule border-t border-rule">
                  {categoryChapters.map((chapter) => (
                    <details key={chapter.id} className="group py-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                        {chapter.title[locale]}
                        <span className="font-mono text-ink-faint transition-transform group-open:rotate-45" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <ul className="mt-2 space-y-0.5 border-l border-rule pl-3 text-sm">
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
