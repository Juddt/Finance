import type { LessonContent } from "@/lib/lesson-types";

export const m01AnticipationsTauxDirecteurs: LessonContent = {
  conceptId: "m01-anticipations-taux-directeurs",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir ce que fait une banque centrale et comment lire un taux d'intérêt en proportion annuelle, présentés dans les deux notions précédentes.",
      en: "You need to know what a central bank does and how to read an interest rate as an annual proportion, covered in the two previous concepts.",
    },
    conceptIds: ["m01-banques-centrales", "m01-indicateurs-macro"],
  },
  glossary: [
    { term: { fr: "Futures Fed Funds", en: "Fed Funds futures" }, definition: { fr: "Un contrat à terme dont le prix reflète le taux Fed Funds moyen anticipé par le marché sur le mois du contrat, utilisé pour en déduire une probabilité implicite de décision de la Fed.", en: "A futures contract whose price reflects the market's average expected Fed Funds rate over the contract's month, used to derive an implied probability of a Fed decision." } },
    { term: { fr: "Anticipation de marché (\"pricé\")", en: "Market expectation (\"priced in\")" }, definition: { fr: "Le scénario que les prix de marché intègrent déjà aujourd'hui pour l'avenir, avant même que l'événement ne survienne.", en: "The scenario market prices already incorporate today for the future, even before the event actually occurs." } },
  ],
  intuition: {
    fr: "Quand un trader dit \"le marché price 80% de chances de baisse des taux\", il ne devine pas au hasard : ce chiffre se lit directement dans les prix des instruments de taux courts (futures Fed Funds, swaps OIS), qui incorporent en permanence la probabilité collective attribuée par les investisseurs à chaque décision future de banque centrale. Ce qui fait bouger les marchés n'est donc pas la décision elle-même, mais l'écart entre cette décision et ce qui était déjà anticipé.",
    en: "When a trader says \"the market is pricing an 80% chance of a rate cut\", they are not guessing at random: this figure is read directly from short-term rate instrument prices (Fed Funds futures, OIS swaps), which continuously embed investors' collective probability for each future central bank decision. What moves markets is therefore not the decision itself, but the gap between that decision and what was already expected.",
  },
  definition: {
    fr: "Un contrat futures Fed Funds se cote comme 100 moins le taux Fed Funds moyen anticipé sur le mois du contrat, ce qui permet d'en extraire directement une anticipation de taux. Plus généralement, en comparant un taux OIS (qui reflète le taux directeur moyen anticipé sur sa période) au taux directeur actuel, on peut estimer la probabilité implicite qu'une variation de taux d'une taille donnée survienne d'ici l'échéance considérée.",
    en: "A Fed Funds futures contract is quoted as 100 minus the average expected Fed Funds rate over the contract's month, which directly yields a rate expectation. More generally, by comparing an OIS rate (which reflects the average expected policy rate over its period) to the current policy rate, one can estimate the implied probability that a rate change of a given size occurs by the considered horizon.",
  },
  utility: {
    fr: "Savoir lire ces anticipations est indispensable pour interpréter correctement une décision de banque centrale : une décision \"conforme aux attentes\" a un impact de marché limité, tandis qu'une décision \"surprise\" (même de faible ampleur) peut provoquer un mouvement violent. C'est aussi la base de toute stratégie de trading de taux courts ou de positionnement en anticipation d'une réunion de banque centrale.",
    en: "Being able to read these expectations is essential to correctly interpret a central bank decision: a decision \"in line with expectations\" has limited market impact, while a \"surprise\" decision (even a small one) can trigger a sharp move. It is also the basis for any short-rate trading strategy or positioning ahead of a central bank meeting.",
  },
  example: {
    fr: "Le taux directeur actuel est de 5,00%. Le taux OIS à l'échéance de la prochaine réunion implique un taux moyen anticipé de 5,10%, et le marché n'envisage qu'une seule taille de mouvement possible : une hausse de 0,25%. La probabilité implicite de cette hausse est (5,10% − 5,00%) / 0,25% = 40%.",
    en: "The current policy rate is 5.00%. The OIS rate at the next meeting's horizon implies an average expected rate of 5.10%, and the market only considers one possible move size: a 0.25% hike. The implied probability of this hike is (5.10% − 5.00%) / 0.25% = 40%.",
  },
  alternativeExplanation: {
    fr: "Pensez aux cotes d'un pari sportif : elles ne prédisent pas le résultat avec certitude, mais reflètent la probabilité collective que le marché des parieurs attribue à chaque issue. De la même façon, les prix des instruments de taux courts ne prédisent pas la décision de la banque centrale, ils reflètent la probabilité que l'ensemble des investisseurs attribue collectivement à chaque scénario possible — une probabilité qui évolue en continu à mesure que de nouvelles informations arrivent.",
    en: "Think of sports betting odds: they don't predict the outcome with certainty, but reflect the collective probability the betting market assigns to each outcome. Similarly, short-rate instrument prices don't predict the central bank's decision, they reflect the probability all investors collectively assign to each possible scenario — a probability that continuously evolves as new information arrives.",
  },
  formula: {
    latex: "\\begin{aligned} \\text{Prix futures} &= 100 - \\bar{r}_{\\text{anticipé}} \\\\ p &= \\frac{f - r_0}{\\Delta} \\end{aligned}",
    variables: [
      { symbol: "\\bar{r}_{\\text{anticipé}}", description: { fr: "Taux directeur moyen anticipé sur la période du contrat futures", en: "Average expected policy rate over the futures contract's period" } },
      { symbol: "p", description: { fr: "Probabilité implicite du mouvement de taux anticipé", en: "Implied probability of the anticipated rate move" } },
      { symbol: "f", description: { fr: "Taux moyen anticipé impliqué par un instrument de taux court (OIS, futures)", en: "Average expected rate implied by a short-rate instrument (OIS, futures)" } },
      { symbol: "r_0, \\Delta", description: { fr: "Taux directeur actuel, et taille du mouvement anticipé (avec son signe)", en: "Current policy rate, and the size of the anticipated move (with its sign)" } },
    ],
    assumptions: { fr: "Modèle simplifié à un seul mouvement possible de taille Δ (hausse ou baisse) ; en pratique, le marché anticipe souvent une distribution sur plusieurs tailles de mouvement possibles, ce qui complique le calcul. Ignore toute prime de terme.", en: "Simplified model with a single possible move of size Δ (hike or cut); in practice, the market often expects a distribution across several possible move sizes, complicating the calculation. Ignores any term premium." },
    units: { fr: "Taux et probabilité en proportion (%).", en: "Rates and probability as a proportion (%)." },
    example: { fr: "r0=5,00%, f=5,10%, Δ=+0,25% → p=(5,10%−5,00%)/0,25%=40%.", en: "r0=5.00%, f=5.10%, Δ=+0.25% → p=(5.10%−5.00%)/0.25%=40%." },
  },
  calculation: {
    fr: "1) Relever le taux directeur actuel r0. 2) Relever le taux moyen anticipé f, lu sur un instrument de taux court (OIS ou futures) à l'échéance considérée. 3) Définir la taille du mouvement Δ envisagé par le marché. 4) Diviser l'écart (f − r0) par Δ pour obtenir la probabilité implicite.",
    en: "1) Read off the current policy rate r0. 2) Read off the average expected rate f, from a short-rate instrument (OIS or futures) at the considered horizon. 3) Define the move size Δ the market envisions. 4) Divide the gap (f − r0) by Δ to get the implied probability.",
  },
  interpretation: {
    fr: "Quand une décision de banque centrale correspond exactement à ce qui était déjà pricé, la réaction de marché est souvent limitée : l'essentiel de l'information était déjà intégré dans les prix. Ce qui fait bouger les marchés lors d'une réunion, c'est le plus souvent la révision des anticipations pour les réunions FUTURES (via le discours, les projections de taux ou \"dot plot\"), pas la décision du jour elle-même.",
    en: "When a central bank decision exactly matches what was already priced, the market reaction is often limited: most of the information was already incorporated into prices. What moves markets at a meeting is most often the revision of expectations for FUTURE meetings (via the statement, rate projections or \"dot plot\"), not the day's decision itself.",
  },
  pitfalls: {
    fr: "Confondre la probabilité de la PROCHAINE décision avec l'ensemble du chemin de taux anticipé par le marché sur toutes les réunions futures — ce sont deux informations différentes, et c'est souvent la révision du chemin complet qui fait le plus bouger les marchés. Autre piège : croire qu'une probabilité implicite de 80% signifie une quasi-certitude ; c'est une probabilité de marché, pas une prévision garantie.",
    en: "Confusing the probability of the NEXT decision with the entire rate path the market expects across all future meetings — these are two different pieces of information, and it is often the revision of the full path that moves markets the most. Another trap: believing an 80% implied probability means near-certainty; it is a market-implied probability, not a guaranteed forecast.",
  },
  keyPoints: {
    fr: [
      "Les anticipations de taux directeurs se lisent directement dans les prix des instruments de taux courts (futures Fed Funds, OIS).",
      "Une décision \"conforme aux attentes\" a un impact de marché limité ; c'est la surprise (ou la révision du chemin futur) qui fait bouger les prix.",
      "p = (f − r0) / Δ donne une probabilité implicite simplifiée, pas une prévision garantie.",
    ],
    en: [
      "Policy rate expectations are read directly from short-rate instrument prices (Fed Funds futures, OIS).",
      "A decision \"in line with expectations\" has limited market impact; it is the surprise (or the revision of the future path) that moves prices.",
      "p = (f − r0) / Δ gives a simplified implied probability, not a guaranteed forecast.",
    ],
  },
  advancedDemonstration: {
    fr: "En pratique, les salles de marché (et des outils publics comme le CME FedWatch) construisent, à partir de toute la courbe des futures Fed Funds, une distribution de probabilités sur plusieurs tailles de mouvement possibles (statu quo, +25pb, +50pb...) pour chaque réunion future, pas seulement un scénario binaire. Une décision peut ainsi être qualifiée de \"hawkish hold\" (statu quo aujourd'hui, mais discours suggérant des hausses futures plus probables) ou de \"dovish cut\" (baisse aujourd'hui, mais discours suggérant que c'est la dernière baisse du cycle) : dans les deux cas, le mouvement de marché qui suit dépend de la révision du chemin de taux FUTUR anticipé, bien plus que de la décision du jour. En zone euro, c'est le taux €STR (au jour le jour, garanti) qui sert de référence pour construire les OIS utilisés à la même fin que les futures Fed Funds aux États-Unis.",
    en: "In practice, trading floors (and public tools like CME FedWatch) build, from the entire Fed Funds futures curve, a probability distribution across several possible move sizes (status quo, +25bp, +50bp...) for each future meeting, not just a binary scenario. A decision can thus be described as a \"hawkish hold\" (status quo today, but a statement suggesting future hikes are more likely) or a \"dovish cut\" (a cut today, but a statement suggesting it's the cycle's last cut): in both cases, the market move that follows depends on the revision of the anticipated FUTURE rate path, far more than on the day's decision. In the euro area, the €STR rate (overnight, secured) serves as the reference for building the OIS used for the same purpose as Fed Funds futures in the US.",
  },
};
