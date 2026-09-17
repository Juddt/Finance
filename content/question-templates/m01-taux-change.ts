import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

const CURRENCY_PAIRS = [
  { base: "EUR", quote: "USD" },
  { base: "GBP", quote: "USD" },
  { base: "EUR", quote: "CHF" },
  { base: "USD", quote: "JPY" },
] as const;

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const conversionNumericTemplate: QuestionTemplate = {
  id: "m01-fx-conversion-calcul",
  conceptId: "m01-taux-change",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const pair = pick(rng, CURRENCY_PAIRS);
    const rate = randomFloat(rng, 0.8, 1.5, 4);
    const amount = randomInt(rng, 1, 50) * 1000;
    const direction = pick(rng, ["toQuote", "toBase"] as const);
    const result = direction === "toQuote" ? Math.round(amount * rate * 100) / 100 : Math.round((amount / rate) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr:
          direction === "toQuote"
            ? `${pair.base}/${pair.quote} = ${rate.toFixed(4)}. Combien de ${pair.quote} obtient-on en convertissant ${fmt(amount, "fr", 0)} ${pair.base} ?`
            : `${pair.base}/${pair.quote} = ${rate.toFixed(4)}. Combien de ${pair.base} obtient-on en convertissant ${fmt(amount, "fr", 0)} ${pair.quote} ?`,
        en:
          direction === "toQuote"
            ? `${pair.base}/${pair.quote} = ${rate.toFixed(4)}. How many ${pair.quote} do you get converting ${fmt(amount, "en", 0)} ${pair.base}?`
            : `${pair.base}/${pair.quote} = ${rate.toFixed(4)}. How many ${pair.base} do you get converting ${fmt(amount, "en", 0)} ${pair.quote}?`,
      },
      numericUnit: { fr: direction === "toQuote" ? pair.quote : pair.base, en: direction === "toQuote" ? pair.quote : pair.base },
      numericTolerance: "± 5",
      hint: {
        fr: direction === "toQuote" ? `Montant_${pair.quote} = Montant_${pair.base} × taux.` : `Montant_${pair.base} = Montant_${pair.quote} / taux.`,
        en: direction === "toQuote" ? `Amount_${pair.quote} = Amount_${pair.base} × rate.` : `Amount_${pair.base} = Amount_${pair.quote} / rate.`,
      },
      numeric: { value: result, tolerance: 5 },
      calculation: {
        fr: direction === "toQuote" ? `${fmt(amount, "fr", 0)} × ${rate.toFixed(4)} = ${fmt(result, "fr")}.` : `${fmt(amount, "fr", 0)} / ${rate.toFixed(4)} = ${fmt(result, "fr")}.`,
        en: direction === "toQuote" ? `${fmt(amount, "en", 0)} × ${rate.toFixed(4)} = ${fmt(result, "en")}.` : `${fmt(amount, "en", 0)} / ${rate.toFixed(4)} = ${fmt(result, "en")}.`,
      },
      explanation: {
        fr: `${pair.base} est la devise de base : on multiplie pour convertir vers ${pair.quote}, on divise pour convertir depuis ${pair.quote}.`,
        en: `${pair.base} is the base currency: multiply to convert to ${pair.quote}, divide to convert from ${pair.quote}.`,
      },
      commonMistake: {
        fr: "Inverser multiplication et division selon le sens de la conversion.",
        en: "Swapping multiplication and division depending on the conversion direction.",
      },
    };
  },
};

const appreciationTemplate: QuestionTemplate = {
  id: "m01-fx-appreciation",
  conceptId: "m01-taux-change",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const pair = pick(rng, CURRENCY_PAIRS);
    const goingUp = pick(rng, [true, false] as const);

    return {
      prompt: {
        fr: `${pair.base}/${pair.quote} ${goingUp ? "monte" : "baisse"} nettement. Que se passe-t-il pour le ${pair.base} par rapport au ${pair.quote} ?`,
        en: `${pair.base}/${pair.quote} ${goingUp ? "rises" : "falls"} sharply. What happens to the ${pair.base} relative to the ${pair.quote}?`,
      },
      choices: buildChoices([
        { id: "appreciate", label: { fr: `Le ${pair.base} s'apprécie`, en: `The ${pair.base} appreciates` } },
        { id: "depreciate", label: { fr: `Le ${pair.base} se déprécie`, en: `The ${pair.base} depreciates` } },
      ]),
      hint: { fr: "Le taux X/Y monte quand X vaut plus en unités de Y.", en: "The X/Y rate rises when X is worth more in units of Y." },
      correctChoiceIds: [goingUp ? "appreciate" : "depreciate"],
      explanation: goingUp
        ? { fr: `${pair.base}/${pair.quote} qui monte signifie qu'il faut plus de ${pair.quote} pour acheter 1 ${pair.base} : le ${pair.base} s'apprécie.`, en: `${pair.base}/${pair.quote} rising means more ${pair.quote} is needed to buy 1 ${pair.base}: the ${pair.base} appreciates.` }
        : { fr: `${pair.base}/${pair.quote} qui baisse signifie qu'il faut moins de ${pair.quote} pour acheter 1 ${pair.base} : le ${pair.base} se déprécie.`, en: `${pair.base}/${pair.quote} falling means less ${pair.quote} is needed to buy 1 ${pair.base}: the ${pair.base} depreciates.` },
      commonMistake: {
        fr: "Croire qu'une hausse du taux signifie que la devise de base perd de la valeur, alors que c'est l'inverse.",
        en: "Believing a rising rate means the base currency loses value, when it's the opposite.",
      },
    };
  },
};

const baseCurrencyTemplate: QuestionTemplate = {
  id: "m01-fx-devise-base",
  conceptId: "m01-taux-change",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const pair = pick(rng, CURRENCY_PAIRS);
    return {
      prompt: {
        fr: `Dans la cotation ${pair.base}/${pair.quote}, le ${pair.quote} est la devise de base.`,
        en: `In the ${pair.base}/${pair.quote} quote, the ${pair.quote} is the base currency.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: ["false"],
      explanation: {
        fr: `Faux : dans X/Y, X (ici ${pair.base}) est toujours la devise de base, Y (ici ${pair.quote}) la devise de cotation.`,
        en: `False: in X/Y, X (here ${pair.base}) is always the base currency, Y (here ${pair.quote}) the quote currency.`,
      },
      commonMistake: {
        fr: "Inverser devise de base et devise de cotation dans la lecture d'une paire.",
        en: "Swapping base and quote currency when reading a pair.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-fx-vocab",
  conceptId: "m01-taux-change",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans une cotation X/Y, X est appelée la devise de ______.",
      en: "In an X/Y quote, X is called the ______ currency.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["base"],
    hint: { fr: "C'est \"1 unité de\" cette devise que le taux exprime.", en: "It's \"1 unit of\" this currency that the rate expresses." },
    explanation: {
      fr: "X est la devise de base (1 unité de X), Y la devise de cotation (le nombre d'unités de Y pour cette unité de X).",
      en: "X is the base currency (1 unit of X), Y the quote currency (the number of units of Y for that unit of X).",
    },
    commonMistake: {
      fr: "Confondre devise de base et devise de cotation.",
      en: "Confusing base currency and quote currency.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-fx-comprehension-utilite",
  conceptId: "m01-taux-change",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi une entreprise qui facture ses clients étrangers dans une devise différente de celle de ses coûts doit-elle suivre attentivement les taux de change ?",
    en: "Why must a company invoicing foreign clients in a currency different from its cost currency closely monitor exchange rates?",
  },
  choices: [
    { id: "revenue-risk", label: { fr: "Parce que la valeur de son chiffre d'affaires, une fois converti dans sa devise de coûts, varie avec le taux de change", en: "Because the value of its revenue, once converted into its cost currency, moves with the exchange rate" } },
    { id: "tax", label: { fr: "Parce que le taux de change détermine directement le taux d'imposition applicable", en: "Because the exchange rate directly determines the applicable tax rate" } },
    { id: "legal", label: { fr: "Parce que la loi impose de reconvertir tous les revenus chaque jour", en: "Because the law requires reconverting all revenue every day" } },
  ],
  correctId: "revenue-risk",
  hint: { fr: "Pensez à ce qui se passe si le taux de change bouge entre la facturation et l'encaissement.", en: "Think about what happens if the exchange rate moves between invoicing and collection." },
  explanation: {
    fr: "Un revenu encaissé en devise étrangère ne vaut, dans la devise de l'entreprise, que ce que le taux de change du moment permet de convertir : une dépréciation de la devise de facturation réduit mécaniquement la valeur réelle du revenu, même si le montant facturé n'a pas changé.",
    en: "Revenue collected in a foreign currency is only worth, in the company's own currency, what the prevailing exchange rate converts it to: a depreciation of the invoicing currency mechanically reduces the revenue's real value, even if the invoiced amount hasn't changed.",
  },
  commonMistake: {
    fr: "Croire que le montant facturé en devise étrangère représente une valeur fixe, indépendante des mouvements de change ultérieurs.",
    en: "Believing the amount invoiced in a foreign currency represents a fixed value, independent of subsequent FX moves.",
  },
});

const directVsIndirectComparisonTemplate = mcqTemplate({
  id: "m01-fx-comparaison-cotation-directe-indirecte",
  conceptId: "m01-taux-change",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "EUR/USD = 1,10 (1 EUR vaut 1,10 USD). Quel est le taux USD/EUR correspondant (combien d'EUR vaut 1 USD) ?",
    en: "EUR/USD = 1.10 (1 EUR is worth 1.10 USD). What is the corresponding USD/EUR rate (how many EUR is 1 USD worth)?",
  },
  choices: [
    { id: "reciprocal", label: { fr: "Environ 0,9091 (= 1 / 1,10)", en: "About 0.9091 (= 1 / 1.10)" } },
    { id: "same", label: { fr: "Exactement 1,10, comme EUR/USD", en: "Exactly 1.10, same as EUR/USD" } },
    { id: "negative", label: { fr: "−1,10, le signe s'inverse", en: "−1.10, the sign flips" } },
  ],
  correctId: "reciprocal",
  hint: { fr: "Les deux cotations d'une même paire sont inverses l'une de l'autre, pas opposées en signe.", en: "The two quotations of the same pair are reciprocals of each other, not sign-opposites." },
  explanation: {
    fr: "USD/EUR est simplement l'inverse mathématique de EUR/USD : 1/1,10 ≈ 0,9091. Les deux cotations décrivent la même réalité économique, juste exprimée dans le sens opposé.",
    en: "USD/EUR is simply the mathematical reciprocal of EUR/USD: 1/1.10 ≈ 0.9091. Both quotations describe the same economic reality, just expressed in the opposite direction.",
  },
  commonMistake: {
    fr: "Croire que changer le sens de la cotation change le signe du taux, plutôt que de prendre son inverse.",
    en: "Believing flipping the quotation direction changes the rate's sign, rather than taking its reciprocal.",
  },
});

const whatIfRateHikeTemplate = mcqTemplate({
  id: "m01-fx-whatif-hausse-taux-banque-centrale",
  conceptId: "m01-taux-change",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs, si la banque centrale d'un pays relève significativement son taux directeur, que se passe-t-il typiquement, à court terme, sur sa devise ?",
    en: "All else equal, if a country's central bank significantly raises its policy rate, what typically happens to its currency in the short term?",
  },
  choices: [
    { id: "appreciate", label: { fr: "Elle a tendance à s'apprécier, attirée par des rendements plus élevés", en: "It tends to appreciate, attracted by higher yields" } },
    { id: "depreciate", label: { fr: "Elle a tendance à se déprécier automatiquement", en: "It tends to automatically depreciate" } },
    { id: "unaffected", label: { fr: "Elle n'est pas affectée, seule l'inflation compte", en: "It is unaffected, only inflation matters" } },
  ],
  correctId: "appreciate",
  hint: { fr: "Des taux plus élevés rendent les placements dans cette devise plus attractifs pour les investisseurs internationaux.", en: "Higher rates make investments in that currency more attractive to international investors." },
  explanation: {
    fr: "Un taux directeur plus élevé attire des capitaux internationaux en quête de meilleur rendement, ce qui augmente la demande pour cette devise et tend à la faire s'apprécier à court terme — c'est le même mécanisme qui sous-tend le carry trade (voir la parité des taux, M01).",
    en: "A higher policy rate attracts international capital seeking better returns, which increases demand for that currency and tends to make it appreciate in the short term — the same mechanism underlying the carry trade (see interest rate parity, M01).",
  },
  commonMistake: {
    fr: "Ignorer le lien entre différentiel de taux d'intérêt et flux de capitaux internationaux, qui est l'un des principaux moteurs des mouvements de change à court terme.",
    en: "Ignoring the link between interest rate differentials and international capital flows, one of the main drivers of short-term FX moves.",
  },
});

const whatIfReceivableDepreciationTemplate = mcqTemplate({
  id: "m01-fx-whatif-creance-devise-depreciation",
  conceptId: "m01-taux-change",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une entreprise domestique a une créance de 100 000 dans une devise étrangère, à encaisser dans 3 mois. Si cette devise étrangère se déprécie fortement contre la devise domestique d'ici là, que se passe-t-il sur la valeur de cette créance en devise domestique ?",
    en: "A domestic company has a 100,000 receivable in a foreign currency, to be collected in 3 months. If that foreign currency depreciates sharply against the domestic currency by then, what happens to the receivable's value in domestic currency?",
  },
  choices: [
    { id: "down", label: { fr: "Elle diminue : la même somme en devise étrangère vaut moins une fois convertie", en: "It decreases: the same foreign-currency amount is worth less once converted" } },
    { id: "up", label: { fr: "Elle augmente automatiquement", en: "It automatically increases" } },
    { id: "unchanged", label: { fr: "Elle reste inchangée, car le montant facturé est fixe", en: "It stays unchanged, since the invoiced amount is fixed" } },
  ],
  correctId: "down",
  hint: { fr: "La créance est fixée en devise étrangère ; c'est sa contre-valeur en devise domestique qui bouge avec le taux de change.", en: "The receivable is fixed in the foreign currency; it's its domestic-currency counter-value that moves with the exchange rate." },
  explanation: {
    fr: "Le montant de 100 000 en devise étrangère est contractuellement fixe, mais sa contre-valeur en devise domestique dépend du taux de change au moment de la conversion : si la devise étrangère se déprécie, la même somme se convertit en un montant domestique plus faible — un risque de change non couvert classique.",
    en: "The 100,000 amount in the foreign currency is contractually fixed, but its domestic-currency counter-value depends on the exchange rate at conversion time: if the foreign currency depreciates, the same amount converts into a smaller domestic amount — a classic unhedged FX risk.",
  },
  commonMistake: {
    fr: "Confondre le montant facturé (fixe en devise étrangère) avec sa valeur réelle pour l'entreprise (variable, une fois convertie en devise domestique).",
    en: "Confusing the invoiced amount (fixed in the foreign currency) with its real value to the company (variable, once converted to the domestic currency).",
  },
});

const crossRateNumericTemplate: QuestionTemplate = {
  id: "m01-fx-cross-rate-calcul",
  conceptId: "m01-taux-change",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const eurUsd = randomFloat(rng, 1.0, 1.2, 4);
    const usdJpy = randomFloat(rng, 130, 160, 2);
    const eurJpy = Math.round(eurUsd * usdJpy * 100) / 100;

    return {
      prompt: {
        fr: `EUR/USD = ${eurUsd.toFixed(4)} et USD/JPY = ${usdJpy.toFixed(2)}. Quel est le cours croisé (cross rate) EUR/JPY ?`,
        en: `EUR/USD = ${eurUsd.toFixed(4)} and USD/JPY = ${usdJpy.toFixed(2)}. What is the EUR/JPY cross rate?`,
      },
      numericUnit: { fr: "JPY pour 1 EUR", en: "JPY per 1 EUR" },
      numericTolerance: "± 0.5",
      hint: { fr: "EUR/JPY = EUR/USD × USD/JPY : convertissez EUR→USD puis USD→JPY.", en: "EUR/JPY = EUR/USD × USD/JPY: convert EUR→USD then USD→JPY." },
      numeric: { value: eurJpy, tolerance: 0.5 },
      calculation: {
        fr: `EUR/JPY = ${eurUsd.toFixed(4)} × ${usdJpy.toFixed(2)} = ${eurJpy.toFixed(2)}.`,
        en: `EUR/JPY = ${eurUsd.toFixed(4)} × ${usdJpy.toFixed(2)} = ${eurJpy.toFixed(2)}.`,
      },
      explanation: {
        fr: "Un cours croisé se construit en chaînant deux cotations qui partagent une devise commune (ici l'USD) : on multiplie les deux taux quand la devise commune est au numérateur du premier et au dénominateur du second.",
        en: "A cross rate is built by chaining two quotations that share a common currency (here USD): you multiply the two rates when the common currency is the numerator of the first and the denominator of the second.",
      },
      commonMistake: {
        fr: "Diviser au lieu de multiplier, ou se tromper sur quelle devise commune permet de \"simplifier\" la chaîne de conversion.",
        en: "Dividing instead of multiplying, or getting confused about which common currency lets the conversion chain \"cancel out\".",
      },
    };
  },
};

const reciprocalErrorTemplate = trueFalseTemplate({
  id: "m01-fx-erreur-inverse",
  conceptId: "m01-taux-change",
  difficulty: "medium",
  statement: {
    fr: "Si EUR/USD passe de 1,00 à 1,10, alors USD/EUR passe lui aussi de 1,00 à 1,10 (même variation dans le même sens).",
    en: "If EUR/USD moves from 1.00 to 1.10, then USD/EUR also moves from 1.00 to 1.10 (same move, same direction).",
  },
  correct: false,
  explanation: {
    fr: "Faux : USD/EUR est l'inverse de EUR/USD, donc il passe de 1/1,00 = 1,00 à 1/1,10 ≈ 0,909 — une baisse, pas une hausse identique. La relation entre les deux cotations est une réciproque, pas une simple copie.",
    en: "False: USD/EUR is the reciprocal of EUR/USD, so it moves from 1/1.00 = 1.00 to 1/1.10 ≈ 0.909 — a decrease, not an identical increase. The relationship between the two quotations is a reciprocal, not a plain copy.",
  },
  commonMistake: {
    fr: "Appliquer la même variation en pourcentage aux deux sens de cotation, en oubliant que l'inverse d'une fonction n'évolue pas linéairement de la même façon.",
    en: "Applying the same percentage move to both quotation directions, forgetting that a reciprocal doesn't move linearly the same way.",
  },
});

const importerHedgeScenarioTemplate = mcqTemplate({
  id: "m01-fx-scenario-importateur-couverture",
  conceptId: "m01-taux-change",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un importateur domestique doit payer un fournisseur 500 000 dans une devise étrangère dans 6 mois. Il craint que cette devise s'apprécie d'ici là. Quelle est la conséquence d'une non-couverture si son inquiétude se réalise ?",
    en: "A domestic importer must pay a supplier 500,000 in a foreign currency in 6 months. They worry that currency will appreciate by then. What is the consequence of not hedging if their worry materializes?",
  },
  choices: [
    { id: "more-expensive", label: { fr: "Le paiement lui coûtera plus cher en devise domestique qu'anticipé aujourd'hui", en: "The payment will cost them more in domestic currency than anticipated today" } },
    { id: "cheaper", label: { fr: "Le paiement lui coûtera automatiquement moins cher", en: "The payment will automatically cost them less" } },
    { id: "no-effect", label: { fr: "Aucun effet, le montant en devise étrangère est fixe donc le coût aussi", en: "No effect, the foreign-currency amount is fixed so the cost is too" } },
  ],
  correctId: "more-expensive",
  hint: { fr: "L'importateur doit ACHETER la devise étrangère pour payer : une devise étrangère plus chère lui coûte plus cher.", en: "The importer must BUY the foreign currency to pay: a more expensive foreign currency costs them more." },
  explanation: {
    fr: "Si la devise étrangère s'apprécie, l'importateur doit débourser plus d'unités de sa devise domestique pour se procurer les 500 000 unités étrangères nécessaires au paiement — exactement le risque qu'un achat à terme (forward) ou une autre couverture chercherait à éliminer en fixant le taux dès aujourd'hui.",
    en: "If the foreign currency appreciates, the importer must pay out more units of their domestic currency to obtain the 500,000 foreign units needed for payment — exactly the risk a forward purchase or another hedge would seek to eliminate by locking in the rate today.",
  },
  commonMistake: {
    fr: "Croire que seul l'exportateur (qui reçoit une devise étrangère) est exposé au risque de change, en oubliant que l'importateur (qui doit en acheter) l'est tout autant, mais dans le sens opposé.",
    en: "Believing only the exporter (who receives a foreign currency) is exposed to FX risk, forgetting the importer (who must buy it) is equally exposed, just in the opposite direction.",
  },
});

const exporterVsImporterScenarioTemplate = mcqTemplate({
  id: "m01-fx-scenario-exportateur-vs-importateur",
  conceptId: "m01-taux-change",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une devise étrangère s'apprécie fortement contre la devise domestique. Lequel des deux profite mécaniquement de ce mouvement, sans rien faire : un exportateur domestique facturant ses ventes dans cette devise étrangère, ou un importateur domestique qui doit payer ses achats dans cette même devise ?",
    en: "A foreign currency appreciates sharply against the domestic currency. Which of the two mechanically benefits from this move, doing nothing: a domestic exporter invoicing sales in that foreign currency, or a domestic importer who must pay for purchases in that same currency?",
  },
  choices: [
    { id: "exporter", label: { fr: "L'exportateur : ses recettes en devise étrangère valent plus une fois converties", en: "The exporter: their foreign-currency receipts are worth more once converted" } },
    { id: "importer", label: { fr: "L'importateur : ses achats en devise étrangère lui coûtent moins cher", en: "The importer: their foreign-currency purchases cost them less" } },
    { id: "both", label: { fr: "Les deux profitent également du même mouvement", en: "Both benefit equally from the same move" } },
  ],
  correctId: "exporter",
  hint: { fr: "L'un REÇOIT la devise étrangère, l'autre doit l'ACHETER pour payer : une appréciation les affecte en sens opposé.", en: "One RECEIVES the foreign currency, the other must BUY it to pay: an appreciation affects them in opposite directions." },
  explanation: {
    fr: "L'exportateur reçoit des devises étrangères qui valent désormais plus une fois reconverties en devise domestique : il profite de l'appréciation. L'importateur, lui, doit acheter davantage de devise domestique pour se procurer le même montant de devise étrangère : il en pâtit. C'est pourquoi exportateurs et importateurs d'un même pays ont des intérêts de couverture de change diamétralement opposés.",
    en: "The exporter receives foreign currency that is now worth more once converted back to domestic currency: they benefit from the appreciation. The importer, however, must spend more domestic currency to obtain the same amount of foreign currency: they are hurt by it. This is why exporters and importers from the same country have diametrically opposed FX hedging interests.",
  },
  commonMistake: {
    fr: "Croire qu'un mouvement de change affecte tous les acteurs domestiques dans le même sens, sans distinguer qui reçoit et qui doit acheter la devise étrangère.",
    en: "Believing an FX move affects all domestic players the same way, without distinguishing who receives versus who must buy the foreign currency.",
  },
});

export const templates: QuestionTemplate[] = [
  conversionNumericTemplate,
  appreciationTemplate,
  baseCurrencyTemplate,
  vocabTemplate,
  comprehensionTemplate,
  directVsIndirectComparisonTemplate,
  whatIfRateHikeTemplate,
  whatIfReceivableDepreciationTemplate,
  crossRateNumericTemplate,
  reciprocalErrorTemplate,
  importerHedgeScenarioTemplate,
  exporterVsImporterScenarioTemplate,
];
