import type { LessonContent } from "@/lib/lesson-types";

export const m13DrawdownUlcer: LessonContent = {
  conceptId: "m13-drawdown-ulcer",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la VaR et l'Expected Shortfall, des mesures de risque complémentaires au drawdown.",
      en: "You need to know VaR and Expected Shortfall, risk measures complementary to drawdown.",
    },
    conceptIds: ["m13-var-es-stress"],
  },
  glossary: [
    { term: { fr: "Recovery period", en: "Recovery period" }, definition: { fr: "Le temps nécessaire pour qu'une stratégie retrouve son plus haut niveau historique après une baisse (drawdown).", en: "The time needed for a strategy to recover its historical high after a decline (drawdown)." } },
  ],
  intuition: {
    fr: "La VaR (M13-risques-a) mesure un risque statistique instantané, mais un investisseur vit aussi l'expérience psychologique et pratique d'une baisse prolongée : combien son capital a-t-il chuté depuis son plus haut, et combien de temps a-t-il fallu pour s'en remettre ? Le drawdown répond directement à cette question vécue, complémentaire aux mesures statistiques.",
    en: "VaR (M13-risques-a) measures instantaneous statistical risk, but an investor also lives through the psychological and practical experience of a prolonged decline: how far has their capital fallen from its peak, and how long did it take to recover? Drawdown directly answers this lived experience, complementing statistical measures.",
  },
  definition: {
    fr: "Le drawdown à un instant t est la baisse en pourcentage depuis le plus haut historique atteint jusqu'à cet instant : DD(t) = (Plus_haut(t) − Valeur(t)) / Plus_haut(t). Le drawdown maximal (Max Drawdown, MDD) est la plus grande de ces baisses sur toute la période observée. La recovery period est le temps écoulé entre le point le plus bas d'un drawdown et le moment où la valeur retrouve son plus haut précédent. L'Ulcer Index résume la sévérité ET la durée de tous les drawdowns d'une période en une seule mesure, contrairement au MDD qui ne capture qu'un seul point extrême.",
    en: "Drawdown at time t is the percentage decline from the historical high reached up to that point: DD(t) = (High(t) − Value(t)) / High(t). Maximum Drawdown (MDD) is the largest of these declines over the entire observed period. Recovery period is the time elapsed between a drawdown's lowest point and when value recovers its previous high. The Ulcer Index summarizes both the severity AND duration of all drawdowns over a period in a single measure, unlike MDD which only captures one extreme point.",
  },
  utility: {
    fr: "Le drawdown maximal et la recovery period sont des mesures particulièrement parlantes pour un investisseur individuel, car elles répondent directement à l'expérience vécue (\"combien ai-je perdu au pire moment, et combien de temps avant de m'en remettre ?\"), souvent plus intuitive que la VaR ou l'écart-type pour évaluer sa propre tolérance au risque avant d'investir dans une stratégie.",
    en: "Maximum drawdown and recovery period are particularly telling measures for an individual investor, since they directly answer the lived experience (\"how much did I lose at the worst point, and how long before I recovered?\"), often more intuitive than VaR or standard deviation for assessing one's own risk tolerance before investing in a strategy.",
  },
  example: {
    fr: "Une stratégie passe de 100 à 60 (drawdown de 40%) avant de remonter progressivement à 105 sur les 18 mois suivants. Le drawdown maximal est de 40%, et la recovery period est de 18 mois (temps pour dépasser à nouveau le plus haut précédent de 100). Un investisseur ayant vécu cette période a subi non seulement une perte de 40% à son pire moment, mais aussi 18 mois sans aucun nouveau gain net par rapport à son investissement initial.",
    en: "A strategy goes from 100 to 60 (a 40% drawdown) before gradually climbing back to 105 over the following 18 months. Maximum drawdown is 40%, and recovery period is 18 months (time to exceed the previous high of 100 again). An investor who lived through this period suffered not only a 40% loss at its worst point, but also 18 months with no new net gain versus their initial investment.",
  },
  alternativeExplanation: {
    fr: "Le drawdown maximal, c'est comme mesurer la plus grande chute d'un randonneur en montagne par rapport au plus haut sommet déjà atteint, sans se soucier d'où il repart ensuite. La recovery period, c'est le temps qu'il lui faut pour retrouver cette même altitude. L'Ulcer Index, lui, tient compte de TOUTES les vallées traversées pendant la randonnée, pas seulement la plus profonde — une vision plus complète de l'inconfort total du parcours.",
    en: "Maximum drawdown is like measuring a mountain hiker's biggest fall relative to the highest peak already reached, without caring where they go afterward. Recovery period is the time needed to regain that same altitude. The Ulcer Index accounts for ALL the valleys crossed during the hike, not just the deepest one — a fuller picture of the journey's total discomfort.",
  },
  formula: {
    latex: "\\text{Ulcer Index} = \\sqrt{\\frac{1}{n}\\sum_{t=1}^{n} DD(t)^2}",
    variables: [
      { symbol: "DD(t)", description: { fr: "Drawdown en pourcentage à l'instant t, par rapport au plus haut historique jusqu'à t", en: "Percentage drawdown at time t, relative to the historical high up to t" } },
      { symbol: "n", description: { fr: "Nombre total de périodes observées", en: "Total number of observed periods" } },
    ],
    assumptions: { fr: "Élever chaque drawdown au carré pénalise davantage les baisses profondes et prolongées que les petites fluctuations fréquentes.", en: "Squaring each drawdown penalizes deep, prolonged declines more heavily than small, frequent fluctuations." },
    units: { fr: "Pourcentage.", en: "Percentage." },
    example: { fr: "Une stratégie avec de nombreux petits drawdowns fréquents peut avoir un Ulcer Index plus élevé qu'une stratégie avec un seul gros drawdown suivi d'une longue période stable, selon la durée cumulée passée sous l'eau.", en: "A strategy with many small, frequent drawdowns can have a higher Ulcer Index than a strategy with one large drawdown followed by a long stable period, depending on the cumulative time spent underwater." },
  },
  calculation: {
    fr: "1) Calculer la série des plus hauts historiques cumulés de la stratégie. 2) À chaque instant, calculer le drawdown en pourcentage par rapport à ce plus haut. 3) Le drawdown maximal est simplement le minimum (la plus grande baisse) de cette série. 4) La recovery period se lit comme la durée entre le point le plus bas et le retour au plus haut précédent. 5) L'Ulcer Index se calcule en prenant la racine carrée de la moyenne des drawdowns au carré sur toute la période.",
    en: "1) Compute the strategy's cumulative historical high series. 2) At each point, compute the percentage drawdown relative to that high. 3) Maximum drawdown is simply the minimum (largest decline) of this series. 4) Recovery period is read as the duration between the lowest point and the return to the previous high. 5) The Ulcer Index is computed by taking the square root of the average of squared drawdowns over the entire period.",
  },
  interpretation: {
    fr: "Un drawdown maximal élevé combiné à une recovery period longue est particulièrement dissuasif pour un investisseur individuel, même si le rendement annualisé final de la stratégie est excellent — peu d'investisseurs supportent psychologiquement de voir leur capital stagner ou baisser pendant plusieurs années. Un Ulcer Index élevé signale une stratégie \"inconfortable\" à détenir, même sans un drawdown maximal extrême, si les baisses sont fréquentes et prolongées.",
    en: "A high maximum drawdown combined with a long recovery period is particularly discouraging for an individual investor, even if the strategy's final annualized return is excellent — few investors psychologically withstand seeing their capital stagnate or decline for several years. A high Ulcer Index signals an \"uncomfortable\" strategy to hold, even without an extreme maximum drawdown, if declines are frequent and prolonged.",
  },
  pitfalls: {
    fr: "Juger une stratégie uniquement sur son rendement annualisé, sans regarder son drawdown maximal et sa recovery period — deux stratégies au même rendement final peuvent avoir des profils de risque vécu radicalement différents. Autre piège : ignorer l'Ulcer Index en se focalisant uniquement sur le drawdown maximal, qui ne capture qu'un seul point extrême et ignore la fréquence/durée cumulée des baisses.",
    en: "Judging a strategy solely on its annualized return, without looking at its maximum drawdown and recovery period — two strategies with the same final return can have radically different lived risk profiles. Another trap: ignoring the Ulcer Index by focusing only on maximum drawdown, which captures only one extreme point and ignores the cumulative frequency/duration of declines.",
  },
  keyPoints: {
    fr: [
      "Le drawdown mesure la baisse par rapport au plus haut historique ; le drawdown maximal (MDD) en est la pire valeur sur la période.",
      "La recovery period mesure le temps nécessaire pour retrouver le plus haut précédent après un drawdown.",
      "L'Ulcer Index résume la sévérité ET la durée cumulée de tous les drawdowns, pas seulement le pire.",
    ],
    en: [
      "Drawdown measures the decline relative to the historical high; maximum drawdown (MDD) is its worst value over the period.",
      "Recovery period measures the time needed to regain the previous high after a drawdown.",
      "The Ulcer Index summarizes both the severity AND cumulative duration of all drawdowns, not just the worst.",
    ],
  },
  advancedDemonstration: {
    fr: "Le drawdown maximal a une propriété statistique contre-intuitive : pour un processus aléatoire donné (même une simple marche aléatoire sans dérive), le MDD attendu croît avec la racine carrée du temps observé — ce qui signifie qu'observer une stratégie plus longtemps révèle presque mécaniquement un drawdown maximal plus important, même si le processus sous-jacent générant les rendements n'a absolument pas changé. Cette propriété doit être prise en compte lors de la comparaison de stratégies testées sur des historiques de durées différentes, sous peine de pénaliser à tort les stratégies les plus anciennes.",
    en: "Maximum drawdown has a counterintuitive statistical property: for a given random process (even a simple driftless random walk), the expected MDD grows with the square root of the observed time — meaning observing a strategy longer almost mechanically reveals a larger maximum drawdown, even if the underlying return-generating process hasn't changed at all. This property must be accounted for when comparing strategies tested over histories of different lengths, or risk wrongly penalizing older strategies.",
  },
};
