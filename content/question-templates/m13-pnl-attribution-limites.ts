import { randomInt, pick, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const comprehensionTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-comprehension",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "medium",
  prompt: {
    fr: "Que signifie \"attribuer le P&L\" d'un portefeuille ?",
    en: "What does \"attributing a portfolio's P&L\" mean?",
  },
  choices: [
    { id: "decompose-by-risk-factor", label: { fr: "Décomposer le résultat total en contributions liées à chaque facteur de risque identifié (taux, crédit, actions...), plus carry, coûts et un résidu inexpliqué", en: "Breaking down the total result into contributions tied to each identified risk factor (rates, credit, equities...), plus carry, costs and an unexplained residual" } },
    { id: "sum-all-trades", label: { fr: "Faire la simple somme de tous les trades exécutés dans la journée, sans autre décomposition", en: "Simply summing all trades executed during the day, with no further breakdown" } },
    { id: "assign-blame-to-trader", label: { fr: "Désigner le trader responsable d'une perte, à des fins purement disciplinaires", en: "Designating the trader responsible for a loss, for purely disciplinary purposes" } },
    { id: "forecast-next-day-pnl", label: { fr: "Prévoir le P&L du lendemain à partir des tendances de marché observées", en: "Forecasting the next day's P&L from observed market trends" } },
  ],
  correctId: "decompose-by-risk-factor",
  hint: { fr: "L'objectif est de comprendre D'OÙ vient le résultat, facteur par facteur, pas seulement de constater un chiffre.", en: "The goal is understanding WHERE the result comes from, factor by factor, not just observing a number." },
  explanation: {
    fr: "Attribuer le P&L consiste précisément à décomposer le résultat total en contributions identifiables par facteur de risque, plus le carry et les coûts, avec un résidu inexpliqué : ce n'est ni une simple sommation de trades, ni un exercice disciplinaire, ni une prévision du P&L futur.",
    en: "Attributing P&L precisely means breaking down the total result into identifiable contributions by risk factor, plus carry and costs, with an unexplained residual: it is neither a simple summation of trades, nor a disciplinary exercise, nor a forecast of future P&L.",
  },
  commonMistake: {
    fr: "Confondre l'attribution du P&L avec une simple addition des trades de la journée, en ignorant la décomposition par facteur de risque.",
    en: "Confusing P&L attribution with a simple addition of the day's trades, ignoring the breakdown by risk factor.",
  },
});

const explainedVsUnexplainedComparisonTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-comparaison-explique-inexplique",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "medium",
  prompt: {
    fr: "En quoi un résultat inexpliqué faible diffère-t-il d'un résultat inexpliqué important, du point de vue de la validation d'un modèle d'attribution ?",
    en: "How does a small unexplained P&L differ from a large one, from the standpoint of validating an attribution model?",
  },
  choices: [
    { id: "small-validates-large-alarms", label: { fr: "Un résultat inexpliqué faible valide la qualité du modèle d'attribution ; un résultat inexpliqué important doit alerter sur une possible erreur ou un facteur de risque manquant", en: "A small unexplained P&L validates the attribution model's quality; a large one should raise alarm about a possible error or a missing risk factor" } },
    { id: "both-equally-acceptable", label: { fr: "Les deux sont également acceptables, l'ampleur du résultat inexpliqué n'ayant aucune signification particulière", en: "Both are equally acceptable, the unexplained P&L's magnitude having no particular significance" } },
    { id: "large-always-preferred", label: { fr: "Un résultat inexpliqué important est en réalité préférable, car il signale une gestion de risque plus prudente", en: "A large unexplained P&L is actually preferable, as it signals more cautious risk management" } },
    { id: "unexplained-always-zero-by-construction", label: { fr: "Le résultat inexpliqué est toujours rigoureusement nul par construction, quel que soit le modèle utilisé", en: "The unexplained P&L is always strictly zero by construction, whatever the model used" } },
  ],
  correctId: "small-validates-large-alarms",
  hint: { fr: "Le résultat inexpliqué mesure la qualité du modèle : que signifie un écart important entre P&L expliqué et P&L total observé ?", en: "The unexplained P&L measures the model's quality: what does a large gap between explained and observed total P&L mean?" },
  explanation: {
    fr: "Un résultat inexpliqué faible et stable confirme que le modèle d'attribution capture correctement l'essentiel du P&L via les facteurs identifiés, tandis qu'un résultat inexpliqué important signale un problème potentiel (erreur de valorisation, facteur de risque manquant, non-linéarité non capturée) qui doit être investigué : ce n'est ni indifférent, ni préférable d'avoir un résultat inexpliqué élevé, et il n'est jamais garanti d'être nul par construction.",
    en: "A small, stable unexplained P&L confirms the attribution model correctly captures the bulk of P&L via the identified factors, while a large unexplained P&L signals a potential problem (valuation error, missing risk factor, uncaptured nonlinearity) that must be investigated: it is neither indifferent, nor preferable to have a high unexplained P&L, and it is never guaranteed to be zero by construction.",
  },
  commonMistake: {
    fr: "Considérer l'ampleur du résultat inexpliqué comme sans importance, en ignorant qu'elle constitue un indicateur direct de la qualité du modèle d'attribution.",
    en: "Considering the unexplained P&L's magnitude as unimportant, ignoring that it is a direct indicator of the attribution model's quality.",
  },
});

const positiveTotalHidesRiskWhatIfTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-what-if-pnl-positif-risque-cache",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un portefeuille affiche un P&L total positif sur la journée. L'attribution révèle une forte perte liée à une exposition de change non désirée, compensée par un gain fortuit sur les taux. Que révèle cette décomposition que le seul chiffre total ne montrait pas ?",
    en: "A portfolio shows a positive total P&L for the day. Attribution reveals a large loss tied to an undesired FX exposure, offset by a fortunate gain on rates. What does this breakdown reveal that the total figure alone didn't show?",
  },
  choices: [
    { id: "hidden-undesired-risk", label: { fr: "Un risque de change non désiré s'est matérialisé négativement, masqué par un gain sur un facteur totalement distinct : le résultat global positif ne garantit pas que les risques pris se comportent comme prévu", en: "An undesired FX risk materialized negatively, masked by a gain on a totally distinct factor: a positive overall result doesn't guarantee the risks taken behaved as expected" } },
    { id: "no-additional-information", label: { fr: "Aucune information supplémentaire : un P&L total positif suffit à conclure que la gestion des risques du portefeuille est saine", en: "No additional information: a positive total P&L is enough to conclude the portfolio's risk management is sound" } },
    { id: "fx-exposure-was-intentional", label: { fr: "L'exposition de change devait nécessairement être intentionnelle, puisque le résultat final reste positif", en: "The FX exposure must necessarily have been intentional, since the final result stays positive" } },
    { id: "attribution-only-useful-for-losses", label: { fr: "L'attribution du P&L ne présente un intérêt que lorsque le résultat total est négatif, jamais lorsqu'il est positif", en: "P&L attribution is only useful when the total result is negative, never when it is positive" } },
  ],
  correctId: "hidden-undesired-risk",
  hint: { fr: "Le P&L total positif masque-t-il ou révèle-t-il le problème du risque de change non désiré ?", en: "Does the positive total P&L hide or reveal the problem of the undesired FX risk?" },
  explanation: {
    fr: "Cette décomposition révèle qu'un risque non désiré (change) s'est matérialisé négativement, et que le résultat global positif ne provient que d'une compensation fortuite par un facteur totalement distinct (taux) : sans attribution, ce problème resterait invisible derrière un chiffre total pourtant positif — l'attribution est précisément utile aussi bien quand le résultat total est positif que négatif, pour vérifier que chaque risque se comporte comme attendu.",
    en: "This breakdown reveals an undesired risk (FX) materialized negatively, and the positive overall result only comes from a fortunate offset by a totally distinct factor (rates): without attribution, this problem would stay invisible behind an otherwise positive total figure — attribution is precisely useful both when the total result is positive and negative, to verify each risk behaves as expected.",
  },
  commonMistake: {
    fr: "Se satisfaire d'un P&L total positif sans vérifier son attribution, en ignorant qu'un risque non désiré peut être masqué par une compensation fortuite d'un autre facteur.",
    en: "Being satisfied with a positive total P&L without checking its attribution, ignoring that an undesired risk can be masked by a fortunate offset from another factor.",
  },
});

const growingUnexplainedWhatIfTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-what-if-inexplique-croissant",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le résultat inexpliqué d'un portefeuille, historiquement faible et stable, augmente de façon persistante sur plusieurs semaines consécutives. Quelle est la réaction appropriée ?",
    en: "A portfolio's unexplained P&L, historically small and stable, keeps growing persistently over several consecutive weeks. What is the appropriate reaction?",
  },
  choices: [
    { id: "investigate-model-and-data", label: { fr: "Investiguer le modèle de valorisation et les sensibilités utilisées, cette évolution pouvant signaler une erreur systématique ou un facteur de risque manquant", en: "Investigate the valuation model and the sensitivities used, this evolution potentially signaling a systematic error or a missing risk factor" } },
    { id: "ignore-as-normal-noise", label: { fr: "Ignorer cette évolution, un résultat inexpliqué croissant étant toujours un simple bruit statistique sans signification", en: "Ignore this evolution, a growing unexplained P&L always being mere statistical noise with no significance" } },
    { id: "increase-risk-limits-to-compensate", label: { fr: "Augmenter les limites de risque du portefeuille pour compenser cette évolution", en: "Increase the portfolio's risk limits to compensate for this evolution" } },
    { id: "stop-attribution-entirely", label: { fr: "Cesser d'utiliser l'attribution du P&L, celle-ci étant devenue par nature peu fiable", en: "Stop using P&L attribution altogether, since it has by nature become unreliable" } },
  ],
  correctId: "investigate-model-and-data",
  hint: { fr: "Un résultat inexpliqué qui grandit PERSISTANTMENT, après une période de stabilité, n'est probablement pas un simple bruit ponctuel.", en: "An unexplained P&L that PERSISTENTLY grows, after a period of stability, is probably not mere one-off noise." },
  explanation: {
    fr: "Une augmentation persistante et systématique du résultat inexpliqué, après une période de stabilité, doit déclencher une investigation du modèle de valorisation et des sensibilités utilisées, car elle peut signaler une erreur systématique, un facteur de risque non identifié, ou un problème de données qui s'aggrave : l'ignorer, augmenter les limites de risque sans comprendre la cause, ou abandonner l'attribution seraient tous des réponses inappropriées face à un signal d'alerte réel.",
    en: "A persistent, systematic increase in unexplained P&L, after a period of stability, should trigger an investigation of the valuation model and the sensitivities used, as it can signal a systematic error, an unidentified risk factor, or a worsening data problem: ignoring it, raising risk limits without understanding the cause, or abandoning attribution would all be inappropriate responses to a real warning signal.",
  },
  commonMistake: {
    fr: "Traiter un résultat inexpliqué croissant comme un simple bruit statistique sans conséquence, en ignorant qu'il peut révéler une erreur systématique qui s'aggrave.",
    en: "Treating a growing unexplained P&L as mere inconsequential statistical noise, ignoring it can reveal a worsening systematic error.",
  },
});

const attributionCalcTemplate: QuestionTemplate = {
  id: "m13-pnl-attribution-limites-calcul-attribution",
  conceptId: "m13-pnl-attribution-limites",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const rateContribution = pick(rng, [-200000, -150000, -100000, 100000, 150000] as const);
    const creditContribution = randomInt(rng, 2, 6) * 10000;
    const carry = -randomInt(rng, 2, 8) * 1000;
    const totalPnl = pick(rng, [rateContribution + creditContribution + carry - 5000, rateContribution + creditContribution + carry + 5000] as const);
    const correctUnexplained = totalPnl - (rateContribution + creditContribution + carry);
    const wrongIgnoresCarry = totalPnl - (rateContribution + creditContribution);
    const wrongSign = -correctUnexplained;
    const wrongZero = 0;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille affiche un P&L total de ${fmt(totalPnl, "fr")}. L'attribution identifie une contribution taux de ${fmt(rateContribution, "fr")}, une contribution crédit de ${fmt(creditContribution, "fr")}, et un carry de ${fmt(carry, "fr")}. Quel est le résultat inexpliqué ?`,
        en: `A portfolio shows a total P&L of ${fmt(totalPnl, "en")}. Attribution identifies a rate contribution of ${fmt(rateContribution, "en")}, a credit contribution of ${fmt(creditContribution, "en")}, and a carry of ${fmt(carry, "en")}. What is the unexplained P&L?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(correctUnexplained, "fr")}, en soustrayant la somme des contributions identifiées du P&L total`, en: `${fmt(correctUnexplained, "en")}, by subtracting the sum of identified contributions from the total P&L` } },
        { id: "wrong-ignores-carry", label: { fr: `${fmt(wrongIgnoresCarry, "fr")}, en oubliant d'inclure la contribution du carry dans le calcul`, en: `${fmt(wrongIgnoresCarry, "en")}, forgetting to include the carry contribution in the calculation` } },
        { id: "wrong-sign", label: { fr: `${fmt(wrongSign, "fr")}, en inversant le signe du résultat inexpliqué`, en: `${fmt(wrongSign, "en")}, by flipping the unexplained P&L's sign` } },
        { id: "wrong-zero", label: { fr: `0, en supposant à tort que le résultat inexpliqué est toujours nul par construction`, en: `0, wrongly assuming the unexplained P&L is always zero by construction` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Résultat inexpliqué = P&L total − somme de toutes les contributions identifiées (taux + crédit + carry).", en: "Unexplained P&L = Total P&L − sum of all identified contributions (rates + credit + carry)." },
      explanation: {
        fr: `Inexpliqué = ${fmt(totalPnl, "fr")} − (${fmt(rateContribution, "fr")} + ${fmt(creditContribution, "fr")} + ${fmt(carry, "fr")}) = ${fmt(correctUnexplained, "fr")}. Oublier une contribution (comme le carry) dans la somme, ou inverser le signe du résultat, sont des erreurs fréquentes qui faussent le diagnostic de la qualité du modèle d'attribution.`,
        en: `Unexplained = ${fmt(totalPnl, "en")} − (${fmt(rateContribution, "en")} + ${fmt(creditContribution, "en")} + ${fmt(carry, "en")}) = ${fmt(correctUnexplained, "en")}. Forgetting a contribution (like carry) in the sum, or flipping the result's sign, are frequent errors that distort the attribution model's quality diagnosis.`,
      },
      commonMistake: {
        fr: "Oublier d'inclure toutes les contributions identifiées (notamment le carry) dans le calcul du résultat inexpliqué.",
        en: "Forgetting to include all identified contributions (notably carry) in the unexplained P&L calculation.",
      },
    };
  },
};

const limitBreachActionCalcTemplate: QuestionTemplate = {
  id: "m13-pnl-attribution-limites-calcul-depassement-limite",
  conceptId: "m13-pnl-attribution-limites",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const dv01Limit = randomInt(rng, 5, 15) * 10000;
    const currentDv01 = dv01Limit + randomInt(rng, 1, 5) * 1000;
    const excess = currentDv01 - dv01Limit;
    const wrongPercentage = Math.round((currentDv01 / dv01Limit - 1) * 100);
    const wrongSum = currentDv01 + dv01Limit;
    const wrongHalved = Math.round(excess / 2);

    return {
      isScenario: true,
      prompt: {
        fr: `La limite de DV01 d'un desk est fixée à ${fmt(dv01Limit, "fr")}. Le DV01 net actuel du portefeuille est de ${fmt(currentDv01, "fr")}. De combien la limite est-elle dépassée ?`,
        en: `A desk's DV01 limit is set at ${fmt(dv01Limit, "en")}. The portfolio's current net DV01 is ${fmt(currentDv01, "en")}. By how much is the limit exceeded?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(excess, "fr")}, en soustrayant la limite du DV01 net actuel`, en: `${fmt(excess, "en")}, by subtracting the limit from the current net DV01` } },
        { id: "wrong-percentage-as-amount", label: { fr: `${fmt(wrongPercentage, "fr")}, en confondant le dépassement en pourcentage avec un montant en devise`, en: `${fmt(wrongPercentage, "en")}, confusing the percentage overshoot with a currency amount` } },
        { id: "wrong-sum", label: { fr: `${fmt(wrongSum, "fr")}, en additionnant à tort le DV01 net et la limite au lieu de les soustraire`, en: `${fmt(wrongSum, "en")}, by wrongly adding the net DV01 and the limit instead of subtracting them` } },
        { id: "wrong-halved", label: { fr: `${fmt(wrongHalved, "fr")}, en divisant le dépassement correct par deux par erreur`, en: `${fmt(wrongHalved, "en")}, mistakenly dividing the correct excess by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Dépassement = DV01 net actuel − Limite de DV01.", en: "Excess = Current net DV01 − DV01 limit." },
      explanation: {
        fr: `Dépassement = ${fmt(currentDv01, "fr")} − ${fmt(dv01Limit, "fr")} = ${fmt(excess, "fr")}. Un dépassement de limite de risque nécessite une action concrète (réduction de position, dérogation motivée, couverture) : confondre un montant en devise avec un pourcentage, ou additionner au lieu de soustraire, sont des erreurs fréquentes sur ce calcul simple mais essentiel.`,
        en: `Excess = ${fmt(currentDv01, "en")} − ${fmt(dv01Limit, "en")} = ${fmt(excess, "en")}. A risk limit breach requires a concrete action (position reduction, justified waiver, hedge): confusing a currency amount with a percentage, or adding instead of subtracting, are frequent errors on this simple but essential calculation.`,
      },
      commonMistake: {
        fr: "Confondre le dépassement en montant absolu avec un pourcentage, ou inverser l'ordre de la soustraction entre le DV01 actuel et la limite.",
        en: "Confusing the absolute-amount excess with a percentage, or inverting the subtraction's order between the current DV01 and the limit.",
      },
    };
  },
};

const limitIgnoredMistakeTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-erreur-limite-ignoree",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader constate que sa limite de DV01 est dépassée, mais décide de ne rien faire car le portefeuille est actuellement en gain. Ce raisonnement est-il valable ?",
    en: "A trader notices their DV01 limit is breached, but decides to do nothing since the portfolio is currently gaining. Is this reasoning valid?",
  },
  choices: [
    { id: "invalid-limit-caps-potential-loss", label: { fr: "Non : une limite de risque plafonne la PERTE POTENTIELLE future, indépendamment du fait que le portefeuille soit actuellement en gain ou en perte", en: "No: a risk limit caps the future POTENTIAL LOSS, independently of whether the portfolio is currently gaining or losing" } },
    { id: "valid-gain-justifies-breach", label: { fr: "Oui, un gain actuel justifie totalement de laisser une limite de risque dépassée sans action", en: "Yes, a current gain fully justifies leaving a breached risk limit without action" } },
    { id: "limits-only-matter-when-losing", label: { fr: "Les limites de risque n'ont d'utilité que lorsque le portefeuille est déjà en perte, jamais en amont", en: "Risk limits are only useful once the portfolio is already losing, never upfront" } },
    { id: "breach-self-corrects-with-gains", label: { fr: "Un dépassement de limite se corrige automatiquement tant que le portefeuille continue de gagner de l'argent", en: "A limit breach automatically self-corrects as long as the portfolio keeps making money" } },
  ],
  correctId: "invalid-limit-caps-potential-loss",
  hint: { fr: "Une limite de risque porte sur une exposition FUTURE potentielle, pas sur le résultat déjà réalisé jusqu'à présent.", en: "A risk limit concerns a FUTURE potential exposure, not the result already realized so far." },
  explanation: {
    fr: "Ce raisonnement n'est pas valable : une limite de risque comme le DV01 plafonne la perte potentielle qu'un mouvement de marché futur pourrait causer, totalement indépendamment du résultat déjà réalisé jusqu'à présent — un gain actuel ne réduit en rien l'exposition future du portefeuille à un mouvement de taux défavorable, et un dépassement de limite appelle une action concrète (réduction, couverture, dérogation motivée), pas une inaction justifiée par un résultat passé favorable.",
    en: "This reasoning is not valid: a risk limit like DV01 caps the potential loss a future market move could cause, totally independently of the result already realized so far — a current gain in no way reduces the portfolio's future exposure to an unfavorable rate move, and a limit breach calls for a concrete action (reduction, hedge, justified waiver), not inaction justified by a favorable past result.",
  },
  commonMistake: {
    fr: "Justifier l'inaction face à un dépassement de limite de risque par un résultat actuellement favorable, en confondant P&L déjà réalisé et exposition future au risque.",
    en: "Justifying inaction on a risk limit breach with a currently favorable result, confusing already-realized P&L with future risk exposure.",
  },
});

const marketMakerAttributionScenarioTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-scenario-market-maker",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un market maker sur actions constate un P&L positif sur la journée. L'attribution montre que ce résultat provient presque intégralement de la capture du bid-ask spread sur un grand nombre de petites transactions, avec une contribution quasi nulle liée au niveau du marché lui-même. Que révèle cette attribution sur la stratégie du desk ?",
    en: "An equity market maker sees a positive P&L for the day. Attribution shows this result comes almost entirely from capturing the bid-ask spread across many small transactions, with a near-zero contribution tied to the market's level itself. What does this attribution reveal about the desk's strategy?",
  },
  choices: [
    { id: "strategy-behaves-as-designed", label: { fr: "La stratégie se comporte comme attendu pour un market maker : le résultat provient du service de liquidité fourni (spread), pas d'un pari directionnel sur le marché", en: "The strategy behaves as expected for a market maker: the result comes from the liquidity service provided (spread), not a directional market bet" } },
    { id: "desk-secretly-taking-directional-bets", label: { fr: "Le desk prend en réalité des paris directionnels cachés sur le marché, malgré ce que montre l'attribution", en: "The desk is actually taking hidden directional bets on the market, despite what the attribution shows" } },
    { id: "attribution-result-is-suspicious", label: { fr: "Ce résultat d'attribution est en lui-même suspect et doit être considéré comme une anomalie à corriger", en: "This attribution result is itself suspicious and must be treated as an anomaly to correct" } },
    { id: "no-conclusion-possible", label: { fr: "Aucune conclusion ne peut être tirée de cette attribution sans connaître le P&L total en valeur absolue", en: "No conclusion can be drawn from this attribution without knowing the total P&L in absolute value" } },
  ],
  correctId: "strategy-behaves-as-designed",
  hint: { fr: "Un market maker gagne typiquement de l'argent en captant le spread, PAS en pariant sur la direction du marché : que confirme cette attribution ?", en: "A market maker typically makes money by capturing the spread, NOT by betting on the market's direction: what does this attribution confirm?" },
  explanation: {
    fr: "Cette attribution confirme précisément que la stratégie du desk se comporte comme conçue : un market maker vise à générer un résultat stable via la capture du bid-ask spread sur de nombreuses petites transactions, sans dépendre significativement de la direction du marché — une contribution quasi nulle liée au niveau du marché est donc un signal RASSURANT, pas suspect, confirmant l'absence de pari directionnel caché.",
    en: "This attribution precisely confirms the desk's strategy is behaving as designed: a market maker aims to generate a steady result by capturing the bid-ask spread across many small transactions, without significantly depending on the market's direction — a near-zero contribution tied to the market's level is thus a REASSURING signal, not a suspicious one, confirming the absence of a hidden directional bet.",
  },
  commonMistake: {
    fr: "Interpréter comme suspecte une attribution de P&L qui confirme au contraire qu'une stratégie se comporte exactement comme prévu par sa conception.",
    en: "Interpreting as suspicious a P&L attribution that instead confirms a strategy is behaving exactly as designed.",
  },
});

const carryVsMarketFactorComparisonTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-comparaison-carry-facteur-marche",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi un modèle d'attribution du P&L sépare-t-il la contribution du carry (financement) de celle des mouvements de facteurs de marché (taux, crédit...) ?",
    en: "Why does a P&L attribution model separate the carry (funding) contribution from that of market factor moves (rates, credit...)?",
  },
  choices: [
    { id: "different-origins-need-separate-tracking", label: { fr: "Ces deux sources de résultat ont des origines fondamentalement différentes (un flux de trésorerie stable vs un mouvement de marché incertain) et doivent être suivies séparément pour bien comprendre le comportement du portefeuille", en: "These two return sources have fundamentally different origins (a steady cash flow vs an uncertain market move) and must be tracked separately to properly understand the portfolio's behavior" } },
    { id: "no-real-reason-arbitrary-convention", label: { fr: "Il n'y a aucune raison réelle à cette séparation, il s'agit d'une convention purement arbitraire sans utilité pratique", en: "There is no real reason for this separation, it's a purely arbitrary convention with no practical use" } },
    { id: "carry-always-larger-than-market-factors", label: { fr: "Le carry est toujours plus important en valeur absolue que les facteurs de marché, d'où la nécessité de le séparer", en: "Carry is always larger in absolute value than market factors, hence the need to separate it" } },
    { id: "regulatory-requirement-only", label: { fr: "Cette séparation ne répond qu'à une exigence réglementaire, sans aucune utilité de gestion interne", en: "This separation only meets a regulatory requirement, with no internal management use" } },
  ],
  correctId: "different-origins-need-separate-tracking",
  hint: { fr: "Le carry existe même sans aucun mouvement de marché (comme vu pour les obligations) ; les facteurs de marché dépendent d'une évolution incertaine des prix.", en: "Carry exists even with no market move at all (as seen for bonds); market factors depend on an uncertain price evolution." },
  explanation: {
    fr: "Le carry provient d'un flux de trésorerie relativement stable et prévisible (comme vu pour les obligations, où il existe même sans aucun mouvement de taux), tandis que les contributions des facteurs de marché dépendent d'une évolution incertaine des prix : les séparer permet de comprendre si le résultat provient d'un rendement structurel de portage ou d'un pari sur l'évolution du marché — une distinction utile en gestion interne, pas seulement une exigence réglementaire ou une convention arbitraire.",
    en: "Carry comes from a relatively stable, predictable cash flow (as seen for bonds, where it exists even with no rate move at all), while market factor contributions depend on an uncertain price evolution: separating them allows understanding whether the result comes from a structural carry return or a bet on the market's evolution — a useful distinction for internal management, not just a regulatory requirement or an arbitrary convention.",
  },
  commonMistake: {
    fr: "Traiter la séparation entre carry et facteurs de marché comme une convention arbitraire sans utilité, en ignorant leur différence fondamentale d'origine et de prévisibilité.",
    en: "Treating the carry/market factor separation as an arbitrary, useless convention, ignoring their fundamental difference in origin and predictability.",
  },
});

const limitsNotAdvisoryMistakeTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-erreur-limite-consultative",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations sur les limites de risque d'un desk est correcte ?",
    en: "Which of these statements about a desk's risk limits is correct?",
  },
  choices: [
    { id: "breach-requires-action-or-waiver", label: { fr: "Un dépassement de limite appelle une action concrète (réduction, couverture) ou une dérogation motivée du risk management, pas une simple prise de connaissance", en: "A limit breach calls for a concrete action (reduction, hedge) or a justified risk management waiver, not mere acknowledgment" } },
    { id: "limits-purely-indicative", label: { fr: "Les limites de risque sont purement indicatives, un trader restant libre de les dépasser sans justification ni conséquence", en: "Risk limits are purely indicative, a trader remaining free to exceed them with no justification or consequence" } },
    { id: "limits-only-apply-to-junior-traders", label: { fr: "Les limites de risque ne s'appliquent qu'aux traders juniors, les traders expérimentés en étant exemptés", en: "Risk limits only apply to junior traders, experienced traders being exempt from them" } },
    { id: "limits-recalculated-to-fit-position", label: { fr: "Une limite de risque dépassée est simplement recalculée pour s'ajuster à la position actuelle du trader", en: "A breached risk limit is simply recalculated to fit the trader's current position" } },
  ],
  correctId: "breach-requires-action-or-waiver",
  hint: { fr: "Une limite de risque a une valeur CONTRAIGNANTE, pas seulement informative : que doit-il se passer en cas de dépassement ?", en: "A risk limit has BINDING value, not just informative: what must happen upon a breach?" },
  explanation: {
    fr: "Une limite de risque est contraignante, pas purement indicative : un dépassement doit déclencher une action concrète (réduction de position, couverture) ou, à défaut, une dérogation explicitement motivée et validée par le risk management — elle s'applique à tous les traders quel que soit leur niveau d'expérience, et n'est jamais simplement recalculée après coup pour s'ajuster à une position qui la dépasse.",
    en: "A risk limit is binding, not purely indicative: a breach must trigger a concrete action (position reduction, hedge) or, failing that, an explicitly justified waiver validated by risk management — it applies to all traders regardless of experience level, and is never simply recalculated after the fact to fit a position that exceeds it.",
  },
  commonMistake: {
    fr: "Traiter une limite de risque comme purement consultative, en supposant qu'un trader peut la dépasser librement sans justification ni conséquence.",
    en: "Treating a risk limit as purely advisory, assuming a trader can freely exceed it with no justification or consequence.",
  },
});

const multipleLimitsScenarioTemplate = mcqTemplate({
  id: "m13-pnl-attribution-limites-scenario-limites-multiples",
  conceptId: "m13-pnl-attribution-limites",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk crédit respecte confortablement sa limite de DV01, mais approche dangereusement de sa limite de CS01. Un rapport de risque qui ne suivrait que le DV01 détecterait-il ce problème ?",
    en: "A credit desk comfortably meets its DV01 limit, but is dangerously approaching its CS01 limit. Would a risk report tracking only DV01 detect this problem?",
  },
  choices: [
    { id: "no-each-limit-must-be-tracked-separately", label: { fr: "Non : chaque limite de risque (DV01, CS01, VaR...) doit être suivie séparément, le respect d'une limite ne garantissant rien sur les autres", en: "No: each risk limit (DV01, CS01, VaR...) must be tracked separately, meeting one limit guaranteeing nothing about the others" } },
    { id: "yes-dv01-limit-covers-all-risks", label: { fr: "Oui, le respect de la limite de DV01 garantit automatiquement le respect de toutes les autres limites de risque du desk", en: "Yes, meeting the DV01 limit automatically guarantees meeting all the desk's other risk limits" } },
    { id: "cs01-limit-is-redundant", label: { fr: "La limite de CS01 est de toute façon redondante avec celle de DV01, les deux mesurant en réalité le même risque", en: "The CS01 limit is redundant with the DV01 one anyway, both actually measuring the same risk" } },
    { id: "problem-only-matters-if-both-breached", label: { fr: "Ce problème n'a d'importance que si les deux limites sont dépassées simultanément, jamais si une seule l'est", en: "This problem only matters if both limits are breached simultaneously, never if only one is" } },
  ],
  correctId: "no-each-limit-must-be-tracked-separately",
  hint: { fr: "DV01 et CS01 mesurent deux facteurs de risque INDÉPENDANTS (vu au module 3) : le respect de l'un dit-il quelque chose sur l'autre ?", en: "DV01 and CS01 measure two INDEPENDENT risk factors (seen in module 3): does meeting one say anything about the other?" },
  explanation: {
    fr: "Puisque DV01 et CS01 mesurent deux facteurs de risque indépendants (taux vs spread de crédit), un rapport qui ne suivrait que le DV01 ne détecterait absolument pas l'approche dangereuse de la limite de CS01 : chaque limite de risque doit être suivie et respectée séparément, le respect confortable de l'une ne garantissant rien sur les autres — une seule limite approchée de sa borne, même si les autres sont confortablement respectées, constitue déjà un signal d'alerte à part entière.",
    en: "Since DV01 and CS01 measure independent risk factors (rates vs credit spread), a report tracking only DV01 would completely fail to detect the dangerous approach to the CS01 limit: each risk limit must be tracked and met separately, comfortably meeting one guaranteeing nothing about the others — a single limit nearing its bound, even if others are comfortably met, is already a standalone warning signal.",
  },
  commonMistake: {
    fr: "Croire que le respect d'une seule limite de risque (comme le DV01) suffit à garantir le respect de toutes les autres limites d'un portefeuille.",
    en: "Believing meeting a single risk limit (like DV01) is enough to guarantee all a portfolio's other limits are also met.",
  },
});

const unexplainedRatioCalcTemplate: QuestionTemplate = {
  id: "m13-pnl-attribution-limites-calcul-ratio-inexplique",
  conceptId: "m13-pnl-attribution-limites",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const totalPnl = randomInt(rng, 200, 500) * 1000;
    const unexplainedAbs = randomInt(rng, 5, 40) * 1000;
    const correctRatioPercent = Math.round((unexplainedAbs / totalPnl) * 1000) / 10;
    const wrongInverted = Math.round((totalPnl / unexplainedAbs) * 10) / 10;
    const wrongUsesSum = Math.round((unexplainedAbs / (totalPnl + unexplainedAbs)) * 1000) / 10;
    const wrongDoubled = Math.round(correctRatioPercent * 2 * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille a un P&L total de ${fmt(totalPnl, "fr")} et un résultat inexpliqué (en valeur absolue) de ${fmt(unexplainedAbs, "fr")}. Quel pourcentage du P&L total représente ce résultat inexpliqué ?`,
        en: `A portfolio has a total P&L of ${fmt(totalPnl, "en")} and an (absolute value) unexplained P&L of ${fmt(unexplainedAbs, "en")}. What percentage of the total P&L does this unexplained P&L represent?`,
      },
      choices: [
        { id: "correct", label: { fr: `${correctRatioPercent}%, en divisant le résultat inexpliqué par le P&L total`, en: `${correctRatioPercent}%, by dividing the unexplained P&L by the total P&L` } },
        { id: "wrong-inverted", label: { fr: `${wrongInverted}%, en divisant à tort le P&L total par le résultat inexpliqué`, en: `${wrongInverted}%, by wrongly dividing the total P&L by the unexplained P&L` } },
        { id: "wrong-uses-sum", label: { fr: `${wrongUsesSum}%, en divisant par la somme du P&L total et du résultat inexpliqué au lieu du P&L total seul`, en: `${wrongUsesSum}%, by dividing by the sum of the total P&L and the unexplained P&L instead of the total P&L alone` } },
        { id: "wrong-doubled", label: { fr: `${wrongDoubled}%, en doublant le résultat correct par erreur`, en: `${wrongDoubled}%, mistakenly doubling the correct result` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Ratio = Résultat inexpliqué (absolu) / P&L total, exprimé en pourcentage.", en: "Ratio = Unexplained P&L (absolute) / Total P&L, expressed as a percentage." },
      explanation: {
        fr: `Ratio = ${fmt(unexplainedAbs, "fr")} / ${fmt(totalPnl, "fr")} ≈ ${correctRatioPercent}%. Ce ratio est un indicateur clé de la qualité du modèle d'attribution : plus il est faible, plus le modèle capture fidèlement le P&L réel ; inverser la division ou utiliser un mauvais dénominateur sont des erreurs fréquentes sur ce calcul.`,
        en: `Ratio = ${fmt(unexplainedAbs, "en")} / ${fmt(totalPnl, "en")} ≈ ${correctRatioPercent}%. This ratio is a key indicator of the attribution model's quality: the lower it is, the more faithfully the model captures the actual P&L; inverting the division or using the wrong denominator are frequent errors on this calculation.`,
      },
      commonMistake: {
        fr: "Inverser le ratio (diviser le P&L total par le résultat inexpliqué) ou utiliser un mauvais dénominateur, ce qui fausse l'évaluation de la qualité du modèle d'attribution.",
        en: "Inverting the ratio (dividing the total P&L by the unexplained P&L) or using the wrong denominator, which distorts the attribution model's quality assessment.",
      },
    };
  },
};

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  explainedVsUnexplainedComparisonTemplate,
  positiveTotalHidesRiskWhatIfTemplate,
  growingUnexplainedWhatIfTemplate,
  attributionCalcTemplate,
  limitBreachActionCalcTemplate,
  limitIgnoredMistakeTemplate,
  marketMakerAttributionScenarioTemplate,
  carryVsMarketFactorComparisonTemplate,
  limitsNotAdvisoryMistakeTemplate,
  multipleLimitsScenarioTemplate,
  unexplainedRatioCalcTemplate,
];
