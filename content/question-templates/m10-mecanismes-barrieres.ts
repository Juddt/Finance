import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const doPayoffNumericTemplate: QuestionTemplate = {
  id: "m10-mecanismes-do-payoff",
  conceptId: "m10-mecanismes-barrieres",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 80, 120);
    const H = K - randomInt(rng, 10, 30);
    const minPath = pick(rng, [H + randomInt(rng, 1, 15), H - randomInt(rng, 1, 15)] as const);
    const sT = randomInt(rng, K - 10, K + 30);
    const triggered = minPath <= H;
    const payoff = triggered ? 0 : Math.max(sT - K, 0);

    return {
      isScenario: true,
      prompt: {
        fr: `Un call down-and-out a un strike K=${K} et une barrière H=${H}, sans rebate. Le plus bas niveau atteint par le sous-jacent sur la période est ${minPath}, et il termine à S_T=${sT}. Quel est le payoff ?`,
        en: `A down-and-out call has strike K=${K} and barrier H=${H}, no rebate. The underlying's lowest level over the period is ${minPath}, and it ends at S_T=${sT}. What is the payoff?`,
      },
      numericUnit: { fr: "même unité que le sous-jacent", en: "same unit as the underlying" },
      numericTolerance: "± 0.5",
      hint: { fr: "Si le minimum a touché ou franchi H, le payoff est 0, quel que soit S_T.", en: "If the minimum touched or breached H, the payoff is 0, whatever S_T is." },
      numeric: { value: payoff, tolerance: 0.5 },
      calculation: {
        fr: triggered
          ? `Le minimum (${minPath}) a touché ou franchi la barrière H=${H} : l'option est knock-out, payoff = 0.`
          : `Le minimum (${minPath}) est resté au-dessus de H=${H} : l'option est vivante. Payoff = max(${sT}−${K}, 0) = ${fmt(payoff, "fr")}.`,
        en: triggered
          ? `The minimum (${minPath}) touched or breached the barrier H=${H}: the option is knocked out, payoff = 0.`
          : `The minimum (${minPath}) stayed above H=${H}: the option is alive. Payoff = max(${sT}−${K}, 0) = ${fmt(payoff, "en")}.`,
      },
      explanation: {
        fr: "Le knock-out est irréversible : une fois la barrière touchée, le payoff final est nul quel que soit le niveau d'arrivée du sous-jacent.",
        en: "The knock-out is irreversible: once the barrier is touched, the final payoff is zero whatever the underlying's arrival level.",
      },
      commonMistake: {
        fr: "Calculer le payoff vanille sans vérifier d'abord si la barrière a été touchée pendant la vie du contrat.",
        en: "Computing the vanilla payoff without first checking whether the barrier was touched during the contract's life.",
      },
    };
  },
};

const inVsOutTemplate: QuestionTemplate = {
  id: "m10-mecanismes-in-vs-out",
  conceptId: "m10-mecanismes-barrieres",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const kind = pick(rng, ["in", "out"] as const);
    return {
      prompt: {
        fr: `Une option knock-${kind === "in" ? "in" : "out"} : dans quel cas ${kind === "in" ? "s'active-t-elle" : "disparaît-elle"} ?`,
        en: `A knock-${kind} option: when does it ${kind === "in" ? "activate" : "vanish"}?`,
      },
      choices: buildChoices([
        { id: "touch", label: { fr: "Quand la barrière est touchée", en: "When the barrier is touched" } },
        { id: "never", label: { fr: "Quand la barrière n'est jamais touchée", en: "When the barrier is never touched" } },
      ]),
      hint: { fr: "\"In\" = entre en vie ; \"Out\" = sort de vie, au moment où la barrière est touchée.", en: "\"In\" = comes to life; \"Out\" = goes out of life, when the barrier is touched." },
      correctChoiceIds: ["touch"],
      explanation: {
        fr: kind === "in" ? "Un knock-in s'ACTIVE quand la barrière est touchée — avant cela, il ne vaut rien." : "Un knock-out DISPARAÎT (perd toute valeur, sauf rebate) quand la barrière est touchée.",
        en: kind === "in" ? "A knock-in ACTIVATES when the barrier is touched — before that, it's worth nothing." : "A knock-out VANISHES (loses all value, except for a rebate) when the barrier is touched.",
      },
      commonMistake: {
        fr: "Inverser knock-in et knock-out, une confusion très fréquente.",
        en: "Swapping knock-in and knock-out, a very frequent confusion.",
      },
    };
  },
};

const irreversibleTemplate: QuestionTemplate = {
  id: "m10-mecanismes-irreversible",
  conceptId: "m10-mecanismes-barrieres",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Si le sous-jacent d'un call up-and-out touche brièvement la barrière puis redescend nettement en dessous avant l'échéance, l'option redevient valide comme si de rien n'était.",
      en: "If an up-and-out call's underlying briefly touches the barrier then falls well below it before expiry, the option becomes valid again as if nothing happened.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le déclenchement d'un knock-out est définitif et irréversible pour toute la durée de vie restante du contrat, quel que soit le comportement ultérieur du sous-jacent.",
      en: "False: a knock-out's triggering is final and irreversible for the rest of the contract's life, whatever the underlying does afterward.",
    },
    commonMistake: {
      fr: "Croire qu'une option barrière peut \"revivre\" après un déclenchement, comme si la barrière n'agissait que ponctuellement.",
      en: "Believing a barrier option can \"come back to life\" after triggering, as if the barrier only acted momentarily.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-mecanismes-vocab",
  conceptId: "m10-mecanismes-barrieres",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un montant fixe versé au détenteur en compensation quand une barrière est touchée s'appelle un ______.",
      en: "A fixed amount paid to the holder as compensation when a barrier is touched is called a ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["rebate"],
    hint: { fr: "Le même mot qu'en anglais financier.", en: "The English finance term itself." },
    explanation: {
      fr: "Le rebate adoucit partiellement la perte pour le détenteur d'un knock-out déclenché, ou compense pour un knock-in jamais activé selon la convention contractuelle.",
      en: "The rebate partially softens the loss for the holder of a triggered knock-out, or compensates for a never-activated knock-in depending on the contractual convention.",
    },
    commonMistake: {
      fr: "Croire que le rebate est systématiquement présent dans tout contrat barrière, alors qu'il est souvent nul.",
      en: "Believing the rebate is systematically present in every barrier contract, when it's often zero.",
    },
  }),
};

export const templates: QuestionTemplate[] = [doPayoffNumericTemplate, inVsOutTemplate, irreversibleTemplate, vocabTemplate];
