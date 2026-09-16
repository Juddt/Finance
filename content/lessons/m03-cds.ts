import type { LessonContent } from "@/lib/lesson-types";

export const m03Cds: LessonContent = {
  conceptId: "m03-cds",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir ce qu'est le risque de crédit et le rôle d'une notation, présentés dans la notion précédente.",
      en: "You need to know what credit risk is and what rating agencies do, covered in the previous concept.",
    },
    conceptIds: ["m03-risque-credit"],
  },
  glossary: [
    { term: { fr: "Événement de crédit", en: "Credit event" }, definition: { fr: "Un défaut, une restructuration ou un moratoire de l'entité de référence, déclenchant le paiement de protection.", en: "A default, restructuring or moratorium of the reference entity, triggering the protection payment." } },
    { term: { fr: "Taux de recouvrement (Recovery Rate)", en: "Recovery rate" }, definition: { fr: "La fraction de la valeur nominale que les créanciers récupèrent malgré le défaut (souvent 30-40% pour la dette senior non garantie).", en: "The fraction of face value creditors recover despite the default (often 30-40% for senior unsecured debt)." } },
  ],
  intuition: {
    fr: "Un CDS est une assurance contre le défaut d'un emprunteur : l'acheteur de protection paie une prime régulière, et reçoit un paiement compensatoire si l'emprunteur fait défaut — exactement comme une assurance habitation contre l'incendie.",
    en: "A CDS is insurance against a borrower's default: the protection buyer pays a regular premium, and receives a compensating payment if the borrower defaults — exactly like fire insurance on a house.",
  },
  definition: {
    fr: "Un Credit Default Swap (CDS) est un contrat entre un acheteur de protection, qui verse une prime périodique (le spread CDS, en points de base du notionnel) au vendeur de protection, en échange d'un paiement si un événement de crédit affecte l'entité de référence. Le règlement se fait en général en cash : le vendeur paie Notionnel × (1 − Taux de recouvrement).",
    en: "A Credit Default Swap (CDS) is a contract between a protection buyer, who pays a periodic premium (the CDS spread, in basis points of notional) to the protection seller, in exchange for a payment if a credit event affects the reference entity. Settlement is usually in cash: the seller pays Notional × (1 − Recovery rate).",
  },
  utility: {
    fr: "Le CDS permet à un créancier de se couvrir contre le défaut d'un émetteur sans vendre sa créance, ou à un investisseur de spéculer sur la qualité de crédit d'une entité sans détenir sa dette. Le spread CDS coté sur le marché est aussi la mesure la plus directe et la plus réactive de la perception du risque de défaut d'une entité.",
    en: "A CDS lets a creditor hedge against an issuer's default without selling the underlying debt, or lets an investor speculate on an entity's credit quality without holding its debt. The market-quoted CDS spread is also the most direct and reactive measure of the market's perception of an entity's default risk.",
  },
  example: {
    fr: "Une banque détient 10 000 000 EUR d'obligations d'une entreprise notée BBB et s'inquiète d'un défaut. Elle achète une protection CDS à 150 points de base (1,5%) sur ce notionnel : elle paie 150 000 EUR par an. Si l'entreprise fait défaut avec un recouvrement de 35%, elle reçoit 10 000 000 × (1 − 0,35) = 6 500 000 EUR, ce qui compense la perte sur ses obligations.",
    en: "A bank holds EUR 10,000,000 of bonds from a BBB-rated company and worries about default. It buys CDS protection at 150 basis points (1.5%) on this notional: it pays EUR 150,000 per year. If the company defaults with a 35% recovery rate, it receives 10,000,000 × (1 − 0.35) = EUR 6,500,000, offsetting the loss on its bonds.",
  },
  alternativeExplanation: {
    fr: "Pensez au spread CDS comme à une prime d'assurance auto : plus le conducteur (l'émetteur) est jugé risqué, plus la prime annuelle est élevée. Le montant payé chaque année ne dépend pas de la survenance ou non de l'accident (le défaut) ; seul le paiement en cas de sinistre en dépend.",
    en: "Think of the CDS spread as a car insurance premium: the riskier the driver (the issuer) is judged to be, the higher the annual premium. The amount paid each year does not depend on whether the accident (the default) actually happens; only the payout in case of a claim depends on that.",
  },
  formula: {
    latex: "\\text{Prime annuelle} = \\text{Notionnel} \\times \\text{Spread CDS} \\quad ; \\quad PD \\approx \\frac{\\text{Spread CDS}}{1 - R}",
    variables: [
      { symbol: "\\text{Spread CDS}", description: { fr: "Le taux annuel coté sur le marché, en proportion (ex. 150 pb = 0,015)", en: "The annual rate quoted in the market, as a proportion (e.g. 150 bp = 0.015)" } },
      { symbol: "R", description: { fr: "Taux de recouvrement supposé", en: "Assumed recovery rate" } },
      { symbol: "PD", description: { fr: "Probabilité de défaut annuelle implicite (approximation)", en: "Implied annual default probability (approximation)" } },
    ],
    assumptions: { fr: "Approximation simple à horizon 1 an sous mesure risque-neutre (pas la probabilité réelle/historique) ; ignore l'actualisation et la structure par termes du spread.", en: "Simple 1-year approximation under the risk-neutral measure (not the real-world/historical probability); ignores discounting and the spread's term structure." },
    units: { fr: "Spread en proportion annuelle ; PD en proportion annuelle.", en: "Spread as an annual proportion; PD as an annual proportion." },
    example: { fr: "Spread = 1,5%, R = 35% : PD ≈ 0,015 / 0,65 ≈ 2,31% par an.", en: "Spread = 1.5%, R = 35%: PD ≈ 0.015 / 0.65 ≈ 2.31% per year." },
  },
  calculation: {
    fr: "1) Relever le spread CDS coté et le notionnel couvert. 2) Prime annuelle = Notionnel × Spread. 3) Pour estimer la PD implicite : diviser le spread par (1 − taux de recouvrement supposé). 4) En cas de défaut : paiement = Notionnel × (1 − R).",
    en: "1) Read off the quoted CDS spread and the notional covered. 2) Annual premium = Notional × Spread. 3) To estimate the implied PD: divide the spread by (1 − assumed recovery rate). 4) On default: payout = Notional × (1 − R).",
  },
  interpretation: {
    fr: "Un spread CDS qui s'élargit signale que le marché perçoit un risque de défaut croissant — c'est souvent un signal plus rapide qu'une révision de notation par une agence, qui réagit avec un décalage. Le spread agrège en un seul chiffre le risque de défaut ET l'aversion au risque du marché à cet instant.",
    en: "A widening CDS spread signals the market perceives rising default risk — often a faster signal than a rating agency's revision, which reacts with a lag. The spread aggregates in one number both default risk AND the market's risk aversion at that moment.",
  },
  pitfalls: {
    fr: "Confondre la PD implicite du CDS (mesure risque-neutre, qui inclut une prime de risque) avec la PD réelle/historique (mesure physique, souvent plus basse) : les deux répondent à des questions différentes. Autre piège : oublier que le paiement dépend du taux de recouvrement, qui est lui-même incertain et varie selon le rang de la dette (senior vs subordonnée).",
    en: "Confusing the CDS-implied PD (risk-neutral measure, which includes a risk premium) with the real-world/historical PD (physical measure, often lower): the two answer different questions. Another trap: forgetting the payout depends on the recovery rate, which is itself uncertain and varies with debt seniority (senior vs subordinated).",
  },
  keyPoints: {
    fr: [
      "CDS = assurance contre le défaut : prime périodique contre paiement conditionnel à l'événement de crédit.",
      "PD implicite ≈ Spread / (1 − Recouvrement) : une approximation simple, pas la vraie probabilité historique.",
      "Le spread CDS réagit souvent plus vite qu'une notation aux nouvelles informations sur l'émetteur.",
    ],
    en: [
      "CDS = default insurance: periodic premium against a payment conditional on the credit event.",
      "Implied PD ≈ Spread / (1 − Recovery): a simple approximation, not the true historical probability.",
      "The CDS spread often reacts faster than a rating to new information about the issuer.",
    ],
  },
  advancedDemonstration: {
    fr: "Estimer une probabilité de défaut peut se faire par trois familles de modèles, à choisir selon la donnée disponible et l'usage visé. (1) Modèles structurels (Merton) : modélisent la valeur des actifs de l'entreprise comme un processus stochastique et le défaut comme le franchissement d'une barrière (la dette) — utiles quand on dispose de données de marché actions et de bilan, mais sensibles aux hypothèses sur la volatilité des actifs. (2) Modèles réduits (reduced-form / à intensité de hasard), dont le CDS ci-dessus est un cas simple : ils calibrent directement un taux de défaut instantané λ(t) à partir des prix de marché (spreads CDS ou obligataires), sans modéliser pourquoi le défaut survient — utiles pour le pricing risk-neutral et la cohérence avec les prix cotés. (3) Modèles empiriques/historiques (matrices de transition de notation, scoring) : estiment une PD réelle à partir de fréquences de défaut observées par classe de notation — utiles pour la gestion de portefeuille et le provisionnement, mais réagissent lentement. En pratique, un desk de trading crédit utilise (2) pour pricer, un gérant utilise (3) pour son budget de risque, et (1) sert surtout en recherche ou pour des émetteurs sans CDS coté.",
    en: "Estimating a default probability can be done with three families of models, chosen based on available data and intended use. (1) Structural models (Merton): model the firm's asset value as a stochastic process and default as the value crossing a barrier (the debt) — useful when equity market data and balance-sheet data are available, but sensitive to assumptions about asset volatility. (2) Reduced-form (hazard-rate) models, of which the CDS approximation above is a simple case: directly calibrate an instantaneous default intensity λ(t) from market prices (CDS or bond spreads), without modeling why default happens — useful for risk-neutral pricing and consistency with quoted prices. (3) Empirical/historical models (rating transition matrices, scoring): estimate a real-world PD from observed default frequencies per rating class — useful for portfolio management and provisioning, but react slowly. In practice, a credit trading desk uses (2) to price, a portfolio manager uses (3) for risk budgeting, and (1) is mostly used in research or for issuers with no quoted CDS.",
  },
};
