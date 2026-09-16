"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";

/**
 * Change UNIQUEMENT le segment de langue dans l'URL courante : la page, les
 * paramètres de requête (question active, réponse sélectionnée) et donc la
 * session sont conservés (voir doc section 6).
 */
export function LanguageToggle({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const other: Locale = locale === "fr" ? "en" : "fr";
  const rest = pathname.split("/").slice(2).join("/");
  const query = searchParams.toString();
  const href = `/${other}${rest ? `/${rest}` : ""}${query ? `?${query}` : ""}`;

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-black/5 dark:border-white/15 dark:text-neutral-100 dark:hover:bg-white/10"
      aria-label={label}
    >
      <span aria-hidden="true">{locale === "fr" ? "🇬🇧" : "🇫🇷"}</span>
      <span>{locale === "fr" ? "EN" : "FR"}</span>
    </Link>
  );
}
