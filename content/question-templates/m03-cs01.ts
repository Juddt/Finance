import { randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const comprehensionTemplate = mcqTemplate({
  id: "m03-cs01-comprehension",
  conceptId: "m03-cs01",
  difficulty: "medium",
  prompt: {
    fr: "Que mesure le CS01 d'une position obligataire ?",
    en: "What does a bond position's CS01 measure?",
  },
  choices: [
    { id: "spread-sensitivity", label: { fr: "La variation de valeur pour une hausse d'un point de base du spread de crédit, taux sans risque inchangé", en: "The value change for a one-basis-point rise in the credit spread, risk-free rate unchanged" } },
    { id: "rate-sensitivity", label: { fr: "La variation de valeur pour une hausse d'un point de base du taux sans risque, spread inchangé", en: "The value change for a one-basis-point rise in the risk-free rate, spread unchanged" } },
    { id: "coupon-amount", label: { fr: "Le montant du coupon annuel versé par l'obligation", en: "The bond's annual coupon amount" } },
    { id: "default-probability", label: { fr: "La probabilité de défaut de l'émetteur sur l'année en cours", en: "The issuer's default probability over the current year" } },
  ],
  correctId: "spread-sensitivity",
  hint: { fr: "\"CS\" signifie Credit Spread : c'est le facteur de risque isolé ici, pas le taux sans risque.", en: "\"CS\" stands for Credit Spread: that's the isolated risk factor here, not the risk-free rate." },
  explanation: {
    fr: "Le CS01 isole spécifiquement la sensibilité au spread de crédit, le taux sans risque étant maintenu constant : c'est l'exact analogue du DV01 (qui isole la sensibilité au taux sans risque), appliqué à un facteur de risque différent. Il ne mesure ni le coupon, ni directement une probabilité de défaut.",
    en: "CS01 specifically isolates sensitivity to the credit spread, with the risk-free rate held constant: it is the exact analog of DV01 (which isolates sensitivity to the risk-free rate), applied to a different risk factor. It measures neither the coupon, nor directly a default probability.",
  },
  commonMistake: {
    fr: "Confondre le CS01 avec le DV01, en oubliant qu'ils isolent chacun un facteur de risque différent (spread vs taux sans risque).",
    en: "Confusing CS01 with DV01, forgetting each isolates a different risk factor (spread vs risk-free rate).",
  },
});

const cs01VsDv01ComparisonTemplate = mcqTemplate({
  id: "m03-cs01-comparaison-dv01",
  conceptId: "m03-cs01",
  difficulty: "medium",
  prompt: {
    fr: "Un portefeuille obligataire affiche un DV01 net proche de zéro et un CS01 net très élevé. Comment interpréter cette situation ?",
    en: "A bond portfolio shows a DV01 net close to zero and a very high net CS01. How should this situation be interpreted?",
  },
  choices: [
    { id: "hedged-rate-exposed-credit", label: { fr: "Le portefeuille est bien couvert contre le risque de taux, mais reste fortement exposé au risque de crédit", en: "The portfolio is well hedged against rate risk, but remains heavily exposed to credit risk" } },
    { id: "fully-hedged", label: { fr: "Le portefeuille est intégralement couvert contre tous les risques, DV01 et CS01 étant équivalents", en: "The portfolio is fully hedged against all risks, DV01 and CS01 being equivalent" } },
    { id: "impossible-combination", label: { fr: "Cette combinaison est impossible : DV01 et CS01 sont toujours proportionnels l'un à l'autre", en: "This combination is impossible: DV01 and CS01 are always proportional to each other" } },
    { id: "no-risk-at-all", label: { fr: "Le portefeuille ne porte plus aucun risque significatif", en: "The portfolio no longer carries any significant risk" } },
  ],
  correctId: "hedged-rate-exposed-credit",
  hint: { fr: "DV01 et CS01 mesurent deux facteurs de risque INDÉPENDANTS, pas un seul et même risque.", en: "DV01 and CS01 measure two INDEPENDENT risk factors, not a single risk." },
  explanation: {
    fr: "DV01 et CS01 mesurent deux facteurs de risque indépendants : un DV01 proche de zéro signifie une bonne couverture du risque de taux, mais ne dit rien sur le risque de crédit, mesuré séparément par le CS01. Un CS01 élevé dans ce contexte signale une exposition significative au risque de crédit, malgré la couverture réussie du risque de taux.",
    en: "DV01 and CS01 measure two independent risk factors: a DV01 close to zero means good rate risk hedging, but says nothing about credit risk, separately measured by CS01. A high CS01 in this context signals significant credit risk exposure, despite successful rate risk hedging.",
  },
  commonMistake: {
    fr: "Croire qu'un DV01 proche de zéro suffit à garantir un portefeuille obligataire totalement sans risque, en ignorant le risque de crédit mesuré par le CS01.",
    en: "Believing a DV01 close to zero is enough to guarantee a totally risk-free bond portfolio, ignoring the credit risk measured by CS01.",
  },
});

const flightToQualityWhatIfTemplate = mcqTemplate({
  id: "m03-cs01-what-if-fuite-qualite",
  conceptId: "m03-cs01",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Lors d'un épisode de \"fuite vers la qualité\", les taux sans risque baissent fortement tandis que les spreads de crédit des obligations d'entreprise s'élargissent simultanément. Quel est l'effet net probable sur le prix d'une obligation d'entreprise risquée ?",
    en: "During a \"flight to quality\" episode, risk-free rates fall sharply while corporate bond credit spreads widen simultaneously. What is the likely net effect on a risky corporate bond's price?",
  },
  choices: [
    { id: "two-effects-offset", label: { fr: "Les deux effets (DV01 et CS01) jouent en sens opposé sur le prix, l'effet net dépendant de leur ampleur relative", en: "The two effects (DV01 and CS01) play in opposite directions on the price, the net effect depending on their relative magnitude" } },
    { id: "always-price-up", label: { fr: "Le prix monte toujours nécessairement, la baisse des taux dominant systématiquement", en: "The price always necessarily rises, the rate decline systematically dominating" } },
    { id: "always-price-down", label: { fr: "Le prix baisse toujours nécessairement, l'élargissement du spread dominant systématiquement", en: "The price always necessarily falls, the spread widening systematically dominating" } },
    { id: "effects-always-cancel-exactly", label: { fr: "Les deux effets s'annulent toujours exactement, laissant le prix rigoureusement inchangé", en: "The two effects always exactly cancel out, leaving the price strictly unchanged" } },
  ],
  correctId: "two-effects-offset",
  hint: { fr: "Une baisse de taux pousse le prix à la hausse (DV01) ; un élargissement de spread le pousse à la baisse (CS01) : lequel l'emporte dépend de leur ampleur respective.", en: "A rate decline pushes the price up (DV01); a spread widening pushes it down (CS01): which wins depends on their respective size." },
  explanation: {
    fr: "Une baisse des taux sans risque pousse mécaniquement le prix de l'obligation à la hausse (effet DV01), tandis que l'élargissement du spread de crédit le pousse à la baisse (effet CS01) : ces deux effets jouent en sens opposé, et seule la décomposition en DV01 et CS01 permet de comprendre lequel domine dans l'effet net observé sur le prix — un raisonnement impossible avec un seul chiffre de sensibilité agrégée.",
    en: "A decline in risk-free rates mechanically pushes the bond's price up (DV01 effect), while the credit spread widening pushes it down (CS01 effect): these two effects play in opposite directions, and only decomposing into DV01 and CS01 allows understanding which dominates in the net effect observed on the price — a reasoning impossible with a single aggregated sensitivity figure.",
  },
  commonMistake: {
    fr: "Prédire systématiquement le sens du mouvement de prix sans décomposer les effets opposés du DV01 et du CS01 lors d'un épisode de fuite vers la qualité.",
    en: "Systematically predicting the price move's direction without decomposing the opposing DV01 and CS01 effects during a flight-to-quality episode.",
  },
});

const spreadWidensWhatIfTemplate = mcqTemplate({
  id: "m03-cs01-what-if-elargissement-spread",
  conceptId: "m03-cs01",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le spread de crédit d'un émetteur s'élargit fortement suite à une dégradation de notation, le taux sans risque restant strictement inchangé. Quel est l'effet sur le prix de ses obligations en circulation ?",
    en: "An issuer's credit spread widens sharply following a rating downgrade, the risk-free rate staying strictly unchanged. What is the effect on their outstanding bonds' price?",
  },
  choices: [
    { id: "price-falls", label: { fr: "Le prix baisse, l'ampleur de la baisse étant approximativement estimée par le CS01 multiplié par l'élargissement du spread", en: "The price falls, the drop's size being approximately estimated by CS01 multiplied by the spread widening" } },
    { id: "price-unaffected", label: { fr: "Le prix n'est pas affecté, seul le taux sans risque influençant le prix d'une obligation", en: "The price is unaffected, only the risk-free rate influencing a bond's price" } },
    { id: "price-rises", label: { fr: "Le prix monte, une dégradation de notation étant toujours favorable au prix de l'obligation", en: "The price rises, a rating downgrade always being favorable to the bond's price" } },
    { id: "only-coupon-affected", label: { fr: "Seul le coupon futur est affecté, jamais le prix de marché actuel de l'obligation", en: "Only the future coupon is affected, never the bond's current market price" } },
  ],
  correctId: "price-falls",
  hint: { fr: "ΔP ≈ −CS01 × Δspread : un spread qui s'élargit (Δspread positif) donne quel signe pour ΔP ?", en: "ΔP ≈ −CS01 × Δspread: a widening spread (positive Δspread) gives what sign for ΔP?" },
  explanation: {
    fr: "Un élargissement du spread de crédit, taux sans risque inchangé, fait mécaniquement baisser le prix de l'obligation (ΔP ≈ −CS01 × Δspread, avec Δspread positif) : l'investisseur exige un rendement plus élevé pour détenir une obligation perçue comme plus risquée, ce qui se traduit par un prix plus bas pour un même flux de coupons futurs.",
    en: "A credit spread widening, risk-free rate unchanged, mechanically lowers the bond's price (ΔP ≈ −CS01 × Δspread, with a positive Δspread): the investor demands a higher return to hold a bond perceived as riskier, which translates into a lower price for the same future coupon flows.",
  },
  commonMistake: {
    fr: "Croire qu'une dégradation de notation, donc un élargissement du spread, n'affecte que les flux futurs et jamais le prix de marché actuel de l'obligation.",
    en: "Believing a rating downgrade, hence a spread widening, only affects future cash flows and never the bond's current market price.",
  },
});

const cs01CalcTemplate: QuestionTemplate = {
  id: "m03-cs01-calcul-cs01",
  conceptId: "m03-cs01",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const spreadDuration = randomInt(rng, 3, 9);
    const value = randomInt(rng, 5, 30) * 1_000_000;
    const correctCs01 = Math.round(spreadDuration * value * 0.0001);
    const forgotScale = spreadDuration * value;
    const invertedFactor = Math.round(value / spreadDuration);
    const halvedCs01 = Math.round(correctCs01 / 2);

    return {
      isScenario: true,
      prompt: {
        fr: `Une position a une duration de spread de ${spreadDuration} et une valeur de marché de ${fmt(value, "fr")}. Quel est son CS01, par point de base ?`,
        en: `A position has a spread duration of ${spreadDuration} and a market value of ${fmt(value, "en")}. What is its CS01, per basis point?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmt(correctCs01, "fr")}, en multipliant duration de spread, valeur de marché et 0,0001`, en: `${fmt(correctCs01, "en")}, by multiplying spread duration, market value and 0.0001` } },
        { id: "forgot-scale", label: { fr: `${fmt(forgotScale, "fr")}, en oubliant de multiplier par 0,0001`, en: `${fmt(forgotScale, "en")}, forgetting to multiply by 0.0001` } },
        { id: "inverted", label: { fr: `${fmt(invertedFactor, "fr")}, en divisant la valeur de marché par la duration de spread au lieu de multiplier`, en: `${fmt(invertedFactor, "en")}, by dividing market value by spread duration instead of multiplying` } },
        { id: "halved", label: { fr: `${fmt(halvedCs01, "fr")}, en divisant le résultat correct par deux par erreur`, en: `${fmt(halvedCs01, "en")}, mistakenly dividing the correct result by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "CS01 ≈ Duration de spread × Valeur de marché × 0,0001.", en: "CS01 ≈ Spread duration × Market value × 0.0001." },
      explanation: {
        fr: `CS01 ≈ ${spreadDuration} × ${fmt(value, "fr")} × 0,0001 ≈ ${fmt(correctCs01, "fr")}. Oublier le facteur 0,0001 (qui convertit une variation de 1 en une variation d'1 point de base) est l'erreur la plus fréquente sur ce calcul.`,
        en: `CS01 ≈ ${spreadDuration} × ${fmt(value, "en")} × 0.0001 ≈ ${fmt(correctCs01, "en")}. Forgetting the 0.0001 factor (which converts a change of 1 into a change of 1 basis point) is the most frequent error on this calculation.`,
      },
      commonMistake: {
        fr: "Oublier de multiplier par 0,0001 pour convertir en sensibilité par point de base.",
        en: "Forgetting to multiply by 0.0001 to convert into a per-basis-point sensitivity.",
      },
    };
  },
};

const priceChangeFromCs01CalcTemplate: QuestionTemplate = {
  id: "m03-cs01-calcul-variation-prix",
  conceptId: "m03-cs01",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const cs01 = randomInt(rng, 2, 12) * 1000;
    const spreadChangeBp = randomInt(rng, 10, 60);
    const correctLoss = cs01 * spreadChangeBp;
    const wrongSign = -correctLoss;
    const forgotMultiply = cs01;
    const halved = Math.round(correctLoss / 2);

    return {
      isScenario: true,
      prompt: {
        fr: `Une position a un CS01 de ${fmt(cs01, "fr")} par point de base. Son spread de crédit s'élargit de ${spreadChangeBp} points de base. Quelle est la variation de valeur estimée de la position ?`,
        en: `A position has a CS01 of ${fmt(cs01, "en")} per basis point. Its credit spread widens by ${spreadChangeBp} basis points. What is the position's estimated value change?`,
      },
      choices: [
        { id: "correct", label: { fr: `−${fmt(correctLoss, "fr")}, en multipliant le CS01 par l'élargissement du spread, avec un signe négatif`, en: `−${fmt(correctLoss, "en")}, by multiplying CS01 by the spread widening, with a negative sign` } },
        { id: "wrong-sign", label: { fr: `+${fmt(correctLoss, "fr")}, en oubliant que le prix baisse quand le spread s'élargit`, en: `+${fmt(correctLoss, "en")}, forgetting the price falls when the spread widens` } },
        { id: "forgot-multiply", label: { fr: `−${fmt(forgotMultiply, "fr")}, en oubliant de multiplier le CS01 par l'ampleur de l'élargissement`, en: `−${fmt(forgotMultiply, "en")}, forgetting to multiply CS01 by the widening's size` } },
        { id: "halved", label: { fr: `−${fmt(halved, "fr")}, en divisant le résultat correct par deux par erreur`, en: `−${fmt(halved, "en")}, mistakenly dividing the correct result by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "ΔP ≈ −CS01 × Δspread (en points de base).", en: "ΔP ≈ −CS01 × Δspread (in basis points)." },
      explanation: {
        fr: `ΔP ≈ −${fmt(cs01, "fr")} × ${spreadChangeBp} ≈ −${fmt(correctLoss, "fr")}. Le signe négatif reflète la relation inverse entre spread de crédit et prix : un élargissement du spread fait toujours baisser le prix, toutes choses égales par ailleurs.`,
        en: `ΔP ≈ −${fmt(cs01, "en")} × ${spreadChangeBp} ≈ −${fmt(correctLoss, "en")}. The negative sign reflects the inverse relationship between the credit spread and the price: a spread widening always lowers the price, all else equal.`,
      },
      commonMistake: {
        fr: "Oublier le signe négatif de la formule, ce qui inverse le sens de la variation de valeur estimée.",
        en: "Forgetting the formula's negative sign, which flips the direction of the estimated value change.",
      },
    };
  },
};

const dv01OnlyMistakeTemplate = mcqTemplate({
  id: "m03-cs01-erreur-dv01-seul",
  conceptId: "m03-cs01",
  difficulty: "medium",
  prompt: {
    fr: "Laquelle de ces affirmations sur le suivi du risque d'un portefeuille d'obligations d'entreprise est correcte ?",
    en: "Which of these statements about tracking a corporate bond portfolio's risk is correct?",
  },
  choices: [
    { id: "need-both-dv01-cs01", label: { fr: "Suivre uniquement le DV01 ignore une part potentiellement importante du risque réellement porté, celle liée au spread de crédit", en: "Tracking only DV01 ignores a potentially significant part of the risk actually carried, the one tied to the credit spread" } },
    { id: "dv01-alone-sufficient", label: { fr: "Le DV01 seul suffit toujours à capturer l'intégralité du risque d'une obligation d'entreprise", en: "DV01 alone is always enough to capture a corporate bond's entire risk" } },
    { id: "cs01-irrelevant-for-bonds", label: { fr: "Le CS01 n'est pertinent que pour les CDS, jamais pour les obligations elles-mêmes", en: "CS01 is only relevant for CDS, never for bonds themselves" } },
    { id: "spread-risk-negligible-always", label: { fr: "Le risque de spread de crédit est toujours négligeable comparé au risque de taux", en: "Credit spread risk is always negligible compared to rate risk" } },
  ],
  correctId: "need-both-dv01-cs01",
  hint: { fr: "Une obligation d'entreprise porte DEUX facteurs de risque distincts, pas un seul.", en: "A corporate bond carries TWO distinct risk factors, not just one." },
  explanation: {
    fr: "Une obligation d'entreprise porte à la fois un risque de taux (DV01) et un risque de spread de crédit (CS01) : se limiter au seul DV01 ignore une part du risque réellement porté, qui peut être significative, en particulier pour des émetteurs de qualité de crédit moyenne ou faible. Le CS01 s'applique aussi bien aux obligations qu'aux CDS, et le risque de spread n'est pas systématiquement négligeable face au risque de taux.",
    en: "A corporate bond carries both rate risk (DV01) and credit spread risk (CS01): limiting oneself to DV01 alone ignores a part of the risk actually carried, which can be significant, particularly for medium or low credit quality issuers. CS01 applies to both bonds and CDS, and spread risk is not systematically negligible compared to rate risk.",
  },
  commonMistake: {
    fr: "Se limiter au suivi du DV01 pour un portefeuille d'obligations d'entreprise, en sous-estimant la part du risque liée au spread de crédit.",
    en: "Limiting oneself to tracking DV01 for a corporate bond portfolio, underestimating the share of risk tied to the credit spread.",
  },
});

const cdsHedgeScenarioTemplate = mcqTemplate({
  id: "m03-cs01-scenario-couverture-cds",
  conceptId: "m03-cs01",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un desk crédit détient une obligation d'entreprise et souhaite neutraliser son exposition au spread de crédit, sans modifier son exposition au taux sans risque. Quelle démarche est la plus cohérente ?",
    en: "A credit desk holds a corporate bond and wants to neutralize its credit spread exposure, without changing its risk-free rate exposure. What approach is most consistent?",
  },
  choices: [
    { id: "buy-cds-matching-cs01", label: { fr: "Acheter une protection CDS sur le même émetteur, avec un notionnel dimensionné pour que le CS01 du CDS compense celui de l'obligation", en: "Buy CDS protection on the same issuer, with a notional sized so the CDS's CS01 offsets the bond's" } },
    { id: "sell-the-bond", label: { fr: "Vendre entièrement l'obligation, ce qui neutralise le CS01 mais aussi tout le DV01 par la même occasion", en: "Fully sell the bond, which neutralizes CS01 but also all of the DV01 at the same time" } },
    { id: "enter-rate-swap-only", label: { fr: "Conclure un swap de taux d'intérêt, un instrument qui neutralise spécifiquement le risque de spread de crédit", en: "Enter an interest rate swap, an instrument that specifically neutralizes credit spread risk" } },
    { id: "do-nothing-cs01-not-hedgeable", label: { fr: "Ne rien faire, le CS01 n'étant par nature pas un risque que l'on puisse couvrir séparément", en: "Do nothing, since CS01 is by nature not a risk that can be hedged separately" } },
  ],
  correctId: "buy-cds-matching-cs01",
  hint: { fr: "Le desk veut neutraliser UNIQUEMENT le CS01, en conservant le DV01 : quel instrument cible spécifiquement le spread de crédit ?", en: "The desk wants to neutralize ONLY the CS01, keeping the DV01: which instrument specifically targets the credit spread?" },
  explanation: {
    fr: "Un CDS est précisément l'instrument qui cible le risque de spread de crédit sans affecter l'exposition au taux sans risque : dimensionner son notionnel pour que son CS01 compense celui de l'obligation neutralise le risque de crédit, tout en conservant l'exposition au taux — contrairement à la vente de l'obligation (qui neutralise les deux risques à la fois) ou à un swap de taux (qui cible le DV01, pas le CS01).",
    en: "A CDS is precisely the instrument targeting credit spread risk without affecting risk-free rate exposure: sizing its notional so its CS01 offsets the bond's neutralizes credit risk, while keeping rate exposure — unlike selling the bond (which neutralizes both risks at once) or a rate swap (which targets DV01, not CS01).",
  },
  commonMistake: {
    fr: "Utiliser un instrument (vente de l'obligation, swap de taux) qui neutralise à la fois DV01 et CS01, ou le mauvais des deux, alors que l'objectif est de neutraliser spécifiquement le CS01 seul.",
    en: "Using an instrument (selling the bond, a rate swap) that neutralizes both DV01 and CS01, or the wrong one of the two, when the goal is to specifically neutralize CS01 alone.",
  },
});

const cdsBondBasisScenarioTemplate = mcqTemplate({
  id: "m03-cs01-scenario-base-cds-obligataire",
  conceptId: "m03-cs01",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un analyste compare le spread CDS d'un émetteur au spread implicite déduit du prix de son obligation de maturité comparable, et constate un écart persistant entre les deux. Comment qualifier cet écart ?",
    en: "An analyst compares an issuer's CDS spread to the spread implied by the price of a comparable-maturity bond, and finds a persistent gap between the two. How is this gap described?",
  },
  choices: [
    { id: "cds-bond-basis", label: { fr: "La base CDS-obligataire, qui reflète des frictions réelles de marché (financement, liquidité relative, différences contractuelles)", en: "The CDS-bond basis, which reflects real market frictions (funding, relative liquidity, contractual differences)" } },
    { id: "calculation-error", label: { fr: "Nécessairement une erreur de calcul de l'un des deux spreads", en: "Necessarily a calculation error in one of the two spreads" } },
    { id: "impossible-scenario", label: { fr: "Un scénario impossible : les deux spreads doivent toujours être rigoureusement identiques", en: "An impossible scenario: the two spreads must always be strictly identical" } },
    { id: "regulatory-anomaly-to-report", label: { fr: "Une anomalie réglementaire qui doit systématiquement être signalée au régulateur", en: "A regulatory anomaly that must systematically be reported to the regulator" } },
  ],
  correctId: "cds-bond-basis",
  hint: { fr: "Ce phénomène a un nom précis en finance de marché, et n'est pas une anomalie ni une erreur.", en: "This phenomenon has a precise name in market finance, and is neither an anomaly nor an error." },
  explanation: {
    fr: "Cet écart persistant, appelé base CDS-obligataire (CDS-bond basis), est un phénomène de marché bien documenté et non une erreur : il reflète des frictions réelles entre les deux marchés (coût de financement, liquidité relative, différences contractuelles entre un CDS et une obligation) — des stratégies de trading dédiées cherchent précisément à exploiter les variations de cette base plutôt qu'à la considérer comme une anomalie à corriger.",
    en: "This persistent gap, called the CDS-bond basis, is a well-documented market phenomenon, not an error: it reflects real frictions between the two markets (funding cost, relative liquidity, contractual differences between a CDS and a bond) — dedicated trading strategies specifically aim to exploit this basis's variations rather than treat it as an anomaly to correct.",
  },
  commonMistake: {
    fr: "Supposer que le spread CDS et le spread implicite par le prix obligataire doivent toujours être rigoureusement identiques, en l'absence de toute friction de marché.",
    en: "Assuming the CDS spread and the bond-implied spread must always be strictly identical, absent any market friction.",
  },
});

const separateLimitsScenarioTemplate = mcqTemplate({
  id: "m03-cs01-scenario-limites-separees",
  conceptId: "m03-cs01",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le risk manager d'un desk crédit fixe deux limites de risque distinctes pour le même portefeuille : une limite en DV01 et une limite en CS01. Pourquoi ne pas se contenter d'une seule limite globale ?",
    en: "A credit desk's risk manager sets two distinct risk limits for the same portfolio: a DV01 limit and a CS01 limit. Why not settle for a single global limit?",
  },
  choices: [
    { id: "independent-factors-need-separate-caps", label: { fr: "DV01 et CS01 sont deux facteurs de risque indépendants, qui doivent chacun être plafonnés séparément pour être réellement maîtrisés", en: "DV01 and CS01 are two independent risk factors, each needing to be separately capped to be genuinely controlled" } },
    { id: "regulatory-formality-only", label: { fr: "Il s'agit d'une simple formalité réglementaire, sans réelle justification de gestion des risques", en: "It's a mere regulatory formality, with no real risk management justification" } },
    { id: "single-limit-always-better", label: { fr: "Une limite globale unique serait toujours préférable et plus simple à surveiller", en: "A single global limit would always be preferable and simpler to monitor" } },
    { id: "cs01-limit-never-binding", label: { fr: "La limite en CS01 n'est en pratique jamais contraignante, seule la limite en DV01 comptant réellement", en: "The CS01 limit is in practice never binding, only the DV01 limit really mattering" } },
  ],
  correctId: "independent-factors-need-separate-caps",
  hint: { fr: "Un portefeuille peut respecter une limite globale tout en étant excessivement exposé à un seul des deux facteurs.", en: "A portfolio could meet a global limit while being excessively exposed to just one of the two factors." },
  explanation: {
    fr: "Parce que DV01 et CS01 mesurent deux facteurs de risque indépendants, une seule limite globale (par exemple un chiffre agrégé mêlant les deux) pourrait être respectée tout en masquant une concentration excessive sur l'un des deux risques : fixer des limites séparées garantit qu'aucun des deux facteurs, pris isolément, ne dépasse le niveau de risque toléré — une pratique standard sur un desk crédit.",
    en: "Because DV01 and CS01 measure independent risk factors, a single global limit (e.g. an aggregated figure blending both) could be met while masking excessive concentration in one of the two risks: setting separate limits ensures neither factor, taken alone, exceeds the tolerated risk level — a standard practice on a credit desk.",
  },
  commonMistake: {
    fr: "Croire qu'une limite de risque globale unique suffit à maîtriser deux facteurs de risque indépendants comme le DV01 et le CS01.",
    en: "Believing a single global risk limit is enough to control two independent risk factors like DV01 and CS01.",
  },
});

const callableBondSpreadDurationMistakeTemplate = mcqTemplate({
  id: "m03-cs01-erreur-obligation-callable",
  conceptId: "m03-cs01",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un analyste calcule le CS01 d'une obligation callable (remboursable par anticipation) en utilisant directement sa duration classique comme duration de spread, sans ajustement. Que risque-t-il ?",
    en: "An analyst computes a callable bond's CS01 using its classic duration directly as the spread duration, with no adjustment. What is the risk?",
  },
  choices: [
    { id: "callable-duration-diverges", label: { fr: "Une estimation biaisée du CS01, car la duration de spread d'une obligation à option intégrée peut s'écarter sensiblement de sa duration classique", en: "A biased CS01 estimate, because the spread duration of a bond with an embedded option can diverge meaningfully from its classic duration" } },
    { id: "always-exact-for-any-bond", label: { fr: "Aucun risque : la duration classique est toujours rigoureusement égale à la duration de spread, y compris pour les obligations callable", en: "No risk at all: classic duration is always strictly equal to spread duration, including for callable bonds" } },
    { id: "cs01-becomes-undefined", label: { fr: "Le CS01 devient par définition impossible à calculer dès qu'une obligation comporte une option de remboursement anticipé", en: "CS01 becomes by definition impossible to compute as soon as a bond has a call option" } },
    { id: "only-affects-dv01-not-cs01", label: { fr: "Cela n'affecte que le calcul du DV01, jamais celui du CS01, qui reste toujours exact", en: "This only affects the DV01 calculation, never the CS01 one, which always stays exact" } },
  ],
  correctId: "callable-duration-diverges",
  hint: { fr: "L'hypothèse \"duration de spread ≈ duration classique\" est une approximation, pas une identité exacte, en particulier avec une option intégrée.", en: "The \"spread duration ≈ classic duration\" assumption is an approximation, not an exact identity, especially with an embedded option." },
  explanation: {
    fr: "Pour une obligation simple sans option, la duration de spread est généralement proche de la duration classique, mais ce n'est qu'une approximation : pour une obligation callable, l'option de remboursement anticipé modifie la sensibilité réelle du prix au spread, et assimiler les deux durations sans ajustement peut produire un CS01 significativement biaisé, sous-estimant ou surestimant le risque de spread réellement porté.",
    en: "For a simple bond without an option, spread duration is generally close to classic duration, but this is only an approximation: for a callable bond, the call option changes the price's real sensitivity to the spread, and equating the two durations without adjustment can produce a significantly biased CS01, under- or overestimating the actual spread risk carried.",
  },
  commonMistake: {
    fr: "Traiter l'approximation \"duration de spread ≈ duration classique\" comme une égalité exacte valable pour toute obligation, y compris celles avec option intégrée.",
    en: "Treating the \"spread duration ≈ classic duration\" approximation as an exact equality valid for any bond, including those with embedded options.",
  },
});

const pnlAttributionScenarioTemplate = mcqTemplate({
  id: "m03-cs01-scenario-attribution-pnl",
  conceptId: "m03-cs01",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un gérant obligataire constate une perte sur sa position et veut savoir si elle provient d'un mouvement de taux ou d'une dégradation de la qualité de crédit de l'émetteur. Quelle démarche répond à cette question ?",
    en: "A bond manager observes a loss on a position and wants to know whether it stems from a rate move or a deterioration in the issuer's credit quality. What approach answers this question?",
  },
  choices: [
    { id: "decompose-dv01-cs01-contributions", label: { fr: "Décomposer la variation de prix observée en une contribution DV01 × Δtaux et une contribution CS01 × Δspread, mesurées séparément", en: "Decompose the observed price change into a DV01 × Δrate contribution and a CS01 × Δspread contribution, measured separately" } },
    { id: "look-at-total-pnl-only", label: { fr: "Se contenter du P&L total de la position, cette distinction n'ayant aucune utilité pratique pour la gestion du portefeuille", en: "Settle for the position's total P&L, this distinction having no practical use for portfolio management" } },
    { id: "assume-always-rate-driven", label: { fr: "Supposer par défaut que toute perte sur une obligation d'entreprise provient nécessairement d'un mouvement de taux", en: "Assume by default that any loss on a corporate bond necessarily comes from a rate move" } },
    { id: "assume-always-credit-driven", label: { fr: "Supposer par défaut que toute perte sur une obligation d'entreprise provient nécessairement d'une dégradation de crédit", en: "Assume by default that any loss on a corporate bond necessarily comes from a credit deterioration" } },
  ],
  correctId: "decompose-dv01-cs01-contributions",
  hint: { fr: "La question porte sur l'ORIGINE de la perte : quel outil permet de séparer les deux facteurs de risque en jeu ?", en: "The question is about the ORIGIN of the loss: what tool lets you separate the two risk factors involved?" },
  explanation: {
    fr: "Décomposer la variation de prix en une contribution liée au taux (DV01 × Δtaux) et une contribution liée au spread (CS01 × Δspread) permet d'attribuer précisément l'origine de la perte, sans quoi le gérant ne peut ni comprendre la source réelle du risque matérialisé, ni ajuster sa couverture en conséquence — un P&L total agrégé masque cette information essentielle.",
    en: "Decomposing the price change into a rate-linked contribution (DV01 × Δrate) and a spread-linked contribution (CS01 × Δspread) lets the manager precisely attribute the loss's origin, without which they can neither understand the real source of the materialized risk, nor adjust their hedge accordingly — an aggregated total P&L hides this essential information.",
  },
  commonMistake: {
    fr: "Analyser le P&L d'une position obligataire sans décomposer les contributions respectives du taux et du spread, ce qui empêche d'identifier l'origine réelle d'une perte.",
    en: "Analyzing a bond position's P&L without decomposing the respective rate and spread contributions, which prevents identifying a loss's real origin.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  cs01VsDv01ComparisonTemplate,
  flightToQualityWhatIfTemplate,
  spreadWidensWhatIfTemplate,
  cs01CalcTemplate,
  priceChangeFromCs01CalcTemplate,
  dv01OnlyMistakeTemplate,
  cdsHedgeScenarioTemplate,
  cdsBondBasisScenarioTemplate,
  separateLimitsScenarioTemplate,
  callableBondSpreadDurationMistakeTemplate,
  pnlAttributionScenarioTemplate,
];
