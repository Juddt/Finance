import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const profitNumericTemplate: QuestionTemplate = {
  id: "m01-short-profit-calcul",
  conceptId: "m01-vente-decouvert",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const priceInitial = randomInt(rng, 30, 150);
    const priceFinal = priceInitial + randomInt(rng, -40, 40) || priceInitial - 5;
    const quantity = randomInt(rng, 100, 2000);
    const fees = randomInt(rng, 50, 800);
    const profit = (priceInitial - priceFinal) * quantity - fees;

    return {
      isScenario: true,
      prompt: {
        fr: `Un investisseur vend à découvert ${fmt(quantity, "fr")} actions à ${fmt(priceInitial, "fr")}, puis les rachète à ${fmt(priceFinal, "fr")} pour les restituer. Les frais d'emprunt cumulés sont de ${fmt(fees, "fr")}. Quel est le profit net (peut être négatif) ?`,
        en: `An investor shorts ${fmt(quantity, "en")} shares at ${fmt(priceInitial, "en")}, then buys them back at ${fmt(priceFinal, "en")} to return them. Cumulative borrow fees are ${fmt(fees, "en")}. What is the net profit (can be negative)?`,
      },
      numericUnit: { fr: "même devise que le prix", en: "same currency as the price" },
      numericTolerance: "± 5",
      hint: { fr: "Profit = (Prix vente − Prix rachat) × Quantité − Frais.", en: "Profit = (Sale price − Buy-back price) × Quantity − Fees." },
      numeric: { value: profit, tolerance: 5 },
      calculation: {
        fr: `Profit = (${fmt(priceInitial, "fr")}−${fmt(priceFinal, "fr")})×${fmt(quantity, "fr")} − ${fmt(fees, "fr")} = ${fmt(profit, "fr")}.`,
        en: `Profit = (${fmt(priceInitial, "en")}−${fmt(priceFinal, "en")})×${fmt(quantity, "en")} − ${fmt(fees, "en")} = ${fmt(profit, "en")}.`,
      },
      explanation: {
        fr: "Le profit d'une vente à découvert vient d'une baisse de prix ; les frais d'emprunt réduisent toujours ce profit, même si le pari est gagnant.",
        en: "A short sale's profit comes from a price decline; borrow fees always reduce that profit, even when the bet is correct.",
      },
      commonMistake: {
        fr: "Inverser prix de vente et prix de rachat dans la formule, ou oublier de soustraire les frais.",
        en: "Swapping sale and buy-back prices in the formula, or forgetting to subtract the fees.",
      },
    };
  },
};

const unlimitedLossTemplate: QuestionTemplate = {
  id: "m01-short-perte-illimitee",
  conceptId: "m01-vente-decouvert",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Comparez la perte maximale théorique d'une position longue (achat d'une action) à celle d'une position courte (vente à découvert de la même action).",
      en: "Compare the theoretical maximum loss of a long position (buying a stock) to that of a short position (short-selling the same stock).",
    },
    choices: buildChoices([
      { id: "short-unlimited", label: { fr: "La position longue a une perte plafonnée à sa mise ; la position courte a une perte théoriquement illimitée", en: "The long position's loss is capped at its stake; the short position's loss is theoretically unlimited" } },
      { id: "same", label: { fr: "Les deux ont une perte maximale identique, plafonnée à la mise initiale", en: "Both have the same maximum loss, capped at the initial stake" } },
    ]),
    hint: { fr: "Le prix d'une action peut-il monter sans limite connue ?", en: "Can a stock's price rise with no known ceiling?" },
    correctChoiceIds: ["short-unlimited"],
    explanation: {
      fr: "Une position longue perd au maximum sa mise initiale (le prix ne peut pas descendre sous zéro) ; une position courte doit racheter le titre à un prix qui peut monter sans limite connue, donc sa perte est théoriquement illimitée.",
      en: "A long position loses at most its initial stake (the price can't fall below zero); a short position must buy back the security at a price that can rise with no known ceiling, so its loss is theoretically unlimited.",
    },
    commonMistake: {
      fr: "Croire que l'asymétrie de risque entre position longue et courte n'existe pas, ou est négligeable.",
      en: "Believing the risk asymmetry between long and short positions doesn't exist, or is negligible.",
    },
  }),
};

const dividendOwedTemplate: QuestionTemplate = {
  id: "m01-short-dividende",
  conceptId: "m01-vente-decouvert",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Si l'action vendue à découvert verse un dividende pendant la période d'emprunt, le vendeur à découvert conserve ce dividende sans obligation envers le prêteur des titres.",
      en: "If the shorted stock pays a dividend during the borrow period, the short seller keeps that dividend with no obligation to the securities lender.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : tout dividende versé pendant la période d'emprunt est dû au prêteur des titres, pas gardé par le vendeur à découvert — c'est un coût supplémentaire de la stratégie.",
      en: "False: any dividend paid during the borrow period is owed to the securities lender, not kept by the short seller — an additional cost of the strategy.",
    },
    commonMistake: {
      fr: "Oublier cette obligation dans le calcul du coût réel d'une vente à découvert.",
      en: "Forgetting this obligation when computing a short sale's real cost.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-short-vocab",
  conceptId: "m01-vente-decouvert",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une hausse brutale du prix qui force de nombreux vendeurs à découvert à racheter en urgence, accélérant encore la hausse, s'appelle un short ______.",
      en: "A sharp price rise that forces many short sellers to urgently buy back, further accelerating the rise, is called a short ______.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["squeeze"],
    hint: { fr: "Une image de « compression ».", en: "An image of being \"squeezed\"." },
    explanation: {
      fr: "Un short squeeze auto-alimente la hausse : plus le prix monte, plus les vendeurs à découvert doivent racheter, ce qui pousse encore le prix à la hausse.",
      en: "A short squeeze is self-reinforcing: the more the price rises, the more short sellers must buy back, which pushes the price up further.",
    },
    commonMistake: {
      fr: "Confondre le short squeeze avec une simple hausse de prix normale sans ce mécanisme d'auto-renforcement.",
      en: "Confusing a short squeeze with a simple normal price rise lacking this self-reinforcing mechanism.",
    },
  }),
};

export const templates: QuestionTemplate[] = [profitNumericTemplate, unlimitedLossTemplate, dividendOwedTemplate, vocabTemplate];
