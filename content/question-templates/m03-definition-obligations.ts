import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const zeroCouponPriceTemplate: QuestionTemplate = {
  id: "m03-def-oblig-zero-coupon-prix",
  conceptId: "m03-definition-obligations",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 20) * 100;
    const rPct = randomInt(rng, 1, 8);
    const T = randomInt(rng, 1, 10);
    const r = rPct / 100;
    const P = Math.round((F / Math.pow(1 + r, T)) * 100) / 100;

    return {
      prompt: {
        fr: `Une obligation zéro-coupon a une valeur nominale F = ${F}, une maturité T = ${T} an(s), et le taux exigé est r = ${rPct}%. Quel est son prix aujourd'hui ?`,
        en: `A zero-coupon bond has face value F = ${F}, maturity T = ${T} year(s), and the required rate is r = ${rPct}%. What is its price today?`,
      },
      numericUnit: { fr: "même devise que F", en: "same currency as F" },
      numericTolerance: "± 0.5",
      hint: { fr: "P = F / (1+r)^T.", en: "P = F / (1+r)^T." },
      numeric: { value: P, tolerance: 0.5 },
      calculation: {
        fr: `P = ${F} / (1,${rPct.toString().padStart(2, "0")})^${T} ≈ ${fmt(P, "fr")}.`,
        en: `P = ${F} / (1.${rPct.toString().padStart(2, "0")})^${T} ≈ ${fmt(P, "en")}.`,
      },
      explanation: {
        fr: "Le prix d'un zéro-coupon est simplement le nominal actualisé sur toute la période, sans aucun flux intermédiaire.",
        en: "A zero-coupon bond's price is simply the face value discounted over the whole period, with no intermediate flow.",
      },
      commonMistake: {
        fr: "Oublier d'élever (1+r) à la puissance T, ou ajouter par erreur un coupon qui n'existe pas pour ce type d'obligation.",
        en: "Forgetting to raise (1+r) to the power T, or mistakenly adding a coupon that does not exist for this bond type.",
      },
    };
  },
};

const priceVsRateTemplate: QuestionTemplate = {
  id: "m03-def-oblig-prix-vs-taux",
  conceptId: "m03-definition-obligations",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const higherRate = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Deux obligations zéro-coupon identiques sauf sur le taux exigé : l'une a un taux ${higherRate ? "plus élevé" : "plus bas"} que l'autre. Laquelle a le prix le plus ${higherRate ? "bas" : "élevé"} ?`,
        en: `Two identical zero-coupon bonds except for the required rate: one has a ${higherRate ? "higher" : "lower"} rate than the other. Which one has the ${higherRate ? "lower" : "higher"} price?`,
      },
      choices: buildChoices([
        { id: "high-rate", label: { fr: "Celle avec le taux le plus élevé", en: "The one with the higher rate" } },
        { id: "low-rate", label: { fr: "Celle avec le taux le plus bas", en: "The one with the lower rate" } },
      ]),
      hint: { fr: "P = F / (1+r)^T : que se passe-t-il au dénominateur quand r augmente ?", en: "P = F / (1+r)^T: what happens to the denominator as r rises?" },
      correctChoiceIds: ["high-rate"],
      explanation: {
        fr: "Un taux exigé plus élevé augmente le dénominateur (1+r)^T, donc diminue le prix P = F/(1+r)^T.",
        en: "A higher required rate increases the denominator (1+r)^T, so it lowers the price P = F/(1+r)^T.",
      },
      commonMistake: {
        fr: "Penser qu'un taux plus élevé rend l'obligation plus chère, en confondant le taux de coupon (qui verse plus) et le taux d'actualisation (qui déprécie le prix).",
        en: "Thinking a higher rate makes the bond more expensive, confusing the coupon rate (which pays more) with the discount rate (which lowers the price).",
      },
    };
  },
};

const zeroCouponTrueFalseTemplate: QuestionTemplate = {
  id: "m03-def-oblig-zero-coupon-vf",
  conceptId: "m03-definition-obligations",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Une obligation zéro-coupon ne rapporte aucun rendement à son détenteur, puisqu'elle ne verse aucun coupon avant l'échéance.",
      en: "A zero-coupon bond earns its holder no return at all, since it pays no coupon before maturity.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : toute la rémunération est concentrée dans la décote entre le prix d'achat et la valeur nominale remboursée à l'échéance.",
      en: "False: the entire return is concentrated in the discount between the purchase price and the face value repaid at maturity.",
    },
    commonMistake: {
      fr: "Associer \"pas de coupon versé\" à \"pas de rendement du tout\".",
      en: "Equating \"no coupon paid\" with \"no return at all\".",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m03-def-oblig-vocab",
  conceptId: "m03-definition-obligations",
  kind: "fill_blank",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const face = randomInt(rng, 1, 5) * 500;
    return {
      prompt: {
        fr: `Le montant remboursé à l'échéance d'une obligation, servant aussi de base au calcul des coupons, s'appelle la valeur ______ (ex. ${fmt(face, "fr", 0)} EUR).`,
        en: `The amount repaid at a bond's maturity, also used as the base to compute coupons, is called the ______ value (e.g. ${fmt(face, "en", 0)} EUR).`,
      },
      fillBlankPlaceholder: { fr: "un mot", en: "one word" },
      acceptedAnswers: ["nominale", "nominal", "face"],
      hint: { fr: "Aussi appelée « valeur au pair ».", en: "Also called \"par value\"." },
      explanation: {
        fr: "La valeur nominale (ou valeur au pair) est le montant de référence de l'obligation, remboursé à l'échéance.",
        en: "The face value (or par value) is the bond's reference amount, repaid at maturity.",
      },
      commonMistake: {
        fr: "Confondre valeur nominale et prix de marché, qui lui varie constamment.",
        en: "Confusing face value with market price, which constantly fluctuates.",
      },
    };
  },
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-def-oblig-comprehension-utilite",
  conceptId: "m03-definition-obligations",
  difficulty: "easy",
  prompt: {
    fr: "Quelle est la différence fondamentale entre détenir une obligation et détenir une action de la même entreprise ?",
    en: "What is the fundamental difference between holding a bond and holding a share of the same company?",
  },
  choices: [
    { id: "creditor", label: { fr: "L'obligataire est un créancier avec des paiements contractuellement fixés ; l'actionnaire est propriétaire avec un rendement résiduel et variable", en: "The bondholder is a creditor with contractually fixed payments; the shareholder is an owner with a residual, variable return" } },
    { id: "same-rights", label: { fr: "Les deux confèrent exactement les mêmes droits de vote et de propriété", en: "Both confer exactly the same voting and ownership rights" } },
    { id: "bond-riskier", label: { fr: "L'obligation est toujours plus risquée que l'action de la même entreprise", en: "The bond is always riskier than the same company's share" } },
  ],
  correctId: "creditor",
  hint: { fr: "L'un prête de l'argent à l'entreprise, l'autre en détient une part.", en: "One lends money to the company, the other owns a piece of it." },
  explanation: {
    fr: "L'obligataire prête de l'argent à l'émetteur et a droit à des paiements fixés contractuellement (coupons + remboursement), prioritaires en cas de difficulté ; l'actionnaire est propriétaire de l'entreprise et reçoit un rendement résiduel et variable (dividendes, plus-value), mais sans garantie et avec une priorité inférieure en cas de faillite.",
    en: "The bondholder lends money to the issuer and is entitled to contractually fixed payments (coupons + redemption), prioritized in case of trouble; the shareholder owns the company and receives a residual, variable return (dividends, capital gains), but with no guarantee and lower priority in bankruptcy.",
  },
  commonMistake: {
    fr: "Croire qu'une obligation est systématiquement plus risquée qu'une action, alors que c'est généralement l'inverse grâce à sa priorité de paiement et à ses flux contractuellement fixés.",
    en: "Believing a bond is systematically riskier than a stock, when it's generally the opposite thanks to its payment priority and contractually fixed cash flows.",
  },
});

const govVsCorpComparisonTemplate = mcqTemplate({
  id: "m03-def-oblig-comparaison-etat-entreprise",
  conceptId: "m03-definition-obligations",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même maturité, même devise), une obligation d'État bien noté et une obligation d'une entreprise plus risquée : laquelle offre généralement le rendement exigé le plus élevé ?",
    en: "All else equal (same maturity, same currency), a well-rated government bond and a riskier corporate bond: which one generally offers the higher required yield?",
  },
  choices: [
    { id: "corporate", label: { fr: "L'obligation d'entreprise, pour compenser son risque de défaut plus élevé", en: "The corporate bond, to compensate for its higher default risk" } },
    { id: "government", label: { fr: "L'obligation d'État, car elle est toujours plus rémunératrice", en: "The government bond, since it is always more rewarding" } },
    { id: "same", label: { fr: "Les deux offrent toujours exactement le même rendement", en: "Both always offer exactly the same yield" } },
  ],
  correctId: "corporate",
  hint: { fr: "Un investisseur exige d'être payé pour le risque supplémentaire qu'il accepte.", en: "An investor demands to be paid for the extra risk they accept." },
  explanation: {
    fr: "Un émetteur perçu comme plus risqué (probabilité de défaut plus élevée) doit offrir un rendement plus élevé pour attirer les investisseurs, qui exigent une compensation pour ce risque supplémentaire : c'est le principe même du spread de crédit, approfondi dans la notion sur le risque de crédit (M03).",
    en: "An issuer perceived as riskier (higher default probability) must offer a higher yield to attract investors, who demand compensation for that extra risk: this is precisely the credit spread principle, explored further in the credit risk concept (M03).",
  },
  commonMistake: {
    fr: "Croire qu'un État offre toujours le meilleur rendement, en oubliant que c'est justement sa sécurité perçue qui lui permet d'emprunter moins cher, pas l'inverse.",
    en: "Believing a government always offers the best yield, forgetting it is precisely its perceived safety that lets it borrow more cheaply, not the other way around.",
  },
});

const whatIfLongerMaturityTemplate = mcqTemplate({
  id: "m03-def-oblig-whatif-maturite-plus-longue",
  conceptId: "m03-definition-obligations",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même F, même r), si la maturité T d'une obligation zéro-coupon est allongée, que devient son prix aujourd'hui ?",
    en: "All else equal (same F, same r), if a zero-coupon bond's maturity T is lengthened, what happens to its price today?",
  },
  choices: [
    { id: "down", label: { fr: "Le prix diminue : il faut actualiser F sur une période plus longue", en: "The price falls: F must be discounted over a longer period" } },
    { id: "up", label: { fr: "Le prix augmente", en: "The price rises" } },
    { id: "same", label: { fr: "Le prix ne change pas, seul F compte", en: "The price stays the same, only F matters" } },
  ],
  correctId: "down",
  hint: { fr: "P = F/(1+r)^T : un exposant T plus grand agit sur le dénominateur.", en: "P = F/(1+r)^T: a larger exponent T acts on the denominator." },
  explanation: {
    fr: "Le dénominateur (1+r)^T croît avec T, donc P = F/(1+r)^T diminue : plus l'échéance est lointaine, plus le montant final F doit être fortement actualisé pour obtenir sa valeur aujourd'hui, et donc plus le prix actuel est faible.",
    en: "The denominator (1+r)^T grows with T, so P = F/(1+r)^T falls: the further out the maturity, the more heavily the final amount F must be discounted to get today's value, and so the lower today's price.",
  },
  commonMistake: {
    fr: "Croire qu'une maturité plus longue augmente le prix, en confondant l'effet de T avec celui d'un nominal F plus élevé.",
    en: "Believing a longer maturity raises the price, confusing T's effect with that of a higher face value F.",
  },
});

const whatIfDoubleFaceValueTemplate = mcqTemplate({
  id: "m03-def-oblig-whatif-double-nominal",
  conceptId: "m03-definition-obligations",
  difficulty: "easy",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même r, même T), si la valeur nominale F d'une obligation zéro-coupon double, que devient son prix aujourd'hui ?",
    en: "All else equal (same r, same T), if a zero-coupon bond's face value F doubles, what happens to its price today?",
  },
  choices: [
    { id: "double", label: { fr: "Le prix double exactement", en: "The price exactly doubles" } },
    { id: "more-than-double", label: { fr: "Le prix plus que double", en: "The price more than doubles" } },
    { id: "unchanged", label: { fr: "Le prix ne change pas", en: "The price stays unchanged" } },
  ],
  correctId: "double",
  hint: { fr: "P = F/(1+r)^T : F apparaît au numérateur, de façon linéaire.", en: "P = F/(1+r)^T: F appears in the numerator, linearly." },
  explanation: {
    fr: "P est directement proportionnel à F : doubler F double exactement P, puisque (1+r)^T ne dépend pas de F. C'est une relation linéaire simple, contrairement à l'effet non linéaire de r ou de T.",
    en: "P is directly proportional to F: doubling F exactly doubles P, since (1+r)^T doesn't depend on F. This is a simple linear relationship, unlike the non-linear effect of r or T.",
  },
  commonMistake: {
    fr: "Supposer une relation non linéaire entre F et P, alors que F entre de façon purement proportionnelle dans la formule.",
    en: "Assuming a non-linear relationship between F and P, when F enters the formula purely proportionally.",
  },
});

const impliedMaturityNumericTemplate: QuestionTemplate = {
  id: "m03-def-oblig-maturite-implicite-calcul",
  conceptId: "m03-definition-obligations",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 20) * 100;
    const rPct = randomInt(rng, 2, 8);
    const r = rPct / 100;
    const T = randomInt(rng, 2, 10);
    const P = Math.round((F / Math.pow(1 + r, T)) * 100) / 100;
    const impliedT = Math.round((Math.log(F / P) / Math.log(1 + r)) * 100) / 100;

    return {
      prompt: {
        fr: `Une obligation zéro-coupon de nominal F = ${F} se négocie à P = ${P.toFixed(2)}, avec un taux exigé r = ${rPct}%. Quelle maturité T (en années) est implicite dans ce prix ?`,
        en: `A zero-coupon bond with face value F = ${F} trades at P = ${P.toFixed(2)}, with a required rate r = ${rPct}%. What maturity T (in years) is implied by this price?`,
      },
      numericUnit: { fr: "années", en: "years" },
      numericTolerance: "± 0.15",
      hint: { fr: "Inversez P = F/(1+r)^T : T = ln(F/P) / ln(1+r).", en: "Invert P = F/(1+r)^T: T = ln(F/P) / ln(1+r)." },
      numeric: { value: impliedT, tolerance: 0.15 },
      calculation: {
        fr: `T = ln(${F}/${P.toFixed(2)}) / ln(1,${rPct.toString().padStart(2, "0")}) ≈ ${impliedT.toFixed(2)} ans.`,
        en: `T = ln(${F}/${P.toFixed(2)}) / ln(1.${rPct.toString().padStart(2, "0")}) ≈ ${impliedT.toFixed(2)} years.`,
      },
      explanation: {
        fr: "Inverser la formule du zéro-coupon avec un logarithme permet de retrouver la maturité implicite dans un couple (prix, taux) coté sur le marché, utile quand cette information n'est pas directement communiquée.",
        en: "Inverting the zero-coupon formula with a logarithm lets you recover the maturity implied by a market-quoted (price, rate) pair, useful when that information isn't directly disclosed.",
      },
      commonMistake: {
        fr: "Oublier de passer par un logarithme pour isoler T, qui est un exposant et ne peut pas être isolé par une simple division.",
        en: "Forgetting to use a logarithm to isolate T, which is an exponent and cannot be isolated by simple division.",
      },
    };
  },
};

const bondVsStockPriorityErrorTemplate = trueFalseTemplate({
  id: "m03-def-oblig-erreur-priorite-faillite",
  conceptId: "m03-definition-obligations",
  difficulty: "medium",
  statement: {
    fr: "En cas de faillite d'une entreprise, les actionnaires sont remboursés avant les obligataires, car ils sont propriétaires de l'entreprise.",
    en: "In the event of a company's bankruptcy, shareholders are repaid before bondholders, since they own the company.",
  },
  correct: false,
  explanation: {
    fr: "Faux : c'est l'inverse. Les obligataires, en tant que créanciers, sont remboursés en priorité sur les actifs restants ; les actionnaires, propriétaires résiduels, ne récupèrent quelque chose qu'une fois TOUS les créanciers intégralement remboursés — ce qui explique pourquoi une action perd souvent toute sa valeur en cas de faillite, bien avant que l'obligation ne le fasse.",
    en: "False: it's the opposite. Bondholders, as creditors, are repaid first from the remaining assets; shareholders, residual owners, only recover something once ALL creditors have been repaid in full — which explains why a stock often loses all its value in a bankruptcy well before the bond does.",
  },
  commonMistake: {
    fr: "Croire que la propriété (actionnaire) confère une priorité de paiement supérieure à la créance (obligataire), alors que c'est structurellement l'inverse.",
    en: "Believing ownership (shareholder) confers a higher payment priority than a claim (bondholder), when it is structurally the opposite.",
  },
});

const retireeIncomeScenarioTemplate = mcqTemplate({
  id: "m03-def-oblig-scenario-retraite-revenu",
  conceptId: "m03-definition-obligations",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une personne proche de la retraite veut un revenu régulier et prévisible pour couvrir ses dépenses courantes, sans avoir à revendre de titres. Entre une obligation à coupons réguliers et une obligation zéro-coupon de même maturité, laquelle répond mieux à ce besoin ?",
    en: "Someone near retirement wants a regular, predictable income to cover living expenses, without having to sell securities. Between a regular-coupon bond and a zero-coupon bond of the same maturity, which better fits this need?",
  },
  choices: [
    { id: "coupon", label: { fr: "L'obligation à coupons, qui verse des flux réguliers pendant toute sa durée de vie", en: "The coupon bond, which pays regular flows throughout its life" } },
    { id: "zero", label: { fr: "L'obligation zéro-coupon, qui verse tout en un seul paiement à l'échéance", en: "The zero-coupon bond, which pays everything in a single payment at maturity" } },
    { id: "indifferent", label: { fr: "Cela ne fait aucune différence pour un besoin de revenu régulier", en: "It makes no difference for a regular income need" } },
  ],
  correctId: "coupon",
  hint: { fr: "Un besoin de revenu régulier appelle des flux réguliers, pas un unique paiement final.", en: "A regular income need calls for regular flows, not a single final payment." },
  explanation: {
    fr: "L'obligation à coupons distribue des flux réguliers pendant toute sa durée de vie, correspondant naturellement à un besoin de revenu récurrent ; la zéro-coupon, elle, ne verse rien avant l'échéance — obligeant un retraité à vendre des titres pour générer des liquidités intermédiaires, ce qui n'est pas l'objectif recherché ici.",
    en: "The coupon bond distributes regular flows throughout its life, naturally matching a recurring income need; the zero-coupon, however, pays nothing before maturity — forcing a retiree to sell securities to generate interim cash, which isn't the goal here.",
  },
  commonMistake: {
    fr: "Penser que le rendement total est le seul critère pertinent, en ignorant le profil temporel des flux qui compte tout autant pour un besoin de revenu régulier.",
    en: "Thinking total return is the only relevant criterion, ignoring the cash flow's time profile which matters just as much for a regular income need.",
  },
});

const tuitionGoalScenarioTemplate = mcqTemplate({
  id: "m03-def-oblig-scenario-objectif-date-precise",
  conceptId: "m03-definition-obligations",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Des parents veulent garantir exactement 20 000 EUR disponibles dans 10 ans pour les études de leur enfant, sans risque de devoir réinvestir des coupons intermédiaires à un taux incertain. Quel type d'obligation correspond le mieux à cet objectif précis ?",
    en: "Parents want exactly EUR 20,000 guaranteed available in 10 years for their child's education, with no risk of having to reinvest interim coupons at an uncertain rate. What type of bond best fits this precise goal?",
  },
  choices: [
    { id: "zero", label: { fr: "Une obligation zéro-coupon de maturité 10 ans et de valeur nominale 20 000 EUR", en: "A 10-year zero-coupon bond with a EUR 20,000 face value" } },
    { id: "coupon", label: { fr: "Une obligation à coupons annuels, quelle que soit sa maturité", en: "An annual-coupon bond, whatever its maturity" } },
    { id: "either", label: { fr: "N'importe laquelle des deux convient exactement aussi bien", en: "Either one fits exactly as well" } },
  ],
  correctId: "zero",
  hint: { fr: "Le risque à éviter est celui de devoir réinvestir des flux intermédiaires à un taux inconnu à l'avance (risque de réinvestissement).", en: "The risk to avoid is having to reinvest interim flows at a rate unknown in advance (reinvestment risk)." },
  explanation: {
    fr: "Une obligation zéro-coupon ne verse rien avant l'échéance : elle élimine totalement le risque de réinvestissement des coupons intermédiaires, garantissant exactement le montant F à la date T choisie. Une obligation à coupons expose au contraire à l'incertitude du taux auquel chaque coupon reçu en cours de route pourra être réinvesti, ce qui peut faire dévier le montant final de l'objectif visé.",
    en: "A zero-coupon bond pays nothing before maturity: it entirely eliminates interim coupon reinvestment risk, guaranteeing exactly the amount F on the chosen date T. A coupon bond, by contrast, exposes you to uncertainty about the rate at which each coupon received along the way can be reinvested, which can make the final amount deviate from the intended goal.",
  },
  commonMistake: {
    fr: "Ignorer le risque de réinvestissement des coupons intermédiaires, un facteur clé pour un objectif d'épargne à date fixe et à montant garanti.",
    en: "Ignoring interim coupon reinvestment risk, a key factor for a fixed-date, guaranteed-amount savings goal.",
  },
});

export const templates: QuestionTemplate[] = [
  zeroCouponPriceTemplate,
  priceVsRateTemplate,
  zeroCouponTrueFalseTemplate,
  vocabTemplate,
  comprehensionTemplate,
  govVsCorpComparisonTemplate,
  whatIfLongerMaturityTemplate,
  whatIfDoubleFaceValueTemplate,
  impliedMaturityNumericTemplate,
  bondVsStockPriorityErrorTemplate,
  retireeIncomeScenarioTemplate,
  tuitionGoalScenarioTemplate,
];
