import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const profitNumericTemplate: QuestionTemplate = {
  id: "m01-short-profit-calcul",
  conceptId: "m01-vente-decouvert",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const priceInitial = randomInt(rng, 30, 150);
    const priceFinal = priceInitial + randomInt(rng, -40, 40) || priceInitial - 5;
    const quantity = randomInt(rng, 100, 2000);
    const fees = randomInt(rng, 50, 800);
    const profit = (priceInitial - priceFinal) * quantity - fees;

    return {
      isScenario: true,
      prompt: {
        fr: `Un investisseur vend à découvert ${fmt(quantity, "fr")} actions à ${fmt(priceInitial, "fr")}, puis les rachète à ${fmt(priceFinal, "fr")} pour les restituer. Les frais d'emprunt cumulés sont de ${fmt(fees, "fr")}. Quel est le profit net (peut être négatif) ?`,
        en: `An investor shorts ${fmt(quantity, "en")} shares at ${fmt(priceInitial, "en")}, then buys them back at ${fmt(priceFinal, "en")} to return them. Cumulative borrow fees are ${fmt(fees, "en")}. What is the net profit (can be negative)?`,
      },
      numericUnit: { fr: "même devise que le prix", en: "same currency as the price" },
      numericTolerance: "± 5",
      hint: { fr: "Profit = (Prix vente − Prix rachat) × Quantité − Frais.", en: "Profit = (Sale price − Buy-back price) × Quantity − Fees." },
      numeric: { value: profit, tolerance: 5 },
      calculation: {
        fr: `Profit = (${fmt(priceInitial, "fr")}−${fmt(priceFinal, "fr")})×${fmt(quantity, "fr")} − ${fmt(fees, "fr")} = ${fmt(profit, "fr")}.`,
        en: `Profit = (${fmt(priceInitial, "en")}−${fmt(priceFinal, "en")})×${fmt(quantity, "en")} − ${fmt(fees, "en")} = ${fmt(profit, "en")}.`,
      },
      explanation: {
        fr: "Le profit d'une vente à découvert vient d'une baisse de prix ; les frais d'emprunt réduisent toujours ce profit, même si le pari est gagnant.",
        en: "A short sale's profit comes from a price decline; borrow fees always reduce that profit, even when the bet is correct.",
      },
      commonMistake: {
        fr: "Inverser prix de vente et prix de rachat dans la formule, ou oublier de soustraire les frais.",
        en: "Swapping sale and buy-back prices in the formula, or forgetting to subtract the fees.",
      },
    };
  },
};

const unlimitedLossTemplate: QuestionTemplate = {
  id: "m01-short-perte-illimitee",
  conceptId: "m01-vente-decouvert",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Comparez la perte maximale théorique d'une position longue (achat d'une action) à celle d'une position courte (vente à découvert de la même action).",
      en: "Compare the theoretical maximum loss of a long position (buying a stock) to that of a short position (short-selling the same stock).",
    },
    choices: buildChoices([
      { id: "short-unlimited", label: { fr: "La position longue a une perte plafonnée à sa mise ; la position courte a une perte théoriquement illimitée", en: "The long position's loss is capped at its stake; the short position's loss is theoretically unlimited" } },
      { id: "same", label: { fr: "Les deux ont une perte maximale identique, plafonnée à la mise initiale", en: "Both have the same maximum loss, capped at the initial stake" } },
    ]),
    hint: { fr: "Le prix d'une action peut-il monter sans limite connue ?", en: "Can a stock's price rise with no known ceiling?" },
    correctChoiceIds: ["short-unlimited"],
    explanation: {
      fr: "Une position longue perd au maximum sa mise initiale (le prix ne peut pas descendre sous zéro) ; une position courte doit racheter le titre à un prix qui peut monter sans limite connue, donc sa perte est théoriquement illimitée.",
      en: "A long position loses at most its initial stake (the price can't fall below zero); a short position must buy back the security at a price that can rise with no known ceiling, so its loss is theoretically unlimited.",
    },
    commonMistake: {
      fr: "Croire que l'asymétrie de risque entre position longue et courte n'existe pas, ou est négligeable.",
      en: "Believing the risk asymmetry between long and short positions doesn't exist, or is negligible.",
    },
  }),
};

const dividendOwedTemplate: QuestionTemplate = {
  id: "m01-short-dividende",
  conceptId: "m01-vente-decouvert",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Si l'action vendue à découvert verse un dividende pendant la période d'emprunt, le vendeur à découvert conserve ce dividende sans obligation envers le prêteur des titres.",
      en: "If the shorted stock pays a dividend during the borrow period, the short seller keeps that dividend with no obligation to the securities lender.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : tout dividende versé pendant la période d'emprunt est dû au prêteur des titres, pas gardé par le vendeur à découvert — c'est un coût supplémentaire de la stratégie.",
      en: "False: any dividend paid during the borrow period is owed to the securities lender, not kept by the short seller — an additional cost of the strategy.",
    },
    commonMistake: {
      fr: "Oublier cette obligation dans le calcul du coût réel d'une vente à découvert.",
      en: "Forgetting this obligation when computing a short sale's real cost.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-short-vocab",
  conceptId: "m01-vente-decouvert",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une hausse brutale du prix qui force de nombreux vendeurs à découvert à racheter en urgence, accélérant encore la hausse, s'appelle un short ______.",
      en: "A sharp price rise that forces many short sellers to urgently buy back, further accelerating the rise, is called a short ______.",
    },
    fillBlankPlaceholder: { fr: "un mot anglais", en: "one word" },
    acceptedAnswers: ["squeeze"],
    hint: { fr: "Une image de « compression ».", en: "An image of being \"squeezed\"." },
    explanation: {
      fr: "Un short squeeze auto-alimente la hausse : plus le prix monte, plus les vendeurs à découvert doivent racheter, ce qui pousse encore le prix à la hausse.",
      en: "A short squeeze is self-reinforcing: the more the price rises, the more short sellers must buy back, which pushes the price up further.",
    },
    commonMistake: {
      fr: "Confondre le short squeeze avec une simple hausse de prix normale sans ce mécanisme d'auto-renforcement.",
      en: "Confusing a short squeeze with a simple normal price rise lacking this self-reinforcing mechanism.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-short-comprehension-utilite",
  conceptId: "m01-vente-decouvert",
  difficulty: "easy",
  prompt: {
    fr: "Au-delà de parier sur une baisse pour spéculer, à quoi sert aussi la vente à découvert dans la gestion d'un portefeuille ?",
    en: "Beyond betting on a decline to speculate, what else is short selling used for in portfolio management?",
  },
  choices: [
    { id: "hedge", label: { fr: "Couvrir un portefeuille existant contre une baisse de marché, sans attendre de posséder le titre concerné", en: "Hedging an existing portfolio against a market decline, without needing to already own the security involved" } },
    { id: "only-speculation", label: { fr: "Rien d'autre : c'est exclusivement un outil spéculatif sans usage de couverture", en: "Nothing else: it's exclusively a speculative tool with no hedging use" } },
  ],
  correctId: "hedge",
  hint: { fr: "Vendre à découvert un indice peut compenser la baisse d'un portefeuille d'actions détenu par ailleurs.", en: "Shorting an index can offset the decline of a stock portfolio held elsewhere." },
  explanation: {
    fr: "La vente à découvert permet aussi de couvrir un portefeuille déjà détenu contre un risque de baisse générale, pas seulement de spéculer sur un titre précis.",
    en: "Short selling can also hedge an already-held portfolio against a general decline risk, not just speculate on a specific security.",
  },
  commonMistake: {
    fr: "Réduire la vente à découvert à un simple outil spéculatif, en oubliant son rôle de couverture.",
    en: "Reducing short selling to a purely speculative tool, forgetting its hedging role.",
  },
});

const ownedVsBorrowedComparisonTemplate = mcqTemplate({
  id: "m01-short-comparaison-vente-possedee",
  conceptId: "m01-vente-decouvert",
  difficulty: "medium",
  prompt: {
    fr: "Quelle est la différence entre vendre une action que l'on possède déjà et vendre à découvert une action qu'on ne possède pas ?",
    en: "What is the difference between selling a stock you already own and short-selling a stock you don't own?",
  },
  choices: [
    { id: "correct", label: { fr: "Vendre ce qu'on possède clôture simplement une position, sans risque additionnel ; la vente à découvert emprunte le titre et crée une exposition à une perte théoriquement illimitée", en: "Selling what you own simply closes a position, with no added risk; short selling borrows the security and creates exposure to a theoretically unlimited loss" } },
    { id: "same", label: { fr: "Les deux opérations ont un profil de risque strictement identique", en: "Both operations have a strictly identical risk profile" } },
  ],
  correctId: "correct",
  hint: { fr: "L'une part d'une position déjà détenue, l'autre en crée une nouvelle par l'emprunt.", en: "One starts from an already-held position, the other creates a new one via borrowing." },
  explanation: {
    fr: "Vendre un titre déjà détenu ne fait que solder une position existante, sans risque nouveau. La vente à découvert, elle, emprunte un titre non détenu et crée une obligation de rachat future à un prix inconnu, donc un risque de perte illimité.",
    en: "Selling an already-held security just closes an existing position, with no new risk. Short selling, meanwhile, borrows a security not held and creates a future buy-back obligation at an unknown price, so unlimited loss risk.",
  },
  commonMistake: {
    fr: "Assimiler toute vente d'action à une vente à découvert, en oubliant que la possession préalable change tout le profil de risque.",
    en: "Equating any stock sale with a short sale, forgetting that prior ownership changes the entire risk profile.",
  },
});

const whatIfHardToBorrowTemplate = trueFalseTemplate({
  id: "m01-short-whatif-titre-indisponible",
  conceptId: "m01-vente-decouvert",
  difficulty: "medium",
  isScenario: true,
  statement: {
    fr: "Si aucun prêteur n'est disponible pour emprunter un titre donné, un investisseur peut quand même le vendre à découvert, simplement à des frais plus élevés.",
    en: "If no lender is available to borrow a given security, an investor can still short it, simply at a higher fee.",
  },
  correct: false,
  explanation: {
    fr: "Faux : sans titre disponible à l'emprunt, la vente à découvert est tout simplement impossible, pas seulement plus chère — certains marchés imposent d'ailleurs une règle de \"locate\" obligeant à confirmer cette disponibilité avant de vendre à découvert.",
    en: "False: without an available security to borrow, short selling is simply impossible, not just more expensive — some markets even impose a \"locate\" rule requiring confirmation of this availability before shorting.",
  },
  commonMistake: {
    fr: "Croire que l'indisponibilité d'un titre à l'emprunt ne fait que renchérir la vente à découvert, sans jamais la rendre impossible.",
    en: "Believing a security's unavailability to borrow merely makes shorting pricier, never actually impossible.",
  },
});

const whatIfSqueezeTemplate = mcqTemplate({
  id: "m01-short-whatif-short-squeeze",
  conceptId: "m01-vente-decouvert",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un short squeeze démarre : le prix monte brutalement, forçant de nombreux vendeurs à découvert à racheter en urgence. Quel est l'effet de ce rachat massif sur le prix ?",
    en: "A short squeeze begins: the price spikes sharply, forcing many short sellers to urgently buy back. What is the effect of this massive buy-back on the price?",
  },
  choices: [
    { id: "amplify", label: { fr: "Il pousse encore le prix à la hausse, car les rachats en urgence sont eux-mêmes des ordres d'achat qui font monter le prix", en: "It pushes the price up further, since the urgent buy-backs are themselves buy orders that push the price up" } },
    { id: "stabilize", label: { fr: "Il stabilise le prix, car les rachats massifs compensent naturellement la hausse initiale", en: "It stabilizes the price, since the massive buy-backs naturally offset the initial rise" } },
  ],
  correctId: "amplify",
  hint: { fr: "Un rachat en urgence est un ordre d'achat comme un autre, qui a le même effet sur le prix.", en: "An urgent buy-back is a buy order like any other, with the same effect on price." },
  explanation: {
    fr: "Un short squeeze est un mécanisme auto-alimenté : la hausse du prix force des rachats, qui sont eux-mêmes des achats supplémentaires poussant le prix encore plus haut, dans une spirale qui peut être brutale.",
    en: "A short squeeze is a self-reinforcing mechanism: the price rise forces buy-backs, which are themselves additional purchases pushing the price even higher, in a spiral that can be brutal.",
  },
  commonMistake: {
    fr: "Croire que les rachats forcés des vendeurs à découvert freinent la hausse, alors qu'ils l'amplifient.",
    en: "Believing short sellers' forced buy-backs slow the rise, when they actually amplify it.",
  },
});

const breakevenPriceNumericTemplate: QuestionTemplate = {
  id: "m01-short-prix-seuil-calcul",
  conceptId: "m01-vente-decouvert",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const priceInitial = randomInt(rng, 40, 150);
    const quantity = randomInt(rng, 100, 1000);
    const fees = randomInt(rng, 50, 500);
    const breakeven = Math.round((priceInitial - fees / quantity) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un investisseur vend à découvert ${fmt(quantity, "fr")} actions à ${fmt(priceInitial, "fr")}, avec des frais d'emprunt cumulés de ${fmt(fees, "fr")}. À quel prix de rachat le profit net devient-il exactement nul (seuil de rentabilité) ?`,
        en: `An investor shorts ${fmt(quantity, "en")} shares at ${fmt(priceInitial, "en")}, with cumulative borrow fees of ${fmt(fees, "en")}. At what buy-back price does the net profit become exactly zero (breakeven)?`,
      },
      numericUnit: { fr: "même devise que le prix", en: "same currency as the price" },
      numericTolerance: "± 0.5",
      hint: { fr: "Le profit net est nul quand (P_vente − P_rachat)×Q = Frais.", en: "Net profit is zero when (P_sell − P_buyback)×Q = Fees." },
      numeric: { value: breakeven, tolerance: 0.5 },
      calculation: {
        fr: `P_rachat = P_vente − Frais/Q = ${fmt(priceInitial, "fr")} − ${fmt(fees, "fr")}/${fmt(quantity, "fr")} ≈ ${fmt(breakeven, "fr")}.`,
        en: `P_buyback = P_sell − Fees/Q = ${fmt(priceInitial, "en")} − ${fmt(fees, "en")}/${fmt(quantity, "en")} ≈ ${fmt(breakeven, "en")}.`,
      },
      explanation: {
        fr: "Contrairement au calcul direct du profit, ici il faut trouver le prix de rachat qui annule exactement ce profit — un seuil utile pour savoir jusqu'où le titre peut monter avant que le pari ne devienne perdant.",
        en: "Unlike directly computing the profit, here the buy-back price that exactly zeroes out that profit must be found — a threshold useful for knowing how far the security can rise before the bet turns into a loss.",
      },
      commonMistake: {
        fr: "Oublier de diviser les frais par la quantité avant de les soustraire du prix de vente.",
        en: "Forgetting to divide the fees by the quantity before subtracting them from the sale price.",
      },
    };
  },
};

const marginCallErrorTemplate = mcqTemplate({
  id: "m01-short-erreur-appel-marge",
  conceptId: "m01-vente-decouvert",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un investisseur vend à découvert et pense : « Le pire qui puisse m'arriver, c'est de perdre ma mise initiale, comme pour un achat classique. » Où est l'erreur ?",
    en: "An investor shorts a stock and thinks: \"The worst that can happen is losing my initial stake, like a regular purchase.\" What is the error?",
  },
  choices: [
    { id: "unlimited", label: { fr: "La perte d'une vente à découvert est théoriquement illimitée, contrairement à un achat classique dont la perte est plafonnée à la mise", en: "A short sale's loss is theoretically unlimited, unlike a regular purchase whose loss is capped at the stake" } },
    { id: "no-error", label: { fr: "Aucune erreur, les deux opérations ont le même plafond de perte", en: "No error, both operations have the same loss cap" } },
  ],
  correctId: "unlimited",
  hint: { fr: "Le prix d'un titre peut-il monter sans limite connue ?", en: "Can a security's price rise with no known ceiling?" },
  explanation: {
    fr: "C'est précisément l'erreur la plus dangereuse en vente à découvert : contrairement à un achat classique, la perte n'est jamais plafonnée, puisque le prix de rachat peut monter sans limite connue.",
    en: "This is precisely the most dangerous mistake in short selling: unlike a regular purchase, the loss is never capped, since the buy-back price can rise with no known ceiling.",
  },
  commonMistake: {
    fr: "Appliquer par réflexe la logique de perte plafonnée d'un achat classique à une position vendeuse.",
    en: "Reflexively applying a regular purchase's capped-loss logic to a short position.",
  },
});

const dailyFeeScenarioTemplate: QuestionTemplate = {
  id: "m01-short-scenario-frais-quotidiens",
  conceptId: "m01-vente-decouvert",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const positionValue = randomInt(rng, 20, 200) * 1000;
    const dailyRateBps = randomInt(rng, 1, 15);
    const days = randomInt(rng, 30, 180);
    const totalFees = Math.round(positionValue * (dailyRateBps / 10000) * (days / 365));

    return {
      isScenario: true,
      prompt: {
        fr: `Une position vendeuse a une valeur de ${fmt(positionValue, "fr")}, empruntée à un taux de ${dailyRateBps} points de base par an, pendant ${days} jours. Quel est le coût total d'emprunt sur la période ?`,
        en: `A short position is worth ${fmt(positionValue, "en")}, borrowed at ${dailyRateBps} basis points per year, for ${days} days. What is the total borrow cost over the period?`,
      },
      numericUnit: { fr: "même devise que la position", en: "same currency as the position" },
      numericTolerance: "± 20",
      hint: { fr: "Coût = Valeur × Taux annuel × (jours/365).", en: "Cost = Value × Annual rate × (days/365)." },
      numeric: { value: totalFees, tolerance: 20 },
      calculation: {
        fr: `Coût = ${fmt(positionValue, "fr")} × ${dailyRateBps}bps × ${days}/365 ≈ ${fmt(totalFees, "fr")}.`,
        en: `Cost = ${fmt(positionValue, "en")} × ${dailyRateBps}bps × ${days}/365 ≈ ${fmt(totalFees, "en")}.`,
      },
      explanation: {
        fr: "Le frais d'emprunt d'un titre se paie en continu, proportionnellement à la valeur de la position et à la durée de détention — plus la position est gardée longtemps, plus ce coût pèse sur le profit final.",
        en: "A security's borrow fee is paid continuously, proportional to the position's value and holding duration — the longer the position is held, the more this cost weighs on the final profit.",
      },
      commonMistake: {
        fr: "Oublier de convertir le taux annuel en proportion de l'année réellement écoulée (jours/365).",
        en: "Forgetting to convert the annual rate into a proportion of the year actually elapsed (days/365).",
      },
    };
  },
};

const locateRuleScenarioTemplate = mcqTemplate({
  id: "m01-short-scenario-regle-locate",
  conceptId: "m01-vente-decouvert",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Sur un marché imposant la règle du \"locate\", un investisseur souhaite vendre à découvert une action très recherchée par d'autres vendeurs à découvert. Que doit-il faire avant de passer son ordre ?",
    en: "In a market enforcing the \"locate\" rule, an investor wants to short a stock heavily sought by other short sellers. What must they do before placing their order?",
  },
  choices: [
    { id: "confirm", label: { fr: "Confirmer au préalable que le titre est réellement disponible à l'emprunt", en: "First confirm the security is actually available to borrow" } },
    { id: "no-requirement", label: { fr: "Rien de particulier : la vente à découvert peut être passée sans vérification préalable", en: "Nothing special: the short sale can be placed with no prior check" } },
  ],
  correctId: "confirm",
  hint: { fr: "Cette règle existe précisément pour éviter les ventes à découvert \"à nu\" sans emprunt réel.", en: "This rule exists precisely to prevent \"naked\" short sales with no real borrow." },
  explanation: {
    fr: "La règle du \"locate\" impose de confirmer la disponibilité réelle du titre à l'emprunt avant de vendre à découvert, pour éviter les ventes à découvert \"à nu\" qui pourraient déstabiliser le marché.",
    en: "The \"locate\" rule requires confirming the security's real borrow availability before shorting, to prevent \"naked\" short sales that could destabilize the market.",
  },
  commonMistake: {
    fr: "Croire que la vente à découvert est toujours une opération libre, sans aucune contrainte réglementaire préalable.",
    en: "Believing short selling is always a free operation, with no prior regulatory constraint.",
  },
});

export const templates: QuestionTemplate[] = [
  profitNumericTemplate,
  unlimitedLossTemplate,
  dividendOwedTemplate,
  vocabTemplate,
  comprehensionTemplate,
  ownedVsBorrowedComparisonTemplate,
  whatIfHardToBorrowTemplate,
  whatIfSqueezeTemplate,
  breakevenPriceNumericTemplate,
  marginCallErrorTemplate,
  dailyFeeScenarioTemplate,
  locateRuleScenarioTemplate,
];
