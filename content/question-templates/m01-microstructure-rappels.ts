import { pick, randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const spreadMidNumericTemplate: QuestionTemplate = {
  id: "m01-micro-spread-mid",
  conceptId: "m01-microstructure-rappels",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const bid = randomFloat(rng, 20, 300, 2);
    const spreadRaw = randomFloat(rng, 0.02, 2, 2);
    const ask = Math.round((bid + spreadRaw) * 100) / 100;
    const askQuestion = pick(rng, ["spread", "mid"] as const);
    const spread = Math.round((ask - bid) * 100) / 100;
    const mid = Math.round(((ask + bid) / 2) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Bid = ${fmt(bid, "fr")}, Ask = ${fmt(ask, "fr")}. Quel est le ${askQuestion === "spread" ? "spread" : "prix milieu (mid)"} ?`,
        en: `Bid = ${fmt(bid, "en")}, Ask = ${fmt(ask, "en")}. What is the ${askQuestion === "spread" ? "spread" : "mid price"}?`,
      },
      numericUnit: { fr: "même devise que le prix", en: "same currency as the price" },
      numericTolerance: "± 0.02",
      hint: { fr: askQuestion === "spread" ? "Spread = Ask − Bid." : "Mid = (Ask + Bid) / 2.", en: askQuestion === "spread" ? "Spread = Ask − Bid." : "Mid = (Ask + Bid) / 2." },
      numeric: { value: askQuestion === "spread" ? spread : mid, tolerance: 0.02 },
      calculation: {
        fr: askQuestion === "spread" ? `Spread = ${fmt(ask, "fr")} − ${fmt(bid, "fr")} = ${fmt(spread, "fr")}.` : `Mid = (${fmt(ask, "fr")} + ${fmt(bid, "fr")}) / 2 = ${fmt(mid, "fr")}.`,
        en: askQuestion === "spread" ? `Spread = ${fmt(ask, "en")} − ${fmt(bid, "en")} = ${fmt(spread, "en")}.` : `Mid = (${fmt(ask, "en")} + ${fmt(bid, "en")}) / 2 = ${fmt(mid, "en")}.`,
      },
      explanation: {
        fr: "Le spread mesure le coût implicite de l'immédiateté ; le mid sert de référence de valorisation, mais n'est pas un prix auquel on peut réellement trader.",
        en: "The spread measures the implicit cost of immediacy; the mid serves as a valuation reference, but is not a price you can actually trade at.",
      },
      commonMistake: {
        fr: "Confondre le prix mid avec un prix réellement exécutable — on achète toujours à l'ask, on vend toujours au bid.",
        en: "Confusing the mid price with an actually executable price — you always buy at the ask, always sell at the bid.",
      },
    };
  },
};

const executionPriceTemplate: QuestionTemplate = {
  id: "m01-micro-prix-execution",
  conceptId: "m01-microstructure-rappels",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const urgent = pick(rng, ["buy", "sell"] as const);
    return {
      prompt: {
        fr: `Un investisseur veut ${urgent === "buy" ? "acheter" : "vendre"} immédiatement, sans attendre. À quel prix du carnet d'ordres sera-t-il exécuté ?`,
        en: `An investor wants to ${urgent === "buy" ? "buy" : "sell"} immediately, without waiting. At which order book price will they be executed?`,
      },
      choices: buildChoices([
        { id: "bid", label: { fr: "Au bid", en: "At the bid" } },
        { id: "ask", label: { fr: "À l'ask", en: "At the ask" } },
        { id: "mid", label: { fr: "Au prix mid", en: "At the mid price" } },
      ]),
      hint: { fr: "Acheter immédiatement prend le prix le plus haut affiché ; vendre immédiatement prend le plus bas.", en: "Buying immediately takes the highest posted price; selling immediately takes the lowest." },
      correctChoiceIds: [urgent === "buy" ? "ask" : "bid"],
      explanation:
        urgent === "buy"
          ? { fr: "Un acheteur pressé doit accepter le meilleur prix de vente affiché, l'ask.", en: "An urgent buyer must accept the best posted sell price, the ask." }
          : { fr: "Un vendeur pressé doit accepter le meilleur prix d'achat affiché, le bid.", en: "An urgent seller must accept the best posted buy price, the bid." },
      commonMistake: {
        fr: "Croire qu'on peut trader immédiatement au prix mid, qui n'est qu'une moyenne de référence.",
        en: "Believing one can trade immediately at the mid price, which is only a reference average.",
      },
    };
  },
};

const widerSpreadTemplate: QuestionTemplate = {
  id: "m01-micro-spread-incertitude",
  conceptId: "m01-microstructure-rappels",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le spread bid-ask d'un titre a tendance à s'élargir en période de forte incertitude de marché.",
      en: "A security's bid-ask spread tends to widen during periods of high market uncertainty.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : les teneurs de marché exigent une compensation plus élevée pour le risque de détenir une position dans un environnement incertain, ce qui élargit le spread qu'ils affichent.",
      en: "True: market makers demand higher compensation for the risk of holding a position in an uncertain environment, which widens the spread they post.",
    },
    commonMistake: {
      fr: "Croire que le spread reste constant quelles que soient les conditions de marché.",
      en: "Believing the spread stays constant regardless of market conditions.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-micro-vocab",
  conceptId: "m01-microstructure-rappels",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un intervenant qui affiche en permanence des prix d'achat et de vente pour fournir de la liquidité, rémunéré par le spread, s'appelle un teneur de ______.",
      en: "A participant who continuously posts buy and sell prices to provide liquidity, compensated by the spread, is called a ______ maker.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["marche", "marché", "market"],
    hint: { fr: "Il « tient » le marché en continu.", en: "They continuously \"make\" the market." },
    explanation: {
      fr: "Le teneur de marché (market maker) fournit de la liquidité en continu, rémunéré par l'écart entre son prix d'achat et son prix de vente.",
      en: "The market maker continuously provides liquidity, compensated by the gap between their buy and sell prices.",
    },
    commonMistake: {
      fr: "Confondre le teneur de marché avec un simple investisseur qui passe des ordres occasionnels.",
      en: "Confusing the market maker with a simple investor placing occasional orders.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-micro-comprehension-role-spread",
  conceptId: "m01-microstructure-rappels",
  difficulty: "easy",
  prompt: {
    fr: "À quoi sert principalement le spread bid-ask facturé par le teneur de marché ?",
    en: "What is the bid-ask spread charged by the market maker mainly for?",
  },
  choices: [
    { id: "compensation", label: { fr: "À rémunérer le service de liquidité immédiate et le risque d'inventaire pris", en: "To compensate for the immediate-liquidity service and the inventory risk taken" } },
    { id: "tax", label: { fr: "À payer une taxe réglementaire sur chaque transaction", en: "To pay a regulatory tax on each transaction" } },
    { id: "broker", label: { fr: "À rémunérer exclusivement le courtier de l'investisseur final", en: "To exclusively compensate the end investor's broker" } },
  ],
  correctId: "compensation",
  hint: { fr: "Pensez à ce que risque un teneur de marché en affichant des prix fermes en permanence.", en: "Think about what a market maker risks by continuously posting firm prices." },
  explanation: {
    fr: "Le teneur de marché s'engage à acheter et vendre en continu, prenant le risque de détenir une position si le marché bouge avant qu'il ne se retourne ; le spread le rémunère pour ce service et ce risque.",
    en: "The market maker commits to continuously buying and selling, risking holding a position if the market moves before they can offload it; the spread compensates them for this service and risk.",
  },
  commonMistake: {
    fr: "Croire que le spread est un frais administratif fixe plutôt qu'une rémunération économique du risque de liquidité.",
    en: "Believing the spread is a fixed administrative fee rather than economic compensation for liquidity risk.",
  },
});

const liquidVsIlliquidComparisonTemplate = mcqTemplate({
  id: "m01-micro-comparaison-liquidite",
  conceptId: "m01-microstructure-rappels",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Action A : très liquide, des milliers de transactions par jour. Action B : micro-capitalisation, quelques transactions par jour. Laquelle a, toutes choses égales, le spread bid-ask relatif le plus large ?",
    en: "Stock A: very liquid, thousands of trades a day. Stock B: micro-cap, a few trades a day. Which one has, all else equal, the wider relative bid-ask spread?",
  },
  choices: [
    { id: "a", label: { fr: "Action A, la plus liquide", en: "Stock A, the more liquid one" } },
    { id: "b", label: { fr: "Action B, la moins liquide", en: "Stock B, the less liquid one" } },
    { id: "same", label: { fr: "Le spread est identique, la liquidité n'a pas d'effet", en: "The spread is identical, liquidity has no effect" } },
  ],
  correctId: "b",
  hint: { fr: "Moins de transactions signifie plus d'incertitude et de risque pour le teneur de marché entre deux échanges.", en: "Fewer trades means more uncertainty and risk for the market maker between two trades." },
  explanation: {
    fr: "Sur un titre peu échangé, le teneur de marché met plus de temps à se débarrasser d'une position et court un risque de prix plus élevé entre deux transactions : il exige donc un spread plus large pour se couvrir.",
    en: "On a thinly traded stock, the market maker takes longer to unwind a position and faces higher price risk between trades: they demand a wider spread to compensate.",
  },
  commonMistake: {
    fr: "Croire que le spread ne dépend que du prix du titre, sans tenir compte du volume échangé.",
    en: "Believing the spread depends only on the stock's price, ignoring traded volume.",
  },
});

const whatIfMoreMarketMakersTemplate = mcqTemplate({
  id: "m01-micro-whatif-concurrence",
  conceptId: "m01-microstructure-rappels",
  difficulty: "medium",
  prompt: {
    fr: "Que se passe-t-il sur le spread bid-ask d'un titre si plusieurs teneurs de marché supplémentaires se mettent à coter ce même titre en concurrence ?",
    en: "What happens to a stock's bid-ask spread if several additional market makers start quoting the same stock competitively?",
  },
  choices: [
    { id: "narrow", label: { fr: "Le spread a tendance à se resserrer", en: "The spread tends to narrow" } },
    { id: "widen", label: { fr: "Le spread a tendance à s'élargir", en: "The spread tends to widen" } },
    { id: "unchanged", label: { fr: "Le spread ne change pas, il ne dépend que de la volatilité", en: "The spread doesn't change, it only depends on volatility" } },
  ],
  correctId: "narrow",
  hint: { fr: "Plus de teneurs de marché en compétition pour attirer le flux d'ordres...", en: "More market makers competing to attract order flow..." },
  explanation: {
    fr: "La concurrence entre teneurs de marché les pousse à coter des prix plus serrés pour attirer le flux d'ordres, ce qui réduit le spread affiché au bénéfice des investisseurs.",
    en: "Competition between market makers pushes them to quote tighter prices to attract order flow, which reduces the displayed spread to investors' benefit.",
  },
  commonMistake: {
    fr: "Penser que plus d'intervenants signifie plus de confusion et donc un spread plus large, alors que c'est l'effet inverse qui domine.",
    en: "Thinking more participants means more confusion and so a wider spread, when the opposite effect actually dominates.",
  },
});

const whatIfLargeOrderTemplate = mcqTemplate({
  id: "m01-micro-whatif-ordre-large",
  conceptId: "m01-microstructure-rappels",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Le carnet d'ordres affiche seulement 200 titres disponibles à l'ask. Un investisseur passe un ordre de marché pour acheter 2 000 titres immédiatement. Que se passe-t-il sur son prix d'exécution moyen ?",
    en: "The order book shows only 200 shares available at the ask. An investor places a market order to buy 2,000 shares immediately. What happens to their average execution price?",
  },
  choices: [
    { id: "worse", label: { fr: "Il est plus mauvais que l'ask initialement affiché : l'ordre « consomme » plusieurs niveaux de prix", en: "It is worse than the initially displayed ask: the order \"walks\" through several price levels" } },
    { id: "same", label: { fr: "Il reste exactement égal à l'ask initialement affiché", en: "It stays exactly equal to the initially displayed ask" } },
    { id: "better", label: { fr: "Il est meilleur, car le carnet s'adapte automatiquement en faveur du client", en: "It is better, since the book automatically adjusts in the client's favor" } },
  ],
  correctId: "worse",
  hint: { fr: "Un ordre plus grand que la quantité affichée au meilleur prix doit être exécuté à des prix successivement moins favorables.", en: "An order larger than the quantity displayed at the best price must be filled at successively less favorable prices." },
  explanation: {
    fr: "Une fois les 200 premiers titres exécutés au meilleur ask, l'ordre continue à se remplir sur les niveaux de prix suivants, plus élevés : le prix moyen payé (impact de marché) est donc supérieur au premier ask affiché.",
    en: "Once the first 200 shares fill at the best ask, the order keeps filling at the next, higher price levels: the average price paid (market impact) is therefore above the first displayed ask.",
  },
  commonMistake: {
    fr: "Croire que le prix affiché au meilleur bid/ask s'applique automatiquement à n'importe quelle taille d'ordre, en ignorant la profondeur limitée du carnet.",
    en: "Believing the price displayed at the best bid/ask automatically applies to any order size, ignoring the book's limited depth.",
  },
});

const relativeSpreadNumericTemplate: QuestionTemplate = {
  id: "m01-micro-spread-relatif-bps",
  conceptId: "m01-microstructure-rappels",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const bid = randomFloat(rng, 10, 200, 2);
    const spreadRaw = randomFloat(rng, 0.01, 1, 2);
    const ask = Math.round((bid + spreadRaw) * 100) / 100;
    const spread = Math.round((ask - bid) * 100) / 100;
    const mid = Math.round(((ask + bid) / 2) * 100) / 100;
    const bps = Math.round(((spread / mid) * 10000) * 10) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Bid = ${bid.toFixed(2)}, Ask = ${ask.toFixed(2)}. Quel est le spread relatif, exprimé en points de base (pb) du prix mid ?`,
        en: `Bid = ${bid.toFixed(2)}, Ask = ${ask.toFixed(2)}. What is the relative spread, expressed in basis points (bp) of the mid price?`,
      },
      numericUnit: { fr: "points de base", en: "basis points" },
      numericTolerance: "± 1",
      hint: { fr: "Spread relatif (pb) = (Ask − Bid) / Mid × 10 000.", en: "Relative spread (bp) = (Ask − Bid) / Mid × 10,000." },
      numeric: { value: bps, tolerance: 1 },
      calculation: {
        fr: `Mid = (${ask.toFixed(2)} + ${bid.toFixed(2)}) / 2 = ${mid.toFixed(2)}. Spread relatif = ${spread.toFixed(2)} / ${mid.toFixed(2)} × 10 000 ≈ ${bps.toFixed(1)} pb.`,
        en: `Mid = (${ask.toFixed(2)} + ${bid.toFixed(2)}) / 2 = ${mid.toFixed(2)}. Relative spread = ${spread.toFixed(2)} / ${mid.toFixed(2)} × 10,000 ≈ ${bps.toFixed(1)} bp.`,
      },
      explanation: {
        fr: "Le spread relatif en points de base permet de comparer la liquidité de titres à des niveaux de prix très différents, contrairement au spread brut qui dépend de l'échelle du prix.",
        en: "The relative spread in basis points lets you compare liquidity across stocks trading at very different price levels, unlike the raw spread which depends on the price scale.",
      },
      commonMistake: {
        fr: "Diviser le spread par le bid ou par l'ask plutôt que par le prix mid, ou oublier de multiplier par 10 000 pour obtenir des points de base.",
        en: "Dividing the spread by the bid or ask rather than the mid price, or forgetting to multiply by 10,000 to get basis points.",
      },
    };
  },
};

const depthLimitationErrorTemplate = trueFalseTemplate({
  id: "m01-micro-erreur-profondeur",
  conceptId: "m01-microstructure-rappels",
  difficulty: "medium",
  statement: {
    fr: "Le prix affiché au bid ou à l'ask garantit l'exécution complète d'un ordre, quelle que soit sa taille.",
    en: "The price displayed at the bid or ask guarantees full execution of an order, regardless of its size.",
  },
  correct: false,
  explanation: {
    fr: "Faux : ce prix n'est garanti que pour la quantité affichée à ce niveau (la profondeur du carnet). Un ordre plus gros doit être exécuté sur les niveaux de prix suivants, moins favorables — c'est l'impact de marché.",
    en: "False: that price is only guaranteed for the quantity displayed at that level (the book's depth). A larger order must fill at the next, less favorable price levels — this is market impact.",
  },
  commonMistake: {
    fr: "Ignorer la profondeur limitée du carnet d'ordres et supposer qu'un prix affiché s'applique à n'importe quel volume.",
    en: "Ignoring the order book's limited depth and assuming a displayed price applies to any volume.",
  },
});

const illiquidUrgentBuyerScenarioTemplate = mcqTemplate({
  id: "m01-micro-scenario-achat-urgent-illiquide",
  conceptId: "m01-microstructure-rappels",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un gérant doit acheter immédiatement une position significative sur une micro-capitalisation peu liquide, au spread très large. Quelle est la conséquence la plus probable sur son coût d'exécution par rapport à un titre très liquide de même montant ?",
    en: "A manager must immediately buy a significant position in a thinly traded micro-cap stock with a very wide spread. What is the most likely consequence for their execution cost versus a highly liquid stock of the same amount?",
  },
  choices: [
    { id: "higher", label: { fr: "Le coût d'exécution (spread + impact de marché) sera nettement plus élevé", en: "The execution cost (spread + market impact) will be markedly higher" } },
    { id: "same", label: { fr: "Le coût sera identique, seul le prix affiché diffère", en: "The cost will be identical, only the displayed price differs" } },
    { id: "lower", label: { fr: "Le coût sera plus faible, car il y a moins de concurrents sur ce titre", en: "The cost will be lower, since there are fewer competitors on this stock" } },
  ],
  correctId: "higher",
  hint: { fr: "Combinez un spread large ET une faible profondeur de carnet : les deux pénalisent un achat urgent.", en: "Combine a wide spread AND low book depth: both penalize an urgent purchase." },
  explanation: {
    fr: "Sur un titre peu liquide, le spread large augmente déjà le coût d'entrée, et la faible profondeur du carnet ajoute un impact de marché supplémentaire si la position dépasse la quantité affichée — les deux effets se cumulent.",
    en: "On an illiquid stock, the wide spread already raises the entry cost, and the book's low depth adds further market impact if the position exceeds the displayed quantity — both effects compound.",
  },
  commonMistake: {
    fr: "Ne considérer que le spread affiché sans tenir compte de l'impact de marché supplémentaire causé par la faible profondeur du carnet.",
    en: "Only considering the displayed spread without accounting for the extra market impact caused by the book's shallow depth.",
  },
});

const volatilityEventScenarioTemplate = mcqTemplate({
  id: "m01-micro-scenario-annonce-macro",
  conceptId: "m01-microstructure-rappels",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Dans les minutes précédant une annonce macroéconomique majeure (ex. décision de banque centrale), que font typiquement les teneurs de marché à leurs cotations bid/ask ?",
    en: "In the minutes before a major macroeconomic announcement (e.g., a central bank decision), what do market makers typically do to their bid/ask quotes?",
  },
  choices: [
    { id: "widen", label: { fr: "Ils élargissent le spread, voire réduisent la taille cotée, pour se protéger de l'incertitude", en: "They widen the spread, and may reduce the quoted size, to protect against the uncertainty" } },
    { id: "narrow", label: { fr: "Ils resserrent le spread pour profiter du volume attendu", en: "They tighten the spread to benefit from the expected volume" } },
    { id: "unchanged", label: { fr: "Ils ne modifient rien, le spread est fixé réglementairement", en: "They change nothing, the spread is set by regulation" } },
  ],
  correctId: "widen",
  hint: { fr: "Une annonce imminente augmente fortement le risque de détenir une position quelques secondes.", en: "An imminent announcement sharply raises the risk of holding a position for even a few seconds." },
  explanation: {
    fr: "Juste avant une annonce à fort impact, le risque de voir le prix sauter brutalement augmente fortement : les teneurs de marché élargissent leur spread (et réduisent parfois la taille cotée) pour se protéger de ce risque accru avant de pouvoir ajuster leurs cotations.",
    en: "Just before a high-impact announcement, the risk of the price gapping sharply rises significantly: market makers widen their spread (and sometimes reduce quoted size) to protect against that heightened risk before they can adjust their quotes.",
  },
  commonMistake: {
    fr: "Croire que le spread est une caractéristique fixe du titre, indépendante du contexte de marché et du calendrier des annonces.",
    en: "Believing the spread is a fixed feature of the stock, independent of market context and the announcement calendar.",
  },
});

export const templates: QuestionTemplate[] = [
  spreadMidNumericTemplate,
  executionPriceTemplate,
  widerSpreadTemplate,
  vocabTemplate,
  comprehensionTemplate,
  liquidVsIlliquidComparisonTemplate,
  whatIfMoreMarketMakersTemplate,
  whatIfLargeOrderTemplate,
  relativeSpreadNumericTemplate,
  depthLimitationErrorTemplate,
  illiquidUrgentBuyerScenarioTemplate,
  volatilityEventScenarioTemplate,
];
