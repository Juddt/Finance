import { pick, randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const taylorRuleNumericTemplate: QuestionTemplate = {
  id: "m01-bc-taylor-calcul",
  conceptId: "m01-banques-centrales",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const rStar = randomFloat(rng, 0.5, 2, 1);
    const targetInflation = 2;
    const inflation = randomFloat(rng, 0.5, 5, 1);
    const outputGap = randomFloat(rng, -2, 2, 1);
    const i = Math.round((rStar + inflation + 0.5 * (inflation - targetInflation) + 0.5 * outputGap) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Règle de Taylor : r* = ${fmt(rStar, "fr", 1)}%, inflation observée = ${fmt(inflation, "fr", 1)}%, cible = 2%, écart de production = ${fmt(outputGap, "fr", 1)}%. Quel taux directeur suggère la règle, en % ?`,
        en: `Taylor rule: r* = ${fmt(rStar, "en", 1)}%, observed inflation = ${fmt(inflation, "en", 1)}%, target = 2%, output gap = ${fmt(outputGap, "en", 1)}%. What policy rate does the rule suggest, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.2",
      hint: { fr: "i = r* + π + 0,5(π−π*) + 0,5(y−y*).", en: "i = r* + π + 0.5(π−π*) + 0.5(y−y*)." },
      numeric: { value: i, tolerance: 0.2 },
      calculation: {
        fr: `i = ${fmt(rStar, "fr", 1)} + ${fmt(inflation, "fr", 1)} + 0,5×(${fmt(inflation, "fr", 1)}−2) + 0,5×${fmt(outputGap, "fr", 1)} ≈ ${fmt(i, "fr")}%.`,
        en: `i = ${fmt(rStar, "en", 1)} + ${fmt(inflation, "en", 1)} + 0.5×(${fmt(inflation, "en", 1)}−2) + 0.5×${fmt(outputGap, "en", 1)} ≈ ${fmt(i, "en")}%.`,
      },
      explanation: {
        fr: "La règle de Taylor combine le taux réel naturel, l'inflation observée et deux termes de correction pondérés à 0,5 chacun.",
        en: "The Taylor rule combines the natural real rate, observed inflation and two correction terms each weighted at 0.5.",
      },
      commonMistake: {
        fr: "Oublier le facteur 0,5 devant chacun des deux termes d'écart, ou omettre d'ajouter l'inflation observée elle-même (pas seulement son écart à la cible).",
        en: "Forgetting the 0.5 factor in front of each gap term, or omitting to add observed inflation itself (not just its gap to target).",
      },
    };
  },
};

const mandateTemplate: QuestionTemplate = {
  id: "m01-bc-mandat",
  conceptId: "m01-banques-centrales",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const bank = pick(rng, ["fed", "ecb"] as const);
    return {
      prompt: {
        fr: `Quel mandat légal décrit le mieux la ${bank === "fed" ? "FED" : "BCE"} ?`,
        en: `Which legal mandate best describes the ${bank === "fed" ? "FED" : "ECB"}?`,
      },
      choices: buildChoices([
        { id: "dual", label: { fr: "Double mandat : stabilité des prix ET plein emploi", en: "Dual mandate: price stability AND maximum employment" } },
        { id: "single", label: { fr: "Mandat principal unique : stabilité des prix", en: "Single primary mandate: price stability" } },
      ]),
      hint: { fr: "L'une des deux banques centrales a un objectif d'emploi légalement au même niveau que l'inflation.", en: "One of the two central banks has an employment objective legally on par with inflation." },
      correctChoiceIds: [bank === "fed" ? "dual" : "single"],
      explanation:
        bank === "fed"
          ? { fr: "La FED a un double mandat légal (Federal Reserve Act) : stabilité des prix et plein emploi, sur un pied d'égalité.", en: "The FED has a dual legal mandate (Federal Reserve Act): price stability and maximum employment, on equal footing." }
          : { fr: "La BCE a un mandat principal unique (stabilité des prix), l'emploi n'étant qu'un objectif secondaire, subordonné au premier.", en: "The ECB has a single primary mandate (price stability), with employment only a secondary goal, subordinate to the first." },
      commonMistake: {
        fr: "Inverser les mandats des deux institutions, une confusion fréquente.",
        en: "Swapping the two institutions' mandates, a frequent confusion.",
      },
    };
  },
};

const mechanicalRuleTemplate: QuestionTemplate = {
  id: "m01-bc-regle-mecanique",
  conceptId: "m01-banques-centrales",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La règle de Taylor est une formule que la FED et la BCE appliquent mécaniquement pour fixer leur taux directeur à chaque réunion.",
      en: "The Taylor rule is a formula that the FED and ECB mechanically apply to set their policy rate at every meeting.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : c'est une heuristique descriptive et un repère de lecture a posteriori, pas une règle mécanique suivie à la lettre — les décisions réelles intègrent bien d'autres facteurs et jugements qualitatifs.",
      en: "False: it is a descriptive heuristic and a retrospective reading benchmark, not a mechanical rule followed literally — real decisions incorporate many other factors and qualitative judgment.",
    },
    commonMistake: {
      fr: "Croire que la politique monétaire se réduit à une formule mathématique unique et automatique.",
      en: "Believing monetary policy reduces to a single, automatic mathematical formula.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-bc-vocab",
  conceptId: "m01-banques-centrales",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le taux d'intérêt fixé par une banque centrale, qui influence l'ensemble des taux de l'économie, s'appelle le taux ______.",
      en: "The interest rate set by a central bank, which influences the whole economy's rates, is called the ______ rate.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["directeur", "policy"],
    hint: { fr: "Le taux \"qui dirige\" tous les autres.", en: "The rate that \"steers\" all others." },
    explanation: {
      fr: "Le taux directeur (policy rate) est le principal outil d'une banque centrale pour piloter les conditions monétaires de l'économie.",
      en: "The policy rate is a central bank's main tool for steering the economy's monetary conditions.",
    },
    commonMistake: {
      fr: "Confondre le taux directeur avec un taux de marché comme l'EURIBOR, qui en découle mais n'est pas fixé directement par la banque centrale.",
      en: "Confusing the policy rate with a market rate like EURIBOR, which derives from it but isn't directly set by the central bank.",
    },
  }),
};

export const templates: QuestionTemplate[] = [taylorRuleNumericTemplate, mandateTemplate, mechanicalRuleTemplate, vocabTemplate];
