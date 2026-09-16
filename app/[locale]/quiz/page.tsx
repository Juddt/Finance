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
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{dict.quizHub.title}</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">{dict.quizHub.subtitle}</p>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-1 text-lg font-semibold">{dict.quizHub.reviewMistakes}</h2>
        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">{dict.quizHub.reviewMistakesDescription}</p>
        <Link
          href={`/${locale}/quiz/session?mode=review-mistakes&length=10`}
          className="inline-block rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          {dict.quizHub.startButton}
        </Link>
      </section>

      <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="mb-1 text-lg font-semibold">{dict.quizHub.customQuiz}</h2>
        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">{dict.quizHub.customQuizDescription}</p>
        <CustomQuizBuilder locale={locale} categories={selectableCategories} dict={dict.quizHub} />
      </section>

      <section className="mt-8 space-y-4">
        {categoriesWithContent.map(({ category, chapters: cats, totalPublished }) => (
          <article
            key={category.id}
            className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{category.title[locale]}</h2>
              <Link
                href={`/${locale}/quiz/session?mode=category&categoryId=${category.id}&length=10`}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
              >
                {dict.quizHub.categoryQuiz} ({totalPublished})
              </Link>
            </div>
            <ul className="mt-2 space-y-1">
              {cats.map(({ chapter, publishedCount }) => (
                <li key={chapter.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-300">{chapter.title[locale]}</span>
                  <Link
                    href={`/${locale}/quiz/session?mode=chapter&chapterId=${chapter.id}&length=10`}
                    className="font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
                  >
                    {dict.quizHub.chapterQuiz} ({publishedCount})
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
