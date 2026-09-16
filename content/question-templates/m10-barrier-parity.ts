import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const parityNumericTemplate: QuestionTemplate = {
  id: "m10-parity-calcul",
  conceptId: "m10-barrier-parity",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const vanille = randomInt(rng, 500, 1500) / 10;
    const known = Math.round((vanille - randomInt(rng, 50, Math.round(vanille * 10) - 50) / 10) * 10) / 10;
    const missing = Math.round((vanille - known) * 100) / 100;
    const knownIsOut = pick(rng, [true, false] as const);

    return {
      isScenario: true,
      prompt: {
        fr: `Un call vanille vaut ${fmt(vanille, "fr")}. Le call down-and-${knownIsOut ? "out" : "in"} correspondant (même strike, échéance, barrière) vaut ${fmt(known, "fr")}. Quel est le prix du call down-and-${knownIsOut ? "in" : "out"} ?`,
        en: `A vanilla call is worth ${fmt(vanille, "en")}. The corresponding down-and-${knownIsOut ? "out" : "in"} call (same strike, maturity, barrier) is worth ${fmt(known, "en")}. What is the down-and-${knownIsOut ? "in" : "out"} call's price?`,
      },
      numericUnit: { fr: "même devise que le vanille", en: "same currency as the vanilla" },
      numericTolerance: "± 0.3",
      hint: { fr: "C_vanille = C_DI + C_DO.", en: "C_vanilla = C_DI + C_DO." },
      numeric: { value: missing, tolerance: 0.3 },
      calculation: {
        fr: `${fmt(vanille, "fr")} = ${fmt(known, "fr")} + X, donc X = ${fmt(vanille, "fr")} − ${fmt(known, "fr")} = ${fmt(missing, "fr")}.`,
        en: `${fmt(vanille, "en")} = ${fmt(known, "en")} + X, so X = ${fmt(vanille, "en")} − ${fmt(known, "en")} = ${fmt(missing, "en")}.`,
      },
      explanation: {
        fr: "La somme des deux contrats barrière (in et out) reconstitue exactement le prix vanille, une identité d'arbitrage exacte.",
        en: "The sum of both barrier contracts (in and out) exactly reconstitutes the vanilla price, an exact arbitrage identity.",
      },
      commonMistake: {
        fr: "Additionner au lieu de soustraire pour isoler le prix manquant.",
        en: "Adding instead of subtracting to isolate the missing price.",
      },
    };
  },
};

const conditionsTemplate: QuestionTemplate = {
  id: "m10-parity-conditions",
  conceptId: "m10-barrier-parity",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La barrier parity s'applique entre un call down-and-in et un call up-and-out de même strike et échéance.",
      en: "Barrier parity applies between a down-and-in call and an up-and-out call with the same strike and maturity.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la parité ne fonctionne QUE si les deux contrats partagent exactement la même barrière ET le même sens (up ou down) — pas entre un contrat \"down\" et un contrat \"up\".",
      en: "False: parity only works if both contracts share exactly the same barrier AND the same direction (up or down) — not between a \"down\" contract and an \"up\" contract.",
    },
    commonMistake: {
      fr: "Croire que la parité s'applique à n'importe quelle paire de contrats knock-in/knock-out, sans vérifier que le sens de la barrière est identique.",
      en: "Believing parity applies to any knock-in/knock-out pair, without checking the barrier direction matches.",
    },
  }),
};

const modelIndependentTemplate: QuestionTemplate = {
  id: "m10-parity-independance-modele",
  conceptId: "m10-barrier-parity",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La barrier parity (C_vanille = C_DI + C_DO) doit-elle être vérifiée uniquement sous le modèle de Black-Scholes, ou sous n'importe quel modèle de pricing cohérent ?",
      en: "Must barrier parity (C_vanilla = C_DI + C_DO) hold only under the Black-Scholes model, or under any consistent pricing model?",
    },
    choices: buildChoices([
      { id: "any", label: { fr: "N'importe quel modèle cohérent, c'est une identité d'arbitrage", en: "Any consistent model, it's an arbitrage identity" } },
      { id: "bs-only", label: { fr: "Uniquement sous Black-Scholes", en: "Only under Black-Scholes" } },
    ]),
    hint: { fr: "Comparez à la parité call-put (M05-3), qui ne dépend d'aucun modèle particulier.", en: "Compare to put-call parity (M05-3), which doesn't depend on any particular model." },
    correctChoiceIds: ["any"],
    explanation: {
      fr: "Comme la parité call-put, la barrier parity est une identité d'arbitrage pure (basée sur une partition exhaustive des scénarios), valable sous n'importe quel modèle de pricing cohérent, pas seulement Black-Scholes.",
      en: "Like put-call parity, barrier parity is a pure arbitrage identity (based on an exhaustive scenario partition), valid under any consistent pricing model, not just Black-Scholes.",
    },
    commonMistake: {
      fr: "Croire que cette relation est spécifique au modèle de Black-Scholes plutôt qu'un résultat de non-arbitrage général.",
      en: "Believing this relationship is specific to the Black-Scholes model rather than a general no-arbitrage result.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m10-parity-vocab",
  conceptId: "m10-barrier-parity",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La barrier parity est aussi appelée in-out ______, par référence aux deux versions complémentaires du contrat.",
      en: "Barrier parity is also called in-out ______, referring to the contract's two complementary versions.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["parite", "parité", "parity"],
    hint: { fr: "Le même mot que dans « barrier parity ».", en: "The same word as in \"barrier parity\"." },
    explanation: {
      fr: "In-out parity est un autre nom pour la barrier parity, insistant sur la complémentarité entre knock-in et knock-out.",
      en: "In-out parity is another name for barrier parity, emphasizing the complementarity between knock-in and knock-out.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec la parité call-put, qui est une relation différente.",
      en: "Confusing this term with put-call parity, a different relationship.",
    },
  }),
};

export const templates: QuestionTemplate[] = [parityNumericTemplate, conditionsTemplate, modelIndependentTemplate, vocabTemplate];
