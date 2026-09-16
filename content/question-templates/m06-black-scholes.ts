import { pick, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const noDriftTemplate: QuestionTemplate = {
  id: "m06-bs-pas-de-drift",
  conceptId: "m06-black-scholes",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'équation aux dérivées partielles de Black-Scholes contient explicitement le rendement moyen attendu (drift μ) du sous-jacent.",
      en: "The Black-Scholes partial differential equation explicitly contains the underlying's expected average return (drift μ).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : remarquablement, l'équation ne contient que r (le taux sans risque), pas μ — une conséquence directe du delta-hedging qui rend le portefeuille de réplication insensible au drift réel.",
      en: "False: remarkably, the equation only contains r (the risk-free rate), not μ — a direct consequence of delta-hedging, which makes the replicating portfolio insensitive to the true drift.",
    },
    commonMistake: {
      fr: "Croire que le prix d'une option dépend d'une prévision du rendement futur du sous-jacent.",
      en: "Believing an option's price depends on a forecast of the underlying's future return.",
    },
  }),
};

const hedgeRatioTemplate: QuestionTemplate = {
  id: "m06-bs-ratio-couverture",
  conceptId: "m06-black-scholes",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Dans la démonstration de Black-Scholes, quelle quantité d'actions Δ faut-il détenir en face d'une position courte sur l'option pour annuler le risque instantané lié à dW_t ?",
      en: "In the Black-Scholes derivation, how many shares Δ must be held against a short option position to cancel the instantaneous risk from dW_t?",
    },
    choices: buildChoices([
      { id: "dvds", label: { fr: "Δ = ∂V/∂S", en: "Δ = ∂V/∂S" } },
      { id: "vs", label: { fr: "Δ = V/S", en: "Δ = V/S" } },
      { id: "one", label: { fr: "Δ = 1, toujours", en: "Δ = 1, always" } },
    ]),
    hint: { fr: "C'est la sensibilité du prix de l'option à une petite variation du sous-jacent.", en: "It's the option price's sensitivity to a small change in the underlying." },
    correctChoiceIds: ["dvds"],
    explanation: {
      fr: "Δ = ∂V/∂S, la dérivée du prix de l'option par rapport au sous-jacent, est exactement le ratio qui annule le terme en dW_t dans dΠ = dV − ΔdS.",
      en: "Δ = ∂V/∂S, the option price's derivative with respect to the underlying, is exactly the ratio that cancels the dW_t term in dΠ = dV − ΔdS.",
    },
    commonMistake: {
      fr: "Confondre le ratio de couverture Δ avec le prix de l'option divisé par le prix du sous-jacent.",
      en: "Confusing the hedge ratio Δ with the option's price divided by the underlying's price.",
    },
  }),
};

const assumptionTemplate: QuestionTemplate = {
  id: "m06-bs-hypothese",
  conceptId: "m06-black-scholes",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notAssumption = pick(
      rng,
      [
        { id: "jumps", fr: "Le prix du sous-jacent peut subir des sauts brusques (discontinuités)", en: "The underlying's price can jump abruptly (discontinuities)" },
        { id: "dividends", fr: "L'actif verse des dividendes variables et imprévisibles", en: "The asset pays variable, unpredictable dividends" },
      ] as const
    );

    return {
      prompt: {
        fr: `Laquelle de ces situations est EXCLUE par les hypothèses du modèle de Black-Scholes de base : « ${notAssumption.fr} » ?`,
        en: `Which of these situations is EXCLUDED by the basic Black-Scholes model's assumptions: "${notAssumption.en}"?`,
      },
      choices: buildChoices([
        { id: "excluded", label: { fr: "Exclue : ce n'est pas une hypothèse du modèle de base", en: "Excluded: not an assumption of the basic model" } },
        { id: "included", label: { fr: "Incluse : c'est compatible avec le modèle de base", en: "Included: compatible with the basic model" } },
      ]),
      hint: { fr: "Le modèle de base suppose un brownien géométrique continu, sans dividende.", en: "The basic model assumes a continuous geometric Brownian motion, with no dividend." },
      correctChoiceIds: ["excluded"],
      explanation: {
        fr: `Le modèle de Black-Scholes de base exclut ${notAssumption.id === "jumps" ? "les sauts de prix (le sous-jacent suit un brownien géométrique CONTINU)" : "tout dividende (hypothèse d'absence de dividende)"} — des extensions du modèle existent pour relâcher cette hypothèse, mais pas le modèle de base.`,
        en: `The basic Black-Scholes model excludes ${notAssumption.id === "jumps" ? "price jumps (the underlying follows a CONTINUOUS geometric Brownian motion)" : "any dividend (the no-dividend assumption)"} — extensions of the model exist to relax this assumption, but not the basic model.`,
      },
      commonMistake: {
        fr: "Croire que le modèle de base gère nativement les dividendes ou les sauts de prix, sans extension.",
        en: "Believing the basic model natively handles dividends or price jumps, without extension.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-bs-vocab",
  conceptId: "m06-black-scholes",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un portefeuille dont la valeur ne change qu'à cause des variations de prix des actifs qui le composent, sans apport ni retrait externe d'argent, est dit auto-______.",
      en: "A portfolio whose value only changes due to price moves of its component assets, with no external cash added or withdrawn, is said to be self-______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word (financing)" },
    acceptedAnswers: ["finance", "financé", "financing"],
    hint: { fr: "Il se \"finance\" tout seul.", en: "It \"finances\" itself." },
    explanation: {
      fr: "Un portefeuille auto-financé est une hypothèse clé de la démonstration de Black-Scholes : le rééquilibrage du delta-hedging se fait sans injection ni retrait de cash externe.",
      en: "A self-financing portfolio is a key assumption in the Black-Scholes derivation: delta-hedging rebalancing happens with no external cash injection or withdrawal.",
    },
    commonMistake: {
      fr: "Croire qu'un portefeuille auto-financé signifie qu'il ne nécessite aucun rééquilibrage.",
      en: "Believing a self-financing portfolio means it needs no rebalancing at all.",
    },
  }),
};

export const templates: QuestionTemplate[] = [noDriftTemplate, hedgeRatioTemplate, assumptionTemplate, vocabTemplate];
