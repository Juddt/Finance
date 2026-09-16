import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const riskReversalNumericTemplate: QuestionTemplate = {
  id: "m08-formes-risk-reversal-calcul",
  conceptId: "m08-formes-skew-smile",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ivPut = randomInt(rng, 18, 30);
    const ivCall = randomInt(rng, 12, ivPut - 1);
    const rr = ivPut - ivCall;

    return {
      isScenario: true,
      prompt: {
        fr: `Le put 25-delta cote une IV de ${ivPut}%, le call 25-delta une IV de ${ivCall}%. Quel est le "25-delta risk reversal" (IV_put − IV_call), en points de % ?`,
        en: `The 25-delta put quotes an IV of ${ivPut}%, the 25-delta call an IV of ${ivCall}%. What is the "25-delta risk reversal" (IV_put − IV_call), in percentage points?`,
      },
      numericUnit: { fr: "points de %", en: "percentage points" },
      numericTolerance: "± 0.5",
      hint: { fr: "Risk reversal = IV_put − IV_call.", en: "Risk reversal = IV_put − IV_call." },
      numeric: { value: rr, tolerance: 0.5 },
      calculation: { fr: `RR = ${ivPut}% − ${ivCall}% = ${rr} points.`, en: `RR = ${ivPut}% − ${ivCall}% = ${rr} points.` },
      explanation: {
        fr: "Un risk reversal positif indique un skew equity typique (puts plus chers que calls) ; proche de zéro, il indique un smile plus symétrique type FX.",
        en: "A positive risk reversal indicates a typical equity skew (puts pricier than calls); near zero, it indicates a more symmetric FX-type smile.",
      },
      commonMistake: {
        fr: "Inverser l'ordre de la soustraction (IV_call − IV_put), ce qui inverse le signe du résultat.",
        en: "Reversing the subtraction order (IV_call − IV_put), which flips the result's sign.",
      },
    };
  },
};

const fxVsEquityTemplate: QuestionTemplate = {
  id: "m08-formes-fx-vs-equity",
  conceptId: "m08-formes-skew-smile",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const market = pick(rng, ["equity", "fx"] as const);
    return {
      prompt: {
        fr: `Sur le marché ${market === "equity" ? "actions" : "des changes"}, quelle forme de courbe de volatilité implicite est typiquement observée ?`,
        en: `In the ${market === "equity" ? "equity" : "FX"} market, what typical implied volatility curve shape is observed?`,
      },
      choices: buildChoices([
        { id: "skew", label: { fr: "Un skew négatif prononcé (puts OTM nettement plus chers)", en: "A pronounced negative skew (OTM puts noticeably pricier)" } },
        { id: "smile", label: { fr: "Un smile symétrique en U", en: "A symmetric U-shaped smile" } },
      ]),
      hint: { fr: "L'un des deux marchés a un risque structurellement bidirectionnel, l'autre non.", en: "One of the two markets has structurally bidirectional risk, the other doesn't." },
      correctChoiceIds: [market === "equity" ? "skew" : "smile"],
      explanation:
        market === "equity"
          ? { fr: "Le marché actions montre typiquement un skew négatif prononcé, lié à la demande de protection contre les baisses et à l'effet de levier.", en: "The equity market typically shows a pronounced negative skew, tied to downside protection demand and the leverage effect." }
          : { fr: "Le marché des changes montre typiquement un smile plus symétrique, reflétant un risque bidirectionnel entre deux devises.", en: "The FX market typically shows a more symmetric smile, reflecting bidirectional risk between two currencies." },
      commonMistake: {
        fr: "Appliquer la forme typique d'un marché à l'autre, en oubliant leurs différences structurelles.",
        en: "Applying one market's typical shape to the other, forgetting their structural differences.",
      },
    };
  },
};

const eventDrivenTemplate: QuestionTemplate = {
  id: "m08-formes-evenement",
  conceptId: "m08-formes-skew-smile",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La forme du smile ou du skew peut temporairement se déformer fortement autour d'un événement de marché majeur (élection, référendum), sans que cela reflète la forme structurelle habituelle du marché.",
      en: "The smile or skew's shape can temporarily strongly deform around a major market event (election, referendum), without reflecting the market's usual structural shape.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : l'exemple du Brexit (GBP/USD) illustre comment un événement identifié peut temporairement asymétriser fortement un smile FX normalement plus symétrique.",
      en: "True: the Brexit example (GBP/USD) illustrates how an identified event can temporarily strongly skew a normally more symmetric FX smile.",
    },
    commonMistake: {
      fr: "Croire que la forme observée à un instant donné est toujours représentative de la forme structurelle à long terme du marché.",
      en: "Believing the shape observed at a given moment is always representative of the market's long-term structural shape.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-formes-vocab",
  conceptId: "m08-formes-skew-smile",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le mécanisme par lequel une baisse du prix d'une action augmente son ratio dette/capitaux propres, donc son risque perçu, s'appelle l'effet de ______.",
      en: "The mechanism by which a stock price decline raises its debt-to-equity ratio, hence its perceived risk, is called the ______ effect.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["levier", "leverage"],
    hint: { fr: "Lié au ratio dette/capitaux propres.", en: "Tied to the debt-to-equity ratio." },
    explanation: {
      fr: "L'effet de levier est l'une des deux explications structurelles usuelles du skew equity négatif, avec la demande de protection.",
      en: "The leverage effect is one of the two usual structural explanations for negative equity skew, along with protection demand.",
    },
    commonMistake: {
      fr: "Confondre l'effet de levier financier avec le levier d'une position en produits dérivés.",
      en: "Confusing the financial leverage effect with a derivatives position's leverage.",
    },
  }),
};

export const templates: QuestionTemplate[] = [riskReversalNumericTemplate, fxVsEquityTemplate, eventDrivenTemplate, vocabTemplate];
