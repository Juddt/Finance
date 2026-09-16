import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";
import "katex/dist/katex.min.css";
import { getDictionary, isLocale, locales, type Locale } from "@/i18n/config";
import { LanguageToggle } from "@/components/LanguageToggle";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Finance Academy",
  description: "Plateforme bilingue de cours structurés et quiz pour la finance de marché.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <header className="sticky top-0 z-10 border-b border-black/10 bg-neutral-50/90 backdrop-blur dark:border-white/10 dark:bg-neutral-950/90">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href={`/${locale}`} className="text-lg font-semibold tracking-tight">
              {dict.brand}
            </Link>
            <nav className="hidden items-center gap-5 text-sm font-medium text-neutral-600 dark:text-neutral-300 sm:flex">
              <Link href={`/${locale}`}>{dict.nav.courses}</Link>
              <Link href={`/${locale}/revisions`}>{dict.nav.revisions}</Link>
              <Link href={`/${locale}/quiz`}>{dict.nav.quiz}</Link>
              <span aria-disabled="true" className="cursor-not-allowed opacity-50">
                {dict.nav.formulas}
              </span>
              <Link href={`/${locale}/progress`}>{dict.nav.progress}</Link>
            </nav>
            <Suspense fallback={null}>
              <LanguageToggle locale={locale as Locale} label={dict.languageToggle} />
            </Suspense>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-black/10 px-4 py-6 text-center text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-400">
          {dict.footer.notAppRealSite}
        </footer>
      </body>
    </html>
  );
}
