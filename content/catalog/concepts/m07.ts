import type { ConceptDef } from "../types";

export const m07: ConceptDef[] = [
  {
    id: "m07-greeks-premier-ordre",
    chapterId: "m07",
    sourceRef: "M07-1",
    level: "essential",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Delta, Gamma, Vega, Theta, Rho", en: "Delta, Gamma, Vega, Theta, Rho" },
    objective: {
      fr: "Définir signes, unités et graphiques des Greeks de premier ordre pour un call et un put.",
      en: "Define signs, units and graphs of first-order Greeks for a call and a put.",
    },
  },
  {
    id: "m07-greeks-second-ordre",
    chapterId: "m07",
    sourceRef: "M07-2",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Sensibilités du second ordre : Vanna, Volga/Vomma", en: "Second-order sensitivities: Vanna, Volga/Vomma" },
    objective: {
      fr: "Identifier Vanna et Volga/Vomma et leurs usages, au-delà des Greeks de premier ordre.",
      en: "Identify Vanna and Volga/Vomma and their uses, beyond first-order Greeks.",
    },
  },
  {
    id: "m07-greeks-strategies",
    chapterId: "m07",
    sourceRef: "M07-3",
    level: "advanced",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Delta/Gamma/Vega des stratégies optionnelles", en: "Delta/Gamma/Vega of option strategies" },
    objective: {
      fr: "Calculer Delta, Gamma et Vega des stratégies optionnelles classiques.",
      en: "Compute Delta, Gamma and Vega of classic option strategies.",
    },
  },
  {
    id: "m07-delta-hedging",
    chapterId: "m07",
    sourceRef: "M07-4",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Delta-hedging", en: "Delta-hedging" },
    objective: {
      fr: "Décrire le hedging et le réajustement d'une position via le delta-hedging.",
      en: "Describe hedging and rebalancing a position via delta-hedging.",
    },
  },
  {
    id: "m07-pnl-delta-hedging",
    chapterId: "m07",
    sourceRef: "M07-5",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Décomposition du P&L du delta-hedging", en: "P&L decomposition of delta-hedging" },
    objective: {
      fr: "Décomposer le P&L du delta-hedging entre volatilité implicite/réalisée, coûts, rééquilibrages discrets et risque de gap.",
      en: "Decompose delta-hedging P&L between implied/realized volatility, costs, discrete rebalancing and gap risk.",
    },
  },
  {
    id: "m07-vol-target-cppi",
    chapterId: "m07",
    sourceRef: "M07-6",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Vol Target, CPPI et rolls d'options", en: "Vol Target, CPPI & option rolls" },
    objective: {
      fr: "Expliquer les mécanismes de Vol Target, CPPI et rolls d'options, leurs conditions d'usage et risques de levier/gap.",
      en: "Explain the mechanics of Vol Target, CPPI and option rolls, their conditions of use and leverage/gap risks.",
    },
  },
];
