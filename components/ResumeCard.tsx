"use client";

import { useEffect, useState } from "react";
import { getConceptById } from "@/content/catalog";
import type { Locale } from "@/i18n/config";
import { getLastVisitedConcept } from "@/lib/last-visited-client";
import { ButtonLink } from "./Button";

export interface ResumeCardDict {
  resumeTitle: string;
  resumeSubtitle: string;
  startFresh: string;
  continueButton: string;
}

/**
 * "Reprendre ma formation" : pointe vers la dernière notion consultée
 * (localStorage, voir TrackLastVisited) si elle existe, sinon vers la
 * première notion publiée — cohérent en build serveur comme statique,
 * sans dépendre d'un cookie de session (voir demande "état existant").
 */
export function ResumeCard({ locale, dict, firstPublishedId }: { locale: Locale; dict: ResumeCardDict; firstPublishedId: string | null }) {
  const [lastId, setLastId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLastId(getLastVisitedConcept());
    setReady(true);
  }, []);

  const targetId = lastId ?? firstPublishedId;
  if (!targetId) return null;
  const concept = getConceptById(targetId);
  if (!concept) return null;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonLink href={`/${locale}/lessons/${targetId}`} variant="primary">
        {lastId ? dict.continueButton : dict.startFresh}
        <span aria-hidden="true">&rarr;</span>
      </ButtonLink>
      {ready && lastId && (
        <p className="text-sm text-text-dim">
          {dict.resumeSubtitle} <span className="font-medium text-text">{concept.title[locale]}</span>
        </p>
      )}
    </div>
  );
}
