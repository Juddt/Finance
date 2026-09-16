import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { QuizSessionPage } from "@/components/QuizSessionPage";

export default async function QuizSessionRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Suspense fallback={null}>
        <QuizSessionPage locale={locale} dict={dict.quiz} hubDict={dict.quizHub} />
      </Suspense>
    </div>
  );
}
