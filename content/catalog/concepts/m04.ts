import type { ConceptDef } from "../types";

export const m04: ConceptDef[] = [
  {
    id: "m04-fra",
    chapterId: "m04",
    sourceRef: "M04-1",
    level: "essential",
    estimatedMinutes: 5,
    status: "published",
    title: { fr: "Fonctionnement d'un FRA", en: "FRA mechanics" },
    objective: {
      fr: "Décrire le fonctionnement d'un FRA : conventions, taux contractuel et règlement.",
      en: "Describe how an FRA works: conventions, contract rate and settlement.",
    },
  },
  {
    id: "m04-swap-fixe-variable",
    chapterId: "m04",
    sourceRef: "M04-2",
    level: "essential",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Swap de taux fixe/variable", en: "Fixed/floating rate swap" },
    objective: {
      fr: "Décrire les flux d'un swap de taux, les sens payeur/receveur et le taux au pair.",
      en: "Describe the cash flows of a rate swap, payer/receiver sides and the par rate.",
    },
  },
  {
    id: "m04-pricing-swap",
    chapterId: "m04",
    sourceRef: "M04-3",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Pricing d'un swap : deux méthodes", en: "Swap pricing: two methods" },
    objective: {
      fr: "Pricer un swap par différence de jambes obligataires et par décomposition en FRA, avec conventions cohérentes.",
      en: "Price a swap via the bond-legs difference and via FRA decomposition, with consistent conventions.",
    },
  },
  {
    id: "m04-mono-multi-courbe",
    chapterId: "m04",
    sourceRef: "M04-4",
    level: "advanced",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Cadre mono-courbe vs multi-courbe", en: "Single-curve vs multi-curve framework" },
    objective: {
      fr: "Distinguer actualisation et projection en cadre pédagogique mono-courbe et en cadre multi-courbe.",
      en: "Distinguish discounting and projection in a single-curve teaching framework versus a multi-curve framework.",
    },
  },
  {
    id: "m04-dv01-swap",
    chapterId: "m04",
    sourceRef: "M04-5",
    level: "advanced",
    estimatedMinutes: 5,
    status: "published",
    title: { fr: "DV01 d'un swap et couverture", en: "Swap DV01 & hedging" },
    objective: {
      fr: "Calculer le DV01 d'un swap et l'utiliser pour couvrir le risque de taux, avec ses limites.",
      en: "Compute a swap's DV01 and use it to hedge rate risk, with its limits.",
    },
  },
];
