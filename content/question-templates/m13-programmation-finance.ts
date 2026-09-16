import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const percentileNumericTemplate: QuestionTemplate = {
  id: "m13-programmation-percentile-calcul",
  conceptId: "m13-programmation-finance",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const n = pick(rng, [200, 400, 500, 1000] as const);
    const pct = 5;
    const index = Math.round((n * pct) / 100);

    return {
      isScenario: true,
      prompt: {
        fr: `Vous calculez une VaR historique à 95% sur ${fmt(n, "fr", 0)} jours de rendements triés du pire au meilleur. Quel est l'indice (position) approximatif du rendement correspondant au 5e percentile ?`,
        en: `You compute a 95% historical VaR over ${fmt(n, "en", 0)} days of returns sorted from worst to best. What is the approximate index (position) of the return corresponding to the 5th percentile?`,
      },
      numericUnit: { fr: "position dans la série triée", en: "position in the sorted series" },
      numericTolerance: "± 2",
      hint: { fr: "Position ≈ N × 5%.", en: "Position ≈ N × 5%." },
      numeric: { value: index, tolerance: 2 },
      calculation: {
        fr: `Position ≈ ${fmt(n, "fr", 0)} × 5% = ${fmt(index, "fr", 0)}.`,
        en: `Position ≈ ${fmt(n, "en", 0)} × 5% = ${fmt(index, "en", 0)}.`,
      },
      explanation: {
        fr: "La VaR historique à 95% correspond directement au 5e percentile empirique de la distribution des rendements observés, sans hypothèse de distribution statistique.",
        en: "The 95% historical VaR directly corresponds to the empirical 5th percentile of the observed return distribution, with no statistical distribution assumption.",
      },
      commonMistake: {
        fr: "Confondre le niveau de confiance (95%) avec le percentile à utiliser (5%, son complément à 100%).",
        en: "Confusing the confidence level (95%) with the percentile to use (5%, its complement to 100%).",
      },
    };
  },
};

const vectorizationTemplate: QuestionTemplate = {
  id: "m13-programmation-vectorisation",
  conceptId: "m13-programmation-finance",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une opération vectorisée (numpy, pandas) sur un grand tableau de données est généralement plus rapide qu'une boucle Python explicite équivalente.",
      en: "A vectorized operation (numpy, pandas) on a large data array is generally faster than an equivalent explicit Python loop.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : numpy délègue les calculs à du code compilé en C sur des tableaux de mémoire contiguë, évitant l'overhead de l'interpréteur Python à chaque itération — un facteur d'accélération qui peut atteindre 100x ou plus.",
      en: "True: numpy delegates computations to compiled C code on contiguous memory arrays, avoiding the Python interpreter's overhead at each iteration — a speedup factor that can reach 100x or more.",
    },
    commonMistake: {
      fr: "Croire qu'une boucle Python explicite est toujours aussi rapide qu'une opération vectorisée équivalente.",
      en: "Believing an explicit Python loop is always as fast as an equivalent vectorized operation.",
    },
  }),
};

const toolChoiceTemplate: QuestionTemplate = {
  id: "m13-programmation-choix-outil",
  conceptId: "m13-programmation-finance",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Quel langage/outil s'est imposé comme référence pour l'analyse quantitative et le machine learning en finance ?",
      en: "Which language/tool has established itself as the reference for quantitative analysis and machine learning in finance?",
    },
    choices: buildChoices([
      { id: "python", label: { fr: "Python, grâce à son écosystème de librairies (pandas, numpy)", en: "Python, thanks to its library ecosystem (pandas, numpy)" } },
      { id: "excel", label: { fr: "Excel/VBA, pour toutes les tâches sans exception", en: "Excel/VBA, for all tasks without exception" } },
    ]),
    hint: { fr: "Ce langage domine notamment le machine learning financier (M12).", en: "This language notably dominates financial machine learning (M12)." },
    correctChoiceIds: ["python"],
    explanation: {
      fr: "Python s'est imposé comme le langage de référence en analyse quantitative et machine learning grâce à son écosystème de librairies spécialisées, bien qu'Excel/VBA et SQL restent incontournables dans des contextes spécifiques.",
      en: "Python has established itself as the reference language in quantitative analysis and machine learning thanks to its specialized library ecosystem, though Excel/VBA and SQL remain essential in specific contexts.",
    },
    commonMistake: {
      fr: "Croire qu'un seul outil convient à toutes les tâches de programmation financière sans distinction de contexte.",
      en: "Believing a single tool suits all financial programming tasks regardless of context.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-programmation-vocab",
  conceptId: "m13-programmation-finance",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une technique de programmation qui applique une opération à un tableau entier de données d'un coup, plutôt que via une boucle, s'appelle la ______.",
      en: "A programming technique applying an operation to an entire data array at once, rather than via a loop, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["vectorisation", "vectorization"],
    hint: { fr: "Le même mot que dans le glossaire de la leçon.", en: "The same word as in the lesson's glossary." },
    explanation: {
      fr: "La vectorisation applique une opération à un tableau entier de données d'un coup, bien plus rapide en pratique qu'une boucle élément par élément.",
      en: "Vectorization applies an operation to an entire data array at once, much faster in practice than an element-by-element loop.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec l'automatisation, qui concerne la planification de tâches récurrentes, pas la vitesse de calcul.",
      en: "Confusing this term with automation, which concerns scheduling recurring tasks, not computation speed.",
    },
  }),
};

export const templates: QuestionTemplate[] = [percentileNumericTemplate, vectorizationTemplate, toolChoiceTemplate, vocabTemplate];
