import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { ProgressBoard } from "@/components/ProgressBoard";

export default async function ProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="flex-1">
      <div className="grid-ledger border-b border-rule">
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-4xl leading-[1.02] font-semibold tracking-tight italic sm:text-5xl">{dict.progressPage.title}</h1>
          <p className="mt-4 max-w-xl text-ink-muted">{dict.progressPage.subtitle}</p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <ProgressBoard locale={locale} dict={dict.progressPage} />
      </div>
    </div>
  );
}
