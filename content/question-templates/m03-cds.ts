import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

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

export const templates: QuestionTemplate[] = [premiumNumericTemplate, payoutNumericTemplate, impliedPdTemplate, modelChoiceTemplate];
