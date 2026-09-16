import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const survivalTemplate: QuestionTemplate = {
  id: "m10-double-survie",
  conceptId: "m10-doubles-barrieres",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const hDown = randomInt(rng, 70, 90);
    const hUp = randomInt(rng, 110, 140);
    const spikeUp = pick(rng, [true, false] as const);
    const spikeLevel = spikeUp ? hUp + randomInt(rng, 1, 10) : hDown - randomInt(rng, 1, 10);
    const finalLevel = randomInt(rng, hDown + 5, hUp - 5);

    return {
      isScenario: true,
      prompt: {
        fr: `Un call double knock-out a des barrières H_down=${hDown} et H_up=${hUp}. Le sous-jacent touche brièvement ${spikeLevel} à un moment donné, puis termine à ${finalLevel} à l'échéance (à l'intérieur du corridor). L'option est-elle encore vivante à l'échéance ?`,
        en: `A double knock-out call has barriers H_down=${hDown} and H_up=${hUp}. The underlying briefly touches ${spikeLevel} at some point, then ends at ${finalLevel} at expiry (inside the corridor). Is the option still alive at expiry?`,
      },
      choices: buildChoices([
        { id: "dead", label: { fr: "Non, elle est knock-out définitivement", en: "No, it's permanently knocked out" } },
        { id: "alive", label: { fr: "Oui, car elle termine dans le corridor", en: "Yes, because it ends inside the corridor" } },
      ]),
      hint: { fr: "Vérifiez si le niveau atteint en cours de route franchit l'une des deux barrières.", en: "Check whether the level reached along the way breaches either barrier." },
      correctChoiceIds: ["dead"],
      explanation: {
        fr: `Le sous-jacent a touché ${spikeLevel}, qui est ${spikeUp ? `au-dessus de H_up=${hUp}` : `en-dessous de H_down=${hDown}`} : l'option est knock-out dès cet instant, de façon irréversible, quel que soit le niveau final.`,
        en: `The underlying touched ${spikeLevel}, which is ${spikeUp ? `above H_up=${hUp}` : `below H_down=${hDown}`}: the option is knocked out at that instant, irreversibly, whatever the final level is.`,
      },
      commonMistake: {
        fr: "Ne regarder que le niveau final sans vérifier toute la trajectoire du sous-jacent.",
        en: "Only checking the final level without verifying the underlying's entire path.",
      },
    };
  },
};

const corridorWidthTemplate: QuestionTemplate = {
  id: "m10-double-largeur-corridor",
  conceptId: "m10-doubles-barrieres",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Plus le corridor [H_down, H_up] d'une double-barrière est étroit, plus la prime de l'option est faible.",
      en: "The narrower a double barrier's corridor [H_down, H_up], the lower the option's premium.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : un corridor étroit réduit la probabilité de survie du sous-jacent à l'intérieur des deux barrières, donc réduit la prime — au prix d'un risque de knock-out plus élevé.",
      en: "True: a narrow corridor reduces the underlying's probability of staying inside both barriers, so it lowers the premium — at the cost of higher knock-out risk.",
    },
    commonMistake: {
      fr: "Croire que la largeur du corridor n'affecte pas le prix, alors qu'elle contrôle directement la probabilité de survie.",
      en: "Believing corridor width doesn't affect the price, when it directly controls survival probability.",
    },
  }),
};

const interactionTemplate: QuestionTemplate = {
  id: "m10-double-interaction-barrieres",
  conceptId: "m10-doubles-barrieres",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Le risque de knock-out d'une option double-barrière est-il simplement la somme des risques de chaque barrière prise séparément ?",
      en: "Is a double barrier option's knock-out risk simply the sum of each barrier's risk taken separately?",
    },
    choices: buildChoices([
      { id: "no", label: { fr: "Non, les deux barrières interagissent dans le pricing exact", en: "No, both barriers interact in the exact pricing" } },
      { id: "yes", label: { fr: "Oui, c'est une simple addition indépendante", en: "Yes, it's a simple independent sum" } },
    ]),
    hint: { fr: "Le pricing exact utilise une série de termes issus de la méthode des images, pas une simple addition.", en: "Exact pricing uses a series of terms from the method of images, not a simple sum." },
    correctChoiceIds: ["no"],
    explanation: {
      fr: "Non : le pricing exact (formule de Kunitomo-Ikeda) nécessite de considérer l'effet combiné des deux barrières sur toute la trajectoire, via une série de termes issus de la méthode des images, pas une simple somme indépendante.",
      en: "No: exact pricing (Kunitomo-Ikeda formula) requires considering both barriers' combined effect over the whole path, via a series of terms from the method of images, not a simple independent sum.",
    },
    commonMistake: {
      fr: "Simplifier à tort le pricing d'une double-barrière comme deux barrières simples indépendantes additionnées.",
      en: "Wrongly simplifying a double barrier's pricing as two independent single barriers added together.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-double-vocab",
  conceptId: "m10-doubles-barrieres",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'intervalle de prix entre les deux barrières d'une option double-barrière s'appelle un ______.",
      en: "The price range between a double barrier option's two barriers is called a ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["corridor"],
    hint: { fr: "Un mot évoquant un couloir de prix.", en: "A word evoking a price hallway." },
    explanation: {
      fr: "Le corridor est l'intervalle de prix [H_down, H_up] à l'intérieur duquel le sous-jacent doit rester pour que l'option reste vivante.",
      en: "The corridor is the price range [H_down, H_up] within which the underlying must stay for the option to remain alive.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le strike, qui est un niveau unique, pas un intervalle.",
      en: "Confusing this term with the strike, which is a single level, not a range.",
    },
  }),
};

export const templates: QuestionTemplate[] = [survivalTemplate, corridorWidthTemplate, interactionTemplate, vocabTemplate];
