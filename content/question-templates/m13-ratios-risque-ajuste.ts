import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const sharpeNumericTemplate: QuestionTemplate = {
  id: "m13-ratios-sharpe-calcul",
  conceptId: "m13-ratios-risque-ajuste",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const returnPct = randomInt(rng, 5, 20) / 100;
    const rf = randomInt(rng, 1, 4) / 100;
    const vol = randomInt(rng, 8, 25) / 100;
    const sharpe = Math.round(((returnPct - rf) / vol) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un fonds a un rendement annualisé de ${fmt(returnPct * 100, "fr", 0)}%, le taux sans risque est de ${fmt(rf * 100, "fr", 0)}%, et sa volatilité est de ${fmt(vol * 100, "fr", 0)}%. Quel est son ratio de Sharpe ?`,
        en: `A fund has an annualized return of ${fmt(returnPct * 100, "en", 0)}%, the risk-free rate is ${fmt(rf * 100, "en", 0)}%, and its volatility is ${fmt(vol * 100, "en", 0)}%. What is its Sharpe ratio?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.1",
      hint: { fr: "Sharpe = (rendement − taux sans risque) / volatilité.", en: "Sharpe = (return − risk-free rate) / volatility." },
      numeric: { value: sharpe, tolerance: 0.1 },
      calculation: {
        fr: `Sharpe = (${fmt(returnPct * 100, "fr", 0)}% − ${fmt(rf * 100, "fr", 0)}%) / ${fmt(vol * 100, "fr", 0)}% ≈ ${fmt(sharpe, "fr")}.`,
        en: `Sharpe = (${fmt(returnPct * 100, "en", 0)}% − ${fmt(rf * 100, "en", 0)}%) / ${fmt(vol * 100, "en", 0)}% ≈ ${fmt(sharpe, "en")}.`,
      },
      explanation: {
        fr: "Le ratio de Sharpe normalise l'excès de rendement par la volatilité totale, permettant de comparer des stratégies avec des niveaux de risque différents.",
        en: "The Sharpe ratio normalizes excess return by total volatility, allowing comparison of strategies with different risk levels.",
      },
      commonMistake: {
        fr: "Oublier de soustraire le taux sans risque du rendement avant de diviser par la volatilité.",
        en: "Forgetting to subtract the risk-free rate from the return before dividing by volatility.",
      },
    };
  },
};

const sortinoVsSharpeTemplate: QuestionTemplate = {
  id: "m13-ratios-sortino-vs-sharpe",
  conceptId: "m13-ratios-risque-ajuste",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quelle est la principale différence entre le ratio de Sortino et le ratio de Sharpe ?",
      en: "What is the main difference between the Sortino ratio and the Sharpe ratio?",
    },
    choices: buildChoices([
      { id: "downside-only", label: { fr: "Le Sortino ne pénalise que la volatilité à la baisse, pas la volatilité totale", en: "Sortino only penalizes downside volatility, not total volatility" } },
      { id: "same", label: { fr: "Ils sont mathématiquement identiques, seul le nom diffère", en: "They are mathematically identical, only the name differs" } },
    ]),
    hint: { fr: "Le Sortino ignore la volatilité \"favorable\" (à la hausse).", en: "Sortino ignores \"favorable\" (upside) volatility." },
    correctChoiceIds: ["downside-only"],
    explanation: {
      fr: "Le ratio de Sortino ne pénalise que la volatilité à la baisse (downside risk), ignorant la volatilité à la hausse qui n'est pas un risque du point de vue de l'investisseur, contrairement au Sharpe qui traite toute volatilité symétriquement.",
      en: "The Sortino ratio only penalizes downside volatility, ignoring upside volatility which isn't a risk from the investor's viewpoint, unlike Sharpe which treats all volatility symmetrically.",
    },
    commonMistake: {
      fr: "Croire que Sharpe et Sortino mesurent exactement la même chose avec des noms différents.",
      en: "Believing Sharpe and Sortino measure exactly the same thing with different names.",
    },
  }),
};

const calmarUseCaseTemplate: QuestionTemplate = {
  id: "m13-ratios-calmar-usage",
  conceptId: "m13-ratios-risque-ajuste",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le ratio de Calmar divise le rendement annualisé par le drawdown maximal, plutôt que par la volatilité totale.",
      en: "The Calmar ratio divides annualized return by maximum drawdown, rather than by total volatility.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : le ratio de Calmar capture spécifiquement le risque de perte extrême (drawdown maximal) plutôt que la volatilité globale, une perspective différente et complémentaire du Sharpe.",
      en: "True: the Calmar ratio specifically captures extreme loss risk (maximum drawdown) rather than overall volatility, a different, complementary perspective to Sharpe.",
    },
    commonMistake: {
      fr: "Confondre le Calmar avec le Sharpe, qui utilise la volatilité totale plutôt que le drawdown maximal.",
      en: "Confusing Calmar with Sharpe, which uses total volatility rather than maximum drawdown.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-ratios-vocab",
  conceptId: "m13-ratios-risque-ajuste",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'écart-type de la différence de rendement entre un portefeuille et son benchmark s'appelle le ______ error.",
      en: "The standard deviation of the return difference between a portfolio and its benchmark is called ______ error.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["tracking"],
    hint: { fr: "Le même terme que dans le glossaire de la leçon.", en: "The same term as in the lesson's glossary." },
    explanation: {
      fr: "Le tracking error mesure à quel point un portefeuille s'écarte de son indice de référence, un ingrédient clé de l'information ratio (alpha / tracking error).",
      en: "Tracking error measures how much a portfolio deviates from its reference index, a key ingredient of the information ratio (alpha / tracking error).",
    },
    commonMistake: {
      fr: "Confondre ce terme avec la volatilité totale du portefeuille, qui ne se réfère à aucun benchmark.",
      en: "Confusing this term with the portfolio's total volatility, which references no benchmark.",
    },
  }),
};

export const templates: QuestionTemplate[] = [sharpeNumericTemplate, sortinoVsSharpeTemplate, calmarUseCaseTemplate, vocabTemplate];
