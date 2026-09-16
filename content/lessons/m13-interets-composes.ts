import type { LessonContent } from "@/lib/lesson-types";

export const m13InteretsComposes: LessonContent = {
  conceptId: "m13-interets-composes",
  glossary: [
    { term: { fr: "Capitalisation", en: "Compounding" }, definition: { fr: "Le processus par lequel les intérêts déjà générés produisent eux-mêmes des intérêts lors des périodes suivantes.", en: "The process by which already-generated interest itself produces interest in subsequent periods." } },
  ],
  intuition: {
    fr: "La différence entre intérêts simples et intérêts composés tient en une phrase : avec les intérêts composés, les intérêts d'hier génèrent eux-mêmes des intérêts aujourd'hui, ce qui crée une croissance accélérée (exponentielle) plutôt que linéaire au fil du temps.",
    en: "The difference between simple and compound interest comes down to one sentence: with compound interest, yesterday's interest itself generates interest today, creating accelerated (exponential) rather than linear growth over time.",
  },
  definition: {
    fr: "Les intérêts simples se calculent uniquement sur le capital initial : Valeur = C₀ × (1 + r×t). Les intérêts composés se calculent sur le capital ET les intérêts déjà accumulés : Valeur = C₀ × (1+r)^t. Quand la fréquence de capitalisation devient infiniment fréquente (chaque instant), on parle de capitalisation continue : Valeur = C₀ × e^(rt), la limite mathématique du cas composé quand le nombre de périodes de capitalisation par an tend vers l'infini.",
    en: "Simple interest is computed only on the initial capital: Value = C₀ × (1 + r×t). Compound interest is computed on the capital AND the already-accumulated interest: Value = C₀ × (1+r)^t. When compounding frequency becomes infinitely frequent (every instant), it's called continuous compounding: Value = C₀ × e^(rt), the mathematical limit of the compound case as the number of compounding periods per year tends to infinity.",
  },
  utility: {
    fr: "Cette distinction est le fondement de toute la finance quantitative : le pricing d'obligations (M03), l'actualisation de flux futurs (M13-mathfin-b), et même les formules de Black-Scholes (M06) utilisent la capitalisation continue par convention, car elle simplifie considérablement le calcul différentiel sous-jacent aux modèles de pricing.",
    en: "This distinction is the foundation of all quantitative finance: bond pricing (M03), discounting future cash flows (M13-mathfin-b), and even the Black-Scholes formulas (M06) use continuous compounding by convention, since it considerably simplifies the differential calculus underlying pricing models.",
  },
  example: {
    fr: "Un capital de 1000 € placé à 5% par an pendant 10 ans : en intérêts simples, il vaut 1000×(1+0,05×10) = 1500 €. En intérêts composés annuels, il vaut 1000×(1,05)^10 ≈ 1628,89 €. En capitalisation continue, il vaut 1000×e^(0,05×10) ≈ 1648,72 € — l'écart entre les trois méthodes grandit avec le temps et le taux.",
    en: "A capital of €1,000 invested at 5% per year for 10 years: with simple interest, it's worth 1000×(1+0.05×10) = €1,500. With annual compound interest, it's worth 1000×(1.05)^10 ≈ €1,628.89. With continuous compounding, it's worth 1000×e^(0.05×10) ≈ €1,648.72 — the gap between the three methods grows with time and the rate.",
  },
  alternativeExplanation: {
    fr: "Les intérêts simples, c'est comme un jardinier qui récolte chaque année les fruits d'un seul arbre planté au départ, sans jamais replanter les graines. Les intérêts composés, c'est le même jardinier qui replante systématiquement chaque graine récoltée, faisant croître une forêt de plus en plus dense — la récolte totale finit par croître bien plus vite qu'avec un seul arbre.",
    en: "Simple interest is like a gardener who harvests each year's fruit from a single originally planted tree, never replanting the seeds. Compound interest is the same gardener systematically replanting every harvested seed, growing an increasingly dense forest — the total harvest ends up growing much faster than with a single tree.",
  },
  formula: {
    latex: "V_t = C_0 \\times e^{rt}",
    variables: [
      { symbol: "C_0", description: { fr: "Capital initial", en: "Initial capital" } },
      { symbol: "r", description: { fr: "Taux d'intérêt annuel continu", en: "Continuous annual interest rate" } },
      { symbol: "t", description: { fr: "Durée en années", en: "Duration in years" } },
    ],
    assumptions: { fr: "Capitalisation continue ; pour une capitalisation discrète n fois par an, remplacer par C₀×(1+r/n)^(nt).", en: "Continuous compounding; for discrete compounding n times per year, replace with C₀×(1+r/n)^(nt)." },
    units: { fr: "Même devise que C₀.", en: "Same currency as C₀." },
    example: { fr: "C₀=1000, r=5%, t=10 : V = 1000×e^0,5 ≈ 1648,72.", en: "C₀=1000, r=5%, t=10: V = 1000×e^0.5 ≈ 1648.72." },
  },
  calculation: {
    fr: "1) Identifier le capital initial, le taux et la durée. 2) Déterminer la convention de capitalisation (simple, composée discrète, ou continue) — ce choix change significativement le résultat sur longue durée. 3) Appliquer la formule correspondante. 4) Pour comparer deux taux à fréquences de capitalisation différentes, toujours les convertir d'abord dans la même convention (taux équivalent).",
    en: "1) Identify the initial capital, rate and duration. 2) Determine the compounding convention (simple, discrete compound, or continuous) — this choice significantly changes the result over long durations. 3) Apply the corresponding formula. 4) To compare two rates with different compounding frequencies, always convert them to the same convention first (equivalent rate).",
  },
  interpretation: {
    fr: "Plus l'horizon de temps est long, plus l'écart entre intérêts simples et composés devient important — c'est pourquoi la capitalisation composée est toujours utilisée pour des placements ou des dettes de long terme. Un taux annoncé \"par an\" doit toujours être interprété avec sa convention de capitalisation précisée, sous peine de comparer des taux non comparables.",
    en: "The longer the time horizon, the larger the gap between simple and compound interest becomes — which is why compound compounding is always used for long-term investments or debts. A rate announced \"per year\" must always be interpreted with its compounding convention specified, or risk comparing non-comparable rates.",
  },
  pitfalls: {
    fr: "Comparer deux taux d'intérêt sans vérifier qu'ils utilisent la même convention de capitalisation (par exemple, un taux composé mensuellement n'est pas directement comparable à un taux composé annuellement, même si les deux affichent le même pourcentage nominal). Autre piège : utiliser des intérêts simples pour un horizon long, ce qui sous-estime fortement la croissance réelle d'un capital réinvesti.",
    en: "Comparing two interest rates without checking they use the same compounding convention (for example, a monthly-compounded rate isn't directly comparable to an annually-compounded rate, even if both display the same nominal percentage). Another trap: using simple interest for a long horizon, which strongly understates a reinvested capital's real growth.",
  },
  keyPoints: {
    fr: [
      "Intérêts simples : croissance linéaire, calculée uniquement sur le capital initial.",
      "Intérêts composés : croissance exponentielle, les intérêts génèrent eux-mêmes des intérêts.",
      "La capitalisation continue (e^(rt)) est la limite mathématique utilisée par convention dans la plupart des modèles de pricing.",
    ],
    en: [
      "Simple interest: linear growth, computed only on the initial capital.",
      "Compound interest: exponential growth, interest itself generates interest.",
      "Continuous compounding (e^(rt)) is the mathematical limit used by convention in most pricing models.",
    ],
  },
  advancedDemonstration: {
    fr: "La capitalisation continue se dérive comme la limite de la capitalisation discrète quand la fréquence n tend vers l'infini : lim_{n→∞} (1+r/n)^(nt) = e^(rt), un résultat classique d'analyse qui explique pourquoi cette convention, bien que jamais observée littéralement sur un marché réel (les intérêts ne sont jamais versés \"à chaque instant\"), reste le standard mathématique en finance quantitative — elle rend le taux d'intérêt directement compatible avec le calcul différentiel utilisé pour dériver des modèles comme Black-Scholes (M06-4).",
    en: "Continuous compounding derives as the limit of discrete compounding as frequency n tends to infinity: lim_{n→∞} (1+r/n)^(nt) = e^(rt), a classic analysis result explaining why this convention, though never literally observed in a real market (interest is never paid \"at every instant\"), remains the mathematical standard in quantitative finance — it makes the interest rate directly compatible with the differential calculus used to derive models like Black-Scholes (M06-4).",
  },
};
