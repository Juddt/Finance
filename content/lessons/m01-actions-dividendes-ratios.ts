import type { LessonContent } from "@/lib/lesson-types";

export const m01ActionsDividendesRatios: LessonContent = {
  conceptId: "m01-actions-dividendes-ratios",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir distinguer marché primaire et secondaire, et ce qu'est une action, présentés dans la notion précédente.",
      en: "You need to know how to distinguish the primary and secondary markets, and what a share is, covered in the previous concept.",
    },
    conceptIds: ["m01-classes-actifs"],
  },
  glossary: [
    { term: { fr: "BPA (Bénéfice Par Action)", en: "EPS (Earnings Per Share)" }, definition: { fr: "Le résultat net de l'entreprise divisé par le nombre d'actions en circulation : la part du bénéfice \"attribuable\" à chaque action.", en: "The company's net income divided by the number of shares outstanding: the profit \"attributable\" to each share." } },
    { term: { fr: "Taux de distribution (Payout ratio)", en: "Payout ratio" }, definition: { fr: "La part du bénéfice par action effectivement reversée aux actionnaires sous forme de dividende, plutôt que réinvestie dans l'entreprise.", en: "The share of earnings per share actually paid out to shareholders as a dividend, rather than reinvested in the company." } },
  ],
  intuition: {
    fr: "Détenir une action, c'est détenir une part des bénéfices futurs d'une entreprise. Une partie de ces bénéfices peut être reversée directement en cash (le dividende), le reste étant réinvesti dans l'entreprise pour financer sa croissance. Les ratios de valorisation simples (P/E, rendement du dividende) permettent de comparer rapidement, en un seul chiffre, ce que le marché est prêt à payer pour un euro de bénéfice ou pour un euro de dividende.",
    en: "Owning a share means owning a slice of a company's future profits. Part of those profits can be paid out directly in cash (the dividend), the rest being reinvested in the company to fund its growth. Simple valuation ratios (P/E, dividend yield) let you quickly compare, in a single number, what the market is willing to pay for one euro of profit or one euro of dividend.",
  },
  definition: {
    fr: "Le bénéfice par action (BPA) est le résultat net de l'entreprise divisé par le nombre d'actions en circulation. Le ratio cours/bénéfice (P/E, price-to-earnings) rapporte le cours de l'action à son BPA : il indique combien d'années de bénéfice actuel l'investisseur paie pour acquérir l'action. Le rendement du dividende (dividend yield) rapporte le dividende annuel par action au cours de l'action, exprimant le \"retour cash\" immédiat pour l'investisseur, indépendamment de toute plus-value future.",
    en: "Earnings per share (EPS) is the company's net income divided by the number of shares outstanding. The price-to-earnings ratio (P/E) relates the share price to its EPS: it indicates how many years of current earnings the investor pays to acquire the share. The dividend yield relates the annual dividend per share to the share price, expressing the investor's immediate \"cash return\", independent of any future capital gain.",
  },
  utility: {
    fr: "Ces ratios simples sont le premier réflexe de tout investisseur ou analyste pour situer rapidement une action par rapport à ses pairs, avant d'éventuellement approfondir avec des méthodes de valorisation plus complètes comme le DCF (voir M13). Ils sont omniprésents dans le vocabulaire des salles de marché et systématiquement demandés en entretien.",
    en: "These simple ratios are the first reflex of any investor or analyst to quickly place a stock relative to its peers, before possibly going deeper with more complete valuation methods like DCF (see M13). They are omnipresent in trading floor vocabulary and systematically asked about in interviews.",
  },
  example: {
    fr: "Une entreprise réalise un résultat net de 500 millions EUR, avec 100 millions d'actions en circulation : son BPA est de 500/100 = 5 EUR. Son action cote 75 EUR, donnant un P/E de 75/5 = 15x. Elle verse un dividende annuel de 2 EUR par action, soit un rendement du dividende de 2/75 ≈ 2,7% et un taux de distribution de 2/5 = 40% (les 60% restants du bénéfice sont réinvestis).",
    en: "A company posts a net income of EUR 500 million, with 100 million shares outstanding: its EPS is 500/100 = EUR 5. Its share trades at EUR 75, giving a P/E of 75/5 = 15x. It pays an annual dividend of EUR 2 per share, i.e. a dividend yield of 2/75 ≈ 2.7% and a payout ratio of 2/5 = 40% (the remaining 60% of profit is reinvested).",
  },
  alternativeExplanation: {
    fr: "Voyez le P/E comme un \"délai de retour sur investissement\" naïf : un P/E de 15x signifie, très approximativement, qu'il faudrait 15 années de bénéfice actuel identique pour \"rembourser\" le prix payé pour l'action — une simplification utile pour comparer rapidement deux actions, mais qui ignore que les bénéfices futurs peuvent croître (ou décroître), et que le bénéfice n'est pas intégralement versé en cash à l'actionnaire chaque année.",
    en: "Think of the P/E as a naive \"payback period\": a 15x P/E means, very roughly, that it would take 15 years of identical current earnings to \"pay back\" the price paid for the share — a useful simplification to quickly compare two stocks, but one that ignores future earnings can grow (or shrink), and that profit isn't fully paid out in cash to the shareholder each year.",
  },
  formula: {
    latex: "\\begin{aligned} BPA &= \\frac{\\text{Résultat net}}{\\text{Nombre d'actions}} \\\\ P/E &= \\frac{\\text{Cours}}{BPA} \\end{aligned}",
    variables: [
      { symbol: "BPA", description: { fr: "Bénéfice par action", en: "Earnings per share" } },
      { symbol: "\\text{Résultat net}", description: { fr: "Résultat net de l'entreprise sur la période", en: "The company's net income over the period" } },
      { symbol: "P/E", description: { fr: "Ratio cours/bénéfice", en: "Price-to-earnings ratio" } },
      { symbol: "\\text{Cours}", description: { fr: "Cours actuel de l'action", en: "The share's current price" } },
    ],
    assumptions: { fr: "Le BPA utilisé peut être \"trailing\" (sur les 12 derniers mois publiés) ou \"forward\" (projeté sur les 12 prochains mois), ce qui change significativement le P/E obtenu. Ignore la dilution potentielle (options, obligations convertibles — voir M03).", en: "The EPS used can be \"trailing\" (over the last published 12 months) or \"forward\" (projected over the next 12 months), which significantly changes the resulting P/E. Ignores potential dilution (options, convertible bonds — see M03)." },
    units: { fr: "BPA et cours en devise ; P/E sans unité (un multiple).", en: "EPS and price in currency; P/E is unitless (a multiple)." },
    example: { fr: "Résultat net=500M, actions=100M → BPA=5. Cours=75 → P/E=15x.", en: "Net income=500M, shares=100M → EPS=5. Price=75 → P/E=15x." },
  },
  calculation: {
    fr: "1) Diviser le résultat net par le nombre d'actions en circulation pour obtenir le BPA. 2) Diviser le cours de l'action par le BPA pour obtenir le P/E. 3) Pour le rendement du dividende : diviser le dividende annuel par action par le cours de l'action.",
    en: "1) Divide net income by the number of shares outstanding to get EPS. 2) Divide the share price by EPS to get the P/E. 3) For the dividend yield: divide the annual dividend per share by the share price.",
  },
  interpretation: {
    fr: "Un P/E élevé peut refléter des attentes de forte croissance future des bénéfices (le marché \"paie\" cette croissance à l'avance) ou, à l'inverse, une survalorisation ; un P/E bas peut refléter une opportunité (\"valeur\") ou, à l'inverse, des difficultés structurelles anticipées par le marché. Ces ratios ne prennent tout leur sens qu'en comparaison avec des entreprises comparables (voir M13, méthode des comparables), jamais en valeur absolue isolée.",
    en: "A high P/E can reflect expectations of strong future earnings growth (the market \"pays\" for that growth in advance) or, conversely, overvaluation; a low P/E can reflect an opportunity (\"value\") or, conversely, structural difficulties anticipated by the market. These ratios only make full sense compared against similar companies (see M13, comparables method), never in isolated absolute value.",
  },
  pitfalls: {
    fr: "Confondre P/E \"trailing\" (bénéfices passés déjà publiés) et P/E \"forward\" (bénéfices projetés), qui peuvent donner des résultats très différents pour une même action. Autre piège fréquent : juger un rendement du dividende élevé comme automatiquement attractif, sans vérifier s'il reflète une politique de distribution généreuse et soutenable, ou au contraire une chute récente du cours (le dividende restant inchangé, le rendement affiché grimpe mécaniquement) qui précède souvent une coupe du dividende.",
    en: "Confusing \"trailing\" P/E (already published past earnings) and \"forward\" P/E (projected earnings), which can give very different results for the same stock. Another frequent trap: judging a high dividend yield as automatically attractive, without checking whether it reflects a generous and sustainable payout policy, or conversely a recent share price drop (the dividend staying unchanged, the displayed yield mechanically rises) that often precedes a dividend cut.",
  },
  keyPoints: {
    fr: [
      "BPA = Résultat net / Nombre d'actions ; P/E = Cours / BPA ; rendement du dividende = Dividende annuel / Cours.",
      "Un P/E élevé n'est ni bon ni mauvais en soi : il reflète des attentes de croissance, à comparer avec des entreprises similaires.",
      "Un rendement du dividende élevé peut signaler une politique généreuse OU une chute de cours annonçant une coupe du dividende.",
    ],
    en: [
      "EPS = Net income / Number of shares; P/E = Price / EPS; dividend yield = Annual dividend / Price.",
      "A high P/E is neither good nor bad in itself: it reflects growth expectations, to be compared against similar companies.",
      "A high dividend yield can signal a generous policy OR a price drop foreshadowing a dividend cut.",
    ],
  },
  advancedDemonstration: {
    fr: "Le ratio PEG (P/E divisé par le taux de croissance anticipé des bénéfices, en %) affine la lecture du P/E en le rapportant à la croissance : un P/E de 30x peut être jugé raisonnable pour une entreprise dont les bénéfices croissent de 30% par an (PEG=1), mais excessif pour une entreprise dont la croissance n'est que de 5% par an (PEG=6). Ce raisonnement explique pourquoi les entreprises de croissance (technologie, biotech) affichent structurellement des P/E plus élevés que les entreprises matures (utilities, banques) qui, elles, retournent l'essentiel de leur bénéfice en dividendes plutôt que de le réinvestir dans une croissance déjà ralentie. Un \"piège à dividende\" (dividend trap) typique se repère en croisant le rendement du dividende affiché avec le taux de distribution : un rendement élevé ACCOMPAGNÉ d'un taux de distribution supérieur à 100% (l'entreprise verse plus qu'elle ne gagne, en puisant dans sa trésorerie ou en s'endettant) est un signal d'alerte sérieux sur la soutenabilité du dividende.",
    en: "The PEG ratio (P/E divided by the expected earnings growth rate, in %) refines the P/E reading by relating it to growth: a 30x P/E can be judged reasonable for a company whose earnings grow 30% per year (PEG=1), but excessive for a company growing only 5% per year (PEG=6). This reasoning explains why growth companies (tech, biotech) structurally display higher P/Es than mature companies (utilities, banks), which instead return most of their profit as dividends rather than reinvesting it in already-slowed growth. A typical \"dividend trap\" is spotted by cross-checking the displayed dividend yield against the payout ratio: a high yield ACCOMPANIED by a payout ratio above 100% (the company pays out more than it earns, drawing on cash reserves or debt) is a serious warning sign about the dividend's sustainability.",
  },
};
