import type { LessonContent } from "@/lib/lesson-types";

export const m07VolTargetCppi: LessonContent = {
  conceptId: "m07-vol-target-cppi",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître le principe du rééquilibrage dynamique vu avec le delta-hedging.",
      en: "You need to know the dynamic rebalancing principle seen with delta-hedging.",
    },
    conceptIds: ["m07-delta-hedging"],
  },
  glossary: [
    { term: { fr: "Coussin (cushion)", en: "Cushion" }, definition: { fr: "Dans un CPPI, la différence entre la valeur actuelle du portefeuille et le plancher garanti — la marge de sécurité disponible.", en: "In a CPPI, the gap between the portfolio's current value and the guaranteed floor — the available safety margin." } },
    { term: { fr: "Multiplicateur", en: "Multiplier" }, definition: { fr: "Dans un CPPI, le facteur qui détermine combien de fois le coussin est investi en actif risqué.", en: "In a CPPI, the factor determining how many times the cushion is invested in the risky asset." } },
  ],
  intuition: {
    fr: "Deux stratégies dynamiques bien connues ajustent en continu l'exposition au risque, mais selon des logiques différentes : le Vol Target vise une volatilité de portefeuille constante en ajustant l'exposition inversement à la volatilité observée ; le CPPI protège un capital plancher en réduisant l'exposition au risque à mesure que le portefeuille s'approche de ce plancher.",
    en: "Two well-known dynamic strategies continuously adjust risk exposure, but with different logics: Vol Target aims for constant portfolio volatility by adjusting exposure inversely to observed volatility; CPPI protects a capital floor by reducing risk exposure as the portfolio approaches that floor.",
  },
  definition: {
    fr: "Vol Target : l'allocation à l'actif risqué est fixée à min(1, σ_cible/σ_réalisée estimée), de sorte que la volatilité du portefeuille reste proche d'un niveau cible constant, quelle que soit la volatilité du marché. CPPI (Constant Proportion Portfolio Insurance) : l'exposition à l'actif risqué est E = m × Coussin, où le coussin = Valeur du portefeuille − Plancher actualisé, et m est un multiplicateur fixé ; le reste est investi en actif sans risque.",
    en: "Vol Target: the allocation to the risky asset is set at min(1, σ_target/estimated realized σ), so the portfolio's volatility stays close to a constant target level, whatever the market's volatility. CPPI (Constant Proportion Portfolio Insurance): the risky asset exposure is E = m × Cushion, where cushion = Portfolio value − Discounted floor, and m is a fixed multiplier; the remainder is invested in the risk-free asset.",
  },
  utility: {
    fr: "Ces mécanismes sont au cœur de nombreux produits structurés (voir M11) : les fonds à \"volatilité cible\" attirent des investisseurs cherchant un profil de risque stable, et les CPPI/fonds à capital garanti attirent ceux cherchant une protection du capital tout en gardant un potentiel de hausse.",
    en: "These mechanisms are central to many structured products (see M11): \"target volatility\" funds attract investors seeking a stable risk profile, and CPPI/capital-guaranteed funds attract those seeking capital protection while keeping upside potential.",
  },
  example: {
    fr: "CPPI : portefeuille = 100, plancher actualisé = 90, multiplicateur m=5. Coussin = 100−90 = 10. Exposition à l'actif risqué = 5×10 = 50 (le reste, 50, en actif sans risque). Si le marché baisse et que le portefeuille tombe à 95, le coussin devient 95−90=5 (en supposant le plancher actualisé stable), et l'exposition doit être réduite à 5×5=25 — le mécanisme désinvestit automatiquement à mesure que le coussin se réduit.",
    en: "CPPI: portfolio = 100, discounted floor = 90, multiplier m=5. Cushion = 100−90 = 10. Risky asset exposure = 5×10 = 50 (the rest, 50, in the risk-free asset). If the market falls and the portfolio drops to 95, the cushion becomes 95−90=5 (assuming a stable discounted floor), and exposure must be reduced to 5×5=25 — the mechanism automatically de-risks as the cushion shrinks.",
  },
  alternativeExplanation: {
    fr: "Le Vol Target ressemble à un conducteur qui accélère sur une route dégagée (faible volatilité) et ralentit dès que la circulation devient dense (forte volatilité), pour garder une sensation de vitesse constante. Le CPPI ressemble à un funambule avec un filet de sécurité : plus il s'approche du filet (le plancher), plus il avance prudemment (réduit son exposition), et plus il en est loin (coussin large), plus il peut se permettre de prendre des risques.",
    en: "Vol Target is like a driver who speeds up on a clear road (low volatility) and slows down once traffic gets dense (high volatility), to maintain a constant feeling of speed. CPPI is like a tightrope walker with a safety net: the closer they get to the net (the floor), the more cautiously they move (reduce exposure), and the further away (a wide cushion), the more risk they can afford to take.",
  },
  formula: {
    latex: "E_{\\text{CPPI}} = m \\times \\max(V_t - P_t, 0)",
    variables: [
      { symbol: "V_t", description: { fr: "Valeur actuelle du portefeuille", en: "The portfolio's current value" } },
      { symbol: "P_t", description: { fr: "Plancher actualisé à protéger à l'instant t", en: "The discounted floor to protect at time t" } },
      { symbol: "m", description: { fr: "Multiplicateur fixé à l'avance (typiquement entre 3 et 6)", en: "The multiplier fixed in advance (typically between 3 and 6)" } },
    ],
    assumptions: { fr: "Rééquilibrage possible sans coût ni délai ; en pratique, discret et sujet au risque de gap.", en: "Rebalancing possible with no cost or delay; in practice, discrete and subject to gap risk." },
    units: { fr: "E, V, P dans la même devise.", en: "E, V, P in the same currency." },
    example: { fr: "V=100, P=90, m=5 : E = 5×(100−90) = 50.", en: "V=100, P=90, m=5: E = 5×(100−90) = 50." },
  },
  calculation: {
    fr: "1) Calculer le coussin : Valeur du portefeuille − Plancher actualisé. 2) Multiplier par le multiplicateur m pour obtenir l'exposition cible à l'actif risqué. 3) Le reste du portefeuille est investi en actif sans risque. 4) Répéter à chaque date de rééquilibrage, à mesure que la valeur du portefeuille (et donc le coussin) évolue.",
    en: "1) Compute the cushion: Portfolio value − Discounted floor. 2) Multiply by the multiplier m to get the target risky asset exposure. 3) The portfolio's remainder is invested in the risk-free asset. 4) Repeat at each rebalancing date, as the portfolio's value (and so the cushion) evolves.",
  },
  interpretation: {
    fr: "Le multiplicateur m détermine le \"levier\" implicite sur le coussin : plus m est élevé, plus la stratégie réagit fortement aux mouvements de marché (potentiel de hausse plus grand, mais aussi risque de toucher le plancher plus vite en cas de baisse brutale). Le CPPI n'est PAS une garantie absolue : un krach suffisamment brutal entre deux rééquilibrages peut faire chuter le portefeuille sous le plancher (\"gap risk\"), malgré le mécanisme.",
    en: "The multiplier m determines the implicit \"leverage\" on the cushion: the higher m, the more strongly the strategy reacts to market moves (greater upside potential, but also a faster risk of hitting the floor in a sharp decline). CPPI is NOT an absolute guarantee: a sufficiently sharp crash between two rebalances can push the portfolio below the floor (\"gap risk\"), despite the mechanism.",
  },
  pitfalls: {
    fr: "Croire qu'un CPPI garantit ABSOLUMENT le capital en toutes circonstances : c'est faux en cas de gap de marché suffisamment violent entre deux rééquilibrages, un risque réel documenté lors de krachs historiques. Autre piège : confondre Vol Target (cible une volatilité constante) et CPPI (protège un plancher) — deux logiques différentes, parfois combinées dans un même produit structuré.",
    en: "Believing a CPPI ABSOLUTELY guarantees capital in all circumstances: false in the event of a sufficiently violent market gap between two rebalances, a real risk documented during historical crashes. Another trap: confusing Vol Target (targets constant volatility) with CPPI (protects a floor) — two different logics, sometimes combined in the same structured product.",
  },
  keyPoints: {
    fr: [
      "Vol Target : exposition inversement proportionnelle à la volatilité réalisée, pour une volatilité de portefeuille stable.",
      "CPPI : exposition = m × coussin (valeur − plancher), désinvestit automatiquement en cas de baisse.",
      "Ni l'un ni l'autre n'élimine tout risque : rééquilibrage discret = risque de gap résiduel.",
    ],
    en: [
      "Vol Target: exposure inversely proportional to realized volatility, for stable portfolio volatility.",
      "CPPI: exposure = m × cushion (value − floor), automatically de-risks on a decline.",
      "Neither eliminates all risk: discrete rebalancing = residual gap risk.",
    ],
  },
  advancedDemonstration: {
    fr: "Les \"rolls d'options\" désignent le renouvellement systématique et périodique d'une position optionnelle (typiquement des puts de protection, ou des overlays de Vol Target implémentés via des futures ou options plutôt que l'actif au comptant) : chaque roll incorpore un coût (la prime payée, ou le coût de roll en cas de courbe en contango, voir M02-7) qui doit être budgété dans la performance attendue de la stratégie. Le multiplicateur maximal soutenable d'un CPPI est théoriquement borné par l'inverse de la plus grande chute de marché possible entre deux rééquilibrages (1/chute maximale) : au-delà, un krach suffisant fait mécaniquement passer le coussin sous zéro, rendant le plancher intenable — un calibrage que les gérants CPPI professionnels surveillent en continu.",
    en: "\"Option rolls\" refer to the systematic, periodic renewal of an option position (typically protective puts, or Vol Target overlays implemented via futures or options rather than the spot asset): each roll incorporates a cost (the premium paid, or the roll cost in a contango curve, see M02-7) that must be budgeted into the strategy's expected performance. A CPPI's maximum sustainable multiplier is theoretically bounded by the inverse of the largest possible market drop between two rebalances (1/maximum drop): beyond that, a sufficient crash mechanically pushes the cushion below zero, making the floor unsustainable — a calibration professional CPPI managers continuously monitor.",
  },
};
