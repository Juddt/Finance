import type { Metadata } from "next";
import { Unbounded, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";
import "katex/dist/katex.min.css";
import { getDictionary, isLocale, locales, type Locale } from "@/i18n/config";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileNav } from "@/components/MobileNav";

const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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
    <html
      lang={locale}
      className={`${unbounded.variable} ${workSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
          <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href={`/${locale}`} className="group flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-accent text-[11px] font-bold text-accent transition-transform group-hover:scale-105"
                aria-hidden="true"
              >
                F
              </span>
              <span className="font-display text-lg font-bold tracking-tight">Finance</span>
              <span className="font-mono text-[10px] font-medium tracking-[0.25em] text-ink-faint uppercase">Academy</span>
            </Link>
            <nav className="hidden items-center gap-1 font-mono text-[11px] font-medium tracking-[0.1em] text-ink-muted uppercase sm:flex">
              <Link href={`/${locale}`} className="rounded-full px-3 py-1.5 transition-colors hover:bg-paper-raised hover:text-ink">
                {dict.nav.courses}
              </Link>
              <Link href={`/${locale}/revisions`} className="rounded-full px-3 py-1.5 transition-colors hover:bg-paper-raised hover:text-ink">
                {dict.nav.revisions}
              </Link>
              <Link href={`/${locale}/quiz`} className="rounded-full px-3 py-1.5 transition-colors hover:bg-paper-raised hover:text-ink">
                {dict.nav.quiz}
              </Link>
              <span aria-disabled="true" className="cursor-not-allowed rounded-full px-3 py-1.5 opacity-40">
                {dict.nav.formulas}
              </span>
              <Link href={`/${locale}/progress`} className="rounded-full px-3 py-1.5 transition-colors hover:bg-paper-raised hover:text-ink">
                {dict.nav.progress}
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Suspense fallback={null}>
                <LanguageToggle locale={locale as Locale} label={dict.languageToggle} />
              </Suspense>
              <MobileNav locale={locale as Locale} nav={dict.nav} />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="px-4 py-8 text-center font-mono text-[11px] tracking-wide text-ink-faint sm:px-6">
          {dict.footer.notAppRealSite}
        </footer>
      </body>
    </html>
  );
}
