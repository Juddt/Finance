import { pick, randomFloat, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const priceChangeWithConvexityTemplate: QuestionTemplate = {
  id: "m03-convexite-variation-prix",
  conceptId: "m03-convexite",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const Dmod = randomFloat(rng, 2, 12, 2);
    const convexity = randomFloat(rng, 5, 150, 1);
    const dyBp = randomInt(rng, 50, 300);
    const dy = dyBp / 10000;
    const direction = pick(rng, ["up", "down"] as const);
    const signedDy = direction === "up" ? dy : -dy;
    const pctChange = Math.round((-Dmod * signedDy + 0.5 * convexity * signedDy * signedDy) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation a une duration modifiée D_mod = ${fmt(Dmod, "fr")} et une convexité C = ${fmt(convexity, "fr", 1)}. Les taux ${direction === "up" ? "montent" : "baissent"} de ${dyBp} points de base. Quelle est la variation de prix approximative ΔP/P, en % (avec son signe) ?`,
        en: `A bond has modified duration D_mod = ${fmt(Dmod, "en")} and convexity C = ${fmt(convexity, "en", 1)}. Rates ${direction === "up" ? "rise" : "fall"} by ${dyBp} basis points. What is the approximate price change ΔP/P, in % (with its sign)?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.1",
      hint: { fr: "ΔP/P ≈ −D_mod × Δy + ½ × C × Δy².", en: "ΔP/P ≈ −D_mod × Δy + ½ × C × Δy²." },
      numeric: { value: pctChange, tolerance: 0.1 },
      calculation: {
        fr: `Δy = ${direction === "up" ? "+" : "−"}${dyBp}pb = ${direction === "up" ? "+" : "−"}${dy}. Terme duration = −${fmt(Dmod, "fr")} × ${signedDy.toFixed(4)} = ${(-Dmod * signedDy * 100).toFixed(2)}%. Terme convexité = ½ × ${fmt(convexity, "fr", 1)} × ${signedDy.toFixed(4)}² = ${(0.5 * convexity * signedDy * signedDy * 100).toFixed(2)}%. Total ≈ ${pctChange}%.`,
        en: `Δy = ${direction === "up" ? "+" : "−"}${dyBp}bp = ${direction === "up" ? "+" : "−"}${dy}. Duration term = −${fmt(Dmod, "en")} × ${signedDy.toFixed(4)} = ${(-Dmod * signedDy * 100).toFixed(2)}%. Convexity term = ½ × ${fmt(convexity, "en", 1)} × ${signedDy.toFixed(4)}² = ${(0.5 * convexity * signedDy * signedDy * 100).toFixed(2)}%. Total ≈ ${pctChange}%.`,
      },
      explanation: {
        fr: "Le terme de convexité est toujours positif et adoucit une perte (hausse des taux) ou amplifie un gain (baisse des taux) par rapport à l'approximation par la seule duration.",
        en: "The convexity term is always positive and softens a loss (rate rise) or amplifies a gain (rate fall) relative to the duration-only approximation.",
      },
      commonMistake: {
        fr: "Oublier le facteur ½, ou utiliser Δy en points de base au lieu de la proportion décimale dans la formule.",
        en: "Forgetting the ½ factor, or using Δy in basis points instead of the decimal proportion in the formula.",
      },
    };
  },
};

const alwaysPositiveTemplate: QuestionTemplate = {
  id: "m03-convexite-toujours-positive",
  conceptId: "m03-convexite",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Pour une obligation classique sans option intégrée, le terme de convexité dans l'approximation de ΔP/P favorise toujours le porteur de l'obligation, que les taux montent ou baissent.",
      en: "For a plain-vanilla bond with no embedded option, the convexity term in the ΔP/P approximation always favors the bondholder, whether rates rise or fall.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : Δy² est toujours positif ou nul, et la convexité est positive pour une obligation classique, donc ½ × C × Δy² est toujours ≥ 0 — un avantage systématique pour le porteur.",
      en: "True: Δy² is always non-negative, and convexity is positive for a plain-vanilla bond, so ½ × C × Δy² is always ≥ 0 — a systematic advantage for the holder.",
    },
    commonMistake: {
      fr: "Croire que la convexité peut jouer contre le porteur dans un sens comme dans l'autre, comme le fait le terme de duration.",
      en: "Believing convexity can work against the holder in either direction, the way the duration term does.",
    },
  }),
};

const higherConvexityTemplate: QuestionTemplate = {
  id: "m03-convexite-comparaison",
  conceptId: "m03-convexite",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const compareTo = pick(rng, ["maturity", "coupon"] as const);
    return {
      prompt: {
        fr:
          compareTo === "maturity"
            ? "À taux de coupon identique, quelle obligation a la convexité la plus élevée ?"
            : "À maturité identique, quelle obligation a la convexité la plus élevée ?",
        en:
          compareTo === "maturity"
            ? "At the same coupon rate, which bond has the higher convexity?"
            : "At the same maturity, which bond has the higher convexity?",
      },
      choices: buildChoices(
        compareTo === "maturity"
          ? [
              { id: "long", label: { fr: "Celle avec la maturité la plus longue", en: "The one with the longer maturity" } },
              { id: "short", label: { fr: "Celle avec la maturité la plus courte", en: "The one with the shorter maturity" } },
            ]
          : [
              { id: "zero", label: { fr: "Celle avec le coupon le plus bas (proche d'un zéro-coupon)", en: "The one with the lower coupon (closer to a zero-coupon)" } },
              { id: "high", label: { fr: "Celle avec le coupon le plus élevé", en: "The one with the higher coupon" } },
            ]
      ),
      hint: {
        fr: "La convexité est plus élevée quand les flux sont plus concentrés loin dans le futur.",
        en: "Convexity is higher when cash flows are more concentrated far out in time.",
      },
      correctChoiceIds: [compareTo === "maturity" ? "long" : "zero"],
      explanation: {
        fr:
          compareTo === "maturity"
            ? "Une maturité plus longue disperse les flux plus loin dans le temps, augmentant la convexité."
            : "Un coupon plus bas concentre davantage la valeur sur le remboursement final lointain, augmentant la convexité — un zéro-coupon a la convexité maximale à maturité donnée.",
        en:
          compareTo === "maturity"
            ? "A longer maturity spreads cash flows further out in time, increasing convexity."
            : "A lower coupon concentrates more value on the distant final repayment, increasing convexity — a zero-coupon bond has the maximum convexity for a given maturity.",
      },
      commonMistake: {
        fr: "Croire que la convexité dépend uniquement de la duration, alors que la répartition des flux compte aussi.",
        en: "Believing convexity depends only on duration, when the distribution of cash flows also matters.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m03-convexite-vocab",
  conceptId: "m03-convexite",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La convexité est la dérivée ______ du prix par rapport au rendement, normalisée par le prix.",
      en: "Convexity is the ______ derivative of price with respect to yield, normalized by price.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["seconde", "second"],
    hint: { fr: "La duration est la dérivée première ; la convexité va un cran plus loin.", en: "Duration is the first derivative; convexity goes one step further." },
    explanation: {
      fr: "La convexité mesure la courbure (dérivée seconde) de la relation prix-taux, là où la duration n'en mesure que la pente (dérivée première).",
      en: "Convexity measures the curvature (second derivative) of the price-yield relationship, whereas duration only measures its slope (first derivative).",
    },
    commonMistake: {
      fr: "Confondre l'ordre de dérivation entre duration et convexité.",
      en: "Mixing up the order of differentiation between duration and convexity.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-convexite-comprehension-utilite",
  conceptId: "m03-convexite",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi l'approximation par la seule duration ne suffit-elle pas pour de grandes variations de taux, ce qui justifie d'ajouter un terme de convexité ?",
    en: "Why isn't the duration-only approximation enough for large rate changes, which justifies adding a convexity term?",
  },
  choices: [
    { id: "curved", label: { fr: "Parce que la vraie relation prix-taux est courbe, alors que la duration seule trace une droite tangente, de plus en plus imprécise à mesure que Δy grandit", en: "Because the real price-yield relationship is curved, while duration alone draws a tangent straight line, increasingly inaccurate as Δy grows" } },
    { id: "duration-wrong-sign", label: { fr: "Parce que la duration donne systématiquement le mauvais signe pour de grandes variations", en: "Because duration systematically gives the wrong sign for large changes" } },
    { id: "no-reason", label: { fr: "Il n'y a pas de vraie raison, c'est un raffinement purement académique sans usage pratique", en: "There's no real reason, it's a purely academic refinement with no practical use" } },
  ],
  correctId: "curved",
  hint: { fr: "Pensez à une droite tangente à une courbe : elle colle bien tout près du point de tangence, mais s'en écarte en s'éloignant.", en: "Think of a line tangent to a curve: it fits well near the tangent point, but drifts away further out." },
  explanation: {
    fr: "La duration est une approximation linéaire au premier ordre (une tangente), correcte localement mais de plus en plus inexacte à mesure que Δy s'éloigne de zéro, car la vraie relation prix-taux est courbe (convexe), pas droite. Le terme de convexité, une correction au second ordre, capture cette courbure et améliore significativement l'approximation pour des mouvements de taux importants.",
    en: "Duration is a first-order linear approximation (a tangent line), correct locally but increasingly inaccurate as Δy moves away from zero, since the real price-yield relationship is curved (convex), not straight. The convexity term, a second-order correction, captures that curvature and significantly improves the approximation for large rate moves.",
  },
  commonMistake: {
    fr: "Croire que la duration seule suffit toujours, quelle que soit l'ampleur du mouvement de taux considéré.",
    en: "Believing duration alone is always enough, regardless of how large the rate move under consideration is.",
  },
});

const smallVsLargeMoveComparisonTemplate = mcqTemplate({
  id: "m03-convexite-comparaison-petit-grand-mouvement",
  conceptId: "m03-convexite",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Pour une même obligation, comparez l'importance relative du terme de convexité (½×C×Δy²) par rapport au terme de duration (−D_mod×Δy) : est-elle plus grande pour un Δy de 10 points de base, ou pour un Δy de 300 points de base ?",
    en: "For the same bond, compare the relative importance of the convexity term (½×C×Δy²) versus the duration term (−D_mod×Δy): is it larger for a Δy of 10 basis points, or for a Δy of 300 basis points?",
  },
  choices: [
    { id: "large-move", label: { fr: "Pour Δy = 300 pb : le terme de convexité croît avec le CARRÉ de Δy, donc bien plus vite que le terme de duration", en: "For Δy = 300 bp: the convexity term grows with the SQUARE of Δy, so much faster than the duration term" } },
    { id: "small-move", label: { fr: "Pour Δy = 10 pb : le terme de convexité est toujours relativement plus important pour les petits mouvements", en: "For Δy = 10 bp: the convexity term is always relatively more important for small moves" } },
    { id: "same-proportion", label: { fr: "L'importance relative des deux termes est toujours la même, quelle que soit l'ampleur de Δy", en: "The two terms' relative importance is always the same, whatever Δy's magnitude" } },
  ],
  correctId: "large-move",
  hint: { fr: "Le terme de duration est proportionnel à Δy ; le terme de convexité est proportionnel à Δy².", en: "The duration term is proportional to Δy; the convexity term is proportional to Δy²." },
  explanation: {
    fr: "Le terme de duration croît linéairement avec Δy, tandis que le terme de convexité croît avec Δy² : pour un petit Δy (10 pb = 0,001), Δy² est minuscule et le terme de convexité est négligeable ; pour un grand Δy (300 pb = 0,03), Δy² devient significatif et le terme de convexité prend une importance bien plus grande dans la correction totale.",
    en: "The duration term grows linearly with Δy, while the convexity term grows with Δy²: for a small Δy (10 bp = 0.001), Δy² is tiny and the convexity term is negligible; for a large Δy (300 bp = 0.03), Δy² becomes significant and the convexity term takes on much greater importance in the total correction.",
  },
  commonMistake: {
    fr: "Croire que la convexité importe surtout pour de petits mouvements de taux, alors que c'est exactement l'inverse : son poids relatif grandit avec l'ampleur du mouvement.",
    en: "Believing convexity mostly matters for small rate moves, when it's exactly the opposite: its relative weight grows with the move's magnitude.",
  },
});

const whatIfTinyMoveTemplate = mcqTemplate({
  id: "m03-convexite-whatif-mouvement-infime",
  conceptId: "m03-convexite",
  difficulty: "medium",
  prompt: {
    fr: "Pour un mouvement de taux infime (Δy = 1 point de base), le terme de convexité ½×C×Δy² est-il généralement négligeable ou significatif par rapport au terme de duration ?",
    en: "For a tiny rate move (Δy = 1 basis point), is the convexity term ½×C×Δy² generally negligible or significant compared to the duration term?",
  },
  choices: [
    { id: "negligible", label: { fr: "Négligeable : Δy² devient extrêmement petit, la duration seule suffit largement en pratique", en: "Negligible: Δy² becomes extremely small, duration alone is largely enough in practice" } },
    { id: "significant", label: { fr: "Significatif, comparable au terme de duration", en: "Significant, comparable to the duration term" } },
    { id: "dominant", label: { fr: "Dominant, il l'emporte sur le terme de duration", en: "Dominant, it outweighs the duration term" } },
  ],
  correctId: "negligible",
  hint: { fr: "1 pb = 0,0001 ; élevé au carré, ce nombre devient minuscule.", en: "1 bp = 0.0001; squared, this number becomes tiny." },
  explanation: {
    fr: "Pour Δy = 0,0001, Δy² = 0,00000001, un nombre extrêmement petit : même multiplié par une convexité élevée, le terme ½×C×Δy² reste négligeable devant le terme de duration. C'est pourquoi, pour des mouvements de taux très petits (comme le DV01, qui utilise 1 pb, M03-8), l'approximation par la seule duration est déjà excellente.",
    en: "For Δy = 0.0001, Δy² = 0.00000001, an extremely small number: even multiplied by a high convexity, the ½×C×Δy² term remains negligible next to the duration term. This is why, for very small rate moves (like DV01, which uses 1 bp, M03-8), the duration-only approximation is already excellent.",
  },
  commonMistake: {
    fr: "Appliquer systématiquement la correction de convexité même pour des mouvements de taux minuscules, où son effet est en réalité négligeable.",
    en: "Systematically applying the convexity correction even for tiny rate moves, where its effect is in fact negligible.",
  },
});

const whatIfCallableBondTemplate = mcqTemplate({
  id: "m03-convexite-whatif-obligation-callable",
  conceptId: "m03-convexite",
  difficulty: "hard",
  prompt: {
    fr: "Une obligation callable (l'émetteur peut la rembourser par anticipation) voit sa convexité devenir NÉGATIVE quand les taux baissent fortement, contrairement à une obligation classique. Pourquoi ?",
    en: "A callable bond (the issuer can redeem it early) sees its convexity turn NEGATIVE when rates fall sharply, unlike a plain-vanilla bond. Why?",
  },
  choices: [
    { id: "capped-upside", label: { fr: "Parce que l'émetteur va probablement exercer son option de remboursement anticipé, plafonnant la hausse de prix que l'investisseur aurait obtenue autrement", en: "Because the issuer will likely exercise its early redemption option, capping the price rise the investor would otherwise have gotten" } },
    { id: "issuer-error", label: { fr: "C'est une erreur de modélisation, la convexité ne devrait jamais être négative", en: "This is a modeling error, convexity should never be negative" } },
    { id: "coupon-effect", label: { fr: "Uniquement à cause du niveau du coupon, indépendamment de l'option de remboursement", en: "Only because of the coupon level, independent of the redemption option" } },
  ],
  correctId: "capped-upside",
  hint: { fr: "Pensez à ce qui limite la hausse de prix d'une obligation quand son émetteur peut la rembourser à un prix fixé d'avance.", en: "Think about what caps a bond's price rise when its issuer can redeem it at a price fixed in advance." },
  explanation: {
    fr: "Quand les taux baissent fortement, une obligation classique voit son prix monter sans limite théorique claire ; une obligation callable, elle, voit son émetteur incité à la rembourser par anticipation (pour refinancer à un taux plus bas), plafonnant le prix proche du prix de remboursement. Cette \"troncature\" de la hausse potentielle inverse la courbure de la relation prix-taux dans cette zone, produisant une convexité négative — un piège classique à connaître pour ce type d'obligation.",
    en: "When rates fall sharply, a plain-vanilla bond's price rises with no clear theoretical limit; a callable bond's issuer, however, is incentivized to redeem it early (to refinance at a lower rate), capping the price near the redemption price. This \"truncation\" of the potential upside reverses the price-yield relationship's curvature in that zone, producing negative convexity — a classic trap to know about for this bond type.",
  },
  commonMistake: {
    fr: "Appliquer aveuglément la règle \"la convexité est toujours positive\" à toute obligation, sans tenir compte des options intégrées comme le remboursement anticipé.",
    en: "Blindly applying the \"convexity is always positive\" rule to any bond, without accounting for embedded options like early redemption.",
  },
});

const convexityFromScratchNumericTemplate: QuestionTemplate = {
  id: "m03-convexite-calcul-direct",
  conceptId: "m03-convexite",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 15) * 100;
    const couponPct = randomInt(rng, 3, 8);
    const yPct = randomInt(rng, 3, 8);
    const C = (F * couponPct) / 100;
    const y = yPct / 100;
    const cf1 = C;
    const cf2 = C + F;
    const pv1 = cf1 / Math.pow(1 + y, 1);
    const pv2 = cf2 / Math.pow(1 + y, 2);
    const price = pv1 + pv2;
    const term1 = (cf1 * 1 * 2) / Math.pow(1 + y, 3);
    const term2 = (cf2 * 2 * 3) / Math.pow(1 + y, 4);
    const convexity = Math.round(((term1 + term2) / price) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation à 2 ans, nominal F = ${F}, coupon annuel ${couponPct}%, rendement y = ${yPct}%, verse ${cf1} en année 1 puis ${cf2} en année 2. Calculez sa convexité C = (1/P) × Σ[CF_t × t × (t+1) / (1+y)^(t+2)] (2 décimales).`,
        en: `A 2-year bond, face value F = ${F}, annual coupon ${couponPct}%, yield y = ${yPct}%, pays ${cf1} in year 1 then ${cf2} in year 2. Compute its convexity C = (1/P) × Σ[CF_t × t × (t+1) / (1+y)^(t+2)] (2 decimals).`,
      },
      numericUnit: { fr: "sans dimension", en: "dimensionless" },
      numericTolerance: "± 0.1",
      hint: { fr: "Calculez d'abord le prix P, puis chaque terme CF_t × t(t+1) / (1+y)^(t+2), sommez et divisez par P.", en: "First compute the price P, then each term CF_t × t(t+1) / (1+y)^(t+2), sum, and divide by P." },
      numeric: { value: convexity, tolerance: 0.1 },
      calculation: {
        fr: `P = ${pv1.toFixed(2)} + ${pv2.toFixed(2)} = ${price.toFixed(2)}. Terme 1 = ${cf1}×1×2/(1+${y})³ ≈ ${term1.toFixed(2)}. Terme 2 = ${cf2}×2×3/(1+${y})⁴ ≈ ${term2.toFixed(2)}. C = (${term1.toFixed(2)}+${term2.toFixed(2)})/${price.toFixed(2)} ≈ ${convexity.toFixed(2)}.`,
        en: `P = ${pv1.toFixed(2)} + ${pv2.toFixed(2)} = ${price.toFixed(2)}. Term 1 = ${cf1}×1×2/(1+${y})³ ≈ ${term1.toFixed(2)}. Term 2 = ${cf2}×2×3/(1+${y})⁴ ≈ ${term2.toFixed(2)}. C = (${term1.toFixed(2)}+${term2.toFixed(2)})/${price.toFixed(2)} ≈ ${convexity.toFixed(2)}.`,
      },
      explanation: {
        fr: "Ce calcul applique directement la formule générale de définition de la convexité à partir des flux, plutôt que d'utiliser une convexité déjà donnée comme dans le calcul de sensibilité de prix — utile pour comprendre d'où vient réellement ce nombre.",
        en: "This calculation directly applies convexity's general defining formula from the cash flows, rather than using an already-given convexity as in the price-sensitivity calculation — useful for understanding where this number actually comes from.",
      },
      commonMistake: {
        fr: "Se tromper dans l'exposant du dénominateur (t+2 au lieu de t), ou oublier le facteur t×(t+1) au numérateur.",
        en: "Getting the denominator's exponent wrong (t+2 instead of t), or forgetting the t×(t+1) factor in the numerator.",
      },
    };
  },
};

const largeMoveIgnoreConvexityErrorTemplate = trueFalseTemplate({
  id: "m03-convexite-erreur-ignorer-grand-mouvement",
  conceptId: "m03-convexite",
  difficulty: "medium",
  statement: {
    fr: "Comme la convexité est un terme de correction secondaire, on peut toujours l'ignorer sans risque, même pour un choc de taux important (ex. 300 points de base).",
    en: "Since convexity is a secondary correction term, it can always be safely ignored, even for a large rate shock (e.g. 300 basis points).",
  },
  correct: false,
  explanation: {
    fr: "Faux : c'est l'inverse de l'intuition naïve. Le terme de convexité, proportionnel à Δy², devient justement significatif quand Δy est grand — l'ignorer pour un choc de 300 pb peut introduire une erreur d'estimation substantielle sur ΔP/P, contrairement à un mouvement de quelques points de base où l'omettre est sans conséquence pratique.",
    en: "False: this is the opposite of the naive intuition. The convexity term, proportional to Δy², becomes precisely significant when Δy is large — ignoring it for a 300 bp shock can introduce a substantial estimation error on ΔP/P, unlike a move of a few basis points where omitting it has no practical consequence.",
  },
  commonMistake: {
    fr: "Croire qu'un terme \"de second ordre\" est toujours négligeable en toutes circonstances, sans comprendre que son importance dépend justement de l'ampleur du mouvement considéré.",
    en: "Believing a \"second-order\" term is always negligible under any circumstances, without understanding its importance precisely depends on the size of the move considered.",
  },
});

const barbellScenarioTemplate = mcqTemplate({
  id: "m03-convexite-scenario-barbell",
  conceptId: "m03-convexite",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un gérant compare deux portefeuilles de même duration modifiée : le portefeuille A concentre ses obligations autour d'une maturité intermédiaire unique (bullet), tandis que le portefeuille B combine des obligations très courtes et très longues (barbell). En période de forte volatilité des taux attendue, lequel est structurellement préférable, à duration égale ?",
    en: "A manager compares two portfolios with the same modified duration: portfolio A concentrates its bonds around a single intermediate maturity (bullet), while portfolio B combines very short and very long bonds (barbell). In a period of expected high rate volatility, which is structurally preferable, at equal duration?",
  },
  choices: [
    { id: "barbell", label: { fr: "Le portefeuille B (barbell) : dispersé sur plus de maturités extrêmes, il a généralement une convexité plus élevée à duration égale", en: "Portfolio B (barbell): spread across more extreme maturities, it generally has higher convexity at equal duration" } },
    { id: "bullet", label: { fr: "Le portefeuille A (bullet) : plus concentré, il a toujours une convexité plus élevée", en: "Portfolio A (bullet): more concentrated, it always has higher convexity" } },
    { id: "identical", label: { fr: "Les deux ont nécessairement la même convexité si leur duration est identique", en: "Both necessarily have the same convexity if their duration is identical" } },
  ],
  correctId: "barbell",
  hint: { fr: "La convexité augmente avec la dispersion des flux dans le temps — combiner des extrêmes disperse plus qu'une concentration au milieu.", en: "Convexity increases with the flows' dispersion over time — combining extremes disperses more than a concentration in the middle." },
  explanation: {
    fr: "Pour une même duration, une plus grande dispersion des flux dans le temps augmente la convexité (car celle-ci dépend du carré des dates de flux, pas juste de leur moyenne pondérée). Un portefeuille barbell (courts + longs) disperse davantage ses flux qu'un portefeuille bullet (concentré au milieu) : il a donc une convexité plus élevée à duration égale, ce qui l'avantage systématiquement en cas de grand mouvement de taux dans un sens comme dans l'autre — d'où l'intérêt de \"acheter de la convexité\" via cette structure.",
    en: "For the same duration, greater dispersion of flows over time increases convexity (since it depends on the square of flow dates, not just their weighted average). A barbell portfolio (short + long) disperses its flows more than a bullet portfolio (concentrated in the middle): it therefore has higher convexity at equal duration, which systematically benefits it in a large rate move either way — hence the appeal of \"buying convexity\" via this structure.",
  },
  commonMistake: {
    fr: "Croire qu'une duration identique implique automatiquement une convexité identique, en oubliant que la convexité dépend de la dispersion des flux, pas seulement de leur moyenne pondérée.",
    en: "Believing identical duration automatically implies identical convexity, forgetting convexity depends on the flows' dispersion, not just their weighted average.",
  },
});

const stressTestScenarioTemplate = mcqTemplate({
  id: "m03-convexite-scenario-stress-test",
  conceptId: "m03-convexite",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Lors d'un stress test réglementaire, un choc de taux de +300 points de base est appliqué à un portefeuille obligataire. Un analyste utilise uniquement l'approximation par duration (sans convexité) pour estimer la perte. Cette estimation est-elle probablement fiable ?",
    en: "In a regulatory stress test, a +300 basis point rate shock is applied to a bond portfolio. An analyst uses only the duration approximation (no convexity) to estimate the loss. Is this estimate likely reliable?",
  },
  choices: [
    { id: "unreliable", label: { fr: "Non : pour un choc aussi important, l'omission du terme de convexité peut créer une erreur significative, généralement une surestimation de la perte", en: "No: for such a large shock, omitting the convexity term can create a significant error, generally overstating the loss" } },
    { id: "reliable", label: { fr: "Oui, la duration seule reste toujours fiable quelle que soit l'ampleur du choc", en: "Yes, duration alone always remains reliable whatever the shock's magnitude" } },
    { id: "underestimate", label: { fr: "Non, mais l'omission de la convexité sous-estime systématiquement la perte, jamais l'inverse", en: "No, but omitting convexity systematically understates the loss, never the reverse" } },
  ],
  correctId: "unreliable",
  hint: { fr: "Le terme de convexité (toujours positif pour une obligation classique) vient ADOUCIR la perte en cas de hausse de taux par rapport à l'estimation par la seule duration.", en: "The convexity term (always positive for a plain-vanilla bond) SOFTENS the loss on a rate rise versus the duration-only estimate." },
  explanation: {
    fr: "Pour un choc de 300 pb, le terme de convexité (positif pour une obligation classique) réduit la perte réelle par rapport à ce que prédit la seule duration : un analyste qui l'ignore surestimera la perte potentielle du portefeuille. C'est pourquoi les stress tests réglementaires rigoureux exigent généralement d'inclure la convexité (voire une réévaluation complète par les flux) pour des chocs de cette ampleur, plutôt que la seule approximation linéaire.",
    en: "For a 300 bp shock, the convexity term (positive for a plain-vanilla bond) reduces the real loss relative to what duration alone predicts: an analyst ignoring it will overstate the portfolio's potential loss. This is why rigorous regulatory stress tests generally require including convexity (or even a full cash-flow revaluation) for shocks of this magnitude, rather than the linear approximation alone.",
  },
  commonMistake: {
    fr: "Supposer que l'omission de la convexité biaise toujours dans le même sens que l'ampleur du choc, sans se souvenir que le terme de convexité est structurellement favorable au porteur, donc son omission surestime systématiquement la perte (ou sous-estime le gain).",
    en: "Assuming omitting convexity always biases the estimate the same way as the shock's magnitude, without remembering the convexity term structurally favors the holder, so omitting it systematically overstates the loss (or understates the gain).",
  },
});

export const templates: QuestionTemplate[] = [
  priceChangeWithConvexityTemplate,
  alwaysPositiveTemplate,
  higherConvexityTemplate,
  vocabTemplate,
  comprehensionTemplate,
  smallVsLargeMoveComparisonTemplate,
  whatIfTinyMoveTemplate,
  whatIfCallableBondTemplate,
  convexityFromScratchNumericTemplate,
  largeMoveIgnoreConvexityErrorTemplate,
  barbellScenarioTemplate,
  stressTestScenarioTemplate,
];
