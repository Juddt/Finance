import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const periodPnlNumericTemplate: QuestionTemplate = {
  id: "m07-pnl-periode-calcul",
  conceptId: "m07-pnl-delta-hedging",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const theta = -1 * randomInt(rng, 5, 40);
    const dt = 1 / 365;
    const gamma = randomFloat(rng, 0.01, 0.1, 3);
    const dS = randomInt(rng, 1, 8);
    const pnl = Math.round((theta * dt + 0.5 * gamma * dS * dS) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position delta-hedgée a Θ=${theta} (par an) et Γ=${fmt(gamma, "fr", 3)}. Sur un jour (dt=1/365), le sous-jacent bouge de ${dS} (dS). Quel est le P&L de cette journée ?`,
        en: `A delta-hedged position has Θ=${theta} (per year) and Γ=${fmt(gamma, "en", 3)}. Over one day (dt=1/365), the underlying moves by ${dS} (dS). What is that day's P&L?`,
      },
      numericUnit: { fr: "même devise que la position", en: "same currency as the position" },
      numericTolerance: "± 0.5",
      hint: { fr: "P&L ≈ Θ×dt + ½×Γ×(dS)².", en: "P&L ≈ Θ×dt + ½×Γ×(dS)²." },
      numeric: { value: pnl, tolerance: 0.5 },
      calculation: {
        fr: `P&L ≈ ${theta}×(1/365) + 0,5×${fmt(gamma, "fr", 3)}×${dS}² ≈ ${(theta * dt).toFixed(3)} + ${(0.5 * gamma * dS * dS).toFixed(3)} ≈ ${fmt(pnl, "fr")}.`,
        en: `P&L ≈ ${theta}×(1/365) + 0.5×${fmt(gamma, "en", 3)}×${dS}² ≈ ${(theta * dt).toFixed(3)} + ${(0.5 * gamma * dS * dS).toFixed(3)} ≈ ${fmt(pnl, "en")}.`,
      },
      explanation: {
        fr: "Le terme de Gamma dépend du CARRÉ du mouvement, donc il devient dominant lors de mouvements importants, tandis que le Theta s'accumule régulièrement à chaque jour qui passe.",
        en: "The Gamma term depends on the SQUARED move, so it becomes dominant during large moves, while Theta accumulates steadily every passing day.",
      },
      commonMistake: {
        fr: "Oublier d'élever dS au carré, ou oublier le facteur ½ devant le terme de Gamma.",
        en: "Forgetting to square dS, or forgetting the ½ factor in front of the Gamma term.",
      },
    };
  },
};

const sellerProfitableTemplate: QuestionTemplate = {
  id: "m07-pnl-vendeur-profitable",
  conceptId: "m07-pnl-delta-hedging",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const realizedHigher = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Un trader vend une option couverte en delta à une volatilité implicite de 20%. La volatilité réellement réalisée sur le sous-jacent s'avère être ${realizedHigher ? "30%" : "12%"}. Le P&L moyen de cette position est-il positif ou négatif pour le vendeur ?`,
        en: `A trader sells a delta-hedged option at 20% implied volatility. The volatility actually realized on the underlying turns out to be ${realizedHigher ? "30%" : "12%"}. Is the average P&L of this position positive or negative for the seller?`,
      },
      choices: buildChoices([
        { id: "positive", label: { fr: "Positif", en: "Positive" } },
        { id: "negative", label: { fr: "Négatif", en: "Negative" } },
      ]),
      hint: { fr: "Le vendeur gagne si la volatilité réalisée est plus BASSE que l'implicite vendue.", en: "The seller wins if realized volatility is LOWER than the sold implied." },
      correctChoiceIds: [realizedHigher ? "negative" : "positive"],
      explanation: realizedHigher
        ? { fr: "La volatilité réalisée (30%) dépasse largement l'implicite vendue (20%) : les pertes de Gamma dépassent en moyenne le Theta encaissé, P&L négatif pour le vendeur.", en: "Realized volatility (30%) far exceeds the sold implied (20%): Gamma losses exceed the collected Theta on average, negative P&L for the seller." }
        : { fr: "La volatilité réalisée (12%) est bien inférieure à l'implicite vendue (20%) : le Theta encaissé dépasse en moyenne le coût du Gamma, P&L positif pour le vendeur.", en: "Realized volatility (12%) is well below the sold implied (20%): the collected Theta exceeds the average Gamma cost, positive P&L for the seller." },
      commonMistake: {
        fr: "Inverser la règle et croire que le vendeur gagne quand la volatilité réalisée dépasse l'implicite.",
        en: "Reversing the rule and believing the seller wins when realized volatility exceeds the implied.",
      },
    };
  },
};

const discreteGapTemplate: QuestionTemplate = {
  id: "m07-pnl-gap-discret",
  conceptId: "m07-pnl-delta-hedging",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'approximation P&L ≈ Θdt + ½Γ(dS)² capture parfaitement le risque d'un mouvement de marché brutal (gap) survenant entre deux rééquilibrages, sans aucune sous-estimation.",
      en: "The approximation P&L ≈ Θdt + ½Γ(dS)² perfectly captures the risk of a sharp market move (gap) occurring between two rebalances, with no underestimation.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : cette approximation de Taylor au second ordre sous-estime le risque réel lors d'un gap important, car elle ignore les termes d'ordre supérieur qui deviennent significatifs pour de grands mouvements — le risque de gap reste un danger réel non pleinement capturé.",
      en: "False: this second-order Taylor approximation underestimates the real risk during a large gap, since it ignores higher-order terms that become significant for large moves — gap risk remains a real danger not fully captured.",
    },
    commonMistake: {
      fr: "Croire que cette formule d'approximation est exacte quelle que soit l'ampleur du mouvement de marché.",
      en: "Believing this approximation formula is exact whatever the market move's magnitude.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-pnl-vocab",
  conceptId: "m07-pnl-delta-hedging",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La volatilité effectivement observée sur le sous-jacent pendant la durée de vie de l'option, mesurée a posteriori, s'appelle la volatilité ______.",
      en: "The volatility actually observed on the underlying during the option's life, measured after the fact, is called ______ volatility.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["realisee", "réalisée", "realized"],
    hint: { fr: "Par opposition à la volatilité « implicite » du prix de marché.", en: "As opposed to the market price's \"implied\" volatility." },
    explanation: {
      fr: "La volatilité réalisée est mesurée a posteriori sur les mouvements effectifs du sous-jacent, contrairement à la volatilité implicite qui est extraite des prix d'options cotés aujourd'hui.",
      en: "Realized volatility is measured after the fact on the underlying's actual moves, unlike implied volatility, which is extracted from today's quoted option prices.",
    },
    commonMistake: {
      fr: "Confondre volatilité réalisée et volatilité implicite, deux concepts distincts dont l'écart détermine le P&L du vendeur d'options couvert.",
      en: "Confusing realized and implied volatility, two distinct concepts whose gap determines the hedged option seller's P&L.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m07-pnl-comprehension-utilite",
  conceptId: "m07-pnl-delta-hedging",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi la formule P&L ≈ Θdt + ½Γ(dS)² est-elle si centrale pour comprendre le métier de vendeur d'options couvert (market maker) ?",
    en: "Why is the formula P&L ≈ Θdt + ½Γ(dS)² so central to understanding the covered option seller's (market maker's) business?",
  },
  choices: [
    { id: "decomposes-bet", label: { fr: "Elle décompose précisément le résultat quotidien en un gain certain (Theta, l'érosion temporelle encaissée) contre un coût lié à l'ampleur du mouvement réel (Gamma), révélant que le vrai pari est sur la volatilité, pas la direction", en: "It precisely decomposes the daily outcome into a certain gain (Theta, the collected time erosion) against a cost tied to the actual move's size (Gamma), revealing the real bet is on volatility, not direction" } },
    { id: "predicts-direction", label: { fr: "Elle permet de prédire avec certitude la direction future du sous-jacent", en: "It lets you predict the underlying's future direction with certainty" } },
    { id: "no-practical-use", label: { fr: "Elle n'a qu'un intérêt théorique, sans lien avec la pratique réelle d'un desk", en: "It's only of theoretical interest, unrelated to a desk's real practice" } },
  ],
  correctId: "decomposes-bet",
  hint: { fr: "Cette formule sépare un terme prévisible (Θdt) d'un terme qui dépend de l'ampleur RÉELLE du mouvement du marché.", en: "This formula separates a predictable term (Θdt) from a term depending on the market's ACTUAL move size." },
  explanation: {
    fr: "Cette formule montre explicitement que le résultat quotidien d'une position delta-hedgée n'est PAS un pari sur la direction (déjà neutralisée par la couverture), mais un pari pur sur l'AMPLEUR du mouvement : le vendeur encaisse un Theta certain chaque jour, contre un coût de Gamma qui dépend du carré du mouvement réellement observé — c'est cette décomposition qui explique pourquoi vendre des options couvertes est fondamentalement un pari sur la volatilité, pas sur le marché.",
    en: "This formula explicitly shows a delta-hedged position's daily outcome is NOT a directional bet (already neutralized by the hedge), but a pure bet on the SIZE of the move: the seller collects a certain Theta each day, against a Gamma cost depending on the square of the actually observed move — this decomposition is why selling hedged options is fundamentally a bet on volatility, not on the market.",
  },
  commonMistake: {
    fr: "Croire qu'une position couverte en delta ne comporte plus aucun risque significatif, en négligeant l'importance du terme de Gamma dans cette formule.",
    en: "Believing a delta-hedged position no longer carries any significant risk, neglecting the importance of the Gamma term in this formula.",
  },
});

const longVsShortGammaComparisonTemplate = mcqTemplate({
  id: "m07-pnl-comparaison-long-short-gamma",
  conceptId: "m07-pnl-delta-hedging",
  difficulty: "medium",
  prompt: {
    fr: "Pour un même mouvement dS important du sous-jacent, comparez l'effet du terme de Gamma sur le P&L d'une position LONGUE gamma (options achetées, couvertes) et d'une position COURTE gamma (options vendues, couvertes).",
    en: "For the same large dS move in the underlying, compare the Gamma term's effect on the P&L of a LONG gamma (bought, hedged options) position and a SHORT gamma (sold, hedged options) position.",
  },
  choices: [
    { id: "opposite-effect", label: { fr: "Le terme de Gamma est un GAIN pour la position longue gamma, mais une PERTE pour la position courte gamma, de même ampleur en valeur absolue", en: "The Gamma term is a GAIN for the long gamma position, but a LOSS for the short gamma position, of the same magnitude in absolute value" } },
    { id: "same-effect", label: { fr: "Le terme de Gamma a toujours le même effet (positif) pour les deux positions", en: "The Gamma term always has the same (positive) effect for both positions" } },
    { id: "no-effect-either", label: { fr: "Le terme de Gamma n'affecte ni l'une ni l'autre lors d'un mouvement important", en: "The Gamma term affects neither position during a large move" } },
  ],
  correctId: "opposite-effect",
  hint: { fr: "Le Gamma d'une position longue est positif, celui d'une position courte est négatif : le signe du terme ½Γ(dS)² en dépend directement.", en: "A long position's Gamma is positive, a short position's is negative: the sign of the ½Γ(dS)² term directly depends on it." },
  explanation: {
    fr: "Puisque (dS)² est toujours positif ou nul, le signe du terme de Gamma dans la formule du P&L est entièrement déterminé par le signe du Gamma lui-même : positif (un gain) pour une position longue gamma (Γ>0), négatif (une perte) pour une position courte gamma (Γ<0). C'est pourquoi un grand mouvement du marché profite systématiquement à l'acheteur d'options couvert, et coûte systématiquement au vendeur couvert — la contrepartie du Theta qu'il encaisse.",
    en: "Since (dS)² is always non-negative, the Gamma term's sign in the P&L formula is entirely determined by Gamma's own sign: positive (a gain) for a long gamma position (Γ>0), negative (a loss) for a short gamma position (Γ<0). This is why a large market move systematically benefits the hedged option buyer, and systematically costs the hedged seller — the counterpart of the Theta they collect.",
  },
  commonMistake: {
    fr: "Croire qu'un grand mouvement du sous-jacent profite toujours à toute position couverte en delta, sans distinguer si le Gamma de cette position est positif ou négatif.",
    en: "Believing a large underlying move always benefits any delta-hedged position, without distinguishing whether that position's Gamma is positive or negative.",
  },
});

const whatIfRealizedEqualsImpliedTemplate = mcqTemplate({
  id: "m07-pnl-whatif-vol-realisee-egale-implicite",
  conceptId: "m07-pnl-delta-hedging",
  difficulty: "hard",
  prompt: {
    fr: "Si la volatilité réalisée sur toute la durée de vie de l'option s'avère exactement égale à la volatilité implicite vendue, quel est le P&L attendu (en moyenne) du vendeur couvert en delta ?",
    en: "If the volatility realized over the option's entire life turns out exactly equal to the sold implied volatility, what is the delta-hedged seller's expected (average) P&L?",
  },
  choices: [
    { id: "zero-on-average", label: { fr: "Proche de zéro en moyenne : le Theta encaissé compense en moyenne exactement le coût de Gamma, sur un grand nombre de trajectoires", en: "Close to zero on average: the collected Theta on average exactly offsets the Gamma cost, over a large number of paths" } },
    { id: "always-positive", label: { fr: "Toujours strictement positif, quelle que soit la trajectoire suivie", en: "Always strictly positive, whatever path is followed" } },
    { id: "always-negative", label: { fr: "Toujours strictement négatif, quelle que soit la trajectoire suivie", en: "Always strictly negative, whatever path is followed" } },
  ],
  correctId: "zero-on-average",
  hint: { fr: "Le prix Black-Scholes est construit précisément pour que ce point d'équilibre existe — c'est le principe même de la formule.", en: "The Black-Scholes price is precisely built so this equilibrium point exists — the very principle of the formula." },
  explanation: {
    fr: "Le prix Black-Scholes (et donc le Theta correspondant) est calibré précisément pour que, si la volatilité réalisée égale la volatilité implicite utilisée au pricing, le P&L moyen du delta-hedging soit nul : c'est le point d'équilibre théorique entre gain de Theta et coût de Gamma. Sur une trajectoire individuelle, le P&L quotidien fluctue (parfois positif, parfois négatif), mais sa moyenne sur de nombreuses trajectoires converge vers zéro à ce niveau de volatilité réalisée.",
    en: "The Black-Scholes price (and so the corresponding Theta) is calibrated precisely so that, if realized volatility equals the implied volatility used in pricing, the average delta-hedging P&L is zero: the theoretical equilibrium point between Theta gain and Gamma cost. On an individual path, daily P&L fluctuates (sometimes positive, sometimes negative), but its average over many paths converges to zero at this realized volatility level.",
  },
  commonMistake: {
    fr: "Croire que le vendeur d'options couvert gagne ou perd systématiquement de l'argent, sans réaliser que le point d'équilibre théorique (P&L nul en moyenne) correspond précisément au cas où volatilité réalisée et implicite coïncident.",
    en: "Believing the hedged option seller systematically wins or loses money, without realizing the theoretical equilibrium point (zero average P&L) corresponds precisely to when realized and implied volatility coincide.",
  },
});

const whatIfFlatMarketTemplate = mcqTemplate({
  id: "m07-pnl-whatif-marche-plat",
  conceptId: "m07-pnl-delta-hedging",
  difficulty: "medium",
  prompt: {
    fr: "Pendant une semaine entière, le sous-jacent reste rigoureusement immobile (dS=0 chaque jour). Quel est le P&L cumulé d'un vendeur d'options couvert en delta sur cette semaine ?",
    en: "For an entire week, the underlying stays rigorously motionless (dS=0 each day). What is the cumulative P&L of a delta-hedged option seller over that week?",
  },
  choices: [
    { id: "positive-theta-only", label: { fr: "Positif : sans aucun mouvement, le terme de Gamma est nul chaque jour, ne laissant que le Theta encaissé, favorable au vendeur", en: "Positive: with no move at all, the Gamma term is zero each day, leaving only the collected Theta, favorable to the seller" } },
    { id: "zero", label: { fr: "Nul, l'absence de mouvement du marché implique nécessairement un P&L nul", en: "Zero, the market's lack of movement necessarily implies zero P&L" } },
    { id: "negative", label: { fr: "Négatif, malgré l'absence de mouvement", en: "Negative, despite the lack of movement" } },
  ],
  correctId: "positive-theta-only",
  hint: { fr: "Si dS=0, que devient le terme ½Γ(dS)² dans la formule du P&L ? Que reste-t-il ?", en: "If dS=0, what happens to the ½Γ(dS)² term in the P&L formula? What remains?" },
  explanation: {
    fr: "Avec dS=0 chaque jour, le terme de Gamma ½Γ(dS)² s'annule exactement, ne laissant que le terme de Theta Θdt à chaque période : pour un vendeur d'options (Theta positif), le P&L cumulé sur la semaine est donc entièrement composé de ce Theta encaissé, sans aucun coût de Gamma pour le compenser — le scénario le plus favorable possible pour un vendeur d'options couvert.",
    en: "With dS=0 each day, the Gamma term ½Γ(dS)² exactly vanishes, leaving only the Theta term Θdt each period: for an option seller (positive Theta), the cumulative P&L over the week is therefore entirely made up of this collected Theta, with no Gamma cost to offset it — the most favorable scenario possible for a hedged option seller.",
  },
  commonMistake: {
    fr: "Croire qu'une absence de mouvement du sous-jacent implique un P&L nul pour une position optionnelle couverte, en oubliant que le Theta continue de s'accumuler indépendamment du mouvement.",
    en: "Believing no move in the underlying implies zero P&L for a hedged option position, forgetting Theta keeps accumulating independent of movement.",
  },
});

const breakevenMoveNumericTemplate: QuestionTemplate = {
  id: "m07-pnl-mouvement-breakeven-calcul",
  conceptId: "m07-pnl-delta-hedging",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const theta = -1 * randomInt(rng, 10, 50);
    const dt = 1 / 365;
    const gamma = randomFloat(rng, 0.02, 0.15, 3);
    const breakevenMove = Math.round(Math.sqrt((-2 * theta * dt) / gamma) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position vendeuse couverte en delta a Θ=${theta} (par an) et Γ=${fmt(gamma, "fr", 3)}. Quel mouvement journalier |dS| du sous-jacent (en valeur absolue) ferait exactement basculer le P&L du jour à zéro (le seuil de rentabilité quotidien) ?`,
        en: `A hedged short position has Θ=${theta} (per year) and Γ=${fmt(gamma, "en", 3)}. What daily underlying move |dS| (in absolute value) would make the day's P&L exactly hit zero (the daily breakeven)?`,
      },
      numericUnit: { fr: "même unité que le sous-jacent", en: "same unit as the underlying" },
      numericTolerance: "± 0.05",
      hint: { fr: "Posez Θdt + ½Γ(dS)² = 0, puis résolvez pour |dS| = √(−2Θdt/Γ).", en: "Set Θdt + ½Γ(dS)² = 0, then solve for |dS| = √(−2Θdt/Γ)." },
      numeric: { value: breakevenMove, tolerance: 0.05 },
      calculation: {
        fr: `|dS| = √(−2×${theta}×(1/365) / ${fmt(gamma, "fr", 3)}) ≈ ${fmt(breakevenMove, "fr")}.`,
        en: `|dS| = √(−2×${theta}×(1/365) / ${fmt(gamma, "en", 3)}) ≈ ${fmt(breakevenMove, "en")}.`,
      },
      explanation: {
        fr: "Ce mouvement de « breakeven » quotidien indique le seuil au-delà duquel le vendeur d'options couvert commence à perdre de l'argent ce jour-là : en dessous de ce seuil, le Theta encaissé compense le coût de Gamma ; au-dessus, le coût de Gamma l'emporte. C'est un repère pratique utilisé par les traders pour juger si un mouvement de marché donné est \"acceptable\" pour leur position.",
        en: "This daily \"breakeven\" move indicates the threshold beyond which the hedged option seller starts losing money that day: below it, the collected Theta offsets the Gamma cost; above it, the Gamma cost wins out. It's a practical benchmark traders use to judge whether a given market move is \"acceptable\" for their position.",
      },
      commonMistake: {
        fr: "Oublier le facteur 2 en inversant l'équation, ou oublier de prendre la racine carrée du résultat.",
        en: "Forgetting the factor of 2 when inverting the equation, or forgetting to take the result's square root.",
      },
    };
  },
};

const singleDayJudgmentErrorTemplate = trueFalseTemplate({
  id: "m07-pnl-erreur-jugement-un-jour",
  conceptId: "m07-pnl-delta-hedging",
  difficulty: "medium",
  statement: {
    fr: "Si le P&L de couverture d'une seule journée est négatif pour un vendeur d'options, cela prouve que la volatilité implicite vendue était trop basse par rapport à la volatilité réellement réalisée.",
    en: "If a single day's hedging P&L is negative for an option seller, this proves the sold implied volatility was too low relative to the actually realized volatility.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le P&L quotidien fluctue naturellement (parfois positif, parfois négatif) même si la volatilité implicite vendue était parfaitement calibrée en moyenne sur la durée de vie de l'option — un jour de perte isolé peut simplement refléter un mouvement plus important que la moyenne ce jour-là. Seule une analyse sur une période suffisamment longue permet de juger si la volatilité implicite vendue était réellement mal calibrée.",
    en: "False: daily P&L naturally fluctuates (sometimes positive, sometimes negative) even if the sold implied volatility was perfectly calibrated on average over the option's life — an isolated loss day may simply reflect a larger-than-average move that day. Only analysis over a sufficiently long period lets you judge whether the sold implied volatility was actually mis-calibrated.",
  },
  commonMistake: {
    fr: "Tirer une conclusion générale sur la qualité du pricing à partir d'un seul jour de P&L, en oubliant la nature intrinsèquement bruitée du résultat quotidien du delta-hedging.",
    en: "Drawing a general conclusion about pricing quality from a single day's P&L, forgetting the delta-hedging daily outcome's inherently noisy nature.",
  },
});

const volArbTraderScenarioTemplate = mcqTemplate({
  id: "m07-pnl-scenario-trader-arbitrage-vol",
  conceptId: "m07-pnl-delta-hedging",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader vend une option couverte à une volatilité implicite de 22%, convaincu que la volatilité réalisée sera plus basse. Sur toute la durée de vie de l'option, la volatilité réellement réalisée est de 15%. Quel est le résultat le plus probable pour ce trader ?",
    en: "A trader sells a hedged option at 22% implied volatility, convinced realized volatility will be lower. Over the option's entire life, actually realized volatility is 15%. What is the most likely outcome for this trader?",
  },
  choices: [
    { id: "profit", label: { fr: "Un profit : ayant vendu \"cher\" (22%) une volatilité qui s'est avérée \"bon marché\" (15%), le Theta encaissé dépasse en moyenne le coût de Gamma réellement subi", en: "A profit: having sold \"expensive\" (22%) a volatility that turned out \"cheap\" (15%), the collected Theta exceeds on average the actually incurred Gamma cost" } },
    { id: "loss", label: { fr: "Une perte, car vendre de la volatilité est toujours risqué", en: "A loss, since selling volatility is always risky" } },
    { id: "breakeven", label: { fr: "Un résultat exactement nul, la stratégie s'annulant toujours d'elle-même", en: "An exactly zero outcome, the strategy always self-canceling" } },
  ],
  correctId: "profit",
  hint: { fr: "Le trader a vendu à un niveau de volatilité supérieur à ce qui s'est réellement matérialisé — qui profite de cet écart ?", en: "The trader sold at a volatility level higher than what actually materialized — who benefits from that gap?" },
  explanation: {
    fr: "La conviction du trader s'est réalisée : la volatilité vendue (22%) était supérieure à celle effectivement réalisée (15%), donc le Theta encaissé (calculé sur la base des 22% vendus) dépasse en moyenne le coût de Gamma réellement subi (déterminé par la volatilité réalisée plus basse) — exactement le pari gagnant recherché par un vendeur de volatilité couvert en delta.",
    en: "The trader's conviction played out: the sold volatility (22%) was higher than what was actually realized (15%), so the collected Theta (computed on the sold 22%) exceeds on average the actually incurred Gamma cost (determined by the lower realized volatility) — exactly the winning bet sought by a delta-hedged volatility seller.",
  },
  commonMistake: {
    fr: "Croire que vendre de la volatilité est systématiquement une stratégie perdante ou gagnante, sans tenir compte de l'écart réel entre volatilité vendue et volatilité effectivement réalisée.",
    en: "Believing selling volatility is systematically a losing or winning strategy, without accounting for the actual gap between sold volatility and volatility actually realized.",
  },
});

const gapRiskAsymmetryScenarioTemplate = mcqTemplate({
  id: "m07-pnl-scenario-asymetrie-risque-gap",
  conceptId: "m07-pnl-delta-hedging",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un vendeur d'options couvert encaisse un Theta de 50 par jour, en moyenne, pendant 3 semaines calmes (soit environ 750 sur la période). Puis une annonce surprise fait sauter le sous-jacent de 15% en une seule journée (un gap), causant une perte de Gamma de 8 000 ce jour-là. Quelle leçon cet épisode illustre-t-il sur l'asymétrie du risque de vente de volatilité ?",
    en: "A hedged option seller collects a Theta of 50 per day, on average, over 3 calm weeks (about 750 over the period). Then a surprise announcement makes the underlying jump 15% in a single day (a gap), causing a Gamma loss of 8,000 that day. What lesson does this episode illustrate about the asymmetry of selling volatility risk?",
  },
  choices: [
    { id: "asymmetric-risk", label: { fr: "Le gain de Theta est régulier mais limité, tandis que la perte de Gamma lors d'un choc violent peut être bien plus importante et rapide, effaçant plusieurs semaines de gains en une seule journée", en: "The Theta gain is regular but limited, while a Gamma loss during a violent shock can be far larger and faster, erasing several weeks of gains in a single day" } },
    { id: "symmetric-risk", label: { fr: "Les gains et pertes potentielles sont toujours parfaitement symétriques en ampleur pour un vendeur d'options", en: "Potential gains and losses are always perfectly symmetric in magnitude for an option seller" } },
    { id: "no-lesson", label: { fr: "Cet épisode est purement anecdotique, sans leçon généralisable sur le risque de vente de volatilité", en: "This episode is purely anecdotal, with no generalizable lesson about selling volatility risk" } },
  ],
  correctId: "asymmetric-risk",
  hint: { fr: "Comparez l'ampleur du gain cumulé sur 3 semaines calmes à celle de la perte d'un seul jour de choc — que remarquez-vous ?", en: "Compare the size of the cumulative gain over 3 calm weeks to that of a single shock day's loss — what do you notice?" },
  explanation: {
    fr: "Cet épisode illustre une asymétrie fondamentale de la vente de volatilité couverte : le Theta s'accumule LENTEMENT et RÉGULIÈREMENT (750 sur 3 semaines), tandis que le coût de Gamma dépend du CARRÉ du mouvement et peut donc exploser lors d'un choc violent (8 000 en un seul jour, plus de 10 fois le gain de 3 semaines) — c'est pourquoi vendre de la volatilité est souvent décrit comme \"ramasser des pièces devant un rouleau compresseur\", un profil de risque à toujours garder à l'esprit.",
    en: "This episode illustrates a fundamental asymmetry in selling hedged volatility: Theta accumulates SLOWLY and STEADILY (750 over 3 weeks), while the Gamma cost depends on the SQUARE of the move and can therefore explode during a violent shock (8,000 in a single day, more than 10 times the 3-week gain) — this is why selling volatility is often described as \"picking up pennies in front of a steamroller\", a risk profile always worth keeping in mind.",
  },
  commonMistake: {
    fr: "Évaluer la rentabilité d'une stratégie de vente de volatilité uniquement sur la régularité apparente des gains quotidiens, sans tenir compte du risque de queue asymétrique associé aux chocs rares mais violents.",
    en: "Evaluating a volatility-selling strategy's profitability solely on the apparent regularity of daily gains, without accounting for the asymmetric tail risk tied to rare but violent shocks.",
  },
});

export const templates: QuestionTemplate[] = [
  periodPnlNumericTemplate,
  sellerProfitableTemplate,
  discreteGapTemplate,
  vocabTemplate,
  comprehensionTemplate,
  longVsShortGammaComparisonTemplate,
  whatIfRealizedEqualsImpliedTemplate,
  whatIfFlatMarketTemplate,
  breakevenMoveNumericTemplate,
  singleDayJudgmentErrorTemplate,
  volArbTraderScenarioTemplate,
  gapRiskAsymmetryScenarioTemplate,
];
