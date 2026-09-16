import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const atmfNumericTemplate: QuestionTemplate = {
  id: "m06-atmf-calcul",
  conceptId: "m06-approximation-atmf",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 300);
    const sigmaPct = randomInt(rng, 10, 40);
    const T = randomInt(rng, 1, 4) / 4;
    const sigma = sigmaPct / 100;
    const C = Math.round(0.4 * S0 * sigma * Math.sqrt(T) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une option ATMF (K=F0) sur un sous-jacent S0=${S0}, σ=${sigmaPct}%, T=${T} an(s). Estimez son prix avec l'approximation ATMF.`,
        en: `An ATMF option (K=F0) on an underlying S0=${S0}, σ=${sigmaPct}%, T=${T} year(s). Estimate its price using the ATMF approximation.`,
      },
      numericUnit: { fr: "même devise que S0", en: "same currency as S0" },
      numericTolerance: "± 1",
      hint: { fr: "C ≈ 0,4 × S0 × σ × √T.", en: "C ≈ 0.4 × S0 × σ × √T." },
      numeric: { value: C, tolerance: 1 },
      calculation: {
        fr: `C ≈ 0,4 × ${S0} × ${sigmaPct}% × √${T} ≈ ${fmt(C, "fr")}.`,
        en: `C ≈ 0.4 × ${S0} × ${sigmaPct}% × √${T} ≈ ${fmt(C, "en")}.`,
      },
      explanation: {
        fr: "Cette approximation de calcul mental est valable uniquement pour une option à la monnaie forward (K=F0).",
        en: "This mental-math approximation is only valid for an at-the-forward-money option (K=F0).",
      },
      commonMistake: {
        fr: "Oublier la racine carrée sur T, ou utiliser σ² au lieu de σ.",
        en: "Forgetting the square root on T, or using σ² instead of σ.",
      },
    };
  },
};

const constantOriginTemplate: QuestionTemplate = {
  id: "m06-atmf-origine-constante",
  conceptId: "m06-approximation-atmf",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "D'où vient la constante \"0,4\" de l'approximation ATMF ?",
      en: "Where does the ATMF approximation's \"0.4\" constant come from?",
    },
    choices: buildChoices([
      { id: "peak", label: { fr: "1/√(2π), la hauteur du pic de la loi normale standard", en: "1/√(2π), the peak height of the standard normal distribution" } },
      { id: "arbitrary", label: { fr: "Une constante empirique calibrée sur des données de marché", en: "An empirical constant calibrated on market data" } },
    ]),
    hint: { fr: "0,3989... vous rappelle-t-il quelque chose en statistiques ?", en: "Does 0.3989... remind you of something in statistics?" },
    correctChoiceIds: ["peak"],
    explanation: {
      fr: "0,4 est l'arrondi de 1/√(2π) ≈ 0,3989, qui apparaît dans le développement de Taylor de N(x) autour de x=0 utilisé pour dériver cette approximation.",
      en: "0.4 is the rounding of 1/√(2π) ≈ 0.3989, which appears in the Taylor expansion of N(x) around x=0 used to derive this approximation.",
    },
    commonMistake: {
      fr: "Croire que cette constante est un simple ajustement empirique sans fondement mathématique précis.",
      en: "Believing this constant is a simple empirical adjustment with no precise mathematical basis.",
    },
  }),
};

const validityTemplate: QuestionTemplate = {
  id: "m06-atmf-validite",
  conceptId: "m06-approximation-atmf",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'approximation C ≈ 0,4 × S0 × σ × √T reste précise pour une option très éloignée de la monnaie (fortement ITM ou OTM).",
      en: "The approximation C ≈ 0.4 × S0 × σ × √T stays accurate for an option far from the money (deep ITM or OTM).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : cette approximation n'est valable qu'à (ou très près de) la monnaie forward K=F0 — elle devient rapidement fausse en dehors de ce cas.",
      en: "False: this approximation is only valid at (or very close to) the forward money K=F0 — it quickly becomes wrong outside that case.",
    },
    commonMistake: {
      fr: "Appliquer cette formule de calcul mental à n'importe quel strike, sans vérifier qu'on est bien à la monnaie forward.",
      en: "Applying this mental-math formula to any strike, without checking one is indeed at the forward money.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-atmf-vocab",
  conceptId: "m06-approximation-atmf",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une option ATMF a un strike K exactement égal au prix ______ du sous-jacent, pas à son prix spot.",
      en: "An ATMF option has a strike K exactly equal to the underlying's ______ price, not its spot price.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["forward"],
    hint: { fr: "Le \"F\" de ATMF.", en: "The \"F\" in ATMF." },
    explanation: {
      fr: "ATMF = At-The-Money-Forward : le strike égale le prix forward F0 = S0×e^(rT), pas le spot S0.",
      en: "ATMF = At-The-Money-Forward: the strike equals the forward price F0 = S0×e^(rT), not the spot S0.",
    },
    commonMistake: {
      fr: "Confondre ATMF (K=F0) avec ATM au sens spot (K=S0), une différence subtile mais significative.",
      en: "Confusing ATMF (K=F0) with spot ATM (K=S0), a subtle but significant difference.",
    },
  }),
};

export const templates: QuestionTemplate[] = [atmfNumericTemplate, constantOriginTemplate, validityTemplate, vocabTemplate];
