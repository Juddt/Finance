import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const netProfitTemplate: QuestionTemplate = {
  id: "m05-call-profit-net",
  conceptId: "m05-call-put",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 6, 15) * 10; // 60..150
    const premium = randomInt(rng, 2, 8);
    const sT = randomInt(rng, K - 30, K + 30);
    const grossPayoff = Math.max(sT - K, 0);
    const netProfit = grossPayoff - premium;

    return {
      isScenario: true,
      prompt: {
        fr: `Vous avez acheté un call de strike K = ${fmt(K, "fr")} € pour une prime de ${fmt(premium, "fr")} €. À l'échéance, le sous-jacent vaut S_T = ${fmt(sT, "fr")} €. Quel est votre profit net (avec son signe) ?`,
        en: `You bought a call with strike K = ${fmt(K, "en")} for a premium of ${fmt(premium, "en")}. At maturity, the underlying is worth S_T = ${fmt(sT, "en")}. What is your net profit (with its sign)?`,
      },
      numericUnit: { fr: "€", en: "$" },
      numericTolerance: "± 0,5",
      hint: {
        fr: "Profit net = max(S_T − K, 0) − prime.",
        en: "Net profit = max(S_T − K, 0) − premium.",
      },
      numeric: { value: netProfit, tolerance: 0.5 },
      calculation: {
        fr: `Payoff brut = max(${fmt(sT, "fr")} − ${fmt(K, "fr")}, 0) = ${fmt(grossPayoff, "fr")}. Profit net = ${fmt(grossPayoff, "fr")} − ${fmt(premium, "fr")} = ${fmt(netProfit, "fr")} €.`,
        en: `Gross payoff = max(${fmt(sT, "en")} − ${fmt(K, "en")}, 0) = ${fmt(grossPayoff, "en")}. Net profit = ${fmt(grossPayoff, "en")} − ${fmt(premium, "en")} = ${fmt(netProfit, "en")}.`,
      },
      explanation: {
        fr:
          netProfit < 0
            ? "Le profit net est négatif : soit le call n'a pas été exercé (S_T ≤ K), soit il l'a été mais le payoff ne couvrait pas la prime payée."
            : "Le profit net est positif : le payoff brut a dépassé la prime payée.",
        en:
          netProfit < 0
            ? "The net profit is negative: either the call wasn't exercised (S_T ≤ K), or it was but the payoff didn't cover the premium paid."
            : "The net profit is positive: the gross payoff exceeded the premium paid.",
      },
      commonMistake: {
        fr: "Oublier de soustraire la prime, ou exercer mentalement le call même quand S_T ≤ K (dans ce cas le payoff brut est nul, pas négatif).",
        en: "Forgetting to subtract the premium, or mentally exercising the call even when S_T ≤ K (in that case the gross payoff is zero, not negative).",
      },
    };
  },
};

const maxLossTemplate: QuestionTemplate = {
  id: "m05-call-perte-max",
  conceptId: "m05-call-put",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const premium = randomInt(rng, 2, 10);
    return {
      prompt: {
        fr: `Un investisseur achète un call en payant une prime de ${fmt(premium, "fr")} €. Il peut perdre plus que cette prime si le sous-jacent chute fortement.`,
        en: `An investor buys a call, paying a premium of ${fmt(premium, "en")}. They can lose more than that premium if the underlying falls sharply.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: {
        fr: "L'acheteur a un droit, pas une obligation : il n'est jamais forcé d'exercer un mauvais deal.",
        en: "The buyer has a right, not an obligation: they are never forced to exercise a bad deal.",
      },
      correctChoiceIds: ["false"],
      explanation: {
        fr: "Faux : l'acheteur d'une option n'exerce que si c'est avantageux. Sa perte est toujours plafonnée à la prime payée, quelle que soit l'ampleur de la baisse du sous-jacent.",
        en: "False: an option buyer only exercises when it's advantageous. Their loss is always capped at the premium paid, however far the underlying falls.",
      },
      commonMistake: {
        fr: "Confondre acheteur et vendeur : c'est le VENDEUR d'un call qui a un risque de perte illimité si le sous-jacent monte, pas l'acheteur.",
        en: "Confusing buyer and seller: it's the call SELLER who has unlimited downside risk if the underlying rises, not the buyer.",
      },
    };
  },
};

const breakEvenTemplate: QuestionTemplate = {
  id: "m05-call-seuil-rentabilite",
  conceptId: "m05-call-put",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 6, 15) * 10;
    const premium = randomInt(rng, 2, 8);
    const breakEven = K + premium;

    const choiceValues = [
      { id: "k_plus_p", value: breakEven },
      { id: "k_minus_p", value: K - premium },
      { id: "k_only", value: K },
    ];

    return {
      prompt: {
        fr: `Pour un call de strike K = ${fmt(K, "fr")} € et de prime ${fmt(premium, "fr")} €, à quel prix du sous-jacent à l'échéance l'acheteur atteint-il son seuil de rentabilité (profit net nul) ?`,
        en: `For a call with strike K = ${fmt(K, "en")} and premium ${fmt(premium, "en")}, at what underlying price at maturity does the buyer reach break-even (zero net profit)?`,
      },
      choices: buildChoices(
        choiceValues.map((c) => ({ id: c.id, label: { fr: `${fmt(c.value, "fr")} €`, en: `${fmt(c.value, "en")}` } }))
      ),
      hint: {
        fr: "Il faut que le payoff brut couvre exactement la prime payée.",
        en: "The gross payoff must exactly cover the premium paid.",
      },
      correctChoiceIds: ["k_plus_p"],
      explanation: {
        fr: `Le seuil de rentabilité est S_T = K + prime = ${fmt(K, "fr")} + ${fmt(premium, "fr")} = ${fmt(breakEven, "fr")} €. En dessous, le call est perdant au net ; au-dessus, il devient gagnant.`,
        en: `Break-even is S_T = K + premium = ${fmt(K, "en")} + ${fmt(premium, "en")} = ${fmt(breakEven, "en")}. Below it the call is a net loss; above it, a net gain.`,
      },
      commonMistake: {
        fr: "Croire que le seuil de rentabilité est simplement K : c'est le seuil d'exercice, pas de rentabilité — il faut encore couvrir la prime au-delà de K.",
        en: "Believing the break-even is simply K: that's the exercise threshold, not break-even — the premium still needs to be covered beyond K.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m05-call-put-vocab-perte-max",
  conceptId: "m05-call-put",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Pour l'acheteur d'une option (call ou put), la perte maximale possible est toujours limitée au montant de la ______ payée.",
      en: "For an option buyer (call or put), the maximum possible loss is always limited to the amount of the ______ paid.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["prime", "premium"],
    hint: {
      fr: "C'est le prix payé à la conclusion du contrat, non remboursable.",
      en: "It's the price paid at inception, non-refundable.",
    },
    explanation: {
      fr: "La prime est le montant maximal que l'acheteur peut perdre : au pire, il n'exerce simplement pas son droit.",
      en: "The premium is the maximum amount the buyer can lose: at worst, they simply don't exercise their right.",
    },
    commonMistake: {
      fr: "Confondre avec le strike, qui est le prix d'exercice, pas le montant risqué par l'acheteur.",
      en: "Confusing it with the strike, which is the exercise price, not the amount the buyer risks.",
    },
  }),
};

const chartReadingTemplate: QuestionTemplate = {
  id: "m05-call-lecture-graphique",
  conceptId: "m05-call-put",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 8, 14) * 10;
    const premium = randomInt(rng, 3, 9);
    const breakEven = K + premium;

    return {
      isScenario: true,
      chart: { type: "payoff_call", params: { strike: K, premium } },
      prompt: {
        fr: `Le graphique montre le profit net à l'échéance de l'achat d'un call (strike K = ${fmt(K, "fr")} €, prime = ${fmt(premium, "fr")} €). En lisant la courbe, à partir de quel prix du sous-jacent le profit net devient-il positif ?`,
        en: `The chart shows the net profit at maturity of buying a call (strike K = ${fmt(K, "en")}, premium = ${fmt(premium, "en")}). Reading the curve, from what underlying price does the net profit become positive?`,
      },
      numericUnit: { fr: "€", en: "$" },
      numericTolerance: "± 1",
      hint: {
        fr: "C'est le point où la courbe traverse l'axe horizontal (profit net = 0).",
        en: "It's the point where the curve crosses the horizontal axis (net profit = 0).",
      },
      numeric: { value: breakEven, tolerance: 1 },
      calculation: {
        fr: `La courbe croise l'axe des abscisses à S_T = K + prime = ${fmt(K, "fr")} + ${fmt(premium, "fr")} = ${fmt(breakEven, "fr")} €.`,
        en: `The curve crosses the x-axis at S_T = K + premium = ${fmt(K, "en")} + ${fmt(premium, "en")} = ${fmt(breakEven, "en")}.`,
      },
      explanation: {
        fr: "Sur le graphique, la partie plate en dessous de zéro (à gauche) correspond à la perte plafonnée à la prime ; la droite montante à droite du strike ne redevient positive qu'après avoir remonté toute la prime perdue.",
        en: "On the chart, the flat part below zero (on the left) is the loss capped at the premium; the rising line right of the strike only turns positive after climbing back the whole lost premium.",
      },
      commonMistake: {
        fr: "Lire le point où la courbe quitte la partie plate (S_T = K) au lieu du point où elle repasse au-dessus de zéro (S_T = K + prime).",
        en: "Reading the point where the curve leaves the flat part (S_T = K) instead of the point where it rises back above zero (S_T = K + premium).",
      },
    };
  },
};

const comprehensionTemplate = mcqTemplate({
  id: "m05-call-put-comprehension-utilite",
  conceptId: "m05-call-put",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi un investisseur qui anticipe une baisse d'une action peut-il préférer acheter un put plutôt que de vendre l'action à découvert ?",
    en: "Why might an investor expecting a stock to fall prefer buying a put rather than shorting the stock?",
  },
  choices: [
    { id: "limited-loss", label: { fr: "Parce que sa perte maximale est limitée à la prime payée, alors qu'une vente à découvert expose à une perte potentiellement illimitée si le prix monte au lieu de baisser", en: "Because their maximum loss is limited to the premium paid, while shorting exposes them to a potentially unlimited loss if the price rises instead of falling" } },
    { id: "same-risk", label: { fr: "Les deux stratégies ont exactement le même profil de risque", en: "Both strategies have exactly the same risk profile" } },
    { id: "put-always-cheaper", label: { fr: "Un put coûte toujours moins cher que les frais d'une vente à découvert", en: "A put always costs less than a short sale's fees" } },
  ],
  correctId: "limited-loss",
  hint: { fr: "Pensez à ce qui arrive à chaque position si l'anticipation baissière se révèle fausse et que le prix monte fortement.", en: "Think about what happens to each position if the bearish view turns out wrong and the price rises sharply." },
  explanation: {
    fr: "Un put acheté offre un droit, pas une obligation : si le prix monte au lieu de baisser, l'acheteur n'exerce simplement pas, plafonnant sa perte à la prime payée. Une vente à découvert (M01, vente à découvert), elle, expose à une perte théoriquement illimitée si le prix continue de monter, puisqu'il faudra racheter l'action à un prix de plus en plus élevé pour clôturer la position.",
    en: "A bought put offers a right, not an obligation: if the price rises instead of falling, the buyer simply doesn't exercise, capping their loss at the premium paid. A short sale (M01, short selling), by contrast, exposes them to a theoretically unlimited loss if the price keeps rising, since the stock must be bought back at an ever-higher price to close the position.",
  },
  commonMistake: {
    fr: "Croire que le put et la vente à découvert offrent une exposition baissière strictement équivalente en termes de risque, en oubliant le plafonnement de la perte propre à l'option achetée.",
    en: "Believing a put and a short sale offer strictly equivalent bearish exposure in terms of risk, forgetting the capped loss specific to the bought option.",
  },
});

const buyerDirectionComparisonTemplate = mcqTemplate({
  id: "m05-call-put-comparaison-acheteur-direction",
  conceptId: "m05-call-put",
  difficulty: "easy",
  prompt: {
    fr: "Un acheteur de call et un acheteur de put, sur le même sous-jacent et même strike : lequel profite d'une HAUSSE du sous-jacent, et lequel profite d'une BAISSE ?",
    en: "A call buyer and a put buyer, on the same underlying and strike: which one profits from a RISE in the underlying, and which from a FALL?",
  },
  choices: [
    { id: "call-up-put-down", label: { fr: "L'acheteur du call profite d'une hausse ; l'acheteur du put profite d'une baisse", en: "The call buyer profits from a rise; the put buyer profits from a fall" } },
    { id: "both-up", label: { fr: "Les deux profitent d'une hausse", en: "Both profit from a rise" } },
    { id: "call-down-put-up", label: { fr: "L'acheteur du call profite d'une baisse ; l'acheteur du put profite d'une hausse", en: "The call buyer profits from a fall; the put buyer profits from a rise" } },
  ],
  correctId: "call-up-put-down",
  hint: { fr: "Le call donne le droit d'ACHETER (utile si le prix monte) ; le put donne le droit de VENDRE (utile si le prix baisse).", en: "The call gives the right to BUY (useful if the price rises); the put gives the right to SELL (useful if the price falls)." },
  explanation: {
    fr: "Le call donne le droit d'acheter à K : il devient profitable si S_T dépasse K (le droit d'acheter moins cher que le marché a de la valeur). Le put donne le droit de vendre à K : il devient profitable si S_T tombe sous K (le droit de vendre plus cher que le marché a de la valeur). Ce sont donc des paris de sens opposé.",
    en: "The call gives the right to buy at K: it becomes profitable if S_T exceeds K (the right to buy cheaper than the market has value). The put gives the right to sell at K: it becomes profitable if S_T falls below K (the right to sell dearer than the market has value). These are therefore opposite-direction bets.",
  },
  commonMistake: {
    fr: "Inverser call et put dans leur sens directionnel, une confusion très fréquente en tout début d'apprentissage.",
    en: "Swapping the call and put's directional sense, a very common early-learning confusion.",
  },
});

const whatIfHigherStrikeTemplate = mcqTemplate({
  id: "m05-call-put-whatif-strike-plus-eleve",
  conceptId: "m05-call-put",
  difficulty: "easy",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même S_T), si le strike K d'un call est plus élevé, que devient son payoff brut max(S_T−K,0) ?",
    en: "All else equal (same S_T), if a call's strike K is higher, what happens to its gross payoff max(S_T−K,0)?",
  },
  choices: [
    { id: "lower-or-equal", label: { fr: "Il diminue ou reste nul : un strike plus élevé est un obstacle plus difficile à franchir pour le call", en: "It decreases or stays zero: a higher strike is a harder hurdle for the call to clear" } },
    { id: "higher", label: { fr: "Il augmente avec le strike", en: "It increases with the strike" } },
    { id: "unaffected", label: { fr: "Le payoff ne dépend jamais du strike", en: "The payoff never depends on the strike" } },
  ],
  correctId: "lower-or-equal",
  hint: { fr: "Payoff = max(S_T−K,0) : K apparaît avec un signe négatif.", en: "Payoff = max(S_T−K,0): K appears with a negative sign." },
  explanation: {
    fr: "Le payoff d'un call diminue quand K augmente (à S_T fixé), puisque K est soustrait de S_T : un strike plus élevé signifie que le sous-jacent doit monter davantage pour que le call ait de la valeur, réduisant son payoff pour un même S_T final.",
    en: "A call's payoff decreases as K rises (with S_T fixed), since K is subtracted from S_T: a higher strike means the underlying must rise further for the call to have value, reducing its payoff for the same final S_T.",
  },
  commonMistake: {
    fr: "Croire qu'un strike plus élevé rend systématiquement un call plus avantageux, en confondant le niveau du strike avec le niveau du sous-jacent.",
    en: "Believing a higher strike systematically makes a call more advantageous, confusing the strike's level with the underlying's.",
  },
});

const whatIfSellerPerspectiveTemplate = mcqTemplate({
  id: "m05-call-put-whatif-perspective-vendeur",
  conceptId: "m05-call-put",
  difficulty: "medium",
  prompt: {
    fr: "Contrairement à l'acheteur d'un call (perte plafonnée à la prime), quel est le profil de risque du VENDEUR d'un call, si le sous-jacent monte fortement au-delà du strike ?",
    en: "Unlike a call buyer (loss capped at the premium), what is the risk profile of a call's SELLER, if the underlying rises sharply above the strike?",
  },
  choices: [
    { id: "unlimited-loss", label: { fr: "Une perte potentiellement illimitée : le vendeur doit livrer le sous-jacent à K, quel que soit son prix de marché, aussi élevé soit-il", en: "A potentially unlimited loss: the seller must deliver the underlying at K, whatever its market price, however high" } },
    { id: "capped-loss", label: { fr: "Une perte plafonnée à la prime encaissée, symétrique à l'acheteur", en: "A loss capped at the premium collected, symmetric to the buyer" } },
    { id: "no-loss", label: { fr: "Aucune perte possible, le vendeur est toujours protégé", en: "No possible loss, the seller is always protected" } },
  ],
  correctId: "unlimited-loss",
  hint: { fr: "Le vendeur d'un call a une obligation, pas un droit : il ne peut pas simplement refuser d'exécuter le contrat.", en: "A call's seller has an obligation, not a right: they cannot simply refuse to execute the contract." },
  explanation: {
    fr: "Le vendeur d'un call a l'obligation de livrer le sous-jacent au strike K si l'acheteur exerce, quel que soit le prix de marché atteint : sa perte, égale à (S_T − K) moins la prime encaissée, n'est théoriquement pas plafonnée puisque S_T peut monter sans limite claire. C'est l'exact miroir de la perte plafonnée de l'acheteur (M05-1) : l'acheteur et le vendeur d'une même option n'ont jamais le même profil de risque.",
    en: "A call's seller has the obligation to deliver the underlying at strike K if the buyer exercises, whatever market price is reached: their loss, equal to (S_T − K) minus the premium collected, is theoretically uncapped since S_T can rise with no clear limit. This is the exact mirror of the buyer's capped loss (M05-1): the buyer and seller of the same option never share the same risk profile.",
  },
  commonMistake: {
    fr: "Croire que vendeur et acheteur d'une même option partagent un profil de risque symétrique et tout aussi plafonné, alors que seul l'acheteur bénéficie de cette protection.",
    en: "Believing a same option's seller and buyer share a symmetric, equally capped risk profile, when only the buyer benefits from that protection.",
  },
});

const putNetProfitNumericTemplate: QuestionTemplate = {
  id: "m05-call-put-profit-net-put",
  conceptId: "m05-call-put",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 6, 15) * 10;
    const premium = randomInt(rng, 2, 8);
    const sT = randomInt(rng, K - 30, K + 30);
    const grossPayoff = Math.max(K - sT, 0);
    const netProfit = grossPayoff - premium;

    return {
      isScenario: true,
      prompt: {
        fr: `Vous avez acheté un put de strike K = ${fmt(K, "fr")} pour une prime de ${fmt(premium, "fr")}. À l'échéance, le sous-jacent vaut S_T = ${fmt(sT, "fr")}. Quel est votre profit net (avec son signe) ?`,
        en: `You bought a put with strike K = ${fmt(K, "en")} for a premium of ${fmt(premium, "en")}. At maturity, the underlying is worth S_T = ${fmt(sT, "en")}. What is your net profit (with its sign)?`,
      },
      numericUnit: { fr: "même devise", en: "same currency" },
      numericTolerance: "± 0.5",
      hint: { fr: "Profit net = max(K − S_T, 0) − prime.", en: "Net profit = max(K − S_T, 0) − premium." },
      numeric: { value: netProfit, tolerance: 0.5 },
      calculation: {
        fr: `Payoff brut = max(${fmt(K, "fr")} − ${fmt(sT, "fr")}, 0) = ${fmt(grossPayoff, "fr")}. Profit net = ${fmt(grossPayoff, "fr")} − ${fmt(premium, "fr")} = ${fmt(netProfit, "fr")}.`,
        en: `Gross payoff = max(${fmt(K, "en")} − ${fmt(sT, "en")}, 0) = ${fmt(grossPayoff, "en")}. Net profit = ${fmt(grossPayoff, "en")} − ${fmt(premium, "en")} = ${fmt(netProfit, "en")}.`,
      },
      explanation: {
        fr: "La formule du put est le miroir de celle du call (max(K−S_T,0) au lieu de max(S_T−K,0)) : c'est l'erreur la plus fréquente sur ce calcul, inverser l'ordre de la soustraction.",
        en: "The put's formula mirrors the call's (max(K−S_T,0) instead of max(S_T−K,0)): flipping the subtraction's order is the most frequent mistake on this calculation.",
      },
      commonMistake: {
        fr: "Utiliser max(S_T−K,0) comme pour un call, au lieu de max(K−S_T,0) pour un put.",
        en: "Using max(S_T−K,0) as for a call, instead of max(K−S_T,0) for a put.",
      },
    };
  },
};

const putDirectionErrorTemplate = trueFalseTemplate({
  id: "m05-call-put-erreur-direction-put",
  conceptId: "m05-call-put",
  difficulty: "easy",
  statement: {
    fr: "L'acheteur d'un put profite d'une hausse du prix du sous-jacent, exactement comme l'acheteur d'un call.",
    en: "A put buyer profits from a rise in the underlying's price, exactly like a call buyer.",
  },
  correct: false,
  explanation: {
    fr: "Faux : l'acheteur d'un put profite au contraire d'une BAISSE du sous-jacent sous le strike K, puisqu'il détient le droit de VENDRE à K, un droit qui n'a de valeur que si le prix de marché tombe sous ce niveau. C'est l'exact inverse du call.",
    en: "False: a put buyer, on the contrary, profits from a FALL in the underlying below strike K, since they hold the right to SELL at K, a right only valuable if the market price falls below that level. This is the exact opposite of a call.",
  },
  commonMistake: {
    fr: "Appliquer machinalement la logique directionnelle du call (profite d'une hausse) au put, sans se souvenir que leurs sens sont opposés.",
    en: "Mechanically applying the call's directional logic (profits from a rise) to the put, forgetting their directions are opposite.",
  },
});

const bullishChoiceScenarioTemplate = mcqTemplate({
  id: "m05-call-put-scenario-choix-haussier",
  conceptId: "m05-call-put",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un investisseur dispose de 1 000 € et est fortement convaincu qu'une action va monter significativement dans les prochains mois. Entre acheter l'action directement, ou acheter des calls avec le même budget, quelle différence essentielle doit-il garder à l'esprit ?",
    en: "An investor has €1,000 and is strongly convinced a stock will rise significantly over the coming months. Between buying the stock directly, or buying calls with the same budget, what essential difference should they keep in mind?",
  },
  choices: [
    { id: "leverage-vs-total-loss", label: { fr: "Les calls offrent un effet de levier (plus d'exposition pour le même budget) mais risquent une perte totale de la mise si le pari ne se réalise pas à temps", en: "Calls offer leverage (more exposure for the same budget) but risk a total loss of the stake if the bet doesn't play out in time" } },
    { id: "identical", label: { fr: "Les deux approches sont financièrement identiques en tout point", en: "Both approaches are financially identical in every respect" } },
    { id: "stock-always-better", label: { fr: "Acheter l'action directement est toujours strictement meilleur", en: "Buying the stock directly is always strictly better" } },
  ],
  correctId: "leverage-vs-total-loss",
  hint: { fr: "Un call coûte moins cher que l'action elle-même : que peut-on faire du reste du budget, et quel est le risque si l'échéance approche sans que le prix ait bougé ?", en: "A call costs less than the stock itself: what can be done with the rest of the budget, and what's the risk if expiry nears with no price move?" },
  explanation: {
    fr: "Avec le même budget, les calls permettent de contrôler une exposition économique plus large que l'achat direct de l'action (effet de levier), amplifiant les gains en pourcentage si la hausse se réalise. Mais contrairement à l'action (détenue indéfiniment, sans échéance), les calls ont une durée de vie limitée : si la hausse attendue ne se produit pas avant l'échéance, l'investisseur peut perdre l'intégralité de sa mise, un risque que l'actionnaire direct n'a pas.",
    en: "With the same budget, calls allow controlling a larger economic exposure than directly buying the stock (leverage), amplifying percentage gains if the rise happens. But unlike the stock (held indefinitely, with no expiry), calls have a limited lifespan: if the expected rise doesn't happen before expiry, the investor can lose their entire stake, a risk the direct shareholder doesn't have.",
  },
  commonMistake: {
    fr: "Ne considérer que l'effet de levier positif des calls sans tenir compte de leur échéance limitée et du risque de perte totale si le timing du mouvement anticipé est erroné.",
    en: "Only considering calls' positive leverage effect without accounting for their limited lifespan and the total-loss risk if the anticipated move's timing is wrong.",
  },
});

export const templates: QuestionTemplate[] = [
  netProfitTemplate,
  maxLossTemplate,
  breakEvenTemplate,
  vocabTemplate,
  chartReadingTemplate,
  comprehensionTemplate,
  buyerDirectionComparisonTemplate,
  whatIfHigherStrikeTemplate,
  whatIfSellerPerspectiveTemplate,
  putNetProfitNumericTemplate,
  putDirectionErrorTemplate,
  bullishChoiceScenarioTemplate,
];
