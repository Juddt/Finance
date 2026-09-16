import { randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

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

export const templates: QuestionTemplate[] = [bondPriceNumericTemplate, priceDirectionTemplate, parPremiumDiscountTemplate, dirtyCleanTemplate];
