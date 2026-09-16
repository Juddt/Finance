import type { QuestionPublic } from "@/lib/question-types";

/**
 * Contenu public envoyé au navigateur : énoncés et options, jamais les solutions
 * (voir content/questions/m02-forward-contract-value.solutions.ts, importé
 * uniquement côté serveur).
 */
export const m02ForwardContractValueQuestions: QuestionPublic[] = [
  {
    id: "q-m02-forward-value-inception",
    conceptId: "m02-forward-contract-value",
    kind: "mcq",
    prompt: {
      fr: "À la conclusion, hors frais, quelle est normalement la valeur d'un forward conclu au prix à terme de marché ?",
      en: "At inception, ignoring fees, what is normally the value of a forward entered into at the market forward price?",
    },
    choices: [
      { id: "zero", label: { fr: "Zéro", en: "Zero" } },
      { id: "spot", label: { fr: "Le prix spot du sous-jacent", en: "The underlying spot price" } },
      { id: "delivery", label: { fr: "Le prix de livraison", en: "The delivery price" } },
    ],
  },
  {
    id: "q-m02-delivery-price-fixed",
    conceptId: "m02-forward-contract-value",
    kind: "true_false",
    prompt: {
      fr: "Le prix de livraison K d'un forward déjà conclu évolue avec le prix forward de marché jusqu'à l'échéance.",
      en: "The delivery price K of an existing forward moves together with the market forward price until maturity.",
    },
    choices: [
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ],
    hint: {
      fr: "Distinguez ce qui est figé à la conclusion de ce qui continue à bouger sur le marché.",
      en: "Distinguish what is frozen at inception from what keeps moving in the market.",
    },
  },
  {
    id: "q-m02-compute-forward-value",
    conceptId: "m02-forward-contract-value",
    kind: "numeric",
    prompt: {
      fr: "Une position longue a un prix de livraison K = 1,0800. Le prix forward de marché actuel pour la même échéance est F_t = 1,1000, le taux sans risque est r = 2 % (composition continue) et il reste T−t = 2/12 an. Calculez V_t (4 décimales).",
      en: "A long position has delivery price K = 1.0800. The current market forward price for the same maturity is F_t = 1.1000, the risk-free rate is r = 2% (continuous compounding) and T−t = 2/12 year remains. Compute V_t (4 decimals).",
    },
    numericUnit: { fr: "par unité de sous-jacent", en: "per unit of underlying" },
    numericTolerance: "± 0,0005",
    hint: {
      fr: "V_t = (F_t − K) e^(−r(T−t)).",
      en: "V_t = (F_t − K) e^(−r(T−t)).",
    },
  },
];
