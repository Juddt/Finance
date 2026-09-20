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
      className="interactive-lift inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 font-mono text-[11px] font-semibold tracking-[0.1em] text-text hover:border-accent/50"
      aria-label={label}
    >
      <span>{locale === "fr" ? "FR" : "EN"}</span>
      <span className="text-text-faint" aria-hidden="true">
        /
      </span>
      <span className="text-text-faint">{locale === "fr" ? "EN" : "FR"}</span>
    </Link>
  );
}
