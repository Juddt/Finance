import type { ConceptDef } from "../types";

/**
 * M13 — Compléments conservés du projet initial. Le document en fait une liste
 * dense par thème ; chaque thème est ici décomposé en plusieurs notions pour
 * respecter la consigne "une ligne regroupant plusieurs objectifs doit être
 * découpée en plusieurs micro-leçons si nécessaire" (section 2 du document).
 */
export const m13: ConceptDef[] = [
  // Mathématiques financières -> chapitre fin-math
  {
    id: "m13-interets-composes",
    chapterId: "fin-math",
    sourceRef: "M13-mathfin-a",
    level: "essential",
    estimatedMinutes: 5,
    status: "published",
    title: { fr: "Intérêts simples, composés et capitalisation continue", en: "Simple, compound interest & continuous compounding" },
    objective: {
      fr: "Calculer intérêts simples, intérêts composés et capitalisation continue.",
      en: "Compute simple interest, compound interest and continuous compounding.",
    },
  },
  {
    id: "m13-actualisation-annuites",
    chapterId: "fin-math",
    sourceRef: "M13-mathfin-b",
    level: "essential",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Actualisation, annuités, rendements et courbes", en: "Discounting, annuities, returns & curves" },
    objective: {
      fr: "Actualiser des flux, valoriser des annuités et lire rendements et courbes de taux.",
      en: "Discount cash flows, value annuities and read yields and rate curves.",
    },
  },

  // Gestion de portefeuille -> chapitre gestion-portefeuille
  {
    id: "m13-covariance-diversification",
    chapterId: "gestion-portefeuille",
    sourceRef: "M13-gp-a",
    level: "essential",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Covariance et diversification", en: "Covariance & diversification" },
    objective: {
      fr: "Relier covariance entre actifs et effet de diversification d'un portefeuille.",
      en: "Relate covariance between assets to a portfolio's diversification effect.",
    },
  },
  {
    id: "m13-markowitz-frontiere",
    chapterId: "gestion-portefeuille",
    sourceRef: "M13-gp-b",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Markowitz, frontière efficiente et portefeuille minimum variance", en: "Markowitz, efficient frontier & minimum variance portfolio" },
    objective: {
      fr: "Construire la frontière efficiente de Markowitz et identifier le portefeuille minimum variance.",
      en: "Build the Markowitz efficient frontier and identify the minimum variance portfolio.",
    },
  },
  {
    id: "m13-capm-sml",
    chapterId: "gestion-portefeuille",
    sourceRef: "M13-gp-c",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "CAPM et Security Market Line", en: "CAPM & Security Market Line" },
    objective: {
      fr: "Appliquer le CAPM et représenter la Security Market Line.",
      en: "Apply the CAPM and plot the Security Market Line.",
    },
  },
  {
    id: "m13-allocation-attribution",
    chapterId: "gestion-portefeuille",
    sourceRef: "M13-gp-d",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Allocation, benchmark et attribution de performance", en: "Allocation, benchmark & performance attribution" },
    objective: {
      fr: "Comparer gestion active/passive, choisir un benchmark et décomposer l'attribution de performance.",
      en: "Compare active vs passive management, choose a benchmark and decompose performance attribution.",
    },
  },

  // Risques -> chapitre risques
  {
    id: "m13-var-es-stress",
    chapterId: "risques",
    sourceRef: "M13-risques-a",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "VaR, Expected Shortfall et stress tests", en: "VaR, Expected Shortfall & stress tests" },
    objective: {
      fr: "Calculer volatilité, downside risk, VaR et Expected Shortfall, et interpréter un stress test.",
      en: "Compute volatility, downside risk, VaR and Expected Shortfall, and interpret a stress test.",
    },
  },
  {
    id: "m13-drawdown-ulcer",
    chapterId: "risques",
    sourceRef: "M13-risques-b",
    level: "advanced",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Drawdown, recovery period et Ulcer Index", en: "Drawdown, recovery period & Ulcer Index" },
    objective: {
      fr: "Mesurer le drawdown maximal, la période de recovery et l'Ulcer Index d'une stratégie.",
      en: "Measure maximum drawdown, recovery period and the Ulcer Index of a strategy.",
    },
  },
  {
    id: "m13-ratios-risque-ajuste",
    chapterId: "risques",
    sourceRef: "M13-risques-c",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Sharpe, Sortino, Calmar, alpha/bêta et tracking error", en: "Sharpe, Sortino, Calmar, alpha/beta & tracking error" },
    objective: {
      fr: "Calculer et interpréter Sharpe, Sortino, Calmar, alpha/bêta, tracking error et information ratio.",
      en: "Compute and interpret Sharpe, Sortino, Calmar, alpha/beta, tracking error and the information ratio.",
    },
  },
  {
    id: "m13-typologie-risques",
    chapterId: "risques",
    sourceRef: "M13-risques-d",
    level: "essential",
    estimatedMinutes: 5,
    status: "published",
    title: { fr: "Risques de marché, crédit, contrepartie, liquidité, opérationnel", en: "Market, credit, counterparty, liquidity & operational risk" },
    objective: {
      fr: "Distinguer les grandes familles de risque financier : marché, crédit, contrepartie, liquidité, opérationnel.",
      en: "Distinguish the major families of financial risk: market, credit, counterparty, liquidity, operational.",
    },
  },

  // Trading et microstructure -> chapitre trading-microstructure
  {
    id: "m13-ordres-levier-marge",
    chapterId: "trading-microstructure",
    sourceRef: "M13-trading-a",
    level: "essential",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Ordres, levier, marge et P&L", en: "Orders, leverage, margin & P&L" },
    objective: {
      fr: "Utiliser ordres marché/limite/stop, comprendre levier, marge et calcul du P&L.",
      en: "Use market/limit/stop orders, understand leverage, margin and P&L computation.",
    },
  },
  {
    id: "m13-market-making-momentum",
    chapterId: "trading-microstructure",
    sourceRef: "M13-trading-b",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Market making, arbitrage, momentum, mean reversion", en: "Market making, arbitrage, momentum, mean reversion" },
    objective: {
      fr: "Décrire les logiques de market making, d'arbitrage, de momentum et de mean reversion.",
      en: "Describe the logic of market making, arbitrage, momentum and mean reversion.",
    },
  },
  {
    id: "m13-backtesting-biais",
    chapterId: "trading-microstructure",
    sourceRef: "M13-trading-c",
    level: "advanced",
    estimatedMinutes: 7,
    status: "published",
    title: { fr: "Backtesting et biais comportementaux", en: "Backtesting & behavioral biases" },
    objective: {
      fr: "Mener un backtesting rigoureux et repérer les biais comportementaux courants.",
      en: "Run a rigorous backtest and spot common behavioral biases.",
    },
  },

  // Réglementation -> chapitre reglementation
  {
    id: "m13-bale",
    chapterId: "reglementation",
    sourceRef: "M13-reg-a",
    level: "advanced",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Bâle III et finalisation (« Bâle IV »)", en: "Basel III & finalization (\"Basel IV\")" },
    objective: {
      fr: "Situer fonds propres, RWA, CET1, LCR, NSFR, CVA et FRTB, avec sources officielles datées et juridiction précisée.",
      en: "Situate capital requirements, RWA, CET1, LCR, NSFR, CVA and FRTB, with dated official sources and jurisdiction.",
    },
  },
  {
    id: "m13-mifid-emir-kyc",
    chapterId: "reglementation",
    sourceRef: "M13-reg-b",
    level: "advanced",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "MiFID II, EMIR, KYC et LCB-FT", en: "MiFID II, EMIR, KYC & AML" },
    objective: {
      fr: "Présenter les objectifs de MiFID II, EMIR, KYC et LCB-FT, avec sources officielles.",
      en: "Present the objectives of MiFID II, EMIR, KYC and AML, with official sources.",
    },
  },

  // Programmation -> chapitre programmation
  {
    id: "m13-programmation-finance",
    chapterId: "programmation",
    sourceRef: "M13-prog",
    level: "essential",
    estimatedMinutes: 8,
    status: "published",
    title: { fr: "Python, Excel/VBA, SQL et R pour la finance", en: "Python, Excel/VBA, SQL & R for finance" },
    objective: {
      fr: "Manipuler données, rendements, VaR et Monte-Carlo avec Python/Excel/VBA/SQL/R, graphiques et automatisation.",
      en: "Handle data, returns, VaR and Monte-Carlo with Python/Excel/VBA/SQL/R, charting and automation.",
    },
  },

  // Entretiens -> chapitre entretiens
  {
    id: "m13-entretiens-techniques",
    chapterId: "entretiens",
    sourceRef: "M13-entretiens-a",
    level: "essential",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Questions techniques et de marché", en: "Technical & market questions" },
    objective: {
      fr: "S'entraîner aux questions techniques et de marché posées en entretien.",
      en: "Practice technical and market questions asked in interviews.",
    },
  },
  {
    id: "m13-entretiens-cas-brainteasers",
    chapterId: "entretiens",
    sourceRef: "M13-entretiens-b",
    level: "essential",
    estimatedMinutes: 6,
    status: "published",
    title: { fr: "Motivation, études de cas et brainteasers", en: "Motivation, case studies & brainteasers" },
    objective: {
      fr: "Préparer motivation, études de cas risk/trading/structuration/quant et brainteasers.",
      en: "Prepare motivation, risk/trading/structuring/quant case studies and brainteasers.",
    },
  },
];
