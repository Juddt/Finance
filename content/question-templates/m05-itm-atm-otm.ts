import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const classifyTemplate: QuestionTemplate = {
  id: "m05-itm-classification",
  conceptId: "m05-itm-atm-otm",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const optionType = pick(rng, ["call", "put"] as const);
    const S = randomInt(rng, 50, 150);
    const K = randomInt(rng, 50, 150);
    const status = S === K ? "atm" : optionType === "call" ? (S > K ? "itm" : "otm") : S < K ? "itm" : "otm";

    return {
      prompt: {
        fr: `Un ${optionType === "call" ? "call" : "put"} de strike K = ${fmt(K, "fr")} sur un sous-jacent qui cote S = ${fmt(S, "fr")}. Est-il ITM, ATM ou OTM ?`,
        en: `A ${optionType} with strike K = ${fmt(K, "en")} on an underlying trading at S = ${fmt(S, "en")}. Is it ITM, ATM or OTM?`,
      },
      choices: buildChoices([
        { id: "itm", label: { fr: "ITM (dans la monnaie)", en: "ITM (in the money)" } },
        { id: "atm", label: { fr: "ATM (à la monnaie)", en: "ATM (at the money)" } },
        { id: "otm", label: { fr: "OTM (hors la monnaie)", en: "OTM (out of the money)" } },
      ]),
      hint: {
        fr: optionType === "call" ? "Un call est ITM si S > K." : "Un put est ITM si S < K.",
        en: optionType === "call" ? "A call is ITM if S > K." : "A put is ITM if S < K.",
      },
      correctChoiceIds: [status],
      explanation: {
        fr: `S=${fmt(S, "fr")}, K=${fmt(K, "fr")}, ${optionType} : ${status === "atm" ? "S = K, donc ATM." : status === "itm" ? "l'exercice immédiat serait profitable, donc ITM." : "l'exercice immédiat ne rapporterait rien, donc OTM."}`,
        en: `S=${fmt(S, "en")}, K=${fmt(K, "en")}, ${optionType}: ${status === "atm" ? "S = K, so ATM." : status === "itm" ? "immediate exercise would be profitable, so ITM." : "immediate exercise would yield nothing, so OTM."}`,
      },
      commonMistake: {
        fr: "Appliquer la règle du call (ITM si S>K) à un put, alors que c'est l'inverse.",
        en: "Applying the call's rule (ITM if S>K) to a put, when it is the reverse.",
      },
    };
  },
};

const timeValueNumericTemplate: QuestionTemplate = {
  id: "m05-itm-valeur-temps",
  conceptId: "m05-itm-atm-otm",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const optionType = pick(rng, ["call", "put"] as const);
    const K = randomInt(rng, 50, 150);
    const S = optionType === "call" ? K + randomInt(rng, 1, 30) : K - randomInt(rng, 1, 30);
    const intrinsic = optionType === "call" ? Math.max(S - K, 0) : Math.max(K - S, 0);
    const premium = intrinsic + randomInt(rng, 1, 10);
    const timeValue = premium - intrinsic;

    return {
      isScenario: true,
      prompt: {
        fr: `Un ${optionType} de strike K = ${fmt(K, "fr")} sur un sous-jacent à S = ${fmt(S, "fr")} se négocie à une prime de ${fmt(premium, "fr")}. Quelle est sa valeur temps ?`,
        en: `A ${optionType} with strike K = ${fmt(K, "en")} on an underlying at S = ${fmt(S, "en")} trades at a premium of ${fmt(premium, "en")}. What is its time value?`,
      },
      numericUnit: { fr: "même devise que la prime", en: "same currency as the premium" },
      numericTolerance: "± 0.1",
      hint: { fr: "Valeur temps = Prime − Valeur intrinsèque.", en: "Time value = Premium − Intrinsic value." },
      numeric: { value: timeValue, tolerance: 0.1 },
      calculation: {
        fr: `Valeur intrinsèque = ${optionType === "call" ? `max(${S}−${K},0)` : `max(${K}−${S},0)`} = ${intrinsic}. Valeur temps = ${premium} − ${intrinsic} = ${timeValue}.`,
        en: `Intrinsic value = ${optionType === "call" ? `max(${S}−${K},0)` : `max(${K}−${S},0)`} = ${intrinsic}. Time value = ${premium} − ${intrinsic} = ${timeValue}.`,
      },
      explanation: {
        fr: "La valeur temps est toujours la part de la prime qui dépasse ce que rapporterait un exercice immédiat.",
        en: "Time value is always the part of the premium beyond what immediate exercise would yield.",
      },
      commonMistake: {
        fr: "Oublier de calculer d'abord la valeur intrinsèque avant de la soustraire de la prime.",
        en: "Forgetting to compute intrinsic value first before subtracting it from the premium.",
      },
    };
  },
};

const americanEarlyExerciseTemplate: QuestionTemplate = {
  id: "m05-itm-europeenne-anticipe",
  conceptId: "m05-itm-atm-otm",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Une option européenne, même profondément ITM, peut être exercée par son détenteur à tout moment avant l'échéance s'il le juge avantageux.",
      en: "A European option, even deep ITM, can be exercised by its holder at any time before expiry if they find it advantageous.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : par définition, une option européenne ne peut être exercée qu'à l'échéance, quel que soit son niveau ITM. Seule une option américaine permet un exercice anticipé.",
      en: "False: by definition, a European option can only be exercised at expiry, regardless of how deep ITM it is. Only an American option allows early exercise.",
    },
    commonMistake: {
      fr: "Confondre les deux styles d'exercice, une erreur très fréquente en début d'apprentissage.",
      en: "Confusing the two exercise styles, a very common early mistake.",
    },
  }),
};

const zeroTimeValueTemplate: QuestionTemplate = {
  id: "m05-itm-expiry-vocab",
  conceptId: "m05-itm-atm-otm",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Exactement à l'échéance d'une option, sa valeur temps devient toujours ______.",
      en: "Exactly at an option's expiry, its time value always becomes ______.",
    },
    fillBlankPlaceholder: { fr: "un mot ou nombre", en: "one word or number" },
    acceptedAnswers: ["nulle", "zero", "nul", "0"],
    hint: { fr: "Il ne reste plus de temps pour que l'incertitude joue.", en: "There is no time left for uncertainty to play out." },
    explanation: {
      fr: "À l'échéance, la prime égale exactement la valeur intrinsèque : la valeur temps, qui rémunère l'incertitude restante, disparaît.",
      en: "At expiry, the premium equals exactly the intrinsic value: time value, which compensates for remaining uncertainty, vanishes.",
    },
    commonMistake: {
      fr: "Penser que la valeur temps peut rester positive après l'échéance.",
      en: "Thinking time value can remain positive after expiry.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m05-itm-comprehension-utilite",
  conceptId: "m05-itm-atm-otm",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi une option a-t-elle presque toujours une prime supérieure à sa seule valeur intrinsèque, avant l'échéance ?",
    en: "Why does an option almost always trade at a premium above its intrinsic value alone, before expiry?",
  },
  choices: [
    { id: "uncertainty", label: { fr: "Parce que le marché rémunère l'incertitude restante : le sous-jacent peut encore bouger favorablement d'ici l'échéance", en: "Because the market compensates for the remaining uncertainty: the underlying can still move favorably before expiry" } },
    { id: "always-equal", label: { fr: "En réalité la prime est toujours strictement égale à la valeur intrinsèque", en: "In reality the premium is always strictly equal to the intrinsic value" } },
    { id: "fees-only", label: { fr: "Ce surplus ne représente que des frais de courtage", en: "This extra amount only represents brokerage fees" } },
  ],
  correctId: "uncertainty",
  hint: { fr: "Ce surplus s'appelle la valeur temps — pensez à ce qu'il rémunère.", en: "This extra amount is called time value — think about what it compensates for." },
  explanation: {
    fr: "Tant qu'il reste du temps avant l'échéance, le sous-jacent peut encore évoluer favorablement pour le détenteur de l'option : ce potentiel restant, même pour une option déjà ITM, a une valeur que le marché intègre dans la prime au-delà de la seule valeur intrinsèque. C'est exactement ce qu'on appelle la valeur temps.",
    en: "As long as time remains before expiry, the underlying can still move favorably for the option holder: this remaining potential, even for an already ITM option, has value the market prices into the premium beyond intrinsic value alone. This is exactly what's called time value.",
  },
  commonMistake: {
    fr: "Croire qu'une option se négocie toujours exactement à sa valeur intrinsèque, en ignorant la valeur temps qui la complète avant l'échéance.",
    en: "Believing an option always trades exactly at its intrinsic value, ignoring the time value that supplements it before expiry.",
  },
});

const highestTimeValueComparisonTemplate = mcqTemplate({
  id: "m05-itm-comparaison-valeur-temps-maximale",
  conceptId: "m05-itm-atm-otm",
  difficulty: "medium",
  prompt: {
    fr: "Parmi une option ITM, une ATM et une OTM de même échéance sur le même sous-jacent, laquelle a généralement la valeur temps la plus élevée ?",
    en: "Among an ITM, an ATM and an OTM option of the same maturity on the same underlying, which one generally has the highest time value?",
  },
  choices: [
    { id: "atm", label: { fr: "L'option ATM", en: "The ATM option" } },
    { id: "itm", label: { fr: "L'option ITM", en: "The ITM option" } },
    { id: "otm", label: { fr: "L'option OTM", en: "The OTM option" } },
  ],
  correctId: "atm",
  hint: { fr: "L'incertitude sur la direction future est maximale précisément quand on ne sait pas encore si l'option finira ITM ou OTM.", en: "Uncertainty about the future direction is highest precisely when it's still unclear whether the option will end up ITM or OTM." },
  explanation: {
    fr: "La valeur temps rémunère l'incertitude sur le résultat final : elle est maximale pour une option ATM, où l'issue (ITM ou OTM à l'échéance) est la plus incertaine. Une option profondément ITM ou OTM a une issue déjà presque \"décidée\", donc une valeur temps plus faible, même si sa prime totale (avec la valeur intrinsèque pour l'ITM) peut rester élevée.",
    en: "Time value compensates for uncertainty about the final outcome: it is highest for an ATM option, where the outcome (ITM or OTM at expiry) is most uncertain. A deeply ITM or OTM option has an outcome already nearly \"decided\", hence lower time value, even though its total premium (including intrinsic value for the ITM one) can remain high.",
  },
  commonMistake: {
    fr: "Confondre la prime totale (qui peut être élevée pour une option ITM à cause de la valeur intrinsèque) avec la seule valeur temps, qui est maximale ATM.",
    en: "Confusing the total premium (which can be high for an ITM option due to intrinsic value) with time value alone, which is maximal ATM.",
  },
});

const whatIfDeeperItmTemplate = mcqTemplate({
  id: "m05-itm-whatif-plus-profondement-itm",
  conceptId: "m05-itm-atm-otm",
  difficulty: "medium",
  prompt: {
    fr: "Un call déjà ITM voit le sous-jacent monter encore davantage, l'enfonçant plus profondément dans la monnaie. Toutes choses égales par ailleurs sur le temps restant, que devient typiquement sa valeur temps ?",
    en: "An already ITM call sees the underlying rise even further, pushing it deeper in the money. All else equal on remaining time, what typically happens to its time value?",
  },
  choices: [
    { id: "decreases", label: { fr: "Elle a tendance à diminuer : l'issue de l'option devient de plus en plus certaine (quasi certainement ITM à l'échéance)", en: "It tends to decrease: the option's outcome becomes increasingly certain (nearly certain to be ITM at expiry)" } },
    { id: "increases", label: { fr: "Elle continue d'augmenter avec le sous-jacent", en: "It keeps increasing along with the underlying" } },
    { id: "unaffected", label: { fr: "Elle ne dépend jamais du niveau du sous-jacent", en: "It never depends on the underlying's level" } },
  ],
  correctId: "decreases",
  hint: { fr: "Une option très profondément ITM se comporte presque comme le sous-jacent lui-même, avec une issue presque certaine.", en: "A very deep ITM option behaves almost like the underlying itself, with an almost certain outcome." },
  explanation: {
    fr: "Plus une option s'enfonce profondément ITM, plus son issue à l'échéance devient certaine (elle sera presque sûrement exercée) : l'incertitude que rémunère la valeur temps diminue, et cette dernière tend vers zéro pour une option extrêmement profonde ITM, même si sa prime totale (dominée par la valeur intrinsèque) reste très élevée.",
    en: "The deeper an option moves ITM, the more certain its outcome at expiry becomes (it will almost surely be exercised): the uncertainty that time value compensates for decreases, and it tends toward zero for an extremely deep ITM option, even though its total premium (dominated by intrinsic value) remains very high.",
  },
  commonMistake: {
    fr: "Croire que la valeur temps continue d'augmenter indéfiniment avec le sous-jacent, en confondant son comportement avec celui de la valeur intrinsèque.",
    en: "Believing time value keeps increasing indefinitely with the underlying, confusing its behavior with intrinsic value's.",
  },
});

const whatIfTimePassesTemplate = mcqTemplate({
  id: "m05-itm-whatif-passage-temps",
  conceptId: "m05-itm-atm-otm",
  difficulty: "easy",
  prompt: {
    fr: "Toutes choses égales par ailleurs sur le prix du sous-jacent, à mesure que l'échéance d'une option se rapproche, que devient sa valeur temps ?",
    en: "All else equal on the underlying's price, as an option's expiry approaches, what happens to its time value?",
  },
  choices: [
    { id: "decreases", label: { fr: "Elle diminue progressivement, pour atteindre zéro exactement à l'échéance", en: "It progressively decreases, reaching zero exactly at expiry" } },
    { id: "increases", label: { fr: "Elle augmente à mesure que l'échéance approche", en: "It increases as expiry approaches" } },
    { id: "constant", label: { fr: "Elle reste constante jusqu'à l'échéance", en: "It stays constant until expiry" } },
  ],
  correctId: "decreases",
  hint: { fr: "Moins de temps signifie moins d'occasions pour le sous-jacent de bouger favorablement.", en: "Less time means fewer chances for the underlying to move favorably." },
  explanation: {
    fr: "Moins il reste de temps avant l'échéance, moins il reste d'opportunités pour que le sous-jacent évolue favorablement : la valeur temps s'érode donc progressivement (un phénomène appelé « décroissance temporelle » ou theta), pour s'annuler exactement à l'échéance, quel que soit le niveau du sous-jacent.",
    en: "The less time remains before expiry, the fewer opportunities remain for the underlying to move favorably: time value therefore progressively erodes (a phenomenon called \"time decay\" or theta), vanishing exactly at expiry, whatever the underlying's level.",
  },
  commonMistake: {
    fr: "Ignorer l'érosion temporelle de la valeur temps, en supposant à tort qu'elle ne dépend que du niveau du sous-jacent, pas du temps restant.",
    en: "Ignoring time value's temporal erosion, wrongly assuming it depends only on the underlying's level, not the remaining time.",
  },
});

const breakevenNumericTemplate: QuestionTemplate = {
  id: "m05-itm-breakeven-calcul",
  conceptId: "m05-itm-atm-otm",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const optionType = pick(rng, ["call", "put"] as const);
    const K = randomInt(rng, 50, 150);
    const premium = randomInt(rng, 3, 20);
    const breakeven = optionType === "call" ? K + premium : K - premium;

    return {
      isScenario: true,
      prompt: {
        fr: `Un acheteur paie une prime de ${premium} pour un ${optionType} de strike K = ${K}. À quel prix du sous-jacent à l'échéance S_T l'acheteur atteint-il exactement son seuil de rentabilité (breakeven), avant tout autre frais ?`,
        en: `A buyer pays a premium of ${premium} for a ${optionType} with strike K = ${K}. At what underlying price at expiry S_T does the buyer exactly reach their breakeven, before any other cost?`,
      },
      numericUnit: { fr: "même unité que K", en: "same unit as K" },
      numericTolerance: "± 0.5",
      hint: {
        fr: optionType === "call" ? "Breakeven call = K + Prime." : "Breakeven put = K − Prime.",
        en: optionType === "call" ? "Call breakeven = K + Premium." : "Put breakeven = K − Premium.",
      },
      numeric: { value: breakeven, tolerance: 0.5 },
      calculation: {
        fr: optionType === "call" ? `Breakeven = ${K} + ${premium} = ${breakeven}.` : `Breakeven = ${K} − ${premium} = ${breakeven}.`,
        en: optionType === "call" ? `Breakeven = ${K} + ${premium} = ${breakeven}.` : `Breakeven = ${K} − ${premium} = ${breakeven}.`,
      },
      explanation: {
        fr: "Le seuil de rentabilité intègre la prime payée : un call ITM au strike seul ne suffit pas à couvrir le coût d'achat de l'option, il faut que S_T dépasse K d'au moins le montant de la prime (et symétriquement en dessous de K pour un put).",
        en: "The breakeven accounts for the premium paid: a call merely ITM at the strike isn't enough to cover the option's purchase cost, S_T must exceed K by at least the premium's amount (and symmetrically below K for a put).",
      },
      commonMistake: {
        fr: "Croire qu'une option ITM dès S_T > K (pour un call) est automatiquement profitable pour l'acheteur, en oubliant d'intégrer la prime payée dans le calcul du seuil de rentabilité.",
        en: "Believing an option ITM as soon as S_T > K (for a call) is automatically profitable for the buyer, forgetting to include the premium paid in the breakeven calculation.",
      },
    };
  },
};

const otmWorthlessErrorTemplate = trueFalseTemplate({
  id: "m05-itm-erreur-otm-sans-valeur",
  conceptId: "m05-itm-atm-otm",
  difficulty: "easy",
  statement: {
    fr: "Une option OTM, ayant une valeur intrinsèque nulle, se négocie toujours à une prime de zéro sur le marché, avant l'échéance.",
    en: "An OTM option, having zero intrinsic value, always trades at a zero premium in the market, before expiry.",
  },
  correct: false,
  explanation: {
    fr: "Faux : une option OTM a bien une valeur intrinsèque nulle, mais conserve une valeur temps positive tant qu'il reste du temps avant l'échéance (le sous-jacent peut encore bouger et la faire entrer dans la monnaie). Sa prime n'est donc nulle qu'exactement à l'échéance, pas avant.",
    en: "False: an OTM option does have zero intrinsic value, but retains positive time value as long as time remains before expiry (the underlying can still move and bring it into the money). Its premium is therefore only zero exactly at expiry, not before.",
  },
  commonMistake: {
    fr: "Confondre valeur intrinsèque nulle (vrai pour toute option OTM) avec prime totale nulle (faux avant l'échéance).",
    en: "Confusing zero intrinsic value (true for any OTM option) with zero total premium (false before expiry).",
  },
});

const bullishLeverageScenarioTemplate = mcqTemplate({
  id: "m05-itm-scenario-choix-strike-haussier",
  conceptId: "m05-itm-atm-otm",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un investisseur veut parier sur une forte hausse d'une action, avec un budget limité et une tolérance élevée au risque de perdre toute sa mise. Entre un call profondément ITM (prime élevée) et un call nettement OTM (prime faible), lequel offre le plus fort effet de levier potentiel ?",
    en: "An investor wants to bet on a sharp stock rally, with a limited budget and a high tolerance for losing their entire stake. Between a deep ITM call (high premium) and a clearly OTM call (low premium), which offers the strongest potential leverage?",
  },
  choices: [
    { id: "otm", label: { fr: "Le call OTM : sa prime plus faible permet d'acheter plus de contrats pour le même budget, amplifiant le gain en % si le pari se réalise", en: "The OTM call: its lower premium allows buying more contracts for the same budget, amplifying the % gain if the bet pays off" } },
    { id: "itm", label: { fr: "Le call ITM offre toujours le meilleur effet de levier", en: "The ITM call always offers the best leverage" } },
    { id: "same", label: { fr: "Les deux offrent exactement le même effet de levier", en: "Both offer exactly the same leverage" } },
  ],
  correctId: "otm",
  hint: { fr: "Levier = combien de contrats un budget donné permet d'acheter, multiplié par la sensibilité de chaque contrat.", en: "Leverage = how many contracts a given budget can buy, multiplied by each contract's sensitivity." },
  explanation: {
    fr: "Un call OTM, moins cher, permet d'acheter davantage de contrats pour le même budget : si le pari haussier se réalise fortement, le gain en pourcentage de la mise initiale peut être bien plus élevé qu'avec un call ITM plus cher — mais au prix d'un risque de perte totale bien plus probable si le sous-jacent ne monte pas suffisamment (voire pas du tout), l'option expirant alors sans valeur.",
    en: "A cheaper OTM call allows buying more contracts for the same budget: if the bullish bet pays off strongly, the percentage gain on the initial stake can be much higher than with a pricier ITM call — but at the cost of a much more likely total loss if the underlying doesn't rise enough (or at all), the option then expiring worthless.",
  },
  commonMistake: {
    fr: "Croire qu'une option ITM, plus chère, offre systématiquement un meilleur potentiel de gain en pourcentage, en oubliant que le levier dépend du nombre de contrats accessibles pour un budget donné.",
    en: "Believing a pricier ITM option systematically offers a better percentage-gain potential, forgetting leverage depends on the number of contracts accessible for a given budget.",
  },
});

const nearExpiryOtmScenarioTemplate = mcqTemplate({
  id: "m05-itm-scenario-otm-proche-echeance",
  conceptId: "m05-itm-atm-otm",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un investisseur détient un call légèrement OTM, à seulement 2 jours de l'échéance, avec le sous-jacent qui stagne. Que va probablement faire sa prime dans les jours qui viennent, si rien d'autre ne change ?",
    en: "An investor holds a slightly OTM call, only 2 days from expiry, with the underlying flat. What will its premium likely do in the coming days, if nothing else changes?",
  },
  choices: [
    { id: "decay-to-zero", label: { fr: "Elle va s'éroder rapidement vers zéro, la décroissance temporelle (theta) étant particulièrement rapide dans les derniers jours pour une option proche de la monnaie", en: "It will erode rapidly toward zero, time decay (theta) being particularly fast in the last days for a near-the-money option" } },
    { id: "stable", label: { fr: "Elle va rester stable jusqu'à l'échéance", en: "It will stay stable until expiry" } },
    { id: "increase", label: { fr: "Elle va augmenter mécaniquement à mesure que l'échéance approche", en: "It will mechanically increase as expiry approaches" } },
  ],
  correctId: "decay-to-zero",
  hint: { fr: "La décroissance temporelle s'accélère typiquement dans les derniers jours de vie d'une option proche de la monnaie.", en: "Time decay typically accelerates in an option's last days of life when it's near the money." },
  explanation: {
    fr: "À seulement 2 jours de l'échéance, l'incertitude sur l'issue finale (ITM ou OTM) se réduit très rapidement pour une option déjà légèrement OTM : sa valeur temps, déjà limitée, s'érode alors particulièrement vite (l'effet theta étant le plus prononcé en toute fin de vie pour une option proche de la monnaie), tendant vers zéro si le sous-jacent ne bouge pas.",
    en: "With only 2 days left to expiry, uncertainty about the final outcome (ITM or OTM) shrinks very quickly for an already slightly OTM option: its already-limited time value then erodes particularly fast (the theta effect being most pronounced at the very end of life for a near-the-money option), tending toward zero if the underlying doesn't move.",
  },
  commonMistake: {
    fr: "Sous-estimer la vitesse de décroissance de la valeur temps dans les tout derniers jours avant l'échéance, en la traitant comme un phénomène linéaire et constant tout au long de la vie de l'option.",
    en: "Underestimating time value's decay speed in the very last days before expiry, treating it as a linear, constant phenomenon throughout the option's life.",
  },
});

export const templates: QuestionTemplate[] = [
  classifyTemplate,
  timeValueNumericTemplate,
  americanEarlyExerciseTemplate,
  zeroTimeValueTemplate,
  comprehensionTemplate,
  highestTimeValueComparisonTemplate,
  whatIfDeeperItmTemplate,
  whatIfTimePassesTemplate,
  breakevenNumericTemplate,
  otmWorthlessErrorTemplate,
  bullishLeverageScenarioTemplate,
  nearExpiryOtmScenarioTemplate,
];
