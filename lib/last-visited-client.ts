const KEY = "fa_last_visited_concept";

/** Repère la dernière notion consultée, uniquement côté client (localStorage). */
export function setLastVisitedConcept(conceptId: string) {
  try {
    localStorage.setItem(KEY, conceptId);
  } catch {
    // Stockage indisponible (navigation privée, quota) : pas de reprise, tant pis.
  }
}

export function getLastVisitedConcept(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
