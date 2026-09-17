import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const spreadDeltaNumericTemplate: QuestionTemplate = {
  id: "m07-strat-delta-spread",
  conceptId: "m07-greeks-strategies",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const delta1 = randomFloat(rng, 0.4, 0.8, 2);
    const delta2 = randomFloat(rng, 0.1, delta1 - 0.05, 2);
    const spreadDelta = Math.round((delta1 - delta2) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un bull call spread : achat d'un call de Delta=${fmt(delta1, "fr")}, vente d'un call de Delta=${fmt(delta2, "fr")}. Quel est le Delta total de la stratégie ?`,
        en: `A bull call spread: buy a call with Delta=${fmt(delta1, "en")}, sell a call with Delta=${fmt(delta2, "en")}. What is the strategy's total Delta?`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.02",
      hint: { fr: "Delta_spread = Delta_achat − Delta_vente.", en: "Delta_spread = Delta_bought − Delta_sold." },
      numeric: { value: spreadDelta, tolerance: 0.02 },
      calculation: { fr: `Delta = ${fmt(delta1, "fr")} − ${fmt(delta2, "fr")} = ${fmt(spreadDelta, "fr")}.`, en: `Delta = ${fmt(delta1, "en")} − ${fmt(delta2, "en")} = ${fmt(spreadDelta, "en")}.` },
      explanation: {
        fr: "Le Delta d'un spread est toujours inférieur à celui de sa seule jambe achetée, car la jambe vendue le réduit.",
        en: "A spread's Delta is always lower than its lone bought leg's, since the sold leg reduces it.",
      },
      commonMistake: {
        fr: "Additionner les deux Deltas au lieu de les soustraire, en oubliant le signe négatif de la jambe vendue.",
        en: "Adding the two Deltas instead of subtracting, forgetting the sold leg's negative sign.",
      },
    };
  },
};

const straddleGammaTemplate: QuestionTemplate = {
  id: "m07-strat-straddle-gamma",
  conceptId: "m07-greeks-strategies",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un straddle ATM (achat d'un call et d'un put de même strike) a un Delta proche de zéro, mais un Gamma et un Vega significativement positifs.",
      en: "An ATM straddle (buying a call and a put with the same strike) has a Delta near zero, but significantly positive Gamma and Vega.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : les Deltas du call et du put se compensent presque (proches de ±0,5 à la monnaie), mais leurs Gamma et Vega, tous deux positifs, s'additionnent — d'où le profil \"neutre en direction, long en volatilité\".",
      en: "True: the call and put's Deltas almost offset (close to ±0.5 at the money), but their Gamma and Vega, both positive, add up — hence the \"direction-neutral, long volatility\" profile.",
    },
    commonMistake: {
      fr: "Croire qu'un Delta neutre signifie une stratégie totalement sans risque.",
      en: "Believing a neutral Delta means a totally risk-free strategy.",
    },
  }),
};

const additivityTemplate: QuestionTemplate = {
  id: "m07-strat-additivite",
  conceptId: "m07-greeks-strategies",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const q1 = randomInt(rng, 1, 5);
    const q2 = randomInt(rng, 1, 5);
    const g1 = randomInt(rng, 5, 20);
    const g2 = randomInt(rng, 5, 20);
    const total = q1 * g1 - q2 * g2;
    const wrongTotal = q1 * g1 + q2 * g2;

    return {
      isScenario: true,
      prompt: {
        fr: `Une stratégie détient ${q1} option(s) longue(s) de Vega=${g1} et ${q2} option(s) courte(s) de Vega=${g2}. Quel est le Vega total ?`,
        en: `A strategy holds ${q1} long option(s) with Vega=${g1} and ${q2} short option(s) with Vega=${g2}. What is the total Vega?`,
      },
      choices: buildChoices([
        { id: "correct", label: { fr: `${total}`, en: `${total}` } },
        { id: "wrong", label: { fr: `${wrongTotal}`, en: `${wrongTotal}` } },
      ]),
      hint: { fr: "N'oubliez pas le signe négatif pour la position courte.", en: "Don't forget the negative sign for the short position." },
      correctChoiceIds: ["correct"],
      explanation: {
        fr: `Vega total = ${q1}×${g1} − ${q2}×${g2} = ${total}, la position courte contribuant négativement.`,
        en: `Total Vega = ${q1}×${g1} − ${q2}×${g2} = ${total}, with the short position contributing negatively.`,
      },
      commonMistake: {
        fr: "Additionner les deux Vega sans tenir compte du signe négatif de la position courte.",
        en: "Adding both Vegas without accounting for the short position's negative sign.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-strat-vocab",
  conceptId: "m07-greeks-strategies",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le Greek total d'un portefeuille est la somme des Greeks de chaque position, pondérés par leur quantité signée : c'est la propriété d'______ des Greeks.",
      en: "A portfolio's total Greek is the sum of each position's Greeks, weighted by their signed quantity: this is the ______ property of Greeks.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["additivite", "additivité", "additivity"],
    hint: { fr: "Les Greeks « s'additionnent ».", en: "Greeks \"add up\"." },
    explanation: {
      fr: "L'additivité des Greeks vient du fait qu'ils sont des dérivées partielles d'une somme (la valeur du portefeuille), donc leur somme est simplement la dérivée de la somme.",
      en: "The additivity of Greeks comes from them being partial derivatives of a sum (the portfolio's value), so their sum is simply the derivative of the sum.",
    },
    commonMistake: {
      fr: "Croire que les Greeks doivent être pondérés autrement qu'en proportion directe de la quantité détenue.",
      en: "Believing Greeks must be weighted in some way other than direct proportion to the quantity held.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m07-strat-comprehension-utilite",
  conceptId: "m07-greeks-strategies",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi un gérant analyse-t-il les Greeks au niveau du PORTEFEUILLE entier plutôt que position par position ?",
    en: "Why does a manager analyze Greeks at the WHOLE PORTFOLIO level rather than position by position?",
  },
  choices: [
    { id: "net-exposure", label: { fr: "Parce que c'est l'exposition NETTE (après compensation entre positions longues et courtes) qui détermine le risque réellement couru, pas la somme des risques bruts de chaque ligne", en: "Because it's the NET exposure (after offsetting between long and short positions) that determines the risk actually run, not the sum of each line's gross risks" } },
    { id: "same-info", label: { fr: "Cela donne exactement la même information que d'examiner chaque position séparément", en: "This gives exactly the same information as examining each position separately" } },
    { id: "only-regulatory", label: { fr: "C'est purement une exigence réglementaire sans utilité de gestion des risques", en: "It's purely a regulatory requirement with no risk-management utility" } },
  ],
  correctId: "net-exposure",
  hint: { fr: "Grâce à l'additivité des Greeks, une position longue et une position courte peuvent se compenser — que raterait-on en les regardant séparément ?", en: "Thanks to Greeks' additivity, a long and a short position can offset each other — what would you miss looking at them separately?" },
  explanation: {
    fr: "Grâce à l'additivité des Greeks, une exposition Delta positive sur une ligne peut être partiellement ou totalement compensée par une exposition négative sur une autre : seul le Greek NET du portefeuille dit si le risque global est significatif ou non. Examiner chaque position isolément donnerait une image alarmiste et trompeuse de multiples risques bruts, sans révéler qu'ils se neutralisent en grande partie au niveau agrégé.",
    en: "Thanks to Greeks' additivity, a positive Delta exposure on one line can be partially or fully offset by a negative exposure on another: only the portfolio's NET Greek tells you whether the overall risk is significant or not. Examining each position in isolation would give an alarmist, misleading picture of multiple gross risks, without revealing they largely neutralize each other at the aggregate level.",
  },
  commonMistake: {
    fr: "Sommer les risques bruts (en valeur absolue) de chaque position plutôt que leur exposition nette signée, ce qui surestime fortement le risque réel du portefeuille.",
    en: "Summing each position's gross (absolute-value) risks rather than their signed net exposure, which strongly overstates the portfolio's real risk.",
  },
});

const straddleVsSpreadComparisonTemplate = mcqTemplate({
  id: "m07-strat-comparaison-straddle-spread",
  conceptId: "m07-greeks-strategies",
  difficulty: "hard",
  prompt: {
    fr: "Un straddle ATM delta-neutre et un bull call spread dont le Delta net a été ramené à zéro (en ajoutant une position sur le sous-jacent) sont tous deux delta-neutres. Ont-ils pour autant le même profil de risque Gamma/Vega ?",
    en: "An ATM delta-neutral straddle and a bull call spread whose net Delta has been brought to zero (by adding an underlying position) are both delta-neutral. Do they therefore have the same Gamma/Vega risk profile?",
  },
  choices: [
    { id: "different-profiles", label: { fr: "Non : le straddle a un Gamma et un Vega nettement positifs (long volatilité), tandis que le spread delta-neutralisé a un Gamma/Vega beaucoup plus faible, la jambe vendue les réduisant fortement", en: "No: the straddle has clearly positive Gamma and Vega (long volatility), while the delta-neutralized spread has much smaller Gamma/Vega, the sold leg strongly reducing them" } },
    { id: "identical", label: { fr: "Oui, être delta-neutre implique automatiquement un Gamma et un Vega identiques pour toute stratégie", en: "Yes, being delta-neutral automatically implies identical Gamma and Vega for any strategy" } },
    { id: "spread-more-vol", label: { fr: "Le spread a systématiquement un Gamma/Vega plus élevé que le straddle", en: "The spread systematically has higher Gamma/Vega than the straddle" } },
  ],
  correctId: "different-profiles",
  hint: { fr: "Delta neutre ne dit rien sur les AUTRES Greeks : chaque stratégie a sa propre combinaison de jambes, donc son propre profil Gamma/Vega.", en: "Delta-neutral says nothing about the OTHER Greeks: each strategy has its own combination of legs, hence its own Gamma/Vega profile." },
  explanation: {
    fr: "Être delta-neutre ne contraint que le Delta : le straddle (deux jambes ACHETÉES) cumule un Gamma et un Vega tous deux positifs et significatifs, tandis que le spread (une jambe achetée, une vendue) voit son Gamma et son Vega largement compensés par la jambe vendue. Deux stratégies delta-neutres peuvent donc avoir des profils de risque radicalement différents sur les autres Greeks — un rappel qu'aucun Greek seul ne résume l'ensemble du risque d'une position.",
    en: "Being delta-neutral only constrains Delta: the straddle (two BOUGHT legs) accumulates both positive and significant Gamma and Vega, while the spread (one bought leg, one sold) has its Gamma and Vega largely offset by the sold leg. Two delta-neutral strategies can therefore have radically different risk profiles on the other Greeks — a reminder that no single Greek summarizes a position's entire risk.",
  },
  commonMistake: {
    fr: "Croire que neutraliser le Delta d'une stratégie neutralise automatiquement ses autres risques (Gamma, Vega), en oubliant que chaque Greek répond à une sensibilité différente.",
    en: "Believing neutralizing a strategy's Delta automatically neutralizes its other risks (Gamma, Vega), forgetting each Greek responds to a different sensitivity.",
  },
});

const gammaVsThetaTradeoffComparisonTemplate = mcqTemplate({
  id: "m07-strat-comparaison-gamma-theta",
  conceptId: "m07-greeks-strategies",
  difficulty: "hard",
  prompt: {
    fr: "Comparez une position longue en options (Gamma positif) et le signe typique de son Theta. Pourquoi dit-on souvent que Gamma et Theta sont en tension l'un avec l'autre pour une position longue ?",
    en: "Compare a long options position (positive Gamma) and its typical Theta sign. Why is it often said that Gamma and Theta are in tension with each other for a long position?",
  },
  choices: [
    { id: "opposite-signs", label: { fr: "Une position longue a généralement un Gamma positif MAIS un Theta négatif : le potentiel de gain sur un grand mouvement (Gamma) se paie par une érosion quotidienne certaine (Theta), un compromis permanent", en: "A long position generally has positive Gamma BUT negative Theta: the upside potential on a big move (Gamma) is paid for by a certain daily erosion (Theta), a permanent trade-off" } },
    { id: "same-sign-always", label: { fr: "Gamma et Theta ont toujours le même signe pour une position longue, sans aucune tension entre eux", en: "Gamma and Theta always have the same sign for a long position, with no tension between them" } },
    { id: "unrelated", label: { fr: "Ces deux Greeks n'ont structurellement aucun lien l'un avec l'autre", en: "These two Greeks structurally have no relationship to each other" } },
  ],
  correctId: "opposite-signs",
  hint: { fr: "Le Gamma positif est ce qui rend une option attractive pour un pari sur un grand mouvement ; que \"coûte\" cette attractivité chaque jour qui passe sans mouvement ?", en: "Positive Gamma is what makes an option attractive for a bet on a big move; what does that attractiveness \"cost\" each day without a move?" },
  explanation: {
    fr: "Un Gamma positif signifie que le Delta de la position s'ajuste favorablement à un grand mouvement du sous-jacent — un potentiel de gain précieux. Mais ce potentiel a un coût : chaque jour qui passe sans ce mouvement, la valeur temps de l'option s'érode (Theta négatif). C'est ce compromis permanent (payer un Theta négatif pour conserver un Gamma positif) qui structure la décision d'un trader de conserver ou non une position longue en options, et qui motive des stratégies comme le calendar spread pour ajuster cet équilibre.",
    en: "A positive Gamma means the position's Delta adjusts favorably to a large move in the underlying — a valuable upside potential. But that potential has a cost: every day that passes without that move, the option's time value erodes (negative Theta). This permanent trade-off (paying negative Theta to keep positive Gamma) shapes a trader's decision to hold or not a long options position, and motivates strategies like the calendar spread to adjust this balance.",
  },
  commonMistake: {
    fr: "Considérer le Gamma positif d'une position longue comme un avantage sans contrepartie, en oubliant le coût de portage quotidien qu'il implique via le Theta négatif.",
    en: "Viewing a long position's positive Gamma as a cost-free advantage, forgetting the daily carrying cost it implies via negative Theta.",
  },
});

const whatIfAddPositionTemplate = mcqTemplate({
  id: "m07-strat-whatif-ajout-position",
  conceptId: "m07-greeks-strategies",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un portefeuille est actuellement parfaitement delta-neutre. Un trader y ajoute une nouvelle position de calls de Delta net +40. Que doit-il faire immédiatement pour restaurer la neutralité du Delta du portefeuille ?",
    en: "A portfolio is currently perfectly delta-neutral. A trader adds a new call position with net Delta +40. What must they immediately do to restore the portfolio's Delta neutrality?",
  },
  choices: [
    { id: "sell-40-shares", label: { fr: "Vendre 40 actions du sous-jacent, pour compenser exactement le nouveau Delta positif ajouté", en: "Sell 40 shares of the underlying, to exactly offset the newly added positive Delta" } },
    { id: "buy-40-shares", label: { fr: "Acheter 40 actions supplémentaires", en: "Buy 40 additional shares" } },
    { id: "no-action", label: { fr: "Rien à faire, le portefeuille reste automatiquement delta-neutre", en: "Nothing to do, the portfolio automatically stays delta-neutral" } },
  ],
  correctId: "sell-40-shares",
  hint: { fr: "Le Delta d'une action est +1 : quelle quantité et quel sens permettent d'annuler exactement +40 de Delta ajouté ?", en: "A share's Delta is +1: what quantity and direction exactly cancel out a +40 Delta addition?" },
  explanation: {
    fr: "Grâce à l'additivité des Greeks, ajouter une position de Delta net +40 rend le portefeuille désormais +40 en Delta global : pour retrouver la neutralité, il faut vendre exactement 40 actions du sous-jacent (chaque action ayant un Delta de +1), un ajustement à répéter à chaque nouvelle position ou à chaque variation des Greeks existants — exactement le principe du rééquilibrage dynamique (M07, delta-hedging).",
    en: "Thanks to Greeks' additivity, adding a position with net Delta +40 now makes the portfolio +40 in overall Delta: to restore neutrality, exactly 40 shares of the underlying must be sold (each share having a Delta of +1), an adjustment to repeat with each new position or each change in existing Greeks — exactly the dynamic rebalancing principle (M07, delta-hedging).",
  },
  commonMistake: {
    fr: "Acheter des actions au lieu d'en vendre, en confondant le sens de l'ajustement nécessaire pour COMPENSER un Delta déjà positif.",
    en: "Buying shares instead of selling, confusing the direction of the adjustment needed to OFFSET an already positive Delta.",
  },
});

const calendarSpreadWhatIfTemplate = mcqTemplate({
  id: "m07-strat-whatif-calendar-spread",
  conceptId: "m07-greeks-strategies",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un calendar spread (vente d'un call proche échéance, achat d'un call même strike mais échéance lointaine) est mis en place. Pourquoi cette combinaison a-t-elle typiquement un Vega net positif, contrairement à ce qu'on pourrait attendre d'un \"spread\" qui limite généralement les Greeks ?",
    en: "A calendar spread (selling a near-expiry call, buying a same-strike but far-expiry call) is set up. Why does this combination typically have a positive net Vega, unlike what one might expect from a \"spread\" that generally limits Greeks?",
  },
  choices: [
    { id: "long-maturity-higher-vega", label: { fr: "Parce que le Vega d'une option croît avec l'échéance : la jambe longue (achetée) a structurellement un Vega plus élevé que la jambe courte (vendue), laissant un Vega net positif", en: "Because an option's Vega grows with maturity: the long-dated (bought) leg structurally has higher Vega than the short-dated (sold) leg, leaving a net positive Vega" } },
    { id: "always-zero-vega", label: { fr: "En réalité, tout spread a toujours un Vega net rigoureusement nul", en: "In reality, any spread always has a rigorously zero net Vega" } },
    { id: "random-sign", label: { fr: "Le signe du Vega net d'un calendar spread est totalement aléatoire, sans logique déterminable", en: "A calendar spread's net Vega sign is totally random, with no determinable logic" } },
  ],
  correctId: "long-maturity-higher-vega",
  hint: { fr: "Contrairement à un spread classique (même échéance, strikes différents), ici c'est l'ÉCHÉANCE qui diffère entre les deux jambes, pas le strike.", en: "Unlike a classic spread (same maturity, different strikes), here it's MATURITY that differs between the two legs, not the strike." },
  explanation: {
    fr: "Contrairement à un spread vertical classique (M05, même échéance, strikes différents), un calendar spread combine deux échéances DIFFÉRENTES au même strike : puisque le Vega d'une option augmente généralement avec le temps restant, la jambe longue échéance (achetée) a un Vega plus élevé que la jambe courte échéance (vendue), laissant la stratégie nette structurellement longue en volatilité — une exposition Vega positive délibérément recherchée par ceux qui parient sur une hausse de la volatilité implicite.",
    en: "Unlike a classic vertical spread (M05, same maturity, different strikes), a calendar spread combines two DIFFERENT maturities at the same strike: since an option's Vega generally increases with remaining time, the long-maturity (bought) leg has higher Vega than the short-maturity (sold) leg, leaving the strategy net structurally long volatility — a positive Vega exposure deliberately sought by those betting on rising implied volatility.",
  },
  commonMistake: {
    fr: "Généraliser à tort la logique d'un spread vertical classique (Greeks fortement réduits) à un calendar spread, sans réaliser que la différence d'échéance change radicalement le profil de Vega.",
    en: "Wrongly generalizing a classic vertical spread's logic (strongly reduced Greeks) to a calendar spread, without realizing the maturity difference radically changes the Vega profile.",
  },
});

const portfolioThetaNumericTemplate: QuestionTemplate = {
  id: "m07-strat-theta-portefeuille-calcul",
  conceptId: "m07-greeks-strategies",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const q1 = randomInt(rng, 1, 8);
    const q2 = randomInt(rng, 1, 8);
    const theta1 = randomInt(rng, 5, 30);
    const theta2 = randomInt(rng, 5, 30);
    const total = -q1 * theta1 + q2 * theta2;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille détient ${q1} option(s) longue(s) de Theta=−${theta1} chacune, et ${q2} option(s) courte(s) de Theta=−${theta2} chacune (le Theta étant négatif pour une position longue). Quel est le Theta net du portefeuille ?`,
        en: `A portfolio holds ${q1} long option(s) with Theta=−${theta1} each, and ${q2} short option(s) with Theta=−${theta2} each (Theta being negative for a long position). What is the portfolio's net Theta?`,
      },
      numericUnit: { fr: "même devise, par jour", en: "same currency, per day" },
      numericTolerance: "± 1",
      hint: { fr: "Une position courte a un Theta de signe OPPOSÉ à celui de la même option en position longue.", en: "A short position has a Theta of OPPOSITE sign to the same option held long." },
      numeric: { value: total, tolerance: 1 },
      calculation: {
        fr: `Theta net = ${q1}×(−${theta1}) + ${q2}×(+${theta2}) = ${-q1 * theta1} + ${q2 * theta2} = ${total}.`,
        en: `Net Theta = ${q1}×(−${theta1}) + ${q2}×(+${theta2}) = ${-q1 * theta1} + ${q2 * theta2} = ${total}.`,
      },
      explanation: {
        fr: "Une position longue sur une option a un Theta négatif (elle perd de la valeur avec le temps qui passe), tandis qu'une position courte a un Theta positif (le vendeur bénéficie de cette même érosion) : additionner correctement ces contributions de signes opposés donne le Theta net réellement exposé du portefeuille.",
        en: "A long option position has negative Theta (it loses value as time passes), while a short position has positive Theta (the seller benefits from that same erosion): correctly adding these opposite-sign contributions gives the portfolio's actually exposed net Theta.",
      },
      commonMistake: {
        fr: "Utiliser le même signe négatif pour la position courte que pour la position longue, en oubliant que vendre une option inverse le signe de son Theta.",
        en: "Using the same negative sign for the short position as for the long one, forgetting selling an option flips its Theta's sign.",
      },
    };
  },
};

const deltaNeutralRiskFreeErrorTemplate = trueFalseTemplate({
  id: "m07-strat-erreur-delta-neutre-sans-risque",
  conceptId: "m07-greeks-strategies",
  difficulty: "medium",
  statement: {
    fr: "Un portefeuille rendu delta-neutre en ajoutant du sous-jacent est, par construction, totalement sans risque, quels que soient ses autres Greeks.",
    en: "A portfolio made delta-neutral by adding the underlying is, by construction, totally risk-free, whatever its other Greeks are.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le Delta-neutre protège uniquement contre un petit mouvement instantané du sous-jacent, mais le portefeuille reste exposé au Gamma (une variation plus importante du sous-jacent), au Vega (un mouvement de la volatilité), au Theta (l'érosion temporelle), et potentiellement au Vanna/Volga (M07) — un portefeuille delta-neutre n'est neutre que sur UN facteur parmi plusieurs.",
    en: "False: delta-neutral only protects against a small instantaneous move in the underlying, but the portfolio remains exposed to Gamma (a larger underlying move), Vega (a volatility move), Theta (time erosion), and potentially Vanna/Volga (M07) — a delta-neutral portfolio is only neutral on ONE factor among several.",
  },
  commonMistake: {
    fr: "Croire que la neutralité sur un seul Greek (le Delta) suffit à qualifier une position de \"sans risque\", en ignorant tous les autres facteurs de risque non couverts.",
    en: "Believing neutrality on a single Greek (Delta) is enough to call a position \"risk-free\", ignoring all the other unhedged risk factors.",
  },
});

const vegaLimitScenarioTemplate = mcqTemplate({
  id: "m07-strat-scenario-limite-vega",
  conceptId: "m07-greeks-strategies",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un trader a une limite de risque Vega maximale de 5 000. Son portefeuille actuel, déjà delta-neutre, a un Vega de 4 500. Il veut ajouter un straddle qui apporterait +1 200 de Vega, tout en restant delta-neutre au global. Que doit-il faire ?",
    en: "A trader has a maximum Vega risk limit of 5,000. Their current, already delta-neutral, portfolio has a Vega of 4,500. They want to add a straddle that would bring +1,200 Vega, while staying delta-neutral overall. What should they do?",
  },
  choices: [
    { id: "reduce-or-reject", label: { fr: "Réduire la taille du straddle (ou renoncer), car l'ajouter intégralement porterait le Vega total à 5 700, dépassant la limite de 5 000", en: "Reduce the straddle's size (or forgo it), since adding it in full would bring total Vega to 5,700, exceeding the 5,000 limit" } },
    { id: "add-freely", label: { fr: "Ajouter le straddle sans problème, puisque le portefeuille reste delta-neutre", en: "Add the straddle with no problem, since the portfolio stays delta-neutral" } },
    { id: "irrelevant-limit", label: { fr: "La limite de Vega ne s'applique jamais à une stratégie qui reste delta-neutre", en: "The Vega limit never applies to a strategy that stays delta-neutral" } },
  ],
  correctId: "reduce-or-reject",
  hint: { fr: "Rester delta-neutre ne dit rien sur le respect d'une limite portant sur un AUTRE Greek (ici, le Vega).", en: "Staying delta-neutral says nothing about complying with a limit on ANOTHER Greek (here, Vega)." },
  explanation: {
    fr: "Une limite de risque Vega est indépendante de la neutralité Delta : ajouter le straddle intégralement porterait le Vega total à 4 500 + 1 200 = 5 700, dépassant la limite de 5 000, même si le portefeuille reste parfaitement delta-neutre. Le trader doit soit réduire la taille de sa nouvelle position, soit compenser une partie du Vega existant, soit renoncer à cet ajout — la neutralité sur un Greek n'exempte jamais du respect des limites fixées sur les autres.",
    en: "A Vega risk limit is independent of Delta neutrality: adding the straddle in full would bring total Vega to 4,500 + 1,200 = 5,700, exceeding the 5,000 limit, even though the portfolio stays perfectly delta-neutral. The trader must either reduce their new position's size, offset part of the existing Vega, or forgo this addition — neutrality on one Greek never exempts compliance with limits set on the others.",
  },
  commonMistake: {
    fr: "Croire qu'une stratégie delta-neutre échappe automatiquement à toute limite de risque fixée sur un autre Greek, comme le Vega.",
    en: "Believing a delta-neutral strategy automatically escapes any risk limit set on another Greek, like Vega.",
  },
});

export const templates: QuestionTemplate[] = [
  spreadDeltaNumericTemplate,
  straddleGammaTemplate,
  additivityTemplate,
  vocabTemplate,
  comprehensionTemplate,
  straddleVsSpreadComparisonTemplate,
  gammaVsThetaTradeoffComparisonTemplate,
  whatIfAddPositionTemplate,
  calendarSpreadWhatIfTemplate,
  portfolioThetaNumericTemplate,
  deltaNeutralRiskFreeErrorTemplate,
  vegaLimitScenarioTemplate,
];
