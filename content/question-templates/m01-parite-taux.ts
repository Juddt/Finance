import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const cipNumericTemplate: QuestionTemplate = {
  id: "m01-cip-calcul",
  conceptId: "m01-parite-taux",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomFloat(rng, 0.85, 1.35, 4);
    const rDomPct = randomInt(rng, 1, 7);
    const rForPct = randomInt(rng, 1, 7);
    const F0 = Math.round(S0 * ((1 + rDomPct / 100) / (1 + rForPct / 100)) * 10000) / 10000;

    return {
      prompt: {
        fr: `S0 = ${fmt(S0, "fr")}, r_dom = ${rDomPct}%, r_étr = ${rForPct}%, T = 1 an. Par la parité couverte des taux, quel est le prix forward F0 ?`,
        en: `S0 = ${fmt(S0, "en")}, r_dom = ${rDomPct}%, r_for = ${rForPct}%, T = 1 year. By covered interest rate parity, what is the forward price F0?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 0.002",
      hint: { fr: "F0 = S0 × (1+r_dom)/(1+r_étr).", en: "F0 = S0 × (1+r_dom)/(1+r_for)." },
      numeric: { value: F0, tolerance: 0.002 },
      calculation: {
        fr: `F0 = ${fmt(S0, "fr")} × (1,${rDomPct.toString().padStart(2, "0")}/1,${rForPct.toString().padStart(2, "0")}) ≈ ${fmt(F0, "fr")}.`,
        en: `F0 = ${fmt(S0, "en")} × (1.${rDomPct.toString().padStart(2, "0")}/1.${rForPct.toString().padStart(2, "0")}) ≈ ${fmt(F0, "en")}.`,
      },
      explanation: {
        fr: "Ce prix forward est mécaniquement imposé par non-arbitrage, indépendamment de toute anticipation sur la direction future du change.",
        en: "This forward price is mechanically enforced by no-arbitrage, independent of any expectation about the future FX direction.",
      },
      commonMistake: {
        fr: "Inverser r_dom et r_étr dans le rapport, ce qui inverse le sens de l'ajustement.",
        en: "Swapping r_dom and r_for in the ratio, which flips the adjustment's direction.",
      },
    };
  },
};

const cipVsUipTemplate: QuestionTemplate = {
  id: "m01-cip-vs-uip",
  conceptId: "m01-parite-taux",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "cip", fr: "cette relation est vérifiée quasi systématiquement sur les devises liquides, car protégée par un mécanisme d'arbitrage", en: "this relationship holds almost systematically on liquid currencies, protected by an arbitrage mechanism" },
        { id: "uip", fr: "cette relation repose sur une anticipation du marché et est souvent invalidée empiriquement (le \"forward premium puzzle\")", en: "this relationship rests on a market expectation and is often empirically invalidated (the \"forward premium puzzle\")" },
      ] as const
    );

    return {
      prompt: {
        fr: `Laquelle des deux parités correspond à : « ${scenario.fr} » ?`,
        en: `Which parity matches: "${scenario.en}"?`,
      },
      choices: buildChoices([
        { id: "cip", label: { fr: "Parité couverte (CIP)", en: "Covered parity (CIP)" } },
        { id: "uip", label: { fr: "Parité non couverte (UIP)", en: "Uncovered parity (UIP)" } },
      ]),
      hint: { fr: "L'une est un résultat d'arbitrage exact, l'autre une hypothèse comportementale.", en: "One is an exact arbitrage result, the other a behavioral assumption." },
      correctChoiceIds: [scenario.id],
      explanation:
        scenario.id === "cip"
          ? { fr: "La CIP est une identité de non-arbitrage : un investisseur peut se couvrir intégralement avec un forward, donc elle se vérifie presque toujours.", en: "CIP is a no-arbitrage identity: an investor can fully hedge with a forward, so it almost always holds." }
          : { fr: "L'UIP suppose que le taux spot futur anticipé égale le forward, sans aucune protection d'arbitrage — une hypothèse souvent contredite empiriquement.", en: "UIP assumes the expected future spot rate equals the forward, with no arbitrage protection — an assumption often empirically contradicted." },
      commonMistake: {
        fr: "Croire que CIP et UIP sont également fiables, alors que seule la CIP est un résultat d'arbitrage garanti.",
        en: "Believing CIP and UIP are equally reliable, when only CIP is a guaranteed arbitrage result.",
      },
    };
  },
};

const carryTradeTemplate: QuestionTemplate = {
  id: "m01-cip-carry-trade",
  conceptId: "m01-parite-taux",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le carry trade non couvert (emprunter dans la devise à taux bas, placer dans celle à taux élevé sans se couvrir) ne serait jamais profitable en moyenne si l'UIP se vérifiait parfaitement.",
      en: "The unhedged carry trade (borrowing in the low-rate currency, investing in the high-rate one unhedged) would never be profitable on average if UIP held perfectly.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : si l'UIP se vérifiait parfaitement, la dépréciation attendue de la devise à taux élevé annulerait exactement son avantage de taux, rendant le carry trade non rentable en moyenne — c'est justement parce que l'UIP est empiriquement violée que le carry trade reste une stratégie étudiée et pratiquée.",
      en: "True: if UIP held perfectly, the high-rate currency's expected depreciation would exactly cancel its rate advantage, making the carry trade unprofitable on average — it is precisely because UIP is empirically violated that the carry trade remains a studied and practiced strategy.",
    },
    commonMistake: {
      fr: "Ne pas voir le lien direct entre la validité empirique de l'UIP et la profitabilité du carry trade.",
      en: "Missing the direct link between UIP's empirical validity and the carry trade's profitability.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-cip-vocab",
  conceptId: "m01-parite-taux",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La parité des taux d'intérêt protégée par un forward, toujours vraie sous hypothèses de marché parfait, est dite parité ______.",
      en: "The interest rate parity protected by a forward, always true under perfect-market assumptions, is called ______ parity.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["couverte", "covered"],
    hint: { fr: "Le risque de change est « couvert » par le forward.", en: "The FX risk is \"covered\" by the forward." },
    explanation: {
      fr: "La parité couverte (CIP) est protégée par la couverture au forward, contrairement à la parité non couverte (UIP).",
      en: "Covered parity (CIP) is protected by the forward hedge, unlike uncovered parity (UIP).",
    },
    commonMistake: {
      fr: "Répondre \"non couverte\", qui décrit l'hypothèse comportementale (UIP), pas le résultat d'arbitrage garanti.",
      en: "Answering \"uncovered\", which describes the behavioral assumption (UIP), not the guaranteed arbitrage result.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-cip-comprehension-utilite",
  conceptId: "m01-parite-taux",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi la parité couverte des taux (CIP) se vérifie-t-elle quasi systématiquement sur les devises liquides, contrairement à beaucoup d'autres relations de marché ?",
    en: "Why does covered interest rate parity (CIP) hold almost systematically on liquid currencies, unlike many other market relationships?",
  },
  choices: [
    { id: "arb", label: { fr: "Parce qu'un écart déclenche un arbitrage sans risque et sans anticipation que n'importe quel intervenant peut exécuter", en: "Because a gap triggers a riskless arbitrage, requiring no forecast, that any participant can execute" } },
    { id: "regulation", label: { fr: "Parce qu'un régulateur fixe directement le taux forward de chaque devise", en: "Because a regulator directly sets each currency's forward rate" } },
    { id: "consensus", label: { fr: "Parce que tous les intervenants du marché anticipent la même direction de change", en: "Because all market participants forecast the same FX direction" } },
  ],
  correctId: "arb",
  hint: { fr: "Comparez avec l'UIP, qui elle repose sur une anticipation — pas la CIP.", en: "Compare with UIP, which relies on a forecast — CIP does not." },
  explanation: {
    fr: "La CIP découle d'une stratégie de couverture parfaite (emprunter/placer + forward) : si le prix de marché s'écarte du prix théorique, n'importe quel intervenant peut capter un profit garanti sans prendre de risque de change ni parier sur une direction, ce qui referme l'écart presque instantanément.",
    en: "CIP follows from a perfectly hedged strategy (borrow/invest + forward): if the market price deviates from the theoretical price, any participant can lock in a guaranteed profit without taking FX risk or betting on a direction, which closes the gap almost instantly.",
  },
  commonMistake: {
    fr: "Confondre la CIP, un résultat d'arbitrage garanti, avec l'UIP, qui repose sur une anticipation du marché et n'est pas protégée par une couverture.",
    en: "Confusing CIP, a guaranteed arbitrage result, with UIP, which rests on a market forecast and isn't protected by a hedge.",
  },
});

const premiumVsDiscountComparisonTemplate = mcqTemplate({
  id: "m01-cip-comparaison-premium-decote",
  conceptId: "m01-parite-taux",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Le taux domestique est de 5%, le taux étranger de 2%. Par la CIP, la devise domestique se traite-t-elle à terme avec une prime ou une décote par rapport à son cours comptant, en unités de devise étrangère par unité domestique ?",
    en: "The domestic rate is 5%, the foreign rate is 2%. By CIP, does the domestic currency trade forward at a premium or a discount versus its spot rate, in foreign-currency units per domestic unit?",
  },
  choices: [
    { id: "discount", label: { fr: "À décote : elle vaudra relativement moins cher à terme", en: "At a discount: it will be relatively cheaper forward" } },
    { id: "premium", label: { fr: "À prime : elle vaudra relativement plus cher à terme", en: "At a premium: it will be relatively more expensive forward" } },
    { id: "flat", label: { fr: "Ni l'un ni l'autre, elle reste au même cours qu'au comptant", en: "Neither, it stays at the same rate as spot" } },
  ],
  correctId: "discount",
  hint: { fr: "Le taux le plus élevé doit être compensé par un désavantage ailleurs, sinon un arbitrage existerait.", en: "The higher rate must be offset by a disadvantage elsewhere, otherwise an arbitrage would exist." },
  explanation: {
    fr: "Un intérêt domestique plus élevé rapporte plus en détenant la devise domestique, mais la CIP impose que ce surcroît de rendement soit exactement compensé par une dépréciation forward de cette même devise domestique (décote), pour qu'aucun profit sans risque ne soit possible.",
    en: "A higher domestic rate earns more from holding the domestic currency, but CIP requires this extra yield to be exactly offset by a forward depreciation of that same domestic currency (a discount), so no risk-free profit is possible.",
  },
  commonMistake: {
    fr: "Penser que le taux le plus élevé rend automatiquement sa devise \"plus forte\" à terme, alors que la CIP impose exactement l'inverse pour éliminer l'arbitrage.",
    en: "Thinking the higher rate automatically makes its currency \"stronger\" forward, when CIP imposes exactly the opposite to eliminate arbitrage.",
  },
});

const whatIfDomesticRateRisesTemplate = mcqTemplate({
  id: "m01-cip-whatif-hausse-taux-domestique",
  conceptId: "m01-parite-taux",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même S0, même taux étranger), si le taux domestique r_dom augmente, que devient le prix forward F0 par la CIP ?",
    en: "All else equal (same S0, same foreign rate), if the domestic rate r_dom rises, what happens to the forward price F0 under CIP?",
  },
  choices: [
    { id: "up", label: { fr: "F0 augmente", en: "F0 rises" } },
    { id: "down", label: { fr: "F0 diminue", en: "F0 falls" } },
    { id: "same", label: { fr: "F0 ne change pas", en: "F0 stays the same" } },
  ],
  correctId: "up",
  hint: { fr: "F0 = S0 × (1+r_dom)/(1+r_étr) : regardez l'effet d'une hausse du numérateur.", en: "F0 = S0 × (1+r_dom)/(1+r_for): look at the effect of a higher numerator." },
  explanation: {
    fr: "r_dom apparaît au numérateur du ratio : une hausse de r_dom augmente mécaniquement F0, reflétant le surcroît de rendement qu'il faut compenser par une devise domestique plus faible à terme.",
    en: "r_dom appears in the ratio's numerator: a rise in r_dom mechanically increases F0, reflecting the extra yield that must be offset by a weaker domestic currency forward.",
  },
  commonMistake: {
    fr: "Confondre l'effet du taux domestique et celui du taux étranger, qui jouent en sens opposé dans la formule.",
    en: "Confusing the effect of the domestic rate with that of the foreign rate, which act in opposite directions in the formula.",
  },
});

const whatIfArbitrageGapTemplate = mcqTemplate({
  id: "m01-cip-whatif-ecart-arbitrage",
  conceptId: "m01-parite-taux",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "S0 = 1,1000, r_dom = 4%, r_étr = 1%, T = 1 an, donc F0 théorique ≈ 1,1327. Le marché cote ce forward à 1,1450, nettement au-dessus du prix théorique. Quelle stratégie capte un profit sans risque ?",
    en: "S0 = 1.1000, r_dom = 4%, r_for = 1%, T = 1 year, so theoretical F0 ≈ 1.1327. The market quotes this forward at 1.1450, well above the theoretical price. Which strategy locks in a risk-free profit?",
  },
  choices: [
    { id: "sell-forward", label: { fr: "Emprunter en devise domestique, placer en devise étrangère au comptant, vendre le forward surévalué", en: "Borrow in the domestic currency, invest in the foreign currency spot, sell the overpriced forward" } },
    { id: "buy-forward", label: { fr: "Emprunter en devise étrangère, placer en devise domestique, acheter le forward", en: "Borrow in the foreign currency, invest in the domestic currency, buy the forward" } },
    { id: "none", label: { fr: "Aucune, un écart de cette taille est toujours dans la marge de bruit du marché", en: "None, a gap this size is always within normal market noise" } },
  ],
  correctId: "sell-forward",
  hint: { fr: "Le forward coté est plus cher que sa valeur théorique : il faut le vendre et répliquer la position inverse moins cher.", en: "The quoted forward is more expensive than its theoretical value: sell it and replicate the opposite position more cheaply." },
  explanation: {
    fr: "Le forward coté (1,1450) est surévalué par rapport à F0 (≈1,1327) : on le vend à ce prix élevé, et on réplique la position inverse à moindre coût via un emprunt domestique + placement en devise étrangère au comptant, dégageant un profit garanti à l'échéance.",
    en: "The quoted forward (1.1450) is overpriced relative to F0 (≈1.1327): sell it at that high price, and replicate the opposite position more cheaply via a domestic loan + spot investment in the foreign currency, locking in a guaranteed profit at maturity.",
  },
  commonMistake: {
    fr: "Inverser le sens de la stratégie : un forward surévalué se vend, il ne s'achète pas.",
    en: "Reversing the strategy's direction: an overpriced forward is sold, not bought.",
  },
});

const impliedDomesticRateNumericTemplate: QuestionTemplate = {
  id: "m01-cip-taux-implicite-calcul",
  conceptId: "m01-parite-taux",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomFloat(rng, 0.85, 1.35, 4);
    const rForPct = randomInt(rng, 1, 6);
    const rDomPct = randomInt(rng, rForPct + 1, rForPct + 6);
    const F0 = Math.round(S0 * ((1 + rDomPct / 100) / (1 + rForPct / 100)) * 10000) / 10000;
    const impliedRDomPct = Math.round((((F0 / S0) * (1 + rForPct / 100) - 1) * 100) * 100) / 100;

    return {
      prompt: {
        fr: `S0 = ${S0.toFixed(4)}, F0 coté = ${F0.toFixed(4)}, r_étr = ${rForPct}%, T = 1 an. Quel taux domestique r_dom est implicite dans ce forward, par la CIP ?`,
        en: `S0 = ${S0.toFixed(4)}, quoted F0 = ${F0.toFixed(4)}, r_for = ${rForPct}%, T = 1 year. What domestic rate r_dom is implied by this forward, per CIP?`,
      },
      numericUnit: { fr: "% par an", en: "% per year" },
      numericTolerance: "± 0.1",
      hint: { fr: "Inversez la CIP : (1+r_dom) = (F0/S0) × (1+r_étr).", en: "Invert CIP: (1+r_dom) = (F0/S0) × (1+r_for)." },
      numeric: { value: impliedRDomPct, tolerance: 0.1 },
      calculation: {
        fr: `(1+r_dom) = (${F0.toFixed(4)}/${S0.toFixed(4)}) × (1+${rForPct}/100) ⇒ r_dom ≈ ${impliedRDomPct.toFixed(2)}%.`,
        en: `(1+r_dom) = (${F0.toFixed(4)}/${S0.toFixed(4)}) × (1+${rForPct}/100) ⇒ r_dom ≈ ${impliedRDomPct.toFixed(2)}%.`,
      },
      explanation: {
        fr: "Inverser la CIP permet d'extraire le taux domestique implicite dans un couple (S0, F0) coté sur le marché — une façon d'estimer un taux d'intérêt à partir de prix de change, utile quand le taux direct n'est pas observable.",
        en: "Inverting CIP lets you extract the domestic rate implied by a market-quoted (S0, F0) pair — a way to estimate an interest rate from FX prices, useful when the direct rate isn't observable.",
      },
      commonMistake: {
        fr: "Oublier de soustraire 1 après avoir isolé (1+r_dom), ou inverser le rôle de F0 et S0 dans le ratio.",
        en: "Forgetting to subtract 1 after isolating (1+r_dom), or swapping F0 and S0's roles in the ratio.",
      },
    };
  },
};

const spotEqualsForwardErrorTemplate = trueFalseTemplate({
  id: "m01-cip-erreur-spot-egal-forward",
  conceptId: "m01-parite-taux",
  difficulty: "easy",
  statement: {
    fr: "Selon la CIP, le taux de change forward est toujours égal au taux de change spot, quels que soient les taux d'intérêt domestique et étranger.",
    en: "According to CIP, the forward exchange rate always equals the spot exchange rate, whatever the domestic and foreign interest rates are.",
  },
  correct: false,
  explanation: {
    fr: "Faux : F0 = S0 × (1+r_dom)/(1+r_étr) n'est égal à S0 que dans le cas particulier où r_dom = r_étr. Dès que les taux diffèrent, le forward s'écarte mécaniquement du spot pour empêcher l'arbitrage.",
    en: "False: F0 = S0 × (1+r_dom)/(1+r_for) equals S0 only in the special case where r_dom = r_for. As soon as the rates differ, the forward mechanically departs from spot to prevent arbitrage.",
  },
  commonMistake: {
    fr: "Oublier que l'écart entre taux domestique et étranger est précisément ce qui crée l'écart entre forward et spot.",
    en: "Forgetting that the gap between domestic and foreign rates is precisely what creates the gap between forward and spot.",
  },
});

const carryTradeOutcomeScenarioTemplate = mcqTemplate({
  id: "m01-cip-scenario-carry-trade-issue",
  conceptId: "m01-parite-taux",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un fonds emprunte en JPY à 0% et place en AUD à 4% sans se couvrir, pariant que l'UIP ne se vérifiera pas. Un an plus tard, l'AUD s'est en réalité APPRÉCIÉ de 3% contre le JPY. Le carry trade est-il gagnant ou perdant ?",
    en: "A fund borrows JPY at 0% and invests in AUD at 4% unhedged, betting UIP won't hold. A year later, the AUD has actually APPRECIATED 3% against the JPY. Is the carry trade a winner or a loser?",
  },
  choices: [
    { id: "win", label: { fr: "Gagnant : il capte le différentiel de taux ET un gain de change", en: "A winner: it captures the rate differential AND an FX gain" } },
    { id: "lose", label: { fr: "Perdant : l'appréciation de l'AUD annule le différentiel de taux", en: "A loser: the AUD's appreciation cancels out the rate differential" } },
    { id: "neutral", label: { fr: "Neutre : change et taux se compensent toujours exactement", en: "Flat: FX and rates always exactly offset" } },
  ],
  correctId: "win",
  hint: { fr: "Le carry trade perd de l'argent seulement si la devise à taux élevé SE DÉPRÉCIE, pas si elle s'apprécie.", en: "The carry trade loses money only if the high-rate currency DEPRECIATES, not if it appreciates." },
  explanation: {
    fr: "Le fonds gagne le différentiel de taux (4% − 0% = 4%) ET profite en plus de l'appréciation de l'AUD (+3%), pour un gain total voisin de 7% : c'est le scénario favorable où l'UIP échoue en faveur du parieur. Le risque du carry trade est l'inverse : une dépréciation de la devise à taux élevé qui effacerait, voire dépasserait, le gain de taux.",
    en: "The fund earns the rate differential (4% − 0% = 4%) AND additionally benefits from the AUD's appreciation (+3%), for a total gain near 7%: this is the favorable scenario where UIP fails in the bettor's favor. The carry trade's risk is the opposite: a depreciation of the high-rate currency that would erase, or even exceed, the rate gain.",
  },
  commonMistake: {
    fr: "Croire que le carry trade est automatiquement perdant dès que l'UIP est violée, sans regarder le SENS du mouvement de change réalisé.",
    en: "Believing the carry trade automatically loses whenever UIP is violated, without checking the DIRECTION of the realized FX move.",
  },
});

const cipBasisScenarioTemplate = mcqTemplate({
  id: "m01-cip-scenario-basis-stress",
  conceptId: "m01-parite-taux",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "En période de fort stress bancaire, des études documentent que la CIP peut s'écarter légèrement de zéro (un « basis » persiste), même si des arbitragistes voient l'écart. Quelle est l'explication la plus plausible ?",
    en: "During periods of severe banking stress, studies document that CIP can drift slightly from zero (a persistent \"basis\"), even though arbitrageurs see the gap. What is the most plausible explanation?",
  },
  choices: [
    { id: "balance-sheet", label: { fr: "Les banques font face à des contraintes de bilan/capital réglementaire qui limitent leur capacité à exploiter pleinement l'écart", en: "Banks face balance-sheet/regulatory capital constraints that limit their capacity to fully exploit the gap" } },
    { id: "no-arb", label: { fr: "L'arbitrage est en réalité toujours impossible sur le marché des changes", en: "Arbitrage is actually always impossible in the FX market" } },
    { id: "coincidence", label: { fr: "C'est un pur hasard statistique sans cause économique identifiable", en: "It's pure statistical coincidence with no identifiable economic cause" } },
  ],
  correctId: "balance-sheet",
  hint: { fr: "La CIP suppose un arbitrage sans coût ni contrainte — que se passe-t-il si cette hypothèse est mise à mal ?", en: "CIP assumes costless, unconstrained arbitrage — what happens if that assumption breaks down?" },
  explanation: {
    fr: "La CIP repose sur l'hypothèse que n'importe quel intervenant peut emprunter, placer et trader des forwards sans coût ni limite de bilan. En période de stress, les contraintes réglementaires (ratios de levier, capital) rendent cet arbitrage coûteux en fonds propres pour les banques, ce qui permet à un écart résiduel (le « cross-currency basis ») de persister malgré l'opportunité apparente.",
    en: "CIP rests on the assumption that any participant can borrow, invest, and trade forwards at no cost and with no balance-sheet limit. During stress, regulatory constraints (leverage ratios, capital) make this arbitrage costly in capital terms for banks, allowing a residual gap (the \"cross-currency basis\") to persist despite the apparent opportunity.",
  },
  commonMistake: {
    fr: "Conclure qu'un léger écart de CIP invalide totalement la théorie, plutôt que de reconnaître une friction réaliste (coût de capital) non capturée par le modèle simple sans coût de transaction.",
    en: "Concluding that a small CIP gap totally invalidates the theory, rather than recognizing a realistic friction (capital cost) not captured by the simple frictionless model.",
  },
});

export const templates: QuestionTemplate[] = [
  cipNumericTemplate,
  cipVsUipTemplate,
  carryTradeTemplate,
  vocabTemplate,
  comprehensionTemplate,
  premiumVsDiscountComparisonTemplate,
  whatIfDomesticRateRisesTemplate,
  whatIfArbitrageGapTemplate,
  impliedDomesticRateNumericTemplate,
  spotEqualsForwardErrorTemplate,
  carryTradeOutcomeScenarioTemplate,
  cipBasisScenarioTemplate,
];
