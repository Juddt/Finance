import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, chapters, getChapterById, getChapterStats, getConceptsForChapter } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { getUserId } from "@/lib/session";
import { getConceptProgressMap } from "@/lib/store";
import { getChapterNeighbors, getOrderedChapters } from "@/lib/chapter-nav";
import { ChapterResumeButton } from "@/components/ChapterResumeButton";
import { ChapterConceptGrid } from "@/components/ChapterConceptGrid";
import { ChapterJumpSelect } from "@/components/ChapterJumpSelect";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export async function generateStaticParams() {
  return chapters.map((ch) => ({ chapterId: ch.id }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; chapterId: string }>;
}) {
  const { locale: rawLocale, chapterId } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const chapter = getChapterById(chapterId);
  if (!chapter) notFound();
  const category = categories.find((c) => c.id === chapter.categoryId);

  const chapterConcepts = getConceptsForChapter(chapterId);
  const stats = getChapterStats(chapterId);
  const firstPublishedId = chapterConcepts.find((c) => c.status === "published")?.id ?? null;
  const chapterMinutes = chapterConcepts.reduce((sum, c) => sum + c.estimatedMinutes, 0);

  const userId = isStaticExport ? null : await getUserId();
  const progressMap = userId ? await getConceptProgressMap(userId) : {};

  const { prev, next } = getChapterNeighbors(chapterId);
  const orderedChapters = getOrderedChapters();

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6">
        <Link href={`/${locale}`} className="mb-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-text-dim hover:text-accent-bright">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {dict.chapterPage.backToCatalog}
        </Link>

        <nav aria-label="breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-text-faint">
          <Link href={`/${locale}`} className="hover:text-accent-bright hover:underline">
            {dict.lesson.breadcrumbCourses}
          </Link>
          {category && (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-text-dim">{category.title[locale]}</span>
            </>
          )}
        </nav>

        <h1 className="text-3xl leading-[1.1] font-extrabold tracking-tight sm:text-4xl">{chapter.title[locale]}</h1>
        <p className="mt-3 max-w-2xl text-text-dim">{chapter.summary[locale]}</p>
        <p className="mt-3 font-mono text-[11px] text-text-faint">
          {dict.chapterPage.publishedCount.replace("{published}", String(stats.publishedConcepts)).replace("{total}", String(stats.totalConcepts))}
        </p>
        {/* Niveau, prérequis (du module) et durée (du chapitre) : déplacés ici depuis la carte d'accueil, allégée — voir demande "alléger les cartes". */}
        {category && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-text-faint">
            <span>
              <span className="text-text-dim">{dict.home.level}:</span> {category.level[locale]}
            </span>
            <span>
              <span className="text-text-dim">{dict.home.prerequisites}:</span> {category.prerequisites[locale]}
            </span>
            {chapterMinutes > 0 && (
              <span>
                ~{chapterMinutes} {dict.lesson.minutes}
              </span>
            )}
          </div>
        )}

        <div className="mt-5">
          <ChapterResumeButton
            locale={locale}
            conceptIds={chapterConcepts.map((c) => c.id)}
            firstPublishedId={firstPublishedId}
            resumeLabel={dict.chapterPage.resumeChapter}
            startLabel={dict.chapterPage.startChapter}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="mb-4 text-lg font-bold tracking-tight text-text">{dict.chapterPage.notionsTitle}</h2>
        <ChapterConceptGrid
          locale={locale}
          concepts={chapterConcepts.map((c) => ({ id: c.id, title: c.title[locale], published: c.status === "published" }))}
          serverProgress={progressMap}
          dict={{ upcoming: dict.chapterPage.upcoming, ...dict.progressPage, masteredCount: dict.chapterPage.masteredCount }}
        />

        {(prev || next) && (
          <div className="mt-12 border-t border-line pt-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {prev ? (
                <Link href={`/${locale}/chapters/${prev.chapterId}`} className="interactive-lift rounded-xl border border-line bg-surface p-4">
                  <p className="mb-1 font-mono text-[11px] font-semibold tracking-[0.1em] text-text-faint uppercase">
                    &larr; {dict.chapterPage.prevChapter}
                  </p>
                  <p className="font-semibold text-text">{prev.title[locale]}</p>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/${locale}/chapters/${next.chapterId}`}
                  className="interactive-lift rounded-xl border border-line bg-surface p-4 sm:text-right"
                >
                  <p className="mb-1 font-mono text-[11px] font-semibold tracking-[0.1em] text-text-faint uppercase">
                    {dict.chapterPage.nextChapter} &rarr;
                  </p>
                  <p className="font-semibold text-text">{next.title[locale]}</p>
                </Link>
              ) : (
                <div />
              )}
            </div>

            <div className="mt-5">
              <ChapterJumpSelect locale={locale} chapters={orderedChapters} currentChapterId={chapterId} label={dict.chapterPage.jumpToChapter} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
