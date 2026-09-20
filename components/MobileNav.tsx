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
        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-neutral-700 dark:border-white/15 dark:text-neutral-200"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full border-b border-black/10 bg-neutral-50 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-neutral-950">
          <ul className="flex flex-col gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-200">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <span aria-disabled="true" className="block cursor-not-allowed rounded-lg px-3 py-2 opacity-50">
                {nav.formulas}
              </span>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
