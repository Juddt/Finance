import type { ConceptDef } from "../types";

export const m09: ConceptDef[] = [
  {
    id: "m09-correlation-realisee",
    chapterId: "m09",
    sourceRef: "M09-1",
    level: "essential",
    estimatedMinutes: 5,
    status: "upcoming",
    title: { fr: "Corrélation réalisée", en: "Realized correlation" },
    objective: {
      fr: "Définir et calculer la corrélation réalisée, et en connaître les limites.",
      en: "Define and compute realized correlation, and know its limits.",
    },
  },
  {
    id: "m09-correlation-implicite",
    chapterId: "m09",
    sourceRef: "M09-2",
    level: "advanced",
    estimatedMinutes: 6,
    status: "upcoming",
    title: { fr: "Corrélation implicite", en: "Implied correlation" },
    objective: {
      fr: "Calculer une corrélation implicite sous hypothèses explicites et l'interpréter.",
      en: "Compute implied correlation under explicit assumptions and interpret it.",
    },
  },
  {
    id: "m09-dispersion",
    chapterId: "m09",
    sourceRef: "M09-3",
    level: "advanced",
    estimatedMinutes: 6,
    status: "upcoming",
    title: { fr: "Dispersion", en: "Dispersion" },
    objective: {
      fr: "Définir la dispersion et son lien avec les volatilités et la corrélation.",
      en: "Define dispersion and its relationship to volatilities and correlation.",
    },
  },
  {
    id: "m09-panier-worst-best-of",
    chapterId: "m09",
    sourceRef: "M09-4",
    level: "advanced",
    estimatedMinutes: 6,
    status: "upcoming",
    title: { fr: "Panier, Worst-Of et Best-Of", en: "Basket, Worst-Of & Best-Of" },
    objective: {
      fr: "Décrire les mécanismes d'un panier, d'un Worst-Of et d'un Best-Of avec des exemples.",
      en: "Describe the mechanics of a basket, a Worst-Of and a Best-Of with examples.",
    },
  },
  {
    id: "m09-sensibilites-payoff",
    chapterId: "m09",
    sourceRef: "M09-5",
    level: "advanced",
    estimatedMinutes: 6,
    status: "upcoming",
    title: { fr: "Sensibilités selon le payoff", en: "Sensitivities by payoff type" },
    objective: {
      fr: "Analyser les sensibilités à la volatilité, la corrélation et la dispersion selon le payoff, sans généraliser les signes.",
      en: "Analyze sensitivities to volatility, correlation and dispersion by payoff type, without generalizing signs.",
    },
  },
];
