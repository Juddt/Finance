import type { LessonContent } from "@/lib/lesson-types";

export const m03Cs01: LessonContent = {
  conceptId: "m03-cs01",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir ce qu'est le DV01 et ce qu'est un spread de crédit, présentés dans les notions précédentes de ce module.",
      en: "You need to know what DV01 is and what a credit spread is, covered in the previous concepts of this module.",
    },
    conceptIds: ["m03-dv01", "m03-risque-credit"],
  },
  glossary: [
    { term: { fr: "CS01 (Credit Spread 01)", en: "CS01 (Credit Spread 01)" }, definition: { fr: "La variation de valeur d'une position (obligation, CDS) pour une hausse d'un point de base du spread de crédit, taux sans risque inchangé.", en: "The change in a position's value (bond, CDS) for a one-basis-point rise in the credit spread, with the risk-free rate unchanged." } },
    { term: { fr: "Duration de spread", en: "Spread duration" }, definition: { fr: "La sensibilité du prix d'une obligation à une variation du spread de crédit, par opposition à la duration classique qui mesure la sensibilité au taux sans risque.", en: "The sensitivity of a bond's price to a change in the credit spread, as opposed to classic duration, which measures sensitivity to the risk-free rate." } },
  ],
  intuition: {
    fr: "Le prix d'une obligation d'entreprise dépend de deux facteurs de risque distincts : le niveau général des taux d'intérêt (le taux sans risque) et la prime de risque de crédit spécifique à l'émetteur (le spread). Le DV01 mesure la sensibilité au premier facteur ; le CS01 mesure la sensibilité au second. Ces deux facteurs peuvent bouger indépendamment l'un de l'autre, parfois même en sens opposé.",
    en: "A corporate bond's price depends on two distinct risk factors: the general level of interest rates (the risk-free rate) and the issuer-specific credit risk premium (the spread). DV01 measures sensitivity to the first factor; CS01 measures sensitivity to the second. These two factors can move independently of each other, sometimes even in opposite directions.",
  },
  definition: {
    fr: "Le CS01 est la variation de valeur d'une position (obligation d'entreprise, CDS) pour une hausse d'un point de base du spread de crédit, le taux sans risque étant maintenu constant — l'exact analogue du DV01, appliqué au facteur de risque \"spread\" plutôt qu'au facteur \"taux sans risque\". Il s'appuie sur la duration de spread, qui mesure la sensibilité du prix au spread, généralement proche (mais pas toujours strictement égale) de la duration classique pour une obligation simple sans option intégrée.",
    en: "CS01 is the change in a position's value (corporate bond, CDS) for a one-basis-point rise in the credit spread, with the risk-free rate held constant — the exact analog of DV01, applied to the \"spread\" risk factor rather than the \"risk-free rate\" factor. It relies on spread duration, which measures the price's sensitivity to the spread, generally close to (but not always strictly equal to) classic duration for a simple bond with no embedded option.",
  },
  utility: {
    fr: "Séparer DV01 et CS01 est indispensable pour attribuer correctement le risque (et le P&L) d'un portefeuille obligataire entre mouvements de taux et mouvements de spread, et pour couvrir chaque risque séparément : un swap de taux couvre le DV01, tandis qu'un CDS couvre spécifiquement le CS01, sans affecter l'exposition aux taux. Un desk crédit qui ne suivrait que le DV01 ignorerait une part importante — parfois la majorité — du risque réellement porté sur une obligation d'entreprise.",
    en: "Separating DV01 and CS01 is essential to correctly attribute a bond portfolio's risk (and P&L) between rate moves and spread moves, and to hedge each risk separately: a rate swap hedges DV01, while a CDS specifically hedges CS01, without affecting rate exposure. A credit desk that only tracked DV01 would ignore a significant — sometimes the majority — part of the risk actually carried on a corporate bond.",
  },
  example: {
    fr: "Une obligation d'entreprise a une duration de spread de 5 et une valeur de marché de 10 000 000 EUR : son CS01 est d'environ 5 000 EUR par point de base (5 × 10 000 000 × 0,0001). Si le spread de crédit de l'émetteur s'élargit de 20 points de base suite à une dégradation de notation, la perte de valeur estimée est d'environ 5 000 × 20 = 100 000 EUR, taux sans risque inchangé.",
    en: "A corporate bond has a spread duration of 5 and a market value of EUR 10,000,000: its CS01 is approximately EUR 5,000 per basis point (5 × 10,000,000 × 0.0001). If the issuer's credit spread widens by 20 basis points following a rating downgrade, the estimated value loss is about 5,000 × 20 = EUR 100,000, risk-free rate unchanged.",
  },
  alternativeExplanation: {
    fr: "Voyez le DV01 et le CS01 comme deux thermomètres mesurant deux températures différentes du même objet : le DV01 mesure la sensibilité à la \"température\" générale du marché des taux, le CS01 mesure la sensibilité à la \"température\" spécifique à la santé financière de l'émetteur. Un portefeuille peut être totalement isolé de la première (couvert en DV01) tout en restant pleinement exposé à la seconde (CS01 non couvert).",
    en: "Think of DV01 and CS01 as two thermometers measuring two different temperatures of the same object: DV01 measures sensitivity to the general \"temperature\" of the rates market, CS01 measures sensitivity to the \"temperature\" specific to the issuer's financial health. A portfolio can be fully insulated from the first (DV01-hedged) while remaining fully exposed to the second (CS01 unhedged).",
  },
  formula: {
    latex: "\\begin{aligned} CS01 &\\approx D_{spread} \\times V \\times 0{,}0001 \\\\ \\Delta P &\\approx -CS01 \\times \\Delta s \\end{aligned}",
    variables: [
      { symbol: "D_{spread}", description: { fr: "Duration de spread de la position", en: "The position's spread duration" } },
      { symbol: "V", description: { fr: "Valeur de marché de la position", en: "The position's market value" } },
      { symbol: "\\Delta P", description: { fr: "Variation de valeur estimée de la position", en: "The position's estimated value change" } },
      { symbol: "\\Delta s", description: { fr: "Variation du spread de crédit, en points de base", en: "The credit spread's change, in basis points" } },
    ],
    assumptions: { fr: "Suppose un mouvement parallèle du spread et ignore la convexité de la sensibilité au spread pour de grandes variations. Suppose la duration de spread proche de la duration classique, ce qui n'est pas rigoureusement vrai pour des obligations à option intégrée (callable).", en: "Assumes a parallel spread move and ignores the convexity of spread sensitivity for large changes. Assumes spread duration is close to classic duration, which is not strictly true for bonds with embedded options (callable)." },
    units: { fr: "CS01 en devise par point de base ; Δs en points de base.", en: "CS01 in currency per basis point; Δs in basis points." },
    example: { fr: "D_spread=5, V=10 000 000 → CS01≈5 000. Δs=20pb → ΔP≈−100 000.", en: "D_spread=5, V=10,000,000 → CS01≈5,000. Δs=20bp → ΔP≈−100,000." },
  },
  calculation: {
    fr: "1) Relever la duration de spread de la position et sa valeur de marché. 2) Multiplier les deux, puis par 0,0001, pour obtenir le CS01. 3) Multiplier le CS01 par la variation de spread anticipée (en points de base) pour estimer la variation de valeur.",
    en: "1) Read off the position's spread duration and market value. 2) Multiply both, then by 0.0001, to get the CS01. 3) Multiply the CS01 by the anticipated spread change (in basis points) to estimate the value change.",
  },
  interpretation: {
    fr: "Un portefeuille peut afficher un DV01 net proche de zéro (bien couvert contre le risque de taux) tout en portant un CS01 significatif (fortement exposé au risque de crédit), ou inversement : ce sont deux dimensions de risque réellement indépendantes, qui exigent des couvertures et des limites de risque distinctes.",
    en: "A portfolio can display a net DV01 close to zero (well hedged against rate risk) while carrying a significant CS01 (heavily exposed to credit risk), or the reverse: these are two genuinely independent risk dimensions, requiring separate hedges and risk limits.",
  },
  pitfalls: {
    fr: "Croire que le DV01 seul capture l'ensemble du risque d'une obligation d'entreprise, en oubliant la composante spread. Autre piège fréquent : lors d'un épisode de \"fuite vers la qualité\" (flight to quality), les taux sans risque baissent et les spreads de crédit s'élargissent SIMULTANÉMENT — deux mouvements qui s'annulent partiellement en prix pour une obligation risquée, ce qui n'apparaît clairement qu'en distinguant l'effet DV01 de l'effet CS01, jamais en les confondant en un seul chiffre.",
    en: "Believing DV01 alone captures a corporate bond's entire risk, forgetting the spread component. Another frequent trap: during a \"flight to quality\" episode, risk-free rates fall and credit spreads widen SIMULTANEOUSLY — two moves that partially offset each other in price for a risky bond, which only becomes clear by distinguishing the DV01 effect from the CS01 effect, never by conflating them into a single number.",
  },
  keyPoints: {
    fr: [
      "CS01 = variation de valeur pour 1 point de base de spread de crédit, taux sans risque inchangé — l'exact analogue du DV01 pour le crédit.",
      "CS01 ≈ Duration de spread × Valeur de marché × 0,0001.",
      "Taux sans risque et spread de crédit peuvent bouger indépendamment, parfois en sens opposé (fuite vers la qualité).",
    ],
    en: [
      "CS01 = value change per basis point of credit spread, risk-free rate unchanged — the exact credit analog of DV01.",
      "CS01 ≈ Spread duration × Market value × 0.0001.",
      "The risk-free rate and the credit spread can move independently, sometimes in opposite directions (flight to quality).",
    ],
  },
  advancedDemonstration: {
    fr: "Un desk crédit utilise souvent le CS01 pour dimensionner une couverture par CDS d'une position obligataire : le notionnel de protection CDS acheté est choisi pour que le CS01 du CDS compense celui de l'obligation, neutralisant l'exposition au spread tout en conservant l'exposition au taux (si désiré). En pratique, le spread CDS et le spread implicite par le prix de l'obligation du même émetteur ne sont jamais rigoureusement identiques — cet écart, appelé \"base CDS-obligataire\" (CDS-bond basis), reflète des frictions réelles (financement, liquidité relative des deux marchés, différences contractuelles) et fait l'objet de stratégies de trading dédiées visant à exploiter sa fermeture ou son élargissement. Les salles de marché fixent généralement des limites de risque séparées en DV01 et en CS01 pour un même portefeuille, précisément parce que ce sont deux facteurs de risque indépendants qui doivent être surveillés et plafonnés séparément.",
    en: "A credit desk often uses CS01 to size a CDS hedge for a bond position: the protection notional bought is chosen so the CDS's CS01 offsets the bond's, neutralizing spread exposure while keeping rate exposure (if desired). In practice, a CDS spread and the spread implied by the same issuer's bond price are never strictly identical — this gap, called the \"CDS-bond basis\", reflects real frictions (funding, relative liquidity of the two markets, contractual differences) and is the subject of dedicated trading strategies aiming to exploit its narrowing or widening. Trading floors generally set separate DV01 and CS01 risk limits for the same portfolio, precisely because these are two independent risk factors that must be monitored and capped separately.",
  },
};
