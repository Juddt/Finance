import { pick, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const modelChoiceTemplate: QuestionTemplate = {
  id: "m08-vlvs-choix-modele",
  conceptId: "m08-vol-locale-stochastique",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "local", fr: "coller exactement aux prix vanilles cotés aujourd'hui pour pricer un produit peu sensible à la dynamique future du smile", en: "exactly fit today's quoted vanilla prices to price a product not very sensitive to the smile's future dynamics" },
        { id: "stochastic", fr: "pricer une option exotique dont la valeur dépend fortement de la façon dont le smile va évoluer dans le temps", en: "price an exotic option whose value strongly depends on how the smile will evolve over time" },
      ] as const
    );

    return {
      isScenario: true,
      prompt: {
        fr: `Un desk doit ${scenario.fr}. Quel type de modèle est le plus adapté ?`,
        en: `A desk needs to ${scenario.en}. Which model type is best suited?`,
      },
      choices: buildChoices([
        { id: "local", label: { fr: "Volatilité locale (Dupire)", en: "Local volatility (Dupire)" } },
        { id: "stochastic", label: { fr: "Volatilité stochastique (Heston...)", en: "Stochastic volatility (Heston...)" } },
      ]),
      hint: { fr: "L'un colle parfaitement aux prix d'aujourd'hui, l'autre a une meilleure dynamique dans le temps.", en: "One perfectly fits today's prices, the other has better dynamics over time." },
      correctChoiceIds: [scenario.id],
      explanation:
        scenario.id === "local"
          ? { fr: "La vol locale colle exactement aux prix vanilles actuels, adaptée quand la dynamique future du smile importe peu.", en: "Local vol exactly fits current vanilla prices, suited when the smile's future dynamics matter little." }
          : { fr: "La vol stochastique offre une dynamique de smile plus réaliste dans le temps, essentielle pour des produits sensibles à cette évolution.", en: "Stochastic vol offers more realistic smile dynamics over time, essential for products sensitive to that evolution." },
      commonMistake: {
        fr: "Utiliser systématiquement le même type de modèle quel que soit le produit à pricer, sans tenir compte de sa sensibilité à la dynamique du smile.",
        en: "Systematically using the same model type regardless of the product being priced, ignoring its sensitivity to smile dynamics.",
      },
    };
  },
};

const dupireDeterministicTemplate: QuestionTemplate = {
  id: "m08-vlvs-dupire-deterministe",
  conceptId: "m08-vol-locale-stochastique",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans le modèle de volatilité locale de Dupire, la volatilité σ_loc(S,t) est une fonction ALÉATOIRE avec sa propre source d'incertitude, distincte de celle du sous-jacent.",
      en: "In Dupire's local volatility model, volatility σ_loc(S,t) is a RANDOM function with its own source of uncertainty, distinct from the underlying's.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : dans le modèle de vol locale, σ_loc(S,t) est une fonction DÉTERMINISTE de S et t (pas de nouvel aléa propre) — c'est le modèle de volatilité STOCHASTIQUE qui introduit une source d'incertitude distincte pour la volatilité.",
      en: "False: in the local vol model, σ_loc(S,t) is a DETERMINISTIC function of S and t (no new dedicated randomness) — it's the STOCHASTIC volatility model that introduces a distinct source of uncertainty for volatility.",
    },
    commonMistake: {
      fr: "Confondre les deux modèles sur ce point précis, qui est justement leur différence fondamentale.",
      en: "Confusing the two models on this exact point, which is precisely their fundamental difference.",
    },
  }),
};

const tradeoffTemplate: QuestionTemplate = {
  id: "m08-vlvs-compromis",
  conceptId: "m08-vol-locale-stochastique",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quel est le compromis fondamental entre volatilité locale et volatilité stochastique ?",
      en: "What is the fundamental trade-off between local and stochastic volatility?",
    },
    choices: buildChoices([
      { id: "tradeoff", label: { fr: "Fidélité parfaite aux prix actuels (locale) contre dynamique plus réaliste du smile futur (stochastique)", en: "Perfect fit to current prices (local) versus more realistic future smile dynamics (stochastic)" } },
      { id: "speed", label: { fr: "Rapidité de calcul (locale) contre précision numérique (stochastique)", en: "Computation speed (local) versus numerical precision (stochastic)" } },
    ]),
    hint: { fr: "Pensez à ce que chaque modèle sacrifie pour gagner l'autre chose.", en: "Think about what each model sacrifices to gain the other thing." },
    correctChoiceIds: ["tradeoff"],
    explanation: {
      fr: "Le compromis central est bien fidélité statique (vol locale, parfaite aujourd'hui) contre réalisme dynamique (vol stochastique, meilleure évolution future) — pas une question de vitesse de calcul.",
      en: "The central trade-off is indeed static fidelity (local vol, perfect today) versus dynamic realism (stochastic vol, better future evolution) — not a matter of computation speed.",
    },
    commonMistake: {
      fr: "Réduire la différence entre les deux modèles à une simple question de performance de calcul.",
      en: "Reducing the difference between the two models to a mere computational performance question.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-vlvs-vocab",
  conceptId: "m08-vol-locale-stochastique",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le processus qui consiste à choisir les paramètres d'un modèle pour qu'il reproduise au mieux les prix observés sur le marché s'appelle la ______.",
      en: "The process of choosing a model's parameters so it best reproduces market-observed prices is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["calibration"],
    hint: { fr: "Le même mot qu'en anglais financier.", en: "The English finance term itself." },
    explanation: {
      fr: "La calibration est l'étape qui ajuste les paramètres d'un modèle (local ou stochastique) sur les prix de marché observés.",
      en: "Calibration is the step that fits a model's parameters (local or stochastic) to observed market prices.",
    },
    commonMistake: {
      fr: "Confondre la calibration (ajustement aux prix actuels) avec la validation historique (test sur des données passées).",
      en: "Confusing calibration (fitting to current prices) with historical validation (testing on past data).",
    },
  }),
};

export const templates: QuestionTemplate[] = [modelChoiceTemplate, dupireDeterministicTemplate, tradeoffTemplate, vocabTemplate];
