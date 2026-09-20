"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getLastVisitedConcept } from "@/lib/last-visited-client";
import { ButtonLink } from "./Button";

/**
 * "Reprendre ce chapitre" si la dernière notion consultée (localStorage)
 * appartient à ce chapitre, sinon "Commencer" vers la première notion
 * publiée du chapitre — voir demande section 2.
 */
export function ChapterResumeButton({
  locale,
  conceptIds,
  firstPublishedId,
  resumeLabel,
  startLabel,
}: {
  locale: Locale;
  conceptIds: string[];
  firstPublishedId: string | null;
  resumeLabel: string;
  startLabel: string;
}) {
  const [lastId, setLastId] = useState<string | null>(null);

  useEffect(() => {
    const last = getLastVisitedConcept();
    if (last && conceptIds.includes(last)) setLastId(last);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const targetId = lastId ?? firstPublishedId;
  if (!targetId) return null;

  return (
    <ButtonLink href={`/${locale}/lessons/${targetId}`} variant="primary">
      {lastId ? resumeLabel : startLabel}
      <span aria-hidden="true">&rarr;</span>
    </ButtonLink>
  );
}
