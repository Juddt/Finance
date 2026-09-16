import type { LessonContent } from "@/lib/lesson-types";

export const m07GreeksStrategies: LessonContent = {
  conceptId: "m07-greeks-strategies",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les Greeks de premier ordre et les stratégies optionnelles classiques.",
      en: "You need to know the first-order Greeks and classic option strategies.",
    },
    conceptIds: ["m07-greeks-premier-ordre", "m05-strategies-classiques"],
  },
  glossary: [
    { term: { fr: "Additivité des Greeks", en: "Additivity of Greeks" }, definition: { fr: "La propriété selon laquelle le Greek d'un portefeuille est la somme (pondérée par quantité et signe) des Greeks de chaque position qui le compose.", en: "The property that a portfolio's Greek is the sum (weighted by quantity and sign) of each component position's Greeks." } },
  ],
  intuition: {
    fr: "Puisque les Greeks se calculent séparément pour chaque option, on peut simplement les additionner (avec un signe + pour une position longue, − pour une position courte) pour obtenir le profil de risque complet d'une stratégie combinant plusieurs options.",
    en: "Since Greeks are computed separately for each option, they can simply be added (with a + sign for a long position, − for a short position) to get the full risk profile of a strategy combining several options.",
  },
  definition: {
    fr: "Pour une stratégie combinant plusieurs options de quantités q_i (positives si longues, négatives si courtes), le Greek total est Greek_stratégie = Σ q_i × Greek_i. Cette additivité s'applique à Delta, Gamma, Vega, Theta et Rho indépendamment.",
    en: "For a strategy combining several options of quantities q_i (positive if long, negative if short), the total Greek is Greek_strategy = Σ q_i × Greek_i. This additivity applies independently to Delta, Gamma, Vega, Theta and Rho.",
  },
  utility: {
    fr: "Cette additivité permet de calculer rapidement le profil de risque de n'importe quelle stratégie complexe (spreads, straddles, butterflies) sans repartir de zéro, et de vérifier qu'une stratégie correspond bien à l'exposition recherchée (directionnelle, volatilité, ou neutre).",
    en: "This additivity lets you quickly compute the risk profile of any complex strategy (spreads, straddles, butterflies) without starting from scratch, and verify a strategy truly matches the sought exposure (directional, volatility, or neutral).",
  },
  example: {
    fr: "Un straddle ATM (achat d'un call et d'un put de même strike K=S0) : Delta_call ≈ 0,52, Delta_put ≈ −0,48 (proches de ±0,5 à la monnaie) → Delta_straddle ≈ 0,52 − 0,48 = 0,04, presque neutre. Gamma et Vega, eux, s'additionnent au lieu de se compenser (les deux options ont un Gamma et un Vega positifs) : Gamma_straddle = Gamma_call + Gamma_put, un chiffre nettement positif — le straddle est bien une position \"longue volatilité\" quasi neutre en direction.",
    en: "An ATM straddle (buying a call and a put of the same strike K=S0): Delta_call ≈ 0.52, Delta_put ≈ −0.48 (close to ±0.5 at the money) → Delta_straddle ≈ 0.52 − 0.48 = 0.04, nearly neutral. Gamma and Vega, however, add up instead of offsetting (both options have positive Gamma and Vega): Gamma_straddle = Gamma_call + Gamma_put, a clearly positive number — the straddle is indeed a \"long volatility\" position, nearly direction-neutral.",
  },
  alternativeExplanation: {
    fr: "Pensez à un portefeuille comme à une recette de cuisine : chaque ingrédient (chaque option) apporte sa propre quantité de chaque \"saveur\" (chaque Greek), et le goût final du plat (le profil de risque de la stratégie) est simplement la somme de ce qu'apporte chaque ingrédient, positivement ou négativement selon qu'on l'ajoute (achat) ou le retire (vente).",
    en: "Think of a portfolio like a recipe: each ingredient (each option) contributes its own amount of each \"flavor\" (each Greek), and the dish's final taste (the strategy's risk profile) is simply the sum of what each ingredient contributes, positively or negatively depending on whether it's added (bought) or removed (sold).",
  },
  formula: {
    latex: "\\text{Greek}_{\\text{stratégie}} = \\sum_{i} q_i \\times \\text{Greek}_i",
    variables: [
      { symbol: "q_i", description: { fr: "Quantité de la position i (positive si longue, négative si courte)", en: "Position i's quantity (positive if long, negative if short)" } },
      { symbol: "\\text{Greek}_i", description: { fr: "La valeur du Greek considéré pour une unité de la position i", en: "The considered Greek's value for one unit of position i" } },
    ],
    assumptions: { fr: "Toutes les positions sont sur le même sous-jacent ; les Greeks sont additifs par construction (dérivées partielles d'une somme).", en: "All positions are on the same underlying; Greeks are additive by construction (partial derivatives of a sum)." },
    units: { fr: "Même unité que le Greek individuel de chaque option.", en: "Same unit as each option's individual Greek." },
    example: { fr: "Bull call spread : +1 call K1 (Delta=0,6) − 1 call K2 (Delta=0,3) : Delta_spread = 0,6 − 0,3 = 0,3.", en: "Bull call spread: +1 call K1 (Delta=0.6) − 1 call K2 (Delta=0.3): Delta_spread = 0.6 − 0.3 = 0.3." },
  },
  calculation: {
    fr: "1) Lister chaque jambe de la stratégie avec sa quantité signée (+ pour achat, − pour vente). 2) Calculer (ou relever) le Greek de chaque option individuelle. 3) Multiplier chaque Greek par sa quantité signée. 4) Sommer tous les termes pour obtenir le Greek total de la stratégie.",
    en: "1) List each leg of the strategy with its signed quantity (+ for buy, − for sell). 2) Compute (or look up) each individual option's Greek. 3) Multiply each Greek by its signed quantity. 4) Sum all terms to get the strategy's total Greek.",
  },
  interpretation: {
    fr: "Une stratégie comme le straddle illustre bien la différence entre Delta (qui peut s'annuler par construction, comme dans un spread ou un straddle ATM) et Gamma/Vega (qui, eux, ne s'annulent jamais pour une combinaison d'options toutes achetées — ils s'additionnent). C'est cette distinction qui permet de construire des positions \"neutres en direction mais exposées à la volatilité\".",
    en: "A strategy like the straddle nicely illustrates the difference between Delta (which can cancel out by construction, as in a spread or ATM straddle) and Gamma/Vega (which never cancel for a combination of all-bought options — they add up). This distinction is what lets you build \"direction-neutral but volatility-exposed\" positions.",
  },
  pitfalls: {
    fr: "Croire qu'un Delta proche de zéro signifie que la stratégie est totalement sans risque : un straddle a un Delta quasi nul mais un Gamma et un Vega très significatifs, donc un risque important sur l'amplitude des mouvements et la volatilité. Autre piège : oublier le signe (− pour une vente) en additionnant les Greeks d'une stratégie combinant achats et ventes.",
    en: "Believing a near-zero Delta means the strategy is entirely risk-free: a straddle has a near-zero Delta but very significant Gamma and Vega, so substantial risk on move magnitude and volatility. Another trap: forgetting the sign (− for a sale) when adding up a strategy's Greeks combining buys and sells.",
  },
  keyPoints: {
    fr: [
      "Greek_stratégie = Σ q_i × Greek_i : les Greeks s'additionnent, pondérés par quantité et signe.",
      "Un Delta neutre (spread, straddle ATM) ne signifie pas un Gamma ou un Vega neutres.",
      "Cette additivité permet d'analyser rapidement le profil de risque de n'importe quelle combinaison d'options.",
    ],
    en: [
      "Greek_strategy = Σ q_i × Greek_i: Greeks add up, weighted by quantity and sign.",
      "A neutral Delta (spread, ATM straddle) doesn't mean neutral Gamma or Vega.",
      "This additivity lets you quickly analyze the risk profile of any combination of options.",
    ],
  },
  advancedDemonstration: {
    fr: "Cette additivité est directement exploitée dans la construction de positions \"pures\" ciblant un seul Greek : un risk reversal (achat call, vente put, ou l'inverse) construit une position à Delta élevé mais Vega quasi neutre (les Vega du call et du put achetés/vendus se compensent partiellement selon les strikes choisis), utile pour parier sur la direction sans (trop) parier sur la volatilité. À l'inverse, un straddle ou strangle cible un Vega élevé avec un Delta quasi neutre. Cette logique de construction \"par les Greeks\" plutôt que \"par les payoffs\" est la façon dont un desk professionnel pense réellement ses positions au quotidien.",
    en: "This additivity is directly exploited when building \"pure\" positions targeting a single Greek: a risk reversal (buy call, sell put, or the reverse) builds a high-Delta but near-Vega-neutral position (the bought/sold call and put's Vegas partially offset depending on chosen strikes), useful for betting on direction without (too much) betting on volatility. Conversely, a straddle or strangle targets high Vega with near-neutral Delta. This \"by the Greeks\" rather than \"by the payoffs\" construction logic is how a professional desk actually thinks about its positions day to day.",
  },
};
