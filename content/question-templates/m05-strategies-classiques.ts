import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

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

export const templates: QuestionTemplate[] = [bullSpreadNumericTemplate, directionVsVolTemplate, strangleCostTemplate, collarVocabTemplate];
