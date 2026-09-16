import type { LessonContent } from "@/lib/lesson-types";

export const m03Dv01: LessonContent = {
  conceptId: "m03-dv01",
  prerequisiteReminder: {
    text: {
      fr: "Le DV01 se déduit directement de la duration modifiée : assurez-vous d'être à l'aise avec cette notion.",
      en: "DV01 follows directly from modified duration: make sure you are comfortable with that concept.",
    },
    conceptIds: ["m03-duration"],
  },
  glossary: [
    { term: { fr: "Point de base (pb)", en: "Basis point (bp)" }, definition: { fr: "Un centième de point de pourcentage : 1 pb = 0,01% = 0,0001.", en: "One hundredth of a percentage point: 1 bp = 0.01% = 0.0001." } },
  ],
  intuition: {
    fr: "La duration modifiée donne une sensibilité en pourcentage ; le DV01 traduit cette même sensibilité directement en euros ou en dollars, pour un mouvement de taux standardisé d'un point de base — beaucoup plus parlant pour un trader qui gère une position en valeur monétaire.",
    en: "Modified duration gives a percentage sensitivity; DV01 translates that same sensitivity directly into euros or dollars, for a standardized one-basis-point rate move — much more intuitive for a trader managing a position in money terms.",
  },
  definition: {
    fr: "Le DV01 (Dollar Value of 01, aussi appelé PV01) est la variation du prix d'une obligation (ou d'un portefeuille) en unités monétaires, pour une hausse de rendement de 1 point de base (0,01%). Par convention, il est généralement exprimé comme un montant positif représentant l'ampleur de la variation, la direction (perte en cas de hausse des taux) étant sous-entendue pour une position longue.",
    en: "DV01 (Dollar Value of 01, also called PV01) is the change in a bond's (or portfolio's) price, in currency units, for a 1-basis-point rise in yield (0.01%). By convention, it is usually expressed as a positive amount representing the magnitude of the change, with the direction (a loss on a long position when rates rise) left implicit.",
  },
  utility: {
    fr: "Le DV01 permet de mesurer et d'agréger le risque de taux d'un portefeuille entier en une seule unité monétaire commune, quelle que soit la diversité des obligations qui le composent — bien plus pratique en salle de marché qu'une duration en pourcentage propre à chaque obligation.",
    en: "DV01 lets you measure and aggregate the interest rate risk of an entire portfolio into one common currency unit, regardless of how diverse the underlying bonds are — far more practical on a trading desk than a duration percentage specific to each bond.",
  },
  example: {
    fr: "Une position de 10 000 000 EUR nominal sur une obligation de prix P0 = 973,28 (pour 1 000 de nominal) et D_mod = 2,79. La valeur de marché de la position est 9 732 800 EUR. DV01 = 9 732 800 × 2,79 × 0,0001 ≈ 2 715,45 EUR : la position perd environ 2 715 EUR si les taux montent de 1 point de base.",
    en: "A EUR 10,000,000 face-value position in a bond priced at P0 = 973.28 (per 1,000 of face value) with D_mod = 2.79. The position's market value is EUR 9,732,800. DV01 = 9,732,800 × 2.79 × 0.0001 ≈ EUR 2,715.45: the position loses about EUR 2,715 if rates rise by 1 basis point.",
  },
  alternativeExplanation: {
    fr: "Le DV01, c'est le \"prix d'un point de base\" pour votre position : au lieu de dire \"si les taux montent de 1%, je perds 5,58% de la valeur de mon portefeuille\" (peu parlant), vous dites \"chaque point de base me coûte 2 715 EUR\" — une unité directement utilisable pour dimensionner une couverture.",
    en: "DV01 is the \"price of one basis point\" for your position: instead of saying \"if rates rise 1%, I lose 5.58% of my portfolio's value\" (not very intuitive), you say \"every basis point costs me EUR 2,715\" — a unit directly usable to size a hedge.",
  },
  formula: {
    latex: "\\text{DV01} \\approx \\text{Valeur de marché} \\times D_{\\text{mod}} \\times 0{,}0001",
    variables: [
      { symbol: "\\text{Valeur de marché}", description: { fr: "Valeur de marché actuelle de la position (prix × quantité de nominal détenue)", en: "Current market value of the position (price × face value held)" } },
      { symbol: "D_{\\text{mod}}", description: { fr: "Duration modifiée de l'obligation ou du portefeuille", en: "Modified duration of the bond or portfolio" } },
    ],
    assumptions: { fr: "Approximation locale, valable pour un mouvement de 1 pb (assez petit pour que l'effet de convexité soit négligeable).", en: "Local approximation, valid for a 1 bp move (small enough that the convexity effect is negligible)." },
    units: { fr: "DV01 dans la devise de la position, par point de base.", en: "DV01 in the position's currency, per basis point." },
    example: { fr: "Valeur = 9 732 800, D_mod = 2,79 : DV01 ≈ 9 732 800 × 2,79 × 0,0001 ≈ 2 715,45.", en: "Value = 9,732,800, D_mod = 2.79: DV01 ≈ 9,732,800 × 2.79 × 0.0001 ≈ 2,715.45." },
  },
  calculation: {
    fr: "1) Calculer la valeur de marché de la position (prix × quantité). 2) Multiplier par la duration modifiée D_mod. 3) Multiplier par 0,0001 (1 point de base). 4) Le résultat est la perte (ou le gain, selon le sens de la position) pour +1 pb de taux.",
    en: "1) Compute the position's market value (price × quantity). 2) Multiply by modified duration D_mod. 3) Multiply by 0.0001 (1 basis point). 4) The result is the loss (or gain, depending on the position's direction) for a +1 bp rate move.",
  },
  interpretation: {
    fr: "Le DV01 est additif à travers un portefeuille (contrairement à la duration, qui doit être pondérée) : le DV01 total d'un portefeuille est simplement la somme des DV01 de chaque ligne. C'est ce qui en fait l'outil de prédilection pour agréger et couvrir un risque de taux multi-obligations.",
    en: "DV01 is additive across a portfolio (unlike duration, which must be weighted): a portfolio's total DV01 is simply the sum of each line's DV01. This is what makes it the tool of choice for aggregating and hedging interest rate risk across multiple bonds.",
  },
  pitfalls: {
    fr: "Oublier de multiplier par la valeur de marché de la position (confondre DV01 par obligation et DV01 de la position totale). Autre piège : utiliser le DV01 pour une grande variation de taux — il n'est fiable que pour de petits mouvements, au-delà il faut revenir à la formule complète avec convexité (M03-4).",
    en: "Forgetting to multiply by the position's market value (confusing per-bond DV01 with the total position's DV01). Another trap: using DV01 for a large rate move — it is only reliable for small moves, beyond that the full formula with convexity (M03-4) is needed.",
  },
  keyPoints: {
    fr: [
      "DV01 = variation de prix en unités monétaires pour +1 point de base de taux.",
      "DV01 ≈ Valeur de marché × D_mod × 0,0001.",
      "Le DV01 est additif à travers un portefeuille : c'est l'unité standard pour agréger et couvrir un risque de taux.",
    ],
    en: [
      "DV01 = price change in currency units for a +1 basis point rate move.",
      "DV01 ≈ Market value × D_mod × 0.0001.",
      "DV01 is additive across a portfolio: the standard unit for aggregating and hedging interest rate risk.",
    ],
  },
  advancedDemonstration: {
    fr: "Le DV01 sert à dimensionner une couverture par un autre instrument (future de taux, swap) : le nombre de contrats à traiter est N = −DV01_portefeuille / DV01_instrument_de_couverture, pour neutraliser l'exposition. Cette approche suppose implicitement que tous les points de la courbe des taux bougent en parallèle (un choc parallèle) ; en pratique, les gérants sophistiqués décomposent le risque en plusieurs \"seaux\" de maturité (key rate DV01) pour couvrir séparément le risque sur la partie courte, moyenne et longue de la courbe, car les taux ne bougent presque jamais parfaitement en parallèle.",
    en: "DV01 is used to size a hedge with another instrument (a rate future, a swap): the number of contracts to trade is N = −DV01_portfolio / DV01_hedging_instrument, to neutralize the exposure. This approach implicitly assumes every point on the yield curve moves in parallel (a parallel shock); in practice, sophisticated managers decompose the risk into several maturity \"buckets\" (key rate DV01) to separately hedge the risk on the short, medium and long parts of the curve, since rates almost never move perfectly in parallel.",
  },
};
