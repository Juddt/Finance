import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";
import "katex/dist/katex.min.css";
import { getDictionary, isLocale, locales, type Locale } from "@/i18n/config";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileNav } from "@/components/MobileNav";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
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
      className={`${fraunces.variable} ${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <header className="sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
          <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href={`/${locale}`} className="group flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold tracking-tight italic">Finance</span>
              <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-ink-muted uppercase">
                Academy
              </span>
              <span className="h-1.5 w-1.5 shrink-0 bg-accent transition-transform group-hover:scale-150" aria-hidden="true" />
            </Link>
            <nav className="hidden items-center gap-6 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-muted uppercase sm:flex">
              <Link href={`/${locale}`} className="tick-underline pb-0.5 hover:text-ink">
                {dict.nav.courses}
              </Link>
              <Link href={`/${locale}/revisions`} className="tick-underline pb-0.5 hover:text-ink">
                {dict.nav.revisions}
              </Link>
              <Link href={`/${locale}/quiz`} className="tick-underline pb-0.5 hover:text-ink">
                {dict.nav.quiz}
              </Link>
              <span aria-disabled="true" className="cursor-not-allowed opacity-40">
                {dict.nav.formulas}
              </span>
              <Link href={`/${locale}/progress`} className="tick-underline pb-0.5 hover:text-ink">
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
        <footer className="border-t border-rule px-4 py-6 text-center font-mono text-[11px] tracking-wide text-ink-faint sm:px-6">
          {dict.footer.notAppRealSite}
        </footer>
      </body>
    </html>
  );
}
