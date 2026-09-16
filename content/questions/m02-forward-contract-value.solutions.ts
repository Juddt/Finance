import type { QuestionSolution } from "@/lib/question-types";

/**
 * SERVEUR UNIQUEMENT. Ne jamais importer ce fichier depuis un composant client
 * ('use client') ni depuis app/[locale]/** : seules les route handlers
 * (app/api/**) et lib/store.ts doivent l'importer, pour que webpack ne
 * l'inclue jamais dans le bundle envoyé au navigateur.
 */
export const m02ForwardContractValueSolutions: QuestionSolution[] = [
  {
    questionId: "q-m02-forward-value-inception",
    kind: "mcq",
    correctChoiceIds: ["zero"],
    explanation: {
      fr: "La valeur initiale est nulle pour un forward conclu au prix à terme de marché, hors frais. Le prix de livraison et le prix spot sont d'autres grandeurs.",
      en: "The initial value is zero for a forward entered into at the market forward price, ignoring fees. The delivery price and the spot price are different quantities.",
    },
    commonMistake: {
      fr: "Confondre la valeur du contrat (nulle à la conclusion) avec le prix de livraison (non nul, fixé par le prix forward du jour).",
      en: "Confusing the contract's value (zero at inception) with the delivery price (non-zero, set by that day's forward price).",
    },
  },
  {
    questionId: "q-m02-delivery-price-fixed",
    kind: "true_false",
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : K est fixé une fois pour toutes à la conclusion du contrat. C'est le prix forward de marché F(t) qui continue d'évoluer, pas K.",
      en: "False: K is fixed once and for all at inception. It is the market forward price F(t) that keeps moving, not K.",
    },
    commonMistake: {
      fr: "Penser que « prix forward » désigne toujours la même grandeur : il faut distinguer le prix forward de marché (mouvant) du prix de livraison contractuel (figé).",
      en: "Assuming \"forward price\" always refers to the same quantity: the market forward price (moving) must be distinguished from the contractual delivery price (frozen).",
    },
  },
  {
    questionId: "q-m02-compute-forward-value",
    kind: "numeric",
    numeric: { value: 0.0199, tolerance: 0.0005 },
    calculation: {
      fr: "V_t = (1,1000 − 1,0800) × e^(−0,02 × 2/12) = 0,0200 × e^(−0,003333) ≈ 0,0200 × 0,996672 ≈ 0,019933, soit 0,0199 au 4ᵉ décimale.",
      en: "V_t = (1.1000 − 1.0800) × e^(−0.02 × 2/12) = 0.0200 × e^(−0.003333) ≈ 0.0200 × 0.996672 ≈ 0.019933, i.e. 0.0199 to 4 decimals.",
    },
    explanation: {
      fr: "On actualise l'écart entre le prix forward de marché actuel et le prix de livraison figé au taux sans risque, sur la durée restante jusqu'à l'échéance.",
      en: "The gap between the current market forward price and the frozen delivery price is discounted at the risk-free rate, over the remaining time to maturity.",
    },
    commonMistake: {
      fr: "Oublier d'actualiser (répondre 0,0200 brut) ou inverser le signe de l'écart pour une position longue.",
      en: "Forgetting to discount (answering the raw 0.0200) or flipping the sign of the gap for a long position.",
    },
  },
];
