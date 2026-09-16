import type { LessonContent } from "@/lib/lesson-types";

export const m01Arbitrage: LessonContent = {
  conceptId: "m01-arbitrage",
  glossary: [
    { term: { fr: "Loi du prix unique", en: "Law of one price" }, definition: { fr: "Le principe selon lequel deux actifs ou combinaisons d'actifs produisant exactement le même résultat doivent avoir le même prix.", en: "The principle that two assets or combinations of assets producing exactly the same outcome must have the same price." } },
  ],
  intuition: {
    fr: "Un arbitrage, c'est un profit garanti, sans risque et sans mise de fonds — de l'argent gratuit. Ces opportunités, quand elles existent, sont immédiatement exploitées par le marché jusqu'à disparaître : c'est cette hypothèse d'absence d'arbitrage qui sert de fondation à presque toutes les formules de pricing de ce cours.",
    en: "Arbitrage is a guaranteed, risk-free profit requiring no capital — free money. Such opportunities, when they exist, are immediately exploited by the market until they vanish: this no-arbitrage assumption underpins almost every pricing formula in this course.",
  },
  definition: {
    fr: "Une opportunité d'arbitrage est une stratégie qui (1) ne coûte rien à mettre en place aujourd'hui, (2) ne peut jamais produire de perte dans le futur, et (3) a une probabilité strictement positive de produire un gain. L'hypothèse d'absence d'arbitrage postule qu'aucune telle stratégie ne peut exister durablement sur un marché efficient.",
    en: "An arbitrage opportunity is a strategy that (1) costs nothing to set up today, (2) can never produce a loss in the future, and (3) has a strictly positive probability of producing a gain. The no-arbitrage assumption posits that no such strategy can durably exist in an efficient market.",
  },
  utility: {
    fr: "C'est l'hypothèse fondatrice de tout ce cours : le prix forward (M02-2), la parité call-put (M05-3), le taux forward implicite (M03-7) sont tous dérivés en supposant qu'aucun arbitrage n'est possible — pas en devinant le comportement des investisseurs.",
    en: "This is the founding assumption of this entire course: the forward price (M02-2), put-call parity (M05-3), the implied forward rate (M03-7) are all derived by assuming no arbitrage is possible — not by guessing investor behavior.",
  },
  example: {
    fr: "Triangulation de change : EUR/USD = 1,10, USD/GBP = 0,80, GBP/EUR = 1,15. En partant de 1 EUR : → 1,10 USD → 1,10×0,80 = 0,88 GBP → 0,88×1,15 = 1,012 EUR. On termine avec plus d'euros qu'au départ (1,012 > 1) : une opportunité d'arbitrage triangulaire existe, jusqu'à ce que les trois taux se rajustent.",
    en: "FX triangulation: EUR/USD = 1.10, USD/GBP = 0.80, GBP/EUR = 1.15. Starting with 1 EUR: → 1.10 USD → 1.10×0.80 = 0.88 GBP → 0.88×1.15 = 1.012 EUR. You end up with more euros than you started with (1.012 > 1): a triangular arbitrage opportunity exists, until the three rates readjust.",
  },
  alternativeExplanation: {
    fr: "Imaginez trois bureaux de change qui, mis bout à bout, vous permettraient de repartir avec plus d'argent que vous n'en avez déposé, sans aucun risque. En pratique, dès qu'un tel circuit existe, des traders automatisés l'exploitent en quelques millisecondes, ramenant les taux à l'équilibre — c'est pour cela qu'on ne \"trouve\" presque jamais d'arbitrage à la main sur un marché liquide.",
    en: "Imagine three currency exchange booths that, chained together, would let you walk away with more money than you deposited, with zero risk. In practice, as soon as such a loop exists, automated traders exploit it within milliseconds, pulling rates back to equilibrium — which is why you almost never \"find\" an arbitrage by hand on a liquid market.",
  },
  formula: {
    latex: "\\frac{S_{\\text{EUR/USD}}}{1} \\times S_{\\text{USD/GBP}} \\times S_{\\text{GBP/EUR}} = 1",
    variables: [
      { symbol: "S_{\\text{EUR/USD}}", description: { fr: "Taux de change EUR contre USD (combien d'USD pour 1 EUR)", en: "EUR/USD exchange rate (how many USD for 1 EUR)" } },
      { symbol: "S_{\\text{USD/GBP}}, S_{\\text{GBP/EUR}}", description: { fr: "Taux de change des deux autres paires du triangle", en: "Exchange rates of the triangle's two other pairs" } },
    ],
    assumptions: { fr: "Absence de coûts de transaction ; les trois cotations sont observées simultanément.", en: "No transaction costs; the three quotes are observed simultaneously." },
    units: { fr: "Produit sans dimension, doit valoir exactement 1 en absence d'arbitrage.", en: "Dimensionless product, must equal exactly 1 in the absence of arbitrage." },
    example: { fr: "1,10 × 0,80 × 1,15 = 1,012 ≠ 1 : arbitrage détecté.", en: "1.10 × 0.80 × 1.15 = 1.012 ≠ 1: arbitrage detected." },
  },
  calculation: {
    fr: "1) Relever les trois taux de change formant un cycle complet (EUR→USD→GBP→EUR). 2) Multiplier les trois taux entre eux. 3) Si le produit est exactement 1, pas d'arbitrage. 4) S'il diffère de 1, un profit est possible en suivant le cycle dans le sens qui fait croître le montant (ou le sens inverse si le produit est < 1).",
    en: "1) Read off the three exchange rates forming a complete cycle (EUR→USD→GBP→EUR). 2) Multiply the three rates together. 3) If the product is exactly 1, no arbitrage. 4) If it differs from 1, a profit is possible by following the cycle in the direction that grows the amount (or the reverse direction if the product is < 1).",
  },
  interpretation: {
    fr: "Un écart, même minuscule, suffit en théorie à générer un profit sans risque si on peut répéter l'opération à grande échelle — c'est pourquoi les marchés de change, parmi les plus liquides et les plus automatisés au monde, affichent des écarts d'arbitrage triangulaire quasiment toujours négligeables en pratique.",
    en: "Even a tiny gap is theoretically enough to generate a risk-free profit if the trade can be repeated at scale — which is why FX markets, among the most liquid and automated in the world, almost always show negligible triangular arbitrage gaps in practice.",
  },
  pitfalls: {
    fr: "Confondre un arbitrage réel avec un simple \"bon plan\" risqué : un arbitrage n'a, par définition, aucun risque et aucun coût. Autre piège : ignorer les coûts de transaction, les frais de change ou les contraintes de liquidité qui peuvent rendre un écart apparent inexploitable en pratique (arbitrage \"théorique\" mais pas réellement capturable).",
    en: "Confusing a real arbitrage with a merely risky \"good deal\": an arbitrage has, by definition, no risk and no cost. Another trap: ignoring transaction costs, exchange fees, or liquidity constraints that can make an apparent gap uncapturable in practice (a \"theoretical\" arbitrage that isn't actually exploitable).",
  },
  keyPoints: {
    fr: [
      "Un arbitrage = profit garanti, sans risque, sans mise de fonds ; il ne peut durablement exister sur un marché efficient.",
      "L'absence d'arbitrage est l'hypothèse fondatrice du pricing forward, de la parité call-put et des taux forward.",
      "L'arbitrage triangulaire sur le change illustre concrètement la loi du prix unique.",
    ],
    en: [
      "Arbitrage = a guaranteed, risk-free, zero-cost profit; it cannot durably exist in an efficient market.",
      "No-arbitrage is the founding assumption behind forward pricing, put-call parity and forward rates.",
      "FX triangular arbitrage concretely illustrates the law of one price.",
    ],
  },
  advancedDemonstration: {
    fr: "En pratique, les limites à l'arbitrage (limits to arbitrage) expliquent pourquoi certains écarts de prix persistent malgré l'existence apparente d'un profit sans risque : coûts de transaction, contraintes de financement (le \"smart money\" n'a pas un capital illimité), risque de contrepartie sur la durée de la stratégie, ou encore contraintes réglementaires sur certains acteurs. Le cas académique le plus étudié est le \"Royal Dutch/Shell\" (deux actions théoriquement liées 60/40 par leurs statuts, ayant pourtant coté avec un écart significatif et persistant pendant des années) — un rappel que \"en théorie sans arbitrage\" ne veut pas toujours dire \"en pratique sans écart\".",
    en: "In practice, \"limits to arbitrage\" explain why certain price gaps persist despite an apparent risk-free profit: transaction costs, funding constraints (\"smart money\" doesn't have unlimited capital), counterparty risk over the strategy's duration, or regulatory constraints on certain players. The most studied academic case is \"Royal Dutch/Shell\" (two shares theoretically linked 60/40 by their by-laws, yet trading with a significant, persistent gap for years) — a reminder that \"arbitrage-free in theory\" doesn't always mean \"gap-free in practice\".",
  },
};
