import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const impliedPutTemplate: QuestionTemplate = {
  id: "m05-parite-put-implicite",
  conceptId: "m05-parite-call-put",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 50, 200);
    const K = randomInt(rng, 50, 200);
    const rPct = randomInt(rng, 1, 6);
    const T = randomInt(rng, 1, 2);
    const C = randomInt(rng, 3, 25);
    const r = rPct / 100;
    const P = Math.round((C - S0 + K / Math.pow(1 + r, T)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = ${S0}, K = ${K}, r = ${rPct}%, T = ${T} an(s), call coté C = ${C}. Par la parité call-put, quel devrait être le prix du put de même strike et échéance ?`,
        en: `S0 = ${S0}, K = ${K}, r = ${rPct}%, T = ${T} year(s), quoted call C = ${C}. By put-call parity, what should the price of the put with the same strike and maturity be?`,
      },
      numericUnit: { fr: "même devise", en: "same currency" },
      numericTolerance: "± 0.5",
      hint: { fr: "P = C − S0 + K×(1+r)^(−T).", en: "P = C − S0 + K×(1+r)^(−T)." },
      numeric: { value: P, tolerance: 0.5 },
      calculation: {
        fr: `P = ${C} − ${S0} + ${K}/(1+${r})^${T} = ${C} − ${S0} + ${fmt(K / Math.pow(1 + r, T), "fr")} ≈ ${fmt(P, "fr")}.`,
        en: `P = ${C} − ${S0} + ${K}/(1+${r})^${T} = ${C} − ${S0} + ${fmt(K / Math.pow(1 + r, T), "en")} ≈ ${fmt(P, "en")}.`,
      },
      explanation: {
        fr: "Cette relation découle d'un argument de réplication : call + obligation ≡ put + sous-jacent, quelle que soit l'évolution future du prix.",
        en: "This relationship comes from a replication argument: call + bond ≡ put + underlying, whatever the price's future path.",
      },
      commonMistake: {
        fr: "Oublier d'actualiser K, ou inverser un signe dans la formule réarrangée.",
        en: "Forgetting to discount K, or flipping a sign in the rearranged formula.",
      },
    };
  },
};

const arbitrageDirectionTemplate: QuestionTemplate = {
  id: "m05-parite-arbitrage",
  conceptId: "m05-parite-call-put",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 80, 120);
    const K = 100;
    const rPct = 3;
    const r = rPct / 100;
    const T = 1;
    const fairDiff = S0 - K / Math.pow(1 + r, T);
    const marketAboveFair = pick(rng, [true, false] as const);
    const C = 8;
    const P = marketAboveFair ? Math.round((C - fairDiff - 2) * 100) / 100 : Math.round((C - fairDiff + 2) * 100) / 100;
    const observedDiff = C - P;
    const correctId = observedDiff > fairDiff ? "sell-call-buy-put" : "buy-call-sell-put";

    return {
      isScenario: true,
      prompt: {
        fr: `S0 = ${S0}, K = ${K}, r = ${rPct}%, T = 1 an. Le call cote C = ${C}, le put cote P = ${fmt(P, "fr")}. C − P (${fmt(observedDiff, "fr")}) est-il supérieur ou inférieur à S0 − K(1+r)^(−T) (${fmt(fairDiff, "fr")}) ? Quelle stratégie d'arbitrage en découle ?`,
        en: `S0 = ${S0}, K = ${K}, r = ${rPct}%, T = 1 year. The call trades at C = ${C}, the put at P = ${fmt(P, "en")}. Is C − P (${fmt(observedDiff, "en")}) above or below S0 − K(1+r)^(−T) (${fmt(fairDiff, "en")})? What arbitrage strategy follows?`,
      },
      choices: buildChoices([
        { id: "sell-call-buy-put", label: { fr: "Vendre le call, acheter le put et l'action (synthétique inverse)", en: "Sell the call, buy the put and the underlying (reverse synthetic)" } },
        { id: "buy-call-sell-put", label: { fr: "Acheter le call, vendre le put et l'action à découvert", en: "Buy the call, sell the put and short the underlying" } },
      ]),
      hint: {
        fr: "Si C−P est trop élevé par rapport à la relation théorique, le call est relativement cher : il faut le vendre.",
        en: "If C−P is too high relative to the theoretical relationship, the call is relatively expensive: sell it.",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: `C − P = ${fmt(observedDiff, "fr")} est ${observedDiff > fairDiff ? "supérieur" : "inférieur"} à la valeur théorique ${fmt(fairDiff, "fr")} : le call est relativement ${observedDiff > fairDiff ? "surévalué, on le vend" : "sous-évalué, on l'achète"} et on prend la position inverse sur le put et l'action pour verrouiller le profit.`,
        en: `C − P = ${fmt(observedDiff, "en")} is ${observedDiff > fairDiff ? "above" : "below"} the theoretical value ${fmt(fairDiff, "en")}: the call is relatively ${observedDiff > fairDiff ? "overpriced, sell it" : "underpriced, buy it"} and take the opposite position on the put and the underlying to lock in the profit.`,
      },
      commonMistake: {
        fr: "Inverser le sens de la stratégie d'arbitrage par rapport à l'écart observé.",
        en: "Reversing the arbitrage strategy's direction relative to the observed gap.",
      },
    };
  },
};

const europeanOnlyTemplate: QuestionTemplate = {
  id: "m05-parite-europeenne-seulement",
  conceptId: "m05-parite-call-put",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La relation stricte de parité call-put C − P = S0 − K(1+r)^(−T) s'applique aussi bien aux options américaines qu'européennes.",
      en: "The strict put-call parity relationship C − P = S0 − K(1+r)^(−T) applies equally to American and European options.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : la possibilité d'exercice anticipé d'une option américaine casse l'argument de réplication utilisé pour démontrer la parité, qui ne s'applique donc strictement qu'aux options européennes.",
      en: "False: the possibility of early exercise on an American option breaks the replication argument used to prove parity, so it strictly applies only to European options.",
    },
    commonMistake: {
      fr: "Appliquer la parité sans vérifier le style d'exercice des options concernées.",
      en: "Applying parity without checking the exercise style of the options involved.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m05-parite-vocab",
  conceptId: "m05-parite-call-put",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La démonstration de la parité call-put repose sur la construction de deux portefeuilles qui produisent le même résultat final : on parle d'argument de ______.",
      en: "The proof of put-call parity relies on building two portfolios that produce the same final outcome: this is called a ______ argument.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["replication", "réplication"],
    hint: { fr: "Les deux portefeuilles \"répliquent\" le même payoff.", en: "The two portfolios \"replicate\" the same payoff." },
    explanation: {
      fr: "Un argument de réplication montre que deux combinaisons d'instruments produisant le même payoff doivent avoir le même prix, sous peine d'arbitrage.",
      en: "A replication argument shows that two combinations of instruments producing the same payoff must have the same price, or an arbitrage exists.",
    },
    commonMistake: {
      fr: "Confondre cet argument avec une simple observation empirique de corrélation de prix.",
      en: "Confusing this argument with a mere empirical observation of price correlation.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m05-parite-comprehension-utilite",
  conceptId: "m05-parite-call-put",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi la relation C − P = S0 − K(1+r)^(−T) se vérifie-t-elle presque toujours sur le marché, indépendamment de toute anticipation sur la direction future du sous-jacent ?",
    en: "Why does the relationship C − P = S0 − K(1+r)^(−T) hold almost always in the market, independent of any forecast about the underlying's future direction?",
  },
  choices: [
    { id: "replication", label: { fr: "Parce que deux portefeuilles construits différemment (call+obligation vs put+action) produisent exactement le même payoff à l'échéance, quel que soit S_T", en: "Because two differently constructed portfolios (call+bond vs put+stock) produce exactly the same payoff at expiry, whatever S_T is" } },
    { id: "market-consensus", label: { fr: "Parce que tous les investisseurs anticipent statistiquement la même direction de marché", en: "Because all investors statistically forecast the same market direction" } },
    { id: "regulatory", label: { fr: "C'est une règle imposée administrativement par les régulateurs de marché", en: "It's a rule administratively imposed by market regulators" } },
  ],
  correctId: "replication",
  hint: { fr: "Vérifiez le payoff des deux côtés à l'échéance pour S_T > K et pour S_T < K : que constatez-vous ?", en: "Check both sides' payoff at expiry for S_T > K and for S_T < K: what do you notice?" },
  explanation: {
    fr: "Que S_T finisse au-dessus ou en dessous de K, le portefeuille « call + obligation zéro-coupon de nominal K » et le portefeuille « put + action » valent toujours exactement la même chose à l'échéance : deux portefeuilles au même payoff garanti doivent avoir le même prix aujourd'hui, sous peine d'arbitrage sans risque — c'est ce résultat de réplication, pas une anticipation de marché, qui impose la relation.",
    en: "Whether S_T ends above or below K, the \"call + zero-coupon bond of face value K\" portfolio and the \"put + stock\" portfolio are always worth exactly the same at expiry: two portfolios with the same guaranteed payoff must have the same price today, or a risk-free arbitrage exists — it's this replication result, not a market forecast, that imposes the relationship.",
  },
  commonMistake: {
    fr: "Croire que la parité call-put reflète un consensus de marché sur la direction future du sous-jacent, plutôt qu'un résultat mécanique de non-arbitrage.",
    en: "Believing put-call parity reflects a market consensus on the underlying's future direction, rather than a mechanical no-arbitrage result.",
  },
});

const dividendComparisonTemplate = mcqTemplate({
  id: "m05-parite-comparaison-avec-sans-dividende",
  conceptId: "m05-parite-call-put",
  difficulty: "hard",
  prompt: {
    fr: "Comparez la parité call-put pour une action SANS dividende, et pour une action qui verse un dividende connu avant l'échéance. Comment la formule doit-elle être ajustée dans le second cas ?",
    en: "Compare put-call parity for a stock WITHOUT dividends, and for a stock that pays a known dividend before expiry. How must the formula be adjusted in the second case?",
  },
  choices: [
    { id: "subtract-pv-div", label: { fr: "Il faut soustraire la valeur actuelle du dividende de S0 : C − P = (S0 − VA(dividende)) − K(1+r)^(−T)", en: "The dividend's present value must be subtracted from S0: C − P = (S0 − PV(dividend)) − K(1+r)^(−T)" } },
    { id: "no-change", label: { fr: "Aucun ajustement n'est nécessaire, la formule reste identique", en: "No adjustment is needed, the formula stays identical" } },
    { id: "add-dividend", label: { fr: "Il faut ajouter le montant du dividende à K", en: "The dividend amount must be added to K" } },
    { id: "ignore-dividend", label: { fr: "Un dividende connu à l'avance n'a jamais d'impact sur le prix des options", en: "A dividend known in advance never impacts option prices" } },
  ],
  correctId: "subtract-pv-div",
  hint: { fr: "Le détenteur de l'action reçoit le dividende, mais pas le détenteur du call (avant exercice) : ce revenu doit être retiré de la valeur \"portée\" par l'action dans la réplication.", en: "The stockholder receives the dividend, but not the call holder (before exercise): this income must be removed from the value the stock \"carries\" in the replication." },
  explanation: {
    fr: "Le détenteur de l'action bénéficie du dividende versé avant l'échéance, un avantage que le détenteur du call n'a pas (il ne détient pas encore l'action) : pour que la réplication reste valide, on retire la valeur actuelle de ce dividende de S0 dans la formule, exactement comme le prix forward d'un actif avec revenu est ajusté par rapport au cas sans revenu (M02-6).",
    en: "The stockholder benefits from the dividend paid before expiry, a benefit the call holder doesn't have (they don't yet hold the stock): for the replication to remain valid, the dividend's present value is removed from S0 in the formula, exactly as an income-paying asset's forward price is adjusted relative to the no-income case (M02-6).",
  },
  commonMistake: {
    fr: "Appliquer la formule de parité sans dividende à une action qui en verse un, ce qui fausse systématiquement le put implicite calculé.",
    en: "Applying the no-dividend parity formula to a dividend-paying stock, which systematically distorts the computed implied put.",
  },
});

const whatIfDividendPaidTemplate = mcqTemplate({
  id: "m05-parite-whatif-dividende-verse",
  conceptId: "m05-parite-call-put",
  difficulty: "hard",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même S0, K, r, T), si l'action sous-jacente verse un dividende plus important avant l'échéance, que devient l'écart C − P par rapport au cas sans dividende ?",
    en: "All else equal (same S0, K, r, T), if the underlying stock pays a larger dividend before expiry, what happens to the gap C − P versus the no-dividend case?",
  },
  choices: [
    { id: "decreases", label: { fr: "Il diminue : le dividende réduit la valeur \"effective\" de l'action dans la relation, favorisant relativement le put", en: "It decreases: the dividend reduces the stock's \"effective\" value in the relationship, relatively favoring the put" } },
    { id: "increases", label: { fr: "Il augmente avec le dividende", en: "It increases with the dividend" } },
    { id: "unaffected", label: { fr: "Le dividende n'affecte jamais l'écart C − P", en: "The dividend never affects the C − P gap" } },
  ],
  correctId: "decreases",
  hint: { fr: "C − P = (S0 − VA(dividende)) − K(1+r)^(−T) : un dividende plus élevé réduit le premier terme.", en: "C − P = (S0 − PV(dividend)) − K(1+r)^(−T): a higher dividend reduces the first term." },
  explanation: {
    fr: "Un dividende plus élevé réduit la valeur actuelle de l'action \"effectivement portée\" dans la relation de parité (S0 − VA(dividende)), ce qui réduit l'écart C − P : intuitivement, un dividende plus généreux rend la détention de l'action (et donc du call, qui anticipe cette détention) relativement moins attractive avant versement, favorisant le put par rapport au call.",
    en: "A higher dividend reduces the stock's \"effectively carried\" present value in the parity relationship (S0 − PV(dividend)), which reduces the C − P gap: intuitively, a more generous dividend makes holding the stock (and so the call, which anticipates that holding) relatively less attractive before it's paid, favoring the put relative to the call.",
  },
  commonMistake: {
    fr: "Croire qu'un dividende plus élevé favorise le call (puisqu'un dividende plus élevé est \"positif\" pour l'action), en oubliant l'effet spécifique de la parité call-put.",
    en: "Believing a higher dividend favors the call (since a higher dividend is \"positive\" for the stock), forgetting the specific effect on put-call parity.",
  },
});

const whatIfRateIncreasesTemplate = mcqTemplate({
  id: "m05-parite-whatif-hausse-taux",
  conceptId: "m05-parite-call-put",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même S0, K, T), si le taux sans risque r augmente, que devient l'écart C − P ?",
    en: "All else equal (same S0, K, T), if the risk-free rate r rises, what happens to the gap C − P?",
  },
  choices: [
    { id: "increases", label: { fr: "Il augmente : le call devient relativement plus cher que le put", en: "It increases: the call becomes relatively more expensive than the put" } },
    { id: "decreases", label: { fr: "Il diminue", en: "It decreases" } },
    { id: "unaffected", label: { fr: "Le taux sans risque n'affecte jamais l'écart C − P", en: "The risk-free rate never affects the C − P gap" } },
  ],
  correctId: "increases",
  hint: { fr: "C − P = S0 − K(1+r)^(−T) : un r plus élevé réduit le facteur d'actualisation K(1+r)^(−T), donc augmente ce qui est soustrait à S0... vérifiez le signe.", en: "C − P = S0 − K(1+r)^(−T): a higher r lowers the discount factor K(1+r)^(−T), so it lowers what's subtracted from S0... check the sign." },
  explanation: {
    fr: "Un taux plus élevé réduit le facteur d'actualisation (1+r)^(−T), donc réduit K(1+r)^(−T) : comme ce terme est SOUSTRAIT de S0 dans la formule, le réduire AUGMENTE C − P. Intuitivement, un taux plus élevé rend le paiement futur de K plus \"léger\" en valeur actuelle, ce qui favorise le call (l'acheteur du call profite de différer le paiement de K) par rapport au put.",
    en: "A higher rate reduces the discount factor (1+r)^(−T), hence reduces K(1+r)^(−T): since this term is SUBTRACTED from S0 in the formula, reducing it INCREASES C − P. Intuitively, a higher rate makes the future payment of K \"lighter\" in present value, which favors the call (the call buyer benefits from deferring K's payment) relative to the put.",
  },
  commonMistake: {
    fr: "Se tromper de sens sur l'effet du taux, en oubliant que K(1+r)^(−T) est soustrait de S0 dans la formule, pas ajouté.",
    en: "Getting the rate's effect direction wrong, forgetting K(1+r)^(−T) is subtracted from S0 in the formula, not added.",
  },
});

const impliedRateNumericTemplate: QuestionTemplate = {
  id: "m05-parite-taux-implicite-calcul",
  conceptId: "m05-parite-call-put",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 80, 150);
    const K = randomInt(rng, 80, 150);
    const rPct = randomInt(rng, 1, 6);
    const r = rPct / 100;
    const T = 1;
    const C = randomInt(rng, 5, 25);
    const P = Math.round((C - S0 + K / Math.pow(1 + r, T)) * 100) / 100;
    const impliedRPct = Math.round((K / (S0 - C + P) - 1) * 10000) / 100;

    return {
      prompt: {
        fr: `S0 = ${S0}, K = ${K}, T = 1 an, call coté C = ${C}, put coté P = ${P.toFixed(2)}. Quel taux sans risque r est implicite dans cette cotation, par la parité call-put, en % ?`,
        en: `S0 = ${S0}, K = ${K}, T = 1 year, quoted call C = ${C}, quoted put P = ${P.toFixed(2)}. What risk-free rate r is implied by this quote, by put-call parity, in %?`,
      },
      numericUnit: { fr: "% par an", en: "% per year" },
      numericTolerance: "± 0.2",
      hint: { fr: "Inversez C − P = S0 − K(1+r)^(−T) : r = K/(S0−C+P) − 1.", en: "Invert C − P = S0 − K(1+r)^(−T): r = K/(S0−C+P) − 1." },
      numeric: { value: impliedRPct, tolerance: 0.2 },
      calculation: {
        fr: `K(1+r)^(−T) = S0 − C + P = ${S0} − ${C} + ${P.toFixed(2)}. r = ${K}/(${(S0 - C + P).toFixed(2)}) − 1 ≈ ${impliedRPct.toFixed(2)}%.`,
        en: `K(1+r)^(−T) = S0 − C + P = ${S0} − ${C} + ${P.toFixed(2)}. r = ${K}/(${(S0 - C + P).toFixed(2)}) − 1 ≈ ${impliedRPct.toFixed(2)}%.`,
      },
      explanation: {
        fr: "Extraire le taux sans risque implicite d'une cotation d'options (call, put, S0, K) permet de vérifier la cohérence de ces prix avec les conditions de financement du marché, ou d'estimer un taux non directement observable.",
        en: "Extracting the risk-free rate implied by an option quote (call, put, S0, K) lets you check the prices' consistency with market financing conditions, or estimate a rate not directly observable.",
      },
      commonMistake: {
        fr: "Oublier de réarranger correctement la formule avant d'isoler r, ou inverser un signe dans l'expression K(1+r)^(−T) = S0 − C + P.",
        en: "Forgetting to correctly rearrange the formula before isolating r, or flipping a sign in the K(1+r)^(−T) = S0 − C + P expression.",
      },
    };
  },
};

const atmMeansEqualErrorTemplate = trueFalseTemplate({
  id: "m05-parite-erreur-atm-egalite",
  conceptId: "m05-parite-call-put",
  difficulty: "medium",
  statement: {
    fr: "Si le strike K est exactement égal au prix spot S0 (option ATM), la parité call-put implique nécessairement que le call et le put ont exactement la même prime.",
    en: "If the strike K exactly equals the spot price S0 (an ATM option), put-call parity necessarily implies the call and the put have exactly the same premium.",
  },
  correct: false,
  explanation: {
    fr: "Faux : même avec K = S0, la relation C − P = S0 − K(1+r)^(−T) donne C − P = K − K(1+r)^(−T) = K×[1−(1+r)^(−T)], qui n'est nul que si r = 0. Dès que le taux sans risque est positif, C et P diffèrent même pour une option exactement à la monnaie, à cause de l'actualisation de K.",
    en: "False: even with K = S0, the relationship C − P = S0 − K(1+r)^(−T) gives C − P = K − K(1+r)^(−T) = K×[1−(1+r)^(−T)], which is zero only if r = 0. As soon as the risk-free rate is positive, C and P differ even for an exactly at-the-money option, due to K's discounting.",
  },
  commonMistake: {
    fr: "Confondre \"à la monnaie en spot\" (S0 = K) avec \"call et put de même prix\", en oubliant l'effet de l'actualisation du strike qui casse cette égalité dès que r > 0.",
    en: "Confusing \"at the money in spot\" (S0 = K) with \"call and put of equal price\", forgetting the strike's discounting effect breaks this equality as soon as r > 0.",
  },
});

const syntheticLongStockScenarioTemplate = mcqTemplate({
  id: "m05-parite-scenario-action-synthetique",
  conceptId: "m05-parite-call-put",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un investisseur veut une exposition économiquement équivalente à détenir l'action, mais préfère utiliser des options. Quelle combinaison reproduit une position longue synthétique sur l'action ?",
    en: "An investor wants an exposure economically equivalent to holding the stock, but prefers to use options. Which combination replicates a synthetic long stock position?",
  },
  choices: [
    { id: "long-call-short-put", label: { fr: "Acheter un call et vendre un put, de même strike et échéance", en: "Buy a call and sell a put, same strike and maturity" } },
    { id: "long-call-long-put", label: { fr: "Acheter un call et acheter un put", en: "Buy a call and buy a put" } },
    { id: "short-both", label: { fr: "Vendre à la fois le call et le put", en: "Sell both the call and the put" } },
  ],
  correctId: "long-call-short-put",
  hint: { fr: "Réarrangez la parité C − P = S0 − K(1+r)^(−T) pour isoler S0 en fonction de C et P.", en: "Rearrange the parity C − P = S0 − K(1+r)^(−T) to isolate S0 in terms of C and P." },
  explanation: {
    fr: "En réarrangeant la parité (S0 = C − P + K(1+r)^(−T)), on voit qu'une position longue call + courte put (de même strike et échéance), combinée à un placement sans risque de valeur actuelle K(1+r)^(−T), réplique exactement le payoff d'une action détenue : c'est la construction classique de l'action synthétique, utile par exemple quand l'action elle-même n'est pas directement accessible.",
    en: "Rearranging the parity (S0 = C − P + K(1+r)^(−T)), we see that a long call + short put position (same strike and maturity), combined with a risk-free investment of present value K(1+r)^(−T), exactly replicates a held stock's payoff: this is the classic synthetic stock construction, useful for example when the stock itself isn't directly accessible.",
  },
  commonMistake: {
    fr: "Inverser le sens des positions (vendre le call, acheter le put), ce qui répliquerait une position COURTE synthétique, pas longue.",
    en: "Reversing the positions' direction (selling the call, buying the put), which would replicate a synthetic SHORT position, not long.",
  },
});

const mandateRestrictedFundScenarioTemplate = mcqTemplate({
  id: "m05-parite-scenario-fonds-mandat-restreint",
  conceptId: "m05-parite-call-put",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un fonds a un mandat qui lui interdit d'acheter des puts directement, mais l'autorise à trader des calls et l'action sous-jacente. Comment peut-il malgré tout obtenir l'exposition économique d'un put acheté ?",
    en: "A fund's mandate forbids it from directly buying puts, but allows it to trade calls and the underlying stock. How can it still obtain a bought put's economic exposure?",
  },
  choices: [
    { id: "synthetic-put", label: { fr: "En achetant un call et en vendant l'action à découvert (put synthétique = call acheté − action détenue)", en: "By buying a call and shorting the underlying stock (synthetic put = bought call − held stock)" } },
    { id: "impossible", label: { fr: "C'est impossible sans trader directement un put", en: "This is impossible without directly trading a put" } },
    { id: "buy-two-calls", label: { fr: "En achetant simplement deux fois plus de calls", en: "By simply buying twice as many calls" } },
  ],
  correctId: "synthetic-put",
  hint: { fr: "Réarrangez la parité pour isoler P en fonction de C et S0.", en: "Rearrange the parity to isolate P in terms of C and S0." },
  explanation: {
    fr: "En réarrangeant la parité (P = C − S0 + K(1+r)^(−T)), on voit qu'un put long se réplique par un call long combiné à une position courte sur l'action (plus un placement sans risque) : le fonds peut ainsi obtenir exactement l'exposition économique d'un put acheté sans jamais trader de put directement, en respectant la lettre de son mandat tout en atteignant l'objectif économique visé.",
    en: "Rearranging the parity (P = C − S0 + K(1+r)^(−T)), we see a long put is replicated by a long call combined with a short position on the stock (plus a risk-free investment): the fund can thus obtain exactly a bought put's economic exposure without ever directly trading a put, complying with its mandate's letter while achieving the intended economic goal.",
  },
  commonMistake: {
    fr: "Croire qu'un mandat interdisant les puts empêche totalement d'obtenir une exposition économiquement équivalente, en oubliant la possibilité de la répliquer synthétiquement via d'autres instruments autorisés.",
    en: "Believing a mandate forbidding puts totally prevents obtaining an economically equivalent exposure, forgetting the possibility of synthetically replicating it via other authorized instruments.",
  },
});

export const templates: QuestionTemplate[] = [
  impliedPutTemplate,
  arbitrageDirectionTemplate,
  europeanOnlyTemplate,
  vocabTemplate,
  comprehensionTemplate,
  dividendComparisonTemplate,
  whatIfDividendPaidTemplate,
  whatIfRateIncreasesTemplate,
  impliedRateNumericTemplate,
  atmMeansEqualErrorTemplate,
  syntheticLongStockScenarioTemplate,
  mandateRestrictedFundScenarioTemplate,
];
