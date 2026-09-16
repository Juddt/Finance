import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const ASSETS = ["EUR/USD", "GBP/USD", "or", "pétrole"] as const;
const ASSETS_EN = { "EUR/USD": "EUR/USD", "GBP/USD": "GBP/USD", or: "gold", "pétrole": "oil" } as const;

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const inceptionValueTemplate: QuestionTemplate = {
  id: "m02-forward-value-inception",
  conceptId: "m02-forward-contract-value",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const asset = pick(rng, ASSETS);
    return {
      prompt: {
        fr: `À la conclusion, hors frais, quelle est normalement la valeur d'un forward sur ${asset} conclu au prix à terme de marché ?`,
        en: `At inception, ignoring fees, what is normally the value of a forward on ${ASSETS_EN[asset]} entered into at the market forward price?`,
      },
      choices: buildChoices([
        { id: "zero", label: { fr: "Zéro", en: "Zero" } },
        { id: "spot", label: { fr: "Le prix spot du sous-jacent", en: "The underlying spot price" } },
        { id: "delivery", label: { fr: "Le prix de livraison", en: "The delivery price" } },
      ]),
      correctChoiceIds: ["zero"],
      explanation: {
        fr: "La valeur initiale est nulle pour un forward conclu au prix à terme de marché, hors frais. Le prix de livraison et le prix spot sont d'autres grandeurs.",
        en: "The initial value is zero for a forward entered into at the market forward price, ignoring fees. The delivery price and the spot price are different quantities.",
      },
      commonMistake: {
        fr: "Confondre la valeur du contrat (nulle à la conclusion) avec le prix de livraison (non nul, fixé par le prix forward du jour).",
        en: "Confusing the contract's value (zero at inception) with the delivery price (non-zero, set by that day's forward price).",
      },
    };
  },
};

const deliveryPriceFixedTemplate: QuestionTemplate = {
  id: "m02-forward-delivery-price-fixed",
  conceptId: "m02-forward-contract-value",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const asset = pick(rng, ASSETS);
    return {
      prompt: {
        fr: `Le prix de livraison K d'un forward sur ${asset} déjà conclu évolue avec le prix forward de marché jusqu'à l'échéance.`,
        en: `The delivery price K of an existing forward on ${ASSETS_EN[asset]} moves together with the market forward price until maturity.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: {
        fr: "Distinguez ce qui est figé à la conclusion de ce qui continue à bouger sur le marché.",
        en: "Distinguish what is frozen at inception from what keeps moving in the market.",
      },
      correctChoiceIds: ["false"],
      explanation: {
        fr: "Faux : K est fixé une fois pour toutes à la conclusion du contrat. C'est le prix forward de marché F(t) qui continue d'évoluer, pas K.",
        en: "False: K is fixed once and for all at inception. It is the market forward price F(t) that keeps moving, not K.",
      },
      commonMistake: {
        fr: "Penser que « prix forward » désigne toujours la même grandeur : il faut distinguer le prix forward de marché (mouvant) du prix de livraison contractuel (figé).",
        en: "Assuming \"forward price\" always refers to the same quantity: the market forward price (moving) must be distinguished from the contractual delivery price (frozen).",
      },
    };
  },
};

function computeValue(fT: number, k: number, r: number, tMinusT: number, long: boolean): number {
  const gap = long ? fT - k : k - fT;
  return Math.round(gap * Math.exp(-r * tMinusT) * 100000) / 100000;
}

const computeValueTemplate: QuestionTemplate = {
  id: "m02-forward-compute-value",
  conceptId: "m02-forward-contract-value",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const k = randomFloat(rng, 0.85, 1.15, 4);
    const fT = randomFloat(rng, 0.85, 1.15, 4);
    const r = randomFloat(rng, 0.005, 0.045, 4);
    const months = randomInt(rng, 1, 6);
    const tMinusT = months / 12;
    const long = pick(rng, [true, false]);
    const value = computeValue(fT, k, r, tMinusT, long);

    return {
      isScenario: true,
      prompt: {
        fr: `Une position ${long ? "longue" : "courte"} a un prix de livraison K = ${fmt(k, "fr")}. Le prix forward de marché actuel pour la même échéance est F_t = ${fmt(fT, "fr")}, le taux sans risque est r = ${fmt(r * 100, "fr", 2)}% (composition continue) et il reste T−t = ${months}/12 an. Calculez V_t (5 décimales).`,
        en: `A ${long ? "long" : "short"} position has delivery price K = ${fmt(k, "en")}. The current market forward price for the same maturity is F_t = ${fmt(fT, "en")}, the risk-free rate is r = ${fmt(r * 100, "en", 2)}% (continuous compounding) and T−t = ${months}/12 year remains. Compute V_t (5 decimals).`,
      },
      numericUnit: { fr: "par unité de sous-jacent", en: "per unit of underlying" },
      numericTolerance: "± 0,0005",
      hint: {
        fr: long ? "V_t = (F_t − K) e^(−r(T−t))." : "V_t = (K − F_t) e^(−r(T−t)).",
        en: long ? "V_t = (F_t − K) e^(−r(T−t))." : "V_t = (K − F_t) e^(−r(T−t)).",
      },
      numeric: { value, tolerance: 0.0005 },
      calculation: {
        fr: `V_t = (${long ? `${fmt(fT, "fr")} − ${fmt(k, "fr")}` : `${fmt(k, "fr")} − ${fmt(fT, "fr")}`}) × e^(−${fmt(r, "fr")} × ${months}/12) ≈ ${fmt(value, "fr", 5)}.`,
        en: `V_t = (${long ? `${fmt(fT, "en")} − ${fmt(k, "en")}` : `${fmt(k, "en")} − ${fmt(fT, "en")}`}) × e^(−${fmt(r, "en")} × ${months}/12) ≈ ${fmt(value, "en", 5)}.`,
      },
      explanation: {
        fr: "On actualise l'écart entre le prix forward de marché actuel et le prix de livraison figé, au taux sans risque, sur la durée restante.",
        en: "The gap between the current market forward price and the frozen delivery price is discounted at the risk-free rate, over the remaining time.",
      },
      commonMistake: {
        fr: long
          ? "Inverser le signe de l'écart (K − F_t au lieu de F_t − K) pour une position longue."
          : "Oublier d'inverser le signe de l'écart pour une position courte : c'est (K − F_t), pas (F_t − K).",
        en: long
          ? "Flipping the sign of the gap (K − F_t instead of F_t − K) for a long position."
          : "Forgetting to flip the sign of the gap for a short position: it's (K − F_t), not (F_t − K).",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m02-forward-value-vocab",
  conceptId: "m02-forward-contract-value",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "La valeur d'un forward à sa conclusion est nulle uniquement si le prix de livraison K a été fixé égal au prix forward de ______.",
      en: "A forward's value at inception is zero only if the delivery price K was set equal to the ______ forward price.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["marche", "marché", "market"],
    hint: {
      fr: "C'est la grandeur qui bouge en continu, par opposition à K qui est figé.",
      en: "It's the quantity that keeps moving, as opposed to K which is frozen.",
    },
    explanation: {
      fr: "V_0 = 0 seulement quand K = F(0), le prix forward de marché du jour de la conclusion.",
      en: "V_0 = 0 only when K = F(0), the market forward price on the day the contract is entered into.",
    },
    commonMistake: {
      fr: "Répondre « spot » : c'est le prix forward, pas le prix spot, qui doit égaler K à la conclusion.",
      en: "Answering \"spot\": it's the forward price, not the spot price, that must equal K at inception.",
    },
  }),
};

export const templates: QuestionTemplate[] = [
  inceptionValueTemplate,
  deliveryPriceFixedTemplate,
  computeValueTemplate,
  vocabTemplate,
];
