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
    fr: "Un prêt immobilier verse des mensualités constantes de 1200 € pendant 20 ans à un taux annuel de 3%. La valeur actualisée de cette annuité (le montant emprunté aujourd'hui) se calcule en sommant chaque mensualité future actualisée au taux mensuel équivalent — c'est exactement ce calcul qui détermine, à l'inverse, le montant empruntable pour une mensualité donnée.",
    en: "A mortgage pays constant installments of €1,200 for 20 years at a 3% annual rate. This annuity's present value (the amount borrowed today) is computed by summing each future installment discounted at the equivalent monthly rate — this is exactly the calculation that, conversely, determines the borrowable amount for a given installment.",
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
    example: { fr: "F=1200/12 par mois, r mensuel≈0,25%, n=240 mois : VA ≈ montant total empruntable, calculé par la formule fermée plutôt que 240 actualisations séparées.", en: "F=1200/12 per month, monthly r≈0.25%, n=240 months: PV ≈ total borrowable amount, computed via the closed formula rather than 240 separate discountings." },
  },
  calculation: {
    fr: "1) Convertir le taux annuel au taux de la période de l'annuité (mensuel, trimestriel...). 2) Vérifier si les flux sont versés en fin (annuité ordinaire) ou en début de période (annuité due). 3) Appliquer la formule fermée pour une annuité constante, ou sommer chaque flux actualisé individuellement pour des flux variables. 4) Pour trouver un yield à partir d'un prix observé, résoudre l'équation implicitement (aucune formule fermée générale, méthode itérative).",
    en: "1) Convert the annual rate to the annuity's period rate (monthly, quarterly...). 2) Check whether flows are paid at period end (ordinary annuity) or start (annuity due). 3) Apply the closed formula for a constant annuity, or sum each individually discounted flow for variable flows. 4) To find a yield from an observed price, solve the equation implicitly (no general closed formula, iterative method).",
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
};
