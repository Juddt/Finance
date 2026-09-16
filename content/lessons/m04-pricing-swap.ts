import type { LessonContent } from "@/lib/lesson-types";

export const m04PricingSwap: LessonContent = {
  conceptId: "m04-pricing-swap",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la structure d'un swap fixe/variable et savoir actualiser des flux avec des facteurs d'actualisation.",
      en: "You need to know a fixed/floating swap's structure and how to discount cash flows with discount factors.",
    },
    conceptIds: ["m04-swap-fixe-variable", "m03-pricing-obligation"],
  },
  glossary: [
    { term: { fr: "Facteur d'actualisation (DF)", en: "Discount factor (DF)" }, definition: { fr: "Le coefficient DF_t = 1/(1+z_t)^t qui ramène un flux futur reçu en t à sa valeur d'aujourd'hui.", en: "The coefficient DF_t = 1/(1+z_t)^t that brings a future cash flow received at t back to today's value." } },
  ],
  intuition: {
    fr: "Un swap se price de deux façons totalement équivalentes : soit en le voyant comme la différence entre deux obligations imaginaires (une à taux fixe, une à taux variable), soit en additionnant la valeur de chaque échange de flux futur comme une série de mini-forwards. Les deux méthodes donnent exactement le même prix.",
    en: "A swap can be priced in two fully equivalent ways: either by seeing it as the difference between two imaginary bonds (one fixed-rate, one floating-rate), or by summing the value of each future exchange as a series of mini-forwards. Both methods give exactly the same price.",
  },
  definition: {
    fr: "Méthode 1 (différence de jambes obligataires) : la valeur du swap pour le receveur fixe est V = B_fixe − B_variable, où B_fixe est le prix d'une obligation à coupon R_fixe et B_variable le prix d'une obligation à taux variable (qui vaut toujours son nominal juste après chaque reset). Méthode 2 (décomposition en FRA) : V = Σ DF_t × Notionnel × (R_fixe − f_t) × δ_t, où f_t est le taux forward implicite de chaque période, chaque échange étant traité comme un FRA actualisé séparément.",
    en: "Method 1 (bond-legs difference): the swap's value for the fixed receiver is V = B_fixed − B_floating, where B_fixed is the price of a bond with coupon R_fixed and B_floating the price of a floating-rate bond (always worth its face value right after each reset). Method 2 (FRA decomposition): V = Σ DF_t × Notional × (R_fixed − f_t) × δ_t, where f_t is each period's implied forward rate, each exchange treated as a separately discounted FRA.",
  },
  utility: {
    fr: "Pricer un swap est indispensable pour coter le taux au pair d'un nouveau swap, valoriser un swap existant en cours de vie (mark-to-market), et comprendre le lien profond entre marché obligataire et marché des swaps.",
    en: "Pricing a swap is essential to quote the par rate of a new swap, mark an existing swap to market during its life, and understand the deep link between the bond market and the swap market.",
  },
  example: {
    fr: "Swap 2 ans, notionnel 1 000 000, coupons annuels. DF_1 = 0,97, DF_2 = 0,94. Le taux au pair R résout : R × (DF_1 + DF_2) + DF_2 = 1 (la jambe variable vaut toujours 1 au pair). R = (1 − DF_2)/(DF_1+DF_2) = (1−0,94)/(0,97+0,94) = 0,06/1,91 ≈ 3,14%.",
    en: "2-year swap, notional 1,000,000, annual coupons. DF_1 = 0.97, DF_2 = 0.94. The par rate R solves: R × (DF_1 + DF_2) + DF_2 = 1 (the floating leg is always worth 1 at par). R = (1 − DF_2)/(DF_1+DF_2) = (1−0.94)/(0.97+0.94) = 0.06/1.91 ≈ 3.14%.",
  },
  alternativeExplanation: {
    fr: "La clé de la méthode 1 est une propriété remarquable : une obligation à taux variable vaut TOUJOURS son nominal exactement après chaque reset (puisque son coupon s'ajuste immédiatement aux conditions de marché, comme un compte rémunéré au taux du jour). La jambe variable d'un swap se price donc \"gratuitement\" comme valant 1 (en proportion du nominal) : tout le travail de pricing se concentre alors sur la seule jambe fixe, comme une obligation classique.",
    en: "The key to method 1 is a remarkable property: a floating-rate bond is ALWAYS worth exactly its face value right after each reset (since its coupon immediately adjusts to market conditions, like a savings account paid at today's rate). The swap's floating leg therefore prices \"for free\" as being worth 1 (as a proportion of face value): all the pricing work then focuses on the fixed leg alone, like a plain bond.",
  },
  formula: {
    latex: "R_{\\text{au pair}} = \\frac{1 - DF_N}{\\sum_{t=1}^{N} DF_t \\times \\delta_t}",
    variables: [
      { symbol: "DF_t", description: { fr: "Facteur d'actualisation à la date t", en: "Discount factor at date t" } },
      { symbol: "DF_N", description: { fr: "Facteur d'actualisation à la dernière échéance N", en: "Discount factor at the final maturity N" } },
      { symbol: "\\delta_t", description: { fr: "Fraction d'année de la période t", en: "Year fraction of period t" } },
    ],
    assumptions: { fr: "Cadre mono-courbe simplifié (même courbe pour actualisation et projection, voir M04-4) ; notionnel normalisé à 1.", en: "Simplified single-curve framework (same curve for discounting and projection, see M04-4); notional normalized to 1." },
    units: { fr: "R_au_pair en proportion annuelle.", en: "R_par as an annual proportion." },
    example: { fr: "DF1=0,97, DF2=0,94, δ=1 : R = (1−0,94)/(0,97+0,94) ≈ 3,14%.", en: "DF1=0.97, DF2=0.94, δ=1: R = (1−0.94)/(0.97+0.94) ≈ 3.14%." },
  },
  calculation: {
    fr: "1) Construire la courbe des facteurs d'actualisation DF_t pour chaque date de flux. 2) Sommer Σ DF_t × δ_t (la valeur d'une \"annuité\" de 1 sur la durée du swap). 3) Calculer 1 − DF_N (la valeur de la jambe variable moins son remboursement final, qui se simplifie ainsi par construction). 4) Diviser pour obtenir le taux fixe au pair.",
    en: "1) Build the discount factor curve DF_t for each cash flow date. 2) Sum Σ DF_t × δ_t (the value of an \"annuity\" of 1 over the swap's life). 3) Compute 1 − DF_N (the floating leg's value minus its final repayment, which simplifies this way by construction). 4) Divide to get the fixed par rate.",
  },
  interpretation: {
    fr: "Le taux au pair d'un swap n'est ni le taux spot ni une moyenne simple des taux forward : c'est une moyenne pondérée par les facteurs d'actualisation de chaque période, ce qui le rapproche généralement (sans y être identique) du taux swap coté sur le marché pour cette même échéance.",
    en: "A swap's par rate is neither the spot rate nor a simple average of forward rates: it is a weighted average across periods, weighted by each period's discount factor, which generally brings it close to (without being identical to) the market-quoted swap rate for that same maturity.",
  },
  pitfalls: {
    fr: "Oublier le \"+DF_N\" dans le calcul de la jambe variable (le remboursement final implicite du nominal), qui est ce qui rend la formule aussi simple. Autre piège : mélanger les deux méthodes sans cohérence de courbe — les deux doivent utiliser exactement les mêmes DF pour donner le même résultat.",
    en: "Forgetting the \"+DF_N\" in the floating leg's calculation (the implicit final repayment of the notional), which is what makes the formula this simple. Another trap: mixing the two methods with inconsistent curves — both must use exactly the same DFs to give the same result.",
  },
  keyPoints: {
    fr: [
      "Méthode 1 : V = B_fixe − B_variable, où B_variable vaut toujours 1 (au pair) juste après un reset.",
      "Méthode 2 : V = somme des FRA actualisés de chaque période, équivalente à la méthode 1.",
      "R_au_pair = (1 − DF_N) / Σ DF_t δ_t : une moyenne pondérée par les facteurs d'actualisation.",
    ],
    en: [
      "Method 1: V = B_fixed − B_floating, where B_floating is always worth 1 (at par) right after a reset.",
      "Method 2: V = sum of each period's discounted FRA, equivalent to method 1.",
      "R_par = (1 − DF_N) / Σ DF_t δ_t: a discount-factor-weighted average.",
    ],
  },
  advancedDemonstration: {
    fr: "L'équivalence des deux méthodes se démontre en substituant f_t = (DF_{t-1}/DF_t − 1)/δ_t (le taux forward implicite entre deux dates consécutives) dans la formule de la méthode 2, puis en développant la somme télescopique Σ DF_t × f_t × δ_t = Σ (DF_{t-1} − DF_t) = DF_0 − DF_N = 1 − DF_N (car DF_0=1) : on retombe exactement sur le numérateur de la méthode 1. Cette démonstration explique pourquoi le choix de la méthode est purement une question de commodité de calcul, jamais un choix qui affecterait le résultat — à condition d'utiliser la même courbe des DF dans les deux cas.",
    en: "The equivalence of the two methods is shown by substituting f_t = (DF_{t-1}/DF_t − 1)/δ_t (the implied forward rate between two consecutive dates) into method 2's formula, then expanding the telescoping sum Σ DF_t × f_t × δ_t = Σ (DF_{t-1} − DF_t) = DF_0 − DF_N = 1 − DF_N (since DF_0=1): this lands exactly on method 1's numerator. This proof explains why the choice of method is purely a matter of computational convenience, never a choice that affects the result — provided the same DF curve is used in both.",
  },
};
