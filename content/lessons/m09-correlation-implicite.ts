import type { LessonContent } from "@/lib/lesson-types";

export const m09CorrelationImplicite: LessonContent = {
  conceptId: "m09-correlation-implicite",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la corrélation réalisée et la volatilité implicite.",
      en: "You need to know realized correlation and implied volatility.",
    },
    conceptIds: ["m09-correlation-realisee", "m08-volatilite-implicite"],
  },
  glossary: [
    { term: { fr: "Corrélation moyenne implicite", en: "Implied average correlation" }, definition: { fr: "Une corrélation unique et simplifiée, supposée identique entre toutes les paires d'actifs d'un panier, qui reproduit le prix observé d'une option sur ce panier.", en: "A single, simplified correlation, assumed identical across all asset pairs in a basket, that reproduces the observed price of an option on that basket." } },
  ],
  intuition: {
    fr: "De même que la volatilité implicite se déduit d'un prix d'option plutôt que d'être observée directement, la corrélation implicite se déduit de la comparaison entre le prix d'une option sur indice et les prix d'options sur ses composants — c'est ce que le marché \"pense\" de la corrélation future, pas une mesure statistique du passé.",
    en: "Just as implied volatility is derived from an option price rather than observed directly, implied correlation is derived by comparing an index option's price to its components' option prices — it's what the market \"thinks\" about future correlation, not a statistical measure of the past.",
  },
  definition: {
    fr: "Pour un indice composé de deux actifs de poids w1, w2, la variance de l'indice s'écrit σ²_indice = w1²σ1² + w2²σ2² + 2w1w2σ1σ2ρ. Connaissant σ_indice (extraite d'options sur indice) et σ1, σ2 (extraites d'options sur chaque composant), on peut résoudre cette équation pour ρ_implicite — la corrélation implicite entre les deux actifs.",
    en: "For an index made of two assets with weights w1, w2, the index variance is σ²_index = w1²σ1² + w2²σ2² + 2w1w2σ1σ2ρ. Knowing σ_index (extracted from index options) and σ1, σ2 (extracted from each component's options), this equation can be solved for ρ_implied — the implied correlation between the two assets.",
  },
  utility: {
    fr: "La corrélation implicite est directement tradable via des produits de dispersion (M09-3) et sert d'indicateur de stress de marché : elle grimpe généralement en période de panique (le marché anticipe que \"tout va baisser ensemble\"), un signal suivi de près par les gérants de risque.",
    en: "Implied correlation is directly tradable via dispersion products (M09-3) and serves as a market-stress indicator: it generally rises during panic periods (the market expects \"everything will fall together\"), a signal closely followed by risk managers.",
  },
  example: {
    fr: "Un indice à deux actions, poids égaux (w1=w2=0,5), σ1=σ2=25% (égales pour simplifier), IV de l'indice=20%. σ²_indice = 0,04. 0,25²×0,5² + 0,25²×0,5² + 2×0,5×0,5×0,25×0,25×ρ = 0,04 → 0,03125 + 0,03125ρ = 0,04 → ρ ≈ 0,28. La corrélation implicite est d'environ 28%.",
    en: "A two-stock index, equal weights (w1=w2=0.5), σ1=σ2=25% (equal for simplicity), index IV=20%. σ²_index = 0.04. 0.25²×0.5² + 0.25²×0.5² + 2×0.5×0.5×0.25×0.25×ρ = 0.04 → 0.03125 + 0.03125ρ = 0.04 → ρ ≈ 0.28. Implied correlation is about 28%.",
  },
  alternativeExplanation: {
    fr: "Un indice actions est structurellement \"moins volatil que la moyenne de ses composants\" grâce à la diversification — sauf si tous ses composants bougent exactement ensemble (corrélation=1), auquel cas la diversification ne joue plus du tout. En comparant l'écart réel entre la volatilité de l'indice et celle de ses composants, on peut donc déduire \"à quel point le marché pense que les composants bougent ensemble\" — c'est exactement la corrélation implicite.",
    en: "An equity index is structurally \"less volatile than the average of its components\" thanks to diversification — unless all its components move exactly together (correlation=1), in which case diversification no longer plays any role. By comparing the actual gap between the index's volatility and its components', one can infer \"how much the market thinks the components move together\" — exactly the implied correlation.",
  },
  formula: {
    latex: "\\sigma^{2}_{\\text{indice}} = w_1^{2}\\sigma_1^{2} + w_2^{2}\\sigma_2^{2} + 2w_1 w_2 \\sigma_1 \\sigma_2 \\rho_{\\text{implicite}}",
    variables: [
      { symbol: "w_1, w_2", description: { fr: "Poids des deux actifs dans l'indice", en: "The two assets' weights in the index" } },
      { symbol: "\\sigma_1, \\sigma_2", description: { fr: "Volatilités implicites des deux composants", en: "The two components' implied volatilities" } },
      { symbol: "\\sigma_{\\text{indice}}", description: { fr: "Volatilité implicite de l'indice lui-même", en: "The index's own implied volatility" } },
    ],
    assumptions: { fr: "Cas simplifié à deux actifs ; le cas général à N actifs suppose souvent une corrélation moyenne identique entre toutes les paires, une simplification forte.", en: "Simplified two-asset case; the general N-asset case often assumes an identical average correlation across all pairs, a strong simplification." },
    units: { fr: "ρ_implicite sans dimension, entre −1 et +1 (en pratique souvent entre 0 et 1 pour des actions).", en: "ρ_implied dimensionless, between −1 and +1 (in practice often between 0 and 1 for equities)." },
    example: { fr: "Voir l'exemple ci-dessus : ρ_implicite ≈ 28%.", en: "See the example above: ρ_implied ≈ 28%." },
  },
  calculation: {
    fr: "1) Extraire la volatilité implicite de l'indice (M08-2) à partir d'options sur cet indice. 2) Extraire la volatilité implicite de chaque composant à partir d'options individuelles. 3) Substituer dans la formule de variance de l'indice. 4) Résoudre pour ρ (une simple équation du premier degré une fois les autres termes connus).",
    en: "1) Extract the index's implied volatility (M08-2) from options on that index. 2) Extract each component's implied volatility from individual options. 3) Substitute into the index variance formula. 4) Solve for ρ (a simple first-degree equation once the other terms are known).",
  },
  interpretation: {
    fr: "La corrélation implicite est structurellement plus élevée que la corrélation réalisée en moyenne (une \"prime de corrélation\", symétrique à la prime de volatilité vue en M07-5) : les vendeurs de protection contre la hausse de corrélation (essentiellement, les vendeurs d'options sur indice par rapport aux composants) exigent une compensation pour ce risque.",
    en: "Implied correlation is structurally higher than realized correlation on average (a \"correlation premium\", symmetric to the volatility premium seen in M07-5): sellers of protection against rising correlation (essentially, sellers of index options relative to components) demand compensation for that risk.",
  },
  pitfalls: {
    fr: "Généraliser la formule à deux actifs sans adaptation à N actifs : la version générale nécessite une matrice de corrélation complète ou une hypothèse simplificatrice de corrélation moyenne unique, pas juste une extension mécanique de la formule à deux actifs. Autre piège : oublier que la corrélation implicite dépend de l'hypothèse de corrélation UNIFORME entre toutes les paires, une simplification qui peut être trompeuse si les corrélations réelles entre paires sont très hétérogènes.",
    en: "Generalizing the two-asset formula without adapting it to N assets: the general version needs a full correlation matrix or a simplifying single-average-correlation assumption, not just a mechanical extension of the two-asset formula. Another trap: forgetting implied correlation depends on the UNIFORM correlation assumption across all pairs, a simplification that can be misleading if actual pairwise correlations are very heterogeneous.",
  },
  keyPoints: {
    fr: [
      "La corrélation implicite se déduit en comparant la volatilité implicite d'un indice à celles de ses composants.",
      "σ²_indice = w1²σ1² + w2²σ2² + 2w1w2σ1σ2ρ_implicite (cas à deux actifs).",
      "La corrélation implicite est en moyenne plus élevée que la corrélation réalisée (une prime de corrélation).",
    ],
    en: [
      "Implied correlation is derived by comparing an index's implied volatility to its components'.",
      "σ²_index = w1²σ1² + w2²σ2² + 2w1w2σ1σ2ρ_implied (two-asset case).",
      "Implied correlation is on average higher than realized correlation (a correlation premium).",
    ],
  },
  advancedDemonstration: {
    fr: "La généralisation à N actifs, sous l'hypothèse d'une corrélation moyenne ρ̄ identique entre toutes les paires et de poids/volatilités égaux, donne σ²_indice ≈ (1/N)σ̄² + ((N−1)/N)σ̄²ρ̄, qui montre que, même à corrélation nulle, l'indice conserve une volatilité résiduelle de σ̄/√N (le risque \"non diversifiable\" disparaît à mesure que N grandit, mais le risque systématique lié à ρ̄ persiste). C'est cette décomposition qui sépare formellement le risque idiosyncratique (diversifiable) du risque systématique (lié à la corrélation moyenne) — un concept directement lié au CAPM (voir la catégorie Gestion de portefeuille).",
    en: "Generalizing to N assets, under the assumption of an identical average correlation ρ̄ across all pairs and equal weights/volatilities, gives σ²_index ≈ (1/N)σ̄² + ((N−1)/N)σ̄²ρ̄, which shows that even at zero correlation, the index retains a residual volatility of σ̄/√N (the \"non-diversifiable\" risk vanishes as N grows, but the systematic risk tied to ρ̄ persists). This decomposition is what formally separates idiosyncratic (diversifiable) risk from systematic risk (tied to average correlation) — a concept directly linked to the CAPM (see the Portfolio Management category).",
  },
};
