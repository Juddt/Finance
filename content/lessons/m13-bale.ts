import type { LessonContent } from "@/lib/lesson-types";

export const m13Bale: LessonContent = {
  conceptId: "m13-bale",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître la typologie des risques financiers et la VaR/Expected Shortfall.",
      en: "You need to know the financial risk typology and VaR/Expected Shortfall.",
    },
    conceptIds: ["m13-typologie-risques", "m13-var-es-stress"],
  },
  glossary: [
    { term: { fr: "RWA (actifs pondérés du risque)", en: "RWA (risk-weighted assets)" }, definition: { fr: "La valeur des actifs d'une banque ajustée par un coefficient reflétant leur risque, servant de dénominateur aux principaux ratios de fonds propres.", en: "A bank's asset value adjusted by a coefficient reflecting their risk, used as the denominator in the main capital ratios." } },
    { term: { fr: "Output floor", en: "Output floor" }, definition: { fr: "Un plancher qui limite la réduction des RWA qu'une banque peut obtenir via ses modèles internes, par rapport au calcul standard — 72,5% dans l'accord de Bâle III finalisé.", en: "A floor limiting the RWA reduction a bank can achieve via internal models, relative to the standard calculation — 72.5% in the finalized Basel III accord." } },
  ],
  intuition: {
    fr: "Après la crise de 2008, les régulateurs ont voulu s'assurer qu'une banque détient toujours assez de fonds propres pour absorber des pertes inattendues sans faire faillite ni nécessiter un sauvetage public — le dispositif de Bâle traduit cette intuition en exigences quantitatives précises, régulièrement renforcées et affinées depuis.",
    en: "After the 2008 crisis, regulators wanted to ensure a bank always holds enough capital to absorb unexpected losses without failing or needing a public bailout — the Basel framework translates this intuition into precise quantitative requirements, regularly strengthened and refined since.",
  },
  definition: {
    fr: "Le ratio CET1 (Common Equity Tier 1) mesure les fonds propres de meilleure qualité rapportés aux actifs pondérés du risque (RWA), avec un minimum réglementaire de 4,5% (souvent rehaussé par des coussins additionnels en pratique). Le LCR (Liquidity Coverage Ratio) exige de détenir suffisamment d'actifs liquides de haute qualité pour couvrir les sorties de trésorerie nettes sur 30 jours de stress. Le NSFR (Net Stable Funding Ratio) exige un financement stable suffisant sur un horizon d'un an. Le CVA (Credit Valuation Adjustment) capture le risque de contrepartie (M13-risques-d) sur les dérivés dans les exigences de fonds propres. Le FRTB (Fundamental Review of the Trading Book) réforme les exigences de fonds propres pour le risque de marché, en s'appuyant davantage sur l'Expected Shortfall (M13-risques-a) que sur la VaR seule. La finalisation de Bâle III (parfois appelée \"Bâle IV\") introduit notamment un output floor limitant l'écart entre modèles internes et méthode standard.",
    en: "The CET1 (Common Equity Tier 1) ratio measures the highest-quality capital relative to risk-weighted assets (RWA), with a regulatory minimum of 4.5% (often raised by additional buffers in practice). The LCR (Liquidity Coverage Ratio) requires holding enough high-quality liquid assets to cover net cash outflows over 30 days of stress. The NSFR (Net Stable Funding Ratio) requires sufficient stable funding over a one-year horizon. CVA (Credit Valuation Adjustment) captures counterparty risk (M13-risques-d) on derivatives within capital requirements. FRTB (Fundamental Review of the Trading Book) reforms market risk capital requirements, relying more on Expected Shortfall (M13-risques-a) than VaR alone. Basel III's finalization (sometimes called \"Basel IV\") notably introduces an output floor limiting the gap between internal models and the standard method.",
  },
  utility: {
    fr: "Comprendre ces ratios est indispensable pour évaluer la solidité d'une banque (au-delà de son compte de résultat) et pour comprendre pourquoi les banques arbitrent en permanence entre rentabilité et consommation de fonds propres réglementaires dans leurs décisions d'activité, y compris dans le pricing des produits dérivés (le coût du CVA et des fonds propres associés est répercuté dans les prix cotés aux clients).",
    en: "Understanding these ratios is essential to assess a bank's solidity (beyond its income statement) and to understand why banks constantly trade off profitability against regulatory capital consumption in their business decisions, including derivatives pricing (the cost of CVA and associated capital is passed through into prices quoted to clients).",
  },
  example: {
    fr: "Dans l'Union européenne, le dispositif de Bâle III finalisé est transposé par le règlement CRR3 (Règlement (UE) 2024/1623 du 31 mai 2024, publié au Journal officiel de l'UE le 19 juin 2024), applicable depuis le 1er janvier 2025 pour l'essentiel de ses dispositions, avec un output floor calibré à 72,5% introduit progressivement jusqu'en 2030 (période transitoire prolongée jusqu'en 2028). Au Royaume-Uni, la PRA applique son propre calendrier (« Basel 3.1 ») à partir du 1er janvier 2027 ; aux États-Unis, la re-proposition du \"Basel III Endgame\" vise une application autour de 2027-2028 — trois juridictions, trois calendriers distincts pour un même socle de standards internationaux du Comité de Bâle.",
    en: "In the European Union, the finalized Basel III framework is transposed via the CRR3 regulation (Regulation (EU) 2024/1623 of 31 May 2024, published in the EU Official Journal on 19 June 2024), applicable since 1 January 2025 for most of its provisions, with an output floor calibrated at 72.5% phased in through 2030 (transitional period extended to 2028). In the United Kingdom, the PRA applies its own timetable (\"Basel 3.1\") from 1 January 2027; in the United States, the \"Basel III Endgame\" re-proposal targets application around 2027-2028 — three jurisdictions, three distinct timelines for the same international Basel Committee standards.",
  },
  alternativeExplanation: {
    fr: "Les ratios de Bâle fonctionnent comme les règles de sécurité d'un immeuble : le CET1 est l'équivalent de la solidité structurelle du bâtiment (peut-il absorber un choc sans s'effondrer ?), le LCR est l'équivalent d'une réserve d'eau immédiatement disponible en cas d'incendie (30 jours de résistance), et le NSFR vérifie que les fondations (financement) sont assez stables sur le long terme, pas seulement empruntées au jour le jour.",
    en: "Basel ratios work like a building's safety rules: CET1 is the equivalent of the building's structural soundness (can it absorb a shock without collapsing?), LCR is the equivalent of an immediately available water reserve in case of fire (30 days of resistance), and NSFR checks that the foundations (funding) are stable enough long-term, not just borrowed day-to-day.",
  },
  formula: {
    latex: "\\text{Ratio CET1} = \\frac{\\text{Fonds propres CET1}}{\\text{RWA}} \\ge 4{,}5\\%",
    variables: [
      { symbol: "\\text{Fonds propres CET1}", description: { fr: "Capital de la plus haute qualité (actions ordinaires, réserves), premier absorbeur de pertes", en: "The highest-quality capital (common shares, reserves), the first loss absorber" } },
      { symbol: "\\text{RWA}", description: { fr: "Actifs pondérés du risque : chaque actif est multiplié par un coefficient reflétant son risque de crédit, de marché et opérationnel", en: "Risk-weighted assets: each asset is multiplied by a coefficient reflecting its credit, market and operational risk" } },
    ],
    assumptions: { fr: "Minimum réglementaire de base ; les coussins de conservation, contracyclique et systémique s'ajoutent en pratique, rehaussant l'exigence effective bien au-delà de 4,5%.", en: "Base regulatory minimum; conservation, countercyclical and systemic buffers add on in practice, raising the effective requirement well above 4.5%." },
    units: { fr: "Ratio en pourcentage.", en: "Ratio as a percentage." },
    example: { fr: "CET1=12 Md€, RWA=100 Md€ : ratio CET1 = 12%, largement au-dessus du minimum réglementaire de 4,5%.", en: "CET1=€12bn, RWA=€100bn: CET1 ratio = 12%, well above the 4.5% regulatory minimum." },
  },
  calculation: {
    fr: "1) Calculer les RWA de la banque en pondérant chaque exposition (crédit, marché, opérationnel) selon les méthodes approuvées (standard ou modèle interne, sous réserve du plancher output floor). 2) Diviser les fonds propres CET1 par ce montant de RWA pour obtenir le ratio CET1. 3) Vérifier séparément le LCR (actifs liquides / sorties nettes à 30 jours) et le NSFR (financement stable disponible / financement stable requis). 4) Comparer chaque ratio à son minimum réglementaire, en tenant compte des coussins additionnels applicables à l'établissement concerné.",
    en: "1) Compute the bank's RWA by weighting each exposure (credit, market, operational) per approved methods (standard or internal model, subject to the output floor). 2) Divide CET1 capital by this RWA amount to get the CET1 ratio. 3) Separately check the LCR (liquid assets / 30-day net outflows) and NSFR (available stable funding / required stable funding). 4) Compare each ratio to its regulatory minimum, accounting for additional buffers applicable to the institution concerned.",
  },
  interpretation: {
    fr: "Un ratio CET1 confortablement au-dessus du minimum réglementaire signale une banque bien capitalisée, capable d'absorber des pertes inattendues ; un ratio proche du minimum peut déclencher des restrictions automatiques (limitation des dividendes, par exemple). L'output floor de la finalisation de Bâle III réduit l'avantage compétitif que les grandes banques utilisant des modèles internes sophistiqués pouvaient tirer d'une pondération du risque plus favorable que la méthode standard.",
    en: "A CET1 ratio comfortably above the regulatory minimum signals a well-capitalized bank, able to absorb unexpected losses; a ratio close to the minimum can trigger automatic restrictions (limiting dividends, for example). Basel III finalization's output floor reduces the competitive advantage large banks using sophisticated internal models could draw from more favorable risk weighting than the standard method.",
  },
  pitfalls: {
    fr: "Croire que le dispositif de Bâle est appliqué de façon strictement identique et simultanée dans toutes les juridictions : les calendriers et certains paramètres diffèrent significativement entre l'UE (CRR3, application 2025), le Royaume-Uni (Basel 3.1, 2027) et les États-Unis (Basel III Endgame, 2027-2028), une source fréquente de confusion et d'arbitrage réglementaire entre juridictions. Autre piège : confondre le minimum réglementaire théorique (4,5% pour le CET1) avec l'exigence effective réellement applicable à un établissement donné, qui inclut plusieurs coussins additionnels.",
    en: "Believing the Basel framework is applied strictly identically and simultaneously across all jurisdictions: timelines and certain parameters differ significantly between the EU (CRR3, 2025 application), the UK (Basel 3.1, 2027) and the US (Basel III Endgame, 2027-2028), a frequent source of confusion and regulatory arbitrage between jurisdictions. Another trap: confusing the theoretical regulatory minimum (4.5% for CET1) with the effective requirement actually applicable to a given institution, which includes several additional buffers.",
  },
  keyPoints: {
    fr: [
      "CET1, LCR et NSFR mesurent respectivement la solvabilité, la liquidité court terme et la stabilité du financement long terme d'une banque.",
      "La finalisation de Bâle III introduit un output floor (72,5%) limitant l'avantage des modèles internes par rapport à la méthode standard.",
      "L'application diffère significativement par juridiction : UE (CRR3, Règlement (UE) 2024/1623, depuis le 1er janvier 2025), Royaume-Uni (2027), États-Unis (2027-2028).",
    ],
    en: [
      "CET1, LCR and NSFR respectively measure a bank's solvency, short-term liquidity and long-term funding stability.",
      "Basel III's finalization introduces an output floor (72.5%) limiting internal models' advantage over the standard method.",
      "Application differs significantly by jurisdiction: EU (CRR3, Regulation (EU) 2024/1623, since 1 January 2025), UK (2027), US (2027-2028).",
    ],
  },
  advancedDemonstration: {
    fr: "Le CVA (Credit Valuation Adjustment) illustre un lien direct entre la théorie du pricing d'options et la réglementation prudentielle : le CVA se calcule conceptuellement comme une option sur le risque de défaut de la contrepartie, dont la valeur dépend de l'exposition future espérée du portefeuille de dérivés (elle-même modélisée par simulation, M06-7) et de la probabilité de défaut de la contrepartie (liée aux spreads de CDS, M03-6) — les exigences de fonds propres FRTB pour le risque de marché s'appuient quant à elles explicitly sur l'Expected Shortfall plutôt que la VaR (M13-risques-a), une évolution réglementaire directement motivée par les propriétés mathématiques de cohérence de l'ES (sous-additivité) absentes de la VaR.",
    en: "CVA (Credit Valuation Adjustment) illustrates a direct link between option pricing theory and prudential regulation: CVA is conceptually computed as an option on the counterparty's default risk, whose value depends on the derivatives portfolio's expected future exposure (itself modeled via simulation, M06-7) and the counterparty's default probability (tied to CDS spreads, M03-6) — FRTB's market risk capital requirements, meanwhile, explicitly rely on Expected Shortfall rather than VaR (M13-risques-a), a regulatory evolution directly motivated by ES's mathematical coherence properties (subadditivity) that VaR lacks.",
  },
};
