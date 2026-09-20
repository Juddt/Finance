import { randomInt, randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const payoffNumericTemplate: QuestionTemplate = {
  id: "m08-varswap-payoff-calcul",
  conceptId: "m08-variance-swap",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 5, 50) * 10_000;
    const kVarPct = randomInt(rng, 12, 30);
    const realizedPct = kVarPct + randomInt(rng, -10, 10) || kVarPct + 3;
    const kVar2 = (kVarPct / 100) * (kVarPct / 100);
    const realized2 = (realizedPct / 100) * (realizedPct / 100);
    const payoff = Math.round(notional * (realized2 - kVar2));

    return {
      isScenario: true,
      prompt: {
        fr: `Un variance swap a un notionnel de variance de ${fmt(notional, "fr")}, un strike K_var=${kVarPct}%. La volatilité réalisée s'avère être ${realizedPct}%. Quel est le payoff (positif si reçu par l'acheteur) ?`,
        en: `A variance swap has variance notional ${fmt(notional, "en")}, strike K_var=${kVarPct}%. Realized volatility turns out to be ${realizedPct}%. What is the payoff (positive if received by the buyer)?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 50",
      hint: { fr: "Payoff = N_var × (σ²_réalisée − K²_var).", en: "Payoff = N_var × (σ²_realized − K²_var)." },
      numeric: { value: payoff, tolerance: 50 },
      calculation: {
        fr: `σ²_réalisée = ${(realizedPct / 100).toFixed(2)}² = ${realized2.toFixed(4)}. K²_var = ${(kVarPct / 100).toFixed(2)}² = ${kVar2.toFixed(4)}. Payoff = ${fmt(notional, "fr")}×(${realized2.toFixed(4)}−${kVar2.toFixed(4)}) ≈ ${fmt(payoff, "fr")}.`,
        en: `σ²_realized = ${(realizedPct / 100).toFixed(2)}² = ${realized2.toFixed(4)}. K²_var = ${(kVarPct / 100).toFixed(2)}² = ${kVar2.toFixed(4)}. Payoff = ${fmt(notional, "en")}×(${realized2.toFixed(4)}−${kVar2.toFixed(4)}) ≈ ${fmt(payoff, "en")}.`,
      },
      explanation: {
        fr: "N'oubliez pas d'élever au carré les deux volatilités avant de les soustraire : le payoff dépend de la VARIANCE, pas de la volatilité elle-même.",
        en: "Don't forget to square both volatilities before subtracting: the payoff depends on VARIANCE, not volatility itself.",
      },
      commonMistake: {
        fr: "Soustraire directement les volatilités (σ_réalisée − K_var) sans les élever au carré.",
        en: "Directly subtracting the volatilities (σ_realized − K_var) without squaring them.",
      },
    };
  },
};

const noDeltaRiskTemplate: QuestionTemplate = {
  id: "m08-varswap-pas-delta",
  conceptId: "m08-variance-swap",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un variance swap comporte un risque de Delta, comme une option classique non couverte.",
      en: "A variance swap carries Delta risk, like an uncovered classic option.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le variance swap offre une exposition PURE à la variance réalisée, sans risque de Delta — c'est précisément son avantage par rapport à une option delta-hedgée manuellement.",
      en: "False: a variance swap offers PURE exposure to realized variance, with no Delta risk — precisely its advantage over a manually delta-hedged option.",
    },
    commonMistake: {
      fr: "Croire que tout instrument dérivé sur un sous-jacent comporte nécessairement un risque directionnel.",
      en: "Believing any derivative on an underlying necessarily carries directional risk.",
    },
  }),
};

const varianceVsVolSwapTemplate: QuestionTemplate = {
  id: "m08-varswap-vs-volswap",
  conceptId: "m08-variance-swap",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Un variance swap est-il plus ou moins sensible aux mouvements extrêmes (queues de distribution) qu'un volatility swap (payoff linéaire en volatilité), à écart identique par rapport au strike ?",
      en: "Is a variance swap more or less sensitive to extreme moves (distribution tails) than a volatility swap (payoff linear in volatility), for the same gap versus the strike?",
    },
    choices: buildChoices([
      { id: "more", label: { fr: "Plus sensible, à cause du payoff en carré (σ²)", en: "More sensitive, because of the squared (σ²) payoff" } },
      { id: "same", label: { fr: "Également sensible, les deux payoffs se comportent pareil", en: "Equally sensitive, both payoffs behave the same" } },
    ]),
    hint: { fr: "Le payoff d'un variance swap dépend de σ², celui d'un vol swap de σ.", en: "A variance swap's payoff depends on σ², a vol swap's on σ." },
    correctChoiceIds: ["more"],
    explanation: {
      fr: "Le variance swap est structurellement plus sensible aux mouvements extrêmes, car son payoff dépend du CARRÉ de la volatilité — un doublement de volatilité quadruple l'écart en variance, mais seulement double l'écart en volatilité.",
      en: "The variance swap is structurally more sensitive to extreme moves, since its payoff depends on volatility SQUARED — a doubling of volatility quadruples the variance gap, but only doubles the volatility gap.",
    },
    commonMistake: {
      fr: "Croire que variance swap et volatility swap ont un comportement équivalent, car tous deux \"parient sur la volatilité\".",
      en: "Believing variance and volatility swaps behave equivalently, since both \"bet on volatility\".",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-varswap-vocab",
  conceptId: "m08-variance-swap",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le niveau de variance fixé au contrat, déterminé pour que la valeur du swap soit nulle à la conclusion, s'appelle le strike de ______.",
      en: "The variance level fixed in the contract, set so the swap's value is zero at inception, is called the ______ strike.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["variance"],
    hint: { fr: "Le carré de la volatilité qu'on \"parie\".", en: "The square of the volatility being \"bet\" on." },
    explanation: {
      fr: "Le strike de variance K_var est fixé au départ, sa valeur au carré K²_var étant comparée à la variance réellement réalisée à l'échéance.",
      en: "The variance strike K_var is fixed at inception, its squared value K²_var being compared to actually realized variance at maturity.",
    },
    commonMistake: {
      fr: "Confondre le strike de variance avec le strike d'une option classique, qui porte sur un niveau de prix, pas sur une variance.",
      en: "Confusing the variance strike with a classic option's strike, which relates to a price level, not a variance.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m08-varswap-comprehension",
  conceptId: "m08-variance-swap",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi un trader utiliserait-il un variance swap plutôt qu'une option classique pour prendre position sur la volatilité ?",
    en: "Why would a trader use a variance swap rather than a classic option to take a position on volatility?",
  },
  choices: [
    { id: "pure-exposure", label: { fr: "Pour obtenir une exposition pure à la variance réalisée, sans le risque de Delta ni les contraintes de gestion d'une option delta-hedgée", en: "To get pure exposure to realized variance, without the Delta risk or the management constraints of a delta-hedged option" } },
    { id: "cheaper-always", label: { fr: "Parce qu'un variance swap est toujours moins cher qu'une option équivalente", en: "Because a variance swap is always cheaper than an equivalent option" } },
    { id: "no-risk", label: { fr: "Parce qu'un variance swap ne comporte absolument aucun risque", en: "Because a variance swap carries absolutely no risk" } },
  ],
  correctId: "pure-exposure",
  hint: { fr: "Une option delta-hedgée reste sensible à la trajectoire (gamma/theta) et exige une gestion active.", en: "A delta-hedged option remains path-sensitive (gamma/theta) and requires active management." },
  explanation: {
    fr: "Le variance swap offre une exposition directe et pure à la variance réalisée sur toute la durée du contrat, sans le risque de Delta ni le besoin de rebalancer continuellement une couverture — contrairement à une option, même delta-hedgée, dont le P&L dépend aussi de la trajectoire exacte du sous-jacent.",
    en: "The variance swap offers direct, pure exposure to realized variance over the contract's whole life, without Delta risk or the need to continuously rebalance a hedge — unlike an option, even delta-hedged, whose P&L also depends on the underlying's exact path.",
  },
  commonMistake: {
    fr: "Croire qu'un variance swap est un instrument sans risque, alors qu'il reste pleinement exposé au niveau de variance réalisée.",
    en: "Believing a variance swap is a riskless instrument, when it remains fully exposed to the level of realized variance.",
  },
});

const comparisonStraddleVsVarSwapTemplate = mcqTemplate({
  id: "m08-varswap-comparaison-straddle-delta-hedge",
  conceptId: "m08-variance-swap",
  difficulty: "hard",
  prompt: {
    fr: "Un straddle delta-hedgé quotidiennement et un variance swap parient tous deux sur la volatilité. Quelle différence essentielle les sépare ?",
    en: "A daily delta-hedged straddle and a variance swap both bet on volatility. What essential difference separates them?",
  },
  choices: [
    { id: "path-vs-clean", label: { fr: "Le P&L du straddle dépend de la fréquence de rehedging et de la trajectoire exacte du spot ; celui du variance swap ne dépend que de la variance totale réalisée sur la période, quelle que soit la trajectoire", en: "The straddle's P&L depends on the rehedging frequency and the spot's exact path; the variance swap's P&L depends only on total realized variance over the period, whatever the path" } },
    { id: "identical", label: { fr: "Aucune différence : les deux ont un P&L strictement identique en toutes circonstances", en: "No difference: both have a strictly identical P&L in all circumstances" } },
    { id: "straddle-cleaner", label: { fr: "Le straddle offre une exposition plus \"propre\" à la variance que le variance swap", en: "The straddle offers a \"cleaner\" exposure to variance than the variance swap" } },
  ],
  correctId: "path-vs-clean",
  hint: { fr: "Le rehedging discret d'un straddle introduit un écart entre théorie continue et P&L réel, absent du variance swap.", en: "A straddle's discrete rehedging introduces a gap between continuous theory and actual P&L, absent from the variance swap." },
  explanation: {
    fr: "Le P&L d'un straddle delta-hedgé approxime la variance réalisée seulement à la limite d'un rehedging continu ; en pratique, la fréquence de rehedging, les coûts de transaction et la trajectoire exacte introduisent un écart — le variance swap, lui, est construit (via une réplication statique par une nappe d'options pondérées en 1/K²) pour ne dépendre que de la variance totale réalisée, sans cette sensibilité à la trajectoire de couverture.",
    en: "A delta-hedged straddle's P&L only approximates realized variance in the limit of continuous rehedging; in practice, rehedging frequency, transaction costs, and the exact path introduce a gap — the variance swap, by contrast, is built (via static replication with a strip of options weighted 1/K²) to depend only on total realized variance, without this sensitivity to the hedging path.",
  },
  commonMistake: {
    fr: "Croire qu'un straddle delta-hedgé et un variance swap donnent exactement le même P&L, en ignorant l'effet de la fréquence de rehedging.",
    en: "Believing a delta-hedged straddle and a variance swap give exactly the same P&L, ignoring the effect of rehedging frequency.",
  },
});

const whatIfSingleJumpDayTemplate = mcqTemplate({
  id: "m08-varswap-what-if-jour-de-saut",
  conceptId: "m08-variance-swap",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Sur les 252 jours de vie d'un variance swap, un seul jour connaît un mouvement de prix extrême (gap de -15% sur annonce surprise), le reste étant très calme. Quel est l'effet de ce jour unique sur la variance réalisée totale ?",
    en: "Over a variance swap's 252-day life, a single day sees an extreme price move (a -15% gap on a surprise announcement), the rest being very calm. What is this single day's effect on total realized variance?",
  },
  choices: [
    { id: "disproportionate", label: { fr: "Un effet disproportionné : ce seul jour peut dominer la variance réalisée de toute la période, car chaque rendement est élevé au carré", en: "A disproportionate effect: this single day can dominate the whole period's realized variance, since each return is squared" } },
    { id: "averaged-out", label: { fr: "Un effet dilué et négligeable une fois moyenné sur 252 jours", en: "A diluted, negligible effect once averaged over 252 days" } },
    { id: "no-effect", label: { fr: "Aucun effet, le variance swap n'étant sensible qu'aux mouvements progressifs", en: "No effect, since the variance swap is only sensitive to gradual moves" } },
  ],
  correctId: "disproportionate",
  hint: { fr: "La variance somme des rendements AU CARRÉ : un rendement de -15% pèse comme des dizaines de jours calmes combinés.", en: "Variance sums SQUARED returns: a -15% return weighs as much as dozens of calm days combined." },
  explanation: {
    fr: "Comme la variance réalisée additionne les rendements au carré, un seul mouvement extrême peut contribuer davantage à la variance totale que des dizaines de jours calmes réunis (un rendement de -15% pèse ~225 fois plus qu'un rendement de -1%) — c'est pourquoi les variance swaps sont particulièrement exposés au risque de sauts (gaps), contrairement à ce que suggère une intuition linéaire.",
    en: "Since realized variance sums squared returns, a single extreme move can contribute more to total variance than dozens of calm days combined (a -15% return weighs ~225 times as much as a -1% return) — which is why variance swaps are particularly exposed to jump (gap) risk, contrary to what a linear intuition would suggest.",
  },
  commonMistake: {
    fr: "Sous-estimer l'impact d'un seul jour extrême sur la variance totale, en raisonnant comme si les contributions journalières étaient linéaires plutôt que quadratiques.",
    en: "Underestimating a single extreme day's impact on total variance, reasoning as if daily contributions were linear rather than quadratic.",
  },
});

const whatIfSkewedReplicationTemplate = mcqTemplate({
  id: "m08-varswap-what-if-replication-avec-skew",
  conceptId: "m08-variance-swap",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Pour fixer le strike de variance K²_var d'un nouveau variance swap, un desk utilise la réplication statique par une nappe d'options pondérées en 1/K². Que se passe-t-il s'il ignore le skew et n'utilise que l'IV ATM pour toutes les options de la nappe ?",
    en: "To set a new variance swap's variance strike K²_var, a desk uses static replication with a strip of options weighted 1/K². What happens if it ignores the skew and uses only the ATM IV for every option in the strip?",
  },
  choices: [
    { id: "mispriced-strike", label: { fr: "Le strike de variance obtenu est mal calibré, car il ignore la contribution réelle des strikes éloignés dont l'IV diffère de l'ATM", en: "The resulting variance strike is miscalibrated, since it ignores the actual contribution of distant strikes whose IV differs from ATM" } },
    { id: "no-difference", label: { fr: "Aucune différence, le skew n'affectant pas le strike de variance théorique", en: "No difference, since skew doesn't affect the theoretical variance strike" } },
    { id: "always-lower", label: { fr: "Le strike obtenu est toujours plus bas que le vrai strike de marché", en: "The resulting strike is always lower than the true market strike" } },
  ],
  correctId: "mispriced-strike",
  hint: { fr: "La nappe de réplication utilise TOUTES les options du marché à leur IV réelle, pas une seule IV pour toutes.", en: "The replication strip uses ALL market options at their actual IV, not a single IV for all of them." },
  explanation: {
    fr: "Le strike de variance théorique se déduit d'une nappe continue d'options pondérées en 1/K², chacune valorisée à sa propre IV de marché (donc en tenant pleinement compte du skew) : remplacer cette IV réelle par une IV ATM unique pour tous les strikes ignore la contribution du skew et produit un strike de variance mal calibré, dans un sens qui dépend de la forme du skew observé.",
    en: "The theoretical variance strike is derived from a continuous strip of options weighted 1/K², each priced at its own market IV (thus fully accounting for the skew): replacing this actual IV with a single ATM IV for all strikes ignores the skew's contribution and produces a miscalibrated variance strike, in a direction that depends on the observed skew's shape.",
  },
  commonMistake: {
    fr: "Simplifier la réplication statique du variance swap en ignorant le skew, comme si toutes les options du marché partageaient la même IV.",
    en: "Simplifying the variance swap's static replication by ignoring the skew, as if every market option shared the same IV.",
  },
});

const midLifeMarkToMarketNumericTemplate: QuestionTemplate = {
  id: "m08-varswap-calcul-valorisation-mi-vie",
  conceptId: "m08-variance-swap",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const totalDays = 252;
    const elapsedDays = randomInt(rng, 60, 180);
    const remainingDays = totalDays - elapsedDays;
    const realizedSoFarPct = randomFloat(rng, 15, 35, 1);
    const remainingImpliedPct = randomFloat(rng, 15, 30, 1);
    const realizedVar = (realizedSoFarPct / 100) ** 2 * (elapsedDays / totalDays);
    const remainingVar = (remainingImpliedPct / 100) ** 2 * (remainingDays / totalDays);
    const totalVar = realizedVar + remainingVar;
    const effectiveVolPct = Math.round(Math.sqrt(totalVar) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un variance swap de 252 jours en a déjà vécu ${elapsedDays}, avec une volatilité réalisée à date de ${fmt(realizedSoFarPct, "fr", 1)}%. Pour les ${remainingDays} jours restants, l'IV implicite anticipée est de ${fmt(remainingImpliedPct, "fr", 1)}%. Quelle est la volatilité totale attendue sur l'ensemble des 252 jours, en % (pondération par le temps de chaque segment) ?`,
        en: `A 252-day variance swap has already lived ${elapsedDays} days, with realized volatility to date of ${fmt(realizedSoFarPct, "en", 1)}%. For the remaining ${remainingDays} days, expected implied IV is ${fmt(remainingImpliedPct, "en", 1)}%. What is the total expected volatility over the full 252 days, in % (time-weighting each segment)?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.5",
      hint: { fr: "On pondère les VARIANCES (pas les vols) par la fraction de temps de chaque segment, puis on additionne avant de reprendre la racine carrée.", en: "You weight the VARIANCES (not the vols) by each segment's time fraction, then add before taking the square root again." },
      numeric: { value: effectiveVolPct, tolerance: 0.5 },
      calculation: {
        fr: `Var(écoulée) = ${fmt(realizedSoFarPct, "fr", 1)}%²×(${elapsedDays}/252) ≈ ${fmt(realizedVar, "fr", 5)}. Var(restante) = ${fmt(remainingImpliedPct, "fr", 1)}%²×(${remainingDays}/252) ≈ ${fmt(remainingVar, "fr", 5)}. Var(totale) ≈ ${fmt(totalVar, "fr", 5)}. Vol(totale) = √Var(totale) ≈ ${fmt(effectiveVolPct, "fr")}%.`,
        en: `Var(elapsed) = ${fmt(realizedSoFarPct, "en", 1)}%²×(${elapsedDays}/252) ≈ ${fmt(realizedVar, "en", 5)}. Var(remaining) = ${fmt(remainingImpliedPct, "en", 1)}%²×(${remainingDays}/252) ≈ ${fmt(remainingVar, "en", 5)}. Var(total) ≈ ${fmt(totalVar, "en", 5)}. Vol(total) = √Var(total) ≈ ${fmt(effectiveVolPct, "en")}%.`,
      },
      explanation: {
        fr: "Contrairement au payoff final (qui compare la variance réalisée totale au strike en une seule fois), valoriser un variance swap en cours de vie exige de combiner la variance déjà réalisée (figée, pondérée par le temps écoulé) avec la variance encore anticipée sur la période restante — c'est le principe d'additivité de la variance dans le temps, à la base du suivi quotidien d'une position de variance swap.",
        en: "Unlike the final payoff (which compares total realized variance to the strike in one shot), marking a variance swap mid-life requires combining the already-realized variance (locked in, weighted by elapsed time) with the still-expected variance over the remaining period — this is the additivity of variance over time, underlying the daily tracking of a variance swap position.",
      },
      commonMistake: {
        fr: "Moyenner directement les deux volatilités (réalisée et implicite) sans repasser par les variances pondérées par le temps.",
        en: "Directly averaging the two volatilities (realized and implied) without going back through time-weighted variances.",
      },
    };
  },
};

const jumpInsensitivityMistakeTemplate = trueFalseTemplate({
  id: "m08-varswap-erreur-insensibilite-sauts",
  conceptId: "m08-variance-swap",
  difficulty: "medium",
  statement: {
    fr: "Comme un variance swap n'a pas de risque de Delta, il est peu sensible aux sauts de prix (gaps) brusques du sous-jacent.",
    en: "Since a variance swap has no Delta risk, it is not very sensitive to sudden price jumps (gaps) in the underlying.",
  },
  correct: false,
  hint: { fr: "L'absence de risque de Delta ne veut pas dire l'absence de sensibilité à l'amplitude des mouvements de prix.", en: "No Delta risk doesn't mean no sensitivity to the size of price moves." },
  explanation: {
    fr: "Faux : l'absence de risque de Delta signifie que le variance swap n'a pas de biais directionnel, mais il reste, au contraire, particulièrement sensible aux sauts de prix — un seul gap important contribue de façon disproportionnée à la variance réalisée totale à cause du terme au carré.",
    en: "False: no Delta risk means the variance swap has no directional bias, but it remains, on the contrary, particularly sensitive to price jumps — a single large gap contributes disproportionately to total realized variance because of the squared term.",
  },
  commonMistake: {
    fr: "Confondre \"pas de risque directionnel (Delta)\" avec \"pas de sensibilité aux sauts de prix\", qui sont deux notions indépendantes.",
    en: "Confusing \"no directional (Delta) risk\" with \"no sensitivity to price jumps\", which are two independent notions.",
  },
});

const hedgeFundPureVolScenarioTemplate = mcqTemplate({
  id: "m08-varswap-scenario-hedge-fund-vol-pure",
  conceptId: "m08-variance-swap",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un hedge fund anticipe une hausse de la volatilité d'un indice actions, sans avoir de vue sur la direction du marché, et souhaite éviter toute gestion active de couverture. Quel instrument correspond le mieux à cet objectif ?",
    en: "A hedge fund expects an equity index's volatility to rise, without a view on market direction, and wants to avoid any active hedge management. Which instrument best fits this objective?",
  },
  choices: [
    { id: "long-var-swap", label: { fr: "Acheter un variance swap, pour une exposition pure et sans gestion active à la variance réalisée", en: "Buy a variance swap, for pure, hands-off exposure to realized variance" } },
    { id: "long-stock", label: { fr: "Acheter directement l'indice actions", en: "Directly buy the equity index" } },
    { id: "unhedged-call", label: { fr: "Acheter un call non couvert, qui offre une exposition pure à la volatilité", en: "Buy an unhedged call, which offers pure exposure to volatility" } },
  ],
  correctId: "long-var-swap",
  hint: { fr: "Un call non couvert reste exposé à la direction (Delta) ; le variance swap, non.", en: "An unhedged call remains exposed to direction (Delta); the variance swap is not." },
  explanation: {
    fr: "Le variance swap est précisément conçu pour ce cas d'usage : une exposition longue à la variance réalisée, sans risque directionnel (Delta) et sans nécessité de gérer activement une couverture, contrairement à un call non couvert qui reste exposé au sens du marché.",
    en: "The variance swap is precisely designed for this use case: long exposure to realized variance, with no directional (Delta) risk and no need to actively manage a hedge, unlike an unhedged call which remains exposed to market direction.",
  },
  commonMistake: {
    fr: "Utiliser un call non couvert pour parier sur la volatilité seule, en oubliant qu'il reste exposé à la direction du marché via son Delta.",
    en: "Using an unhedged call to bet on volatility alone, forgetting it remains exposed to market direction via its Delta.",
  },
});

const shortVarianceCrashScenarioTemplate = mcqTemplate({
  id: "m08-varswap-scenario-vendeur-krach",
  conceptId: "m08-variance-swap",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un fonds vend systématiquement des variance swaps pendant des mois de marché calme, encaissant la prime liée à un strike de variance supérieur à la variance réalisée habituelle. Un krach soudain survient. Quel est le risque principal de cette stratégie ?",
    en: "A fund systematically sells variance swaps during calm market months, collecting the premium from a variance strike above the usual realized variance. A sudden crash occurs. What is this strategy's main risk?",
  },
  choices: [
    { id: "unbounded-loss", label: { fr: "Une perte potentiellement très importante et rapide, car le payoff du vendeur est négatif et croît avec le carré de la volatilité réalisée lors du krach", en: "A potentially very large, fast loss, since the seller's payoff is negative and grows with the square of realized volatility during the crash" } },
    { id: "capped-loss", label: { fr: "Une perte automatiquement plafonnée à la prime initialement encaissée", en: "A loss automatically capped at the initially collected premium" } },
    { id: "no-risk-short-vol", label: { fr: "Aucun risque supplémentaire, la vente de variance étant une stratégie sans risque en toutes circonstances", en: "No additional risk, since selling variance is a riskless strategy in all circumstances" } },
  ],
  correctId: "unbounded-loss",
  hint: { fr: "Comme la vente d'options non couvertes, vendre de la variance expose à des pertes qui croissent avec le carré du mouvement, sans plafond naturel.", en: "Like selling uncovered options, selling variance exposes you to losses that grow with the square of the move, with no natural cap." },
  explanation: {
    fr: "Vendre des variance swaps encaisse une prime régulière tant que la variance réalisée reste sous le strike, mais expose à des pertes qui croissent avec le carré de la volatilité réalisée en cas de choc — un scénario largement illustré par les épisodes de \"crash de la volatilité courte\" où des positions vendeuses de variance/volatilité ont subi des pertes démesurées par rapport aux primes accumulées.",
    en: "Selling variance swaps collects a steady premium as long as realized variance stays below the strike, but exposes the seller to losses that grow with the square of realized volatility during a shock — a scenario widely illustrated by \"short volatility crash\" episodes where variance/volatility-selling positions suffered losses vastly disproportionate to the premiums accumulated.",
  },
  commonMistake: {
    fr: "Assimiler la vente régulière de variance à une stratégie de portage sans risque, en sous-estimant l'ampleur possible des pertes lors d'un choc de marché.",
    en: "Equating regular variance selling with a riskless carry strategy, underestimating the possible scale of losses during a market shock.",
  },
});

export const templates: QuestionTemplate[] = [
  payoffNumericTemplate,
  noDeltaRiskTemplate,
  varianceVsVolSwapTemplate,
  vocabTemplate,
  comprehensionTemplate,
  comparisonStraddleVsVarSwapTemplate,
  whatIfSingleJumpDayTemplate,
  whatIfSkewedReplicationTemplate,
  midLifeMarkToMarketNumericTemplate,
  jumpInsensitivityMistakeTemplate,
  hedgeFundPureVolScenarioTemplate,
  shortVarianceCrashScenarioTemplate,
];
