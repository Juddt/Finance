import type { LessonContent } from "@/lib/lesson-types";

export const m08VarianceSwap: LessonContent = {
  conceptId: "m08-variance-swap",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la volatilité réalisée et le principe du delta-hedging.",
      en: "You need to know realized volatility and the delta-hedging principle.",
    },
    conceptIds: ["m08-volatilite-realisee", "m07-delta-hedging"],
  },
  glossary: [
    { term: { fr: "Strike de variance", en: "Variance strike" }, definition: { fr: "Le niveau de variance fixé au contrat, déterminé pour que la valeur du variance swap soit nulle à la conclusion.", en: "The variance level fixed in the contract, set so the variance swap's value is zero at inception." } },
  ],
  intuition: {
    fr: "Un variance swap permet de parier directement sur la volatilité future d'un actif, sans les complications du delta-hedging d'une option classique : à l'échéance, on échange simplement la différence entre la variance réellement réalisée et un niveau fixé à l'avance.",
    en: "A variance swap lets you bet directly on an asset's future volatility, without the complications of delta-hedging a classic option: at maturity, you simply exchange the difference between actually realized variance and a level fixed in advance.",
  },
  definition: {
    fr: "Un variance swap est un contrat dont le payoff à l'échéance est N_var × (σ²_réalisée − K²_var), où N_var est le notionnel de variance, σ²_réalisée la variance effectivement observée sur le sous-jacent pendant la vie du contrat, et K_var le \"strike de variance\" fixé à la conclusion (choisi pour que la valeur initiale du contrat soit nulle).",
    en: "A variance swap is a contract whose maturity payoff is N_var × (σ²_realized − K²_var), where N_var is the variance notional, σ²_realized the variance actually observed on the underlying during the contract's life, and K_var the \"variance strike\" fixed at inception (chosen so the contract's initial value is zero).",
  },
  utility: {
    fr: "Contrairement à une option delta-hedgée (dont le P&L dépend du chemin suivi par le sous-jacent, voir M07-5), le variance swap offre une exposition PURE à la volatilité réalisée, sans risque de Delta ni dépendance à la fréquence de rééquilibrage — l'instrument de référence pour parier explicitement sur la volatilité.",
    en: "Unlike a delta-hedged option (whose P&L depends on the underlying's path, see M07-5), a variance swap offers PURE exposure to realized volatility, with no Delta risk or dependence on rebalancing frequency — the reference instrument for explicitly betting on volatility.",
  },
  example: {
    fr: "Un investisseur achète un variance swap avec K_var=20% (donc K²_var=0,04), notionnel de variance N_var=100 000 par point de variance. Si la volatilité réalisée s'avère être 25% (σ²=0,0625), le payoff est 100 000×(0,0625−0,04) = 2 250. Si la volatilité réalisée n'est que de 15% (σ²=0,0225), le payoff est 100 000×(0,0225−0,04) = −1 750.",
    en: "An investor buys a variance swap with K_var=20% (so K²_var=0.04), variance notional N_var=100,000 per variance point. If realized volatility turns out to be 25% (σ²=0.0625), the payoff is 100,000×(0.0625−0.04) = 2,250. If realized volatility is only 15% (σ²=0.0225), the payoff is 100,000×(0.0225−0.04) = −1,750.",
  },
  alternativeExplanation: {
    fr: "Le variance swap ressemble à un pari sur \"le nombre total de secousses\" pendant un trajet en voiture, plutôt qu'à un pari sur la direction finale du trajet : peu importe où la voiture termine (le niveau final du prix), seule l'ampleur cumulée des secousses (la variance réalisée) détermine le résultat du pari.",
    en: "A variance swap resembles a bet on \"the total amount of bumps\" during a car ride, rather than a bet on the ride's final direction: it doesn't matter where the car ends up (the final price level), only the cumulative magnitude of the bumps (realized variance) determines the bet's outcome.",
  },
  formula: {
    latex: "\\text{Payoff} = N_{\\text{var}} \\times (\\sigma^{2}_{\\text{réalisée}} - K^{2}_{\\text{var}})",
    variables: [
      { symbol: "N_{\\text{var}}", description: { fr: "Notionnel de variance (montant par point de variance)", en: "Variance notional (amount per variance point)" } },
      { symbol: "\\sigma^2_{\\text{réalisée}}", description: { fr: "Variance annualisée réalisée sur le sous-jacent pendant la vie du contrat", en: "Annualized variance realized on the underlying during the contract's life" } },
      { symbol: "K^2_{\\text{var}}", description: { fr: "Strike de variance (le carré du \"niveau\" de volatilité fixé au contrat)", en: "Variance strike (the square of the \"level\" of volatility fixed in the contract)" } },
    ],
    assumptions: { fr: "σ²_réalisée mesurée avec la même méthodologie (fréquence, convention) que celle spécifiée dans le contrat.", en: "σ²_realized measured with the same methodology (frequency, convention) as specified in the contract." },
    units: { fr: "Payoff dans la devise du notionnel.", en: "Payoff in the notional's currency." },
    example: { fr: "N_var=100 000, K_var=20%, σ_réalisée=25% : Payoff = 100 000×(0,0625−0,04) = 2 250.", en: "N_var=100,000, K_var=20%, σ_realized=25%: Payoff = 100,000×(0.0625−0.04) = 2,250." },
  },
  calculation: {
    fr: "1) Mesurer la variance réalisée σ²_réalisée sur la période (voir la méthode de M08-1, en travaillant en variance plutôt qu'en volatilité). 2) Calculer K²_var, le carré du strike de variance fixé au contrat. 3) Soustraire K²_var de σ²_réalisée. 4) Multiplier par le notionnel de variance N_var.",
    en: "1) Measure realized variance σ²_realized over the period (using M08-1's method, working in variance rather than volatility). 2) Compute K²_var, the square of the contract's fixed variance strike. 3) Subtract K²_var from σ²_realized. 4) Multiply by the variance notional N_var.",
  },
  interpretation: {
    fr: "Le payoff étant fonction du CARRÉ de la volatilité (pas de la volatilité elle-même), un variance swap est structurellement plus sensible à de grands mouvements de volatilité qu'un simple pari linéaire — une propriété qui le rend particulièrement adapté pour se couvrir contre des chocs de volatilité extrêmes (krachs), mais aussi plus risqué à vendre.",
    en: "Since the payoff is a function of volatility SQUARED (not volatility itself), a variance swap is structurally more sensitive to large volatility moves than a simple linear bet — a property that makes it particularly suited to hedging against extreme volatility shocks (crashes), but also riskier to sell.",
  },
  pitfalls: {
    fr: "Confondre variance swap et volatility swap (un instrument différent, dont le payoff est linéaire en volatilité réalisée, pas en variance) — les deux existent sur le marché mais se pricent et se répliquent différemment. Autre piège : oublier que le payoff dépend du carré de σ, ce qui rend le variance swap disproportionnellement sensible aux queues de distribution (les mouvements extrêmes comptent beaucoup plus que ne le suggère une intuition linéaire).",
    en: "Confusing a variance swap with a volatility swap (a different instrument, whose payoff is linear in realized volatility, not variance) — both exist in the market but price and replicate differently. Another trap: forgetting the payoff depends on σ squared, which makes the variance swap disproportionately sensitive to distribution tails (extreme moves count much more than a linear intuition would suggest).",
  },
  keyPoints: {
    fr: [
      "Payoff = N_var × (σ²_réalisée − K²_var) : une exposition pure à la variance, sans risque de Delta.",
      "Contrairement à une option delta-hedgée, le P&L ne dépend pas du chemin ni de la fréquence de rééquilibrage.",
      "Le payoff en σ² (pas σ) rend l'instrument disproportionnellement sensible aux mouvements extrêmes.",
    ],
    en: [
      "Payoff = N_var × (σ²_realized − K²_var): pure variance exposure, with no Delta risk.",
      "Unlike a delta-hedged option, the P&L doesn't depend on the path or rebalancing frequency.",
      "The σ² (not σ) payoff makes the instrument disproportionately sensitive to extreme moves.",
    ],
  },
  advancedDemonstration: {
    fr: "Le résultat remarquable qui rend le variance swap pricable et réplicable de façon robuste (indépendamment d'un modèle de volatilité particulier) est que la variance risque-neutre attendue peut s'écrire comme une intégrale sur un continuum d'options vanilles de tous les strikes, pondérées par 1/K² (le \"log contract\" de Neuberger/Carr-Madan) : K²_var ≈ (2/T)∫[0,∞] [P(K)/K² pour K<F0, C(K)/K² pour K>F0] dK. Cette formule de réplication statique, ne nécessitant qu'un portefeuille d'options de strikes échelonnés (pas de delta-hedging dynamique), est exactement ce qui permet aux banques de coter et de couvrir des variance swaps de façon fiable, indépendamment du modèle de volatilité sous-jacent utilisé.",
    en: "The remarkable result that makes a variance swap robustly priceable and replicable (independent of any particular volatility model) is that the risk-neutral expected variance can be written as an integral over a continuum of vanilla options across all strikes, weighted by 1/K² (Neuberger/Carr-Madan's \"log contract\"): K²_var ≈ (2/T)∫[0,∞] [P(K)/K² for K<F0, C(K)/K² for K>F0] dK. This static replication formula, needing only a portfolio of options across a range of strikes (no dynamic delta-hedging), is exactly what lets banks reliably quote and hedge variance swaps, independent of the underlying volatility model used.",
  },
};
