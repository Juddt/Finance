import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const rebalanceNumericTemplate: QuestionTemplate = {
  id: "m07-hedge-rebalance-calcul",
  conceptId: "m07-delta-hedging",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const contracts = randomInt(rng, 20, 200);
    const deltaOld = randomFloat(rng, 0.2, 0.8, 2);
    const deltaNew = deltaOld + (randomInt(rng, -15, 15) / 100 || 0.05);
    const trade = Math.round(contracts * (deltaNew - deltaOld) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un trader détient ${contracts} calls longs. Le Delta de chaque call passe de ${fmt(deltaOld, "fr")} à ${fmt(deltaNew, "fr")}. Combien d'unités de sous-jacent doit-il acheter (positif) ou vendre (négatif) pour rester couvert ?`,
        en: `A trader holds ${contracts} long calls. Each call's Delta moves from ${fmt(deltaOld, "en")} to ${fmt(deltaNew, "en")}. How many units of underlying must they buy (positive) or sell (negative) to stay hedged?`,
      },
      numericUnit: { fr: "unités de sous-jacent", en: "units of underlying" },
      numericTolerance: "± 1",
      hint: { fr: "Quantité à trader = (Δ_nouveau − Δ_ancien) × nombre de contrats.", en: "Amount to trade = (Δ_new − Δ_old) × number of contracts." },
      numeric: { value: trade, tolerance: 1 },
      calculation: {
        fr: `Quantité = (${fmt(deltaNew, "fr")} − ${fmt(deltaOld, "fr")}) × ${contracts} ≈ ${fmt(trade, "fr")}.`,
        en: `Amount = (${fmt(deltaNew, "en")} − ${fmt(deltaOld, "en")}) × ${contracts} ≈ ${fmt(trade, "en")}.`,
      },
      explanation: {
        fr: "Pour rester delta-neutre avec des calls longs, il faut VENDRE du sous-jacent à hauteur du Delta total détenu — cet exercice calcule l'ajustement nécessaire, pas la position brute complète.",
        en: "To stay delta-neutral with long calls, one must SELL underlying equal to the total Delta held — this exercise computes the needed adjustment, not the full gross position.",
      },
      commonMistake: {
        fr: "Inverser l'ordre de la soustraction (Δ_ancien − Δ_nouveau), ce qui inverse le signe du trade nécessaire.",
        en: "Reversing the subtraction order (Δ_old − Δ_new), which flips the needed trade's sign.",
      },
    };
  },
};

const eliminatesAllRiskTemplate: QuestionTemplate = {
  id: "m07-hedge-elimine-tout",
  conceptId: "m07-delta-hedging",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le delta-hedging élimine totalement tout risque d'une position optionnelle, y compris le risque de Gamma et de Vega.",
      en: "Delta-hedging totally eliminates all risk of an option position, including Gamma and Vega risk.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le delta-hedging neutralise seulement le risque directionnel de premier ordre (Delta). Le risque de Gamma (entre deux rééquilibrages) et le risque de Vega (variation de la volatilité) subsistent.",
      en: "False: delta-hedging only neutralizes first-order directional risk (Delta). Gamma risk (between two rebalances) and Vega risk (volatility changing) remain.",
    },
    commonMistake: {
      fr: "Croire qu'une position \"delta-neutre\" est totalement sans risque.",
      en: "Believing a \"delta-neutral\" position is entirely risk-free.",
    },
  }),
};

const frequencyTradeoffTemplate: QuestionTemplate = {
  id: "m07-hedge-frequence",
  conceptId: "m07-delta-hedging",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const tooOften = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Un trader rééquilibre son delta-hedge ${tooOften ? "extrêmement fréquemment, à chaque infime mouvement du marché" : "très rarement, seulement une fois par mois"}. Quel est le principal risque de cette approche ?`,
        en: `A trader rebalances their delta-hedge ${tooOften ? "extremely frequently, at every tiny market move" : "very rarely, only once a month"}. What is the main risk of this approach?`,
      },
      choices: buildChoices([
        { id: "costs", label: { fr: "Des coûts de transaction excessifs qui rongent la marge", en: "Excessive transaction costs eating into the margin" } },
        { id: "gap", label: { fr: "Un risque de Gamma résiduel important (exposition non couverte entre rééquilibrages)", en: "Significant residual Gamma risk (uncovered exposure between rebalances)" } },
      ]),
      hint: { fr: "L'un des deux excès coûte cher en frais, l'autre expose à des mouvements non couverts.", en: "One extreme costs a lot in fees, the other exposes you to uncovered moves." },
      correctChoiceIds: [tooOften ? "costs" : "gap"],
      explanation: tooOften
        ? { fr: "Rééquilibrer à chaque mouvement infime génère des coûts de transaction qui s'accumulent et rongent la marge de la stratégie.", en: "Rebalancing at every tiny move generates transaction costs that accumulate and eat into the strategy's margin." }
        : { fr: "Rééquilibrer trop rarement laisse le Delta dévier fortement entre deux ajustements, exposant à un risque de Gamma non couvert important.", en: "Rebalancing too rarely lets Delta drift significantly between two adjustments, exposing to significant uncovered Gamma risk." },
      commonMistake: {
        fr: "Ne pas voir qu'il existe un arbitrage entre ces deux excès, plutôt qu'une réponse \"plus c'est fréquent, mieux c'est\" absolue.",
        en: "Not seeing there's a trade-off between these two extremes, rather than an absolute \"more frequent is always better\" answer.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-hedge-vocab",
  conceptId: "m07-delta-hedging",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'action d'ajuster la quantité de sous-jacent détenue pour que le Delta total reste proche de zéro s'appelle le ______.",
      en: "Adjusting the quantity of underlying held so total Delta stays near zero is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["rebalancing", "reequilibrage", "rééquilibrage"],
    hint: { fr: "Le même mot utilisé pour un portefeuille qu'on remet en équilibre.", en: "The same word used for bringing a portfolio back into balance." },
    explanation: {
      fr: "Le rééquilibrage (rebalancing) est l'ajustement périodique de la couverture qui maintient le delta-hedge efficace au fil du temps.",
      en: "Rebalancing is the periodic hedge adjustment that keeps the delta-hedge effective over time.",
    },
    commonMistake: {
      fr: "Croire qu'un delta-hedge, une fois mis en place, reste valable indéfiniment sans ajustement.",
      en: "Believing a delta-hedge, once set up, stays valid indefinitely without adjustment.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m07-hedge-comprehension-utilite",
  conceptId: "m07-delta-hedging",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi un vendeur d'options qui souhaite capter la prime (le Theta) sans parier sur la direction du sous-jacent a-t-il besoin de delta-hedger sa position ?",
    en: "Why does an options seller wanting to capture the premium (Theta) without betting on the underlying's direction need to delta-hedge their position?",
  },
  choices: [
    { id: "isolate-theta", label: { fr: "Parce que sans couverture, une option vendue nue reste exposée au mouvement directionnel du sous-jacent, ce qui masquerait le vrai objectif : capter la prime issue du différentiel entre volatilité implicite et réalisée", en: "Because without a hedge, a naked sold option remains exposed to the underlying's directional move, which would obscure the real goal: capturing the premium from the gap between implied and realized volatility" } },
    { id: "no-reason", label: { fr: "Il n'y a pas de vraie raison, vendre une option nue revient exactement au même", en: "There's no real reason, selling a naked option amounts to exactly the same thing" } },
    { id: "regulatory-only", label: { fr: "C'est une obligation purement réglementaire sans logique économique", en: "It's a purely regulatory obligation with no economic logic" } },
  ],
  correctId: "isolate-theta",
  hint: { fr: "Sans couverture, un vendeur d'option parie AUSSI implicitement sur la direction — que veut-il isoler ?", en: "Without a hedge, an option seller also implicitly bets on direction — what do they want to isolate?" },
  explanation: {
    fr: "Une option vendue nue combine deux paris distincts : un pari directionnel (sur le sens du sous-jacent) et un pari sur la volatilité (le Theta encaissé contre le risque de Gamma). Le delta-hedging neutralise le premier pari pour isoler le second, permettant au vendeur de profiter spécifiquement de l'écart entre la volatilité implicite vendue et la volatilité réalisée, sans que le résultat ne dépende du hasard directionnel du marché (M07, P&L du delta-hedging).",
    en: "A naked sold option combines two distinct bets: a directional bet (on the underlying's direction) and a volatility bet (the collected Theta against Gamma risk). Delta-hedging neutralizes the first bet to isolate the second, letting the seller specifically profit from the gap between the sold implied volatility and realized volatility, without the outcome depending on the market's directional luck (M07, delta-hedging P&L).",
  },
  commonMistake: {
    fr: "Croire que vendre une option nue ou une option couverte en delta revient économiquement au même, en oubliant que la couverture élimine spécifiquement le pari directionnel.",
    en: "Believing selling a naked option or a delta-hedged one amounts to the same thing economically, forgetting the hedge specifically eliminates the directional bet.",
  },
});

const putVsCallHedgeDirectionComparisonTemplate = mcqTemplate({
  id: "m07-hedge-comparaison-direction-put-call",
  conceptId: "m07-delta-hedging",
  difficulty: "medium",
  prompt: {
    fr: "Comparez le sens de la couverture requise pour un vendeur de call (Delta négatif côté vendeur) et un vendeur de put (Delta positif côté vendeur). Dans quel sens chacun doit-il trader le sous-jacent ?",
    en: "Compare the hedge direction required for a call seller (negative Delta on the seller's side) and a put seller (positive Delta on the seller's side). Which direction must each trade the underlying?",
  },
  choices: [
    { id: "buy-vs-sell", label: { fr: "Le vendeur de call doit ACHETER du sous-jacent pour se couvrir ; le vendeur de put doit en VENDRE — des sens opposés", en: "The call seller must BUY the underlying to hedge; the put seller must SELL it — opposite directions" } },
    { id: "same-direction", label: { fr: "Les deux doivent trader dans le même sens pour se couvrir", en: "Both must trade in the same direction to hedge" } },
    { id: "no-hedge-needed", label: { fr: "Aucun des deux n'a besoin de trader le sous-jacent pour se couvrir", en: "Neither needs to trade the underlying to hedge" } },
  ],
  correctId: "buy-vs-sell",
  hint: { fr: "Le vendeur de call a un Delta négatif (comme une position courte) ; le vendeur de put a un Delta positif (comme une position longue) — dans quel sens neutraliser chacun ?", en: "The call seller has negative Delta (like a short position); the put seller has positive Delta (like a long position) — in which direction to neutralize each?" },
  explanation: {
    fr: "Vendre un call crée une exposition Delta négative (le vendeur perd si le sous-jacent monte) : pour se couvrir, il doit ACHETER du sous-jacent. Vendre un put crée une exposition Delta positive (le vendeur perd si le sous-jacent baisse) : pour se couvrir, il doit en VENDRE. Les deux couvertures sont donc de sens opposé, bien que les deux positions soient symétriquement « vendeuses » d'options.",
    en: "Selling a call creates negative Delta exposure (the seller loses if the underlying rises): to hedge, they must BUY the underlying. Selling a put creates positive Delta exposure (the seller loses if the underlying falls): to hedge, they must SELL it. The two hedges are therefore in opposite directions, even though both positions are symmetrically \"selling\" options.",
  },
  commonMistake: {
    fr: "Appliquer le même sens de couverture à un vendeur de call et à un vendeur de put, en oubliant que leurs expositions Delta sont de signes opposés.",
    en: "Applying the same hedge direction to a call seller and a put seller, forgetting their Delta exposures are of opposite signs.",
  },
});

const whatIfHighGammaTemplate = mcqTemplate({
  id: "m07-hedge-whatif-gamma-eleve",
  conceptId: "m07-delta-hedging",
  difficulty: "hard",
  prompt: {
    fr: "Une option approche de l'échéance en restant proche de la monnaie, ce qui fait exploser son Gamma (M07-1). Que doit faire le trader qui la delta-hedge, en termes de fréquence de rééquilibrage ?",
    en: "An option approaches expiry while staying near the money, causing its Gamma to spike (M07-1). What must the trader delta-hedging it do in terms of rebalancing frequency?",
  },
  choices: [
    { id: "rebalance-more", label: { fr: "Rééquilibrer beaucoup plus fréquemment, car le Delta devient extrêmement sensible au moindre mouvement du sous-jacent dans cette zone", en: "Rebalance much more frequently, since Delta becomes extremely sensitive to the slightest underlying move in this zone" } },
    { id: "rebalance-less", label: { fr: "Rééquilibrer moins fréquemment, un Gamma élevé rendant le Delta plus stable", en: "Rebalance less frequently, high Gamma making Delta more stable" } },
    { id: "no-change", label: { fr: "La fréquence de rééquilibrage optimale ne dépend jamais du niveau de Gamma", en: "The optimal rebalancing frequency never depends on the Gamma level" } },
  ],
  correctId: "rebalance-more",
  hint: { fr: "Le Gamma mesure justement à quelle vitesse le Delta change — un Gamma élevé signifie un Delta qui \"bouge\" beaucoup.", en: "Gamma precisely measures how fast Delta changes — a high Gamma means a Delta that \"moves\" a lot." },
  explanation: {
    fr: "Un Gamma élevé signifie que le Delta change rapidement pour un petit mouvement du sous-jacent : laisser passer trop de temps entre deux rééquilibrages dans cette situation laisserait le Delta dériver fortement, exposant à un risque de Gamma non couvert important (M07-4). C'est précisément dans ces zones de Gamma élevé (options ATM proches de l'échéance, ou proches d'une barrière, M10-2) que la fréquence de rééquilibrage doit être la plus élevée.",
    en: "A high Gamma means Delta changes rapidly for a small underlying move: letting too much time pass between rebalances in this situation would let Delta drift significantly, exposing to significant uncovered Gamma risk (M07-4). It is precisely in these high-Gamma zones (near-expiry ATM options, or near a barrier, M10-2) that rebalancing frequency must be highest.",
  },
  commonMistake: {
    fr: "Appliquer une fréquence de rééquilibrage fixe indépendamment du niveau de Gamma, en oubliant que le besoin de rééquilibrage varie fortement selon les conditions de marché et l'échéance.",
    en: "Applying a fixed rebalancing frequency regardless of the Gamma level, forgetting the rebalancing need varies strongly with market conditions and time to expiry.",
  },
});

const whatIfHighTransactionCostsTemplate = mcqTemplate({
  id: "m07-hedge-whatif-couts-transaction-eleves",
  conceptId: "m07-delta-hedging",
  difficulty: "hard",
  prompt: {
    fr: "Sur un marché où les coûts de transaction sont très élevés (spread large, faible liquidité), comment la fréquence de rééquilibrage optimale du delta-hedge évolue-t-elle, toutes choses égales par ailleurs sur le Gamma ?",
    en: "In a market with very high transaction costs (wide spread, low liquidity), how does the optimal delta-hedge rebalancing frequency change, all else equal on Gamma?",
  },
  choices: [
    { id: "less-frequent", label: { fr: "Elle diminue : il devient optimal d'accepter un peu plus de risque de Gamma résiduel plutôt que de payer des frais excessifs à chaque ajustement", en: "It decreases: it becomes optimal to accept a bit more residual Gamma risk rather than pay excessive fees on every adjustment" } },
    { id: "more-frequent", label: { fr: "Elle augmente, pour compenser le coût de chaque transaction par plus de précision", en: "It increases, to compensate for each transaction's cost with more precision" } },
    { id: "unaffected", label: { fr: "Le coût de transaction n'a jamais d'influence sur la fréquence optimale", en: "Transaction cost never influences the optimal frequency" } },
  ],
  correctId: "less-frequent",
  hint: { fr: "Rappelez-vous le compromis fondamental : rééquilibrer trop souvent coûte cher en frais, rééquilibrer trop peu expose au Gamma. Que se passe-t-il si le premier coût augmente ?", en: "Remember the fundamental trade-off: rebalancing too often costs a lot in fees, too little exposes to Gamma. What happens if the first cost rises?" },
  explanation: {
    fr: "Le choix de la fréquence de rééquilibrage est un arbitrage entre le coût des transactions (qui pousse vers moins de rééquilibrages) et le risque de Gamma résiduel (qui pousse vers plus de rééquilibrages). Si les coûts de transaction augmentent fortement, l'équilibre optimal se déplace naturellement vers des rééquilibrages moins fréquents, acceptant un peu plus de risque de Gamma non couvert en échange d'économies de frais.",
    en: "Choosing the rebalancing frequency is a trade-off between transaction costs (pushing toward fewer rebalances) and residual Gamma risk (pushing toward more rebalances). If transaction costs rise sharply, the optimal balance naturally shifts toward less frequent rebalancing, accepting a bit more uncovered Gamma risk in exchange for fee savings.",
  },
  commonMistake: {
    fr: "Croire que la fréquence de rééquilibrage optimale est une constante universelle, indépendante des coûts de transaction propres à chaque marché ou instrument.",
    en: "Believing the optimal rebalancing frequency is a universal constant, independent of the transaction costs specific to each market or instrument.",
  },
});

const portfolioSharesNumericTemplate: QuestionTemplate = {
  id: "m07-hedge-actions-portefeuille-calcul",
  conceptId: "m07-delta-hedging",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const q1 = randomInt(rng, 10, 100);
    const d1 = randomFloat(rng, 0.3, 0.8, 2);
    const q2 = randomInt(rng, 10, 100);
    const d2 = randomFloat(rng, 0.1, 0.5, 2);
    const shares = Math.round((q1 * d1 - q2 * d2) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un trader détient ${q1} calls longs de Delta=${fmt(d1, "fr")} et a vendu ${q2} puts (position courte) de Delta=${fmt(d2, "fr")} chacun (en valeur absolue). Combien d'unités de sous-jacent doit-il VENDRE pour que le portefeuille global soit delta-neutre ?`,
        en: `A trader holds ${q1} long calls with Delta=${fmt(d1, "en")} and has sold ${q2} puts (short position) with Delta=${fmt(d2, "en")} each (in absolute value). How many units of underlying must they SELL for the overall portfolio to be delta-neutral?`,
      },
      numericUnit: { fr: "unités de sous-jacent", en: "units of underlying" },
      numericTolerance: "± 1",
      hint: { fr: "Un put vendu (short) a un Delta positif pour le vendeur (−(−Delta_put) = +Delta_put) : additionnez les deux contributions positives au Delta total.", en: "A sold (short) put has positive Delta for the seller (−(−Delta_put) = +Delta_put): add both positive contributions to the total Delta." },
      numeric: { value: shares, tolerance: 1 },
      calculation: {
        fr: `Delta calls = ${q1}×${fmt(d1, "fr")} = ${(q1 * d1).toFixed(2)}. Delta puts vendus = ${q2}×${fmt(d2, "fr")} = ${(q2 * d2).toFixed(2)} (positif, car vendre un put donne un Delta positif). Delta total = ${(q1 * d1 + q2 * d2).toFixed(2)} ≈ ${shares} à vendre en sous-jacent.`,
        en: `Calls' Delta = ${q1}×${fmt(d1, "en")} = ${(q1 * d1).toFixed(2)}. Sold puts' Delta = ${q2}×${fmt(d2, "en")} = ${(q2 * d2).toFixed(2)} (positive, since selling a put gives a positive Delta). Total Delta = ${(q1 * d1 + q2 * d2).toFixed(2)} ≈ ${shares} to sell in underlying.`,
      },
      explanation: {
        fr: "Combiner plusieurs positions optionnelles nécessite de sommer les Delta signés de CHACUNE avant de dimensionner la couverture : un call long et un put vendu ont tous deux un Delta positif ici, s'additionnant plutôt que se compensant, contrairement à ce qu'on pourrait intuitivement supposer d'une position \"achetée\" et d'une \"vendue\".",
        en: "Combining several option positions requires summing EACH one's signed Delta before sizing the hedge: a long call and a sold put both have positive Delta here, adding up rather than offsetting, unlike what one might intuitively assume of a \"bought\" and a \"sold\" position.",
      },
      commonMistake: {
        fr: "Supposer qu'une position achetée et une position vendue se compensent automatiquement en Delta, sans vérifier le signe réel de chaque contribution (call vs put, achat vs vente).",
        en: "Assuming a bought position and a sold position automatically offset in Delta, without checking each contribution's real sign (call vs put, buy vs sell).",
      },
    };
  },
};

const putHedgeSignErrorTemplate = trueFalseTemplate({
  id: "m07-hedge-erreur-signe-put",
  conceptId: "m07-delta-hedging",
  difficulty: "medium",
  statement: {
    fr: "Pour couvrir en delta une position VENDEUSE sur un put, il faut ACHETER du sous-jacent, exactement comme pour couvrir une position vendeuse sur un call.",
    en: "To delta-hedge a SHORT put position, the underlying must be BOUGHT, exactly as for hedging a short call position.",
  },
  correct: false,
  explanation: {
    fr: "Faux : vendre un put crée une exposition Delta POSITIVE (le vendeur perd si le sous-jacent baisse, comme un acheteur de l'actif) ; pour se couvrir, il faut donc VENDRE du sous-jacent, pas en acheter. C'est l'inverse d'un vendeur de call (Delta négatif), qui doit lui acheter du sous-jacent pour se couvrir.",
    en: "False: selling a put creates POSITIVE Delta exposure (the seller loses if the underlying falls, like a buyer of the asset); to hedge, the underlying must therefore be SOLD, not bought. This is the opposite of a call seller (negative Delta), who must buy the underlying to hedge.",
  },
  commonMistake: {
    fr: "Généraliser à tort le sens de couverture d'un vendeur de call (achat de sous-jacent) à un vendeur de put, en oubliant que leurs expositions Delta sont de signe opposé.",
    en: "Wrongly generalizing a call seller's hedge direction (buying the underlying) to a put seller, forgetting their Delta exposures are of opposite sign.",
  },
});

const marketMakerScenarioTemplate = mcqTemplate({
  id: "m07-hedge-scenario-teneur-marche",
  conceptId: "m07-delta-hedging",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un teneur de marché d'options exécute des dizaines de trades par jour dans les deux sens (achats et ventes de calls et de puts de clients). Plutôt que de delta-hedger chaque trade individuellement, que fait-il généralement en pratique ?",
    en: "An options market maker executes dozens of trades a day in both directions (buying and selling clients' calls and puts). Rather than delta-hedging each trade individually, what do they generally do in practice?",
  },
  choices: [
    { id: "hedge-net-book", label: { fr: "Il suit le Delta NET de l'ensemble de son livre en continu, et ne rééquilibre le sous-jacent que lorsque cette exposition nette dépasse un seuil jugé significatif", en: "They track the NET Delta of their entire book continuously, and only rebalance the underlying when that net exposure exceeds a threshold deemed significant" } },
    { id: "hedge-each-trade", label: { fr: "Il couvre systématiquement chaque trade individuellement, dès son exécution, sans jamais tenir compte des autres positions", en: "They systematically hedge each trade individually, as soon as executed, never accounting for other positions" } },
    { id: "no-hedge", label: { fr: "Il ne couvre jamais rien, comptant uniquement sur la compensation naturelle entre acheteurs et vendeurs", en: "They never hedge anything, relying solely on natural offsetting between buyers and sellers" } },
  ],
  correctId: "hedge-net-book",
  hint: { fr: "Grâce à l'additivité des Greeks (M07), de nombreux trades individuels peuvent déjà se compenser partiellement entre eux.", en: "Thanks to Greeks' additivity (M07), many individual trades can already partially offset each other." },
  explanation: {
    fr: "Grâce à l'additivité des Greeks, un teneur de marché suit en continu le Delta NET de son livre entier (agrégeant tous les trades clients), et ne trade le sous-jacent que pour ajuster ce solde net quand il dépasse un seuil jugé significatif : couvrir chaque trade individuellement générerait des coûts de transaction inutiles, puisque de nombreux trades clients se compensent déjà naturellement entre eux au niveau du livre.",
    en: "Thanks to Greeks' additivity, a market maker continuously tracks their entire book's NET Delta (aggregating all client trades), and only trades the underlying to adjust that net balance when it exceeds a threshold deemed significant: hedging each trade individually would generate needless transaction costs, since many client trades already naturally offset each other at the book level.",
  },
  commonMistake: {
    fr: "Croire qu'un teneur de marché doit couvrir chaque transaction individuellement, en ignorant l'efficacité de la gestion du risque au niveau agrégé du livre entier.",
    en: "Believing a market maker must hedge each transaction individually, ignoring the efficiency of managing risk at the whole book's aggregate level.",
  },
});

const partialHedgeScenarioTemplate = mcqTemplate({
  id: "m07-hedge-scenario-couverture-partielle-vue",
  conceptId: "m07-delta-hedging",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk vend un call couvert en delta, mais son gérant a une légère conviction haussière sur le sous-jacent et décide de ne couvrir que 70% du Delta plutôt que 100%. Quelle est la conséquence de ce choix délibéré ?",
    en: "A desk sells a delta-hedged call, but its manager has a slight bullish conviction on the underlying and decides to hedge only 70% of the Delta rather than 100%. What is the consequence of this deliberate choice?",
  },
  choices: [
    { id: "mixed-exposure", label: { fr: "Le desk combine désormais un pari de volatilité (Theta vs Gamma) ET un léger pari directionnel résiduel, au lieu d'isoler purement le premier", en: "The desk now combines a volatility bet (Theta vs Gamma) AND a slight residual directional bet, instead of purely isolating the former" } },
    { id: "same-as-full-hedge", label: { fr: "Le résultat reste rigoureusement identique à une couverture à 100%", en: "The outcome remains rigorously identical to a 100% hedge" } },
    { id: "eliminates-all-risk", label: { fr: "Cela élimine tout risque restant sur la position", en: "This eliminates all remaining risk on the position" } },
  ],
  correctId: "mixed-exposure",
  hint: { fr: "Une couverture delta partielle laisse volontairement une fraction de l'exposition directionnelle non neutralisée.", en: "A partial delta hedge deliberately leaves a fraction of the directional exposure unneutralized." },
  explanation: {
    fr: "En ne couvrant que 70% du Delta, le desk laisse délibérément 30% de l'exposition directionnelle non neutralisée : le résultat de la position dépend désormais à la fois du pari de volatilité habituel (Theta encaissé contre risque de Gamma) ET d'un pari directionnel résiduel reflétant la conviction du gérant — une décision de gestion de risque assumée, différente d'une couverture delta-neutre classique qui cherche à isoler purement le pari de volatilité.",
    en: "By hedging only 70% of the Delta, the desk deliberately leaves 30% of the directional exposure unneutralized: the position's outcome now depends both on the usual volatility bet (collected Theta against Gamma risk) AND a residual directional bet reflecting the manager's conviction — a deliberate risk-management decision, different from a classic delta-neutral hedge that seeks to purely isolate the volatility bet.",
  },
  commonMistake: {
    fr: "Croire qu'une couverture partielle du Delta est une erreur ou un oubli, sans envisager qu'il puisse s'agir d'un choix délibéré pour exprimer une vue directionnelle limitée.",
    en: "Believing a partial Delta hedge is a mistake or an oversight, without considering it could be a deliberate choice to express a limited directional view.",
  },
});

export const templates: QuestionTemplate[] = [
  rebalanceNumericTemplate,
  eliminatesAllRiskTemplate,
  frequencyTradeoffTemplate,
  vocabTemplate,
  comprehensionTemplate,
  putVsCallHedgeDirectionComparisonTemplate,
  whatIfHighGammaTemplate,
  whatIfHighTransactionCostsTemplate,
  portfolioSharesNumericTemplate,
  putHedgeSignErrorTemplate,
  marketMakerScenarioTemplate,
  partialHedgeScenarioTemplate,
];
