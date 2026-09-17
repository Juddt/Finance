import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

const CURRENCIES = ["USD", "GBP", "JPY", "CHF"] as const;

function fmtAmount(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

function fmtRate(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

const directionTemplate: QuestionTemplate = {
  id: "m02-couverture-direction",
  conceptId: "m02-couverture-forward",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    const amount = randomInt(rng, 2, 20) * 100_000;
    const months = randomInt(rng, 1, 12);
    const direction = pick(rng, ["receive", "pay"] as const);
    const correctId = direction === "receive" ? "sell" : "buy";

    const verbFr = direction === "receive" ? "va recevoir" : "devra payer";
    const verbEn = direction === "receive" ? "will receive" : "will have to pay";

    return {
      isScenario: true,
      prompt: {
        fr: `Une entreprise française ${verbFr} ${fmtAmount(amount, "fr")} ${currency} dans ${months} mois. Elle veut fixer dès aujourd'hui le montant en euros correspondant. Quelle position forward doit-elle prendre ?`,
        en: `A French company ${verbEn} ${fmtAmount(amount, "en")} ${currency} in ${months} months. It wants to lock in today the corresponding euro amount. Which forward position should it take?`,
      },
      choices: buildChoices([
        { id: "sell", label: { fr: `Vendre des ${currency} à terme`, en: `Sell ${currency} forward` } },
        { id: "buy", label: { fr: `Acheter des ${currency} à terme`, en: `Buy ${currency} forward` } },
        { id: "wait", label: { fr: "Ne pas se couvrir et attendre le taux spot", en: "Not hedge and wait for the spot rate" } },
      ]),
      hint: {
        fr: "Pensez à ce que l'entreprise doit faire de sa devise étrangère : la recevoir puis s'en débarrasser, ou en avoir besoin ?",
        en: "Think about what the company must do with the foreign currency: receive it and get rid of it, or need to obtain it?",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr:
          direction === "receive"
            ? `L'entreprise va recevoir des ${currency} : pour fixer leur valeur en euros, elle doit les VENDRE à terme dès aujourd'hui.`
            : `L'entreprise devra payer des ${currency} : pour fixer leur coût en euros, elle doit les ACHETER à terme dès aujourd'hui.`,
        en:
          direction === "receive"
            ? `The company will receive ${currency}: to lock in their euro value, it must SELL them forward today.`
            : `The company will have to pay ${currency}: to lock in their euro cost, it must BUY them forward today.`,
      },
      commonMistake: {
        fr: "Inverser le sens de la couverture (acheter au lieu de vendre, ou l'inverse) est l'erreur la plus fréquente : la position forward doit toujours être opposée à l'exposition naturelle.",
        en: "Reversing the hedge direction (buying instead of selling, or vice versa) is the most common mistake: the forward position must always be opposite to the natural exposure.",
      },
    };
  },
};

const conversionTemplate: QuestionTemplate = {
  id: "m02-couverture-conversion",
  conceptId: "m02-couverture-forward",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    const amountForeign = randomInt(rng, 1, 20) * 100_000;
    const forwardRate = randomFloat(rng, 0.75, 0.98, 4);
    const answer = Math.round(amountForeign * forwardRate * 100) / 100;

    return {
      prompt: {
        fr: `Une entreprise vend à terme ${fmtAmount(amountForeign, "fr")} ${currency} au prix forward F0 = ${fmtRate(forwardRate, "fr")} EUR par ${currency}. Combien d'euros recevra-t-elle à l'échéance, quel que soit le taux spot à ce moment-là ?`,
        en: `A company sells ${fmtAmount(amountForeign, "en")} ${currency} forward at forward price F0 = ${fmtRate(forwardRate, "en")} EUR per ${currency}. How many euros will it receive at maturity, whatever the spot rate is then?`,
      },
      numericUnit: { fr: "EUR", en: "EUR" },
      numericTolerance: "± 10",
      hint: {
        fr: "Montant_EUR = Montant devise × F0.",
        en: "Amount_EUR = Foreign amount × F0.",
      },
      numeric: { value: answer, tolerance: 10 },
      calculation: {
        fr: `Montant_EUR = ${fmtAmount(amountForeign, "fr")} × ${fmtRate(forwardRate, "fr")} = ${fmtAmount(answer, "fr")} EUR.`,
        en: `Amount_EUR = ${fmtAmount(amountForeign, "en")} × ${fmtRate(forwardRate, "en")} = ${fmtAmount(answer, "en")} EUR.`,
      },
      explanation: {
        fr: "Le forward garantit ce montant en euros, indépendamment de ce que fera le taux spot d'ici l'échéance.",
        en: "The forward guarantees this euro amount, regardless of what the spot rate does before maturity.",
      },
      commonMistake: {
        fr: "Utiliser le taux spot actuel au lieu du prix forward F0 fixé dans le contrat.",
        en: "Using today's spot rate instead of the forward price F0 fixed in the contract.",
      },
    };
  },
};

const certaintyTemplate: QuestionTemplate = {
  id: "m02-couverture-certitude",
  conceptId: "m02-couverture-forward",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    return {
      prompt: {
        fr: `Une entreprise a vendu des ${currency} à terme pour se couvrir. Si le taux spot à l'échéance est plus favorable que le prix forward fixé, elle peut quand même bénéficier de ce meilleur taux.`,
        en: `A company sold ${currency} forward to hedge. If the spot rate at maturity turns out more favorable than the fixed forward price, it can still benefit from that better rate.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: ["false"],
      explanation: {
        fr: "Faux : un forward est un engagement ferme. L'échange se fait obligatoirement au prix fixé F0, que le spot final soit plus ou moins favorable.",
        en: "False: a forward is a firm commitment. The exchange happens at the fixed price F0 regardless of whether the final spot is more or less favorable.",
      },
      commonMistake: {
        fr: "Confondre un forward (engagement ferme) avec une option (droit, pas obligation) qui permettrait de profiter d'un meilleur taux spot.",
        en: "Confusing a forward (firm commitment) with an option (a right, not an obligation) which would allow benefiting from a better spot rate.",
      },
    };
  },
};

const basisRiskVocabTemplate: QuestionTemplate = {
  id: "m02-couverture-risque-base-vocab",
  conceptId: "m02-couverture-forward",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le risque qui subsiste quand le montant ou la date de l'opération réelle diffère de ce qui a été couvert par le forward s'appelle le risque de ______.",
      en: "The risk that remains when the real transaction's amount or date differs from what the forward covered is called ______ risk.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["base", "basis"],
    hint: {
      fr: "Même mot qu'en anglais financier : « basis risk ».",
      en: "Same term used in English finance jargon.",
    },
    explanation: {
      fr: "On parle de risque de base : le forward couvre un montant et une date précis, tout écart avec la réalité reste exposé au marché.",
      en: "This is called basis risk: the forward covers a specific amount and date, any gap with reality stays exposed to the market.",
    },
    commonMistake: {
      fr: "Confondre le risque de base avec le risque de contrepartie (le risque que la banque ne tienne pas ses engagements), qui est un risque différent.",
      en: "Confusing basis risk with counterparty risk (the risk that the bank fails to honor its commitment), which is a different risk.",
    },
  }),
};

const basisRiskNumericTemplate: QuestionTemplate = {
  id: "m02-couverture-risque-base-calcul",
  conceptId: "m02-couverture-forward",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    const hedgedAmount = randomInt(rng, 5, 15) * 100_000;
    const shortfallPct = randomFloat(rng, 0.03, 0.15, 3);
    const actualAmount = Math.round(hedgedAmount * (1 - shortfallPct));
    const uncovered = hedgedAmount - actualAmount;

    return {
      isScenario: true,
      prompt: {
        fr: `Une entreprise couvre ${fmtAmount(hedgedAmount, "fr")} ${currency} à terme, mais reçoit finalement seulement ${fmtAmount(actualAmount, "fr")} ${currency}. Combien de ${currency} restent non couverts, exposés au taux spot du jour ?`,
        en: `A company hedges ${fmtAmount(hedgedAmount, "en")} ${currency} forward, but ultimately receives only ${fmtAmount(actualAmount, "en")} ${currency}. How many ${currency} remain uncovered, exposed to that day's spot rate?`,
      },
      numericUnit: { fr: currency, en: currency },
      numericTolerance: "± 1",
      hint: {
        fr: "Comparez le montant couvert par le forward au montant réellement reçu.",
        en: "Compare the amount hedged by the forward to the amount actually received.",
      },
      numeric: { value: uncovered, tolerance: 1 },
      calculation: {
        fr: `Non couvert = ${fmtAmount(hedgedAmount, "fr")} − ${fmtAmount(actualAmount, "fr")} = ${fmtAmount(uncovered, "fr")} ${currency}. Pire encore : l'entreprise doit aussi trouver ${fmtAmount(uncovered, "fr")} ${currency} au taux spot pour honorer son forward, ou le renégocier.`,
        en: `Uncovered = ${fmtAmount(hedgedAmount, "en")} − ${fmtAmount(actualAmount, "en")} = ${fmtAmount(uncovered, "en")} ${currency}. Worse still: the company must also source ${fmtAmount(uncovered, "en")} ${currency} at the spot rate to honor its forward, or renegotiate it.`,
      },
      explanation: {
        fr: "C'est le risque de base : le forward porte sur un montant fixe, tout écart avec le flux réel reste exposé au marché — voire crée un besoin supplémentaire de devise.",
        en: "This is basis risk: the forward covers a fixed amount, any gap with the real cash flow stays exposed to the market — and can even create an extra currency need.",
      },
      commonMistake: {
        fr: "Penser que se couvrir élimine tout risque : cela élimine le risque sur le montant couvert, pas sur l'écart entre prévision et réalité.",
        en: "Thinking that hedging removes all risk: it removes the risk on the hedged amount, not the gap between forecast and reality.",
      },
    };
  },
};

const comprehensionTemplate = mcqTemplate({
  id: "m02-couverture-comprehension-utilite",
  conceptId: "m02-couverture-forward",
  difficulty: "medium",
  prompt: {
    fr: "Quel est le principal compromis (trade-off) qu'une entreprise accepte en se couvrant intégralement avec un forward ?",
    en: "What is the main trade-off a company accepts by fully hedging with a forward?",
  },
  choices: [
    { id: "tradeoff", label: { fr: "Elle élimine l'incertitude, mais renonce aussi à tout bénéfice si le marché évolue en sa faveur", en: "It removes uncertainty, but also gives up any benefit if the market moves in its favor" } },
    { id: "free-lunch", label: { fr: "Elle élimine l'incertitude sans aucune contrepartie", en: "It removes uncertainty with no trade-off at all" } },
    { id: "guarantees-better", label: { fr: "Elle garantit systématiquement un résultat meilleur que ne pas se couvrir", en: "It systematically guarantees a better outcome than not hedging" } },
  ],
  correctId: "tradeoff",
  hint: { fr: "Un forward est un engagement ferme dans les deux sens : il protège du pire scénario, mais empêche aussi de profiter du meilleur.", en: "A forward is a firm two-way commitment: it protects against the worst scenario, but also prevents benefiting from the best one." },
  explanation: {
    fr: "Se couvrir avec un forward fixe le taux de change quel que soit le sens du mouvement futur : si le marché évolue favorablement (un taux spot final plus avantageux que F0), l'entreprise couverte ne peut pas en profiter, exactement comme elle est protégée si le marché évolue défavorablement. La couverture achète de la certitude, pas de la performance.",
    en: "Hedging with a forward locks in the exchange rate regardless of which way the future move goes: if the market moves favorably (a final spot rate better than F0), the hedged company cannot benefit from it, exactly as it is protected if the market moves unfavorably. Hedging buys certainty, not performance.",
  },
  commonMistake: {
    fr: "Croire qu'une couverture est un moyen d'obtenir systématiquement un meilleur résultat, alors qu'elle échange l'incertitude contre un résultat connu d'avance, ni meilleur ni pire en moyenne.",
    en: "Believing a hedge is a way to systematically get a better outcome, when it trades uncertainty for a result known in advance, neither better nor worse on average.",
  },
});

const hedgedVsUnhedgedComparisonTemplate = mcqTemplate({
  id: "m02-couverture-comparaison-couvert-non-couvert",
  conceptId: "m02-couverture-forward",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Deux entreprises identiques doivent recevoir 1 000 000 USD dans 6 mois. L'une vend ses USD à terme à F0 = 0,92 EUR. L'autre ne se couvre pas. Le taux spot dans 6 mois s'avère être 0,95 EUR (plus favorable que F0). Laquelle reçoit le plus d'euros ?",
    en: "Two identical companies are due to receive USD 1,000,000 in 6 months. One sells its USD forward at F0 = 0.92 EUR. The other stays unhedged. The spot rate in 6 months turns out to be 0.95 EUR (more favorable than F0). Which one receives more euros?",
  },
  choices: [
    { id: "unhedged", label: { fr: "L'entreprise non couverte, qui profite pleinement du taux spot plus favorable", en: "The unhedged company, which fully benefits from the more favorable spot rate" } },
    { id: "hedged", label: { fr: "L'entreprise couverte, qui reçoit toujours plus grâce au forward", en: "The hedged company, which always receives more thanks to the forward" } },
    { id: "same", label: { fr: "Les deux reçoivent exactement le même montant", en: "Both receive exactly the same amount" } },
  ],
  correctId: "unhedged",
  hint: { fr: "L'entreprise couverte reçoit exactement F0 × montant, quel que soit le spot final.", en: "The hedged company receives exactly F0 × amount, whatever the final spot is." },
  explanation: {
    fr: "L'entreprise couverte reçoit 1 000 000 × 0,92 = 920 000 EUR, quel que soit le taux spot final. L'entreprise non couverte, elle, convertit au taux spot réel de 0,95, recevant 950 000 EUR — un résultat a posteriori meilleur, mais qu'elle ne pouvait pas garantir à l'avance : elle aurait tout aussi bien pu se retrouver avec un taux spot défavorable.",
    en: "The hedged company receives 1,000,000 × 0.92 = EUR 920,000, whatever the final spot rate is. The unhedged company converts at the actual 0.95 spot rate, receiving EUR 950,000 — a better outcome in hindsight, but one it could not guarantee in advance: it could just as easily have ended up with an unfavorable spot rate.",
  },
  commonMistake: {
    fr: "Juger la décision de couverture a posteriori (« ils auraient dû ne pas se couvrir ») plutôt qu'en fonction de l'incertitude connue au moment de la décision.",
    en: "Judging the hedging decision in hindsight (\"they should not have hedged\") rather than based on the uncertainty known at decision time.",
  },
});

const whatIfPartialHedgeTemplate = mcqTemplate({
  id: "m02-couverture-whatif-couverture-partielle",
  conceptId: "m02-couverture-forward",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une entreprise ne couvre à terme que 60% d'une créance en devise étrangère, laissant 40% non couverts. Que se passe-t-il sur la portion non couverte si la devise étrangère se déprécie fortement ?",
    en: "A company hedges forward only 60% of a foreign-currency receivable, leaving 40% uncovered. What happens to the uncovered portion if the foreign currency depreciates sharply?",
  },
  choices: [
    { id: "exposed", label: { fr: "Cette portion de 40% reste pleinement exposée au taux spot, donc à la dépréciation", en: "That 40% portion stays fully exposed to the spot rate, hence to the depreciation" } },
    { id: "protected", label: { fr: "Elle est automatiquement protégée par le forward conclu sur les 60% restants", en: "It is automatically protected by the forward entered into on the remaining 60%" } },
    { id: "no-effect", label: { fr: "La dépréciation n'affecte que la portion couverte, pas la portion non couverte", en: "The depreciation only affects the hedged portion, not the uncovered one" } },
  ],
  correctId: "exposed",
  hint: { fr: "Une couverture partielle ne protège que le montant effectivement couvert — le reste suit le marché.", en: "A partial hedge only protects the amount actually hedged — the rest follows the market." },
  explanation: {
    fr: "Une couverture partielle divise l'exposition en deux blocs indépendants : le bloc couvert (60%) est totalement protégé au taux F0, tandis que le bloc non couvert (40%) reste pleinement exposé aux mouvements du taux spot, y compris à une dépréciation défavorable. C'est un compromis délibéré entre protection totale et conservation d'un certain potentiel de gain (ou de perte).",
    en: "A partial hedge splits the exposure into two independent blocks: the hedged block (60%) is fully protected at rate F0, while the uncovered block (40%) remains fully exposed to spot rate moves, including an unfavorable depreciation. This is a deliberate trade-off between full protection and retaining some upside (or downside) potential.",
  },
  commonMistake: {
    fr: "Croire qu'une couverture partielle protège proportionnellement toute l'exposition contre tout mouvement, plutôt que de comprendre qu'elle divise l'exposition en une partie protégée et une partie totalement exposée.",
    en: "Believing a partial hedge proportionally protects the whole exposure against any move, rather than understanding it splits the exposure into a protected part and a fully exposed part.",
  },
});

const whatIfOverHedgeTemplate = mcqTemplate({
  id: "m02-couverture-whatif-surcouverture",
  conceptId: "m02-couverture-forward",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une entreprise attend une créance de 1 000 000 USD, mais vend à terme 1 500 000 USD « pour être large ». Si la créance réelle n'est finalement que de 1 000 000 USD, quelle est la conséquence de ce surplus de 500 000 USD vendu à terme ?",
    en: "A company expects a USD 1,000,000 receivable, but sells USD 1,500,000 forward \"to be safe\". If the actual receivable ends up being only USD 1,000,000, what is the consequence of the 500,000 excess sold forward?",
  },
  choices: [
    { id: "speculative", label: { fr: "Elle crée une position spéculative nette (vendeuse) de 500 000 USD, non adossée à une exposition réelle", en: "It creates a net speculative (short) position of USD 500,000, not backed by a real exposure" } },
    { id: "extra-protection", label: { fr: "Elle offre simplement une protection supplémentaire sans aucun risque nouveau", en: "It simply offers extra protection with no new risk" } },
    { id: "no-consequence", label: { fr: "Aucune conséquence, l'excédent s'annule automatiquement à l'échéance", en: "No consequence, the excess automatically cancels out at maturity" } },
  ],
  correctId: "speculative",
  hint: { fr: "Une couverture doit correspondre à une exposition réelle ; au-delà, ce n'est plus de la couverture.", en: "A hedge should match a real exposure; beyond that, it's no longer hedging." },
  explanation: {
    fr: "Vendre à terme plus que l'exposition réelle transforme l'excédent (ici 500 000 USD) en un pari directionnel pur sur la devise, sans aucun sous-jacent économique à couvrir : l'entreprise devra acheter ces 500 000 USD au taux spot du moment pour honorer son forward, un pari qui peut être gagnant ou perdant selon l'évolution du change — exactement le type de risque qu'une couverture est censée éliminer, pas créer.",
    en: "Selling more forward than the real exposure turns the excess (here USD 500,000) into a pure directional currency bet, with no underlying economic exposure to hedge: the company will need to buy that USD 500,000 at the then-prevailing spot rate to honor its forward, a bet that can win or lose depending on the FX move — exactly the kind of risk a hedge is supposed to eliminate, not create.",
  },
  commonMistake: {
    fr: "Croire que « couvrir plus que nécessaire » est toujours prudent, alors que l'excédent non adossé à une exposition réelle devient une spéculation pure.",
    en: "Believing \"hedging more than necessary\" is always prudent, when the excess not backed by a real exposure becomes pure speculation.",
  },
});

const partialHedgeBlendedRateNumericTemplate: QuestionTemplate = {
  id: "m02-couverture-taux-effectif-partiel-calcul",
  conceptId: "m02-couverture-forward",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const currency = pick(rng, CURRENCIES);
    const totalAmount = randomInt(rng, 5, 20) * 100_000;
    const hedgedPct = randomInt(rng, 40, 80) / 100;
    const forwardRate = randomFloat(rng, 0.8, 0.95, 4);
    const spotAtMaturity = randomFloat(rng, 0.75, 1.0, 4);
    const hedgedAmount = Math.round(totalAmount * hedgedPct);
    const unhedgedAmount = totalAmount - hedgedAmount;
    const totalEur = Math.round((hedgedAmount * forwardRate + unhedgedAmount * spotAtMaturity) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une entreprise attend ${fmtAmount(totalAmount, "fr")} ${currency}, dont ${(hedgedPct * 100).toFixed(0)}% sont vendus à terme à F0 = ${fmtRate(forwardRate, "fr")}. Le reste sera converti au taux spot final de ${fmtRate(spotAtMaturity, "fr")}. Quel montant total en EUR recevra-t-elle ?`,
        en: `A company expects ${fmtAmount(totalAmount, "en")} ${currency}, of which ${(hedgedPct * 100).toFixed(0)}% is sold forward at F0 = ${fmtRate(forwardRate, "en")}. The rest will be converted at the final spot rate of ${fmtRate(spotAtMaturity, "en")}. What total EUR amount will it receive?`,
      },
      numericUnit: { fr: "EUR", en: "EUR" },
      numericTolerance: "± 20",
      hint: { fr: "Montant total = (portion couverte × F0) + (portion non couverte × spot final).", en: "Total amount = (hedged portion × F0) + (uncovered portion × final spot)." },
      numeric: { value: totalEur, tolerance: 20 },
      calculation: {
        fr: `Couvert = ${fmtAmount(hedgedAmount, "fr")} × ${fmtRate(forwardRate, "fr")} ; Non couvert = ${fmtAmount(unhedgedAmount, "fr")} × ${fmtRate(spotAtMaturity, "fr")}. Total = ${fmtAmount(totalEur, "fr")} EUR.`,
        en: `Hedged = ${fmtAmount(hedgedAmount, "en")} × ${fmtRate(forwardRate, "en")}; Uncovered = ${fmtAmount(unhedgedAmount, "en")} × ${fmtRate(spotAtMaturity, "en")}. Total = ${fmtAmount(totalEur, "en")} EUR.`,
      },
      explanation: {
        fr: "Avec une couverture partielle, le résultat total combine un montant certain (la portion couverte, au taux F0 fixé) et un montant incertain (la portion non couverte, au taux spot qui ne sera connu qu'à l'échéance) : le taux effectif final se situe donc entre F0 et le taux spot réalisé.",
        en: "With a partial hedge, the total outcome blends a certain amount (the hedged portion, at the fixed F0 rate) and an uncertain amount (the uncovered portion, at the spot rate only known at maturity): the final effective rate therefore sits between F0 and the realized spot rate.",
      },
      commonMistake: {
        fr: "Appliquer le taux forward F0 à la totalité du montant, en oubliant que seule la portion effectivement couverte en bénéficie.",
        en: "Applying the forward rate F0 to the entire amount, forgetting only the portion actually hedged benefits from it.",
      },
    };
  },
};

const regretRiskErrorTemplate = trueFalseTemplate({
  id: "m02-couverture-erreur-taux-optimal",
  conceptId: "m02-couverture-forward",
  difficulty: "medium",
  statement: {
    fr: "Se couvrir avec un forward garantit d'obtenir le meilleur taux de change possible par rapport à ne pas se couvrir du tout.",
    en: "Hedging with a forward guarantees getting the best possible exchange rate compared to not hedging at all.",
  },
  correct: false,
  explanation: {
    fr: "Faux : un forward garantit un taux CONNU à l'avance, pas le meilleur taux possible. Si le marché évolue favorablement, l'entreprise couverte peut regretter de ne pas avoir profité du taux spot plus avantageux — c'est le \"risque de regret\", le prix psychologique et financier de la certitude achetée.",
    en: "False: a forward guarantees a rate KNOWN in advance, not the best possible rate. If the market moves favorably, the hedged company may regret not having benefited from the more advantageous spot rate — this is \"regret risk\", the psychological and financial price of the certainty purchased.",
  },
  commonMistake: {
    fr: "Confondre l'objectif d'une couverture (éliminer l'incertitude) avec celui d'optimiser le résultat financier (obtenir le meilleur taux), qui ne sont pas la même chose.",
    en: "Confusing a hedge's goal (eliminating uncertainty) with optimizing the financial outcome (getting the best rate), which are not the same thing.",
  },
});

const hedgeRatioDecisionScenarioTemplate = mcqTemplate({
  id: "m02-couverture-scenario-ratio-couverture",
  conceptId: "m02-couverture-forward",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un directeur financier n'est pas certain à 100% du montant exact de sa créance future en devise (les prévisions de ventes export varient de ±15%). Pourquoi choisirait-il volontairement de ne couvrir que 70% du montant prévu, plutôt que 100% ?",
    en: "A CFO is not 100% certain of the exact future foreign-currency receivable amount (export sales forecasts vary by ±15%). Why would they deliberately choose to hedge only 70% of the forecast amount, rather than 100%?",
  },
  choices: [
    { id: "avoid-over-hedge", label: { fr: "Pour éviter de se retrouver en situation de sur-couverture (position spéculative) si les ventes réelles sont finalement inférieures à la prévision", en: "To avoid ending up over-hedged (a speculative position) if actual sales end up below the forecast" } },
    { id: "cheaper", label: { fr: "Parce qu'une couverture à 70% coûte systématiquement moins cher par contrat", en: "Because a 70% hedge is systematically cheaper per contract" } },
    { id: "no-reason", label: { fr: "Il n'y a aucune bonne raison, il faut toujours couvrir 100% de la prévision", en: "There's no good reason, you should always hedge 100% of the forecast" } },
  ],
  correctId: "avoid-over-hedge",
  hint: { fr: "Rappelez-vous ce qui se passe en cas de sur-couverture si l'exposition réelle est plus petite que prévu.", en: "Remember what happens with over-hedging if the real exposure turns out smaller than forecast." },
  explanation: {
    fr: "Face à une incertitude sur le montant même de l'exposition future, couvrir un pourcentage prudent (inférieur à la prévision haute) réduit le risque de sur-couverture : si les ventes réelles déçoivent, l'entreprise reste couverte sur un montant qu'elle est raisonnablement sûre d'avoir réalisé, évitant de transformer une partie de sa couverture en pari spéculatif non adossé.",
    en: "Facing uncertainty about the future exposure's very amount, hedging a conservative percentage (below the high forecast) reduces over-hedging risk: if actual sales disappoint, the company stays hedged on an amount it is reasonably confident it actually realized, avoiding turning part of its hedge into an unbacked speculative bet.",
  },
  commonMistake: {
    fr: "Ignorer l'incertitude sur le montant même de l'exposition future, en couvrant systématiquement 100% d'une prévision qui pourrait ne pas se réaliser intégralement.",
    en: "Ignoring the uncertainty in the future exposure's very amount, systematically hedging 100% of a forecast that might not fully materialize.",
  },
});

export const templates: QuestionTemplate[] = [
  directionTemplate,
  conversionTemplate,
  certaintyTemplate,
  basisRiskVocabTemplate,
  basisRiskNumericTemplate,
  comprehensionTemplate,
  hedgedVsUnhedgedComparisonTemplate,
  whatIfPartialHedgeTemplate,
  whatIfOverHedgeTemplate,
  partialHedgeBlendedRateNumericTemplate,
  regretRiskErrorTemplate,
  hedgeRatioDecisionScenarioTemplate,
];
