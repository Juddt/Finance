import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const netFlowNumericTemplate: QuestionTemplate = {
  id: "m04-swap-flux-net",
  conceptId: "m04-swap-fixe-variable",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 2, 50) * 500_000;
    const rFixedPct = randomInt(rng, 1, 6);
    const rFloatPct = rFixedPct + randomInt(rng, -3, 3) || rFixedPct + 1;
    const delta = pick(rng, [0.25, 0.5, 1] as const);
    const netFlow = Math.round(notional * (rFloatPct / 100 - rFixedPct / 100) * delta * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un swap de notionnel ${fmt(notional, "fr", 0)}, taux fixe ${rFixedPct}%, période δ = ${delta}. Le taux variable observé pour cette période est ${rFloatPct}%. Quel est le flux net reçu par le RECEVEUR VARIABLE (positif si en sa faveur) ?`,
        en: `A swap with notional ${fmt(notional, "en", 0)}, fixed rate ${rFixedPct}%, period δ = ${delta}. The observed floating rate for this period is ${rFloatPct}%. What is the net flow received by the FLOATING RECEIVER (positive if in their favor)?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 10",
      hint: { fr: "Flux net = Notionnel × (R_variable − R_fixe) × δ.", en: "Net flow = Notional × (R_variable − R_fixed) × δ." },
      numeric: { value: netFlow, tolerance: 10 },
      calculation: {
        fr: `Flux net = ${fmt(notional, "fr", 0)} × (${rFloatPct}%−${rFixedPct}%) × ${delta} = ${fmt(netFlow, "fr")}.`,
        en: `Net flow = ${fmt(notional, "en", 0)} × (${rFloatPct}%−${rFixedPct}%) × ${delta} = ${fmt(netFlow, "en")}.`,
      },
      explanation: {
        fr: "Seule la différence nette est échangée en pratique (netting), pas les deux flux bruts séparément.",
        en: "Only the net difference is exchanged in practice (netting), not the two gross flows separately.",
      },
      commonMistake: {
        fr: "Inverser le sens (R_fixe − R_variable au lieu de R_variable − R_fixe) pour le receveur variable.",
        en: "Flipping the sign (R_fixed − R_variable instead of R_variable − R_fixed) for the floating receiver.",
      },
    };
  },
};

const payerBenefitsTemplate: QuestionTemplate = {
  id: "m04-swap-qui-profite",
  conceptId: "m04-swap-fixe-variable",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ratesUp = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Après la conclusion d'un swap, les taux d'intérêt de marché ${ratesUp ? "montent fortement" : "baissent fortement"}. Qui en profite ?`,
        en: `After a swap's conclusion, market interest rates ${ratesUp ? "rise sharply" : "fall sharply"}. Who benefits?`,
      },
      choices: buildChoices([
        { id: "payer", label: { fr: "Le payeur fixe (reçoit variable)", en: "The fixed payer (receives floating)" } },
        { id: "receiver", label: { fr: "Le receveur fixe (paie variable)", en: "The fixed receiver (pays floating)" } },
      ]),
      hint: { fr: "Qui reçoit la jambe variable, qui devient plus intéressante si les taux montent ?", en: "Who receives the floating leg, which becomes more attractive if rates rise?" },
      correctChoiceIds: [ratesUp ? "payer" : "receiver"],
      explanation: ratesUp
        ? { fr: "Le payeur fixe reçoit la jambe variable : si les taux montent, il reçoit plus qu'il ne paie sur la jambe fixe.", en: "The fixed payer receives the floating leg: if rates rise, they receive more than they pay on the fixed leg." }
        : { fr: "Le receveur fixe paie la jambe variable : si les taux baissent, il paie moins qu'il ne reçoit sur la jambe fixe.", en: "The fixed receiver pays the floating leg: if rates fall, they pay less than they receive on the fixed leg." },
      commonMistake: {
        fr: "Oublier que \"payeur fixe\" signifie aussi \"receveur variable\", et inversement.",
        en: "Forgetting that \"fixed payer\" also means \"floating receiver\", and vice versa.",
      },
    };
  },
};

const noNotionalExchangeTemplate: QuestionTemplate = {
  id: "m04-swap-pas-echange-notionnel",
  conceptId: "m04-swap-fixe-variable",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Dans un swap de taux fixe/variable classique (sur une seule devise), le notionnel est échangé au début et à la fin du contrat.",
      en: "In a plain fixed/floating rate swap (single currency), the notional is exchanged at the start and end of the contract.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : le notionnel n'est jamais échangé dans un swap de taux mono-devise, il ne sert qu'à calculer les intérêts (à la différence d'un swap de devises).",
      en: "False: the notional is never exchanged in a single-currency rate swap, it only serves to compute interest (unlike a currency swap).",
    },
    commonMistake: {
      fr: "Confondre un swap de taux avec un swap de devises, où le notionnel est bien échangé.",
      en: "Confusing a rate swap with a currency swap, where the notional is indeed exchanged.",
    },
  }),
};

const parValueTemplate: QuestionTemplate = {
  id: "m04-swap-vocab-pair",
  conceptId: "m04-swap-fixe-variable",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Le taux fixe qui rend la valeur d'un swap nulle à sa conclusion s'appelle le taux au ______.",
      en: "The fixed rate that makes a swap's value zero at inception is called the ______ rate.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["pair", "par"],
    hint: { fr: "Même idée qu'une obligation qui se négocie « au pair ».", en: "Same idea as a bond trading \"at par\"." },
    explanation: {
      fr: "Le taux au pair est celui qui égalise la valeur des deux jambes à l'origine, de sorte qu'aucune des parties ne paie de prime.",
      en: "The par rate is the one that equalizes the value of both legs at inception, so neither party pays a premium.",
    },
    commonMistake: {
      fr: "Confondre le taux au pair du swap avec le taux de coupon au pair d'une obligation, qui sont des concepts analogues mais distincts.",
      en: "Confusing the swap's par rate with a bond's par coupon rate, which are analogous but distinct concepts.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m04-swap-comprehension-utilite",
  conceptId: "m04-swap-fixe-variable",
  difficulty: "medium",
  prompt: {
    fr: "Une entreprise a une dette existante à taux variable et voudrait des paiements fixes et prévisibles. Pourquoi un swap est-il souvent préférable à un refinancement complet de cette dette en taux fixe ?",
    en: "A company has existing floating-rate debt and wants fixed, predictable payments. Why is a swap often preferable to fully refinancing that debt into a fixed rate?",
  },
  choices: [
    { id: "overlay", label: { fr: "Le swap se superpose à la dette existante sans avoir à la rembourser, la renégocier ou payer les frais d'un refinancement complet", en: "The swap overlays the existing debt without having to repay, renegotiate, or pay the costs of a full refinancing" } },
    { id: "must-refinance", label: { fr: "Il n'y a aucune différence pratique, les deux approches sont strictement équivalentes en coût et en procédure", en: "There's no practical difference, both approaches are strictly equivalent in cost and procedure" } },
    { id: "swap-cheaper-always", label: { fr: "Le swap est toujours moins cher que n'importe quel refinancement, sans exception", en: "The swap is always cheaper than any refinancing, with no exception" } },
    { id: "no-benefit", label: { fr: "Le swap n'apporte aucun avantage particulier ici", en: "The swap offers no particular benefit here" } },
  ],
  correctId: "overlay",
  hint: { fr: "Rembourser une dette existante pour en émettre une nouvelle implique des frais et démarches qu'un simple contrat de swap évite.", en: "Repaying existing debt to issue new debt involves fees and procedures a simple swap contract avoids." },
  explanation: {
    fr: "Un swap transforme le profil de taux d'intérêt SANS toucher à la dette sous-jacente : l'entreprise garde son prêt à taux variable existant (et sa relation avec son prêteur), tout en superposant un contrat de swap qui neutralise économiquement la variabilité des paiements. C'est généralement bien plus rapide et moins coûteux qu'un refinancement complet, qui impliquerait de rembourser la dette existante et d'en émettre une nouvelle.",
    en: "A swap transforms the interest rate profile WITHOUT touching the underlying debt: the company keeps its existing floating-rate loan (and its relationship with its lender), while overlaying a swap contract that economically neutralizes the payments' variability. This is generally much faster and cheaper than a full refinancing, which would involve repaying the existing debt and issuing new debt.",
  },
  commonMistake: {
    fr: "Croire qu'un swap et un refinancement complet de la dette sont des opérations équivalentes en coût et en complexité, en ignorant que le swap est une simple superposition contractuelle.",
    en: "Believing a swap and a full debt refinancing are equivalent in cost and complexity, ignoring that a swap is a simple contractual overlay.",
  },
});

const syntheticLoanComparisonTemplate = mcqTemplate({
  id: "m04-swap-comparaison-emprunt-synthetique",
  conceptId: "m04-swap-fixe-variable",
  difficulty: "hard",
  prompt: {
    fr: "Comparez (A) une dette à taux variable combinée à un swap payeur fixe (paie fixe, reçoit variable), et (B) une dette directement émise à taux fixe. Économiquement, quel est le lien entre ces deux situations ?",
    en: "Compare (A) floating-rate debt combined with a fixed-payer swap (pays fixed, receives floating), and (B) debt directly issued at a fixed rate. Economically, what is the link between these two situations?",
  },
  choices: [
    { id: "equivalent", label: { fr: "Elles sont économiquement équivalentes : la jambe variable reçue du swap annule celle payée sur la dette, ne laissant que le paiement fixe net", en: "They are economically equivalent: the floating leg received from the swap cancels the one paid on the debt, leaving only the net fixed payment" } },
    { id: "unrelated", label: { fr: "Elles n'ont aucun rapport économique, ce sont deux expositions totalement différentes", en: "They have no economic relationship, these are two totally different exposures" } },
    { id: "a-riskier", label: { fr: "(A) est structurellement bien plus risquée que (B), sans aucune raison de les comparer", en: "(A) is structurally much riskier than (B), with no reason to compare them" } },
  ],
  correctId: "equivalent",
  hint: { fr: "La jambe variable reçue du swap et la jambe variable payée sur la dette se compensent presque exactement.", en: "The floating leg received from the swap and the floating leg paid on the debt nearly exactly offset." },
  explanation: {
    fr: "En combinant une dette à taux variable avec un swap où l'entreprise paie fixe et reçoit variable, la jambe variable reçue du swap compense (presque) exactement celle payée sur la dette : il ne reste économiquement que le paiement fixe net du swap, reproduisant synthétiquement l'effet d'une dette directement émise à taux fixe. C'est exactement le principe de la transformation de profil de taux par swap (M04-2).",
    en: "By combining floating-rate debt with a swap where the company pays fixed and receives floating, the floating leg received from the swap (nearly) exactly offsets the one paid on the debt: economically, only the swap's net fixed payment remains, synthetically replicating the effect of directly issued fixed-rate debt. This is exactly the principle of rate-profile transformation via swap (M04-2).",
  },
  commonMistake: {
    fr: "Ne pas voir l'équivalence économique entre une dette variable swappée et une dette fixe directe, alors que c'est précisément l'objectif recherché par une entreprise qui utilise un swap à cette fin.",
    en: "Not seeing the economic equivalence between swapped floating debt and direct fixed debt, when this is precisely the goal sought by a company using a swap for this purpose.",
  },
});

const whatIfFloatingEqualsFixedTemplate = mcqTemplate({
  id: "m04-swap-whatif-variable-egal-fixe",
  conceptId: "m04-swap-fixe-variable",
  difficulty: "easy",
  prompt: {
    fr: "Pour une période donnée d'un swap, le taux variable observé s'avère exactement égal au taux fixe du contrat. Quel est le flux net échangé pour cette période ?",
    en: "For a given swap period, the observed floating rate turns out exactly equal to the contract's fixed rate. What is the net flow exchanged for that period?",
  },
  choices: [
    { id: "zero", label: { fr: "Exactement zéro", en: "Exactly zero" } },
    { id: "full-notional", label: { fr: "Le notionnel entier change de main", en: "The entire notional changes hands" } },
    { id: "undefined", label: { fr: "Le swap n'est pas défini dans ce cas", en: "The swap is undefined in this case" } },
  ],
  correctId: "zero",
  hint: { fr: "Flux net = Notionnel × (R_variable − R_fixe) : que devient cette différence si les deux taux sont égaux ?", en: "Net flow = Notional × (R_floating − R_fixed): what happens to that difference if both rates are equal?" },
  explanation: {
    fr: "Le flux net d'une période de swap est proportionnel à l'écart (R_variable − R_fixe) : si les deux taux coïncident exactement, cet écart est nul, donc aucun paiement net n'a lieu pour cette période, quel que soit le notionnel — un cas particulier utile pour vérifier sa compréhension du mécanisme de netting.",
    en: "A swap period's net flow is proportional to the gap (R_floating − R_fixed): if the two rates exactly coincide, that gap is zero, so no net payment occurs for that period, whatever the notional — a useful special case to check one's understanding of the netting mechanism.",
  },
  commonMistake: {
    fr: "Croire qu'un swap implique toujours un paiement net non nul à chaque période, en oubliant le cas particulier où les deux taux coïncident exactement.",
    en: "Believing a swap always implies a non-zero net payment each period, forgetting the special case where the two rates exactly coincide.",
  },
});

const whatIfNoUnderlyingDebtTemplate = mcqTemplate({
  id: "m04-swap-whatif-sans-dette-sous-jacente",
  conceptId: "m04-swap-fixe-variable",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un hedge fund conclut un swap payeur fixe (paie fixe, reçoit variable) alors qu'il ne détient aucune dette ni aucun actif à taux variable à couvrir. Quelle est la nature de cette position ?",
    en: "A hedge fund enters a fixed-payer swap (pays fixed, receives floating) while holding no floating-rate debt or asset to hedge at all. What is this position's nature?",
  },
  choices: [
    { id: "speculative", label: { fr: "Un pari purement spéculatif et directionnel sur la hausse des taux, sans aucune exposition économique réelle à couvrir", en: "A purely speculative, directional bet on rates rising, with no real economic exposure to hedge" } },
    { id: "impossible", label: { fr: "C'est impossible : il faut obligatoirement une dette ou un actif sous-jacent pour conclure un swap", en: "This is impossible: an underlying debt or asset is required to enter a swap" } },
    { id: "risk-free", label: { fr: "C'est une position sans risque puisqu'aucun sous-jacent réel n'est en jeu", en: "It's a risk-free position since no real underlying is at stake" } },
  ],
  correctId: "speculative",
  hint: { fr: "Comme pour le FRA ou le CDS, rien n'oblige contractuellement à détenir un sous-jacent réel pour conclure un swap.", en: "As with an FRA or a CDS, nothing contractually requires holding a real underlying to enter a swap." },
  explanation: {
    fr: "Rien n'exige de détenir une exposition sous-jacente pour conclure un swap : sans dette ni actif variable à couvrir, la position payeur fixe devient un pari directionnel pur, profitant d'une hausse des taux (le hedge fund reçoit alors plus de la jambe variable qu'il ne paie sur la jambe fixe) — exactement le même raisonnement que pour un CDS nu (M03-6), transposé au marché des swaps de taux.",
    en: "Nothing requires holding an underlying exposure to enter a swap: with no floating debt or asset to hedge, the fixed-payer position becomes a pure directional bet, profiting from a rate rise (the hedge fund then receives more from the floating leg than it pays on the fixed leg) — exactly the same reasoning as a naked CDS (M03-6), transposed to the rate swap market.",
  },
  commonMistake: {
    fr: "Croire qu'un swap ne peut être utilisé qu'à des fins de couverture par un détenteur réel d'une exposition sous-jacente, en ignorant son usage spéculatif possible.",
    en: "Believing a swap can only be used for hedging by an actual holder of an underlying exposure, ignoring its possible speculative use.",
  },
});

const multiPeriodNetFlowNumericTemplate: QuestionTemplate = {
  id: "m04-swap-flux-net-cumule-calcul",
  conceptId: "m04-swap-fixe-variable",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 2, 30) * 500_000;
    const rFixedPct = randomInt(rng, 1, 6);
    const rates = [rFixedPct + randomInt(rng, -2, 3), rFixedPct + randomInt(rng, -2, 3), rFixedPct + randomInt(rng, -2, 3)].map((r) => Math.max(r, 0));
    const delta = 0.25;
    const cumulative = Math.round(rates.reduce((sum, r) => sum + notional * (r / 100 - rFixedPct / 100) * delta, 0) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un swap de notionnel ${fmt(notional, "fr", 0)}, taux fixe ${rFixedPct}%, paiements trimestriels (δ=0,25). Sur 3 trimestres consécutifs, le taux variable observé est successivement ${rates.join("%, ")}%. Quel est le flux net CUMULÉ reçu par le receveur variable sur ces 3 trimestres ?`,
        en: `A swap with notional ${fmt(notional, "en", 0)}, fixed rate ${rFixedPct}%, quarterly payments (δ=0.25). Over 3 consecutive quarters, the observed floating rate is successively ${rates.join("%, ")}%. What is the CUMULATIVE net flow received by the floating receiver over these 3 quarters?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 20",
      hint: { fr: "Calculez le flux net de chaque trimestre séparément, puis additionnez les trois.", en: "Compute each quarter's net flow separately, then add the three together." },
      numeric: { value: cumulative, tolerance: 20 },
      calculation: {
        fr: rates.map((r, i) => `T${i + 1}: ${fmt(notional, "fr", 0)} × (${r}%−${rFixedPct}%) × 0,25`).join(" ; ") + ` → Total ≈ ${fmt(cumulative, "fr")}.`,
        en: rates.map((r, i) => `Q${i + 1}: ${fmt(notional, "en", 0)} × (${r}%−${rFixedPct}%) × 0.25`).join("; ") + ` → Total ≈ ${fmt(cumulative, "en")}.`,
      },
      explanation: {
        fr: "Contrairement au flux d'une seule période (M04-2), un swap réel s'étale sur plusieurs périodes de reset : le résultat cumulé dépend de la trajectoire complète du taux variable, pas d'un seul point d'observation, chaque période étant indépendamment nette et réglée.",
        en: "Unlike a single-period flow (M04-2), a real swap spans several reset periods: the cumulative result depends on the floating rate's full path, not a single observation point, with each period independently netted and settled.",
      },
      commonMistake: {
        fr: "Ne calculer le flux net que pour un seul trimestre plutôt que d'additionner les trois, ou utiliser un taux variable moyen au lieu de traiter chaque période séparément.",
        en: "Computing the net flow for only one quarter instead of adding the three, or using an averaged floating rate instead of treating each period separately.",
      },
    };
  },
};

const payerTerminologyErrorTemplate = trueFalseTemplate({
  id: "m04-swap-erreur-terminologie-payeur",
  conceptId: "m04-swap-fixe-variable",
  difficulty: "medium",
  statement: {
    fr: "\"Payeur fixe\" désigne la partie qui REÇOIT les paiements à taux fixe du swap.",
    en: "\"Fixed payer\" refers to the party that RECEIVES the swap's fixed-rate payments.",
  },
  correct: false,
  explanation: {
    fr: "Faux : \"payeur fixe\" désigne la partie qui PAIE la jambe fixe (et reçoit donc la jambe variable) — la terminologie décrit ce que la partie verse, pas ce qu'elle reçoit. C'est une source de confusion fréquente, d'autant que \"payeur fixe\" est donc structurellement identique à \"receveur variable\".",
    en: "False: \"fixed payer\" refers to the party that PAYS the fixed leg (and so receives the floating leg) — the terminology describes what the party pays, not what it receives. This is a frequent source of confusion, especially since \"fixed payer\" is therefore structurally identical to \"floating receiver\".",
  },
  commonMistake: {
    fr: "Inverser le sens de la terminologie \"payeur/receveur\", en l'associant à ce que la partie reçoit plutôt qu'à ce qu'elle paie.",
    en: "Reversing the \"payer/receiver\" terminology's meaning, associating it with what the party receives rather than what it pays.",
  },
});

const floatingDebtToFixedScenarioTemplate = mcqTemplate({
  id: "m04-swap-scenario-variable-vers-fixe",
  conceptId: "m04-swap-fixe-variable",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une PME a un prêt bancaire à taux variable et redoute une forte hausse des taux qui rendrait ses charges d'intérêt imprévisibles. Quel swap doit-elle conclure pour transformer synthétiquement sa dette en taux fixe ?",
    en: "An SME has a floating-rate bank loan and fears a sharp rate rise that would make its interest expense unpredictable. Which swap should it enter to synthetically transform its debt into a fixed rate?",
  },
  choices: [
    { id: "pay-fixed", label: { fr: "Un swap où elle paie fixe et reçoit variable, la jambe variable reçue compensant celle payée sur son prêt", en: "A swap where it pays fixed and receives floating, the received floating leg offsetting the one paid on its loan" } },
    { id: "receive-fixed", label: { fr: "Un swap où elle reçoit fixe et paie variable", en: "A swap where it receives fixed and pays floating" } },
    { id: "no-swap", label: { fr: "Aucun swap ne peut résoudre ce problème, il faut obligatoirement refinancer le prêt", en: "No swap can solve this problem, the loan must be refinanced" } },
  ],
  correctId: "pay-fixed",
  hint: { fr: "La PME doit recevoir du swap exactement ce qu'elle paie sur son prêt (variable), pour que les deux jambes s'annulent.", en: "The SME must receive from the swap exactly what it pays on its loan (floating), so the two legs cancel out." },
  explanation: {
    fr: "En payant fixe et en recevant variable sur le swap, la PME reçoit une jambe variable qui compense (presque) exactement les intérêts variables qu'elle verse sur son prêt bancaire : il ne lui reste économiquement que le paiement fixe du swap, transformant synthétiquement sa dette variable en dette à taux fixe prévisible — sans avoir à renégocier son prêt existant.",
    en: "By paying fixed and receiving floating on the swap, the SME receives a floating leg that (nearly) exactly offsets the floating interest it pays on its bank loan: economically, only the swap's fixed payment remains, synthetically transforming its floating debt into predictable fixed-rate debt — without having to renegotiate its existing loan.",
  },
  commonMistake: {
    fr: "Inverser le sens du swap (recevoir fixe/payer variable), ce qui ajouterait de la variabilité au lieu de l'éliminer.",
    en: "Reversing the swap's direction (receiving fixed/paying floating), which would add variability instead of eliminating it.",
  },
});

const assetLiabilityMatchScenarioTemplate = mcqTemplate({
  id: "m04-swap-scenario-gestion-actif-passif",
  conceptId: "m04-swap-fixe-variable",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une banque a des actifs (prêts accordés) majoritairement à taux fixe et des passifs (dépôts, financement) majoritairement à taux variable, un déséquilibre risqué si les taux montent. Comment des swaps de taux peuvent-ils aider à rééquilibrer ce profil ?",
    en: "A bank has assets (loans granted) mostly at fixed rates and liabilities (deposits, funding) mostly at floating rates, a risky mismatch if rates rise. How can rate swaps help rebalance this profile?",
  },
  choices: [
    { id: "pay-fixed-receive-float", label: { fr: "En concluant des swaps où elle paie fixe et reçoit variable, pour convertir une partie de son profil d'actifs fixes vers un profil plus variable, aligné sur ses passifs", en: "By entering swaps where it pays fixed and receives floating, to convert part of its fixed-asset profile toward a more floating one, aligned with its liabilities" } },
    { id: "irrelevant", label: { fr: "Les swaps ne peuvent rien faire pour ce type de déséquilibre bilanciel", en: "Swaps can do nothing for this kind of balance-sheet mismatch" } },
    { id: "sell-assets", label: { fr: "La seule solution est de vendre physiquement les prêts à taux fixe", en: "The only solution is to physically sell the fixed-rate loans" } },
  ],
  correctId: "pay-fixed-receive-float",
  hint: { fr: "La banque veut transformer une partie de son exposition fixe (actifs) en exposition variable, pour se rapprocher du profil de son passif.", en: "The bank wants to turn part of its fixed exposure (assets) into floating exposure, to move closer to its liabilities' profile." },
  explanation: {
    fr: "En payant fixe et en recevant variable sur des swaps, la banque transforme synthétiquement une partie de ses revenus fixes (issus des prêts) en revenus variables, réduisant l'écart de sensibilité aux taux entre son actif et son passif — une application classique de la gestion actif-passif (ALM) par swaps, sans avoir à vendre ou renégocier les prêts et dépôts sous-jacents.",
    en: "By paying fixed and receiving floating on swaps, the bank synthetically transforms part of its fixed income (from loans) into floating income, reducing the rate-sensitivity gap between its assets and liabilities — a classic application of asset-liability management (ALM) via swaps, without having to sell or renegotiate the underlying loans and deposits.",
  },
  commonMistake: {
    fr: "Croire que la seule façon de corriger un déséquilibre actif-passif est de modifier physiquement le bilan (vendre ou renégocier des prêts), en oubliant que les swaps permettent un ajustement synthétique bien plus rapide et flexible.",
    en: "Believing the only way to fix an asset-liability mismatch is to physically alter the balance sheet (sell or renegotiate loans), forgetting swaps allow a much faster, more flexible synthetic adjustment.",
  },
});

export const templates: QuestionTemplate[] = [
  netFlowNumericTemplate,
  payerBenefitsTemplate,
  noNotionalExchangeTemplate,
  parValueTemplate,
  comprehensionTemplate,
  syntheticLoanComparisonTemplate,
  whatIfFloatingEqualsFixedTemplate,
  whatIfNoUnderlyingDebtTemplate,
  multiPeriodNetFlowNumericTemplate,
  payerTerminologyErrorTemplate,
  floatingDebtToFixedScenarioTemplate,
  assetLiabilityMatchScenarioTemplate,
];
