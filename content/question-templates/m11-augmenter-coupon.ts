import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const leversIdentificationTemplate: QuestionTemplate = {
  id: "m11-coupon-identifier-levier",
  conceptId: "m11-augmenter-coupon",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const lever = pick(rng, ["barriere", "worst-of"] as const);
    return {
      prompt: lever === "barriere"
        ? { fr: "Un émetteur propose un coupon plus élevé en rapprochant la barrière de capital du spot, de 50% à 70%. Quel est l'effet direct sur le risque de l'investisseur ?", en: "An issuer offers a higher coupon by moving the capital barrier closer to spot, from 50% to 70%. What is the direct effect on the investor's risk?" }
        : { fr: "Un émetteur propose un coupon plus élevé en utilisant un panier worst-of de deux actions faiblement corrélées au lieu d'une seule. Quel est l'effet direct sur le risque de l'investisseur ?", en: "An issuer offers a higher coupon by using a worst-of basket of two weakly correlated stocks instead of one. What is the direct effect on the investor's risk?" },
      choices: buildChoices([
        { id: "more-risk", label: { fr: "Le risque de perte en capital augmente", en: "Capital loss risk increases" } },
        { id: "less-risk", label: { fr: "Le risque de perte en capital diminue", en: "Capital loss risk decreases" } },
      ]),
      hint: { fr: "Un coupon plus élevé n'est jamais gratuit : il compense toujours un risque plus grand.", en: "A higher coupon is never free: it always compensates for greater risk." },
      correctChoiceIds: ["more-risk"],
      explanation: lever === "barriere"
        ? { fr: "Rapprocher la barrière de capital du spot rend le put down-and-in implicite plus cher à vendre (plus facile à activer, puisqu'un plus petit mouvement suffit à la franchir), ce qui finance le coupon plus élevé — mais augmente directement le risque de perte en capital. À l'inverse, une barrière plus profonde (plus loin du spot) offre plus de protection et finance un coupon plus faible.", en: "Moving the capital barrier closer to spot makes the implicit down-and-in put more expensive to sell (easier to trigger, since a smaller move suffices to breach it), which funds the higher coupon — but directly increases capital loss risk. Conversely, a deeper barrier (further from spot) offers more protection and funds a lower coupon." }
        : { fr: "Un panier worst-of augmente la probabilité qu'au moins un actif franchisse la barrière (dispersion, M09-1), rendant l'option vendue plus chère — ce qui finance le coupon plus élevé, au prix d'un risque accru.", en: "A worst-of basket increases the probability that at least one asset breaches the barrier (dispersion, M09-1), making the sold option more expensive — which funds the higher coupon, at the cost of increased risk." },
      commonMistake: {
        fr: "Croire qu'un levier augmentant le coupon peut être neutre en risque pour l'investisseur.",
        en: "Believing a coupon-increasing lever can be risk-neutral for the investor.",
      },
    };
  },
};

const comparisonTemplate: QuestionTemplate = {
  id: "m11-coupon-comparaison-trompeuse",
  conceptId: "m11-augmenter-coupon",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Deux autocalls sur la même action avec des coupons différents (6% et 10%) peuvent être comparés de façon fiable en ne regardant que le coupon affiché.",
      en: "Two autocalls on the same stock with different coupons (6% and 10%) can be reliably compared by looking only at the displayed coupon.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : il faut aussi comparer les barrières, la maturité et le nombre de sous-jacents. Un coupon plus élevé isolément ne dit rien sur la qualité du produit sans ces éléments de contexte.",
      en: "False: barriers, maturity and the number of underlyings must also be compared. A higher coupon in isolation says nothing about the product's quality without this context.",
    },
    commonMistake: {
      fr: "Se fier uniquement au coupon affiché pour juger qu'un produit est \"meilleur\" qu'un autre.",
      en: "Relying solely on the displayed coupon to judge one product as \"better\" than another.",
    },
  }),
};

const maturityLeverTemplate: QuestionTemplate = {
  id: "m11-coupon-levier-maturite",
  conceptId: "m11-augmenter-coupon",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pourquoi allonger la maturité d'un autocall permet-il généralement d'offrir un coupon plus élevé ?",
      en: "Why does lengthening an autocall's maturity generally allow offering a higher coupon?",
    },
    choices: buildChoices([
      { id: "more-time", label: { fr: "Plus de temps laisse plus de chances au put down-and-in implicite de s'activer", en: "More time gives the implicit down-and-in put more chances to activate" } },
      { id: "less-volatility", label: { fr: "Une maturité plus longue réduit la volatilité effective du sous-jacent", en: "A longer maturity reduces the underlying's effective volatility" } },
    ]),
    hint: { fr: "Un put down-and-in vaut plus cher quand il a plus de temps pour être touché.", en: "A down-and-in put is worth more when it has more time to be touched." },
    correctChoiceIds: ["more-time"],
    explanation: {
      fr: "Une maturité plus longue laisse plus de temps au sous-jacent pour toucher la barrière de capital, rendant le put down-and-in implicite plus cher à vendre — ce qui finance un coupon plus élevé, au prix d'un risque étalé sur une période plus longue.",
      en: "A longer maturity gives the underlying more time to touch the capital barrier, making the implicit down-and-in put more expensive to sell — which funds a higher coupon, at the cost of risk spread over a longer period.",
    },
    commonMistake: {
      fr: "Croire qu'une maturité plus longue réduit le risque simplement parce que le sous-jacent a plus de temps pour se redresser.",
      en: "Believing a longer maturity reduces risk simply because the underlying has more time to recover.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m11-coupon-vocab",
  conceptId: "m11-augmenter-coupon",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une structure basée sur la performance du plus mauvais actif d'un panier, qui permet d'augmenter le coupon en échange de plus de risque, est appelée ______.",
      en: "A structure based on the worst-performing asset in a basket, which allows a higher coupon in exchange for more risk, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un terme", en: "one term" },
    acceptedAnswers: ["worst-of", "worst of"],
    hint: { fr: "Un terme anglais évoquant le pire actif du panier.", en: "An English term evoking the basket's worst asset." },
    explanation: {
      fr: "Une structure worst-of se base sur le pire actif du panier, ce qui augmente le risque (via la dispersion, M09-1) et permet donc d'offrir un coupon plus élevé.",
      en: "A worst-of structure is based on the basket's worst asset, which increases risk (via dispersion, M09-1) and so allows a higher coupon to be offered.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec un panier \"best-of\", qui a l'effet inverse (risque réduit, coupon plus faible).",
      en: "Confusing this term with a \"best-of\" basket, which has the opposite effect (reduced risk, lower coupon).",
    },
  }),
};

export const templates: QuestionTemplate[] = [leversIdentificationTemplate, comparisonTemplate, maturityLeverTemplate, vocabTemplate];
