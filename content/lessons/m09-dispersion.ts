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
    fr: "Indice à 2 composants, w1=60% (σ1=25%), w2=40% (σ2=22%), corrélation implicite ρ=40% : Var_indice=w1²σ1²+w2²σ2²+2w1w2σ1σ2ρ=0,0225+0,007744+0,0264×0,4=0,040804, soit σ_indice implicite≈20,2%. Un gérant vend un variance swap sur l'indice et achète les composants (pondérés). Sur la période, les composants réalisent EXACTEMENT leur volatilité implicite (25% et 22%, P&L nul sur cette jambe), mais la corrélation réalisée n'est que de 25% : Var_indice réalisée=0,0225+0,007744+0,0264×0,25=0,036844, soit σ_indice réalisée≈19,2%. L'indice a réalisé moins de variance (368 points) que l'implicite (408 points) : le variance swap vendu sur l'indice gagne 40 points de variance, entièrement expliqués par la baisse de corrélation, puisque les composants n'ont apporté aucun P&L de leur côté.",
    en: "A 2-component index, w1=60% (σ1=25%), w2=40% (σ2=22%), implied correlation ρ=40%: Var_index=w1²σ1²+w2²σ2²+2w1w2σ1σ2ρ=0.0225+0.007744+0.0264×0.4=0.040804, i.e. implied σ_index≈20.2%. A manager sells a variance swap on the index and buys the components (weighted). Over the period, the components realize EXACTLY their implied volatility (25% and 22%, zero P&L on that leg), but realized correlation is only 25%: realized Var_index=0.0225+0.007744+0.0264×0.25=0.036844, i.e. realized σ_index≈19.2%. The index realized less variance (368 points) than implied (408 points): the sold index variance swap gains 40 variance points, entirely explained by the correlation drop, since the components contributed no P&L of their own.",
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
    example: { fr: "Var_indice implicite=0,040804 (408 points), Var_indice réalisée=0,036844 (368 points) → P&L du variance swap vendu sur l'indice=+40 points de variance, contre 0 sur la jambe composants (réalisé=implicite pour chacun).", en: "Implied Var_index=0.040804 (408 points), realized Var_index=0.036844 (368 points) → the sold index variance swap's P&L=+40 variance points, versus 0 on the components leg (realized=implied for each)." },
  },
  chart: {
    kind: "bar",
    yLabel: { fr: "Volatilité (%)", en: "Volatility (%)" },
    bars: [
      { label: { fr: "Indice, implicite", en: "Index, implied" }, value: 20.2 },
      { label: { fr: "Indice, réalisée", en: "Index, realized" }, value: 19.2 },
      { label: { fr: "Composants, implicite", en: "Components, implied" }, value: 23.8 },
      { label: { fr: "Composants, réalisée", en: "Components, realized" }, value: 23.8 },
    ],
  },
  calculation: {
    fr: "1) Déterminer les poids w_i de chaque composant dans l'indice : ici 60% et 40%. 2) Mettre en place un variance swap sur chaque composant, notionnel pondéré par w_i. 3) Mettre en place un variance swap de sens opposé sur l'indice. 4) À l'échéance, sommer les P&L pondérés des composants (0 dans notre exemple, réalisé=implicite) et soustraire le P&L de l'indice (−40 points pour une position longue index, donc +40 points pour la position vendeuse ici mise en place) : le P&L total de +40 points provient intégralement de la baisse de corrélation de 40% à 25%, aucun composant n'ayant individuellement surpris.",
    en: "1) Determine each component's weight w_i in the index: 60% and 40% here. 2) Set up a variance swap on each component, notional weighted by w_i. 3) Set up an opposite-direction variance swap on the index. 4) At maturity, sum the components' weighted P&L (0 in our example, realized=implied) and subtract the index's P&L (−40 points for a long index position, so +40 points for the short position set up here): the total +40-point P&L comes entirely from the correlation drop from 40% to 25%, with no individual component surprise.",
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
  businessApplication: {
    fr: "Un desk de trading de volatilité met en place un trade de dispersion précisément quand il juge la corrélation implicite pricée par le marché des options d'indice structurellement trop élevée par rapport à ce qu'il anticipe de réalisé — une vue exprimée nulle part ailleurs aussi \"purement\", puisqu'elle ne nécessite aucun pari sur le niveau ou la direction d'aucun actif individuel.",
    en: "A volatility trading desk puts on a dispersion trade precisely when it judges the correlation implicitly priced by the index options market to be structurally too high relative to what it expects to realize — a view expressed nowhere else this \"purely\", since it requires no bet on any individual asset's level or direction.",
  },
  interviewQuestion: {
    question: "You put on a dispersion trade: short index variance, long the weighted components' variance. At expiry, each component realized exactly its implied volatility, yet you still made money. How is that possible?",
    answer: "Because the trade's P&L isn't really about the components' own volatility — it's about correlation. The index's variance depends on both the components' variances AND the correlation between them: even with each component landing exactly on its implied volatility, if realized correlation comes in below what was implied at inception, the index itself realizes less variance than the market had priced. Since I'm short index variance, that gap is pure profit on that leg, while the components leg nets to zero because they matched their implied levels exactly. This is exactly the point of a dispersion trade: it isolates a pure bet on correlation, cleanly separated from any view on individual volatility levels.",
  },
  advancedDemonstration: {
    fr: "En pratique, les trades de dispersion sont souvent implémentés non pas avec des variance swaps sur chaque composant individuellement (coûteux en frais de transaction pour un grand indice), mais avec des options vanilles delta-hedgées sur un sous-ensemble représentatif des plus gros composants, combinées à un variance swap ou des options sur l'indice lui-même — un compromis entre pureté de l'exposition à la corrélation et coût d'implémentation. Le risque de \"skew de dispersion\" existe également : la corrélation implicite elle-même a une structure par strike et par échéance, tout comme la volatilité (M08-3), ce qui complique le pricing précis d'un trade de dispersion sur des strikes éloignés de la monnaie.",
    en: "In practice, dispersion trades are often implemented not with variance swaps on each individual component (costly in transaction fees for a large index), but with delta-hedged vanilla options on a representative subset of the largest components, combined with a variance swap or options on the index itself — a trade-off between exposure purity to correlation and implementation cost. A \"dispersion skew\" risk also exists: implied correlation itself has a strike and maturity structure, just like volatility (M08-3), which complicates precise pricing of a dispersion trade on strikes far from the money.",
  },
};
