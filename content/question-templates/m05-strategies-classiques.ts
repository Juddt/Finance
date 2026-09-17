import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const bullSpreadNumericTemplate: QuestionTemplate = {
  id: "m05-strat-bull-spread-profit",
  conceptId: "m05-strategies-classiques",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const K1 = randomInt(rng, 50, 120);
    const spreadWidth = randomInt(rng, 5, 30);
    const K2 = K1 + spreadWidth;
    const premium1 = randomInt(rng, 8, 20);
    const premium2 = Math.max(1, premium1 - randomInt(rng, 2, 6));
    const netCost = premium1 - premium2;
    const sT = randomInt(rng, K1 - 10, K2 + 20);
    const grossPayoff = Math.max(sT - K1, 0) - Math.max(sT - K2, 0);
    const netProfit = Math.round((grossPayoff - netCost) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un bull call spread : achat d'un call K1=${K1} (prime ${premium1}), vente d'un call K2=${K2} (prime ${premium2}). À l'échéance, le sous-jacent vaut S_T=${sT}. Quel est le profit net de la stratégie ?`,
        en: `A bull call spread: buy a K1=${K1} call (premium ${premium1}), sell a K2=${K2} call (premium ${premium2}). At expiry, the underlying is worth S_T=${sT}. What is the strategy's net profit?`,
      },
      numericUnit: { fr: "même devise que le sous-jacent", en: "same currency as the underlying" },
      numericTolerance: "± 0.5",
      hint: {
        fr: "Profit net = [max(S_T−K1,0) − max(S_T−K2,0)] − (prime1 − prime2).",
        en: "Net profit = [max(S_T−K1,0) − max(S_T−K2,0)] − (premium1 − premium2).",
      },
      numeric: { value: netProfit, tolerance: 0.5 },
      calculation: {
        fr: `Payoff brut = max(${sT}−${K1},0) − max(${sT}−${K2},0) = ${Math.max(sT - K1, 0)} − ${Math.max(sT - K2, 0)} = ${grossPayoff}. Coût net = ${premium1} − ${premium2} = ${netCost}. Profit net = ${grossPayoff} − ${netCost} = ${netProfit}.`,
        en: `Gross payoff = max(${sT}−${K1},0) − max(${sT}−${K2},0) = ${Math.max(sT - K1, 0)} − ${Math.max(sT - K2, 0)} = ${grossPayoff}. Net cost = ${premium1} − ${premium2} = ${netCost}. Net profit = ${grossPayoff} − ${netCost} = ${netProfit}.`,
      },
      explanation: {
        fr: "Le gain est plafonné à (K2−K1) − coût net dès que S_T dépasse K2, et la perte maximale est limitée au coût net payé si S_T reste sous K1.",
        en: "The gain is capped at (K2−K1) − net cost as soon as S_T exceeds K2, and the maximum loss is limited to the net cost paid if S_T stays below K1.",
      },
      commonMistake: {
        fr: "Oublier de soustraire le payoff du call vendu, ou oublier de déduire le coût net payé à la mise en place.",
        en: "Forgetting to subtract the sold call's payoff, or forgetting to deduct the net cost paid at setup.",
      },
    };
  },
};

const directionVsVolTemplate: QuestionTemplate = {
  id: "m05-strat-direction-vs-vol",
  conceptId: "m05-strategies-classiques",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const view = pick(
      rng,
      [
        { id: "straddle", fr: "un mouvement important du sous-jacent, mais sans savoir si ce sera à la hausse ou à la baisse", en: "a big move in the underlying, but with no idea whether it will be up or down" },
        { id: "bull-spread", fr: "une hausse modérée du sous-jacent, avec un budget de prime limité", en: "a moderate rise in the underlying, with a limited premium budget" },
      ] as const
    );

    return {
      prompt: {
        fr: `Un investisseur anticipe ${view.fr}. Quelle stratégie correspond le mieux à cette vue ?`,
        en: `An investor expects ${view.en}. Which strategy best matches this view?`,
      },
      choices: buildChoices([
        { id: "straddle", label: { fr: "Straddle (achat call + put, même strike)", en: "Straddle (buy call + put, same strike)" } },
        { id: "bull-spread", label: { fr: "Bull call spread (achat call bas strike, vente call haut strike)", en: "Bull call spread (buy low-strike call, sell high-strike call)" } },
      ]),
      hint: {
        fr: "Une vue sur l'amplitude sans direction pointe vers un straddle ; une vue directionnelle modérée pointe vers un spread.",
        en: "A view on magnitude with no direction points to a straddle; a moderate directional view points to a spread.",
      },
      correctChoiceIds: [view.id],
      explanation:
        view.id === "straddle"
          ? { fr: "Le straddle profite d'un mouvement important dans n'importe quel sens : c'est un pari sur la volatilité réalisée, pas sur la direction.", en: "The straddle profits from a large move in either direction: it is a bet on realized volatility, not direction." }
          : { fr: "Le bull call spread coûte moins cher qu'un call seul et convient à une hausse modérée, au prix d'un gain plafonné.", en: "The bull call spread costs less than a lone call and suits a moderate rise, at the cost of a capped gain." },
      commonMistake: {
        fr: "Choisir une stratégie directionnelle (spread) pour un pari sur l'amplitude, ou inversement.",
        en: "Choosing a directional strategy (spread) for a bet on magnitude, or the reverse.",
      },
    };
  },
};

const strangleCostTemplate: QuestionTemplate = {
  id: "m05-strat-strangle-vs-straddle",
  conceptId: "m05-strategies-classiques",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un strangle (strikes différents pour le call et le put) coûte en général moins cher à mettre en place qu'un straddle (même strike), mais demande un mouvement plus important pour devenir profitable.",
      en: "A strangle (different strikes for the call and put) generally costs less to set up than a straddle (same strike), but needs a bigger move to become profitable.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : les deux jambes du strangle sont OTM au départ (moins chères), mais le sous-jacent doit sortir d'une fourchette plus large avant que la stratégie ne devienne profitable, contrairement au straddle centré sur le prix actuel.",
      en: "True: both legs of the strangle start OTM (cheaper), but the underlying must move outside a wider range before the strategy turns profitable, unlike the straddle centered on the current price.",
    },
    commonMistake: {
      fr: "Croire que strangle et straddle offrent exactement le même profil coût/profit avec juste des strikes différents.",
      en: "Believing a strangle and a straddle offer exactly the same cost/profit profile, just with different strikes.",
    },
  }),
};

const collarVocabTemplate: QuestionTemplate = {
  id: "m05-strat-collar-vocab",
  conceptId: "m05-strategies-classiques",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une stratégie qui combine la détention du sous-jacent, l'achat d'un put de protection et la vente d'un call pour financer ce put s'appelle un ______.",
      en: "A strategy combining holding the underlying, buying a protective put and selling a call to fund that put is called a ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["collar", "tunnel"],
    hint: { fr: "Le même mot qu'en anglais financier (ou « tunnel » en français des marchés).", en: "The English finance term itself." },
    explanation: {
      fr: "Le collar protège une position existante à coût réduit, en échange d'un plafonnement du gain potentiel au-delà du strike du call vendu.",
      en: "The collar protects an existing position at reduced cost, in exchange for capping the potential gain beyond the sold call's strike.",
    },
    commonMistake: {
      fr: "Confondre le collar avec un simple achat de put sans la jambe de financement par la vente du call.",
      en: "Confusing the collar with a simple put purchase, missing the funding leg from selling the call.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m05-strat-comprehension-utilite",
  conceptId: "m05-strategies-classiques",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi combiner plusieurs options plutôt que de trader une seule option isolée ?",
    en: "Why combine several options rather than trade a single isolated option?",
  },
  choices: [
    { id: "shape-profile", label: { fr: "Pour façonner précisément un profil de risque/gain adapté à une vue de marché spécifique (direction, amplitude, budget), en modulant coût et plafonnement", en: "To precisely shape a risk/reward profile fitting a specific market view (direction, magnitude, budget), by adjusting cost and caps" } },
    { id: "always-cheaper", label: { fr: "Combiner des options est toujours moins cher qu'en acheter une seule", en: "Combining options is always cheaper than buying a single one" } },
    { id: "no-reason", label: { fr: "Il n'y a pas de vraie raison stratégique, c'est une pratique arbitraire", en: "There's no real strategic reason, it's an arbitrary practice" } },
  ],
  correctId: "shape-profile",
  hint: { fr: "Chaque jambe ajoutée (achetée ou vendue) modifie le profil de payoff d'une façon précise.", en: "Each added leg (bought or sold) changes the payoff profile in a precise way." },
  explanation: {
    fr: "Une option seule offre un profil de payoff fixe (illimité ou plafonné, cher ou bon marché). En combinant plusieurs options (achats et ventes), on peut façonner sur mesure le profil recherché : plafonner un gain pour réduire le coût (spread), parier sur l'amplitude sans direction (straddle/strangle), ou financer une protection par la vente d'un autre droit (collar) — chaque combinaison répond à une vue de marché différente.",
    en: "A lone option offers a fixed payoff profile (unlimited or capped, expensive or cheap). By combining several options (buys and sells), the desired profile can be tailored: capping a gain to reduce cost (spread), betting on magnitude with no direction (straddle/strangle), or funding protection by selling another right (collar) — each combination answers a different market view.",
  },
  commonMistake: {
    fr: "Croire que les stratégies combinées sont systématiquement plus avantageuses financièrement, plutôt que de comprendre qu'elles échangent un aspect du profil (coût, plafond, direction) contre un autre.",
    en: "Believing combined strategies are systematically more financially advantageous, rather than understanding they trade one aspect of the profile (cost, cap, direction) for another.",
  },
});

const bullVsBearSpreadComparisonTemplate = mcqTemplate({
  id: "m05-strat-comparaison-bull-bear-spread",
  conceptId: "m05-strategies-classiques",
  difficulty: "medium",
  prompt: {
    fr: "Comparez un bull call spread (achat call bas strike, vente call haut strike) et un bear put spread (achat put haut strike, vente put bas strike). Quel est leur point commun structurel ?",
    en: "Compare a bull call spread (buy low-strike call, sell high-strike call) and a bear put spread (buy high-strike put, sell low-strike put). What is their structural common point?",
  },
  choices: [
    { id: "capped-both", label: { fr: "Les deux ont un gain ET une perte maximale plafonnés, seule la direction anticipée diffère (hausse pour l'un, baisse pour l'autre)", en: "Both have a capped maximum gain AND loss, only the anticipated direction differs (rise for one, fall for the other)" } },
    { id: "unlimited-gain", label: { fr: "Les deux offrent un gain potentiellement illimité", en: "Both offer a potentially unlimited gain" } },
    { id: "unrelated", label: { fr: "Ce sont deux stratégies structurellement sans aucun rapport", en: "These are two structurally unrelated strategies" } },
  ],
  correctId: "capped-both",
  hint: { fr: "Les deux combinent un achat et une vente d'options de même type, à deux strikes différents.", en: "Both combine buying and selling options of the same type, at two different strikes." },
  explanation: {
    fr: "Le bull call spread et le bear put spread sont structurellement symétriques : tous deux combinent l'achat d'une option et la vente d'une autre du même type à un strike différent, plafonnant à la fois le gain maximal (par la jambe vendue) et la perte maximale (au coût net payé) — seule la direction anticipée (hausse vs baisse) et le type d'option utilisé (call vs put) diffèrent.",
    en: "The bull call spread and the bear put spread are structurally symmetric: both combine buying one option and selling another of the same type at a different strike, capping both the maximum gain (via the sold leg) and the maximum loss (at the net cost paid) — only the anticipated direction (rise vs fall) and the option type used (call vs put) differ.",
  },
  commonMistake: {
    fr: "Croire que seul le bull spread plafonne le gain, en oubliant que le bear put spread suit exactement la même logique symétrique côté baissier.",
    en: "Believing only the bull spread caps the gain, forgetting the bear put spread follows exactly the same symmetric logic on the downside.",
  },
});

const whatIfVolRisesTemplate = mcqTemplate({
  id: "m05-strat-whatif-hausse-volatilite",
  conceptId: "m05-strategies-classiques",
  difficulty: "hard",
  prompt: {
    fr: "Un investisseur achète un straddle. Le lendemain, la volatilité implicite du marché augmente fortement, mais le prix du sous-jacent lui-même n'a pas bougé. Que devient probablement la valeur du straddle ?",
    en: "An investor buys a straddle. The next day, the market's implied volatility rises sharply, but the underlying's price itself hasn't moved. What likely happens to the straddle's value?",
  },
  choices: [
    { id: "increases", label: { fr: "Elle augmente : un straddle profite d'une hausse de la volatilité implicite, indépendamment de tout mouvement du sous-jacent", en: "It increases: a straddle benefits from rising implied volatility, independent of any move in the underlying" } },
    { id: "unchanged", label: { fr: "Elle ne change pas tant que le sous-jacent lui-même ne bouge pas", en: "It doesn't change as long as the underlying itself doesn't move" } },
    { id: "decreases", label: { fr: "Elle diminue automatiquement", en: "It automatically decreases" } },
  ],
  correctId: "increases",
  hint: { fr: "Un straddle est composé de deux options achetées (call + put) : leur valeur temps dépend de la volatilité anticipée, pas seulement du prix actuel.", en: "A straddle consists of two bought options (call + put): their time value depends on anticipated volatility, not just the current price." },
  explanation: {
    fr: "Un straddle acheté est une position longue en volatilité (on dit qu'il a un « vega » positif, notion approfondie en M07) : une hausse de la volatilité implicite augmente la valeur des deux jambes (call et put), même sans aucun mouvement du prix du sous-jacent, car le marché anticipe désormais des mouvements futurs plus amples.",
    en: "A bought straddle is a long-volatility position (it has a positive \"vega\", a concept explored further in M07): a rise in implied volatility increases both legs' value (call and put), even with no move at all in the underlying's price, since the market now anticipates larger future moves.",
  },
  commonMistake: {
    fr: "Croire que la valeur d'une position optionnelle ne dépend que du mouvement du prix du sous-jacent, en ignorant l'effet direct d'un changement de volatilité implicite.",
    en: "Believing an option position's value depends only on the underlying's price move, ignoring the direct effect of an implied volatility change.",
  },
});

const whatIfPinnedTemplate = mcqTemplate({
  id: "m05-strat-whatif-sous-jacent-immobile",
  conceptId: "m05-strategies-classiques",
  difficulty: "medium",
  prompt: {
    fr: "Un investisseur achète un straddle juste avant une annonce, pariant sur un mouvement important. Finalement, le sous-jacent reste exactement au même niveau jusqu'à l'échéance. Quel est le résultat de la stratégie ?",
    en: "An investor buys a straddle right before an announcement, betting on a big move. In the end, the underlying stays exactly at the same level until expiry. What is the strategy's outcome?",
  },
  choices: [
    { id: "max-loss", label: { fr: "La perte maximale possible : les deux jambes (call et put) expirent sans valeur, perdant l'intégralité des deux primes payées", en: "The maximum possible loss: both legs (call and put) expire worthless, losing the entirety of both premiums paid" } },
    { id: "breakeven", label: { fr: "Le résultat est neutre, ni gain ni perte", en: "The outcome is neutral, neither gain nor loss" } },
    { id: "partial-gain", label: { fr: "Un léger gain, car au moins une des deux jambes est toujours ITM", en: "A slight gain, since at least one of the two legs is always ITM" } },
  ],
  correctId: "max-loss",
  hint: { fr: "Rappelez-vous que le straddle est un pari sur l'AMPLEUR du mouvement, pas sur sa direction — que se passe-t-il si le mouvement n'a simplement pas lieu ?", en: "Remember the straddle is a bet on the SIZE of the move, not its direction — what happens if the move simply doesn't happen?" },
  explanation: {
    fr: "Le straddle est un pari sur l'ampleur du mouvement : si le sous-jacent reste exactement au strike, le call et le put finissent tous deux exactement à la monnaie, avec une valeur intrinsèque nulle. L'investisseur perd alors l'intégralité des deux primes payées — le pire scénario possible pour un acheteur de straddle, illustrant que ce pari n'est gagnant que si un mouvement suffisamment ample se produit effectivement.",
    en: "The straddle is a bet on the move's size: if the underlying stays exactly at the strike, both the call and the put end up exactly at the money, with zero intrinsic value. The investor then loses the entirety of both premiums paid — the worst possible scenario for a straddle buyer, illustrating this bet only wins if a sufficiently large move actually occurs.",
  },
  commonMistake: {
    fr: "Croire qu'un straddle garantit un résultat au moins neutre, en oubliant qu'un sous-jacent immobile produit au contraire sa perte maximale.",
    en: "Believing a straddle guarantees at least a neutral outcome, forgetting a motionless underlying instead produces its maximum loss.",
  },
});

const coveredCallNumericTemplate: QuestionTemplate = {
  id: "m05-strat-covered-call-calcul",
  conceptId: "m05-strategies-classiques",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const S0 = randomInt(rng, 60, 140);
    const K = S0 + randomInt(rng, 5, 25);
    const premium = randomInt(rng, 2, 10);
    const sT = randomInt(rng, S0 - 30, K + 30);
    const stockPnl = sT - S0;
    const callPayoff = Math.max(sT - K, 0);
    const totalPnl = Math.round((stockPnl - callPayoff + premium) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un investisseur détient l'action à S0 = ${S0} et vend un call couvert de strike K = ${K} pour une prime de ${premium}. À l'échéance, S_T = ${sT}. Quel est le profit net total de la position (action + call vendu) ?`,
        en: `An investor holds the stock at S0 = ${S0} and sells a covered call with strike K = ${K} for a premium of ${premium}. At expiry, S_T = ${sT}. What is the position's (stock + sold call) total net profit?`,
      },
      numericUnit: { fr: "même devise que l'action", en: "same currency as the stock" },
      numericTolerance: "± 0.5",
      hint: { fr: "Profit total = (S_T − S0) − max(S_T−K,0) + prime encaissée.", en: "Total profit = (S_T − S0) − max(S_T−K,0) + premium collected." },
      numeric: { value: totalPnl, tolerance: 0.5 },
      calculation: {
        fr: `P&L action = ${sT}−${S0} = ${stockPnl}. Payoff du call vendu (coût pour le vendeur) = max(${sT}−${K},0) = ${callPayoff}. Profit total = ${stockPnl} − ${callPayoff} + ${premium} = ${totalPnl}.`,
        en: `Stock P&L = ${sT}−${S0} = ${stockPnl}. Sold call's payoff (a cost to the seller) = max(${sT}−${K},0) = ${callPayoff}. Total profit = ${stockPnl} − ${callPayoff} + ${premium} = ${totalPnl}.`,
      },
      explanation: {
        fr: "Le call couvert (covered call) génère un revenu supplémentaire (la prime) en échange d'un plafonnement du gain sur l'action au-delà de K : au-dessus de K, le gain sur l'action est exactement compensé par la perte sur le call vendu, plafonnant le profit total à (K−S0)+prime.",
        en: "The covered call generates extra income (the premium) in exchange for capping the stock's gain beyond K: above K, the stock's gain is exactly offset by the loss on the sold call, capping the total profit at (K−S0)+premium.",
      },
      commonMistake: {
        fr: "Oublier d'ajouter la prime encaissée, ou oublier de soustraire le payoff du call vendu quand S_T dépasse K.",
        en: "Forgetting to add the collected premium, or forgetting to subtract the sold call's payoff when S_T exceeds K.",
      },
    };
  },
};

const freeMoneyErrorTemplate = trueFalseTemplate({
  id: "m05-strat-erreur-argent-facile",
  conceptId: "m05-strategies-classiques",
  difficulty: "medium",
  statement: {
    fr: "Un straddle ou un strangle acheté est une stratégie \"gagnante à tous les coups\", puisqu'elle profite d'un mouvement dans n'importe quelle direction.",
    en: "A bought straddle or strangle is a \"can't-lose\" strategy, since it profits from a move in any direction.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le straddle/strangle profite d'un mouvement AMPLE, dans n'importe quel sens, mais perd de l'argent si le sous-jacent reste proche de son niveau initial jusqu'à l'échéance (les deux primes payées sont alors perdues). Ce n'est pas une garantie de gain, mais un pari sur l'amplitude du mouvement, qui peut tout aussi bien échouer qu'un pari directionnel classique.",
    en: "False: a straddle/strangle profits from a LARGE move, in either direction, but loses money if the underlying stays close to its initial level until expiry (both premiums paid are then lost). This isn't a guaranteed win, but a bet on the move's size, which can fail just as a classic directional bet can.",
  },
  commonMistake: {
    fr: "Confondre \"indifférent à la direction\" avec \"garanti gagnant\", en oubliant que l'absence de mouvement suffisant reste un scénario perdant.",
    en: "Confusing \"indifferent to direction\" with \"guaranteed to win\", forgetting that insufficient movement remains a losing scenario.",
  },
});

const earningsStraddleScenarioTemplate = mcqTemplate({
  id: "m05-strat-scenario-resultats-annuels",
  conceptId: "m05-strategies-classiques",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Avant la publication des résultats annuels d'une entreprise, un investisseur anticipe un mouvement important du cours mais n'a aucune idée du sens (bonne ou mauvaise surprise). Quelle famille de stratégies correspond le mieux à cette vue ?",
    en: "Before a company's annual earnings release, an investor expects a large price move but has no idea of the direction (good or bad surprise). Which strategy family best fits this view?",
  },
  choices: [
    { id: "straddle-strangle", label: { fr: "Straddle ou strangle : parier sur l'amplitude du mouvement sans prendre position sur sa direction", en: "Straddle or strangle: betting on the move's magnitude without taking a view on its direction" } },
    { id: "bull-spread", label: { fr: "Bull call spread, qui convient mieux ici", en: "Bull call spread, which fits better here" } },
    { id: "covered-call", label: { fr: "Call couvert, qui convient mieux ici", en: "Covered call, which fits better here" } },
  ],
  correctId: "straddle-strangle",
  hint: { fr: "Aucune vue directionnelle, juste une anticipation de mouvement important : quelle stratégie ne parie précisément PAS sur la direction ?", en: "No directional view, just an expectation of a big move: which strategy precisely does NOT bet on direction?" },
  explanation: {
    fr: "Une publication de résultats crée une incertitude sur l'AMPLEUR du mouvement, sans direction claire a priori : le straddle (strikes identiques) ou le strangle (strikes différents, moins cher mais demandant un mouvement plus large) sont les stratégies classiques adaptées à ce type de vue, contrairement aux spreads directionnels ou au call couvert qui supposent déjà une opinion sur le sens du marché.",
    en: "An earnings release creates uncertainty about the SIZE of the move, with no clear a priori direction: the straddle (identical strikes) or the strangle (different strikes, cheaper but requiring a bigger move) are the classic strategies suited to this kind of view, unlike directional spreads or the covered call which already assume an opinion on the market's direction.",
  },
  commonMistake: {
    fr: "Choisir une stratégie directionnelle (spread) alors que l'investisseur n'a précisément aucune vue sur la direction du mouvement attendu.",
    en: "Choosing a directional strategy (spread) when the investor precisely has no view on the expected move's direction.",
  },
});

const collarProtectionScenarioTemplate = mcqTemplate({
  id: "m05-strat-scenario-collar-protection",
  conceptId: "m05-strategies-classiques",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un actionnaire de longue date veut se protéger contre une baisse significative de son action sans payer de prime nette importante, et accepte de renoncer à une partie du potentiel de hausse. Quelle structure répond le mieux à ce besoin ?",
    en: "A long-time shareholder wants protection against a significant stock decline without paying a large net premium, and is willing to give up some upside potential. Which structure best fits this need?",
  },
  choices: [
    { id: "collar", label: { fr: "Un collar : acheter un put de protection, financé par la vente d'un call au-dessus du cours actuel", en: "A collar: buy a protective put, funded by selling a call above the current price" } },
    { id: "put-only", label: { fr: "Acheter simplement un put, sans se soucier du coût de la prime", en: "Simply buy a put, without worrying about the premium's cost" } },
    { id: "sell-stock", label: { fr: "Vendre immédiatement toute la position en actions", en: "Immediately sell the entire stock position" } },
  ],
  correctId: "collar",
  hint: { fr: "L'objectif combine deux contraintes : protection à la baisse ET coût net limité, quitte à plafonner la hausse.", en: "The goal combines two constraints: downside protection AND a limited net cost, even if it means capping the upside." },
  explanation: {
    fr: "Le collar répond exactement à ce double objectif : le put de protection limite la perte en cas de baisse, tandis que la vente du call finance (en tout ou partie) le coût de ce put, réduisant fortement voire annulant la prime nette à payer — en échange, l'actionnaire renonce au potentiel de hausse au-delà du strike du call vendu, un compromis explicite entre protection et coût.",
    en: "The collar exactly answers this dual goal: the protective put limits the loss on a decline, while selling the call funds (in whole or part) that put's cost, greatly reducing or even eliminating the net premium to pay — in exchange, the shareholder gives up upside potential beyond the sold call's strike, an explicit trade-off between protection and cost.",
  },
  commonMistake: {
    fr: "Recommander un simple achat de put sans tenir compte de la contrainte de coût, en oubliant que le collar existe précisément pour financer cette protection.",
    en: "Recommending a simple put purchase without accounting for the cost constraint, forgetting the collar exists precisely to fund that protection.",
  },
});

export const templates: QuestionTemplate[] = [
  bullSpreadNumericTemplate,
  directionVsVolTemplate,
  strangleCostTemplate,
  collarVocabTemplate,
  comprehensionTemplate,
  bullVsBearSpreadComparisonTemplate,
  whatIfVolRisesTemplate,
  whatIfPinnedTemplate,
  coveredCallNumericTemplate,
  freeMoneyErrorTemplate,
  earningsStraddleScenarioTemplate,
  collarProtectionScenarioTemplate,
];
