import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const directionTemplate: QuestionTemplate = {
  id: "m03-duration-direction",
  conceptId: "m03-duration",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const bps = randomInt(rng, 1, 4) * 25;
    const goesUp = pick(rng, [true, false]);
    const direction = goesUp ? { fr: "augmentent", en: "rise" } : { fr: "baissent", en: "fall" };
    const correctId = goesUp ? "down" : "up";

    return {
      prompt: {
        fr: `Les taux de marché ${direction.fr} de ${bps} points de base. Que devient, toutes choses égales par ailleurs, le prix d'une obligation à taux fixe déjà émise ?`,
        en: `Market rates ${direction.en} by ${bps} basis points. All else equal, what happens to the price of an already-issued fixed-rate bond?`,
      },
      choices: buildChoices([
        { id: "up", label: { fr: "Il monte", en: "It rises" } },
        { id: "down", label: { fr: "Il baisse", en: "It falls" } },
        { id: "same", label: { fr: "Il ne change pas", en: "It stays the same" } },
      ]),
      hint: {
        fr: "Les flux de l'obligation sont fixes : que devient leur valeur actuelle quand le taux d'actualisation change ?",
        en: "The bond's cash flows are fixed: what happens to their present value when the discount rate changes?",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: `Prix et taux évoluent toujours en sens inverse pour une obligation à taux fixe : les taux ${direction.fr}, donc le prix ${goesUp ? "baisse" : "monte"}.`,
        en: `Price and yield always move in opposite directions for a fixed-rate bond: rates ${direction.en}, so the price ${goesUp ? "falls" : "rises"}.`,
      },
      commonMistake: {
        fr: "Penser que le prix suit le même sens que les taux — c'est l'inverse : les flux fixes sont actualisés plus (ou moins) fortement.",
        en: "Thinking the price follows the same direction as rates — it's the opposite: fixed cash flows get discounted more (or less) heavily.",
      },
    };
  },
};

const priceChangeTemplate: QuestionTemplate = {
  id: "m03-duration-variation-prix",
  conceptId: "m03-duration",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const dMod = randomFloat(rng, 2, 9, 1);
    const deltaBps = randomInt(rng, 1, 8) * 25;
    const goesUp = pick(rng, [true, false]);
    const deltaY = (goesUp ? 1 : -1) * (deltaBps / 10000);
    const pctChange = Math.round(-dMod * deltaY * 10000) / 100; // in %

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation a une duration modifiée D_mod = ${fmt(dMod, "fr", 1)}. Le rendement de marché ${goesUp ? "augmente" : "baisse"} de ${deltaBps} points de base. Quelle est la variation approximative du prix, en % (avec son signe) ?`,
        en: `A bond has modified duration D_mod = ${fmt(dMod, "en", 1)}. The market yield ${goesUp ? "rises" : "falls"} by ${deltaBps} basis points. What is the approximate price change, in % (with its sign)?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0,05",
      hint: {
        fr: "ΔP/P ≈ −D_mod × Δy, avec Δy en décimal (ex. 25 pb = 0,0025).",
        en: "ΔP/P ≈ −D_mod × Δy, with Δy as a decimal (e.g. 25 bp = 0.0025).",
      },
      numeric: { value: pctChange, tolerance: 0.05 },
      calculation: {
        fr: `Δy = ${goesUp ? "+" : "-"}${deltaBps}pb = ${goesUp ? "+" : "-"}${fmt(deltaBps / 10000, "fr", 4)}. ΔP/P ≈ −${fmt(dMod, "fr", 1)} × (${goesUp ? "+" : "-"}${fmt(deltaBps / 10000, "fr", 4)}) = ${fmt(pctChange, "fr", 2)}%.`,
        en: `Δy = ${goesUp ? "+" : "-"}${deltaBps}bp = ${goesUp ? "+" : "-"}${fmt(deltaBps / 10000, "en", 4)}. ΔP/P ≈ −${fmt(dMod, "en", 1)} × (${goesUp ? "+" : "-"}${fmt(deltaBps / 10000, "en", 4)}) = ${fmt(pctChange, "en", 2)}%.`,
      },
      explanation: {
        fr: "C'est une approximation linéaire au premier ordre : suffisante pour de petites variations de taux.",
        en: "This is a first-order linear approximation: accurate enough for small rate changes.",
      },
      commonMistake: {
        fr: "Oublier le signe moins, ou utiliser Δy en points de base au lieu de le convertir en décimal.",
        en: "Forgetting the minus sign, or using Δy in basis points instead of converting it to a decimal.",
      },
    };
  },
};

const magnitudeTemplate: QuestionTemplate = {
  id: "m03-duration-magnitude",
  conceptId: "m03-duration",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const years = randomInt(rng, 5, 15);
    const higherCoupon = pick(rng, [true, false]);
    const statement = higherCoupon
      ? { fr: "plus grande", en: "larger" }
      : { fr: "plus petite", en: "smaller" };
    // Higher coupon => lower duration. So "higher coupon => larger duration" is FALSE.
    const correctId = higherCoupon ? "false" : "true";

    return {
      prompt: {
        fr: `Pour deux obligations similaires de maturité ${years} ans, celle qui verse le coupon le plus élevé a une duration ${statement.fr} que celle au coupon plus faible.`,
        en: `For two similar bonds with a ${years}-year maturity, the one paying the higher coupon has a ${statement.en} duration than the one with the lower coupon.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: {
        fr: "Un coupon élevé rapproche-t-il ou éloigne-t-il le moment moyen où vous récupérez votre argent ?",
        en: "Does a high coupon bring the average time you get your money back closer, or push it further away?",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: "Un coupon plus élevé rapproche le retour moyen de l'argent (plus de flux tôt), donc réduit la duration — la relation est inverse : coupon plus élevé = duration plus faible.",
        en: "A higher coupon brings the average money-back time closer (more early cash flows), so it reduces duration — the relationship is inverse: higher coupon = lower duration.",
      },
      commonMistake: {
        fr: "Confondre coupon et maturité : c'est la maturité qui augmente toujours la duration, alors que le coupon la diminue.",
        en: "Confusing coupon and maturity: maturity always increases duration, while the coupon decreases it.",
      },
    };
  },
};

const zeroCouponTemplate: QuestionTemplate = {
  id: "m03-duration-zero-coupon",
  conceptId: "m03-duration",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Toutes choses égales par ailleurs, la duration de Macaulay d'une obligation zéro-coupon est égale à sa ______.",
      en: "All else equal, the Macaulay duration of a zero-coupon bond is equal to its ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["maturite", "maturité", "echeance", "échéance", "maturity"],
    hint: {
      fr: "Il n'y a qu'un seul flux, à une seule date.",
      en: "There is only one cash flow, on a single date.",
    },
    explanation: {
      fr: "Sans coupon intermédiaire, tout l'argent revient à l'échéance : la duration de Macaulay (moyenne pondérée des dates de flux) est donc exactement égale à la maturité.",
      en: "With no intermediate coupon, all the money comes back at maturity: Macaulay duration (weighted average of cash flow dates) is therefore exactly equal to maturity.",
    },
    commonMistake: {
      fr: "Croire que la duration d'un zéro-coupon est nulle ou différente de sa maturité — c'est le seul cas où duration = maturité exactement.",
      en: "Believing a zero-coupon's duration is zero or different from its maturity — this is the only case where duration = maturity exactly.",
    },
  }),
};

export const templates: QuestionTemplate[] = [directionTemplate, priceChangeTemplate, magnitudeTemplate, zeroCouponTemplate];
