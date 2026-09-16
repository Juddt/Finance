import type { LessonContent } from "@/lib/lesson-types";

export const m13MarketMakingMomentum: LessonContent = {
  conceptId: "m13-market-making-momentum",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les types d'ordres et le principe du levier.",
      en: "You need to know order types and the leverage principle.",
    },
    conceptIds: ["m13-ordres-levier-marge"],
  },
  glossary: [
    { term: { fr: "Spread bid-ask", en: "Bid-ask spread" }, definition: { fr: "L'écart entre le meilleur prix d'achat (bid) et le meilleur prix de vente (ask) affiché sur un marché, source de revenu principale du market maker.", en: "The gap between the best buy price (bid) and best sell price (ask) displayed on a market, the market maker's main revenue source." } },
    { term: { fr: "Retour à la moyenne (mean reversion)", en: "Mean reversion" }, definition: { fr: "L'hypothèse qu'un prix qui s'écarte significativement de sa valeur \"normale\" a tendance à y revenir, à l'opposé du momentum.", en: "The hypothesis that a price deviating significantly from its \"normal\" value tends to return to it, the opposite of momentum." } },
  ],
  intuition: {
    fr: "Les stratégies de trading se distinguent fondamentalement par l'hypothèse qu'elles font sur le comportement des prix : le market making parie sur la stabilité et la liquidité à très court terme, l'arbitrage exploite une incohérence de prix garantie sans risque directionnel, le momentum parie que \"ce qui monte continue de monter\", et le mean reversion parie exactement l'inverse — ces quatre logiques peuvent coexister sur le même marché, chacune exploitant un pattern différent.",
    en: "Trading strategies fundamentally differ in the assumption they make about price behavior: market making bets on very short-term stability and liquidity, arbitrage exploits a guaranteed price inconsistency with no directional risk, momentum bets that \"what's rising keeps rising\", and mean reversion bets the exact opposite — these four logics can coexist in the same market, each exploiting a different pattern.",
  },
  definition: {
    fr: "Un market maker cote en permanence un prix d'achat (bid) et un prix de vente (ask), captant le spread bid-ask comme rémunération du service de liquidité fourni, tout en gérant activement le risque d'inventaire (le risque de se retrouver avec une position déséquilibrée après une série d'ordres dans le même sens). L'arbitrage exploite une différence de prix entre deux marchés ou instruments économiquement équivalents (par exemple, la parité call-put, M05-3), générant un profit sans risque directionnel si l'écart se referme. Une stratégie momentum achète les actifs qui ont récemment surperformé, pariant sur la persistance de la tendance ; une stratégie mean reversion fait l'inverse, pariant sur un retour vers une moyenne historique après un écart jugé excessif.",
    en: "A market maker continuously quotes a buy price (bid) and a sell price (ask), capturing the bid-ask spread as compensation for the liquidity service provided, while actively managing inventory risk (the risk of ending up with an unbalanced position after a series of same-direction orders). Arbitrage exploits a price difference between two economically equivalent markets or instruments (e.g., put-call parity, M05-3), generating a risk-free profit if the gap closes. A momentum strategy buys assets that recently outperformed, betting on trend persistence; a mean reversion strategy does the opposite, betting on a return to a historical average after a deviation deemed excessive.",
  },
  utility: {
    fr: "Comprendre ces quatre logiques permet d'identifier la nature réelle du risque pris par une stratégie donnée : un market maker prend un risque d'inventaire à très court terme, un arbitragiste prend surtout un risque d'exécution (l'écart pourrait se refermer avant qu'il ait pu boucler ses deux jambes), tandis que momentum et mean reversion prennent un vrai risque directionnel, chacun pariant sur un comportement de marché opposé.",
    en: "Understanding these four logics lets you identify the real nature of the risk taken by a given strategy: a market maker takes very short-term inventory risk, an arbitrageur mainly takes execution risk (the gap could close before both legs are completed), while momentum and mean reversion take real directional risk, each betting on an opposite market behavior.",
  },
  example: {
    fr: "Un market maker sur une action cote un bid à 99,95 et un ask à 100,05 (spread de 0,10). S'il achète 1000 actions à 99,95 puis les revend à 100,05 dans la minute, il capte 100 € de profit sans avoir pris de vue directionnelle sur l'action — mais s'il accumule un déséquilibre d'inventaire (beaucoup plus d'achats que de ventes) sur une action qui chute ensuite, il subit une perte de marché malgré sa stratégie théoriquement neutre.",
    en: "A market maker on a stock quotes a bid at 99.95 and an ask at 100.05 (a 0.10 spread). If they buy 1,000 shares at 99.95 then resell them at 100.05 within a minute, they capture €100 profit without taking any directional view on the stock — but if they accumulate an inventory imbalance (far more buys than sells) on a stock that then falls, they suffer a market loss despite their theoretically neutral strategy.",
  },
  alternativeExplanation: {
    fr: "Le market maker est comme un bureau de change qui gagne sur l'écart entre son prix d'achat et de vente de devises, sans parier sur la direction du taux de change. L'arbitragiste est comme quelqu'un qui repère qu'un même article coûte moins cher dans un magasin que dans un autre et profite de la différence en achetant-revendant. Le trader momentum suit la foule qui se précipite vers une sortie de concert, pariant qu'elle continue dans la même direction ; le trader mean reversion, lui, parie que la foule finira par se disperser et revenir à un état plus calme.",
    en: "The market maker is like a currency exchange booth earning from the gap between its buy and sell rates, without betting on the exchange rate's direction. The arbitrageur is like someone noticing the same item costs less in one shop than another and profits from the difference by buying-and-reselling. The momentum trader follows the crowd rushing toward a concert exit, betting it keeps moving the same direction; the mean reversion trader bets the crowd will eventually disperse and return to a calmer state.",
  },
  formula: {
    latex: "\\text{Profit}_{\\text{market making}} \\approx N \\times (\\text{Ask} - \\text{Bid}) - \\text{Coût}_{\\text{inventaire}}",
    variables: [
      { symbol: "N", description: { fr: "Nombre de cycles achat-vente complétés (round trips)", en: "Number of completed buy-sell cycles (round trips)" } },
      { symbol: "\\text{Coût}_{\\text{inventaire}}", description: { fr: "Perte liée à un déséquilibre d'inventaire non couvert, si le prix évolue défavorablement pendant que le market maker détient une position nette", en: "Loss tied to an uncovered inventory imbalance, if the price moves unfavorably while the market maker holds a net position" } },
    ],
    assumptions: { fr: "Modèle simplifié ; en pratique, la gestion du risque d'inventaire (ajustement dynamique des cotations bid/ask) est le principal défi opérationnel du market making.", en: "Simplified model; in practice, managing inventory risk (dynamically adjusting bid/ask quotes) is market making's main operational challenge." },
    units: { fr: "Profit dans la devise de cotation.", en: "Profit in the quoting currency." },
    example: { fr: "Spread de 0,10 sur 1000 cycles complétés = 100 unités de profit brut, avant déduction du coût d'inventaire éventuel.", en: "A 0.10 spread over 1,000 completed cycles = 100 units of gross profit, before deducting any inventory cost." },
  },
  calculation: {
    fr: "1) Pour le market making, calculer le spread capté sur chaque cycle complété et surveiller le déséquilibre d'inventaire net. 2) Pour l'arbitrage, identifier deux instruments économiquement équivalents et calculer l'écart de prix net des coûts de transaction, en s'assurant que les deux jambes peuvent être exécutées simultanément. 3) Pour momentum/mean reversion, définir une fenêtre d'observation et un seuil de déclenchement (par exemple, un rendement récent au-delà d'un certain percentile), puis backtester rigoureusement (M13-trading-c) avant tout déploiement réel.",
    en: "1) For market making, compute the spread captured on each completed cycle and monitor net inventory imbalance. 2) For arbitrage, identify two economically equivalent instruments and compute the price gap net of transaction costs, ensuring both legs can be executed simultaneously. 3) For momentum/mean reversion, define an observation window and a trigger threshold (e.g., a recent return beyond a certain percentile), then rigorously backtest (M13-trading-c) before any real deployment.",
  },
  interpretation: {
    fr: "Momentum et mean reversion sont des hypothèses fondamentalement contradictoires sur le même marché : leur coexistence s'explique par le fait qu'elles opèrent souvent sur des horizons temporels différents (momentum plus efficace à court/moyen terme, mean reversion plus pertinent sur certains horizons de très court terme intraday ou de très long terme) et sur des types d'actifs différents. Un market maker rentable n'a généralement AUCUNE vue directionnelle : sa rentabilité vient de la régularité du spread capté, pas d'un pari sur le marché.",
    en: "Momentum and mean reversion are fundamentally contradictory hypotheses about the same market: their coexistence is explained by the fact they often operate over different time horizons (momentum more effective short/medium-term, mean reversion more relevant over certain very short intraday or very long-term horizons) and on different asset types. A profitable market maker generally has NO directional view: their profitability comes from the regularity of the captured spread, not a market bet.",
  },
  pitfalls: {
    fr: "Confondre l'arbitrage \"pur\" (théoriquement sans risque, mais rare en pratique à cause des coûts de transaction et du risque d'exécution) avec des stratégies simplement qualifiées d'\"arbitrage\" par abus de langage mais qui portent en réalité un vrai risque directionnel résiduel. Autre piège : appliquer une stratégie momentum ou mean reversion sans tester sa robustesse sur différentes périodes de marché (haussier, baissier, latéral), un pattern qui fonctionne dans un régime peut totalement échouer dans un autre.",
    en: "Confusing \"pure\" arbitrage (theoretically risk-free, but rare in practice due to transaction costs and execution risk) with strategies loosely labeled \"arbitrage\" but actually carrying real residual directional risk. Another trap: applying a momentum or mean reversion strategy without testing its robustness across different market regimes (bullish, bearish, sideways) — a pattern that works in one regime can totally fail in another.",
  },
  keyPoints: {
    fr: [
      "Le market making capte le spread bid-ask en gérant activement le risque d'inventaire, sans vue directionnelle.",
      "L'arbitrage exploite une incohérence de prix entre instruments équivalents, en principe sans risque directionnel.",
      "Momentum et mean reversion parient sur des comportements de prix opposés, souvent sur des horizons temporels différents.",
    ],
    en: [
      "Market making captures the bid-ask spread by actively managing inventory risk, with no directional view.",
      "Arbitrage exploits a price inconsistency between equivalent instruments, in principle with no directional risk.",
      "Momentum and mean reversion bet on opposite price behaviors, often over different time horizons.",
    ],
  },
  advancedDemonstration: {
    fr: "Le risque d'inventaire d'un market maker se modélise formellement (modèle d'Avellaneda-Stoikov et dérivés) comme un compromis entre capter le spread le plus large possible (plus de profit par transaction, mais moins de volume exécuté) et ajuster asymétriquement les cotations bid/ask en fonction du déséquilibre d'inventaire actuel (coter un bid plus bas si l'inventaire est déjà trop long, pour encourager les ventes et rééquilibrer la position) — un problème d'optimisation dynamique sous incertitude qui a des points communs profonds avec la gestion delta d'un livre d'options (M07-4), les deux consistant à gérer activement une exposition résiduelle dans le temps plutôt qu'à la couvrir une fois pour toutes.",
    en: "A market maker's inventory risk is formally modeled (Avellaneda-Stoikov model and derivatives) as a trade-off between capturing as wide a spread as possible (more profit per transaction, but less executed volume) and asymmetrically adjusting bid/ask quotes based on current inventory imbalance (quoting a lower bid if inventory is already too long, to encourage sales and rebalance the position) — a dynamic optimization problem under uncertainty with deep parallels to delta-hedging an options book (M07-4), both involving actively managing a residual exposure over time rather than hedging it once and for all.",
  },
};
