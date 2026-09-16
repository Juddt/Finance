import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { ProgressBoard } from "@/components/ProgressBoard";

export default async function ProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{dict.progressPage.title}</h1>
      <p className="mt-2 mb-6 text-neutral-600 dark:text-neutral-300">{dict.progressPage.subtitle}</p>
      <ProgressBoard locale={locale} dict={dict.progressPage} />
    </div>
  );
}
