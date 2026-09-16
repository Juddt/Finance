import type { LessonContent } from "@/lib/lesson-types";

export const m04SwapFixeVariable: LessonContent = {
  conceptId: "m04-swap-fixe-variable",
  prerequisiteReminder: {
    text: {
      fr: "Il faut comprendre le fonctionnement d'un FRA, un swap n'étant essentiellement qu'une série de FRA.",
      en: "You need to understand how an FRA works, since a swap is essentially just a series of FRAs.",
    },
    conceptIds: ["m04-fra"],
  },
  glossary: [
    { term: { fr: "Jambe fixe / jambe variable", en: "Fixed leg / floating leg" }, definition: { fr: "Les deux séries de flux échangés dans un swap : l'une à taux constant, l'autre indexée sur un taux de référence révisé périodiquement.", en: "The two series of flows exchanged in a swap: one at a constant rate, the other indexed to a reference rate reset periodically." } },
    { term: { fr: "Taux au pair (par rate)", en: "Par rate" }, definition: { fr: "Le taux fixe qui rend la valeur du swap nulle à sa conclusion.", en: "The fixed rate that makes the swap's value zero at inception." } },
  ],
  intuition: {
    fr: "Un swap de taux, c'est un échange régulier entre deux flux d'intérêts sur un même notionnel fictif : l'un prévisible et fixe, l'autre qui suit le marché. Personne ne prête ni n'emprunte le capital — seule la différence entre les deux jambes change de main à chaque échéance.",
    en: "A rate swap is a regular exchange between two streams of interest on the same notional (never lent or borrowed): one predictable and fixed, the other tracking the market. Nobody actually lends or borrows the principal — only the difference between the two legs changes hands at each date.",
  },
  definition: {
    fr: "Un swap de taux fixe/variable (IRS) est un contrat par lequel deux parties échangent, sur un notionnel commun et à des dates périodiques, des flux d'intérêt calculés l'un à un taux fixe R (la jambe fixe), l'autre à un taux variable révisé à chaque période (la jambe variable). Le payeur fixe verse la jambe fixe et reçoit la jambe variable ; le receveur fixe fait l'inverse.",
    en: "A fixed/floating rate swap (IRS) is a contract by which two parties exchange, on a common notional and at periodic dates, interest flows computed one at a fixed rate R (the fixed leg), the other at a floating rate reset each period (the floating leg). The fixed-rate payer pays the fixed leg and receives the floating leg; the fixed-rate receiver does the reverse.",
  },
  utility: {
    fr: "Le swap permet de transformer la nature d'une dette ou d'un placement sans le renégocier : une entreprise endettée à taux variable peut \"passer à taux fixe\" en payant fixe / recevant variable sur un swap, sans toucher à son prêt d'origine.",
    en: "The swap lets you transform the nature of a debt or investment without renegotiating it: a company with floating-rate debt can \"switch to fixed\" by paying fixed / receiving floating on a swap, without touching its original loan.",
  },
  example: {
    fr: "Une entreprise a un prêt de 10 000 000 EUR à taux variable (EURIBOR 3M) sur 5 ans, et craint une hausse des taux. Elle entre dans un swap 5 ans où elle paie fixe 3,2% et reçoit EURIBOR 3M sur le même notionnel. Les flux variables reçus sur le swap compensent presque exactement ceux payés sur le prêt : son coût net devient environ fixe à 3,2%.",
    en: "A company has a EUR 10,000,000 floating-rate loan (3M EURIBOR) over 5 years, and fears rising rates. It enters a 5-year swap where it pays fixed 3.2% and receives 3M EURIBOR on the same notional. The floating flows received on the swap almost exactly offset those paid on the loan: its net cost becomes roughly fixed at 3.2%.",
  },
  alternativeExplanation: {
    fr: "Imaginez deux voisins qui échangent leurs factures d'électricité : l'un a un contrat à prix fixe, l'autre un contrat indexé sur le marché. Ils ne changent pas de fournisseur ni ne déménagent — ils se contentent d'échanger entre eux la différence, chaque mois, comme s'ils avaient interverti leurs contrats sans jamais les résilier.",
    en: "Picture two neighbors swapping their electricity bills: one has a fixed-price contract, the other a market-indexed one. They don't switch suppliers or move — they simply exchange the difference between them each month, as if they'd traded contracts without ever canceling either.",
  },
  formula: {
    latex: "\\text{Flux net}_t = \\text{Notionnel} \\times (R_{\\text{variable},t} - R_{\\text{fixe}}) \\times \\delta_t",
    variables: [
      { symbol: "R_{\\text{variable},t}", description: { fr: "Taux de référence observé pour la période t", en: "Reference rate observed for period t" } },
      { symbol: "R_{\\text{fixe}}", description: { fr: "Taux fixe contractuel du swap", en: "The swap's contractual fixed rate" } },
      { symbol: "\\delta_t", description: { fr: "Fraction d'année de la période t (ex. 0,25 pour un trimestre)", en: "Year fraction of period t (e.g. 0.25 for a quarter)" } },
    ],
    assumptions: { fr: "En pratique, seul ce flux net est échangé à chaque date (compensation, \"netting\") plutôt que les deux flux bruts.", en: "In practice, only this net flow is exchanged on each date (netting), rather than the two gross flows." },
    units: { fr: "Flux net dans la devise du notionnel ; taux en proportion annuelle.", en: "Net flow in the notional's currency; rates as annual proportions." },
    example: { fr: "Notionnel=10 000 000, R_variable=3,5%, R_fixe=3,2%, δ=0,25 : Flux net = 10 000 000×0,003×0,25 = 7 500 reçus par le receveur variable.", en: "Notional=10,000,000, R_variable=3.5%, R_fixe=3.2%, δ=0.25: Net flow = 10,000,000×0.003×0.25 = 7,500 received by the floating receiver." },
  },
  calculation: {
    fr: "1) À chaque date de reset, observer le taux de référence R_variable pour la période. 2) Calculer le flux fixe = Notionnel × R_fixe × δ et le flux variable = Notionnel × R_variable × δ. 3) Ne payer que la différence nette (netting). 4) Répéter à chaque période jusqu'à l'échéance du swap.",
    en: "1) At each reset date, observe the reference rate R_variable for the period. 2) Compute the fixed flow = Notional × R_fixe × δ and the floating flow = Notional × R_variable × δ. 3) Only pay the net difference (netting). 4) Repeat each period until the swap's maturity.",
  },
  interpretation: {
    fr: "Le payeur fixe profite d'une hausse des taux (il reçoit plus sur la jambe variable qu'il ne paie sur la jambe fixe) ; le receveur fixe profite d'une baisse. Un swap de taux au pair a une valeur initiale nulle : ni l'une ni l'autre partie ne paie de prime à l'entrée.",
    en: "The fixed payer benefits from a rate rise (receiving more on the floating leg than paying on the fixed leg); the fixed receiver benefits from a fall. A par-rate swap has zero initial value: neither party pays a premium at entry.",
  },
  pitfalls: {
    fr: "Croire qu'un swap implique un échange du notionnel : ce n'est jamais le cas (sauf pour un swap de devises, hors périmètre ici), le notionnel ne sert qu'au calcul des intérêts. Autre piège : confondre payeur fixe et receveur fixe, une inversion fréquente qui change complètement le sens de la couverture.",
    en: "Believing a swap involves exchanging the notional: this never happens (except for a currency swap, out of scope here), the notional only serves to compute interest. Another trap: confusing fixed payer and fixed receiver, a frequent mix-up that completely flips the hedge's direction.",
  },
  keyPoints: {
    fr: [
      "Le swap échange une jambe fixe contre une jambe variable sur un notionnel jamais échangé.",
      "Payeur fixe = protégé contre une hausse des taux ; receveur fixe = protégé contre une baisse.",
      "Un swap au taux au pair a une valeur nulle à l'origine ; en pratique, seul le flux net est réglé.",
    ],
    en: [
      "The swap exchanges a fixed leg for a floating leg on a notional that is never exchanged.",
      "Fixed payer = protected against a rate rise; fixed receiver = protected against a fall.",
      "A par-rate swap has zero value at inception; in practice, only the net flow is settled.",
    ],
  },
  advancedDemonstration: {
    fr: "Le swap peut se voir comme un \"strip\" (une série) de FRA consécutifs, un pour chaque période de reset, chacun réglé à sa date plutôt qu'actualisé en début de période comme un FRA isolé (voir M04-1). Cette équivalence permet de pricer chaque flux variable comme un flux forward implicite issu de la courbe des taux, et prépare directement les deux méthodes de pricing d'un swap développées en M04-3 (différence de jambes obligataires, ou somme de FRA actualisés).",
    en: "The swap can be seen as a \"strip\" (a series) of consecutive FRAs, one per reset period, each settled on its own date rather than discounted to the start of the period like a standalone FRA (see M04-1). This equivalence lets each floating flow be priced as an implied forward flow from the yield curve, and sets up directly the two swap pricing methods developed in M04-3 (bond-legs difference, or sum of discounted FRAs).",
  },
};
