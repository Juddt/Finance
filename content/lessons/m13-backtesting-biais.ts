import type { LessonContent } from "@/lib/lesson-types";

export const m13BacktestingBiais: LessonContent = {
  conceptId: "m13-backtesting-biais",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la méthodologie de validation walk-forward et le data snooping, déjà vus pour le machine learning.",
      en: "You need to know walk-forward validation methodology and data snooping, already seen for machine learning.",
    },
    conceptIds: ["m12-methodologie-ml"],
  },
  glossary: [
    { term: { fr: "Biais comportemental", en: "Behavioral bias" }, definition: { fr: "Une déviation systématique et prévisible par rapport à une décision rationnelle, causée par des mécanismes psychologiques plutôt qu'une erreur de calcul.", en: "A systematic, predictable deviation from a rational decision, caused by psychological mechanisms rather than a calculation error." } },
    { term: { fr: "Aversion à la perte", en: "Loss aversion" }, definition: { fr: "La tendance à ressentir la douleur d'une perte plus intensément que le plaisir d'un gain équivalent, ce qui pousse souvent à conserver des positions perdantes trop longtemps.", en: "The tendency to feel a loss's pain more intensely than an equivalent gain's pleasure, often leading to holding losing positions too long." } },
  ],
  intuition: {
    fr: "Un backtest (simulation d'une stratégie sur des données historiques) souffre des mêmes pièges méthodologiques que tout modèle de machine learning appliqué à la finance (M12-cross) — mais un trader individuel fait face à un défi supplémentaire, purement psychologique : même une stratégie rigoureusement backtestée peut échouer en pratique si des biais comportementaux (peur, avidité, excès de confiance) faussent son exécution réelle.",
    en: "A backtest (simulating a strategy on historical data) suffers from the same methodological traps as any machine learning model applied to finance (M12-cross) — but an individual trader faces an additional, purely psychological challenge: even a rigorously backtested strategy can fail in practice if behavioral biases (fear, greed, overconfidence) distort its real execution.",
  },
  definition: {
    fr: "Un backtesting rigoureux applique les mêmes principes déjà vus pour le machine learning (M12-cross) : validation chronologique stricte, comparaison à un benchmark naïf, intégration réaliste des coûts de transaction et du slippage, et vigilance face au biais de survivance et au data snooping. Les biais comportementaux les plus courants incluent l'aversion à la perte (conserver une position perdante trop longtemps en espérant un retournement), le biais de confirmation (chercher uniquement des informations confirmant une position déjà prise), l'excès de confiance après une série de gains, et le biais de récence (surpondérer les événements récents dans les décisions futures).",
    en: "Rigorous backtesting applies the same principles already seen for machine learning (M12-cross): strict chronological validation, comparison to a naive benchmark, realistic integration of transaction costs and slippage, and vigilance against survivorship bias and data snooping. The most common behavioral biases include loss aversion (holding a losing position too long hoping for a reversal), confirmation bias (seeking only information confirming an already-taken position), overconfidence after a winning streak, and recency bias (overweighting recent events in future decisions).",
  },
  utility: {
    fr: "Un backtesting rigoureux est la seule façon objective d'évaluer une stratégie avant de risquer du capital réel, mais il ne protège pas contre l'exécution défaillante causée par des biais psychologiques — les deux dimensions (méthodologique et comportementale) doivent être maîtrisées conjointement pour qu'une stratégie backtestée avec succès se traduise en performance réelle.",
    en: "Rigorous backtesting is the only objective way to evaluate a strategy before risking real capital, but it doesn't protect against faulty execution caused by psychological biases — both dimensions (methodological and behavioral) must be jointly mastered for a successfully backtested strategy to translate into real performance.",
  },
  example: {
    fr: "Une stratégie backtestée rigoureusement affiche un Sharpe de 1,5 sur 10 ans de données historiques. En trading réel, le trader dévie systématiquement des règles du backtest : il conserve certaines positions perdantes au-delà du stop-loss prévu (aversion à la perte), et prend des positions plus grandes que prévu après une série de gains (excès de confiance) — le résultat réel diverge significativement du backtest, non pas à cause d'un défaut de la stratégie elle-même, mais de son exécution humaine imparfaite.",
    en: "A rigorously backtested strategy shows a 1.5 Sharpe over 10 years of historical data. In real trading, the trader systematically deviates from the backtest's rules: they hold certain losing positions beyond the planned stop-loss (loss aversion), and take larger-than-planned positions after a winning streak (overconfidence) — the real result diverges significantly from the backtest, not because of a flaw in the strategy itself, but its imperfect human execution.",
  },
  alternativeExplanation: {
    fr: "Un backtest bien conçu, c'est comme un plan de vol détaillé et testé en simulateur ; mais un pilote qui dévie de ce plan à cause de la panique ou d'un excès de confiance en plein vol peut causer un accident, même si le plan lui-même était parfaitement solide. La discipline d'exécution est aussi importante que la qualité du plan initial.",
    en: "A well-designed backtest is like a detailed flight plan tested in a simulator; but a pilot who deviates from that plan due to panic or overconfidence mid-flight can cause an accident, even if the plan itself was perfectly sound. Execution discipline is as important as the initial plan's quality.",
  },
  formula: {
    latex: "\\text{Performance réelle} = \\text{Performance}_{\\text{backtest}} - \\text{Coûts non modélisés} - \\text{Écart d'exécution comportemental}",
    variables: [
      { symbol: "\\text{Coûts non modélisés}", description: { fr: "Slippage, commissions, impact de marché souvent sous-estimés dans un backtest simplifié", en: "Slippage, commissions, market impact often understated in a simplified backtest" } },
      { symbol: "\\text{Écart d'exécution comportemental}", description: { fr: "La perte de performance due à des déviations humaines par rapport aux règles strictes de la stratégie backtestée", en: "The performance loss due to human deviations from the backtested strategy's strict rules" } },
    ],
    assumptions: { fr: "Décomposition qualitative ; en pratique, ces deux écarts sont difficiles à isoler précisément mais tous deux réels et documentés empiriquement.", en: "Qualitative decomposition; in practice, both gaps are hard to precisely isolate but both are real and empirically documented." },
    units: { fr: "Écart de performance en pourcentage.", en: "Performance gap as a percentage." },
    example: { fr: "Un backtest Sharpe=1,5 peut se traduire en Sharpe réel de 0,8 après prise en compte des coûts réels et des déviations d'exécution.", en: "A backtest with Sharpe=1.5 can translate to a real Sharpe of 0.8 after accounting for real costs and execution deviations." },
  },
  calculation: {
    fr: "1) Backtester la stratégie avec une validation chronologique stricte (walk-forward, M12-cross), en intégrant des coûts de transaction réalistes. 2) Définir des règles d'exécution précises et non ambiguës (taille de position, stop-loss, take-profit) avant tout trading réel. 3) Suivre rigoureusement un journal de trading comparant les décisions réelles aux règles prédéfinies, pour détecter les déviations comportementales. 4) Analyser périodiquement l'écart entre performance réelle et performance backtestée pour identifier sa source (coûts sous-estimés vs. déviation comportementale).",
    en: "1) Backtest the strategy with strict chronological validation (walk-forward, M12-cross), incorporating realistic transaction costs. 2) Define precise, unambiguous execution rules (position size, stop-loss, take-profit) before any real trading. 3) Rigorously keep a trading journal comparing real decisions to predefined rules, to detect behavioral deviations. 4) Periodically analyze the gap between real and backtested performance to identify its source (understated costs vs. behavioral deviation).",
  },
  interpretation: {
    fr: "Un écart persistant et systématique entre performance backtestée et performance réelle, une fois les coûts de transaction correctement modélisés, pointe presque toujours vers un problème d'exécution comportementale plutôt qu'un défaut de la stratégie elle-même. La discipline (suivre les règles prédéfinies même en cas d'inconfort émotionnel) est empiriquement l'un des facteurs les plus déterminants de succès en trading, davantage que la sophistication de la stratégie elle-même.",
    en: "A persistent, systematic gap between backtested and real performance, once transaction costs are correctly modeled, almost always points to a behavioral execution problem rather than a flaw in the strategy itself. Discipline (following predefined rules even amid emotional discomfort) is empirically one of the most determining success factors in trading, more so than the strategy's own sophistication.",
  },
  pitfalls: {
    fr: "Attribuer un écart de performance réelle vs. backtestée uniquement à des \"conditions de marché différentes\" sans examiner honnêtement si des déviations comportementales personnelles en sont la cause réelle. Autre piège classique : sur-optimiser une stratégie sur des données historiques (curve fitting) jusqu'à obtenir un backtest magnifique mais non robuste, un cas particulier du data snooping déjà rencontré en M12-cross, qui se traduit presque toujours par une déception importante en conditions réelles.",
    en: "Attributing a real vs. backtested performance gap solely to \"different market conditions\" without honestly examining whether personal behavioral deviations are the real cause. Another classic trap: over-optimizing a strategy on historical data (curve fitting) until achieving a beautiful but non-robust backtest, a special case of data snooping already encountered in M12-cross, which almost always translates into significant disappointment under real conditions.",
  },
  keyPoints: {
    fr: [
      "Un backtesting rigoureux applique les mêmes principes méthodologiques que le machine learning financier : validation chronologique, benchmark naïf, coûts réalistes.",
      "Les biais comportementaux (aversion à la perte, excès de confiance, biais de récence) peuvent faire diverger la performance réelle du backtest, même avec une stratégie solide.",
      "Un journal de trading rigoureux permet de distinguer un défaut de stratégie d'un problème d'exécution comportementale.",
    ],
    en: [
      "Rigorous backtesting applies the same methodological principles as financial machine learning: chronological validation, naive benchmark, realistic costs.",
      "Behavioral biases (loss aversion, overconfidence, recency bias) can make real performance diverge from the backtest, even with a sound strategy.",
      "A rigorous trading journal helps distinguish a strategy flaw from a behavioral execution problem.",
    ],
  },
  advancedDemonstration: {
    fr: "La finance comportementale documente que l'aversion à la perte n'est pas une simple anecdote psychologique mais un biais quantifiable : les études empiriques (Kahneman et Tversky, théorie des perspectives) montrent que la douleur d'une perte est ressentie environ deux fois plus intensément que le plaisir d'un gain équivalent, ce qui explique mathématiquement pourquoi les traders ont tendance à couper leurs gains trop tôt (pour \"sécuriser\" le plaisir) tout en laissant courir leurs pertes trop longtemps (pour éviter la douleur de matérialiser l'échec) — un comportement exactement inverse de la règle de gestion du risque classique \"laisser courir les gains, couper les pertes\", qui explique une part significative de la sous-performance des investisseurs individuels par rapport aux indices qu'ils pourraient simplement répliquer passivement.",
    en: "Behavioral finance documents that loss aversion isn't a simple psychological anecdote but a quantifiable bias: empirical studies (Kahneman and Tversky, prospect theory) show a loss's pain is felt roughly twice as intensely as an equivalent gain's pleasure, which mathematically explains why traders tend to cut their gains too early (to \"lock in\" the pleasure) while letting their losses run too long (to avoid the pain of materializing failure) — behavior exactly opposite to the classic risk management rule \"let gains run, cut losses\", explaining a significant part of individual investors' underperformance versus indices they could simply passively replicate.",
  },
};
