import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const classifyTemplate: QuestionTemplate = {
  id: "m02-contango-classification",
  conceptId: "m02-contango-backwardation",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 300);
    const isContango = pick(rng, [true, false] as const);
    const F0 = isContango ? S0 + randomInt(rng, 2, 40) : S0 - randomInt(rng, 2, 40);
    const correctId = isContango ? "contango" : "backwardation";

    return {
      prompt: {
        fr: `S0 = ${fmt(S0, "fr")}, F0 = ${fmt(F0, "fr")}. Ce marché est-il en contango ou en backwardation ?`,
        en: `S0 = ${fmt(S0, "en")}, F0 = ${fmt(F0, "en")}. Is this market in contango or backwardation?`,
      },
      choices: buildChoices([
        { id: "contango", label: { fr: "Contango", en: "Contango" } },
        { id: "backwardation", label: { fr: "Backwardation", en: "Backwardation" } },
      ]),
      hint: {
        fr: "Comparez F0 à S0 : Base = F0 − S0.",
        en: "Compare F0 to S0: Basis = F0 − S0.",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: `Base = ${fmt(F0, "fr")} − ${fmt(S0, "fr")} = ${fmt(F0 - S0, "fr")}, ${isContango ? "positive donc contango" : "négative donc backwardation"}.`,
        en: `Basis = ${fmt(F0, "en")} − ${fmt(S0, "en")} = ${fmt(F0 - S0, "en")}, ${isContango ? "positive so contango" : "negative so backwardation"}.`,
      },
      commonMistake: {
        fr: "Inverser les deux définitions (contango = F0 supérieur à S0, pas l'inverse).",
        en: "Swapping the two definitions (contango = F0 above S0, not the reverse).",
      },
    };
  },
};

const basisNumericTemplate: QuestionTemplate = {
  id: "m02-contango-base-calcul",
  conceptId: "m02-contango-backwardation",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 40, 250);
    const F0 = randomInt(rng, 40, 250);
    const base = F0 - S0;

    return {
      prompt: {
        fr: `S0 = ${fmt(S0, "fr")}, F0 = ${fmt(F0, "fr")}. Calculez la base (F0 − S0).`,
        en: `S0 = ${fmt(S0, "en")}, F0 = ${fmt(F0, "en")}. Compute the basis (F0 − S0).`,
      },
      numericUnit: { fr: "même unité que le prix", en: "same unit as the price" },
      numericTolerance: "± 0.1",
      hint: {
        fr: "Base = F0 − S0.",
        en: "Basis = F0 − S0.",
      },
      numeric: { value: base, tolerance: 0.1 },
      calculation: {
        fr: `Base = ${fmt(F0, "fr")} − ${fmt(S0, "fr")} = ${fmt(base, "fr")}.`,
        en: `Basis = ${fmt(F0, "en")} − ${fmt(S0, "en")} = ${fmt(base, "en")}.`,
      },
      explanation: {
        fr: "Une base positive signale un contango, une base négative signale une backwardation.",
        en: "A positive basis signals contango, a negative basis signals backwardation.",
      },
      commonMistake: {
        fr: "Calculer S0 − F0 au lieu de F0 − S0, ce qui inverse le signe et la conclusion.",
        en: "Computing S0 − F0 instead of F0 − S0, which flips the sign and the conclusion.",
      },
    };
  },
};

const noForecastTemplate: QuestionTemplate = {
  id: "m02-contango-anticipation",
  conceptId: "m02-contango-backwardation",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un marché en backwardation signifie que les investisseurs anticipent une baisse future du prix spot.",
      en: "A market in backwardation means investors expect the spot price to fall in the future.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la backwardation reflète surtout un rendement de convenance dominant (stocks tendus aujourd'hui), pas une prévision sur le prix spot futur. C'est l'une des confusions les plus fréquentes sur ce sujet.",
      en: "False: backwardation mostly reflects a dominant convenience yield (tight inventories today), not a forecast of the future spot price. This is one of the most common confusions on this topic.",
    },
    commonMistake: {
      fr: "Lire la forme de la courbe à terme comme une prédiction directionnelle du marché.",
      en: "Reading the forward curve's shape as the market's directional prediction.",
    },
  }),
};

const rollCostTemplate: QuestionTemplate = {
  id: "m02-contango-cout-roll",
  conceptId: "m02-contango-backwardation",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const nearPrice = randomInt(rng, 60, 90);
    const farPrice = nearPrice + randomInt(rng, 3, 15);

    return {
      isScenario: true,
      prompt: {
        fr: `Un fonds indiciel doit \"rouler\" sa position : vendre son contrat proche de l'échéance à ${fmt(nearPrice, "fr")} et racheter un contrat plus lointain à ${fmt(farPrice, "fr")}, le marché étant en contango. Quel est l'effet de ce roulement sur la performance du fonds, à prix spot inchangé ?`,
        en: `An index fund must \"roll\" its position: sell its near-expiry contract at ${fmt(nearPrice, "en")} and buy a more distant contract at ${fmt(farPrice, "en")}, with the market in contango. What effect does this rolling have on the fund's performance, with the spot price unchanged?`,
      },
      choices: buildChoices([
        { id: "loss", label: { fr: "Un coût récurrent qui pèse sur la performance", en: "A recurring cost that drags on performance" } },
        { id: "gain", label: { fr: "Un gain récurrent qui améliore la performance", en: "A recurring gain that improves performance" } },
        { id: "neutral", label: { fr: "Aucun effet, le roulement est toujours neutre", en: "No effect, rolling is always neutral" } },
      ]),
      hint: {
        fr: "En contango, le contrat plus lointain est plus cher que le contrat proche : que se passe-t-il quand on vend moins cher pour racheter plus cher ?",
        en: "In contango, the far contract is pricier than the near one: what happens when you sell cheap to buy expensive?",
      },
      correctChoiceIds: ["loss"],
      explanation: {
        fr: `Vendre à ${fmt(nearPrice, "fr")} pour racheter à ${fmt(farPrice, "fr")} coûte ${fmt(farPrice - nearPrice, "fr")} par contrat à chaque roulement, même si le prix spot ne bouge pas : c'est le \"coût de roll\" typique d'un marché en contango persistant.`,
        en: `Selling at ${fmt(nearPrice, "en")} to buy back at ${fmt(farPrice, "en")} costs ${fmt(farPrice - nearPrice, "en")} per contract on every roll, even if the spot price does not move: this is the typical "roll cost" of a persistently contango market.`,
      },
      commonMistake: {
        fr: "Croire que seule l'évolution du prix spot détermine la performance d'un produit qui roule des futures — le coût de roll peut être significatif indépendamment du spot.",
        en: "Believing only the spot price's evolution determines the performance of a product that rolls futures — the roll cost can be significant independent of spot.",
      },
    };
  },
};

const comprehensionTemplate = mcqTemplate({
  id: "m02-contango-comprehension-utilite",
  conceptId: "m02-contango-backwardation",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi un investisseur qui détient un ETF de matières premières via des futures (et non l'actif physique) doit-il se préoccuper de la forme de la courbe à terme (contango ou backwardation) ?",
    en: "Why must an investor holding a commodity ETF via futures (not the physical asset) care about the forward curve's shape (contango or backwardation)?",
  },
  choices: [
    { id: "roll-return", label: { fr: "Parce que rouler périodiquement les contrats produit un rendement de roulement, positif ou négatif selon la forme de la courbe, qui s'ajoute au rendement du prix spot", en: "Because periodically rolling contracts produces a roll return, positive or negative depending on the curve's shape, which adds to the spot price's return" } },
    { id: "no-impact", label: { fr: "La forme de la courbe n'a aucun impact, seul le prix spot compte au final", en: "The curve's shape has no impact, only the spot price matters in the end" } },
    { id: "tax", label: { fr: "Uniquement pour des raisons de fiscalité sur les plus-values", en: "Only for capital gains tax reasons" } },
  ],
  correctId: "roll-return",
  hint: { fr: "Un ETF sur futures ne détient jamais l'actif physique : il doit rouler ses contrats avant chaque échéance.", en: "A futures-based ETF never holds the physical asset: it must roll its contracts before each expiry." },
  explanation: {
    fr: "Un ETF sur futures doit vendre le contrat proche de l'échéance et en racheter un plus lointain avant chaque expiration : en contango, cette opération coûte systématiquement de l'argent (rendement de roulement négatif) ; en backwardation, elle en rapporte (rendement de roulement positif). Sur la durée, cet effet peut peser autant, voire plus, que le mouvement du prix spot lui-même sur la performance totale de l'ETF.",
    en: "A futures-based ETF must sell the near-expiry contract and buy a more distant one before each expiration: in contango, this operation systematically costs money (negative roll return); in backwardation, it earns money (positive roll return). Over time, this effect can weigh as much, or more, than the spot price's own move on the ETF's total performance.",
  },
  commonMistake: {
    fr: "Croire que la performance d'un ETF sur futures suit uniquement le prix spot de la matière première sous-jacente, en ignorant le rendement de roulement.",
    en: "Believing a futures-based ETF's performance tracks only the underlying commodity's spot price, ignoring the roll return.",
  },
});

const rollReturnSignComparisonTemplate = mcqTemplate({
  id: "m02-contango-comparaison-signe-roll-yield",
  conceptId: "m02-contango-backwardation",
  difficulty: "medium",
  prompt: {
    fr: "Comparez, à prix spot final strictement inchangé, le rendement de roulement d'une position longue sur futures dans un marché en CONTANGO versus dans un marché en BACKWARDATION.",
    en: "Compare, with the final spot price strictly unchanged, the roll return of a long futures position in a CONTANGO market versus a BACKWARDATION market.",
  },
  choices: [
    { id: "opposite", label: { fr: "Négatif en contango (on rachète plus cher), positif en backwardation (on rachète moins cher)", en: "Negative in contango (you buy back more expensive), positive in backwardation (you buy back cheaper)" } },
    { id: "always-positive", label: { fr: "Toujours positif dans les deux cas, tant que le spot ne bouge pas", en: "Always positive in both cases, as long as spot doesn't move" } },
    { id: "always-negative", label: { fr: "Toujours négatif dans les deux cas, le roulement coûte systématiquement", en: "Always negative in both cases, rolling systematically costs money" } },
  ],
  correctId: "opposite",
  hint: { fr: "En contango, le contrat lointain est plus cher que le proche ; en backwardation, c'est l'inverse.", en: "In contango, the far contract is pricier than the near one; in backwardation, it's the opposite." },
  explanation: {
    fr: "En contango, le contrat lointain racheté est plus cher que le contrat proche vendu : chaque roulement coûte de l'argent, un rendement de roulement négatif. En backwardation, c'est l'inverse — le contrat lointain racheté est moins cher : chaque roulement dégage un gain, un rendement de roulement positif. La forme de la courbe détermine donc directement le signe de cet effet, indépendamment du mouvement du spot.",
    en: "In contango, the far contract bought back is pricier than the near contract sold: every roll costs money, a negative roll return. In backwardation, it's the reverse — the far contract bought back is cheaper: every roll generates a gain, a positive roll return. The curve's shape therefore directly determines this effect's sign, independent of the spot's move.",
  },
  commonMistake: {
    fr: "Croire que le rendement de roulement est toujours défavorable, en oubliant qu'il devient un avantage structurel en marché de backwardation.",
    en: "Believing the roll return is always unfavorable, forgetting it becomes a structural advantage in a backwardated market.",
  },
});

const whatIfRegimeFlipTemplate = mcqTemplate({
  id: "m02-contango-whatif-basculement-regime",
  conceptId: "m02-contango-backwardation",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un marché pétrolier était en contango depuis des mois, puis bascule brutalement en backwardation suite à une coupe de production surprise (l'offre immédiate se resserre). Pour un fonds indiciel qui roule des positions longues, quel est l'effet de ce basculement sur son rendement de roulement ?",
    en: "An oil market had been in contango for months, then abruptly flips to backwardation after a surprise production cut (immediate supply tightens). For an index fund rolling long positions, what is the effect of this shift on its roll return?",
  },
  choices: [
    { id: "improves", label: { fr: "Le rendement de roulement passe d'un frein (négatif) à un soutien (positif) pour la performance", en: "The roll return switches from a drag (negative) to a tailwind (positive) on performance" } },
    { id: "worsens", label: { fr: "Le rendement de roulement devient encore plus négatif", en: "The roll return becomes even more negative" } },
    { id: "unaffected", label: { fr: "Le rendement de roulement ne dépend jamais de la forme de la courbe", en: "The roll return never depends on the curve's shape" } },
  ],
  correctId: "improves",
  hint: { fr: "Contango → roll négatif ; backwardation → roll positif : le basculement inverse donc le signe.", en: "Contango → negative roll; backwardation → positive roll: the flip therefore reverses the sign." },
  explanation: {
    fr: "Le passage du contango à la backwardation inverse le signe du rendement de roulement : ce qui pesait sur la performance du fonds (racheter systématiquement plus cher) devient désormais un soutien (racheter systématiquement moins cher), indépendamment de ce que fait le prix spot du pétrole lui-même sur la même période.",
    en: "The shift from contango to backwardation reverses the roll return's sign: what was dragging on the fund's performance (systematically buying back more expensive) now becomes a tailwind (systematically buying back cheaper), independent of what the oil spot price itself does over the same period.",
  },
  commonMistake: {
    fr: "Se concentrer uniquement sur l'effet de la coupe de production sur le prix spot, en oubliant son effet tout aussi important sur la forme de la courbe et donc sur le rendement de roulement.",
    en: "Focusing only on the production cut's effect on the spot price, forgetting its equally important effect on the curve's shape and hence on the roll return.",
  },
});

const whatIfFlatSpotBackwardationTemplate = mcqTemplate({
  id: "m02-contango-whatif-spot-stable-backwardation",
  conceptId: "m02-contango-backwardation",
  difficulty: "medium",
  prompt: {
    fr: "Un marché est en backwardation persistante, et le prix spot reste parfaitement stable pendant plusieurs mois. Un investisseur qui détient une position longue en roulant ses futures réalise-t-il tout de même un gain ?",
    en: "A market is in persistent backwardation, and the spot price stays perfectly stable for several months. Does an investor holding a long position while rolling futures still earn a gain?",
  },
  choices: [
    { id: "yes-roll", label: { fr: "Oui, grâce au seul rendement de roulement positif, même sans aucun mouvement de prix spot", en: "Yes, from the positive roll return alone, even with no spot price movement at all" } },
    { id: "no", label: { fr: "Non, sans mouvement de prix spot, il ne peut y avoir aucun gain", en: "No, with no spot price movement, there can be no gain at all" } },
    { id: "loss", label: { fr: "Non, il subit nécessairement une perte de roulement", en: "No, they necessarily suffer a roll loss" } },
  ],
  correctId: "yes-roll",
  hint: { fr: "Le rendement total d'une position longue sur futures se décompose en rendement du spot ET rendement de roulement, deux sources distinctes.", en: "A long futures position's total return splits into the spot's return AND the roll return, two distinct sources." },
  explanation: {
    fr: "C'est une des idées les plus contre-intuitives du sujet : même à prix spot rigoureusement inchangé, une position longue roulée en marché de backwardation persistante génère un gain, uniquement issu du rendement de roulement positif (racheter systématiquement moins cher que le prix vendu). C'est ce mécanisme qui explique pourquoi certains fonds cherchent activement une exposition aux marchés en backwardation.",
    en: "This is one of the topic's most counter-intuitive ideas: even with the spot price strictly unchanged, a long position rolled in a persistently backwardated market generates a gain, purely from the positive roll return (systematically buying back cheaper than the price sold). This mechanism is why some funds actively seek exposure to backwardated markets.",
  },
  commonMistake: {
    fr: "Croire que la seule source de rendement possible sur une position futures est le mouvement du prix spot, en oubliant totalement la composante de roulement.",
    en: "Believing the only possible source of return on a futures position is the spot price's movement, entirely forgetting the roll component.",
  },
});

const totalReturnDecompositionNumericTemplate: QuestionTemplate = {
  id: "m02-contango-decomposition-rendement-calcul",
  conceptId: "m02-contango-backwardation",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const spotStart = randomInt(rng, 50, 200);
    const spotEnd = spotStart + randomInt(rng, -20, 20);
    const nearPrice = spotStart + randomInt(rng, -10, 10);
    const farPrice = nearPrice + randomInt(rng, -12, 12);
    const spotReturn = Math.round(((spotEnd - spotStart) / spotStart) * 10000) / 100;
    const rollReturn = Math.round(((nearPrice - farPrice) / nearPrice) * 10000) / 100;
    const totalReturn = Math.round((spotReturn + rollReturn) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position longue roulée sur futures a : prix spot de ${spotStart} à ${spotEnd} sur la période (rendement spot = ${spotReturn.toFixed(2)}%), et un roulement où le contrat proche vendu était à ${nearPrice} contre un contrat lointain racheté à ${farPrice} (rendement de roulement = ${rollReturn.toFixed(2)}%). Quel est le rendement total approximatif de la position ?`,
        en: `A rolled long futures position has: a spot price moving from ${spotStart} to ${spotEnd} over the period (spot return = ${spotReturn.toFixed(2)}%), and a roll where the sold near contract was at ${nearPrice} versus a far contract bought back at ${farPrice} (roll return = ${rollReturn.toFixed(2)}%). What is the position's approximate total return?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.3",
      hint: { fr: "Rendement total ≈ rendement spot + rendement de roulement.", en: "Total return ≈ spot return + roll return." },
      numeric: { value: totalReturn, tolerance: 0.3 },
      calculation: {
        fr: `Rendement total ≈ ${spotReturn.toFixed(2)}% + ${rollReturn.toFixed(2)}% = ${totalReturn.toFixed(2)}%.`,
        en: `Total return ≈ ${spotReturn.toFixed(2)}% + ${rollReturn.toFixed(2)}% = ${totalReturn.toFixed(2)}%.`,
      },
      explanation: {
        fr: "Le rendement total d'une position sur futures roulée se décompose (en approximation) en deux sources indépendantes : le rendement du prix spot sous-jacent, et le rendement de roulement issu de la forme de la courbe à terme — les deux peuvent jouer dans le même sens ou se compenser partiellement.",
        en: "A rolled futures position's total return breaks down (approximately) into two independent sources: the underlying spot price's return, and the roll return from the forward curve's shape — the two can move in the same direction or partly offset each other.",
      },
      commonMistake: {
        fr: "Ne comptabiliser que le rendement spot en ignorant totalement la composante de roulement, ou l'inverse.",
        en: "Only accounting for the spot return while entirely ignoring the roll component, or the reverse.",
      },
    };
  },
};

const contangoAlwaysPositiveRollErrorTemplate = trueFalseTemplate({
  id: "m02-contango-erreur-roll-toujours-positif",
  conceptId: "m02-contango-backwardation",
  difficulty: "medium",
  statement: {
    fr: "Rouler des futures dans un marché en CONTANGO procure généralement un rendement de roulement positif à une position longue, à prix spot inchangé.",
    en: "Rolling futures in a CONTANGO market generally provides a positive roll return to a long position, with spot price unchanged.",
  },
  correct: false,
  explanation: {
    fr: "Faux : c'est exactement l'inverse. En contango, le contrat lointain est plus cher que le contrat proche : une position longue roulée vend moins cher et rachète plus cher, ce qui produit un rendement de roulement NÉGATIF, un frein récurrent sur la performance même si le prix spot ne bouge pas.",
    en: "False: it's exactly the reverse. In contango, the far contract is pricier than the near one: a rolled long position sells cheap and buys back expensive, producing a NEGATIVE roll return, a recurring drag on performance even if the spot price doesn't move.",
  },
  commonMistake: {
    fr: "Inverser les deux régimes : c'est la backwardation, pas le contango, qui procure un rendement de roulement positif à une position longue.",
    en: "Swapping the two regimes: it's backwardation, not contango, that provides a positive roll return to a long position.",
  },
});

const etfParadoxScenarioTemplate = mcqTemplate({
  id: "m02-contango-scenario-paradoxe-etf",
  conceptId: "m02-contango-backwardation",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Sur 3 ans, le prix spot du gaz naturel a globalement progressé de +10%, mais un ETF gaz naturel basé sur des futures affiche une performance de −25% sur la même période. Le marché du gaz naturel était en contango persistant et marqué sur cette période. Quelle est l'explication la plus probable de cet écart ?",
    en: "Over 3 years, natural gas spot prices overall rose +10%, but a futures-based natural gas ETF shows a −25% return over the same period. The natural gas market was in persistent, marked contango over that period. What is the most likely explanation for this gap?",
  },
  choices: [
    { id: "roll-drag", label: { fr: "Un rendement de roulement négatif cumulé et important, propre au contango persistant, qui a plus que compensé la hausse du spot", en: "A large cumulative negative roll return, specific to the persistent contango, which more than offset the spot's rise" } },
    { id: "fraud", label: { fr: "L'ETF ne suit probablement pas correctement son indice de référence", en: "The ETF probably isn't correctly tracking its benchmark index" } },
    { id: "tax-only", label: { fr: "L'écart s'explique uniquement par des frais de gestion et fiscaux", en: "The gap is explained solely by management fees and taxes" } },
  ],
  correctId: "roll-drag",
  hint: { fr: "Un ETF sur futures roule ses contrats régulièrement ; en contango marqué et persistant sur 3 ans, cet effet peut être considérable.", en: "A futures-based ETF rolls its contracts regularly; in a marked, persistent contango over 3 years, this effect can be considerable." },
  explanation: {
    fr: "C'est un phénomène bien documenté sur les ETF de matières premières en contango persistant (notamment le gaz naturel) : le rendement de roulement négatif, répété à chaque roulement sur 3 ans, peut largement dépasser en ampleur le mouvement du prix spot lui-même, produisant un écart spectaculaire entre la performance du spot et celle de l'ETF — un piège classique pour les investisseurs qui ne comprennent pas la mécanique de roulement.",
    en: "This is a well-documented phenomenon in persistently contango commodity ETFs (natural gas being a notable case): the negative roll return, repeated at every roll over 3 years, can far exceed in magnitude the spot price's own movement, producing a dramatic gap between the spot's performance and the ETF's — a classic trap for investors who don't understand the roll mechanics.",
  },
  commonMistake: {
    fr: "Chercher une explication liée à la fraude ou au mauvais suivi d'indice, sans envisager d'abord la cause la plus courante et documentée : le coût de roulement cumulé en contango persistant.",
    en: "Looking for an explanation involving fraud or poor index tracking, without first considering the most common and well-documented cause: the cumulative roll cost in persistent contango.",
  },
});

const seasonalGasVsOilScenarioTemplate = mcqTemplate({
  id: "m02-contango-scenario-saisonnalite-gaz-petrole",
  conceptId: "m02-contango-backwardation",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Le gaz naturel affiche souvent un contango saisonnier marqué (stockage nécessaire pour l'hiver), tandis que le pétrole brut est plus fréquemment en backwardation modérée (flux de production plus régulier). Pour un investisseur \"buy-and-hold\" via futures sur longue période, quelle implication en tirer ?",
    en: "Natural gas often shows a marked seasonal contango (storage needed for winter), while crude oil is more frequently in mild backwardation (steadier production flow). What implication should a long-term \"buy-and-hold\" futures investor draw?",
  },
  choices: [
    { id: "curve-matters", label: { fr: "Le choix de la matière première importe autant que l'anticipation sur son prix spot, à cause du rendement de roulement structurellement différent des deux marchés", en: "The choice of commodity matters as much as the spot price forecast, because of the two markets' structurally different roll return" } },
    { id: "irrelevant", label: { fr: "Cette différence de structure de courbe n'a aucune conséquence sur le choix d'investissement à long terme", en: "This curve-structure difference has no consequence for a long-term investment choice" } },
    { id: "always-avoid-futures", label: { fr: "Il faut toujours éviter les futures sur matières premières, quelle que soit la matière première", en: "Futures on commodities should always be avoided, regardless of the commodity" } },
  ],
  correctId: "curve-matters",
  hint: { fr: "Deux matières premières avec la même anticipation de prix spot peuvent donner des résultats très différents via futures, selon la structure de leur courbe.", en: "Two commodities with the same spot price forecast can give very different results via futures, depending on their curve structure." },
  explanation: {
    fr: "Sur le long terme, un marché structurellement en contango (comme souvent le gaz naturel) impose un frein de roulement récurrent à une position longue via futures, tandis qu'un marché plus souvent en backwardation (comme souvent le pétrole) peut au contraire offrir un léger soutien structurel. Un investisseur \"buy-and-hold\" doit donc analyser la structure de courbe typique de chaque matière première, pas seulement ses anticipations sur le prix spot, avant de choisir une exposition via futures.",
    en: "Over the long run, a structurally contango market (as natural gas often is) imposes a recurring roll drag on a long futures position, while a market more often in backwardation (as oil often is) can instead offer a slight structural tailwind. A \"buy-and-hold\" investor must therefore analyze each commodity's typical curve structure, not just their spot price forecast, before choosing a futures-based exposure.",
  },
  commonMistake: {
    fr: "Choisir une exposition à une matière première uniquement sur la base de ses anticipations de prix spot, en ignorant l'effet cumulatif à long terme de la structure de sa courbe à terme.",
    en: "Choosing a commodity exposure based solely on spot price forecasts, ignoring the long-term cumulative effect of its forward curve's structure.",
  },
});

export const templates: QuestionTemplate[] = [
  classifyTemplate,
  basisNumericTemplate,
  noForecastTemplate,
  rollCostTemplate,
  comprehensionTemplate,
  rollReturnSignComparisonTemplate,
  whatIfRegimeFlipTemplate,
  whatIfFlatSpotBackwardationTemplate,
  totalReturnDecompositionNumericTemplate,
  contangoAlwaysPositiveRollErrorTemplate,
  etfParadoxScenarioTemplate,
  seasonalGasVsOilScenarioTemplate,
];
