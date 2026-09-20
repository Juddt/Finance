import { randomFloat, randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const vocabTemplate: QuestionTemplate = {
  id: "m04-inflation-vocab",
  conceptId: "m04-swap-inflation",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "L'écart entre le rendement d'une obligation nominale et celui d'une obligation indexée inflation de même maturité, interprété comme l'inflation anticipée par le marché, s'appelle l'inflation ______.",
      en: "The gap between a nominal bond's yield and an inflation-linked bond's yield of the same maturity, read as the market's expected inflation, is called ______ inflation.",
    },
    fillBlankPlaceholder: { fr: "un mot (terme anglais courant)", en: "one word" },
    acceptedAnswers: ["break-even", "breakeven"],
    hint: { fr: "Le point où les deux obligations \"s'équilibrent\" en performance anticipée.", en: "The point where both bonds \"break even\" in expected performance." },
    explanation: {
      fr: "L'inflation break-even se calcule comme rendement nominal moins rendement réel, et se lit comme l'inflation moyenne anticipée par le marché sur cette maturité.",
      en: "Break-even inflation is computed as nominal yield minus real yield, and reads as the average inflation expected by the market over that maturity.",
    },
    commonMistake: {
      fr: "Confondre l'inflation break-even avec l'inflation réellement publiée le mois précédent, qui est une donnée historique et non une anticipation de marché.",
      en: "Confusing break-even inflation with the inflation figure actually published last month, which is a historical data point, not a market expectation.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m04-inflation-comprehension",
  conceptId: "m04-swap-inflation",
  difficulty: "easy",
  prompt: {
    fr: "Pourquoi un investisseur achèterait-il une obligation indexée inflation plutôt qu'une obligation classique ?",
    en: "Why would an investor buy an inflation-linked bond rather than a plain bond?",
  },
  choices: [
    { id: "preserve-purchasing-power", label: { fr: "Pour préserver le pouvoir d'achat de ses coupons et de son capital, qui s'ajustent automatiquement sur l'inflation", en: "To preserve the purchasing power of its coupons and principal, which automatically adjust to inflation" } },
    { id: "higher-nominal-coupon", label: { fr: "Pour obtenir un coupon nominal toujours plus élevé qu'une obligation classique", en: "To obtain a nominal coupon always higher than a plain bond" } },
    { id: "no-credit-risk", label: { fr: "Parce qu'une obligation indexée inflation n'a par nature aucun risque de crédit", en: "Because an inflation-linked bond has by nature no credit risk at all" } },
  ],
  correctId: "preserve-purchasing-power",
  hint: { fr: "Le principal d'une obligation indexée suit l'IPC : quel risque cela neutralise-t-il pour l'investisseur ?", en: "An indexed bond's principal tracks the CPI: what risk does this neutralize for the investor?" },
  explanation: {
    fr: "Une obligation indexée inflation protège l'investisseur contre l'érosion de son pouvoir d'achat par l'inflation : ses coupons et son remboursement s'ajustent automatiquement sur un indice des prix, contrairement à une obligation classique dont les flux sont fixes en valeur nominale et perdent en valeur réelle si l'inflation s'accélère.",
    en: "An inflation-linked bond protects the investor against purchasing power erosion from inflation: its coupons and redemption automatically adjust to a price index, unlike a plain bond whose cash flows are fixed in nominal value and lose real value if inflation accelerates.",
  },
  commonMistake: {
    fr: "Croire qu'une obligation indexée inflation élimine le risque de crédit de l'émetteur, alors qu'elle ne protège que contre le risque d'inflation.",
    en: "Believing an inflation-linked bond eliminates the issuer's credit risk, when it only protects against inflation risk.",
  },
});

const linkerVsSwapComparisonTemplate = mcqTemplate({
  id: "m04-inflation-comparaison-linker-swap",
  conceptId: "m04-swap-inflation",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence structurelle sépare une obligation indexée inflation (linker) d'un swap d'inflation ?",
    en: "What structural difference separates an inflation-linked bond (linker) from an inflation swap?",
  },
  choices: [
    { id: "physical-bond-vs-pure-derivative", label: { fr: "Le linker est une obligation physique avec échange de principal ; le swap d'inflation est un pur dérivé, sans échange de principal, réglé net à l'échéance", en: "The linker is a physical bond with principal exchange; the inflation swap is a pure derivative, with no principal exchange, net-settled at maturity" } },
    { id: "no-difference", label: { fr: "Aucune différence, ce sont deux noms pour le même instrument", en: "No difference, these are two names for the same instrument" } },
    { id: "swap-is-a-bond-type", label: { fr: "Le swap d'inflation est en réalité un type particulier d'obligation classique", en: "The inflation swap is in fact a particular type of plain bond" } },
  ],
  correctId: "physical-bond-vs-pure-derivative",
  hint: { fr: "L'un se détient comme un titre au bilan, l'autre est un contrat d'échange de flux.", en: "One is held as a security on the balance sheet, the other is a cash-flow exchange contract." },
  explanation: {
    fr: "Le linker est une obligation physique, achetée et détenue comme tout titre obligataire, dont le principal est indexé sur l'inflation. Le swap d'inflation est un pur produit dérivé, qui échange un taux fixe contre l'inflation réalisée sans qu'aucun principal ne change jamais de mains — les deux permettent une exposition (ou une couverture) à l'inflation, mais avec des mécaniques et des implications de bilan très différentes.",
    en: "The linker is a physical bond, bought and held like any bond security, whose principal is indexed to inflation. The inflation swap is a pure derivative product, exchanging a fixed rate against realized inflation with no principal ever changing hands — both allow exposure to (or a hedge against) inflation, but with very different mechanics and balance-sheet implications.",
  },
  commonMistake: {
    fr: "Traiter le linker et le swap d'inflation comme strictement interchangeables, sans tenir compte de leurs implications différentes en termes de bilan et de financement.",
    en: "Treating the linker and the inflation swap as strictly interchangeable, without accounting for their different balance-sheet and funding implications.",
  },
});

const breakEvenVsTrueInflationComparisonTemplate = trueFalseTemplate({
  id: "m04-inflation-comparaison-breakeven-vs-vraie-inflation",
  conceptId: "m04-swap-inflation",
  difficulty: "hard",
  statement: {
    fr: "L'inflation break-even calculée à partir des prix de marché est une prévision pure et non biaisée de l'inflation future.",
    en: "Break-even inflation computed from market prices is a pure, unbiased forecast of future inflation.",
  },
  correct: false,
  hint: { fr: "Pensez à la même distinction que pour la probabilité de défaut implicite d'un CDS.", en: "Think of the same distinction as for a CDS's implied default probability." },
  explanation: {
    fr: "Faux : l'inflation break-even inclut, en plus de l'anticipation pure d'inflation, une prime de risque d'inflation (la compensation exigée par les investisseurs pour l'incertitude sur l'inflation future) — exactement la même distinction que pour la probabilité de défaut implicite d'un CDS (mesure risque-neutre) par rapport à la probabilité réelle/historique.",
    en: "False: break-even inflation includes, on top of the pure inflation expectation, an inflation risk premium (the compensation investors require for uncertainty about future inflation) — exactly the same distinction as a CDS's implied default probability (risk-neutral measure) versus the real-world/historical probability.",
  },
  commonMistake: {
    fr: "Lire directement l'inflation break-even comme la prévision d'inflation \"vraie\" du marché, sans tenir compte de la prime de risque qu'elle inclut.",
    en: "Directly reading break-even inflation as the market's \"true\" inflation forecast, without accounting for the risk premium it includes.",
  },
});

const whatIfCpiAboveExpectationsTemplate = mcqTemplate({
  id: "m04-inflation-what-if-ipc-superieur",
  conceptId: "m04-swap-inflation",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "L'IPC progresse nettement plus que ce qui était anticipé au moment de l'émission d'une obligation indexée inflation. Quel est l'effet direct sur les coupons futurs et le remboursement de cette obligation ?",
    en: "The CPI rises noticeably more than expected when an inflation-linked bond was issued. What is the direct effect on this bond's future coupons and redemption?",
  },
  choices: [
    { id: "both-increase", label: { fr: "Les coupons futurs et le remboursement augmentent, puisqu'ils se calculent sur un principal indexé qui suit l'IPC réellement observé", en: "Future coupons and redemption both increase, since they are computed on an indexed principal that tracks the actually observed CPI" } },
    { id: "no-effect", label: { fr: "Aucun effet, les flux d'une obligation indexée sont fixés définitivement à l'émission", en: "No effect, an indexed bond's cash flows are permanently fixed at issuance" } },
    { id: "coupons-fixed-redemption-varies", label: { fr: "Seul le remboursement final varie, les coupons intermédiaires restant fixes", en: "Only the final redemption varies, with interim coupons staying fixed" } },
  ],
  correctId: "both-increase",
  hint: { fr: "Coupon = taux réel × principal indexé, et le principal indexé suit directement le ratio IPC_t/IPC_0.", en: "Coupon = real rate × indexed principal, and the indexed principal directly tracks the CPI_t/CPI_0 ratio." },
  explanation: {
    fr: "Puisque le principal indexé se réévalue en continu sur le ratio IPC_t/IPC_0, une inflation plus forte que prévu fait mécaniquement augmenter à la fois les coupons futurs (taux réel × principal indexé plus élevé) et le montant du remboursement final : c'est précisément le mécanisme qui protège l'investisseur contre une inflation imprévue.",
    en: "Since the indexed principal is continuously revalued on the CPI_t/CPI_0 ratio, inflation coming in higher than expected mechanically raises both future coupons (real rate × higher indexed principal) and the final redemption amount: this is precisely the mechanism that protects the investor against unexpected inflation.",
  },
  commonMistake: {
    fr: "Croire que les flux d'une obligation indexée sont figés à l'émission comme ceux d'une obligation classique, en ignorant le mécanisme d'indexation continue du principal.",
    en: "Believing an indexed bond's cash flows are fixed at issuance like a plain bond's, ignoring the continuous principal indexation mechanism.",
  },
});

const whatIfDeflationScenarioTemplate = mcqTemplate({
  id: "m04-inflation-what-if-deflation",
  conceptId: "m04-swap-inflation",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "L'indice des prix baisse durablement (déflation) depuis l'émission d'une obligation indexée inflation dotée d'un plancher de déflation (deflation floor). Que reçoit l'investisseur au remboursement final ?",
    en: "The price index durably falls (deflation) since an inflation-linked bond with a deflation floor was issued. What does the investor receive at final redemption?",
  },
  choices: [
    { id: "at-least-face-value", label: { fr: "Au minimum le nominal d'origine, grâce au plancher de déflation qui empêche le principal indexé de descendre sous ce niveau", en: "At least the original face value, thanks to the deflation floor which prevents the indexed principal from falling below this level" } },
    { id: "reduced-principal", label: { fr: "Un montant strictement inférieur au nominal d'origine, reflétant fidèlement la baisse de l'indice des prix", en: "An amount strictly below the original face value, faithfully reflecting the price index's decline" } },
    { id: "zero", label: { fr: "Un remboursement nul en cas de déflation prolongée", en: "Zero redemption in case of prolonged deflation" } },
  ],
  correctId: "at-least-face-value",
  hint: { fr: "Le plancher de déflation est une option de vente implicite offerte à l'investisseur.", en: "The deflation floor is an implicit put option granted to the investor." },
  explanation: {
    fr: "Le plancher de déflation, présent sur la plupart des obligations indexées, garantit à l'investisseur un remboursement au moins égal au nominal d'origine, même si l'indice des prix a baissé depuis l'émission : c'est une option de vente implicite offerte gratuitement, qui protège spécifiquement contre un scénario déflationniste sans exister sur un swap d'inflation classique.",
    en: "The deflation floor, present on most inflation-linked bonds, guarantees the investor a redemption at least equal to the original face value, even if the price index has fallen since issuance: it is an implicit put option offered free of charge, specifically protecting against a deflationary scenario, and absent from a plain inflation swap.",
  },
  commonMistake: {
    fr: "Croire qu'une obligation indexée inflation peut rembourser moins que son nominal d'origine en cas de déflation, en oubliant la clause de plancher habituellement présente.",
    en: "Believing an inflation-linked bond can redeem for less than its original face value in case of deflation, forgetting the floor clause usually present.",
  },
});

const indexedPrincipalNumericTemplate: QuestionTemplate = {
  id: "m04-inflation-calcul-principal-indexe",
  conceptId: "m04-swap-inflation",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const face = randomInt(rng, 5, 20) * 1000;
    const cpiRatio = randomFloat(rng, 1.02, 1.15, 3);
    const indexedPrincipal = Math.round(face * cpiRatio);

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation indexée a un nominal d'origine de ${fmt(face, "fr", 0)}. Depuis son émission, le ratio IPC_t/IPC_0 s'établit à ${fmt(cpiRatio, "fr", 3)}. Quel est le principal indexé à cette date ?`,
        en: `An indexed bond has an original face value of ${fmt(face, "en", 0)}. Since issuance, the CPI_t/CPI_0 ratio stands at ${fmt(cpiRatio, "en", 3)}. What is the indexed principal at this date?`,
      },
      numericUnit: { fr: "même devise que le nominal", en: "same currency as the face value" },
      numericTolerance: "± 5",
      hint: { fr: "Principal indexé = Nominal × (IPC_t / IPC_0).", en: "Indexed principal = Face value × (CPI_t / CPI_0)." },
      numeric: { value: indexedPrincipal, tolerance: 5 },
      calculation: {
        fr: `Principal indexé = ${fmt(face, "fr", 0)} × ${fmt(cpiRatio, "fr", 3)} ≈ ${fmt(indexedPrincipal, "fr", 0)}.`,
        en: `Indexed principal = ${fmt(face, "en", 0)} × ${fmt(cpiRatio, "en", 3)} ≈ ${fmt(indexedPrincipal, "en", 0)}.`,
      },
      explanation: {
        fr: "Le principal indexé se recalcule en appliquant directement le ratio d'évolution de l'indice des prix depuis l'émission au nominal d'origine : c'est ce montant réévalué, pas le nominal initial, qui sert ensuite de base au calcul de chaque coupon.",
        en: "The indexed principal is recomputed by directly applying the price index's evolution ratio since issuance to the original face value: it is this revalued amount, not the original face value, that then serves as the basis for computing each coupon.",
      },
      commonMistake: {
        fr: "Additionner le ratio IPC au nominal au lieu de multiplier le nominal par ce ratio.",
        en: "Adding the CPI ratio to the face value instead of multiplying the face value by that ratio.",
      },
    };
  },
};

const breakEvenInflationNumericTemplate: QuestionTemplate = {
  id: "m04-inflation-calcul-breakeven",
  conceptId: "m04-swap-inflation",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const realYield = randomFloat(rng, 0.5, 2.5, 2);
    const nominalYield = realYield + randomFloat(rng, 1.5, 3.5, 2);
    const breakeven = Math.round((nominalYield - realYield) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation nominale rend ${fmt(nominalYield, "fr")}% et une obligation indexée inflation de même maturité rend ${fmt(realYield, "fr")}% en termes réels. Quelle est l'inflation break-even implicite, en % ?`,
        en: `A nominal bond yields ${fmt(nominalYield, "en")}% and an inflation-linked bond of the same maturity yields ${fmt(realYield, "en")}% in real terms. What is the implied break-even inflation, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "π_be = y_nominal − y_réel.", en: "π_be = y_nominal − y_real." },
      numeric: { value: breakeven, tolerance: 0.1 },
      calculation: {
        fr: `π_be = ${fmt(nominalYield, "fr")}% − ${fmt(realYield, "fr")}% = ${fmt(breakeven, "fr")}%.`,
        en: `π_be = ${fmt(nominalYield, "en")}% − ${fmt(realYield, "en")}% = ${fmt(breakeven, "en")}%.`,
      },
      explanation: {
        fr: "L'inflation break-even se lit directement comme l'écart entre le rendement nominal et le rendement réel d'obligations de même maturité : ce simple calcul résume l'inflation moyenne que le marché doit anticiper pour que les deux titres offrent le même rendement total espéré.",
        en: "Break-even inflation reads directly as the gap between the nominal and real yields of bonds of the same maturity: this simple calculation summarizes the average inflation the market must expect for both securities to offer the same expected total return.",
      },
      commonMistake: {
        fr: "Inverser la soustraction (rendement réel moins rendement nominal), ce qui donnerait un résultat négatif incohérent.",
        en: "Reversing the subtraction (real yield minus nominal yield), which would give an inconsistent negative result.",
      },
    };
  },
};

const pensionFundScenarioTemplate = mcqTemplate({
  id: "m04-inflation-scenario-fonds-pension",
  conceptId: "m04-swap-inflation",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un fonds de pension doit verser des rentes futures indexées sur l'inflation à ses bénéficiaires. Quel type d'instrument correspond le mieux à la couverture de ce risque spécifique ?",
    en: "A pension fund must pay future annuities indexed to inflation to its beneficiaries. What type of instrument best fits hedging this specific risk?",
  },
  choices: [
    { id: "linkers-or-inflation-swaps", label: { fr: "Des obligations indexées inflation ou des swaps d'inflation, dont les flux évoluent dans le même sens que ses engagements indexés", en: "Inflation-linked bonds or inflation swaps, whose cash flows move in the same direction as its indexed liabilities" } },
    { id: "plain-fixed-bonds", label: { fr: "Des obligations classiques à taux fixe, insensibles à l'inflation", en: "Plain fixed-rate bonds, insensitive to inflation" } },
    { id: "equity-only", label: { fr: "Uniquement des actions, sans lien direct avec l'inflation", en: "Equities only, with no direct link to inflation" } },
  ],
  correctId: "linkers-or-inflation-swaps",
  hint: { fr: "Le fonds veut que ses actifs bougent DANS LE MÊME SENS que ses engagements indexés sur l'inflation.", en: "The fund wants its assets to move IN THE SAME DIRECTION as its inflation-indexed liabilities." },
  explanation: {
    fr: "Un fonds de pension dont les engagements sont indexés sur l'inflation cherche des actifs dont la valeur et les flux évoluent dans le même sens que ces engagements : les obligations indexées inflation (linkers) et les swaps d'inflation sont précisément conçus pour cela, contrairement à des obligations classiques à taux fixe dont les flux ne s'ajustent jamais à l'inflation.",
    en: "A pension fund whose liabilities are inflation-indexed seeks assets whose value and cash flows move in the same direction as those liabilities: inflation-linked bonds (linkers) and inflation swaps are precisely designed for this, unlike plain fixed-rate bonds whose cash flows never adjust to inflation.",
  },
  commonMistake: {
    fr: "Se couvrir avec des obligations à taux fixe classiques, en oubliant qu'elles ne compensent pas la nature indexée sur l'inflation des engagements à couvrir.",
    en: "Hedging with plain fixed-rate bonds, forgetting they do not offset the inflation-indexed nature of the liabilities to be hedged.",
  },
});

const centralBankBreakEvenScenarioTemplate = mcqTemplate({
  id: "m04-inflation-scenario-banque-centrale-breakeven",
  conceptId: "m04-swap-inflation",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un banquier central observe que l'inflation break-even à 2 ans a fortement augmenté, tandis que le break-even à 10 ans reste stable et proche de la cible d'inflation. Comment interprète-t-il typiquement cette configuration ?",
    en: "A central banker observes that 2-year break-even inflation has risen sharply, while 10-year break-even remains stable and close to the inflation target. How do they typically interpret this configuration?",
  },
  choices: [
    { id: "transitory-shock", label: { fr: "Un choc d'inflation probablement transitoire, les anticipations à long terme restant bien ancrées autour de la cible", en: "A likely transitory inflation shock, with long-term expectations remaining well anchored around the target" } },
    { id: "durable-unanchoring", label: { fr: "Un désancrage durable et généralisé des anticipations d'inflation sur toutes les maturités", en: "A durable, broad-based unanchoring of inflation expectations across all maturities" } },
    { id: "no-useful-information", label: { fr: "Cette configuration ne contient aucune information exploitable pour la politique monétaire", en: "This configuration carries no usable information for monetary policy" } },
  ],
  correctId: "transitory-shock",
  hint: { fr: "Regardez toute la courbe des break-even par maturité, pas un seul point : où le mouvement est-il concentré ?", en: "Look at the whole break-even curve by maturity, not a single point: where is the move concentrated?" },
  explanation: {
    fr: "Une hausse concentrée sur les maturités courtes, avec des maturités longues stables et proches de la cible, suggère que le marché anticipe un choc d'inflation transitoire (ex. un choc d'offre ponctuel) plutôt qu'un désancrage durable des anticipations : c'est précisément pourquoi les banques centrales suivent l'ensemble de la courbe des break-even par maturité, et non un seul point, pour distinguer ces deux scénarios très différents.",
    en: "A rise concentrated in short maturities, with long maturities stable and close to target, suggests the market expects a transitory inflation shock (e.g. a one-off supply shock) rather than a durable unanchoring of expectations: this is precisely why central banks track the whole break-even curve by maturity, not a single point, to distinguish these two very different scenarios.",
  },
  commonMistake: {
    fr: "Juger l'ancrage des anticipations d'inflation à partir d'un seul point de la courbe break-even, sans comparer les maturités courtes et longues.",
    en: "Judging inflation expectation anchoring from a single point on the break-even curve, without comparing short and long maturities.",
  },
});

const indexationLagMistakeTemplate = trueFalseTemplate({
  id: "m04-inflation-erreur-decalage-indexation",
  conceptId: "m04-swap-inflation",
  difficulty: "medium",
  statement: {
    fr: "L'indice des prix utilisé pour indexer une obligation à une date donnée reflète l'inflation du mois en cours, sans aucun décalage.",
    en: "The price index used to index a bond at a given date reflects the current month's inflation, with no lag at all.",
  },
  correct: false,
  hint: { fr: "L'IPC du mois en cours n'est publié qu'avec un délai statistique.", en: "The current month's CPI is only published after a statistical delay." },
  explanation: {
    fr: "Faux : en pratique, l'indexation utilise un IPC publié avec un décalage de 2 à 3 mois par rapport à la date de calcul (le temps que les statisticiens collectent et publient les données) — ce décalage d'indexation signifie que l'inflation la plus récente n'est pas instantanément reflétée dans le principal indexé.",
    en: "False: in practice, indexation uses a CPI published with a 2 to 3 month lag relative to the calculation date (the time needed for statisticians to collect and publish the data) — this indexation lag means the most recent inflation is not instantly reflected in the indexed principal.",
  },
  commonMistake: {
    fr: "Supposer une indexation instantanée sur l'inflation du mois en cours, en ignorant le délai de publication statistique de l'IPC.",
    en: "Assuming instantaneous indexation to the current month's inflation, ignoring the CPI's statistical publication delay.",
  },
});

const treasuryDeskScenarioTemplate = mcqTemplate({
  id: "m04-inflation-scenario-desk-tresorerie",
  conceptId: "m04-swap-inflation",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le desk de trésorerie d'une entreprise veut se couvrir contre l'inflation sur ses coûts futurs, sans acheter ni détenir physiquement d'obligations à son bilan. Quel instrument correspond le mieux à cette contrainte ?",
    en: "A company's treasury desk wants to hedge against inflation on its future costs, without buying or physically holding bonds on its balance sheet. Which instrument best fits this constraint?",
  },
  choices: [
    { id: "inflation-swap", label: { fr: "Un swap d'inflation, qui offre l'exposition recherchée sans achat ni détention physique d'un titre obligataire", en: "An inflation swap, which provides the desired exposure without buying or physically holding a bond security" } },
    { id: "buy-linkers", label: { fr: "L'achat direct d'obligations indexées inflation, à conserver au bilan", en: "The direct purchase of inflation-linked bonds, to be held on the balance sheet" } },
    { id: "do-nothing", label: { fr: "Aucun instrument ne permet de répondre à cette contrainte précise", en: "No instrument can meet this specific constraint" } },
  ],
  correctId: "inflation-swap",
  hint: { fr: "Le desk veut l'EXPOSITION à l'inflation, mais explicitement sans détenir de titre physique au bilan.", en: "The desk wants inflation EXPOSURE, but explicitly without holding a physical security on the balance sheet." },
  explanation: {
    fr: "Le swap d'inflation est précisément l'instrument adapté à cette contrainte : il offre une exposition (ou une couverture) à l'inflation par un contrat d'échange de flux, sans nécessiter l'achat ni la détention d'un titre obligataire physique au bilan, contrairement à un linker qui reste avant tout une obligation à part entière.",
    en: "The inflation swap is precisely the instrument suited to this constraint: it provides exposure to (or a hedge against) inflation via a cash-flow exchange contract, with no need to buy or hold a physical bond security on the balance sheet, unlike a linker which remains first and foremost a full-fledged bond.",
  },
  commonMistake: {
    fr: "Recommander systématiquement l'achat de linkers, sans tenir compte de la contrainte explicite de ne pas détenir de titre physique au bilan.",
    en: "Systematically recommending the purchase of linkers, without accounting for the explicit constraint of not holding a physical security on the balance sheet.",
  },
});

export const templates: QuestionTemplate[] = [
  vocabTemplate,
  comprehensionTemplate,
  linkerVsSwapComparisonTemplate,
  breakEvenVsTrueInflationComparisonTemplate,
  whatIfCpiAboveExpectationsTemplate,
  whatIfDeflationScenarioTemplate,
  indexedPrincipalNumericTemplate,
  breakEvenInflationNumericTemplate,
  indexationLagMistakeTemplate,
  pensionFundScenarioTemplate,
  centralBankBreakEvenScenarioTemplate,
  treasuryDeskScenarioTemplate,
];
