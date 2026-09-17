import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

const ASSETS = ["EUR/USD", "GBP/USD", "or", "pétrole"] as const;
const ASSETS_EN = { "EUR/USD": "EUR/USD", "GBP/USD": "GBP/USD", or: "gold", "pétrole": "oil" } as const;

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const inceptionValueTemplate: QuestionTemplate = {
  id: "m02-forward-value-inception",
  conceptId: "m02-forward-contract-value",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const asset = pick(rng, ASSETS);
    return {
      prompt: {
        fr: `À la conclusion, hors frais, quelle est normalement la valeur d'un forward sur ${asset} conclu au prix à terme de marché ?`,
        en: `At inception, ignoring fees, what is normally the value of a forward on ${ASSETS_EN[asset]} entered into at the market forward price?`,
      },
      choices: buildChoices([
        { id: "zero", label: { fr: "Zéro", en: "Zero" } },
        { id: "spot", label: { fr: "Le prix spot du sous-jacent", en: "The underlying spot price" } },
        { id: "delivery", label: { fr: "Le prix de livraison", en: "The delivery price" } },
      ]),
      correctChoiceIds: ["zero"],
      explanation: {
        fr: "La valeur initiale est nulle pour un forward conclu au prix à terme de marché, hors frais. Le prix de livraison et le prix spot sont d'autres grandeurs.",
        en: "The initial value is zero for a forward entered into at the market forward price, ignoring fees. The delivery price and the spot price are different quantities.",
      },
      commonMistake: {
        fr: "Confondre la valeur du contrat (nulle à la conclusion) avec le prix de livraison (non nul, fixé par le prix forward du jour).",
        en: "Confusing the contract's value (zero at inception) with the delivery price (non-zero, set by that day's forward price).",
      },
    };
  },
};

const deliveryPriceFixedTemplate: QuestionTemplate = {
  id: "m02-forward-delivery-price-fixed",
  conceptId: "m02-forward-contract-value",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const asset = pick(rng, ASSETS);
    return {
      prompt: {
        fr: `Le prix de livraison K d'un forward sur ${asset} déjà conclu évolue avec le prix forward de marché jusqu'à l'échéance.`,
        en: `The delivery price K of an existing forward on ${ASSETS_EN[asset]} moves together with the market forward price until maturity.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: {
        fr: "Distinguez ce qui est figé à la conclusion de ce qui continue à bouger sur le marché.",
        en: "Distinguish what is frozen at inception from what keeps moving in the market.",
      },
      correctChoiceIds: ["false"],
      explanation: {
        fr: "Faux : K est fixé une fois pour toutes à la conclusion du contrat. C'est le prix forward de marché F(t) qui continue d'évoluer, pas K.",
        en: "False: K is fixed once and for all at inception. It is the market forward price F(t) that keeps moving, not K.",
      },
      commonMistake: {
        fr: "Penser que « prix forward » désigne toujours la même grandeur : il faut distinguer le prix forward de marché (mouvant) du prix de livraison contractuel (figé).",
        en: "Assuming \"forward price\" always refers to the same quantity: the market forward price (moving) must be distinguished from the contractual delivery price (frozen).",
      },
    };
  },
};

function computeValue(fT: number, k: number, r: number, tMinusT: number, long: boolean): number {
  const gap = long ? fT - k : k - fT;
  return Math.round(gap * Math.exp(-r * tMinusT) * 100000) / 100000;
}

const computeValueTemplate: QuestionTemplate = {
  id: "m02-forward-compute-value",
  conceptId: "m02-forward-contract-value",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const k = randomFloat(rng, 0.85, 1.15, 4);
    const fT = randomFloat(rng, 0.85, 1.15, 4);
    const r = randomFloat(rng, 0.005, 0.045, 4);
    const months = randomInt(rng, 1, 6);
    const tMinusT = months / 12;
    const long = pick(rng, [true, false]);
    const value = computeValue(fT, k, r, tMinusT, long);

    return {
      isScenario: true,
      prompt: {
        fr: `Une position ${long ? "longue" : "courte"} a un prix de livraison K = ${fmt(k, "fr")}. Le prix forward de marché actuel pour la même échéance est F_t = ${fmt(fT, "fr")}, le taux sans risque est r = ${fmt(r * 100, "fr", 2)}% (composition continue) et il reste T−t = ${months}/12 an. Calculez V_t (5 décimales).`,
        en: `A ${long ? "long" : "short"} position has delivery price K = ${fmt(k, "en")}. The current market forward price for the same maturity is F_t = ${fmt(fT, "en")}, the risk-free rate is r = ${fmt(r * 100, "en", 2)}% (continuous compounding) and T−t = ${months}/12 year remains. Compute V_t (5 decimals).`,
      },
      numericUnit: { fr: "par unité de sous-jacent", en: "per unit of underlying" },
      numericTolerance: "± 0,0005",
      hint: {
        fr: long ? "V_t = (F_t − K) e^(−r(T−t))." : "V_t = (K − F_t) e^(−r(T−t)).",
        en: long ? "V_t = (F_t − K) e^(−r(T−t))." : "V_t = (K − F_t) e^(−r(T−t)).",
      },
      numeric: { value, tolerance: 0.0005 },
      calculation: {
        fr: `V_t = (${long ? `${fmt(fT, "fr")} − ${fmt(k, "fr")}` : `${fmt(k, "fr")} − ${fmt(fT, "fr")}`}) × e^(−${fmt(r, "fr")} × ${months}/12) ≈ ${fmt(value, "fr", 5)}.`,
        en: `V_t = (${long ? `${fmt(fT, "en")} − ${fmt(k, "en")}` : `${fmt(k, "en")} − ${fmt(fT, "en")}`}) × e^(−${fmt(r, "en")} × ${months}/12) ≈ ${fmt(value, "en", 5)}.`,
      },
      explanation: {
        fr: "On actualise l'écart entre le prix forward de marché actuel et le prix de livraison figé, au taux sans risque, sur la durée restante.",
        en: "The gap between the current market forward price and the frozen delivery price is discounted at the risk-free rate, over the remaining time.",
      },
      commonMistake: {
        fr: long
          ? "Inverser le signe de l'écart (K − F_t au lieu de F_t − K) pour une position longue."
          : "Oublier d'inverser le signe de l'écart pour une position courte : c'est (K − F_t), pas (F_t − K).",
        en: long
          ? "Flipping the sign of the gap (K − F_t instead of F_t − K) for a long position."
          : "Forgetting to flip the sign of the gap for a short position: it's (K − F_t), not (F_t − K).",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m02-forward-value-vocab",
  conceptId: "m02-forward-contract-value",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "La valeur d'un forward à sa conclusion est nulle uniquement si le prix de livraison K a été fixé égal au prix forward de ______.",
      en: "A forward's value at inception is zero only if the delivery price K was set equal to the ______ forward price.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["marche", "marché", "market"],
    hint: {
      fr: "C'est la grandeur qui bouge en continu, par opposition à K qui est figé.",
      en: "It's the quantity that keeps moving, as opposed to K which is frozen.",
    },
    explanation: {
      fr: "V_0 = 0 seulement quand K = F(0), le prix forward de marché du jour de la conclusion.",
      en: "V_0 = 0 only when K = F(0), the market forward price on the day the contract is entered into.",
    },
    commonMistake: {
      fr: "Répondre « spot » : c'est le prix forward, pas le prix spot, qui doit égaler K à la conclusion.",
      en: "Answering \"spot\": it's the forward price, not the spot price, that must equal K at inception.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m02-forward-value-comprehension-utilite",
  conceptId: "m02-forward-contract-value",
  difficulty: "medium",
  prompt: {
    fr: "Le payoff d'un forward à l'échéance (S_T − K pour un long) ne dépend que de K et de S_T. Pourquoi a-t-on quand même besoin d'une formule de valeur V_t AVANT l'échéance ?",
    en: "A forward's payoff at maturity (S_T − K for a long) depends only on K and S_T. Why do we still need a value formula V_t BEFORE maturity?",
  },
  choices: [
    { id: "mark-value", label: { fr: "Pour connaître la valeur de marché actuelle de la position, par exemple pour la comptabiliser ou la revendre avant l'échéance", en: "To know the position's current market value, e.g. to account for it or resell it before maturity" } },
    { id: "useless", label: { fr: "Ce n'est jamais utile, seule la valeur à l'échéance compte réellement", en: "It's never useful, only the value at maturity truly matters" } },
    { id: "replace-payoff", label: { fr: "Pour remplacer complètement le calcul du payoff final", en: "To completely replace the final payoff calculation" } },
  ],
  correctId: "mark-value",
  hint: { fr: "Une position a une valeur de marché à tout instant, pas seulement à l'échéance.", en: "A position has a market value at every moment, not just at maturity." },
  explanation: {
    fr: "Même si le règlement final ne dépend que de S_T et K, la position a une valeur de marché à chaque instant avant l'échéance (utile pour la comptabilité en valeur de marché, la revente à un tiers, ou le calcul d'un appel de marge) : c'est exactement ce que mesure V_t, en anticipant et en actualisant le gain ou la perte déjà \"gagné\" à cet instant.",
    en: "Even though final settlement depends only on S_T and K, the position has a market value at every moment before maturity (useful for mark-to-market accounting, reselling to a third party, or computing a margin call): this is exactly what V_t measures, by anticipating and discounting the gain or loss already \"earned\" at that moment.",
  },
  commonMistake: {
    fr: "Croire qu'un forward n'a de valeur qu'à l'échéance, en oubliant qu'il peut être valorisé, cédé ou comptabilisé à tout moment de sa vie.",
    en: "Believing a forward only has value at maturity, forgetting it can be valued, transferred, or accounted for at any point in its life.",
  },
});

const longVsShortValueComparisonTemplate = mcqTemplate({
  id: "m02-forward-value-comparaison-long-court",
  conceptId: "m02-forward-contract-value",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "À un instant t donné, une position longue sur un forward a une valeur V_t strictement positive. Quelle est nécessairement la valeur de la position courte symétrique (même contrat, contrepartie opposée) au même instant ?",
    en: "At a given instant t, a long forward position has a strictly positive value V_t. What must the symmetric short position's value (same contract, opposite counterparty) be at that same instant?",
  },
  choices: [
    { id: "opposite", label: { fr: "Exactement l'opposé : −V_t, strictement négative", en: "Exactly the opposite: −V_t, strictly negative" } },
    { id: "same", label: { fr: "Exactement la même valeur V_t, positive", en: "Exactly the same positive value V_t" } },
    { id: "zero", label: { fr: "Toujours nulle, quelle que soit la valeur du long", en: "Always zero, whatever the long's value is" } },
  ],
  correctId: "opposite",
  hint: { fr: "Un forward est un jeu à somme nulle entre les deux parties, à chaque instant, pas seulement à l'échéance.", en: "A forward is a zero-sum game between the two parties, at every instant, not just at maturity." },
  explanation: {
    fr: "Le forward est un contrat bilatéral où ce que gagne l'un est structurellement ce que perd l'autre, à tout instant : V_t(long) = (F_t − K)e^{−r(T−t)} et V_t(court) = (K − F_t)e^{−r(T−t)} = −V_t(long). Les deux valeurs sont donc toujours exactement opposées.",
    en: "A forward is a bilateral contract where one side's gain is structurally the other's loss, at every instant: V_t(long) = (F_t − K)e^{−r(T−t)} and V_t(short) = (K − F_t)e^{−r(T−t)} = −V_t(long). The two values are therefore always exactly opposite.",
  },
  commonMistake: {
    fr: "Croire que la valeur d'un forward n'est symétrique qu'à l'échéance, en oubliant que cette symétrie vaut à tout instant t, pas seulement à T.",
    en: "Believing a forward's value is only symmetric at maturity, forgetting this symmetry holds at every instant t, not just at T.",
  },
});

const whatIfFtMovesAwayTemplate = mcqTemplate({
  id: "m02-forward-value-whatif-ft-eloigne",
  conceptId: "m02-forward-contract-value",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs, si le prix forward de marché F_t s'éloigne encore plus au-dessus de K après la conclusion du contrat, que devient V_t pour une position LONGUE ?",
    en: "All else equal, if the market forward price F_t moves even further above K after the contract's inception, what happens to V_t for a LONG position?",
  },
  choices: [
    { id: "increases", label: { fr: "V_t augmente (devient plus positif)", en: "V_t increases (becomes more positive)" } },
    { id: "decreases", label: { fr: "V_t diminue (devient plus négatif)", en: "V_t decreases (becomes more negative)" } },
    { id: "unchanged", label: { fr: "V_t reste inchangé, seul K compte", en: "V_t stays unchanged, only K matters" } },
  ],
  correctId: "increases",
  hint: { fr: "V_t = (F_t − K) × e^(−r(T−t)) pour un long : regardez l'effet d'un F_t plus grand.", en: "V_t = (F_t − K) × e^(−r(T−t)) for a long: look at the effect of a larger F_t." },
  explanation: {
    fr: "Pour une position longue, V_t croît avec F_t : plus le prix forward de marché s'écarte au-dessus du prix de livraison fixé K, plus la position longue vaut cher, puisqu'elle s'est engagée à acheter moins cher (K) que ce que le marché exige désormais (F_t).",
    en: "For a long position, V_t rises with F_t: the further the market forward price moves above the fixed delivery price K, the more valuable the long position becomes, since it committed to buying cheaper (K) than what the market now requires (F_t).",
  },
  commonMistake: {
    fr: "Confondre l'effet de F_t pour une position longue et pour une position courte, qui réagissent en sens opposés au même mouvement de F_t.",
    en: "Confusing the effect of F_t for a long position and for a short position, which react in opposite directions to the same F_t move.",
  },
});

const whatIfNearMaturityTemplate = mcqTemplate({
  id: "m02-forward-value-whatif-proche-echeance",
  conceptId: "m02-forward-contract-value",
  difficulty: "medium",
  prompt: {
    fr: "Quand T−t se rapproche de zéro (l'échéance approche), que devient le facteur d'actualisation e^(−r(T−t)) dans la formule de V_t, et quel effet cela a-t-il sur V_t ?",
    en: "As T−t approaches zero (maturity nears), what happens to the discount factor e^(−r(T−t)) in the V_t formula, and what effect does that have on V_t?",
  },
  choices: [
    { id: "one", label: { fr: "Le facteur tend vers 1, donc V_t converge vers le payoff non actualisé (F_t − K ou K − F_t)", en: "The factor tends to 1, so V_t converges to the undiscounted payoff (F_t − K or K − F_t)" } },
    { id: "zero", label: { fr: "Le facteur tend vers 0, donc V_t s'annule juste avant l'échéance", en: "The factor tends to 0, so V_t vanishes just before maturity" } },
    { id: "infinite", label: { fr: "Le facteur diverge vers l'infini, rendant V_t incalculable", en: "The factor diverges to infinity, making V_t incalculable" } },
  ],
  correctId: "one",
  hint: { fr: "e^0 = 1 : que devient l'exposant −r(T−t) quand T−t → 0 ?", en: "e^0 = 1: what happens to the exponent −r(T−t) as T−t → 0?" },
  explanation: {
    fr: "Quand T−t → 0, l'exposant −r(T−t) → 0, donc e^(−r(T−t)) → 1 : il n'y a plus de temps à actualiser. V_t converge alors naturellement vers le payoff final non actualisé, ce qui est cohérent puisqu'à l'échéance même, F_T = S_T et V_T = S_T − K (le payoff classique).",
    en: "As T−t → 0, the exponent −r(T−t) → 0, so e^(−r(T−t)) → 1: there is no more time left to discount. V_t then naturally converges to the final undiscounted payoff, which is consistent since at maturity itself, F_T = S_T and V_T = S_T − K (the classic payoff).",
  },
  commonMistake: {
    fr: "Croire que le facteur d'actualisation s'annule près de l'échéance, alors qu'il tend vers 1, pas vers 0.",
    en: "Believing the discount factor vanishes near maturity, when it tends to 1, not to 0.",
  },
});

const valueSensitivityNumericTemplate: QuestionTemplate = {
  id: "m02-forward-value-sensibilite-calcul",
  conceptId: "m02-forward-contract-value",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const r = randomFloat(rng, 0.01, 0.05, 4);
    const months = randomInt(rng, 1, 9);
    const tMinusT = months / 12;
    const deltaF = randomFloat(rng, 0.005, 0.05, 4);
    const long = pick(rng, [true, false]);
    const discount = Math.exp(-r * tMinusT);
    const deltaV = Math.round((long ? deltaF : -deltaF) * discount * 100000) / 100000;

    return {
      isScenario: true,
      prompt: {
        fr: `Une position ${long ? "longue" : "courte"} a un taux sans risque r = ${(r * 100).toFixed(2)}% (composition continue) et il reste T−t = ${months}/12 an. Si le prix forward de marché F_t augmente de ${fmt(deltaF, "fr")}, de combien varie V_t ?`,
        en: `A ${long ? "long" : "short"} position has risk-free rate r = ${(r * 100).toFixed(2)}% (continuous compounding) and T−t = ${months}/12 year remains. If the market forward price F_t rises by ${fmt(deltaF, "en")}, how much does V_t change?`,
      },
      numericUnit: { fr: "par unité de sous-jacent", en: "per unit of underlying" },
      numericTolerance: "± 0,0005",
      hint: {
        fr: `ΔV_t = ${long ? "+" : "−"}ΔF_t × e^(−r(T−t)) : la sensibilité de V_t à F_t est le facteur d'actualisation, au signe près.`,
        en: `ΔV_t = ${long ? "+" : "−"}ΔF_t × e^(−r(T−t)): V_t's sensitivity to F_t is the discount factor, up to sign.`,
      },
      numeric: { value: deltaV, tolerance: 0.0005 },
      calculation: {
        fr: `ΔV_t = ${long ? "+" : "−"}${fmt(deltaF, "fr")} × e^(−${r.toFixed(4)} × ${months}/12) ≈ ${long ? "+" : "−"}${fmt(deltaF, "fr")} × ${discount.toFixed(4)} ≈ ${fmt(deltaV, "fr", 5)}.`,
        en: `ΔV_t = ${long ? "+" : "−"}${fmt(deltaF, "en")} × e^(−${r.toFixed(4)} × ${months}/12) ≈ ${long ? "+" : "−"}${fmt(deltaF, "en")} × ${discount.toFixed(4)} ≈ ${fmt(deltaV, "en", 5)}.`,
      },
      explanation: {
        fr: "Comme V_t est une fonction affine de F_t (à K, r, T−t fixés), sa sensibilité à une petite variation de F_t est simplement le facteur d'actualisation e^(−r(T−t)), avec le signe de la position — un résultat proche de la notion de \"delta\" d'un dérivé.",
        en: "Since V_t is an affine function of F_t (with K, r, T−t fixed), its sensitivity to a small change in F_t is simply the discount factor e^(−r(T−t)), with the position's sign — a result closely related to a derivative's \"delta\".",
      },
      commonMistake: {
        fr: "Oublier d'appliquer le facteur d'actualisation à la variation ΔF_t, en supposant à tort que ΔV_t = ΔF_t sans ajustement.",
        en: "Forgetting to apply the discount factor to the change ΔF_t, wrongly assuming ΔV_t = ΔF_t with no adjustment.",
      },
    };
  },
};

const forgetDiscountingErrorTemplate = trueFalseTemplate({
  id: "m02-forward-value-erreur-oubli-actualisation",
  conceptId: "m02-forward-contract-value",
  difficulty: "medium",
  statement: {
    fr: "Avant l'échéance, la valeur V_t d'un forward long peut être calculée simplement comme F_t − K, sans avoir besoin d'actualiser cet écart.",
    en: "Before maturity, a long forward's value V_t can simply be computed as F_t − K, with no need to discount that gap.",
  },
  correct: false,
  explanation: {
    fr: "Faux : la formule correcte est V_t = (F_t − K) × e^(−r(T−t)), qui actualise l'écart au taux sans risque sur le temps restant. Omettre l'actualisation surestime légèrement la valeur en valeur absolue (sauf exactement à l'échéance, où T−t = 0 et le facteur vaut 1).",
    en: "False: the correct formula is V_t = (F_t − K) × e^(−r(T−t)), which discounts the gap at the risk-free rate over the remaining time. Omitting the discounting slightly overstates the value in absolute terms (except exactly at maturity, where T−t = 0 and the factor equals 1).",
  },
  commonMistake: {
    fr: "Oublier le facteur d'actualisation e^(−r(T−t)) en confondant V_t avec le payoff final non actualisé.",
    en: "Forgetting the discount factor e^(−r(T−t)), confusing V_t with the final undiscounted payoff.",
  },
});

const earlyUnwindScenarioTemplate = mcqTemplate({
  id: "m02-forward-value-scenario-denouement-anticipe",
  conceptId: "m02-forward-contract-value",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une entreprise a un forward long en cours (K fixé il y a 3 mois) et veut le dénouer aujourd'hui avant l'échéance, en le cédant à sa banque. Quel montant la banque doit-elle logiquement lui verser (ou lui facturer) pour ce dénouement anticipé ?",
    en: "A company has an outstanding long forward (K fixed 3 months ago) and wants to unwind it today before maturity, by transferring it to its bank. What amount should the bank logically pay (or charge) for this early unwind?",
  },
  choices: [
    { id: "vt", label: { fr: "La valeur actuelle du contrat, V_t = (F_t − K) × e^(−r(T−t))", en: "The contract's current value, V_t = (F_t − K) × e^(−r(T−t))" } },
    { id: "zero", label: { fr: "Rien : un dénouement anticipé est toujours gratuit", en: "Nothing: an early unwind is always free" } },
    { id: "k", label: { fr: "Le prix de livraison K initial, sans autre ajustement", en: "The original delivery price K, with no other adjustment" } },
  ],
  correctId: "vt",
  hint: { fr: "Le prix juste d'un dénouement anticipé est exactement ce que vaut le contrat aujourd'hui.", en: "The fair price for an early unwind is exactly what the contract is worth today." },
  explanation: {
    fr: "Céder un contrat avant l'échéance à sa juste valeur signifie recevoir (ou payer) exactement V_t, la valeur actuelle de la position : c'est le montant qui rend l'entreprise financièrement indifférente entre conserver le contrat jusqu'à l'échéance et le dénouer aujourd'hui.",
    en: "Transferring a contract before maturity at fair value means receiving (or paying) exactly V_t, the position's current value: this is the amount that makes the company financially indifferent between holding the contract to maturity and unwinding it today.",
  },
  commonMistake: {
    fr: "Croire qu'un dénouement anticipé est toujours gratuit ou se fait au prix de livraison K, en oubliant que la position a acquis une valeur de marché V_t depuis la conclusion.",
    en: "Believing an early unwind is always free or happens at the delivery price K, forgetting the position has gained a market value V_t since inception.",
  },
});

const balanceSheetScenarioTemplate = mcqTemplate({
  id: "m02-forward-value-scenario-comptabilisation",
  conceptId: "m02-forward-contract-value",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "En fin de trimestre, un service comptable doit inscrire au bilan la juste valeur d'un forward en cours conclu il y a 2 mois, dont le K a été fixé égal au F0 de l'époque. Que doit-il inscrire ?",
    en: "At quarter-end, an accounting team must record on the balance sheet the fair value of an outstanding forward entered into 2 months ago, whose K was set equal to the F0 at the time. What should it record?",
  },
  choices: [
    { id: "vt-now", label: { fr: "V_t calculé aujourd'hui, généralement non nul puisque F_t a évolué depuis la conclusion", en: "V_t computed today, generally non-zero since F_t has moved since inception" } },
    { id: "always-zero", label: { fr: "Toujours zéro, puisque la valeur était nulle à la conclusion", en: "Always zero, since the value was zero at inception" } },
    { id: "k", label: { fr: "Le prix de livraison K, comme s'il s'agissait d'un actif détenu au prix d'achat", en: "The delivery price K, as if it were an asset held at its purchase price" } },
  ],
  correctId: "vt-now",
  hint: { fr: "La valeur nulle à la conclusion (V_0 = 0) ne reste vraie qu'à l'instant de la conclusion, pas indéfiniment.", en: "The zero value at inception (V_0 = 0) only holds at the moment of inception, not indefinitely." },
  explanation: {
    fr: "V_0 = 0 seulement au moment précis de la conclusion, quand K était égal au F0 du jour. Deux mois plus tard, le prix forward de marché F_t a généralement bougé, donnant à la position une valeur V_t non nulle qui doit être comptabilisée à sa juste valeur de marché à la date de clôture, conformément aux principes de comptabilisation en valeur de marché (mark-to-market) des dérivés.",
    en: "V_0 = 0 only at the precise moment of inception, when K equaled that day's F0. Two months later, the market forward price F_t has generally moved, giving the position a non-zero V_t that must be recorded at its fair market value on the closing date, in line with mark-to-market accounting principles for derivatives.",
  },
  commonMistake: {
    fr: "Supposer qu'un forward garde une valeur comptable nulle pendant toute sa durée de vie, en confondant sa valeur à la conclusion (toujours nulle) avec sa valeur à tout instant ultérieur (généralement non nulle).",
    en: "Assuming a forward keeps a zero book value throughout its life, confusing its value at inception (always zero) with its value at any later instant (generally non-zero).",
  },
});

export const templates: QuestionTemplate[] = [
  inceptionValueTemplate,
  deliveryPriceFixedTemplate,
  computeValueTemplate,
  vocabTemplate,
  comprehensionTemplate,
  longVsShortValueComparisonTemplate,
  whatIfFtMovesAwayTemplate,
  whatIfNearMaturityTemplate,
  valueSensitivityNumericTemplate,
  forgetDiscountingErrorTemplate,
  earlyUnwindScenarioTemplate,
  balanceSheetScenarioTemplate,
];
