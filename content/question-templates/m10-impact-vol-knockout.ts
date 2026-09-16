import { randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 1): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const barrierShiftNumericTemplate: QuestionTemplate = {
  id: "m10-vol-ko-deplacement-barriere",
  conceptId: "m10-impact-vol-knockout",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const H = randomInt(rng, 100, 150);
    const sigma = randomFloat(rng, 0.15, 0.35, 2);
    const freq = randomInt(rng, 26, 252);
    const dt = 1 / freq;
    const adjusted = Math.round(H * Math.exp(0.5826 * sigma * Math.sqrt(dt)) * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Une barrière contractuelle "up" est à H=${H}, la volatilité annualisée est de ${fmt(sigma * 100, "fr", 0)}%, avec ${freq} observations par an. Quelle est la barrière ajustée (Broadie-Glasserman-Kou) à utiliser dans un modèle à observation continue ?`,
        en: `A contractual "up" barrier is at H=${H}, annualized volatility is ${fmt(sigma * 100, "en", 0)}%, with ${freq} observations per year. What is the adjusted barrier (Broadie-Glasserman-Kou) to use in a continuous-observation model?`,
      },
      numericUnit: { fr: "même unité que H", en: "same unit as H" },
      numericTolerance: "± 1.5",
      hint: { fr: "H_ajustée = H × exp(0,5826 × σ × √Δt), avec Δt = 1/fréquence.", en: "H_adjusted = H × exp(0.5826 × σ × √Δt), with Δt = 1/frequency." },
      numeric: { value: adjusted, tolerance: 1.5 },
      calculation: {
        fr: `Δt = 1/${freq} ; H_ajustée = ${H} × exp(0,5826 × ${fmt(sigma, "fr", 2)} × √(1/${freq})) ≈ ${fmt(adjusted, "fr")}.`,
        en: `Δt = 1/${freq}; H_adjusted = ${H} × exp(0.5826 × ${fmt(sigma, "en", 2)} × √(1/${freq})) ≈ ${fmt(adjusted, "en")}.`,
      },
      explanation: {
        fr: "Pour une barrière 'up', le déplacement se fait vers le HAUT (exposant positif), compensant le fait que l'observation discrète sous-estime le risque de franchissement réel.",
        en: "For an 'up' barrier, the shift is UPWARD (positive exponent), compensating for discrete observation understating the real breach risk.",
      },
      commonMistake: {
        fr: "Utiliser le mauvais signe (vers le bas au lieu du haut pour une barrière up), ou oublier de calculer Δt à partir de la fréquence d'observation.",
        en: "Using the wrong sign (downward instead of upward for an up barrier), or forgetting to compute Δt from the observation frequency.",
      },
    };
  },
};

const vegaSignTemplate: QuestionTemplate = {
  id: "m10-vol-ko-signe-vega",
  conceptId: "m10-impact-vol-knockout",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le Vega d'une option knock-out est toujours positif, comme celui d'une option vanille.",
      en: "A knock-out option's Vega is always positive, like a vanilla option's.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le Vega d'un knock-out peut devenir négatif quand le spot est proche de la barrière, car l'effet dominant devient l'augmentation du risque de déclenchement plutôt que le potentiel de gain.",
      en: "False: a knock-out's Vega can turn negative when spot is close to the barrier, since the dominant effect becomes the increased trigger risk rather than the payoff potential.",
    },
    commonMistake: {
      fr: "Généraliser le comportement du Vega vanille à toutes les options, sans tenir compte de l'effet spécifique de la barrière.",
      en: "Generalizing vanilla Vega behavior to all options, without accounting for the barrier's specific effect.",
    },
  }),
};

const discreteVsContinuousTemplate: QuestionTemplate = {
  id: "m10-vol-ko-discret-continu",
  conceptId: "m10-impact-vol-knockout",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Si on applique une formule de pricing à observation continue directement à un contrat à observation discrète (sans déplacement de barrière), quel est l'effet sur le prix d'un knock-out ?",
      en: "If a continuous-observation pricing formula is applied directly to a discrete-observation contract (without a barrier shift), what is the effect on a knock-out's price?",
    },
    choices: buildChoices([
      { id: "understated", label: { fr: "Le prix du knock-out est sous-estimé", en: "The knock-out's price is understated" } },
      { id: "overstated", label: { fr: "Le prix du knock-out est surestimé", en: "The knock-out's price is overstated" } },
    ]),
    hint: { fr: "L'observation continue surestime systématiquement la probabilité de franchissement.", en: "Continuous observation systematically overstates breach probability." },
    correctChoiceIds: ["understated"],
    explanation: {
      fr: "L'observation continue surestime la probabilité de franchissement de la barrière (elle surveille chaque instant), donc surestime le risque de knock-out — ce qui sous-estime le prix du knock-out par rapport à sa vraie valeur à observation discrète.",
      en: "Continuous observation overstates breach probability (it monitors every instant), so it overstates knock-out risk — which understates the knock-out's price relative to its true discrete-observation value.",
    },
    commonMistake: {
      fr: "Inverser l'effet, en pensant que l'observation continue sous-estime le risque de franchissement.",
      en: "Reversing the effect, thinking continuous observation understates breach risk.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-vol-ko-vocab",
  conceptId: "m10-impact-vol-knockout",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La technique qui consiste à ajuster le niveau de barrière du modèle pour compenser l'observation discrète s'appelle le déplacement de ______.",
      en: "The technique of adjusting the model's barrier level to compensate for discrete observation is called a ______ shift.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["barriere", "barrière", "barrier"],
    hint: { fr: "Le même mot que dans « barrier shift ».", en: "The same word as in \"barrier shift\"." },
    explanation: {
      fr: "Le \"barrier shift\" (déplacement de barrière) de Broadie-Glasserman-Kou permet d'utiliser des formules à observation continue tout en approximant fidèlement un contrat réel à observation discrète.",
      en: "The Broadie-Glasserman-Kou barrier shift lets you use continuous-observation formulas while faithfully approximating a real discrete-observation contract.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le déplacement du strike, un concept différent.",
      en: "Confusing this term with a strike shift, a different concept.",
    },
  }),
};

export const templates: QuestionTemplate[] = [barrierShiftNumericTemplate, vegaSignTemplate, discreteVsContinuousTemplate, vocabTemplate];
