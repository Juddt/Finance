import type { LessonContent } from "@/lib/lesson-types";

export const m03CarryRollDown: LessonContent = {
  conceptId: "m03-carry-roll-down",
  prerequisiteReminder: {
    text: {
      fr: "Il faut comprendre le pricing d'une obligation et la notion de courbe des taux, présentés dans les notions précédentes de ce module.",
      en: "You need to understand bond pricing and the notion of the yield curve, covered in the previous concepts of this module.",
    },
    conceptIds: ["m03-pricing-obligation", "m03-taux-sans-risque"],
  },
  glossary: [
    { term: { fr: "Carry", en: "Carry" }, definition: { fr: "Le gain (ou coût) de détenir une position pendant une période donnée, si rien ne change sur le marché (coupon perçu moins coût de financement).", en: "The gain (or cost) of holding a position over a given period, if nothing changes in the market (coupon received minus funding cost)." } },
    { term: { fr: "Roll-down", en: "Roll-down" }, definition: { fr: "Le gain (ou perte) en prix résultant du \"glissement\" d'une obligation le long d'une courbe des taux qui reste inchangée dans le temps, à mesure que sa maturité résiduelle diminue.", en: "The price gain (or loss) resulting from a bond \"rolling down\" an unchanged yield curve over time, as its remaining maturity shortens." } },
  ],
  intuition: {
    fr: "Un investisseur obligataire ne gagne pas de l'argent seulement quand les taux baissent : même si la courbe des taux reste rigoureusement identique dans un mois, sa position aura probablement changé de valeur, pour deux raisons distinctes. D'abord, il a perçu (ou payé) un flux net pendant cette période (le carry). Ensuite, son obligation a \"vieilli\" d'un mois sur une courbe généralement croissante avec la maturité, donc son taux de rendement implicite a mécaniquement un peu baissé, ce qui fait monter son prix (le roll-down).",
    en: "A bond investor doesn't only make money when rates fall: even if the yield curve stays exactly the same a month from now, their position will likely have changed value, for two distinct reasons. First, they received (or paid) a net flow over that period (carry). Second, their bond has \"aged\" by a month on a curve that's generally upward-sloping with maturity, so its implied yield has mechanically dropped slightly, pushing its price up (roll-down).",
  },
  definition: {
    fr: "Le carry est le gain (ou coût) de détenir une position pendant une période donnée si le marché ne bouge pas, généralement le coupon perçu diminué du coût de financement de la position (taux repo). Le roll-down est le gain (ou perte) en prix résultant du glissement de l'obligation le long d'une courbe des taux supposée INCHANGÉE, à mesure que sa maturité résiduelle raccourcit — sur une courbe croissante avec la maturité, une obligation qui \"vieillit\" voit typiquement son rendement exigé baisser légèrement, donc son prix monter.",
    en: "Carry is the gain (or cost) of holding a position over a given period if the market doesn't move, generally the coupon received minus the position's funding cost (repo rate). Roll-down is the price gain (or loss) resulting from the bond rolling down an UNCHANGED yield curve, as its remaining maturity shortens — on an upward-sloping curve, an \"aging\" bond typically sees its required yield drop slightly, hence its price rise.",
  },
  utility: {
    fr: "Carry et roll-down sont les deux sources de gain d'une position obligataire qui ne dépendent PAS d'un mouvement de taux : elles expliquent pourquoi une position peut rester profitable même si les taux ne bougent pas du tout, et permettent de comparer objectivement deux positions ayant le même DV01 mais des profils de carry/roll-down très différents. Un trader qui ignore ces deux composantes attribuerait à tort tout le P&L observé à un mouvement de taux, alors qu'une partie provient simplement du temps qui passe.",
    en: "Carry and roll-down are the two sources of gain on a bond position that do NOT depend on a rate move: they explain why a position can stay profitable even if rates don't move at all, and allow objectively comparing two positions with the same DV01 but very different carry/roll-down profiles. A trader who ignores these two components would wrongly attribute all observed P&L to a rate move, when part of it simply comes from the passage of time.",
  },
  example: {
    fr: "Une obligation à 10 ans offre un rendement de 3,5%, tandis que le coût de financement repo est de 3,0% : le carry sur un an est d'environ +0,5% de la valeur de la position. Si, en plus, le rendement d'une obligation à 9 ans (sur la même courbe, inchangée) est de 3,3% (contre 3,5% pour l'obligation à 10 ans), l'obligation initiale bénéficie d'un roll-down supplémentaire d'environ 0,2% de rendement en moins sur un an, ce qui pousse son prix à la hausse — même si la courbe des taux dans son ensemble n'a pas du tout bougé.",
    en: "A 10-year bond yields 3.5%, while the repo funding cost is 3.0%: the one-year carry is about +0.5% of the position's value. If, in addition, a 9-year bond's yield (on the same, unchanged curve) is 3.3% (vs 3.5% for the 10-year bond), the original bond benefits from an extra roll-down of about 0.2% less yield over one year, pushing its price up — even though the yield curve as a whole hasn't moved at all.",
  },
  alternativeExplanation: {
    fr: "Imaginez une échelle immobile (la courbe des taux inchangée) et une personne qui descend d'un barreau chaque mois (le temps qui passe, la maturité qui raccourcit). Le carry, c'est le \"salaire\" perçu pendant la descente (le coupon net du financement). Le roll-down, c'est le fait que le barreau du bas offre une vue différente (un rendement différent) du barreau du haut, même si l'échelle elle-même n'a pas bougé d'un centimètre.",
    en: "Picture a motionless ladder (the unchanged yield curve) and a person stepping down one rung each month (time passing, maturity shortening). Carry is the \"wage\" earned during the descent (the coupon net of funding). Roll-down is the fact that the bottom rung offers a different view (a different yield) than the top rung, even though the ladder itself hasn't moved an inch.",
  },
  formula: {
    latex: "\\begin{aligned} \\text{Carry} &\\approx (y - r_{repo}) \\times \\Delta t \\\\ \\text{Roll-down} &\\approx -D \\times (y_{T-\\Delta t} - y_T) \\end{aligned}",
    variables: [
      { symbol: "y", description: { fr: "Rendement de l'obligation détenue", en: "The held bond's yield" } },
      { symbol: "r_{repo}", description: { fr: "Taux de financement repo de la position", en: "The position's repo funding rate" } },
      { symbol: "\\Delta t", description: { fr: "Période de détention considérée (en années)", en: "The holding period considered (in years)" } },
      { symbol: "D", description: { fr: "Duration modifiée de l'obligation", en: "The bond's modified duration" } },
      { symbol: "y_{T-\\Delta t} - y_T", description: { fr: "Écart de rendement entre la maturité restante après la période de détention et la maturité actuelle, sur la courbe INCHANGÉE", en: "The yield gap between the remaining maturity after the holding period and the current maturity, on the UNCHANGED curve" } },
    ],
    assumptions: { fr: "Suppose une courbe des taux rigoureusement inchangée pendant la période de détention (aucun mouvement de marché) — le carry et le roll-down sont précisément les gains obtenus SOUS cette hypothèse, à isoler de tout gain ou perte lié à un mouvement effectif des taux.", en: "Assumes a strictly unchanged yield curve during the holding period (no market move) — carry and roll-down are precisely the gains obtained UNDER this assumption, to be isolated from any gain or loss tied to an actual rate move." },
    units: { fr: "Carry et roll-down en % de rendement ou convertis en variation de prix via la duration.", en: "Carry and roll-down in % yield, or converted to a price change via duration." },
    example: { fr: "y=3,5%, r_repo=3,0%, Δt=1 an → Carry≈+0,5%. y_{9y}=3,3%, y_{10y}=3,5% → Roll-down favorable d'environ 0,2% de rendement en moins.", en: "y=3.5%, r_repo=3.0%, Δt=1yr → Carry≈+0.5%. y_9y=3.3%, y_10y=3.5% → Favorable roll-down of about 0.2% less yield." },
  },
  calculation: {
    fr: "1) Calculer le carry : rendement de l'obligation moins coût de financement repo, multiplié par la période de détention. 2) Lire sur la courbe ACTUELLE (supposée inchangée) le rendement correspondant à la maturité réduite après la période de détention. 3) La différence de rendement entre la maturité initiale et la maturité réduite, multipliée par la duration (avec un signe négatif car rendement et prix varient en sens inverse), donne le roll-down.",
    en: "1) Compute carry: the bond's yield minus the repo funding cost, multiplied by the holding period. 2) Read off the CURRENT curve (assumed unchanged) the yield corresponding to the shortened maturity after the holding period. 3) The yield difference between the initial and the shortened maturity, multiplied by duration (with a negative sign since yield and price move oppositely), gives the roll-down.",
  },
  interpretation: {
    fr: "Sur une courbe des taux normalement croissante (pentue positivement), carry et roll-down sont généralement tous deux positifs pour une position longue obligataire : détenir l'obligation est rémunérateur même sans aucun mouvement de taux. Sur une courbe inversée (taux courts supérieurs aux taux longs), ces deux composantes peuvent devenir négatives, rendant la détention coûteuse même en l'absence de tout mouvement de marché.",
    en: "On a normally upward-sloping yield curve, carry and roll-down are generally both positive for a long bond position: holding the bond is rewarding even with no rate move at all. On an inverted curve (short rates above long rates), these two components can turn negative, making holding costly even absent any market move.",
  },
  pitfalls: {
    fr: "Attribuer tout le P&L observé sur une position obligataire à un mouvement de taux, en oubliant que carry et roll-down génèrent un gain (ou une perte) même si la courbe reste parfaitement stable. Autre piège : supposer que le roll-down est toujours positif — il ne l'est que sur une courbe croissante avec la maturité ; sur une courbe inversée, il devient négatif.",
    en: "Attributing all observed P&L on a bond position to a rate move, forgetting that carry and roll-down generate a gain (or loss) even if the curve stays perfectly stable. Another trap: assuming roll-down is always positive — it only is on a curve upward-sloping with maturity; on an inverted curve, it turns negative.",
  },
  keyPoints: {
    fr: [
      "Carry et roll-down sont les gains (ou pertes) d'une position obligataire QUAND LES TAUX NE BOUGENT PAS.",
      "Carry ≈ (rendement − taux de financement) × période de détention.",
      "Roll-down ≈ −Duration × écart de rendement dû au raccourcissement de maturité sur la courbe inchangée ; positif sur une courbe croissante, négatif sur une courbe inversée.",
    ],
    en: [
      "Carry and roll-down are a bond position's gains (or losses) WHEN RATES DON'T MOVE.",
      "Carry ≈ (yield − funding rate) × holding period.",
      "Roll-down ≈ −Duration × yield gap from the maturity shortening on the unchanged curve; positive on an upward-sloping curve, negative on an inverted one.",
    ],
  },
  advancedDemonstration: {
    fr: "Un gérant obligataire qui compare deux positions au même DV01 choisit souvent celle offrant le meilleur carry-plus-roll-down, car c'est le rendement \"garanti\" (sous l'hypothèse de courbe inchangée) avant tout pari directionnel sur les taux. Cette logique explique pourquoi les segments de courbe les plus pentus attirent typiquement plus de flux d'achat que les segments plats : un même DV01 y offre un carry-plus-roll-down nettement plus élevé, à mouvement de taux égal (nul, dans ce scénario de référence). C'est aussi la raison pour laquelle une stratégie \"buy and roll\" (acheter une obligation à maturité longue puis la revendre avant échéance plutôt que de la conserver jusqu'au terme) peut surperformer une stratégie de portage jusqu'à maturité, précisément parce qu'elle capture le roll-down sur la portion de courbe la plus pentue.",
    en: "A bond manager comparing two positions with the same DV01 often picks the one offering the best carry-plus-roll-down, since that's the \"guaranteed\" return (under the unchanged-curve assumption) before any directional rate bet. This logic explains why the steepest curve segments typically attract more buying flow than flat segments: the same DV01 offers a markedly higher carry-plus-roll-down there, for an equal (zero, in this reference scenario) rate move. It's also why a \"buy and roll\" strategy (buying a long-maturity bond then selling it before maturity rather than holding to term) can outperform a hold-to-maturity strategy, precisely because it captures the roll-down on the steepest part of the curve.",
  },
};
