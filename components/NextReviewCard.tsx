"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export interface NextReviewDict {
  nextReviewLabel: string;
  nextReviewCount: string;
  nextReviewNone: string;
}

/** Même pattern serveur/statique que LiveStatTile : valeur reçue en prop, remplacée côté client en build GitHub Pages. */
export function NextReviewCard({ locale, dict, serverCount }: { locale: Locale; dict: NextReviewDict; serverCount: number }) {
  const [count, setCount] = useState(serverCount);

  useEffect(() => {
    if (!isStaticExport) return;
    import("@/lib/quiz-engine-client").then(({ getLocalDueReviews }) => {
      setCount(getLocalDueReviews(new Date()).length);
    });
  }, []);

  return (
    <Link href={`/${locale}/revisions`} className="interactive-lift block rounded-xl border border-line bg-surface px-5 py-4 hover:border-accent/40">
      <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-text-dim uppercase">{dict.nextReviewLabel}</p>
      <p className="mt-1.5 text-lg font-semibold text-text">
        {count > 0 ? dict.nextReviewCount.replace("{count}", String(count)) : dict.nextReviewNone}
      </p>
    </Link>
  );
}
