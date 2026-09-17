import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const parRateNumericTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-taux-pair",
  conceptId: "m04-pricing-swap",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const df1 = randomInt(rng, 92, 98) / 100;
    const df2 = df1 - randomInt(rng, 2, 6) / 100;
    const parRate = Math.round(((1 - df2) / (df1 + df2)) * 10000) / 100;

    return {
      prompt: {
        fr: `Swap 2 ans, coupons annuels (δ=1). DF_1 = ${df1.toFixed(2)}, DF_2 = ${df2.toFixed(2)}. Quel est le taux fixe au pair, en % ?`,
        en: `2-year swap, annual coupons (δ=1). DF_1 = ${df1.toFixed(2)}, DF_2 = ${df2.toFixed(2)}. What is the fixed par rate, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "R = (1 − DF_2) / (DF_1 + DF_2).", en: "R = (1 − DF_2) / (DF_1 + DF_2)." },
      numeric: { value: parRate, tolerance: 0.1 },
      calculation: {
        fr: `R = (1 − ${df2.toFixed(2)}) / (${df1.toFixed(2)} + ${df2.toFixed(2)}) = ${(1 - df2).toFixed(2)} / ${(df1 + df2).toFixed(2)} ≈ ${fmt(parRate, "fr")}%.`,
        en: `R = (1 − ${df2.toFixed(2)}) / (${df1.toFixed(2)} + ${df2.toFixed(2)}) = ${(1 - df2).toFixed(2)} / ${(df1 + df2).toFixed(2)} ≈ ${fmt(parRate, "en")}%.`,
      },
      explanation: {
        fr: "Le numérateur (1 − DF_N) vient de la simplification télescopique de la jambe variable, qui vaut toujours 1 au pair.",
        en: "The numerator (1 − DF_N) comes from the floating leg's telescoping simplification, always worth 1 at par.",
      },
      commonMistake: {
        fr: "Utiliser DF_1 au lieu de DF_2 au numérateur, ou sommer les DF au dénominateur sans les pondérer par δ_t quand les périodes diffèrent.",
        en: "Using DF_1 instead of DF_2 in the numerator, or summing DFs in the denominator without weighting by δ_t when periods differ.",
      },
    };
  },
};

const methodEquivalenceTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-equivalence",
  conceptId: "m04-pricing-swap",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La méthode de différence de jambes obligataires et la méthode de décomposition en FRA donnent des prix différents pour le même swap, car elles reposent sur des logiques distinctes.",
      en: "The bond-legs difference method and the FRA decomposition method give different prices for the same swap, since they rely on distinct logics.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : les deux méthodes sont mathématiquement équivalentes (démontrable par une somme télescopique) et donnent exactement le même prix, à condition d'utiliser la même courbe de facteurs d'actualisation.",
      en: "False: the two methods are mathematically equivalent (provable via a telescoping sum) and give exactly the same price, provided the same discount factor curve is used.",
    },
    commonMistake: {
      fr: "Croire qu'il faut choisir \"la bonne\" méthode, alors que le choix n'est qu'une question de commodité de calcul.",
      en: "Believing one must choose \"the right\" method, when the choice is purely a matter of computational convenience.",
    },
  }),
};

const floatingLegParTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-jambe-variable-pair",
  conceptId: "m04-pricing-swap",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Juste après un reset, quelle est la valeur d'une obligation à taux variable (donc de la jambe variable d'un swap), en proportion de son nominal ?",
      en: "Right after a reset, what is a floating-rate bond's value (and so the swap's floating leg), as a proportion of its face value?",
    },
    choices: buildChoices([
      { id: "one", label: { fr: "Exactement 1 (au pair)", en: "Exactly 1 (at par)" } },
      { id: "variable", label: { fr: "Cela dépend du niveau des taux à ce moment", en: "It depends on the level of rates at that moment" } },
      { id: "zero", label: { fr: "Zéro", en: "Zero" } },
    ]),
    hint: { fr: "Le coupon variable s'ajuste immédiatement aux conditions de marché.", en: "The floating coupon immediately adjusts to market conditions." },
    correctChoiceIds: ["one"],
    explanation: {
      fr: "Une obligation à taux variable vaut toujours exactement son nominal juste après un reset, car son coupon futur s'ajuste immédiatement au taux de marché courant — c'est cette propriété qui simplifie tout le pricing d'un swap.",
      en: "A floating-rate bond is always worth exactly its face value right after a reset, since its future coupon immediately adjusts to the current market rate — this property is what simplifies the entire swap pricing exercise.",
    },
    commonMistake: {
      fr: "Croire que la jambe variable a besoin d'être pricée flux par flux comme la jambe fixe, alors qu'elle se simplifie directement à 1.",
      en: "Thinking the floating leg needs to be priced flow by flow like the fixed leg, when it simplifies directly to 1.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-vocab",
  conceptId: "m04-pricing-swap",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le coefficient DF_t = 1/(1+z_t)^t, qui ramène un flux futur à sa valeur d'aujourd'hui, s'appelle un facteur d'______.",
      en: "The coefficient DF_t = 1/(1+z_t)^t, which brings a future flow back to today's value, is called a ______ factor.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["actualisation", "discount", "discounting"],
    hint: { fr: "Le même verbe utilisé pour « actualiser un flux ».", en: "Same verb as \"discounting a cash flow\"." },
    explanation: {
      fr: "Le facteur d'actualisation DF_t permet de convertir n'importe quel flux futur en sa valeur présente, brique de base du pricing par absence d'arbitrage.",
      en: "The discount factor DF_t converts any future flow into its present value, the basic building block of no-arbitrage pricing.",
    },
    commonMistake: {
      fr: "Confondre le facteur d'actualisation (toujours ≤ 1 pour un taux positif) avec le taux lui-même.",
      en: "Confusing the discount factor (always ≤ 1 for a positive rate) with the rate itself.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m04-pricing-swap-comprehension-utilite",
  conceptId: "m04-pricing-swap",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi peut-on pricer un swap en le traitant comme la différence entre deux obligations (une à taux fixe, une à taux variable) ?",
    en: "Why can a swap be priced by treating it as the difference between two bonds (one fixed-rate, one floating-rate)?",
  },
  choices: [
    { id: "same-flows", label: { fr: "Parce qu'un swap échange exactement les mêmes types de flux qu'un portefeuille long d'une obligation et court de l'autre, sans échange de nominal", en: "Because a swap exchanges exactly the same types of flows as a portfolio long one bond and short the other, with no notional exchange" } },
    { id: "coincidence", label: { fr: "C'est une coïncidence numérique sans fondement structurel", en: "It's a numerical coincidence with no structural basis" } },
    { id: "only-approx", label: { fr: "Ce n'est qu'une approximation grossière, jamais un prix exact", en: "It's only a rough approximation, never an exact price" } },
  ],
  correctId: "same-flows",
  hint: { fr: "Un swap verse des coupons fixes et en reçoit des variables (ou l'inverse) — comme la différence entre détenir deux obligations.", en: "A swap pays fixed coupons and receives floating ones (or the reverse) — like the difference between holding two bonds." },
  explanation: {
    fr: "Un swap receveur fixe reproduit exactement les flux d'un portefeuille long d'une obligation à taux fixe et court d'une obligation à taux variable de même nominal (le nominal lui-même s'annulant puisqu'il n'est jamais échangé) : cette équivalence structurelle, pas une approximation, permet d'appliquer directement les techniques de pricing obligataire déjà connues (M03) au swap.",
    en: "A fixed-receiver swap exactly reproduces the flows of a portfolio long a fixed-rate bond and short a floating-rate bond of the same notional (the notional itself canceling out since it's never exchanged): this structural equivalence, not an approximation, lets bond-pricing techniques already known (M03) be applied directly to the swap.",
  },
  commonMistake: {
    fr: "Croire que la méthode de différence de jambes obligataires n'est qu'une astuce approximative, plutôt qu'une équivalence exacte issue de la réplication des flux.",
    en: "Believing the bond-legs difference method is just a rough trick, rather than an exact equivalence derived from cash-flow replication.",
  },
});

const parVsYtmComparisonTemplate = mcqTemplate({
  id: "m04-pricing-swap-comparaison-taux-pair-ytm",
  conceptId: "m04-pricing-swap",
  difficulty: "hard",
  prompt: {
    fr: "Comparez le taux fixe au pair d'un swap et le taux de coupon au pair d'une obligation (celui qui la fait se négocier exactement au nominal). Quel est leur point commun conceptuel ?",
    en: "Compare a swap's par fixed rate and a bond's par coupon rate (the one that makes it trade exactly at face value). What is their common conceptual point?",
  },
  choices: [
    { id: "zero-value", label: { fr: "Les deux sont le taux fixe qui rend la valeur du contrat exactement nulle (ou égale au nominal) à la conclusion, sans prime à payer par aucune partie", en: "Both are the fixed rate that makes the contract's value exactly zero (or equal to face value) at inception, with no premium owed by either party" } },
    { id: "unrelated", label: { fr: "Ce sont deux concepts totalement indépendants, la comparaison n'a aucun sens", en: "These are two totally independent concepts, the comparison makes no sense" } },
    { id: "swap-always-higher", label: { fr: "Le taux au pair d'un swap est toujours supérieur au taux de coupon au pair d'une obligation équivalente", en: "A swap's par rate is always higher than an equivalent bond's par coupon rate" } },
  ],
  correctId: "zero-value",
  hint: { fr: "Les deux notions de \"pair\" décrivent le même principe : un prix de départ neutre, sans avantage ni désavantage pour aucune partie.", en: "Both \"par\" notions describe the same principle: a neutral starting price, with no advantage or disadvantage for either party." },
  explanation: {
    fr: "Le taux au pair d'un swap (M04-3) et le taux de coupon au pair d'une obligation (M03-2) partagent le même principe fondamental : c'est le taux fixe qui égalise exactement la valeur des flux futurs à ce qui est dû aujourd'hui, sans qu'aucune des deux parties ne doive verser de prime initiale — une application du même principe de non-arbitrage dans deux contextes différents.",
    en: "A swap's par rate (M04-3) and a bond's par coupon rate (M03-2) share the same fundamental principle: it's the fixed rate that exactly equalizes the future flows' value to what is owed today, with neither party needing to pay an upfront premium — an application of the same no-arbitrage principle in two different contexts.",
  },
  commonMistake: {
    fr: "Traiter le taux au pair d'un swap comme un concept entièrement nouveau, sans voir le parallèle direct avec un concept obligataire déjà connu.",
    en: "Treating a swap's par rate as an entirely new concept, without seeing the direct parallel with an already-known bond concept.",
  },
});

const whatIfNearZeroRatesTemplate = mcqTemplate({
  id: "m04-pricing-swap-whatif-taux-proches-zero",
  conceptId: "m04-pricing-swap",
  difficulty: "medium",
  prompt: {
    fr: "Dans un environnement de taux d'intérêt proches de zéro (tous les DF_t proches de 1), que devient approximativement le taux fixe au pair d'un swap ?",
    en: "In a near-zero interest rate environment (all DF_t close to 1), what does a swap's par fixed rate approximately become?",
  },
  choices: [
    { id: "near-zero", label: { fr: "Il est lui-même proche de zéro", en: "It is itself close to zero" } },
    { id: "near-hundred", label: { fr: "Il se rapproche de 100%", en: "It approaches 100%" } },
    { id: "undefined", label: { fr: "La formule devient indéfinie (division par zéro)", en: "The formula becomes undefined (division by zero)" } },
  ],
  correctId: "near-zero",
  hint: { fr: "R = (1−DF_N)/Σ(δ_t×DF_t) : si tous les DF_t → 1, que devient le numérateur ?", en: "R = (1−DF_N)/Σ(δ_t×DF_t): if all DF_t → 1, what happens to the numerator?" },
  explanation: {
    fr: "Si tous les facteurs d'actualisation sont proches de 1 (taux proches de zéro), le numérateur (1−DF_N) tend vers 0, tandis que le dénominateur reste positif et non nul (une somme de δ_t×DF_t proches de δ_t) : le taux au pair R tend donc lui-même vers 0, conformément à l'intuition qu'un environnement de taux nuls produit des swaps à taux fixe quasi nul.",
    en: "If all discount factors are close to 1 (rates close to zero), the numerator (1−DF_N) tends to 0, while the denominator stays positive and non-zero (a sum of δ_t×DF_t close to δ_t): the par rate R therefore itself tends to 0, consistent with the intuition that a zero-rate environment produces near-zero fixed-rate swaps.",
  },
  commonMistake: {
    fr: "Croire que la formule devient instable ou indéfinie en environnement de taux bas, alors qu'elle converge simplement vers une valeur elle-même proche de zéro.",
    en: "Believing the formula becomes unstable or undefined in a low-rate environment, when it simply converges to a value itself close to zero.",
  },
});

const whatIfIrregularScheduleTemplate = trueFalseTemplate({
  id: "m04-pricing-swap-whatif-echeancier-irregulier",
  conceptId: "m04-pricing-swap",
  difficulty: "hard",
  statement: {
    fr: "Si les périodes de paiement d'un swap ne durent pas toutes exactement 1 an (par exemple des paiements trimestriels), on peut ignorer cette différence et simplement sommer les DF_t sans les pondérer, dans la formule du taux au pair.",
    en: "If a swap's payment periods don't all last exactly 1 year (e.g. quarterly payments), this difference can be ignored and the DF_t simply summed unweighted, in the par rate formula.",
  },
  correct: false,
  explanation: {
    fr: "Faux : chaque terme du dénominateur doit être pondéré par la fraction d'année δ_t de la période correspondante (par exemple δ_t = 0,25 pour un trimestre) : R = (1−DF_N) / Σ(δ_t × DF_t). Ignorer cette pondération produit un taux au pair incorrect dès que les périodes ne durent pas exactement 1 an chacune.",
    en: "False: each term in the denominator must be weighted by the corresponding period's year fraction δ_t (e.g. δ_t = 0.25 for a quarter): R = (1−DF_N) / Σ(δ_t × DF_t). Ignoring this weighting produces an incorrect par rate as soon as periods don't each last exactly 1 year.",
  },
  commonMistake: {
    fr: "Sommer les facteurs d'actualisation sans les pondérer par δ_t, une simplification valable uniquement quand toutes les périodes durent exactement 1 an.",
    en: "Summing the discount factors without weighting by δ_t, a simplification valid only when every period lasts exactly 1 year.",
  },
});

const wrongCurveErrorTemplate = trueFalseTemplate({
  id: "m04-pricing-swap-erreur-mauvaise-courbe",
  conceptId: "m04-pricing-swap",
  difficulty: "hard",
  statement: {
    fr: "Utiliser la courbe EURIBOR (au lieu de la courbe OIS) pour actualiser les flux d'un swap collatéralisé en cash ne change rien au prix obtenu, les deux courbes étant théoriquement interchangeables pour l'actualisation.",
    en: "Using the EURIBOR curve (instead of the OIS curve) to discount a cash-collateralized swap's flows changes nothing about the resulting price, the two curves being theoretically interchangeable for discounting.",
  },
  correct: false,
  explanation: {
    fr: "Faux : depuis la généralisation du cadre multi-courbe (M04-4), la courbe OIS et la courbe EURIBOR ne sont plus considérées comme interchangeables pour l'actualisation, l'écart entre elles (le \"basis\") pouvant dépasser plusieurs dizaines de points de base. Utiliser la mauvaise courbe d'actualisation produit un prix systématiquement biaisé, pas seulement une approximation légèrement différente.",
    en: "False: since the multi-curve framework became standard (M04-4), the OIS and EURIBOR curves are no longer treated as interchangeable for discounting, the gap between them (the \"basis\") potentially exceeding several dozen basis points. Using the wrong discounting curve produces a systematically biased price, not just a slightly different approximation.",
  },
  commonMistake: {
    fr: "Croire, comme avant 2008, que n'importe quelle courbe de taux proche peut servir à l'actualisation, en ignorant l'écart significatif entre courbe OIS et courbe EURIBOR.",
    en: "Believing, as before 2008, that any roughly similar rate curve can be used for discounting, ignoring the significant gap between the OIS and EURIBOR curves.",
  },
});

const threePeriodParRateNumericTemplate: QuestionTemplate = {
  id: "m04-pricing-swap-taux-pair-3-periodes",
  conceptId: "m04-pricing-swap",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const df1 = randomInt(rng, 94, 98) / 100;
    const df2 = df1 - randomInt(rng, 2, 4) / 100;
    const df3 = df2 - randomInt(rng, 2, 4) / 100;
    const parRate = Math.round(((1 - df3) / (df1 + df2 + df3)) * 10000) / 100;

    return {
      prompt: {
        fr: `Swap 3 ans, coupons annuels (δ=1). DF_1 = ${df1.toFixed(2)}, DF_2 = ${df2.toFixed(2)}, DF_3 = ${df3.toFixed(2)}. Quel est le taux fixe au pair, en % ?`,
        en: `3-year swap, annual coupons (δ=1). DF_1 = ${df1.toFixed(2)}, DF_2 = ${df2.toFixed(2)}, DF_3 = ${df3.toFixed(2)}. What is the fixed par rate, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "R = (1 − DF_3) / (DF_1 + DF_2 + DF_3), généralisation directe de la formule à 2 périodes.", en: "R = (1 − DF_3) / (DF_1 + DF_2 + DF_3), a direct generalization of the 2-period formula." },
      numeric: { value: parRate, tolerance: 0.1 },
      calculation: {
        fr: `R = (1 − ${df3.toFixed(2)}) / (${df1.toFixed(2)} + ${df2.toFixed(2)} + ${df3.toFixed(2)}) ≈ ${fmt(parRate, "fr")}%.`,
        en: `R = (1 − ${df3.toFixed(2)}) / (${df1.toFixed(2)} + ${df2.toFixed(2)} + ${df3.toFixed(2)}) ≈ ${fmt(parRate, "en")}%.`,
      },
      explanation: {
        fr: "La formule du taux au pair se généralise directement à N'importe quel nombre de périodes : seul le dernier facteur d'actualisation apparaît au numérateur (issu de la télescopie de la jambe variable), tandis que TOUS les facteurs d'actualisation apparaissent au dénominateur.",
        en: "The par rate formula generalizes directly to ANY number of periods: only the last discount factor appears in the numerator (from the floating leg's telescoping), while ALL discount factors appear in the denominator.",
      },
      commonMistake: {
        fr: "N'utiliser que les deux premiers facteurs d'actualisation au dénominateur en oubliant le troisième, ou utiliser DF_2 au lieu de DF_3 au numérateur.",
        en: "Only using the first two discount factors in the denominator and forgetting the third, or using DF_2 instead of DF_3 in the numerator.",
      },
    };
  },
};

const offMarketValuationScenarioTemplate = mcqTemplate({
  id: "m04-pricing-swap-scenario-swap-hors-marche",
  conceptId: "m04-pricing-swap",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un swap a été conclu il y a 1 an à son taux au pair de l'époque. Depuis, les taux ont bougé, et ce swap n'est plus \"au pair\" aujourd'hui. Comment valorise-t-on sa valeur de marché actuelle (mark-to-market) ?",
    en: "A swap was entered into 1 year ago at its then par rate. Since then, rates have moved, and this swap is no longer \"at par\" today. How is its current market value (mark-to-market) computed?",
  },
  choices: [
    { id: "same-framework", label: { fr: "Avec le même cadre général de différence de jambes actualisées, en utilisant les facteurs d'actualisation ACTUELS de la courbe", en: "With the same general discounted-legs-difference framework, using the CURRENT discount factors from today's curve" } },
    { id: "cannot-value", label: { fr: "Il est impossible de valoriser un swap qui n'est plus à son taux au pair", en: "It's impossible to value a swap that's no longer at its par rate" } },
    { id: "always-zero", label: { fr: "Sa valeur reste toujours nulle, comme à la conclusion", en: "Its value always stays zero, as at inception" } },
  ],
  correctId: "same-framework",
  hint: { fr: "Le concept de \"taux au pair\" ne s'applique qu'À LA CONCLUSION ; le cadre de pricing par différence de jambes, lui, s'applique à tout moment.", en: "The \"par rate\" concept only applies AT INCEPTION; the discounted-legs-difference pricing framework applies at any time." },
  explanation: {
    fr: "Le même cadre général (différence entre la valeur actualisée de la jambe fixe au taux contractuel figé, et celle de la jambe variable, toujours proche du pair juste après son dernier reset) s'applique à tout instant de la vie du swap, en utilisant simplement les facteurs d'actualisation ACTUELS : le taux au pair n'est qu'un cas particulier de ce cadre, valable uniquement à la conclusion.",
    en: "The same general framework (the difference between the fixed leg's present value at the frozen contract rate, and the floating leg's, always close to par right after its last reset) applies at any point in the swap's life, simply using CURRENT discount factors: the par rate is only a special case of this framework, valid solely at inception.",
  },
  commonMistake: {
    fr: "Croire qu'un swap ne peut être valorisé qu'à sa conclusion (quand il est au pair), en oubliant que le cadre de pricing général reste applicable à tout instant avec les facteurs d'actualisation courants.",
    en: "Believing a swap can only be valued at inception (when it's at par), forgetting the general pricing framework remains applicable at any time with current discount factors.",
  },
});

const bankQuoteAuditScenarioTemplate = mcqTemplate({
  id: "m04-pricing-swap-scenario-audit-cotation",
  conceptId: "m04-pricing-swap",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une banque cote un swap 2 ans à un taux fixe de 3,80%, alors que le calcul par la courbe de facteurs d'actualisation donne un taux au pair théorique de 3,50%. Que peut-on en conclure ?",
    en: "A bank quotes a 2-year swap at a 3.80% fixed rate, while the discount-factor curve computation gives a theoretical par rate of 3.50%. What can be concluded?",
  },
  choices: [
    { id: "margin", label: { fr: "La banque intègre probablement une marge commerciale (spread) au-dessus du taux théorique de non-arbitrage", en: "The bank is probably including a commercial margin (spread) on top of the theoretical no-arbitrage rate" } },
    { id: "error-always", label: { fr: "C'est nécessairement une erreur de calcul de la banque", en: "This is necessarily a calculation error by the bank" } },
    { id: "impossible", label: { fr: "Un tel écart est impossible en pratique, le taux coté doit toujours être exactement le taux théorique", en: "Such a gap is impossible in practice, the quoted rate must always be exactly the theoretical rate" } },
  ],
  correctId: "margin",
  hint: { fr: "Le taux théorique au pair est un prix de non-arbitrage \"pur\" ; une banque commerciale ajoute presque toujours une marge à ce prix de référence.", en: "The theoretical par rate is a \"pure\" no-arbitrage price; a commercial bank almost always adds a margin to this reference price." },
  explanation: {
    fr: "Le taux au pair calculé à partir de la courbe de facteurs d'actualisation est un prix théorique de référence, hors marge commerciale : une banque y ajoute presque toujours un spread pour rémunérer son intermédiation, son risque de contrepartie résiduel et ses coûts opérationnels. Un écart de cet ordre est donc normal et attendu, pas nécessairement une erreur.",
    en: "The par rate computed from the discount-factor curve is a theoretical reference price, excluding commercial margin: a bank almost always adds a spread to it to compensate for its intermediation, residual counterparty risk, and operational costs. A gap of this size is therefore normal and expected, not necessarily an error.",
  },
  commonMistake: {
    fr: "S'attendre à ce que le taux réellement coté par une banque corresponde exactement au taux théorique de non-arbitrage, sans marge commerciale.",
    en: "Expecting a bank's actually quoted rate to exactly match the theoretical no-arbitrage rate, with no commercial margin.",
  },
});

export const templates: QuestionTemplate[] = [
  parRateNumericTemplate,
  methodEquivalenceTemplate,
  floatingLegParTemplate,
  vocabTemplate,
  comprehensionTemplate,
  parVsYtmComparisonTemplate,
  whatIfNearZeroRatesTemplate,
  whatIfIrregularScheduleTemplate,
  wrongCurveErrorTemplate,
  threePeriodParRateNumericTemplate,
  offMarketValuationScenarioTemplate,
  bankQuoteAuditScenarioTemplate,
];
