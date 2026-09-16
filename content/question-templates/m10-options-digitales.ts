import { randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) p = 1 - p;
  return p;
}

const cashOrNothingNumericTemplate: QuestionTemplate = {
  id: "m10-digitale-calcul-prix",
  conceptId: "m10-options-digitales",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 80, 120);
    const K = S0;
    const r = randomFloat(rng, 0.01, 0.05, 3);
    const sigma = randomFloat(rng, 0.15, 0.3, 2);
    const T = 1;
    const C = randomInt(rng, 500, 2000);
    const d1 = (Math.log(S0 / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const price = Math.round(C * Math.exp(-r * T) * normalCdf(d2) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une digitale cash-or-nothing verse ${fmt(C, "fr", 0)} si une action termine au-dessus de K=${K} dans 1 an. S0=${S0}, r=${fmt(r * 100, "fr", 1)}%, σ=${fmt(sigma * 100, "fr", 0)}%. Quel est son prix ?`,
        en: `A cash-or-nothing digital pays ${fmt(C, "en", 0)} if a stock ends above K=${K} in 1 year. S0=${S0}, r=${fmt(r * 100, "en", 1)}%, σ=${fmt(sigma * 100, "en", 0)}%. What is its price?`,
      },
      numericUnit: { fr: "même devise que C", en: "same currency as C" },
      numericTolerance: "± 15",
      hint: { fr: "Prix = C × e^{−rT} × N(d2), avec d2 calculé comme pour Black-Scholes.", en: "Price = C × e^{−rT} × N(d2), with d2 computed as for Black-Scholes." },
      numeric: { value: price, tolerance: 15 },
      calculation: {
        fr: `d2 ≈ ${fmt(d2, "fr", 3)}, N(d2) ≈ ${fmt(normalCdf(d2), "fr", 4)}. Prix = ${fmt(C, "fr", 0)} × e^{−${fmt(r, "fr", 3)}} × ${fmt(normalCdf(d2), "fr", 4)} ≈ ${fmt(price, "fr")}.`,
        en: `d2 ≈ ${fmt(d2, "en", 3)}, N(d2) ≈ ${fmt(normalCdf(d2), "en", 4)}. Price = ${fmt(C, "en", 0)} × e^{−${fmt(r, "en", 3)}} × ${fmt(normalCdf(d2), "en", 4)} ≈ ${fmt(price, "en")}.`,
      },
      explanation: {
        fr: "Le prix d'une digitale cash-or-nothing se lit directement comme la probabilité risque-neutre de succès (N(d2)), actualisée et multipliée par le montant versé.",
        en: "A cash-or-nothing digital's price reads directly as the discounted risk-neutral success probability (N(d2)), multiplied by the amount paid.",
      },
      commonMistake: {
        fr: "Utiliser N(d1) au lieu de N(d2), ou oublier d'actualiser le montant C.",
        en: "Using N(d1) instead of N(d2), or forgetting to discount the amount C.",
      },
    };
  },
};

const cashVsAssetTemplate: QuestionTemplate = {
  id: "m10-digitale-cash-vs-asset",
  conceptId: "m10-options-digitales",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Quelle est la différence entre une digitale cash-or-nothing et une digitale asset-or-nothing ?",
      en: "What is the difference between a cash-or-nothing and an asset-or-nothing digital?",
    },
    choices: buildChoices([
      { id: "fixed-vs-underlying", label: { fr: "Montant fixe C vs. valeur du sous-jacent S_T", en: "Fixed amount C vs. the underlying's value S_T" } },
      { id: "call-vs-put", label: { fr: "Type call vs. type put", en: "Call type vs. put type" } },
    ]),
    hint: { fr: "L'une verse un montant fixe, l'autre verse le sous-jacent lui-même.", en: "One pays a fixed amount, the other pays the underlying itself." },
    correctChoiceIds: ["fixed-vs-underlying"],
    explanation: {
      fr: "Une cash-or-nothing verse un montant fixe C si la condition est remplie ; une asset-or-nothing verse la valeur du sous-jacent S_T lui-même si la condition est remplie.",
      en: "A cash-or-nothing pays a fixed amount C if the condition is met; an asset-or-nothing pays the underlying's own value S_T if the condition is met.",
    },
    commonMistake: {
      fr: "Confondre cette distinction avec celle entre call et put, qui est indépendante.",
      en: "Confusing this distinction with the call/put distinction, which is independent.",
    },
  }),
};

const d2ProbabilityTemplate: QuestionTemplate = {
  id: "m10-digitale-probabilite-d2",
  conceptId: "m10-options-digitales",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "N(d2) représente la vraie probabilité risque-neutre que S_T dépasse le strike K à l'échéance.",
      en: "N(d2) represents the true risk-neutral probability that S_T exceeds the strike K at expiry.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : N(d2) est exactement la probabilité risque-neutre que l'option termine dans la monnaie, un résultat déjà rencontré en M06-5.",
      en: "True: N(d2) is exactly the risk-neutral probability the option ends in the money, a result already encountered in M06-5.",
    },
    commonMistake: {
      fr: "Attribuer cette interprétation probabiliste à N(d1) plutôt qu'à N(d2).",
      en: "Attributing this probabilistic interpretation to N(d1) instead of N(d2).",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-digitale-vocab",
  conceptId: "m10-options-digitales",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une option dont le payoff est \"tout ou rien\" (un montant fixe ou zéro) est appelée une option ______.",
      en: "An option whose payoff is \"all or nothing\" (a fixed amount or zero) is called a ______ option.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["digitale", "binaire", "digital", "binary"],
    hint: { fr: "Le même mot que dans « digitale cash-or-nothing ».", en: "The same word as in \"digital cash-or-nothing\"." },
    explanation: {
      fr: "Une option digitale (ou binaire) a un payoff \"tout ou rien\", contrairement au payoff continu d'une option vanille.",
      en: "A digital (or binary) option has an \"all or nothing\" payoff, unlike a vanilla option's continuous payoff.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec les options barrières, qui ont un payoff conditionnel mais pas nécessairement binaire au sens strict.",
      en: "Confusing this term with barrier options, which have a conditional but not necessarily strictly binary payoff.",
    },
  }),
};

export const templates: QuestionTemplate[] = [cashOrNothingNumericTemplate, cashVsAssetTemplate, d2ProbabilityTemplate, vocabTemplate];
