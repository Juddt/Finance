import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const modelChoiceListedTemplate: QuestionTemplate = {
  id: "m03-credit-choix-modele-cotee",
  conceptId: "m03-risque-credit",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const sector = pick(rng, [
      { fr: "industrielle", en: "industrial" },
      { fr: "technologique", en: "technology" },
      { fr: "énergétique", en: "energy" },
    ] as const);

    return {
      isScenario: true,
      prompt: {
        fr: `Vous voulez estimer la probabilité de défaut d'une entreprise ${sector.fr} cotée en bourse, avec une estimation réactive aux mouvements de marché récents. Quel modèle choisir en priorité ?`,
        en: `You want to estimate the default probability of a listed ${sector.en} company, with an estimate reactive to recent market moves. Which model should you pick first?`,
      },
      choices: buildChoices([
        { id: "structural", label: { fr: "Un modèle structurel (type Merton), basé sur le cours de l'action", en: "A structural model (Merton-type), based on the stock price" } },
        { id: "historical", label: { fr: "Le taux de défaut historique moyen de sa catégorie de notation", en: "The average historical default rate of its rating category" } },
        { id: "none", label: { fr: "Aucun modèle : se fier uniquement à la notation, sans jamais la remettre à jour", en: "No model: rely only on the rating, without ever updating it" } },
      ]),
      hint: {
        fr: "Quelle approche utilise des données de marché fraîches plutôt qu'une moyenne historique par catégorie ?",
        en: "Which approach uses fresh market data rather than a historical category average?",
      },
      correctChoiceIds: ["structural"],
      explanation: {
        fr: "Pour une entreprise cotée, un modèle structurel (Merton) exploite le cours de l'action et sa volatilité pour estimer en continu la distance entre la valeur des actifs et celle de la dette — plus réactif qu'un taux de défaut historique par catégorie de notation.",
        en: "For a listed company, a structural model (Merton) uses the stock price and its volatility to continuously estimate the gap between asset value and debt value — more reactive than a historical default rate by rating category.",
      },
      commonMistake: {
        fr: "Se limiter au taux de défaut historique de la catégorie de notation alors que des données de marché propres à l'entreprise sont disponibles et donneraient une estimation plus fraîche.",
        en: "Sticking to the rating category's historical default rate when company-specific market data is available and would give a fresher estimate.",
      },
    };
  },
};

const modelChoiceUnlistedTemplate: QuestionTemplate = {
  id: "m03-credit-choix-modele-non-cotee",
  conceptId: "m03-risque-credit",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    isScenario: true,
    prompt: {
      fr: "Une PME non cotée en bourse n'a aucune donnée de marché disponible, mais dispose d'une notation d'agence. Quelle est l'approche la plus réaliste pour une première estimation de sa probabilité de défaut ?",
      en: "An unlisted SME has no market data available, but does have an agency rating. What is the most realistic approach for a first estimate of its default probability?",
    },
    choices: buildChoices([
      { id: "historical", label: { fr: "Le taux de défaut historique de sa catégorie de notation", en: "The historical default rate of its rating category" } },
      { id: "structural", label: { fr: "Un modèle structurel basé sur le cours de son action", en: "A structural model based on its stock price" } },
      { id: "guess", label: { fr: "Une estimation arbitraire, sans méthode", en: "An arbitrary estimate, with no method" } },
    ]),
    hint: {
      fr: "Un modèle structurel a besoin d'un cours d'action et d'une volatilité observables — est-ce le cas ici ?",
      en: "A structural model needs an observable stock price and volatility — is that the case here?",
    },
    correctChoiceIds: ["historical"],
    explanation: {
      fr: "Sans données de marché, le modèle structurel n'est pas applicable. Le taux de défaut historique de la catégorie de notation reste l'approche la plus réaliste, en attendant d'éventuelles données financières propres pour un modèle de scoring.",
      en: "Without market data, the structural model isn't applicable. The rating category's historical default rate remains the most realistic approach, pending any proprietary financial data for a scoring model.",
    },
    commonMistake: {
      fr: "Vouloir appliquer un modèle structurel sans données de marché disponibles, ou inversement se contenter d'une estimation arbitraire alors qu'une notation existe déjà.",
      en: "Trying to apply a structural model without available market data, or conversely settling for an arbitrary guess when a rating already exists.",
    },
  }),
};

const empiricalPdTemplate: QuestionTemplate = {
  id: "m03-credit-pd-empirique",
  conceptId: "m03-risque-credit",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const totalIssuers = randomInt(rng, 15, 40) * 100;
    const defaults = randomInt(rng, 2, 8) * 5;
    const pdPct = Math.round((defaults / totalIssuers) * 10000) / 100;

    return {
      prompt: {
        fr: `Sur les 5 dernières années, ${fmt(defaults, "fr")} émetteurs notés BBB ont fait défaut, sur un total de ${fmt(totalIssuers, "fr")} émetteurs notés BBB observés. Quel est le taux de défaut empirique à 5 ans de cette catégorie, en % ?`,
        en: `Over the last 5 years, ${fmt(defaults, "en")} BBB-rated issuers defaulted, out of a total of ${fmt(totalIssuers, "en")} BBB-rated issuers observed. What is the 5-year empirical default rate of this category, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0,05",
      hint: {
        fr: "PD ≈ nombre de défauts / nombre total d'émetteurs de la catégorie.",
        en: "PD ≈ number of defaults / total number of issuers in the category.",
      },
      numeric: { value: pdPct, tolerance: 0.05 },
      calculation: {
        fr: `PD ≈ ${fmt(defaults, "fr")} / ${fmt(totalIssuers, "fr")} = ${fmt(pdPct, "fr")}%.`,
        en: `PD ≈ ${fmt(defaults, "en")} / ${fmt(totalIssuers, "en")} = ${fmt(pdPct, "en")}%.`,
      },
      explanation: {
        fr: "C'est une estimation historique simple, qui suppose que le passé est représentatif du futur pour cette catégorie de notation.",
        en: "This is a simple historical estimate, assuming the past is representative of the future for this rating category.",
      },
      commonMistake: {
        fr: "Oublier de convertir le ratio en pourcentage, ou inverser numérateur et dénominateur.",
        en: "Forgetting to convert the ratio to a percentage, or swapping numerator and denominator.",
      },
    };
  },
};

const ratingNotGuaranteeTemplate: QuestionTemplate = {
  id: "m03-credit-notation-pas-garantie",
  conceptId: "m03-risque-credit",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const grade = pick(rng, ["AAA", "AA", "A"] as const);
    return {
      prompt: {
        fr: `Une entreprise notée ${grade} ne peut, par définition, jamais faire défaut.`,
        en: `A company rated ${grade} can, by definition, never default.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: {
        fr: "Une notation résume une probabilité — est-ce la même chose qu'une certitude ?",
        en: "A rating summarizes a probability — is that the same as a certainty?",
      },
      correctChoiceIds: ["false"],
      explanation: {
        fr: `Faux : ${grade} signifie un risque de défaut très faible, pas nul. Des défauts d'émetteurs très bien notés se sont déjà produits historiquement.`,
        en: `False: ${grade} means a very low, not zero, default risk. Defaults by highly-rated issuers have happened historically.`,
      },
      commonMistake: {
        fr: "Confondre une notation élevée avec une garantie absolue — c'est une estimation de risque, pas une promesse.",
        en: "Confusing a high rating with an absolute guarantee — it's a risk estimate, not a promise.",
      },
    };
  },
};

const mertonVocabTemplate: QuestionTemplate = {
  id: "m03-credit-vocab-merton",
  conceptId: "m03-risque-credit",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le modèle qui considère qu'une entreprise fait défaut lorsque la valeur de ses actifs passe sous la valeur de sa dette s'appelle le modèle de ______.",
      en: "The model that treats default as the moment a firm's asset value falls below its debt value is called the ______ model.",
    },
    fillBlankPlaceholder: { fr: "un nom", en: "a name" },
    acceptedAnswers: ["merton"],
    hint: {
      fr: "C'est un modèle structurel qui porte le nom de son auteur.",
      en: "It's a structural model named after its author.",
    },
    explanation: {
      fr: "Il s'agit du modèle de Merton, un modèle structurel qui utilise les données de marché (cours de l'action) pour estimer la probabilité de défaut d'une entreprise cotée.",
      en: "This is the Merton model, a structural model that uses market data (the stock price) to estimate a listed company's default probability.",
    },
    commonMistake: {
      fr: "Ne pas confondre avec un modèle de scoring statistique (régression logistique), qui est une approche différente.",
      en: "Do not confuse with a statistical scoring model (logistic regression), which is a different approach.",
    },
  }),
};

export const templates: QuestionTemplate[] = [
  modelChoiceListedTemplate,
  modelChoiceUnlistedTemplate,
  empiricalPdTemplate,
  ratingNotGuaranteeTemplate,
  mertonVocabTemplate,
];
