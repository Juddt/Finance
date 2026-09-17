import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const featureMatchTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-caracteristique",
  conceptId: "m02-forward-vs-future",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const feature = pick(
      rng,
      [
        { id: "standardization", fr: "Contrat standardisé (taille, échéance fixées par la bourse)", en: "Standardized contract (size, maturity set by the exchange)" },
        { id: "daily", fr: "Règlement quotidien des gains et pertes (mark-to-market)", en: "Daily settlement of gains and losses (mark-to-market)" },
        { id: "ccp", fr: "Contrepartie garantie par une chambre de compensation", en: "Counterparty guaranteed by a clearinghouse" },
        { id: "liquid", fr: "Position facilement revendue avant l'échéance sur un marché organisé", en: "Position easily resold before maturity on an exchange" },
      ] as const
    );

    return {
      prompt: {
        fr: `Laquelle de ces caractéristiques décrit un FUTURE plutôt qu'un forward : « ${feature.fr} » ?`,
        en: `Which contract does this feature describe: « ${feature.en} » ?`,
      },
      choices: buildChoices([
        { id: "future", label: { fr: "Le future", en: "The future" } },
        { id: "forward", label: { fr: "Le forward", en: "The forward" } },
      ]),
      hint: {
        fr: "Le future est le produit standardisé et coté en bourse.",
        en: "The future is the standardized, exchange-listed product.",
      },
      correctChoiceIds: ["future"],
      explanation: {
        fr: `« ${feature.fr} » est une caractéristique du future : la standardisation, la chambre de compensation, le règlement quotidien et la liquidité en continu sont ses quatre traits distinctifs par rapport au forward.`,
        en: `"${feature.en}" is a feature of the future: standardization, the clearinghouse, daily settlement and continuous liquidity are its four distinguishing traits versus the forward.`,
      },
      commonMistake: {
        fr: "Attribuer ces caractéristiques au forward, qui est justement défini par leur absence (sur mesure, bilatéral, réglé une seule fois).",
        en: "Attributing these features to the forward, which is precisely defined by their absence (custom, bilateral, settled once).",
      },
    };
  },
};

const marginCallTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-appel-marge",
  conceptId: "m02-forward-vs-future",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const contracts = randomInt(rng, 2, 40);
    const priceMove = (randomInt(rng, -300, 300) / 100).toFixed(2);
    const move = Number(priceMove);
    const direction = pick(rng, ["long", "short"] as const);
    const signedMove = direction === "long" ? move : -move;
    const variation = Math.round(contracts * signedMove * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un trader détient une position ${direction === "long" ? "longue" : "courte"} de ${contracts} contrats future. Le prix de règlement varie de ${fmt(move, "fr")} par rapport à la veille. Quelle est la marge de variation créditée (positive) ou débitée (négative) sur son compte ?`,
        en: `A trader holds a ${direction} position of ${contracts} future contracts. The settlement price moves by ${fmt(move, "en")} versus yesterday. What is the variation margin credited (positive) or debited (negative) to their account?`,
      },
      numericUnit: { fr: "unités monétaires", en: "currency units" },
      numericTolerance: "± 0.5",
      hint: {
        fr: `Marge = quantité × variation × (${direction === "long" ? "+1" : "−1"} selon la position).`,
        en: `Margin = quantity × change × (${direction === "long" ? "+1" : "−1"} for this position).`,
      },
      numeric: { value: variation, tolerance: 0.5 },
      calculation: {
        fr: `Marge de variation = ${contracts} × ${fmt(signedMove, "fr")} = ${fmt(variation, "fr")}.`,
        en: `Variation margin = ${contracts} × ${fmt(signedMove, "en")} = ${fmt(variation, "en")}.`,
      },
      explanation: {
        fr: "Chaque jour, le compte de marge est ajusté du gain ou de la perte réalisé ce jour-là ; c'est ce qui distingue le future du forward, réglé une seule fois à l'échéance.",
        en: "Every day, the margin account is adjusted for that day's gain or loss; this is what sets the future apart from the forward, which settles only once at maturity.",
      },
      commonMistake: {
        fr: "Oublier d'inverser le signe pour une position courte : une baisse du prix est un gain pour le vendeur.",
        en: "Forgetting to flip the sign for a short position: a price drop is a gain for the seller.",
      },
    };
  },
};

const counterpartyTrueFalseTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-contrepartie",
  conceptId: "m02-forward-vs-future",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Sur un future, le collatéral déposé en marge supprime totalement tout risque de contrepartie, sans aucune exception.",
      en: "On a future, the collateral posted as margin fully removes all counterparty risk, with no exception.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le collatéral réduit fortement le risque de contrepartie, il ne l'élimine pas complètement (le collatéral lui-même peut perdre de la valeur, et un mouvement extrême entre deux appels de marge peut dépasser la marge déposée).",
      en: "False: collateral strongly reduces counterparty risk, it does not fully eliminate it (the collateral itself can lose value, and an extreme move between two margin calls can exceed the posted margin).",
    },
    commonMistake: {
      fr: "Croire qu'un mécanisme de collatéral rend une position totalement sans risque de contrepartie.",
      en: "Believing a collateral mechanism makes a position fully free of counterparty risk.",
    },
  }),
};

const choiceScenarioTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-choix",
  conceptId: "m02-forward-vs-future",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const amount = randomInt(rng, 2, 90) * 10_000 + randomInt(rng, 100, 900);
    const days = randomInt(rng, 20, 300);
    const wantsExit = pick(rng, [true, false] as const);

    return {
      isScenario: true,
      prompt: {
        fr: wantsExit
          ? `Un trader veut prendre position sur le cuivre pendant quelques semaines, avec la possibilité de revendre à tout moment sans négocier avec une contrepartie précise. Quel contrat choisir ?`
          : `Une entreprise doit payer exactement ${fmt(amount, "fr")} devise étrangère dans ${days} jours, un montant et une date non standard, et conservera la position jusqu'à cette date précise. Quel contrat choisir ?`,
        en: wantsExit
          ? `A trader wants to take a position on copper for a few weeks, with the ability to exit at any time without negotiating with a specific counterparty. Which contract should they choose?`
          : `A company must pay exactly ${fmt(amount, "en")} in foreign currency in ${days} days, a non-standard amount and date, and will hold the position until that exact date. Which contract should it choose?`,
      },
      choices: buildChoices([
        { id: "future", label: { fr: "Un future", en: "A future" } },
        { id: "forward", label: { fr: "Un forward", en: "A forward" } },
      ]),
      hint: {
        fr: "Un montant/date sur mesure conservé jusqu'au bout → forward. Un besoin de sortir vite et facilement → future.",
        en: "A custom amount/date held to the end → forward. A need to exit quickly and easily → future.",
      },
      correctChoiceIds: [wantsExit ? "future" : "forward"],
      explanation: {
        fr: wantsExit
          ? "Le besoin de liquidité et de sortie facile avant l'échéance oriente vers le future, coté en continu sur un marché organisé."
          : "Un montant et une date non standard, conservés jusqu'à l'échéance, orientent vers un forward sur mesure négocié directement avec une banque.",
        en: wantsExit
          ? "The need for liquidity and an easy exit before maturity points to the future, continuously quoted on an exchange."
          : "A non-standard amount and date, held to maturity, points to a custom forward negotiated directly with a bank.",
      },
      commonMistake: {
        fr: "Choisir un future pour un besoin sur mesure qu'aucun contrat standardisé ne peut répliquer exactement.",
        en: "Choosing a future for a custom need that no standardized contract can exactly replicate.",
      },
    };
  },
};

const comprehensionTemplate = mcqTemplate({
  id: "m02-fwd-vs-fut-comprehension-mtm",
  conceptId: "m02-forward-vs-future",
  difficulty: "medium",
  prompt: {
    fr: "En quoi le règlement quotidien (mark-to-market) d'un future réduit-il le risque de contrepartie accumulé, par rapport au règlement unique d'un forward à l'échéance ?",
    en: "How does a future's daily settlement (mark-to-market) reduce accumulated counterparty risk, compared to a forward's single settlement at maturity?",
  },
  choices: [
    { id: "cap", label: { fr: "Il plafonne la perte non réglée à au plus un jour de mouvement de prix, au lieu de laisser s'accumuler tout l'écart jusqu'à l'échéance", en: "It caps the unsettled loss to at most one day of price movement, instead of letting the whole gap build up until maturity" } },
    { id: "eliminates-market-risk", label: { fr: "Il élimine totalement le risque de marché de la position", en: "It totally eliminates the position's market risk" } },
    { id: "no-effect", label: { fr: "Il n'a aucun effet sur le risque, seul le collatéral initial compte", en: "It has no effect on risk, only the initial collateral matters" } },
  ],
  correctId: "cap",
  hint: { fr: "Un forward accumule tout l'écart de prix jusqu'à l'échéance avant de le régler ; un future le règle chaque jour.", en: "A forward accumulates the entire price gap until maturity before settling it; a future settles it every day." },
  explanation: {
    fr: "Sur un forward, l'écart entre le prix convenu et le prix de marché peut grossir pendant toute la durée du contrat avant d'être réglé une seule fois : si la contrepartie perdante fait défaut à l'échéance, la perte non recouvrée peut être importante. Sur un future, cet écart est réglé (et donc remis à zéro) chaque jour, si bien qu'une défaillance ne peut jamais faire perdre plus qu'un jour de mouvement de prix.",
    en: "On a forward, the gap between the agreed price and the market price can grow throughout the contract's life before being settled just once: if the losing counterparty defaults at maturity, the unrecovered loss can be large. On a future, this gap is settled (and so reset to zero) every day, so a default can never cause a loss beyond a single day's price move.",
  },
  commonMistake: {
    fr: "Croire que le mark-to-market supprime le risque de marché de la position, alors qu'il ne fait que limiter le risque de CONTREPARTIE accumulé.",
    en: "Believing mark-to-market removes the position's market risk, when it only limits accumulated COUNTERPARTY risk.",
  },
});

const priceConvergenceComparisonTemplate = trueFalseTemplate({
  id: "m02-fwd-vs-fut-comparaison-convergence-prix",
  conceptId: "m02-forward-vs-future",
  difficulty: "hard",
  statement: {
    fr: "En l'absence de corrélation entre le taux sans risque et le prix du sous-jacent, la théorie montre que le prix forward et le prix future d'un même sous-jacent, à même échéance, sont égaux.",
    en: "In the absence of correlation between the risk-free rate and the underlying's price, theory shows that the forward price and the future price of the same underlying, at the same maturity, are equal.",
  },
  correct: true,
  explanation: {
    fr: "Vrai : le règlement quotidien du future crée en théorie un léger écart de valorisation par rapport au forward, uniquement lorsque les gains/pertes quotidiens peuvent être réinvestis/refinancés à un taux corrélé au sous-jacent. Sans cette corrélation (hypothèse standard de nombreux modèles simplifiés), les deux prix coïncident.",
    en: "True: a future's daily settlement in theory creates a slight valuation gap versus the forward, only when the daily gains/losses can be reinvested/refinanced at a rate correlated with the underlying. Without that correlation (the standard assumption in many simplified models), the two prices coincide.",
  },
  commonMistake: {
    fr: "Croire que forward et future ont systématiquement des prix identiques quelles que soient les conditions de marché, en ignorant cette subtilité liée à la corrélation taux/sous-jacent.",
    en: "Believing forwards and futures systematically have identical prices under any market conditions, ignoring this subtlety tied to the rate/underlying correlation.",
  },
});

const whatIfCorrelatedRatesTemplate = mcqTemplate({
  id: "m02-fwd-vs-fut-whatif-correlation-taux",
  conceptId: "m02-forward-vs-future",
  difficulty: "hard",
  prompt: {
    fr: "Si le taux d'intérêt est POSITIVEMENT corrélé au prix du sous-jacent (les gains quotidiens d'une position longue future se réinvestissent alors à des taux plus élevés que d'habitude), l'effet théorique du mark-to-market favorise-t-il plutôt le long future ou le short future, par rapport à un forward équivalent ?",
    en: "If the interest rate is POSITIVELY correlated with the underlying price (a long future position's daily gains then get reinvested at higher-than-usual rates), does the theoretical mark-to-market effect favor the long future or the short future, versus an equivalent forward?",
  },
  choices: [
    { id: "long", label: { fr: "Le long future : ses gains quotidiens se réinvestissent à des taux plus favorables quand le prix monte", en: "The long future: its daily gains get reinvested at more favorable rates when the price rises" } },
    { id: "short", label: { fr: "Le short future : ses pertes quotidiennes se financent à des taux plus favorables", en: "The short future: its daily losses get funded at more favorable rates" } },
    { id: "neither", label: { fr: "Aucun des deux, la corrélation n'a jamais d'impact théorique", en: "Neither, correlation never has a theoretical impact" } },
  ],
  correctId: "long",
  hint: { fr: "Pensez à quand le long future gagne de l'argent au jour le jour : est-ce quand les taux sont hauts ou bas, dans ce scénario ?", en: "Think about when the long future makes money day to day: is it when rates are high or low, in this scenario?" },
  explanation: {
    fr: "Quand le prix du sous-jacent monte (le long future encaisse un gain ce jour-là) ET que les taux sont corrélés positivement au prix (donc eux aussi hauts ce jour-là), ce gain se réinvestit à un taux plus élevé ; à l'inverse, ses pertes (quand le prix baisse) se financent à des taux plus bas. Ce léger avantage structurel pour le long future rend, en théorie, le prix future légèrement supérieur au prix forward dans ce cas.",
    en: "When the underlying's price rises (the long future books a gain that day) AND rates are positively correlated with price (so also high that day), that gain gets reinvested at a higher rate; conversely, its losses (when price falls) get funded at lower rates. This slight structural advantage for the long future theoretically makes the future price slightly above the forward price in this case.",
  },
  commonMistake: {
    fr: "Croire que ce raffinement théorique change fondamentalement le pricing en pratique : l'écart réel entre forward et future reste généralement négligeable, sauf pour des sous-jacents et échéances très spécifiques.",
    en: "Believing this theoretical refinement fundamentally changes pricing in practice: the real gap between forward and future generally remains negligible, except for very specific underlyings and maturities.",
  },
});

const whatIfMarginCallFailureTemplate = mcqTemplate({
  id: "m02-fwd-vs-fut-whatif-echec-appel-marge",
  conceptId: "m02-forward-vs-future",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader détient une position future et reçoit un appel de marge après un mouvement de prix défavorable, mais ne peut pas déposer les fonds demandés à temps. Que fait généralement la chambre de compensation (via le courtier) ?",
    en: "A trader holds a future position and receives a margin call after an unfavorable price move, but cannot post the requested funds in time. What does the clearinghouse (via the broker) generally do?",
  },
  choices: [
    { id: "liquidate", label: { fr: "Elle liquide (clôture) la position de force pour limiter l'exposition impayée", en: "It force-liquidates (closes) the position to limit unpaid exposure" } },
    { id: "wait", label: { fr: "Elle attend indéfiniment que le trader trouve les fonds", en: "It waits indefinitely for the trader to find the funds" } },
    { id: "forgive", label: { fr: "Elle annule simplement l'appel de marge sans conséquence", en: "It simply cancels the margin call with no consequence" } },
  ],
  correctId: "liquidate",
  hint: { fr: "Le système de marge existe précisément pour empêcher qu'une perte non réglée ne s'accumule sans limite.", en: "The margin system exists precisely to prevent an unsettled loss from building up without limit." },
  explanation: {
    fr: "Le mécanisme de marge quotidien n'a de sens que s'il est réellement appliqué : en cas de non-réponse à un appel de marge, le courtier (sur instruction de la chambre de compensation) liquide la position pour empêcher que la perte ne continue de s'accumuler au-delà du collatéral déjà déposé — une discipline qui n'existe pas de la même façon sur un forward bilatéral.",
    en: "The daily margin mechanism only makes sense if it is actually enforced: on a failure to meet a margin call, the broker (on the clearinghouse's instruction) liquidates the position to prevent the loss from continuing to build beyond the collateral already posted — a discipline that doesn't exist the same way on a bilateral forward.",
  },
  commonMistake: {
    fr: "Croire que le système de marge est simplement indicatif, sans conséquence réelle en cas de non-paiement.",
    en: "Believing the margin system is purely indicative, with no real consequence if unpaid.",
  },
});

const cumulativeMarginNumericTemplate: QuestionTemplate = {
  id: "m02-fwd-vs-fut-marge-cumulee-calcul",
  conceptId: "m02-forward-vs-future",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const contracts = randomInt(rng, 3, 20);
    const moves = [randomInt(rng, -150, 150) / 100, randomInt(rng, -150, 150) / 100, randomInt(rng, -150, 150) / 100];
    const direction = pick(rng, ["long", "short"] as const);
    const sign = direction === "long" ? 1 : -1;
    const total = Math.round(contracts * sign * moves.reduce((a, b) => a + b, 0) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position ${direction === "long" ? "longue" : "courte"} de ${contracts} contrats future enregistre 3 jours consécutifs de variation de prix de règlement : ${moves.map((m) => m.toFixed(2)).join(", ")}. Quelle est la marge de variation cumulée sur ces 3 jours ?`,
        en: `A ${direction} position of ${contracts} future contracts records 3 consecutive days of settlement price moves: ${moves.map((m) => m.toFixed(2)).join(", ")}. What is the cumulative variation margin over these 3 days?`,
      },
      numericUnit: { fr: "unités monétaires", en: "currency units" },
      numericTolerance: "± 0.5",
      hint: { fr: "Sommez d'abord les variations de prix, puis multipliez par la quantité (et par −1 pour une position courte).", en: "First sum the price moves, then multiply by the quantity (and by −1 for a short position)." },
      numeric: { value: total, tolerance: 0.5 },
      calculation: {
        fr: `Somme des variations = ${moves.map((m) => m.toFixed(2)).join(" + ")} = ${moves.reduce((a, b) => a + b, 0).toFixed(2)}. Marge cumulée = ${contracts} × ${sign > 0 ? "+1" : "−1"} × ${moves.reduce((a, b) => a + b, 0).toFixed(2)} = ${total.toFixed(2)}.`,
        en: `Sum of moves = ${moves.map((m) => m.toFixed(2)).join(" + ")} = ${moves.reduce((a, b) => a + b, 0).toFixed(2)}. Cumulative margin = ${contracts} × ${sign > 0 ? "+1" : "−1"} × ${moves.reduce((a, b) => a + b, 0).toFixed(2)} = ${total.toFixed(2)}.`,
      },
      explanation: {
        fr: "Contrairement à un unique règlement à l'échéance, la marge d'un future se cumule jour après jour : le total sur plusieurs jours équivaut mathématiquement à appliquer la variation totale de prix en une fois, mais avec un règlement de trésorerie réel à chaque étape intermédiaire.",
        en: "Unlike a single settlement at maturity, a future's margin accumulates day after day: the total over several days is mathematically equivalent to applying the total price move at once, but with real cash settlement at each intermediate step.",
      },
      commonMistake: {
        fr: "Ne prendre en compte que le dernier mouvement de prix, en oubliant de cumuler les règlements des jours précédents.",
        en: "Only accounting for the last price move, forgetting to accumulate the previous days' settlements.",
      },
    };
  },
};

const forwardCloseoutErrorTemplate = trueFalseTemplate({
  id: "m02-fwd-vs-fut-erreur-sortie-avant-echeance",
  conceptId: "m02-forward-vs-future",
  difficulty: "medium",
  statement: {
    fr: "Comme pour un future, un détenteur de forward peut généralement revendre facilement sa position sur un marché organisé avant l'échéance, à n'importe quel moment.",
    en: "Like a future, a forward's holder can generally easily resell their position on an exchange before maturity, at any time.",
  },
  correct: false,
  explanation: {
    fr: "Faux : un forward est un contrat bilatéral sur mesure, sans marché organisé ni contrepartie centrale. Sortir d'une position avant l'échéance nécessite de négocier un dénouement anticipé (souvent coûteux) directement avec la contrepartie d'origine, contrairement au future qui se revend en un clic sur son marché coté.",
    en: "False: a forward is a custom bilateral contract, with no exchange or central counterparty. Exiting a position before maturity requires negotiating an early unwind (often costly) directly with the original counterparty, unlike a future which can be resold with one click on its listed market.",
  },
  commonMistake: {
    fr: "Transposer au forward la liquidité de sortie propre au future, alors que c'est justement l'un des principaux inconvénients pratiques du forward.",
    en: "Transposing the future's exit liquidity onto the forward, when this is precisely one of the forward's main practical drawbacks.",
  },
});

const cashConstrainedTreasuryScenarioTemplate = mcqTemplate({
  id: "m02-fwd-vs-fut-scenario-tresorerie-contrainte",
  conceptId: "m02-forward-vs-future",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une PME veut couvrir un paiement en devise dans 9 mois, mais sa trésorerie est déjà tendue et elle ne veut absolument pas risquer de devoir déposer des appels de marge imprévisibles entre-temps. Quel instrument est le plus adapté ?",
    en: "An SME wants to hedge a currency payment in 9 months, but its cash position is already tight and it absolutely does not want to risk unpredictable margin calls in the meantime. Which instrument fits best?",
  },
  choices: [
    { id: "forward", label: { fr: "Un forward OTC, réglé une seule fois à l'échéance", en: "An OTC forward, settled only once at maturity" } },
    { id: "future", label: { fr: "Un future coté, avec appels de marge quotidiens", en: "A listed future, with daily margin calls" } },
    { id: "indifferent", label: { fr: "Cela ne change rien du point de vue de la trésorerie", en: "It makes no difference from a cash-flow perspective" } },
  ],
  correctId: "forward",
  hint: { fr: "Quel instrument évite des sorties de trésorerie imprévisibles avant l'échéance ?", en: "Which instrument avoids unpredictable cash outflows before maturity?" },
  explanation: {
    fr: "Le forward, réglé une seule fois à l'échéance, évite précisément les appels de marge quotidiens potentiellement imprévisibles d'un future : pour une trésorerie déjà tendue, c'est un avantage pratique décisif, même si cela s'accompagne d'un risque de contrepartie plus élevé à surveiller.",
    en: "The forward, settled only once at maturity, precisely avoids a future's potentially unpredictable daily margin calls: for an already-tight cash position, this is a decisive practical advantage, even though it comes with higher counterparty risk to monitor.",
  },
  commonMistake: {
    fr: "Choisir systématiquement le future pour sa liquidité, sans considérer l'impact des appels de marge quotidiens sur une trésorerie déjà sous tension.",
    en: "Systematically choosing the future for its liquidity, without considering the impact of daily margin calls on an already-tight cash position.",
  },
});

const counterpartyAverseFundScenarioTemplate = mcqTemplate({
  id: "m02-fwd-vs-fut-scenario-fonds-averse-contrepartie",
  conceptId: "m02-forward-vs-future",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un gérant de fonds veut absolument minimiser son risque de contrepartie sur une exposition longue au pétrole pendant 2 mois, et n'a pas de contrainte de trésorerie pour d'éventuels appels de marge. Quel instrument choisir ?",
    en: "A fund manager wants to absolutely minimize counterparty risk on a 2-month long oil exposure, and has no cash constraint for potential margin calls. Which instrument should they choose?",
  },
  choices: [
    { id: "future", label: { fr: "Un future coté, garanti par une chambre de compensation", en: "A listed future, guaranteed by a clearinghouse" } },
    { id: "forward", label: { fr: "Un forward OTC négocié avec une seule banque", en: "An OTC forward negotiated with a single bank" } },
    { id: "no-difference", label: { fr: "Les deux offrent une protection identique contre le risque de contrepartie", en: "Both offer identical protection against counterparty risk" } },
  ],
  correctId: "future",
  hint: { fr: "Quel instrument est garanti par une chambre de compensation plutôt que par une seule contrepartie bilatérale ?", en: "Which instrument is guaranteed by a clearinghouse rather than a single bilateral counterparty?" },
  explanation: {
    fr: "Le future, compensé par une chambre centrale et réglé quotidiennement, offre une protection structurellement supérieure contre le risque de contrepartie par rapport à un forward bilatéral, qui expose intégralement le gérant à la solvabilité d'une seule banque jusqu'à l'échéance. Sans contrainte de trésorerie pour les appels de marge, le future est ici le choix naturel.",
    en: "The future, cleared through a central clearinghouse and settled daily, offers structurally superior protection against counterparty risk versus a bilateral forward, which fully exposes the manager to a single bank's solvency until maturity. With no cash constraint for margin calls, the future is the natural choice here.",
  },
  commonMistake: {
    fr: "Ignorer que le choix entre forward et future dépend d'un arbitrage entre contrainte de trésorerie (favorable au forward) et aversion au risque de contrepartie (favorable au future) — les deux critères pointent parfois dans des directions opposées.",
    en: "Ignoring that the choice between forward and future involves a trade-off between cash-flow constraints (favoring the forward) and counterparty-risk aversion (favoring the future) — the two criteria sometimes point in opposite directions.",
  },
});

export const templates: QuestionTemplate[] = [
  featureMatchTemplate,
  marginCallTemplate,
  counterpartyTrueFalseTemplate,
  choiceScenarioTemplate,
  comprehensionTemplate,
  priceConvergenceComparisonTemplate,
  whatIfCorrelatedRatesTemplate,
  whatIfMarginCallFailureTemplate,
  cumulativeMarginNumericTemplate,
  forwardCloseoutErrorTemplate,
  cashConstrainedTreasuryScenarioTemplate,
  counterpartyAverseFundScenarioTemplate,
];
