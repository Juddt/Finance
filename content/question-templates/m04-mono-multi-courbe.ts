import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en"): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US");
}

const whichCurveTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-role",
  conceptId: "m04-mono-multi-courbe",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const task = pick(
      rng,
      [
        { id: "discount", fr: "actualiser un flux futur, quel que soit l'indice sur lequel il est calculé", en: "discount a future flow, whatever index it is computed on" },
        { id: "project", fr: "estimer le taux forward de la jambe variable indexée EURIBOR 3M", en: "estimate the forward rate of the EURIBOR 3M-indexed floating leg" },
      ] as const
    );

    return {
      prompt: {
        fr: `En cadre multi-courbe, quelle courbe utilise-t-on pour ${task.fr} ?`,
        en: `In a multi-curve framework, which curve is used to ${task.en}?`,
      },
      choices: buildChoices([
        { id: "discount", label: { fr: "La courbe d'actualisation (OIS)", en: "The discounting curve (OIS)" } },
        { id: "project", label: { fr: "La courbe de projection (EURIBOR 3M)", en: "The projection curve (EURIBOR 3M)" } },
      ]),
      hint: { fr: "Une courbe sert à actualiser, l'autre à projeter les taux forward par tenor.", en: "One curve discounts, the other projects forward rates per tenor." },
      correctChoiceIds: [task.id],
      explanation:
        task.id === "discount"
          ? { fr: "Toute actualisation, quel que soit l'indice du flux, utilise la courbe OIS jugée la plus proche du sans-risque.", en: "All discounting, whatever the flow's index, uses the OIS curve seen as closest to risk-free." }
          : { fr: "Chaque indice (ici EURIBOR 3M) a sa propre courbe de projection, distincte de la courbe d'actualisation.", en: "Each index (here EURIBOR 3M) has its own projection curve, distinct from the discounting curve." },
      commonMistake: {
        fr: "Utiliser la même courbe pour les deux usages, l'erreur classique du cadre mono-courbe devenu obsolète après 2008.",
        en: "Using the same curve for both purposes, the classic single-curve mistake made obsolete after 2008.",
      },
    };
  },
};

const basisTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-basis",
  conceptId: "m04-mono-multi-courbe",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const euribor = randomInt(rng, 100, 400);
    const ois = euribor - randomInt(rng, 20, 200);
    const basisBp = euribor - ois;

    return {
      isScenario: true,
      prompt: {
        fr: `Le taux EURIBOR 3M cote ${euribor} points de base, le taux OIS équivalent cote ${ois} points de base. Quel est le spread EURIBOR-OIS (le "basis"), en points de base ?`,
        en: `The 3M EURIBOR rate quotes ${euribor} basis points, the equivalent OIS rate quotes ${ois} basis points. What is the EURIBOR-OIS spread (the "basis"), in basis points?`,
      },
      numericUnit: { fr: "points de base", en: "basis points" },
      numericTolerance: "± 1",
      hint: { fr: "Basis = EURIBOR − OIS.", en: "Basis = EURIBOR − OIS." },
      numeric: { value: basisBp, tolerance: 1 },
      calculation: { fr: `Basis = ${euribor} − ${ois} = ${basisBp} pb.`, en: `Basis = ${euribor} − ${ois} = ${basisBp} bp.` },
      explanation: {
        fr: "Ce spread capture le risque de crédit et de liquidité implicite du marché interbancaire non collatéralisé par rapport au taux au jour le jour garanti.",
        en: "This spread captures the implicit credit and liquidity risk of the uncollateralized interbank market relative to the secured overnight rate.",
      },
      commonMistake: {
        fr: "Calculer OIS − EURIBOR au lieu de EURIBOR − OIS, inversant le signe du basis.",
        en: "Computing OIS − EURIBOR instead of EURIBOR − OIS, flipping the basis's sign.",
      },
    };
  },
};

const crisisOriginTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-origine",
  conceptId: "m04-mono-multi-courbe",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Avant la crise financière de 2008, le spread entre taux interbancaire (EURIBOR) et taux garanti (OIS) était déjà considéré comme trop important pour être ignoré dans le pricing des swaps.",
      en: "Before the 2008 financial crisis, the spread between the interbank rate (EURIBOR) and the secured rate (OIS) was already considered too large to ignore in swap pricing.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : avant 2008, ce spread était jugé négligeable (quelques points de base), justifiant le cadre mono-courbe. La crise l'a fait grimper à plus de 200 points de base, rendant le cadre multi-courbe indispensable.",
      en: "False: before 2008, this spread was seen as negligible (a few basis points), justifying the single-curve framework. The crisis pushed it above 200 basis points, making the multi-curve framework essential.",
    },
    commonMistake: {
      fr: "Croire que le cadre multi-courbe a toujours existé, alors qu'il est directement né de la crise de 2008.",
      en: "Believing the multi-curve framework has always existed, when it directly emerged from the 2008 crisis.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-vocab",
  conceptId: "m04-mono-multi-courbe",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La courbe utilisée pour actualiser les flux d'un swap collatéralisé en cash est généralement fondée sur le taux ______, jugé plus proche du sans-risque que le taux interbancaire.",
      en: "The curve used to discount a cash-collateralized swap's flows is generally based on the ______ rate, seen as closer to risk-free than the interbank rate.",
    },
    fillBlankPlaceholder: { fr: "un sigle", en: "one acronym" },
    acceptedAnswers: ["ois"],
    hint: { fr: "Overnight Index Swap.", en: "Overnight Index Swap." },
    explanation: {
      fr: "Le taux OIS, basé sur des taux au jour le jour garantis, sert de référence d'actualisation en cadre multi-courbe.",
      en: "The OIS rate, based on secured overnight rates, serves as the discounting reference in the multi-curve framework.",
    },
    commonMistake: {
      fr: "Répondre EURIBOR, qui est la courbe de PROJECTION, pas d'actualisation.",
      en: "Answering EURIBOR, which is the PROJECTION curve, not the discounting one.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m04-multi-courbe-comprehension-utilite",
  conceptId: "m04-mono-multi-courbe",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi la séparation entre courbe d'actualisation (OIS) et courbe de projection (EURIBOR) est-elle nécessaire pour obtenir un prix de swap cohérent avec le reste du marché ?",
    en: "Why is separating the discounting curve (OIS) from the projection curve (EURIBOR) necessary to get a swap price consistent with the rest of the market?",
  },
  choices: [
    { id: "consistent-pricing", label: { fr: "Parce que mélanger les deux usages produirait un prix incohérent avec les instruments de couverture réels (qui, eux, distinguent bien financement collatéralisé et taux interbancaire)", en: "Because mixing the two uses would produce a price inconsistent with real hedging instruments (which do distinguish collateralized funding from the interbank rate)" } },
    { id: "regulatory-only", label: { fr: "C'est une exigence purement réglementaire, sans justification de pricing", en: "It's a purely regulatory requirement, with no pricing justification" } },
    { id: "no-difference", label: { fr: "En réalité cela ne change jamais le prix final de façon significative", en: "In reality this never significantly changes the final price" } },
  ],
  correctId: "consistent-pricing",
  hint: { fr: "Un trader qui couvre son swap avec des instruments réels (OIS, futures EURIBOR) doit pouvoir répliquer exactement son prix théorique.", en: "A trader hedging their swap with real instruments (OIS, EURIBOR futures) must be able to exactly replicate its theoretical price." },
  explanation: {
    fr: "Depuis que le spread EURIBOR-OIS n'est plus négligeable, utiliser une seule courbe pour tout ferait diverger le prix théorique du coût réel de couverture d'un trader (qui finance sa position au taux collatéralisé OIS, mais reçoit/paie des flux indexés EURIBOR) : la séparation garantit que le prix théorique reste répliquable et cohérent avec les instruments effectivement négociés sur le marché.",
    en: "Since the EURIBOR-OIS spread stopped being negligible, using a single curve for everything would make the theoretical price diverge from a trader's real hedging cost (who funds their position at the OIS collateralized rate, but receives/pays EURIBOR-indexed flows): the separation ensures the theoretical price stays replicable and consistent with instruments actually traded in the market.",
  },
  commonMistake: {
    fr: "Voir le cadre multi-courbe comme une complexité artificielle plutôt que comme une exigence de cohérence avec la réalité économique du financement collatéralisé.",
    en: "Seeing the multi-curve framework as an artificial complexity rather than a requirement for consistency with the real economics of collateralized funding.",
  },
});

const tenorBasisComparisonTemplate = mcqTemplate({
  id: "m04-multi-courbe-comparaison-tenor",
  conceptId: "m04-mono-multi-courbe",
  difficulty: "hard",
  prompt: {
    fr: "En cadre multi-courbe, la courbe de projection EURIBOR 3M et la courbe de projection EURIBOR 6M sont-elles la même courbe, ou deux courbes distinctes ?",
    en: "In a multi-curve framework, are the EURIBOR 3M and EURIBOR 6M projection curves the same curve, or two distinct curves?",
  },
  choices: [
    { id: "distinct", label: { fr: "Deux courbes distinctes : chaque tenor (3M, 6M, 12M...) a sa propre courbe de projection, avec un écart (\"tenor basis\") entre elles", en: "Two distinct curves: each tenor (3M, 6M, 12M...) has its own projection curve, with a gap (\"tenor basis\") between them" } },
    { id: "same", label: { fr: "La même courbe, seule la fréquence de paiement change", en: "The same curve, only the payment frequency changes" } },
    { id: "depends-currency", label: { fr: "Cela dépend uniquement de la devise, jamais du tenor", en: "It depends only on the currency, never the tenor" } },
  ],
  correctId: "distinct",
  hint: { fr: "Un taux EURIBOR 3M et un taux EURIBOR 6M incorporent un risque de crédit/liquidité différent sur des horizons différents.", en: "A 3M EURIBOR rate and a 6M EURIBOR rate embed different credit/liquidity risk over different horizons." },
  explanation: {
    fr: "Chaque tenor d'un même indice (EURIBOR 3M, 6M, 12M...) constitue en réalité sa propre courbe de projection, car ces taux incorporent un risque de crédit et de liquidité bancaire différent selon l'horizon considéré : un écart persistant (le \"tenor basis\") existe entre elles, tout comme entre EURIBOR et OIS. C'est une extension du même principe multi-courbe, poussé au sein même de la famille EURIBOR.",
    en: "Each tenor of the same index (EURIBOR 3M, 6M, 12M...) actually constitutes its own projection curve, since these rates embed different bank credit and liquidity risk depending on the horizon considered: a persistent gap (the \"tenor basis\") exists between them, just as between EURIBOR and OIS. This extends the same multi-curve principle within the EURIBOR family itself.",
  },
  commonMistake: {
    fr: "Croire qu'\"EURIBOR\" désigne une seule et même courbe quel que soit le tenor considéré, en oubliant que chaque tenor a sa propre courbe de projection.",
    en: "Believing \"EURIBOR\" refers to one single curve regardless of tenor, forgetting each tenor has its own projection curve.",
  },
});

const whatIfBasisWidensTemplate = mcqTemplate({
  id: "m04-multi-courbe-whatif-elargissement-basis",
  conceptId: "m04-mono-multi-courbe",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une crise de confiance interbancaire fait brutalement s'élargir le spread EURIBOR-OIS. Pour un swap receveur fixe déjà en cours, quel effet cela a-t-il, toutes choses égales par ailleurs sur le niveau absolu des taux OIS ?",
    en: "An interbank confidence crisis abruptly widens the EURIBOR-OIS spread. For an already outstanding fixed-receiver swap, what effect does this have, all else equal on the absolute level of OIS rates?",
  },
  choices: [
    { id: "projected-float-rises", label: { fr: "Les taux EURIBOR projetés (jambe variable) montent par rapport à l'OIS, ce qui tend à réduire la valeur du swap pour son receveur fixe", en: "Projected EURIBOR rates (floating leg) rise relative to OIS, which tends to reduce the swap's value for its fixed receiver" } },
    { id: "no-effect", label: { fr: "Aucun effet, seule l'actualisation OIS compte pour la valorisation", en: "No effect, only OIS discounting matters for valuation" } },
    { id: "fixed-leg-only", label: { fr: "Seule la jambe fixe est affectée par ce mouvement", en: "Only the fixed leg is affected by this move" } },
  ],
  correctId: "projected-float-rises",
  hint: { fr: "Un basis qui s'élargit signifie que l'EURIBOR projeté augmente par rapport à l'OIS, affectant la jambe VARIABLE, pas la jambe fixe.", en: "A widening basis means projected EURIBOR rises relative to OIS, affecting the FLOATING leg, not the fixed leg." },
  explanation: {
    fr: "Un élargissement du basis EURIBOR-OIS augmente les taux EURIBOR projetés par la courbe de projection, indépendamment de tout mouvement de la courbe OIS elle-même : la jambe variable du swap (qui verse cet EURIBOR projeté plus élevé) vaut désormais davantage pour son receveur, ce qui réduit la valeur nette pour le receveur fixe (qui, lui, reçoit un taux fixe inchangé mais doit désormais payer une jambe variable plus élevée).",
    en: "A widening EURIBOR-OIS basis raises the EURIBOR rates projected by the projection curve, independent of any move in the OIS curve itself: the swap's floating leg (which pays this higher projected EURIBOR) is now worth more to its receiver, which reduces the net value for the fixed receiver (who receives an unchanged fixed rate but must now pay a higher floating leg).",
  },
  commonMistake: {
    fr: "Croire qu'un mouvement du basis EURIBOR-OIS n'affecte que l'actualisation (courbe OIS), en oubliant son impact direct sur la courbe de PROJECTION de la jambe variable.",
    en: "Believing a EURIBOR-OIS basis move only affects discounting (the OIS curve), forgetting its direct impact on the floating leg's PROJECTION curve.",
  },
});

const whatIfCollateralCurrencyTemplate = mcqTemplate({
  id: "m04-multi-courbe-whatif-devise-collateral",
  conceptId: "m04-mono-multi-courbe",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un swap en EUR est collatéralisé en cash, mais le contrat de collatéral (CSA) précise que le collatéral peut être versé en USD. Quelle courbe d'actualisation faut-il alors utiliser, en toute rigueur ?",
    en: "A EUR swap is cash-collateralized, but the collateral agreement (CSA) specifies collateral can be posted in USD. Which discounting curve must then rigorously be used?",
  },
  choices: [
    { id: "usd-collateral-curve", label: { fr: "Une courbe d'actualisation reflétant le coût de financement en USD du collatéral, pas simplement la courbe OIS EUR standard", en: "A discounting curve reflecting the USD funding cost of the collateral, not simply the standard EUR OIS curve" } },
    { id: "always-eur-ois", label: { fr: "Toujours la courbe OIS EUR standard, la devise du collatéral n'a aucune importance", en: "Always the standard EUR OIS curve, the collateral's currency doesn't matter at all" } },
    { id: "average", label: { fr: "Une simple moyenne entre les courbes OIS EUR et USD", en: "A simple average between the EUR and USD OIS curves" } },
  ],
  correctId: "usd-collateral-curve",
  hint: { fr: "L'actualisation doit refléter le coût réel de financement du collatéral effectivement utilisé — la devise du swap lui-même n'est pas ce qui détermine ce coût.", en: "Discounting must reflect the real funding cost of the collateral actually used — the swap's own currency isn't what determines this cost." },
  explanation: {
    fr: "L'actualisation multi-courbe doit en toute rigueur refléter le coût de financement du collatéral RÉELLEMENT posté, qui peut être libellé dans une devise différente de celle des flux du swap lui-même : c'est ce qu'on appelle l'actualisation \"CSA-based\" (dépendante du contrat de collatéral), une extension avancée du principe multi-courbe au choix même de la devise d'actualisation.",
    en: "Multi-curve discounting must rigorously reflect the funding cost of the collateral ACTUALLY posted, which can be denominated in a different currency from the swap's own flows: this is called \"CSA-based\" discounting (dependent on the collateral agreement), an advanced extension of the multi-curve principle to the very choice of discounting currency.",
  },
  commonMistake: {
    fr: "Supposer que la devise d'actualisation est automatiquement celle du swap lui-même, en ignorant que c'est la devise du collatéral effectivement posté qui détermine le coût de financement réel à actualiser.",
    en: "Assuming the discounting currency is automatically the swap's own currency, ignoring that it's the actually posted collateral's currency that determines the real funding cost to discount.",
  },
});

const juniorTraineeScenarioTemplate = mcqTemplate({
  id: "m04-multi-courbe-scenario-formation-junior",
  conceptId: "m04-mono-multi-courbe",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un junior demande : « Pourquoi mon écran de cotation affiche plusieurs courbes EURIBOR différentes (3M, 6M, 12M) alors qu'il n'y a qu'une seule courbe OIS ? » Quelle est la meilleure réponse pédagogique ?",
    en: "A junior asks: \"Why does my quote screen show several different EURIBOR curves (3M, 6M, 12M) when there's only one OIS curve?\" What is the best pedagogical answer?",
  },
  choices: [
    { id: "explain-tenor", label: { fr: "Chaque tenor EURIBOR porte un risque de crédit/liquidité bancaire différent et nécessite sa propre courbe de projection, alors que l'OIS (quasi sans risque) sert d'actualisation unique pour tous les indices", en: "Each EURIBOR tenor carries different bank credit/liquidity risk and needs its own projection curve, while OIS (nearly risk-free) serves as the single discounting reference for every index" } },
    { id: "display-bug", label: { fr: "C'est un bug d'affichage, il n'existe en réalité qu'une seule courbe EURIBOR", en: "It's a display bug, there is really only one EURIBOR curve" } },
    { id: "random-choice", label: { fr: "Le choix entre les courbes EURIBOR est purement arbitraire, sans logique sous-jacente", en: "The choice between EURIBOR curves is purely arbitrary, with no underlying logic" } },
  ],
  correctId: "explain-tenor",
  hint: { fr: "Reliez la réponse aux deux notions déjà vues : le rôle unique de l'OIS pour l'actualisation, et le tenor basis entre courbes de projection.", en: "Link the answer to the two concepts already covered: OIS's unique discounting role, and the tenor basis between projection curves." },
  explanation: {
    fr: "La bonne réponse combine deux notions déjà vues : (1) l'OIS, jugé proche du sans-risque, sert de référence unique d'actualisation pour tous les produits collatéralisés, quel que soit leur indice ; (2) chaque tenor EURIBOR (3M, 6M, 12M) porte un risque de crédit/liquidité bancaire propre à son horizon, nécessitant sa propre courbe de PROJECTION distincte (le tenor basis). Une seule courbe d'actualisation, plusieurs courbes de projection : c'est la structure même du cadre multi-courbe.",
    en: "The right answer combines two concepts already covered: (1) OIS, seen as near risk-free, serves as the single discounting reference for all collateralized products, whatever their index; (2) each EURIBOR tenor (3M, 6M, 12M) carries bank credit/liquidity risk specific to its horizon, requiring its own distinct PROJECTION curve (the tenor basis). One discounting curve, several projection curves: this is the very structure of the multi-curve framework.",
  },
  commonMistake: {
    fr: "Expliquer la multiplicité des courbes EURIBOR sans la relier à la distinction fondamentale actualisation/projection, ce qui laisse le junior sans cadre conceptuel clair.",
    en: "Explaining the multiplicity of EURIBOR curves without linking it to the fundamental discounting/projection distinction, leaving the junior with no clear conceptual framework.",
  },
});

const impliedEuriborNumericTemplate: QuestionTemplate = {
  id: "m04-multi-courbe-euribor-implicite-calcul",
  conceptId: "m04-mono-multi-courbe",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ois = randomInt(rng, 100, 350);
    const basisBp = randomInt(rng, 20, 180);
    const euribor = ois + basisBp;

    return {
      isScenario: true,
      prompt: {
        fr: `Le taux OIS cote ${ois} points de base, et le basis EURIBOR-OIS observé sur le marché est de ${basisBp} points de base. Quel est le taux EURIBOR 3M implicite, en points de base ?`,
        en: `The OIS rate quotes ${ois} basis points, and the market-observed EURIBOR-OIS basis is ${basisBp} basis points. What is the implied 3M EURIBOR rate, in basis points?`,
      },
      numericUnit: { fr: "points de base", en: "basis points" },
      numericTolerance: "± 1",
      hint: { fr: "EURIBOR = OIS + Basis.", en: "EURIBOR = OIS + Basis." },
      numeric: { value: euribor, tolerance: 1 },
      calculation: { fr: `EURIBOR = ${ois} + ${basisBp} = ${euribor} pb.`, en: `EURIBOR = ${ois} + ${basisBp} = ${euribor} bp.` },
      explanation: {
        fr: "Inverser la définition du basis (EURIBOR = OIS + Basis) permet de reconstruire un taux à partir de l'autre et du spread observé, utile quand on ne dispose que de deux des trois grandeurs.",
        en: "Inverting the basis's definition (EURIBOR = OIS + Basis) lets you reconstruct one rate from the other and the observed spread, useful when only two of the three quantities are available.",
      },
      commonMistake: {
        fr: "Soustraire le basis au lieu de l'additionner, inversant le sens de la relation OIS/EURIBOR/basis.",
        en: "Subtracting the basis instead of adding it, reversing the OIS/EURIBOR/basis relationship's direction.",
      },
    };
  },
};

const onlyCollateralizedErrorTemplate = trueFalseTemplate({
  id: "m04-multi-courbe-erreur-uniquement-collateralise",
  conceptId: "m04-mono-multi-courbe",
  difficulty: "hard",
  statement: {
    fr: "Le cadre multi-courbe (séparation actualisation/projection) ne concerne que les swaps collatéralisés en cash ; un swap non collatéralisé se price toujours avec une seule courbe.",
    en: "The multi-curve framework (discounting/projection separation) only applies to cash-collateralized swaps; an uncollateralized swap is always priced with a single curve.",
  },
  correct: false,
  explanation: {
    fr: "Faux : la distinction entre courbe de projection (par indice/tenor) et courbe d'actualisation reste pertinente même sans collatéral, bien que le choix de la courbe d'actualisation change alors (elle doit refléter le coût de financement réel de la contrepartie non collatéralisée, potentiellement plus élevé que l'OIS). L'absence de collatéral ne fait pas disparaître le besoin de séparer les deux usages, elle change seulement quelle courbe utiliser pour l'actualisation.",
    en: "False: the distinction between the projection curve (per index/tenor) and the discounting curve remains relevant even without collateral, though the choice of discounting curve then changes (it must reflect the uncollateralized counterparty's real funding cost, potentially higher than OIS). The absence of collateral doesn't remove the need to separate the two uses, it only changes which curve to use for discounting.",
  },
  commonMistake: {
    fr: "Croire que le cadre mono-courbe redevient valable dès qu'un swap n'est pas collatéralisé, alors que la séparation projection/actualisation reste nécessaire, seule la courbe d'actualisation appropriée change.",
    en: "Believing the single-curve framework becomes valid again as soon as a swap isn't collateralized, when the projection/discounting separation remains necessary, only the appropriate discounting curve changes.",
  },
});

const preVsPost2008ScenarioTemplate = mcqTemplate({
  id: "m04-multi-courbe-scenario-avant-apres-2008",
  conceptId: "m04-mono-multi-courbe",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un desk reprice, avec les méthodes actuelles, un vieux swap conclu juste avant 2008 en cadre mono-courbe. Le prix obtenu aujourd'hui diffère-t-il de celui calculé à l'époque avec l'ancienne méthode, toutes choses égales par ailleurs sur les niveaux de taux ?",
    en: "A desk reprices, with current methods, an old swap entered into just before 2008 under the single-curve framework. Does the price obtained today differ from the one computed back then with the old method, all else equal on rate levels?",
  },
  choices: [
    { id: "differs", label: { fr: "Oui, potentiellement de façon significative, car le cadre multi-courbe sépare des usages que l'ancienne méthode confondait", en: "Yes, potentially significantly, since the multi-curve framework separates uses the old method conflated" } },
    { id: "identical", label: { fr: "Non, le prix est nécessairement identique quelle que soit la méthode utilisée", en: "No, the price is necessarily identical whatever method is used" } },
    { id: "only-fees", label: { fr: "La différence ne peut venir que de frais additionnels, jamais de la méthode de pricing elle-même", en: "The difference can only come from additional fees, never from the pricing method itself" } },
  ],
  correctId: "differs",
  hint: { fr: "Le passage au cadre multi-courbe n'est pas qu'une reformulation : il change concrètement les facteurs d'actualisation et de projection utilisés.", en: "The move to the multi-curve framework isn't just a reformulation: it concretely changes the discount and projection factors used." },
  explanation: {
    fr: "Le cadre mono-courbe d'avant 2008 utilisait implicitement la même courbe pour actualiser et projeter, une approximation raisonnable tant que le spread EURIBOR-OIS restait négligeable. Une fois ce spread devenu significatif, repricer le même swap en cadre multi-courbe (avec des facteurs d'actualisation OIS distincts des facteurs de projection EURIBOR) peut produire un prix sensiblement différent, purement du fait du changement de méthodologie, pas d'un mouvement de marché.",
    en: "The pre-2008 single-curve framework implicitly used the same curve for discounting and projecting, a reasonable approximation as long as the EURIBOR-OIS spread stayed negligible. Once that spread became significant, repricing the same swap under the multi-curve framework (with OIS discount factors distinct from EURIBOR projection factors) can produce a materially different price, purely from the methodology change, not a market move.",
  },
  commonMistake: {
    fr: "Croire que la méthodologie de pricing n'a aucun impact sur le prix obtenu, en traitant le choix mono-courbe/multi-courbe comme un simple détail technique sans conséquence.",
    en: "Believing the pricing methodology has no impact on the resulting price, treating the single-curve/multi-curve choice as a mere technical detail with no consequence.",
  },
});

export const templates: QuestionTemplate[] = [
  whichCurveTemplate,
  basisTemplate,
  crisisOriginTemplate,
  vocabTemplate,
  comprehensionTemplate,
  tenorBasisComparisonTemplate,
  whatIfBasisWidensTemplate,
  whatIfCollateralCurrencyTemplate,
  impliedEuriborNumericTemplate,
  onlyCollateralizedErrorTemplate,
  preVsPost2008ScenarioTemplate,
  juniorTraineeScenarioTemplate,
];
