import type { LessonContent } from "@/lib/lesson-types";

export const m03TauxSansRisque: LessonContent = {
  conceptId: "m03-taux-sans-risque",
  prerequisiteReminder: {
    text: {
      fr: "Cette notion suppose que vous savez actualiser un flux et ce qu'est un rendement actuariel.",
      en: "This concept assumes you know how to discount a cash flow and what a yield to maturity is.",
    },
    conceptIds: ["m03-pricing-obligation"],
  },
  glossary: [
    { term: { fr: "Taux spot", en: "Spot rate" }, definition: { fr: "Le taux d'actualisation applicable à un flux unique reçu à une date précise, tel qu'il ressort aujourd'hui de la courbe des taux.", en: "The discount rate applicable to a single cash flow received on a specific date, as read off today's yield curve." } },
    { term: { fr: "Taux forward", en: "Forward rate" }, definition: { fr: "Le taux d'intérêt fixé aujourd'hui pour un prêt qui commencera à une date future et se terminera à une date encore plus lointaine.", en: "The interest rate fixed today for a loan that will start at a future date and end at an even later date." } },
  ],
  intuition: {
    fr: "\"Le\" taux sans risque n'existe pas vraiment : c'est un proxy qu'on choisit, et il change de forme selon qu'on regarde 3 mois ou 10 ans devant soi (la courbe des taux) — ou selon qu'on parle d'un taux \"à partir d'aujourd'hui\" ou d'un taux \"entre deux dates futures\".",
    en: "\"The\" risk-free rate does not really exist: it is a proxy you choose, and it changes shape depending on whether you look 3 months or 10 years ahead (the yield curve) — or whether you mean a rate \"starting today\" or a rate \"between two future dates\".",
  },
  definition: {
    fr: "Le taux sans risque est approximé en pratique par un taux de marché jugé quasi sans risque de défaut (dette d'État jugée très sûre, ou de plus en plus des taux au jour le jour garantis comme SOFR/€STR, remplaçant progressivement le LIBOR). Le taux spot z_T est le taux applicable à un unique flux reçu en T ; le taux forward f_{T1,T2} est le taux, fixé aujourd'hui, applicable à un prêt hypothétique entre T1 et T2, dérivé par non-arbitrage des taux spot.",
    en: "The risk-free rate is proxied in practice by a market rate judged nearly free of default risk (government debt seen as very safe, or increasingly secured overnight rates like SOFR/€STR, progressively replacing LIBOR). The spot rate z_T is the rate applicable to a single cash flow received at T; the forward rate f_{T1,T2} is the rate, fixed today, applicable to a hypothetical loan between T1 and T2, derived by no-arbitrage from spot rates.",
  },
  utility: {
    fr: "Choisir le bon proxy de taux sans risque est la première étape de tout pricing (actualisation, produits dérivés) ; distinguer spot et forward est indispensable pour construire une courbe des taux et pricer des produits qui dépendent de taux futurs (FRA, swaps — voir M04).",
    en: "Choosing the right risk-free proxy is the first step of any pricing exercise (discounting, derivatives); distinguishing spot and forward is essential to build a yield curve and price products that depend on future rates (FRAs, swaps — see M04).",
  },
  example: {
    fr: "Le taux spot à 1 an est z1 = 3%, le taux spot à 2 ans est z2 = 4%. Le taux forward implicite entre l'année 1 et l'année 2 se déduit par non-arbitrage : (1+z2)² = (1+z1) × (1+f_{1,2}), donc f_{1,2} = 1,04²/1,03 − 1 ≈ 5,02%. Ce forward est plus élevé que z2 car la courbe est croissante (les taux courts sont plus bas que les taux longs).",
    en: "The 1-year spot rate is z1 = 3%, the 2-year spot rate is z2 = 4%. The implied forward rate between year 1 and year 2 follows from no-arbitrage: (1+z2)² = (1+z1) × (1+f_{1,2}), so f_{1,2} = 1.04²/1.03 − 1 ≈ 5.02%. This forward is higher than z2 because the curve is upward-sloping (short rates are lower than long rates).",
  },
  alternativeExplanation: {
    fr: "Voyez le taux forward comme un \"relais\" : emprunter à 2 ans directement (au taux z2 composé sur 2 ans) doit revenir exactement au même que emprunter à 1 an (au taux z1), puis reconduire cet emprunt pour la 2e année à un taux fixé aujourd'hui (f_{1,2}). Si ce n'était pas le cas, on pourrait arbitrer en choisissant systématiquement le chemin le moins cher.",
    en: "Think of the forward rate as a \"relay\": borrowing for 2 years directly (at rate z2 compounded over 2 years) must cost exactly the same as borrowing for 1 year (at rate z1), then rolling that loan for the second year at a rate fixed today (f_{1,2}). If it did not, one could arbitrage by systematically picking the cheaper path.",
  },
  formula: {
    latex: "(1+z_2)^{2} = (1+z_1) \\times (1+f_{1,2})",
    variables: [
      { symbol: "z_1, z_2", description: { fr: "Taux spot à 1 an et à 2 ans", en: "1-year and 2-year spot rates" } },
      { symbol: "f_{1,2}", description: { fr: "Taux forward implicite entre l'année 1 et l'année 2", en: "Implied forward rate between year 1 and year 2" } },
    ],
    assumptions: { fr: "Absence d'arbitrage ; taux composés annuellement ; pas de prime de liquidité distincte entre les deux stratégies.", en: "No arbitrage; annually compounded rates; no distinct liquidity premium between the two strategies." },
    units: { fr: "Taux en proportion annuelle.", en: "Rates as annual proportions." },
    example: { fr: "z1=3%, z2=4% : f_{1,2} = 1,04²/1,03 − 1 ≈ 5,02%.", en: "z1=3%, z2=4%: f_{1,2} = 1.04²/1.03 − 1 ≈ 5.02%." },
  },
  calculation: {
    fr: "1) Relever les taux spot z1 et z2 sur la courbe. 2) Calculer (1+z2)² et (1+z1). 3) Diviser : (1+z2)²/(1+z1). 4) Soustraire 1 pour obtenir f_{1,2}.",
    en: "1) Read off spot rates z1 and z2 from the curve. 2) Compute (1+z2)² and (1+z1). 3) Divide: (1+z2)²/(1+z1). 4) Subtract 1 to get f_{1,2}.",
  },
  interpretation: {
    fr: "Quand la courbe des taux est croissante (cas normal), les taux forward implicites sont supérieurs aux taux spot correspondants ; quand elle est inversée (souvent signe redouté de récession), c'est l'inverse. Le taux forward n'est pas nécessairement une bonne prédiction du futur taux spot : c'est avant tout un résultat mécanique de non-arbitrage.",
    en: "When the yield curve is upward-sloping (the normal case), implied forward rates exceed the corresponding spot rates; when it is inverted (often a feared recession signal), the opposite holds. The forward rate is not necessarily a good prediction of the future spot rate: it is primarily a mechanical no-arbitrage result.",
  },
  pitfalls: {
    fr: "Utiliser le même taux (souvent le taux \"sans risque\" le plus long ou le plus connu) pour actualiser tous les flux, quelle que soit leur date : chaque flux devrait être actualisé à son propre taux spot. Autre piège : croire que le taux forward est une prévision du marché — voir la même confusion pour les prix forward de matières premières (M02-7).",
    en: "Using the same rate (often the longest or best-known \"risk-free\" rate) to discount every cash flow regardless of its date: each flow should be discounted at its own spot rate. Another trap: believing the forward rate is a market forecast — see the same confusion for commodity forward prices (M02-7).",
  },
  keyPoints: {
    fr: [
      "Le taux sans risque est un proxy choisi (dette d'État très sûre, ou taux garanti au jour le jour type SOFR/€STR).",
      "Taux spot = taux pour un flux unique aujourd'hui-à-T ; taux forward = taux fixé aujourd'hui pour une période future.",
      "(1+z2)² = (1+z1)(1+f_{1,2}) : le forward se déduit des spot par non-arbitrage, ce n'est pas une prévision.",
    ],
    en: [
      "The risk-free rate is a chosen proxy (very safe government debt, or a secured overnight rate like SOFR/€STR).",
      "Spot rate = rate for a single today-to-T flow; forward rate = rate fixed today for a future period.",
      "(1+z2)² = (1+z1)(1+f_{1,2}): the forward follows from spots by no-arbitrage, it is not a forecast.",
    ],
  },
  advancedDemonstration: {
    fr: "La transition du LIBOR (taux déclaratif, basé sur des estimations de banques, entaché de scandales de manipulation) vers des taux garantis au jour le jour (RFR : SOFR aux USA, €STR en zone euro, SONIA au UK) reflète une volonté de fonder le taux sans risque sur des transactions réelles plutôt que des déclarations. Ces RFR sont \"overnight\" par nature, ce qui complique la construction de taux à terme composés (\"term rates\") ou de conventions de capitalisation \"in arrears\" (composée sur la période échue, connue seulement à la fin) — un changement de convention qui a nécessité une refonte massive des systèmes de pricing de produits de taux dans les années suivant 2021.",
    en: "The transition from LIBOR (a declarative rate, based on banks' estimates, tainted by manipulation scandals) to secured overnight rates (RFRs: SOFR in the US, €STR in the euro area, SONIA in the UK) reflects a push to base the risk-free rate on real transactions rather than declarations. These RFRs are \"overnight\" by nature, which complicates building compounded forward-looking \"term rates\" or \"in arrears\" compounding conventions (compounded over the elapsed period, known only at the end) — a convention shift that required a massive overhaul of interest-rate product pricing systems in the years following 2021.",
  },
};
