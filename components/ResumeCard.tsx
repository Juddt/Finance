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
 * Bouton principal d'accueil. Le libellé (« Reprendre mon cours » vs
 * « Commencer le programme ») dépend uniquement de la présence d'un
 * historique local — l'eyebrow au-dessus reste neutre pour ne jamais se
 * contredire avec le bouton (voir demande "harmoniser le bouton principal").
 * Cible la dernière notion consultée (localStorage, voir TrackLastVisited)
 * si elle existe, sinon la première notion publiée — cohérent en build
 * serveur comme statique, sans dépendre d'un cookie de session.
 */
export function ResumeCard({ locale, dict, firstPublishedId }: { locale: Locale; dict: ResumeCardDict; firstPublishedId: string | null }) {
  const [lastId, setLastId] = useState<string | null>(null);

  useEffect(() => {
    setLastId(getLastVisitedConcept());
  }, []);

  const targetId = lastId ?? firstPublishedId;
  if (!targetId) return null;
  const concept = getConceptById(targetId);
  if (!concept) return null;

  return (
    <div>
      <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.3em] text-text-faint uppercase">{dict.resumeTitle}</p>
      <div className="flex flex-wrap items-center gap-4">
        <ButtonLink href={`/${locale}/lessons/${targetId}`} variant="primary">
          {lastId ? dict.continueButton : dict.startFresh}
          <span aria-hidden="true">&rarr;</span>
        </ButtonLink>
        {lastId && (
          <p className="text-sm text-text-dim">
            {dict.resumeSubtitle} <span className="font-medium text-text">{concept.title[locale]}</span>
          </p>
        )}
      </div>
    </div>
  );
}
