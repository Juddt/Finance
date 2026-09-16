import type { LessonContent } from "@/lib/lesson-types";

export const m10OptionsDigitales: LessonContent = {
  conceptId: "m10-options-digitales",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les formules de Black-Scholes, en particulier l'interprétation de N(d2).",
      en: "You need to know the Black-Scholes formulas, particularly N(d2)'s interpretation.",
    },
    conceptIds: ["m06-formules-call-put"],
  },
  glossary: [
    { term: { fr: "Cash-or-nothing", en: "Cash-or-nothing" }, definition: { fr: "Une digitale qui verse un montant fixe en cash si la condition est remplie, rien sinon.", en: "A digital that pays a fixed cash amount if the condition is met, nothing otherwise." } },
    { term: { fr: "Asset-or-nothing", en: "Asset-or-nothing" }, definition: { fr: "Une digitale qui verse la valeur du sous-jacent lui-même si la condition est remplie, rien sinon.", en: "A digital that pays the underlying's own value if the condition is met, nothing otherwise." } },
  ],
  intuition: {
    fr: "Contrairement à une option vanille dont le payoff varie continûment avec le niveau final du sous-jacent, une option digitale a un payoff \"tout ou rien\" : un montant fixe si une condition est remplie à l'échéance, zéro sinon — c'est un pari binaire pur sur un seuil.",
    en: "Unlike a vanilla option whose payoff varies continuously with the underlying's final level, a digital option has an \"all or nothing\" payoff: a fixed amount if a condition is met at expiry, zero otherwise — a pure binary bet on a threshold.",
  },
  definition: {
    fr: "Une digitale cash-or-nothing call verse un montant fixe C si S_T > K à l'échéance, sinon rien. Son prix sous Black-Scholes est exactement C × e^{−rT} × N(d2), où N(d2) est la vraie probabilité risque-neutre que l'option termine dans la monnaie (déjà rencontrée en M06-5). Une digitale asset-or-nothing verse S_T (la valeur du sous-jacent lui-même) si S_T > K, son prix étant S0 × N(d1).",
    en: "A cash-or-nothing digital call pays a fixed amount C if S_T > K at expiry, otherwise nothing. Its price under Black-Scholes is exactly C × e^{−rT} × N(d2), where N(d2) is the true risk-neutral probability the option ends in the money (already encountered in M06-5). An asset-or-nothing digital pays S_T (the underlying's own value) if S_T > K, its price being S0 × N(d1).",
  },
  utility: {
    fr: "Les digitales sont utilisées directement comme produits de trading (paris sur un seuil précis) et comme brique de construction cachée dans de nombreux produits structurés (un coupon conditionnel \"tout ou rien\" dans un autocall, par exemple, se comporte exactement comme une digitale, voir M11).",
    en: "Digitals are used directly as trading products (bets on a precise threshold) and as a hidden building block in many structured products (an autocall's \"all or nothing\" conditional coupon, for example, behaves exactly like a digital, see M11).",
  },
  example: {
    fr: "Une digitale cash-or-nothing verse 1000 EUR si une action termine au-dessus de 100 dans 1 an. Avec S0=100, K=100, r=3%, σ=20%, on a déjà calculé (M06-5) d2≈0,05, N(d2)≈0,5199. Prix = 1000 × e^{−0,03} × 0,5199 ≈ 1000 × 0,9704 × 0,5199 ≈ 504,60.",
    en: "A cash-or-nothing digital pays EUR 1,000 if a stock ends above 100 in 1 year. With S0=100, K=100, r=3%, σ=20%, we already computed (M06-5) d2≈0.05, N(d2)≈0.5199. Price = 1,000 × e^{−0.03} × 0.5199 ≈ 1,000 × 0.9704 × 0.5199 ≈ 504.60.",
  },
  alternativeExplanation: {
    fr: "Une digitale est un pari sportif simple : \"est-ce que l'équipe A gagne, oui ou non ?\", avec un gain fixe en cas de bonne réponse. Ce n'est pas un pari sur l'ampleur de la victoire (comme une option vanille le serait sur l'ampleur du mouvement de prix), juste sur le fait binaire de dépasser ou non un seuil précis.",
    en: "A digital is a simple sports bet: \"does team A win, yes or no?\", with a fixed payout for a correct answer. It isn't a bet on the margin of victory (as a vanilla option would be on the size of a price move), just on the binary fact of exceeding or not a precise threshold.",
  },
  formula: {
    latex: "\\text{Digitale}_{\\text{cash-or-nothing}} = C \\times e^{-rT} \\times N(d_2)",
    variables: [
      { symbol: "C", description: { fr: "Montant fixe versé si la condition est remplie", en: "Fixed amount paid if the condition is met" } },
      { symbol: "N(d_2)", description: { fr: "Probabilité risque-neutre que S_T > K à l'échéance", en: "The risk-neutral probability that S_T > K at expiry" } },
    ],
    assumptions: { fr: "Digitale de type call (paie si S_T>K) ; pour un put digital, remplacer N(d2) par N(−d2).", en: "Call-type digital (pays if S_T>K); for a digital put, replace N(d2) with N(−d2)." },
    units: { fr: "Prix dans la devise de C.", en: "Price in C's currency." },
    example: { fr: "C=1000, d2≈0,05, r=3%, T=1 : Prix ≈ 1000×0,9704×0,5199 ≈ 504,60.", en: "C=1000, d2≈0.05, r=3%, T=1: Price ≈ 1000×0.9704×0.5199 ≈ 504.60." },
  },
  calculation: {
    fr: "1) Calculer d1 et d2 comme pour Black-Scholes (M06-5). 2) Calculer N(d2), la probabilité risque-neutre d'exercice. 3) Multiplier par le montant fixe C. 4) Actualiser au taux sans risque sur la durée T.",
    en: "1) Compute d1 and d2 as for Black-Scholes (M06-5). 2) Compute N(d2), the risk-neutral exercise probability. 3) Multiply by the fixed amount C. 4) Discount at the risk-free rate over the duration T.",
  },
  interpretation: {
    fr: "Le prix d'une digitale se lit directement comme \"la probabilité risque-neutre de succès, actualisée\" — un lien beaucoup plus direct et intuitif avec la notion de probabilité qu'une option vanille, dont le prix mélange probabilité de succès ET ampleur attendue du gain.",
    en: "A digital's price reads directly as \"the discounted risk-neutral probability of success\" — a much more direct and intuitive link to probability than a vanilla option's price, which blends success probability AND expected gain magnitude.",
  },
  pitfalls: {
    fr: "Confondre N(d1) et N(d2) : c'est bien N(d2) qui est la probabilité risque-neutre pertinente pour une digitale cash-or-nothing, pas N(d1) (qui reste le Delta d'un call vanille, M06-5). Autre piège : oublier d'actualiser le montant C au taux sans risque, ce qui surestime systématiquement le prix.",
    en: "Confusing N(d1) and N(d2): it is indeed N(d2) that is the relevant risk-neutral probability for a cash-or-nothing digital, not N(d1) (which remains a vanilla call's Delta, M06-5). Another trap: forgetting to discount the amount C at the risk-free rate, which systematically overstates the price.",
  },
  keyPoints: {
    fr: [
      "Cash-or-nothing : verse un montant fixe C si S_T>K, prix = C×e^{−rT}×N(d2).",
      "Asset-or-nothing : verse S_T lui-même si S_T>K, prix = S0×N(d1).",
      "N(d2) est directement la probabilité risque-neutre de succès — un lien probabiliste très direct.",
    ],
    en: [
      "Cash-or-nothing: pays a fixed amount C if S_T>K, price = C×e^{−rT}×N(d2).",
      "Asset-or-nothing: pays S_T itself if S_T>K, price = S0×N(d1).",
      "N(d2) is directly the risk-neutral success probability — a very direct probabilistic link.",
    ],
  },
  advancedDemonstration: {
    fr: "Un call vanille peut se décomposer exactement comme la différence entre une digitale asset-or-nothing et K fois une digitale cash-or-nothing : C_vanille = [Digitale asset-or-nothing] − K × [Digitale cash-or-nothing] = S0×N(d1) − K×e^{−rT}×N(d2), retrouvant exactement la formule de Black-Scholes (M06-5). Cette décomposition révèle que les digitales sont en réalité les \"briques atomiques\" à partir desquelles toute la formule de Black-Scholes se reconstruit — un aperçu du lien profond entre payoffs exotiques simples et pricing vanille.",
    en: "A vanilla call can be decomposed exactly as the difference between an asset-or-nothing digital and K times a cash-or-nothing digital: C_vanilla = [Asset-or-nothing digital] − K × [Cash-or-nothing digital] = S0×N(d1) − K×e^{−rT}×N(d2), exactly recovering the Black-Scholes formula (M06-5). This decomposition reveals that digitals are in fact the \"atomic building blocks\" from which the entire Black-Scholes formula is reconstructed — a glimpse into the deep link between simple exotic payoffs and vanilla pricing.",
  },
};
