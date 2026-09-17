import { randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const forwardPriceNumericTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-f0-calcul",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 20, 300);
    const rPct = randomInt(rng, 1, 8);
    const T = randomFloat(rng, 0.25, 3, 2);
    const r = rPct / 100;
    const F0 = Math.round(S0 * Math.pow(1 + r, T) * 100) / 100;

    return {
      prompt: {
        fr: `Un actif sans revenu cote S0 = ${fmt(S0, "fr", 0)} et le taux sans risque est r = ${rPct}%. Quel est le prix forward par non-arbitrage à T = ${fmt(T, "fr")} an(s) ?`,
        en: `An income-free asset trades at S0 = ${fmt(S0, "en", 0)} and the risk-free rate is r = ${rPct}%. What is the no-arbitrage forward price at T = ${fmt(T, "en")} year(s)?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 0.5",
      hint: {
        fr: "F0 = S0 × (1 + r)^T.",
        en: "F0 = S0 × (1 + r)^T.",
      },
      numeric: { value: F0, tolerance: 0.5 },
      calculation: {
        fr: `F0 = ${fmt(S0, "fr", 0)} × (1 + ${r})^${fmt(T, "fr")} = ${fmt(S0, "fr", 0)} × ${fmt(Math.pow(1 + r, T), "fr", 4)} = ${fmt(F0, "fr")}.`,
        en: `F0 = ${fmt(S0, "en", 0)} × (1 + ${r})^${fmt(T, "en")} = ${fmt(S0, "en", 0)} × ${fmt(Math.pow(1 + r, T), "en", 4)} = ${fmt(F0, "en")}.`,
      },
      explanation: {
        fr: "C'est le seul prix qui empêche une stratégie cash-and-carry (ou son inverse) de dégager un profit sans risque.",
        en: "This is the only price that prevents a cash-and-carry strategy (or its reverse) from locking in a risk-free profit.",
      },
      commonMistake: {
        fr: "Oublier d'élever (1+r) à la puissance T, ou utiliser T en mois au lieu d'années.",
        en: "Forgetting to raise (1+r) to the power T, or using T in months instead of years.",
      },
    };
  },
};

const higherRateTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-effet-taux",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "mcq",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Toutes choses égales par ailleurs (même S0, même T, actif sans revenu), si le taux sans risque r augmente, que devient le prix forward F0 ?",
      en: "All else equal (same S0, same T, income-free asset), if the risk-free rate r rises, what happens to the forward price F0?",
    },
    choices: buildChoices([
      { id: "up", label: { fr: "F0 augmente", en: "F0 rises" } },
      { id: "down", label: { fr: "F0 diminue", en: "F0 falls" } },
      { id: "same", label: { fr: "F0 ne change pas", en: "F0 stays the same" } },
    ]),
    hint: {
      fr: "F0 = S0 × (1 + r)^T : regardez le sens de la formule par rapport à r.",
      en: "F0 = S0 × (1 + r)^T: look at how the formula behaves as r changes.",
    },
    correctChoiceIds: ["up"],
    explanation: {
      fr: "F0 croît avec r : un taux plus élevé augmente le coût de financement pour porter l'actif jusqu'à l'échéance, donc le prix forward qui compense ce coût augmente aussi.",
      en: "F0 rises with r: a higher rate increases the financing cost of carrying the asset to maturity, so the forward price that compensates for that cost also rises.",
    },
    commonMistake: {
      fr: "Penser que F0 dépend d'une anticipation de marché sur le prix futur, plutôt que du taux de financement.",
      en: "Thinking F0 depends on a market forecast of the future price, rather than the financing rate.",
    },
  }),
};

const arbitrageDirectionTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-strategie",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const rPct = randomInt(rng, 2, 6);
    const r = rPct / 100;
    const T = 1;
    const F0 = Math.round(S0 * Math.pow(1 + r, T) * 100) / 100;
    const marketAboveFair = pick2(rng);
    const marketF = marketAboveFair ? F0 + randomInt(rng, 3, 10) : F0 - randomInt(rng, 3, 10);
    const correctId = marketAboveFair ? "cash-carry" : "reverse";

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = ${fmt(S0, "fr", 0)}, r = ${rPct}%, T = 1 an, donc F0 théorique = ${fmt(F0, "fr")}. Le marché cote ce forward à ${fmt(marketF, "fr")}. Quelle stratégie d'arbitrage sans risque est possible ?`,
        en: `S0 = ${fmt(S0, "en", 0)}, r = ${rPct}%, T = 1 year, so theoretical F0 = ${fmt(F0, "en")}. The market quotes this forward at ${fmt(marketF, "en")}. Which risk-free arbitrage strategy is available?`,
      },
      choices: buildChoices([
        { id: "cash-carry", label: { fr: "Emprunter, acheter l'actif comptant, vendre le forward", en: "Borrow, buy the asset spot, sell the forward" } },
        { id: "reverse", label: { fr: "Vendre l'actif à découvert, placer le produit, acheter le forward", en: "Short the asset, invest the proceeds, buy the forward" } },
        { id: "none", label: { fr: "Aucune, le prix est correct", en: "None, the price is fair" } },
      ]),
      hint: {
        fr: "Comparez le prix forward coté au prix forward théorique F0 : est-il trop cher ou trop bon marché ?",
        en: "Compare the quoted forward price to the theoretical F0: is it overpriced or underpriced?",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: marketAboveFair
          ? `Le forward coté (${fmt(marketF, "fr")}) est plus cher que F0 (${fmt(F0, "fr")}) : il est surévalué. On le vend, et on réplique la position inverse moins cher via le cash-and-carry (emprunter + acheter comptant).`
          : `Le forward coté (${fmt(marketF, "fr")}) est moins cher que F0 (${fmt(F0, "fr")}) : il est sous-évalué. On l'achète, et on réplique la position inverse via la vente à découvert de l'actif comptant.`,
        en: marketAboveFair
          ? `The quoted forward (${fmt(marketF, "en")}) is more expensive than F0 (${fmt(F0, "en")}): it is overpriced. Sell it, and replicate the opposite position more cheaply via cash-and-carry (borrow + buy spot).`
          : `The quoted forward (${fmt(marketF, "en")}) is cheaper than F0 (${fmt(F0, "en")}): it is underpriced. Buy it, and replicate the opposite position via shorting the asset spot.`,
      },
      commonMistake: {
        fr: "Inverser les deux stratégies : le cash-and-carry sert à profiter d'un forward SURÉVALUÉ, pas sous-évalué.",
        en: "Swapping the two strategies: cash-and-carry is used to exploit an OVERPRICED forward, not an underpriced one.",
      },
    };
  },
};

function pick2(rng: Rng): boolean {
  return rng() < 0.5;
}

const vocabTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-vocab",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La stratégie qui consiste à emprunter de l'argent pour acheter l'actif comptant et le \"porter\" jusqu'à l'échéance du forward s'appelle cash-and-______.",
      en: "The strategy of borrowing money to buy the asset spot and \"carry\" it until the forward's maturity is called cash-and-______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["carry", "carrie"],
    hint: {
      fr: "Le même mot qu'en anglais financier.",
      en: "The English finance term itself.",
    },
    explanation: {
      fr: "Cash-and-carry : on achète comptant avec de l'argent emprunté, et on \"porte\" (carry) l'actif jusqu'à la livraison du forward.",
      en: "Cash-and-carry: you buy spot with borrowed money, and \"carry\" the asset until the forward's delivery.",
    },
    commonMistake: {
      fr: "Confondre cash-and-carry avec le coût de portage lui-même (cost of carry), qui est le résultat chiffré de cette stratégie, pas son nom.",
      en: "Confusing cash-and-carry with the cost of carry itself, which is the numerical result of this strategy, not its name.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m02-non-arbitrage-comprehension-utilite",
  conceptId: "m02-prix-forward-non-arbitrage",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi le prix forward F0 = S0 × (1+r)^T n'est-il pas une prévision du prix futur, mais un prix imposé mécaniquement ?",
    en: "Why isn't the forward price F0 = S0 × (1+r)^T a forecast of the future price, but a mechanically enforced price?",
  },
  choices: [
    { id: "no-arb", label: { fr: "Parce que tout autre prix permettrait une stratégie d'achat comptant financé par emprunt (ou l'inverse) qui dégage un profit garanti", en: "Because any other price would allow a borrowed-cash-financed spot purchase strategy (or its reverse) that locks in a guaranteed profit" } },
    { id: "consensus", label: { fr: "Parce que tous les investisseurs s'accordent statistiquement sur ce niveau de prix futur", en: "Because all investors statistically agree on this future price level" } },
    { id: "central-bank", label: { fr: "Parce qu'une autorité de marché fixe administrativement ce prix chaque jour", en: "Because a market authority administratively sets this price every day" } },
  ],
  correctId: "no-arb",
  hint: { fr: "Pensez à la stratégie cash-and-carry : que se passerait-il si F0 était différent ?", en: "Think about the cash-and-carry strategy: what would happen if F0 were different?" },
  explanation: {
    fr: "F0 est le seul prix qui rend impossible tout profit garanti sans risque via un cash-and-carry (ou son inverse) : à tout autre niveau, n'importe qui pourrait emprunter, acheter comptant (ou vendre à découvert), et se couvrir par le forward pour capter un gain certain — ce mécanisme d'arbitrage referme l'écart, indépendamment de toute anticipation sur le prix futur réel.",
    en: "F0 is the only price that makes any guaranteed risk-free profit via cash-and-carry (or its reverse) impossible: at any other level, anyone could borrow, buy spot (or short), and hedge via the forward to lock in a certain gain — this arbitrage mechanism closes the gap, independent of any forecast about the real future price.",
  },
  commonMistake: {
    fr: "Croire que F0 \"prédit\" le prix spot futur, alors que c'est un résultat de non-arbitrage basé uniquement sur le coût de financement.",
    en: "Believing F0 \"predicts\" the future spot price, when it is a no-arbitrage result based purely on the financing cost.",
  },
});

const incomeAssetComparisonTemplate = mcqTemplate({
  id: "m02-non-arbitrage-comparaison-actif-avec-revenu",
  conceptId: "m02-prix-forward-non-arbitrage",
  difficulty: "hard",
  prompt: {
    fr: "Actif A ne verse aucun revenu avant l'échéance du forward. Actif B, de même prix spot et même maturité, verse un dividende pendant la durée de vie du contrat. Toutes choses égales par ailleurs sur r et T, lequel a le prix forward le plus élevé ?",
    en: "Asset A pays no income before the forward's maturity. Asset B, same spot price and same maturity, pays a dividend during the contract's life. All else equal on r and T, which has the higher forward price?",
  },
  choices: [
    { id: "a", label: { fr: "Actif A, celui sans revenu intermédiaire", en: "Asset A, the one with no interim income" } },
    { id: "b", label: { fr: "Actif B, celui qui verse un dividende", en: "Asset B, the one paying a dividend" } },
    { id: "same", label: { fr: "Les deux ont exactement le même prix forward", en: "Both have exactly the same forward price" } },
  ],
  correctId: "a",
  hint: { fr: "Détenir l'actif B avant l'échéance rapporte un revenu supplémentaire à son détenteur, ce qui réduit le coût net de le porter.", en: "Holding asset B before maturity earns its holder extra income, which reduces the net cost of carrying it." },
  explanation: {
    fr: "Le prix forward compense le coût net de portage : financer l'achat comptant (coût, le taux r) moins tout revenu perçu en le détenant (le dividende). Un actif qui verse un revenu réduit ce coût net, donc son prix forward est structurellement plus bas que celui d'un actif équivalent sans revenu — c'est le même principe que pour une action, où F0 = S0 × (1+r)^T − revenus capitalisés.",
    en: "The forward price compensates for the net carry cost: financing the spot purchase (a cost, the rate r) minus any income earned while holding it (the dividend). An asset paying income reduces this net cost, so its forward price is structurally lower than an equivalent income-free asset's — the same principle as for a stock, where F0 = S0 × (1+r)^T − compounded income.",
  },
  commonMistake: {
    fr: "Oublier qu'un revenu perçu pendant la détention de l'actif réduit le prix forward par rapport au cas sans revenu, au lieu de l'augmenter.",
    en: "Forgetting that income earned while holding the asset reduces the forward price relative to the no-income case, instead of increasing it.",
  },
});

const whatIfLongerMaturityTemplate = mcqTemplate({
  id: "m02-non-arbitrage-whatif-maturite-plus-longue",
  conceptId: "m02-prix-forward-non-arbitrage",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même S0, même r > 0), si la maturité T du forward est allongée, que devient l'écart entre F0 et S0 ?",
    en: "All else equal (same S0, same r > 0), if the forward's maturity T is lengthened, what happens to the gap between F0 and S0?",
  },
  choices: [
    { id: "widens", label: { fr: "Il s'élargit : plus T est grand, plus F0 s'écarte de S0", en: "It widens: the larger T is, the further F0 departs from S0" } },
    { id: "narrows", label: { fr: "Il se réduit progressivement vers zéro", en: "It progressively shrinks toward zero" } },
    { id: "unchanged", label: { fr: "Il reste identique quelle que soit la maturité", en: "It stays identical regardless of maturity" } },
  ],
  correctId: "widens",
  hint: { fr: "F0 = S0 × (1+r)^T : un exposant T plus grand amplifie l'effet de la composition des intérêts.", en: "F0 = S0 × (1+r)^T: a larger exponent T amplifies the compounding effect." },
  explanation: {
    fr: "Le facteur (1+r)^T croît avec T : plus la maturité est lointaine, plus le coût de financement cumulé pour porter l'actif jusqu'à l'échéance est important, et donc plus le prix forward s'écarte du prix spot actuel.",
    en: "The factor (1+r)^T grows with T: the farther out the maturity, the larger the cumulative financing cost of carrying the asset to maturity, and so the more the forward price departs from the current spot price.",
  },
  commonMistake: {
    fr: "Croire que l'écart entre F0 et S0 est fixe, indépendant de la durée du contrat, alors qu'il croît avec la maturité via la composition des intérêts.",
    en: "Believing the gap between F0 and S0 is fixed, independent of the contract's duration, when it grows with maturity through interest compounding.",
  },
});

const whatIfStorageCostTemplate = mcqTemplate({
  id: "m02-non-arbitrage-whatif-cout-stockage",
  conceptId: "m02-prix-forward-non-arbitrage",
  difficulty: "medium",
  prompt: {
    fr: "Pour une matière première physique (ex. blé, pétrole) qui engendre des coûts de stockage plutôt qu'un revenu, comment ces coûts affectent-ils le prix forward par rapport au cas d'un actif financier sans frais de portage ?",
    en: "For a physical commodity (e.g. wheat, oil) that incurs storage costs rather than income, how do these costs affect the forward price versus a financial asset with no carry cost?",
  },
  choices: [
    { id: "up", label: { fr: "Ils augmentent encore le prix forward, en s'ajoutant au coût de financement", en: "They further raise the forward price, adding on top of the financing cost" } },
    { id: "down", label: { fr: "Ils réduisent le prix forward, comme le ferait un dividende", en: "They lower the forward price, the way a dividend would" } },
    { id: "no-effect", label: { fr: "Ils n'ont aucun effet, seul le taux sans risque compte", en: "They have no effect, only the risk-free rate matters" } },
  ],
  correctId: "up",
  hint: { fr: "Un coût de stockage, c'est l'inverse d'un revenu : ça s'ajoute au coût de portage plutôt que de le réduire.", en: "A storage cost is the opposite of income: it adds to the carry cost rather than reducing it." },
  explanation: {
    fr: "Le coût de stockage (assurance, entreposage physique) s'ajoute au coût de financement pour porter la matière première jusqu'à l'échéance, exactement à l'opposé d'un dividende qui le réduit : le prix forward d'une matière première stockée est donc plus élevé que ne le suggérerait le seul taux d'intérêt.",
    en: "The storage cost (insurance, physical warehousing) adds to the financing cost of carrying the commodity to maturity, exactly the opposite of a dividend which reduces it: a stored commodity's forward price is therefore higher than the interest rate alone would suggest.",
  },
  commonMistake: {
    fr: "Traiter un coût de stockage comme un revenu qui réduirait le prix forward, en confondant son effet avec celui d'un dividende.",
    en: "Treating a storage cost like income that would reduce the forward price, confusing its effect with a dividend's.",
  },
});

const impliedRateNumericTemplate: QuestionTemplate = {
  id: "m02-non-arbitrage-taux-implicite-calcul",
  conceptId: "m02-prix-forward-non-arbitrage",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 40, 250);
    const rPct = randomInt(rng, 1, 8);
    const T = randomFloat(rng, 0.5, 2, 2);
    const r = rPct / 100;
    const F0 = Math.round(S0 * Math.pow(1 + r, T) * 100) / 100;
    const impliedRPct = Math.round((Math.pow(F0 / S0, 1 / T) - 1) * 10000) / 100;

    return {
      prompt: {
        fr: `Un actif sans revenu cote S0 = ${S0} et son forward coté à T = ${T.toFixed(2)} an(s) vaut F0 = ${F0.toFixed(2)}. Quel taux sans risque annuel r est implicite dans ce prix forward ?`,
        en: `An income-free asset trades at S0 = ${S0} and its quoted forward at T = ${T.toFixed(2)} year(s) is worth F0 = ${F0.toFixed(2)}. What annual risk-free rate r is implied by this forward price?`,
      },
      numericUnit: { fr: "% par an", en: "% per year" },
      numericTolerance: "± 0.15",
      hint: { fr: "Inversez F0 = S0 × (1+r)^T : r = (F0/S0)^(1/T) − 1.", en: "Invert F0 = S0 × (1+r)^T: r = (F0/S0)^(1/T) − 1." },
      numeric: { value: impliedRPct, tolerance: 0.15 },
      calculation: {
        fr: `r = (${F0.toFixed(2)}/${S0})^(1/${T.toFixed(2)}) − 1 ≈ ${(impliedRPct / 100).toFixed(4)}, soit environ ${impliedRPct.toFixed(2)}%.`,
        en: `r = (${F0.toFixed(2)}/${S0})^(1/${T.toFixed(2)}) − 1 ≈ ${(impliedRPct / 100).toFixed(4)}, i.e. about ${impliedRPct.toFixed(2)}%.`,
      },
      explanation: {
        fr: "Extraire le taux implicite d'un couple (S0, F0) coté sur le marché permet de vérifier la cohérence du prix forward avec les conditions de financement observées, ou d'estimer un taux non directement observable.",
        en: "Extracting the implied rate from a market-quoted (S0, F0) pair lets you check the forward price's consistency with observed financing conditions, or estimate a rate that isn't directly observable.",
      },
      commonMistake: {
        fr: "Oublier la racine T-ième lors de l'inversion (utiliser une simple division linéaire au lieu de l'exposant 1/T).",
        en: "Forgetting the T-th root when inverting (using simple linear division instead of the 1/T exponent).",
      },
    };
  },
};

const monthsVsYearsErrorTemplate = trueFalseTemplate({
  id: "m02-non-arbitrage-erreur-unite-t",
  conceptId: "m02-prix-forward-non-arbitrage",
  difficulty: "medium",
  statement: {
    fr: "Si la maturité du forward est de 6 mois et que r est un taux annuel, on peut directement utiliser T = 6 dans la formule F0 = S0 × (1+r)^T sans convertir en années.",
    en: "If the forward's maturity is 6 months and r is an annual rate, you can directly use T = 6 in the formula F0 = S0 × (1+r)^T without converting to years.",
  },
  correct: false,
  explanation: {
    fr: "Faux : r étant un taux ANNUEL, T doit être exprimé en années dans la formule pour que les unités soient cohérentes. Pour 6 mois, T = 0,5, pas 6 — utiliser T = 6 par erreur élèverait (1+r) à une puissance 12 fois trop grande.",
    en: "False: since r is an ANNUAL rate, T must be expressed in years in the formula for the units to be consistent. For 6 months, T = 0.5, not 6 — mistakenly using T = 6 would raise (1+r) to a power 12 times too large.",
  },
  commonMistake: {
    fr: "Utiliser la maturité directement en mois (ou en jours) sans la convertir en années, alors que le taux r est conventionnellement annualisé.",
    en: "Using the maturity directly in months (or days) without converting to years, when the rate r is conventionally annualized.",
  },
});

const replicationTreasuryScenarioTemplate = mcqTemplate({
  id: "m02-non-arbitrage-scenario-replication-tresorerie",
  conceptId: "m02-prix-forward-non-arbitrage",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une trésorerie d'entreprise, sans accès direct à un marché de forwards, veut néanmoins fixer aujourd'hui le prix auquel elle achètera un actif dans 1 an. Comment peut-elle répliquer synthétiquement l'effet d'un forward acheteur avec des instruments de trésorerie classiques ?",
    en: "A corporate treasury, with no direct access to a forward market, still wants to lock in today the price at which it will buy an asset in 1 year. How can it synthetically replicate the effect of a long forward with plain treasury instruments?",
  },
  choices: [
    { id: "borrow-buy", label: { fr: "Emprunter le montant nécessaire aujourd'hui, acheter l'actif comptant immédiatement, et le conserver jusqu'à l'échéance", en: "Borrow the needed amount today, buy the asset spot immediately, and hold it until maturity" } },
    { id: "wait", label: { fr: "Attendre simplement 1 an et acheter au prix spot alors en vigueur", en: "Simply wait 1 year and buy at the then-prevailing spot price" } },
    { id: "short-sell", label: { fr: "Vendre l'actif à découvert dès aujourd'hui", en: "Short the asset today" } },
  ],
  correctId: "borrow-buy",
  hint: { fr: "C'est exactement la jambe \"cash-and-carry\" de la stratégie de réplication d'un forward.", en: "This is exactly the \"cash-and-carry\" leg of a forward-replication strategy." },
  explanation: {
    fr: "Emprunter aujourd'hui pour acheter l'actif comptant et le porter jusqu'à l'échéance revient exactement à fixer le prix d'achat à F0 = S0 × (1+r)^T, le remboursement de l'emprunt avec intérêts représentant le coût final — c'est la réplication physique d'un forward acheteur, utile quand aucun contrat forward n'est directement accessible.",
    en: "Borrowing today to buy the asset spot and carrying it until maturity is exactly equivalent to locking in the purchase price at F0 = S0 × (1+r)^T, with the loan repayment plus interest representing the final cost — this is the physical replication of a long forward, useful when no forward contract is directly accessible.",
  },
  commonMistake: {
    fr: "Croire qu'un forward ne peut être obtenu qu'auprès d'une contrepartie de marché, en oubliant qu'il peut être répliqué synthétiquement avec un simple emprunt et un achat comptant.",
    en: "Believing a forward can only be obtained from a market counterparty, forgetting it can be synthetically replicated with a plain loan and a spot purchase.",
  },
});

const calendarConsistencyScenarioTemplate = mcqTemplate({
  id: "m02-non-arbitrage-scenario-coherence-calendaire",
  conceptId: "m02-prix-forward-non-arbitrage",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Sur un actif sans revenu et avec un taux sans risque positif stable, un desk observe que le forward à 12 mois cote MOINS cher que le forward à 3 mois sur le même actif. Que peut-on en conclure ?",
    en: "On an income-free asset with a stable positive risk-free rate, a desk observes the 12-month forward quoting CHEAPER than the 3-month forward on the same asset. What can be concluded?",
  },
  choices: [
    { id: "mispriced", label: { fr: "C'est incohérent avec la non-arbitrage : F0 doit croître avec T quand r > 0, donc l'un des deux prix est mal coté", en: "This is inconsistent with no-arbitrage: F0 must increase with T when r > 0, so one of the two prices is mispriced" } },
    { id: "normal", label: { fr: "C'est parfaitement normal, les forwards de maturités différentes ne sont pas liés entre eux", en: "This is perfectly normal, forwards of different maturities are unrelated to each other" } },
    { id: "depends-view", label: { fr: "Cela dépend uniquement des anticipations du marché sur le prix futur", en: "It depends purely on the market's forecast of the future price" } },
  ],
  correctId: "mispriced",
  hint: { fr: "F0 = S0 × (1+r)^T est strictement croissant en T dès que r > 0.", en: "F0 = S0 × (1+r)^T is strictly increasing in T whenever r > 0." },
  explanation: {
    fr: "Puisque F0 croît strictement avec T pour r > 0, le forward à 12 mois doit théoriquement être plus cher que celui à 3 mois sur le même actif sans revenu : observer l'inverse signale une incohérence exploitable par un arbitrage calendaire (vendre le forward court cher relativement, acheter le forward long bon marché relativement, ou une stratégie équivalente), pas une simple différence d'anticipation.",
    en: "Since F0 strictly increases with T for r > 0, the 12-month forward should theoretically be pricier than the 3-month one on the same income-free asset: observing the opposite signals an exploitable inconsistency via calendar arbitrage (sell the relatively expensive short forward, buy the relatively cheap long forward, or an equivalent strategy), not simply a difference in forecasts.",
  },
  commonMistake: {
    fr: "Croire que chaque maturité de forward a un prix totalement indépendant fixé par le marché, en oubliant que la formule de non-arbitrage relie mécaniquement toutes les maturités entre elles.",
    en: "Believing each forward maturity has a totally independent, market-set price, forgetting the no-arbitrage formula mechanically links all maturities together.",
  },
});

export const templates: QuestionTemplate[] = [
  forwardPriceNumericTemplate,
  higherRateTemplate,
  arbitrageDirectionTemplate,
  vocabTemplate,
  comprehensionTemplate,
  incomeAssetComparisonTemplate,
  whatIfLongerMaturityTemplate,
  whatIfStorageCostTemplate,
  impliedRateNumericTemplate,
  monthsVsYearsErrorTemplate,
  replicationTreasuryScenarioTemplate,
  calendarConsistencyScenarioTemplate,
];
