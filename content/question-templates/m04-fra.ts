import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const settlementNumericTemplate: QuestionTemplate = {
  id: "m04-fra-reglement-calcul",
  conceptId: "m04-fra",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 2, 50) * 500_000;
    const rFraPct = randomInt(rng, 1, 6);
    const rRefPct = rFraPct + randomInt(rng, -3, 3) || rFraPct + 1;
    const days = randomInt(rng, 80, 190);
    const rFra = rFraPct / 100;
    const rRef = rRefPct / 100;
    const settlement = Math.round(((notional * (rRef - rFra) * (days / 360)) / (1 + rRef * (days / 360))) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un FRA de notionnel ${fmt(notional, "fr", 0)}, taux contractuel R_FRA = ${rFraPct}%, période de ${days} jours. À la date de fixing, le taux de référence est R_ref = ${rRefPct}%. Quel est le montant du règlement (positif si reçu par l'acheteur du FRA) ?`,
        en: `An FRA with notional ${fmt(notional, "en", 0)}, contract rate R_FRA = ${rFraPct}%, period of ${days} days. On the fixing date, the reference rate is R_ref = ${rRefPct}%. What is the settlement amount (positive if received by the FRA buyer)?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 20",
      hint: {
        fr: "Règlement = Notionnel × (R_ref−R_FRA) × (d/360) / (1 + R_ref × d/360).",
        en: "Settlement = Notional × (R_ref−R_FRA) × (d/360) / (1 + R_ref × d/360).",
      },
      numeric: { value: settlement, tolerance: 20 },
      calculation: {
        fr: `Écart = ${rRefPct}%−${rFraPct}% = ${(rRefPct - rFraPct).toFixed(2)}%. Numérateur = ${fmt(notional, "fr", 0)} × ${((rRef - rFra) * (days / 360)).toFixed(5)}. Diviseur = 1 + ${rRefPct}%×${days}/360 ≈ ${(1 + rRef * (days / 360)).toFixed(4)}. Règlement ≈ ${fmt(settlement, "fr")}.`,
        en: `Gap = ${rRefPct}%−${rFraPct}% = ${(rRefPct - rFraPct).toFixed(2)}%. Numerator = ${fmt(notional, "en", 0)} × ${((rRef - rFra) * (days / 360)).toFixed(5)}. Divisor = 1 + ${rRefPct}%×${days}/360 ≈ ${(1 + rRef * (days / 360)).toFixed(4)}. Settlement ≈ ${fmt(settlement, "en")}.`,
      },
      explanation: {
        fr: "Le règlement est actualisé car il est versé au début de la période couverte, pas à la fin comme le ferait un vrai prêt.",
        en: "The settlement is discounted because it is paid at the start of the covered period, not the end as an actual loan would.",
      },
      commonMistake: {
        fr: "Oublier d'actualiser (diviser par le dénominateur), ce qui surestime légèrement le montant réel.",
        en: "Forgetting to discount (divide by the denominator), which slightly overstates the actual amount.",
      },
    };
  },
};

const buyerBeneficiaryTemplate: QuestionTemplate = {
  id: "m04-fra-beneficiaire",
  conceptId: "m04-fra",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ratesUp = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Entre la conclusion du FRA et la date de fixing, les taux d'intérêt ${ratesUp ? "montent" : "baissent"} nettement au-dessus/en dessous du taux contractuel. Qui en bénéficie ?`,
        en: `Between the FRA's conclusion and the fixing date, interest rates ${ratesUp ? "rise" : "fall"} clearly above/below the contract rate. Who benefits?`,
      },
      choices: buildChoices([
        { id: "buyer", label: { fr: "L'acheteur du FRA (emprunteur fictif)", en: "The FRA buyer (fictitious borrower)" } },
        { id: "seller", label: { fr: "Le vendeur du FRA (prêteur fictif)", en: "The FRA seller (fictitious lender)" } },
      ]),
      hint: { fr: "L'acheteur se protège contre une hausse des taux.", en: "The buyer protects against a rate rise." },
      correctChoiceIds: [ratesUp ? "buyer" : "seller"],
      explanation: ratesUp
        ? { fr: "Si les taux montent, R_ref > R_FRA : l'acheteur, qui aurait dû emprunter plus cher, reçoit une compensation.", en: "If rates rise, R_ref > R_FRA: the buyer, who would have had to borrow at a higher rate, receives compensation." }
        : { fr: "Si les taux baissent, R_ref < R_FRA : le vendeur, qui aurait dû prêter moins cher, reçoit une compensation.", en: "If rates fall, R_ref < R_FRA: the seller, who would have had to lend at a lower rate, receives compensation." },
      commonMistake: {
        fr: "Inverser acheteur et vendeur, une confusion fréquente sur les FRA.",
        en: "Swapping buyer and seller, a frequent FRA confusion.",
      },
    };
  },
};

const noExchangeTemplate: QuestionTemplate = {
  id: "m04-fra-pas-echange-notionnel",
  conceptId: "m04-fra",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "À la conclusion ou au règlement d'un FRA, le notionnel est effectivement prêté par une partie à l'autre.",
      en: "At an FRA's conclusion or settlement, the notional is actually lent by one party to the other.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le notionnel ne sert qu'à calculer le règlement net, il n'est jamais prêté ni emprunté réellement.",
      en: "False: the notional only serves to compute the net settlement, it is never actually lent or borrowed.",
    },
    commonMistake: {
      fr: "Confondre le FRA avec un vrai prêt à terme.",
      en: "Confusing the FRA with an actual forward loan.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m04-fra-vocab",
  conceptId: "m04-fra",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un FRA \"3x6\" désigne une période de 3 mois débutant dans 3 mois. Le montant réglé se base sur la comparaison entre le taux contractuel et le taux de ______ observé à la date de fixing.",
      en: "A \"3x6\" FRA denotes a 3-month period starting in 3 months. The settled amount is based on comparing the contract rate to the ______ rate observed on the fixing date.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["reference", "référence"],
    hint: { fr: "Ex. EURIBOR ou SOFR.", en: "E.g. EURIBOR or SOFR." },
    explanation: {
      fr: "Le taux de référence (EURIBOR, SOFR...) observé à la date de fixing est comparé au taux contractuel R_FRA pour déterminer le règlement.",
      en: "The reference rate (EURIBOR, SOFR...) observed on the fixing date is compared to the contractual R_FRA to determine settlement.",
    },
    commonMistake: {
      fr: "Confondre le taux de référence (variable, observé) avec le taux contractuel (fixe, connu dès la conclusion).",
      en: "Confusing the reference rate (floating, observed) with the contract rate (fixed, known from inception).",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m04-fra-comprehension-utilite",
  conceptId: "m04-fra",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi une entreprise qui sait qu'elle empruntera dans 3 mois pour 6 mois préfère-t-elle souvent un FRA plutôt que d'attendre et d'emprunter directement au taux du marché à ce moment-là ?",
    en: "Why does a company that knows it will borrow in 3 months for 6 months often prefer an FRA rather than waiting and borrowing directly at the market rate then?",
  },
  choices: [
    { id: "lock-rate", label: { fr: "Le FRA fixe dès aujourd'hui le taux d'intérêt applicable à ce futur emprunt, éliminant l'incertitude sur son coût de financement", en: "The FRA locks in today the interest rate applicable to that future loan, eliminating uncertainty about its funding cost" } },
    { id: "cheaper", label: { fr: "Le FRA garantit systématiquement un taux plus bas que celui du marché au moment de l'emprunt", en: "The FRA systematically guarantees a lower rate than the market rate at the time of borrowing" } },
    { id: "replaces-loan", label: { fr: "Le FRA remplace complètement le besoin d'emprunter réellement", en: "The FRA completely replaces the need to actually borrow" } },
  ],
  correctId: "lock-rate",
  hint: { fr: "Le FRA ne remplace pas l'emprunt réel, il fixe seulement le taux qui s'y appliquera.", en: "The FRA doesn't replace the actual loan, it only locks in the rate that will apply to it." },
  explanation: {
    fr: "Le FRA élimine l'incertitude sur le taux d'intérêt applicable à un emprunt futur, exactement comme un forward fixe le prix d'un actif à terme : l'entreprise emprunte toujours réellement au taux de marché du moment venu, mais le règlement du FRA compense exactement l'écart avec le taux contractuel, neutralisant l'effet de toute variation de taux entre-temps.",
    en: "The FRA removes uncertainty about the interest rate applicable to a future loan, exactly like a forward locks in an asset's future price: the company still actually borrows at the then-prevailing market rate, but the FRA's settlement exactly offsets the gap with the contract rate, neutralizing the effect of any rate move in between.",
  },
  commonMistake: {
    fr: "Croire que le FRA remplace l'emprunt réel ou garantit un taux plus avantageux, alors qu'il ne fait qu'éliminer l'incertitude sur le taux, sans préjuger s'il sera finalement plus ou moins favorable qu'une absence de couverture.",
    en: "Believing the FRA replaces the actual loan or guarantees a better rate, when it only removes rate uncertainty, without prejudging whether it will end up more or less favorable than no hedge.",
  },
});

const fraVsSwapPeriodComparisonTemplate = mcqTemplate({
  id: "m04-fra-comparaison-fra-swap",
  conceptId: "m04-fra",
  difficulty: "hard",
  prompt: {
    fr: "Comparez un FRA unique portant sur une période future, et une seule période d'échange d'un swap de taux fixe/variable classique (M04-2). Quel est leur lien structurel ?",
    en: "Compare a single FRA on one future period, and a single exchange period of a plain fixed/floating rate swap (M04-2). What is their structural link?",
  },
  choices: [
    { id: "building-block", label: { fr: "Un swap de taux peut être vu comme une série de FRA consécutifs, chacun couvrant une période d'échange", en: "A rate swap can be viewed as a series of consecutive FRAs, each covering one exchange period" } },
    { id: "unrelated", label: { fr: "Ce sont deux instruments totalement indépendants, sans aucun lien structurel", en: "These are two totally independent instruments, with no structural link" } },
    { id: "swap-is-simpler", label: { fr: "Le swap est structurellement plus simple qu'un FRA, l'inverse de l'intuition usuelle", en: "The swap is structurally simpler than an FRA, the opposite of the usual intuition" } },
  ],
  correctId: "building-block",
  hint: { fr: "Un swap verse plusieurs flux nets (fixe contre variable) à intervalles réguliers — que fait un seul FRA pour une seule période ?", en: "A swap pays several net flows (fixed vs floating) at regular intervals — what does a single FRA do for a single period?" },
  explanation: {
    fr: "Chaque période d'échange d'un swap fonctionne exactement comme un FRA : comparer un taux fixe à un taux variable observé, et régler la différence sur un notionnel donné. Un swap de taux à N périodes est donc économiquement équivalent à une série de N FRA consécutifs, tous au même taux fixe — un lien conceptuel utile pour comprendre le pricing des swaps (M04-3).",
    en: "Each exchange period of a swap works exactly like an FRA: compare a fixed rate to an observed floating rate, and settle the difference on a given notional. An N-period rate swap is therefore economically equivalent to a series of N consecutive FRAs, all at the same fixed rate — a useful conceptual link for understanding swap pricing (M04-3).",
  },
  commonMistake: {
    fr: "Traiter le FRA et le swap comme deux produits complètement distincts, sans voir que le second se construit à partir de plusieurs instances du premier.",
    en: "Treating the FRA and the swap as two completely separate products, without seeing the latter is built from several instances of the former.",
  },
});

const whatIfRateEqualsContractTemplate = mcqTemplate({
  id: "m04-fra-whatif-taux-egal-contractuel",
  conceptId: "m04-fra",
  difficulty: "easy",
  prompt: {
    fr: "À la date de fixing d'un FRA, le taux de référence observé R_ref s'avère exactement égal au taux contractuel R_FRA. Quel est le montant du règlement ?",
    en: "On an FRA's fixing date, the observed reference rate R_ref turns out exactly equal to the contract rate R_FRA. What is the settlement amount?",
  },
  choices: [
    { id: "zero", label: { fr: "Exactement zéro", en: "Exactly zero" } },
    { id: "positive", label: { fr: "Toujours positif pour l'acheteur", en: "Always positive for the buyer" } },
    { id: "undefined", label: { fr: "Le FRA n'est pas défini dans ce cas", en: "The FRA is undefined in this case" } },
  ],
  correctId: "zero",
  hint: { fr: "Le règlement dépend de l'écart (R_ref − R_FRA) : que devient cet écart s'ils sont égaux ?", en: "The settlement depends on the gap (R_ref − R_FRA): what happens to that gap if they're equal?" },
  explanation: {
    fr: "Le règlement est proportionnel à l'écart (R_ref − R_FRA) : si R_ref = R_FRA, cet écart est nul, donc le règlement est exactement zéro, quel que soit le notionnel ou la durée. C'est un cas particulier utile pour vérifier sa compréhension de la formule, exactement comme le cas S_T = K pour un forward classique.",
    en: "The settlement is proportional to the gap (R_ref − R_FRA): if R_ref = R_FRA, that gap is zero, so the settlement is exactly zero, whatever the notional or duration. This is a useful special case to check one's understanding of the formula, exactly like the S_T = K case for a plain forward.",
  },
  commonMistake: {
    fr: "Croire qu'un FRA implique toujours un règlement non nul, en oubliant le cas particulier où le taux de référence coïncide exactement avec le taux contractuel.",
    en: "Believing an FRA always implies a non-zero settlement, forgetting the special case where the reference rate exactly coincides with the contract rate.",
  },
});

const whatIfCounterpartyDefaultTemplate = mcqTemplate({
  id: "m04-fra-whatif-defaut-contrepartie",
  conceptId: "m04-fra",
  difficulty: "medium",
  prompt: {
    fr: "Un FRA est un contrat de gré à gré (OTC) bilatéral, comme un forward classique. Si la contrepartie perdante fait défaut juste avant le règlement, que risque la partie gagnante ?",
    en: "An FRA is a bilateral OTC contract, like a plain forward. If the losing counterparty defaults right before settlement, what does the winning party risk?",
  },
  choices: [
    { id: "loss", label: { fr: "De ne pas recevoir le règlement qui lui est dû, un risque de contrepartie propre aux contrats OTC non compensés", en: "Not receiving the settlement owed to them, a counterparty risk specific to uncleared OTC contracts" } },
    { id: "guaranteed", label: { fr: "Rien, une chambre de compensation garantit systématiquement tous les FRA", en: "Nothing, a clearinghouse systematically guarantees all FRAs" } },
    { id: "automatic", label: { fr: "Le règlement est automatiquement transféré par la banque centrale", en: "The settlement is automatically transferred by the central bank" } },
  ],
  correctId: "loss",
  hint: { fr: "Rappelez-vous la différence entre un contrat OTC bilatéral et un contrat coté avec chambre de compensation (M02-9).", en: "Remember the difference between a bilateral OTC contract and an exchange-traded contract with a clearinghouse (M02-9)." },
  explanation: {
    fr: "Comme tout contrat de gré à gré non compensé, un FRA expose chaque partie au risque que l'autre ne remplisse pas ses obligations au règlement : c'est exactement le même risque de contrepartie qui distingue un forward d'un future coté (M02-9), transposé ici au marché des taux d'intérêt à terme.",
    en: "Like any uncleared OTC contract, an FRA exposes each party to the risk the other fails to fulfill its obligations at settlement: this is exactly the same counterparty risk that distinguishes a forward from a listed future (M02-9), transposed here to the forward interest rate market.",
  },
  commonMistake: {
    fr: "Croire que tous les dérivés de taux bénéficient automatiquement d'une garantie de chambre de compensation, en oubliant que le FRA classique est un contrat bilatéral non compensé.",
    en: "Believing all rate derivatives automatically benefit from a clearinghouse guarantee, forgetting the plain FRA is an uncleared bilateral contract.",
  },
});

const impliedFraRateNumericTemplate: QuestionTemplate = {
  id: "m04-fra-taux-implicite-calcul",
  conceptId: "m04-fra",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const z1Pct = randomInt(rng, 1, 6);
    const z2Pct = z1Pct + randomInt(rng, 1, 4);
    const z1 = z1Pct / 100;
    const z2 = z2Pct / 100;
    const fairFraRate = Math.round((Math.pow(1 + z2, 2) / (1 + z1) - 1) * 10000) / 100;

    return {
      prompt: {
        fr: `Le taux spot à 1 an est z1 = ${z1Pct}%, le taux spot à 2 ans est z2 = ${z2Pct}%. Quel taux contractuel R_FRA un FRA "1x2" (période de 1 an débutant dans 1 an) devrait-il fixer pour être équitable, par non-arbitrage ?`,
        en: `The 1-year spot rate is z1 = ${z1Pct}%, the 2-year spot rate is z2 = ${z2Pct}%. What contract rate R_FRA should a "1x2" FRA (1-year period starting in 1 year) set to be fair, by no-arbitrage?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "Le taux FRA équitable est le taux forward implicite de la courbe : (1+z2)² = (1+z1)(1+R_FRA).", en: "The fair FRA rate is the curve's implied forward rate: (1+z2)² = (1+z1)(1+R_FRA)." },
      numeric: { value: fairFraRate, tolerance: 0.1 },
      calculation: {
        fr: `R_FRA = (1,${z2Pct.toString().padStart(2, "0")})² / (1,${z1Pct.toString().padStart(2, "0")}) − 1 ≈ ${fmt(fairFraRate, "fr")}%.`,
        en: `R_FRA = (1.${z2Pct.toString().padStart(2, "0")})² / (1.${z1Pct.toString().padStart(2, "0")}) − 1 ≈ ${fmt(fairFraRate, "en")}%.`,
      },
      explanation: {
        fr: "Le taux contractuel équitable d'un FRA est exactement le taux forward implicite dans la courbe des taux spot (M03-taux-sans-risque) : c'est ce qui garantit qu'aucune des deux parties ne puisse arbitrer la différence entre le FRA et une stratégie équivalente d'emprunt/placement sur le marché spot.",
        en: "An FRA's fair contract rate is exactly the forward rate implied by the spot yield curve (M03-taux-sans-risque): this is what guarantees neither party can arbitrage the difference between the FRA and an equivalent borrowing/investing strategy in the spot market.",
      },
      commonMistake: {
        fr: "Croire que le taux FRA équitable est arbitraire ou négocié librement, en oubliant qu'il découle mécaniquement du taux forward de non-arbitrage.",
        en: "Believing the fair FRA rate is arbitrary or freely negotiated, forgetting it mechanically follows from the no-arbitrage forward rate.",
      },
    };
  },
};

const upfrontNotionalErrorTemplate = trueFalseTemplate({
  id: "m04-fra-erreur-notionnel-initial",
  conceptId: "m04-fra",
  difficulty: "medium",
  statement: {
    fr: "Pour conclure un FRA, l'acheteur doit verser le notionnel du contrat au vendeur dès la conclusion, comme garantie.",
    en: "To enter an FRA, the buyer must pay the contract's notional to the seller at inception, as collateral.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le notionnel d'un FRA ne sert qu'à calculer le montant du règlement net à la date de fixing, il n'est jamais versé ni échangé, ni à la conclusion ni au règlement. Seul le règlement net (proportionnel à l'écart de taux) change de main.",
    en: "False: an FRA's notional only serves to compute the net settlement amount on the fixing date, it is never paid or exchanged, either at inception or at settlement. Only the net settlement (proportional to the rate gap) changes hands.",
  },
  commonMistake: {
    fr: "Confondre le rôle du notionnel dans un FRA (base de calcul théorique) avec un dépôt de garantie ou un prêt effectivement versé.",
    en: "Confusing the notional's role in an FRA (a theoretical calculation base) with a margin deposit or an actually disbursed loan.",
  },
});

const futureLoanHedgeScenarioTemplate = mcqTemplate({
  id: "m04-fra-scenario-couverture-emprunt-futur",
  conceptId: "m04-fra",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une entreprise sait qu'elle empruntera 10 000 000 EUR dans 3 mois pour une durée de 6 mois, et craint une hausse des taux d'ici là. Quel FRA doit-elle ACHETER pour se couvrir ?",
    en: "A company knows it will borrow EUR 10,000,000 in 3 months for a 6-month duration, and fears rates will rise by then. Which FRA should it BUY to hedge?",
  },
  choices: [
    { id: "3x9", label: { fr: "Un FRA \"3x9\" (période de 6 mois débutant dans 3 mois), notionnel 10 000 000 EUR", en: "A \"3x9\" FRA (6-month period starting in 3 months), notional EUR 10,000,000" } },
    { id: "3x6", label: { fr: "Un FRA \"3x6\" (période de 3 mois débutant dans 3 mois)", en: "A \"3x6\" FRA (3-month period starting in 3 months)" } },
    { id: "sell", label: { fr: "Elle doit VENDRE un FRA, pas en acheter un", en: "It should SELL an FRA, not buy one" } },
  ],
  correctId: "3x9",
  hint: { fr: "La notation \"AxB\" désigne le début (A mois) et la fin (B mois) de la période couverte, comptés à partir d'aujourd'hui.", en: "The \"AxB\" notation denotes the start (A months) and end (B months) of the covered period, counted from today." },
  explanation: {
    fr: "La période à couvrir démarre dans 3 mois et dure 6 mois, donc se termine dans 9 mois : c'est un FRA \"3x9\". L'entreprise, future emprunteuse, doit ACHETER ce FRA pour se protéger d'une hausse des taux (l'acheteur d'un FRA se comporte comme un emprunteur fictif qui bénéficie si les taux montent, M04-1).",
    en: "The period to hedge starts in 3 months and lasts 6 months, so ends in 9 months: this is a \"3x9\" FRA. The company, a future borrower, must BUY this FRA to protect against a rate rise (an FRA's buyer behaves like a fictitious borrower who benefits if rates rise, M04-1).",
  },
  commonMistake: {
    fr: "Se tromper sur la convention \"AxB\" (par exemple choisir un FRA 3x6 qui ne couvre que 3 mois au lieu des 6 mois nécessaires), ou inverser achat et vente.",
    en: "Getting the \"AxB\" convention wrong (e.g. choosing a 3x6 FRA that only covers 3 months instead of the required 6), or reversing buying and selling.",
  },
});

const fraStripScenarioTemplate = mcqTemplate({
  id: "m04-fra-scenario-strip-fra",
  conceptId: "m04-fra",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une banque veut construire synthétiquement l'équivalent d'un swap de taux à 2 ans (paiements trimestriels) en utilisant uniquement des FRA. Combien de FRA distincts lui faut-il au minimum, et comment doivent-ils s'enchaîner ?",
    en: "A bank wants to synthetically build the equivalent of a 2-year rate swap (quarterly payments) using only FRAs. How many distinct FRAs does it need at minimum, and how should they be chained?",
  },
  choices: [
    { id: "eight-consecutive", label: { fr: "8 FRA consécutifs (0x3, 3x6, 6x9... jusqu'à 21x24), chacun couvrant un trimestre successif", en: "8 consecutive FRAs (0x3, 3x6, 6x9... up to 21x24), each covering one successive quarter" } },
    { id: "one-fra", label: { fr: "Un seul FRA de 2 ans suffit, quelle que soit la fréquence de paiement", en: "A single 2-year FRA is enough, regardless of the payment frequency" } },
    { id: "two-fra", label: { fr: "2 FRA, un pour chaque année", en: "2 FRAs, one per year" } },
    { id: "same", label: { fr: "Cela ne fait aucune différence économique par rapport à un swap direct", en: "This makes no economic difference versus a direct swap" } },
  ],
  correctId: "eight-consecutive",
  hint: { fr: "2 ans avec des paiements trimestriels, c'est combien de trimestres ? Un FRA couvre exactement une période d'échange.", en: "2 years with quarterly payments is how many quarters? A single FRA covers exactly one exchange period." },
  explanation: {
    fr: "2 ans à fréquence trimestrielle représentent 8 périodes d'échange (8 trimestres) : il faut donc 8 FRA distincts et consécutifs (0x3, 3x6, ..., 21x24), tous au même taux fixe équivalent au taux swap, pour répliquer exactement les flux d'un swap 2 ans — une application directe du lien structurel FRA/swap (voir la comparaison ci-dessus).",
    en: "2 years at quarterly frequency represent 8 exchange periods (8 quarters): 8 distinct, consecutive FRAs (0x3, 3x6, ..., 21x24) are therefore needed, all at the same fixed rate equivalent to the swap rate, to exactly replicate a 2-year swap's flows — a direct application of the FRA/swap structural link (see the comparison above).",
  },
  commonMistake: {
    fr: "Sous-estimer le nombre de FRA nécessaires en oubliant de compter chaque période d'échange individuellement, ou en confondant la durée totale (2 ans) avec le nombre de périodes trimestrielles qu'elle contient (8).",
    en: "Underestimating the number of FRAs needed by forgetting to count each exchange period individually, or confusing the total duration (2 years) with the number of quarterly periods it contains (8).",
  },
});

export const templates: QuestionTemplate[] = [
  settlementNumericTemplate,
  buyerBeneficiaryTemplate,
  noExchangeTemplate,
  vocabTemplate,
  comprehensionTemplate,
  fraVsSwapPeriodComparisonTemplate,
  whatIfRateEqualsContractTemplate,
  whatIfCounterpartyDefaultTemplate,
  impliedFraRateNumericTemplate,
  upfrontNotionalErrorTemplate,
  futureLoanHedgeScenarioTemplate,
  fraStripScenarioTemplate,
];
