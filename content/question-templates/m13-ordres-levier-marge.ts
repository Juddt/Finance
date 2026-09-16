import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const leveragePnlNumericTemplate: QuestionTemplate = {
  id: "m13-ordres-levier-pnl",
  conceptId: "m13-ordres-levier-marge",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const margin = randomInt(rng, 500, 5000);
    const leverage = randomInt(rng, 3, 20);
    const priceMovePct = randomInt(rng, -15, 15) / 100;
    const pnl = Math.round(margin * leverage * priceMovePct);

    return {
      isScenario: true,
      prompt: {
        fr: `Un trader dépose ${fmt(margin, "fr")} de marge sur une position à levier ${leverage}. Le sous-jacent évolue de ${fmt(priceMovePct * 100, "fr", 0)}%. Quel est le P&L de la position ?`,
        en: `A trader deposits ${fmt(margin, "en")} margin on a ${leverage}x leveraged position. The underlying moves by ${fmt(priceMovePct * 100, "en", 0)}%. What is the position's P&L?`,
      },
      numericUnit: { fr: "même devise que la marge", en: "same currency as the margin" },
      numericTolerance: "± 20",
      hint: { fr: "P&L = Marge × Levier × Mouvement de prix en %.", en: "P&L = Margin × Leverage × Price move %." },
      numeric: { value: pnl, tolerance: 20 },
      calculation: {
        fr: `P&L = ${fmt(margin, "fr")} × ${leverage} × ${fmt(priceMovePct * 100, "fr", 0)}% ≈ ${fmt(pnl, "fr")}.`,
        en: `P&L = ${fmt(margin, "en")} × ${leverage} × ${fmt(priceMovePct * 100, "en", 0)}% ≈ ${fmt(pnl, "en")}.`,
      },
      explanation: {
        fr: "Le P&L d'une position à effet de levier se calcule sur la valeur totale de la position (marge × levier), amplifiant proportionnellement le mouvement du sous-jacent.",
        en: "A leveraged position's P&L is computed on the position's total value (margin × leverage), proportionally amplifying the underlying's movement.",
      },
      commonMistake: {
        fr: "Calculer le P&L uniquement sur la marge déposée, sans tenir compte du levier appliqué.",
        en: "Computing P&L only on the deposited margin, without accounting for the applied leverage.",
      },
    };
  },
};

const orderTypeTemplate: QuestionTemplate = {
  id: "m13-ordres-type-tradeoff",
  conceptId: "m13-ordres-levier-marge",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Quel est le compromis d'un ordre à cours limité par rapport à un ordre au marché ?",
      en: "What is a limit order's trade-off compared to a market order?",
    },
    choices: buildChoices([
      { id: "price-vs-execution", label: { fr: "Prix garanti, mais exécution incertaine", en: "Guaranteed price, but uncertain execution" } },
      { id: "execution-vs-nothing", label: { fr: "Exécution garantie et prix garanti, sans aucun compromis", en: "Guaranteed execution and price, with no trade-off" } },
    ]),
    hint: { fr: "Un ordre limite ne s'exécute que si le prix demandé (ou meilleur) est atteint.", en: "A limit order only executes if the requested price (or better) is reached." },
    correctChoiceIds: ["price-vs-execution"],
    explanation: {
      fr: "Un ordre à cours limité garantit le prix d'exécution (ou meilleur), mais ne s'exécute que si ce prix est atteint sur le marché, contrairement à un ordre au marché qui garantit l'exécution immédiate mais pas le prix.",
      en: "A limit order guarantees the execution price (or better), but only executes if that price is reached in the market, unlike a market order which guarantees immediate execution but not the price.",
    },
    commonMistake: {
      fr: "Croire qu'un ordre limite garantit à la fois le prix ET l'exécution, sans aucun compromis.",
      en: "Believing a limit order guarantees both price AND execution, with no trade-off.",
    },
  }),
};

const marginCallTemplate: QuestionTemplate = {
  id: "m13-ordres-appel-marge",
  conceptId: "m13-ordres-levier-marge",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Plus le levier utilisé est élevé, plus la marge de sécurité avant un appel de marge est faible.",
      en: "The higher the leverage used, the smaller the safety margin before a margin call.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : un levier de 10 signifie qu'une baisse de seulement 10% de la position efface intégralement la marge déposée, déclenchant potentiellement un appel de marge ou une liquidation forcée.",
      en: "True: a leverage of 10 means a mere 10% position decline entirely wipes out the deposited margin, potentially triggering a margin call or forced liquidation.",
    },
    commonMistake: {
      fr: "Croire que le niveau de levier n'affecte pas la proximité d'un appel de marge.",
      en: "Believing the leverage level doesn't affect proximity to a margin call.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-ordres-vocab",
  conceptId: "m13-ordres-levier-marge",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un ordre qui se déclenche automatiquement quand un seuil de prix est franchi, souvent utilisé pour limiter une perte, s'appelle un ordre ______.",
      en: "An order that automatically triggers when a price threshold is crossed, often used to limit a loss, is called a ______ order.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["stop"],
    hint: { fr: "Comme dans « stop-loss ».", en: "As in \"stop-loss\"." },
    explanation: {
      fr: "Un ordre stop se déclenche automatiquement quand un seuil de prix est franchi, souvent utilisé pour limiter une perte (stop-loss) sans devoir surveiller le marché en permanence.",
      en: "A stop order automatically triggers once a price threshold is crossed, often used to limit a loss (stop-loss) without needing to constantly watch the market.",
    },
    commonMistake: {
      fr: "Confondre ce type d'ordre avec un ordre à cours limité, qui a un mécanisme de déclenchement différent.",
      en: "Confusing this order type with a limit order, which has a different triggering mechanism.",
    },
  }),
};

export const templates: QuestionTemplate[] = [leveragePnlNumericTemplate, orderTypeTemplate, marginCallTemplate, vocabTemplate];
