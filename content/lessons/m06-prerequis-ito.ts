import type { LessonContent } from "@/lib/lesson-types";

export const m06PrerequisIto: LessonContent = {
  conceptId: "m06-prerequis-ito",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le brownien géométrique et la formule de dérivée d'une fonction composée du calcul classique.",
      en: "You need to know geometric Brownian motion and the chain rule from ordinary calculus.",
    },
    conceptIds: ["m06-brownien-arithmetique-geometrique"],
  },
  glossary: [
    { term: { fr: "Martingale", en: "Martingale" }, definition: { fr: "Un processus dont la meilleure prévision de la valeur future, sachant le présent, est exactement la valeur actuelle — \"pas de tendance prévisible\".", en: "A process whose best forecast of its future value, given the present, is exactly the current value — \"no predictable trend\"." } },
    { term: { fr: "Mesure risque-neutre", en: "Risk-neutral measure" }, definition: { fr: "Une probabilité fictive sous laquelle tous les actifs actualisés au taux sans risque sont des martingales, utilisée pour pricer sans avoir besoin de connaître le vrai rendement attendu des investisseurs.", en: "A fictitious probability under which all assets discounted at the risk-free rate are martingales, used to price without needing to know investors' true expected return." } },
  ],
  intuition: {
    fr: "En calcul classique, une petite variation dx au carré est négligeable. En calcul stochastique, ce n'est plus vrai : (dW_t)² se comporte comme dt, pas comme zéro — cette différence, en apparence minime, change toute la façon de dériver une fonction d'un processus aléatoire.",
    en: "In ordinary calculus, a small change dx squared is negligible. In stochastic calculus, that's no longer true: (dW_t)² behaves like dt, not zero — this seemingly small difference changes the entire way of differentiating a function of a random process.",
  },
  definition: {
    fr: "Le lemme d'Itô donne la différentielle d'une fonction f(t, X_t) d'un processus X_t vérifiant dX_t = μ_t dt + σ_t dW_t : df = (∂f/∂t + μ_t ∂f/∂x + ½σ_t² ∂²f/∂x²) dt + σ_t ∂f/∂x dW_t. Le terme en ½σ_t²∂²f/∂x² est le terme additionnel, absent du calcul classique, qui vient de la règle (dW_t)² = dt.",
    en: "Itô's lemma gives the differential of a function f(t, X_t) of a process X_t satisfying dX_t = μ_t dt + σ_t dW_t: df = (∂f/∂t + μ_t ∂f/∂x + ½σ_t² ∂²f/∂x²) dt + σ_t ∂f/∂x dW_t. The ½σ_t²∂²f/∂x² term is the additional term, absent from ordinary calculus, coming from the rule (dW_t)² = dt.",
  },
  utility: {
    fr: "Le lemme d'Itô est l'outil qui permet de dériver la dynamique de n'importe quelle fonction d'un actif suivant un brownien géométrique — c'est ainsi qu'on obtient l'équation de Black-Scholes (M06-4) en appliquant Itô au prix d'une option, vu comme une fonction du sous-jacent et du temps.",
    en: "Itô's lemma is the tool that lets you derive the dynamics of any function of an asset following a geometric Brownian motion — this is how the Black-Scholes equation (M06-4) is obtained, by applying Itô to an option's price, seen as a function of the underlying and time.",
  },
  example: {
    fr: "Pour f(S) = ln(S), avec S suivant un brownien géométrique dS = μS dt + σS dW : ∂f/∂S = 1/S, ∂²f/∂S² = −1/S². Le lemme d'Itô donne d(ln S) = (μ − σ²/2) dt + σ dW — c'est exactement la correction d'Itô rencontrée en M06-2, maintenant justifiée formellement.",
    en: "For f(S) = ln(S), with S following a geometric Brownian motion dS = μS dt + σS dW: ∂f/∂S = 1/S, ∂²f/∂S² = −1/S². Itô's lemma gives d(ln S) = (μ − σ²/2) dt + σ dW — exactly the Itô correction seen in M06-2, now formally justified.",
  },
  alternativeExplanation: {
    fr: "Pensez à un développement de Taylor classique : df ≈ (∂f/∂t)dt + (∂f/∂x)dx + ½(∂²f/∂x²)(dx)². En calcul classique, on ignore (dx)² car il est \"infiniment plus petit\" que dx ou dt. En calcul stochastique, (dW_t)² n'est PAS négligeable devant dt — les deux sont du même ordre de grandeur — donc ce terme survit et doit être gardé. Le lemme d'Itô n'est rien d'autre qu'un développement de Taylor qui garde ce terme habituellement jeté à la poubelle.",
    en: "Think of an ordinary Taylor expansion: df ≈ (∂f/∂t)dt + (∂f/∂x)dx + ½(∂²f/∂x²)(dx)². In ordinary calculus, (dx)² is ignored as \"infinitely smaller\" than dx or dt. In stochastic calculus, (dW_t)² is NOT negligible compared to dt — the two are the same order of magnitude — so this term survives and must be kept. Itô's lemma is nothing more than a Taylor expansion that keeps this term usually thrown away.",
  },
  formula: {
    latex: "df = \\left(\\frac{\\partial f}{\\partial t} + \\mu \\frac{\\partial f}{\\partial x} + \\frac{1}{2}\\sigma^{2}\\frac{\\partial^{2} f}{\\partial x^{2}}\\right) dt + \\sigma \\frac{\\partial f}{\\partial x} dW_t",
    variables: [
      { symbol: "\\partial f/\\partial t", description: { fr: "Sensibilité de f au temps qui passe (toutes choses égales par ailleurs)", en: "f's sensitivity to the passage of time (all else equal)" } },
      { symbol: "\\partial f/\\partial x, \\partial^2 f/\\partial x^2", description: { fr: "Dérivées première et seconde de f par rapport au processus sous-jacent", en: "First and second derivatives of f with respect to the underlying process" } },
    ],
    assumptions: { fr: "f doit être deux fois différentiable en x et une fois en t ; X_t suit une diffusion dX_t = μdt + σdW_t.", en: "f must be twice differentiable in x and once in t; X_t follows a diffusion dX_t = μdt + σdW_t." },
    units: { fr: "Dépend de la fonction f considérée.", en: "Depends on the function f considered." },
    example: { fr: "f(S)=ln(S) : df = (μ−σ²/2)dt + σdW_t (voir exemple ci-dessus).", en: "f(S)=ln(S): df = (μ−σ²/2)dt + σdW_t (see example above)." },
  },
  calculation: {
    fr: "1) Identifier la fonction f(t,X_t) dont on cherche la dynamique. 2) Calculer ses dérivées partielles ∂f/∂t, ∂f/∂x, ∂²f/∂x². 3) Identifier μ et σ de la diffusion suivie par X_t. 4) Assembler selon la formule d'Itô : terme en dt = ∂f/∂t + μ∂f/∂x + ½σ²∂²f/∂x², terme en dW_t = σ∂f/∂x.",
    en: "1) Identify the function f(t,X_t) whose dynamics are sought. 2) Compute its partial derivatives ∂f/∂t, ∂f/∂x, ∂²f/∂x². 3) Identify μ and σ of the diffusion followed by X_t. 4) Assemble per Itô's formula: dt term = ∂f/∂t + μ∂f/∂x + ½σ²∂²f/∂x², dW_t term = σ∂f/∂x.",
  },
  interpretation: {
    fr: "Le terme ½σ²∂²f/∂x² capture l'effet de la convexité de f sur son espérance : même si X_t n'a pas de tendance (μ=0), une fonction f convexe de X_t (∂²f/∂x²>0) a tendance à croître en moyenne, purement à cause de la variance — un lien direct avec la convexité obligataire (M03-4) et le Gamma des options (M07-1).",
    en: "The ½σ²∂²f/∂x² term captures the effect of f's convexity on its expectation: even if X_t has no trend (μ=0), a convex function f of X_t (∂²f/∂x²>0) tends to grow on average, purely because of variance — a direct link to bond convexity (M03-4) and option Gamma (M07-1).",
  },
  pitfalls: {
    fr: "Oublier le terme en ½σ²∂²f/∂x² et appliquer la règle de dérivation classique : c'est l'erreur la plus fondamentale du calcul stochastique. Autre piège : appliquer le lemme d'Itô à une fonction non deux-fois-différentiable, ou oublier que le résultat dépend explicitement de σ, pas seulement de μ.",
    en: "Forgetting the ½σ²∂²f/∂x² term and applying the ordinary chain rule: the most fundamental mistake in stochastic calculus. Another trap: applying Itô's lemma to a function that isn't twice differentiable, or forgetting the result explicitly depends on σ, not just μ.",
  },
  keyPoints: {
    fr: [
      "Règle clé : (dW_t)² = dt (pas 0 comme en calcul classique) — la source de tout le lemme d'Itô.",
      "df garde un terme additionnel ½σ²∂²f/∂x² par rapport à la dérivation classique.",
      "La mesure risque-neutre permet de pricer en remplaçant le vrai drift μ par le taux sans risque r.",
    ],
    en: [
      "Key rule: (dW_t)² = dt (not 0 as in ordinary calculus) — the source of Itô's entire lemma.",
      "df keeps an additional ½σ²∂²f/∂x² term compared to ordinary differentiation.",
      "The risk-neutral measure lets you price by replacing the true drift μ with the risk-free rate r.",
    ],
  },
  advancedDemonstration: {
    fr: "Le théorème de Girsanov justifie formellement le changement de mesure risque-neutre : il montre qu'on peut changer la probabilité sous-jacente (de la mesure réelle P à une mesure risque-neutre Q) de façon à transformer un brownien avec dérive en un brownien standard sans dérive, ce qui revient à remplacer μ par r dans toutes les formules de pricing — sans changer la volatilité σ, qui elle reste identique sous les deux mesures. C'est ce théorème qui justifie rigoureusement pourquoi le pricing par absence d'arbitrage (M01-4) ne dépend jamais du rendement attendu réel d'un actif, seulement de sa volatilité et du taux sans risque — une simplification remarquable exploitée par Black et Scholes.",
    en: "Girsanov's theorem formally justifies the risk-neutral measure change: it shows the underlying probability can be changed (from the real-world measure P to a risk-neutral measure Q) in a way that transforms a Brownian motion with drift into a standard driftless one, which amounts to replacing μ with r in all pricing formulas — without changing the volatility σ, which stays identical under both measures. This theorem rigorously justifies why no-arbitrage pricing (M01-4) never depends on an asset's true expected return, only on its volatility and the risk-free rate — a remarkable simplification exploited by Black and Scholes.",
  },
};
