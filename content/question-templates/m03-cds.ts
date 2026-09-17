import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const premiumNumericTemplate: QuestionTemplate = {
  id: "m03-cds-prime-annuelle",
  conceptId: "m03-cds",
  kind: "numeric",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 2, 50) * 500_000;
    const spreadBp = randomInt(rng, 30, 500);
    const premium = Math.round(((notional * spreadBp) / 10000) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une banque achète une protection CDS sur un notionnel de ${fmt(notional, "fr", 0)}, à un spread de ${spreadBp} points de base. Quelle est la prime annuelle payée ?`,
        en: `A bank buys CDS protection on a notional of ${fmt(notional, "en", 0)}, at a spread of ${spreadBp} basis points. What is the annual premium paid?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 5",
      hint: { fr: "Prime = Notionnel × Spread (en proportion).", en: "Premium = Notional × Spread (as a proportion)." },
      numeric: { value: premium, tolerance: 5 },
      calculation: {
        fr: `Prime = ${fmt(notional, "fr", 0)} × ${spreadBp}/10000 = ${fmt(premium, "fr")}.`,
        en: `Premium = ${fmt(notional, "en", 0)} × ${spreadBp}/10000 = ${fmt(premium, "en")}.`,
      },
      explanation: {
        fr: "La prime CDS est versée périodiquement (souvent trimestriellement en pratique), indépendamment de la survenance d'un défaut.",
        en: "The CDS premium is paid periodically (often quarterly in practice), regardless of whether a default actually occurs.",
      },
      commonMistake: {
        fr: "Oublier de convertir les points de base en proportion (diviser par 10 000, pas par 100).",
        en: "Forgetting to convert basis points to a proportion (divide by 10,000, not 100).",
      },
    };
  },
};

const payoutNumericTemplate: QuestionTemplate = {
  id: "m03-cds-paiement-defaut",
  conceptId: "m03-cds",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 2, 50) * 500_000;
    const recoveryPct = randomInt(rng, 10, 60);
    const payout = Math.round(notional * (1 - recoveryPct / 100));

    return {
      isScenario: true,
      prompt: {
        fr: `Un événement de crédit survient sur une entité dont le notionnel protégé est ${fmt(notional, "fr", 0)}, avec un taux de recouvrement de ${recoveryPct}%. Combien le vendeur de protection doit-il payer à l'acheteur ?`,
        en: `A credit event occurs on an entity whose protected notional is ${fmt(notional, "en", 0)}, with a recovery rate of ${recoveryPct}%. How much must the protection seller pay the buyer?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 5",
      hint: { fr: "Paiement = Notionnel × (1 − Taux de recouvrement).", en: "Payout = Notional × (1 − Recovery rate)." },
      numeric: { value: payout, tolerance: 5 },
      calculation: {
        fr: `Paiement = ${fmt(notional, "fr", 0)} × (1 − ${recoveryPct}%) = ${fmt(payout, "fr", 0)}.`,
        en: `Payout = ${fmt(notional, "en", 0)} × (1 − ${recoveryPct}%) = ${fmt(payout, "en", 0)}.`,
      },
      explanation: {
        fr: "Le paiement compense la perte nette du créancier, c'est-à-dire la part du notionnel non récupérée après le défaut.",
        en: "The payout compensates the creditor's net loss, i.e. the portion of the notional not recovered after default.",
      },
      commonMistake: {
        fr: "Payer le notionnel entier sans tenir compte du recouvrement, ou inverser (1−R) en R.",
        en: "Paying out the full notional without accounting for recovery, or flipping (1−R) into R.",
      },
    };
  },
};

const impliedPdTemplate: QuestionTemplate = {
  id: "m03-cds-pd-implicite",
  conceptId: "m03-cds",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const spreadBp = randomInt(rng, 50, 600);
    const recoveryPct = randomInt(rng, 20, 50);
    const spread = spreadBp / 10000;
    const R = recoveryPct / 100;
    const pd = Math.round((spread / (1 - R)) * 10000) / 100;

    return {
      prompt: {
        fr: `Le spread CDS coté est de ${spreadBp} points de base et le taux de recouvrement supposé est R = ${recoveryPct}%. Quelle est la probabilité de défaut annuelle implicite (approximation), en % ?`,
        en: `The quoted CDS spread is ${spreadBp} basis points and the assumed recovery rate is R = ${recoveryPct}%. What is the implied annual default probability (approximation), in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.2",
      hint: { fr: "PD ≈ Spread / (1 − R).", en: "PD ≈ Spread / (1 − R)." },
      numeric: { value: pd, tolerance: 0.2 },
      calculation: {
        fr: `PD ≈ ${spreadBp}pb / (1 − ${recoveryPct}%) = ${(spread * 100).toFixed(2)}% / ${(1 - R).toFixed(2)} ≈ ${pd}%.`,
        en: `PD ≈ ${spreadBp}bp / (1 − ${recoveryPct}%) = ${(spread * 100).toFixed(2)}% / ${(1 - R).toFixed(2)} ≈ ${pd}%.`,
      },
      explanation: {
        fr: "Cette PD est une approximation risque-neutre simple à horizon 1 an, pas la probabilité de défaut historique réelle de l'entité.",
        en: "This PD is a simple 1-year risk-neutral approximation, not the entity's actual historical default probability.",
      },
      commonMistake: {
        fr: "Utiliser directement le spread comme PD, sans diviser par (1−R).",
        en: "Using the spread directly as the PD, without dividing by (1−R).",
      },
    };
  },
};

const modelChoiceTemplate: QuestionTemplate = {
  id: "m03-cds-choix-modele",
  conceptId: "m03-cds",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "reduced", fr: "coter un CDS en cohérence avec les spreads déjà observés sur le marché", en: "quote a CDS consistently with spreads already observed in the market" },
        { id: "structural", fr: "estimer un risque de défaut pour une entreprise cotée sans aucun CDS liquide sur son nom, à partir de la volatilité de son action", en: "estimate default risk for a listed company with no liquid CDS on its name, from its equity volatility" },
        { id: "historical", fr: "estimer une PD réelle pour dimensionner des provisions de portefeuille, par classe de notation", en: "estimate a real-world PD to size portfolio provisions, by rating class" },
      ] as const
    );

    const choiceLabels = {
      reduced: { fr: "Modèle réduit (intensité de hasard, calibré sur les prix de marché)", en: "Reduced-form model (hazard rate, calibrated on market prices)" },
      structural: { fr: "Modèle structurel (Merton, basé sur la valeur des actifs)", en: "Structural model (Merton, based on asset value)" },
      historical: { fr: "Modèle empirique (matrices de transition de notation)", en: "Empirical model (rating transition matrices)" },
    };

    return {
      isScenario: true,
      prompt: {
        fr: `Un analyste doit ${scenario.fr}. Quelle famille de modèle de probabilité de défaut est la plus adaptée ?`,
        en: `An analyst needs to ${scenario.en}. Which family of default probability model is best suited?`,
      },
      choices: buildChoices([
        { id: "reduced", label: choiceLabels.reduced },
        { id: "structural", label: choiceLabels.structural },
        { id: "historical", label: choiceLabels.historical },
      ]),
      hint: {
        fr: "Pensez à quelle donnée est disponible dans chaque cas : prix de marché, données de bilan/actions, ou historique de défauts par notation.",
        en: "Think about what data is available in each case: market prices, balance-sheet/equity data, or historical default rates by rating.",
      },
      correctChoiceIds: [scenario.id],
      explanation: {
        fr:
          scenario.id === "reduced"
            ? "Les modèles réduits sont calibrés directement sur les prix de marché (spreads CDS/obligataires) : ils garantissent la cohérence avec ce qui est déjà coté."
            : scenario.id === "structural"
              ? "Sans CDS liquide, un modèle structurel type Merton permet d'inférer un risque de défaut à partir de données actions et de bilan, disponibles pour toute entreprise cotée."
              : "Pour du provisionnement de portefeuille, les matrices de transition de notation donnent une PD réelle (physique) basée sur des fréquences de défaut historiques, plus adaptée à cet usage que la PD risque-neutre d'un CDS.",
        en:
          scenario.id === "reduced"
            ? "Reduced-form models are calibrated directly on market prices (CDS/bond spreads): they guarantee consistency with what is already quoted."
            : scenario.id === "structural"
              ? "Without a liquid CDS, a Merton-type structural model lets you infer default risk from equity and balance-sheet data, available for any listed company."
              : "For portfolio provisioning, rating transition matrices give a real-world (physical) PD based on historical default frequencies, better suited to this use than a CDS's risk-neutral PD.",
      },
      commonMistake: {
        fr: "Utiliser systématiquement un seul type de modèle quel que soit le contexte, sans tenir compte de la donnée réellement disponible ni de l'usage visé (pricing vs provisionnement).",
        en: "Systematically using a single model type regardless of context, ignoring what data is actually available or the intended use (pricing vs. provisioning).",
      },
    };
  },
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-cds-comprehension-utilite",
  conceptId: "m03-cds",
  difficulty: "medium",
  prompt: {
    fr: "Une banque détient un prêt important à une entreprise cliente et s'inquiète de son risque de défaut, mais ne veut pas vendre ce prêt (pour préserver la relation commerciale). Pourquoi un CDS est-il une solution adaptée dans ce cas ?",
    en: "A bank holds a large loan to a corporate client and worries about default risk, but doesn't want to sell that loan (to preserve the business relationship). Why is a CDS a fitting solution here?",
  },
  choices: [
    { id: "hedge-without-selling", label: { fr: "Il permet de se couvrir contre le risque de défaut SANS vendre la créance ni révéler cette couverture au client", en: "It allows hedging against default risk WITHOUT selling the claim or revealing the hedge to the client" } },
    { id: "must-sell", label: { fr: "Il faut de toute façon vendre le prêt pour qu'un CDS fonctionne", en: "The loan must be sold anyway for a CDS to work" } },
    { id: "no-benefit", label: { fr: "Le CDS n'apporte aucun avantage particulier dans ce cas précis", en: "The CDS offers no particular benefit in this specific case" } },
  ],
  correctId: "hedge-without-selling",
  hint: { fr: "Le CDS est un contrat séparé, indépendant de la détention ou de la cession de la créance elle-même.", en: "A CDS is a separate contract, independent of holding or transferring the claim itself." },
  explanation: {
    fr: "Le CDS est un contrat d'assurance distinct de la créance sous-jacente : la banque continue de détenir son prêt et sa relation commerciale intacte, tout en achetant une protection séparée contre le défaut. C'est précisément ce découplage entre détention de la créance et couverture du risque qui rend le CDS si utile pour les banques gérant des relations clients sensibles.",
    en: "A CDS is an insurance contract separate from the underlying claim: the bank keeps holding its loan and its business relationship intact, while buying separate protection against default. It is precisely this decoupling between holding the claim and hedging the risk that makes CDS so useful for banks managing sensitive client relationships.",
  },
  commonMistake: {
    fr: "Croire qu'il faut nécessairement vendre ou modifier la créance sous-jacente pour se couvrir contre son risque de défaut.",
    en: "Believing you necessarily need to sell or modify the underlying claim to hedge against its default risk.",
  },
});

const cdsVsSellComparisonTemplate = mcqTemplate({
  id: "m03-cds-comparaison-cds-vs-vente",
  conceptId: "m03-cds",
  difficulty: "medium",
  prompt: {
    fr: "Comparez deux façons de réduire son exposition au risque de défaut d'une obligation détenue : (A) vendre l'obligation sur le marché, (B) acheter une protection CDS sur cette même entité en conservant l'obligation. Quelle différence essentielle distingue ces deux approches ?",
    en: "Compare two ways to reduce exposure to a held bond's default risk: (A) sell the bond on the market, (B) buy CDS protection on the same entity while keeping the bond. What key difference distinguishes these two approaches?",
  },
  choices: [
    { id: "keep-vs-exit", label: { fr: "La vente élimine totalement l'exposition et la relation avec le titre ; le CDS conserve la détention du titre tout en neutralisant son risque de crédit", en: "Selling entirely eliminates the exposure and relationship to the security; the CDS keeps holding the security while neutralizing its credit risk" } },
    { id: "identical", label: { fr: "Les deux approches sont économiquement et opérationnellement strictement identiques", en: "The two approaches are economically and operationally strictly identical" } },
    { id: "cds-always-cheaper", label: { fr: "Le CDS est toujours moins coûteux que la vente, sans exception", en: "The CDS is always cheaper than selling, with no exception" } },
  ],
  correctId: "keep-vs-exit",
  hint: { fr: "L'une sort complètement de la position, l'autre la garde tout en achetant une assurance séparée.", en: "One fully exits the position, the other keeps it while buying separate insurance." },
  explanation: {
    fr: "Vendre l'obligation élimine intégralement l'exposition (plus de risque de crédit, mais aussi plus de coupon perçu, et potentiellement un impact sur une relation commerciale ou un mandat de gestion imposant de détenir le titre). Acheter une protection CDS conserve la détention du titre (et son coupon) tout en neutralisant spécifiquement le risque de défaut : les deux approches ont un coût et des implications différentes, ce n'est pas un simple substitut équivalent.",
    en: "Selling the bond fully eliminates the exposure (no more credit risk, but also no more coupon received, and potentially an impact on a business relationship or a mandate requiring the security to be held). Buying CDS protection keeps the security held (and its coupon) while specifically neutralizing default risk: the two approaches have different costs and implications, not a simple equivalent substitute.",
  },
  commonMistake: {
    fr: "Traiter la vente du titre et l'achat d'une protection CDS comme deux options parfaitement interchangeables, sans considérer leurs implications différentes sur la détention et le revenu du titre.",
    en: "Treating selling the security and buying CDS protection as two perfectly interchangeable options, without considering their different implications for holding the security and its income.",
  },
});

const whatIfRecoveryRateChangesTemplate = mcqTemplate({
  id: "m03-cds-whatif-taux-recouvrement",
  conceptId: "m03-cds",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même spread CDS coté), si l'hypothèse de taux de recouvrement R utilisée pour estimer la PD implicite est revue à la HAUSSE, que devient la probabilité de défaut implicite estimée ?",
    en: "All else equal (same quoted CDS spread), if the assumed recovery rate R used to estimate the implied PD is revised UPWARD, what happens to the estimated implied default probability?",
  },
  choices: [
    { id: "lower-pd", label: { fr: "Elle diminue : PD ≈ Spread / (1−R), et (1−R) augmente quand R augmente", en: "It decreases: PD ≈ Spread / (1−R), and (1−R) increases as R rises" } },
    { id: "higher-pd", label: { fr: "Elle augmente", en: "It increases" } },
    { id: "unaffected", label: { fr: "Elle ne dépend jamais du taux de recouvrement supposé", en: "It never depends on the assumed recovery rate" } },
  ],
  correctId: "lower-pd",
  hint: { fr: "PD ≈ Spread / (1−R) : que devient le dénominateur (1−R) quand R augmente ?", en: "PD ≈ Spread / (1−R): what happens to the denominator (1−R) as R rises?" },
  explanation: {
    fr: "Le spread observé reste identique, mais un R plus élevé signifie que chaque unité de spread doit être expliquée par une PD plus faible (puisque la perte en cas de défaut, 1−R, est elle-même plus faible). Le dénominateur (1−R) augmente avec R, donc PD = Spread/(1−R) diminue : l'hypothèse de recouvrement a un effet direct et non négligeable sur l'estimation de PD, à spread observé identique.",
    en: "The observed spread stays the same, but a higher R means each unit of spread must be explained by a lower PD (since the loss given default, 1−R, is itself lower). The denominator (1−R) increases with R, so PD = Spread/(1−R) decreases: the recovery assumption has a direct, non-negligible effect on the PD estimate, at the same observed spread.",
  },
  commonMistake: {
    fr: "Croire que la PD implicite est une donnée de marché directement observable, indépendante de l'hypothèse de recouvrement choisie par l'analyste.",
    en: "Believing the implied PD is a directly observable market datum, independent of the recovery assumption chosen by the analyst.",
  },
});

const whatIfSpreadWidensNoDefaultTemplate = mcqTemplate({
  id: "m03-cds-whatif-elargissement-spread-sans-defaut",
  conceptId: "m03-cds",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un investisseur a acheté une protection CDS il y a 6 mois. Depuis, la santé financière de l'entité de référence s'est dégradée (sans aller jusqu'au défaut) et son spread CDS coté a fortement augmenté. La position de l'investisseur a-t-elle gagné de la valeur, même en l'absence de tout défaut ?",
    en: "An investor bought CDS protection 6 months ago. Since then, the reference entity's financial health has deteriorated (without reaching default) and its quoted CDS spread has risen sharply. Has the investor's position gained value, even with no default at all?",
  },
  choices: [
    { id: "gain", label: { fr: "Oui : sa protection, achetée à un spread plus bas, vaut désormais plus cher au prix de marché actuel, plus élevé", en: "Yes: their protection, bought at a lower spread, is now worth more at the current, higher market spread" } },
    { id: "no-value", label: { fr: "Non, un CDS n'a de valeur qu'au moment précis d'un défaut, jamais avant", en: "No, a CDS only has value at the exact moment of a default, never before" } },
    { id: "loss", label: { fr: "Non, l'investisseur perd de la valeur car il continue de payer la prime", en: "No, the investor loses value since they keep paying the premium" } },
  ],
  correctId: "gain",
  hint: { fr: "Un CDS se négocie et se revalorise en continu sur le marché, comme n'importe quel instrument coté, pas seulement au moment d'un défaut.", en: "A CDS trades and is continuously revalued on the market, like any quoted instrument, not just at the moment of a default." },
  explanation: {
    fr: "Un CDS a une valeur de marché à tout instant, pas seulement à l'échéance ou lors d'un défaut : un acheteur de protection qui a fixé sa prime à un spread bas voit la valeur de son contrat augmenter quand le spread de marché monte (la protection qu'il détient coûterait désormais plus cher à acheter), même si aucun événement de crédit ne s'est encore produit. C'est ce qui permet de revendre ou de dénouer une position CDS avant l'échéance, avec un gain ou une perte de marché.",
    en: "A CDS has a market value at every instant, not just at maturity or upon a default: a protection buyer who locked in their premium at a low spread sees their contract's value rise when the market spread rises (the protection they hold would now cost more to buy), even though no credit event has occurred yet. This is what lets a CDS position be resold or unwound before maturity, with a market gain or loss.",
  },
  commonMistake: {
    fr: "Croire qu'un CDS ne \"vaut\" quelque chose qu'au moment d'un défaut effectif, en ignorant sa valeur de marché continue liée à l'évolution du spread coté.",
    en: "Believing a CDS only \"has value\" at the moment of an actual default, ignoring its continuous market value tied to the quoted spread's evolution.",
  },
});

const cumulativePremiumNumericTemplate: QuestionTemplate = {
  id: "m03-cds-prime-cumulee-calcul",
  conceptId: "m03-cds",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const notional = randomInt(rng, 2, 30) * 500_000;
    const spreadBp = randomInt(rng, 30, 400);
    const years = randomInt(rng, 2, 7);
    const annualPremium = (notional * spreadBp) / 10000;
    const cumulative = Math.round(annualPremium * years * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un acheteur de protection paie un spread de ${spreadBp} points de base sur un notionnel de ${notional.toLocaleString("fr-FR")}, pendant ${years} ans, sans qu'aucun défaut ne survienne. Quel est le montant total de primes versées sur toute la période ?`,
        en: `A protection buyer pays a spread of ${spreadBp} basis points on a notional of ${notional.toLocaleString("en-US")}, for ${years} years, with no default occurring. What is the total amount of premiums paid over the whole period?`,
      },
      numericUnit: { fr: "même devise que le notionnel", en: "same currency as the notional" },
      numericTolerance: "± 50",
      hint: { fr: "Prime cumulée = Prime annuelle × Nombre d'années.", en: "Cumulative premium = Annual premium × Number of years." },
      numeric: { value: cumulative, tolerance: 50 },
      calculation: {
        fr: `Prime annuelle = ${notional.toLocaleString("fr-FR")} × ${spreadBp}/10000 = ${annualPremium.toLocaleString("fr-FR")}. Cumulée sur ${years} ans = ${annualPremium.toLocaleString("fr-FR")} × ${years} = ${cumulative.toLocaleString("fr-FR")}.`,
        en: `Annual premium = ${notional.toLocaleString("en-US")} × ${spreadBp}/10000 = ${annualPremium.toLocaleString("en-US")}. Cumulative over ${years} years = ${annualPremium.toLocaleString("en-US")} × ${years} = ${cumulative.toLocaleString("en-US")}.`,
      },
      explanation: {
        fr: "En l'absence de défaut, l'acheteur de protection ne reçoit jamais de paiement compensatoire : le coût total de sa couverture, s'il n'y a jamais d'événement de crédit sur toute la durée, est simplement la somme des primes versées — un rappel qu'une assurance a un coût même quand le sinistre ne se produit jamais.",
        en: "Absent a default, the protection buyer never receives a compensating payment: the total cost of their hedge, if no credit event ever occurs over the whole period, is simply the sum of the premiums paid — a reminder that insurance has a cost even when the claim never happens.",
      },
      commonMistake: {
        fr: "Oublier de multiplier par le nombre d'années, en ne calculant que la prime d'une seule période.",
        en: "Forgetting to multiply by the number of years, computing only a single period's premium.",
      },
    };
  },
};

const cdsOnlyValuableAtDefaultErrorTemplate = trueFalseTemplate({
  id: "m03-cds-erreur-valeur-uniquement-defaut",
  conceptId: "m03-cds",
  difficulty: "medium",
  statement: {
    fr: "Un CDS n'a de valeur de marché que pendant la période qui suit immédiatement un défaut ; avant cela, sa valeur de marché est toujours nulle.",
    en: "A CDS only has market value in the period right after a default; before that, its market value is always zero.",
  },
  correct: false,
  explanation: {
    fr: "Faux : un CDS a une valeur de marché à tout instant de sa vie, qui évolue avec le spread CDS coté sur le marché (à la hausse pour l'acheteur de protection si le spread de marché monte, même sans défaut). Seule sa valeur À LA CONCLUSION, si le spread contractuel est fixé au niveau du marché du jour, est proche de zéro — pas sa valeur pendant toute sa durée de vie.",
    en: "False: a CDS has a market value at every instant of its life, which moves with the market-quoted CDS spread (rising for the protection buyer if the market spread widens, even with no default). Only its value AT INCEPTION, if the contractual spread is set at that day's market level, is near zero — not its value throughout its entire life.",
  },
  commonMistake: {
    fr: "Confondre le paiement conditionnel au défaut (qui, lui, n'a lieu qu'en cas d'événement de crédit) avec la valeur de marché du contrat (qui évolue en continu avec le spread coté).",
    en: "Confusing the default-conditional payout (which only happens upon a credit event) with the contract's market value (which continuously moves with the quoted spread).",
  },
});

const nakedCdsScenarioTemplate = mcqTemplate({
  id: "m03-cds-scenario-cds-nu",
  conceptId: "m03-cds",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un hedge fund achète une protection CDS sur une entreprise dont il ne détient AUCUNE obligation ni créance, pariant sur une dégradation de son crédit (un « CDS nu »). Quelle affirmation décrit le mieux cette position ?",
    en: "A hedge fund buys CDS protection on a company whose debt it does NOT hold at all, betting on its credit deteriorating (a \"naked CDS\"). Which statement best describes this position?",
  },
  choices: [
    { id: "speculative", label: { fr: "C'est un pari purement spéculatif sur le crédit de l'entité, sans lien avec une exposition économique réelle à couvrir", en: "It's a purely speculative bet on the entity's credit, with no link to a real economic exposure to hedge" } },
    { id: "must-hold", label: { fr: "C'est impossible : il faut obligatoirement détenir la dette sous-jacente pour acheter un CDS", en: "This is impossible: you must hold the underlying debt to buy a CDS" } },
    { id: "risk-free", label: { fr: "C'est une position sans aucun risque puisqu'aucune créance réelle n'est en jeu", en: "It's a risk-free position since no real claim is at stake" } },
  ],
  correctId: "speculative",
  hint: { fr: "Rien n'oblige contractuellement l'acheteur de protection à détenir la dette de l'entité de référence.", en: "Nothing contractually requires the protection buyer to hold the reference entity's debt." },
  explanation: {
    fr: "Contrairement à une assurance classique qui exige un « intérêt assurable », un CDS peut être acheté sans détenir la dette sous-jacente : cela transforme l'instrument, initialement pensé comme une couverture, en un pur outil spéculatif permettant de parier sur la détérioration du crédit d'une entité. Cette pratique (CDS nu) a été identifiée comme un facteur amplificateur de risque systémique lors de la crise de 2008, menant à des débats réglementaires sur son encadrement.",
    en: "Unlike traditional insurance which requires an \"insurable interest\", a CDS can be bought without holding the underlying debt: this turns the instrument, originally designed as a hedge, into a purely speculative tool for betting on an entity's credit deterioration. This practice (naked CDS) was identified as a systemic-risk amplifier during the 2008 crisis, leading to regulatory debates about how to constrain it.",
  },
  commonMistake: {
    fr: "Croire qu'un CDS ne peut être utilisé qu'à des fins de couverture par un détenteur réel de la dette sous-jacente, en ignorant son usage spéculatif possible.",
    en: "Believing a CDS can only be used for hedging by an actual holder of the underlying debt, ignoring its possible speculative use.",
  },
});

const syntheticLongCreditScenarioTemplate = mcqTemplate({
  id: "m03-cds-scenario-vente-protection-vue-positive",
  conceptId: "m03-cds",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un gérant a une vue positive sur le crédit d'une entreprise (il pense que son risque de défaut est surestimé par le marché) mais ne veut pas immobiliser de capital pour acheter ses obligations directement. Comment peut-il exprimer cette vue via le marché des CDS ?",
    en: "A manager has a positive view on a company's credit (they think its default risk is overpriced by the market) but doesn't want to tie up capital to buy its bonds directly. How can they express this view via the CDS market?",
  },
  choices: [
    { id: "sell-protection", label: { fr: "En VENDANT une protection CDS sur cette entité, encaissant la prime en pariant qu'aucun défaut ne surviendra", en: "By SELLING CDS protection on that entity, collecting the premium while betting no default will occur" } },
    { id: "buy-protection", label: { fr: "En achetant une protection CDS sur cette entité", en: "By buying CDS protection on that entity" } },
    { id: "impossible", label: { fr: "Le marché des CDS ne permet pas d'exprimer une vue positive sur un crédit", en: "The CDS market doesn't allow expressing a positive view on a credit" } },
  ],
  correctId: "sell-protection",
  hint: { fr: "Le vendeur de protection encaisse une prime régulière et ne paie que si un défaut survient — une position qui profite d'une absence de défaut.", en: "The protection seller collects a regular premium and only pays if a default occurs — a position that profits from a default NOT happening." },
  explanation: {
    fr: "Vendre une protection CDS crée une exposition économique proche de la détention directe de la dette (encaisser une prime régulière en échange d'un risque de défaut), sans avoir à financer l'achat de l'obligation elle-même : c'est une exposition longue au crédit \"synthétique\", qui mobilise généralement moins de capital qu'un achat direct d'obligations, exactement adaptée à une vue positive sur un crédit jugé sous-évalué en risque par le marché.",
    en: "Selling CDS protection creates an economic exposure close to directly holding the debt (collecting a regular premium in exchange for default risk), without having to fund the bond purchase itself: it's a \"synthetic\" long credit exposure, which generally ties up less capital than a direct bond purchase, exactly suited to a positive view on a credit the market is judged to be mispricing as riskier than it is.",
  },
  commonMistake: {
    fr: "Confondre acheter et vendre une protection CDS : l'achat exprime une vue négative (pari sur la dégradation), la vente une vue positive (pari sur la stabilité ou l'amélioration du crédit).",
    en: "Confusing buying and selling CDS protection: buying expresses a negative view (betting on deterioration), selling a positive view (betting on the credit's stability or improvement).",
  },
});

export const templates: QuestionTemplate[] = [
  premiumNumericTemplate,
  payoutNumericTemplate,
  impliedPdTemplate,
  modelChoiceTemplate,
  comprehensionTemplate,
  cdsVsSellComparisonTemplate,
  whatIfRecoveryRateChangesTemplate,
  whatIfSpreadWidensNoDefaultTemplate,
  cumulativePremiumNumericTemplate,
  cdsOnlyValuableAtDefaultErrorTemplate,
  nakedCdsScenarioTemplate,
  syntheticLongCreditScenarioTemplate,
];
