import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const spreadDeltaNumericTemplate: QuestionTemplate = {
  id: "m07-strat-delta-spread",
  conceptId: "m07-greeks-strategies",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const delta1 = randomFloat(rng, 0.4, 0.8, 2);
    const delta2 = randomFloat(rng, 0.1, delta1 - 0.05, 2);
    const spreadDelta = Math.round((delta1 - delta2) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un bull call spread : achat d'un call de Delta=${fmt(delta1, "fr")}, vente d'un call de Delta=${fmt(delta2, "fr")}. Quel est le Delta total de la stratégie ?`,
        en: `A bull call spread: buy a call with Delta=${fmt(delta1, "en")}, sell a call with Delta=${fmt(delta2, "en")}. What is the strategy's total Delta?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.02",
      hint: { fr: "Delta_spread = Delta_achat − Delta_vente.", en: "Delta_spread = Delta_bought − Delta_sold." },
      numeric: { value: spreadDelta, tolerance: 0.02 },
      calculation: { fr: `Delta = ${fmt(delta1, "fr")} − ${fmt(delta2, "fr")} = ${fmt(spreadDelta, "fr")}.`, en: `Delta = ${fmt(delta1, "en")} − ${fmt(delta2, "en")} = ${fmt(spreadDelta, "en")}.` },
      explanation: {
        fr: "Le Delta d'un spread est toujours inférieur à celui de sa seule jambe achetée, car la jambe vendue le réduit.",
        en: "A spread's Delta is always lower than its lone bought leg's, since the sold leg reduces it.",
      },
      commonMistake: {
        fr: "Additionner les deux Deltas au lieu de les soustraire, en oubliant le signe négatif de la jambe vendue.",
        en: "Adding the two Deltas instead of subtracting, forgetting the sold leg's negative sign.",
      },
    };
  },
};

const straddleGammaTemplate: QuestionTemplate = {
  id: "m07-strat-straddle-gamma",
  conceptId: "m07-greeks-strategies",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un straddle ATM (achat d'un call et d'un put de même strike) a un Delta proche de zéro, mais un Gamma et un Vega significativement positifs.",
      en: "An ATM straddle (buying a call and a put with the same strike) has a Delta near zero, but significantly positive Gamma and Vega.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : les Deltas du call et du put se compensent presque (proches de ±0,5 à la monnaie), mais leurs Gamma et Vega, tous deux positifs, s'additionnent — d'où le profil \"neutre en direction, long en volatilité\".",
      en: "True: the call and put's Deltas almost offset (close to ±0.5 at the money), but their Gamma and Vega, both positive, add up — hence the \"direction-neutral, long volatility\" profile.",
    },
    commonMistake: {
      fr: "Croire qu'un Delta neutre signifie une stratégie totalement sans risque.",
      en: "Believing a neutral Delta means a totally risk-free strategy.",
    },
  }),
};

const additivityTemplate: QuestionTemplate = {
  id: "m07-strat-additivite",
  conceptId: "m07-greeks-strategies",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const q1 = randomInt(rng, 1, 5);
    const q2 = randomInt(rng, 1, 5);
    const g1 = randomInt(rng, 5, 20);
    const g2 = randomInt(rng, 5, 20);
    const total = q1 * g1 - q2 * g2;
    const wrongTotal = q1 * g1 + q2 * g2;

    return {
      isScenario: true,
      prompt: {
        fr: `Une stratégie détient ${q1} option(s) longue(s) de Vega=${g1} et ${q2} option(s) courte(s) de Vega=${g2}. Quel est le Vega total ?`,
        en: `A strategy holds ${q1} long option(s) with Vega=${g1} and ${q2} short option(s) with Vega=${g2}. What is the total Vega?`,
      },
      choices: buildChoices([
        { id: "correct", label: { fr: `${total}`, en: `${total}` } },
        { id: "wrong", label: { fr: `${wrongTotal}`, en: `${wrongTotal}` } },
      ]),
      hint: { fr: "N'oubliez pas le signe négatif pour la position courte.", en: "Don't forget the negative sign for the short position." },
      correctChoiceIds: ["correct"],
      explanation: {
        fr: `Vega total = ${q1}×${g1} − ${q2}×${g2} = ${total}, la position courte contribuant négativement.`,
        en: `Total Vega = ${q1}×${g1} − ${q2}×${g2} = ${total}, with the short position contributing negatively.`,
      },
      commonMistake: {
        fr: "Additionner les deux Vega sans tenir compte du signe négatif de la position courte.",
        en: "Adding both Vegas without accounting for the short position's negative sign.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-strat-vocab",
  conceptId: "m07-greeks-strategies",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le Greek total d'un portefeuille est la somme des Greeks de chaque position, pondérés par leur quantité signée : c'est la propriété d'______ des Greeks.",
      en: "A portfolio's total Greek is the sum of each position's Greeks, weighted by their signed quantity: this is the ______ property of Greeks.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["additivite", "additivité", "additivity"],
    hint: { fr: "Les Greeks « s'additionnent ».", en: "Greeks \"add up\"." },
    explanation: {
      fr: "L'additivité des Greeks vient du fait qu'ils sont des dérivées partielles d'une somme (la valeur du portefeuille), donc leur somme est simplement la dérivée de la somme.",
      en: "The additivity of Greeks comes from them being partial derivatives of a sum (the portfolio's value), so their sum is simply the derivative of the sum.",
    },
    commonMistake: {
      fr: "Croire que les Greeks doivent être pondérés autrement qu'en proportion directe de la quantité détenue.",
      en: "Believing Greeks must be weighted in some way other than direct proportion to the quantity held.",
    },
  }),
};

export const templates: QuestionTemplate[] = [spreadDeltaNumericTemplate, straddleGammaTemplate, additivityTemplate, vocabTemplate];
