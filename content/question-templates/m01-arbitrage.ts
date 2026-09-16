import { randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 4): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const triangularNumericTemplate: QuestionTemplate = {
  id: "m01-arbitrage-triangulaire-calcul",
  conceptId: "m01-arbitrage",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const eurUsd = randomFloat(rng, 1.02, 1.18, 4);
    const usdGbp = randomFloat(rng, 0.74, 0.86, 4);
    const gbpEur = randomFloat(rng, 1.08, 1.22, 4);
    const result = Math.round(eurUsd * usdGbp * gbpEur * 10000) / 10000;

    return {
      isScenario: true,
      prompt: {
        fr: `EUR/USD = ${fmt(eurUsd, "fr")}, USD/GBP = ${fmt(usdGbp, "fr")}, GBP/EUR = ${fmt(gbpEur, "fr")}. En partant de 1 EUR et en suivant ce cycle complet, combien d'EUR obtient-on à la fin ?`,
        en: `EUR/USD = ${fmt(eurUsd, "en")}, USD/GBP = ${fmt(usdGbp, "en")}, GBP/EUR = ${fmt(gbpEur, "en")}. Starting from 1 EUR and following this full cycle, how many EUR do you end up with?`,
      },
      numericUnit: { fr: "EUR", en: "EUR" },
      numericTolerance: "± 0.001",
      hint: { fr: "Multipliez les trois taux entre eux.", en: "Multiply the three rates together." },
      numeric: { value: result, tolerance: 0.001 },
      calculation: {
        fr: `${fmt(eurUsd, "fr")} × ${fmt(usdGbp, "fr")} × ${fmt(gbpEur, "fr")} ≈ ${fmt(result, "fr")}.`,
        en: `${fmt(eurUsd, "en")} × ${fmt(usdGbp, "en")} × ${fmt(gbpEur, "en")} ≈ ${fmt(result, "en")}.`,
      },
      explanation: {
        fr: `Si ce produit diffère de 1, un arbitrage triangulaire existe : ici il vaut ${fmt(result, "fr")}, ${result > 1 ? "donc le cycle génère un profit sans risque" : result < 1 ? "donc le cycle inverse génère un profit sans risque" : "donc aucun arbitrage n'est possible"}.`,
        en: `If this product differs from 1, a triangular arbitrage exists: here it equals ${fmt(result, "en")}, ${result > 1 ? "so the cycle generates a risk-free profit" : result < 1 ? "so the reverse cycle generates a risk-free profit" : "so no arbitrage is possible"}.`,
      },
      commonMistake: {
        fr: "Additionner les taux au lieu de les multiplier.",
        en: "Adding the rates instead of multiplying them.",
      },
    };
  },
};

const definitionTemplate: QuestionTemplate = {
  id: "m01-arbitrage-definition",
  conceptId: "m01-arbitrage",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Une stratégie qui a une chance de générer une petite perte mais une chance beaucoup plus grande de générer un gros gain, sans mise de fonds initiale, constitue un arbitrage au sens strict.",
      en: "A strategy with a small chance of a loss but a much larger chance of a big gain, requiring no initial capital, is an arbitrage in the strict sense.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un arbitrage, par définition stricte, ne peut JAMAIS produire de perte, même avec une probabilité infime. Une stratégie avec un risque de perte, même faible, n'est pas un arbitrage — c'est un pari favorable.",
      en: "False: an arbitrage, by strict definition, can NEVER produce a loss, even with a tiny probability. A strategy with any loss risk, however small, is not an arbitrage — it's a favorable bet.",
    },
    commonMistake: {
      fr: "Assimiler \"arbitrage\" à \"pari très favorable\", alors que la définition exige une absence totale de risque de perte.",
      en: "Equating \"arbitrage\" with \"very favorable bet\", when the definition requires a total absence of loss risk.",
    },
  }),
};

const limitsToArbitrageTemplate: QuestionTemplate = {
  id: "m01-arbitrage-limites",
  conceptId: "m01-arbitrage",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un écart de prix apparent entre deux actifs théoriquement identiques persiste pendant des mois malgré un profit sans risque apparent. Quelle explication est la plus probable ?",
      en: "An apparent price gap between two theoretically identical assets persists for months despite an apparent risk-free profit. What is the most likely explanation?",
    },
    choices: buildChoices([
      { id: "limits", label: { fr: "Des limites pratiques à l'arbitrage (coûts, financement, contraintes réglementaires)", en: "Practical limits to arbitrage (costs, funding, regulatory constraints)" } },
      { id: "impossible", label: { fr: "C'est mathématiquement impossible, l'observation doit être erronée", en: "This is mathematically impossible, the observation must be wrong" } },
    ]),
    hint: { fr: "Un écart théorique n'est pas toujours capturable en pratique.", en: "A theoretical gap isn't always capturable in practice." },
    correctChoiceIds: ["limits"],
    explanation: {
      fr: "Les limites à l'arbitrage (coûts de transaction, contraintes de financement, risque de contrepartie sur la durée) expliquent pourquoi certains écarts persistent malgré l'absence apparente de risque — le cas académique Royal Dutch/Shell en est un exemple classique.",
      en: "Limits to arbitrage (transaction costs, funding constraints, counterparty risk over time) explain why certain gaps persist despite an apparent lack of risk — the academic Royal Dutch/Shell case is a classic example.",
    },
    commonMistake: {
      fr: "Croire que la théorie de l'absence d'arbitrage garantit l'absence de TOUT écart de prix observable en pratique.",
      en: "Believing no-arbitrage theory guarantees the absence of ANY observable price gap in practice.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-arbitrage-vocab",
  conceptId: "m01-arbitrage",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le principe selon lequel deux combinaisons d'actifs produisant exactement le même résultat doivent avoir le même prix s'appelle la loi du prix ______.",
      en: "The principle that two combinations of assets producing exactly the same outcome must have the same price is called the law of ______ price.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["unique", "one"],
    hint: { fr: "« Un seul » prix pour un même résultat.", en: "\"Only one\" price for the same outcome." },
    explanation: {
      fr: "La loi du prix unique est le principe sous-jacent à toutes les démonstrations par arbitrage de ce cours.",
      en: "The law of one price is the underlying principle behind every arbitrage proof in this course.",
    },
    commonMistake: {
      fr: "Confondre ce principe avec la simple observation empirique que les prix de marché convergent souvent.",
      en: "Confusing this principle with the mere empirical observation that market prices often converge.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-arbitrage-comprehension-utilite",
  conceptId: "m01-arbitrage",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi les formules de pricing (forward, parité call-put) sont-elles dérivées à partir de l'absence d'arbitrage plutôt qu'en devinant le comportement des investisseurs ?",
    en: "Why are pricing formulas (forward, put-call parity) derived from no-arbitrage rather than by guessing investor behavior?",
  },
  choices: [
    { id: "robust", label: { fr: "Parce que c'est une contrainte logique robuste, valable quels que soient les goûts ou anticipations des investisseurs", en: "Because it's a robust logical constraint, valid whatever investors' tastes or expectations are" } },
    { id: "empirical", label: { fr: "Parce que c'est la méthode la plus simple à vérifier empiriquement sur des données historiques", en: "Because it's the simplest method to verify empirically on historical data" } },
  ],
  correctId: "robust",
  hint: { fr: "L'absence d'arbitrage ne suppose rien sur les préférences ou les anticipations des investisseurs.", en: "No-arbitrage assumes nothing about investors' preferences or expectations." },
  explanation: {
    fr: "L'absence d'arbitrage est une contrainte purement logique (aucun profit garanti sans risque ni mise), qui tient indépendamment de ce que les investisseurs pensent ou préfèrent — une base bien plus solide qu'une hypothèse comportementale.",
    en: "No-arbitrage is a purely logical constraint (no guaranteed, risk-free, zero-cost profit), which holds independent of what investors think or prefer — a far more solid basis than a behavioral assumption.",
  },
  commonMistake: {
    fr: "Croire que le pricing par absence d'arbitrage repose sur des hypothèses de comportement des investisseurs.",
    en: "Believing no-arbitrage pricing rests on assumptions about investor behavior.",
  },
});

const hedgingComparisonTemplate = mcqTemplate({
  id: "m01-arbitrage-comparaison-couverture",
  conceptId: "m01-arbitrage",
  difficulty: "medium",
  prompt: {
    fr: "Quelle est la différence essentielle entre un arbitrage et une opération de couverture (hedging) ?",
    en: "What is the essential difference between an arbitrage and a hedging trade?",
  },
  choices: [
    { id: "correct", label: { fr: "L'arbitrage génère un profit garanti sans mise ni risque ; la couverture réduit un risque déjà existant, souvent moyennant un coût", en: "Arbitrage generates a guaranteed profit with no stake or risk; hedging reduces an already-existing risk, often at a cost" } },
    { id: "same", label: { fr: "Les deux visent exactement le même objectif : éliminer tout risque du portefeuille", en: "Both pursue exactly the same goal: eliminating all portfolio risk" } },
  ],
  correctId: "correct",
  hint: { fr: "L'arbitrage part de zéro risque et crée un profit ; la couverture part d'un risque existant et le réduit.", en: "Arbitrage starts from zero risk and creates a profit; hedging starts from an existing risk and reduces it." },
  explanation: {
    fr: "Un arbitrage est un profit créé à partir de rien, sans risque ; une couverture, elle, part d'une exposition au risque déjà présente (par exemple un portefeuille d'actions) et cherche à la réduire, généralement en acceptant un coût ou un manque à gagner.",
    en: "An arbitrage is a profit created from nothing, risk-free; hedging starts from an already-present risk exposure (e.g. a stock portfolio) and seeks to reduce it, generally accepting a cost or a forgone gain.",
  },
  commonMistake: {
    fr: "Confondre \"éliminer un risque\" (couverture) avec \"générer un profit sans risque\" (arbitrage), deux objectifs différents.",
    en: "Confusing \"eliminating a risk\" (hedging) with \"generating a risk-free profit\" (arbitrage), two different objectives.",
  },
});

const whatIfTransactionCostsTemplate = trueFalseTemplate({
  id: "m01-arbitrage-whatif-frais-transaction",
  conceptId: "m01-arbitrage",
  difficulty: "medium",
  isScenario: true,
  statement: {
    fr: "Si le produit des trois taux d'un cycle triangulaire vaut 1,0001 (un écart de 0,01%), ce léger écart reste nécessairement exploitable en profit net positif une fois les frais de transaction pris en compte.",
    en: "If a triangular cycle's three-rate product equals 1.0001 (a 0.01% gap), this small gap remains necessarily exploitable as a positive net profit once transaction costs are factored in.",
  },
  correct: false,
  explanation: {
    fr: "Faux : si les frais de transaction cumulés (trois opérations de change) dépassent 0,01%, l'écart théorique disparaît entièrement une fois les coûts déduits — un arbitrage \"en théorie\" n'est pas toujours un arbitrage \"en pratique\".",
    en: "False: if cumulative transaction costs (three FX trades) exceed 0.01%, the theoretical gap disappears entirely once costs are deducted — a \"theoretical\" arbitrage isn't always a \"practical\" one.",
  },
  commonMistake: {
    fr: "Ignorer que les frais de transaction peuvent dépasser un écart de prix théorique très faible, annulant le profit net.",
    en: "Ignoring that transaction costs can exceed a very small theoretical price gap, wiping out the net profit.",
  },
});

const whatIfSingleRateMoveTemplate = mcqTemplate({
  id: "m01-arbitrage-whatif-un-seul-taux-bouge",
  conceptId: "m01-arbitrage",
  difficulty: "medium",
  prompt: {
    fr: "Les trois taux d'un cycle triangulaire sont initialement à l'équilibre (produit = 1). Seul le taux EUR/USD augmente légèrement, les deux autres restant fixes. Que devient le produit des trois taux ?",
    en: "A triangular cycle's three rates start at equilibrium (product = 1). Only the EUR/USD rate rises slightly, the other two staying fixed. What happens to the product of the three rates?",
  },
  choices: [
    { id: "moves", label: { fr: "Il s'écarte de 1, créant potentiellement une opportunité d'arbitrage jusqu'à ce que les taux se rajustent", en: "It moves away from 1, potentially creating an arbitrage opportunity until rates readjust" } },
    { id: "stays", label: { fr: "Il reste égal à 1, car les taux de change s'ajustent instantanément entre eux par construction", en: "It stays equal to 1, since exchange rates instantly adjust to each other by construction" } },
  ],
  correctId: "moves",
  hint: { fr: "Rien ne garantit automatiquement que le produit reste 1 si un seul taux bouge isolément.", en: "Nothing automatically guarantees the product stays 1 if only one rate moves in isolation." },
  explanation: {
    fr: "Un mouvement isolé d'un seul des trois taux écarte mécaniquement le produit de 1, ouvrant une fenêtre d'arbitrage — c'est justement cette fenêtre que les traders automatisés exploitent en quelques millisecondes pour ramener l'équilibre.",
    en: "An isolated move in just one of the three rates mechanically moves the product away from 1, opening an arbitrage window — exactly the window automated traders exploit within milliseconds to restore equilibrium.",
  },
  commonMistake: {
    fr: "Croire que les trois taux de change sont automatiquement synchronisés par une force physique, plutôt que par l'action même des arbitragistes.",
    en: "Believing the three exchange rates are automatically synchronized by some physical force, rather than by arbitrageurs' own action.",
  },
});

const requiredNotionalNumericTemplate: QuestionTemplate = {
  id: "m01-arbitrage-notionnel-requis-calcul",
  conceptId: "m01-arbitrage",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const marginBps = randomInt(rng, 5, 40);
    const targetProfit = randomInt(rng, 500, 5000);
    const notional = Math.round((targetProfit / (marginBps / 10000)) / 1000) * 1000;

    return {
      isScenario: true,
      prompt: {
        fr: `Un arbitrage triangulaire offre une marge de ${marginBps} points de base (${fmt(marginBps / 100, "fr", 2)}%) par cycle. Quel notionnel (montant échangé) faut-il faire circuler pour viser un profit d'environ ${fmt(targetProfit, "fr", 0)} (même devise) ?`,
        en: `A triangular arbitrage offers a margin of ${marginBps} basis points (${fmt(marginBps / 100, "en", 2)}%) per cycle. What notional (amount traded) must be run through the cycle to target a profit of about ${fmt(targetProfit, "en", 0)} (same currency)?`,
      },
      numericUnit: { fr: "même devise que le profit visé", en: "same currency as the target profit" },
      numericTolerance: "± 5000",
      hint: { fr: "Notionnel = Profit visé / Marge en proportion.", en: "Notional = Target profit / Margin as a proportion." },
      numeric: { value: notional, tolerance: 5000 },
      calculation: {
        fr: `Notionnel ≈ ${fmt(targetProfit, "fr", 0)} / ${fmt(marginBps / 10000, "fr", 4)} ≈ ${fmt(notional, "fr", 0)}.`,
        en: `Notional ≈ ${fmt(targetProfit, "en", 0)} / ${fmt(marginBps / 10000, "en", 4)} ≈ ${fmt(notional, "en", 0)}.`,
      },
      explanation: {
        fr: "Une marge d'arbitrage s'exprime toujours en proportion : pour un profit absolu donné, il faut faire circuler un notionnel d'autant plus grand que la marge unitaire est faible — c'est pourquoi l'arbitrage professionnel opère à très grande échelle.",
        en: "An arbitrage margin is always expressed as a proportion: for a given absolute profit, a larger notional must be run through the smaller the unit margin is — which is why professional arbitrage operates at very large scale.",
      },
      commonMistake: {
        fr: "Multiplier le profit visé par la marge au lieu de diviser par elle.",
        en: "Multiplying the target profit by the margin instead of dividing by it.",
      },
    };
  },
};

const directionErrorTemplate = mcqTemplate({
  id: "m01-arbitrage-erreur-sens-cycle",
  conceptId: "m01-arbitrage",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un trader calcule un produit de taux triangulaire égal à 0,995 (donc inférieur à 1), mais suit le cycle dans le même sens que s'il avait trouvé 1,005. Quelle erreur commet-il ?",
    en: "A trader computes a triangular rate product equal to 0.995 (so below 1), but follows the cycle in the same direction as if they'd found 1.005. What mistake are they making?",
  },
  choices: [
    { id: "direction", label: { fr: "Il se trompe de sens : un produit < 1 exige de suivre le cycle INVERSE pour capturer le profit, pas le même sens", en: "He's got the direction wrong: a product < 1 requires following the REVERSE cycle to capture the profit, not the same direction" } },
    { id: "no-error", label: { fr: "Aucune erreur : le sens du cycle ne dépend pas de si le produit est supérieur ou inférieur à 1", en: "No error: the cycle's direction doesn't depend on whether the product is above or below 1" } },
  ],
  correctId: "direction",
  hint: { fr: "Un produit < 1 signifie que le cycle initial appauvrit — donc l'opportunité est dans l'autre sens.", en: "A product < 1 means the initial cycle loses money — so the opportunity lies in the other direction." },
  explanation: {
    fr: "Si le produit est inférieur à 1, suivre le cycle dans son sens initial fait perdre de l'argent ; c'est le cycle INVERSE qui capture le profit sans risque. Confondre les deux sens annule tout l'avantage de l'arbitrage détecté.",
    en: "If the product is below 1, following the cycle in its initial direction loses money; it's the REVERSE cycle that captures the risk-free profit. Confusing the two directions cancels out the entire advantage of the detected arbitrage.",
  },
  commonMistake: {
    fr: "Détecter correctement un écart d'arbitrage mais se tromper sur le sens dans lequel l'exploiter.",
    en: "Correctly detecting an arbitrage gap but getting the direction to exploit it wrong.",
  },
});

const identicalBondsScenarioTemplate = mcqTemplate({
  id: "m01-arbitrage-scenario-obligations-identiques",
  conceptId: "m01-arbitrage",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Deux obligations, émises par le même émetteur, avec exactement les mêmes flux futurs (mêmes coupons, même échéance), cotent à des prix légèrement différents sur deux plateformes. Quelle stratégie sans risque cette situation permet-elle ?",
    en: "Two bonds from the same issuer, with exactly the same future cash flows (same coupons, same maturity), trade at slightly different prices on two platforms. What risk-free strategy does this allow?",
  },
  choices: [
    { id: "buy-cheap-sell-dear", label: { fr: "Acheter l'obligation la moins chère et vendre (ou vendre à découvert) la plus chère, empochant l'écart sans risque", en: "Buy the cheaper bond and sell (or short) the more expensive one, pocketing the gap risk-free" } },
    { id: "buy-both", label: { fr: "Acheter les deux obligations, car cela diversifie le risque de crédit", en: "Buy both bonds, since this diversifies credit risk" } },
  ],
  correctId: "buy-cheap-sell-dear",
  hint: { fr: "Deux flux futurs strictement identiques doivent avoir le même prix (loi du prix unique).", en: "Two strictly identical future cash flows must have the same price (law of one price)." },
  explanation: {
    fr: "Deux instruments produisant exactement les mêmes flux futurs doivent, par la loi du prix unique, avoir le même prix : tout écart permet d'acheter le moins cher et de vendre le plus cher pour un profit garanti sans risque.",
    en: "Two instruments producing exactly the same future cash flows must, by the law of one price, have the same price: any gap allows buying the cheaper one and selling the more expensive one for a guaranteed, risk-free profit.",
  },
  commonMistake: {
    fr: "Croire qu'acheter les deux titres \"diversifie\" un risque, alors qu'ils ont des flux identiques et donc aucun bénéfice de diversification.",
    en: "Believing buying both securities \"diversifies\" a risk, when they have identical cash flows and so no diversification benefit.",
  },
});

const fundingConstraintScenarioTemplate = mcqTemplate({
  id: "m01-arbitrage-scenario-contrainte-financement",
  conceptId: "m01-arbitrage",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un fonds repère un écart de prix apparent sans risque entre deux actifs identiques, mais son courtier principal exige un dépôt de marge supérieur au capital disponible pour ouvrir la position. Que révèle cette situation ?",
    en: "A fund spots an apparent risk-free price gap between two identical assets, but its prime broker demands a margin deposit exceeding the available capital to open the position. What does this reveal?",
  },
  choices: [
    { id: "limits", label: { fr: "Une limite pratique à l'arbitrage (contrainte de financement), qui peut empêcher de capturer un écart pourtant réel", en: "A practical limit to arbitrage (a funding constraint), which can prevent capturing an otherwise real gap" } },
    { id: "no-arbitrage", label: { fr: "Que l'écart de prix n'était en réalité pas un arbitrage, par définition", en: "That the price gap wasn't actually an arbitrage, by definition" } },
  ],
  correctId: "limits",
  hint: { fr: "L'écart de prix lui-même reste réel ; c'est la capacité à l'exploiter qui est contrainte.", en: "The price gap itself remains real; it's the ability to exploit it that's constrained." },
  explanation: {
    fr: "L'écart de prix peut être un arbitrage théoriquement valide, mais rester inexploitable si le financement nécessaire dépasse le capital disponible — exactement le type de limite pratique qui explique la persistance de certains écarts (cas Royal Dutch/Shell).",
    en: "The price gap can be a theoretically valid arbitrage, yet remain unexploitable if the required funding exceeds available capital — exactly the kind of practical limit explaining certain gaps' persistence (the Royal Dutch/Shell case).",
  },
  commonMistake: {
    fr: "Conclure qu'un arbitrage inexploitable en pratique n'était donc jamais un vrai arbitrage en théorie.",
    en: "Concluding that an arbitrage unexploitable in practice therefore was never a real arbitrage in theory.",
  },
});

export const templates: QuestionTemplate[] = [
  triangularNumericTemplate,
  definitionTemplate,
  limitsToArbitrageTemplate,
  vocabTemplate,
  comprehensionTemplate,
  hedgingComparisonTemplate,
  whatIfTransactionCostsTemplate,
  whatIfSingleRateMoveTemplate,
  requiredNotionalNumericTemplate,
  directionErrorTemplate,
  identicalBondsScenarioTemplate,
  fundingConstraintScenarioTemplate,
];
