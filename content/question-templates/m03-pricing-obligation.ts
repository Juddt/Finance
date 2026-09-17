import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function bondPrice(F: number, couponRate: number, y: number, N: number): number {
  const C = F * couponRate;
  let p = 0;
  for (let t = 1; t <= N; t++) {
    p += C / Math.pow(1 + y, t);
  }
  p += F / Math.pow(1 + y, N);
  return p;
}

const bondPriceNumericTemplate: QuestionTemplate = {
  id: "m03-pricing-prix-calcul",
  conceptId: "m03-pricing-obligation",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 20) * 100;
    const couponPct = randomInt(rng, 2, 8);
    const yPct = randomInt(rng, 2, 8);
    const N = randomInt(rng, 2, 5);
    const P = Math.round(bondPrice(F, couponPct / 100, yPct / 100, N) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Obligation nominal F = ${F}, coupon annuel ${couponPct}%, maturité N = ${N} ans, rendement exigé y = ${yPct}%. Quel est son prix aujourd'hui (juste après un paiement de coupon) ?`,
        en: `Bond with face value F = ${F}, annual coupon ${couponPct}%, maturity N = ${N} years, required yield y = ${yPct}%. What is its price today (right after a coupon payment)?`,
      },
      numericUnit: { fr: "même devise que F", en: "same currency as F" },
      numericTolerance: "± 1",
      hint: {
        fr: "P = Σ C/(1+y)^t + F/(1+y)^N, avec C = taux de coupon × F.",
        en: "P = Σ C/(1+y)^t + F/(1+y)^N, with C = coupon rate × F.",
      },
      numeric: { value: P, tolerance: 1 },
      calculation: {
        fr: `C = ${couponPct}% × ${F} = ${(F * couponPct) / 100}. Actualiser chaque coupon sur ${N} périodes à ${yPct}%, plus F en dernière période : P ≈ ${fmt(P, "fr")}.`,
        en: `C = ${couponPct}% × ${F} = ${(F * couponPct) / 100}. Discount each coupon over ${N} periods at ${yPct}%, plus F in the final period: P ≈ ${fmt(P, "en")}.`,
      },
      explanation: {
        fr: couponPct > yPct ? "Le coupon dépasse le rendement exigé : l'obligation se négocie au-dessus du pair (prime)." : couponPct < yPct ? "Le coupon est inférieur au rendement exigé : l'obligation se négocie en dessous du pair (décote)." : "Le coupon égale le rendement exigé : l'obligation se négocie au pair.",
        en: couponPct > yPct ? "The coupon exceeds the required yield: the bond trades above par (premium)." : couponPct < yPct ? "The coupon is below the required yield: the bond trades below par (discount)." : "The coupon equals the required yield: the bond trades at par.",
      },
      commonMistake: {
        fr: "Oublier d'ajouter le nominal F au dernier flux, ou actualiser F sur N+1 périodes au lieu de N.",
        en: "Forgetting to add face value F to the last cash flow, or discounting F over N+1 periods instead of N.",
      },
    };
  },
};

const priceDirectionTemplate: QuestionTemplate = {
  id: "m03-pricing-sens-prix",
  conceptId: "m03-pricing-obligation",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const ratesUp = rng() < 0.5;
    return {
      prompt: {
        fr: `Les taux d'intérêt du marché ${ratesUp ? "augmentent" : "baissent"}. Le prix d'une obligation existante à coupon fixe ${ratesUp ? "augmente" : "baisse"} en conséquence.`,
        en: `Market interest rates ${ratesUp ? "rise" : "fall"}. An existing fixed-coupon bond's price ${ratesUp ? "rises" : "falls"} as a result.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: ["false"],
      explanation: {
        fr: `Faux : prix et rendement varient en sens opposé. Si les taux ${ratesUp ? "montent" : "baissent"}, le rendement exigé ${ratesUp ? "monte" : "baisse"}, donc le prix de l'obligation existante ${ratesUp ? "baisse" : "monte"} pour s'aligner sur le nouveau niveau de marché.`,
        en: `False: price and yield move in opposite directions. If rates ${ratesUp ? "rise" : "fall"}, the required yield ${ratesUp ? "rises" : "falls"}, so the existing bond's price ${ratesUp ? "falls" : "rises"} to align with the new market level.`,
      },
      commonMistake: {
        fr: "Penser que le prix suit la même direction que les taux, une confusion très fréquente chez les débutants.",
        en: "Thinking the price follows the same direction as rates, a very common beginner confusion.",
      },
    };
  },
};

const parPremiumDiscountTemplate: QuestionTemplate = {
  id: "m03-pricing-prime-decote",
  conceptId: "m03-pricing-obligation",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const couponPct = randomInt(rng, 2, 8);
    const yPct = randomInt(rng, 2, 8);
    const correctId = couponPct > yPct ? "premium" : couponPct < yPct ? "discount" : "par";

    return {
      prompt: {
        fr: `Une obligation offre un coupon de ${couponPct}% alors que le rendement exigé par le marché est de ${yPct}%. Se négocie-t-elle au pair, en prime, ou en décote ?`,
        en: `A bond offers a ${couponPct}% coupon while the market-required yield is ${yPct}%. Does it trade at par, at a premium, or at a discount?`,
      },
      choices: buildChoices([
        { id: "par", label: { fr: "Au pair", en: "At par" } },
        { id: "premium", label: { fr: "En prime (au-dessus du pair)", en: "At a premium (above par)" } },
        { id: "discount", label: { fr: "En décote (en dessous du pair)", en: "At a discount (below par)" } },
      ]),
      hint: { fr: "Comparez le coupon offert au rendement exigé par le marché.", en: "Compare the offered coupon to the market-required yield." },
      correctChoiceIds: [correctId],
      explanation: {
        fr: couponPct > yPct ? `Coupon (${couponPct}%) > rendement exigé (${yPct}%) : les investisseurs sont prêts à payer plus que le nominal, l'obligation se négocie en prime.` : couponPct < yPct ? `Coupon (${couponPct}%) < rendement exigé (${yPct}%) : le prix doit baisser sous le nominal pour offrir un rendement compétitif, l'obligation se négocie en décote.` : "Coupon = rendement exigé : l'obligation se négocie exactement au pair.",
        en: couponPct > yPct ? `Coupon (${couponPct}%) > required yield (${yPct}%): investors are willing to pay more than face value, the bond trades at a premium.` : couponPct < yPct ? `Coupon (${couponPct}%) < required yield (${yPct}%): the price must fall below face value to offer a competitive yield, the bond trades at a discount.` : "Coupon = required yield: the bond trades exactly at par.",
      },
      commonMistake: {
        fr: "Inverser la règle (croire qu'un coupon élevé entraîne une décote).",
        en: "Reversing the rule (thinking a high coupon leads to a discount).",
      },
    };
  },
};

const dirtyCleanTemplate: QuestionTemplate = {
  id: "m03-pricing-dirty-clean",
  conceptId: "m03-pricing-obligation",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const clean = randomInt(rng, 900, 1100);
    const accrued = randomInt(rng, 5, 40);
    const dirty = clean + accrued;

    return {
      prompt: {
        fr: `Le prix coté (clean price) d'une obligation est ${clean}, et le coupon couru depuis le dernier paiement est ${accrued}. Quel est le prix effectivement payé par l'acheteur (dirty price) ?`,
        en: `A bond's quoted (clean) price is ${clean}, and accrued interest since the last payment is ${accrued}. What price does the buyer actually pay (dirty price)?`,
      },
      numericUnit: { fr: "même devise", en: "same currency" },
      numericTolerance: "± 0.5",
      hint: { fr: "Dirty = Clean + Coupon couru.", en: "Dirty = Clean + Accrued interest." },
      numeric: { value: dirty, tolerance: 0.5 },
      calculation: { fr: `Dirty = ${clean} + ${accrued} = ${dirty}.`, en: `Dirty = ${clean} + ${accrued} = ${dirty}.` },
      explanation: {
        fr: "Le clean price est celui affiché sur les écrans de marché ; l'acheteur doit en réalité aussi rembourser au vendeur la part du coupon déjà courue.",
        en: "The clean price is what is displayed on market screens; the buyer must actually also reimburse the seller for the coupon portion already accrued.",
      },
      commonMistake: {
        fr: "Soustraire le coupon couru au lieu de l'ajouter, ou oublier ce paiement lors d'une transaction entre deux dates de coupon.",
        en: "Subtracting accrued interest instead of adding it, or forgetting this payment on a trade between two coupon dates.",
      },
    };
  },
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-pricing-comprehension-utilite",
  conceptId: "m03-pricing-obligation",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi le prix d'une obligation à coupons se calcule-t-il comme la somme de PLUSIEURS flux actualisés, plutôt que comme un seul flux actualisé comme pour un zéro-coupon ?",
    en: "Why is a coupon bond's price computed as the sum of SEVERAL discounted cash flows, rather than a single discounted flow like a zero-coupon?",
  },
  choices: [
    { id: "multiple-flows", label: { fr: "Parce que l'obligation verse plusieurs flux distincts (chaque coupon, puis le nominal) qui doivent chacun être actualisés séparément selon leur propre échéance", en: "Because the bond pays several distinct flows (each coupon, then the face value) that must each be discounted separately according to their own timing" } },
    { id: "convention", label: { fr: "C'est une convention arbitraire sans justification économique", en: "It's an arbitrary convention with no economic justification" } },
    { id: "only-tax", label: { fr: "Uniquement pour des raisons de calcul fiscal", en: "Only for tax calculation reasons" } },
  ],
  correctId: "multiple-flows",
  hint: { fr: "Chaque paiement futur a sa propre date, donc sa propre valeur actuelle.", en: "Each future payment has its own date, hence its own present value." },
  explanation: {
    fr: "Le prix d'un actif est toujours la somme des valeurs actuelles de tous ses flux futurs. Une obligation à coupons verse plusieurs flux (les coupons successifs, puis le remboursement du nominal), chacun à une date différente : il faut donc actualiser chaque flux séparément à sa propre date, puis sommer, contrairement au zéro-coupon qui n'a qu'un seul flux à actualiser.",
    en: "An asset's price is always the sum of the present values of all its future cash flows. A coupon bond pays several flows (successive coupons, then the face value redemption), each at a different date: each flow must therefore be discounted separately to its own date, then summed, unlike the zero-coupon which has only one flow to discount.",
  },
  commonMistake: {
    fr: "Appliquer la formule simplifiée du zéro-coupon (un seul flux) à une obligation à coupons, en oubliant les paiements intermédiaires.",
    en: "Applying the zero-coupon's simplified formula (a single flow) to a coupon bond, forgetting the interim payments.",
  },
});

const compoundingFrequencyComparisonTemplate = mcqTemplate({
  id: "m03-pricing-comparaison-frequence-composition",
  conceptId: "m03-pricing-obligation",
  difficulty: "hard",
  prompt: {
    fr: "Deux obligations ont le même taux annuel nominal et le même rendement annuel nominal, mais l'une verse ses coupons semestriellement (deux fois par an) et l'autre annuellement. Toutes choses égales par ailleurs, laquelle a le prix le plus élevé ?",
    en: "Two bonds have the same nominal annual coupon rate and the same nominal annual yield, but one pays coupons semi-annually (twice a year) and the other annually. All else equal, which one has the higher price?",
  },
  choices: [
    { id: "semiannual", label: { fr: "Celle qui verse semestriellement : les flux sont reçus plus tôt en moyenne", en: "The semi-annual one: the flows are received earlier on average" } },
    { id: "annual", label: { fr: "Celle qui verse annuellement", en: "The annual one" } },
    { id: "same", label: { fr: "Les deux ont exactement le même prix", en: "Both have exactly the same price" } },
  ],
  correctId: "semiannual",
  hint: { fr: "Recevoir une partie de son coupon plus tôt (à mi-année) réduit légèrement le temps d'actualisation moyen de ce flux.", en: "Receiving part of the coupon earlier (mid-year) slightly reduces that flow's average discounting time." },
  explanation: {
    fr: "En versant la moitié du coupon annuel dès le milieu de l'année plutôt que la totalité en fin d'année, l'obligation semestrielle rapproche légèrement ses flux dans le temps, ce qui réduit très légèrement l'actualisation totale et donne un prix (marginalement) plus élevé, à taux annuel nominal identique. C'est un effet subtil mais réel, qui explique pourquoi les conventions de fréquence de coupon doivent être précisées pour comparer rigoureusement deux obligations.",
    en: "By paying half the annual coupon mid-year rather than the whole amount at year-end, the semi-annual bond slightly brings its flows closer in time, which very slightly reduces total discounting and gives a (marginally) higher price, at the same nominal annual rate. This is a subtle but real effect, which is why coupon frequency conventions must be specified to rigorously compare two bonds.",
  },
  commonMistake: {
    fr: "Supposer que le taux annuel nominal suffit à comparer deux obligations sans tenir compte de la fréquence de versement, qui a un effet réel bien que souvent faible sur le prix.",
    en: "Assuming the nominal annual rate is enough to compare two bonds without accounting for payment frequency, which has a real, though often small, effect on price.",
  },
});

const whatIfLongerMaturitySensitivityTemplate = mcqTemplate({
  id: "m03-pricing-whatif-maturite-sensibilite",
  conceptId: "m03-pricing-obligation",
  difficulty: "medium",
  prompt: {
    fr: "Deux obligations à coupon identique ont des maturités différentes : l'une 2 ans, l'autre 20 ans. Si le rendement exigé du marché augmente de 1 point de pourcentage pour les deux, laquelle voit généralement son prix baisser le plus, en pourcentage ?",
    en: "Two bonds with identical coupons have different maturities: one 2 years, the other 20 years. If the market's required yield rises by 1 percentage point for both, which one generally sees its price fall the most, in percentage terms?",
  },
  choices: [
    { id: "long", label: { fr: "L'obligation à 20 ans, dont le prix est plus sensible aux variations de taux", en: "The 20-year bond, whose price is more sensitive to rate changes" } },
    { id: "short", label: { fr: "L'obligation à 2 ans, dont le prix est plus sensible aux variations de taux", en: "The 2-year bond, whose price is more sensitive to rate changes" } },
    { id: "same", label: { fr: "Les deux baissent exactement du même pourcentage", en: "Both fall by exactly the same percentage" } },
  ],
  correctId: "long",
  hint: { fr: "Plus de flux lointains sont actualisés sur une période plus longue : l'effet d'un même taux d'actualisation s'y accumule davantage.", en: "More distant flows are discounted over a longer period: the same discount rate's effect compounds more there." },
  explanation: {
    fr: "Une obligation longue a davantage de flux éloignés dans le temps, chacun d'autant plus sensible à une variation du taux d'actualisation qu'il est lointain (l'effet de (1+y)^t s'accumule sur plus de périodes) : elle est donc structurellement plus sensible aux variations de rendement qu'une obligation courte — l'intuition de base derrière la duration (M03-3).",
    en: "A long bond has more distant flows, each one more sensitive to a change in the discount rate the further out it is (the (1+y)^t effect compounds over more periods): it is therefore structurally more sensitive to yield changes than a short bond — the basic intuition behind duration (M03-3).",
  },
  commonMistake: {
    fr: "Croire que deux obligations au même coupon réagissent de façon identique à une variation de taux, en ignorant l'effet de la maturité sur la sensibilité du prix.",
    en: "Believing two bonds with the same coupon react identically to a rate change, ignoring maturity's effect on price sensitivity.",
  },
});

const whatIfPullToParTemplate = mcqTemplate({
  id: "m03-pricing-whatif-convergence-pair",
  conceptId: "m03-pricing-obligation",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une obligation se négocie en prime (au-dessus du pair) aujourd'hui. Si le rendement exigé du marché reste rigoureusement constant jusqu'à l'échéance, que devient son prix à mesure que le temps passe ?",
    en: "A bond trades at a premium (above par) today. If the market's required yield stays rigorously constant until maturity, what happens to its price as time passes?",
  },
  choices: [
    { id: "converges", label: { fr: "Il converge progressivement vers le pair (la valeur nominale) à mesure que l'échéance approche", en: "It progressively converges toward par (the face value) as maturity approaches" } },
    { id: "diverges", label: { fr: "Il s'éloigne davantage du pair au fil du temps", en: "It moves further away from par over time" } },
    { id: "unchanged", label: { fr: "Il reste rigoureusement constant jusqu'à l'échéance", en: "It stays rigorously constant until maturity" } },
  ],
  correctId: "converges",
  hint: { fr: "À l'échéance, l'obligation rembourse exactement le nominal, ni plus ni moins.", en: "At maturity, the bond redeems exactly the face value, no more, no less." },
  explanation: {
    fr: "À l'échéance, le prix d'une obligation doit obligatoirement converger vers sa valeur nominale, puisque c'est exactement ce montant qui est remboursé. Une obligation en prime voit donc son prix diminuer progressivement vers le pair (le phénomène de « pull-to-par »), même sans aucun mouvement de taux, uniquement du fait du passage du temps — un effet distinct de la sensibilité au taux.",
    en: "At maturity, a bond's price must necessarily converge to its face value, since that is exactly the amount redeemed. A premium bond therefore sees its price gradually decline toward par (the \"pull-to-par\" phenomenon), even with no rate movement at all, purely from the passage of time — an effect distinct from rate sensitivity.",
  },
  commonMistake: {
    fr: "Attribuer toute baisse de prix d'une obligation en prime à une hausse des taux, en oubliant l'effet mécanique de convergence vers le pair à mesure que l'échéance approche.",
    en: "Attributing any price decline of a premium bond to a rate rise, forgetting the mechanical convergence-to-par effect as maturity approaches.",
  },
});

const currentYieldNumericTemplate: QuestionTemplate = {
  id: "m03-pricing-rendement-courant-calcul",
  conceptId: "m03-pricing-obligation",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 20) * 100;
    const couponPct = randomInt(rng, 2, 8);
    const price = randomInt(rng, 850, 1150);
    const coupon = (F * couponPct) / 100;
    const currentYield = Math.round((coupon / price) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Une obligation de nominal F = ${F} verse un coupon annuel de ${couponPct}% et se négocie actuellement à ${price}. Quel est son rendement courant (current yield) ?`,
        en: `A bond with face value F = ${F} pays an annual coupon of ${couponPct}% and currently trades at ${price}. What is its current yield?`,
      },
      numericUnit: { fr: "% par an", en: "% per year" },
      numericTolerance: "± 0.1",
      hint: { fr: "Rendement courant = Coupon annuel en valeur / Prix actuel.", en: "Current yield = Annual coupon amount / Current price." },
      numeric: { value: currentYield, tolerance: 0.1 },
      calculation: {
        fr: `Coupon annuel = ${couponPct}% × ${F} = ${coupon}. Rendement courant = ${coupon} / ${price} ≈ ${currentYield.toFixed(2)}%.`,
        en: `Annual coupon = ${couponPct}% × ${F} = ${coupon}. Current yield = ${coupon} / ${price} ≈ ${currentYield.toFixed(2)}%.`,
      },
      explanation: {
        fr: "Le rendement courant est une mesure simple et rapide (coupon / prix), mais incomplète : contrairement au rendement à l'échéance (YTM), elle ignore la plus ou moins-value en capital que l'investisseur réalisera si l'obligation est achetée en dessous ou au-dessus du pair.",
        en: "The current yield is a simple, quick measure (coupon / price), but incomplete: unlike yield to maturity (YTM), it ignores the capital gain or loss the investor will realize if the bond is bought below or above par.",
      },
      commonMistake: {
        fr: "Confondre le rendement courant avec le rendement à l'échéance (YTM), qui lui prend en compte l'intégralité des flux et le prix d'achat, pas seulement le coupon annuel.",
        en: "Confusing the current yield with yield to maturity (YTM), which accounts for the entire set of flows and the purchase price, not just the annual coupon.",
      },
    };
  },
};

const couponEqualsYtmOnlyAtParErrorTemplate = trueFalseTemplate({
  id: "m03-pricing-erreur-coupon-egal-rendement",
  conceptId: "m03-pricing-obligation",
  difficulty: "medium",
  statement: {
    fr: "Le taux de coupon affiché sur une obligation est toujours égal à son rendement à l'échéance (YTM) actuel, quel que soit son prix de marché.",
    en: "The coupon rate printed on a bond always equals its current yield to maturity (YTM), whatever its market price is.",
  },
  correct: false,
  explanation: {
    fr: "Faux : le taux de coupon est fixé une fois pour toutes à l'émission et ne change jamais, alors que le YTM varie en permanence avec le prix de marché. Les deux ne coïncident exactement que lorsque l'obligation se négocie précisément au pair ; sinon, coupon > YTM en cas de prime, coupon < YTM en cas de décote.",
    en: "False: the coupon rate is fixed once and for all at issuance and never changes, while YTM constantly varies with the market price. The two coincide exactly only when the bond trades precisely at par; otherwise, coupon > YTM at a premium, coupon < YTM at a discount.",
  },
  commonMistake: {
    fr: "Confondre le taux de coupon (fixe, contractuel) avec le rendement à l'échéance (variable, dépendant du prix de marché), qui ne sont identiques qu'au pair.",
    en: "Confusing the coupon rate (fixed, contractual) with yield to maturity (variable, depending on market price), which are identical only at par.",
  },
});

const premiumBondAmortizationScenarioTemplate = mcqTemplate({
  id: "m03-pricing-scenario-obligation-prime-amortissement",
  conceptId: "m03-pricing-obligation",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un investisseur achète une obligation en prime (au-dessus du pair) et la conserve jusqu'à l'échéance, sans aucun mouvement de taux entre-temps. En plus des coupons reçus, quel élément dégrade son rendement total par rapport au coupon affiché ?",
    en: "An investor buys a bond at a premium (above par) and holds it to maturity, with no rate movement in between. Besides the coupons received, what element drags down their total return versus the displayed coupon?",
  },
  choices: [
    { id: "capital-loss", label: { fr: "La moins-value en capital mécanique entre le prix d'achat (au-dessus du pair) et le remboursement (au pair)", en: "The mechanical capital loss between the purchase price (above par) and the redemption (at par)" } },
    { id: "no-effect", label: { fr: "Rien, le rendement total égale toujours exactement le taux de coupon", en: "Nothing, total return always exactly equals the coupon rate" } },
    { id: "extra-gain", label: { fr: "Un gain en capital supplémentaire, en plus des coupons", en: "An extra capital gain, on top of the coupons" } },
  ],
  correctId: "capital-loss",
  hint: { fr: "L'investisseur a payé plus que ce qu'il récupérera à l'échéance : rappelez-vous du pull-to-par.", en: "The investor paid more than what they'll get back at maturity: remember pull-to-par." },
  explanation: {
    fr: "Un acheteur en prime paie plus que le nominal aujourd'hui, mais ne récupère que le nominal à l'échéance : cette moins-value en capital mécanique (liée à la convergence vers le pair) réduit le rendement total réalisé en dessous du simple taux de coupon affiché — c'est précisément ce que le rendement à l'échéance (YTM) capture correctement, contrairement au rendement courant.",
    en: "A premium buyer pays more than face value today, but only recovers face value at maturity: this mechanical capital loss (tied to the pull-to-par convergence) reduces the total realized return below the simple displayed coupon rate — this is precisely what yield to maturity (YTM) correctly captures, unlike the current yield.",
  },
  commonMistake: {
    fr: "Ne raisonner qu'en termes de coupon perçu, en oubliant la moins-value en capital inhérente à tout achat au-dessus du pair conservé jusqu'à l'échéance.",
    en: "Reasoning only in terms of coupon received, forgetting the capital loss inherent to any above-par purchase held to maturity.",
  },
});

const exCouponScenarioTemplate = mcqTemplate({
  id: "m03-pricing-scenario-date-detachement-coupon",
  conceptId: "m03-pricing-obligation",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un vendeur cède son obligation à un acheteur exactement le lendemain d'un versement de coupon. Quel montant de coupon couru l'acheteur doit-il rembourser au vendeur en plus du clean price ?",
    en: "A seller transfers their bond to a buyer the day right after a coupon payment. How much accrued interest must the buyer reimburse the seller on top of the clean price?",
  },
  choices: [
    { id: "near-zero", label: { fr: "Un montant proche de zéro : le coupon vient d'être versé, la période d'accumulation recommence tout juste", en: "An amount close to zero: the coupon was just paid, the accrual period is just starting again" } },
    { id: "full-coupon", label: { fr: "L'équivalent d'un coupon entier, comme si la période était terminée", en: "A full coupon's worth, as if the period had just ended" } },
    { id: "irrelevant", label: { fr: "Le coupon couru n'a de sens que juste avant un paiement, jamais juste après", en: "Accrued interest only makes sense right before a payment, never right after" } },
  ],
  correctId: "near-zero",
  hint: { fr: "Le coupon couru s'accumule progressivement DEPUIS le dernier paiement — que vaut-il juste après ce paiement ?", en: "Accrued interest builds up progressively SINCE the last payment — what is it worth right after that payment?" },
  explanation: {
    fr: "Le coupon couru représente la part du prochain coupon déjà « gagnée » par le vendeur depuis le dernier paiement. Juste après un versement, cette période d'accumulation vient de repartir à zéro : le coupon couru est donc quasiment nul, et le dirty price est presque identique au clean price. C'est juste AVANT le prochain paiement que le coupon couru est maximal, proche d'un coupon entier.",
    en: "Accrued interest represents the portion of the next coupon already \"earned\" by the seller since the last payment. Right after a payment, this accrual period has just restarted from zero: accrued interest is therefore nearly nil, and the dirty price is almost identical to the clean price. It is right BEFORE the next payment that accrued interest is at its maximum, close to a full coupon.",
  },
  commonMistake: {
    fr: "Croire que le coupon couru est toujours substantiel, sans tenir compte du moment précis de la transaction dans le cycle de coupon.",
    en: "Believing accrued interest is always substantial, without accounting for the transaction's precise timing within the coupon cycle.",
  },
});

export const templates: QuestionTemplate[] = [
  bondPriceNumericTemplate,
  priceDirectionTemplate,
  parPremiumDiscountTemplate,
  dirtyCleanTemplate,
  comprehensionTemplate,
  compoundingFrequencyComparisonTemplate,
  whatIfLongerMaturitySensitivityTemplate,
  whatIfPullToParTemplate,
  currentYieldNumericTemplate,
  couponEqualsYtmOnlyAtParErrorTemplate,
  premiumBondAmortizationScenarioTemplate,
  exCouponScenarioTemplate,
];
