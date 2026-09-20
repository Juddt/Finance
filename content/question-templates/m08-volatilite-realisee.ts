import { randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const annualizeNumericTemplate: QuestionTemplate = {
  id: "m08-vol-realisee-annualisation",
  conceptId: "m08-volatilite-realisee",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const dailyStdPct = randomFloat(rng, 0.5, 3, 2);
    const annualized = Math.round(dailyStdPct * Math.sqrt(252) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `L'écart-type des rendements journaliers d'une action est de ${fmt(dailyStdPct, "fr")}%. Quelle est sa volatilité annualisée (base 252 jours), en % ?`,
        en: `A stock's daily return standard deviation is ${fmt(dailyStdPct, "en")}%. What is its annualized volatility (252-day basis), in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.5",
      hint: { fr: "σ_annualisée = σ_journalière × √252.", en: "σ_annualized = σ_daily × √252." },
      numeric: { value: annualized, tolerance: 0.5 },
      calculation: { fr: `σ_annualisée = ${fmt(dailyStdPct, "fr")}% × √252 ≈ ${fmt(dailyStdPct, "fr")}%×15,87 ≈ ${fmt(annualized, "fr")}%.`, en: `σ_annualized = ${fmt(dailyStdPct, "en")}% × √252 ≈ ${fmt(dailyStdPct, "en")}%×15.87 ≈ ${fmt(annualized, "en")}%.` },
      explanation: {
        fr: "La volatilité s'annualise avec la racine carrée du nombre de périodes par an, pas avec le nombre de périodes lui-même.",
        en: "Volatility is annualized with the square root of the number of periods per year, not the number of periods itself.",
      },
      commonMistake: {
        fr: "Multiplier par 252 directement au lieu de √252.",
        en: "Multiplying by 252 directly instead of √252.",
      },
    };
  },
};

const logVsSimpleTemplate: QuestionTemplate = {
  id: "m08-vol-realisee-log-vs-simple",
  conceptId: "m08-volatilite-realisee",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Les rendements logarithmiques et les rendements simples donnent exactement le même résultat pour le calcul de la volatilité réalisée, quelle que soit l'ampleur des mouvements de prix.",
      en: "Log returns and simple returns give exactly the same result for computing realized volatility, whatever the magnitude of price moves.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : les deux convergent pour de petites variations, mais diffèrent pour de grands mouvements — seuls les rendements logarithmiques s'additionnent proprement dans le temps, ce qui en fait la convention standard.",
      en: "False: the two converge for small changes, but differ for large moves — only log returns cleanly add up over time, which is why they're the standard convention.",
    },
    commonMistake: {
      fr: "Croire que le choix entre rendement simple et logarithmique n'a aucune conséquence pratique.",
      en: "Believing the choice between simple and log returns has no practical consequence.",
    },
  }),
};

const windowSensitivityTemplate: QuestionTemplate = {
  id: "m08-vol-realisee-fenetre",
  conceptId: "m08-volatilite-realisee",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Deux analystes calculent la volatilité réalisée du même actif, l'un sur les 10 derniers jours, l'autre sur les 250 derniers jours. Peuvent-ils obtenir des résultats significativement différents, tout en étant chacun \"correct\" ?",
      en: "Two analysts compute the same asset's realized volatility, one over the last 10 days, the other over the last 250 days. Can they get significantly different results, while each being \"correct\"?",
    },
    choices: buildChoices([
      { id: "yes", label: { fr: "Oui, le choix de la fenêtre d'observation influence fortement le résultat", en: "Yes, the observation window choice strongly influences the result" } },
      { id: "no", label: { fr: "Non, la volatilité réalisée est une mesure objective indépendante de la fenêtre", en: "No, realized volatility is an objective measure independent of the window" } },
    ]),
    hint: { fr: "Pensez à un actif qui vient de traverser une semaine agitée après des mois calmes.", en: "Think of an asset that just went through a turbulent week after months of calm." },
    correctChoiceIds: ["yes"],
    explanation: {
      fr: "Oui : la fenêtre d'observation choisie affecte fortement le résultat, ce qui rend toute comparaison entre sources sensible à ce choix méthodologique — il n'y a pas UNE seule \"vraie\" volatilité réalisée.",
      en: "Yes: the chosen observation window strongly affects the result, making any cross-source comparison sensitive to this methodological choice — there is no single \"true\" realized volatility.",
    },
    commonMistake: {
      fr: "Croire que la volatilité réalisée est un chiffre unique et objectif, indépendant des choix méthodologiques.",
      en: "Believing realized volatility is a single, objective number, independent of methodological choices.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-vol-realisee-vocab",
  conceptId: "m08-volatilite-realisee",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "r_t = ln(S_t/S_{t-1}) est appelé le rendement ______ de l'actif.",
      en: "r_t = ln(S_t/S_{t-1}) is called the asset's ______ return.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["logarithmique", "log"],
    hint: { fr: "Le rendement calculé via un logarithme.", en: "The return computed via a logarithm." },
    explanation: {
      fr: "Le rendement logarithmique est la convention standard pour calculer la volatilité réalisée, car il s'additionne proprement dans le temps.",
      en: "The log return is the standard convention for computing realized volatility, since it cleanly adds up over time.",
    },
    commonMistake: {
      fr: "Confondre rendement logarithmique et rendement simple (S_t/S_{t-1} − 1).",
      en: "Confusing the log return with the simple return (S_t/S_{t-1} − 1).",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m08-vol-realisee-comprehension",
  conceptId: "m08-volatilite-realisee",
  difficulty: "easy",
  prompt: {
    fr: "À quoi sert principalement la volatilité réalisée ?",
    en: "What is realized volatility mainly used for?",
  },
  choices: [
    { id: "measure-past", label: { fr: "Mesurer, à partir des prix passés, l'amplitude effective des mouvements d'un actif sur une période écoulée", en: "Measuring, from past prices, the actual amplitude of an asset's moves over an elapsed period" } },
    { id: "predict-future", label: { fr: "Prédire avec certitude la volatilité future de l'actif", en: "Predicting the asset's future volatility with certainty" } },
    { id: "market-expectation", label: { fr: "Refléter directement l'anticipation du marché sur la volatilité future, comme le fait la volatilité implicite", en: "Directly reflecting the market's expectation of future volatility, the way implied volatility does" } },
  ],
  correctId: "measure-past",
  hint: { fr: "\"Réalisée\" = déjà constatée, à partir de données historiques.", en: "\"Realized\" = already observed, from historical data." },
  explanation: {
    fr: "La volatilité réalisée est une mesure rétrospective, calculée à partir des rendements historiques déjà observés : elle décrit ce qui s'est passé, contrairement à la volatilité implicite qui reflète l'anticipation du marché pour l'avenir.",
    en: "Realized volatility is a backward-looking measure, computed from already-observed historical returns: it describes what happened, unlike implied volatility which reflects the market's expectation for the future.",
  },
  commonMistake: {
    fr: "Confondre volatilité réalisée (historique, rétrospective) et volatilité implicite (anticipation, prospective).",
    en: "Confusing realized volatility (historical, backward-looking) with implied volatility (expectation, forward-looking).",
  },
});

const comparisonRealizedVsImpliedTemplate = mcqTemplate({
  id: "m08-vol-realisee-vs-implicite-comparaison",
  conceptId: "m08-volatilite-realisee",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence fondamentale sépare la volatilité réalisée de la volatilité implicite ?",
    en: "What fundamental difference separates realized volatility from implied volatility?",
  },
  choices: [
    { id: "past-vs-future", label: { fr: "La réalisée décrit le passé constaté ; l'implicite reflète l'anticipation du marché, extraite des prix d'options", en: "Realized describes the observed past; implied reflects the market's expectation, extracted from option prices" } },
    { id: "same-thing", label: { fr: "Aucune : ce sont deux noms pour la même quantité", en: "None: they are two names for the same quantity" } },
    { id: "realized-always-higher", label: { fr: "La réalisée est toujours strictement supérieure à l'implicite", en: "Realized is always strictly higher than implied" } },
  ],
  correctId: "past-vs-future",
  hint: { fr: "L'une se calcule à partir de prix spot passés, l'autre s'extrait de prix d'options actuels.", en: "One is computed from past spot prices, the other is extracted from current option prices." },
  explanation: {
    fr: "La volatilité réalisée se calcule a posteriori sur des rendements historiques du sous-jacent, tandis que la volatilité implicite est extraite des prix d'options cotés aujourd'hui et reflète l'anticipation collective du marché — les deux peuvent diverger, ce qui alimente des stratégies de trading de volatilité (variance swaps notamment).",
    en: "Realized volatility is computed after the fact from the underlying's historical returns, while implied volatility is extracted from option prices quoted today and reflects the market's collective expectation — the two can diverge, which fuels volatility trading strategies (variance swaps in particular).",
  },
  commonMistake: {
    fr: "Croire qu'une relation d'ordre fixe (réalisée toujours au-dessus ou en dessous de l'implicite) existe systématiquement.",
    en: "Believing a fixed ordering (realized always above or below implied) systematically holds.",
  },
});

const whatIfIntradayDataTemplate = mcqTemplate({
  id: "m08-vol-realisee-what-if-donnees-intraday",
  conceptId: "m08-volatilite-realisee",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un analyste remplace des rendements journaliers de clôture par des rendements sur des intervalles de 5 minutes pour calculer la volatilité réalisée d'une action. Que se passe-t-il typiquement ?",
    en: "An analyst replaces daily closing returns with 5-minute interval returns to compute a stock's realized volatility. What typically happens?",
  },
  choices: [
    { id: "more-precise-but-noisy", label: { fr: "L'estimation gagne en précision statistique mais devient sensible au bruit de microstructure (spread bid-ask, effets de rebond)", en: "The estimate gains statistical precision but becomes sensitive to microstructure noise (bid-ask spread, bounce effects)" } },
    { id: "no-difference", label: { fr: "Aucun changement : la fréquence d'échantillonnage n'a aucun impact sur le résultat", en: "No change: sampling frequency has no impact on the result" } },
    { id: "always-lower", label: { fr: "La volatilité mesurée devient systématiquement plus basse", en: "The measured volatility becomes systematically lower" } },
  ],
  correctId: "more-precise-but-noisy",
  hint: { fr: "Plus d'observations, mais chaque observation est plus \"bruitée\" par la microstructure du marché.", en: "More observations, but each observation is more \"noisy\" due to market microstructure." },
  explanation: {
    fr: "Utiliser des données à très haute fréquence réduit l'erreur d'échantillonnage liée au nombre d'observations, mais introduit du bruit de microstructure (écart bid-ask, rebonds de prix) qui biaise l'estimateur — d'où l'usage de techniques de correction (sous-échantillonnage, noyaux de réalisation) en pratique.",
    en: "Using very high-frequency data reduces the sampling error from a larger observation count, but introduces microstructure noise (bid-ask spread, price bouncing) that biases the estimator — hence the use of correction techniques (subsampling, realized kernels) in practice.",
  },
  commonMistake: {
    fr: "Penser que \"plus de données\" est toujours strictement meilleur, sans considérer le bruit ajouté par la haute fréquence.",
    en: "Thinking \"more data\" is always strictly better, without considering the noise added by high frequency.",
  },
});

const whatIfRegimeChangeTemplate = mcqTemplate({
  id: "m08-vol-realisee-what-if-changement-regime",
  conceptId: "m08-volatilite-realisee",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un actif a connu 20 jours très calmes suivis de 10 jours très agités, sur une fenêtre de 30 jours. Un unique chiffre de volatilité réalisée sur ces 30 jours reflète-t-il fidèlement les deux régimes ?",
    en: "An asset had 20 very calm days followed by 10 very turbulent days, over a 30-day window. Does a single realized volatility figure over these 30 days faithfully reflect both regimes?",
  },
  choices: [
    { id: "no-averages-out", label: { fr: "Non : le chiffre moyenne les deux régimes et masque à la fois le calme initial et l'agitation récente", en: "No: the figure averages the two regimes and masks both the initial calm and the recent turbulence" } },
    { id: "yes-fully", label: { fr: "Oui, la volatilité réalisée capture parfaitement chaque sous-période au sein du chiffre global", en: "Yes, realized volatility perfectly captures each sub-period within the overall figure" } },
  ],
  correctId: "no-averages-out",
  hint: { fr: "Une moyenne (implicite dans le calcul) écrase les variations à l'intérieur de la fenêtre.", en: "An average (implicit in the calculation) flattens variations within the window." },
  explanation: {
    fr: "La volatilité réalisée sur une fenêtre donnée produit un seul chiffre qui moyenne implicitement tout changement de régime survenu pendant la période : un choc récent peut être dilué par un long calme antérieur, ou inversement — d'où l'intérêt de comparer plusieurs fenêtres (10, 30, 90 jours) plutôt que de se fier à une seule.",
    en: "Realized volatility over a given window produces a single figure that implicitly averages out any regime change during the period: a recent shock can be diluted by a long prior calm, or vice versa — hence the value of comparing several windows (10, 30, 90 days) rather than relying on just one.",
  },
  commonMistake: {
    fr: "Interpréter un seul chiffre de volatilité réalisée comme représentatif de l'état actuel du marché, sans vérifier s'il masque un changement de régime récent.",
    en: "Interpreting a single realized volatility figure as representative of the current market state, without checking whether it masks a recent regime change.",
  },
});

const sampleStdevNumericTemplate: QuestionTemplate = {
  id: "m08-vol-realisee-calcul-ecart-type-echantillon",
  conceptId: "m08-volatilite-realisee",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const base = randomFloat(rng, 1, 2, 2);
    const returns = [base, -base * 0.5, base * 1.5, -base].map((v) => Math.round(v * 100) / 100);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length - 1);
    const dailyStd = Math.round(Math.sqrt(variance) * 100) / 100;

    return {
      isScenario: false,
      prompt: {
        fr: `Sur 4 jours, les rendements journaliers en % d'une action sont : ${returns[0]}%, ${returns[1]}%, ${returns[2]}%, ${returns[3]}%. Quel est l'écart-type journalier (échantillon, n−1) de ces rendements, en % ?`,
        en: `Over 4 days, a stock's daily returns in % are: ${returns[0]}%, ${returns[1]}%, ${returns[2]}%, ${returns[3]}%. What is the daily (sample, n−1) standard deviation of these returns, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "1) Moyenne des rendements. 2) Somme des écarts au carré divisée par (n−1). 3) Racine carrée.", en: "1) Mean of returns. 2) Sum of squared deviations divided by (n−1). 3) Square root." },
      numeric: { value: dailyStd, tolerance: 0.1 },
      calculation: {
        fr: `Moyenne = (${returns.join("% + ")}%) / 4 = ${fmt(mean, "fr")}%. Variance échantillon = Σ(rᵢ−moyenne)² / (4−1) ≈ ${fmt(variance, "fr", 4)}. Écart-type = √${fmt(variance, "fr", 4)} ≈ ${fmt(dailyStd, "fr")}%.`,
        en: `Mean = (${returns.join("% + ")}%) / 4 = ${fmt(mean, "en")}%. Sample variance = Σ(rᵢ−mean)² / (4−1) ≈ ${fmt(variance, "en", 4)}. Standard deviation = √${fmt(variance, "en", 4)} ≈ ${fmt(dailyStd, "en")}%.`,
      },
      explanation: {
        fr: "Contrairement à l'annualisation (qui multiplie par √252), calculer la volatilité réalisée elle-même part d'une série de rendements bruts et applique la formule de l'écart-type échantillon : centrer sur la moyenne, sommer les carrés des écarts, diviser par (n−1), puis prendre la racine carrée.",
        en: "Unlike annualization (which multiplies by √252), computing realized volatility itself starts from a raw return series and applies the sample standard deviation formula: center on the mean, sum the squared deviations, divide by (n−1), then take the square root.",
      },
      commonMistake: {
        fr: "Diviser par n au lieu de (n−1), ou oublier de soustraire la moyenne avant de mettre au carré.",
        en: "Dividing by n instead of (n−1), or forgetting to subtract the mean before squaring.",
      },
    };
  },
};

const varianceVsVolMistakeTemplate = trueFalseTemplate({
  id: "m08-vol-realisee-erreur-variance-vol",
  conceptId: "m08-volatilite-realisee",
  difficulty: "medium",
  statement: {
    fr: "La variance des rendements et la volatilité réalisée sont deux noms interchangeables pour la même quantité numérique.",
    en: "The variance of returns and realized volatility are two interchangeable names for the same numeric quantity.",
  },
  correct: false,
  hint: { fr: "L'une est le carré de l'autre.", en: "One is the square of the other." },
  explanation: {
    fr: "Faux : la volatilité réalisée est la racine carrée de la variance des rendements (un écart-type). Oublier cette racine carrée est une erreur fréquente qui fait dire, par exemple, \"volatilité de 0,0009\" au lieu de \"volatilité de 3%\".",
    en: "False: realized volatility is the square root of the return variance (a standard deviation). Forgetting this square root is a common mistake that leads to saying, e.g., \"volatility of 0.0009\" instead of \"volatility of 3%\".",
  },
  commonMistake: {
    fr: "Reporter la variance calculée en oubliant d'en prendre la racine carrée pour obtenir la volatilité.",
    en: "Reporting the computed variance while forgetting to take its square root to obtain volatility.",
  },
});

const riskManagerScenarioTemplate = mcqTemplate({
  id: "m08-vol-realisee-scenario-risk-manager",
  conceptId: "m08-volatilite-realisee",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un risk manager compare la volatilité réalisée sur 30 jours d'une action à celle calculée un mois plus tôt, et constate qu'elle a doublé après une série de résultats trimestriels décevants. Quelle action est la plus cohérente avec cette observation ?",
    en: "A risk manager compares a stock's 30-day realized volatility to the figure computed a month earlier, and finds it has doubled after a series of disappointing quarterly results. Which action is most consistent with this observation?",
  },
  choices: [
    { id: "revise-var", label: { fr: "Réviser à la hausse les limites de VaR ou de position sur cet actif, le risque mesuré ayant augmenté", en: "Revise VaR or position limits upward for this asset, since the measured risk has increased" } },
    { id: "ignore", label: { fr: "Ignorer ce changement, la volatilité réalisée n'étant pas pertinente pour la gestion des risques", en: "Ignore this change, since realized volatility is not relevant for risk management" } },
    { id: "assume-error", label: { fr: "Conclure automatiquement à une erreur de calcul, un doublement étant impossible en pratique", en: "Automatically conclude there is a calculation error, since a doubling is impossible in practice" } },
  ],
  correctId: "revise-var",
  hint: { fr: "La volatilité réalisée est un intrant direct des mesures de risque comme la VaR paramétrique.", en: "Realized volatility is a direct input to risk measures like parametric VaR." },
  explanation: {
    fr: "La volatilité réalisée est un intrant central des mesures de risque (VaR paramétrique, limites de position) : un doublement observé après un choc fondamental doit se traduire par une révision des limites de risque, car le passé récent suggère une amplitude de mouvement désormais plus élevée.",
    en: "Realized volatility is a core input to risk measures (parametric VaR, position limits): a doubling observed after a fundamental shock should translate into revised risk limits, since the recent past suggests a now-higher range of moves.",
  },
  commonMistake: {
    fr: "Traiter la volatilité réalisée comme une statistique purement descriptive, sans en tirer de conséquence opérationnelle sur la gestion des risques.",
    en: "Treating realized volatility as a purely descriptive statistic, without drawing any operational risk-management consequence.",
  },
});

const traderVolSpikeScenarioTemplate = mcqTemplate({
  id: "m08-vol-realisee-scenario-trader-spike",
  conceptId: "m08-volatilite-realisee",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader dimensionne ses positions en fonction de la volatilité réalisée récente (règle de \"vol targeting\"). Après un pic soudain de volatilité réalisée sur l'actif qu'il suit, que fait typiquement cette règle ?",
    en: "A trader sizes positions based on recent realized volatility (a \"vol targeting\" rule). After a sudden spike in realized volatility on the asset they follow, what does this rule typically do?",
  },
  choices: [
    { id: "reduce-size", label: { fr: "Réduire la taille de la position, pour maintenir un risque en euros/dollars constant malgré la hausse de volatilité", en: "Reduce position size, to keep the euro/dollar risk roughly constant despite the rise in volatility" } },
    { id: "increase-size", label: { fr: "Augmenter la taille de la position pour profiter du regain d'agitation", en: "Increase position size to take advantage of the renewed turbulence" } },
    { id: "no-effect", label: { fr: "Ne rien changer, la volatilité réalisée n'intervenant pas dans le dimensionnement des positions", en: "Change nothing, since realized volatility plays no role in position sizing" } },
  ],
  correctId: "reduce-size",
  hint: { fr: "Position ≈ budget de risque / volatilité : que se passe-t-il au dénominateur si la volatilité augmente ?", en: "Position ≈ risk budget / volatility: what happens to the denominator if volatility rises?" },
  explanation: {
    fr: "Une règle de vol targeting dimensionne la position inversement à la volatilité réalisée récente (position ≈ budget de risque / volatilité) : un pic de volatilité réalisée entraîne mécaniquement une réduction de la taille de position, afin de maintenir le risque en euros à peu près constant.",
    en: "A vol targeting rule sizes the position inversely to recent realized volatility (position ≈ risk budget / volatility): a spike in realized volatility mechanically triggers a reduction in position size, to keep the euro risk roughly constant.",
  },
  commonMistake: {
    fr: "Croire qu'un pic de volatilité incite à augmenter l'exposition pour \"profiter\" du mouvement, plutôt qu'à la réduire pour contenir le risque.",
    en: "Believing a volatility spike is a reason to increase exposure to \"profit\" from the move, rather than to reduce it to contain risk.",
  },
});

export const templates: QuestionTemplate[] = [
  annualizeNumericTemplate,
  logVsSimpleTemplate,
  windowSensitivityTemplate,
  vocabTemplate,
  comprehensionTemplate,
  comparisonRealizedVsImpliedTemplate,
  whatIfIntradayDataTemplate,
  whatIfRegimeChangeTemplate,
  sampleStdevNumericTemplate,
  varianceVsVolMistakeTemplate,
  riskManagerScenarioTemplate,
  traderVolSpikeScenarioTemplate,
];
