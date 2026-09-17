import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

const ASSETS = ["une action", "un baril de pétrole", "une devise", "une tonne de blé"] as const;
const ASSETS_EN = ["a share", "a barrel of oil", "a currency", "a tonne of wheat"] as const;

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const payoffNumericTemplate: QuestionTemplate = {
  id: "m02-forward-def-payoff-calcul",
  conceptId: "m02-forward-future-definitions",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const idx = randomInt(rng, 0, ASSETS.length - 1);
    const K = randomInt(rng, 40, 120);
    const sT = randomInt(rng, 20, 150);
    const direction = pick(rng, ["long", "short"] as const);
    const answer = direction === "long" ? sT - K : K - sT;

    return {
      isScenario: true,
      prompt: {
        fr: `Vous détenez une position ${direction === "long" ? "longue" : "courte"} sur un forward portant sur ${ASSETS[idx]}, avec un prix de livraison K = ${fmt(K, "fr")}. À l'échéance, le prix spot est S_T = ${fmt(sT, "fr")}. Quel est votre payoff ?`,
        en: `You hold a ${direction} position on a forward on ${ASSETS_EN[idx]}, with delivery price K = ${fmt(K, "en")}. At maturity, the spot price is S_T = ${fmt(sT, "en")}. What is your payoff?`,
      },
      numericUnit: { fr: "par unité", en: "per unit" },
      numericTolerance: "± 0.5",
      hint: {
        fr: direction === "long" ? "Payoff long = S_T − K." : "Payoff court = K − S_T.",
        en: direction === "long" ? "Long payoff = S_T − K." : "Short payoff = K − S_T.",
      },
      numeric: { value: answer, tolerance: 0.5 },
      calculation: {
        fr:
          direction === "long"
            ? `Payoff = S_T − K = ${fmt(sT, "fr")} − ${fmt(K, "fr")} = ${fmt(answer, "fr")}.`
            : `Payoff = K − S_T = ${fmt(K, "fr")} − ${fmt(sT, "fr")} = ${fmt(answer, "fr")}.`,
        en:
          direction === "long"
            ? `Payoff = S_T − K = ${fmt(sT, "en")} − ${fmt(K, "en")} = ${fmt(answer, "en")}.`
            : `Payoff = K − S_T = ${fmt(K, "en")} − ${fmt(sT, "en")} = ${fmt(answer, "en")}.`,
      },
      explanation: {
        fr: "Il n'y a pas de prime à déduire pour un forward : le payoff calculé est directement le profit ou la perte de la position.",
        en: "There is no premium to subtract for a forward: the computed payoff is directly the position's profit or loss.",
      },
      commonMistake: {
        fr: "Inverser la formule long/court, ou soustraire une prime comme on le ferait pour une option.",
        en: "Swapping the long/short formula, or subtracting a premium as one would for an option.",
      },
    };
  },
};

const noPremiumTemplate: QuestionTemplate = {
  id: "m02-forward-def-pas-de-prime",
  conceptId: "m02-forward-future-definitions",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Comme pour une option, l'acheteur d'un forward paie une prime au vendeur à la conclusion du contrat.",
      en: "As with an option, the buyer of a forward pays a premium to the seller at inception.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un forward est un engagement ferme des deux côtés, sans paiement initial. C'est justement ce qui le distingue d'une option, où l'acheteur paie une prime pour un droit (et non une obligation).",
      en: "False: a forward is a firm two-way commitment, with no upfront payment. This is precisely what distinguishes it from an option, where the buyer pays a premium for a right (not an obligation).",
    },
    commonMistake: {
      fr: "Confondre le fonctionnement d'un forward avec celui d'une option, en particulier sur la notion de prime.",
      en: "Confusing how a forward works with how an option works, particularly regarding the premium.",
    },
  }),
};

const directionMcqTemplate: QuestionTemplate = {
  id: "m02-forward-def-direction",
  conceptId: "m02-forward-future-definitions",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 40, 120);
    const sT = randomInt(rng, 20, 150);
    const direction = pick(rng, ["long", "short"] as const);
    const payoff = direction === "long" ? sT - K : K - sT;
    const correctId = payoff > 0 ? "gain" : payoff < 0 ? "loss" : "zero";

    return {
      isScenario: true,
      prompt: {
        fr: `Position ${direction === "long" ? "longue" : "courte"}, K = ${fmt(K, "fr")}, S_T = ${fmt(sT, "fr")}. La position se solde-t-elle par un gain, une perte, ou exactement zéro ?`,
        en: `${direction === "long" ? "Long" : "Short"} position, K = ${fmt(K, "en")}, S_T = ${fmt(sT, "en")}. Does the position end in a gain, a loss, or exactly zero?`,
      },
      choices: buildChoices([
        { id: "gain", label: { fr: "Un gain", en: "A gain" } },
        { id: "loss", label: { fr: "Une perte", en: "A loss" } },
        { id: "zero", label: { fr: "Exactement zéro", en: "Exactly zero" } },
      ]),
      hint: {
        fr: direction === "long" ? "Comparez S_T à K : le long profite si S_T > K." : "Comparez K à S_T : le court profite si S_T < K.",
        en: direction === "long" ? "Compare S_T to K: the long profits if S_T > K." : "Compare K to S_T: the short profits if S_T < K.",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: `Payoff = ${direction === "long" ? `${fmt(sT, "fr")} − ${fmt(K, "fr")}` : `${fmt(K, "fr")} − ${fmt(sT, "fr")}`} = ${fmt(payoff, "fr")}, ce qui est ${payoff > 0 ? "positif (gain)" : payoff < 0 ? "négatif (perte)" : "nul"}.`,
        en: `Payoff = ${direction === "long" ? `${fmt(sT, "en")} − ${fmt(K, "en")}` : `${fmt(K, "en")} − ${fmt(sT, "en")}`} = ${fmt(payoff, "en")}, which is ${payoff > 0 ? "positive (gain)" : payoff < 0 ? "negative (loss)" : "zero"}.`,
      },
      commonMistake: {
        fr: "Se tromper de sens pour la position courte : elle gagne quand le prix baisse, pas quand il monte.",
        en: "Getting the short position's direction backwards: it gains when the price falls, not when it rises.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m02-forward-def-vocab",
  conceptId: "m02-forward-future-definitions",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Celui qui s'engage à ACHETER le sous-jacent à l'échéance détient une position ______.",
      en: "Whoever commits to BUYING the underlying at maturity holds a ______ position.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["longue", "long"],
    hint: {
      fr: "C'est le même mot qu'en anglais financier.",
      en: "Same word used in French finance jargon (longue).",
    },
    explanation: {
      fr: "La position longue est engagée à l'achat ; la position courte est engagée à la vente.",
      en: "The long position is committed to buying; the short position is committed to selling.",
    },
    commonMistake: {
      fr: "Confondre position longue et position courte, une confusion fréquente au début.",
      en: "Confusing long and short positions, a common early mistake.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m02-forward-def-comprehension-utilite",
  conceptId: "m02-forward-future-definitions",
  difficulty: "easy",
  prompt: {
    fr: "Quel est l'intérêt principal de conclure aujourd'hui un forward pour une livraison dans 6 mois, plutôt que d'attendre 6 mois et de trader alors au prix spot du moment ?",
    en: "What is the main benefit of entering a forward today for delivery in 6 months, rather than waiting 6 months and trading at the spot price then?",
  },
  choices: [
    { id: "lock-price", label: { fr: "Fixer dès maintenant le prix futur, éliminant l'incertitude sur le prix qui prévaudra dans 6 mois", en: "Locking in the future price now, eliminating uncertainty about the price that will prevail in 6 months" } },
    { id: "cheaper", label: { fr: "Le forward garantit systématiquement un prix plus avantageux que le futur prix spot", en: "The forward systematically guarantees a better price than the future spot price" } },
    { id: "no-obligation", label: { fr: "Le forward permet de changer d'avis sans obligation à l'échéance", en: "The forward lets you change your mind with no obligation at maturity" } },
  ],
  correctId: "lock-price",
  hint: { fr: "Le forward ne garantit pas un « meilleur » prix, mais il élimine une inconnue.", en: "The forward doesn't guarantee a \"better\" price, but it removes an unknown." },
  explanation: {
    fr: "L'intérêt d'un forward n'est pas de parier sur un prix plus avantageux (on ne sait pas à l'avance s'il le sera), mais de remplacer une incertitude par une certitude : les deux parties connaissent dès aujourd'hui le prix auquel la transaction aura lieu, ce qui facilite la budgétisation et la gestion du risque.",
    en: "The point of a forward isn't to bet on a more favorable price (you can't know in advance if it will be), but to replace uncertainty with certainty: both parties know today the price at which the transaction will happen, which simplifies budgeting and risk management.",
  },
  commonMistake: {
    fr: "Croire qu'un forward est toujours financièrement avantageux a posteriori, alors qu'il élimine seulement l'incertitude, pas le risque de \"regretter\" le prix fixé.",
    en: "Believing a forward is always financially advantageous in hindsight, when it only removes uncertainty, not the risk of \"regretting\" the locked-in price.",
  },
});

const obligationVsRightComparisonTemplate = mcqTemplate({
  id: "m02-forward-def-comparaison-obligation-droit",
  conceptId: "m02-forward-future-definitions",
  difficulty: "medium",
  prompt: {
    fr: "Contrairement à l'acheteur d'une option, l'acheteur d'un forward a-t-il le CHOIX de renoncer à la transaction à l'échéance si le prix lui est défavorable ?",
    en: "Unlike an option's buyer, does a forward's buyer have the CHOICE to walk away from the transaction at maturity if the price is unfavorable?",
  },
  choices: [
    { id: "no", label: { fr: "Non : le forward est un engagement ferme des deux côtés, exécuté quel que soit le prix", en: "No: a forward is a firm two-way commitment, executed whatever the price" } },
    { id: "yes", label: { fr: "Oui, comme pour une option, il peut simplement abandonner le contrat", en: "Yes, just like an option, he can simply walk away from the contract" } },
    { id: "depends", label: { fr: "Cela dépend uniquement de la devise ou de l'actif sous-jacent", en: "It only depends on the underlying currency or asset" } },
  ],
  correctId: "no",
  hint: { fr: "C'est précisément la différence structurelle entre un engagement ferme et un droit optionnel.", en: "This is precisely the structural difference between a firm commitment and an optional right." },
  explanation: {
    fr: "Un forward engage fermement les deux parties : ni l'acheteur ni le vendeur ne peuvent se rétracter à l'échéance, quel que soit l'écart entre K et S_T. C'est ce qui explique pourquoi, contrairement à une option, aucune prime n'est payée à l'origine : il n'y a pas de \"droit\" optionnel à acquérir, seulement une obligation symétrique.",
    en: "A forward firmly commits both parties: neither the buyer nor the seller can back out at maturity, whatever the gap between K and S_T. This is why, unlike an option, no premium is paid upfront: there is no optional \"right\" to acquire, only a symmetric obligation.",
  },
  commonMistake: {
    fr: "Attribuer au forward la flexibilité d'une option (pouvoir abandonner le contrat), en oubliant que c'est justement ce qui distingue les deux instruments.",
    en: "Attributing an option's flexibility (being able to walk away) to a forward, forgetting this is precisely what distinguishes the two instruments.",
  },
});

const whatIfAtTheMoneyTemplate = mcqTemplate({
  id: "m02-forward-def-whatif-st-egal-k",
  conceptId: "m02-forward-future-definitions",
  difficulty: "easy",
  prompt: {
    fr: "À l'échéance, le prix spot S_T se retrouve exactement égal au prix de livraison K du forward. Quel est le payoff, pour le long comme pour le court ?",
    en: "At maturity, the spot price S_T ends up exactly equal to the forward's delivery price K. What is the payoff, for both the long and the short?",
  },
  choices: [
    { id: "zero", label: { fr: "Zéro pour les deux parties", en: "Zero for both parties" } },
    { id: "long-wins", label: { fr: "Positif pour le long, négatif pour le court", en: "Positive for the long, negative for the short" } },
    { id: "undefined", label: { fr: "Le contrat n'est pas défini dans ce cas particulier", en: "The contract is undefined in this special case" } },
  ],
  correctId: "zero",
  hint: { fr: "Payoff long = S_T − K ; remplacez S_T par K.", en: "Long payoff = S_T − K; substitute S_T with K." },
  explanation: {
    fr: "Si S_T = K, alors S_T − K = 0 pour le long et K − S_T = 0 pour le court : le contrat se dénoue exactement au prix convenu, sans gain ni perte pour aucune des deux parties par rapport à ce prix de référence.",
    en: "If S_T = K, then S_T − K = 0 for the long and K − S_T = 0 for the short: the contract settles exactly at the agreed price, with neither party gaining or losing relative to that reference price.",
  },
  commonMistake: {
    fr: "Penser qu'un forward a toujours un gagnant et un perdant, en oubliant le cas particulier où le prix spot final égale exactement le prix de livraison.",
    en: "Thinking a forward always has a winner and a loser, forgetting the special case where the final spot price exactly equals the delivery price.",
  },
});

const whatIfCounterpartyDefaultTemplate = mcqTemplate({
  id: "m02-forward-def-whatif-defaut-contrepartie",
  conceptId: "m02-forward-future-definitions",
  difficulty: "medium",
  prompt: {
    fr: "Un forward est un contrat privé de gré à gré (OTC), sans chambre de compensation. Si la contrepartie fait défaut juste avant l'échéance, alors que le contrat vous est favorable, que se passe-t-il ?",
    en: "A forward is a private OTC contract, with no clearinghouse. If the counterparty defaults just before maturity, while the contract is in your favor, what happens?",
  },
  choices: [
    { id: "loss", label: { fr: "Vous risquez de ne pas recevoir le paiement dû, un risque de contrepartie propre aux forwards non compensés", en: "You risk not receiving the payment owed, a counterparty risk specific to uncleared forwards" } },
    { id: "guaranteed", label: { fr: "Une chambre de compensation vous paie automatiquement à la place de la contrepartie", en: "A clearinghouse automatically pays you instead of the counterparty" } },
    { id: "no-risk", label: { fr: "Aucun risque, un forward est toujours garanti sans contrepartie", en: "No risk at all, a forward is always guaranteed with no counterparty" } },
  ],
  correctId: "loss",
  hint: { fr: "Contrairement à un future coté sur un marché organisé, un forward OTC n'a pas de chambre de compensation qui garantit l'exécution.", en: "Unlike an exchange-traded future, an OTC forward has no clearinghouse guaranteeing execution." },
  explanation: {
    fr: "Un forward classique est un accord bilatéral direct entre deux parties, sans intermédiaire garantissant l'exécution : si la contrepartie perdante fait défaut, la partie gagnante peut ne jamais recevoir ce qui lui est dû. C'est précisément ce risque de contrepartie que les futures cotés en bourse éliminent grâce à leur chambre de compensation et leurs appels de marge quotidiens.",
    en: "A classic forward is a direct bilateral agreement between two parties, with no intermediary guaranteeing execution: if the losing counterparty defaults, the winning party may never receive what they're owed. This is exactly the counterparty risk that exchange-traded futures eliminate via their clearinghouse and daily margin calls.",
  },
  commonMistake: {
    fr: "Confondre les garanties d'un future coté (chambre de compensation) avec celles d'un forward de gré à gré, qui n'en bénéficie pas par défaut.",
    en: "Confusing an exchange-traded future's guarantees (clearinghouse) with an OTC forward's, which does not benefit from them by default.",
  },
});

const requiredSpotNumericTemplate: QuestionTemplate = {
  id: "m02-forward-def-st-requis-calcul",
  conceptId: "m02-forward-future-definitions",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 40, 120);
    const targetProfit = randomInt(rng, 5, 30);
    const direction = pick(rng, ["long", "short"] as const);
    const requiredST = direction === "long" ? K + targetProfit : K - targetProfit;

    return {
      isScenario: true,
      prompt: {
        fr: `Vous détenez une position ${direction === "long" ? "longue" : "courte"} sur un forward de prix de livraison K = ${K}. Quel prix spot final S_T faut-il pour réaliser exactement un profit de ${targetProfit} ?`,
        en: `You hold a ${direction} position on a forward with delivery price K = ${K}. What final spot price S_T is needed to earn exactly a profit of ${targetProfit}?`,
      },
      numericUnit: { fr: "par unité", en: "per unit" },
      numericTolerance: "± 0.5",
      hint: {
        fr: direction === "long" ? "Résolvez S_T − K = profit cible pour S_T." : "Résolvez K − S_T = profit cible pour S_T.",
        en: direction === "long" ? "Solve S_T − K = target profit for S_T." : "Solve K − S_T = target profit for S_T.",
      },
      numeric: { value: requiredST, tolerance: 0.5 },
      calculation: {
        fr:
          direction === "long"
            ? `S_T − K = ${targetProfit} ⇒ S_T = ${K} + ${targetProfit} = ${requiredST}.`
            : `K − S_T = ${targetProfit} ⇒ S_T = ${K} − ${targetProfit} = ${requiredST}.`,
        en:
          direction === "long"
            ? `S_T − K = ${targetProfit} ⇒ S_T = ${K} + ${targetProfit} = ${requiredST}.`
            : `K − S_T = ${targetProfit} ⇒ S_T = ${K} − ${targetProfit} = ${requiredST}.`,
      },
      explanation: {
        fr: "Inverser la formule du payoff (résoudre pour S_T au lieu de le calculer à partir de S_T) est utile pour définir un objectif ou un seuil de déclenchement, plutôt que pour évaluer un résultat déjà connu.",
        en: "Inverting the payoff formula (solving for S_T instead of computing from S_T) is useful for setting a target or trigger threshold, rather than evaluating an already-known outcome.",
      },
      commonMistake: {
        fr: "Additionner le profit cible pour une position courte au lieu de le soustraire (ou l'inverse pour une position longue).",
        en: "Adding the target profit for a short position instead of subtracting it (or the reverse for a long position).",
      },
    };
  },
};

const unlimitedDownsideErrorTemplate = trueFalseTemplate({
  id: "m02-forward-def-erreur-perte-plafonnee",
  conceptId: "m02-forward-future-definitions",
  difficulty: "medium",
  statement: {
    fr: "Comme pour une option achetée, la perte maximale d'une position sur forward est plafonnée à un montant connu d'avance.",
    en: "As with a bought option, a forward position's maximum loss is capped at a known amount set in advance.",
  },
  correct: false,
  explanation: {
    fr: "Faux : contrairement à l'acheteur d'une option, dont la perte maximale est limitée à la prime payée, les deux parties d'un forward ont une perte potentiellement illimitée (ou très importante), car le payoff (S_T − K ou K − S_T) n'est pas plafonné par un max(·,0). C'est précisément l'absence de prime qui va de pair avec ce risque symétrique et non plafonné.",
    en: "False: unlike an option's buyer, whose maximum loss is capped at the premium paid, both parties to a forward have potentially unlimited (or very large) loss, since the payoff (S_T − K or K − S_T) isn't floored by a max(·,0). It is precisely the absence of a premium that goes hand in hand with this symmetric, uncapped risk.",
  },
  commonMistake: {
    fr: "Transposer au forward la protection de perte plafonnée propre à l'acheteur d'une option, en oubliant que le forward n'a pas de max(·,0) dans son payoff.",
    en: "Transposing an option buyer's capped-loss protection onto a forward, forgetting the forward's payoff has no max(·,0).",
  },
});

const wheatFarmerHedgeScenarioTemplate = mcqTemplate({
  id: "m02-forward-def-scenario-agriculteur",
  conceptId: "m02-forward-future-definitions",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un agriculteur sait qu'il récoltera 1 000 tonnes de blé dans 4 mois, mais craint une chute des prix agricoles d'ici là. Quelle position sur un forward lui permet de fixer aujourd'hui son prix de vente futur ?",
    en: "A farmer knows they will harvest 1,000 tonnes of wheat in 4 months, but fears agricultural prices will fall by then. Which forward position lets them lock in today's future selling price?",
  },
  choices: [
    { id: "short", label: { fr: "Une position courte (vendeuse) sur un forward blé, au prix de livraison K fixé aujourd'hui", en: "A short (selling) position on a wheat forward, at a delivery price K fixed today" } },
    { id: "long", label: { fr: "Une position longue (acheteuse) sur un forward blé", en: "A long (buying) position on a wheat forward" } },
    { id: "none", label: { fr: "Aucune position forward ne peut fixer un prix de vente futur", en: "No forward position can lock in a future selling price" } },
  ],
  correctId: "short",
  hint: { fr: "L'agriculteur va VENDRE sa récolte : il doit prendre la position qui l'engage à vendre.", en: "The farmer will SELL their harvest: they need the position that commits them to selling." },
  explanation: {
    fr: "En vendant un forward (position courte), l'agriculteur s'engage à livrer son blé au prix K fixé aujourd'hui, quel que soit le prix spot dans 4 mois : si les prix chutent comme il le craint, il reste protégé et vend au prix K, supérieur au prix spot alors en vigueur.",
    en: "By selling a forward (short position), the farmer commits to delivering their wheat at the price K fixed today, whatever the spot price is in 4 months: if prices fall as feared, they remain protected and sell at price K, above the then-prevailing spot price.",
  },
  commonMistake: {
    fr: "Inverser la position : c'est l'ACHETEUR d'une matière première qui craint une hausse qui prend le long, pas le producteur qui craint une baisse.",
    en: "Reversing the position: it is a commodity BUYER fearing a price rise who goes long, not the producer fearing a price fall.",
  },
});

const airlineFuelHedgeScenarioTemplate = mcqTemplate({
  id: "m02-forward-def-scenario-compagnie-aerienne",
  conceptId: "m02-forward-future-definitions",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une compagnie aérienne devra acheter du kérosène dans 3 mois et craint une hausse des prix du pétrole d'ici là. Quelle position sur un forward pétrole lui permet de se couvrir ?",
    en: "An airline will need to buy jet fuel in 3 months and fears oil prices will rise by then. Which oil forward position lets them hedge?",
  },
  choices: [
    { id: "long", label: { fr: "Une position longue (acheteuse) sur un forward pétrole, au prix K fixé aujourd'hui", en: "A long (buying) position on an oil forward, at a price K fixed today" } },
    { id: "short", label: { fr: "Une position courte (vendeuse) sur un forward pétrole", en: "A short (selling) position on an oil forward" } },
    { id: "none", label: { fr: "Un forward ne peut pas couvrir un achat futur, seulement une vente future", en: "A forward cannot hedge a future purchase, only a future sale" } },
  ],
  correctId: "long",
  hint: { fr: "La compagnie va ACHETER du carburant : elle doit prendre la position qui l'engage à acheter.", en: "The airline will BUY fuel: they need the position that commits them to buying." },
  explanation: {
    fr: "En achetant un forward (position longue), la compagnie s'engage à acheter le pétrole au prix K fixé aujourd'hui : si les prix montent comme elle le craint, elle paie tout de même K, un prix inférieur au prix spot alors en vigueur, et se protège ainsi contre la hausse.",
    en: "By buying a forward (long position), the airline commits to buying oil at the price K fixed today: if prices rise as feared, they still pay K, a price below the then-prevailing spot price, protecting themselves against the rise.",
  },
  commonMistake: {
    fr: "Croire qu'un forward ne peut servir qu'à couvrir une vente future, alors qu'il couvre symétriquement aussi bien un achat futur (position longue) qu'une vente future (position courte).",
    en: "Believing a forward can only hedge a future sale, when it symmetrically hedges a future purchase (long position) just as well as a future sale (short position).",
  },
});

export const templates: QuestionTemplate[] = [
  payoffNumericTemplate,
  noPremiumTemplate,
  directionMcqTemplate,
  vocabTemplate,
  comprehensionTemplate,
  obligationVsRightComparisonTemplate,
  whatIfAtTheMoneyTemplate,
  whatIfCounterpartyDefaultTemplate,
  requiredSpotNumericTemplate,
  unlimitedDownsideErrorTemplate,
  wheatFarmerHedgeScenarioTemplate,
  airlineFuelHedgeScenarioTemplate,
];
