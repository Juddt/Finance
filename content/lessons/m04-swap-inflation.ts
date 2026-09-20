import type { LessonContent } from "@/lib/lesson-types";

export const m04SwapInflation: LessonContent = {
  conceptId: "m04-swap-inflation",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir ce qu'est un swap de taux fixe/variable et ce que mesure l'indice des prix à la consommation (IPC).",
      en: "You need to know what a fixed/floating rate swap is and what the consumer price index (CPI) measures.",
    },
    conceptIds: ["m04-swap-fixe-variable", "m01-indicateurs-macro"],
  },
  glossary: [
    { term: { fr: "Obligation indexée inflation (linker)", en: "Inflation-linked bond (linker)" }, definition: { fr: "Une obligation dont le principal est ajusté au fil du temps sur un indice des prix, de sorte que ses coupons et son remboursement conservent leur pouvoir d'achat.", en: "A bond whose principal is adjusted over time to a price index, so its coupons and redemption keep their purchasing power." } },
    { term: { fr: "Inflation break-even", en: "Break-even inflation" }, definition: { fr: "L'écart entre le rendement d'une obligation nominale classique et celui d'une obligation indexée inflation de même maturité, interprété comme l'inflation moyenne anticipée par le marché sur cette période.", en: "The gap between a plain nominal bond's yield and an inflation-linked bond's yield of the same maturity, interpreted as the market's average expected inflation over that period." } },
  ],
  intuition: {
    fr: "Une obligation classique verse des coupons fixes en valeur nominale : si l'inflation s'envole, leur pouvoir d'achat réel s'érode. Une obligation indexée inflation (linker) résout ce problème en indexant son principal sur un indice des prix : ses coupons et son remboursement augmentent automatiquement avec l'inflation, préservant le pouvoir d'achat de l'investisseur. Le swap d'inflation permet d'obtenir cette même protection, ou l'inverse, sans détenir directement l'obligation.",
    en: "A plain bond pays fixed coupons in nominal value: if inflation surges, their real purchasing power erodes. An inflation-linked bond (linker) solves this by indexing its principal to a price index: its coupons and redemption automatically rise with inflation, preserving the investor's purchasing power. An inflation swap achieves this same protection, or its opposite, without directly holding the bond.",
  },
  definition: {
    fr: "Une obligation indexée inflation ajuste son principal sur l'évolution d'un indice des prix (l'IPC) depuis son émission : le principal indexé à la date t vaut Nominal × (IPC_t / IPC_0), et chaque coupon se calcule en appliquant le taux réel contractuel à ce principal indexé, pas au nominal d'origine. Un swap d'inflation zéro-coupon échange, à l'échéance, un taux fixe convenu à l'avance contre l'inflation réellement réalisée sur la période (mesurée par le même ratio d'indice des prix), sans échange de principal en cours de vie — un pur produit dérivé, contrairement au linker qui reste une obligation physique.",
    en: "An inflation-linked bond adjusts its principal to a price index's (the CPI's) evolution since issuance: the indexed principal at date t equals Face value × (CPI_t / CPI_0), and each coupon is computed by applying the contractual real rate to this indexed principal, not the original face value. A zero-coupon inflation swap exchanges, at maturity, a fixed rate agreed in advance against realized inflation over the period (measured by the same price index ratio), with no principal exchange during its life — a pure derivative, unlike the linker which remains a physical bond.",
  },
  utility: {
    fr: "Les fonds de pension et assureurs, dont les engagements futurs (retraites, rentes) sont souvent indexés sur l'inflation, utilisent linkers et swaps d'inflation pour couvrir précisément ce risque. L'écart entre le rendement nominal et le rendement réel d'obligations de même maturité (l'inflation break-even) est aussi l'un des indicateurs les plus suivis par les banques centrales pour juger si leurs anticipations d'inflation restent bien ancrées autour de leur cible (souvent 2%).",
    en: "Pension funds and insurers, whose future liabilities (pensions, annuities) are often inflation-indexed, use linkers and inflation swaps to hedge precisely this risk. The gap between the nominal and real yields of bonds of the same maturity (break-even inflation) is also one of the most closely watched indicators by central banks to judge whether inflation expectations remain well anchored around their target (often 2%).",
  },
  example: {
    fr: "Une obligation indexée a un nominal de 1 000 EUR. Depuis son émission, l'IPC est passé de 100 à 108. Son principal indexé vaut donc 1 000 × (108/100) = 1 080 EUR, et c'est sur ce montant que se calcule le prochain coupon au taux réel contractuel. Par ailleurs, une obligation classique de même maturité rend 4%, contre 1,5% pour l'obligation indexée : l'inflation break-even qui en ressort est de 4% − 1,5% = 2,5% par an, l'inflation moyenne anticipée par le marché sur cette maturité.",
    en: "An indexed bond has a face value of EUR 1,000. Since issuance, the CPI has risen from 100 to 108. Its indexed principal is therefore 1,000 × (108/100) = EUR 1,080, and the next coupon is computed on this amount at the contractual real rate. Meanwhile, a plain bond of the same maturity yields 4%, versus 1.5% for the indexed bond: the resulting break-even inflation is 4% − 1.5% = 2.5% per year, the average inflation expected by the market over that maturity.",
  },
  alternativeExplanation: {
    fr: "Voyez le linker comme un salaire indexé sur le coût de la vie : au lieu de recevoir le même montant fixe chaque année (une obligation classique), votre \"salaire\" (le coupon) est automatiquement réévalué chaque année pour suivre la hausse des prix, garantissant que votre pouvoir d'achat reste stable même si l'inflation s'accélère.",
    en: "Think of a linker as a cost-of-living-indexed salary: instead of receiving the same fixed amount every year (a plain bond), your \"salary\" (the coupon) is automatically revalued each year to track price rises, guaranteeing your purchasing power stays stable even if inflation accelerates.",
  },
  formula: {
    latex: "\\begin{aligned} \\text{Principal indexé}_t &= N \\times \\frac{IPC_t}{IPC_0} \\\\ \\pi_{be} &= y_{nominal} - y_{réel} \\end{aligned}",
    variables: [
      { symbol: "N", description: { fr: "Nominal (principal) d'origine de l'obligation indexée", en: "The indexed bond's original face value (principal)" } },
      { symbol: "IPC_t, IPC_0", description: { fr: "Niveau de l'indice des prix à la date t et à l'émission", en: "Price index level at date t and at issuance" } },
      { symbol: "\\pi_{be}", description: { fr: "Inflation break-even", en: "Break-even inflation" } },
      { symbol: "y_{nominal}, y_{réel}", description: { fr: "Rendement d'une obligation nominale et rendement réel d'une obligation indexée, de même maturité", en: "A nominal bond's yield and an indexed bond's real yield, of the same maturity" } },
    ],
    assumptions: { fr: "Ignore le décalage d'indexation (l'IPC utilisé a en pratique 2 à 3 mois de retard sur le mois courant) ; l'inflation break-even inclut aussi une prime de risque d'inflation, pas seulement l'anticipation pure.", en: "Ignores the indexation lag (the CPI used is in practice 2 to 3 months behind the current month); break-even inflation also includes an inflation risk premium, not just the pure expectation." },
    units: { fr: "Principal en devise ; rendements et inflation break-even en proportion annuelle.", en: "Principal in currency; yields and break-even inflation as annual proportions." },
    example: { fr: "N=1000, IPC_t/IPC_0=1,08 → Principal indexé=1080. y_nominal=4%, y_réel=1,5% → π_be=2,5%.", en: "N=1000, CPI_t/CPI_0=1.08 → Indexed principal=1080. y_nominal=4%, y_real=1.5% → π_be=2.5%." },
  },
  calculation: {
    fr: "1) Relever le nominal d'origine N et le ratio IPC_t/IPC_0 depuis l'émission. 2) Multiplier pour obtenir le principal indexé. 3) Pour l'inflation break-even : soustraire le rendement réel de l'obligation indexée au rendement nominal d'une obligation classique de même maturité.",
    en: "1) Read off the original face value N and the CPI_t/CPI_0 ratio since issuance. 2) Multiply to get the indexed principal. 3) For break-even inflation: subtract the indexed bond's real yield from a plain bond's nominal yield of the same maturity.",
  },
  interpretation: {
    fr: "L'inflation break-even se lit comme une prévision d'inflation implicite dans les prix de marché, comparable à la cible d'inflation de la banque centrale : un break-even durablement supérieur à la cible peut signaler un désancrage des anticipations d'inflation, un signal surveillé de près par les banquiers centraux.",
    en: "Break-even inflation reads as an inflation forecast implicit in market prices, comparable to the central bank's inflation target: a break-even durably above target can signal inflation expectations becoming unanchored, a signal closely watched by central bankers.",
  },
  pitfalls: {
    fr: "Confondre l'inflation break-even (une mesure de marché, qui inclut une prime de risque d'inflation en plus de la pure anticipation) avec une prévision \"pure\" et non biaisée de l'inflation future — la même distinction que pour la probabilité de défaut implicite d'un CDS (voir M03). Autre piège : confondre le linker (une obligation physique, avec échange de principal) et le swap d'inflation (un pur dérivé, sans échange de principal, réglé net à l'échéance).",
    en: "Confusing break-even inflation (a market measure, which includes an inflation risk premium on top of the pure expectation) with a \"pure\", unbiased forecast of future inflation — the same distinction as for a CDS's implied default probability (see M03). Another trap: confusing the linker (a physical bond, with principal exchange) with the inflation swap (a pure derivative, with no principal exchange, net-settled at maturity).",
  },
  keyPoints: {
    fr: [
      "Une obligation indexée (linker) ajuste son principal sur l'IPC ; un swap d'inflation échange un taux fixe contre l'inflation réalisée, sans échange de principal.",
      "Inflation break-even = rendement nominal − rendement réel : une mesure de l'inflation anticipée par le marché.",
      "L'inflation break-even inclut une prime de risque, ce n'est pas une prévision pure et non biaisée de l'inflation future.",
    ],
    en: [
      "An inflation-linked bond (linker) adjusts its principal to the CPI; an inflation swap exchanges a fixed rate against realized inflation, with no principal exchange.",
      "Break-even inflation = nominal yield − real yield: a measure of the market's expected inflation.",
      "Break-even inflation includes a risk premium, it is not a pure, unbiased forecast of future inflation.",
    ],
  },
  advancedDemonstration: {
    fr: "La plupart des obligations indexées incluent une clause de \"plancher de déflation\" (deflation floor) : à l'échéance, l'investisseur reçoit au minimum le nominal d'origine, même si l'indice des prix a baissé depuis l'émission (déflation) — une option de vente implicite offerte gratuitement à l'investisseur, qui protège contre un scénario déflationniste. Le swap d'inflation zéro-coupon, lui, échange à l'échéance un montant fixe (Notionnel × ((1+taux fixe)^T − 1)) contre un montant variable (Notionnel × (IPC_T/IPC_0 − 1)) : sa structure \"zéro-coupon\" (un seul règlement net à l'échéance, pas de flux intermédiaires) simplifie la couverture par rapport à un linker physique, dont les coupons réels versés en cours de vie doivent être réinvestis. Les banques centrales suivent en pratique toute la courbe des inflations break-even (par maturité), pas un seul point : une hausse du break-even à court terme mais stable à long terme suggère un choc transitoire, tandis qu'une hausse généralisée sur toutes les maturités est un signal plus inquiétant de désancrage durable des anticipations.",
    en: "Most inflation-linked bonds include a \"deflation floor\" clause: at maturity, the investor receives at least the original face value, even if the price index has fallen since issuance (deflation) — an implicit put option offered free of charge to the investor, protecting against a deflationary scenario. The zero-coupon inflation swap, meanwhile, exchanges at maturity a fixed amount (Notional × ((1+fixed rate)^T − 1)) against a variable amount (Notional × (CPI_T/CPI_0 − 1)): its \"zero-coupon\" structure (a single net settlement at maturity, no intermediate flows) simplifies hedging compared to a physical linker, whose real coupons paid during its life must be reinvested. Central banks in practice track the whole break-even inflation curve (by maturity), not a single point: a rise in short-term break-even but stable long-term break-even suggests a transitory shock, while a broad-based rise across all maturities is a more worrying signal of durably unanchored expectations.",
  },
};
