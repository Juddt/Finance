import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { CourseNavTree } from "./CourseNavTree";

export interface SidebarDict {
  courses: string;
  revisions: string;
  quiz: string;
  formulas: string;
  progress: string;
  modules: string;
}

/** Navigation latérale desktop, ~260px, persistante — voir demande section 4. */
export function DesktopSidebar({ locale, dict }: { locale: Locale; dict: SidebarDict }) {
  const sectionLinks = [
    { href: `/${locale}`, label: dict.courses },
    { href: `/${locale}/revisions`, label: dict.revisions },
    { href: `/${locale}/quiz`, label: dict.quiz },
    { href: `/${locale}/progress`, label: dict.progress },
  ];

  return (
    <aside className="focus-mode-hide sticky top-[65px] hidden h-[calc(100dvh-65px)] w-[260px] shrink-0 overflow-y-auto border-r border-line px-3 py-5 lg:block">
      <ul className="mb-5 space-y-0.5 border-b border-line pb-5 text-sm font-medium text-text">
        {sectionLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="block rounded-lg px-2 py-2 hover:bg-surface">
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <span aria-disabled="true" className="block cursor-not-allowed rounded-lg px-2 py-2 opacity-40">
            {dict.formulas}
          </span>
        </li>
      </ul>
      <p className="mb-2 px-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-text-faint uppercase">{dict.modules}</p>
      <CourseNavTree locale={locale} />
    </aside>
  );
}
