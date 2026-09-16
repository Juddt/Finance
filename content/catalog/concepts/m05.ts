import type { ConceptDef } from "../types";

export const m05: ConceptDef[] = [
  {
    id: "m05-call-put",
    chapterId: "m05",
    sourceRef: "M05-1",
    level: "essential",
    estimatedMinutes: 6,
    status: "upcoming",
    title: { fr: "Call et put : propriétés et payoff", en: "Call & put: properties and payoff" },
    objective: {
      fr: "Décrire droits/obligations, positions longues/courtes, payoff et profit net de prime d'un call et d'un put.",
      en: "Describe rights/obligations, long/short positions, payoff and profit net of premium for a call and a put.",
    },
  },
  {
    id: "m05-itm-atm-otm",
    chapterId: "m05",
    sourceRef: "M05-2",
    level: "essential",
    estimatedMinutes: 5,
    status: "upcoming",
    title: { fr: "Européennes/américaines, ITM/ATM/OTM", en: "European/American, ITM/ATM/OTM" },
    objective: {
      fr: "Distinguer options européennes et américaines, ITM/ATM/OTM, valeur intrinsèque et valeur temps.",
      en: "Distinguish European vs American options, ITM/ATM/OTM, intrinsic value and time value.",
    },
  },
  {
    id: "m05-parite-call-put",
    chapterId: "m05",
    sourceRef: "M05-3",
    level: "essential",
    estimatedMinutes: 7,
    status: "upcoming",
    title: { fr: "Parité call-put", en: "Put-call parity" },
    objective: {
      fr: "Démontrer la parité call-put, ses hypothèses et son ajustement en présence de dividendes.",
      en: "Derive put-call parity, its assumptions and its adjustment in the presence of dividends.",
    },
  },
  {
    id: "m05-strategies-classiques",
    chapterId: "m05",
    sourceRef: "M05-4",
    level: "essential",
    estimatedMinutes: 8,
    status: "upcoming",
    title: { fr: "Stratégies optionnelles classiques", en: "Classic option strategies" },
    objective: {
      fr: "Comparer call spread, put spread, straddle, strangle, butterfly, collar et risk reversal : fonctionnement, usage, risques.",
      en: "Compare call spread, put spread, straddle, strangle, butterfly, collar and risk reversal: mechanics, use and risks.",
    },
  },
];
