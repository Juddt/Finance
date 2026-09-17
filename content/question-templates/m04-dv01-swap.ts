import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const dv01SwapNumericTemplate: QuestionTemplate = {
  id: "m04-dv01-swap-calcul",
  conceptId: "m04-dv01-swap",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 5, 100) * 500_000;
    const Dmod = randomFloat(rng, 1, 10, 2);
    const dv01 = Math.round(notional * Dmod * 0.0001 * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un swap receveur fixe de notionnel ${fmt(notional, "fr", 0)} vient d'être resetté ; sa jambe fixe a une duration modifiée de ${fmt(Dmod, "fr")}. Quel est le DV01 approximatif du swap ?`,
        en: `A fixed-receiver swap with notional ${fmt(notional, "en", 0)} has just reset; its fixed leg has a modified duration of ${fmt(Dmod, "en")}. What is the swap's approximate DV01?`,
      },
      numericUnit: { fr: "même devise, par point de base", en: "same currency, per basis point" },
      numericTolerance: "± 5",
      hint: { fr: "DV01_swap ≈ Notionnel × D_mod, jambe fixe × 0,0001.", en: "DV01_swap ≈ Notional × D_mod, fixed leg × 0.0001." },
      numeric: { value: dv01, tolerance: 5 },
      calculation: {
        fr: `DV01 ≈ ${fmt(notional, "fr", 0)} × ${fmt(Dmod, "fr")} × 0,0001 ≈ ${fmt(dv01, "fr")}.`,
        en: `DV01 ≈ ${fmt(notional, "en", 0)} × ${fmt(Dmod, "en")} × 0.0001 ≈ ${fmt(dv01, "en")}.`,
      },
      explanation: {
        fr: "Juste après un reset, la jambe variable a un DV01 quasi nul : tout le risque de taux du swap vient de sa jambe fixe, traitée comme une obligation classique.",
        en: "Right after a reset, the floating leg's DV01 is near zero: all the swap's rate risk comes from its fixed leg, treated as a plain bond.",
      },
      commonMistake: {
        fr: "Essayer de calculer un DV01 séparé pour la jambe variable et l'additionner, alors qu'il est négligeable juste après un reset.",
        en: "Trying to compute a separate DV01 for the floating leg and add it, when it is negligible right after a reset.",
      },
    };
  },
};

const signConventionTemplate: QuestionTemplate = {
  id: "m04-dv01-swap-signe",
  conceptId: "m04-dv01-swap",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ratesUp = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Les taux montent brutalement. Quelle position sur un swap en profite (gain positif) ?`,
        en: `Rates rise sharply. Which swap position benefits (positive gain)?`,
      },
      choices: buildChoices([
        { id: "payer", label: { fr: "Le payeur fixe (reçoit variable)", en: "The fixed payer (receives floating)" } },
        { id: "receiver", label: { fr: "Le receveur fixe (paie variable)", en: "The fixed receiver (pays floating)" } },
      ]),
      hint: { fr: "Comparez au comportement d'un émetteur obligataire (qui profite d'une hausse des taux) vs un porteur (qui en pâtit).", en: "Compare to a bond issuer's behavior (benefits from a rate rise) vs a holder's (hurt by it)." },
      correctChoiceIds: ["payer"],
      explanation: {
        fr: "Le payeur fixe se comporte comme un émetteur obligataire synthétique : une hausse des taux réduit la valeur de sa dette fixe à payer, un gain net pour lui — l'inverse du receveur fixe, qui se comporte comme un porteur obligataire.",
        en: "The fixed payer behaves like a synthetic bond issuer: a rate rise lowers the value of their fixed debt owed, a net gain for them — the opposite of the fixed receiver, who behaves like a bondholder.",
      },
      commonMistake: {
        fr: "Appliquer machinalement \"hausse des taux = perte\" sans distinguer payeur et receveur fixe.",
        en: "Mechanically applying \"rate rise = loss\" without distinguishing fixed payer and receiver.",
      },
    };
  },
};

const floatingLegDv01Template: QuestionTemplate = {
  id: "m04-dv01-swap-jambe-variable",
  conceptId: "m04-dv01-swap",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le DV01 de la jambe variable d'un swap est rigoureusement nul en permanence, à tout moment de la vie du swap.",
      en: "The DV01 of a swap's floating leg is strictly zero at all times, throughout the swap's life.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : il est quasi nul juste après un reset, mais entre deux dates de reset la jambe variable porte un petit risque de taux résiduel, généralement négligeable mais pas rigoureusement nul.",
      en: "False: it is near zero right after a reset, but between two reset dates the floating leg carries a small residual rate risk, usually negligible but not strictly zero.",
    },
    commonMistake: {
      fr: "Généraliser abusivement l'approximation \"DV01 jambe variable ≈ 0\" en une égalité stricte permanente.",
      en: "Overgeneralizing the \"floating leg DV01 ≈ 0\" approximation into a strict, permanent equality.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m04-dv01-swap-vocab",
  conceptId: "m04-dv01-swap",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un desk qui décompose son risque de taux par tranche de maturité (courte, moyenne, longue) plutôt qu'en un seul DV01 global utilise ce qu'on appelle le \"key ______ DV01\".",
      en: "A desk that decomposes its rate risk by maturity bucket (short, medium, long) rather than a single global DV01 uses what is called \"key ______ DV01\".",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["rate"],
    hint: { fr: "Le même mot qu'en anglais financier, déjà utilisé pour « taux ».", en: "The finance term itself (rate)." },
    explanation: {
      fr: "Le \"key rate DV01\" décompose la sensibilité aux taux par point de la courbe, utile car les taux ne bougent presque jamais parfaitement en parallèle.",
      en: "\"Key rate DV01\" decomposes rate sensitivity by point on the curve, useful since rates almost never move in perfect parallel.",
    },
    commonMistake: {
      fr: "Croire qu'un DV01 global unique suffit à décrire complètement le risque de taux d'un portefeuille complexe.",
      en: "Believing a single global DV01 fully describes a complex portfolio's rate risk.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m04-dv01-swap-comprehension-utilite",
  conceptId: "m04-dv01-swap",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi peut-on additionner directement le DV01 d'un swap et le DV01 d'une obligation classique dans un même portefeuille, sans traitement spécial ?",
    en: "Why can a swap's DV01 and a plain bond's DV01 be directly added within the same portfolio, with no special treatment?",
  },
  choices: [
    { id: "same-unit", label: { fr: "Parce que le DV01 est exprimé dans la même unité monétaire par point de base pour les deux instruments, mesurant le même type de risque de taux sous-jacent", en: "Because DV01 is expressed in the same monetary-per-basis-point unit for both instruments, measuring the same underlying type of rate risk" } },
    { id: "must-convert", label: { fr: "Il faut d'abord convertir le DV01 du swap dans une unité différente avant de pouvoir l'additionner", en: "The swap's DV01 must first be converted into a different unit before it can be added" } },
    { id: "cannot-combine", label: { fr: "On ne peut jamais combiner le DV01 d'un swap avec celui d'une obligation", en: "A swap's DV01 can never be combined with a bond's" } },
  ],
  correctId: "same-unit",
  hint: { fr: "Le DV01 d'un swap se calcule comme celui de sa jambe fixe, traitée exactement comme une obligation classique (M04-4).", en: "A swap's DV01 is computed like its fixed leg's, treated exactly like a plain bond (M04-4)." },
  explanation: {
    fr: "Puisque le DV01_swap se calcule en traitant sa jambe fixe comme une obligation classique, il est exprimé dans exactement la même unité (monnaie par point de base) que le DV01 d'une vraie obligation : les deux mesurent la même chose (une sensibilité de valeur à un mouvement de taux de 1 pb) et s'additionnent donc directement, permettant d'agréger le risque de taux d'un portefeuille mixte obligations + swaps en un seul chiffre.",
    en: "Since DV01_swap is computed by treating its fixed leg like a plain bond, it's expressed in exactly the same unit (currency per basis point) as a real bond's DV01: both measure the same thing (a value's sensitivity to a 1 bp rate move) and so add up directly, allowing a mixed bonds + swaps portfolio's rate risk to be aggregated into a single number.",
  },
  commonMistake: {
    fr: "Croire qu'un swap, parce qu'il n'implique pas d'échange de notionnel, nécessite un traitement à part pour l'agrégation du risque, alors que son DV01 est directement comparable et additif.",
    en: "Believing a swap, because it involves no notional exchange, needs separate treatment for risk aggregation, when its DV01 is directly comparable and additive.",
  },
});

const midPeriodComparisonTemplate = mcqTemplate({
  id: "m04-dv01-swap-comparaison-milieu-periode",
  conceptId: "m04-dv01-swap",
  difficulty: "hard",
  prompt: {
    fr: "Comparez le DV01 de la jambe variable d'un swap juste après un reset, et au milieu d'une période entre deux resets. Lequel est le plus proche de zéro ?",
    en: "Compare a swap's floating leg DV01 right after a reset, and midway between two resets. Which one is closer to zero?",
  },
  choices: [
    { id: "just-after", label: { fr: "Juste après le reset : la jambe variable vaut alors exactement son nominal, avec un DV01 quasi nul", en: "Right after the reset: the floating leg is then worth exactly its face value, with near-zero DV01" } },
    { id: "mid-period", label: { fr: "Au milieu de la période, le DV01 de la jambe variable est toujours plus proche de zéro", en: "Midway through the period, the floating leg's DV01 is always closer to zero" } },
    { id: "always-same", label: { fr: "Le DV01 de la jambe variable est rigoureusement constant tout au long de la période", en: "The floating leg's DV01 is strictly constant throughout the period" } },
  ],
  correctId: "just-after",
  hint: { fr: "Juste après un reset, le prochain coupon variable est déjà connu et fixé jusqu'à la prochaine échéance — que reste-t-il comme incertitude de taux ?", en: "Right after a reset, the next floating coupon is already known and fixed until the next date — what rate uncertainty remains?" },
  explanation: {
    fr: "Juste après un reset, le prochain coupon variable est déjà fixé pour toute la période à venir : la jambe variable se comporte alors comme un flux unique connu, proche d'une obligation courte au pair, avec un DV01 résiduel minimal. Au fur et à mesure que le temps passe vers le prochain reset, un petit risque de taux résiduel réapparaît progressivement (la jambe variable n'est plus exactement au pair entre deux dates de reset), rendant son DV01 légèrement non nul.",
    en: "Right after a reset, the next floating coupon is already fixed for the whole upcoming period: the floating leg then behaves like a single known flow, close to a short at-par bond, with minimal residual DV01. As time passes toward the next reset, a small residual rate risk gradually reappears (the floating leg is no longer exactly at par between two reset dates), making its DV01 slightly non-zero.",
  },
  commonMistake: {
    fr: "Croire que le DV01 de la jambe variable reste identique tout au long de chaque période, en oubliant qu'il évolue légèrement entre deux dates de reset.",
    en: "Believing the floating leg's DV01 stays identical throughout each period, forgetting it slightly evolves between two reset dates.",
  },
});

const payerVsShortBondComparisonTemplate = mcqTemplate({
  id: "m04-dv01-swap-comparaison-payeur-vs-short-obligation",
  conceptId: "m04-dv01-swap",
  difficulty: "hard",
  prompt: {
    fr: "Comparez le DV01 d'un swap payeur fixe (jambe fixe de duration D_mod, notionnel N) et celui d'une position VENDEUSE (short) sur une obligation classique de même duration et même notionnel. Ont-ils exactement le même DV01 ?",
    en: "Compare a fixed-payer swap's DV01 (fixed leg of duration D_mod, notional N) and a SHORT position on a plain bond of the same duration and notional. Do they have exactly the same DV01?",
  },
  choices: [
    { id: "approx-equal", label: { fr: "Ils sont approximativement égaux en grandeur et de même signe, le swap payeur se comportant comme un émetteur synthétique équivalent à une position courte obligataire", en: "They are approximately equal in magnitude and same sign, the fixed-payer swap behaving like a synthetic issuer equivalent to a short bond position" } },
    { id: "opposite-sign", label: { fr: "Ils sont de signes opposés", en: "They are of opposite signs" } },
    { id: "unrelated", label: { fr: "Aucun lien entre les deux, ce sont des risques de nature complètement différente", en: "No link between the two, these are risks of a completely different nature" } },
  ],
  correctId: "approx-equal",
  hint: { fr: "Un émetteur d'obligation (position courte pour l'investisseur qui la vend à découvert) et un payeur fixe de swap réagissent tous deux favorablement à une hausse des taux.", en: "A bond issuer (a short position for the investor shorting it) and a swap's fixed payer both react favorably to a rate rise." },
  explanation: {
    fr: "Le payeur fixe d'un swap se comporte économiquement comme un émetteur obligataire synthétique : sa dette fixe à payer perd de la valeur (en sa faveur) quand les taux montent, exactement comme une position courte sur une obligation classique de même duration et notionnel. Les deux DV01 sont donc de même signe et de grandeur approximativement égale, ce qui permet d'utiliser l'un pour répliquer ou couvrir l'autre.",
    en: "A swap's fixed payer behaves economically like a synthetic bond issuer: their fixed debt owed loses value (in their favor) when rates rise, exactly like a short position on a plain bond of the same duration and notional. Both DV01s are therefore of the same sign and approximately equal magnitude, allowing one to be used to replicate or hedge the other.",
  },
  commonMistake: {
    fr: "Croire que le DV01 d'un swap payeur fixe n'a aucun rapport avec celui d'une position obligataire courte, en manquant l'équivalence économique entre les deux.",
    en: "Believing a fixed-payer swap's DV01 has no relation to a short bond position's, missing the economic equivalence between the two.",
  },
});

const whatIfApproachingResetTemplate = mcqTemplate({
  id: "m04-dv01-swap-whatif-approche-reset",
  conceptId: "m04-dv01-swap",
  difficulty: "medium",
  prompt: {
    fr: "À mesure que la date du prochain reset approche (mais n'est pas encore atteinte), que devient généralement le petit risque de taux résiduel de la jambe variable ?",
    en: "As the next reset date approaches (but hasn't yet arrived), what generally happens to the floating leg's small residual rate risk?",
  },
  choices: [
    { id: "shrinks", label: { fr: "Il diminue progressivement, pour redevenir quasi nul au moment même du reset", en: "It progressively shrinks, becoming near zero again right at the reset" } },
    { id: "grows", label: { fr: "Il augmente à mesure que le reset approche", en: "It grows as the reset approaches" } },
    { id: "constant", label: { fr: "Il reste parfaitement constant jusqu'au reset", en: "It stays perfectly constant until the reset" } },
  ],
  correctId: "shrinks",
  hint: { fr: "Pensez à la duration résiduelle d'un flux unique dont l'échéance se rapproche (comme une obligation qui vieillit, M03-3).", en: "Think of a single flow's residual duration as its maturity approaches (like an aging bond, M03-3)." },
  explanation: {
    fr: "Le petit risque résiduel de la jambe variable provient du temps restant avant que le prochain coupon (déjà déterminé par le reset précédent, ou à déterminer au prochain) ne soit effectivement versé : à mesure que ce délai se raccourcit, la sensibilité résiduelle diminue mécaniquement, exactement comme la duration d'une obligation qui vieillit (M03-3), pour redevenir quasi nulle au moment du reset suivant.",
    en: "The floating leg's small residual risk comes from the time remaining before the next coupon (already set by the previous reset, or to be set at the next one) is actually paid: as this delay shortens, the residual sensitivity mechanically decreases, exactly like an aging bond's duration (M03-3), becoming near zero again at the next reset.",
  },
  commonMistake: {
    fr: "Croire que le risque résiduel de la jambe variable augmente à mesure qu'on se rapproche du reset, alors que c'est l'inverse : il diminue vers zéro.",
    en: "Believing the floating leg's residual risk grows as the reset approaches, when it's the opposite: it shrinks toward zero.",
  },
});

const netPortfolioDv01NumericTemplate: QuestionTemplate = {
  id: "m04-dv01-swap-portefeuille-net-calcul",
  conceptId: "m04-dv01-swap",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const bondNotional = randomInt(rng, 5, 50) * 500_000;
    const bondDmod = randomFloat(rng, 3, 10, 2);
    const bondDv01 = bondNotional * bondDmod * 0.0001;
    const swapNotional = randomInt(rng, 5, 50) * 500_000;
    const swapDmod = randomFloat(rng, 3, 10, 2);
    const swapDv01 = swapNotional * swapDmod * 0.0001;
    const netDv01 = Math.round((bondDv01 - swapDv01) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un portefeuille détient une obligation longue (DV01 = ${bondNotional.toLocaleString("fr-FR")} × ${fmt(bondDmod, "fr")} × 0,0001) et un swap PAYEUR fixe de même notionnel que le sien (DV01 de la jambe fixe = ${swapNotional.toLocaleString("fr-FR")} × ${fmt(swapDmod, "fr")} × 0,0001, mais de signe opposé au DV01 obligataire). Quel est le DV01 net du portefeuille ?`,
        en: `A portfolio holds a long bond (DV01 = ${bondNotional.toLocaleString("en-US")} × ${fmt(bondDmod, "en")} × 0.0001) and a fixed-PAYER swap of its own notional (fixed leg DV01 = ${swapNotional.toLocaleString("en-US")} × ${fmt(swapDmod, "en")} × 0.0001, but with a sign opposite to the bond's DV01). What is the portfolio's net DV01?`,
      },
      numericUnit: { fr: "même devise, par point de base", en: "same currency, per basis point" },
      numericTolerance: "± 10",
      hint: { fr: "Le payeur fixe a un DV01 de signe opposé à celui d'une obligation détenue (M04-4) : DV01 net = DV01_obligation − DV01_swap.", en: "The fixed payer has a DV01 of opposite sign to a held bond's (M04-4): Net DV01 = DV01_bond − DV01_swap." },
      numeric: { value: netDv01, tolerance: 10 },
      calculation: {
        fr: `DV01_obligation ≈ ${bondDv01.toFixed(2)}. DV01_swap (jambe fixe) ≈ ${swapDv01.toFixed(2)}, de signe opposé pour le payeur fixe. DV01 net ≈ ${bondDv01.toFixed(2)} − ${swapDv01.toFixed(2)} ≈ ${netDv01.toFixed(2)}.`,
        en: `DV01_bond ≈ ${bondDv01.toFixed(2)}. DV01_swap (fixed leg) ≈ ${swapDv01.toFixed(2)}, opposite sign for the fixed payer. Net DV01 ≈ ${bondDv01.toFixed(2)} − ${swapDv01.toFixed(2)} ≈ ${netDv01.toFixed(2)}.`,
      },
      explanation: {
        fr: "Un payeur fixe se comporte comme un émetteur obligataire synthétique (DV01 de signe opposé à un porteur, M04-4) : combiner une obligation détenue avec un swap payeur fixe réduit le DV01 net du portefeuille, exactement comme le ferait une couverture par vente d'obligations physiques, sans avoir à vendre l'obligation elle-même.",
        en: "A fixed payer behaves like a synthetic bond issuer (DV01 of opposite sign to a holder's, M04-4): combining a held bond with a fixed-payer swap reduces the portfolio's net DV01, exactly as a hedge via selling physical bonds would, without having to sell the bond itself.",
      },
      commonMistake: {
        fr: "Additionner les deux DV01 avec le même signe, en oubliant que le payeur fixe d'un swap a un DV01 de signe opposé à celui d'un détenteur d'obligation.",
        en: "Adding the two DV01s with the same sign, forgetting a swap's fixed payer has a DV01 of opposite sign to a bondholder's.",
      },
    };
  },
};

const signMixupErrorTemplate = trueFalseTemplate({
  id: "m04-dv01-swap-erreur-signe-agregation",
  conceptId: "m04-dv01-swap",
  difficulty: "medium",
  statement: {
    fr: "Pour agréger le DV01 d'un portefeuille mêlant plusieurs swaps, on peut toujours additionner leurs DV01 en valeur absolue, sans se soucier de savoir si chaque swap est payeur ou receveur fixe.",
    en: "To aggregate a portfolio's DV01 across several swaps, you can always add their DV01s in absolute value, without worrying whether each swap is a fixed payer or receiver.",
  },
  correct: false,
  explanation: {
    fr: "Faux : un swap receveur fixe a un DV01 de signe positif (comme un porteur obligataire), tandis qu'un swap payeur fixe a un DV01 de signe négatif (comme un émetteur) : additionner leurs valeurs absolues ignorerait qu'ils peuvent se compenser mutuellement dans un portefeuille mixte. Il faut toujours conserver le signe de chaque position pour obtenir le DV01 net réellement exposé.",
    en: "False: a fixed-receiver swap has a positive-sign DV01 (like a bondholder), while a fixed-payer swap has a negative-sign DV01 (like an issuer): adding their absolute values would ignore that they can offset each other in a mixed portfolio. Each position's sign must always be kept to get the truly exposed net DV01.",
  },
  commonMistake: {
    fr: "Ignorer le signe de chaque position (payeur vs receveur) lors de l'agrégation, ce qui surestime le risque net réel d'un portefeuille contenant des positions opposées qui se compensent.",
    en: "Ignoring each position's sign (payer vs receiver) when aggregating, which overstates the true net risk of a portfolio containing offsetting opposite positions.",
  },
});

const treasuryHedgeScenarioTemplate = mcqTemplate({
  id: "m04-dv01-swap-scenario-couverture-tresorerie",
  conceptId: "m04-dv01-swap",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une trésorerie d'entreprise détient une obligation à taux fixe de DV01 = 8 000, et veut neutraliser totalement son risque de taux avec un swap sans avoir à vendre l'obligation. Quel type de swap, et dans quel sens, doit-elle conclure ?",
    en: "A corporate treasury holds a fixed-rate bond with DV01 = 8,000, and wants to fully neutralize its rate risk with a swap without selling the bond. What type of swap, and in which direction, should it enter?",
  },
  choices: [
    { id: "pay-fixed-8000", label: { fr: "Un swap payeur fixe (reçoit variable), dimensionné pour avoir un DV01 de jambe fixe d'environ 8 000, de signe opposé au DV01 de l'obligation", en: "A fixed-payer swap (receives floating), sized to have a fixed-leg DV01 of about 8,000, of opposite sign to the bond's DV01" } },
    { id: "receive-fixed-8000", label: { fr: "Un swap receveur fixe de même DV01", en: "A fixed-receiver swap of the same DV01" } },
    { id: "impossible", label: { fr: "Un swap ne peut jamais couvrir le risque de taux d'une obligation déjà détenue", en: "A swap can never hedge the rate risk of an already-held bond" } },
  ],
  correctId: "pay-fixed-8000",
  hint: { fr: "Le DV01 de l'obligation doit être compensé par un DV01 de signe opposé, exactement comme vendre un future de taux compense un DV01 obligataire (M03-8).", en: "The bond's DV01 must be offset by an opposite-sign DV01, exactly as selling a rate future offsets a bond DV01 (M03-8)." },
  explanation: {
    fr: "Un swap payeur fixe se comporte comme un émetteur obligataire synthétique, avec un DV01 de signe opposé à celui d'un détenteur d'obligation : en dimensionnant sa jambe fixe pour un DV01 d'environ 8 000, la trésorerie neutralise (approximativement) le DV01 de l'obligation détenue, sans avoir à la vendre — exactement le même principe que le dimensionnement d'une couverture par futures de taux (M03-8), transposé aux swaps.",
    en: "A fixed-payer swap behaves like a synthetic bond issuer, with a DV01 of opposite sign to a bondholder's: by sizing its fixed leg for a DV01 of about 8,000, the treasury (approximately) neutralizes the held bond's DV01, without having to sell it — exactly the same principle as sizing a rate-futures hedge (M03-8), transposed to swaps.",
  },
  commonMistake: {
    fr: "Choisir un swap receveur fixe au lieu d'un payeur fixe, ce qui ajouterait du DV01 de même signe au lieu de le compenser.",
    en: "Choosing a fixed-receiver swap instead of a fixed payer, which would add same-sign DV01 instead of offsetting it.",
  },
});

const basisDv01ScenarioTemplate = mcqTemplate({
  id: "m04-dv01-swap-scenario-basis-dv01",
  conceptId: "m04-dv01-swap",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk suit non seulement le DV01 \"classique\" (mouvement parallèle de la courbe) de son book de swaps, mais aussi un « basis DV01 » séparé. À quel risque ce second indicateur correspond-il ?",
    en: "A desk tracks not only its swap book's \"classic\" DV01 (parallel curve shift), but also a separate \"basis DV01\". What risk does this second indicator correspond to?",
  },
  choices: [
    { id: "euribor-ois-basis", label: { fr: "Le risque d'un mouvement du spread EURIBOR-OIS lui-même, indépendant d'un mouvement parallèle de la courbe des taux (M04-4)", en: "The risk of a move in the EURIBOR-OIS spread itself, independent of a parallel move in the rate curve (M04-4)" } },
    { id: "duplicate", label: { fr: "C'est un doublon exact du DV01 classique, sans information supplémentaire", en: "It's an exact duplicate of the classic DV01, with no extra information" } },
    { id: "credit-risk", label: { fr: "Le risque de contrepartie sur le swap", en: "The swap's counterparty risk" } },
  ],
  correctId: "euribor-ois-basis",
  hint: { fr: "Rappelez-vous le cadre multi-courbe : la courbe de projection EURIBOR peut bouger indépendamment de la courbe d'actualisation OIS.", en: "Remember the multi-curve framework: the EURIBOR projection curve can move independently of the OIS discounting curve." },
  explanation: {
    fr: "Dans le cadre multi-courbe, un mouvement du seul basis EURIBOR-OIS (sans mouvement de la courbe OIS elle-même) affecte la jambe variable projetée d'un swap sans affecter son actualisation : c'est un risque distinct d'un mouvement parallèle classique, que les desks professionnels suivent séparément sous le nom de « basis DV01 », en complément du DV01 traditionnel.",
    en: "In the multi-curve framework, a move in the EURIBOR-OIS basis alone (with no move in the OIS curve itself) affects a swap's projected floating leg without affecting its discounting: this is a distinct risk from a classic parallel move, which professional desks track separately as \"basis DV01\", alongside the traditional DV01.",
  },
  commonMistake: {
    fr: "Croire que le DV01 classique (mouvement parallèle) capture déjà tout le risque de taux d'un swap, en oubliant le risque distinct lié aux mouvements du basis EURIBOR-OIS propre au cadre multi-courbe.",
    en: "Believing the classic DV01 (parallel move) already captures a swap's entire rate risk, forgetting the distinct risk tied to EURIBOR-OIS basis moves specific to the multi-curve framework.",
  },
});

export const templates: QuestionTemplate[] = [
  dv01SwapNumericTemplate,
  signConventionTemplate,
  floatingLegDv01Template,
  vocabTemplate,
  comprehensionTemplate,
  midPeriodComparisonTemplate,
  payerVsShortBondComparisonTemplate,
  whatIfApproachingResetTemplate,
  netPortfolioDv01NumericTemplate,
  signMixupErrorTemplate,
  treasuryHedgeScenarioTemplate,
  basisDv01ScenarioTemplate,
];
