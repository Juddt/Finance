import type { Metadata } from "next";
import { Work_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import "../globals.css";
import "katex/dist/katex.min.css";
import { getDictionary, isLocale, locales, type Locale } from "@/i18n/config";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileNav } from "@/components/MobileNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { CourseSearch } from "@/components/CourseSearch";

const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

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
    <html lang={locale} className={`${workSans.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <header className="focus-mode-hide sticky top-0 z-20 h-[65px] border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85">
          <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`} className="group flex shrink-0 items-center gap-2.5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-[13px] font-extrabold text-ink-on-accent"
                  aria-hidden="true"
                >
                  F
                </span>
                <span className="hidden text-[15px] font-bold tracking-tight sm:inline">Finance Academy</span>
              </Link>
              <MobileNav locale={locale as Locale} nav={dict.nav} />
            </div>
            <div className="min-w-0 flex-1 max-w-md">
              <Suspense fallback={null}>
                <CourseSearch locale={locale as Locale} dict={dict.nav} />
              </Suspense>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Suspense fallback={null}>
                <LanguageToggle locale={locale as Locale} label={dict.languageToggle} />
              </Suspense>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <DesktopSidebar locale={locale as Locale} dict={dict.nav} />
          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex flex-1 flex-col">{children}</main>
            <footer className="focus-mode-hide px-4 py-8 text-center font-mono text-[11px] tracking-wide text-text-faint sm:px-6">
              {dict.footer.notAppRealSite}
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
