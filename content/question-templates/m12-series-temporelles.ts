import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const garchNumericTemplate: QuestionTemplate = {
  id: "m12-series-garch-calcul",
  conceptId: "m12-series-temporelles",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const omega = randomInt(rng, 1, 5) / 100000;
    const alpha = randomInt(rng, 5, 15) / 100;
    const beta = randomInt(rng, 75, 90) / 100;
    const epsPrev2 = randomInt(rng, 10, 40) / 10000;
    const sigmaPrev2 = randomInt(rng, 15, 35) / 10000;
    const sigmaNext2 = Math.round((omega + alpha * epsPrev2 + beta * sigmaPrev2) * 1000000) / 1000000;

    return {
      isScenario: true,
      prompt: {
        fr: `Un modèle GARCH(1,1) a ω=${fmt(omega, "fr", 6)}, α=${fmt(alpha, "fr", 2)}, β=${fmt(beta, "fr", 2)}. Le choc au carré d'hier était ε²=${fmt(epsPrev2, "fr", 4)} et la variance d'hier σ²=${fmt(sigmaPrev2, "fr", 4)}. Quelle est la variance prévue pour aujourd'hui ?`,
        en: `A GARCH(1,1) model has ω=${fmt(omega, "en", 6)}, α=${fmt(alpha, "en", 2)}, β=${fmt(beta, "en", 2)}. Yesterday's squared shock was ε²=${fmt(epsPrev2, "en", 4)} and yesterday's variance σ²=${fmt(sigmaPrev2, "en", 4)}. What is today's forecast variance?`,
      },
      numericUnit: { fr: "variance (carré du rendement)", en: "variance (squared return)" },
      numericTolerance: "± 0.0003",
      hint: { fr: "σ²_t = ω + α×ε²_{t-1} + β×σ²_{t-1}.", en: "σ²_t = ω + α×ε²_{t-1} + β×σ²_{t-1}." },
      numeric: { value: sigmaNext2, tolerance: 0.0003 },
      calculation: {
        fr: `σ²_t = ${fmt(omega, "fr", 6)} + ${fmt(alpha, "fr", 2)}×${fmt(epsPrev2, "fr", 4)} + ${fmt(beta, "fr", 2)}×${fmt(sigmaPrev2, "fr", 4)} ≈ ${fmt(sigmaNext2, "fr", 5)}.`,
        en: `σ²_t = ${fmt(omega, "en", 6)} + ${fmt(alpha, "en", 2)}×${fmt(epsPrev2, "en", 4)} + ${fmt(beta, "en", 2)}×${fmt(sigmaPrev2, "en", 4)} ≈ ${fmt(sigmaNext2, "en", 5)}.`,
      },
      explanation: {
        fr: "La variance GARCH combine une composante constante (ω), l'effet du choc récent (α×ε²) et la persistance de la variance récente (β×σ²), capturant le clustering de volatilité.",
        en: "GARCH variance combines a constant component (ω), the recent shock's effect (α×ε²) and recent variance's persistence (β×σ²), capturing volatility clustering.",
      },
      commonMistake: {
        fr: "Oublier l'un des trois termes de la somme, ou confondre ε² (choc au carré) avec σ² (variance).",
        en: "Forgetting one of the three terms in the sum, or confusing ε² (squared shock) with σ² (variance).",
      },
    };
  },
};

const stationarityTemplate: QuestionTemplate = {
  id: "m12-series-stationnarite",
  conceptId: "m12-series-temporelles",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pourquoi vérifie-t-on la stationnarité avant d'ajuster un modèle AR/ARIMA classique ?",
      en: "Why is stationarity checked before fitting a classic AR/ARIMA model?",
    },
    choices: buildChoices([
      { id: "assumption", label: { fr: "C'est une hypothèse nécessaire du modèle ; sinon il faut différencier la série (le \"I\" d'ARIMA)", en: "It's a necessary model assumption; otherwise the series must be differenced (ARIMA's \"I\")" } },
      { id: "irrelevant", label: { fr: "C'est indifférent, le modèle s'adapte automatiquement à toute série", en: "It doesn't matter, the model automatically adapts to any series" } },
    ]),
    hint: { fr: "Le \"I\" dans ARIMA signifie justement \"intégré\", en référence à la différenciation.", en: "The \"I\" in ARIMA precisely means \"integrated\", referring to differencing." },
    correctChoiceIds: ["assumption"],
    explanation: {
      fr: "Les modèles AR/ARIMA classiques supposent des propriétés statistiques stables dans le temps (stationnarité). Une série non-stationnaire doit d'abord être différenciée pour la rendre stationnaire, ce qui correspond exactement à la composante \"I\" (intégrée) du modèle ARIMA.",
      en: "Classic AR/ARIMA models assume statistical properties stable over time (stationarity). A non-stationary series must first be differenced to make it stationary, which is exactly what ARIMA's \"I\" (integrated) component does.",
    },
    commonMistake: {
      fr: "Ignorer la stationnarité et ajuster directement un AR sur une série non-stationnaire, produisant des résultats non fiables.",
      en: "Ignoring stationarity and directly fitting an AR on a non-stationary series, producing unreliable results.",
    },
  }),
};

const validationTemplate: QuestionTemplate = {
  id: "m12-series-validation-chronologique",
  conceptId: "m12-series-temporelles",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une validation croisée k-fold aléatoire standard est appropriée pour évaluer un modèle de série temporelle financière.",
      en: "Standard random k-fold cross-validation is appropriate for evaluating a financial time series model.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un k-fold aléatoire mélange passé et futur, ce qui constitue une fuite de données temporelle. Il faut utiliser une validation chronologique (walk-forward, voir M12-cross).",
      en: "False: a random k-fold mixes past and future, which constitutes temporal data leakage. Chronological (walk-forward) validation must be used instead (see M12-cross).",
    },
    commonMistake: {
      fr: "Appliquer par défaut la pratique standard du machine learning généraliste sans tenir compte de la structure temporelle des données financières.",
      en: "Applying general-purpose machine learning's default practice without accounting for financial data's temporal structure.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m12-series-vocab",
  conceptId: "m12-series-temporelles",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le phénomène où les périodes de forte volatilité ont tendance à se regrouper dans le temps s'appelle le ______ de volatilité.",
      en: "The phenomenon where periods of high volatility tend to cluster together in time is called volatility ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["clustering", "regroupement"],
    hint: { fr: "Le même mot que dans « clustering de volatilité ».", en: "The same word as in \"volatility clustering\"." },
    explanation: {
      fr: "Le clustering de volatilité est le phénomène empirique que GARCH capture explicitement : les périodes de forte volatilité tendent à se succéder, plutôt que d'être réparties uniformément dans le temps.",
      en: "Volatility clustering is the empirical phenomenon GARCH explicitly captures: periods of high volatility tend to follow one another, rather than being uniformly spread over time.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec l'autocorrélation des rendements eux-mêmes, un phénomène distinct de l'autocorrélation de leur variance.",
      en: "Confusing this term with the returns' own autocorrelation, a phenomenon distinct from their variance's autocorrelation.",
    },
  }),
};

export const templates: QuestionTemplate[] = [garchNumericTemplate, stationarityTemplate, validationTemplate, vocabTemplate];
