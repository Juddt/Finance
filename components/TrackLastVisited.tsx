"use client";

import { useEffect } from "react";
import { setLastVisitedConcept } from "@/lib/last-visited-client";

/** Composant sans rendu : enregistre la notion courante comme dernière consultée. */
export function TrackLastVisited({ conceptId }: { conceptId: string }) {
  useEffect(() => {
    setLastVisitedConcept(conceptId);
  }, [conceptId]);
  return null;
}
