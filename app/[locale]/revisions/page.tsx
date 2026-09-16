import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { RevisionsList } from "@/components/RevisionsList";

export default async function RevisionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{dict.revisionsPage.title}</h1>
      <p className="mt-2 mb-6 text-neutral-600 dark:text-neutral-300">{dict.revisionsPage.subtitle}</p>
      <RevisionsList locale={locale} dict={dict.revisionsPage} />
    </div>
  );
}
