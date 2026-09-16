import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const settlementNumericTemplate: QuestionTemplate = {
  id: "m04-fra-reglement-calcul",
  conceptId: "m04-fra",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 2, 50) * 500_000;
    const rFraPct = randomInt(rng, 1, 6);
    const rRefPct = rFraPct + randomInt(rng, -3, 3) || rFraPct + 1;
    const days = randomInt(rng, 80, 190);
    const rFra = rFraPct / 100;
    const rRef = rRefPct / 100;
    const settlement = Math.round(((notional * (rRef - rFra) * (days / 360)) / (1 + rRef * (days / 360))) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un FRA de notionnel ${fmt(notional, "fr", 0)}, taux contractuel R_FRA = ${rFraPct}%, période de ${days} jours. À la date de fixing, le taux de référence est R_ref = ${rRefPct}%. Quel est le montant du règlement (positif si reçu par l'acheteur du FRA) ?`,
        en: `An FRA with notional ${fmt(notional, "en", 0)}, contract rate R_FRA = ${rFraPct}%, period of ${days} days. On the fixing date, the reference rate is R_ref = ${rRefPct}%. What is the settlement amount (positive if received by the FRA buyer)?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 20",
      hint: {
        fr: "Règlement = Notionnel × (R_ref−R_FRA) × (d/360) / (1 + R_ref × d/360).",
        en: "Settlement = Notional × (R_ref−R_FRA) × (d/360) / (1 + R_ref × d/360).",
      },
      numeric: { value: settlement, tolerance: 20 },
      calculation: {
        fr: `Écart = ${rRefPct}%−${rFraPct}% = ${(rRefPct - rFraPct).toFixed(2)}%. Numérateur = ${fmt(notional, "fr", 0)} × ${((rRef - rFra) * (days / 360)).toFixed(5)}. Diviseur = 1 + ${rRefPct}%×${days}/360 ≈ ${(1 + rRef * (days / 360)).toFixed(4)}. Règlement ≈ ${fmt(settlement, "fr")}.`,
        en: `Gap = ${rRefPct}%−${rFraPct}% = ${(rRefPct - rFraPct).toFixed(2)}%. Numerator = ${fmt(notional, "en", 0)} × ${((rRef - rFra) * (days / 360)).toFixed(5)}. Divisor = 1 + ${rRefPct}%×${days}/360 ≈ ${(1 + rRef * (days / 360)).toFixed(4)}. Settlement ≈ ${fmt(settlement, "en")}.`,
      },
      explanation: {
        fr: "Le règlement est actualisé car il est versé au début de la période couverte, pas à la fin comme le ferait un vrai prêt.",
        en: "The settlement is discounted because it is paid at the start of the covered period, not the end as an actual loan would.",
      },
      commonMistake: {
        fr: "Oublier d'actualiser (diviser par le dénominateur), ce qui surestime légèrement le montant réel.",
        en: "Forgetting to discount (divide by the denominator), which slightly overstates the actual amount.",
      },
    };
  },
};

const buyerBeneficiaryTemplate: QuestionTemplate = {
  id: "m04-fra-beneficiaire",
  conceptId: "m04-fra",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ratesUp = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Entre la conclusion du FRA et la date de fixing, les taux d'intérêt ${ratesUp ? "montent" : "baissent"} nettement au-dessus/en dessous du taux contractuel. Qui en bénéficie ?`,
        en: `Between the FRA's conclusion and the fixing date, interest rates ${ratesUp ? "rise" : "fall"} clearly above/below the contract rate. Who benefits?`,
      },
      choices: buildChoices([
        { id: "buyer", label: { fr: "L'acheteur du FRA (emprunteur fictif)", en: "The FRA buyer (fictitious borrower)" } },
        { id: "seller", label: { fr: "Le vendeur du FRA (prêteur fictif)", en: "The FRA seller (fictitious lender)" } },
      ]),
      hint: { fr: "L'acheteur se protège contre une hausse des taux.", en: "The buyer protects against a rate rise." },
      correctChoiceIds: [ratesUp ? "buyer" : "seller"],
      explanation: ratesUp
        ? { fr: "Si les taux montent, R_ref > R_FRA : l'acheteur, qui aurait dû emprunter plus cher, reçoit une compensation.", en: "If rates rise, R_ref > R_FRA: the buyer, who would have had to borrow at a higher rate, receives compensation." }
        : { fr: "Si les taux baissent, R_ref < R_FRA : le vendeur, qui aurait dû prêter moins cher, reçoit une compensation.", en: "If rates fall, R_ref < R_FRA: the seller, who would have had to lend at a lower rate, receives compensation." },
      commonMistake: {
        fr: "Inverser acheteur et vendeur, une confusion fréquente sur les FRA.",
        en: "Swapping buyer and seller, a frequent FRA confusion.",
      },
    };
  },
};

const noExchangeTemplate: QuestionTemplate = {
  id: "m04-fra-pas-echange-notionnel",
  conceptId: "m04-fra",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "À la conclusion ou au règlement d'un FRA, le notionnel est effectivement prêté par une partie à l'autre.",
      en: "At an FRA's conclusion or settlement, the notional is actually lent by one party to the other.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le notionnel ne sert qu'à calculer le règlement net, il n'est jamais prêté ni emprunté réellement.",
      en: "False: the notional only serves to compute the net settlement, it is never actually lent or borrowed.",
    },
    commonMistake: {
      fr: "Confondre le FRA avec un vrai prêt à terme.",
      en: "Confusing the FRA with an actual forward loan.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m04-fra-vocab",
  conceptId: "m04-fra",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un FRA \"3x6\" désigne une période de 3 mois débutant dans 3 mois. Le montant réglé se base sur la comparaison entre le taux contractuel et le taux de ______ observé à la date de fixing.",
      en: "A \"3x6\" FRA denotes a 3-month period starting in 3 months. The settled amount is based on comparing the contract rate to the ______ rate observed on the fixing date.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["reference", "référence"],
    hint: { fr: "Ex. EURIBOR ou SOFR.", en: "E.g. EURIBOR or SOFR." },
    explanation: {
      fr: "Le taux de référence (EURIBOR, SOFR...) observé à la date de fixing est comparé au taux contractuel R_FRA pour déterminer le règlement.",
      en: "The reference rate (EURIBOR, SOFR...) observed on the fixing date is compared to the contractual R_FRA to determine settlement.",
    },
    commonMistake: {
      fr: "Confondre le taux de référence (variable, observé) avec le taux contractuel (fixe, connu dès la conclusion).",
      en: "Confusing the reference rate (floating, observed) with the contract rate (fixed, known from inception).",
    },
  }),
};

export const templates: QuestionTemplate[] = [settlementNumericTemplate, buyerBeneficiaryTemplate, noExchangeTemplate, vocabTemplate];
