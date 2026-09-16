import type { LessonContent } from "@/lib/lesson-types";

export const m09Dispersion: LessonContent = {
  conceptId: "m09-dispersion",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la corrélation implicite et le principe d'un variance swap.",
      en: "You need to know implied correlation and the variance swap principle.",
    },
    conceptIds: ["m09-correlation-implicite", "m08-variance-swap"],
  },
  glossary: [
    { term: { fr: "Trade de dispersion", en: "Dispersion trade" }, definition: { fr: "Une stratégie qui parie sur l'écart entre la volatilité d'un indice et la volatilité moyenne pondérée de ses composants, ce qui revient à parier sur la corrélation.", en: "A strategy betting on the gap between an index's volatility and the weighted average volatility of its components, which amounts to betting on correlation." } },
  ],
  intuition: {
    fr: "Si les composants d'un indice bougent tous indépendamment les uns des autres (corrélation basse), leurs mouvements individuels s'annulent partiellement au niveau de l'indice, qui reste relativement calme même si chaque action, prise isolément, est agitée. La dispersion consiste à parier explicitement sur cet écart entre volatilité individuelle et volatilité de l'indice.",
    en: "If an index's components all move independently of each other (low correlation), their individual moves partly cancel out at the index level, which stays relatively calm even though each stock, taken alone, is turbulent. Dispersion means explicitly betting on this gap between individual volatility and the index's volatility.",
  },
  definition: {
    fr: "Un trade de dispersion classique consiste à vendre de la volatilité (ou de la variance) sur l'indice et à acheter de la volatilité sur chacun de ses composants (pondérée par leur poids), ou l'inverse. Comme la variance de l'indice dépend directement de la corrélation entre composants (M09-2), ce trade est en réalité un pari sur la corrélation future : vendre l'indice/acheter les composants profite d'une corrélation réalisée plus faible que celle implicitement pricée.",
    en: "A classic dispersion trade consists of selling volatility (or variance) on the index and buying volatility on each of its components (weighted by their weight), or the reverse. Since the index's variance directly depends on the correlation between components (M09-2), this trade is really a bet on future correlation: selling the index/buying the components profits from realized correlation coming in lower than what's implicitly priced.",
  },
  utility: {
    fr: "La dispersion permet de parier sur la corrélation sans avoir à choisir de direction sur aucun actif individuel ni sur l'indice — une exposition \"pure\" à la co-mouvance du marché, distincte à la fois d'un pari directionnel et d'un simple pari de volatilité globale.",
    en: "Dispersion lets you bet on correlation without needing to pick a direction on any individual asset or the index — a \"pure\" exposure to the market's co-movement, distinct from both a directional bet and a simple overall volatility bet.",
  },
  example: {
    fr: "Un gérant vend un variance swap sur un indice actions (encaissant une prime liée à une corrélation implicite de 40%) et achète simultanément des variance swaps sur chacun des composants de l'indice, pondérés par leur poids. Si la corrélation réalisée sur la période s'avère être seulement de 25% (les actions ont bougé de façon plus indépendante que prévu), la position est profitable : l'indice a réalisé moins de variance que ce que sa composition \"aurait dû\" produire à corrélation de 40%.",
    en: "A manager sells a variance swap on an equity index (collecting a premium tied to a 40% implied correlation) and simultaneously buys variance swaps on each of the index's components, weighted by their weight. If realized correlation over the period turns out to be only 25% (stocks moved more independently than expected), the position is profitable: the index realized less variance than its composition \"should have\" produced at 40% correlation.",
  },
  alternativeExplanation: {
    fr: "Pensez à un orchestre : si chaque musicien joue une mélodie différente et indépendante (basse corrélation), le son global de l'orchestre reste relativement homogène et prévisible (indice calme), même si chaque instrument pris isolément est très expressif. Si au contraire tous les musiciens jouent exactement la même mélodie en même temps (haute corrélation), le son global devient beaucoup plus marqué et variable — c'est ce contraste entre \"le tout\" et \"la somme des parties\" que le trade de dispersion cherche à exploiter.",
    en: "Think of an orchestra: if every musician plays a different, independent melody (low correlation), the orchestra's overall sound stays relatively even and predictable (a calm index), even though each instrument taken alone is very expressive. If instead every musician plays exactly the same melody at the same time (high correlation), the overall sound becomes much more pronounced and variable — it's this contrast between \"the whole\" and \"the sum of the parts\" that the dispersion trade seeks to exploit.",
  },
  formula: {
    latex: "\\text{P\\&L}_{\\text{dispersion}} \\approx \\sum_i w_i \\times \\text{P\\&L}_{\\text{var},i} - \\text{P\\&L}_{\\text{var},\\text{indice}}",
    variables: [
      { symbol: "w_i", description: { fr: "Poids du composant i dans l'indice", en: "Component i's weight in the index" } },
      { symbol: "\\text{P\\&L}_{\\text{var},i}", description: { fr: "P&L du variance swap sur le composant i", en: "The variance swap's P&L on component i" } },
      { symbol: "\\text{P\\&L}_{\\text{var},\\text{indice}}", description: { fr: "P&L du variance swap sur l'indice", en: "The variance swap's P&L on the index" } },
    ],
    assumptions: { fr: "Position achetée sur les composants, vendue sur l'indice (le sens inverse existe aussi selon la vue de marché) ; notionnels pondérés pour que l'exposition en vega soit approximativement neutre au départ.", en: "Position long the components, short the index (the reverse also exists depending on the market view); notionals weighted so vega exposure is approximately neutral at inception." },
    units: { fr: "P&L dans la devise du portefeuille.", en: "P&L in the portfolio's currency." },
    example: { fr: "Voir l'exemple ci-dessus pour une illustration qualitative complète.", en: "See the example above for a complete qualitative illustration." },
  },
  calculation: {
    fr: "1) Déterminer les poids w_i de chaque composant dans l'indice. 2) Mettre en place un variance swap sur chaque composant, notionnel pondéré par w_i. 3) Mettre en place un variance swap de sens opposé sur l'indice. 4) À l'échéance, sommer les P&L pondérés des composants et soustraire le P&L de l'indice.",
    en: "1) Determine each component's weight w_i in the index. 2) Set up a variance swap on each component, notional weighted by w_i. 3) Set up an opposite-direction variance swap on the index. 4) At maturity, sum the components' weighted P&L and subtract the index's P&L.",
  },
  interpretation: {
    fr: "Un trade de dispersion \"acheteur de composants / vendeur d'indice\" profite d'une baisse de la corrélation réalisée par rapport à celle implicitement pricée à l'origine — une stratégie répandue précisément parce que la prime de corrélation implicite (M09-2) tend à être structurellement élevée, offrant un potentiel de gain systématique en moyenne, au prix d'un risque important lors des épisodes où la corrélation grimpe brutalement (krachs).",
    en: "A \"long components / short index\" dispersion trade profits from realized correlation falling relative to what was implicitly priced at inception — a common strategy precisely because the implied correlation premium (M09-2) tends to be structurally high, offering systematic average gain potential, at the cost of significant risk during episodes where correlation spikes (crashes).",
  },
  pitfalls: {
    fr: "Croire que la dispersion est une stratégie sans risque parce qu'elle est \"neutre en direction\" : elle reste fortement exposée au risque de corrélation, qui peut évoluer brutalement, en particulier à la hausse lors d'un choc de marché — précisément le scénario où cette stratégie (dans son sens le plus courant) perd de l'argent. Autre piège : négliger les coûts de transaction et de financement de la multitude de positions individuelles requises (une par composant), qui peuvent significativement éroder la marge théorique.",
    en: "Believing dispersion is risk-free because it's \"direction-neutral\": it remains strongly exposed to correlation risk, which can move sharply, particularly upward during a market shock — precisely the scenario where this strategy (in its most common form) loses money. Another trap: neglecting the transaction and funding costs of the many individual positions required (one per component), which can significantly erode the theoretical margin.",
  },
  keyPoints: {
    fr: [
      "Dispersion = vendre (ou acheter) la volatilité de l'indice contre la volatilité pondérée de ses composants.",
      "C'est structurellement un pari sur la corrélation future, pas sur la direction ou le niveau de volatilité globale.",
      "Vendre l'indice/acheter les composants profite d'une baisse de corrélation, mais est exposé à une hausse brutale lors des chocs.",
    ],
    en: [
      "Dispersion = sell (or buy) the index's volatility against the weighted volatility of its components.",
      "It's structurally a bet on future correlation, not on direction or overall volatility level.",
      "Selling the index/buying the components profits from falling correlation, but is exposed to a sharp rise during shocks.",
    ],
  },
  advancedDemonstration: {
    fr: "En pratique, les trades de dispersion sont souvent implémentés non pas avec des variance swaps sur chaque composant individuellement (coûteux en frais de transaction pour un grand indice), mais avec des options vanilles delta-hedgées sur un sous-ensemble représentatif des plus gros composants, combinées à un variance swap ou des options sur l'indice lui-même — un compromis entre pureté de l'exposition à la corrélation et coût d'implémentation. Le risque de \"skew de dispersion\" existe également : la corrélation implicite elle-même a une structure par strike et par échéance, tout comme la volatilité (M08-3), ce qui complique le pricing précis d'un trade de dispersion sur des strikes éloignés de la monnaie.",
    en: "In practice, dispersion trades are often implemented not with variance swaps on each individual component (costly in transaction fees for a large index), but with delta-hedged vanilla options on a representative subset of the largest components, combined with a variance swap or options on the index itself — a trade-off between exposure purity to correlation and implementation cost. A \"dispersion skew\" risk also exists: implied correlation itself has a strike and maturity structure, just like volatility (M08-3), which complicates precise pricing of a dispersion trade on strikes far from the money.",
  },
};
