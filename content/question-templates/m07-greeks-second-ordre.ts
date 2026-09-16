import { pick, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const definitionTemplate: QuestionTemplate = {
  id: "m07-second-ordre-definition",
  conceptId: "m07-greeks-second-ordre",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const greek = pick(rng, ["vanna", "volga"] as const);
    return {
      prompt: {
        fr: `Que mesure le ${greek === "vanna" ? "Vanna" : "Volga (Vomma)"} ?`,
        en: `What does ${greek === "vanna" ? "Vanna" : "Volga (Vomma)"} measure?`,
      },
      choices: buildChoices([
        { id: "vanna", label: { fr: "La sensibilité croisée entre le Delta et la volatilité", en: "The cross-sensitivity between Delta and volatility" } },
        { id: "volga", label: { fr: "La convexité du prix par rapport à la volatilité elle-même", en: "The price's convexity with respect to volatility itself" } },
      ]),
      hint: { fr: "L'un est une sensibilité croisée (spot-vol), l'autre une convexité pure (vol-vol).", en: "One is a cross-sensitivity (spot-vol), the other a pure convexity (vol-vol)." },
      correctChoiceIds: [greek],
      explanation:
        greek === "vanna"
          ? { fr: "Le Vanna = ∂²V/∂S∂σ mesure comment le Delta change avec la volatilité (ou le Vega avec le spot).", en: "Vanna = ∂²V/∂S∂σ measures how Delta changes with volatility (or Vega with spot)." }
          : { fr: "Le Volga = ∂²V/∂σ² mesure la convexité du prix par rapport à la volatilité, comme le Gamma le fait pour le spot.", en: "Volga = ∂²V/∂σ² measures the price's convexity with respect to volatility, as Gamma does for spot." },
      commonMistake: {
        fr: "Confondre les deux sensibilités de second ordre, qui répondent à des questions différentes.",
        en: "Confusing the two second-order sensitivities, which answer different questions.",
      },
    };
  },
};

const identicalCallPutTemplate: QuestionTemplate = {
  id: "m07-second-ordre-call-put",
  conceptId: "m07-greeks-second-ordre",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Comme Gamma et Vega, le Vanna et le Volga sont identiques pour un call et un put de mêmes caractéristiques.",
      en: "Like Gamma and Vega, Vanna and Volga are identical for a call and a put with the same characteristics.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : comme Gamma et Vega, Vanna et Volga se déduisent de dérivées qui ne dépendent pas du signe du payoff terminal, donc ils sont identiques pour un call et un put.",
      en: "True: like Gamma and Vega, Vanna and Volga follow from derivatives that don't depend on the terminal payoff's sign, so they are identical for a call and a put.",
    },
    commonMistake: {
      fr: "Supposer par défaut que tous les Greeks de second ordre diffèrent entre call et put, comme Delta et Rho.",
      en: "Assuming by default that all second-order Greeks differ between call and put, like Delta and Rho.",
    },
  }),
};

const usageTemplate: QuestionTemplate = {
  id: "m07-second-ordre-usage",
  conceptId: "m07-greeks-second-ordre",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Un desk exotique gère un livre d'options avec des strikes et échéances très variés. Pourquoi le Vanna et le Volga sont-ils particulièrement importants pour ce desk, au-delà de Delta/Gamma/Vega ?",
      en: "An exotics desk manages an options book with widely varying strikes and maturities. Why are Vanna and Volga particularly important for this desk, beyond Delta/Gamma/Vega?",
    },
    choices: buildChoices([
      { id: "smile", label: { fr: "Ils capturent l'exposition à la FORME du smile de volatilité, pas seulement à son niveau moyen", en: "They capture exposure to the SHAPE of the volatility smile, not just its average level" } },
      { id: "cost", label: { fr: "Ils réduisent les coûts de transaction du rééquilibrage", en: "They reduce rebalancing transaction costs" } },
    ]),
    hint: { fr: "Pensez à ce que Delta/Gamma/Vega seuls ne peuvent pas capturer sur un livre à strikes variés.", en: "Think about what Delta/Gamma/Vega alone can't capture on a book with varied strikes." },
    correctChoiceIds: ["smile"],
    explanation: {
      fr: "Un livre avec des strikes variés est exposé à des mouvements combinés de spot et de volatilité, et à des changements de forme du smile — un risque que seuls Vanna et Volga permettent d'isoler et de couvrir séparément.",
      en: "A book with varied strikes is exposed to combined spot-and-volatility moves, and to changes in the smile's shape — a risk only Vanna and Volga let you isolate and hedge separately.",
    },
    commonMistake: {
      fr: "Croire que ces Greeks de second ordre n'ont qu'un intérêt académique, sans usage pratique sur un desk.",
      en: "Believing these second-order Greeks are only of academic interest, with no practical desk use.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-second-ordre-vocab",
  conceptId: "m07-greeks-second-ordre",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le Volga est aussi appelé ______, un terme forgé par analogie avec Gamma pour désigner la convexité par rapport à la volatilité.",
      en: "Volga is also called ______, a term coined by analogy with Gamma to denote convexity with respect to volatility.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["vomma"],
    hint: { fr: "Un mot-valise autour de \"vol\" et \"Gamma\".", en: "A portmanteau around \"vol\" and \"Gamma\"." },
    explanation: {
      fr: "Volga et Vomma sont deux noms pour la même sensibilité : ∂²V/∂σ², la convexité du prix par rapport à la volatilité.",
      en: "Volga and Vomma are two names for the same sensitivity: ∂²V/∂σ², the price's convexity with respect to volatility.",
    },
    commonMistake: {
      fr: "Croire que Volga et Vomma désignent deux Greeks différents, alors que ce sont des synonymes.",
      en: "Believing Volga and Vomma denote two different Greeks, when they are synonyms.",
    },
  }),
};

export const templates: QuestionTemplate[] = [definitionTemplate, identicalCallPutTemplate, usageTemplate, vocabTemplate];
