import type { LessonContent } from "@/lib/lesson-types";

export const m01PariteTaux: LessonContent = {
  conceptId: "m01-parite-taux",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir lire une cotation de change et connaître le principe de non-arbitrage.",
      en: "You need to know how to read an FX quote and understand the no-arbitrage principle.",
    },
    conceptIds: ["m01-taux-change", "m01-arbitrage"],
  },
  glossary: [
    { term: { fr: "Parité couverte (CIP)", en: "Covered interest rate parity (CIP)" }, definition: { fr: "Une relation de non-arbitrage entre taux spot, taux forward et taux d'intérêt des deux devises — vraie par construction, sans hypothèse sur le futur.", en: "A no-arbitrage relationship between spot rate, forward rate and both currencies' interest rates — true by construction, with no assumption about the future." } },
    { term: { fr: "Parité non couverte (UIP)", en: "Uncovered interest rate parity (UIP)" }, definition: { fr: "Une relation fondée sur l'anticipation que le taux spot futur égalera en moyenne le taux forward actuel — une hypothèse comportementale, pas un résultat d'arbitrage.", en: "A relationship based on the expectation that the future spot rate will on average equal the current forward rate — a behavioral assumption, not an arbitrage result." } },
  ],
  intuition: {
    fr: "Deux façons de placer de l'argent pendant un an doivent rapporter pareil une fois converties dans la même devise, sinon tout le monde choisirait systématiquement la meilleure : c'est ce lien qui fixe mécaniquement le taux de change forward à partir des taux d'intérêt des deux pays.",
    en: "Two ways of investing money for a year must yield the same once converted into the same currency, or everyone would systematically pick the better one: this link mechanically pins down the forward exchange rate from the two countries' interest rates.",
  },
  definition: {
    fr: "La parité couverte des taux d'intérêt (CIP) énonce que F0/S0 = (1+r_dom)/(1+r_étr), une relation de non-arbitrage exacte et toujours vraie (sous hypothèses de marché parfait), car un investisseur peut se couvrir intégralement avec un forward. La parité non couverte (UIP) postule que le taux spot futur attendu E[S_T] égale F0 — une hypothèse d'anticipation rationnelle, empiriquement bien plus fragile, car elle n'est protégée par aucun mécanisme d'arbitrage (l'investisseur reste exposé au risque de change).",
    en: "Covered interest rate parity (CIP) states that F0/S0 = (1+r_dom)/(1+r_for), an exact no-arbitrage relationship that always holds (under perfect-market assumptions), since an investor can fully hedge with a forward. Uncovered interest rate parity (UIP) posits that the expected future spot rate E[S_T] equals F0 — a rational-expectations assumption, empirically much weaker, since it is protected by no arbitrage mechanism (the investor remains exposed to FX risk).",
  },
  utility: {
    fr: "La CIP est ce qui permet à une banque de coter un prix forward de change de façon purement mécanique (voir M02-5, où ce résultat était déjà utilisé) ; l'UIP, elle, sert de base théorique (contestée empiriquement) à des modèles de prévision de change, avec des résultats souvent décevants dans la réalité (le fameux \"forward premium puzzle\").",
    en: "CIP is what lets a bank quote a forward FX price in a purely mechanical way (see M02-5, where this result was already used); UIP serves as the (empirically contested) theoretical basis for FX forecasting models, with often disappointing real-world results (the famous \"forward premium puzzle\").",
  },
  example: {
    fr: "S0 (EUR/USD) = 1,10, r_EUR = 2%, r_USD = 5%, T = 1 an. Par la CIP : F0 = 1,10 × (1,05/1,02) ≈ 1,132. Ce prix forward est mécaniquement imposé, quelle que soit l'opinion du marché sur la direction future de l'EUR/USD.",
    en: "S0 (EUR/USD) = 1.10, r_EUR = 2%, r_USD = 5%, T = 1 year. By CIP: F0 = 1.10 × (1.05/1.02) ≈ 1.132. This forward price is mechanically enforced, whatever the market's opinion on EUR/USD's future direction.",
  },
  alternativeExplanation: {
    fr: "La CIP est une promesse tenue à coup sûr : si vous placez de l'argent dans la devise au taux le plus élevé tout en vous couvrant intégralement au forward contre le risque de change, vous ne pouvez PAS gagner plus qu'en plaçant directement dans l'autre devise — le forward corrige exactement l'écart de taux. L'UIP, elle, est un pari : elle suppose que si vous NE vous couvrez PAS, le taux de change évoluera en moyenne pour effacer ce même écart — un pari qui, empiriquement, ne se vérifie pas systématiquement.",
    en: "CIP is a promise kept for certain: if you invest in the higher-rate currency while fully hedging the FX risk with a forward, you CANNOT earn more than by investing directly in the other currency — the forward exactly offsets the rate gap. UIP, on the other hand, is a bet: it assumes that if you do NOT hedge, the exchange rate will on average move to erase that same gap — a bet that, empirically, does not systematically hold.",
  },
  formula: {
    latex: "\\frac{F_0}{S_0} = \\frac{1+r_{\\text{dom}}}{1+r_{\\text{étr}}}",
    variables: [
      { symbol: "S_0, F_0", description: { fr: "Taux de change spot et forward (devise étrangère par unité domestique, ou l'inverse selon convention cohérente)", en: "Spot and forward exchange rates (foreign currency per domestic unit, or the reverse, under a consistent convention)" } },
      { symbol: "r_{\\text{dom}}, r_{\\text{étr}}", description: { fr: "Taux sans risque domestique et étranger pour la même échéance", en: "Domestic and foreign risk-free rates for the same maturity" } },
    ],
    assumptions: { fr: "Marché parfait (pas de coûts de transaction ni de risque de contrepartie) ; taux composés sur une seule période T.", en: "Perfect market (no transaction costs or counterparty risk); rates compounded over a single period T." },
    units: { fr: "S0, F0 dans la même unité ; taux en proportion annuelle.", en: "S0, F0 in the same unit; rates as annual proportions." },
    example: { fr: "S0=1,10, r_dom=2%, r_étr=5% : F0 = 1,10×(1,05/1,02) ≈ 1,132.", en: "S0=1.10, r_dom=2%, r_for=5%: F0 = 1.10×(1.05/1.02) ≈ 1.132." },
  },
  calculation: {
    fr: "1) Relever le taux spot S0 et les deux taux sans risque r_dom et r_étr pour la même échéance. 2) Calculer le rapport (1+r_dom)/(1+r_étr). 3) Multiplier S0 par ce rapport pour obtenir F0. 4) Vérifier la cohérence : la devise au taux le plus élevé doit coter en \"décote\" à terme (F0/S0 < 1 vue de cette devise), pour compenser exactement son avantage de taux.",
    en: "1) Read off spot rate S0 and both risk-free rates r_dom and r_for for the same maturity. 2) Compute the ratio (1+r_dom)/(1+r_for). 3) Multiply S0 by that ratio to get F0. 4) Sanity-check: the higher-rate currency must trade forward at a \"discount\" (F0/S0 < 1 from that currency's view), to exactly offset its rate advantage.",
  },
  interpretation: {
    fr: "La CIP garantit qu'il n'existe aucun \"repas gratuit\" en combinant placement à taux d'intérêt et couverture de change : le gain de taux plus élevé est toujours exactement annulé par la perte de change anticipée dans le prix forward. C'est un résultat de pure mécanique, vérifié empiriquement de façon quasi systématique sur les devises liquides.",
    en: "CIP guarantees there is no \"free lunch\" from combining a higher-rate investment with FX hedging: the higher-rate gain is always exactly offset by the anticipated FX loss priced into the forward. This is a pure mechanical result, empirically verified almost systematically on liquid currencies.",
  },
  pitfalls: {
    fr: "Confondre CIP et UIP : la première est une identité d'arbitrage quasi toujours vérifiée, la seconde une hypothèse comportementale souvent invalidée empiriquement (le \"carry trade\", qui consiste à emprunter dans la devise à taux bas pour placer dans celle à taux élevé SANS se couvrir, n'existerait pas si l'UIP se vérifiait parfaitement). Autre piège : oublier que cette formule est celle déjà utilisée en \"démonstration avancée\" de M02-5, sous une forme en taux simples.",
    en: "Confusing CIP and UIP: the first is an arbitrage identity almost always verified, the second a behavioral assumption often empirically invalidated (the \"carry trade\", which involves borrowing in the low-rate currency to invest in the high-rate one WITHOUT hedging, would not exist if UIP held perfectly). Another trap: forgetting this is the same formula already used in M02-5's advanced demonstration, in a simple-rate form.",
  },
  keyPoints: {
    fr: [
      "CIP : F0/S0 = (1+r_dom)/(1+r_étr), une identité d'arbitrage vraie par construction.",
      "UIP : hypothèse que E[S_T] = F0, non protégée par un arbitrage, empiriquement fragile.",
      "Le carry trade non couvert n'a de sens que si l'on doute (à raison, empiriquement) de l'UIP.",
    ],
    en: [
      "CIP: F0/S0 = (1+r_dom)/(1+r_for), an arbitrage identity true by construction.",
      "UIP: the assumption that E[S_T] = F0, not protected by arbitrage, empirically fragile.",
      "The unhedged carry trade only makes sense if one doubts (rightly, empirically) UIP.",
    ],
  },
  advancedDemonstration: {
    fr: "Le \"forward premium puzzle\" (Fama, 1984) est l'un des résultats empiriques les plus robustes et les plus déroutants de la finance internationale : statistiquement, les devises à taux d'intérêt élevé ont tendance à s'apprécier légèrement en moyenne, plutôt que de se déprécier comme le prédirait l'UIP — l'inverse de ce qu'on attendrait. Ce résultat justifie économiquement l'existence persistante du carry trade (emprunter à taux bas, placer à taux élevé sans couverture), une stratégie profitable en moyenne sur longue période mais sujette à des pertes brutales et importantes lors de dénouements soudains (\"crash risk\"), ce qui est interprété comme la rémunération d'un risque plutôt qu'une anomalie de marché pure.",
    en: "The \"forward premium puzzle\" (Fama, 1984) is one of the most robust and puzzling empirical results in international finance: statistically, high-interest-rate currencies tend to appreciate slightly on average, rather than depreciate as UIP would predict — the opposite of what one would expect. This result economically justifies the persistent existence of the carry trade (borrowing at a low rate, investing at a high rate unhedged), a strategy profitable on average over the long run but subject to sharp, large losses during sudden unwinds (\"crash risk\"), which is interpreted as compensation for risk rather than a pure market anomaly.",
  },
};
