import type { LessonContent } from "@/lib/lesson-types";

export const m11GreeksAutocall: LessonContent = {
  conceptId: "m11-greeks-autocall",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les Greeks extrêmes près d'une barrière et l'impact de la volatilité sur les knock-out.",
      en: "You need to know extreme Greeks near a barrier and volatility's impact on knock-outs.",
    },
    conceptIds: ["m10-greeks-barrieres", "m10-impact-vol-knockout"],
  },
  glossary: [
    { term: { fr: "Effet mémoire de trajectoire", en: "Path-memory effect" }, definition: { fr: "L'influence des observations passées (coupons déjà accumulés, dates déjà franchies sans rappel) sur les Greeks présents d'un autocall, qui n'a pas d'équivalent pour une option vanille sans mémoire.", en: "The influence of past observations (coupons already accumulated, dates already passed without a call) on an autocall's current Greeks, which has no equivalent for a memory-less vanilla option." } },
  ],
  intuition: {
    fr: "Les Greeks d'un autocall héritent de toute la complexité des Greeks de barrière (M10-2) mais en pire : au lieu d'une seule barrière, il y en a potentiellement plusieurs (une par date d'observation) actives à des moments différents, chacune créant sa propre zone de sensibilité extrême, avec en plus une dépendance à l'historique déjà observé du sous-jacent.",
    en: "An autocall's Greeks inherit all the complexity of barrier Greeks (M10-2) but worse: instead of a single barrier, there are potentially several (one per observation date) active at different times, each creating its own zone of extreme sensitivity, plus a dependency on the underlying's already-observed history.",
  },
  definition: {
    fr: "Près d'une date d'observation à venir, le Delta et le Gamma d'un autocall peuvent devenir extrêmes exactement comme pour une option barrière (M10-2), car un léger mouvement du sous-jacent peut faire basculer le produit entre \"rappelé maintenant\" et \"continue jusqu'à la prochaine date\". Le Vega d'un autocall est généralement négatif près de la barrière de capital (la volatilité augmente le risque de toucher cette barrière, comme pour un knock-out, M10-5) mais peut être positif loin des barrières (la volatilité augmente la valeur temps de la composante optionnelle standard).",
    en: "Near an upcoming observation date, an autocall's Delta and Gamma can become extreme exactly like a barrier option's (M10-2), since a slight move in the underlying can flip the product between \"called now\" and \"continues to the next date\". An autocall's Vega is generally negative near the capital barrier (volatility increases the risk of touching that barrier, like a knock-out, M10-5) but can be positive far from the barriers (volatility increases the standard optional component's time value).",
  },
  utility: {
    fr: "Un desk qui émet et couvre des autocalls doit anticiper ces zones de Greeks extrêmes à chaque approche de date d'observation : c'est l'un des principaux défis opérationnels de la gestion d'un livre d'autocalls, bien au-delà du simple calcul du prix initial.",
    en: "A desk that issues and hedges autocalls must anticipate these extreme Greeks zones near each observation date: this is one of the main operational challenges of managing an autocall book, well beyond simply computing the initial price.",
  },
  example: {
    fr: "À l'approche d'une date d'observation, avec le sous-jacent juste en dessous de la barrière de rappel : une petite hausse du sous-jacent peut déclencher un rappel immédiat (l'autocall \"disparaît\", remplacé par un simple remboursement cash), provoquant une variation de valeur brutale et donc un Delta très élevé localement — exactement le même phénomène que pour une option barrière (M10-2), mais qui se répète à CHAQUE date d'observation, pas une seule fois.",
    en: "As an observation date approaches, with the underlying just below the call barrier: a small rise in the underlying can trigger an immediate call (the autocall \"vanishes\", replaced by a simple cash repayment), causing an abrupt value change and so a very high local Delta — exactly the same phenomenon as for a barrier option (M10-2), but repeating at EVERY observation date, not just once.",
  },
  alternativeExplanation: {
    fr: "Gérer les Greeks d'un autocall, c'est un peu comme jongler avec plusieurs précipices qui apparaissent et disparaissent l'un après l'autre dans le temps : à chaque approche de date d'observation, un nouveau \"bord\" devient pertinent, et le trader doit adapter sa couverture à ce bord précis, avant qu'il ne disparaisse (rappel ou passage de la date) et qu'un nouveau bord n'apparaisse à l'horizon suivant.",
    en: "Managing an autocall's Greeks is a bit like juggling several precipices that appear and disappear one after another over time: as each observation date approaches, a new \"edge\" becomes relevant, and the trader must adapt their hedge to that specific edge, before it disappears (call or date passing) and a new edge appears at the next horizon.",
  },
  formula: {
    latex: "\\text{Delta}_{\\text{effectif, proche } t_i} \\approx \\frac{V(\\text{rappelé}) - V(\\text{non rappelé})}{\\varepsilon}",
    variables: [
      { symbol: "V(\\text{rappelé})", description: { fr: "Valeur du produit juste après un rappel (nominal + coupon, actualisé)", en: "The product's value just after a call (face value + coupon, discounted)" } },
      { symbol: "V(\\text{non rappelé})", description: { fr: "Valeur du produit juste avant, s'il continue vers la prochaine observation", en: "The product's value just before, if it continues to the next observation" } },
    ],
    assumptions: { fr: "Approximation locale, valable uniquement dans le voisinage immédiat d'une date d'observation et de sa barrière de rappel.", en: "Local approximation, valid only in the immediate vicinity of an observation date and its call barrier." },
    units: { fr: "Sans dimension (Delta).", en: "Dimensionless (Delta)." },
    example: { fr: "V(rappelé)=108, V(non rappelé)=101, ε=1 : Delta_effectif ≈ 7 — très supérieur au Delta d'une option vanille typique.", en: "V(called)=108, V(not called)=101, ε=1: Effective Delta ≈ 7 — much higher than a typical vanilla option's Delta." },
  },
  calculation: {
    fr: "1) Identifier la prochaine date d'observation active et sa barrière associée. 2) Évaluer si le spot actuel est proche de cette barrière (zone à risque de Greeks extrêmes). 3) Si oui, estimer le saut de valeur entre les deux scénarios (rappelé vs. non rappelé) pour quantifier l'ampleur du Delta/Gamma local. 4) Répéter cette analyse à chaque approche de date d'observation suivante, en tenant compte des coupons déjà accumulés (effet mémoire).",
    en: "1) Identify the next active observation date and its associated barrier. 2) Assess whether the current spot is close to that barrier (extreme-Greeks risk zone). 3) If so, estimate the value jump between the two scenarios (called vs. not called) to quantify the local Delta/Gamma's magnitude. 4) Repeat this analysis as each subsequent observation date approaches, accounting for already-accumulated coupons (memory effect).",
  },
  interpretation: {
    fr: "Contrairement à une option barrière simple dont le risque de Greeks extrêmes est concentré autour d'un seul niveau et pendant toute la vie du contrat, celui d'un autocall est concentré dans le TEMPS autour de chaque date d'observation à venir : loin d'une date d'observation, les Greeks sont relativement calmes ; juste avant, ils peuvent devenir extrêmes, puis retomber immédiatement après (rappel ou passage sans rappel).",
    en: "Unlike a simple barrier option whose extreme-Greeks risk is concentrated around a single level throughout the contract's life, an autocall's is concentrated in TIME around each upcoming observation date: far from an observation date, the Greeks are relatively calm; just before, they can become extreme, then drop back immediately after (call or pass without call).",
  },
  pitfalls: {
    fr: "Calculer les Greeks d'un autocall une seule fois à l'émission et les considérer comme stables : en réalité, ils évoluent fortement à l'approche de chaque date d'observation et doivent être réévalués régulièrement. Autre piège : supposer que le Vega est toujours négatif comme pour un knock-out simple, sans distinguer les régimes où le spot est proche de la barrière de capital (Vega souvent négatif) de ceux où il est loin de toute barrière (Vega souvent positif).",
    en: "Computing an autocall's Greeks once at issuance and treating them as stable: in reality, they change substantially as each observation date approaches and must be regularly reassessed. Another trap: assuming Vega is always negative like a simple knock-out's, without distinguishing regimes where spot is close to the capital barrier (Vega often negative) from those far from any barrier (Vega often positive).",
  },
  keyPoints: {
    fr: [
      "Le Delta et le Gamma deviennent extrêmes à l'approche de chaque date d'observation, si le spot est proche de la barrière de rappel.",
      "Le Vega peut être négatif près de la barrière de capital, positif loin de toute barrière.",
      "Contrairement à une barrière simple, le risque de Greeks extrêmes se concentre dans le temps, autour de chaque date d'observation successive.",
    ],
    en: [
      "Delta and Gamma become extreme as each observation date approaches, if spot is close to the call barrier.",
      "Vega can be negative near the capital barrier, positive far from any barrier.",
      "Unlike a single barrier, extreme-Greeks risk is concentrated in time, around each successive observation date.",
    ],
  },
  advancedDemonstration: {
    fr: "La gestion pratique du risque de Greeks d'un livre d'autocalls combine les techniques déjà vues pour les barrières simples (lissage, M10-9 ; déplacement de barrière, M10-5) avec une dimension supplémentaire de gestion de portefeuille : un desk avec de nombreux autocalls à différentes dates d'observation peut bénéficier d'un effet de diversification temporelle partiel (les pics de Greeks de différents produits ne coïncident pas forcément), mais reste exposé à un risque systémique si un mouvement de marché brutal affecte simultanément plusieurs produits proches de leur date d'observation respective.",
    en: "Practically managing an autocall book's Greeks risk combines techniques already seen for simple barriers (smoothing, M10-9; barrier shift, M10-5) with an additional portfolio-management dimension: a desk with many autocalls at different observation dates can benefit from partial temporal diversification (different products' Greeks spikes don't necessarily coincide), but remains exposed to systemic risk if a sharp market move simultaneously affects several products near their respective observation date.",
  },
};
