"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConceptById } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import { getLastVisitedConcept } from "@/lib/last-visited-client";

export interface LastVisitedDict {
  lastVisitedLabel: string;
  lastVisitedNone: string;
}

/**
 * Remplace l'ancienne case "couverture du programme publié" (info de gestion
 * de contenu, pas de progression utilisateur) par le dernier cours consulté,
 * pour savoir immédiatement où reprendre — voir demande "retirer 113/115".
 */
export function LastVisitedTile({ locale, dict, index }: { locale: Locale; dict: LastVisitedDict; index: number }) {
  const [lastId, setLastId] = useState<string | null>(null);

  useEffect(() => {
    setLastId(getLastVisitedConcept());
  }, []);

  const concept = lastId ? getConceptById(lastId) : null;

  const content = (
    <>
      <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-text-dim uppercase">{dict.lastVisitedLabel}</p>
      <p className={`mt-1.5 line-clamp-2 text-sm font-semibold ${concept ? "text-text" : "text-text-faint"}`}>
        {concept ? concept.title[locale] : dict.lastVisitedNone}
      </p>
    </>
  );

  if (!concept) {
    return <div className="relative rounded-xl border border-line bg-surface px-5 py-4">{content}</div>;
  }

  return (
    <Link
      href={`/${locale}/lessons/${concept.id}`}
      className="interactive-lift relative block rounded-xl border border-line bg-surface px-5 py-4 hover:border-accent/40"
    >
      {content}
      <span className="absolute top-4 right-4 font-mono text-[10px] text-text-faint">{String(index).padStart(2, "0")}</span>
    </Link>
  );
}
