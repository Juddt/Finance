import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const zeroCouponPriceTemplate: QuestionTemplate = {
  id: "m03-def-oblig-zero-coupon-prix",
  conceptId: "m03-definition-obligations",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 20) * 100;
    const rPct = randomInt(rng, 1, 8);
    const T = randomInt(rng, 1, 10);
    const r = rPct / 100;
    const P = Math.round((F / Math.pow(1 + r, T)) * 100) / 100;

    return {
      prompt: {
        fr: `Une obligation zéro-coupon a une valeur nominale F = ${F}, une maturité T = ${T} an(s), et le taux exigé est r = ${rPct}%. Quel est son prix aujourd'hui ?`,
        en: `A zero-coupon bond has face value F = ${F}, maturity T = ${T} year(s), and the required rate is r = ${rPct}%. What is its price today?`,
      },
      numericUnit: { fr: "même devise que F", en: "same currency as F" },
      numericTolerance: "± 0.5",
      hint: { fr: "P = F / (1+r)^T.", en: "P = F / (1+r)^T." },
      numeric: { value: P, tolerance: 0.5 },
      calculation: {
        fr: `P = ${F} / (1,${rPct.toString().padStart(2, "0")})^${T} ≈ ${fmt(P, "fr")}.`,
        en: `P = ${F} / (1.${rPct.toString().padStart(2, "0")})^${T} ≈ ${fmt(P, "en")}.`,
      },
      explanation: {
        fr: "Le prix d'un zéro-coupon est simplement le nominal actualisé sur toute la période, sans aucun flux intermédiaire.",
        en: "A zero-coupon bond's price is simply the face value discounted over the whole period, with no intermediate flow.",
      },
      commonMistake: {
        fr: "Oublier d'élever (1+r) à la puissance T, ou ajouter par erreur un coupon qui n'existe pas pour ce type d'obligation.",
        en: "Forgetting to raise (1+r) to the power T, or mistakenly adding a coupon that does not exist for this bond type.",
      },
    };
  },
};

const priceVsRateTemplate: QuestionTemplate = {
  id: "m03-def-oblig-prix-vs-taux",
  conceptId: "m03-definition-obligations",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const higherRate = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Deux obligations zéro-coupon identiques sauf sur le taux exigé : l'une a un taux ${higherRate ? "plus élevé" : "plus bas"} que l'autre. Laquelle a le prix le plus ${higherRate ? "bas" : "élevé"} ?`,
        en: `Two identical zero-coupon bonds except for the required rate: one has a ${higherRate ? "higher" : "lower"} rate than the other. Which one has the ${higherRate ? "lower" : "higher"} price?`,
      },
      choices: buildChoices([
        { id: "high-rate", label: { fr: "Celle avec le taux le plus élevé", en: "The one with the higher rate" } },
        { id: "low-rate", label: { fr: "Celle avec le taux le plus bas", en: "The one with the lower rate" } },
      ]),
      hint: { fr: "P = F / (1+r)^T : que se passe-t-il au dénominateur quand r augmente ?", en: "P = F / (1+r)^T: what happens to the denominator as r rises?" },
      correctChoiceIds: ["high-rate"],
      explanation: {
        fr: "Un taux exigé plus élevé augmente le dénominateur (1+r)^T, donc diminue le prix P = F/(1+r)^T.",
        en: "A higher required rate increases the denominator (1+r)^T, so it lowers the price P = F/(1+r)^T.",
      },
      commonMistake: {
        fr: "Penser qu'un taux plus élevé rend l'obligation plus chère, en confondant le taux de coupon (qui verse plus) et le taux d'actualisation (qui déprécie le prix).",
        en: "Thinking a higher rate makes the bond more expensive, confusing the coupon rate (which pays more) with the discount rate (which lowers the price).",
      },
    };
  },
};

const zeroCouponTrueFalseTemplate: QuestionTemplate = {
  id: "m03-def-oblig-zero-coupon-vf",
  conceptId: "m03-definition-obligations",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Une obligation zéro-coupon ne rapporte aucun rendement à son détenteur, puisqu'elle ne verse aucun coupon avant l'échéance.",
      en: "A zero-coupon bond earns its holder no return at all, since it pays no coupon before maturity.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : toute la rémunération est concentrée dans la décote entre le prix d'achat et la valeur nominale remboursée à l'échéance.",
      en: "False: the entire return is concentrated in the discount between the purchase price and the face value repaid at maturity.",
    },
    commonMistake: {
      fr: "Associer \"pas de coupon versé\" à \"pas de rendement du tout\".",
      en: "Equating \"no coupon paid\" with \"no return at all\".",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m03-def-oblig-vocab",
  conceptId: "m03-definition-obligations",
  kind: "fill_blank",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const face = randomInt(rng, 1, 5) * 500;
    return {
      prompt: {
        fr: `Le montant remboursé à l'échéance d'une obligation, servant aussi de base au calcul des coupons, s'appelle la valeur ______ (ex. ${fmt(face, "fr", 0)} EUR).`,
        en: `The amount repaid at a bond's maturity, also used as the base to compute coupons, is called the ______ value (e.g. ${fmt(face, "en", 0)} EUR).`,
      },
      fillBlankPlaceholder: { fr: "un mot", en: "one word" },
      acceptedAnswers: ["nominale", "nominal", "face"],
      hint: { fr: "Aussi appelée « valeur au pair ».", en: "Also called \"par value\"." },
      explanation: {
        fr: "La valeur nominale (ou valeur au pair) est le montant de référence de l'obligation, remboursé à l'échéance.",
        en: "The face value (or par value) is the bond's reference amount, repaid at maturity.",
      },
      commonMistake: {
        fr: "Confondre valeur nominale et prix de marché, qui lui varie constamment.",
        en: "Confusing face value with market price, which constantly fluctuates.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [zeroCouponPriceTemplate, priceVsRateTemplate, zeroCouponTrueFalseTemplate, vocabTemplate];
