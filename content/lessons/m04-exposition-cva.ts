import type { LessonContent } from "@/lib/lesson-types";

export const m04ExpositionCva: LessonContent = {
  conceptId: "m04-exposition-cva",
  prerequisiteReminder: {
    text: {
      fr: "Il faut comprendre le mécanisme du clearing central, du cadre ISDA-CSA et des appels de marge, présenté dans la notion précédente de ce module.",
      en: "You need to understand the central clearing mechanism, the ISDA-CSA framework and margin calls, covered in the previous concept of this module.",
    },
    conceptIds: ["m04-clearing-csa"],
  },
  glossary: [
    { term: { fr: "Exposition future attendue (EFA)", en: "Expected future exposure (EFE)" }, definition: { fr: "La valeur de marché positive attendue d'un dérivé à une date future, c'est-à-dire le montant que l'on perdrait si la contrepartie faisait défaut à cette date.", en: "A derivative's expected positive market value at a future date, i.e. the amount one would lose if the counterparty defaulted at that date." } },
    { term: { fr: "CVA (Credit Valuation Adjustment)", en: "CVA (Credit Valuation Adjustment)" }, definition: { fr: "L'ajustement de valeur appliqué au prix théorique d'un dérivé pour refléter le risque que la contrepartie fasse défaut avant l'échéance du contrat.", en: "The value adjustment applied to a derivative's theoretical price to reflect the risk that the counterparty defaults before the contract's maturity." } },
  ],
  intuition: {
    fr: "Un dérivé bilatéral (par exemple un swap non compensé par une CCP) n'est jamais totalement sans risque, même si son pricing théorique l'ignore : si la contrepartie fait défaut au moment où le contrat a de la valeur POUR VOUS, vous perdez cette valeur. Ce risque n'est ni un risque de marché (le prix du sous-jacent) ni un risque de crédit classique sur un émetteur d'obligation : c'est le risque que VOTRE PARTENAIRE de transaction ne tienne pas ses engagements futurs.",
    en: "A bilateral derivative (e.g. an uncleared swap) is never entirely risk-free, even though its theoretical pricing ignores this: if the counterparty defaults at a time when the contract has value TO YOU, you lose that value. This risk is neither a market risk (the underlying's price) nor a classic credit risk on a bond issuer: it's the risk that YOUR TRANSACTION PARTNER fails to honor their future obligations.",
  },
  definition: {
    fr: "L'exposition future attendue (EFA) est la valeur de marché positive attendue d'un dérivé à une date future : c'est le montant qu'on perdrait si la contrepartie faisait défaut à cette date précise (une valeur négative pour soi n'est pas une perte en cas de défaut de la contrepartie, car on devrait de toute façon cette somme). La CVA est l'ajustement de valeur appliqué au prix théorique du dérivé pour refléter ce risque de défaut de la contrepartie, calculé en combinant l'exposition future attendue à chaque date, la probabilité de défaut de la contrepartie sur cette période, et le taux de recouvrement anticipé.",
    en: "Expected future exposure (EFE) is a derivative's expected positive market value at a future date: it's the amount one would lose if the counterparty defaulted at that specific date (a negative value to oneself isn't a loss in case of counterparty default, since one would owe that amount regardless). CVA is the value adjustment applied to the derivative's theoretical price to reflect this counterparty default risk, computed by combining the expected future exposure at each date, the counterparty's default probability over that period, and the anticipated recovery rate.",
  },
  utility: {
    fr: "Distinguer risque de marché, risque de crédit de l'émetteur et risque de contrepartie est indispensable pour comprendre pourquoi un swap bilatéral non collatéralisé vaut structurellement moins qu'un swap parfaitement collatéralisé ou compensé par une CCP, même à conditions de marché identiques : la CVA quantifie précisément ce coût lié au risque que la contrepartie du contrat, et non l'émetteur d'un titre sous-jacent, ne tienne pas ses engagements.",
    en: "Distinguishing market risk, issuer credit risk and counterparty risk is essential to understand why an uncollateralized bilateral swap is structurally worth less than a perfectly collateralized or CCP-cleared swap, even under identical market conditions: CVA precisely quantifies this cost tied to the risk that the contract's counterparty, not an underlying security's issuer, fails to honor its obligations.",
  },
  example: {
    fr: "Une banque a conclu un swap de taux avec une contrepartie non collatéralisée. Dans un an, si les taux ont évolué en sa faveur, le swap vaut par exemple +2 000 000 EUR pour la banque : c'est le montant qu'elle perdrait si la contrepartie faisait défaut à ce moment précis. Si, au contraire, le swap valait −2 000 000 EUR pour la banque à cette date, un défaut de la contrepartie ne changerait rien pour elle (elle devrait de toute façon cette somme) — c'est cette asymétrie entre exposition positive et négative que capture l'exposition future attendue.",
    en: "A bank has entered an uncollateralized swap with a counterparty. In a year, if rates have moved in its favor, the swap is worth, say, +EUR 2,000,000 to the bank: that's the amount it would lose if the counterparty defaulted at that exact moment. If instead the swap were worth −EUR 2,000,000 to the bank at that date, a counterparty default wouldn't change anything for it (it would owe that amount regardless) — this asymmetry between positive and negative exposure is exactly what expected future exposure captures.",
  },
  alternativeExplanation: {
    fr: "Imaginez un prêt que vous consentez à un ami, dont le montant varie chaque mois selon des règles fixées à l'avance (parfois vous lui devez de l'argent, parfois c'est l'inverse). Le risque de contrepartie ne concerne que les mois où c'est LUI qui vous doit de l'argent : s'il disparaît ce mois-là, vous perdez cette somme. S'il disparaît un mois où c'est VOUS qui lui deviez de l'argent, vous ne perdez rien (vous deviez cette somme de toute façon). La CVA, c'est le \"prix\" que vous accepteriez de payer aujourd'hui pour vous protéger de ce risque, additionné sur toute la durée de la relation.",
    en: "Picture a loan you make to a friend, whose amount varies each month according to rules fixed in advance (sometimes you owe them money, sometimes the reverse). Counterparty risk only concerns the months when THEY owe YOU money: if they vanish that month, you lose that amount. If they vanish a month when YOU owed THEM money, you lose nothing (you owed that amount regardless). CVA is the \"price\" you'd accept to pay today to protect against this risk, summed over the entire relationship's duration.",
  },
  formula: {
    latex: "\\begin{aligned} CVA &\\approx (1 - R) \\times \\sum_i EFA_i \\times PD_i \\\\ EFA_i &= \\mathbb{E}[\\max(V_i, 0)] \\end{aligned}",
    variables: [
      { symbol: "R", description: { fr: "Taux de recouvrement anticipé en cas de défaut de la contrepartie", en: "Anticipated recovery rate in case of counterparty default" } },
      { symbol: "EFA_i", description: { fr: "Exposition future attendue à la date i, c'est-à-dire l'espérance de la valeur positive du contrat à cette date", en: "Expected future exposure at date i, i.e. the expectation of the contract's positive value at that date" } },
      { symbol: "PD_i", description: { fr: "Probabilité de défaut de la contrepartie sur la période associée à la date i", en: "The counterparty's default probability over the period associated with date i" } },
      { symbol: "V_i", description: { fr: "Valeur de marché du contrat à la date i (peut être positive ou négative)", en: "The contract's market value at date i (can be positive or negative)" } },
    ],
    assumptions: { fr: "Suppose une indépendance simplificatrice entre l'exposition future et la probabilité de défaut de la contrepartie (ignore le \"wrong-way risk\", où les deux seraient corrélés). Formule simplifiée à but pédagogique ; les modèles de CVA en pratique sont nettement plus élaborés (simulation Monte Carlo de trajectoires, corrélations).", en: "Assumes a simplifying independence between future exposure and the counterparty's default probability (ignores \"wrong-way risk\", where the two would be correlated). Simplified formula for teaching purposes; real-world CVA models are markedly more elaborate (Monte Carlo path simulation, correlations)." },
    units: { fr: "CVA en devise (montant absolu, généralement soustrait de la valeur théorique du contrat).", en: "CVA in currency (absolute amount, generally subtracted from the contract's theoretical value)." },
    example: { fr: "Un contrat avec EFA moyenne de 1 000 000 sur sa durée, probabilité de défaut cumulée de 2%, recouvrement de 40% → CVA ≈ 0,6 × 1 000 000 × 0,02 = 12 000.", en: "A contract with average EFE of 1,000,000 over its life, cumulative default probability of 2%, 40% recovery → CVA ≈ 0.6 × 1,000,000 × 0.02 = 12,000." },
  },
  calculation: {
    fr: "1) Pour chaque date future pertinente, estimer l'exposition future attendue (la valeur positive attendue du contrat, jamais la valeur négative). 2) Multiplier chaque exposition par la probabilité de défaut de la contrepartie sur la période correspondante. 3) Sommer ces contributions sur toute la durée du contrat, puis multiplier par (1 − taux de recouvrement) pour obtenir la CVA.",
    en: "1) For each relevant future date, estimate the expected future exposure (the contract's expected positive value, never the negative value). 2) Multiply each exposure by the counterparty's default probability over the corresponding period. 3) Sum these contributions over the contract's entire life, then multiply by (1 − recovery rate) to get the CVA.",
  },
  interpretation: {
    fr: "Une CVA élevée signale soit une exposition future attendue importante (le contrat a de fortes chances d'avoir une valeur très positive pour soi à l'avenir), soit une probabilité de défaut de la contrepartie élevée, soit les deux : c'est un coût réel qui doit être intégré au prix du contrat, et qui justifie pourquoi deux contreparties de qualité de crédit différente ne devraient pas se voir proposer exactement le même prix pour un dérivé par ailleurs identique.",
    en: "A high CVA signals either significant expected future exposure (the contract has a strong chance of being worth a lot to oneself in the future), or a high counterparty default probability, or both: it's a real cost that must be built into the contract's price, and justifies why two counterparties of different credit quality shouldn't be offered exactly the same price for an otherwise identical derivative.",
  },
  pitfalls: {
    fr: "Confondre le risque de contrepartie (risque que le PARTENAIRE du contrat dérivé fasse défaut) avec le risque de crédit d'un émetteur (risque que l'ÉMETTEUR d'une obligation détenue fasse défaut) : ce sont deux risques de crédit distincts, avec des mécanismes de mitigation différents (collatéral et CSA pour le premier, diversification et notation pour le second). Autre piège : croire que l'exposition future attendue est simplement la valeur actuelle du contrat, alors qu'elle nécessite de projeter la valeur POSITIVE probable à chaque date future, en tenant compte de la volatilité du sous-jacent.",
    en: "Confusing counterparty risk (the risk that the derivative contract's PARTNER defaults) with issuer credit risk (the risk that the ISSUER of a held bond defaults): these are two distinct credit risks, with different mitigation mechanisms (collateral and CSA for the former, diversification and ratings for the latter). Another trap: believing expected future exposure is simply the contract's current value, when it actually requires projecting the likely POSITIVE value at each future date, accounting for the underlying's volatility.",
  },
  keyPoints: {
    fr: [
      "L'exposition future attendue est la valeur POSITIVE attendue d'un dérivé à une date future : ce qu'on perdrait en cas de défaut de la contrepartie à cette date.",
      "La CVA ajuste le prix théorique d'un dérivé pour refléter le risque de défaut de la contrepartie, distinct du risque de marché et du risque de crédit d'un émetteur.",
      "CVA ≈ (1 − taux de recouvrement) × somme des expositions futures attendues pondérées par la probabilité de défaut.",
    ],
    en: [
      "Expected future exposure is a derivative's expected POSITIVE value at a future date: what one would lose if the counterparty defaulted at that date.",
      "CVA adjusts a derivative's theoretical price to reflect counterparty default risk, distinct from market risk and an issuer's credit risk.",
      "CVA ≈ (1 − recovery rate) × sum of expected future exposures weighted by default probability.",
    ],
  },
  advancedDemonstration: {
    fr: "Le collatéral échangé sous un accord CSA (couvert dans la notion précédente) est précisément le mécanisme qui réduit la CVA en pratique : en réévaluant le contrat régulièrement et en échangeant du collatéral pour compenser toute valeur positive, l'exposition future attendue résiduelle (non couverte par le collatéral déjà en place) devient beaucoup plus faible que l'exposition brute non collatéralisée. C'est pourquoi le clearing central via une CCP, qui impose systématiquement appels de marge et collatéral, réduit structurellement la CVA d'un swap par rapport à un contrat bilatéral équivalent sans CSA — un lien direct entre le mécanisme de marge étudié précédemment et le coût de contrepartie quantifié ici.",
    en: "Collateral exchanged under a CSA agreement (covered in the previous concept) is precisely the mechanism that reduces CVA in practice: by regularly revaluing the contract and exchanging collateral to offset any positive value, the residual expected future exposure (not already covered by collateral in place) becomes much smaller than the raw uncollateralized exposure. This is why central clearing via a CCP, which systematically imposes margin calls and collateral, structurally reduces a swap's CVA compared to an equivalent bilateral contract without a CSA — a direct link between the margin mechanism studied previously and the counterparty cost quantified here.",
  },
};
