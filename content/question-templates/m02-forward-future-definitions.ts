import { pick, randomInt, distinctRounded, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";
import type { Bi } from "@/content/catalog/types";

const ASSETS = ["une action", "un baril de pétrole", "une devise", "une tonne de blé"] as const;
const ASSETS_EN = ["a share", "a barrel of oil", "a currency", "a tonne of wheat"] as const;

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const payoffNumericTemplate: QuestionTemplate = {
  id: "m02-forward-def-payoff-calcul",
  conceptId: "m02-forward-future-definitions",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const idx = randomInt(rng, 0, ASSETS.length - 1);
    const K = randomInt(rng, 40, 120);
    const sT = randomInt(rng, 20, 150);
    const direction = pick(rng, ["long", "short"] as const);
    const correct = direction === "long" ? sT - K : K - sT;
    const flip = -correct;
    const spotOnly = sT;
    const flooredLikeOption = Math.max(correct, 0);
    const [vCorrect, vFlip, vSpot, vFloor] = distinctRounded([correct, flip, spotOnly, flooredLikeOption], 0, 1);

    return {
      isScenario: true,
      prompt: {
        fr: `Vous détenez une position ${direction === "long" ? "longue" : "courte"} sur un forward portant sur ${ASSETS[idx]}, avec un prix de livraison K = ${fmt(K, "fr")}. À l'échéance, le prix spot est S_T = ${fmt(sT, "fr")}. Quel est votre payoff ?`,
        en: `You hold a ${direction} position on a forward on ${ASSETS_EN[idx]}, with delivery price K = ${fmt(K, "en")}. At maturity, the spot price is S_T = ${fmt(sT, "en")}. What is your payoff?`,
      },
      choices: buildChoices([
        { id: "payoff", label: { fr: `${fmt(vCorrect, "fr")} par unité`, en: `${fmt(vCorrect, "en")} per unit` } },
        { id: "direction-flip", label: { fr: `${fmt(vFlip, "fr")} par unité`, en: `${fmt(vFlip, "en")} per unit` } },
        { id: "spot-only", label: { fr: `${fmt(vSpot, "fr")} par unité`, en: `${fmt(vSpot, "en")} per unit` } },
        { id: "floored-like-option", label: { fr: `${fmt(vFloor, "fr")} par unité`, en: `${fmt(vFloor, "en")} per unit` } },
      ]),
      correctChoiceIds: ["payoff"],
      hint: {
        fr: direction === "long" ? "Payoff long = S_T − K." : "Payoff court = K − S_T.",
        en: direction === "long" ? "Long payoff = S_T − K." : "Short payoff = K − S_T.",
      },
      calculation: {
        fr:
          direction === "long"
            ? `Payoff = S_T − K = ${fmt(sT, "fr")} − ${fmt(K, "fr")} = ${fmt(vCorrect, "fr")}.`
            : `Payoff = K − S_T = ${fmt(K, "fr")} − ${fmt(sT, "fr")} = ${fmt(vCorrect, "fr")}.`,
        en:
          direction === "long"
            ? `Payoff = S_T − K = ${fmt(sT, "en")} − ${fmt(K, "en")} = ${fmt(vCorrect, "en")}.`
            : `Payoff = K − S_T = ${fmt(K, "en")} − ${fmt(sT, "en")} = ${fmt(vCorrect, "en")}.`,
      },
      explanation: {
        fr: "Il n'y a pas de prime à déduire pour un forward : le payoff calculé est directement le profit ou la perte de la position.",
        en: "There is no premium to subtract for a forward: the computed payoff is directly the position's profit or loss.",
      },
      commonMistake: {
        fr: "Inverser la formule long/court, ne reporter que le prix spot, ou plafonner le résultat à zéro comme pour une option.",
        en: "Swapping the long/short formula, reporting only the spot price, or flooring the result at zero as with an option.",
      },
      distractorRationale: {
        "direction-flip": {
          fr: "C'est la formule de l'autre position (long ↔ court) qui a été appliquée — vérifiez quelle position vous détenez.",
          en: "This applies the other position's formula (long ↔ short) — check which position you actually hold.",
        },
        "spot-only": {
          fr: "Reporter directement S_T oublie de le comparer à K : le payoff est une différence, pas le prix spot seul.",
          en: "Reporting S_T directly forgets to net it against K: the payoff is a difference, not the spot price alone.",
        },
        "floored-like-option": {
          fr: "Un forward n'a pas de plancher à zéro : contrairement à une option, son payoff peut être négatif sans limite.",
          en: "A forward has no floor at zero: unlike an option, its payoff can be negative without limit.",
        },
      },
    };
  },
};

const noPremiumTemplate: QuestionTemplate = mcqTemplate({
  id: "m02-forward-def-pas-de-prime",
  conceptId: "m02-forward-future-definitions",
  difficulty: "easy",
  prompt: {
    fr: "Quel paiement l'acheteur d'un forward verse-t-il au vendeur à la conclusion du contrat ?",
    en: "What payment does a forward's buyer make to the seller when the contract is agreed?",
  },
  choices: [
    {
      id: "none",
      label: { fr: "Aucun paiement initial : le forward est un engagement ferme sans prime", en: "No upfront payment: a forward is a firm commitment with no premium" },
    },
    { id: "premium", label: { fr: "Une prime, comme pour l'achat d'une option", en: "A premium, as when buying an option" } },
    { id: "margin", label: { fr: "Un dépôt de garantie initial, comme pour un future coté", en: "An initial margin deposit, as with an exchange-traded future" } },
    { id: "full-price", label: { fr: "La totalité du prix K, payée comptant dès la signature", en: "The full price K, paid in cash at signing" } },
  ],
  correctId: "none",
  explanation: {
    fr: "Un forward est un engagement ferme des deux côtés, sans paiement initial. C'est justement ce qui le distingue d'une option, où l'acheteur paie une prime pour un droit (et non une obligation).",
    en: "A forward is a firm two-way commitment, with no upfront payment. This is precisely what distinguishes it from an option, where the buyer pays a premium for a right (not an obligation).",
  },
  commonMistake: {
    fr: "Confondre le fonctionnement d'un forward avec celui d'une option ou d'un future coté, en particulier sur les paiements initiaux.",
    en: "Confusing how a forward works with an option or an exchange-traded future, particularly regarding upfront payments.",
  },
  distractorRationale: {
    premium: {
      fr: "C'est la différence structurelle clé avec une option : l'option donne un droit contre une prime, le forward est un engagement ferme sans paiement initial.",
      en: "This is the key structural difference from an option: an option grants a right for a premium, a forward is a firm commitment with no upfront payment.",
    },
    margin: {
      fr: "Le dépôt de garantie (marge initiale) est une caractéristique des futures cotés compensés, pas des forwards OTC classiques.",
      en: "An initial margin deposit is a feature of cleared, exchange-traded futures, not of a plain OTC forward.",
    },
    "full-price": {
      fr: "Le prix K n'est comparé au prix spot qu'à l'échéance : il n'est jamais payé intégralement comptant à la signature du contrat.",
      en: "The price K is only netted against the spot price at maturity: it is never paid in full cash at signing.",
    },
  },
});

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

    const rationaleByWrongId: Record<string, Bi> = {
      gain: {
        fr: "Le signe du payoff calculé ne correspond pas à un gain ici : revérifiez la direction (long/court) et le signe obtenu.",
        en: "The computed payoff's sign doesn't match a gain here: recheck the direction (long/short) and the resulting sign.",
      },
      loss: {
        fr: "Le signe du payoff calculé ne correspond pas à une perte ici : revérifiez la direction (long/court) et le signe obtenu.",
        en: "The computed payoff's sign doesn't match a loss here: recheck the direction (long/short) and the resulting sign.",
      },
      zero: {
        fr: "S_T et K ne sont pas égaux ici : le payoff n'est donc pas nul.",
        en: "S_T and K are not equal here: the payoff is therefore not zero.",
      },
      premium: {
        fr: "Un forward n'a pas de prime : le résultat dépend uniquement de S_T et K, tous deux donnés dans l'énoncé.",
        en: "A forward has no premium: the outcome depends only on S_T and K, both given in the prompt.",
      },
    };

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
        { id: "premium", label: { fr: "Une prime", en: "A premium" } },
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
        fr: "Se tromper de sens pour la position courte, ou croire qu'une prime non mentionnée pourrait changer le résultat.",
        en: "Getting the short position's direction backwards, or believing an unmentioned premium could change the outcome.",
      },
      distractorRationale: Object.fromEntries(Object.entries(rationaleByWrongId).filter(([id]) => id !== correctId)),
    };
  },
};

const vocabTemplate: QuestionTemplate = mcqTemplate({
  id: "m02-forward-def-vocab",
  conceptId: "m02-forward-future-definitions",
  difficulty: "easy",
  prompt: {
    fr: "Comment appelle-t-on la position de celui qui s'engage à ACHETER le sous-jacent à l'échéance d'un forward ?",
    en: "What is the position of whoever commits to BUYING the underlying at a forward's maturity called?",
  },
  choices: [
    { id: "long", label: { fr: "Position longue", en: "Long position" } },
    { id: "short", label: { fr: "Position courte", en: "Short position" } },
    { id: "hedged", label: { fr: "Position couverte", en: "Hedged position" } },
    { id: "neutral", label: { fr: "Position neutre", en: "Neutral position" } },
  ],
  correctId: "long",
  hint: { fr: "C'est le même mot qu'en anglais financier.", en: "Same word used in French finance jargon (longue)." },
  explanation: {
    fr: "La position longue est engagée à l'achat ; la position courte est engagée à la vente.",
    en: "The long position is committed to buying; the short position is committed to selling.",
  },
  commonMistake: {
    fr: "Confondre position longue et position courte, une confusion fréquente au début.",
    en: "Confusing long and short positions, a common early mistake.",
  },
  distractorRationale: {
    short: {
      fr: "La position courte est celle du vendeur, engagé à livrer (vendre) le sous-jacent, pas à l'acheter.",
      en: "The short position is the seller's, committed to delivering (selling) the underlying, not buying it.",
    },
    hedged: {
      fr: "« Couverte » qualifie une stratégie de gestion du risque, ce n'est pas un synonyme de position longue ou courte sur un forward.",
      en: "\"Hedged\" describes a risk-management strategy, it isn't a synonym for a long or short forward position.",
    },
    neutral: {
      fr: "Une position ferme sur un forward est toujours soit longue soit courte ; « neutre » n'est pas un terme standard ici.",
      en: "A firm forward position is always either long or short; \"neutral\" isn't a standard term here.",
    },
  },
});

const comprehensionTemplate = mcqTemplate({
  id: "m02-forward-def-comprehension-utilite",
  conceptId: "m02-forward-future-definitions",
  difficulty: "easy",
  prompt: {
    fr: "Quel est l'intérêt principal de conclure aujourd'hui un forward pour une livraison dans 6 mois, plutôt que d'attendre 6 mois et de trader alors au prix spot du moment ?",
    en: "What is the main benefit of entering a forward today for delivery in 6 months, rather than waiting 6 months and trading at the spot price then?",
  },
  choices: [
    {
      id: "lock-price",
      label: {
        fr: "Fixer dès maintenant le prix futur, éliminant l'incertitude sur le prix qui prévaudra dans 6 mois",
        en: "Locking in the future price now, eliminating uncertainty about the price that will prevail in 6 months",
      },
    },
    {
      id: "cheaper",
      label: {
        fr: "Le forward garantit systématiquement un prix plus avantageux que le futur prix spot",
        en: "The forward systematically guarantees a better price than the future spot price",
      },
    },
    {
      id: "no-obligation",
      label: { fr: "Le forward permet de changer d'avis sans obligation à l'échéance", en: "The forward lets you change your mind with no obligation at maturity" },
    },
    {
      id: "equivalent",
      label: {
        fr: "Il n'y a aucune différence réelle entre conclure un forward et simplement attendre l'échéance",
        en: "There is no real difference between entering a forward and simply waiting until maturity",
      },
    },
  ],
  correctId: "lock-price",
  hint: { fr: "Le forward ne garantit pas un « meilleur » prix, mais il élimine une inconnue.", en: "The forward doesn't guarantee a \"better\" price, but it removes an unknown." },
  explanation: {
    fr: "L'intérêt d'un forward n'est pas de parier sur un prix plus avantageux (on ne sait pas à l'avance s'il le sera), mais de remplacer une incertitude par une certitude : les deux parties connaissent dès aujourd'hui le prix auquel la transaction aura lieu, ce qui facilite la budgétisation et la gestion du risque.",
    en: "The point of a forward isn't to bet on a more favorable price (you can't know in advance if it will be), but to replace uncertainty with certainty: both parties know today the price at which the transaction will happen, which simplifies budgeting and risk management.",
  },
  commonMistake: {
    fr: "Croire qu'un forward est toujours financièrement avantageux, ou qu'il équivaut à ne rien faire et attendre l'échéance.",
    en: "Believing a forward is always financially advantageous, or that it's equivalent to doing nothing and waiting until maturity.",
  },
  distractorRationale: {
    cheaper: {
      fr: "Le forward fixe un prix, mais rien ne garantit qu'il sera plus avantageux que le prix spot futur, par nature inconnu à l'avance.",
      en: "The forward locks in a price, but nothing guarantees it will beat the future spot price, which is unknown in advance by nature.",
    },
    "no-obligation": {
      fr: "C'est l'inverse : le forward est un engagement ferme, sans possibilité de changer d'avis à l'échéance — c'est justement ce qui le distingue d'une option.",
      en: "It's the opposite: a forward is a firm commitment, with no way to change your mind at maturity — this is precisely what distinguishes it from an option.",
    },
    equivalent: {
      fr: "Attendre expose au prix spot inconnu dans 6 mois, alors que le forward fixe ce prix dès aujourd'hui : ce n'est pas équivalent, même si le prix final pouvait coïncider par hasard.",
      en: "Waiting exposes you to the unknown spot price in 6 months, while the forward locks in that price today: it isn't equivalent, even if the final price happened to coincide.",
    },
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
    {
      id: "no",
      label: { fr: "Non : le forward est un engagement ferme des deux côtés, exécuté quel que soit le prix", en: "No: a forward is a firm two-way commitment, executed whatever the price" },
    },
    {
      id: "yes",
      label: { fr: "Oui, comme pour une option, il peut simplement abandonner le contrat", en: "Yes, just like an option, he can simply walk away from the contract" },
    },
    { id: "depends", label: { fr: "Cela dépend uniquement de la devise ou de l'actif sous-jacent", en: "It only depends on the underlying currency or asset" } },
    {
      id: "contract-clause",
      label: { fr: "Seulement si une clause explicite du contrat le permet", en: "Only if an explicit contract clause allows it" },
    },
  ],
  correctId: "no",
  hint: { fr: "C'est précisément la différence structurelle entre un engagement ferme et un droit optionnel.", en: "This is precisely the structural difference between a firm commitment and an optional right." },
  explanation: {
    fr: "Un forward engage fermement les deux parties : ni l'acheteur ni le vendeur ne peuvent se rétracter à l'échéance, quel que soit l'écart entre K et S_T. C'est ce qui explique pourquoi, contrairement à une option, aucune prime n'est payée à l'origine : il n'y a pas de \"droit\" optionnel à acquérir, seulement une obligation symétrique.",
    en: "A forward firmly commits both parties: neither the buyer nor the seller can back out at maturity, whatever the gap between K and S_T. This is why, unlike an option, no premium is paid upfront: there is no optional \"right\" to acquire, only a symmetric obligation.",
  },
  commonMistake: {
    fr: "Attribuer au forward la flexibilité d'une option, ou croire que cette flexibilité pourrait dépendre du sous-jacent ou d'une clause particulière.",
    en: "Attributing an option's flexibility to a forward, or believing that flexibility could depend on the underlying or a special clause.",
  },
  distractorRationale: {
    yes: {
      fr: "C'est l'inverse : pouvoir abandonner le contrat sans pénalité est le propre d'une option, pas d'un forward.",
      en: "It's the opposite: being able to walk away without penalty is a feature of an option, not a forward.",
    },
    depends: {
      fr: "L'engagement ferme du forward ne dépend ni de la devise ni de l'actif sous-jacent : c'est une caractéristique universelle de cet instrument.",
      en: "A forward's firm commitment doesn't depend on the currency or underlying asset: it's a universal feature of the instrument.",
    },
    "contract-clause": {
      fr: "L'absence de choix à l'échéance est une caractéristique structurelle de TOUT forward standard, pas une clause optionnelle à négocier.",
      en: "The lack of choice at maturity is a structural feature of ANY standard forward, not an optional clause to negotiate.",
    },
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
    { id: "short-wins", label: { fr: "Positif pour le court, négatif pour le long", en: "Positive for the short, negative for the long" } },
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
  distractorRationale: {
    "long-wins": {
      fr: "Si S_T=K, le payoff (S_T−K pour le long, K−S_T pour le court) est nul des deux côtés, pas favorable à un seul.",
      en: "If S_T=K, the payoff (S_T−K for the long, K−S_T for the short) is zero on both sides, not favorable to just one.",
    },
    "short-wins": {
      fr: "C'est une confusion de signe : quand S_T=K, les deux payoffs sont nuls, aucun des deux côtés n'est favorisé.",
      en: "This is a sign confusion: when S_T=K, both payoffs are zero, neither side is favored.",
    },
    undefined: {
      fr: "Le forward reste parfaitement défini quel que soit l'écart entre S_T et K, y compris lorsqu'il est nul.",
      en: "The forward remains perfectly well-defined whatever the gap between S_T and K, including when it is zero.",
    },
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
    {
      id: "loss",
      label: {
        fr: "Vous risquez de ne pas recevoir le paiement dû, un risque de contrepartie propre aux forwards non compensés",
        en: "You risk not receiving the payment owed, a counterparty risk specific to uncleared forwards",
      },
    },
    { id: "guaranteed", label: { fr: "Une chambre de compensation vous paie automatiquement à la place de la contrepartie", en: "A clearinghouse automatically pays you instead of the counterparty" } },
    { id: "no-risk", label: { fr: "Aucun risque, un forward est toujours garanti sans contrepartie", en: "No risk at all, a forward is always guaranteed with no counterparty" } },
    {
      id: "fx-only",
      label: { fr: "Le risque existe, mais uniquement si le forward porte sur une devise", en: "The risk exists, but only if the forward is on a currency" },
    },
  ],
  correctId: "loss",
  hint: { fr: "Contrairement à un future coté sur un marché organisé, un forward OTC n'a pas de chambre de compensation qui garantit l'exécution.", en: "Unlike an exchange-traded future, an OTC forward has no clearinghouse guaranteeing execution." },
  explanation: {
    fr: "Un forward classique est un accord bilatéral direct entre deux parties, sans intermédiaire garantissant l'exécution : si la contrepartie perdante fait défaut, la partie gagnante peut ne jamais recevoir ce qui lui est dû. C'est précisément ce risque de contrepartie que les futures cotés en bourse éliminent grâce à leur chambre de compensation et leurs appels de marge quotidiens.",
    en: "A classic forward is a direct bilateral agreement between two parties, with no intermediary guaranteeing execution: if the losing counterparty defaults, the winning party may never receive what they're owed. This is exactly the counterparty risk that exchange-traded futures eliminate via their clearinghouse and daily margin calls.",
  },
  commonMistake: {
    fr: "Confondre les garanties d'un future coté (chambre de compensation) avec celles d'un forward de gré à gré, ou croire que ce risque dépend du sous-jacent.",
    en: "Confusing an exchange-traded future's guarantees with an OTC forward's, or believing this risk depends on the underlying.",
  },
  distractorRationale: {
    guaranteed: {
      fr: "C'est le mécanisme d'un future coté (chambre de compensation), pas d'un forward OTC classique, qui n'en bénéficie pas par défaut.",
      en: "That's the mechanism of an exchange-traded future (clearinghouse), not a plain OTC forward, which doesn't benefit from it by default.",
    },
    "no-risk": {
      fr: "Un forward OTC comporte justement un risque de contrepartie réel, contrairement à un instrument compensé.",
      en: "An OTC forward carries exactly this kind of real counterparty risk, unlike a cleared instrument.",
    },
    "fx-only": {
      fr: "Le risque de contrepartie d'un forward OTC ne dépend pas du type de sous-jacent : il existe pour tout forward non compensé, devise ou non.",
      en: "An OTC forward's counterparty risk doesn't depend on the underlying's type: it exists for any uncleared forward, currency or otherwise.",
    },
  },
});

const requiredSpotNumericTemplate: QuestionTemplate = {
  id: "m02-forward-def-st-requis-calcul",
  conceptId: "m02-forward-future-definitions",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const K = randomInt(rng, 40, 120);
    const targetProfit = randomInt(rng, 5, 30);
    const direction = pick(rng, ["long", "short"] as const);
    const correct = direction === "long" ? K + targetProfit : K - targetProfit;
    const flip = direction === "long" ? K - targetProfit : K + targetProfit;
    const reportedProfit = targetProfit;
    const doubled = direction === "long" ? K + 2 * targetProfit : K - 2 * targetProfit;
    const [vCorrect, vFlip, vReported, vDoubled] = distinctRounded([correct, flip, reportedProfit, doubled], 0, 1);

    return {
      isScenario: true,
      prompt: {
        fr: `Vous détenez une position ${direction === "long" ? "longue" : "courte"} sur un forward de prix de livraison K = ${K}. Quel prix spot final S_T faut-il pour réaliser exactement un profit de ${targetProfit} ?`,
        en: `You hold a ${direction} position on a forward with delivery price K = ${K}. What final spot price S_T is needed to earn exactly a profit of ${targetProfit}?`,
      },
      choices: buildChoices([
        { id: "required-st", label: { fr: `S_T = ${fmt(vCorrect, "fr")}`, en: `S_T = ${fmt(vCorrect, "en")}` } },
        { id: "direction-flip", label: { fr: `S_T = ${fmt(vFlip, "fr")}`, en: `S_T = ${fmt(vFlip, "en")}` } },
        { id: "reported-profit", label: { fr: `S_T = ${fmt(vReported, "fr")}`, en: `S_T = ${fmt(vReported, "en")}` } },
        { id: "doubled-profit", label: { fr: `S_T = ${fmt(vDoubled, "fr")}`, en: `S_T = ${fmt(vDoubled, "en")}` } },
      ]),
      correctChoiceIds: ["required-st"],
      hint: {
        fr: direction === "long" ? "Résolvez S_T − K = profit cible pour S_T." : "Résolvez K − S_T = profit cible pour S_T.",
        en: direction === "long" ? "Solve S_T − K = target profit for S_T." : "Solve K − S_T = target profit for S_T.",
      },
      calculation: {
        fr:
          direction === "long"
            ? `S_T − K = ${targetProfit} ⇒ S_T = ${K} + ${targetProfit} = ${fmt(vCorrect, "fr")}.`
            : `K − S_T = ${targetProfit} ⇒ S_T = ${K} − ${targetProfit} = ${fmt(vCorrect, "fr")}.`,
        en:
          direction === "long"
            ? `S_T − K = ${targetProfit} ⇒ S_T = ${K} + ${targetProfit} = ${fmt(vCorrect, "en")}.`
            : `K − S_T = ${targetProfit} ⇒ S_T = ${K} − ${targetProfit} = ${fmt(vCorrect, "en")}.`,
      },
      explanation: {
        fr: "Inverser la formule du payoff (résoudre pour S_T au lieu de le calculer à partir de S_T) est utile pour définir un objectif ou un seuil de déclenchement, plutôt que pour évaluer un résultat déjà connu.",
        en: "Inverting the payoff formula (solving for S_T instead of computing from S_T) is useful for setting a target or trigger threshold, rather than evaluating an already-known outcome.",
      },
      commonMistake: {
        fr: "Additionner le profit cible pour une position courte au lieu de le soustraire, recopier le profit cible tel quel, ou le compter deux fois.",
        en: "Adding the target profit for a short position instead of subtracting it, copying the target profit as-is, or counting it twice.",
      },
      distractorRationale: {
        "direction-flip": {
          fr: "Cela applique la formule de l'autre direction (long ↔ court) — vérifiez quelle position vous détenez avant d'isoler S_T.",
          en: "This applies the other direction's formula (long ↔ short) — check which position you actually hold before solving for S_T.",
        },
        "reported-profit": {
          fr: "Le profit cible est une donnée de l'énoncé, pas la réponse : il faut résoudre l'équation pour S_T, pas recopier le profit.",
          en: "The target profit is a given in the prompt, not the answer: you must solve the equation for S_T, not copy the profit.",
        },
        "doubled-profit": {
          fr: "Cela compte le profit cible deux fois au lieu d'une seule fois dans l'équation à résoudre.",
          en: "This counts the target profit twice instead of once in the equation being solved.",
        },
      },
    };
  },
};

const unlimitedDownsideErrorTemplate = mcqTemplate({
  id: "m02-forward-def-erreur-perte-plafonnee",
  conceptId: "m02-forward-future-definitions",
  difficulty: "medium",
  prompt: {
    fr: "Quelle affirmation décrit correctement la perte maximale d'une position sur forward ?",
    en: "Which statement correctly describes a forward position's maximum loss?",
  },
  choices: [
    {
      id: "unlimited",
      label: { fr: "Elle est potentiellement illimitée (ou très importante), sans plafond connu d'avance", en: "It is potentially unlimited (or very large), with no cap known in advance" },
    },
    { id: "premium-capped", label: { fr: "Elle est plafonnée à la prime versée à la conclusion du contrat", en: "It is capped at the premium paid when the contract was agreed" } },
    { id: "k-capped", label: { fr: "Elle est plafonnée au prix de livraison K", en: "It is capped at the delivery price K" } },
    { id: "zero-if-held", label: { fr: "Elle est nulle si la position est conservée jusqu'à l'échéance", en: "It is zero if the position is held until maturity" } },
  ],
  correctId: "unlimited",
  explanation: {
    fr: "Contrairement à l'acheteur d'une option, dont la perte maximale est limitée à la prime payée, les deux parties d'un forward ont une perte potentiellement illimitée (ou très importante), car le payoff (S_T − K ou K − S_T) n'est pas plafonné par un max(·,0). C'est précisément l'absence de prime qui va de pair avec ce risque symétrique et non plafonné.",
    en: "Unlike an option's buyer, whose maximum loss is capped at the premium paid, both parties to a forward have potentially unlimited (or very large) loss, since the payoff (S_T − K or K − S_T) isn't floored by a max(·,0). It is precisely the absence of a premium that goes hand in hand with this symmetric, uncapped risk.",
  },
  commonMistake: {
    fr: "Transposer au forward la protection de perte plafonnée propre à l'acheteur d'une option, en oubliant que le forward n'a pas de max(·,0) dans son payoff.",
    en: "Transposing an option buyer's capped-loss protection onto a forward, forgetting the forward's payoff has no max(·,0).",
  },
  distractorRationale: {
    "premium-capped": {
      fr: "Un forward n'implique aucune prime : cette limite de perte s'applique à l'acheteur d'une option, pas à une position forward.",
      en: "A forward involves no premium: this loss limit applies to an option's buyer, not to a forward position.",
    },
    "k-capped": {
      fr: "Le payoff (S_T−K ou K−S_T) n'est pas borné par K : rien n'empêche S_T de s'écarter fortement de K dans les deux sens.",
      en: "The payoff (S_T−K or K−S_T) isn't bounded by K: nothing stops S_T from moving far from K in either direction.",
    },
    "zero-if-held": {
      fr: "Conserver la position jusqu'à l'échéance ne protège pas du tout : c'est justement à l'échéance que le payoff, potentiellement très négatif, est réalisé.",
      en: "Holding the position until maturity offers no protection at all: it's precisely at maturity that the potentially very negative payoff is realized.",
    },
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
    { id: "both", label: { fr: "Une position longue ET courte simultanément, pour annuler tout risque", en: "A long AND short position at the same time, to cancel out all risk" } },
  ],
  correctId: "short",
  hint: { fr: "L'agriculteur va VENDRE sa récolte : il doit prendre la position qui l'engage à vendre.", en: "The farmer will SELL their harvest: they need the position that commits them to selling." },
  explanation: {
    fr: "En vendant un forward (position courte), l'agriculteur s'engage à livrer son blé au prix K fixé aujourd'hui, quel que soit le prix spot dans 4 mois : si les prix chutent comme il le craint, il reste protégé et vend au prix K, supérieur au prix spot alors en vigueur.",
    en: "By selling a forward (short position), the farmer commits to delivering their wheat at the price K fixed today, whatever the spot price is in 4 months: if prices fall as feared, they remain protected and sell at price K, above the then-prevailing spot price.",
  },
  commonMistake: {
    fr: "Inverser la position (prendre le long au lieu du court), ou croire qu'il faut cumuler les deux positions pour se couvrir.",
    en: "Reversing the position (going long instead of short), or believing both positions must be combined to hedge.",
  },
  distractorRationale: {
    long: {
      fr: "C'est l'inverse : le long s'engage à ACHETER, alors que l'agriculteur doit VENDRE sa récolte.",
      en: "It's the opposite: the long commits to BUYING, while the farmer needs to SELL their harvest.",
    },
    none: {
      fr: "Une position courte (vendeuse) permet précisément de fixer aujourd'hui le prix de vente futur.",
      en: "A short (selling) position is precisely what locks in today's future selling price.",
    },
    both: {
      fr: "Prendre les deux positions à la fois annulerait exactement leurs effets : cela ne fixe aucun prix de vente, ce n'est pas une couverture utile.",
      en: "Taking both positions at once would exactly cancel their effects: it locks in no selling price, and isn't a useful hedge.",
    },
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
    {
      id: "floating-k",
      label: { fr: "Un forward avec un prix K non fixé à l'avance, ajusté selon le marché", en: "A forward with a price K not fixed in advance, adjusted to the market" },
    },
  ],
  correctId: "long",
  hint: { fr: "La compagnie va ACHETER du carburant : elle doit prendre la position qui l'engage à acheter.", en: "The airline will BUY fuel: they need the position that commits them to buying." },
  explanation: {
    fr: "En achetant un forward (position longue), la compagnie s'engage à acheter le pétrole au prix K fixé aujourd'hui : si les prix montent comme elle le craint, elle paie tout de même K, un prix inférieur au prix spot alors en vigueur, et se protège ainsi contre la hausse.",
    en: "By buying a forward (long position), the airline commits to buying oil at the price K fixed today: if prices rise as feared, they still pay K, a price below the then-prevailing spot price, protecting themselves against the rise.",
  },
  commonMistake: {
    fr: "Croire qu'un forward ne peut servir qu'à couvrir une vente future, ou qu'un prix K ajustable au marché serait une couverture valable.",
    en: "Believing a forward can only hedge a future sale, or that a market-adjustable price K would be a valid hedge.",
  },
  distractorRationale: {
    short: {
      fr: "C'est l'inverse : le court s'engage à VENDRE, alors que la compagnie doit ACHETER du kérosène.",
      en: "It's the opposite: the short commits to SELLING, while the airline needs to BUY jet fuel.",
    },
    none: {
      fr: "Une position longue (acheteuse) permet précisément de fixer aujourd'hui le prix d'achat futur.",
      en: "A long (buying) position is precisely what locks in today's future purchase price.",
    },
    "floating-k": {
      fr: "Un prix K ajustable au marché ne fixerait justement rien : l'intérêt du forward est de figer K dès la conclusion du contrat.",
      en: "A market-adjustable price K would lock in nothing: the whole point of a forward is to fix K when the contract is agreed.",
    },
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
