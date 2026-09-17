import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const stdDevNumericTemplate: QuestionTemplate = {
  id: "m06-brownien-ecart-type",
  conceptId: "m06-mouvement-brownien",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const t = randomInt(rng, 1, 16);
    const stdDev = Math.round(Math.sqrt(t) * 1000) / 1000;

    return {
      prompt: {
        fr: `Pour un mouvement brownien standard W_t, quel est l'écart-type de W_${t} ?`,
        en: `For a standard Brownian motion W_t, what is the standard deviation of W_${t}?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.01",
      hint: { fr: "W_t ~ N(0,t) : l'écart-type est √t.", en: "W_t ~ N(0,t): the standard deviation is √t." },
      numeric: { value: stdDev, tolerance: 0.01 },
      calculation: { fr: `Écart-type = √${t} ≈ ${fmt(stdDev, "fr")}.`, en: `Standard deviation = √${t} ≈ ${fmt(stdDev, "en")}.` },
      explanation: {
        fr: "La variance de W_t vaut t, donc l'écart-type vaut √t, pas t.",
        en: "W_t's variance equals t, so the standard deviation equals √t, not t.",
      },
      commonMistake: {
        fr: "Répondre t directement au lieu de √t, en confondant variance et écart-type.",
        en: "Answering t directly instead of √t, confusing variance and standard deviation.",
      },
    };
  },
};

const propertiesTemplate: QuestionTemplate = {
  id: "m06-brownien-proprietes",
  conceptId: "m06-mouvement-brownien",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const claim = pick(
      rng,
      [
        { id: "continuous", fr: "Les trajectoires sont continues mais nulle part dérivables", en: "Paths are continuous but nowhere differentiable" },
        { id: "independent", fr: "Les accroissements sur des intervalles disjoints sont indépendants", en: "Increments over disjoint intervals are independent" },
        { id: "zero", fr: "W_0 = 0 par définition", en: "W_0 = 0 by definition" },
      ] as const
    );

    return {
      prompt: {
        fr: `Laquelle de ces propriétés caractérise un mouvement brownien standard : « ${claim.fr} » ?`,
        en: `Which of these properties characterizes a standard Brownian motion: "${claim.en}"?`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "C'est une propriété correcte du mouvement brownien", en: "This is a correct property of Brownian motion" } },
        { id: "false", label: { fr: "Ce n'est pas une propriété du mouvement brownien", en: "This is not a property of Brownian motion" } },
      ]),
      hint: { fr: "Les trois propriétés citées dans ce quiz sont toutes vraies pour un brownien standard — réfléchissez à la définition complète.", en: "All three properties cited in this quiz are true for a standard Brownian motion — think about the full definition." },
      correctChoiceIds: ["true"],
      explanation: {
        fr: `« ${claim.fr} » est bien une propriété fondamentale du mouvement brownien standard, avec W_0=0, les accroissements indépendants et stationnaires, et la continuité sans dérivabilité.`,
        en: `"${claim.en}" is indeed a fundamental property of standard Brownian motion, along with W_0=0, independent and stationary increments, and continuity without differentiability.`,
      },
      commonMistake: {
        fr: "Penser que la continuité implique la dérivabilité, ce qui est faux pour le mouvement brownien.",
        en: "Thinking continuity implies differentiability, which is false for Brownian motion.",
      },
    };
  },
};

const differentiableTemplate: QuestionTemplate = {
  id: "m06-brownien-derivable",
  conceptId: "m06-mouvement-brownien",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Les trajectoires d'un mouvement brownien standard sont dérivables presque partout, comme la plupart des fonctions continues rencontrées en calcul classique.",
      en: "Standard Brownian motion paths are differentiable almost everywhere, like most continuous functions encountered in ordinary calculus.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : les trajectoires du mouvement brownien sont continues mais NULLE PART dérivables, une propriété contre-intuitive qui distingue radicalement le calcul stochastique du calcul classique.",
      en: "False: Brownian motion paths are continuous but NOWHERE differentiable, a counter-intuitive property that radically distinguishes stochastic calculus from ordinary calculus.",
    },
    commonMistake: {
      fr: "Généraliser l'intuition du calcul classique (continu ⇒ presque toujours dérivable) au mouvement brownien.",
      en: "Generalizing ordinary calculus intuition (continuous ⇒ almost always differentiable) to Brownian motion.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-brownien-vocab",
  conceptId: "m06-mouvement-brownien",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une famille de variables aléatoires indexée par le temps, décrivant l'évolution incertaine d'une quantité, s'appelle un processus ______.",
      en: "A family of random variables indexed by time, describing a quantity's uncertain evolution, is called a ______ process.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["stochastique", "stochastic"],
    hint: { fr: "Le terme mathématique pour « aléatoire dans le temps ».", en: "The mathematical term for \"random over time\"." },
    explanation: {
      fr: "Un processus stochastique est la structure mathématique générale dont le mouvement brownien est un cas particulier fondamental.",
      en: "A stochastic process is the general mathematical structure of which Brownian motion is a foundational special case.",
    },
    commonMistake: {
      fr: "Confondre \"processus stochastique\" (la structure générale) avec \"mouvement brownien\" (un exemple particulier de cette structure).",
      en: "Confusing \"stochastic process\" (the general structure) with \"Brownian motion\" (a particular example of that structure).",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m06-brownien-comprehension-utilite",
  conceptId: "m06-mouvement-brownien",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi la finance quantitative utilise-t-elle le mouvement brownien comme brique de base pour modéliser l'incertitude des prix, plutôt qu'un modèle discret plus simple ?",
    en: "Why does quantitative finance use Brownian motion as the basic building block for modeling price uncertainty, rather than a simpler discrete model?",
  },
  choices: [
    { id: "continuous-time", label: { fr: "Parce qu'il modélise une incertitude qui s'accumule en continu dans le temps, avec des propriétés mathématiques (normalité, indépendance) qui permettent des calculs de pricing tractables", en: "Because it models uncertainty accumulating continuously over time, with mathematical properties (normality, independence) that enable tractable pricing calculations" } },
    { id: "arbitrary", label: { fr: "C'est un choix arbitraire sans justification particulière", en: "It's an arbitrary choice with no particular justification" } },
    { id: "always-accurate", label: { fr: "Parce qu'il décrit exactement et parfaitement les prix réels observés sur les marchés", en: "Because it exactly and perfectly describes real prices observed on markets" } },
  ],
  correctId: "continuous-time",
  hint: { fr: "Pensez à ce qui rend un modèle mathématiquement maniable pour dériver des formules de pricing en temps continu.", en: "Think about what makes a model mathematically tractable for deriving continuous-time pricing formulas." },
  explanation: {
    fr: "Le mouvement brownien offre un cadre de temps continu avec des propriétés mathématiques précises et exploitables (accroissements gaussiens, indépendants, stationnaires) qui permettent de dériver des formules de pricing fermées (comme Black-Scholes, M06-4) : ce n'est pas une description parfaite de la réalité des marchés (les vrais prix ont des sauts, une volatilité qui varie...), mais une approximation suffisamment riche et tractable pour bâtir toute la théorie du pricing d'options.",
    en: "Brownian motion offers a continuous-time framework with precise, exploitable mathematical properties (Gaussian, independent, stationary increments) that allow closed-form pricing formulas to be derived (like Black-Scholes, M06-4): it isn't a perfect description of market reality (real prices have jumps, time-varying volatility...), but an approximation rich and tractable enough to build the entire option-pricing theory on.",
  },
  commonMistake: {
    fr: "Croire que le mouvement brownien est un modèle exact des prix réels, en oubliant que c'est une approximation choisie pour sa tractabilité mathématique.",
    en: "Believing Brownian motion is an exact model of real prices, forgetting it's an approximation chosen for its mathematical tractability.",
  },
});

const incrementComparisonTemplate = mcqTemplate({
  id: "m06-brownien-comparaison-increment",
  conceptId: "m06-mouvement-brownien",
  difficulty: "hard",
  prompt: {
    fr: "Comparez W_5 (la valeur du brownien à t=5) et l'accroissement (W_8 − W_5) (l'évolution entre t=5 et t=8). Ces deux quantités sont-elles indépendantes l'une de l'autre ?",
    en: "Compare W_5 (the Brownian motion's value at t=5) and the increment (W_8 − W_5) (its evolution between t=5 and t=8). Are these two quantities independent of each other?",
  },
  choices: [
    { id: "yes-independent", label: { fr: "Oui : c'est précisément la propriété d'indépendance des accroissements sur des intervalles disjoints, même si l'un des deux \"parts\" de la valeur en t=5", en: "Yes: this is precisely the independence-of-increments property on disjoint intervals, even though one of them \"starts\" from the t=5 value" } },
    { id: "no-correlated", label: { fr: "Non, elles sont nécessairement corrélées puisque le second intervalle démarre à la valeur atteinte par le premier", en: "No, they are necessarily correlated since the second interval starts from the value reached by the first" } },
    { id: "depends", label: { fr: "Cela dépend du niveau atteint par W_5", en: "It depends on the level W_5 reaches" } },
  ],
  correctId: "yes-independent",
  hint: { fr: "W_5 est déterminé par ce qui se passe sur [0,5] ; l'accroissement W_8−W_5 est déterminé par ce qui se passe sur [5,8] — deux intervalles disjoints.", en: "W_5 is determined by what happens on [0,5]; the increment W_8−W_5 is determined by what happens on [5,8] — two disjoint intervals." },
  explanation: {
    fr: "Bien que le second intervalle \"démarre\" numériquement là où le premier s'arrête, la propriété d'indépendance des accroissements du brownien garantit que ce qui se passe APRÈS t=5 (l'accroissement W_8−W_5) est statistiquement indépendant de ce qui s'est passé AVANT (la valeur W_5 elle-même, déterminée par le comportement sur [0,5]) : c'est une propriété non intuitive mais fondamentale, à la base de la propriété de Markov du brownien.",
    en: "Although the second interval numerically \"starts\" where the first ends, Brownian motion's increment-independence property guarantees that what happens AFTER t=5 (the increment W_8−W_5) is statistically independent of what happened BEFORE (the value W_5 itself, determined by behavior on [0,5]): a non-intuitive but fundamental property, underlying Brownian motion's Markov property.",
  },
  commonMistake: {
    fr: "Confondre \"l'accroissement démarre là où la valeur précédente s'arrête\" (vrai, une continuité de trajectoire) avec \"l'accroissement dépend statistiquement de cette valeur précédente\" (faux, une indépendance statistique).",
    en: "Confusing \"the increment starts where the previous value ends\" (true, a path continuity) with \"the increment statistically depends on that previous value\" (false, a statistical independence).",
  },
});

const whatIfDoubleTimeTemplate = mcqTemplate({
  id: "m06-brownien-whatif-double-temps",
  conceptId: "m06-mouvement-brownien",
  difficulty: "medium",
  prompt: {
    fr: "Si l'horizon temporel t double, que devient l'écart-type de W_t (pas la variance) ?",
    en: "If the time horizon t doubles, what happens to W_t's standard deviation (not the variance)?",
  },
  choices: [
    { id: "sqrt2", label: { fr: "Il est multiplié par √2 ≈ 1,41, pas par 2", en: "It is multiplied by √2 ≈ 1.41, not by 2" } },
    { id: "double", label: { fr: "Il double exactement, comme la variance", en: "It exactly doubles, like the variance" } },
    { id: "unchanged", label: { fr: "Il ne change pas", en: "It stays unchanged" } },
  ],
  correctId: "sqrt2",
  hint: { fr: "Écart-type = √t : que devient √(2t) par rapport à √t ?", en: "Standard deviation = √t: what does √(2t) become relative to √t?" },
  explanation: {
    fr: "La VARIANCE de W_t (qui vaut t) double effectivement si t double, mais l'ÉCART-TYPE (qui vaut √t) est multiplié par √2, pas par 2 : c'est la fameuse « racine du temps » qui gouverne l'échelle de l'incertitude en finance quantitative (par exemple dans l'annualisation de la volatilité).",
    en: "The VARIANCE of W_t (equal to t) does double if t doubles, but the STANDARD DEVIATION (equal to √t) is multiplied by √2, not by 2: this is the famous \"square root of time\" rule that governs the scale of uncertainty in quantitative finance (e.g. in volatility annualization).",
  },
  commonMistake: {
    fr: "Appliquer le facteur de la variance (×2) à l'écart-type, en oubliant que ce dernier suit une racine carrée, pas une relation linéaire directe.",
    en: "Applying the variance's factor (×2) to the standard deviation, forgetting the latter follows a square root, not a direct linear relationship.",
  },
});

const whatIfIncrementDistributionTemplate = mcqTemplate({
  id: "m06-brownien-whatif-distribution-increment",
  conceptId: "m06-mouvement-brownien",
  difficulty: "hard",
  prompt: {
    fr: "Quelle est la loi de probabilité de l'accroissement (W_t − W_s) pour s < t d'un mouvement brownien standard ?",
    en: "What is the probability distribution of the increment (W_t − W_s) for s < t of a standard Brownian motion?",
  },
  choices: [
    { id: "normal-t-minus-s", label: { fr: "Une loi normale de moyenne 0 et de variance (t−s)", en: "A normal distribution with mean 0 and variance (t−s)" } },
    { id: "normal-t", label: { fr: "Une loi normale de moyenne 0 et de variance t, indépendamment de s", en: "A normal distribution with mean 0 and variance t, independent of s" } },
    { id: "uniform", label: { fr: "Une loi uniforme sur [s,t]", en: "A uniform distribution on [s,t]" } },
  ],
  correctId: "normal-t-minus-s",
  hint: { fr: "Généralisez la propriété W_t ~ N(0,t) (le cas particulier s=0) à un intervalle quelconque [s,t].", en: "Generalize the W_t ~ N(0,t) property (the special case s=0) to any interval [s,t]." },
  explanation: {
    fr: "L'accroissement sur un intervalle [s,t] suit une loi normale de moyenne 0 et de variance égale à la LONGUEUR de l'intervalle (t−s), pas au temps final t seul : W_t ~ N(0,t) n'est que le cas particulier où s=0. Cette généralisation aux accroissements est essentielle pour simuler des trajectoires discrétisées (M06, Monte-Carlo).",
    en: "The increment over an interval [s,t] follows a normal distribution with mean 0 and variance equal to the interval's LENGTH (t−s), not the final time t alone: W_t ~ N(0,t) is only the special case where s=0. This generalization to increments is essential for simulating discretized paths (M06, Monte-Carlo).",
  },
  commonMistake: {
    fr: "Utiliser systématiquement la variance t (le cas particulier depuis l'origine) au lieu de (t−s) pour un accroissement ne démarrant pas en 0.",
    en: "Systematically using variance t (the special case from the origin) instead of (t−s) for an increment not starting at 0.",
  },
});

const covarianceNumericTemplate: QuestionTemplate = {
  id: "m06-brownien-covariance-calcul",
  conceptId: "m06-mouvement-brownien",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const s = randomInt(rng, 1, 6);
    const t = s + randomInt(rng, 1, 8);

    return {
      prompt: {
        fr: `Pour un mouvement brownien standard, avec s = ${s} et t = ${t} (s < t), quelle est la covariance Cov(W_s, W_t) ?`,
        en: `For a standard Brownian motion, with s = ${s} and t = ${t} (s < t), what is the covariance Cov(W_s, W_t)?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.01",
      hint: { fr: "Cov(W_s, W_t) = min(s,t), pour un brownien standard.", en: "Cov(W_s, W_t) = min(s,t), for a standard Brownian motion." },
      numeric: { value: s, tolerance: 0.01 },
      calculation: { fr: `Cov(W_${s}, W_${t}) = min(${s},${t}) = ${s}.`, en: `Cov(W_${s}, W_${t}) = min(${s},${t}) = ${s}.` },
      explanation: {
        fr: "La covariance entre deux valeurs du brownien à des dates différentes vaut le plus petit des deux temps, min(s,t) : intuitivement, les deux valeurs \"partagent\" exactement l'aléa accumulé jusqu'à la date la plus proche, puis évoluent indépendamment ensuite.",
        en: "The covariance between two Brownian motion values at different dates equals the smaller of the two times, min(s,t): intuitively, both values \"share\" exactly the randomness accumulated up to the earlier date, then evolve independently afterward.",
      },
      commonMistake: {
        fr: "Croire que la covariance est nulle (en confondant avec l'indépendance des ACCROISSEMENTS disjoints) ou utiliser t au lieu de min(s,t).",
        en: "Believing the covariance is zero (confusing with the independence of disjoint INCREMENTS) or using t instead of min(s,t).",
      },
    };
  },
};

const allPairsIndependentErrorTemplate = trueFalseTemplate({
  id: "m06-brownien-erreur-toutes-paires-independantes",
  conceptId: "m06-mouvement-brownien",
  difficulty: "medium",
  statement: {
    fr: "Puisque les accroissements d'un mouvement brownien sur des intervalles disjoints sont indépendants, cela signifie que W_s et W_t (pour n'importe quels s et t) sont eux aussi toujours statistiquement indépendants.",
    en: "Since a Brownian motion's increments over disjoint intervals are independent, this means W_s and W_t (for any s and t) are also always statistically independent.",
  },
  correct: false,
  explanation: {
    fr: "Faux : W_s et W_t (par exemple W_2 et W_5) sont corrélés, avec Cov(W_s,W_t) = min(s,t) — ils ne sont PAS indépendants, car ils partagent la trajectoire aléatoire commune jusqu'à la date la plus proche (ici t=2). Ce qui est indépendant, ce sont les ACCROISSEMENTS sur des intervalles disjoints (comme W_2 et W_5−W_2), pas les valeurs W_s et W_t elles-mêmes.",
    en: "False: W_s and W_t (e.g. W_2 and W_5) are correlated, with Cov(W_s,W_t) = min(s,t) — they are NOT independent, since they share the common random path up to the earlier date (here t=2). What's independent are the INCREMENTS over disjoint intervals (like W_2 and W_5−W_2), not the values W_s and W_t themselves.",
  },
  commonMistake: {
    fr: "Confondre \"indépendance des accroissements disjoints\" (vrai) avec \"indépendance de toutes les valeurs prises à des dates différentes\" (faux), une distinction subtile mais cruciale.",
    en: "Confusing \"independence of disjoint increments\" (true) with \"independence of all values taken at different dates\" (false), a subtle but crucial distinction.",
  },
});

const discretizedSimulationScenarioTemplate = mcqTemplate({
  id: "m06-brownien-scenario-simulation-discretisee",
  conceptId: "m06-mouvement-brownien",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Pour simuler numériquement une trajectoire de mouvement brownien sur [0,1] avec un pas de temps Δt = 0,01, comment doit-on générer chaque petit incrément à chaque pas ?",
    en: "To numerically simulate a Brownian motion path on [0,1] with time step Δt = 0.01, how should each small increment be generated at each step?",
  },
  choices: [
    { id: "sqrt-dt-normal", label: { fr: "Tirer un nombre aléatoire Z ~ N(0,1) et multiplier par √Δt, pour obtenir un incrément ~ N(0,Δt)", en: "Draw a random number Z ~ N(0,1) and multiply by √Δt, to get an increment ~ N(0,Δt)" } },
    { id: "multiply-dt", label: { fr: "Tirer Z ~ N(0,1) et multiplier directement par Δt", en: "Draw Z ~ N(0,1) and multiply directly by Δt" } },
    { id: "no-scaling", label: { fr: "Tirer Z ~ N(0,1) sans aucune mise à l'échelle par le pas de temps", en: "Draw Z ~ N(0,1) with no scaling by the time step at all" } },
  ],
  correctId: "sqrt-dt-normal",
  hint: { fr: "Un incrément sur un petit intervalle de durée Δt doit avoir une variance Δt, donc un écart-type √Δt.", en: "An increment over a small interval of duration Δt must have variance Δt, hence standard deviation √Δt." },
  explanation: {
    fr: "Pour que chaque petit incrément simulé ait la bonne distribution (moyenne 0, variance Δt, conformément à la propriété des accroissements du brownien), il faut le construire comme Z×√Δt avec Z ~ N(0,1) : c'est la discrétisation d'Euler standard, à la base de toute simulation Monte-Carlo de trajectoires (M06, Monte-Carlo).",
    en: "For each small simulated increment to have the right distribution (mean 0, variance Δt, consistent with Brownian motion's increment property), it must be built as Z×√Δt with Z ~ N(0,1): this is the standard Euler discretization, underlying any Monte-Carlo path simulation (M06, Monte-Carlo).",
  },
  commonMistake: {
    fr: "Multiplier par Δt au lieu de √Δt, une erreur d'échelle fréquente qui sous-estime fortement la volatilité simulée pour de petits pas de temps.",
    en: "Multiplying by Δt instead of √Δt, a frequent scaling mistake that strongly understates simulated volatility for small time steps.",
  },
});

const naiveDifferentiationScenarioTemplate = mcqTemplate({
  id: "m06-brownien-scenario-derivation-naive",
  conceptId: "m06-mouvement-brownien",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un étudiant tente d'appliquer la définition classique de la dérivée (limite du taux d'accroissement) à une trajectoire de mouvement brownien, comme il le ferait pour une fonction ordinaire. Que va-t-il constater ?",
    en: "A student tries to apply the ordinary derivative definition (limit of the rate of change) to a Brownian motion path, as they would for an ordinary function. What will they find?",
  },
  choices: [
    { id: "no-limit", label: { fr: "Cette limite n'existe presque jamais : la trajectoire est trop irrégulière pour admettre une pente bien définie en un point", en: "This limit almost never exists: the path is too irregular to admit a well-defined slope at any point" } },
    { id: "works-fine", label: { fr: "La méthode fonctionne parfaitement, comme pour n'importe quelle fonction continue", en: "The method works perfectly, as for any continuous function" } },
    { id: "always-zero", label: { fr: "La dérivée existe toujours et vaut systématiquement zéro", en: "The derivative always exists and is systematically zero" } },
  ],
  correctId: "no-limit",
  hint: { fr: "Rappelez-vous la propriété fondamentale : continue mais nulle part dérivable.", en: "Remember the fundamental property: continuous but nowhere differentiable." },
  explanation: {
    fr: "L'étudiant constatera que la limite définissant la dérivée classique n'existe presque jamais pour une trajectoire brownienne : elle est trop irrégulière (elle « zigzague » à toutes les échelles, aussi petites soient-elles) pour admettre une pente bien définie en un point. C'est exactement ce qui motive le besoin d'un calcul différentiel spécifique (le calcul d'Itô, M06) plutôt que le calcul classique pour manipuler des fonctions de processus browniens.",
    en: "The student will find the limit defining the ordinary derivative almost never exists for a Brownian path: it's too irregular (it \"zigzags\" at every scale, however small) to admit a well-defined slope at any point. This is exactly what motivates the need for a specific differential calculus (Itô calculus, M06) rather than ordinary calculus to handle functions of Brownian processes.",
  },
  commonMistake: {
    fr: "Supposer que les outils du calcul classique (dérivation, règle de la chaîne) s'appliquent sans modification aux processus stochastiques, une erreur fondamentale corrigée par le calcul d'Itô.",
    en: "Assuming ordinary calculus tools (differentiation, chain rule) apply unmodified to stochastic processes, a fundamental error corrected by Itô calculus.",
  },
});

export const templates: QuestionTemplate[] = [
  stdDevNumericTemplate,
  propertiesTemplate,
  differentiableTemplate,
  vocabTemplate,
  comprehensionTemplate,
  incrementComparisonTemplate,
  whatIfDoubleTimeTemplate,
  whatIfIncrementDistributionTemplate,
  covarianceNumericTemplate,
  allPairsIndependentErrorTemplate,
  discretizedSimulationScenarioTemplate,
  naiveDifferentiationScenarioTemplate,
];
