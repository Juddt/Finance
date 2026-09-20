import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, chapters, concepts } from "@/content/catalog";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { CustomQuizBuilder } from "@/components/CustomQuizBuilder";
import { ButtonLink } from "@/components/Button";

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
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <p className="mb-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-text-faint uppercase">
          {locale === "fr" ? "Salle de contrôle" : "Control room"}
        </p>
        <h1 className="text-3xl leading-[1.1] font-extrabold tracking-tight sm:text-4xl">{dict.quizHub.title}</h1>
        <p className="mt-4 max-w-xl text-text-dim">{dict.quizHub.subtitle}</p>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 pb-10 sm:px-6">
        <section className="rounded-xl border border-danger/40 bg-danger-soft p-5">
          <h2 className="mb-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-danger uppercase">{dict.quizHub.reviewMistakes}</h2>
          <p className="mb-4 text-sm text-text">{dict.quizHub.reviewMistakesDescription}</p>
          <ButtonLink href={`/${locale}/quiz/session?mode=review-mistakes&length=10`} variant="primary">
            {dict.quizHub.startButton}
          </ButtonLink>
        </section>

        <section className="mt-6 rounded-xl border border-line bg-surface p-5">
          <h2 className="mb-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-text-dim uppercase">{dict.quizHub.customQuiz}</h2>
          <p className="mb-4 text-sm text-text-dim">{dict.quizHub.customQuizDescription}</p>
          <CustomQuizBuilder locale={locale} categories={selectableCategories} dict={dict.quizHub} />
        </section>

        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {categoriesWithContent.map(({ category, chapters: cats, totalPublished }, i) => (
            <article key={category.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                <Link
                  href={`/${locale}/quiz/session?mode=category&categoryId=${category.id}&length=10`}
                  className="rounded-full bg-surface-2 px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.04em] text-text transition-colors hover:bg-accent hover:text-ink-on-accent"
                >
                  {dict.quizHub.categoryQuiz} &middot; {totalPublished}
                </Link>
              </div>
              <h2 className="mb-2 text-lg font-bold tracking-tight">{category.title[locale]}</h2>
              <ul className="space-y-0.5 border-t border-line pt-2">
                {cats.map(({ chapter, publishedCount }) => (
                  <li key={chapter.id} className="flex items-center justify-between gap-2 py-1.5 text-sm">
                    <span className="text-text-dim">{chapter.title[locale]}</span>
                    <Link
                      href={`/${locale}/quiz/session?mode=chapter&chapterId=${chapter.id}&length=10`}
                      className="shrink-0 font-mono text-[11px] font-medium text-accent-bright hover:underline"
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
