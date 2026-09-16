import type { ConceptDef } from "../types";

export const m11: ConceptDef[] = [
  {
    id: "m11-produit-structure",
    chapterId: "m11",
    sourceRef: "M11-1",
    level: "essential",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Mécanisme d'un produit structuré", en: "Structured product mechanics" },
    objective: {
      fr: "Décrire les principales catégories de produits structurés : risque émetteur, liquidité, frais, protection conditionnelle du capital.",
      en: "Describe the main categories of structured products: issuer risk, liquidity, fees, conditional capital protection.",
    },
  },
  {
    id: "m11-autocall",
    chapterId: "m11",
    sourceRef: "M11-2",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Mécanisme d'un autocall", en: "Autocall mechanics" },
    objective: {
      fr: "Décrire l'échéancier, les observations, le coupon, la mémoire éventuelle, le rappel anticipé, la barrière et le remboursement final d'un autocall.",
      en: "Describe an autocall's schedule, observations, coupon, memory feature, early redemption, barrier and final repayment.",
    },
  },
  {
    id: "m11-augmenter-coupon",
    chapterId: "m11",
    sourceRef: "M11-3",
    level: "advanced",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Augmenter un coupon : comment et à quel risque", en: "Increasing a coupon: how and at what risk" },
    objective: {
      fr: "Expliquer comment augmenter un coupon et les contreparties/risques associés, sans le présenter comme gratuit.",
      en: "Explain how a coupon can be increased and the associated trade-offs/risks, never presenting it as free.",
    },
  },
  {
    id: "m11-greeks-autocall",
    chapterId: "m11",
    sourceRef: "M11-4",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Delta, Gamma, Vega d'un autocall", en: "Delta, Gamma, Vega of an autocall" },
    objective: {
      fr: "Analyser Delta, Gamma et Vega d'un autocall selon sa structure et l'état de marché.",
      en: "Analyze an autocall's Delta, Gamma and Vega depending on its structure and market state.",
    },
  },
  {
    id: "m11-modeles-pricing-autocall",
    chapterId: "m11",
    sourceRef: "M11-5",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Choix de modèle pour pricer un autocall", en: "Model choice for autocall pricing" },
    objective: {
      fr: "Justifier quand utiliser des volatilités et taux stochastiques pour le pricing, en comparant avec des modèles simplifiés.",
      en: "Justify when to use stochastic volatility and rates for pricing, comparing with simplified models.",
    },
  },
];
