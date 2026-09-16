import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function normalDensity(x: number): number {
  return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
}

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const gammaNumericTemplate: QuestionTemplate = {
  id: "m07-greeks-gamma-calcul",
  conceptId: "m07-greeks-premier-ordre",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const sigmaPct = randomInt(rng, 10, 40);
    const d1 = (randomInt(rng, -30, 30)) / 100;
    const sigma = sigmaPct / 100;
    const T = 1;
    const gamma = Math.round((normalDensity(d1) / (S0 * sigma * Math.sqrt(T))) * 100000) / 100000;

    return {
      isScenario: true,
      prompt: {
        fr: `Pour une option avec S0=${S0}, σ=${sigmaPct}%, T=1 an et d1=${d1.toFixed(2)}, quel est le Gamma ?`,
        en: `For an option with S0=${S0}, σ=${sigmaPct}%, T=1 year and d1=${d1.toFixed(2)}, what is Gamma?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.001",
      hint: { fr: "Γ = N'(d1) / (S0 × σ × √T).", en: "Γ = N'(d1) / (S0 × σ × √T)." },
      numeric: { value: gamma, tolerance: 0.001 },
      calculation: {
        fr: `N'(${d1.toFixed(2)}) ≈ ${fmt(normalDensity(d1), "fr")}. Γ = ${fmt(normalDensity(d1), "fr")} / (${S0}×${sigmaPct}%×1) ≈ ${fmt(gamma, "fr", 5)}.`,
        en: `N'(${d1.toFixed(2)}) ≈ ${fmt(normalDensity(d1), "en")}. Γ = ${fmt(normalDensity(d1), "en")} / (${S0}×${sigmaPct}%×1) ≈ ${fmt(gamma, "en", 5)}.`,
      },
      explanation: {
        fr: "Le Gamma est identique pour un call et un put de mêmes caractéristiques, une conséquence de la parité call-put.",
        en: "Gamma is identical for a call and a put with the same characteristics, a consequence of put-call parity.",
      },
      commonMistake: {
        fr: "Oublier de diviser par σ√T, ou utiliser la densité au lieu de la fonction de répartition N(x).",
        en: "Forgetting to divide by σ√T, or using the density instead of the cumulative function N(x).",
      },
    };
  },
};

const putSignTemplate: QuestionTemplate = {
  id: "m07-greeks-signe-put",
  conceptId: "m07-greeks-premier-ordre",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Quel est le signe du Delta d'un put (position longue) ?",
      en: "What is the sign of a put's Delta (long position)?",
    },
    choices: buildChoices([
      { id: "negative", label: { fr: "Toujours négatif (entre −1 et 0)", en: "Always negative (between −1 and 0)" } },
      { id: "positive", label: { fr: "Toujours positif (entre 0 et 1)", en: "Always positive (between 0 and 1)" } },
    ]),
    hint: { fr: "Que se passe-t-il pour le prix d'un put quand le sous-jacent monte ?", en: "What happens to a put's price when the underlying rises?" },
    correctChoiceIds: ["negative"],
    explanation: {
      fr: "Un put perd de la valeur quand le sous-jacent monte, donc son Delta est toujours négatif, entre −1 et 0 — l'inverse d'un call.",
      en: "A put loses value as the underlying rises, so its Delta is always negative, between −1 and 0 — the opposite of a call.",
    },
    commonMistake: {
      fr: "Croire que le Delta d'un put a le même signe que celui d'un call.",
      en: "Believing a put's Delta has the same sign as a call's.",
    },
  }),
};

const sameGammaVegaTemplate: QuestionTemplate = {
  id: "m07-greeks-gamma-vega-identiques",
  conceptId: "m07-greeks-premier-ordre",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const greek = pick(rng, ["gamma-vega", "delta-rho"] as const);
    return {
      prompt: {
        fr:
          greek === "gamma-vega"
            ? "Le Gamma et le Vega sont identiques pour un call et un put de mêmes strike, échéance et sous-jacent."
            : "Le Delta et le Rho sont identiques pour un call et un put de mêmes strike, échéance et sous-jacent.",
        en:
          greek === "gamma-vega"
            ? "Gamma and Vega are identical for a call and a put with the same strike, maturity and underlying."
            : "Delta and Rho are identical for a call and a put with the same strike, maturity and underlying.",
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: [greek === "gamma-vega" ? "true" : "false"],
      explanation:
        greek === "gamma-vega"
          ? { fr: "Vrai : Gamma et Vega sont identiques pour un call et un put de mêmes caractéristiques, une conséquence de la parité call-put.", en: "True: Gamma and Vega are identical for a call and a put with the same characteristics, a consequence of put-call parity." }
          : { fr: "Faux : Delta et Rho DIFFÈRENT entre un call et un put (signes opposés notamment), contrairement à Gamma et Vega.", en: "False: Delta and Rho DIFFER between a call and a put (opposite signs notably), unlike Gamma and Vega." },
      commonMistake: {
        fr: "Généraliser à tous les Greeks une propriété qui ne vaut que pour Gamma et Vega.",
        en: "Generalizing to all Greeks a property that only holds for Gamma and Vega.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-greeks-vocab",
  conceptId: "m07-greeks-premier-ordre",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le Greek qui mesure la sensibilité du prix d'une option à la volatilité, ∂V/∂σ, s'appelle le ______.",
      en: "The Greek measuring an option's price sensitivity to volatility, ∂V/∂σ, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["vega"],
    hint: { fr: "Ce n'est pas une lettre grecque, contrairement aux autres Greeks classiques.", en: "Unlike the other classic Greeks, it isn't actually a Greek letter." },
    explanation: {
      fr: "Le Vega mesure la sensibilité à la volatilité — un nom qui, ironiquement, ne vient pas de l'alphabet grec contrairement à Delta, Gamma, Theta et Rho.",
      en: "Vega measures sensitivity to volatility — a name that, ironically, isn't from the Greek alphabet unlike Delta, Gamma, Theta and Rho.",
    },
    commonMistake: {
      fr: "Confondre Vega avec Gamma, qui mesure la sensibilité du Delta au sous-jacent, pas à la volatilité.",
      en: "Confusing Vega with Gamma, which measures Delta's sensitivity to the underlying, not to volatility.",
    },
  }),
};

export const templates: QuestionTemplate[] = [gammaNumericTemplate, putSignTemplate, sameGammaVegaTemplate, vocabTemplate];
