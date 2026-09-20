import { pick, randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const comprehensionTemplate = mcqTemplate({
  id: "m01-fx-swap-comprehension",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi le marché des changes cote-t-il généralement un prix à terme sous forme de points (écart au comptant) plutôt qu'en niveau absolu ?",
    en: "Why does the FX market generally quote a forward price as points (a gap to spot) rather than as an absolute level?",
  },
  choices: [
    { id: "isolates-rate-differential", label: { fr: "Les points isolent directement l'effet du différentiel de taux d'intérêt entre les deux devises, l'information réellement utile", en: "Points directly isolate the interest rate differential effect between the two currencies, the genuinely useful information" } },
    { id: "regulatory-requirement", label: { fr: "Une obligation réglementaire impose cette convention de cotation sans autre justification", en: "A regulatory requirement imposes this quoting convention with no other justification" } },
    { id: "absolute-level-cannot-be-computed", label: { fr: "Le niveau absolu du taux à terme est en réalité impossible à calculer", en: "The forward rate's absolute level is in fact impossible to compute" } },
    { id: "tradition-with-no-reason", label: { fr: "C'est une pure tradition de marché, sans justification économique", en: "It is a pure market tradition, with no economic justification" } },
  ],
  correctId: "isolates-rate-differential",
  hint: { fr: "Les points forward reflètent directement l'écart de taux d'intérêt entre les deux devises.", en: "Forward points directly reflect the interest rate gap between the two currencies." },
  explanation: {
    fr: "Coter en points isole directement l'information pertinente pour un intervenant de marché : l'écart entre le comptant et le terme, qui reflète le différentiel de taux d'intérêt entre les deux devises (voir la parité couverte des taux). Le niveau absolu du terme reste bien sûr calculable (comptant + points), mais la convention en points est plus lisible pour juger rapidement de ce différentiel.",
    en: "Quoting in points directly isolates the information relevant to a market participant: the gap between spot and forward, which reflects the interest rate differential between the two currencies (see covered interest rate parity). The forward's absolute level remains of course computable (spot + points), but the points convention is more readable to quickly judge this differential.",
  },
  commonMistake: {
    fr: "Croire que la cotation en points forward est une simple convention arbitraire, sans lien avec le différentiel de taux d'intérêt.",
    en: "Believing the forward points quoting convention is a purely arbitrary one, unrelated to the interest rate differential.",
  },
});

const swapVsForwardComparisonTemplate = mcqTemplate({
  id: "m01-fx-swap-comparaison-swap-vs-forward",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence sépare un FX swap d'un simple contrat forward de change ?",
    en: "What difference separates an FX swap from a simple FX forward contract?",
  },
  choices: [
    { id: "combined-vs-single-directional", label: { fr: "Le FX swap combine une transaction au comptant et son inverse à terme, sans vue directionnelle nette ; le forward est une seule transaction directionnelle", en: "The FX swap combines a spot transaction and its forward reverse, with no net directional view; the forward is a single directional transaction" } },
    { id: "same-instrument-different-name", label: { fr: "Ce sont deux noms différents pour exactement le même instrument", en: "These are two different names for exactly the same instrument" } },
    { id: "swap-always-longer-maturity", label: { fr: "Seule la maturité diffère, le FX swap étant toujours de bien plus longue durée qu'un forward", en: "Only maturity differs, the FX swap always having a much longer duration than a forward" } },
    { id: "forward-has-two-legs-too", label: { fr: "Le forward comporte lui aussi systématiquement une jambe au comptant et une jambe à terme", en: "The forward also systematically has a spot leg and a forward leg" } },
  ],
  correctId: "combined-vs-single-directional",
  hint: { fr: "Le swap combine DEUX transactions de sens opposé ; le forward n'en comporte qu'UNE.", en: "The swap combines TWO opposite-direction transactions; the forward has only ONE." },
  explanation: {
    fr: "Un FX swap combine une transaction au comptant et une transaction à terme de sens opposé sur la même paire de devises, ce qui n'exprime aucune vue directionnelle nette (c'est un outil de financement/roulement) ; un forward simple est une seule transaction directionnelle à terme, exprimant une vue ou une couverture sur le niveau futur du change.",
    en: "An FX swap combines a spot transaction and an opposite-direction forward transaction on the same currency pair, expressing no net directional view (it is a funding/rolling tool); a simple forward is a single directional forward transaction, expressing a view or a hedge on FX's future level.",
  },
  commonMistake: {
    fr: "Croire qu'un FX swap et un forward simple portent la même exposition directionnelle nette au change.",
    en: "Believing an FX swap and a simple forward carry the same net directional FX exposure.",
  },
});

const forwardPointsSignComparisonTemplate = mcqTemplate({
  id: "m01-fx-swap-comparaison-signe-points",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "medium",
  prompt: {
    fr: "Entre deux devises, laquelle se traite structurellement à terme avec une décote (elle \"vaut moins\" à terme qu'au comptant dans la cotation) ?",
    en: "Between two currencies, which one structurally trades forward at a discount (it is \"worth less\" forward than spot in the quote)?",
  },
  choices: [
    { id: "higher-rate-currency-discount", label: { fr: "La devise au taux d'intérêt le plus élevé", en: "The currency with the higher interest rate" } },
    { id: "lower-rate-currency-discount", label: { fr: "La devise au taux d'intérêt le plus bas", en: "The currency with the lower interest rate" } },
    { id: "always-base-currency", label: { fr: "Toujours la devise de base de la cotation, quel que soit son taux d'intérêt", en: "Always the quote's base currency, regardless of its interest rate" } },
    { id: "impossible-to-determine", label: { fr: "Impossible à déterminer sans connaître le sens anticipé du marché", en: "Impossible to determine without knowing the market's anticipated direction" } },
  ],
  correctId: "higher-rate-currency-discount",
  hint: { fr: "C'est le différentiel de taux, pas une anticipation de marché, qui détermine ce signe.", en: "It's the rate differential, not a market anticipation, that determines this sign." },
  explanation: {
    fr: "Par non-arbitrage (parité couverte des taux), la devise au taux d'intérêt le plus élevé se traite structurellement à terme avec une décote par rapport au comptant, et la devise au taux le plus bas avec une prime : ce résultat est purement mécanique, déterminé par le différentiel de taux, et ne dépend d'aucune anticipation de marché sur le sens futur du change.",
    en: "By no-arbitrage (covered interest rate parity), the currency with the higher interest rate structurally trades forward at a discount versus spot, and the currency with the lower rate at a premium: this result is purely mechanical, determined by the rate differential, and depends on no market anticipation of FX's future direction.",
  },
  commonMistake: {
    fr: "Croire que le signe des points forward reflète une anticipation de marché sur le sens futur du change, plutôt qu'un résultat mécanique de non-arbitrage.",
    en: "Believing the sign of forward points reflects a market anticipation of FX's future direction, rather than a mechanical no-arbitrage result.",
  },
});

const whatIfRateDifferentialWidensTemplate = mcqTemplate({
  id: "m01-fx-swap-what-if-ecart-taux-augmente",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "L'écart de taux d'intérêt entre deux devises s'élargit fortement (la banque centrale de la devise A relève ses taux, celle de la devise B les maintient). Toutes choses égales par ailleurs, que devient l'ampleur des points forward entre ces deux devises ?",
    en: "The interest rate gap between two currencies widens sharply (currency A's central bank hikes rates, currency B's holds). All else equal, what happens to the size of the forward points between these two currencies?",
  },
  choices: [
    { id: "points-widen-too", label: { fr: "L'ampleur des points forward s'élargit également, reflétant le nouvel écart de taux plus important", en: "The forward points' size widens too, reflecting the new, larger rate gap" } },
    { id: "points-unaffected", label: { fr: "Les points forward restent inchangés, n'étant pas liés au différentiel de taux d'intérêt", en: "Forward points stay unchanged, since they are unrelated to the interest rate differential" } },
    { id: "points-disappear", label: { fr: "Les points forward disparaissent totalement dès qu'un écart de taux existe entre les devises", en: "Forward points completely disappear as soon as a rate gap exists between the currencies" } },
    { id: "only-spot-reacts", label: { fr: "Seul le taux de change au comptant réagit, les points forward restant indépendants de toute variation de taux", en: "Only the spot rate reacts, forward points staying independent of any rate change" } },
  ],
  correctId: "points-widen-too",
  hint: { fr: "Points forward ≈ Spot × écart de taux × fraction d'année : que devient ce produit si l'écart de taux augmente ?", en: "Forward points ≈ Spot × rate gap × year fraction: what happens to this product if the rate gap increases?" },
  explanation: {
    fr: "Comme les points forward sont approximativement proportionnels au différentiel de taux d'intérêt entre les deux devises, un élargissement de cet écart se traduit mécaniquement par des points forward plus importants (en valeur absolue), toutes choses égales par ailleurs sur le taux de change au comptant — un effet direct et immédiat, indépendant de toute anticipation sur le sens futur du change.",
    en: "Since forward points are approximately proportional to the interest rate differential between the two currencies, a widening of this gap mechanically translates into larger forward points (in absolute value), all else equal on the spot rate — a direct, immediate effect, independent of any anticipation about FX's future direction.",
  },
  commonMistake: {
    fr: "Croire que les points forward sont indépendants des variations de taux d'intérêt entre les deux devises considérées.",
    en: "Believing forward points are independent of interest rate changes between the two considered currencies.",
  },
});

const whatIfReadAsForecastTemplate = mcqTemplate({
  id: "m01-fx-swap-what-if-lecture-prevision",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un stagiaire observe des points forward positifs sur une paire de devises et en conclut que \"le marché anticipe une hausse de cette devise\". Quelle est l'erreur dans ce raisonnement ?",
    en: "An intern observes positive forward points on a currency pair and concludes \"the market expects this currency to rise\". What is the flaw in this reasoning?",
  },
  choices: [
    { id: "mechanical-not-forecast", label: { fr: "Les points forward reflètent un résultat mécanique de non-arbitrage sur le différentiel de taux, pas une prévision de marché sur le sens futur du change", en: "Forward points reflect a mechanical no-arbitrage result on the rate differential, not a market forecast of FX's future direction" } },
    { id: "no-error-correct-reading", label: { fr: "Aucune erreur, c'est exactement la bonne façon de lire des points forward positifs", en: "No flaw, this is exactly the correct way to read positive forward points" } },
    { id: "sign-always-random", label: { fr: "Le signe des points forward est en réalité totalement aléatoire, sans lien avec quoi que ce soit", en: "The sign of forward points is in fact totally random, unrelated to anything" } },
    { id: "only-affects-past-not-future", label: { fr: "Les points forward ne renseignent que sur l'évolution passée du change, jamais sur le présent ou l'avenir", en: "Forward points only inform about FX's past evolution, never about the present or future" } },
  ],
  correctId: "mechanical-not-forecast",
  hint: { fr: "C'est le même piège que pour les taux forward de taux d'intérêt ou les prix forward de matières premières.", en: "This is the same trap as for interest rate forwards or commodity forward prices." },
  explanation: {
    fr: "Les points forward se déduisent mécaniquement du différentiel de taux d'intérêt entre les deux devises par non-arbitrage : ils ne contiennent aucune information sur ce que le marché \"anticipe\" en termes de mouvement futur du change — exactement le même piège, récurrent en finance de marché, que la confusion entre taux forward et prévision de taux futur (voir M03), ou entre prix forward de matière première et prévision de prix futur (voir M02).",
    en: "Forward points are mechanically derived from the interest rate differential between the two currencies via no-arbitrage: they contain no information about what the market \"expects\" in terms of FX's future move — exactly the same recurring trap in market finance as confusing an interest rate forward with a future rate forecast (see M03), or a commodity forward price with a future price forecast (see M02).",
  },
  commonMistake: {
    fr: "Interpréter systématiquement un prix ou un taux forward, quel que soit le marché, comme une prévision du marché plutôt que comme un résultat de non-arbitrage.",
    en: "Systematically interpreting a forward price or rate, on any market, as a market forecast rather than as a no-arbitrage result.",
  },
});

const forwardPointsCalcTemplate: QuestionTemplate = {
  id: "m01-fx-swap-calcul-points-forward",
  conceptId: "m01-fx-points-forward-swap",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const spotThousandths = randomInt(rng, 1000, 1300);
    const spot = spotThousandths / 1000;
    const rQuote = randomInt(rng, 30, 60) / 10;
    const rBase = randomInt(rng, 10, rQuote * 10 - 5) / 10;
    const days = pick(rng, [90, 180, 270, 360] as const);
    const points = Math.round(spot * ((rQuote - rBase) / 100) * (days / 360) * 10000) / 10000;
    const wrongSign = Math.round(spot * ((rBase - rQuote) / 100) * (days / 360) * 10000) / 10000;
    const forgotDays = Math.round(spot * ((rQuote - rBase) / 100) * 10000) / 10000;
    const halved = Math.round((points / 2) * 10000) / 10000;

    return {
      isScenario: true,
      prompt: {
        fr: `Le comptant est de ${fmt(spot, "fr")}. Le taux de la devise de cotation est de ${fmt(rQuote, "fr", 1)}%, celui de la devise de base de ${fmt(rBase, "fr", 1)}%, pour un terme de ${days} jours. Quels sont approximativement les points forward (Spot × écart de taux × jours/360) ?`,
        en: `Spot is ${fmt(spot, "en")}. The quote currency's rate is ${fmt(rQuote, "en", 1)}%, the base currency's rate is ${fmt(rBase, "en", 1)}%, for a ${days}-day term. What are the approximate forward points (Spot × rate gap × days/360)?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(points, "fr")}, en multipliant le comptant par l'écart de taux et par la fraction d'année`, en: `${fmt(points, "en")}, by multiplying spot by the rate gap and by the year fraction` } },
        { id: "wrong-sign", label: { fr: `${fmt(wrongSign, "fr")}, en inversant l'ordre de soustraction des deux taux`, en: `${fmt(wrongSign, "en")}, by reversing the subtraction order of the two rates` } },
        { id: "forgot-days", label: { fr: `${fmt(forgotDays, "fr")}, en oubliant de multiplier par la fraction d'année (jours/360)`, en: `${fmt(forgotDays, "en")}, forgetting to multiply by the year fraction (days/360)` } },
        { id: "halved", label: { fr: `${fmt(halved, "fr")}, en divisant par deux le résultat correct par erreur`, en: `${fmt(halved, "en")}, mistakenly dividing the correct result by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Points forward ≈ Spot × (r_cote − r_base) × jours/360.", en: "Forward points ≈ Spot × (r_quote − r_base) × days/360." },
      explanation: {
        fr: `Points forward ≈ ${fmt(spot, "fr")} × (${fmt(rQuote, "fr", 1)}%−${fmt(rBase, "fr", 1)}%) × ${days}/360 ≈ ${fmt(points, "fr")}. Inverser l'ordre de soustraction change le signe du résultat ; oublier la fraction d'année revient à calculer les points pour un terme d'un an complet plutôt que la durée réelle.`,
        en: `Forward points ≈ ${fmt(spot, "en")} × (${fmt(rQuote, "en", 1)}%−${fmt(rBase, "en", 1)}%) × ${days}/360 ≈ ${fmt(points, "en")}. Reversing the subtraction order flips the result's sign; forgetting the year fraction amounts to computing points for a full one-year term instead of the actual duration.`,
      },
      commonMistake: {
        fr: "Oublier de multiplier par la fraction d'année (jours/360), ce qui revient à calculer les points pour un an entier au lieu de la durée réelle du terme.",
        en: "Forgetting to multiply by the year fraction (days/360), which amounts to computing points for a full year instead of the forward's actual duration.",
      },
    };
  },
};

const outrightForwardCalcTemplate: QuestionTemplate = {
  id: "m01-fx-swap-calcul-taux-terme",
  conceptId: "m01-fx-points-forward-swap",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const spot = randomInt(rng, 1000, 1300) / 1000;
    const pointsRaw = randomInt(rng, 20, 90);
    const points = pointsRaw / 10000;
    const outright = Math.round((spot + points) * 10000) / 10000;
    const subtracted = Math.round((spot - points) * 10000) / 10000;
    const ignoredPoints = spot;
    const doubledPoints = Math.round((spot + 2 * points) * 10000) / 10000;

    return {
      isScenario: true,
      prompt: {
        fr: `Le comptant EUR/USD est de ${fmt(spot, "fr")}. Les points forward cotés pour le terme visé sont de +${fmt(points, "fr")} (soit ${pointsRaw} pips). Quel est le taux de change à terme (outright) ?`,
        en: `The EUR/USD spot is ${fmt(spot, "en")}. The forward points quoted for the target term are +${fmt(points, "en")} (i.e. ${pointsRaw} pips). What is the forward (outright) exchange rate?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(outright, "fr")}, en ajoutant les points forward au comptant`, en: `${fmt(outright, "en")}, by adding the forward points to spot` } },
        { id: "subtracted", label: { fr: `${fmt(subtracted, "fr")}, en soustrayant les points forward au lieu de les ajouter`, en: `${fmt(subtracted, "en")}, by subtracting the forward points instead of adding them` } },
        { id: "ignored", label: { fr: `${fmt(ignoredPoints, "fr")}, en ignorant totalement les points forward`, en: `${fmt(ignoredPoints, "en")}, totally ignoring the forward points` } },
        { id: "doubled", label: { fr: `${fmt(doubledPoints, "fr")}, en ajoutant deux fois les points forward par erreur`, en: `${fmt(doubledPoints, "en")}, mistakenly adding the forward points twice` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "F = S0 + Points forward (avec le signe coté).", en: "F = S0 + Forward points (with the quoted sign)." },
      explanation: {
        fr: `Le taux à terme (outright) s'obtient en ajoutant les points forward, avec leur signe, au taux au comptant : ${fmt(spot, "fr")} + ${fmt(points, "fr")} = ${fmt(outright, "fr")}. Soustraire les points, les ignorer, ou les compter deux fois sont des erreurs fréquentes lors de la construction du taux à terme à partir d'une cotation en points.`,
        en: `The forward (outright) rate is obtained by adding the forward points, with their sign, to the spot rate: ${fmt(spot, "en")} + ${fmt(points, "en")} = ${fmt(outright, "en")}. Subtracting the points, ignoring them, or counting them twice are frequent errors when building the forward rate from a points quote.`,
      },
      commonMistake: {
        fr: "Oublier d'ajouter les points forward au comptant, en reportant directement le taux au comptant comme s'il était déjà le taux à terme.",
        en: "Forgetting to add the forward points to spot, directly reporting the spot rate as if it were already the forward rate.",
      },
    };
  },
};

const speculativeBetMistakeTemplate = mcqTemplate({
  id: "m01-fx-swap-erreur-pari-speculatif",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations décrit correctement l'usage typique d'un FX swap par un desk de financement ?",
    en: "Which of these statements correctly describes a funding desk's typical use of an FX swap?",
  },
  choices: [
    { id: "funding-not-speculation", label: { fr: "Il sert principalement à se financer temporairement dans une devise ou à rouler une position, sans exprimer de vue directionnelle nette", en: "It mainly serves to temporarily fund in a currency or roll a position, expressing no net directional view" } },
    { id: "pure-directional-bet", label: { fr: "Il sert exclusivement à parier sur la hausse ou la baisse future d'une devise", en: "It serves exclusively to bet on a currency's future rise or fall" } },
    { id: "never-used-by-banks", label: { fr: "Les banques n'utilisent jamais cet instrument, réservé aux entreprises non financières", en: "Banks never use this instrument, which is reserved for non-financial companies" } },
    { id: "eliminates-all-fx-exposure", label: { fr: "Il élimine automatiquement toute exposition de change de l'entité qui l'utilise", en: "It automatically eliminates any FX exposure for the entity using it" } },
  ],
  correctId: "funding-not-speculation",
  hint: { fr: "La combinaison comptant + terme inverse neutralise la vue directionnelle nette.", en: "The spot + reverse forward combination neutralizes the net directional view." },
  explanation: {
    fr: "Un FX swap combine une jambe au comptant et une jambe à terme de sens opposé : la vue directionnelle nette sur le change est neutralisée, ce qui en fait un outil de financement temporaire ou de roulement de position, très largement utilisé par les banques elles-mêmes (notamment pour se procurer des devises étrangères), pas un instrument de spéculation directionnelle pure.",
    en: "An FX swap combines a spot leg and an opposite-direction forward leg: the net directional FX view is neutralized, making it a temporary funding or position-rolling tool, very widely used by banks themselves (notably to obtain foreign currency), not a pure directional speculation instrument.",
  },
  commonMistake: {
    fr: "Assimiler tout usage d'un instrument de change à terme à un pari spéculatif directionnel, sans distinguer le FX swap du forward simple.",
    en: "Equating any use of a forward FX instrument with a directional speculative bet, without distinguishing the FX swap from a simple forward.",
  },
});

const crossCurrencySwapMistakeTemplate = mcqTemplate({
  id: "m01-fx-swap-erreur-vs-cross-currency-swap",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "hard",
  prompt: {
    fr: "Laquelle de ces affirmations distingue correctement un FX swap (court terme) d'un swap de devises (cross-currency swap, plus long terme) ?",
    en: "Which of these statements correctly distinguishes an FX swap (short term) from a cross-currency swap (longer term)?",
  },
  choices: [
    { id: "periodic-interest-exchange", label: { fr: "Le swap de devises échange aussi des paiements d'intérêts périodiques pendant sa durée, pas seulement le principal en début et fin de vie comme le FX swap", en: "The cross-currency swap also exchanges periodic interest payments during its life, not just principal at the start and end like the FX swap" } },
    { id: "identical-instruments", label: { fr: "Ce sont deux noms strictement interchangeables pour le même instrument", en: "These are two strictly interchangeable names for the same instrument" } },
    { id: "fx-swap-has-interest-legs", label: { fr: "C'est le FX swap qui comporte des paiements d'intérêts périodiques, pas le swap de devises", en: "It is the FX swap that has periodic interest payments, not the cross-currency swap" } },
    { id: "only-maturity-differs", label: { fr: "Seule la maturité les distingue, leur structure de flux étant par ailleurs rigoureusement identique", en: "Only maturity distinguishes them, their cash-flow structure being otherwise strictly identical" } },
  ],
  correctId: "periodic-interest-exchange",
  hint: { fr: "Le FX swap n'échange le principal qu'à deux dates (début et fin) ; le swap de devises ajoute des flux d'intérêts entre les deux.", en: "The FX swap only exchanges principal at two dates (start and end); the cross-currency swap adds interest flows in between." },
  explanation: {
    fr: "Le FX swap se limite à un échange de principal à deux dates (comptant, puis terme), sans flux intermédiaire ; le swap de devises (cross-currency swap), généralement de plus longue maturité, ajoute à cette structure des échanges périodiques de paiements d'intérêts sur chaque devise pendant toute la durée du contrat — une structure de flux plus riche, pas une simple différence de maturité.",
    en: "The FX swap is limited to a principal exchange at two dates (spot, then forward), with no intermediate flow; the cross-currency swap, generally of longer maturity, adds to this structure periodic exchanges of interest payments on each currency throughout the contract's life — a richer cash-flow structure, not merely a maturity difference.",
  },
  commonMistake: {
    fr: "Réduire la différence entre FX swap et swap de devises à une simple question de maturité, en ignorant la différence de structure de flux.",
    en: "Reducing the difference between an FX swap and a cross-currency swap to a mere maturity question, ignoring the difference in cash-flow structure.",
  },
});

const treasuryDeskScenarioTemplate = mcqTemplate({
  id: "m01-fx-swap-scenario-desk-tresorerie",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le desk de trésorerie d'une banque européenne a besoin de dollars pour trois mois afin de financer des activités américaines, sans vouloir prendre de position directionnelle sur l'EUR/USD. Quel instrument correspond le mieux à ce besoin ?",
    en: "A European bank's treasury desk needs dollars for three months to fund US activities, without wanting to take a directional position on EUR/USD. Which instrument best fits this need?",
  },
  choices: [
    { id: "fx-swap", label: { fr: "Un FX swap : vendre des euros au comptant contre dollars, avec rachat simultané des euros à terme dans trois mois", en: "An FX swap: sell euros spot against dollars, with a simultaneous repurchase of euros forward in three months" } },
    { id: "outright-forward-only", label: { fr: "Un simple forward directionnel, exprimant une vue sur la hausse future de l'EUR/USD", en: "A simple directional forward, expressing a view on EUR/USD's future rise" } },
    { id: "buy-dollars-outright-forever", label: { fr: "Acheter des dollars au comptant de façon définitive, sans aucune opération inverse prévue", en: "Buy dollars spot permanently, with no reverse operation planned" } },
    { id: "do-nothing", label: { fr: "Ne rien faire, aucun instrument ne permettant de répondre à ce besoin précis", en: "Do nothing, since no instrument can meet this specific need" } },
  ],
  correctId: "fx-swap",
  hint: { fr: "Le besoin est un financement TEMPORAIRE (3 mois), sans vue directionnelle : c'est exactement la définition d'un FX swap.", en: "The need is TEMPORARY funding (3 months), with no directional view: that's exactly the definition of an FX swap." },
  explanation: {
    fr: "Le besoin décrit (financement temporaire en dollars, sans vue directionnelle sur le change) correspond exactement à l'usage d'un FX swap : la banque obtient les dollars nécessaires au comptant, contre euros, tout en s'engageant à inverser l'opération à l'échéance — contrairement à un achat définitif de dollars ou à un forward directionnel, qui exprimeraient une vue de change que la banque ne cherche pas ici à prendre.",
    en: "The described need (temporary dollar funding, no directional FX view) exactly matches an FX swap's use case: the bank obtains the needed dollars spot, against euros, while committing to reverse the operation at maturity — unlike an outright dollar purchase or a directional forward, which would express an FX view the bank isn't seeking to take here.",
  },
  commonMistake: {
    fr: "Recommander un achat définitif de devise ou un forward directionnel pour un besoin de financement purement temporaire et sans vue de change.",
    en: "Recommending an outright currency purchase or a directional forward for a purely temporary funding need with no FX view.",
  },
});

const centralBankSwapLineScenarioTemplate = mcqTemplate({
  id: "m01-fx-swap-scenario-ligne-swap-banque-centrale",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Lors d'un épisode de tension sévère sur le financement en dollars, une banque centrale hors des États-Unis active sa ligne de swap de devises avec la Fed. À quoi cette ligne sert-elle concrètement ?",
    en: "During a severe dollar funding stress episode, a central bank outside the US activates its currency swap line with the Fed. What does this line concretely serve for?",
  },
  choices: [
    { id: "obtain-usd-redistribute", label: { fr: "Obtenir des dollars auprès de la Fed pour les redistribuer à ses banques domestiques manquant de financement en devise étrangère", en: "Obtaining dollars from the Fed to redistribute to its domestic banks lacking foreign-currency funding" } },
    { id: "permanently-convert-reserves", label: { fr: "Convertir définitivement une partie de ses réserves de change en dollars, sans jamais les restituer", en: "Permanently converting part of its FX reserves into dollars, never returning them" } },
    { id: "speculate-on-usd", label: { fr: "Spéculer sur une appréciation future du dollar pour le compte de la banque centrale", en: "Speculating on a future dollar appreciation on the central bank's own behalf" } },
    { id: "unrelated-to-fx-swap-mechanics", label: { fr: "Cette ligne n'a en réalité aucun lien avec le mécanisme d'un FX swap classique", en: "This line in fact has no link to a classic FX swap's mechanics" } },
  ],
  correctId: "obtain-usd-redistribute",
  hint: { fr: "Le mécanisme reste celui d'un FX swap (échange temporaire, dénoué à l'échéance), appliqué entre banques centrales.", en: "The mechanism remains that of an FX swap (temporary exchange, unwound at maturity), applied between central banks." },
  explanation: {
    fr: "Une ligne de swap de devises entre banques centrales applique le même mécanisme qu'un FX swap classique (échange temporaire, dénoué à l'échéance) à l'échelle des banques centrales : la banque centrale étrangère obtient des dollars auprès de la Fed pour les redistribuer à ses banques domestiques en manque de financement en dollars, un outil crucial lors des épisodes de tension sévère sur ce marché (2008, mars 2020), sans lien avec une quelconque spéculation ou conversion définitive de réserves.",
    en: "A currency swap line between central banks applies the same mechanism as a classic FX swap (temporary exchange, unwound at maturity) at the central-bank scale: the foreign central bank obtains dollars from the Fed to redistribute to its domestic banks lacking dollar funding, a crucial tool during severe stress episodes on this market (2008, March 2020), unrelated to any speculation or permanent conversion of reserves.",
  },
  commonMistake: {
    fr: "Croire qu'une ligne de swap de devises entre banques centrales sert à convertir définitivement des réserves, plutôt qu'à un échange temporaire dénoué à l'échéance.",
    en: "Believing a currency swap line between central banks serves to permanently convert reserves, rather than a temporary exchange unwound at maturity.",
  },
});

const hedgingReceivableScenarioTemplate = mcqTemplate({
  id: "m01-fx-swap-scenario-couverture-creance",
  conceptId: "m01-fx-points-forward-swap",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un exportateur européen sait qu'il recevra 10 millions USD dans six mois pour une vente déjà facturée, et veut fixer dès aujourd'hui le taux EUR/USD auquel il convertira cette somme. Quel instrument correspond le mieux à ce besoin ?",
    en: "A European exporter knows they will receive USD 10 million in six months for an already invoiced sale, and wants to lock in today the EUR/USD rate at which they will convert that amount. Which instrument best fits this need?",
  },
  choices: [
    { id: "outright-forward-sale", label: { fr: "Un forward directionnel simple : vendre les dollars à terme contre euros au taux fixé aujourd'hui", en: "A simple directional forward: sell the dollars forward against euros at the rate locked in today" } },
    { id: "fx-swap", label: { fr: "Un FX swap, puisqu'il s'agit du seul instrument permettant de fixer un taux de change futur", en: "An FX swap, since it is the only instrument allowing a future exchange rate to be locked in" } },
    { id: "do-nothing-wait", label: { fr: "Ne rien faire avant la réception effective des fonds dans six mois", en: "Do nothing until the funds are actually received in six months" } },
    { id: "buy-dollars-spot-now", label: { fr: "Acheter dès aujourd'hui la totalité des dollars au comptant, avant même de les avoir reçus", en: "Buy the entire dollar amount spot today, even before actually receiving it" } },
  ],
  correctId: "outright-forward-sale",
  hint: { fr: "L'exportateur a une vue directionnelle claire à couvrir (il recevra des USD et veut fixer leur contre-valeur en EUR) : c'est le cas d'usage d'un forward simple, pas d'un swap.", en: "The exporter has a clear directional exposure to hedge (they will receive USD and want to lock in their EUR value): this is a simple forward's use case, not a swap's." },
  explanation: {
    fr: "Couvrir une créance future connue avec certitude (encaissement de 10 millions USD dans six mois) est exactement le cas d'usage d'un forward directionnel simple, qui fixe dès aujourd'hui le taux de conversion futur : le FX swap, lui, sert à un besoin de financement temporaire sans vue directionnelle nette, pas à fixer un taux de conversion pour un flux futur déjà connu et facturé.",
    en: "Hedging a future receivable known with certainty (receiving USD 10 million in six months) is exactly a simple directional forward's use case, locking in today the future conversion rate: the FX swap, by contrast, serves a temporary funding need with no net directional view, not locking in a conversion rate for an already known, invoiced future flow.",
  },
  commonMistake: {
    fr: "Utiliser un FX swap pour couvrir une exposition de change directionnelle connue, alors que c'est précisément le cas d'usage d'un forward simple.",
    en: "Using an FX swap to hedge a known directional FX exposure, when this is precisely a simple forward's use case.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  swapVsForwardComparisonTemplate,
  forwardPointsSignComparisonTemplate,
  whatIfRateDifferentialWidensTemplate,
  whatIfReadAsForecastTemplate,
  forwardPointsCalcTemplate,
  outrightForwardCalcTemplate,
  speculativeBetMistakeTemplate,
  crossCurrencySwapMistakeTemplate,
  treasuryDeskScenarioTemplate,
  centralBankSwapLineScenarioTemplate,
  hedgingReceivableScenarioTemplate,
];
