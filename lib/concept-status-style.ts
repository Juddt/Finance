import type { ConceptStatus } from "./srs";

/**
 * Couleur commune à tout indicateur de statut de notion (ProgressBoard,
 * cartes notion de la page chapitre). Le jaune (accent) est réservé aux
 * actions et à la position active : "en cours" utilise le bleu (info),
 * jamais l'accent — voir demande design section 4.
 */
export const STATUS_DOT_COLOR: Record<ConceptStatus, string> = {
  mastered: "bg-success",
  "in-progress": "bg-info",
  fragile: "bg-warning",
  "to-reactivate": "bg-danger",
  "to-discover": "bg-line",
};

export const STATUS_TEXT_COLOR: Record<ConceptStatus, string> = {
  mastered: "text-success",
  "in-progress": "text-info",
  fragile: "text-warning",
  "to-reactivate": "text-danger",
  "to-discover": "text-text-faint",
};
