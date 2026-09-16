import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const discountPriceNumericTemplate: QuestionTemplate = {
  id: "m01-classes-escompte-calcul",
  conceptId: "m01-classes-actifs",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 20) * 100_000;
    const rPct = randomInt(rng, 1, 6);
    const days = randomInt(rng, 30, 270);
    const r = rPct / 100;
    const P = Math.round(F * (1 - r * (days / 360)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un billet de trésorerie de valeur nominale F = ${fmt(F, "fr", 0)}, taux d'escompte r = ${rPct}%, échéance dans ${days} jours. Quel est son prix aujourd'hui ?`,
        en: `A commercial paper with face value F = ${fmt(F, "en", 0)}, discount rate r = ${rPct}%, maturing in ${days} days. What is its price today?`,
      },
      numericUnit: { fr: "même devise que F", en: "same currency as F" },
      numericTolerance: "± 20",
      hint: { fr: "P = F × (1 − r × d/360).", en: "P = F × (1 − r × d/360)." },
      numeric: { value: P, tolerance: 20 },
      calculation: {
        fr: `P = ${fmt(F, "fr", 0)} × (1 − ${rPct}%×${days}/360) ≈ ${fmt(P, "fr")}.`,
        en: `P = ${fmt(F, "en", 0)} × (1 − ${rPct}%×${days}/360) ≈ ${fmt(P, "en")}.`,
      },
      explanation: {
        fr: "Cette convention d'escompte simple est typique du marché monétaire, différente de l'actualisation composée du marché obligataire.",
        en: "This simple discounting convention is typical of the money market, different from the bond market's compound discounting.",
      },
      commonMistake: {
        fr: "Appliquer une actualisation composée (1+r)^T comme pour une obligation, au lieu de la convention d'escompte simple du marché monétaire.",
        en: "Applying compound discounting (1+r)^T as for a bond, instead of the money market's simple discounting convention.",
      },
    };
  },
};

const marketClassificationTemplate: QuestionTemplate = {
  id: "m01-classes-classification",
  conceptId: "m01-classes-actifs",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "primary", fr: "une entreprise émet de nouvelles actions pour la première fois lors d'une introduction en bourse", en: "a company issues new shares for the first time during an IPO" },
        { id: "secondary", fr: "un investisseur revend des actions déjà en circulation à un autre investisseur", en: "an investor resells already-circulating shares to another investor" },
      ] as const
    );

    return {
      prompt: {
        fr: `Quand ${scenario.fr}, sur quel marché cette opération a-t-elle lieu ?`,
        en: `When ${scenario.en}, on which market does this transaction happen?`,
      },
      choices: buildChoices([
        { id: "primary", label: { fr: "Marché primaire", en: "Primary market" } },
        { id: "secondary", label: { fr: "Marché secondaire", en: "Secondary market" } },
      ]),
      hint: { fr: "S'agit-il d'une première émission ou d'un simple échange entre investisseurs ?", en: "Is this a first issuance or a simple exchange between investors?" },
      correctChoiceIds: [scenario.id],
      explanation:
        scenario.id === "primary"
          ? { fr: "Une émission initiale de titres, avec un flux vers l'émetteur, se déroule sur le marché primaire.", en: "An initial securities issuance, with a flow to the issuer, happens on the primary market." }
          : { fr: "Un échange entre deux investisseurs sur des titres déjà émis se déroule sur le marché secondaire, sans flux vers l'émetteur d'origine.", en: "An exchange between two investors on already-issued securities happens on the secondary market, with no flow to the original issuer." },
      commonMistake: {
        fr: "Confondre marché primaire/secondaire avec marché organisé/de gré à gré, deux axes de classification indépendants.",
        en: "Confusing primary/secondary market with organized/OTC market, two independent classification axes.",
      },
    };
  },
};

const moneyVsCapitalTemplate: QuestionTemplate = {
  id: "m01-classes-monetaire-capitaux",
  conceptId: "m01-classes-actifs",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const months = randomInt(rng, 1, 11);
    return {
      prompt: {
        fr: `Un instrument de dette à ${months} mois relève du marché de capitaux, pas du marché monétaire.`,
        en: `A debt instrument with a ${months}-month maturity belongs to the capital market, not the money market.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: ["false"],
      explanation: {
        fr: `Faux : le marché monétaire regroupe les instruments de dette à court terme, conventionnellement moins d'un an — ${months} mois en fait donc partie.`,
        en: `False: the money market covers short-term debt instruments, conventionally under one year — ${months} months therefore belongs to it.`,
      },
      commonMistake: {
        fr: "Oublier le seuil conventionnel d'un an séparant marché monétaire et marché de capitaux.",
        en: "Forgetting the conventional one-year threshold separating the money market from the capital market.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-classes-vocab",
  conceptId: "m01-classes-actifs",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un marché négocié bilatéralement entre deux parties, sans standardisation obligatoire ni chambre de compensation centrale, est dit de gré à ______.",
      en: "A market negotiated bilaterally between two parties, with no mandatory standardization or central clearinghouse, is said to be over-the-______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word (counter)" },
    acceptedAnswers: ["gre", "gré", "counter"],
    hint: { fr: "L'abréviation OTC en anglais.", en: "The OTC abbreviation." },
    explanation: {
      fr: "Un marché \"de gré à gré\" (OTC) s'oppose au marché organisé, standardisé et compensé centralement.",
      en: "An \"over-the-counter\" (OTC) market is the opposite of the organized, standardized, centrally-cleared market.",
    },
    commonMistake: {
      fr: "Confondre marché de gré à gré avec marché secondaire — ce sont deux axes de classification distincts.",
      en: "Confusing over-the-counter with secondary market — these are two distinct classification axes.",
    },
  }),
};

export const templates: QuestionTemplate[] = [discountPriceNumericTemplate, marketClassificationTemplate, moneyVsCapitalTemplate, vocabTemplate];
