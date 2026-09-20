"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { CourseNavTree } from "./CourseNavTree";

export interface MobileNavDict {
  courses: string;
  revisions: string;
  quiz: string;
  formulas: string;
  progress: string;
  planDuCours: string;
  closePlan: string;
}

/**
 * Panneau mobile "Plan du cours" : mêmes liens de section que la barre
 * desktop + la même arborescence Module → Chapitre → Notion que la nav
 * latérale (CourseNavTree). Fermeture par bouton, Échap ou tap extérieur ;
 * focus renvoyé au déclencheur à la fermeture (voir demande section 4).
 */
export function MobileNav({ locale, nav }: { locale: Locale; nav: MobileNavDict }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a,button,input,[tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open]);

  const sectionLinks = [
    { href: `/${locale}`, label: nav.courses },
    { href: `/${locale}/revisions`, label: nav.revisions },
    { href: `/${locale}/quiz`, label: nav.quiz },
    { href: `/${locale}/progress`, label: nav.progress },
  ];

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="interactive-lift rounded-xl border border-line px-3 py-2 text-[13px] font-medium text-text"
      >
        {nav.planDuCours}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <button
            type="button"
            aria-label={nav.closePlan}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={nav.planDuCours}
            className="animate-pop-in relative ml-auto flex h-full w-[86vw] max-w-sm flex-col bg-surface p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-text-faint uppercase">{nav.planDuCours}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={nav.closePlan}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-text"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <ul className="mb-4 space-y-1 border-b border-line pb-4 font-medium text-text">
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block rounded-lg px-2 py-2 hover:bg-surface-2">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <span aria-disabled="true" className="block cursor-not-allowed rounded-lg px-2 py-2 opacity-40">
                  {nav.formulas}
                </span>
              </li>
            </ul>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <CourseNavTree locale={locale} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
