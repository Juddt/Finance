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
        className="flex h-9 w-9 items-center justify-center border border-rule text-ink transition-colors hover:border-ink"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full border-b border-rule bg-paper px-4 py-3 shadow-[0_12px_24px_-16px_rgba(0,0,0,0.4)]">
          <ul className="flex flex-col divide-y divide-rule font-mono text-[13px] font-medium tracking-[0.08em] text-ink uppercase">
            {links.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between py-3 hover:text-accent-ink"
                >
                  <span>{link.label}</span>
                  <span className="text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
            <li>
              <span aria-disabled="true" className="flex cursor-not-allowed items-center justify-between py-3 opacity-40">
                {nav.formulas}
              </span>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
