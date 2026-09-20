"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";

export function MobileNav({
  locale,
  nav,
}: {
  locale: Locale;
  nav: { courses: string; revisions: string; quiz: string; formulas: string; progress: string; openMenu: string; closeMenu: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: `/${locale}`, label: nav.courses },
    { href: `/${locale}/revisions`, label: nav.revisions },
    { href: `/${locale}/quiz`, label: nav.quiz },
    { href: `/${locale}/progress`, label: nav.progress },
  ];

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? nav.closeMenu : nav.openMenu}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-accent"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <nav className="animate-pop-in absolute inset-x-4 top-[calc(100%+8px)] rounded-2xl bg-paper-raised p-2 shadow-[0_12px_28px_-12px_rgba(30,26,20,0.35)]">
          <ul className="flex flex-col font-mono text-[13px] font-medium tracking-[0.06em] text-ink uppercase">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex items-center rounded-xl px-3 py-3 hover:bg-paper-sunken">
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <span aria-disabled="true" className="flex cursor-not-allowed items-center rounded-xl px-3 py-3 opacity-40">
                {nav.formulas}
              </span>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
