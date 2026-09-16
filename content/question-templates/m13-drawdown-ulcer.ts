import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 1): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const drawdownNumericTemplate: QuestionTemplate = {
  id: "m13-drawdown-calcul",
  conceptId: "m13-drawdown-ulcer",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const high = randomInt(rng, 100, 200);
    const low = randomInt(rng, 50, high - 10);
    const dd = Math.round(((high - low) / high) * 1000) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Une stratégie atteint un plus haut de ${high}, puis chute à ${low}. Quel est le drawdown en pourcentage ?`,
        en: `A strategy reaches a high of ${high}, then falls to ${low}. What is the drawdown as a percentage?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.5",
      hint: { fr: "DD = (Plus_haut − Valeur) / Plus_haut.", en: "DD = (High − Value) / High." },
      numeric: { value: dd, tolerance: 0.5 },
      calculation: {
        fr: `DD = (${high} − ${low}) / ${high} ≈ ${fmt(dd, "fr")}%.`,
        en: `DD = (${high} − ${low}) / ${high} ≈ ${fmt(dd, "en")}%.`,
      },
      explanation: {
        fr: "Le drawdown se calcule toujours par rapport au plus haut historique atteint, pas par rapport à la valeur initiale de la stratégie.",
        en: "Drawdown is always computed relative to the historical high reached, not the strategy's initial value.",
      },
      commonMistake: {
        fr: "Calculer la baisse par rapport à la valeur initiale de la stratégie plutôt que par rapport à son plus haut historique.",
        en: "Computing the decline relative to the strategy's initial value rather than its historical high.",
      },
    };
  },
};

const mddNotMaxLossTemplate: QuestionTemplate = {
  id: "m13-drawdown-vs-perte-totale",
  conceptId: "m13-drawdown-ulcer",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le drawdown maximal mesure toujours la baisse par rapport à la valeur de départ de la stratégie, jamais par rapport à un plus haut intermédiaire.",
      en: "Maximum drawdown always measures the decline relative to the strategy's starting value, never relative to an intermediate high.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le drawdown maximal mesure la plus grande baisse par rapport à N'IMPORTE QUEL plus haut historique atteint, pas uniquement la valeur de départ — une stratégie qui monte puis rechute a un drawdown mesuré depuis son sommet intermédiaire.",
      en: "False: maximum drawdown measures the largest decline relative to ANY historical high reached, not just the starting value — a strategy that rises then falls back has its drawdown measured from its intermediate peak.",
    },
    commonMistake: {
      fr: "Croire que le drawdown se mesure uniquement par rapport au capital initial investi.",
      en: "Believing drawdown is measured only relative to the initially invested capital.",
    },
  }),
};

const ulcerVsMddTemplate: QuestionTemplate = {
  id: "m13-ulcer-vs-mdd",
  conceptId: "m13-drawdown-ulcer",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Pourquoi l'Ulcer Index peut-il révéler un risque que le drawdown maximal seul ne capture pas ?",
      en: "Why can the Ulcer Index reveal a risk that maximum drawdown alone doesn't capture?",
    },
    choices: buildChoices([
      { id: "duration", label: { fr: "Il tient compte de la durée cumulée de TOUS les drawdowns, pas seulement du pire", en: "It accounts for the cumulative duration of ALL drawdowns, not just the worst" } },
      { id: "same-info", label: { fr: "Il ne donne en réalité aucune information supplémentaire", en: "It actually gives no additional information" } },
    ]),
    hint: { fr: "Le drawdown maximal ne capture qu'un seul point extrême de la trajectoire.", en: "Maximum drawdown captures only one extreme point of the path." },
    correctChoiceIds: ["duration"],
    explanation: {
      fr: "L'Ulcer Index tient compte de la sévérité ET de la durée cumulée de tous les drawdowns sur la période, alors que le drawdown maximal ne capture qu'un seul point extrême — une stratégie avec de nombreux petits drawdowns fréquents peut avoir un Ulcer Index élevé malgré un MDD modéré.",
      en: "The Ulcer Index accounts for both the severity AND cumulative duration of all drawdowns over the period, while maximum drawdown captures only one extreme point — a strategy with many small, frequent drawdowns can have a high Ulcer Index despite a moderate MDD.",
    },
    commonMistake: {
      fr: "Croire que le drawdown maximal et l'Ulcer Index mesurent exactement la même chose.",
      en: "Believing maximum drawdown and the Ulcer Index measure exactly the same thing.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-drawdown-vocab",
  conceptId: "m13-drawdown-ulcer",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le temps nécessaire pour qu'une stratégie retrouve son plus haut historique après une baisse s'appelle la ______.",
      en: "The time needed for a strategy to recover its historical high after a decline is called the ______.",
    },
    fillBlankPlaceholder: { fr: "deux mots anglais", en: "two English words" },
    acceptedAnswers: ["recovery period", "recovery"],
    hint: { fr: "Le même terme que dans le glossaire de la leçon.", en: "The same term as in the lesson's glossary." },
    explanation: {
      fr: "La recovery period est le temps écoulé entre le point le plus bas d'un drawdown et le moment où la valeur retrouve son plus haut précédent.",
      en: "Recovery period is the time elapsed between a drawdown's lowest point and when value recovers its previous high.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le drawdown lui-même, qui mesure une baisse, pas une durée.",
      en: "Confusing this term with drawdown itself, which measures a decline, not a duration.",
    },
  }),
};

export const templates: QuestionTemplate[] = [drawdownNumericTemplate, mddNotMaxLossTemplate, ulcerVsMddTemplate, vocabTemplate];
