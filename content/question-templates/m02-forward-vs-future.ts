import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const featureMatchTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-caracteristique",
  conceptId: "m02-forward-vs-future",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const feature = pick(
      rng,
      [
        { id: "standardization", fr: "Contrat standardisé (taille, échéance fixées par la bourse)", en: "Standardized contract (size, maturity set by the exchange)" },
        { id: "daily", fr: "Règlement quotidien des gains et pertes (mark-to-market)", en: "Daily settlement of gains and losses (mark-to-market)" },
        { id: "ccp", fr: "Contrepartie garantie par une chambre de compensation", en: "Counterparty guaranteed by a clearinghouse" },
        { id: "liquid", fr: "Position facilement revendue avant l'échéance sur un marché organisé", en: "Position easily resold before maturity on an exchange" },
      ] as const
    );

    return {
      prompt: {
        fr: `Laquelle de ces caractéristiques décrit un FUTURE plutôt qu'un forward : « ${feature.fr} » ?`,
        en: `Which contract does this feature describe: « ${feature.en} » ?`,
      },
      choices: buildChoices([
        { id: "future", label: { fr: "Le future", en: "The future" } },
        { id: "forward", label: { fr: "Le forward", en: "The forward" } },
      ]),
      hint: {
        fr: "Le future est le produit standardisé et coté en bourse.",
        en: "The future is the standardized, exchange-listed product.",
      },
      correctChoiceIds: ["future"],
      explanation: {
        fr: `« ${feature.fr} » est une caractéristique du future : la standardisation, la chambre de compensation, le règlement quotidien et la liquidité en continu sont ses quatre traits distinctifs par rapport au forward.`,
        en: `"${feature.en}" is a feature of the future: standardization, the clearinghouse, daily settlement and continuous liquidity are its four distinguishing traits versus the forward.`,
      },
      commonMistake: {
        fr: "Attribuer ces caractéristiques au forward, qui est justement défini par leur absence (sur mesure, bilatéral, réglé une seule fois).",
        en: "Attributing these features to the forward, which is precisely defined by their absence (custom, bilateral, settled once).",
      },
    };
  },
};

const marginCallTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-appel-marge",
  conceptId: "m02-forward-vs-future",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const contracts = randomInt(rng, 2, 40);
    const priceMove = (randomInt(rng, -300, 300) / 100).toFixed(2);
    const move = Number(priceMove);
    const direction = pick(rng, ["long", "short"] as const);
    const signedMove = direction === "long" ? move : -move;
    const variation = Math.round(contracts * signedMove * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un trader détient une position ${direction === "long" ? "longue" : "courte"} de ${contracts} contrats future. Le prix de règlement varie de ${fmt(move, "fr")} par rapport à la veille. Quelle est la marge de variation créditée (positive) ou débitée (négative) sur son compte ?`,
        en: `A trader holds a ${direction} position of ${contracts} future contracts. The settlement price moves by ${fmt(move, "en")} versus yesterday. What is the variation margin credited (positive) or debited (negative) to their account?`,
      },
      numericUnit: { fr: "unités monétaires", en: "currency units" },
      numericTolerance: "± 0.5",
      hint: {
        fr: `Marge = quantité × variation × (${direction === "long" ? "+1" : "−1"} selon la position).`,
        en: `Margin = quantity × change × (${direction === "long" ? "+1" : "−1"} for this position).`,
      },
      numeric: { value: variation, tolerance: 0.5 },
      calculation: {
        fr: `Marge de variation = ${contracts} × ${fmt(signedMove, "fr")} = ${fmt(variation, "fr")}.`,
        en: `Variation margin = ${contracts} × ${fmt(signedMove, "en")} = ${fmt(variation, "en")}.`,
      },
      explanation: {
        fr: "Chaque jour, le compte de marge est ajusté du gain ou de la perte réalisé ce jour-là ; c'est ce qui distingue le future du forward, réglé une seule fois à l'échéance.",
        en: "Every day, the margin account is adjusted for that day's gain or loss; this is what sets the future apart from the forward, which settles only once at maturity.",
      },
      commonMistake: {
        fr: "Oublier d'inverser le signe pour une position courte : une baisse du prix est un gain pour le vendeur.",
        en: "Forgetting to flip the sign for a short position: a price drop is a gain for the seller.",
      },
    };
  },
};

const counterpartyTrueFalseTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-contrepartie",
  conceptId: "m02-forward-vs-future",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Sur un future, le collatéral déposé en marge supprime totalement tout risque de contrepartie, sans aucune exception.",
      en: "On a future, the collateral posted as margin fully removes all counterparty risk, with no exception.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le collatéral réduit fortement le risque de contrepartie, il ne l'élimine pas complètement (le collatéral lui-même peut perdre de la valeur, et un mouvement extrême entre deux appels de marge peut dépasser la marge déposée).",
      en: "False: collateral strongly reduces counterparty risk, it does not fully eliminate it (the collateral itself can lose value, and an extreme move between two margin calls can exceed the posted margin).",
    },
    commonMistake: {
      fr: "Croire qu'un mécanisme de collatéral rend une position totalement sans risque de contrepartie.",
      en: "Believing a collateral mechanism makes a position fully free of counterparty risk.",
    },
  }),
};

const choiceScenarioTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-choix",
  conceptId: "m02-forward-vs-future",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const amount = randomInt(rng, 2, 90) * 10_000 + randomInt(rng, 100, 900);
    const days = randomInt(rng, 20, 300);
    const wantsExit = pick(rng, [true, false] as const);

    return {
      isScenario: true,
      prompt: {
        fr: wantsExit
          ? `Un trader veut prendre position sur le cuivre pendant quelques semaines, avec la possibilité de revendre à tout moment sans négocier avec une contrepartie précise. Quel contrat choisir ?`
          : `Une entreprise doit payer exactement ${fmt(amount, "fr")} devise étrangère dans ${days} jours, un montant et une date non standard, et conservera la position jusqu'à cette date précise. Quel contrat choisir ?`,
        en: wantsExit
          ? `A trader wants to take a position on copper for a few weeks, with the ability to exit at any time without negotiating with a specific counterparty. Which contract should they choose?`
          : `A company must pay exactly ${fmt(amount, "en")} in foreign currency in ${days} days, a non-standard amount and date, and will hold the position until that exact date. Which contract should it choose?`,
      },
      choices: buildChoices([
        { id: "future", label: { fr: "Un future", en: "A future" } },
        { id: "forward", label: { fr: "Un forward", en: "A forward" } },
      ]),
      hint: {
        fr: "Un montant/date sur mesure conservé jusqu'au bout → forward. Un besoin de sortir vite et facilement → future.",
        en: "A custom amount/date held to the end → forward. A need to exit quickly and easily → future.",
      },
      correctChoiceIds: [wantsExit ? "future" : "forward"],
      explanation: {
        fr: wantsExit
          ? "Le besoin de liquidité et de sortie facile avant l'échéance oriente vers le future, coté en continu sur un marché organisé."
          : "Un montant et une date non standard, conservés jusqu'à l'échéance, orientent vers un forward sur mesure négocié directement avec une banque.",
        en: wantsExit
          ? "The need for liquidity and an easy exit before maturity points to the future, continuously quoted on an exchange."
          : "A non-standard amount and date, held to maturity, points to a custom forward negotiated directly with a bank.",
      },
      commonMistake: {
        fr: "Choisir un future pour un besoin sur mesure qu'aucun contrat standardisé ne peut répliquer exactement.",
        en: "Choosing a future for a custom need that no standardized contract can exactly replicate.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [featureMatchTemplate, marginCallTemplate, counterpartyTrueFalseTemplate, choiceScenarioTemplate];
