import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, chapters, concepts } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { CustomQuizBuilder } from "@/components/CustomQuizBuilder";

export default async function QuizHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const categoriesWithContent = categories
    .map((category) => {
      const categoryChapters = chapters
        .filter((ch) => ch.categoryId === category.id)
        .map((chapter) => ({
          chapter,
          publishedCount: concepts.filter((c) => c.chapterId === chapter.id && c.status === "published").length,
        }))
        .filter((c) => c.publishedCount > 0);
      const totalPublished = categoryChapters.reduce((sum, c) => sum + c.publishedCount, 0);
      return { category, chapters: categoryChapters, totalPublished };
    })
    .filter((c) => c.totalPublished > 0)
    .sort((a, b) => a.category.position - b.category.position);

  const selectableCategories = categoriesWithContent.map(({ category, totalPublished }) => ({
    id: category.id,
    label: category.title[locale],
    count: totalPublished,
  }));

  return (
    <div className="flex-1">
      <div className="grid-ledger border-b border-rule">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
          <p className="mb-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-ink-muted uppercase">
            {locale === "fr" ? "Salle de contrôle" : "Control room"}
          </p>
          <h1 className="font-display text-4xl leading-[1.02] font-semibold tracking-tight italic sm:text-5xl">{dict.quizHub.title}</h1>
          <p className="mt-4 max-w-xl text-ink-muted">{dict.quizHub.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <section className="border-l-2 border-loss bg-loss-soft p-5">
          <h2 className="mb-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-loss uppercase">{dict.quizHub.reviewMistakes}</h2>
          <p className="mb-4 text-sm text-ink">{dict.quizHub.reviewMistakesDescription}</p>
          <Link
            href={`/${locale}/quiz/session?mode=review-mistakes&length=10`}
            className="clip-corner-sm inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-[12px] font-semibold tracking-[0.08em] text-paper uppercase transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {dict.quizHub.startButton}
          </Link>
        </section>

        <section className="mt-6 border border-rule bg-paper-raised p-5">
          <h2 className="mb-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-muted uppercase">{dict.quizHub.customQuiz}</h2>
          <p className="mb-4 text-sm text-ink-muted">{dict.quizHub.customQuizDescription}</p>
          <CustomQuizBuilder locale={locale} categories={selectableCategories} dict={dict.quizHub} />
        </section>

        <section className="mt-10 grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2">
          {categoriesWithContent.map(({ category, chapters: cats, totalPublished }, i) => (
            <article key={category.id} className="bg-paper p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                <Link
                  href={`/${locale}/quiz/session?mode=category&categoryId=${category.id}&length=10`}
                  className="border border-rule px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.04em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  {dict.quizHub.categoryQuiz} &middot; {totalPublished}
                </Link>
              </div>
              <h2 className="mb-2 font-display text-lg font-semibold tracking-tight">{category.title[locale]}</h2>
              <ul className="divide-y divide-rule border-t border-rule">
                {cats.map(({ chapter, publishedCount }) => (
                  <li key={chapter.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                    <span className="text-ink-muted">{chapter.title[locale]}</span>
                    <Link
                      href={`/${locale}/quiz/session?mode=chapter&chapterId=${chapter.id}&length=10`}
                      className="tick-underline shrink-0 font-mono text-[11px] font-medium text-ink"
                    >
                      {dict.quizHub.chapterQuiz} &middot; {publishedCount}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
