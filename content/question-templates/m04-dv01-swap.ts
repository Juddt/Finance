import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const dv01SwapNumericTemplate: QuestionTemplate = {
  id: "m04-dv01-swap-calcul",
  conceptId: "m04-dv01-swap",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 5, 100) * 500_000;
    const Dmod = randomFloat(rng, 1, 10, 2);
    const dv01 = Math.round(notional * Dmod * 0.0001 * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un swap receveur fixe de notionnel ${fmt(notional, "fr", 0)} vient d'être resetté ; sa jambe fixe a une duration modifiée de ${fmt(Dmod, "fr")}. Quel est le DV01 approximatif du swap ?`,
        en: `A fixed-receiver swap with notional ${fmt(notional, "en", 0)} has just reset; its fixed leg has a modified duration of ${fmt(Dmod, "en")}. What is the swap's approximate DV01?`,
      },
      numericUnit: { fr: "même devise, par point de base", en: "same currency, per basis point" },
      numericTolerance: "± 5",
      hint: { fr: "DV01_swap ≈ Notionnel × D_mod, jambe fixe × 0,0001.", en: "DV01_swap ≈ Notional × D_mod, fixed leg × 0.0001." },
      numeric: { value: dv01, tolerance: 5 },
      calculation: {
        fr: `DV01 ≈ ${fmt(notional, "fr", 0)} × ${fmt(Dmod, "fr")} × 0,0001 ≈ ${fmt(dv01, "fr")}.`,
        en: `DV01 ≈ ${fmt(notional, "en", 0)} × ${fmt(Dmod, "en")} × 0.0001 ≈ ${fmt(dv01, "en")}.`,
      },
      explanation: {
        fr: "Juste après un reset, la jambe variable a un DV01 quasi nul : tout le risque de taux du swap vient de sa jambe fixe, traitée comme une obligation classique.",
        en: "Right after a reset, the floating leg's DV01 is near zero: all the swap's rate risk comes from its fixed leg, treated as a plain bond.",
      },
      commonMistake: {
        fr: "Essayer de calculer un DV01 séparé pour la jambe variable et l'additionner, alors qu'il est négligeable juste après un reset.",
        en: "Trying to compute a separate DV01 for the floating leg and add it, when it is negligible right after a reset.",
      },
    };
  },
};

const signConventionTemplate: QuestionTemplate = {
  id: "m04-dv01-swap-signe",
  conceptId: "m04-dv01-swap",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ratesUp = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Les taux montent brutalement. Quelle position sur un swap en profite (gain positif) ?`,
        en: `Rates rise sharply. Which swap position benefits (positive gain)?`,
      },
      choices: buildChoices([
        { id: "payer", label: { fr: "Le payeur fixe (reçoit variable)", en: "The fixed payer (receives floating)" } },
        { id: "receiver", label: { fr: "Le receveur fixe (paie variable)", en: "The fixed receiver (pays floating)" } },
      ]),
      hint: { fr: "Comparez au comportement d'un émetteur obligataire (qui profite d'une hausse des taux) vs un porteur (qui en pâtit).", en: "Compare to a bond issuer's behavior (benefits from a rate rise) vs a holder's (hurt by it)." },
      correctChoiceIds: ["payer"],
      explanation: {
        fr: "Le payeur fixe se comporte comme un émetteur obligataire synthétique : une hausse des taux réduit la valeur de sa dette fixe à payer, un gain net pour lui — l'inverse du receveur fixe, qui se comporte comme un porteur obligataire.",
        en: "The fixed payer behaves like a synthetic bond issuer: a rate rise lowers the value of their fixed debt owed, a net gain for them — the opposite of the fixed receiver, who behaves like a bondholder.",
      },
      commonMistake: {
        fr: "Appliquer machinalement \"hausse des taux = perte\" sans distinguer payeur et receveur fixe.",
        en: "Mechanically applying \"rate rise = loss\" without distinguishing fixed payer and receiver.",
      },
    };
  },
};

const floatingLegDv01Template: QuestionTemplate = {
  id: "m04-dv01-swap-jambe-variable",
  conceptId: "m04-dv01-swap",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le DV01 de la jambe variable d'un swap est rigoureusement nul en permanence, à tout moment de la vie du swap.",
      en: "The DV01 of a swap's floating leg is strictly zero at all times, throughout the swap's life.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : il est quasi nul juste après un reset, mais entre deux dates de reset la jambe variable porte un petit risque de taux résiduel, généralement négligeable mais pas rigoureusement nul.",
      en: "False: it is near zero right after a reset, but between two reset dates the floating leg carries a small residual rate risk, usually negligible but not strictly zero.",
    },
    commonMistake: {
      fr: "Généraliser abusivement l'approximation \"DV01 jambe variable ≈ 0\" en une égalité stricte permanente.",
      en: "Overgeneralizing the \"floating leg DV01 ≈ 0\" approximation into a strict, permanent equality.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m04-dv01-swap-vocab",
  conceptId: "m04-dv01-swap",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un desk qui décompose son risque de taux par tranche de maturité (courte, moyenne, longue) plutôt qu'en un seul DV01 global utilise ce qu'on appelle le \"key ______ DV01\".",
      en: "A desk that decomposes its rate risk by maturity bucket (short, medium, long) rather than a single global DV01 uses what is called \"key ______ DV01\".",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["rate"],
    hint: { fr: "Le même mot qu'en anglais financier, déjà utilisé pour « taux ».", en: "The finance term itself (rate)." },
    explanation: {
      fr: "Le \"key rate DV01\" décompose la sensibilité aux taux par point de la courbe, utile car les taux ne bougent presque jamais parfaitement en parallèle.",
      en: "\"Key rate DV01\" decomposes rate sensitivity by point on the curve, useful since rates almost never move in perfect parallel.",
    },
    commonMistake: {
      fr: "Croire qu'un DV01 global unique suffit à décrire complètement le risque de taux d'un portefeuille complexe.",
      en: "Believing a single global DV01 fully describes a complex portfolio's rate risk.",
    },
  }),
};

export const templates: QuestionTemplate[] = [dv01SwapNumericTemplate, signConventionTemplate, floatingLegDv01Template, vocabTemplate];
