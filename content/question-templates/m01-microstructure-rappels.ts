import { pick, randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const spreadMidNumericTemplate: QuestionTemplate = {
  id: "m01-micro-spread-mid",
  conceptId: "m01-microstructure-rappels",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const bid = randomFloat(rng, 20, 300, 2);
    const spreadRaw = randomFloat(rng, 0.02, 2, 2);
    const ask = Math.round((bid + spreadRaw) * 100) / 100;
    const askQuestion = pick(rng, ["spread", "mid"] as const);
    const spread = Math.round((ask - bid) * 100) / 100;
    const mid = Math.round(((ask + bid) / 2) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Bid = ${fmt(bid, "fr")}, Ask = ${fmt(ask, "fr")}. Quel est le ${askQuestion === "spread" ? "spread" : "prix milieu (mid)"} ?`,
        en: `Bid = ${fmt(bid, "en")}, Ask = ${fmt(ask, "en")}. What is the ${askQuestion === "spread" ? "spread" : "mid price"}?`,
      },
      numericUnit: { fr: "même devise que le prix", en: "same currency as the price" },
      numericTolerance: "± 0.02",
      hint: { fr: askQuestion === "spread" ? "Spread = Ask − Bid." : "Mid = (Ask + Bid) / 2.", en: askQuestion === "spread" ? "Spread = Ask − Bid." : "Mid = (Ask + Bid) / 2." },
      numeric: { value: askQuestion === "spread" ? spread : mid, tolerance: 0.02 },
      calculation: {
        fr: askQuestion === "spread" ? `Spread = ${fmt(ask, "fr")} − ${fmt(bid, "fr")} = ${fmt(spread, "fr")}.` : `Mid = (${fmt(ask, "fr")} + ${fmt(bid, "fr")}) / 2 = ${fmt(mid, "fr")}.`,
        en: askQuestion === "spread" ? `Spread = ${fmt(ask, "en")} − ${fmt(bid, "en")} = ${fmt(spread, "en")}.` : `Mid = (${fmt(ask, "en")} + ${fmt(bid, "en")}) / 2 = ${fmt(mid, "en")}.`,
      },
      explanation: {
        fr: "Le spread mesure le coût implicite de l'immédiateté ; le mid sert de référence de valorisation, mais n'est pas un prix auquel on peut réellement trader.",
        en: "The spread measures the implicit cost of immediacy; the mid serves as a valuation reference, but is not a price you can actually trade at.",
      },
      commonMistake: {
        fr: "Confondre le prix mid avec un prix réellement exécutable — on achète toujours à l'ask, on vend toujours au bid.",
        en: "Confusing the mid price with an actually executable price — you always buy at the ask, always sell at the bid.",
      },
    };
  },
};

const executionPriceTemplate: QuestionTemplate = {
  id: "m01-micro-prix-execution",
  conceptId: "m01-microstructure-rappels",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const urgent = pick(rng, ["buy", "sell"] as const);
    return {
      prompt: {
        fr: `Un investisseur veut ${urgent === "buy" ? "acheter" : "vendre"} immédiatement, sans attendre. À quel prix du carnet d'ordres sera-t-il exécuté ?`,
        en: `An investor wants to ${urgent === "buy" ? "buy" : "sell"} immediately, without waiting. At which order book price will they be executed?`,
      },
      choices: buildChoices([
        { id: "bid", label: { fr: "Au bid", en: "At the bid" } },
        { id: "ask", label: { fr: "À l'ask", en: "At the ask" } },
        { id: "mid", label: { fr: "Au prix mid", en: "At the mid price" } },
      ]),
      hint: { fr: "Acheter immédiatement prend le prix le plus haut affiché ; vendre immédiatement prend le plus bas.", en: "Buying immediately takes the highest posted price; selling immediately takes the lowest." },
      correctChoiceIds: [urgent === "buy" ? "ask" : "bid"],
      explanation:
        urgent === "buy"
          ? { fr: "Un acheteur pressé doit accepter le meilleur prix de vente affiché, l'ask.", en: "An urgent buyer must accept the best posted sell price, the ask." }
          : { fr: "Un vendeur pressé doit accepter le meilleur prix d'achat affiché, le bid.", en: "An urgent seller must accept the best posted buy price, the bid." },
      commonMistake: {
        fr: "Croire qu'on peut trader immédiatement au prix mid, qui n'est qu'une moyenne de référence.",
        en: "Believing one can trade immediately at the mid price, which is only a reference average.",
      },
    };
  },
};

const widerSpreadTemplate: QuestionTemplate = {
  id: "m01-micro-spread-incertitude",
  conceptId: "m01-microstructure-rappels",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le spread bid-ask d'un titre a tendance à s'élargir en période de forte incertitude de marché.",
      en: "A security's bid-ask spread tends to widen during periods of high market uncertainty.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : les teneurs de marché exigent une compensation plus élevée pour le risque de détenir une position dans un environnement incertain, ce qui élargit le spread qu'ils affichent.",
      en: "True: market makers demand higher compensation for the risk of holding a position in an uncertain environment, which widens the spread they post.",
    },
    commonMistake: {
      fr: "Croire que le spread reste constant quelles que soient les conditions de marché.",
      en: "Believing the spread stays constant regardless of market conditions.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-micro-vocab",
  conceptId: "m01-microstructure-rappels",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un intervenant qui affiche en permanence des prix d'achat et de vente pour fournir de la liquidité, rémunéré par le spread, s'appelle un teneur de ______.",
      en: "A participant who continuously posts buy and sell prices to provide liquidity, compensated by the spread, is called a ______ maker.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["marche", "marché", "market"],
    hint: { fr: "Il « tient » le marché en continu.", en: "They continuously \"make\" the market." },
    explanation: {
      fr: "Le teneur de marché (market maker) fournit de la liquidité en continu, rémunéré par l'écart entre son prix d'achat et son prix de vente.",
      en: "The market maker continuously provides liquidity, compensated by the gap between their buy and sell prices.",
    },
    commonMistake: {
      fr: "Confondre le teneur de marché avec un simple investisseur qui passe des ordres occasionnels.",
      en: "Confusing the market maker with a simple investor placing occasional orders.",
    },
  }),
};

export const templates: QuestionTemplate[] = [spreadMidNumericTemplate, executionPriceTemplate, widerSpreadTemplate, vocabTemplate];
