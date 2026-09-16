import { randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

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

export const templates: QuestionTemplate[] = [annualizeNumericTemplate, logVsSimpleTemplate, windowSensitivityTemplate, vocabTemplate];
