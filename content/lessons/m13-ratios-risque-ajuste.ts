import type { LessonContent } from "@/lib/lesson-types";

export const m13RatiosRisqueAjuste: LessonContent = {
  conceptId: "m13-ratios-risque-ajuste",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le drawdown maximal et le CAPM (bêta), utilisés dans plusieurs de ces ratios.",
      en: "You need to know maximum drawdown and CAPM (beta), used in several of these ratios.",
    },
    conceptIds: ["m13-drawdown-ulcer", "m13-capm-sml"],
  },
  glossary: [
    { term: { fr: "Tracking error", en: "Tracking error" }, definition: { fr: "L'écart-type de la différence de rendement entre un portefeuille et son benchmark, mesurant à quel point le portefeuille s'écarte de son indice de référence.", en: "The standard deviation of the return difference between a portfolio and its benchmark, measuring how much the portfolio deviates from its reference index." } },
  ],
  intuition: {
    fr: "Comparer deux stratégies uniquement sur leur rendement est trompeur si l'une a pris beaucoup plus de risque que l'autre pour l'obtenir. Les ratios de risque ajusté normalisent le rendement par une mesure de risque, permettant une comparaison équitable : \"quel rendement obtient-on par unité de risque prise ?\"",
    en: "Comparing two strategies solely on their return is misleading if one took much more risk than the other to achieve it. Risk-adjusted ratios normalize return by a risk measure, enabling a fair comparison: \"what return is achieved per unit of risk taken?\"",
  },
  definition: {
    fr: "Le ratio de Sharpe divise l'excès de rendement (rendement moins taux sans risque) par la volatilité totale. Le ratio de Sortino ne pénalise que la volatilité \"à la baisse\" (downside risk, M13-risques-a), ignorant la volatilité \"à la hausse\" qui n'est pas un risque du point de vue de l'investisseur. Le ratio de Calmar divise le rendement annualisé par le drawdown maximal (M13-risques-b), capturant le risque de perte extrême plutôt que la volatilité globale. Le bêta et l'alpha (M13-gp-c) décomposent le rendement en une partie expliquée par le marché et une partie de surperformance pure. Le tracking error mesure l'écart-type de la différence de rendement avec un benchmark, et l'information ratio divise l'alpha par ce tracking error.",
    en: "The Sharpe ratio divides excess return (return minus risk-free rate) by total volatility. The Sortino ratio penalizes only \"downside\" volatility (downside risk, M13-risques-a), ignoring \"upside\" volatility which isn't a risk from the investor's viewpoint. The Calmar ratio divides annualized return by maximum drawdown (M13-risques-b), capturing extreme loss risk rather than overall volatility. Beta and alpha (M13-gp-c) decompose return into a market-explained part and a pure outperformance part. Tracking error measures the standard deviation of the return difference versus a benchmark, and the information ratio divides alpha by this tracking error.",
  },
  utility: {
    fr: "Chaque ratio répond à une question de comparaison différente : le Sharpe pour une comparaison générale risque/rendement, le Sortino quand seule la baisse compte réellement, le Calmar quand le risque de perte extrême (drawdown) préoccupe davantage qu'une volatilité générale, et l'information ratio pour juger spécifiquement la qualité d'une gestion active par rapport à son benchmark (M13-gp-d).",
    en: "Each ratio answers a different comparison question: Sharpe for a general risk/return comparison, Sortino when only the downside really matters, Calmar when extreme loss risk (drawdown) is more of a concern than overall volatility, and the information ratio specifically to judge active management quality versus its benchmark (M13-gp-d).",
  },
  example: {
    fr: "Deux fonds ont le même rendement annualisé de 10%. Le fonds A a une volatilité de 15% (Sharpe ≈ 0,53 avec r_f=2%) et un drawdown maximal de 20% (Calmar = 0,5). Le fonds B a une volatilité de 10% (Sharpe ≈ 0,8) mais un drawdown maximal de 35% (Calmar ≈ 0,29, à cause d'un choc ponctuel violent) : selon le Sharpe, B semble supérieur, mais selon le Calmar, A semble préférable — les deux ratios racontent des histoires différentes sur le même couple de fonds.",
    en: "Two funds have the same 10% annualized return. Fund A has 15% volatility (Sharpe ≈ 0.53 with r_f=2%) and a 20% maximum drawdown (Calmar = 0.5). Fund B has 10% volatility (Sharpe ≈ 0.8) but a 35% maximum drawdown (Calmar ≈ 0.29, due to a one-off violent shock): by Sharpe, B looks superior, but by Calmar, A looks preferable — the two ratios tell different stories about the same pair of funds.",
  },
  alternativeExplanation: {
    fr: "Choisir un ratio de risque ajusté, c'est comme choisir quel critère utiliser pour évaluer un conducteur : la vitesse moyenne (rendement brut) ne suffit pas ; on peut préférer regarder la régularité de la conduite (Sharpe, toute variabilité), uniquement les écarts dangereux (Sortino, la baisse), ou le pire freinage d'urgence jamais effectué (Calmar, le drawdown) — chaque angle révèle un aspect différent de la \"qualité\" du trajet.",
    en: "Choosing a risk-adjusted ratio is like choosing which criterion to evaluate a driver by: average speed (raw return) isn't enough; you might prefer to look at driving smoothness (Sharpe, all variability), only dangerous swerves (Sortino, the downside), or the worst emergency brake ever applied (Calmar, the drawdown) — each angle reveals a different aspect of the journey's \"quality\".",
  },
  formula: {
    latex: "\\text{Sharpe} = \\frac{E(R_p) - r_f}{\\sigma_p}, \\quad \\text{Information Ratio} = \\frac{\\alpha}{\\text{Tracking Error}}",
    variables: [
      { symbol: "\\sigma_p", description: { fr: "Volatilité totale du portefeuille (Sharpe) ou downside risk seul (Sortino)", en: "The portfolio's total volatility (Sharpe) or downside risk alone (Sortino)" } },
      { symbol: "\\alpha", description: { fr: "Surperformance du portefeuille par rapport à son benchmark, non expliquée par le bêta", en: "The portfolio's outperformance versus its benchmark, not explained by beta" } },
    ],
    assumptions: { fr: "Le Sharpe suppose une distribution des rendements où la volatilité symétrique est une mesure de risque pertinente ; le Sortino et le Calmar corrigent cette limite pour des distributions asymétriques.", en: "Sharpe assumes a return distribution where symmetric volatility is a relevant risk measure; Sortino and Calmar correct this limitation for asymmetric distributions." },
    units: { fr: "Ratio sans dimension.", en: "Dimensionless ratio." },
    example: { fr: "α=2%, Tracking Error=4% : Information Ratio=0,5 — une surperformance modeste mais réalisée avec un écart contrôlé par rapport au benchmark.", en: "α=2%, Tracking Error=4%: Information Ratio=0.5 — a modest outperformance, but achieved with a controlled deviation from the benchmark." },
  },
  calculation: {
    fr: "1) Calculer le rendement annualisé et le taux sans risque sur la même période. 2) Selon le ratio souhaité, calculer la mesure de risque appropriée (volatilité totale, downside risk, drawdown maximal, ou tracking error). 3) Diviser l'excès de rendement (ou l'alpha) par cette mesure de risque. 4) Comparer toujours des ratios calculés sur la même période et avec la même fréquence de données, car ces choix affectent significativement le résultat.",
    en: "1) Compute the annualized return and risk-free rate over the same period. 2) Depending on the desired ratio, compute the appropriate risk measure (total volatility, downside risk, maximum drawdown, or tracking error). 3) Divide the excess return (or alpha) by this risk measure. 4) Always compare ratios computed over the same period and data frequency, since these choices significantly affect the result.",
  },
  interpretation: {
    fr: "Un Sharpe supérieur à 1 est généralement considéré comme bon, supérieur à 2 comme excellent (mais ces seuils varient selon les classes d'actifs). Un Sortino nettement supérieur au Sharpe pour la même stratégie indique que sa volatilité est majoritairement \"à la hausse\" (favorable), un profil de risque attractif. Un information ratio élevé indique un alpha généré de façon régulière plutôt que par un pari ponctuel chanceux.",
    en: "A Sharpe above 1 is generally considered good, above 2 excellent (though these thresholds vary by asset class). A Sortino notably higher than the Sharpe for the same strategy indicates its volatility is mostly \"upside\" (favorable), an attractive risk profile. A high information ratio indicates alpha generated consistently rather than through a lucky one-off bet.",
  },
  pitfalls: {
    fr: "Comparer des ratios calculés sur des périodes ou des fréquences de données différentes (par exemple, un Sharpe annualisé à partir de données journalières vs. mensuelles peut différer significativement selon la méthode d'annualisation utilisée). Autre piège : se fier à un seul ratio sans en croiser plusieurs — un Sharpe élevé peut masquer un drawdown maximal important si la volatilité est globalement faible mais ponctuée d'un choc extrême, révélé seulement par le Calmar.",
    en: "Comparing ratios computed over different periods or data frequencies (for example, an annualized Sharpe from daily vs. monthly data can differ significantly depending on the annualization method used). Another trap: relying on a single ratio without cross-checking several — a high Sharpe can mask a large maximum drawdown if volatility is generally low but punctuated by an extreme shock, revealed only by the Calmar.",
  },
  keyPoints: {
    fr: [
      "Sharpe (volatilité totale), Sortino (downside seul) et Calmar (drawdown maximal) répondent à des questions de risque différentes.",
      "Alpha et bêta décomposent le rendement entre exposition au marché et surperformance pure.",
      "L'information ratio (alpha / tracking error) juge spécifiquement la régularité d'une gestion active par rapport à son benchmark.",
    ],
    en: [
      "Sharpe (total volatility), Sortino (downside only) and Calmar (maximum drawdown) answer different risk questions.",
      "Alpha and beta decompose return between market exposure and pure outperformance.",
      "The information ratio (alpha / tracking error) specifically judges active management's consistency versus its benchmark.",
    ],
  },
  advancedDemonstration: {
    fr: "Le ratio de Sharpe, bien que très répandu, a une limite statistique importante : il suppose implicitement une distribution des rendements symétrique et sans queue épaisse (fat tail) — pour des stratégies dont la distribution est fortement asymétrique (par exemple, une stratégie de vente d'options, qui génère de petits gains fréquents contre un risque de perte rare mais énorme), le Sharpe peut paraître excellent alors que le risque réel de queue est masqué, ce qui explique pourquoi les ratios asymétriques (Sortino, Calmar) et les mesures de risque de queue (Expected Shortfall, M13-risques-a) sont indispensables en complément, en particulier pour évaluer des stratégies non-linéaires impliquant des dérivés.",
    en: "The Sharpe ratio, though widespread, has an important statistical limitation: it implicitly assumes a symmetric, non-fat-tailed return distribution — for strategies with a strongly asymmetric distribution (e.g., an option-selling strategy generating small frequent gains against a rare but huge loss risk), the Sharpe can look excellent while the real tail risk is masked, which explains why asymmetric ratios (Sortino, Calmar) and tail-risk measures (Expected Shortfall, M13-risques-a) are essential complements, particularly for evaluating non-linear strategies involving derivatives.",
  },
};
