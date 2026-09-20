import { randomInt, pick, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate } from "@/lib/question-template-kit";

function fmtPct(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + "%";
}

const comprehensionTemplate = mcqTemplate({
  id: "m03-carry-roll-down-comprehension",
  conceptId: "m03-carry-roll-down",
  difficulty: "medium",
  prompt: {
    fr: "Que représentent conjointement le carry et le roll-down d'une position obligataire ?",
    en: "What do a bond position's carry and roll-down jointly represent?",
  },
  choices: [
    { id: "gain-if-curve-unchanged", label: { fr: "Le gain (ou la perte) de la position si la courbe des taux reste parfaitement inchangée pendant la période de détention", en: "The position's gain (or loss) if the yield curve stays perfectly unchanged over the holding period" } },
    { id: "gain-from-rate-move", label: { fr: "Le gain (ou la perte) résultant uniquement d'un mouvement effectif des taux d'intérêt", en: "The gain (or loss) resulting only from an actual interest rate move" } },
    { id: "credit-spread-compensation", label: { fr: "La compensation reçue pour le risque de crédit spécifique de l'émetteur", en: "The compensation received for the issuer's specific credit risk" } },
    { id: "coupon-reinvestment-risk", label: { fr: "Le risque de réinvestissement des coupons futurs à un taux inconnu", en: "The reinvestment risk of future coupons at an unknown rate" } },
  ],
  correctId: "gain-if-curve-unchanged",
  hint: { fr: "Ces deux composantes existent même si aucun taux ne bouge : c'est précisément ce qui les distingue d'un pari directionnel.", en: "These two components exist even if no rate moves at all: that's precisely what distinguishes them from a directional bet." },
  explanation: {
    fr: "Carry et roll-down mesurent ensemble le gain (ou la perte) d'une position obligataire SI la courbe des taux ne bouge pas du tout : ce ne sont donc ni un gain lié à un mouvement de taux effectif, ni une mesure de risque de crédit ou de réinvestissement, mais bien les deux sources de rendement \"garanties\" sous l'hypothèse d'une courbe stable.",
    en: "Carry and roll-down together measure a bond position's gain (or loss) IF the yield curve doesn't move at all: they are therefore neither a gain tied to an actual rate move, nor a measure of credit or reinvestment risk, but the two \"guaranteed\" sources of return under the assumption of a stable curve.",
  },
  commonMistake: {
    fr: "Confondre le carry-plus-roll-down avec un gain lié à un mouvement de taux, alors qu'il est défini précisément SOUS l'hypothèse d'absence de mouvement.",
    en: "Confusing carry-plus-roll-down with a gain tied to a rate move, when it is defined precisely UNDER the assumption of no move.",
  },
});

const carryVsRollDownComparisonTemplate = mcqTemplate({
  id: "m03-carry-roll-down-comparaison-carry-rolldown",
  conceptId: "m03-carry-roll-down",
  difficulty: "medium",
  prompt: {
    fr: "En quoi le carry et le roll-down diffèrent-ils fondamentalement l'un de l'autre ?",
    en: "How do carry and roll-down fundamentally differ from each other?",
  },
  choices: [
    { id: "carry-cashflow-rolldown-price", label: { fr: "Le carry provient d'un flux de trésorerie net perçu (coupon moins financement), le roll-down d'un effet de prix lié au glissement le long de la courbe", en: "Carry comes from a net cash flow received (coupon minus funding), roll-down from a price effect tied to sliding along the curve" } },
    { id: "identical-concepts-different-names", label: { fr: "Ce sont deux noms différents pour exactement le même phénomène économique", en: "These are two different names for exactly the same economic phenomenon" } },
    { id: "carry-only-negative-rolldown-only-positive", label: { fr: "Le carry est toujours négatif tandis que le roll-down est toujours positif, par construction", en: "Carry is always negative while roll-down is always positive, by construction" } },
    { id: "rolldown-requires-rate-move", label: { fr: "Le roll-down, contrairement au carry, nécessite un mouvement effectif des taux pour exister", en: "Roll-down, unlike carry, requires an actual rate move to exist" } },
  ],
  correctId: "carry-cashflow-rolldown-price",
  hint: { fr: "L'un est un flux de trésorerie perçu, l'autre un effet de prix — tous deux sous l'hypothèse de courbe inchangée.", en: "One is a cash flow received, the other a price effect — both under the unchanged-curve assumption." },
  explanation: {
    fr: "Le carry est un flux de trésorerie net (coupon perçu moins coût de financement), tandis que le roll-down est un effet de PRIX résultant du glissement de l'obligation vers une maturité plus courte sur une courbe supposée inchangée. Les deux peuvent être positifs ou négatifs selon la forme de la courbe et le niveau de financement, et aucun des deux ne nécessite un mouvement effectif des taux — au contraire, ils sont définis précisément en l'absence d'un tel mouvement.",
    en: "Carry is a net cash flow (coupon received minus funding cost), while roll-down is a PRICE effect resulting from the bond sliding toward a shorter maturity on an assumed-unchanged curve. Both can be positive or negative depending on the curve's shape and the funding level, and neither requires an actual rate move — on the contrary, they are defined precisely in the absence of such a move.",
  },
  commonMistake: {
    fr: "Croire que le roll-down nécessite un mouvement de taux pour exister, alors qu'il provient au contraire du glissement sur une courbe supposée inchangée.",
    en: "Believing roll-down requires a rate move to exist, when it actually comes from sliding along an assumed-unchanged curve.",
  },
});

const invertedCurveWhatIfTemplate = mcqTemplate({
  id: "m03-carry-roll-down-what-if-courbe-inversee",
  conceptId: "m03-carry-roll-down",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "La courbe des taux est inversée : les taux courts sont supérieurs aux taux longs. Un investisseur détient une obligation longue financée à court terme via le repo. Quel est l'effet probable sur son carry ?",
    en: "The yield curve is inverted: short rates exceed long rates. An investor holds a long bond funded short-term via repo. What is the likely effect on their carry?",
  },
  choices: [
    { id: "negative-carry-likely", label: { fr: "Le carry devient probablement négatif, le coût de financement à court terme dépassant le rendement de l'obligation longue", en: "Carry probably turns negative, the short-term funding cost exceeding the long bond's yield" } },
    { id: "carry-always-positive", label: { fr: "Le carry reste nécessairement positif, quelle que soit la forme de la courbe des taux", en: "Carry necessarily stays positive, whatever the yield curve's shape" } },
    { id: "carry-undefined-inverted", label: { fr: "Le carry devient par définition impossible à calculer lorsque la courbe est inversée", en: "Carry becomes by definition impossible to compute when the curve is inverted" } },
    { id: "carry-unaffected-by-curve-shape", label: { fr: "Le carry ne dépend jamais de la forme de la courbe, uniquement du niveau absolu des taux", en: "Carry never depends on the curve's shape, only on the absolute level of rates" } },
  ],
  correctId: "negative-carry-likely",
  hint: { fr: "Carry ≈ rendement de l'obligation moins taux de financement court terme : que se passe-t-il si ce dernier est plus élevé ?", en: "Carry ≈ bond yield minus short-term funding rate: what happens if the latter is higher?" },
  explanation: {
    fr: "Sur une courbe inversée, le taux de financement à court terme (proche du taux court) peut dépasser le rendement de l'obligation longue détenue : le carry, défini comme rendement moins coût de financement, devient alors négatif — détenir la position coûte de l'argent même si aucun taux ne bouge, contrairement à la situation habituelle sur une courbe croissante.",
    en: "On an inverted curve, the short-term funding rate (close to the short rate) can exceed the held long bond's yield: carry, defined as yield minus funding cost, then turns negative — holding the position costs money even if no rate moves, unlike the usual situation on an upward-sloping curve.",
  },
  commonMistake: {
    fr: "Supposer que le carry est toujours positif pour une position obligataire longue, en ignorant l'effet d'une courbe des taux inversée.",
    en: "Assuming carry is always positive for a long bond position, ignoring the effect of an inverted yield curve.",
  },
});

const steepCurveWhatIfTemplate = mcqTemplate({
  id: "m03-carry-roll-down-what-if-courbe-pentue",
  conceptId: "m03-carry-roll-down",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "La courbe des taux devient nettement plus pentue sur le segment 5-10 ans (l'écart de rendement entre les deux maturités augmente). Quel est l'effet probable sur le roll-down d'une obligation à 10 ans détenue un an ?",
    en: "The yield curve becomes noticeably steeper on the 5-10 year segment (the yield gap between the two maturities widens). What is the likely effect on a held 10-year bond's one-year roll-down?",
  },
  choices: [
    { id: "rolldown-increases", label: { fr: "Le roll-down augmente : un écart de rendement plus large entre les maturités voisines accentue le gain de prix lié au glissement le long de la courbe", en: "Roll-down increases: a wider yield gap between neighboring maturities amplifies the price gain from sliding along the curve" } },
    { id: "rolldown-unaffected-by-steepness", label: { fr: "Le roll-down reste inchangé, sa valeur ne dépendant jamais de la pente de la courbe", en: "Roll-down stays unchanged, its value never depending on the curve's steepness" } },
    { id: "rolldown-becomes-negative", label: { fr: "Le roll-down devient nécessairement négatif dès que la courbe se pentifie sur un segment quelconque", en: "Roll-down necessarily turns negative as soon as the curve steepens on any segment" } },
    { id: "only-carry-affected-not-rolldown", label: { fr: "Seul le carry est affecté par ce changement, jamais le roll-down", en: "Only carry is affected by this change, never roll-down" } },
  ],
  correctId: "rolldown-increases",
  hint: { fr: "Le roll-down dépend de l'écart de rendement entre la maturité actuelle et la maturité réduite après un an : que se passe-t-il si cet écart s'élargit ?", en: "Roll-down depends on the yield gap between the current and the shortened maturity after one year: what happens if that gap widens?" },
  explanation: {
    fr: "Le roll-down est directement proportionnel à l'écart de rendement entre la maturité initiale et la maturité réduite après la période de détention : une courbe plus pentue sur ce segment élargit précisément cet écart, ce qui accentue le gain de prix lié au glissement, donc augmente le roll-down — un effet qui concerne spécifiquement le roll-down, indépendamment du carry qui dépend, lui, du niveau des taux courts de financement.",
    en: "Roll-down is directly proportional to the yield gap between the initial and the shortened maturity after the holding period: a steeper curve on this segment precisely widens this gap, amplifying the price gain from sliding, hence increasing roll-down — an effect specific to roll-down, independent of carry, which instead depends on the level of short funding rates.",
  },
  commonMistake: {
    fr: "Croire que le roll-down est indépendant de la forme de la courbe, alors qu'il dépend directement de l'écart de rendement entre maturités voisines.",
    en: "Believing roll-down is independent of the curve's shape, when it directly depends on the yield gap between neighboring maturities.",
  },
});

const carryCalcTemplate: QuestionTemplate = {
  id: "m03-carry-roll-down-calcul-carry",
  conceptId: "m03-carry-roll-down",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const yieldPct = randomInt(rng, 30, 55) / 10;
    const repoPct = randomInt(rng, 15, 45) / 10;
    const correctCarry = Math.round((yieldPct - repoPct) * 100) / 100;
    const wrongSum = Math.round((yieldPct + repoPct) * 100) / 100;
    const wrongInverted = Math.round((repoPct - yieldPct) * 100) / 100;
    const wrongYieldOnly = yieldPct;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation offre un rendement de ${fmtPct(yieldPct, "fr", 1)}, financée sur le marché repo à ${fmtPct(repoPct, "fr", 1)}. Quel est le carry approximatif sur un an ?`,
        en: `A bond yields ${fmtPct(yieldPct, "en", 1)}, funded in the repo market at ${fmtPct(repoPct, "en", 1)}. What is the approximate one-year carry?`,
      },
      choices: [
        { id: "correct", label: { fr: `${fmtPct(correctCarry, "fr")}, en soustrayant le taux de financement repo du rendement de l'obligation`, en: `${fmtPct(correctCarry, "en")}, by subtracting the repo funding rate from the bond's yield` } },
        { id: "wrong-sum", label: { fr: `${fmtPct(wrongSum, "fr")}, en additionnant à tort le rendement et le taux de financement au lieu de les soustraire`, en: `${fmtPct(wrongSum, "en")}, by wrongly adding the yield and the funding rate instead of subtracting them` } },
        { id: "wrong-inverted", label: { fr: `${fmtPct(wrongInverted, "fr")}, en inversant l'ordre de la soustraction`, en: `${fmtPct(wrongInverted, "en")}, by inverting the subtraction's order` } },
        { id: "wrong-yield-only", label: { fr: `${fmtPct(wrongYieldOnly, "fr")}, en ignorant totalement le coût de financement repo`, en: `${fmtPct(wrongYieldOnly, "en")}, by fully ignoring the repo funding cost` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Carry ≈ rendement de l'obligation moins taux de financement repo.", en: "Carry ≈ bond yield minus repo funding rate." },
      explanation: {
        fr: `Carry ≈ ${fmtPct(yieldPct, "fr", 1)} − ${fmtPct(repoPct, "fr", 1)} = ${fmtPct(correctCarry, "fr")}. Ignorer le coût de financement, ou inverser l'ordre de la soustraction, sont les erreurs les plus fréquentes sur ce calcul : le carry est net du coût réel de portage de la position, pas seulement le rendement brut de l'obligation.`,
        en: `Carry ≈ ${fmtPct(yieldPct, "en", 1)} − ${fmtPct(repoPct, "en", 1)} = ${fmtPct(correctCarry, "en")}. Ignoring the funding cost, or inverting the subtraction's order, are the most frequent errors on this calculation: carry is net of the position's real carrying cost, not just the bond's gross yield.`,
      },
      commonMistake: {
        fr: "Confondre le rendement brut de l'obligation avec le carry, en oubliant de soustraire le coût de financement de la position.",
        en: "Confusing the bond's gross yield with carry, forgetting to subtract the position's funding cost.",
      },
    };
  },
};

const rollDownCalcTemplate: QuestionTemplate = {
  id: "m03-carry-roll-down-calcul-rolldown",
  conceptId: "m03-carry-roll-down",
  kind: "mcq",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const duration = randomInt(rng, 4, 9);
    const yieldGapBp = pick(rng, [10, 15, 20, 25] as const);
    const correctRollDown = Math.round(duration * yieldGapBp * 100) / 100;
    const wrongSign = -correctRollDown;
    const wrongNoDuration = yieldGapBp;
    const wrongHalved = Math.round(correctRollDown / 2 * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation a une duration modifiée de ${duration}. Sur la courbe actuelle (inchangée), sa maturité réduite après un an offre un rendement inférieur de ${yieldGapBp} points de base à son rendement actuel. Quel est le roll-down approximatif, en points de base de prix ?`,
        en: `A bond has a modified duration of ${duration}. On the current (unchanged) curve, its shortened maturity after one year offers a yield ${yieldGapBp} basis points lower than its current yield. What is the approximate roll-down, in price basis points?`,
      },
      choices: [
        { id: "correct", label: { fr: `+${fmtPct(correctRollDown, "fr", 0).replace("%", "")} points de base, en multipliant la duration par l'écart de rendement favorable`, en: `+${fmtPct(correctRollDown, "en", 0).replace("%", "")} basis points, by multiplying duration by the favorable yield gap` } },
        { id: "wrong-sign", label: { fr: `−${fmtPct(Math.abs(wrongSign), "fr", 0).replace("%", "")} points de base, en inversant le signe du roll-down`, en: `−${fmtPct(Math.abs(wrongSign), "en", 0).replace("%", "")} basis points, by flipping the roll-down's sign` } },
        { id: "wrong-no-duration", label: { fr: `+${fmtPct(wrongNoDuration, "fr", 0).replace("%", "")} points de base, en oubliant de multiplier par la duration`, en: `+${fmtPct(wrongNoDuration, "en", 0).replace("%", "")} basis points, by forgetting to multiply by duration` } },
        { id: "wrong-halved", label: { fr: `+${fmtPct(wrongHalved, "fr", 0).replace("%", "")} points de base, en divisant le résultat correct par deux par erreur`, en: `+${fmtPct(wrongHalved, "en", 0).replace("%", "")} basis points, mistakenly dividing the correct result by two` } },
      ],
      correctChoiceIds: ["correct"],
      hint: { fr: "Roll-down ≈ Duration × écart de rendement favorable dû au raccourcissement de maturité.", en: "Roll-down ≈ Duration × favorable yield gap from the maturity shortening." },
      explanation: {
        fr: `Roll-down ≈ ${duration} × ${yieldGapBp}pb ≈ +${correctRollDown}pb de prix. Le rendement inférieur sur la maturité réduite est FAVORABLE au prix (rendement et prix varient en sens inverse), d'où un roll-down positif ; oublier de multiplier par la duration sous-estime fortement l'effet de prix réel.`,
        en: `Roll-down ≈ ${duration} × ${yieldGapBp}bp ≈ +${correctRollDown}bp of price. The lower yield on the shortened maturity is FAVORABLE to the price (yield and price move oppositely), hence a positive roll-down; forgetting to multiply by duration strongly underestimates the actual price effect.`,
      },
      commonMistake: {
        fr: "Oublier de multiplier l'écart de rendement par la duration, ce qui sous-estime fortement l'effet de prix réel du roll-down.",
        en: "Forgetting to multiply the yield gap by duration, which strongly underestimates roll-down's actual price effect.",
      },
    };
  },
};

const zeroRateMoveMistakeTemplate = mcqTemplate({
  id: "m03-carry-roll-down-erreur-taux-inchanges",
  conceptId: "m03-carry-roll-down",
  difficulty: "medium",
  prompt: {
    fr: "Un trader observe qu'une position obligataire a réalisé un gain sur trois mois, alors que la courbe des taux n'a quasiment pas bougé sur cette période. Quelle conclusion est correcte ?",
    en: "A trader observes a bond position realized a gain over three months, while the yield curve barely moved over that period. What conclusion is correct?",
  },
  choices: [
    { id: "gain-from-carry-rolldown", label: { fr: "Ce gain provient très probablement du carry et du roll-down, les deux sources de rendement qui n'exigent aucun mouvement de taux", en: "This gain most likely comes from carry and roll-down, the two sources of return requiring no rate move" } },
    { id: "impossible-without-rate-move", label: { fr: "Ce gain est impossible sans mouvement de taux : il doit nécessairement provenir d'une erreur de valorisation", en: "This gain is impossible without a rate move: it must necessarily stem from a valuation error" } },
    { id: "must-be-credit-spread-tightening", label: { fr: "Ce gain provient nécessairement d'un resserrement du spread de crédit, la seule explication possible en l'absence de mouvement de taux", en: "This gain necessarily comes from a credit spread tightening, the only possible explanation absent a rate move" } },
    { id: "coupon-alone-explains-everything", label: { fr: "Ce gain s'explique uniquement par le versement du coupon, sans lien avec la position de l'obligation sur la courbe", en: "This gain is explained only by the coupon payment, unrelated to the bond's position on the curve" } },
  ],
  correctId: "gain-from-carry-rolldown",
  hint: { fr: "Le carry et le roll-down sont PRÉCISÉMENT les sources de gain qui existent même sans aucun mouvement de taux.", en: "Carry and roll-down are PRECISELY the sources of gain that exist even with no rate move at all." },
  explanation: {
    fr: "Un gain réalisé alors que la courbe des taux n'a quasiment pas bougé s'explique très probablement par le carry (coupon net du financement) et le roll-down (glissement favorable le long de la courbe), les deux composantes de rendement qui ne nécessitent aucun mouvement de taux pour exister — ce n'est ni une anomalie, ni nécessairement lié au crédit, et le coupon seul ne capture pas l'effet de prix du roll-down.",
    en: "A gain realized while the yield curve barely moved is most likely explained by carry (coupon net of funding) and roll-down (favorable sliding along the curve), the two return components requiring no rate move to exist — it is neither an anomaly nor necessarily credit-related, and the coupon alone doesn't capture roll-down's price effect.",
  },
  commonMistake: {
    fr: "Croire qu'un gain obligataire ne peut provenir que d'un mouvement de taux favorable, en ignorant les composantes carry et roll-down.",
    en: "Believing a bond gain can only come from a favorable rate move, ignoring the carry and roll-down components.",
  },
});

const sameDv01DifferentCarryScenarioTemplate = mcqTemplate({
  id: "m03-carry-roll-down-scenario-meme-dv01",
  conceptId: "m03-carry-roll-down",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un gérant compare deux obligations offrant exactement le même DV01, mais des profils de carry-plus-roll-down très différents. Sur quel critère devrait-il privilégier l'une par rapport à l'autre, à pari directionnel sur les taux identique ?",
    en: "A manager compares two bonds offering exactly the same DV01, but very different carry-plus-roll-down profiles. On what basis should they favor one over the other, given an identical directional rate bet?",
  },
  choices: [
    { id: "prefer-higher-carry-rolldown", label: { fr: "Privilégier celle offrant le carry-plus-roll-down le plus élevé, ce rendement étant obtenu même si les taux ne bougent pas", en: "Favor the one offering the highest carry-plus-roll-down, since that return is earned even if rates don't move" } },
    { id: "dv01-equal-means-indifferent", label: { fr: "Rester indifférent entre les deux, un DV01 identique impliquant nécessairement un rendement total identique", en: "Stay indifferent between the two, an identical DV01 necessarily implying an identical total return" } },
    { id: "prefer-lower-carry-rolldown", label: { fr: "Privilégier systématiquement celle offrant le carry-plus-roll-down le plus faible, par prudence", en: "Systematically favor the one offering the lowest carry-plus-roll-down, out of caution" } },
    { id: "carry-rolldown-irrelevant-to-choice", label: { fr: "Ignorer totalement le carry-plus-roll-down dans ce choix, seul le DV01 étant pertinent pour un gérant obligataire", en: "Fully ignore carry-plus-roll-down in this choice, only DV01 being relevant for a bond manager" } },
  ],
  correctId: "prefer-higher-carry-rolldown",
  hint: { fr: "À DV01 identique (même sensibilité aux taux), quelle composante RESTE pour départager les deux obligations ?", en: "With identical DV01 (same rate sensitivity), what component is LEFT to distinguish the two bonds?" },
  explanation: {
    fr: "À DV01 identique, les deux obligations réagissent de la même façon à un mouvement de taux donné : le seul critère qui les distingue alors est le rendement obtenu SI les taux ne bougent pas, c'est-à-dire le carry-plus-roll-down — privilégier la position qui l'offre le plus élevé maximise le rendement sans changer le profil de risque de taux, une pratique standard de sélection sur un desk obligataire.",
    en: "With identical DV01, both bonds react the same way to a given rate move: the only criterion distinguishing them is then the return earned IF rates don't move, i.e. carry-plus-roll-down — favoring the position offering the highest one maximizes return without changing the rate risk profile, a standard selection practice on a bond desk.",
  },
  commonMistake: {
    fr: "Considérer que deux obligations au même DV01 offrent nécessairement le même rendement total, en ignorant leurs profils de carry-plus-roll-down potentiellement très différents.",
    en: "Considering two bonds with the same DV01 necessarily offer the same total return, ignoring their potentially very different carry-plus-roll-down profiles.",
  },
});

const buyAndRollScenarioTemplate = mcqTemplate({
  id: "m03-carry-roll-down-scenario-buy-and-roll",
  conceptId: "m03-carry-roll-down",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un gérant achète une obligation à 10 ans sur le segment le plus pentu de la courbe, avec l'intention de la revendre dans deux ans plutôt que de la conserver jusqu'à l'échéance. Quelle est la logique économique principale de cette stratégie \"buy and roll\" ?",
    en: "A manager buys a 10-year bond on the curve's steepest segment, intending to sell it in two years rather than hold to maturity. What is this \"buy and roll\" strategy's main economic logic?",
  },
  choices: [
    { id: "capture-steep-rolldown", label: { fr: "Capturer le roll-down important offert par le segment le plus pentu de la courbe, sans attendre l'échéance où le roll-down s'épuise", en: "Capture the significant roll-down offered by the curve's steepest segment, without waiting for maturity where roll-down runs out" } },
    { id: "avoid-all-rate-risk", label: { fr: "Éliminer totalement le risque de taux pendant les deux années de détention", en: "Fully eliminate rate risk during the two years of holding" } },
    { id: "guarantee-higher-coupon", label: { fr: "Garantir un coupon plus élevé que celui d'une obligation détenue jusqu'à l'échéance", en: "Guarantee a higher coupon than a bond held to maturity" } },
    { id: "no-logic-random-choice", label: { fr: "Il n'y a pas de logique économique particulière, le choix de revendre avant échéance étant arbitraire", en: "There is no particular economic logic, the choice to sell before maturity being arbitrary" } },
  ],
  correctId: "capture-steep-rolldown",
  hint: { fr: "Le roll-down est le plus fort sur les segments les plus pentus de la courbe, et diminue à mesure que l'obligation se rapproche de l'échéance.", en: "Roll-down is strongest on the curve's steepest segments, and decreases as the bond approaches maturity." },
  explanation: {
    fr: "La stratégie \"buy and roll\" vise spécifiquement à capturer le roll-down, particulièrement élevé sur un segment de courbe pentu, en revendant l'obligation avant que ce segment ne s'épuise près de l'échéance : elle ne réduit pas le risque de taux pendant la détention (le DV01 de la position reste plein), et ne garantit aucun coupon particulier — le levier économique est bien le roll-down, pas ces autres éléments.",
    en: "The \"buy and roll\" strategy specifically aims to capture roll-down, particularly high on a steep curve segment, by selling the bond before that segment runs out near maturity: it does not reduce rate risk during the holding period (the position's DV01 stays full), and guarantees no particular coupon — the economic lever is indeed roll-down, not these other elements.",
  },
  commonMistake: {
    fr: "Croire qu'une stratégie \"buy and roll\" réduit le risque de taux pendant la détention, alors qu'elle vise spécifiquement à capturer le roll-down, sans annuler le DV01 de la position.",
    en: "Believing a \"buy and roll\" strategy reduces rate risk during the holding period, when it specifically aims to capture roll-down, without cancelling the position's DV01.",
  },
});

const flatCurveMistakeTemplate = mcqTemplate({
  id: "m03-carry-roll-down-erreur-courbe-plate",
  conceptId: "m03-carry-roll-down",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "La courbe des taux est parfaitement plate (le même rendement pour toutes les maturités). Un investisseur détient une obligation longue financée à un taux repo identique au rendement de l'obligation. Que peut-on dire du roll-down et du carry ?",
    en: "The yield curve is perfectly flat (the same yield for all maturities). An investor holds a long bond funded at a repo rate identical to the bond's yield. What can be said about roll-down and carry?",
  },
  choices: [
    { id: "both-near-zero", label: { fr: "Les deux sont proches de zéro : sans écart de rendement entre maturités, il n'y a pas de roll-down, et sans écart entre rendement et financement, il n'y a pas de carry", en: "Both are close to zero: with no yield gap between maturities, there's no roll-down, and with no gap between yield and funding, there's no carry" } },
    { id: "rolldown-always-positive-regardless", label: { fr: "Le roll-down reste significativement positif, car il ne dépend jamais de la forme de la courbe", en: "Roll-down stays significantly positive, since it never depends on the curve's shape" } },
    { id: "carry-still-large", label: { fr: "Le carry reste important, uniquement déterminé par le niveau absolu du rendement de l'obligation", en: "Carry stays significant, determined only by the bond's absolute yield level" } },
    { id: "impossible-scenario", label: { fr: "Ce scénario est impossible : une courbe des taux ne peut jamais être parfaitement plate", en: "This scenario is impossible: a yield curve can never be perfectly flat" } },
  ],
  correctId: "both-near-zero",
  hint: { fr: "Le roll-down dépend d'un écart de rendement ENTRE maturités ; le carry d'un écart entre rendement et financement : que devient chacun si ces écarts sont nuls ?", en: "Roll-down depends on a yield gap BETWEEN maturities; carry on a gap between yield and funding: what happens to each if these gaps are zero?" },
  explanation: {
    fr: "Sur une courbe parfaitement plate, il n'existe aucun écart de rendement entre la maturité actuelle et la maturité réduite après glissement, donc le roll-down est proche de zéro ; et si le taux de financement égale le rendement de l'obligation, le carry (rendement moins financement) l'est aussi. Ni l'un ni l'autre n'est une constante indépendante de ces écarts — c'est précisément l'existence de ces écarts qui les rend non nuls en temps normal.",
    en: "On a perfectly flat curve, there is no yield gap between the current maturity and the shortened maturity after sliding, so roll-down is close to zero; and if the funding rate equals the bond's yield, carry (yield minus funding) is too. Neither is a constant independent of these gaps — it is precisely the existence of these gaps that makes them non-zero under normal conditions.",
  },
  commonMistake: {
    fr: "Croire que le roll-down est une constante indépendante de la forme de la courbe, alors qu'il s'annule précisément sur une courbe plate.",
    en: "Believing roll-down is a constant independent of the curve's shape, when it precisely vanishes on a flat curve.",
  },
});

const threeWayAttributionScenarioTemplate = mcqTemplate({
  id: "m03-carry-roll-down-scenario-attribution-trois-facteurs",
  conceptId: "m03-carry-roll-down",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un gérant obligataire veut expliquer le P&L total d'une position sur un trimestre. Quelle décomposition est la plus complète pour comprendre l'origine de ce résultat ?",
    en: "A bond manager wants to explain a position's total P&L over a quarter. What breakdown is most complete for understanding this result's origin?",
  },
  choices: [
    { id: "carry-rolldown-rate-move", label: { fr: "Carry, plus roll-down, plus l'effet d'un éventuel mouvement effectif des taux sur la période, ces trois composantes couvrant l'ensemble du P&L", en: "Carry, plus roll-down, plus the effect of any actual rate move over the period, these three components covering the entire P&L" } },
    { id: "rate-move-only", label: { fr: "Le seul effet d'un mouvement de taux, carry et roll-down n'étant que des raffinements théoriques sans impact réel sur le P&L observé", en: "Only the rate move effect, carry and roll-down being mere theoretical refinements with no real impact on observed P&L" } },
    { id: "carry-only", label: { fr: "Le seul carry, le roll-down et le mouvement de taux s'annulant toujours mutuellement sur un trimestre", en: "Carry alone, roll-down and the rate move always cancelling each other out over a quarter" } },
    { id: "coupon-only", label: { fr: "Le seul montant du coupon perçu durant le trimestre, qui résume à lui seul l'intégralité du P&L", en: "Only the coupon amount received during the quarter, which alone summarizes the entire P&L" } },
  ],
  correctId: "carry-rolldown-rate-move",
  hint: { fr: "Le P&L total combine ce qui se produit MÊME SANS mouvement de taux (carry, roll-down) et ce qui vient D'UN mouvement de taux effectif.", en: "Total P&L combines what happens EVEN WITHOUT a rate move (carry, roll-down) and what comes FROM an actual rate move." },
  explanation: {
    fr: "Le P&L total d'une position obligataire se décompose en carry (flux net perçu), roll-down (effet de prix du glissement sur la courbe inchangée), et l'effet d'un éventuel mouvement effectif des taux sur la période : ces trois composantes couvrent ensemble l'intégralité du résultat, et aucune des deux premières ne s'annule automatiquement — les ignorer conduirait à attribuer tout le P&L au seul mouvement de taux, ce qui est incorrect.",
    en: "A bond position's total P&L breaks down into carry (net flow received), roll-down (price effect from sliding on the unchanged curve), and the effect of any actual rate move over the period: these three components together cover the entire result, and neither of the first two automatically cancels out — ignoring them would lead to attributing all P&L to the rate move alone, which is incorrect.",
  },
  commonMistake: {
    fr: "Attribuer l'intégralité du P&L d'une position obligataire au seul mouvement de taux, en ignorant les contributions du carry et du roll-down.",
    en: "Attributing a bond position's entire P&L to the rate move alone, ignoring the carry and roll-down contributions.",
  },
});

const longerHoldingPeriodComparisonTemplate = mcqTemplate({
  id: "m03-carry-roll-down-comparaison-periode-detention",
  conceptId: "m03-carry-roll-down",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même obligation, même courbe inchangée), comment le carry-plus-roll-down total évolue-t-il si la période de détention passe de un à deux ans ?",
    en: "All else equal (same bond, same unchanged curve), how does the total carry-plus-roll-down evolve if the holding period goes from one to two years?",
  },
  choices: [
    { id: "roughly-scales-with-period", label: { fr: "Il augmente approximativement, mais pas nécessairement de façon strictement proportionnelle, le roll-down dépendant de la forme locale de la courbe à chaque point du glissement", en: "It increases roughly, but not necessarily strictly proportionally, since roll-down depends on the curve's local shape at each point of the slide" } },
    { id: "stays-exactly-identical", label: { fr: "Il reste rigoureusement identique, la période de détention n'ayant par nature aucun effet sur le carry-plus-roll-down", en: "It stays strictly identical, the holding period having by nature no effect on carry-plus-roll-down" } },
    { id: "always-exactly-doubles", label: { fr: "Il double toujours très exactement, le carry et le roll-down étant rigoureusement linéaires dans le temps quelle que soit la forme de la courbe", en: "It always doubles very exactly, carry and roll-down being strictly linear in time whatever the curve's shape" } },
    { id: "decreases-with-longer-period", label: { fr: "Il diminue nécessairement, une détention plus longue réduisant toujours le carry-plus-roll-down total", en: "It necessarily decreases, a longer holding period always reducing total carry-plus-roll-down" } },
  ],
  correctId: "roughly-scales-with-period",
  hint: { fr: "Le carry est à peu près linéaire dans le temps, mais le roll-down dépend de la pente LOCALE de la courbe, qui peut varier d'un segment à l'autre.", en: "Carry is roughly linear in time, but roll-down depends on the LOCAL slope of the curve, which can vary from one segment to another." },
  explanation: {
    fr: "Le carry croît à peu près linéairement avec la période de détention (un flux net perçu chaque année), mais le roll-down dépend de la pente locale de la courbe à chaque étape du glissement, laquelle n'est généralement pas constante d'une maturité à l'autre : le total sur deux ans n'est donc pas garanti d'être exactement le double du total sur un an, contrairement à une hypothèse de linéarité stricte.",
    en: "Carry grows roughly linearly with the holding period (a net flow received each year), but roll-down depends on the curve's local slope at each step of the slide, which is generally not constant from one maturity to another: the two-year total is therefore not guaranteed to be exactly double the one-year total, unlike a strict linearity assumption.",
  },
  commonMistake: {
    fr: "Supposer que le carry-plus-roll-down est strictement linéaire dans le temps, en ignorant que la pente de la courbe peut varier d'un segment de maturité à l'autre.",
    en: "Assuming carry-plus-roll-down is strictly linear in time, ignoring that the curve's slope can vary from one maturity segment to another.",
  },
});

export const templates: QuestionTemplate[] = [
  comprehensionTemplate,
  carryVsRollDownComparisonTemplate,
  invertedCurveWhatIfTemplate,
  steepCurveWhatIfTemplate,
  carryCalcTemplate,
  rollDownCalcTemplate,
  zeroRateMoveMistakeTemplate,
  sameDv01DifferentCarryScenarioTemplate,
  buyAndRollScenarioTemplate,
  flatCurveMistakeTemplate,
  threeWayAttributionScenarioTemplate,
  longerHoldingPeriodComparisonTemplate,
];
