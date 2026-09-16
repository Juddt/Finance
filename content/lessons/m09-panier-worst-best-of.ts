import type { LessonContent } from "@/lib/lesson-types";

export const m09PanierWorstBestOf: LessonContent = {
  conceptId: "m09-panier-worst-best-of",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le payoff d'un call/put classique et l'idée de corrélation entre actifs.",
      en: "You need to know a classic call/put's payoff and the idea of correlation between assets.",
    },
    conceptIds: ["m05-call-put", "m09-correlation-realisee"],
  },
  glossary: [
    { term: { fr: "Rendement du panier", en: "Basket return" }, definition: { fr: "La moyenne pondérée des rendements individuels de chaque actif composant le panier.", en: "The weighted average of the individual returns of each asset in the basket." } },
  ],
  intuition: {
    fr: "Plutôt qu'un payoff sur un seul actif, on peut construire un payoff qui dépend de PLUSIEURS actifs à la fois — soit en les moyennant (panier), soit en ne retenant que le pire d'entre eux (Worst-Of), soit en ne retenant que le meilleur (Best-Of).",
    en: "Rather than a payoff on a single asset, one can build a payoff depending on SEVERAL assets at once — either by averaging them (basket), or by only keeping the worst of them (Worst-Of), or only the best (Best-Of).",
  },
  definition: {
    fr: "Un panier (basket) a un payoff basé sur la moyenne pondérée des rendements de ses composants : Payoff_panier = max(Σw_i×R_i − K, 0) pour un call. Un Worst-Of a un payoff basé sur le PIRE rendement parmi les composants : Payoff_WorstOf = max(min(R_1,...,R_n) − K, 0). Un Best-Of retient le MEILLEUR : Payoff_BestOf = max(max(R_1,...,R_n) − K, 0).",
    en: "A basket has a payoff based on the weighted average of its components' returns: Payoff_basket = max(Σw_i×R_i − K, 0) for a call. A Worst-Of has a payoff based on the WORST return among the components: Payoff_WorstOf = max(min(R_1,...,R_n) − K, 0). A Best-Of keeps the BEST: Payoff_BestOf = max(max(R_1,...,R_n) − K, 0).",
  },
  utility: {
    fr: "Ces structures sont omniprésentes dans les produits structurés (voir M11) : un Worst-Of permet à un émetteur d'offrir un coupon plus élevé qu'une option classique, en échange pour l'investisseur d'un risque accru (le pire actif détermine le résultat, pas une moyenne).",
    en: "These structures are omnipresent in structured products (see M11): a Worst-Of lets an issuer offer a higher coupon than a classic option, in exchange for the investor taking on higher risk (the worst asset determines the outcome, not an average).",
  },
  example: {
    fr: "Un Worst-Of call sur 3 actions a un strike K=0% (performance nulle). Les rendements réalisés sont +15%, +8%, −5%. Le Worst-Of retient le pire, −5%, donc le payoff est max(−5%−0%, 0) = 0 : malgré deux actions largement positives, le Worst-Of ne paie rien à cause de la troisième. Un panier équipondéré, lui, aurait donné (15%+8%−5%)/3 = 6%, un payoff positif.",
    en: "A Worst-Of call on 3 stocks has strike K=0% (zero performance). Realized returns are +15%, +8%, −5%. The Worst-Of keeps the worst, −5%, so the payoff is max(−5%−0%, 0) = 0: despite two largely positive stocks, the Worst-Of pays nothing because of the third. An equally-weighted basket, by contrast, would have given (15%+8%−5%)/3 = 6%, a positive payoff.",
  },
  alternativeExplanation: {
    fr: "Imaginez un examen noté de trois façons différentes : la note \"panier\" est la moyenne de trois épreuves ; la note \"Worst-Of\" retient la moins bonne des trois notes (on échoue si UNE SEULE épreuve est ratée, même si les deux autres sont excellentes) ; la note \"Best-Of\" retient la meilleure (il suffit qu'UNE épreuve soit réussie). Le Worst-Of est structurellement le plus exigeant des trois, le Best-Of le plus indulgent.",
    en: "Picture an exam graded three different ways: the \"basket\" grade is the average of three tests; the \"Worst-Of\" grade keeps the lowest of the three scores (you fail if just ONE test goes badly, even if the other two are excellent); the \"Best-Of\" grade keeps the highest (it's enough for JUST ONE test to succeed). Worst-Of is structurally the most demanding of the three, Best-Of the most lenient.",
  },
  formula: {
    latex: "\\text{Payoff}_{\\text{WorstOf call}} = \\max\\left(\\min_{i=1}^{n}(R_i) - K, 0\\right)",
    variables: [
      { symbol: "R_i", description: { fr: "Rendement réalisé de l'actif i à l'échéance", en: "Asset i's realized return at maturity" } },
      { symbol: "K", description: { fr: "Strike (souvent 0% ou une barrière négative)", en: "Strike (often 0% or a negative barrier)" } },
    ],
    assumptions: { fr: "Chaque R_i est mesuré comme une performance relative (S_T,i/S_0,i − 1), pas un prix absolu, pour rendre les actifs comparables.", en: "Each R_i is measured as a relative performance (S_T,i/S_0,i − 1), not an absolute price, to make the assets comparable." },
    units: { fr: "Payoff en proportion, multiplié par le notionnel pour un montant.", en: "Payoff as a proportion, multiplied by the notional for an amount." },
    example: { fr: "R = (15%, 8%, −5%), K=0% : min(R)=−5%, Payoff = max(−5%,0) = 0.", en: "R = (15%, 8%, −5%), K=0%: min(R)=−5%, Payoff = max(−5%,0) = 0." },
  },
  calculation: {
    fr: "1) Calculer le rendement de chaque actif du panier à l'échéance. 2) Selon la structure : moyenner pondéré (panier), prendre le minimum (Worst-Of), ou le maximum (Best-Of). 3) Comparer ce résultat au strike K. 4) Appliquer max(résultat−K, 0) pour un call, ou la formule symétrique pour un put.",
    en: "1) Compute each basket asset's return at maturity. 2) Depending on the structure: weighted average (basket), take the minimum (Worst-Of), or the maximum (Best-Of). 3) Compare this result to strike K. 4) Apply max(result−K, 0) for a call, or the symmetric formula for a put.",
  },
  interpretation: {
    fr: "Un Worst-Of call est TOUJOURS moins cher qu'un call sur le meilleur actif seul (voire souvent moins cher qu'un call sur n'importe lequel des actifs pris individuellement), car sa condition de succès est plus stricte : il faut que TOUS les actifs performent bien, pas un seul. C'est cette \"décote structurelle\" que les émetteurs de produits structurés exploitent pour offrir des coupons attractifs (voir M11).",
    en: "A Worst-Of call is ALWAYS cheaper than a call on the best single asset (often even cheaper than a call on any individual asset), since its success condition is stricter: ALL assets must perform well, not just one. This \"structural discount\" is what structured product issuers exploit to offer attractive coupons (see M11).",
  },
  pitfalls: {
    fr: "Croire qu'un Worst-Of se comporte comme un panier avec une pondération différente : ce sont des mécanismes fondamentalement différents (moyenne vs extremum), avec des sensibilités très différentes à la corrélation (voir M09-5). Autre piège : négliger qu'un seul actif très volatil ou en forte baisse peut à lui seul \"tuer\" le payoff d'un Worst-Of, même avec de nombreux autres actifs performants.",
    en: "Believing a Worst-Of behaves like a basket with different weighting: these are fundamentally different mechanisms (average vs extremum), with very different sensitivities to correlation (see M09-5). Another trap: neglecting that a single very volatile or sharply declining asset can alone \"kill\" a Worst-Of's payoff, even with many other well-performing assets.",
  },
  keyPoints: {
    fr: [
      "Panier : moyenne pondérée des rendements. Worst-Of : le pire rendement. Best-Of : le meilleur.",
      "Un Worst-Of call est structurellement moins cher qu'un call sur le meilleur actif seul.",
      "Ces structures sont la brique de base de nombreux produits structurés (autocalls, voir M11).",
    ],
    en: [
      "Basket: weighted average of returns. Worst-Of: the worst return. Best-Of: the best.",
      "A Worst-Of call is structurally cheaper than a call on the best single asset alone.",
      "These structures are the building block of many structured products (autocalls, see M11).",
    ],
  },
  advancedDemonstration: {
    fr: "Le pricing d'un Worst-Of ou d'un Best-Of nécessite généralement une simulation Monte-Carlo (M06-7) sous un modèle multi-actifs corrélés (browniens corrélés par la matrice de corrélation, voir M09-1), car il n'existe pas de formule fermée générale au-delà de deux actifs. La sensibilité d'un Worst-Of à la corrélation est structurellement négative pour un call (une corrélation plus élevée entre les actifs réduit la probabilité qu'un seul actif \"traîne\" loin derrière les autres, ce qui améliore le pire résultat en moyenne) — mais cette relation peut s'inverser selon le type exact de payoff (call vs put, présence de barrières), d'où la prudence nécessaire à généraliser un signe unique, développée en détail en M09-5.",
    en: "Pricing a Worst-Of or Best-Of generally requires Monte-Carlo simulation (M06-7) under a multi-asset correlated model (Brownian motions correlated via the correlation matrix, see M09-1), since no general closed-form formula exists beyond two assets. A Worst-Of call's sensitivity to correlation is structurally negative (higher correlation between assets reduces the chance a single asset \"lags\" far behind the others, which improves the worst outcome on average) — but this relationship can flip depending on the exact payoff type (call vs put, presence of barriers), hence the care needed before generalizing a single sign, developed in detail in M09-5.",
  },
};
