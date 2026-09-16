import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const COMMODITIES = ["blé", "pétrole brut", "cuivre", "gaz naturel"] as const;
const COMMODITIES_EN = ["wheat", "crude oil", "copper", "natural gas"] as const;

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const netCarryNumericTemplate: QuestionTemplate = {
  id: "m02-matieres-f0-calcul",
  conceptId: "m02-matieres-premieres",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const idx = randomInt(rng, 0, COMMODITIES.length - 1);
    const S0 = randomInt(rng, 30, 400);
    const rPct = randomInt(rng, 1, 5);
    const uPct = randomInt(rng, 1, 6);
    const yPct = randomInt(rng, 0, 5);
    const netRate = (rPct + uPct - yPct) / 100;
    const F0 = Math.round(S0 * (1 + netRate) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Pour du ${COMMODITIES[idx]}, S0 = ${S0}, r = ${rPct}%, coût de stockage u = ${uPct}%, rendement de convenance y = ${yPct}%, T = 1 an. Quel est le prix forward F0 ?`,
        en: `For ${COMMODITIES_EN[idx]}, S0 = ${S0}, r = ${rPct}%, storage cost u = ${uPct}%, convenience yield y = ${yPct}%, T = 1 year. What is the forward price F0?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 0.5",
      hint: {
        fr: "F0 = S0 × (1 + r + u − y)^T.",
        en: "F0 = S0 × (1 + r + u − y)^T.",
      },
      numeric: { value: F0, tolerance: 0.5 },
      calculation: {
        fr: `Taux net = ${rPct}% + ${uPct}% − ${yPct}% = ${(netRate * 100).toFixed(2)}%. F0 = ${S0} × (1 + ${netRate.toFixed(4)}) = ${fmt(F0, "fr")}.`,
        en: `Net rate = ${rPct}% + ${uPct}% − ${yPct}% = ${(netRate * 100).toFixed(2)}%. F0 = ${S0} × (1 + ${netRate.toFixed(4)}) = ${fmt(F0, "en")}.`,
      },
      explanation: {
        fr: "Le stockage se comporte comme un coût de financement supplémentaire ; le rendement de convenance se comporte comme un revenu implicite qui réduit ce coût net.",
        en: "Storage behaves like an extra financing cost; the convenience yield behaves like an implicit income that reduces this net cost.",
      },
      commonMistake: {
        fr: "Oublier de soustraire y, ou inverser son signe (le rendement de convenance diminue F0, il ne l'augmente pas).",
        en: "Forgetting to subtract y, or flipping its sign (the convenience yield lowers F0, it does not raise it).",
      },
    };
  },
};

const highConvenienceTemplate: QuestionTemplate = {
  id: "m02-matieres-convenance-actif",
  conceptId: "m02-matieres-premieres",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "shortage", fr: "les stocks mondiaux de cette matière première viennent de chuter fortement", en: "global inventories of this commodity have just fallen sharply" },
        { id: "surplus", fr: "les stocks mondiaux de cette matière première sont exceptionnellement abondants", en: "global inventories of this commodity are exceptionally abundant" },
      ] as const
    );

    const correctId = scenario.id === "shortage" ? "up" : "down";

    return {
      prompt: {
        fr: `Si ${scenario.fr}, que devient probablement le rendement de convenance y ?`,
        en: `If ${scenario.en}, what likely happens to the convenience yield y?`,
      },
      choices: buildChoices([
        { id: "up", label: { fr: "Il augmente", en: "It rises" } },
        { id: "down", label: { fr: "Il diminue", en: "It falls" } },
      ]),
      hint: {
        fr: "Le rendement de convenance reflète la valeur d'avoir le stock physique sous la main en cas de pénurie.",
        en: "The convenience yield reflects the value of having physical stock on hand in case of shortage.",
      },
      correctChoiceIds: [correctId],
      explanation:
        scenario.id === "shortage"
          ? { fr: "Des stocks bas rendent la détention physique plus précieuse (risque de rupture plus élevé) : le rendement de convenance augmente.", en: "Low inventories make physical holding more valuable (higher shortage risk): the convenience yield rises." }
          : { fr: "Des stocks abondants rendent la détention physique moins urgente : le rendement de convenance diminue.", en: "Abundant inventories make physical holding less urgent: the convenience yield falls." },
      commonMistake: {
        fr: "Confondre le rendement de convenance avec le coût de stockage, qui répond à d'autres facteurs (taille de l'entrepôt, assurance...).",
        en: "Confusing the convenience yield with the storage cost, which responds to different factors (warehouse size, insurance...).",
      },
    };
  },
};

const goldTrueFalseTemplate: QuestionTemplate = {
  id: "m02-matieres-or-vrai-faux",
  conceptId: "m02-matieres-premieres",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "L'or, principalement détenu comme actif d'investissement plutôt que consommé industriellement, a en général un rendement de convenance proche de zéro.",
      en: "Gold, mostly held as an investment asset rather than industrially consumed, generally has a convenience yield close to zero.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : contrairement au blé ou au pétrole, l'or n'est presque jamais en risque de \"rupture d'approvisionnement\" pour un usage industriel critique, donc le bénéfice de le détenir physiquement plutôt qu'à terme est faible.",
      en: "True: unlike wheat or oil, gold is almost never at risk of a critical industrial supply shortage, so the benefit of holding it physically rather than forward is small.",
    },
    commonMistake: {
      fr: "Appliquer le même raisonnement de rendement de convenance élevé à tous les actifs physiques sans distinction.",
      en: "Applying the same high-convenience-yield reasoning to all physical assets without distinction.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m02-matieres-vocab",
  conceptId: "m02-matieres-premieres",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'avantage immatériel de détenir un stock physique tout de suite plutôt qu'un contrat à terme, par exemple pour ne jamais être en rupture de production, s'appelle le rendement de ______.",
      en: "The intangible benefit of holding physical stock right now rather than a forward contract, for example to never run short for production, is called the ______ yield.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["convenance", "convenience"],
    hint: {
      fr: "Le terme français utilisé dans le cours.",
      en: "The English finance term.",
    },
    explanation: {
      fr: "Le rendement de convenance (convenience yield) réduit le coût de portage net d'une matière première.",
      en: "The convenience yield reduces a commodity's net cost of carry.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le coût de stockage, qui a l'effet opposé sur le prix forward.",
      en: "Confusing this term with the storage cost, which has the opposite effect on the forward price.",
    },
  }),
};

export const templates: QuestionTemplate[] = [netCarryNumericTemplate, highConvenienceTemplate, goldTrueFalseTemplate, vocabTemplate];
