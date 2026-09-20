import { randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const vocabTemplate: QuestionTemplate = {
  id: "m04-clearing-vocab",
  conceptId: "m04-clearing-csa",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "L'entité qui s'interpose entre l'acheteur et le vendeur d'un dérivé, devenant la contrepartie unique des deux côtés, s'appelle une ______.",
      en: "The entity that interposes itself between a derivative's buyer and seller, becoming the single counterparty on both sides, is called a ______.",
    },
    fillBlankPlaceholder: { fr: "un sigle (3 lettres)", en: "an acronym (3 letters)" },
    acceptedAnswers: ["ccp", "chambre de compensation"],
    hint: { fr: "Central CounterParty.", en: "Central CounterParty." },
    explanation: {
      fr: "La CCP (chambre de compensation) s'interpose entre les deux parties via la novation, devenant l'acheteur de tout vendeur et le vendeur de tout acheteur.",
      en: "The CCP (central counterparty) interposes itself between the two parties via novation, becoming the buyer to every seller and the seller to every buyer.",
    },
    commonMistake: {
      fr: "Confondre la CCP avec une simple plateforme de négociation, alors qu'elle devient juridiquement la contrepartie de chaque transaction.",
      en: "Confusing the CCP with a simple trading platform, when it legally becomes the counterparty to each transaction.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m04-clearing-comprehension",
  conceptId: "m04-clearing-csa",
  difficulty: "easy",
  prompt: {
    fr: "À quel problème répondent principalement le clearing central et les appels de marge sur les dérivés ?",
    en: "What problem do central clearing and margin calls on derivatives mainly address?",
  },
  choices: [
    { id: "counterparty-risk", label: { fr: "Le risque qu'une contrepartie ne puisse plus honorer ses engagements alors que le contrat lui est défavorable", en: "The risk that a counterparty can no longer honor its commitments while the contract is unfavorable to it" } },
    { id: "market-risk-of-underlying", label: { fr: "Le risque de marché de l'actif sous-jacent lui-même, indépendamment de toute contrepartie", en: "The underlying asset's own market risk, independent of any counterparty" } },
    { id: "no-real-problem", label: { fr: "Aucun problème réel, ces mécanismes sont purement administratifs", en: "No real problem, these mechanisms are purely administrative" } },
  ],
  correctId: "counterparty-risk",
  hint: { fr: "Pensez à ce qui se passe si votre contrepartie fait défaut alors que le contrat a de la valeur pour vous.", en: "Think about what happens if your counterparty defaults while the contract has value for you." },
  explanation: {
    fr: "Ces mécanismes existent pour gérer le risque de contrepartie : la possibilité qu'une des deux parties à un dérivé fasse défaut alors que la position a une valeur de marché positive pour l'autre partie, qui subirait alors une perte sans le collatéral ou la garantie de la CCP pour s'en prémunir.",
    en: "These mechanisms exist to manage counterparty risk: the possibility that one of the two parties to a derivative defaults while the position has positive market value for the other party, who would then suffer a loss without collateral or the CCP's guarantee to protect against it.",
  },
  commonMistake: {
    fr: "Confondre le risque de contrepartie (lié à la solvabilité de l'autre partie) avec le risque de marché de l'actif sous-jacent du dérivé.",
    en: "Confusing counterparty risk (tied to the other party's solvency) with the derivative's underlying asset's market risk.",
  },
});

const bilateralVsCentralComparisonTemplate = mcqTemplate({
  id: "m04-clearing-comparaison-bilateral-central",
  conceptId: "m04-clearing-csa",
  difficulty: "medium",
  prompt: {
    fr: "Quelle différence structurelle sépare la relation bilatérale (ISDA-CSA) de la compensation centrale (CCP) ?",
    en: "What structural difference separates the bilateral relationship (ISDA-CSA) from central clearing (CCP)?",
  },
  choices: [
    { id: "novation-vs-direct", label: { fr: "En central, la CCP se substitue aux deux parties par novation ; en bilatéral, les deux contreparties restent directement face à face", en: "In central clearing, the CCP substitutes itself for both parties via novation; bilaterally, the two counterparties remain directly facing each other" } },
    { id: "no-difference", label: { fr: "Aucune différence structurelle, seul le vocabulaire change", en: "No structural difference, only the vocabulary changes" } },
    { id: "csa-always-safer", label: { fr: "Le cadre bilatéral CSA est toujours plus sûr que la compensation centrale", en: "The bilateral CSA framework is always safer than central clearing" } },
  ],
  correctId: "novation-vs-direct",
  hint: { fr: "\"Novation\" signifie que le contrat original est remplacé par deux nouveaux contrats, chacun face à la CCP.", en: "\"Novation\" means the original contract is replaced by two new contracts, each facing the CCP." },
  explanation: {
    fr: "En compensation centrale, la CCP s'interpose par novation entre les deux contreparties initiales, qui ne se font alors plus face directement : chacune ne porte plus de risque que sur la CCP. En bilatéral, les deux contreparties restent directement engagées l'une envers l'autre, le CSA définissant seulement les règles d'échange de collatéral entre elles.",
    en: "In central clearing, the CCP interposes itself via novation between the two original counterparties, which no longer face each other directly: each now only carries risk on the CCP. Bilaterally, the two counterparties remain directly committed to each other, the CSA only defining the rules for exchanging collateral between them.",
  },
  commonMistake: {
    fr: "Croire que le CSA bilatéral et la compensation centrale sont deux termes interchangeables pour le même mécanisme.",
    en: "Believing the bilateral CSA and central clearing are two interchangeable terms for the same mechanism.",
  },
});

const imVsVmComparisonTemplate = trueFalseTemplate({
  id: "m04-clearing-comparaison-im-vm",
  conceptId: "m04-clearing-csa",
  difficulty: "medium",
  statement: {
    fr: "La marge de variation (VM) et la marge initiale (IM) jouent exactement le même rôle et sont interchangeables.",
    en: "Variation margin (VM) and initial margin (IM) play exactly the same role and are interchangeable.",
  },
  correct: false,
  hint: { fr: "L'une reflète une variation de valeur déjà survenue, l'autre couvre un risque futur potentiel.", en: "One reflects a value change that already happened, the other covers a potential future risk." },
  explanation: {
    fr: "Faux : la marge de variation (VM) règle, de façon définitive, la variation de valeur de marché déjà survenue depuis le dernier échange ; la marge initiale (IM) est un coussin de sécurité déposé une fois, conservé (et restitué à terme) pour couvrir le risque que la position se dégrade ENCORE avant qu'une position en défaut puisse être débouclée. Ce sont deux mécanismes complémentaires, pas équivalents.",
    en: "False: variation margin (VM) permanently settles the mark-to-market change that has already occurred since the last exchange; initial margin (IM) is a safety buffer posted once, held (and eventually returned) to cover the risk that the position deteriorates FURTHER before a defaulting position can be closed out. These are two complementary, not equivalent, mechanisms.",
  },
  commonMistake: {
    fr: "Confondre un règlement définitif reflétant le passé (VM) avec un coussin de sécurité couvrant un risque futur (IM).",
    en: "Confusing a final settlement reflecting the past (VM) with a safety buffer covering a future risk (IM).",
  },
});

const whatIfUncollateralizedDefaultTemplate = mcqTemplate({
  id: "m04-clearing-what-if-defaut-non-collateralise",
  conceptId: "m04-clearing-csa",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une institution a vendu d'énormes volumes de protection CDS sans exiger de collatéral substantiel de sa part, sur des positions qui deviennent ensuite fortement défavorables pour elle. Quel est le risque principal qui en découle ?",
    en: "An institution sold huge volumes of CDS protection without requiring substantial collateral from itself, on positions that later become strongly unfavorable to it. What is the main risk that follows?",
  },
  choices: [
    { id: "unable-to-meet-margin-calls", label: { fr: "L'institution peut se retrouver incapable d'honorer les appels de marge colossaux qui en découlent, avec un risque de contagion systémique", en: "The institution can find itself unable to meet the resulting colossal margin calls, with a risk of systemic contagion" } },
    { id: "no-consequence", label: { fr: "Aucune conséquence particulière tant que l'institution reste solvable sur le papier", en: "No particular consequence as long as the institution remains solvent on paper" } },
    { id: "only-affects-buyer", label: { fr: "Seul l'acheteur de protection supporte un risque, jamais le vendeur", en: "Only the protection buyer bears any risk, never the seller" } },
  ],
  correctId: "unable-to-meet-margin-calls",
  hint: { fr: "C'est exactement le scénario qui s'est produit chez AIG en 2008.", en: "This is exactly the scenario that occurred at AIG in 2008." },
  explanation: {
    fr: "Vendre de la protection sans collatéral suffisant expose l'institution à devoir honorer des appels de marge très importants si les positions deviennent défavorables, sans coussin préexistant pour absorber le choc : c'est précisément le scénario qui a conduit à la quasi-faillite d'AIG en 2008 et à son sauvetage massif par l'État américain, pour éviter une cascade de défauts chez ses contreparties.",
    en: "Selling protection with insufficient collateral exposes the institution to having to meet very large margin calls if positions turn unfavorable, with no pre-existing buffer to absorb the shock: this is precisely the scenario that led to AIG's near-collapse in 2008 and its massive bailout by the US government, to prevent a cascade of defaults among its counterparties.",
  },
  commonMistake: {
    fr: "Croire que seul l'acheteur de protection dans un CDS porte un risque, en oubliant que le vendeur peut accumuler des pertes de marché considérables.",
    en: "Believing only a CDS's protection buyer bears risk, forgetting the seller can accumulate considerable mark-to-market losses.",
  },
});

const whatIfSharpMoveMarginCallTemplate = mcqTemplate({
  id: "m04-clearing-what-if-mouvement-brutal",
  conceptId: "m04-clearing-csa",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un mouvement brutal des taux d'intérêt fait chuter fortement la valeur de marché d'un swap pour la contrepartie A, au profit de la contrepartie B. Que déclenche typiquement ce mouvement dans un cadre collatéralisé (CSA ou CCP) ?",
    en: "A sharp move in interest rates strongly reduces a swap's market value for counterparty A, to the benefit of counterparty B. What does this move typically trigger in a collateralized framework (CSA or CCP)?",
  },
  choices: [
    { id: "vm-call-a-to-b", label: { fr: "Un appel de marge de variation : A doit transférer du collatéral à B pour refléter cette variation de valeur", en: "A variation margin call: A must transfer collateral to B to reflect this value change" } },
    { id: "no-transfer-until-maturity", label: { fr: "Aucun transfert avant l'échéance finale du swap", en: "No transfer before the swap's final maturity" } },
    { id: "b-pays-a", label: { fr: "C'est B qui doit transférer du collatéral à A dans ce scénario", en: "It is B who must transfer collateral to A in this scenario" } },
  ],
  correctId: "vm-call-a-to-b",
  hint: { fr: "La marge de variation suit le sens de la variation de valeur de marché : qui \"perd\" de la valeur ici ?", en: "Variation margin follows the direction of the mark-to-market change: who \"loses\" value here?" },
  explanation: {
    fr: "Dans un cadre collatéralisé, un mouvement de marché qui rend la position défavorable pour A (et favorable pour B) déclenche un appel de marge de variation dans ce sens : A doit transférer du collatéral à B pour ramener l'exposition non collatéralisée entre les deux parties proche de zéro, généralement à fréquence quotidienne.",
    en: "In a collateralized framework, a market move that makes the position unfavorable for A (and favorable for B) triggers a variation margin call in that direction: A must transfer collateral to B to bring the uncollateralized exposure between the two parties back close to zero, typically on a daily frequency.",
  },
  commonMistake: {
    fr: "Croire que les transferts de collatéral n'ont lieu qu'à l'échéance finale du contrat, plutôt que régulièrement pendant toute sa durée de vie.",
    en: "Believing collateral transfers only happen at the contract's final maturity, rather than regularly throughout its life.",
  },
});

const variationMarginNumericTemplate: QuestionTemplate = {
  id: "m04-clearing-calcul-appel-marge-variation",
  conceptId: "m04-clearing-csa",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const mtmPrev = randomInt(rng, 40, 90) * 1000;
    const mtmNow = mtmPrev + randomInt(rng, 5, 40) * 1000;
    const vm = mtmNow - mtmPrev;

    return {
      isScenario: true,
      prompt: {
        fr: `La valeur de marché (MtM) d'une position, en faveur de la contrepartie A, était de ${fmt(mtmPrev, "fr")} à la dernière date d'échange de marge, et s'établit aujourd'hui à ${fmt(mtmNow, "fr")}. Quel est le montant de l'appel de marge de variation, que B doit transférer à A ?`,
        en: `A position's market value (MtM), in counterparty A's favor, was ${fmt(mtmPrev, "en")} at the last margin exchange date, and now stands at ${fmt(mtmNow, "en")}. What is the variation margin call amount, that B must transfer to A?`,
      },
      numericUnit: { fr: "même devise que le MtM", en: "same currency as the MtM" },
      numericTolerance: "± 500",
      hint: { fr: "VM = MtM_t − MtM_{t-1}.", en: "VM = MtM_t − MtM_{t-1}." },
      numeric: { value: vm, tolerance: 500 },
      calculation: {
        fr: `VM = ${fmt(mtmNow, "fr")} − ${fmt(mtmPrev, "fr")} = ${fmt(vm, "fr")}.`,
        en: `VM = ${fmt(mtmNow, "en")} − ${fmt(mtmPrev, "en")} = ${fmt(vm, "en")}.`,
      },
      explanation: {
        fr: "L'appel de marge de variation correspond simplement à la variation de la valeur de marché de la position depuis le dernier échange : ce montant est transféré de la contrepartie perdante vers la contrepartie gagnante, ramenant l'exposition non collatéralisée à zéro à cet instant.",
        en: "The variation margin call simply corresponds to the position's mark-to-market change since the last exchange: this amount is transferred from the losing counterparty to the winning counterparty, bringing the uncollateralized exposure back to zero at that moment.",
      },
      commonMistake: {
        fr: "Additionner les deux valeurs de marché au lieu de calculer leur différence.",
        en: "Adding the two mark-to-market values instead of computing their difference.",
      },
    };
  },
};

const initialMarginNumericTemplate: QuestionTemplate = {
  id: "m04-clearing-calcul-marge-initiale",
  conceptId: "m04-clearing-csa",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 5, 40) * 1_000_000;
    const rateBp = randomInt(rng, 200, 600);
    const rate = rateBp / 10000;
    const im = Math.round(notional * rate);

    return {
      isScenario: true,
      prompt: {
        fr: `Une position a un notionnel de ${fmt(notional, "fr")}. Le taux de marge initiale fixé par la CCP est de ${fmt(rateBp / 100, "fr", 2)}%. Quel est le montant de marge initiale exigé ?`,
        en: `A position has a notional of ${fmt(notional, "en")}. The CCP's initial margin rate is ${fmt(rateBp / 100, "en", 2)}%. What initial margin amount is required?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 2000",
      hint: { fr: "IM = α × Notionnel.", en: "IM = α × Notional." },
      numeric: { value: im, tolerance: 2000 },
      calculation: {
        fr: `IM = ${fmt(notional, "fr")} × ${fmt(rateBp / 100, "fr", 2)}% ≈ ${fmt(im, "fr")}.`,
        en: `IM = ${fmt(notional, "en")} × ${fmt(rateBp / 100, "en", 2)}% ≈ ${fmt(im, "en")}.`,
      },
      explanation: {
        fr: "Contrairement à la marge de variation (qui reflète une variation déjà survenue), la marge initiale est un coussin calculé en amont, proportionnel au notionnel de la position, pour couvrir le risque de dégradation supplémentaire de la position pendant la période nécessaire à son débouclement en cas de défaut.",
        en: "Unlike variation margin (which reflects a change that already happened), initial margin is a buffer calculated upfront, proportional to the position's notional, to cover the risk of further deterioration in the position during the time needed to close it out in case of default.",
      },
      commonMistake: {
        fr: "Confondre le calcul de la marge initiale avec celui de la marge de variation, qui repose sur une différence de valeurs de marché et non sur un taux appliqué au notionnel.",
        en: "Confusing the initial margin calculation with the variation margin one, which relies on a mark-to-market difference rather than a rate applied to notional.",
      },
    };
  },
};

const centralClearingRiskFreeMistakeTemplate = trueFalseTemplate({
  id: "m04-clearing-erreur-risque-elimine",
  conceptId: "m04-clearing-csa",
  difficulty: "medium",
  statement: {
    fr: "La compensation centrale élimine totalement le risque systémique lié aux dérivés, en le faisant simplement disparaître.",
    en: "Central clearing completely eliminates systemic risk related to derivatives, simply making it disappear.",
  },
  correct: false,
  hint: { fr: "Le risque est géré et mutualisé, pas supprimé : où se retrouve-t-il concentré ?", en: "Risk is managed and pooled, not removed: where does it end up concentrated?" },
  explanation: {
    fr: "Faux : la compensation centrale gère et mutualise le risque de contrepartie via la cascade de défaut (marge initiale, fonds de défaut, capital de la CCP), mais elle le CONCENTRE sur un nombre réduit d'acteurs — les CCP elles-mêmes deviennent des nœuds critiques du système financier, dont la défaillance éventuelle serait un événement systémique majeur.",
    en: "False: central clearing manages and pools counterparty risk via the default waterfall (initial margin, default fund, CCP capital), but it CONCENTRATES it on a small number of players — the CCPs themselves become critical nodes of the financial system, whose potential failure would be a major systemic event.",
  },
  commonMistake: {
    fr: "Croire que la compensation centrale supprime le risque au lieu de le transformer et de le concentrer sur un nombre réduit d'infrastructures critiques.",
    en: "Believing central clearing removes risk instead of transforming and concentrating it on a small number of critical infrastructures.",
  },
});

const riskManagerWaterfallScenarioTemplate = mcqTemplate({
  id: "m04-clearing-scenario-cascade-defaut",
  conceptId: "m04-clearing-csa",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un membre d'une CCP fait défaut, et la marge initiale qu'il avait déposée ne suffit pas à couvrir la perte de débouclement de sa position. Quelle est, dans l'ordre, la ressource suivante mobilisée par la cascade de défaut (default waterfall) ?",
    en: "A CCP member defaults, and the initial margin they had posted is insufficient to cover the loss from closing out their position. What is, in order, the next resource mobilized by the default waterfall?",
  },
  choices: [
    { id: "defaulter-default-fund-contribution", label: { fr: "La contribution du membre défaillant au fonds de défaut mutualisé", en: "The defaulting member's own contribution to the mutualized default fund" } },
    { id: "surviving-members-first", label: { fr: "Directement les contributions des autres membres survivants, en priorité", en: "Directly the surviving members' contributions, as a priority" } },
    { id: "central-bank-bailout", label: { fr: "Un sauvetage automatique par la banque centrale", en: "An automatic central bank bailout" } },
  ],
  correctId: "defaulter-default-fund-contribution",
  hint: { fr: "La cascade épuise d'abord les ressources propres au membre défaillant, avant de toucher qui que ce soit d'autre.", en: "The waterfall first exhausts the defaulting member's own resources, before touching anyone else." },
  explanation: {
    fr: "La cascade de défaut est conçue pour faire porter la perte, dans l'ordre, d'abord sur les ressources du membre défaillant lui-même : sa marge initiale, puis sa contribution au fonds de défaut mutualisé, avant de toucher le capital propre de la CCP puis, en tout dernier recours, les contributions des membres survivants — une structure qui protège autant que possible le système contre la défaillance d'un seul acteur.",
    en: "The default waterfall is designed to place the loss, in order, first on the defaulting member's own resources: its initial margin, then its contribution to the mutualized default fund, before touching the CCP's own capital and then, as an absolute last resort, the surviving members' contributions — a structure designed to protect the system as much as possible from a single player's failure.",
  },
  commonMistake: {
    fr: "Croire que les autres membres survivants sont sollicités en premier, avant que les ressources propres du membre défaillant ne soient épuisées.",
    en: "Believing the other surviving members are called upon first, before the defaulting member's own resources are exhausted.",
  },
});

const oisDiscountingScenarioTemplate = mcqTemplate({
  id: "m04-clearing-scenario-transition-ois",
  conceptId: "m04-clearing-csa",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un swap de taux est désormais intégralement collatéralisé en cash, avec appel de marge de variation quotidien. Quelle convention d'actualisation devient la plus cohérente pour son pricing, plutôt que le taux LIBOR historique ?",
    en: "An interest rate swap is now fully cash-collateralized, with daily variation margin calls. What discounting convention becomes most consistent for its pricing, rather than the historical LIBOR rate?",
  },
  choices: [
    { id: "ois-overnight-collateral-rate", label: { fr: "Le taux au jour le jour du collatéral (OIS), car c'est le taux auquel se refinance réellement le cash échangé en marge de variation", en: "The collateral's overnight rate (OIS), since that is the rate at which the cash exchanged as variation margin is actually refinanced" } },
    { id: "still-libor", label: { fr: "Le taux LIBOR reste toujours le plus adapté, quel que soit le régime de collatéralisation", en: "LIBOR remains always the most suitable rate, regardless of the collateralization regime" } },
    { id: "coupon-of-underlying", label: { fr: "Le taux de coupon des obligations sous-jacentes au swap", en: "The coupon rate of the bonds underlying the swap" } },
  ],
  correctId: "ois-overnight-collateral-rate",
  hint: { fr: "Le cash échangé en marge de variation doit être financé à un taux réel : lequel reflète ce financement au jour le jour ?", en: "The cash exchanged as variation margin must be funded at some real rate: which one reflects this overnight funding?" },
  explanation: {
    fr: "Une fois le swap intégralement collatéralisé en cash, le coût de financement réel de la position est celui du cash échangé en marge de variation, refinancé au jour le jour : c'est ce raisonnement qui a poussé l'industrie, après la crise de 2008, à actualiser les swaps collatéralisés au taux OIS (overnight) plutôt qu'au taux LIBOR — la motivation directe du cadre multi-courbe étudié dans la notion suivante.",
    en: "Once the swap is fully cash-collateralized, the position's real funding cost is that of the cash exchanged as variation margin, refinanced overnight: this reasoning is what pushed the industry, after the 2008 crisis, to discount collateralized swaps at the OIS (overnight) rate rather than LIBOR — the direct motivation for the multi-curve framework studied in the next concept.",
  },
  commonMistake: {
    fr: "Continuer à utiliser le taux LIBOR pour actualiser un swap collatéralisé, sans tenir compte du changement de coût de financement réel introduit par la collatéralisation.",
    en: "Continuing to use the LIBOR rate to discount a collateralized swap, without accounting for the change in real funding cost introduced by collateralization.",
  },
});

const emirMandateScenarioTemplate = mcqTemplate({
  id: "m04-clearing-scenario-mandat-emir",
  conceptId: "m04-clearing-csa",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une banque européenne souhaite conclure un swap de taux standardisé avec une autre grande institution financière. Selon le cadre réglementaire EMIR, quelle obligation s'applique typiquement à ce type de transaction ?",
    en: "A European bank wants to enter a standardized interest rate swap with another large financial institution. Under the EMIR regulatory framework, what obligation typically applies to this type of transaction?",
  },
  choices: [
    { id: "mandatory-central-clearing", label: { fr: "L'obligation de faire compenser la transaction par une CCP, pour la plupart des dérivés standardisés entre grandes institutions", en: "The obligation to have the transaction cleared through a CCP, for most standardized derivatives between large institutions" } },
    { id: "no-obligation", label: { fr: "Aucune obligation particulière, le choix du mode de règlement reste totalement libre", en: "No particular obligation, the settlement method choice remains entirely free" } },
    { id: "bilateral-only", label: { fr: "L'interdiction totale de recourir à la compensation centrale", en: "A total ban on using central clearing" } },
  ],
  correctId: "mandatory-central-clearing",
  hint: { fr: "EMIR a été adoptée en réponse directe aux leçons de la crise de 2008 sur les dérivés OTC non collatéralisés.", en: "EMIR was adopted as a direct response to the lessons of the 2008 crisis on uncollateralized OTC derivatives." },
  explanation: {
    fr: "EMIR (European Market Infrastructure Regulation) impose, pour la plupart des dérivés standardisés échangés entre grandes institutions financières, le recours obligatoire à la compensation centrale via une CCP — une réponse directe aux lacunes révélées par la crise de 2008 sur les dérivés OTC bilatéraux insuffisamment collatéralisés.",
    en: "EMIR (European Market Infrastructure Regulation) mandates, for most standardized derivatives traded between large financial institutions, the mandatory use of central clearing via a CCP — a direct response to the gaps revealed by the 2008 crisis around insufficiently collateralized bilateral OTC derivatives.",
  },
  commonMistake: {
    fr: "Croire que le choix entre compensation bilatérale et centrale reste totalement libre pour tout type de dérivé, sans tenir compte du cadre réglementaire applicable.",
    en: "Believing the choice between bilateral and central clearing remains entirely free for any derivative type, without accounting for the applicable regulatory framework.",
  },
});

export const templates: QuestionTemplate[] = [
  vocabTemplate,
  comprehensionTemplate,
  bilateralVsCentralComparisonTemplate,
  imVsVmComparisonTemplate,
  whatIfUncollateralizedDefaultTemplate,
  whatIfSharpMoveMarginCallTemplate,
  variationMarginNumericTemplate,
  initialMarginNumericTemplate,
  centralClearingRiskFreeMistakeTemplate,
  riskManagerWaterfallScenarioTemplate,
  oisDiscountingScenarioTemplate,
  emirMandateScenarioTemplate,
];
