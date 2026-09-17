import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const itoRuleTemplate: QuestionTemplate = {
  id: "m06-ito-regle",
  conceptId: "m06-prerequis-ito",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "En calcul stochastique, à quoi (dW_t)² est-il égal, contrairement au calcul classique où (dx)² est négligé ?",
      en: "In stochastic calculus, what does (dW_t)² equal, unlike ordinary calculus where (dx)² is ignored?",
    },
    choices: buildChoices([
      { id: "dt", label: { fr: "dt", en: "dt" } },
      { id: "zero", label: { fr: "0", en: "0" } },
      { id: "dwt", label: { fr: "dW_t", en: "dW_t" } },
    ]),
    hint: { fr: "C'est cette règle qui fait toute la différence du lemme d'Itô par rapport au calcul classique.", en: "This rule is what makes Itô's lemma different from ordinary calculus." },
    correctChoiceIds: ["dt"],
    explanation: {
      fr: "La règle fondamentale du calcul d'Itô est (dW_t)² = dt : ce terme, négligeable en calcul classique, ne l'est pas ici et donne naissance au terme additionnel du lemme d'Itô.",
      en: "The fundamental rule of Itô calculus is (dW_t)² = dt: this term, negligible in ordinary calculus, is not here, giving rise to Itô's lemma's additional term.",
    },
    commonMistake: {
      fr: "Croire que (dW_t)² est négligeable comme en calcul classique, ce qui fait perdre le terme clé du lemme d'Itô.",
      en: "Believing (dW_t)² is negligible as in ordinary calculus, losing Itô's lemma's key term.",
    },
  }),
};

const itoTermTemplate: QuestionTemplate = {
  id: "m06-ito-terme-additionnel",
  conceptId: "m06-prerequis-ito",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le lemme d'Itô ajoute un terme en ½σ²∂²f/∂x² par rapport à la règle de dérivation classique d'une fonction composée.",
      en: "Itô's lemma adds a ½σ²∂²f/∂x² term compared to the ordinary chain rule for a composite function.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : c'est précisément ce terme additionnel, issu de (dW_t)²=dt, qui distingue le lemme d'Itô du calcul classique.",
      en: "True: this is precisely the additional term, coming from (dW_t)²=dt, that distinguishes Itô's lemma from ordinary calculus.",
    },
    commonMistake: {
      fr: "Oublier ce terme et appliquer la règle de dérivation classique à une fonction d'un processus stochastique.",
      en: "Forgetting this term and applying the ordinary chain rule to a function of a stochastic process.",
    },
  }),
};

const riskNeutralTemplate: QuestionTemplate = {
  id: "m06-ito-mesure-risque-neutre",
  conceptId: "m06-prerequis-ito",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "replace", fr: "remplacer le vrai drift μ par le taux sans risque r dans les formules de pricing", en: "replace the true drift μ with the risk-free rate r in pricing formulas" },
        { id: "keep-vol", fr: "conserver la même volatilité σ que sous la mesure réelle", en: "keep the same volatility σ as under the real-world measure" },
      ] as const
    );

    return {
      prompt: {
        fr: `Le passage à la mesure risque-neutre permet de ${scenario.fr}. Cette affirmation est-elle correcte ?`,
        en: `Switching to the risk-neutral measure lets you ${scenario.en}. Is this statement correct?`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: { fr: "Le théorème de Girsanov ne change que le drift, jamais la volatilité.", en: "Girsanov's theorem only changes the drift, never the volatility." },
      correctChoiceIds: ["true"],
      explanation: {
        fr: `${scenario.id === "replace" ? "Vrai : c'est exactement le résultat du théorème de Girsanov, qui permet de pricer sans connaître le vrai rendement attendu des investisseurs." : "Vrai : la volatilité σ reste identique sous la mesure réelle et sous la mesure risque-neutre, seul le drift change."}`,
        en: `${scenario.id === "replace" ? "True: this is exactly the result of Girsanov's theorem, which lets you price without knowing investors' true expected return." : "True: volatility σ stays identical under the real-world and risk-neutral measures, only the drift changes."}`,
      },
      commonMistake: {
        fr: "Croire que le changement de mesure risque-neutre modifie aussi la volatilité, ce qui est faux.",
        en: "Believing the risk-neutral measure change also modifies volatility, which is false.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-ito-vocab",
  conceptId: "m06-prerequis-ito",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un processus dont la meilleure prévision de la valeur future, sachant le présent, est exactement la valeur actuelle, s'appelle une ______.",
      en: "A process whose best forecast of its future value, given the present, is exactly the current value, is called a ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["martingale"],
    hint: { fr: "Le terme utilisé pour \"pas de tendance prévisible\".", en: "The term used for \"no predictable trend\"." },
    explanation: {
      fr: "Une martingale n'a, par définition, aucune tendance prévisible — c'est le comportement de tout actif actualisé sous la mesure risque-neutre.",
      en: "A martingale has, by definition, no predictable trend — the behavior of any discounted asset under the risk-neutral measure.",
    },
    commonMistake: {
      fr: "Confondre martingale avec mouvement brownien, alors qu'un mouvement brownien est un exemple particulier de martingale, pas l'inverse.",
      en: "Confusing martingale with Brownian motion, when Brownian motion is a particular example of a martingale, not the other way around.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m06-ito-comprehension-utilite",
  conceptId: "m06-prerequis-ito",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi le lemme d'Itô est-il indispensable pour dériver la formule de Black-Scholes, plutôt que la simple règle de dérivation composée du calcul classique ?",
    en: "Why is Itô's lemma indispensable for deriving the Black-Scholes formula, rather than ordinary calculus's simple chain rule?",
  },
  choices: [
    { id: "function-of-stochastic", label: { fr: "Parce que le prix d'une option est une fonction du prix du sous-jacent, lui-même un processus stochastique dont la dynamique nécessite le terme additionnel du lemme d'Itô", en: "Because an option's price is a function of the underlying's price, itself a stochastic process whose dynamics require Itô's lemma's additional term" } },
    { id: "notation-only", label: { fr: "C'est purement une question de notation, sans conséquence sur le résultat final", en: "It's purely a notation matter, with no consequence on the final result" } },
    { id: "only-for-exotics", label: { fr: "Le lemme d'Itô n'est nécessaire que pour les produits exotiques, pas pour les options vanilles", en: "Itô's lemma is only needed for exotic products, not vanilla options" } },
  ],
  correctId: "function-of-stochastic",
  hint: { fr: "Le prix d'une option C(S_t,t) est une fonction d'un processus aléatoire S_t : quelle règle de dérivation s'applique à une fonction d'un tel processus ?", en: "An option's price C(S_t,t) is a function of a random process S_t: which differentiation rule applies to a function of such a process?" },
  explanation: {
    fr: "Le prix d'une option est une fonction C(S_t,t) du prix du sous-jacent S_t, qui suit lui-même une dynamique stochastique (brownien géométrique) : appliquer la règle de dérivation classique à cette fonction composée donnerait un résultat incorrect, car elle ignore le terme additionnel ½σ²∂²C/∂S² issu de (dW_t)²=dt. Ce terme, dès la dérivation de Black-Scholes (une option vanille standard), est essentiel — le lemme d'Itô n'est donc pas réservé aux produits exotiques.",
    en: "An option's price is a function C(S_t,t) of the underlying's price S_t, which itself follows stochastic dynamics (geometric Brownian motion): applying the ordinary chain rule to this composite function would give an incorrect result, since it ignores the additional ½σ²∂²C/∂S² term coming from (dW_t)²=dt. This term, right from the derivation of Black-Scholes (a standard vanilla option), is essential — Itô's lemma isn't reserved for exotic products.",
  },
  commonMistake: {
    fr: "Croire que le lemme d'Itô n'a d'utilité que pour des produits complexes, en oubliant qu'il est au cœur même de la dérivation de Black-Scholes pour une simple option vanille.",
    en: "Believing Itô's lemma is only useful for complex products, forgetting it lies at the very heart of Black-Scholes's derivation for a simple vanilla option.",
  },
});

const chainRuleComparisonTemplate = mcqTemplate({
  id: "m06-ito-comparaison-regle-chaine",
  conceptId: "m06-prerequis-ito",
  difficulty: "hard",
  prompt: {
    fr: "Pour f(x) = x², comparez df en calcul classique (df = 2x dx) et d[f(W_t)] en calcul d'Itô appliqué au brownien W_t. Quelle est la différence ?",
    en: "For f(x) = x², compare df in ordinary calculus (df = 2x dx) and d[f(W_t)] in Itô calculus applied to Brownian motion W_t. What is the difference?",
  },
  choices: [
    { id: "extra-dt-term", label: { fr: "Le calcul d'Itô ajoute un terme +dt : d(W_t²) = 2W_t dW_t + dt, absent de la règle classique", en: "Itô calculus adds a +dt term: d(W_t²) = 2W_t dW_t + dt, absent from the ordinary rule" } },
    { id: "same-result", label: { fr: "Les deux donnent exactement le même résultat, 2W_t dW_t", en: "Both give exactly the same result, 2W_t dW_t" } },
    { id: "sign-flip", label: { fr: "Le calcul d'Itô donne l'opposé du résultat classique", en: "Itô calculus gives the opposite of the ordinary result" } },
  ],
  correctId: "extra-dt-term",
  hint: { fr: "Le lemme d'Itô ajoute ½f''(x)(dx)² = ½×2×(dW_t)² = (dW_t)² = dt au résultat classique.", en: "Itô's lemma adds ½f''(x)(dx)² = ½×2×(dW_t)² = (dW_t)² = dt to the ordinary result." },
  explanation: {
    fr: "Le lemme d'Itô donne df = f'(x)dx + ½f''(x)(dx)². Pour f(x)=x², f'(x)=2x et f''(x)=2 : classiquement, df = 2x dx ; en calcul d'Itô appliqué à W_t, on ajoute ½×2×(dW_t)² = (dW_t)² = dt, donnant d(W_t²) = 2W_t dW_t + dt. Ce terme supplémentaire +dt est la signature caractéristique du calcul stochastique, absent du calcul classique.",
    en: "Itô's lemma gives df = f'(x)dx + ½f''(x)(dx)². For f(x)=x², f'(x)=2x and f''(x)=2: classically, df = 2x dx; in Itô calculus applied to W_t, we add ½×2×(dW_t)² = (dW_t)² = dt, giving d(W_t²) = 2W_t dW_t + dt. This extra +dt term is the characteristic signature of stochastic calculus, absent from ordinary calculus.",
  },
  commonMistake: {
    fr: "Appliquer uniquement la règle classique (df = f'(x)dx) à une fonction d'un processus brownien, en oubliant systématiquement le terme correctif d'Itô.",
    en: "Applying only the ordinary rule (df = f'(x)dx) to a function of a Brownian process, systematically forgetting Itô's corrective term.",
  },
});

const whatIfLinearFunctionTemplate = mcqTemplate({
  id: "m06-ito-whatif-fonction-lineaire",
  conceptId: "m06-prerequis-ito",
  difficulty: "medium",
  prompt: {
    fr: "Si f(x) = ax + b (une fonction linéaire), que devient le terme additionnel du lemme d'Itô, ½f''(x)(dx)² ?",
    en: "If f(x) = ax + b (a linear function), what happens to Itô's lemma's additional term, ½f''(x)(dx)²?",
  },
  choices: [
    { id: "vanishes", label: { fr: "Il s'annule exactement, car f''(x) = 0 pour une fonction linéaire : la règle d'Itô coïncide alors avec la règle classique", en: "It exactly vanishes, since f''(x) = 0 for a linear function: Itô's rule then coincides with the ordinary rule" } },
    { id: "still-present", label: { fr: "Il reste toujours présent, quelle que soit la fonction f", en: "It's always present, whatever function f is" } },
    { id: "becomes-infinite", label: { fr: "Il devient infini pour une fonction linéaire", en: "It becomes infinite for a linear function" } },
  ],
  correctId: "vanishes",
  hint: { fr: "Le terme correctif dépend de f''(x), la dérivée SECONDE : quelle est la dérivée seconde d'une fonction linéaire ?", en: "The correction term depends on f''(x), the SECOND derivative: what is a linear function's second derivative?" },
  explanation: {
    fr: "Pour f(x) = ax + b, f'(x) = a et f''(x) = 0 : le terme correctif ½f''(x)(dx)² s'annule donc exactement, et le lemme d'Itô se réduit à df = a dx, identique à la règle classique. Cela confirme que le terme d'Itô ne joue un rôle que pour les fonctions non linéaires (présentant une courbure), exactement comme la convexité (M03-4) ne joue un rôle que pour une relation prix-taux non linéaire.",
    en: "For f(x) = ax + b, f'(x) = a and f''(x) = 0: the correction term ½f''(x)(dx)² therefore exactly vanishes, and Itô's lemma reduces to df = a dx, identical to the ordinary rule. This confirms Itô's term only matters for non-linear functions (exhibiting curvature), exactly as convexity (M03-4) only matters for a non-linear price-yield relationship.",
  },
  commonMistake: {
    fr: "Croire que le terme correctif d'Itô est toujours présent quelle que soit la fonction, en oubliant qu'il dépend directement de la courbure (dérivée seconde) de cette fonction.",
    en: "Believing Itô's correction term is always present regardless of the function, forgetting it directly depends on that function's curvature (second derivative).",
  },
});

const alwaysPositiveCorrectionErrorTemplate = trueFalseTemplate({
  id: "m06-ito-erreur-correction-toujours-positive",
  conceptId: "m06-prerequis-ito",
  difficulty: "hard",
  statement: {
    fr: "Le terme correctif d'Itô ½σ²f''(x) est toujours positif, quelle que soit la fonction f considérée.",
    en: "Itô's correction term ½σ²f''(x) is always positive, whatever the function f considered.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le signe du terme correctif dépend directement du signe de f''(x), la dérivée seconde de la fonction. Si f est concave en un point (f''(x) < 0, comme pour une fonction logarithme par exemple), le terme correctif est négatif à cet endroit. Ce n'est que pour une fonction convexe (f'' > 0, comme le prix d'une obligation classique en fonction du taux, M03-4) que le terme est positif — la convexité obligataire est d'ailleurs un cas particulier de cette même logique.",
    en: "False: the correction term's sign directly depends on the sign of f''(x), the function's second derivative. If f is concave at a point (f''(x) < 0, as for a logarithm function for example), the correction term is negative there. Only for a convex function (f'' > 0, like a plain bond's price as a function of yield, M03-4) is the term positive — bond convexity is in fact a special case of this same logic.",
  },
  commonMistake: {
    fr: "Généraliser abusivement à partir d'exemples convexes familiers (comme la convexité obligataire, toujours positive), en oubliant que le signe du terme correctif dépend de la fonction f considérée, pas d'une règle universelle.",
    en: "Wrongly generalizing from familiar convex examples (like bond convexity, always positive), forgetting the correction term's sign depends on the function f considered, not a universal rule.",
  },
});

const itoCorrectionNumericTemplate: QuestionTemplate = {
  id: "m06-ito-correction-calcul",
  conceptId: "m06-prerequis-ito",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const sigmaPct = randomInt(rng, 10, 50);
    const secondDeriv = randomInt(rng, 1, 20) / 10;
    const sigma = sigmaPct / 100;
    const correction = Math.round(0.5 * sigma * sigma * secondDeriv * 10000) / 10000;

    return {
      isScenario: true,
      prompt: {
        fr: `Pour une fonction f d'un processus de volatilité σ = ${sigmaPct}%, avec f''(x) = ${secondDeriv} au point considéré, quelle est la valeur du terme correctif d'Itô ½σ²f''(x), le coefficient qui multiplie dt ?`,
        en: `For a function f of a process with volatility σ = ${sigmaPct}%, with f''(x) = ${secondDeriv} at the point considered, what is the value of Itô's correction term ½σ²f''(x), the coefficient multiplying dt?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.0005",
      hint: { fr: "Terme correctif = ½ × σ² × f''(x).", en: "Correction term = ½ × σ² × f''(x)." },
      numeric: { value: correction, tolerance: 0.0005 },
      calculation: {
        fr: `½ × ${sigmaPct}%² × ${secondDeriv} = ½ × ${(sigma * sigma).toFixed(4)} × ${secondDeriv} ≈ ${fmt(correction, "fr")}.`,
        en: `½ × ${sigmaPct}%² × ${secondDeriv} = ½ × ${(sigma * sigma).toFixed(4)} × ${secondDeriv} ≈ ${fmt(correction, "en")}.`,
      },
      explanation: {
        fr: "Ce terme quantifie précisément l'ampleur de la correction d'Itô pour une fonction et une volatilité données : plus σ est élevé (volatilité importante) et plus la fonction est courbée (f'' élevé), plus ce terme correctif pèse dans la dynamique globale — un lien direct avec l'intuition de la convexité obligataire (M03-4).",
        en: "This term precisely quantifies the size of Itô's correction for a given function and volatility: the higher σ is (large volatility) and the more curved the function (high f''), the more this correction term weighs in the overall dynamics — a direct link to the bond convexity intuition (M03-4).",
      },
      commonMistake: {
        fr: "Oublier le facteur ½, ou utiliser σ au lieu de σ² dans le calcul du terme correctif.",
        en: "Forgetting the ½ factor, or using σ instead of σ² in the correction term's calculation.",
      },
    };
  },
};

const onlyExoticsErrorTemplate = trueFalseTemplate({
  id: "m06-ito-erreur-uniquement-exotiques",
  conceptId: "m06-prerequis-ito",
  difficulty: "medium",
  statement: {
    fr: "Le lemme d'Itô n'a d'utilité pratique que pour pricer des produits exotiques complexes ; une option vanille standard (call/put européen) peut se pricer sans jamais y recourir.",
    en: "Itô's lemma is only practically useful for pricing complex exotic products; a standard vanilla option (European call/put) can be priced without ever using it.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le lemme d'Itô est utilisé dès la dérivation de la formule de Black-Scholes elle-même (M06), pour une option vanille européenne standard. Il n'est pas réservé aux produits exotiques (barrières, autocalls...) : c'est un outil fondamental de tout le pricing en temps continu, exotique ou non.",
    en: "False: Itô's lemma is used right from the derivation of the Black-Scholes formula itself (M06), for a standard European vanilla option. It isn't reserved for exotic products (barriers, autocalls...): it's a fundamental tool for all continuous-time pricing, exotic or not.",
  },
  commonMistake: {
    fr: "Associer le lemme d'Itô uniquement aux produits complexes, en sous-estimant son rôle déjà central dans la dérivation des formules de pricing les plus basiques.",
    en: "Associating Itô's lemma only with complex products, underestimating its already central role in deriving even the most basic pricing formulas.",
  },
});

const blackScholesDerivationScenarioTemplate = mcqTemplate({
  id: "m06-ito-scenario-derivation-black-scholes",
  conceptId: "m06-prerequis-ito",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un quant applique le lemme d'Itô à la fonction C(S_t,t), le prix d'une option en fonction du sous-jacent et du temps. Quel type de terme apparaît dans dC, en plus des termes ∂C/∂t dt et ∂C/∂S dS_t attendus par la règle classique ?",
    en: "A quant applies Itô's lemma to C(S_t,t), an option's price as a function of the underlying and time. What kind of term appears in dC, beyond the ∂C/∂t dt and ∂C/∂S dS_t terms expected from the ordinary rule?",
  },
  choices: [
    { id: "gamma-term", label: { fr: "Un terme en ½σ²S_t²∂²C/∂S² dt, impliquant la dérivée seconde du prix par rapport au sous-jacent (le Gamma de l'option)", en: "A term in ½σ²S_t²∂²C/∂S² dt, involving the option price's second derivative with respect to the underlying (the option's Gamma)" } },
    { id: "no-extra-term", label: { fr: "Aucun terme supplémentaire, la règle classique suffit pour C(S_t,t)", en: "No extra term, the ordinary rule is enough for C(S_t,t)" } },
    { id: "linear-term-only", label: { fr: "Un simple terme linéaire supplémentaire en S_t, sans lien avec une dérivée seconde", en: "A simple extra linear term in S_t, unrelated to any second derivative" } },
  ],
  correctId: "gamma-term",
  hint: { fr: "Le lemme d'Itô pour une fonction de deux variables (S_t et t) ajoute un terme en la dérivée SECONDE par rapport à la variable stochastique S_t.", en: "Itô's lemma for a two-variable function (S_t and t) adds a term in the SECOND derivative with respect to the stochastic variable S_t." },
  explanation: {
    fr: "Le terme additionnel, ½σ²S_t²∂²C/∂S² dt, fait directement apparaître la dérivée seconde du prix de l'option par rapport au sous-jacent — précisément ce qu'on appelle le Gamma de l'option (M07) : c'est ce terme, issu du lemme d'Itô, qui donne naissance à l'équation aux dérivées partielles de Black-Scholes, reliant Theta, Delta et Gamma de l'option au taux sans risque.",
    en: "The additional term, ½σ²S_t²∂²C/∂S² dt, directly brings in the option price's second derivative with respect to the underlying — precisely what's called the option's Gamma (M07): it's this term, arising from Itô's lemma, that gives rise to the Black-Scholes partial differential equation, linking the option's Theta, Delta and Gamma to the risk-free rate.",
  },
  commonMistake: {
    fr: "Croire que l'application du lemme d'Itô à C(S_t,t) ne produit que des termes déjà présents dans la règle de dérivation classique, en manquant le lien direct avec le Gamma de l'option.",
    en: "Believing applying Itô's lemma to C(S_t,t) only produces terms already present in the ordinary chain rule, missing the direct link to the option's Gamma.",
  },
});

const martingaleCheckScenarioTemplate = mcqTemplate({
  id: "m06-ito-scenario-verification-martingale",
  conceptId: "m06-prerequis-ito",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Sous la mesure risque-neutre, un quant vérifie que le prix actualisé du sous-jacent, e^{−rt}S_t, est une martingale. Concrètement, cela signifie que sa dérive (le terme en dt de sa dynamique d'Itô) doit être...",
    en: "Under the risk-neutral measure, a quant checks that the underlying's discounted price, e^{−rt}S_t, is a martingale. Concretely, this means its drift (the dt term in its Itô dynamics) must be...",
  },
  choices: [
    { id: "zero-drift", label: { fr: "Exactement nulle : une martingale n'a par définition aucune tendance prévisible", en: "Exactly zero: a martingale has by definition no predictable trend" } },
    { id: "equal-r", label: { fr: "Exactement égale à r, le taux sans risque", en: "Exactly equal to r, the risk-free rate" } },
    { id: "any-positive", label: { fr: "N'importe quelle valeur positive, cela n'a pas d'importance", en: "Any positive value, it doesn't matter" } },
  ],
  correctId: "zero-drift",
  hint: { fr: "Rappelez-vous la définition d'une martingale (M06, vocabulaire) : la meilleure prévision de sa valeur future est sa valeur actuelle.", en: "Remember a martingale's definition (M06, vocabulary): the best forecast of its future value is its current value." },
  explanation: {
    fr: "Par définition, une martingale n'a aucune tendance prévisible : sa dynamique d'Itô ne doit comporter aucun terme en dt (drift nul), uniquement un terme aléatoire en dW_t. C'est précisément la construction du passage à la mesure risque-neutre (via le théorème de Girsanov) qui ajuste le drift du sous-jacent de façon à ce que son prix actualisé vérifie exactement cette propriété, fondement de toute la théorie du pricing par absence d'arbitrage.",
    en: "By definition, a martingale has no predictable trend: its Itô dynamics must contain no dt term at all (zero drift), only a random dW_t term. This is precisely what the switch to the risk-neutral measure (via Girsanov's theorem) constructs: adjusting the underlying's drift so its discounted price exactly satisfies this property, the foundation of the entire no-arbitrage pricing theory.",
  },
  commonMistake: {
    fr: "Croire qu'une martingale peut avoir une dérive non nulle tant qu'elle reste constante, en oubliant que la propriété de martingale exige précisément une dérive rigoureusement nulle.",
    en: "Believing a martingale can have a non-zero drift as long as it stays constant, forgetting the martingale property precisely requires a rigorously zero drift.",
  },
});

export const templates: QuestionTemplate[] = [
  itoRuleTemplate,
  itoTermTemplate,
  riskNeutralTemplate,
  vocabTemplate,
  comprehensionTemplate,
  chainRuleComparisonTemplate,
  whatIfLinearFunctionTemplate,
  itoCorrectionNumericTemplate,
  alwaysPositiveCorrectionErrorTemplate,
  onlyExoticsErrorTemplate,
  blackScholesDerivationScenarioTemplate,
  martingaleCheckScenarioTemplate,
];
