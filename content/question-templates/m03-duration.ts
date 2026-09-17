import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const directionTemplate: QuestionTemplate = {
  id: "m03-duration-direction",
  conceptId: "m03-duration",
  kind: "mcq",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const bps = randomInt(rng, 1, 4) * 25;
    const goesUp = pick(rng, [true, false]);
    const direction = goesUp ? { fr: "augmentent", en: "rise" } : { fr: "baissent", en: "fall" };
    const correctId = goesUp ? "down" : "up";

    return {
      prompt: {
        fr: `Les taux de marché ${direction.fr} de ${bps} points de base. Que devient, toutes choses égales par ailleurs, le prix d'une obligation à taux fixe déjà émise ?`,
        en: `Market rates ${direction.en} by ${bps} basis points. All else equal, what happens to the price of an already-issued fixed-rate bond?`,
      },
      choices: buildChoices([
        { id: "up", label: { fr: "Il monte", en: "It rises" } },
        { id: "down", label: { fr: "Il baisse", en: "It falls" } },
        { id: "same", label: { fr: "Il ne change pas", en: "It stays the same" } },
      ]),
      hint: {
        fr: "Les flux de l'obligation sont fixes : que devient leur valeur actuelle quand le taux d'actualisation change ?",
        en: "The bond's cash flows are fixed: what happens to their present value when the discount rate changes?",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: `Prix et taux évoluent toujours en sens inverse pour une obligation à taux fixe : les taux ${direction.fr}, donc le prix ${goesUp ? "baisse" : "monte"}.`,
        en: `Price and yield always move in opposite directions for a fixed-rate bond: rates ${direction.en}, so the price ${goesUp ? "falls" : "rises"}.`,
      },
      commonMistake: {
        fr: "Penser que le prix suit le même sens que les taux — c'est l'inverse : les flux fixes sont actualisés plus (ou moins) fortement.",
        en: "Thinking the price follows the same direction as rates — it's the opposite: fixed cash flows get discounted more (or less) heavily.",
      },
    };
  },
};

const priceChangeTemplate: QuestionTemplate = {
  id: "m03-duration-variation-prix",
  conceptId: "m03-duration",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const dMod = randomFloat(rng, 2, 9, 1);
    const deltaBps = randomInt(rng, 1, 8) * 25;
    const goesUp = pick(rng, [true, false]);
    const deltaY = (goesUp ? 1 : -1) * (deltaBps / 10000);
    const pctChange = Math.round(-dMod * deltaY * 10000) / 100; // in %

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation a une duration modifiée D_mod = ${fmt(dMod, "fr", 1)}. Le rendement de marché ${goesUp ? "augmente" : "baisse"} de ${deltaBps} points de base. Quelle est la variation approximative du prix, en % (avec son signe) ?`,
        en: `A bond has modified duration D_mod = ${fmt(dMod, "en", 1)}. The market yield ${goesUp ? "rises" : "falls"} by ${deltaBps} basis points. What is the approximate price change, in % (with its sign)?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0,05",
      hint: {
        fr: "ΔP/P ≈ −D_mod × Δy, avec Δy en décimal (ex. 25 pb = 0,0025).",
        en: "ΔP/P ≈ −D_mod × Δy, with Δy as a decimal (e.g. 25 bp = 0.0025).",
      },
      numeric: { value: pctChange, tolerance: 0.05 },
      calculation: {
        fr: `Δy = ${goesUp ? "+" : "-"}${deltaBps}pb = ${goesUp ? "+" : "-"}${fmt(deltaBps / 10000, "fr", 4)}. ΔP/P ≈ −${fmt(dMod, "fr", 1)} × (${goesUp ? "+" : "-"}${fmt(deltaBps / 10000, "fr", 4)}) = ${fmt(pctChange, "fr", 2)}%.`,
        en: `Δy = ${goesUp ? "+" : "-"}${deltaBps}bp = ${goesUp ? "+" : "-"}${fmt(deltaBps / 10000, "en", 4)}. ΔP/P ≈ −${fmt(dMod, "en", 1)} × (${goesUp ? "+" : "-"}${fmt(deltaBps / 10000, "en", 4)}) = ${fmt(pctChange, "en", 2)}%.`,
      },
      explanation: {
        fr: "C'est une approximation linéaire au premier ordre : suffisante pour de petites variations de taux.",
        en: "This is a first-order linear approximation: accurate enough for small rate changes.",
      },
      commonMistake: {
        fr: "Oublier le signe moins, ou utiliser Δy en points de base au lieu de le convertir en décimal.",
        en: "Forgetting the minus sign, or using Δy in basis points instead of converting it to a decimal.",
      },
    };
  },
};

const magnitudeTemplate: QuestionTemplate = {
  id: "m03-duration-magnitude",
  conceptId: "m03-duration",
  kind: "true_false",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const years = randomInt(rng, 5, 15);
    const higherCoupon = pick(rng, [true, false]);
    const statement = higherCoupon
      ? { fr: "plus grande", en: "larger" }
      : { fr: "plus petite", en: "smaller" };
    // Higher coupon => lower duration. So "higher coupon => larger duration" is FALSE.
    const correctId = higherCoupon ? "false" : "true";

    return {
      prompt: {
        fr: `Pour deux obligations similaires de maturité ${years} ans, celle qui verse le coupon le plus élevé a une duration ${statement.fr} que celle au coupon plus faible.`,
        en: `For two similar bonds with a ${years}-year maturity, the one paying the higher coupon has a ${statement.en} duration than the one with the lower coupon.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      hint: {
        fr: "Un coupon élevé rapproche-t-il ou éloigne-t-il le moment moyen où vous récupérez votre argent ?",
        en: "Does a high coupon bring the average time you get your money back closer, or push it further away?",
      },
      correctChoiceIds: [correctId],
      explanation: {
        fr: "Un coupon plus élevé rapproche le retour moyen de l'argent (plus de flux tôt), donc réduit la duration — la relation est inverse : coupon plus élevé = duration plus faible.",
        en: "A higher coupon brings the average money-back time closer (more early cash flows), so it reduces duration — the relationship is inverse: higher coupon = lower duration.",
      },
      commonMistake: {
        fr: "Confondre coupon et maturité : c'est la maturité qui augmente toujours la duration, alors que le coupon la diminue.",
        en: "Confusing coupon and maturity: maturity always increases duration, while the coupon decreases it.",
      },
    };
  },
};

const zeroCouponTemplate: QuestionTemplate = {
  id: "m03-duration-zero-coupon",
  conceptId: "m03-duration",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "Toutes choses égales par ailleurs, la duration de Macaulay d'une obligation zéro-coupon est égale à sa ______.",
      en: "All else equal, the Macaulay duration of a zero-coupon bond is equal to its ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["maturite", "maturité", "echeance", "échéance", "maturity"],
    hint: {
      fr: "Il n'y a qu'un seul flux, à une seule date.",
      en: "There is only one cash flow, on a single date.",
    },
    explanation: {
      fr: "Sans coupon intermédiaire, tout l'argent revient à l'échéance : la duration de Macaulay (moyenne pondérée des dates de flux) est donc exactement égale à la maturité.",
      en: "With no intermediate coupon, all the money comes back at maturity: Macaulay duration (weighted average of cash flow dates) is therefore exactly equal to maturity.",
    },
    commonMistake: {
      fr: "Croire que la duration d'un zéro-coupon est nulle ou différente de sa maturité — c'est le seul cas où duration = maturité exactement.",
      en: "Believing a zero-coupon's duration is zero or different from its maturity — this is the only case where duration = maturity exactly.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-duration-comprehension-utilite",
  conceptId: "m03-duration",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi la duration modifiée est-elle utile en pratique, plutôt que de toujours recalculer entièrement le nouveau prix de l'obligation après chaque variation de taux ?",
    en: "Why is modified duration useful in practice, rather than always fully recomputing the bond's new price after every rate change?",
  },
  choices: [
    { id: "shortcut", label: { fr: "Elle résume en un seul nombre la sensibilité au taux, permettant une estimation rapide sans refaire tout le calcul d'actualisation", en: "It summarizes rate sensitivity in a single number, allowing a quick estimate without redoing the whole discounting calculation" } },
    { id: "exact", label: { fr: "Elle donne toujours le prix exact, sans aucune approximation, quelle que soit l'ampleur du mouvement de taux", en: "It always gives the exact price, with no approximation whatsoever, regardless of the size of the rate move" } },
    { id: "only-theoretical", label: { fr: "Elle n'a aucune utilité pratique, uniquement un intérêt théorique", en: "It has no practical use, only theoretical interest" } },
  ],
  correctId: "shortcut",
  hint: { fr: "Pensez à un trader qui gère des centaines d'obligations et doit réagir vite à une annonce de taux.", en: "Think of a trader managing hundreds of bonds who must react quickly to a rate announcement." },
  explanation: {
    fr: "La duration modifiée condense en un seul chiffre la sensibilité du prix aux taux, permettant d'estimer rapidement l'effet d'une variation de taux (ΔP/P ≈ −D_mod × Δy) sans avoir à réactualiser individuellement chaque flux de l'obligation — un gain de temps considérable en salle de marché, au prix d'une approximation linéaire valable pour de petites variations.",
    en: "Modified duration condenses price sensitivity to rates into a single number, allowing a quick estimate of a rate change's effect (ΔP/P ≈ −D_mod × Δy) without individually re-discounting every one of the bond's cash flows — a considerable time-saver on a trading desk, at the cost of a linear approximation valid for small changes.",
  },
  commonMistake: {
    fr: "Croire que la duration donne un résultat exact quelle que soit l'ampleur du mouvement de taux, en oubliant qu'elle n'est qu'une approximation linéaire au premier ordre.",
    en: "Believing duration gives an exact result whatever the size of the rate move, forgetting it is only a first-order linear approximation.",
  },
});

const maturityComparisonTemplate = mcqTemplate({
  id: "m03-duration-comparaison-maturite",
  conceptId: "m03-duration",
  difficulty: "medium",
  prompt: {
    fr: "Pour deux obligations similaires au même coupon, laquelle a la duration la plus élevée : celle de maturité 3 ans, ou celle de maturité 15 ans ?",
    en: "For two similar bonds with the same coupon, which has the higher duration: the 3-year maturity one, or the 15-year maturity one?",
  },
  choices: [
    { id: "long", label: { fr: "Celle de maturité 15 ans", en: "The 15-year maturity one" } },
    { id: "short", label: { fr: "Celle de maturité 3 ans", en: "The 3-year maturity one" } },
    { id: "same", label: { fr: "Les deux ont la même duration, seul le coupon compte", en: "Both have the same duration, only the coupon matters" } },
  ],
  correctId: "long",
  hint: { fr: "La duration est une moyenne pondérée des dates de flux : plus les flux s'étalent loin, plus cette moyenne est grande.", en: "Duration is a weighted average of cash flow dates: the further out the flows spread, the larger this average." },
  explanation: {
    fr: "Une maturité plus longue étale les flux sur davantage d'années, y compris le remboursement final qui pèse lourd dans la moyenne pondérée : la duration de Macaulay augmente donc structurellement avec la maturité, à coupon identique.",
    en: "A longer maturity spreads the flows over more years, including the final redemption which weighs heavily in the weighted average: Macaulay duration therefore structurally increases with maturity, at the same coupon.",
  },
  commonMistake: {
    fr: "Croire que seul le coupon détermine la duration, en oubliant que la maturité est le premier facteur qui l'influence.",
    en: "Believing only the coupon determines duration, forgetting maturity is the first factor influencing it.",
  },
});

const whatIfYieldLevelTemplate = mcqTemplate({
  id: "m03-duration-whatif-niveau-rendement",
  conceptId: "m03-duration",
  difficulty: "hard",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même coupon, même maturité), si le rendement exigé y du marché est très élevé plutôt que très bas, que devient la duration de l'obligation ?",
    en: "All else equal (same coupon, same maturity), if the market's required yield y is very high rather than very low, what happens to the bond's duration?",
  },
  choices: [
    { id: "lower", label: { fr: "Elle est plus faible : les flux lointains pèsent relativement moins dans la moyenne pondérée", en: "It is lower: distant flows weigh relatively less in the weighted average" } },
    { id: "higher", label: { fr: "Elle est plus élevée", en: "It is higher" } },
    { id: "unaffected", label: { fr: "Le niveau du rendement n'a aucun effet sur la duration", en: "The yield level has no effect on duration" } },
  ],
  correctId: "lower",
  hint: { fr: "Un taux d'actualisation élevé pénalise davantage les flux lointains que les flux proches dans le calcul des poids VA_t/P.", en: "A high discount rate penalizes distant flows more than near ones in the VA_t/P weight calculation." },
  explanation: {
    fr: "À un rendement élevé, les flux lointains (dont le remboursement du nominal) sont beaucoup plus fortement actualisés que les flux proches, réduisant leur poids relatif VA_t/P dans la moyenne pondérée qui définit D_mac : la duration diminue donc quand le rendement augmente, à coupon et maturité identiques.",
    en: "At a high yield, distant flows (including the face value redemption) are discounted much more heavily than near ones, reducing their relative weight VA_t/P in the weighted average that defines D_mac: duration therefore falls as yield rises, at the same coupon and maturity.",
  },
  commonMistake: {
    fr: "Croire que la duration ne dépend que du coupon et de la maturité, en oubliant que le niveau même du rendement l'affecte aussi, via les poids VA_t/P.",
    en: "Believing duration depends only on the coupon and maturity, forgetting the yield level itself also affects it, via the VA_t/P weights.",
  },
});

const whatIfTimePassesTemplate = mcqTemplate({
  id: "m03-duration-whatif-passage-temps",
  conceptId: "m03-duration",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (rendement constant), que devient la duration d'une obligation à mesure que le temps passe et que l'échéance se rapproche ?",
    en: "All else equal (constant yield), what happens to a bond's duration as time passes and maturity approaches?",
  },
  choices: [
    { id: "decreases", label: { fr: "Elle diminue progressivement, pour atteindre zéro exactement à l'échéance", en: "It progressively decreases, reaching zero exactly at maturity" } },
    { id: "increases", label: { fr: "Elle augmente à mesure que l'échéance approche", en: "It increases as maturity approaches" } },
    { id: "constant", label: { fr: "Elle reste rigoureusement constante durant toute la vie de l'obligation", en: "It stays rigorously constant throughout the bond's life" } },
  ],
  correctId: "decreases",
  hint: { fr: "Moins d'années restent avant l'échéance, donc la moyenne pondérée des dates de flux restants se rapproche aussi.", en: "Fewer years remain until maturity, so the weighted average of the remaining flow dates also gets closer." },
  explanation: {
    fr: "À mesure que le temps passe, il reste de moins en moins de flux futurs à recevoir, tous de plus en plus proches : la moyenne pondérée de leurs dates (la duration) diminue donc mécaniquement, jusqu'à atteindre zéro au moment même du remboursement final.",
    en: "As time passes, fewer and fewer future flows remain to be received, all increasingly close: the weighted average of their dates (duration) therefore mechanically decreases, reaching zero at the very moment of the final redemption.",
  },
  commonMistake: {
    fr: "Croire que la duration reste fixe pendant toute la vie de l'obligation, en oubliant qu'elle diminue mécaniquement avec le simple passage du temps, indépendamment de tout mouvement de taux.",
    en: "Believing duration stays fixed throughout the bond's life, forgetting it mechanically decreases with the mere passage of time, independent of any rate move.",
  },
});

const macaulayFromScratchNumericTemplate: QuestionTemplate = {
  id: "m03-duration-macaulay-calcul-direct",
  conceptId: "m03-duration",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 15) * 100;
    const couponPct = randomInt(rng, 3, 8);
    const yPct = randomInt(rng, 3, 8);
    const N = 2;
    const C = (F * couponPct) / 100;
    const y = yPct / 100;
    const pv1 = C / (1 + y);
    const pv2 = (C + F) / Math.pow(1 + y, N);
    const price = pv1 + pv2;
    const dMac = Math.round(((1 * pv1 + 2 * pv2) / price) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation à 2 ans, nominal F = ${F}, coupon annuel ${couponPct}%, rendement y = ${yPct}%, verse un coupon de ${C} en année 1, puis ${C}+${F} en année 2. Calculez sa duration de Macaulay (2 décimales).`,
        en: `A 2-year bond, face value F = ${F}, annual coupon ${couponPct}%, yield y = ${yPct}%, pays a coupon of ${C} in year 1, then ${C}+${F} in year 2. Compute its Macaulay duration (2 decimals).`,
      },
      numericUnit: { fr: "années", en: "years" },
      numericTolerance: "± 0.05",
      hint: { fr: "D_mac = Σ[t × VA_t] / Prix, avec VA_t la valeur actuelle de chaque flux.", en: "D_mac = Σ[t × PV_t] / Price, with PV_t the present value of each flow." },
      numeric: { value: dMac, tolerance: 0.05 },
      calculation: {
        fr: `VA_1 = ${C}/(1+${y}) ≈ ${pv1.toFixed(2)}. VA_2 = (${C}+${F})/(1+${y})² ≈ ${pv2.toFixed(2)}. Prix = ${price.toFixed(2)}. D_mac = (1×${pv1.toFixed(2)} + 2×${pv2.toFixed(2)}) / ${price.toFixed(2)} ≈ ${dMac.toFixed(2)} ans.`,
        en: `PV_1 = ${C}/(1+${y}) ≈ ${pv1.toFixed(2)}. PV_2 = (${C}+${F})/(1+${y})² ≈ ${pv2.toFixed(2)}. Price = ${price.toFixed(2)}. D_mac = (1×${pv1.toFixed(2)} + 2×${pv2.toFixed(2)}) / ${price.toFixed(2)} ≈ ${dMac.toFixed(2)} years.`,
      },
      explanation: {
        fr: "Contrairement au calcul de sensibilité de prix (qui utilise D_mod déjà connu), ce calcul applique directement la formule générale de définition de D_mac : pondérer chaque date de flux par son poids VA_t/Prix dans la valeur totale, puis sommer.",
        en: "Unlike the price-sensitivity calculation (which uses an already-known D_mod), this calculation directly applies D_mac's general defining formula: weight each flow's date by its VA_t/Price weight in the total value, then sum.",
      },
      commonMistake: {
        fr: "Oublier de pondérer par VA_t/Prix (utiliser directement CF_t au lieu de sa valeur actuelle), ou oublier d'inclure le nominal dans le dernier flux.",
        en: "Forgetting to weight by VA_t/Price (using CF_t directly instead of its present value), or forgetting to include the face value in the final flow.",
      },
    };
  },
};

const macVsModConfusionErrorTemplate = trueFalseTemplate({
  id: "m03-duration-erreur-mac-vs-mod",
  conceptId: "m03-duration",
  difficulty: "medium",
  statement: {
    fr: "La duration de Macaulay et la duration modifiée sont deux noms différents pour exactement la même grandeur, toujours numériquement identiques.",
    en: "Macaulay duration and modified duration are two different names for exactly the same quantity, always numerically identical.",
  },
  correct: false,
  explanation: {
    fr: "Faux : D_mod = D_mac / (1 + y/m) — elles ne sont identiques que dans le cas limite où y = 0. D_mac (en années) mesure la date moyenne pondérée des flux ; D_mod (sans cette interprétation temporelle directe) mesure la sensibilité relative du prix au taux, et sert directement dans l'approximation ΔP/P ≈ −D_mod × Δy.",
    en: "False: D_mod = D_mac / (1 + y/m) — they are identical only in the limiting case where y = 0. D_mac (in years) measures the weighted average date of the flows; D_mod (without that direct time interpretation) measures the price's relative sensitivity to rate, and is used directly in the approximation ΔP/P ≈ −D_mod × Δy.",
  },
  commonMistake: {
    fr: "Utiliser D_mac directement dans la formule de sensibilité ΔP/P ≈ −D × Δy, en oubliant qu'il faut d'abord la convertir en D_mod en divisant par (1+y/m).",
    en: "Using D_mac directly in the sensitivity formula ΔP/P ≈ −D × Δy, forgetting it must first be converted to D_mod by dividing by (1+y/m).",
  },
});

const fedMeetingScenarioTemplate = mcqTemplate({
  id: "m03-duration-scenario-reunion-banque-centrale",
  conceptId: "m03-duration",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un gérant obligataire anticipe une hausse surprise des taux directeurs lors de la prochaine réunion de banque centrale et veut réduire le risque de son portefeuille avant l'annonce. Que doit-il faire à la duration de son portefeuille ?",
    en: "A bond manager expects a surprise policy rate hike at the next central bank meeting and wants to reduce their portfolio's risk before the announcement. What should they do to their portfolio's duration?",
  },
  choices: [
    { id: "shorten", label: { fr: "La réduire, par exemple en vendant des obligations longues et en achetant des obligations courtes", en: "Reduce it, e.g. by selling long bonds and buying short bonds" } },
    { id: "extend", label: { fr: "L'augmenter, pour profiter davantage du mouvement de taux", en: "Increase it, to benefit more from the rate move" } },
    { id: "irrelevant", label: { fr: "La duration n'a aucun rapport avec ce type de décision", en: "Duration has no relevance to this kind of decision" } },
  ],
  correctId: "shorten",
  hint: { fr: "Une hausse de taux fait baisser le prix des obligations, d'autant plus que la duration est élevée : pour limiter la perte potentielle, il faut...", en: "A rate rise lowers bond prices, more so the higher the duration: to limit the potential loss, you should..." },
  explanation: {
    fr: "Puisque ΔP/P ≈ −D_mod × Δy, une hausse de taux anticipée fait d'autant plus baisser le prix que la duration du portefeuille est élevée : pour limiter cette perte potentielle, le gérant doit réduire la duration de son portefeuille avant l'annonce, en privilégiant des obligations courtes ou à coupon plus élevé.",
    en: "Since ΔP/P ≈ −D_mod × Δy, an anticipated rate rise lowers the price all the more the higher the portfolio's duration: to limit this potential loss, the manager should reduce the portfolio's duration before the announcement, favoring short bonds or bonds with a higher coupon.",
  },
  commonMistake: {
    fr: "Augmenter la duration par erreur en anticipant une hausse de taux, ce qui aggraverait au contraire l'exposition au risque redouté.",
    en: "Mistakenly increasing duration while anticipating a rate rise, which would instead worsen exposure to the feared risk.",
  },
});

const immunizationScenarioTemplate = mcqTemplate({
  id: "m03-duration-scenario-immunisation-fonds-pension",
  conceptId: "m03-duration",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un fonds de pension doit verser un paiement important dans 8 ans et veut se protéger contre le risque de taux entre aujourd'hui et cette date. Quelle stratégie d'immunisation basée sur la duration est la plus appropriée ?",
    en: "A pension fund must make a large payment in 8 years and wants to protect against interest rate risk between now and then. Which duration-based immunization strategy is most appropriate?",
  },
  choices: [
    { id: "match", label: { fr: "Construire un portefeuille obligataire dont la duration est égale à 8 ans, pour que l'actif et le passif réagissent de façon similaire aux taux", en: "Build a bond portfolio with a duration equal to 8 years, so assets and liabilities react similarly to rates" } },
    { id: "shortest", label: { fr: "Choisir systématiquement les obligations de plus courte duration possible, quelle que soit l'échéance du passif", en: "Systematically choose the shortest-duration bonds possible, regardless of the liability's maturity" } },
    { id: "irrelevant", label: { fr: "La duration du portefeuille n'a pas besoin d'être liée à l'échéance du passif", en: "The portfolio's duration doesn't need to be linked to the liability's maturity" } },
  ],
  correctId: "match",
  hint: { fr: "L'immunisation consiste à faire correspondre la sensibilité aux taux de l'actif à celle du passif à couvrir.", en: "Immunization means matching the asset's rate sensitivity to that of the liability being hedged." },
  explanation: {
    fr: "La technique d'immunisation par la duration consiste à choisir un portefeuille obligataire dont la duration égale l'horizon du passif à financer (ici 8 ans) : ainsi, une variation de taux affecte l'actif et le passif de façon similaire, neutralisant (approximativement) le risque de ne pas disposer des fonds nécessaires à l'échéance requise, quelle que soit l'évolution des taux entre-temps.",
    en: "Duration-based immunization consists of choosing a bond portfolio whose duration matches the horizon of the liability to be funded (here 8 years): a rate change then affects the asset and liability similarly, (approximately) neutralizing the risk of not having the funds needed by the required date, whatever rates do in the meantime.",
  },
  commonMistake: {
    fr: "Choisir systématiquement la duration la plus courte possible en pensant minimiser le risque, sans réaliser que cela désaligne le portefeuille de l'échéance réelle du passif à couvrir.",
    en: "Systematically choosing the shortest possible duration thinking it minimizes risk, without realizing this misaligns the portfolio from the liability's actual maturity to hedge.",
  },
});

export const templates: QuestionTemplate[] = [
  directionTemplate,
  priceChangeTemplate,
  magnitudeTemplate,
  zeroCouponTemplate,
  comprehensionTemplate,
  maturityComparisonTemplate,
  whatIfYieldLevelTemplate,
  whatIfTimePassesTemplate,
  macaulayFromScratchNumericTemplate,
  macVsModConfusionErrorTemplate,
  fedMeetingScenarioTemplate,
  immunizationScenarioTemplate,
];
