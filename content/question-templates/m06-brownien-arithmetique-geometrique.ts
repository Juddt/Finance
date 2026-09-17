import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const gbmNumericTemplate: QuestionTemplate = {
  id: "m06-gbm-calcul",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const muPct = randomInt(rng, 2, 12);
    const sigmaPct = randomInt(rng, 10, 40);
    const t = 1;
    const Wt = randomFloat(rng, -1, 1, 2);
    const mu = muPct / 100;
    const sigma = sigmaPct / 100;
    const St = Math.round(S0 * Math.exp((mu - (sigma * sigma) / 2) * t + sigma * Wt) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `S0=${S0}, μ=${muPct}%, σ=${sigmaPct}%, t=1, W_1=${fmt(Wt, "fr")}. Quelle est la valeur de S_1 selon le brownien géométrique ?`,
        en: `S0=${S0}, μ=${muPct}%, σ=${sigmaPct}%, t=1, W_1=${fmt(Wt, "en")}. What is S_1 under the geometric Brownian motion?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 1",
      hint: { fr: "S_t = S0 × exp[(μ−σ²/2)t + σW_t].", en: "S_t = S0 × exp[(μ−σ²/2)t + σW_t]." },
      numeric: { value: St, tolerance: 1 },
      calculation: {
        fr: `Exposant = (${muPct}%−${sigmaPct}%²/2)×1 + ${sigmaPct}%×${fmt(Wt, "fr")} = ${((mu - (sigma * sigma) / 2) * t + sigma * Wt).toFixed(4)}. S_1 = ${S0} × exp(${((mu - (sigma * sigma) / 2) * t + sigma * Wt).toFixed(4)}) ≈ ${fmt(St, "fr")}.`,
        en: `Exponent = (${muPct}%−${sigmaPct}%²/2)×1 + ${sigmaPct}%×${fmt(Wt, "en")} = ${((mu - (sigma * sigma) / 2) * t + sigma * Wt).toFixed(4)}. S_1 = ${S0} × exp(${((mu - (sigma * sigma) / 2) * t + sigma * Wt).toFixed(4)}) ≈ ${fmt(St, "en")}.`,
      },
      explanation: {
        fr: "N'oubliez jamais la correction d'Itô −σ²/2 dans l'exposant, qui distingue le brownien géométrique d'une simple exponentielle du brownien arithmétique.",
        en: "Never forget the Itô correction −σ²/2 in the exponent, which distinguishes geometric Brownian motion from a simple exponential of arithmetic Brownian motion.",
      },
      commonMistake: {
        fr: "Oublier la correction −σ²/2 et utiliser directement exp(μt + σW_t).",
        en: "Forgetting the −σ²/2 correction and directly using exp(μt + σW_t).",
      },
    };
  },
};

const canGoNegativeTemplate: QuestionTemplate = {
  id: "m06-gbm-negatif",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const modelType = pick(rng, ["arithmetic", "geometric"] as const);
    return {
      prompt: {
        fr: `Un processus suit un brownien ${modelType === "arithmetic" ? "arithmétique" : "géométrique"} : dX_t = μ${modelType === "arithmetic" ? "" : "X_t"}dt + σ${modelType === "arithmetic" ? "" : "X_t"}dW_t. Ce processus peut-il devenir négatif ?`,
        en: `A process follows ${modelType === "arithmetic" ? "an arithmetic" : "a geometric"} Brownian motion: dX_t = μ${modelType === "arithmetic" ? "" : "X_t"}dt + σ${modelType === "arithmetic" ? "" : "X_t"}dW_t. Can this process go negative?`,
      },
      choices: buildChoices([
        { id: "yes", label: { fr: "Oui, il peut devenir négatif", en: "Yes, it can go negative" } },
        { id: "no", label: { fr: "Non, il reste toujours positif", en: "No, it always stays positive" } },
      ]),
      hint: { fr: "Un des deux modèles a une dérive et une volatilité proportionnelles au niveau actuel.", en: "One of the two models has drift and volatility proportional to the current level." },
      correctChoiceIds: [modelType === "arithmetic" ? "yes" : "no"],
      explanation:
        modelType === "arithmetic"
          ? { fr: "Le brownien arithmétique a une dérive et une volatilité en valeur absolue, il peut donc mathématiquement devenir négatif.", en: "Arithmetic Brownian motion has drift and volatility in absolute terms, so it can mathematically go negative." }
          : { fr: "Le brownien géométrique s'écrit S_t = S0×exp(...), une exponentielle qui reste toujours strictement positive.", en: "Geometric Brownian motion is written S_t = S0×exp(...), an exponential that always stays strictly positive." },
      commonMistake: {
        fr: "Confondre les deux modèles et leur capacité (ou non) à devenir négatifs.",
        en: "Mixing up the two models and their ability (or not) to go negative.",
      },
    };
  },
};

const stockChoiceTemplate: QuestionTemplate = {
  id: "m06-gbm-choix-action",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le modèle standard pour un prix d'action en finance quantitative est le mouvement brownien géométrique, pas arithmétique.",
      en: "The standard model for a stock price in quantitative finance is geometric, not arithmetic, Brownian motion.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : le brownien géométrique garantit un prix toujours positif, une propriété indispensable pour un prix d'action, contrairement au brownien arithmétique.",
      en: "True: geometric Brownian motion guarantees an always-positive price, an essential property for a stock price, unlike arithmetic Brownian motion.",
    },
    commonMistake: {
      fr: "Croire que le choix entre les deux modèles est arbitraire ou sans conséquence pratique.",
      en: "Believing the choice between the two models is arbitrary or without practical consequence.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-gbm-vocab",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La tendance moyenne, déterministe, autour de laquelle un processus stochastique fluctue de façon aléatoire, s'appelle la ______.",
      en: "The average, deterministic trend around which a stochastic process randomly fluctuates, is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["derive", "dérive", "drift"],
    hint: { fr: "Le terme μ dans dX_t = μdt + σdW_t.", en: "The μ term in dX_t = μdt + σdW_t." },
    explanation: {
      fr: "La dérive (μ) est la composante déterministe de la dynamique, tandis que σdW_t est la composante aléatoire.",
      en: "The drift (μ) is the deterministic component of the dynamics, while σdW_t is the random component.",
    },
    commonMistake: {
      fr: "Confondre la dérive μ avec la volatilité σ, qui mesure l'amplitude des fluctuations aléatoires, pas la tendance moyenne.",
      en: "Confusing the drift μ with volatility σ, which measures the amplitude of random fluctuations, not the average trend.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m06-gbm-comprehension-utilite",
  conceptId: "m06-brownien-arithmetique-geometrique",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi la formule du brownien géométrique inclut-elle un terme de correction −σ²/2, absent d'une simple exponentielle de brownien arithmétique ?",
    en: "Why does the geometric Brownian motion formula include a −σ²/2 correction term, absent from a simple exponential of arithmetic Brownian motion?",
  },
  choices: [
    { id: "jensen", label: { fr: "Pour que l'espérance de S_t croisse exactement au taux μ, en compensant l'effet de convexité de la fonction exponentielle (inégalité de Jensen)", en: "So that S_t's expectation grows at exactly rate μ, compensating for the exponential function's convexity effect (Jensen's inequality)" } },
    { id: "arbitrary-convention", label: { fr: "C'est une convention de notation arbitraire, sans effet réel sur les propriétés statistiques du processus", en: "It's an arbitrary notation convention, with no real effect on the process's statistical properties" } },
    { id: "error-correction", label: { fr: "C'est une correction d'erreur d'arrondi numérique", en: "It's a numerical rounding-error correction" } },
  ],
  correctId: "jensen",
  hint: { fr: "La fonction exponentielle est convexe : E[exp(X)] ≠ exp(E[X]) en général — il faut un ajustement pour retrouver le bon taux de croissance moyen.", en: "The exponential function is convex: E[exp(X)] ≠ exp(E[X]) in general — an adjustment is needed to recover the right average growth rate." },
  explanation: {
    fr: "Sans le terme −σ²/2, l'espérance de S_t croîtrait plus vite que μ, à cause de la convexité de l'exponentielle (E[e^X] > e^{E[X]} pour X aléatoire, l'inégalité de Jensen) : le terme −σ²/2 compense exactement cet effet, garantissant que E[S_t] = S0 × e^{μt}, avec μ interprété comme le véritable taux de croissance moyen attendu.",
    en: "Without the −σ²/2 term, S_t's expectation would grow faster than μ, due to the exponential's convexity (E[e^X] > e^{E[X]} for random X, Jensen's inequality): the −σ²/2 term exactly compensates for this effect, guaranteeing E[S_t] = S0 × e^{μt}, with μ interpreted as the true expected average growth rate.",
  },
  commonMistake: {
    fr: "Voir le terme −σ²/2 comme un détail technique sans importance, plutôt que comme la correction nécessaire pour que μ garde son interprétation intuitive de taux de croissance moyen.",
    en: "Seeing the −σ²/2 term as an unimportant technical detail, rather than the necessary correction for μ to keep its intuitive average-growth-rate interpretation.",
  },
});

const meanVsMedianComparisonTemplate = mcqTemplate({
  id: "m06-gbm-comparaison-moyenne-mediane",
  conceptId: "m06-brownien-arithmetique-geometrique",
  difficulty: "hard",
  prompt: {
    fr: "Pour S_t suivant un brownien géométrique, comparez E[S_t] (l'espérance, = S0×e^{μt}) et la MÉDIANE de S_t (= S0×e^{(μ−σ²/2)t}). Laquelle est la plus élevée ?",
    en: "For S_t following geometric Brownian motion, compare E[S_t] (the expectation, = S0×e^{μt}) and S_t's MEDIAN (= S0×e^{(μ−σ²/2)t}). Which is higher?",
  },
  choices: [
    { id: "mean-higher", label: { fr: "L'espérance est toujours supérieure ou égale à la médiane, l'écart croissant avec σ", en: "The expectation is always higher than or equal to the median, the gap growing with σ" } },
    { id: "median-higher", label: { fr: "La médiane est toujours supérieure à l'espérance", en: "The median is always higher than the expectation" } },
    { id: "always-equal", label: { fr: "Elles sont toujours égales, quelle que soit la volatilité", en: "They are always equal, whatever the volatility" } },
  ],
  correctId: "mean-higher",
  hint: { fr: "La médiane contient le terme −σ²/2 dans l'exposant, l'espérance non : lequel des deux exposants est le plus grand ?", en: "The median has the −σ²/2 term in its exponent, the expectation doesn't: which exponent is larger?" },
  explanation: {
    fr: "Puisque e^{μt} > e^{(μ−σ²/2)t} dès que σ > 0 (le second exposant est plus petit), l'espérance dépasse toujours la médiane, d'autant plus que la volatilité est élevée : c'est une conséquence directe de l'asymétrie (skewness) de la loi log-normale, où quelques trajectoires extrêmement favorables tirent la moyenne vers le haut sans affecter la médiane de la même façon.",
    en: "Since e^{μt} > e^{(μ−σ²/2)t} as soon as σ > 0 (the second exponent is smaller), the expectation always exceeds the median, more so as volatility rises: a direct consequence of the log-normal distribution's skewness, where a few extremely favorable paths pull the mean upward without affecting the median the same way.",
  },
  commonMistake: {
    fr: "Confondre l'espérance et la médiane d'une variable log-normale, en les traitant comme interchangeables alors qu'elles diffèrent systématiquement dès que σ > 0.",
    en: "Confusing a log-normal variable's expectation and median, treating them as interchangeable when they systematically differ as soon as σ > 0.",
  },
});

const whatIfHigherVolTemplate = mcqTemplate({
  id: "m06-gbm-whatif-volatilite-plus-elevee",
  conceptId: "m06-brownien-arithmetique-geometrique",
  difficulty: "hard",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même μ), si σ augmente fortement, que devient la trajectoire \"typique\" (médiane) de S_t, même si l'espérance E[S_t] reste inchangée ?",
    en: "All else equal (same μ), if σ rises sharply, what happens to S_t's \"typical\" (median) path, even though the expectation E[S_t] stays unchanged?",
  },
  choices: [
    { id: "median-drags", label: { fr: "Elle tend à baisser (\"drag de volatilité\") : la médiane décroît avec σ via le terme −σ²/2, même si la moyenne théorique reste identique", en: "It tends to fall (\"volatility drag\"): the median decreases with σ via the −σ²/2 term, even though the theoretical mean stays the same" } },
    { id: "median-rises", label: { fr: "Elle augmente avec σ, exactement comme l'espérance", en: "It rises with σ, exactly like the expectation" } },
    { id: "unaffected", label: { fr: "La trajectoire médiane ne dépend jamais de σ", en: "The median path never depends on σ" } },
  ],
  correctId: "median-drags",
  hint: { fr: "Médiane = S0×e^{(μ−σ²/2)t} : σ apparaît avec un signe négatif dans cet exposant.", en: "Median = S0×e^{(μ−σ²/2)t}: σ appears with a negative sign in that exponent." },
  explanation: {
    fr: "Bien que l'espérance mathématique E[S_t] = S0×e^{μt} ne dépende pas de σ, la trajectoire \"typique\" ou médiane décroît quand σ augmente, à cause du terme −σ²/2 : c'est le phénomène du \"drag de volatilité\" (volatility drag), qui explique pourquoi une volatilité plus élevée, même sans changer le rendement moyen attendu, tend à réduire le résultat le plus probable — un résultat contre-intuitif mais fondamental en gestion de portefeuille.",
    en: "Although the mathematical expectation E[S_t] = S0×e^{μt} doesn't depend on σ, the \"typical\" or median path decreases as σ rises, due to the −σ²/2 term: this is the \"volatility drag\" phenomenon, which explains why higher volatility, even without changing the expected average return, tends to reduce the most likely outcome — a counter-intuitive but fundamental result in portfolio management.",
  },
  commonMistake: {
    fr: "Croire qu'une volatilité plus élevée n'a d'impact que sur la dispersion des résultats, sans affecter le résultat \"typique\" attendu, en oubliant l'effet du drag de volatilité sur la médiane.",
    en: "Believing higher volatility only impacts the dispersion of outcomes, without affecting the \"typical\" expected outcome, forgetting the volatility drag's effect on the median.",
  },
});

const logTransformScenarioTemplate = mcqTemplate({
  id: "m06-gbm-whatif-transformation-log",
  conceptId: "m06-brownien-arithmetique-geometrique",
  difficulty: "hard",
  prompt: {
    fr: "Si S_t suit un brownien géométrique, quelle est la nature du processus ln(S_t) (le logarithme de S_t) ?",
    en: "If S_t follows a geometric Brownian motion, what is the nature of the process ln(S_t) (S_t's logarithm)?",
  },
  choices: [
    { id: "arithmetic-bm", label: { fr: "Un brownien ARITHMÉTIQUE, de dérive (μ−σ²/2) et de volatilité σ", en: "An ARITHMETIC Brownian motion, with drift (μ−σ²/2) and volatility σ" } },
    { id: "geometric-bm", label: { fr: "Un autre brownien géométrique", en: "Another geometric Brownian motion" } },
    { id: "no-relation", label: { fr: "Un processus sans aucune structure brownienne", en: "A process with no Brownian structure at all" } },
  ],
  correctId: "arithmetic-bm",
  hint: { fr: "Prendre le log de S_t = S0×exp[(μ−σ²/2)t + σW_t] fait disparaître l'exponentielle : que reste-t-il ?", en: "Taking the log of S_t = S0×exp[(μ−σ²/2)t + σW_t] removes the exponential: what remains?" },
  explanation: {
    fr: "En prenant le logarithme des deux côtés de S_t = S0×exp[(μ−σ²/2)t + σW_t], on obtient ln(S_t) − ln(S0) = (μ−σ²/2)t + σW_t : c'est exactement la définition d'un brownien ARITHMÉTIQUE, de dérive (μ−σ²/2) et de volatilité σ. Les deux modèles sont donc directement liés par cette transformation logarithmique, ce qui explique pourquoi les rendements logarithmiques (log-returns) sont si couramment utilisés en finance quantitative.",
    en: "Taking the logarithm of both sides of S_t = S0×exp[(μ−σ²/2)t + σW_t] gives ln(S_t) − ln(S0) = (μ−σ²/2)t + σW_t: this is exactly the definition of an ARITHMETIC Brownian motion, with drift (μ−σ²/2) and volatility σ. The two models are therefore directly linked by this logarithmic transformation, which is why log-returns are so commonly used in quantitative finance.",
  },
  commonMistake: {
    fr: "Ne pas voir le lien direct entre les deux modèles, en les traitant comme deux constructions totalement indépendantes plutôt que reliées par une simple transformation logarithmique.",
    en: "Not seeing the direct link between the two models, treating them as two totally independent constructions rather than related by a simple log transformation.",
  },
});

const expectedValueNumericTemplate: QuestionTemplate = {
  id: "m06-gbm-esperance-calcul",
  conceptId: "m06-brownien-arithmetique-geometrique",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const muPct = randomInt(rng, 2, 12);
    const t = randomInt(rng, 1, 5);
    const mu = muPct / 100;
    const expected = Math.round(S0 * Math.exp(mu * t) * 100) / 100;

    return {
      prompt: {
        fr: `Pour un brownien géométrique avec S0 = ${S0}, μ = ${muPct}%, sur un horizon t = ${t} an(s), quelle est l'espérance E[S_t] ?`,
        en: `For a geometric Brownian motion with S0 = ${S0}, μ = ${muPct}%, over a horizon t = ${t} year(s), what is the expectation E[S_t]?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 1",
      hint: { fr: "E[S_t] = S0 × e^{μt} — le terme −σ²/2 n'apparaît PAS dans l'espérance, il se simplifie exactement.", en: "E[S_t] = S0 × e^{μt} — the −σ²/2 term does NOT appear in the expectation, it exactly cancels out." },
      numeric: { value: expected, tolerance: 1 },
      calculation: { fr: `E[S_${t}] = ${S0} × e^(${muPct}%×${t}) ≈ ${fmt(expected, "fr")}.`, en: `E[S_${t}] = ${S0} × e^(${muPct}%×${t}) ≈ ${fmt(expected, "en")}.` },
      explanation: {
        fr: "C'est précisément le rôle du terme −σ²/2 dans la formule de S_t : il se simplifie exactement lors du calcul de l'espérance, laissant E[S_t] = S0×e^{μt}, une formule qui ne dépend pas de σ malgré la présence de la volatilité dans la dynamique du processus.",
        en: "This is precisely the role of the −σ²/2 term in S_t's formula: it exactly cancels out when computing the expectation, leaving E[S_t] = S0×e^{μt}, a formula that doesn't depend on σ despite volatility's presence in the process's dynamics.",
      },
      commonMistake: {
        fr: "Inclure à tort le terme −σ²/2 dans le calcul de l'espérance, en le confondant avec le calcul d'une trajectoire simulée individuelle.",
        en: "Wrongly including the −σ²/2 term in the expectation calculation, confusing it with computing an individual simulated path.",
      },
    };
  },
};

const muIsExpectedReturnErrorTemplate = trueFalseTemplate({
  id: "m06-gbm-erreur-mu-rendement-attendu",
  conceptId: "m06-brownien-arithmetique-geometrique",
  difficulty: "hard",
  statement: {
    fr: "Le paramètre μ d'un brownien géométrique représente le rendement moyen que l'on observera typiquement (médiane) sur une trajectoire réalisée de S_t.",
    en: "A geometric Brownian motion's μ parameter represents the average return typically observed (median) on a realized path of S_t.",
  },
  correct: false,
  explanation: {
    fr: "Faux : μ est le taux de croissance de l'ESPÉRANCE de S_t (E[S_t] = S0×e^{μt}), pas de sa trajectoire typique/médiane, qui croît plutôt au taux (μ−σ²/2) à cause du drag de volatilité. Sur une trajectoire réellement observée, le rendement réalisé typique est donc généralement inférieur à μ, d'autant plus que σ est élevé.",
    en: "False: μ is the growth rate of S_t's EXPECTATION (E[S_t] = S0×e^{μt}), not its typical/median path, which instead grows at rate (μ−σ²/2) due to volatility drag. On an actually observed path, the typical realized return is therefore generally lower than μ, more so as σ is higher.",
  },
  commonMistake: {
    fr: "Confondre le taux de croissance de l'espérance mathématique (μ) avec le rendement typiquement observé sur une trajectoire réelle (plus proche de μ−σ²/2), une confusion aux conséquences importantes en gestion de portefeuille.",
    en: "Confusing the mathematical expectation's growth rate (μ) with the return typically observed on a real path (closer to μ−σ²/2), a confusion with significant portfolio-management consequences.",
  },
});

const negativeRateScenarioTemplate = mcqTemplate({
  id: "m06-gbm-scenario-taux-negatifs",
  conceptId: "m06-brownien-arithmetique-geometrique",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Après 2008, certains taux d'intérêt nominaux de marché sont devenus négatifs pendant plusieurs années. Pour modéliser un tel taux, quel modèle brownien de base est structurellement plus adapté qu'un brownien géométrique ?",
    en: "After 2008, some nominal market interest rates turned negative for several years. To model such a rate, which basic Brownian model is structurally better suited than geometric Brownian motion?",
  },
  choices: [
    { id: "arithmetic", label: { fr: "Le brownien arithmétique, qui peut naturellement prendre des valeurs négatives", en: "Arithmetic Brownian motion, which can naturally take negative values" } },
    { id: "geometric", label: { fr: "Le brownien géométrique, toujours plus adapté quel que soit l'actif modélisé", en: "Geometric Brownian motion, always better suited whatever the asset modeled" } },
    { id: "neither", label: { fr: "Aucun des deux modèles ne peut jamais s'appliquer aux taux d'intérêt", en: "Neither model can ever apply to interest rates" } },
  ],
  correctId: "arithmetic",
  hint: { fr: "Le brownien géométrique reste toujours strictement positif par construction — est-ce compatible avec un taux qui doit pouvoir devenir négatif ?", en: "Geometric Brownian motion always stays strictly positive by construction — is that compatible with a rate that must be able to go negative?" },
  explanation: {
    fr: "Contrairement à un prix d'action (qui ne peut pas devenir négatif), un taux d'intérêt nominal peut, dans certaines conditions économiques exceptionnelles, devenir négatif : le brownien géométrique, toujours strictement positif par construction, est alors structurellement inadapté, tandis que le brownien arithmétique, qui peut prendre n'importe quelle valeur réelle, capture correctement cette possibilité — illustrant que le choix entre les deux modèles dépend des propriétés de l'actif sous-jacent, pas d'une préférence universelle.",
    en: "Unlike a stock price (which cannot go negative), a nominal interest rate can, under certain exceptional economic conditions, turn negative: geometric Brownian motion, always strictly positive by construction, is then structurally unsuited, while arithmetic Brownian motion, which can take any real value, correctly captures this possibility — illustrating that the choice between the two models depends on the underlying asset's properties, not a universal preference.",
  },
  commonMistake: {
    fr: "Croire que le brownien géométrique est toujours le meilleur choix en finance, sans considérer si l'actif modélisé peut légitimement prendre des valeurs négatives.",
    en: "Believing geometric Brownian motion is always the best choice in finance, without considering whether the modeled asset can legitimately take negative values.",
  },
});

const fundComparisonScenarioTemplate = mcqTemplate({
  id: "m06-gbm-scenario-comparaison-fonds",
  conceptId: "m06-brownien-arithmetique-geometrique",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Deux fonds affichent le même rendement arithmétique moyen annuel de 8%, mais le fonds A a une volatilité de 10% et le fonds B de 30%. Sur longue période, lequel accumule typiquement le capital final le plus élevé (résultat médian) ?",
    en: "Two funds show the same 8% average annual arithmetic return, but fund A has 10% volatility and fund B has 30%. Over a long period, which one typically accumulates the higher final capital (median outcome)?",
  },
  choices: [
    { id: "fund-a", label: { fr: "Le fonds A, moins volatil : le drag de volatilité pénalise davantage le fonds B", en: "Fund A, less volatile: volatility drag penalizes fund B more" } },
    { id: "fund-b", label: { fr: "Le fonds B, sa volatilité plus élevée compense par un potentiel de gain supérieur", en: "Fund B, its higher volatility compensates with greater upside potential" } },
    { id: "same", label: { fr: "Les deux fonds ont typiquement le même résultat médian, seule la moyenne compte", en: "Both funds typically have the same median outcome, only the mean matters" } },
  ],
  correctId: "fund-a",
  hint: { fr: "Le taux de croissance \"typique\" (médiane) est (μ−σ²/2), pas μ seul — comparez cette quantité pour les deux fonds.", en: "The \"typical\" (median) growth rate is (μ−σ²/2), not μ alone — compare this quantity for both funds." },
  explanation: {
    fr: "Bien que les deux fonds aient la même espérance de rendement (μ=8%), leur taux de croissance médian diffère : environ 8%−10%²/2=7,5% pour le fonds A, contre 8%−30%²/2=3,5% pour le fonds B. Le drag de volatilité pénalise bien plus fortement le fonds B, dont le capital médian accumulé sur longue période sera typiquement inférieur à celui du fonds A, malgré un rendement moyen affiché identique.",
    en: "Although both funds have the same expected return (μ=8%), their median growth rate differs: about 8%−10%²/2=7.5% for fund A, versus 8%−30%²/2=3.5% for fund B. Volatility drag penalizes fund B much more heavily, whose accumulated median capital over a long period will typically be lower than fund A's, despite an identical displayed average return.",
  },
  commonMistake: {
    fr: "Comparer deux investissements uniquement sur leur rendement moyen affiché, sans tenir compte de l'effet du drag de volatilité sur le résultat réellement accumulé sur longue période.",
    en: "Comparing two investments solely on their displayed average return, without accounting for volatility drag's effect on the outcome actually accumulated over a long period.",
  },
});

export const templates: QuestionTemplate[] = [
  gbmNumericTemplate,
  canGoNegativeTemplate,
  stockChoiceTemplate,
  vocabTemplate,
  comprehensionTemplate,
  meanVsMedianComparisonTemplate,
  whatIfHigherVolTemplate,
  logTransformScenarioTemplate,
  expectedValueNumericTemplate,
  muIsExpectedReturnErrorTemplate,
  negativeRateScenarioTemplate,
  fundComparisonScenarioTemplate,
];
