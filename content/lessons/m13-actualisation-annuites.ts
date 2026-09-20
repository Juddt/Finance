import type { LessonContent } from "@/lib/lesson-types";

export const m13ActualisationAnnuites: LessonContent = {
  conceptId: "m13-actualisation-annuites",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les intérêts composés et la capitalisation continue.",
      en: "You need to know compound interest and continuous compounding.",
    },
    conceptIds: ["m13-interets-composes"],
  },
  glossary: [
    { term: { fr: "Annuité", en: "Annuity" }, definition: { fr: "Une série de flux de trésorerie identiques versés à intervalles réguliers (par exemple, les coupons d'une obligation, ou les mensualités d'un prêt).", en: "A series of identical cash flows paid at regular intervals (e.g., a bond's coupons, or a loan's monthly payments)." } },
    { term: { fr: "Courbe des taux", en: "Yield curve" }, definition: { fr: "La représentation graphique des taux d'intérêt en fonction de leur maturité, déjà rencontrée en M03.", en: "The graphical representation of interest rates as a function of maturity, already encountered in M03." } },
  ],
  intuition: {
    fr: "Actualiser un flux futur, c'est répondre à la question inverse de la capitalisation : combien vaut aujourd'hui un euro que je recevrai dans un an ? Moins qu'un euro, puisque j'aurais pu placer cet euro aujourd'hui et le voir grandir — l'actualisation \"ramène\" une valeur future à sa valeur équivalente présente.",
    en: "Discounting a future cash flow answers compounding's inverse question: how much is a euro I'll receive in a year worth today? Less than a euro, since I could invest that euro today and watch it grow — discounting \"brings back\" a future value to its equivalent present value.",
  },
  definition: {
    fr: "La valeur actualisée d'un flux futur F reçu dans t années est VA = F × e^(−rt) (capitalisation continue) ou F/(1+r)^t (composée discrète) — l'opération inverse de la capitalisation (M13-mathfin-a). Une annuité (série de flux identiques F sur n périodes) a une valeur actualisée qui se calcule en sommant chaque flux actualisé individuellement, ou via une formule fermée pour une annuité constante. Le rendement (yield) d'un titre est le taux r qui égalise la somme des flux actualisés à son prix de marché observé.",
    en: "A future cash flow F received in t years' present value is PV = F × e^(−rt) (continuous compounding) or F/(1+r)^t (discrete compound) — the inverse operation of compounding (M13-mathfin-a). An annuity (a series of identical flows F over n periods) has a present value computed by summing each individually discounted flow, or via a closed formula for a constant annuity. A security's yield is the rate r that equates the sum of discounted flows to its observed market price.",
  },
  utility: {
    fr: "L'actualisation est l'opération centrale de toute valorisation financière : le prix d'une obligation (M03-2), d'une action (via les dividendes futurs actualisés), ou d'un projet d'investissement (valeur actuelle nette) repose entièrement sur ce principe. Comprendre une courbe de taux permet de lire directement le prix du temps et du risque de crédit sur le marché.",
    en: "Discounting is the central operation of all financial valuation: a bond's price (M03-2), a stock's (via discounted future dividends), or an investment project's (net present value) rests entirely on this principle. Understanding a yield curve lets you directly read the market's pricing of time and credit risk.",
  },
  example: {
    fr: "Un prêt immobilier verse des mensualités constantes de 1200 € pendant 20 ans (n=240 mois) à un taux annuel de 3%, soit un taux mensuel r=3%/12=0,25%. En appliquant la formule fermée VA=F×(1−(1+r)^−n)/r avec F=1200 : VA=1200×(1−1,0025^−240)/0,0025≈1200×180,3≈216 400 €. C'est le montant maximal empruntable aujourd'hui pour cette mensualité, ce taux et cette durée.",
    en: "A mortgage pays constant installments of €1,200 for 20 years (n=240 months) at a 3% annual rate, i.e. a monthly rate r=3%/12=0.25%. Applying the closed formula PV=F×(1−(1+r)^−n)/r with F=1200: PV=1200×(1−1.0025^−240)/0.0025≈1200×180.3≈€216,400. This is the maximum amount borrowable today for this installment, rate and duration.",
  },
  alternativeExplanation: {
    fr: "Imaginez recevoir la promesse d'un ami de vous rendre 100 € dans un an : cette promesse ne vaut pas 100 € aujourd'hui, elle vaut un peu moins, car vous auriez pu placer ces 100 € entre-temps. L'actualisation calcule précisément combien \"un peu moins\" représente, en fonction du taux auquel vous auriez pu placer cet argent.",
    en: "Imagine receiving a friend's promise to repay you €100 in a year: this promise isn't worth €100 today, it's worth a bit less, since you could have invested those €100 in the meantime. Discounting precisely calculates how much \"a bit less\" represents, based on the rate at which you could have invested that money.",
  },
  formula: {
    latex: "VA_{\\text{annuité}} = F \\times \\frac{1 - (1+r)^{-n}}{r}",
    variables: [
      { symbol: "F", description: { fr: "Montant constant de chaque flux périodique", en: "Constant amount of each periodic flow" } },
      { symbol: "n", description: { fr: "Nombre total de périodes", en: "Total number of periods" } },
    ],
    assumptions: { fr: "Annuité constante (flux identiques), taux constant sur toute la période ; une version \"annuité due\" (paiement en début de période) multiplie ce résultat par (1+r).", en: "Constant annuity (identical flows), constant rate throughout the period; an \"annuity due\" version (payment at period start) multiplies this result by (1+r)." },
    units: { fr: "Même devise que F.", en: "Same currency as F." },
    example: { fr: "F=1200 €/mois, r mensuel=0,25%, n=240 mois : VA=1200×(1−1,0025^−240)/0,0025≈216 400 €, montant total empruntable, obtenu par la formule fermée plutôt que 240 actualisations séparées.", en: "F=€1,200/month, monthly r=0.25%, n=240 months: PV=1200×(1−1.0025^−240)/0.0025≈€216,400, the total borrowable amount, obtained via the closed formula rather than 240 separate discountings." },
  },
  calculation: {
    fr: "1) Convertir le taux annuel au taux de la période de l'annuité (mensuel, trimestriel...) : 3%/12=0,25% par mois. 2) Vérifier si les flux sont versés en fin (annuité ordinaire) ou en début de période (annuité due). 3) Appliquer la formule fermée pour une annuité constante : VA=1200×(1−1,0025^−240)/0,0025≈216 400 €, ou sommer chaque flux actualisé individuellement pour des flux variables. 4) Pour trouver un yield à partir d'un prix observé, résoudre l'équation implicitement (aucune formule fermée générale, méthode itérative).",
    en: "1) Convert the annual rate to the annuity's period rate (monthly, quarterly...): 3%/12=0.25% per month. 2) Check whether flows are paid at period end (ordinary annuity) or start (annuity due). 3) Apply the closed formula for a constant annuity: PV=1200×(1−1.0025^−240)/0.0025≈€216,400, or sum each individually discounted flow for variable flows. 4) To find a yield from an observed price, solve the equation implicitly (no general closed formula, iterative method).",
  },
  chart: {
    kind: "line",
    xLabel: { fr: "Années écoulées", en: "Years elapsed" },
    yLabel: { fr: "Capital restant dû (€)", en: "Outstanding balance (€)" },
    series: [
      {
        label: { fr: "Prêt 216 400 € à 3%, 20 ans", en: "€216,400 loan at 3%, 20 years" },
        points: [
          { x: 0, y: 216400 },
          { x: 2, y: 200100 },
          { x: 4, y: 182800 },
          { x: 6, y: 164400 },
          { x: 8, y: 145000 },
          { x: 10, y: 124300 },
          { x: 12, y: 102200 },
          { x: 14, y: 79000 },
          { x: 16, y: 54200 },
          { x: 18, y: 27900 },
          { x: 20, y: 0 },
        ],
      },
    ],
  },
  interpretation: {
    fr: "Une courbe des taux croissante (taux longs plus élevés que les taux courts) signifie que le marché exige une compensation plus élevée pour immobiliser du capital plus longtemps ; une courbe inversée (taux courts plus élevés) est souvent interprétée comme un signal anticipé de ralentissement économique. Le taux d'actualisation utilisé a un impact direct et souvent sous-estimé sur la valeur actuelle calculée, en particulier pour des flux lointains.",
    en: "An upward-sloping yield curve (long rates higher than short rates) means the market demands higher compensation for locking up capital longer; an inverted curve (short rates higher) is often interpreted as an anticipated signal of economic slowdown. The discount rate used has a direct, often underestimated, impact on the computed present value, particularly for distant cash flows.",
  },
  pitfalls: {
    fr: "Utiliser un taux annuel directement pour actualiser des flux mensuels sans le convertir au taux mensuel équivalent — une erreur fréquente qui fausse significativement le résultat. Autre piège : oublier qu'un flux très éloigné dans le temps a une valeur actualisée qui tend vers zéro, ce qui rend un projet avec des gains lointains beaucoup moins attractif qu'il n'y paraît en valeur nominale.",
    en: "Directly using an annual rate to discount monthly flows without converting it to the equivalent monthly rate — a frequent error that significantly distorts the result. Another trap: forgetting a very distant cash flow's present value tends toward zero, making a project with distant gains much less attractive than its nominal value suggests.",
  },
  keyPoints: {
    fr: [
      "L'actualisation est l'inverse de la capitalisation : VA = F × e^(−rt) ou F/(1+r)^t.",
      "Une annuité constante a une formule fermée de valeur actuelle, évitant de sommer chaque flux individuellement.",
      "Le yield d'un titre est le taux qui égalise ses flux futurs actualisés à son prix de marché observé.",
    ],
    en: [
      "Discounting is compounding's inverse: PV = F × e^(−rt) or F/(1+r)^t.",
      "A constant annuity has a closed present-value formula, avoiding summing each flow individually.",
      "A security's yield is the rate equating its discounted future flows to its observed market price.",
    ],
  },
  advancedDemonstration: {
    fr: "La formule fermée de l'annuité se démontre comme une série géométrique : VA = F×Σ(1+r)^(−k) pour k=1 à n, dont la somme se simplifie en F×(1−(1+r)^(−n))/r grâce à la formule de la somme d'une suite géométrique — un lien direct avec la façon dont une obligation à coupon fixe (M03-2) se décompose exactement en une annuité (les coupons) plus un flux unique actualisé (le remboursement du nominal à l'échéance).",
    en: "The annuity's closed formula is proved as a geometric series: PV = F×Σ(1+r)^(−k) for k=1 to n, whose sum simplifies to F×(1−(1+r)^(−n))/r via the geometric series sum formula — a direct link to how a fixed-coupon bond (M03-2) decomposes exactly into an annuity (the coupons) plus a single discounted flow (the face value repayment at maturity).",
  },
  businessApplication: {
    fr: "Un desk ALM (gestion actif-passif) ou de gestion de fortune utilise ce calcul quotidiennement : valoriser un passif de retraite futur, dimensionner un prêt immobilier proposé à un client, ou comparer deux offres de financement à mensualités différentes mais échéances différentes — toutes ces décisions reposent sur la même actualisation de flux futurs, jamais sur une comparaison naïve des montants nominaux.",
    en: "An ALM (asset-liability management) or wealth management desk uses this calculation daily: valuing a future pension liability, sizing a mortgage offered to a client, or comparing two financing offers with different installments but different terms — all these decisions rest on the same discounting of future flows, never on a naive comparison of nominal amounts.",
  },
  interviewQuestion: {
    question: "A client tells you they can afford $1,500 a month and wants to know the maximum they could borrow over 25 years at a 4% annual rate. Walk me through how you'd compute that, step by step.",
    answer: "First convert the annual rate to the monthly period rate: 4%/12 ≈ 0.333% per month, and the term to months: 25×12=300. Then apply the annuity present-value formula, PV = F×(1−(1+r)^−n)/r, with F=$1,500, r=0.333%, n=300 — that gives the present value of all 300 monthly payments, which is exactly the amount the bank would be willing to lend today for that installment. I'd sanity-check the order of magnitude: at roughly 0.33% monthly over 300 months, the annuity factor is around 189, so the borrowable amount comes out near $283,000. I'd flag that this assumes a constant rate over the full 25 years and ignores fees or early-repayment options, which would adjust the real-world figure.",
  },
};
