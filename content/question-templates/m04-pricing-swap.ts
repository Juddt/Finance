import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const parRateNumericTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-taux-pair",
  conceptId: "m04-pricing-swap",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const df1 = randomInt(rng, 92, 98) / 100;
    const df2 = df1 - randomInt(rng, 2, 6) / 100;
    const parRate = Math.round(((1 - df2) / (df1 + df2)) * 10000) / 100;

    return {
      prompt: {
        fr: `Swap 2 ans, coupons annuels (δ=1). DF_1 = ${df1.toFixed(2)}, DF_2 = ${df2.toFixed(2)}. Quel est le taux fixe au pair, en % ?`,
        en: `2-year swap, annual coupons (δ=1). DF_1 = ${df1.toFixed(2)}, DF_2 = ${df2.toFixed(2)}. What is the fixed par rate, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "R = (1 − DF_2) / (DF_1 + DF_2).", en: "R = (1 − DF_2) / (DF_1 + DF_2)." },
      numeric: { value: parRate, tolerance: 0.1 },
      calculation: {
        fr: `R = (1 − ${df2.toFixed(2)}) / (${df1.toFixed(2)} + ${df2.toFixed(2)}) = ${(1 - df2).toFixed(2)} / ${(df1 + df2).toFixed(2)} ≈ ${fmt(parRate, "fr")}%.`,
        en: `R = (1 − ${df2.toFixed(2)}) / (${df1.toFixed(2)} + ${df2.toFixed(2)}) = ${(1 - df2).toFixed(2)} / ${(df1 + df2).toFixed(2)} ≈ ${fmt(parRate, "en")}%.`,
      },
      explanation: {
        fr: "Le numérateur (1 − DF_N) vient de la simplification télescopique de la jambe variable, qui vaut toujours 1 au pair.",
        en: "The numerator (1 − DF_N) comes from the floating leg's telescoping simplification, always worth 1 at par.",
      },
      commonMistake: {
        fr: "Utiliser DF_1 au lieu de DF_2 au numérateur, ou sommer les DF au dénominateur sans les pondérer par δ_t quand les périodes diffèrent.",
        en: "Using DF_1 instead of DF_2 in the numerator, or summing DFs in the denominator without weighting by δ_t when periods differ.",
      },
    };
  },
};

const methodEquivalenceTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-equivalence",
  conceptId: "m04-pricing-swap",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La méthode de différence de jambes obligataires et la méthode de décomposition en FRA donnent des prix différents pour le même swap, car elles reposent sur des logiques distinctes.",
      en: "The bond-legs difference method and the FRA decomposition method give different prices for the same swap, since they rely on distinct logics.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : les deux méthodes sont mathématiquement équivalentes (démontrable par une somme télescopique) et donnent exactement le même prix, à condition d'utiliser la même courbe de facteurs d'actualisation.",
      en: "False: the two methods are mathematically equivalent (provable via a telescoping sum) and give exactly the same price, provided the same discount factor curve is used.",
    },
    commonMistake: {
      fr: "Croire qu'il faut choisir \"la bonne\" méthode, alors que le choix n'est qu'une question de commodité de calcul.",
      en: "Believing one must choose \"the right\" method, when the choice is purely a matter of computational convenience.",
    },
  }),
};

const floatingLegParTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-jambe-variable-pair",
  conceptId: "m04-pricing-swap",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Juste après un reset, quelle est la valeur d'une obligation à taux variable (donc de la jambe variable d'un swap), en proportion de son nominal ?",
      en: "Right after a reset, what is a floating-rate bond's value (and so the swap's floating leg), as a proportion of its face value?",
    },
    choices: buildChoices([
      { id: "one", label: { fr: "Exactement 1 (au pair)", en: "Exactly 1 (at par)" } },
      { id: "variable", label: { fr: "Cela dépend du niveau des taux à ce moment", en: "It depends on the level of rates at that moment" } },
      { id: "zero", label: { fr: "Zéro", en: "Zero" } },
    ]),
    hint: { fr: "Le coupon variable s'ajuste immédiatement aux conditions de marché.", en: "The floating coupon immediately adjusts to market conditions." },
    correctChoiceIds: ["one"],
    explanation: {
      fr: "Une obligation à taux variable vaut toujours exactement son nominal juste après un reset, car son coupon futur s'ajuste immédiatement au taux de marché courant — c'est cette propriété qui simplifie tout le pricing d'un swap.",
      en: "A floating-rate bond is always worth exactly its face value right after a reset, since its future coupon immediately adjusts to the current market rate — this property is what simplifies the entire swap pricing exercise.",
    },
    commonMistake: {
      fr: "Croire que la jambe variable a besoin d'être pricée flux par flux comme la jambe fixe, alors qu'elle se simplifie directement à 1.",
      en: "Thinking the floating leg needs to be priced flow by flow like the fixed leg, when it simplifies directly to 1.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-vocab",
  conceptId: "m04-pricing-swap",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le coefficient DF_t = 1/(1+z_t)^t, qui ramène un flux futur à sa valeur d'aujourd'hui, s'appelle un facteur d'______.",
      en: "The coefficient DF_t = 1/(1+z_t)^t, which brings a future flow back to today's value, is called a ______ factor.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["actualisation", "discount", "discounting"],
    hint: { fr: "Le même verbe utilisé pour « actualiser un flux ».", en: "Same verb as \"discounting a cash flow\"." },
    explanation: {
      fr: "Le facteur d'actualisation DF_t permet de convertir n'importe quel flux futur en sa valeur présente, brique de base du pricing par absence d'arbitrage.",
      en: "The discount factor DF_t converts any future flow into its present value, the basic building block of no-arbitrage pricing.",
    },
    commonMistake: {
      fr: "Confondre le facteur d'actualisation (toujours ≤ 1 pour un taux positif) avec le taux lui-même.",
      en: "Confusing the discount factor (always ≤ 1 for a positive rate) with the rate itself.",
    },
  }),
};

export const templates: QuestionTemplate[] = [parRateNumericTemplate, methodEquivalenceTemplate, floatingLegParTemplate, vocabTemplate];
