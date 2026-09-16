import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const classifyTemplate: QuestionTemplate = {
  id: "m02-contango-classification",
  conceptId: "m02-contango-backwardation",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 300);
    const isContango = pick(rng, [true, false] as const);
    const F0 = isContango ? S0 + randomInt(rng, 2, 40) : S0 - randomInt(rng, 2, 40);
    const correctId = isContango ? "contango" : "backwardation";

    return {
      prompt: {
        fr: `S0 = ${fmt(S0, "fr")}, F0 = ${fmt(F0, "fr")}. Ce marché est-il en contango ou en backwardation ?`,
        en: `S0 = ${fmt(S0, "en")}, F0 = ${fmt(F0, "en")}. Is this market in contango or backwardation?`,
      },
      choices: buildChoices([
        { id: "contango", label: { fr: "Contango", en: "Contango" } },
        { id: "backwardation", label: { fr: "Backwardation", en: "Backwardation" } },
      ]),
      hint: {
        fr: "Comparez F0 à S0 : Base = F0 − S0.",
        en: "Compare F0 to S0: Basis = F0 − S0.",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: `Base = ${fmt(F0, "fr")} − ${fmt(S0, "fr")} = ${fmt(F0 - S0, "fr")}, ${isContango ? "positive donc contango" : "négative donc backwardation"}.`,
        en: `Basis = ${fmt(F0, "en")} − ${fmt(S0, "en")} = ${fmt(F0 - S0, "en")}, ${isContango ? "positive so contango" : "negative so backwardation"}.`,
      },
      commonMistake: {
        fr: "Inverser les deux définitions (contango = F0 supérieur à S0, pas l'inverse).",
        en: "Swapping the two definitions (contango = F0 above S0, not the reverse).",
      },
    };
  },
};

const basisNumericTemplate: QuestionTemplate = {
  id: "m02-contango-base-calcul",
  conceptId: "m02-contango-backwardation",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 40, 250);
    const F0 = randomInt(rng, 40, 250);
    const base = F0 - S0;

    return {
      prompt: {
        fr: `S0 = ${fmt(S0, "fr")}, F0 = ${fmt(F0, "fr")}. Calculez la base (F0 − S0).`,
        en: `S0 = ${fmt(S0, "en")}, F0 = ${fmt(F0, "en")}. Compute the basis (F0 − S0).`,
      },
      numericUnit: { fr: "même unité que le prix", en: "same unit as the price" },
      numericTolerance: "± 0.1",
      hint: {
        fr: "Base = F0 − S0.",
        en: "Basis = F0 − S0.",
      },
      numeric: { value: base, tolerance: 0.1 },
      calculation: {
        fr: `Base = ${fmt(F0, "fr")} − ${fmt(S0, "fr")} = ${fmt(base, "fr")}.`,
        en: `Basis = ${fmt(F0, "en")} − ${fmt(S0, "en")} = ${fmt(base, "en")}.`,
      },
      explanation: {
        fr: "Une base positive signale un contango, une base négative signale une backwardation.",
        en: "A positive basis signals contango, a negative basis signals backwardation.",
      },
      commonMistake: {
        fr: "Calculer S0 − F0 au lieu de F0 − S0, ce qui inverse le signe et la conclusion.",
        en: "Computing S0 − F0 instead of F0 − S0, which flips the sign and the conclusion.",
      },
    };
  },
};

const noForecastTemplate: QuestionTemplate = {
  id: "m02-contango-anticipation",
  conceptId: "m02-contango-backwardation",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un marché en backwardation signifie que les investisseurs anticipent une baisse future du prix spot.",
      en: "A market in backwardation means investors expect the spot price to fall in the future.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la backwardation reflète surtout un rendement de convenance dominant (stocks tendus aujourd'hui), pas une prévision sur le prix spot futur. C'est l'une des confusions les plus fréquentes sur ce sujet.",
      en: "False: backwardation mostly reflects a dominant convenience yield (tight inventories today), not a forecast of the future spot price. This is one of the most common confusions on this topic.",
    },
    commonMistake: {
      fr: "Lire la forme de la courbe à terme comme une prédiction directionnelle du marché.",
      en: "Reading the forward curve's shape as the market's directional prediction.",
    },
  }),
};

const rollCostTemplate: QuestionTemplate = {
  id: "m02-contango-cout-roll",
  conceptId: "m02-contango-backwardation",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const nearPrice = randomInt(rng, 60, 90);
    const farPrice = nearPrice + randomInt(rng, 3, 15);

    return {
      isScenario: true,
      prompt: {
        fr: `Un fonds indiciel doit \"rouler\" sa position : vendre son contrat proche de l'échéance à ${fmt(nearPrice, "fr")} et racheter un contrat plus lointain à ${fmt(farPrice, "fr")}, le marché étant en contango. Quel est l'effet de ce roulement sur la performance du fonds, à prix spot inchangé ?`,
        en: `An index fund must \"roll\" its position: sell its near-expiry contract at ${fmt(nearPrice, "en")} and buy a more distant contract at ${fmt(farPrice, "en")}, with the market in contango. What effect does this rolling have on the fund's performance, with the spot price unchanged?`,
      },
      choices: buildChoices([
        { id: "loss", label: { fr: "Un coût récurrent qui pèse sur la performance", en: "A recurring cost that drags on performance" } },
        { id: "gain", label: { fr: "Un gain récurrent qui améliore la performance", en: "A recurring gain that improves performance" } },
        { id: "neutral", label: { fr: "Aucun effet, le roulement est toujours neutre", en: "No effect, rolling is always neutral" } },
      ]),
      hint: {
        fr: "En contango, le contrat plus lointain est plus cher que le contrat proche : que se passe-t-il quand on vend moins cher pour racheter plus cher ?",
        en: "In contango, the far contract is pricier than the near one: what happens when you sell cheap to buy expensive?",
      },
      correctChoiceIds: ["loss"],
      explanation: {
        fr: `Vendre à ${fmt(nearPrice, "fr")} pour racheter à ${fmt(farPrice, "fr")} coûte ${fmt(farPrice - nearPrice, "fr")} par contrat à chaque roulement, même si le prix spot ne bouge pas : c'est le \"coût de roll\" typique d'un marché en contango persistant.`,
        en: `Selling at ${fmt(nearPrice, "en")} to buy back at ${fmt(farPrice, "en")} costs ${fmt(farPrice - nearPrice, "en")} per contract on every roll, even if the spot price does not move: this is the typical "roll cost" of a persistently contango market.`,
      },
      commonMistake: {
        fr: "Croire que seule l'évolution du prix spot détermine la performance d'un produit qui roule des futures — le coût de roll peut être significatif indépendamment du spot.",
        en: "Believing only the spot price's evolution determines the performance of a product that rolls futures — the roll cost can be significant independent of spot.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [classifyTemplate, basisNumericTemplate, noForecastTemplate, rollCostTemplate];
