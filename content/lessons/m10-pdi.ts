import type { LessonContent } from "@/lib/lesson-types";

export const m10Pdi: LessonContent = {
  conceptId: "m10-pdi",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la barrier parity et les mécanismes des options barrières.",
      en: "You need to know barrier parity and barrier option mechanics.",
    },
    conceptIds: ["m10-barrier-parity", "m10-mecanismes-barrieres"],
  },
  glossary: [
    { term: { fr: "Reverse convertible", en: "Reverse convertible" }, definition: { fr: "Un produit structuré qui verse un coupon élevé, mais où l'investisseur est implicitement vendeur d'un put (souvent down-and-in), bearant le risque de baisse au-delà d'une barrière.", en: "A structured product paying a high coupon, but where the investor is implicitly a put seller (often down-and-in), bearing downside risk beyond a barrier." } },
  ],
  intuition: {
    fr: "Un put down-and-in (PDI) ne \"prend vie\" que si le sous-jacent chute suffisamment pour toucher une barrière basse — avant cela, il ne vaut rien, quel que soit le niveau du sous-jacent. C'est un pari très ciblé sur un scénario de baisse sévère, ce qui le rend particulièrement adapté (et risqué) comme composant caché dans des produits offrant un rendement élevé en échange d'un risque de baisse conditionnel.",
    en: "A put down-and-in (PDI) only \"comes to life\" if the underlying falls far enough to touch a low barrier — before that, it's worth nothing, whatever the underlying's level. It's a very targeted bet on a severe decline scenario, which makes it particularly suited (and risky) as a hidden component in products offering a high yield in exchange for conditional downside risk.",
  },
  definition: {
    fr: "Un put down-and-in a un payoff de max(K−S_T, 0) UNIQUEMENT si le sous-jacent a touché la barrière H (H<S0) à un moment quelconque avant l'échéance ; sinon le payoff est nul (ou le rebate). Sa valeur, par la barrier parity (M10-3), est P_DI = P_vanille − P_DO, où P_DO est le put down-and-out correspondant.",
    en: "A put down-and-in has a payoff of max(K−S_T, 0) ONLY IF the underlying touched the barrier H (H<S0) at any point before expiry; otherwise the payoff is zero (or the rebate). Its value, by barrier parity (M10-3), is P_DI = P_vanilla − P_DO, where P_DO is the corresponding down-and-out put.",
  },
  utility: {
    fr: "Le PDI est le composant implicite le plus courant des reverse convertibles : l'investisseur vend (implicitement) ce put down-and-in à l'émetteur, encaissant la prime sous forme de coupon élevé, mais s'exposant à une perte en capital si le marché chute suffisamment pour déclencher la barrière — un mécanisme central de toute la catégorie des produits structurés (voir M11).",
    en: "The PDI is the most common implicit component of reverse convertibles: the investor (implicitly) sells this down-and-in put to the issuer, collecting the premium as a high coupon, but taking on capital loss risk if the market falls enough to trigger the barrier — a central mechanism across the entire structured products category (see M11).",
  },
  example: {
    fr: "Un investisseur achète une reverse convertible sur une action à 100, avec un put down-and-in implicitement vendu, strike K=100, barrière H=70. Si l'action ne touche jamais 70 pendant la vie du produit, le PDI ne s'active jamais et l'investisseur récupère son capital plus le coupon élevé. Si l'action tombe à 60 à un moment (touchant la barrière) puis remonte à 90 à l'échéance, le PDI s'active et paie max(100−90,0)=10 : l'investisseur subit une perte en capital malgré la remontée finale.",
    en: "An investor buys a reverse convertible on a stock at 100, with an implicitly sold down-and-in put, strike K=100, barrier H=70. If the stock never touches 70 during the product's life, the PDI never activates and the investor recovers their capital plus the high coupon. If the stock drops to 60 at some point (touching the barrier) then recovers to 90 at maturity, the PDI activates and pays max(100−90,0)=10: the investor suffers a capital loss despite the final rebound.",
  },
  alternativeExplanation: {
    fr: "Le PDI ressemble à une assurance qui ne se déclenche que si un sinistre suffisamment grave a eu lieu à un moment donné, même si la situation s'est arrangée ensuite : un dégât des eaux qui a atteint un certain niveau engage la couverture, même si l'eau s'est ensuite retirée. L'important n'est pas l'état final, mais le fait que le seuil critique ait été franchi à un moment quelconque.",
    en: "The PDI resembles insurance that only triggers if a sufficiently severe incident occurred at some point, even if the situation later improved: water damage reaching a certain level engages coverage, even if the water later recedes. What matters isn't the final state, but that the critical threshold was crossed at some point.",
  },
  formula: {
    latex: "P_{\\text{DI}} = P_{\\text{vanille}} - P_{\\text{DO}}",
    variables: [
      { symbol: "P_{\\text{vanille}}", description: { fr: "Prix du put vanille de même strike K et échéance T", en: "The vanilla put's price with the same strike K and maturity T" } },
      { symbol: "P_{\\text{DO}}", description: { fr: "Prix du put down-and-out correspondant, même barrière H", en: "The corresponding down-and-out put's price, same barrier H" } },
    ],
    assumptions: { fr: "Application directe de la barrier parity (M10-3) ; pas de rebate sur les deux contrats.", en: "Direct application of barrier parity (M10-3); no rebate on either contract." },
    units: { fr: "Prix dans la devise du sous-jacent.", en: "Prices in the underlying's currency." },
    example: { fr: "P_vanille=12, P_DO=9,50 : P_DI = 12−9,50 = 2,50.", en: "P_vanilla=12, P_DO=9.50: P_DI = 12−9.50 = 2.50." },
  },
  calculation: {
    fr: "1) Calculer (ou obtenir) le prix du put vanille de même strike et échéance. 2) Calculer (ou obtenir) le prix du put down-and-out correspondant, même barrière. 3) Soustraire pour obtenir le prix du put down-and-in. 4) Ce prix (converti en rendement annualisé) détermine la prime de risque intégrée au coupon de la reverse convertible.",
    en: "1) Compute (or obtain) the vanilla put's price with the same strike and maturity. 2) Compute (or obtain) the corresponding down-and-out put's price, same barrier. 3) Subtract to get the down-and-in put's price. 4) This price (converted to an annualized yield) determines the risk premium built into the reverse convertible's coupon.",
  },
  interpretation: {
    fr: "Plus la barrière H est proche du spot initial S0, plus le PDI est cher (plus facile à activer), donc plus le coupon offert à l'investisseur peut être élevé — mais aussi plus le risque réel de perte en capital est important. Un coupon \"anormalement\" élevé sur une reverse convertible est presque toujours le signe d'une barrière proche, pas d'une opportunité gratuite.",
    en: "The closer the barrier H is to the initial spot S0, the more expensive the PDI (easier to activate), so the higher the coupon offered to the investor can be — but also the greater the real capital-loss risk. An \"abnormally\" high coupon on a reverse convertible is almost always a sign of a close barrier, not a free opportunity.",
  },
  pitfalls: {
    fr: "Croire que si le sous-jacent \"remonte\" avant l'échéance après avoir touché la barrière, le PDI se désactive : au contraire, une fois activé (knock-in), il RESTE actif pour le reste de la vie du contrat — c'est irréversible, exactement comme pour un knock-out (M10-1). Autre piège : sous-estimer un coupon élevé comme un simple \"bon rendement\" sans identifier le risque de barrière caché qui le finance.",
    en: "Believing that if the underlying \"recovers\" before expiry after touching the barrier, the PDI deactivates: on the contrary, once activated (knocked in), it STAYS active for the rest of the contract's life — irreversible, exactly like a knock-out (M10-1). Another trap: underestimating a high coupon as simply a \"good yield\" without identifying the hidden barrier risk that funds it.",
  },
  keyPoints: {
    fr: [
      "Un PDI ne paie que si la barrière H a été touchée à un moment quelconque, pas seulement à l'échéance.",
      "P_DI = P_vanille − P_DO, une application directe de la barrier parity.",
      "C'est le composant implicite typique des reverse convertibles : coupon élevé contre risque de baisse conditionnel.",
    ],
    en: [
      "A PDI only pays if the barrier H was touched at any point, not just at maturity.",
      "P_DI = P_vanilla − P_DO, a direct application of barrier parity.",
      "It's the typical implicit component of reverse convertibles: high coupon against conditional downside risk.",
    ],
  },
  advancedDemonstration: {
    fr: "La couverture d'un PDI hérite de toutes les difficultés des options barrières près du seuil (M10-2) : le Delta et le Gamma explosent à l'approche de la barrière H, un risque que l'émetteur de la reverse convertible doit gérer activement (souvent via un déplacement de barrière pour le pricing interne, M10-5, et un lissage du payoff pour la couverture, M10-9). C'est précisément parce que ce risque de couverture est réel et coûteux que l'émetteur exige une compensation — le \"coupon élevé\" payé à l'investisseur n'est jamais un cadeau, mais la contrepartie exacte d'un risque de queue transféré et d'un coût de couverture bien réel supporté par l'émetteur.",
    en: "Hedging a PDI inherits all the difficulties of barrier options near the threshold (M10-2): Delta and Gamma explode as the barrier H is approached, a risk the reverse convertible's issuer must actively manage (often via an internal-pricing barrier shift, M10-5, and payoff smoothing for hedging, M10-9). It's precisely because this hedging risk is real and costly that the issuer demands compensation — the \"high coupon\" paid to the investor is never a gift, but the exact counterpart of a transferred tail risk and a very real hedging cost borne by the issuer.",
  },
};
