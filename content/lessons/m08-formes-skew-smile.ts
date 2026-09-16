import type { LessonContent } from "@/lib/lesson-types";

export const m08FormesSkewSmile: LessonContent = {
  conceptId: "m08-formes-skew-smile",
  prerequisiteReminder: {
    text: {
      fr: "Il faut connaître les définitions générales du skew, du smile et de la surface de volatilité.",
      en: "You need to know the general definitions of skew, smile and the volatility surface.",
    },
    conceptIds: ["m08-skew-smile-surface"],
  },
  glossary: [
    { term: { fr: "Effet de levier (leverage effect)", en: "Leverage effect" }, definition: { fr: "Le mécanisme par lequel une baisse du prix d'une action augmente son ratio dette/capitaux propres, donc son risque perçu et sa volatilité future anticipée.", en: "The mechanism by which a stock price decline raises its debt-to-equity ratio, hence its perceived risk and expected future volatility." } },
  ],
  intuition: {
    fr: "Les formes de skew et de smile ne sont pas figées : elles diffèrent structurellement entre classes d'actifs (actions vs devises), et évoluent dans le temps selon le contexte de marché (avant une annonce, en période de stress).",
    en: "Skew and smile shapes aren't fixed: they structurally differ between asset classes (equities vs FX), and evolve over time depending on market context (ahead of an announcement, during a stress period).",
  },
  definition: {
    fr: "Le skew equity est typiquement négatif et prononcé (\"pente descendante\") : les puts OTM sont nettement plus chers en volatilité implicite que les calls OTM, un phénomène qui s'est accentué depuis le krach de 1987. Le smile FX est plus symétrique (en U), reflétant un risque bidirectionnel entre deux devises sans \"camp\" structurellement plus risqué.",
    en: "Equity skew is typically negative and pronounced (a \"downward slope\"): OTM puts are noticeably pricier in implied volatility than OTM calls, a phenomenon that intensified since the 1987 crash. The FX smile is more symmetric (U-shaped), reflecting bidirectional risk between two currencies with no structurally riskier \"side\".",
  },
  utility: {
    fr: "Reconnaître la forme typique attendue pour une classe d'actifs donnée permet de détecter rapidement une anomalie de marché (un skew equity qui s'aplatit anormalement, ou un smile FX qui devient fortement asymétrique signalant un risque directionnel perçu inhabituel, comme lors d'un référendum ou d'une élection).",
    en: "Recognizing the typical expected shape for a given asset class lets you quickly spot a market anomaly (an equity skew that abnormally flattens, or an FX smile that becomes strongly skewed, signaling unusual perceived directional risk, such as around a referendum or election).",
  },
  example: {
    fr: "Avant le référendum sur le Brexit (2016), le smile GBP/USD s'est fortement asymétrisé : la volatilité implicite des options pariant sur une forte dépréciation de la livre est montée bien au-dessus de celle des options pariant sur une appréciation, reflétant un risque perçu clairement orienté à la baisse pour la livre — une déformation temporaire liée à un événement, pas la forme structurelle habituelle du smile FX.",
    en: "Ahead of the Brexit referendum (2016), the GBP/USD smile became strongly skewed: implied volatility for options betting on a sharp pound depreciation rose well above that for options betting on an appreciation, reflecting clearly downside-skewed perceived risk for the pound — a temporary, event-driven distortion, not the FX smile's usual structural shape.",
  },
  alternativeExplanation: {
    fr: "Le skew equity négatif ressemble à une prime d'assurance-incendie plus chère que l'assurance-vol : le marché des actions redoute structurellement plus les baisses brutales (krachs) que les hausses brutales, donc la protection contre la baisse (les puts) coûte plus cher. Le smile FX symétrique ressemble davantage à une assurance sur un pari à deux issues équilibrées : ni la hausse ni la baisse d'une devise contre une autre n'est structurellement plus redoutée.",
    en: "The negative equity skew resembles a fire-insurance premium being pricier than theft insurance: the equity market structurally fears sharp declines (crashes) more than sharp rises, so downside protection (puts) costs more. The symmetric FX smile is more like insurance on a balanced two-outcome bet: neither a currency's rise nor fall against another is structurally more feared.",
  },
  formula: {
    latex: "\\text{Skew}_{25\\Delta} = \\text{IV}_{25\\Delta\\text{ put}} - \\text{IV}_{25\\Delta\\text{ call}}",
    variables: [
      { symbol: "\\text{IV}_{25\\Delta \\text{ put}}", description: { fr: "Volatilité implicite du put de Delta 25% (OTM)", en: "Implied volatility of the 25-delta put (OTM)" } },
      { symbol: "\\text{IV}_{25\\Delta \\text{ call}}", description: { fr: "Volatilité implicite du call de Delta 25% (OTM)", en: "Implied volatility of the 25-delta call (OTM)" } },
    ],
    assumptions: { fr: "Convention de marché courante (le \"25-delta risk reversal\") pour quantifier l'asymétrie du skew en un seul chiffre facilement comparable.", en: "A common market convention (the \"25-delta risk reversal\") to quantify the skew's asymmetry in a single, easily comparable number." },
    units: { fr: "Différence de volatilité implicite, en points de %.", en: "Implied volatility difference, in percentage points." },
    example: { fr: "IV_put=24%, IV_call=18% : Skew_25Δ = 24%−18% = 6 points, un skew equity net et négatif (au sens où le put coûte plus cher).", en: "IV_put=24%, IV_call=18%: Skew_25Δ = 24%−18% = 6 points, a clear negative equity skew (in the sense that the put costs more)." },
  },
  calculation: {
    fr: "1) Identifier les options put et call de Delta 25% (une convention de marché standard pour \"modérément OTM\"). 2) Relever leur volatilité implicite respective. 3) Soustraire IV_call de IV_put. 4) Un résultat positif significatif indique un skew equity typique ; un résultat proche de zéro indique un smile plus symétrique type FX.",
    en: "1) Identify the 25-delta put and call options (a standard market convention for \"moderately OTM\"). 2) Read off their respective implied volatilities. 3) Subtract IV_call from IV_put. 4) A significant positive result indicates a typical equity skew; a result close to zero indicates a more symmetric FX-type smile.",
  },
  interpretation: {
    fr: "Le \"25-delta risk reversal\" (ce skew au format standardisé) est directement coté sur le marché des changes comme un instrument à part entière, aux côtés du niveau ATM et du \"butterfly\" (la convexité du smile) — les traders FX pensent et négocient littéralement en ces trois paramètres plutôt qu'en prix d'options individuelles.",
    en: "The \"25-delta risk reversal\" (this skew in standardized format) is directly quoted in the FX market as a standalone instrument, alongside the ATM level and the \"butterfly\" (the smile's convexity) — FX traders literally think and trade in these three parameters rather than individual option prices.",
  },
  pitfalls: {
    fr: "Généraliser la forme \"typique\" à tout moment et tout marché : ces formes évoluent avec le contexte (un événement macro peut temporairement faire ressembler un smile FX à un skew equity, ou inversement). Autre piège : oublier que ces formes ne sont pas figées dans le temps — la structure par terme du skew change aussi, souvent plus prononcée à court terme qu'à long terme.",
    en: "Generalizing the \"typical\" shape to every moment and market: these shapes evolve with context (a macro event can temporarily make an FX smile resemble an equity skew, or vice versa). Another trap: forgetting these shapes aren't fixed over time — the skew's term structure also changes, often more pronounced short-term than long-term.",
  },
  keyPoints: {
    fr: [
      "Skew equity : typiquement négatif et prononcé (puts OTM plus chers), lié à la demande de protection et à l'effet de levier.",
      "Smile FX : plus symétrique (en U), reflétant un risque bidirectionnel entre deux devises.",
      "Le \"25-delta risk reversal\" quantifie ce skew/smile en un chiffre standard coté sur le marché.",
    ],
    en: [
      "Equity skew: typically negative and pronounced (pricier OTM puts), tied to protection demand and the leverage effect.",
      "FX smile: more symmetric (U-shaped), reflecting bidirectional risk between two currencies.",
      "The \"25-delta risk reversal\" quantifies this skew/smile in a single market-quoted standard number.",
    ],
  },
  advancedDemonstration: {
    fr: "Le skew equity moderne (post-1987) contraste avec la relative platitude observée avant le krach de 1987 : cet événement a durablement modifié la perception du risque de queue (\"tail risk\") sur les indices actions, un changement de régime que les modèles à volatilité constante (Black-Scholes pur) ne peuvent absolument pas expliquer, et qui motive directement les modèles de volatilité locale et stochastique étudiés en M08-7. Sur les marchés de matières premières, la forme du smile peut même s'inverser par rapport aux actions (skew positif) lors de tensions sur l'offre, où le risque de flambée des prix (accaparé par les calls) dépasse le risque de baisse.",
    en: "Modern equity skew (post-1987) contrasts with the relative flatness observed before the 1987 crash: that event durably reshaped tail-risk perception on equity indices, a regime shift constant-volatility models (pure Black-Scholes) absolutely cannot explain, and which directly motivates the local and stochastic volatility models studied in M08-7. In commodity markets, the smile's shape can even flip relative to equities (positive skew) during supply tensions, where the risk of a price spike (captured by calls) exceeds the downside risk.",
  },
};
