import type { LessonContent } from "@/lib/lesson-types";

export const m01OrganisationBanque: LessonContent = {
  conceptId: "m01-organisation-banque",
  glossary: [
    { term: { fr: "Front office", en: "Front office" }, definition: { fr: "Les équipes qui négocient directement avec le marché ou les clients (traders, sales, banquiers d'affaires) et génèrent le revenu.", en: "The teams that trade directly with the market or clients (traders, sales, investment bankers) and generate revenue." } },
    { term: { fr: "Middle office", en: "Middle office" }, definition: { fr: "Les équipes de contrôle des risques et de validation des opérations, indépendantes du front office.", en: "The risk-control and trade-validation teams, independent from the front office." } },
    { term: { fr: "Back office", en: "Back office" }, definition: { fr: "Les équipes qui gèrent le règlement-livraison, la comptabilité et l'administratif des opérations déjà conclues.", en: "The teams handling settlement, accounting and administrative processing of already-concluded trades." } },
  ],
  intuition: {
    fr: "Une banque de marché n'est pas un bloc unique : chaque opération passe par trois équipes distinctes et volontairement séparées, un peu comme un restaurant où celui qui prend la commande, celui qui vérifie l'addition, et celui qui encaisse ne sont jamais la même personne.",
    en: "A markets bank is not a single block: every trade passes through three distinct, deliberately separated teams — a bit like a restaurant where the person taking the order, the one checking the bill, and the one handling payment are never the same person.",
  },
  definition: {
    fr: "Le front office négocie et génère le revenu (traders, sales, structureurs). Le middle office contrôle les risques et valide indépendamment chaque opération (risk management, contrôle des limites). Le back office gère le règlement-livraison et la comptabilité une fois l'opération validée. Cette séparation des tâches (\"Chinese wall\") empêche qu'une même personne négocie, valide et règle sa propre opération.",
    en: "The front office trades and generates revenue (traders, sales, structurers). The middle office controls risk and independently validates each trade (risk management, limit monitoring). The back office handles settlement and accounting once the trade is validated. This separation of duties (a \"Chinese wall\") prevents the same person from trading, validating and settling their own trade.",
  },
  utility: {
    fr: "Comprendre cette organisation est indispensable pour situer n'importe quel métier de banque de marché, et pour comprendre pourquoi certains scandales financiers (Kerviel, Leeson) sont précisément survenus quand cette séparation a été contournée.",
    en: "Understanding this organization is essential to place any markets-bank job, and to understand why several financial scandals (Kerviel, Leeson) happened precisely when this separation was bypassed.",
  },
  example: {
    fr: "Un trader (front office) achète des obligations. Le middle office vérifie que cette position respecte les limites de risque fixées et que le prix est cohérent avec le marché (contrôle indépendant, pas de confiance aveugle). Le back office règle effectivement la transaction avec la contrepartie et l'enregistre en comptabilité, plusieurs jours après la négociation.",
    en: "A trader (front office) buys bonds. The middle office checks the position respects the set risk limits and that the price is consistent with the market (independent control, no blind trust). The back office actually settles the transaction with the counterparty and records it in the books, several days after the trade.",
  },
  alternativeExplanation: {
    fr: "Pensez à un contrôle de sécurité aéroportuaire : le pilote (front office) fait voler l'avion, mais ne vérifie pas lui-même la maintenance de son propre appareil — un service indépendant (middle office) le fait, précisément parce qu'on ne peut pas être juge et partie sur ses propres décisions à risque.",
    en: "Think of airport security: the pilot (front office) flies the plane, but does not personally check their own aircraft's maintenance — an independent service (middle office) does it, precisely because one cannot be judge and party on one's own risky decisions.",
  },
  formula: {
    latex: "\\text{Coefficient d'exploitation} = \\frac{\\text{Charges d'exploitation}}{\\text{Produit net bancaire}}",
    variables: [
      { symbol: "\\text{Charges d'exploitation}", description: { fr: "Coûts de fonctionnement (salaires, systèmes, locaux...) de toutes les fonctions de la banque", en: "Operating costs (salaries, systems, premises...) across all of the bank's functions" } },
      { symbol: "\\text{Produit net bancaire}", description: { fr: "Le revenu net généré par les activités de la banque (l'équivalent bancaire du chiffre d'affaires)", en: "The bank's net revenue (the banking equivalent of turnover)" } },
    ],
    assumptions: { fr: "Indicateur usuel pour comparer l'efficacité opérationnelle entre banques, toutes fonctions confondues.", en: "A common metric to compare operational efficiency across banks, across all functions." },
    units: { fr: "Ratio sans dimension, généralement exprimé en %.", en: "Dimensionless ratio, usually expressed as a %." },
    example: { fr: "Charges = 6 milliards, PNB = 10 milliards : coefficient d'exploitation = 60%.", en: "Costs = 6 billion, net revenue = 10 billion: cost-income ratio = 60%." },
  },
  calculation: {
    fr: "1) Identifier les charges d'exploitation totales de la banque sur la période. 2) Identifier le produit net bancaire (revenu net) sur la même période. 3) Diviser les charges par le revenu. 4) Un coefficient plus bas signale une structure plus efficiente (plus de revenu généré par euro de coût).",
    en: "1) Identify the bank's total operating costs over the period. 2) Identify net banking revenue over the same period. 3) Divide costs by revenue. 4) A lower ratio signals a more efficient structure (more revenue generated per euro of cost).",
  },
  interpretation: {
    fr: "Ce ratio résume en un chiffre l'efficience de toute l'organisation (front, middle, back confondus) : une banque doit maintenir un middle et un back office solides pour la maîtrise des risques, tout en restant compétitive sur ses coûts — un vrai arbitrage stratégique.",
    en: "This ratio summarizes the whole organization's efficiency (front, middle and back combined) in one number: a bank must maintain a solid middle and back office for risk control, while staying cost-competitive — a real strategic trade-off.",
  },
  pitfalls: {
    fr: "Croire que le middle office est une fonction secondaire ou moins stratégique que le front : c'est justement son indépendance qui a évité (ou aurait pu éviter) plusieurs pertes catastrophiques. Autre piège : penser que le back office ne fait \"que\" de l'administratif — une erreur de règlement-livraison peut coûter très cher.",
    en: "Believing the middle office is a secondary or less strategic function than the front: it is precisely its independence that has prevented (or could have prevented) several catastrophic losses. Another trap: thinking the back office is \"just\" administrative — a settlement error can be very costly.",
  },
  keyPoints: {
    fr: [
      "Front office négocie, middle office contrôle indépendamment, back office règle et comptabilise.",
      "Cette séparation des tâches empêche qu'une même personne négocie, valide et règle sa propre opération.",
      "Le coefficient d'exploitation résume l'efficience opérationnelle de l'ensemble de ces fonctions.",
    ],
    en: [
      "Front office trades, middle office independently controls, back office settles and books.",
      "This separation of duties prevents the same person from trading, validating and settling their own trade.",
      "The cost-income ratio summarizes the operational efficiency of all these functions combined.",
    ],
  },
  advancedDemonstration: {
    fr: "Les scandales de \"trader voyou\" (Jérôme Kerviel chez Société Générale en 2008, Nick Leeson chez Barings en 1995) partagent un point commun structurel : dans les deux cas, le trader avait, à un moment de sa carrière, occupé un poste de back/middle office, connaissait donc les failles de contrôle, et a pu dissimuler des positions en contournant ou exploitant des faiblesses dans la séparation des tâches. Ces affaires ont directement mené au renforcement réglementaire des contrôles indépendants (Bâle II/III, voir la catégorie Réglementation) et à l'automatisation accrue du rapprochement entre positions déclarées par le front et positions réelles confirmées par la contrepartie.",
    en: "\"Rogue trader\" scandals (Jérôme Kerviel at Société Générale in 2008, Nick Leeson at Barings in 1995) share a structural common point: in both cases, the trader had, at some point in their career, held a back/middle office role, and so knew the control gaps, and was able to hide positions by bypassing or exploiting weaknesses in the separation of duties. These cases directly led to stronger regulatory requirements for independent controls (Basel II/III, see the Regulation category) and increased automation of reconciliation between positions declared by the front and real positions confirmed by the counterparty.",
  },
};
