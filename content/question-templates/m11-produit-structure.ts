import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const decompositionNumericTemplate: QuestionTemplate = {
  id: "m11-produit-decomposition-calcul",
  conceptId: "m11-produit-structure",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const bond = randomInt(rng, 800, 950) / 10;
    const fees = randomInt(rng, 5, 20) / 10;
    const optionComponent = Math.round((100 - bond - fees) * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Un produit structuré à capital garanti (nominal 100) alloue ${fmt(bond, "fr", 1)} à une obligation zéro-coupon et prélève ${fmt(fees, "fr", 1)} de frais. Combien reste-t-il pour la composante optionnelle ?`,
        en: `A capital-guaranteed structured product (face value 100) allocates ${fmt(bond, "en", 1)} to a zero-coupon bond and charges ${fmt(fees, "en", 1)} in fees. How much is left for the optional component?`,
      },
      numericUnit: { fr: "% du nominal", en: "% of face value" },
      numericTolerance: "± 0.3",
      hint: { fr: "Valeur_produit = Obligation + Composante_optionnelle − Frais, et le total collecté = 100.", en: "Product value = Bond + Optional component − Fees, and the total collected = 100." },
      numeric: { value: optionComponent, tolerance: 0.3 },
      calculation: {
        fr: `Composante_optionnelle = 100 − ${fmt(bond, "fr", 1)} − ${fmt(fees, "fr", 1)} = ${fmt(optionComponent, "fr", 1)}.`,
        en: `Optional component = 100 − ${fmt(bond, "en", 1)} − ${fmt(fees, "en", 1)} = ${fmt(optionComponent, "en", 1)}.`,
      },
      explanation: {
        fr: "Cette décomposition révèle combien du capital collecté sert réellement à acheter du potentiel de gain, une fois la protection du capital et les frais retirés.",
        en: "This decomposition reveals how much of the collected capital actually buys upside potential, once capital protection and fees are removed.",
      },
      commonMistake: {
        fr: "Oublier de soustraire les frais, en supposant que tout le capital non alloué à l'obligation va dans la composante optionnelle.",
        en: "Forgetting to subtract the fees, assuming all capital not allocated to the bond goes into the optional component.",
      },
    };
  },
};

const issuerRiskTemplate: QuestionTemplate = {
  id: "m11-produit-risque-emetteur",
  conceptId: "m11-produit-structure",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Un produit structuré \"à capital garanti à 100%\" garantit le remboursement du capital quelles que soient les circonstances, y compris un défaut de l'émetteur.",
      en: "A \"100% capital-guaranteed\" structured product guarantees capital repayment under any circumstances, including issuer default.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la garantie de capital est conditionnée à la solvabilité de l'émetteur. En cas de défaut, l'investisseur peut perdre tout ou partie de son capital, indépendamment de la performance du sous-jacent.",
      en: "False: the capital guarantee is conditional on the issuer's solvency. In the event of default, the investor may lose all or part of their capital, regardless of the underlying's performance.",
    },
    commonMistake: {
      fr: "Confondre \"capital garanti\" (protection contre le risque de marché du sous-jacent) avec une garantie absolue sans aucun risque résiduel.",
      en: "Confusing \"capital guaranteed\" (protection against the underlying's market risk) with an absolute guarantee free of any residual risk.",
    },
  }),
};

const categoryTemplate: QuestionTemplate = {
  id: "m11-produit-categories",
  conceptId: "m11-produit-structure",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const category = pick(rng, ["reverse-convertible", "capital-conditionnel"] as const);
    return {
      prompt: {
        fr: category === "reverse-convertible"
          ? "Un produit qui offre un coupon élevé mais où la perte en capital commence dès que le sous-jacent passe sous une barrière (sans franchise) appartient à quelle catégorie ?"
          : "Un produit qui protège le capital uniquement si le sous-jacent reste au-dessus d'une barrière pendant toute la durée du produit appartient à quelle catégorie ?",
        en: category === "reverse-convertible"
          ? "A product offering a high coupon but where capital loss begins as soon as the underlying falls below a barrier (no deductible) belongs to which category?"
          : "A product that protects capital only if the underlying stays above a barrier throughout the product's life belongs to which category?",
      },
      choices: buildChoices([
        { id: "non-protege", label: { fr: "Capital non protégé (reverse convertible)", en: "Non-capital-protected (reverse convertible)" } },
        { id: "conditionnel", label: { fr: "Capital conditionnellement protégé", en: "Conditionally capital-protected" } },
      ]),
      hint: { fr: "L'une des catégories a un risque de perte dès le premier euro sous barrière ; l'autre protège tant que la barrière n'a jamais été franchie.", en: "One category has loss risk from the first euro below the barrier; the other protects as long as the barrier was never breached." },
      correctChoiceIds: category === "reverse-convertible" ? ["non-protege"] : ["conditionnel"],
      explanation: {
        fr: category === "reverse-convertible"
          ? "Une reverse convertible (produit à capital non protégé) expose l'investisseur à une perte en capital dès que le sous-jacent est sous la barrière à l'échéance, en échange d'un coupon élevé."
          : "Un produit à capital conditionnellement protégé garde sa protection tant que la barrière n'a jamais été franchie (ou tant que le niveau final est au-dessus d'un seuil), selon la structure exacte."
        ,
        en: category === "reverse-convertible"
          ? "A reverse convertible (non-capital-protected product) exposes the investor to a capital loss as soon as the underlying is below the barrier at maturity, in exchange for a high coupon."
          : "A conditionally capital-protected product keeps its protection as long as the barrier was never breached (or as long as the final level is above a threshold), depending on the exact structure.",
      },
      commonMistake: {
        fr: "Confondre les trois grandes catégories de produits structurés (garanti, conditionnel, non protégé) entre elles.",
        en: "Confusing the three broad structured-product categories (guaranteed, conditional, non-protected) with each other.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m11-produit-vocab",
  conceptId: "m11-produit-structure",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le risque qu'un investisseur en produit structuré peut faire face si le produit doit être revendu avant échéance, faute de marché secondaire actif, est le risque de ______.",
      en: "The risk a structured product investor may face if the product must be resold before maturity, for lack of an active secondary market, is ______ risk.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["liquidite", "liquidité", "liquidity"],
    hint: { fr: "Un mot lié à la facilité de revente.", en: "A word related to ease of resale." },
    explanation: {
      fr: "Le risque de liquidité désigne la difficulté (et le coût) de revendre un produit structuré avant son échéance contractuelle, faute de marché secondaire liquide.",
      en: "Liquidity risk denotes the difficulty (and cost) of reselling a structured product before its contractual maturity, for lack of a liquid secondary market.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le risque de marché, qui concerne la performance du sous-jacent, pas la facilité de revente.",
      en: "Confusing this term with market risk, which concerns the underlying's performance, not ease of resale.",
    },
  }),
};

export const templates: QuestionTemplate[] = [decompositionNumericTemplate, issuerRiskTemplate, categoryTemplate, vocabTemplate];
