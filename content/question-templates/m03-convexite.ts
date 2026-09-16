import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const priceChangeWithConvexityTemplate: QuestionTemplate = {
  id: "m03-convexite-variation-prix",
  conceptId: "m03-convexite",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const Dmod = randomFloat(rng, 2, 12, 2);
    const convexity = randomFloat(rng, 5, 150, 1);
    const dyBp = randomInt(rng, 50, 300);
    const dy = dyBp / 10000;
    const direction = pick(rng, ["up", "down"] as const);
    const signedDy = direction === "up" ? dy : -dy;
    const pctChange = Math.round((-Dmod * signedDy + 0.5 * convexity * signedDy * signedDy) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation a une duration modifiée D_mod = ${fmt(Dmod, "fr")} et une convexité C = ${fmt(convexity, "fr", 1)}. Les taux ${direction === "up" ? "montent" : "baissent"} de ${dyBp} points de base. Quelle est la variation de prix approximative ΔP/P, en % (avec son signe) ?`,
        en: `A bond has modified duration D_mod = ${fmt(Dmod, "en")} and convexity C = ${fmt(convexity, "en", 1)}. Rates ${direction === "up" ? "rise" : "fall"} by ${dyBp} basis points. What is the approximate price change ΔP/P, in % (with its sign)?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "ΔP/P ≈ −D_mod × Δy + ½ × C × Δy².", en: "ΔP/P ≈ −D_mod × Δy + ½ × C × Δy²." },
      numeric: { value: pctChange, tolerance: 0.1 },
      calculation: {
        fr: `Δy = ${direction === "up" ? "+" : "−"}${dyBp}pb = ${direction === "up" ? "+" : "−"}${dy}. Terme duration = −${fmt(Dmod, "fr")} × ${signedDy.toFixed(4)} = ${(-Dmod * signedDy * 100).toFixed(2)}%. Terme convexité = ½ × ${fmt(convexity, "fr", 1)} × ${signedDy.toFixed(4)}² = ${(0.5 * convexity * signedDy * signedDy * 100).toFixed(2)}%. Total ≈ ${pctChange}%.`,
        en: `Δy = ${direction === "up" ? "+" : "−"}${dyBp}bp = ${direction === "up" ? "+" : "−"}${dy}. Duration term = −${fmt(Dmod, "en")} × ${signedDy.toFixed(4)} = ${(-Dmod * signedDy * 100).toFixed(2)}%. Convexity term = ½ × ${fmt(convexity, "en", 1)} × ${signedDy.toFixed(4)}² = ${(0.5 * convexity * signedDy * signedDy * 100).toFixed(2)}%. Total ≈ ${pctChange}%.`,
      },
      explanation: {
        fr: "Le terme de convexité est toujours positif et adoucit une perte (hausse des taux) ou amplifie un gain (baisse des taux) par rapport à l'approximation par la seule duration.",
        en: "The convexity term is always positive and softens a loss (rate rise) or amplifies a gain (rate fall) relative to the duration-only approximation.",
      },
      commonMistake: {
        fr: "Oublier le facteur ½, ou utiliser Δy en points de base au lieu de la proportion décimale dans la formule.",
        en: "Forgetting the ½ factor, or using Δy in basis points instead of the decimal proportion in the formula.",
      },
    };
  },
};

const alwaysPositiveTemplate: QuestionTemplate = {
  id: "m03-convexite-toujours-positive",
  conceptId: "m03-convexite",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pour une obligation classique sans option intégrée, le terme de convexité dans l'approximation de ΔP/P favorise toujours le porteur de l'obligation, que les taux montent ou baissent.",
      en: "For a plain-vanilla bond with no embedded option, the convexity term in the ΔP/P approximation always favors the bondholder, whether rates rise or fall.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : Δy² est toujours positif ou nul, et la convexité est positive pour une obligation classique, donc ½ × C × Δy² est toujours ≥ 0 — un avantage systématique pour le porteur.",
      en: "True: Δy² is always non-negative, and convexity is positive for a plain-vanilla bond, so ½ × C × Δy² is always ≥ 0 — a systematic advantage for the holder.",
    },
    commonMistake: {
      fr: "Croire que la convexité peut jouer contre le porteur dans un sens comme dans l'autre, comme le fait le terme de duration.",
      en: "Believing convexity can work against the holder in either direction, the way the duration term does.",
    },
  }),
};

const higherConvexityTemplate: QuestionTemplate = {
  id: "m03-convexite-comparaison",
  conceptId: "m03-convexite",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const compareTo = pick(rng, ["maturity", "coupon"] as const);
    return {
      prompt: {
        fr:
          compareTo === "maturity"
            ? "À taux de coupon identique, quelle obligation a la convexité la plus élevée ?"
            : "À maturité identique, quelle obligation a la convexité la plus élevée ?",
        en:
          compareTo === "maturity"
            ? "At the same coupon rate, which bond has the higher convexity?"
            : "At the same maturity, which bond has the higher convexity?",
      },
      choices: buildChoices(
        compareTo === "maturity"
          ? [
              { id: "long", label: { fr: "Celle avec la maturité la plus longue", en: "The one with the longer maturity" } },
              { id: "short", label: { fr: "Celle avec la maturité la plus courte", en: "The one with the shorter maturity" } },
            ]
          : [
              { id: "zero", label: { fr: "Celle avec le coupon le plus bas (proche d'un zéro-coupon)", en: "The one with the lower coupon (closer to a zero-coupon)" } },
              { id: "high", label: { fr: "Celle avec le coupon le plus élevé", en: "The one with the higher coupon" } },
            ]
      ),
      hint: {
        fr: "La convexité est plus élevée quand les flux sont plus concentrés loin dans le futur.",
        en: "Convexity is higher when cash flows are more concentrated far out in time.",
      },
      correctChoiceIds: [compareTo === "maturity" ? "long" : "zero"],
      explanation: {
        fr:
          compareTo === "maturity"
            ? "Une maturité plus longue disperse les flux plus loin dans le temps, augmentant la convexité."
            : "Un coupon plus bas concentre davantage la valeur sur le remboursement final lointain, augmentant la convexité — un zéro-coupon a la convexité maximale à maturité donnée.",
        en:
          compareTo === "maturity"
            ? "A longer maturity spreads cash flows further out in time, increasing convexity."
            : "A lower coupon concentrates more value on the distant final repayment, increasing convexity — a zero-coupon bond has the maximum convexity for a given maturity.",
      },
      commonMistake: {
        fr: "Croire que la convexité dépend uniquement de la duration, alors que la répartition des flux compte aussi.",
        en: "Believing convexity depends only on duration, when the distribution of cash flows also matters.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m03-convexite-vocab",
  conceptId: "m03-convexite",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La convexité est la dérivée ______ du prix par rapport au rendement, normalisée par le prix.",
      en: "Convexity is the ______ derivative of price with respect to yield, normalized by price.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["seconde", "second"],
    hint: { fr: "La duration est la dérivée première ; la convexité va un cran plus loin.", en: "Duration is the first derivative; convexity goes one step further." },
    explanation: {
      fr: "La convexité mesure la courbure (dérivée seconde) de la relation prix-taux, là où la duration n'en mesure que la pente (dérivée première).",
      en: "Convexity measures the curvature (second derivative) of the price-yield relationship, whereas duration only measures its slope (first derivative).",
    },
    commonMistake: {
      fr: "Confondre l'ordre de dérivation entre duration et convexité.",
      en: "Mixing up the order of differentiation between duration and convexity.",
    },
  }),
};

export const templates: QuestionTemplate[] = [priceChangeWithConvexityTemplate, alwaysPositiveTemplate, higherConvexityTemplate, vocabTemplate];
