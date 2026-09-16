import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function normalCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + p * absX);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);
  return 0.5 * (1 + sign * y);
}

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const callPriceNumericTemplate: QuestionTemplate = {
  id: "m06-formules-call-prix",
  conceptId: "m06-formules-call-put",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 60, 150);
    const K = S0;
    const rPct = randomInt(rng, 1, 6);
    const sigmaPct = randomInt(rng, 10, 40);
    const T = 1;
    const r = rPct / 100;
    const sigma = sigmaPct / 100;
    const d1 = (Math.log(S0 / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const C = Math.round((S0 * normalCdf(d1) - K * Math.exp(-r * T) * normalCdf(d2)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = K = ${S0}, r = ${rPct}%, σ = ${sigmaPct}%, T = 1 an. Quel est le prix du call européen selon Black-Scholes ?`,
        en: `S0 = K = ${S0}, r = ${rPct}%, σ = ${sigmaPct}%, T = 1 year. What is the European call price under Black-Scholes?`,
      },
      numericUnit: { fr: "même devise que S0", en: "same currency as S0" },
      numericTolerance: "± 1",
      hint: { fr: "C = S0×N(d1) − K×e^(−rT)×N(d2), avec d1=[ln(S0/K)+(r+σ²/2)T]/(σ√T), d2=d1−σ√T.", en: "C = S0×N(d1) − K×e^(−rT)×N(d2), with d1=[ln(S0/K)+(r+σ²/2)T]/(σ√T), d2=d1−σ√T." },
      numeric: { value: C, tolerance: 1 },
      calculation: {
        fr: `d1 = (0+(${rPct}%+${sigmaPct}%²/2))/${sigmaPct}% ≈ ${d1.toFixed(4)}. d2 = d1−σ ≈ ${d2.toFixed(4)}. N(d1)≈${normalCdf(d1).toFixed(4)}, N(d2)≈${normalCdf(d2).toFixed(4)}. C = ${S0}×${normalCdf(d1).toFixed(4)} − ${K}×e^(−${rPct}%)×${normalCdf(d2).toFixed(4)} ≈ ${fmt(C, "fr")}.`,
        en: `d1 = (0+(${rPct}%+${sigmaPct}%²/2))/${sigmaPct}% ≈ ${d1.toFixed(4)}. d2 = d1−σ ≈ ${d2.toFixed(4)}. N(d1)≈${normalCdf(d1).toFixed(4)}, N(d2)≈${normalCdf(d2).toFixed(4)}. C = ${S0}×${normalCdf(d1).toFixed(4)} − ${K}×e^(−${rPct}%)×${normalCdf(d2).toFixed(4)} ≈ ${fmt(C, "en")}.`,
      },
      explanation: {
        fr: "Puisque S0=K (à la monnaie), on peut aussi comparer ce résultat à l'approximation ATMF (M06-6) pour vérifier l'ordre de grandeur.",
        en: "Since S0=K (at the money), this result can also be compared to the ATMF approximation (M06-6) to check the order of magnitude.",
      },
      commonMistake: {
        fr: "Utiliser −σ²/2 au lieu de +σ²/2 dans d1, une confusion avec la formule du brownien géométrique (M06-2).",
        en: "Using −σ²/2 instead of +σ²/2 in d1, a confusion with the geometric Brownian motion formula (M06-2).",
      },
    };
  },
};

const d1InterpretationTemplate: QuestionTemplate = {
  id: "m06-formules-n-d1",
  conceptId: "m06-formules-call-put",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans la formule de Black-Scholes pour un call, à quelle grandeur financière N(d1) correspond-il ?",
      en: "In the Black-Scholes call formula, which financial quantity does N(d1) correspond to?",
    },
    choices: buildChoices([
      { id: "delta", label: { fr: "Le Delta du call", en: "The call's Delta" } },
      { id: "pd", label: { fr: "La probabilité de défaut de l'émetteur", en: "The issuer's probability of default" } },
      { id: "vega", label: { fr: "Le Vega du call", en: "The call's Vega" } },
    ]),
    hint: { fr: "C'est la sensibilité du prix de l'option à une petite variation du sous-jacent.", en: "It's the option price's sensitivity to a small change in the underlying." },
    correctChoiceIds: ["delta"],
    explanation: {
      fr: "N(d1) est exactement le Delta du call (∂C/∂S0), une interprétation qui sera reprise en détail en M07-1.",
      en: "N(d1) is exactly the call's Delta (∂C/∂S0), an interpretation covered in detail in M07-1.",
    },
    commonMistake: {
      fr: "Confondre N(d1) avec N(d2), qui est la vraie probabilité risque-neutre d'exercice.",
      en: "Confusing N(d1) with N(d2), which is the true risk-neutral exercise probability.",
    },
  }),
};

const d2ProbabilityTemplate: QuestionTemplate = {
  id: "m06-formules-n-d2",
  conceptId: "m06-formules-call-put",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "N(d2) représente la vraie probabilité risque-neutre que l'option termine dans la monnaie (S_T > K).",
      en: "N(d2) represents the true risk-neutral probability that the option ends in the money (S_T > K).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : contrairement à N(d1) (le Delta), N(d2) est la véritable probabilité risque-neutre d'exercice de l'option.",
      en: "True: unlike N(d1) (the Delta), N(d2) is the true risk-neutral probability of the option's exercise.",
    },
    commonMistake: {
      fr: "Attribuer cette interprétation probabiliste à N(d1) au lieu de N(d2).",
      en: "Attributing this probabilistic interpretation to N(d1) instead of N(d2).",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m06-formules-vocab",
  conceptId: "m06-formules-call-put",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "N(x) désigne la fonction de ______ de la loi normale centrée réduite.",
      en: "N(x) denotes the ______ function of the standard normal distribution.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["repartition", "répartition", "cumulative", "distribution"],
    hint: { fr: "La fonction qui donne P(Z ≤ x).", en: "The function giving P(Z ≤ x)." },
    explanation: {
      fr: "N(x) est la fonction de répartition (CDF) de la loi normale centrée réduite, toujours comprise entre 0 et 1.",
      en: "N(x) is the standard normal distribution's cumulative distribution function (CDF), always between 0 and 1.",
    },
    commonMistake: {
      fr: "Confondre la fonction de répartition N(x) avec la fonction de densité (la courbe en cloche elle-même).",
      en: "Confusing the cumulative distribution function N(x) with the density function (the bell curve itself).",
    },
  }),
};

export const templates: QuestionTemplate[] = [callPriceNumericTemplate, d1InterpretationTemplate, d2ProbabilityTemplate, vocabTemplate];
