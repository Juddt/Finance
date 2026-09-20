import type { LessonContent } from "@/lib/lesson-types";

export const m03RepoCollateral: LessonContent = {
  conceptId: "m03-repo-collateral",
  prerequisiteReminder: {
    text: {
      fr: "Il faut savoir ce qu'est une obligation et son prix, présentés dans les deux premières notions de ce module.",
      en: "You need to know what a bond is and how it is priced, covered in the first two concepts of this module.",
    },
    conceptIds: ["m03-definition-obligations", "m03-pricing-obligation"],
  },
  glossary: [
    { term: { fr: "Repo (mise en pension)", en: "Repo (repurchase agreement)" }, definition: { fr: "La vente d'un titre aujourd'hui avec l'engagement de le racheter à une date et un prix fixés à l'avance : économiquement, un emprunt de cash garanti par ce titre.", en: "The sale of a security today with a commitment to repurchase it at a pre-agreed date and price: economically, a cash loan collateralized by that security." } },
    { term: { fr: "Décote (Haircut)", en: "Haircut" }, definition: { fr: "La différence entre la valeur de marché du collatéral et le montant de cash effectivement prêté, qui protège le prêteur contre une baisse du prix du collatéral pendant la durée du repo.", en: "The gap between the collateral's market value and the cash actually lent, which protects the lender against a drop in the collateral's price during the repo's life." } },
  ],
  intuition: {
    fr: "Un repo, c'est un prêt gagé : au lieu d'emprunter du cash \"à nu\" (sans garantie), l'emprunteur remet temporairement une obligation en garantie au prêteur, qui la lui restitue dès que le prêt est remboursé. Parce que le prêteur est protégé par cette garantie, il accepte un taux d'intérêt bien plus bas que sur un prêt non garanti — exactement la logique d'un prêt sur gage.",
    en: "A repo is a collateralized loan: instead of borrowing cash \"bare\" (unsecured), the borrower temporarily hands over a bond as collateral to the lender, who returns it as soon as the loan is repaid. Because the lender is protected by this collateral, they accept a much lower interest rate than on an unsecured loan — exactly the logic of a pawnshop loan.",
  },
  definition: {
    fr: "Un repo (repurchase agreement) est la vente d'un titre (souvent une obligation d'État) aujourd'hui contre du cash, assortie de l'engagement de le racheter à une date future à un prix fixé d'avance, légèrement supérieur au prix de vente : cet écart correspond à l'intérêt du prêt, le taux repo. Vu du côté du prêteur de cash, l'opération s'appelle un reverse repo. Une décote (haircut) est généralement appliquée : le cash prêté est inférieur à la valeur de marché du collatéral, pour protéger le prêteur contre une variation de prix du titre pendant la durée du repo.",
    en: "A repo (repurchase agreement) is the sale of a security (often a government bond) today for cash, together with a commitment to repurchase it at a future date at a pre-agreed price, slightly above the sale price: this gap corresponds to the loan's interest, the repo rate. Seen from the cash lender's side, the transaction is called a reverse repo. A haircut is usually applied: the cash lent is below the collateral's market value, to protect the lender against a price move in the security during the repo's life.",
  },
  utility: {
    fr: "Le marché du repo est la principale source de financement à court terme des banques et des teneurs de marché en obligations, et le support des opérations d'open market des banques centrales pour injecter ou retirer de la liquidité. Depuis l'abandon du LIBOR, les nouveaux taux de référence (SOFR aux États-Unis, €STR en zone euro) sont directement construits à partir de transactions repo réelles, ce qui en fait aussi le socle du taux \"sans risque\" utilisé pour l'actualisation (voir la notion suivante).",
    en: "The repo market is the main source of short-term funding for banks and bond dealers, and the vehicle for central banks' open market operations to inject or withdraw liquidity. Since LIBOR's retirement, the new reference rates (SOFR in the US, €STR in the euro area) are built directly from actual repo transactions, making it also the foundation of the \"risk-free\" rate used for discounting (see the next concept).",
  },
  example: {
    fr: "Un teneur de marché a besoin de 98 000 000 EUR de cash pour une nuit. Il met en pension (repo) une obligation d'État valant 100 000 000 EUR au prix de marché, avec une décote de 2% : il reçoit donc 98 000 000 EUR aujourd'hui, et s'engage à racheter l'obligation demain pour 98 000 000 × (1 + 3%/360) ≈ 98 008 167 EUR au taux repo au jour le jour de 3%.",
    en: "A dealer needs EUR 98,000,000 of cash overnight. It repos out a government bond worth EUR 100,000,000 at market price, with a 2% haircut: it therefore receives EUR 98,000,000 today, and commits to repurchase the bond tomorrow for 98,000,000 × (1 + 3%/360) ≈ EUR 98,008,167 at the 3% overnight repo rate.",
  },
  alternativeExplanation: {
    fr: "Comparez le repo à un prêt sur gage chez un prêteur sur gages : vous déposez un objet de valeur (l'obligation) en échange de cash, avec un montant prêté inférieur à la valeur de l'objet (le \"haircut\", pour se couvrir si l'objet perd de la valeur), et vous récupérez votre objet en remboursant le prêt plus intérêts. La seule différence est que le repo se dénoue presque toujours (défaut rarissime sur du collatéral d'État), alors qu'un gage peut être définitivement perdu si le prêt n'est jamais remboursé.",
    en: "Compare a repo to a pawnshop loan: you deposit a valuable item (the bond) in exchange for cash, with a lent amount below the item's value (the \"haircut\", to cover against the item losing value), and you get your item back by repaying the loan plus interest. The only difference is that a repo almost always unwinds smoothly (default on government collateral is extremely rare), whereas a pawned item can be permanently lost if the loan is never repaid.",
  },
  formula: {
    latex: "\\begin{aligned} P_{rachat} &= P \\times \\left(1 + r_{repo} \\times \\frac{d}{360}\\right) \\\\ h &= \\frac{V_{collatéral} - C}{V_{collatéral}} \\end{aligned}",
    variables: [
      { symbol: "P_{rachat}, P", description: { fr: "Prix de rachat à l'échéance et prix de vente initial du repo", en: "Repurchase price at maturity and the repo's initial sale price" } },
      { symbol: "r_{repo}", description: { fr: "Taux repo annuel", en: "Annual repo rate" } },
      { symbol: "d", description: { fr: "Nombre de jours du repo", en: "Number of days of the repo" } },
      { symbol: "h", description: { fr: "Décote (haircut), en proportion", en: "Haircut, as a proportion" } },
      { symbol: "V_{collatéral}, C", description: { fr: "Valeur de marché du collatéral et montant de cash effectivement prêté", en: "Collateral's market value and cash actually lent" } },
    ],
    assumptions: { fr: "Convention actif/360 (marché monétaire) ; taux d'intérêt simple sur la durée du repo ; collatéral supposé sans risque de défaut (typiquement dette d'État).", en: "Actual/360 convention (money market); simple interest over the repo's life; collateral assumed free of default risk (typically government debt)." },
    units: { fr: "Prix en devise ; taux en proportion annuelle ; décote en %.", en: "Price in currency; rate as an annual proportion; haircut in %." },
    example: { fr: "P=98 000 000, r_repo=3%, d=1 → P_rachat ≈ 98 008 167. V=100 000 000, C=98 000 000 → h=2%.", en: "P=98,000,000, r_repo=3%, d=1 → P_repurchase ≈ 98,008,167. V=100,000,000, C=98,000,000 → h=2%." },
  },
  calculation: {
    fr: "1) Relever le prix de vente initial P, le taux repo et le nombre de jours d. 2) Calculer l'intérêt : P × r_repo × d/360. 3) Ajouter cet intérêt à P pour obtenir le prix de rachat. 4) Pour la décote : soustraire le cash prêté de la valeur du collatéral, diviser par la valeur du collatéral.",
    en: "1) Read off the initial sale price P, the repo rate and the number of days d. 2) Compute the interest: P × r_repo × d/360. 3) Add this interest to P to get the repurchase price. 4) For the haircut: subtract the cash lent from the collateral's value, divide by the collateral's value.",
  },
  interpretation: {
    fr: "Le taux repo est proche du taux sans risque précisément parce que le prêt est garanti par un collatéral de haute qualité : plus le collatéral est perçu comme sûr et liquide, plus le taux repo est bas. Un écart inhabituel entre le taux repo et les taux de référence signale souvent une tension de financement ou une rareté ponctuelle d'un collatéral précis (voir \"repo spécial\" en approfondissement).",
    en: "The repo rate is close to the risk-free rate precisely because the loan is secured by high-quality collateral: the safer and more liquid the collateral is perceived to be, the lower the repo rate. An unusual gap between the repo rate and reference rates often signals funding stress or a temporary scarcity of a specific piece of collateral (see \"special repo\" below).",
  },
  pitfalls: {
    fr: "Confondre le taux repo (le coût du financement à court terme, lié à l'offre et la demande de cash et de collatéral) avec le coupon de l'obligation mise en pension, qui n'a aucun lien direct avec lui. Autre piège : oublier que la décote protège contre un scénario précis (chute du prix du collatéral avant le dénouement), pas contre le risque de défaut de la contrepartie elle-même, qui reste géré séparément.",
    en: "Confusing the repo rate (the cost of short-term funding, tied to the supply and demand for cash and collateral) with the coupon of the bond being repoed, which has no direct link to it. Another trap: forgetting the haircut protects against one specific scenario (the collateral's price falling before unwind), not against the counterparty's own default risk, which is managed separately.",
  },
  keyPoints: {
    fr: [
      "Un repo est un prêt de cash garanti par un titre (collatéral) : le taux repo est bien plus bas qu'un emprunt non garanti.",
      "La décote (haircut) protège le prêteur contre une baisse de valeur du collatéral pendant la durée du repo.",
      "Les taux de référence modernes (SOFR, €STR) sont construits directement à partir des transactions repo réelles.",
    ],
    en: [
      "A repo is a cash loan secured by a security (collateral): the repo rate is much lower than an unsecured loan.",
      "The haircut protects the lender against a drop in the collateral's value during the repo's life.",
      "Modern reference rates (SOFR, €STR) are built directly from actual repo transactions.",
    ],
  },
  advancedDemonstration: {
    fr: "On distingue le repo \"general collateral\" (GC), où n'importe quelle obligation d'une catégorie éligible fait l'affaire, du repo \"spécial\", où une obligation PRÉCISE est demandée (par exemple pour couvrir une position vendeuse à découvert sur ce titre exact — voir M01, vente à découvert). Sur un repo spécial, la forte demande pour ce titre précis fait chuter le taux repo bien en dessous du taux GC, parfois même en territoire négatif : emprunter du cash contre ce collatéral devient si recherché que le prêteur de cash accepte de payer pour l'obtenir. En septembre 2019, le marché du repo américain a connu un choc de tension inhabituel (le taux repo au jour le jour a brièvement dépassé 10%, bien au-dessus du taux directeur de la Fed), déclenché par une combinaison de règlements fiscaux, d'émissions massives de dette du Trésor et de réserves bancaires devenues insuffisantes — un épisode qui a conduit la Fed à relancer des opérations de repo permanentes pour stabiliser durablement ce marché, tant il est jugé critique pour le bon fonctionnement de l'ensemble du système financier.",
    en: "A distinction is made between \"general collateral\" (GC) repo, where any bond from an eligible category will do, and \"special\" repo, where one SPECIFIC bond is requested (for example to cover a short-selling position on that exact security — see M01, short selling). In a special repo, strong demand for that specific security pushes the repo rate well below the GC rate, sometimes even into negative territory: borrowing cash against that collateral becomes so sought-after that the cash lender agrees to pay to obtain it. In September 2019, the US repo market experienced an unusual stress episode (the overnight repo rate briefly exceeded 10%, well above the Fed's policy rate), triggered by a combination of tax settlements, heavy Treasury debt issuance and bank reserves that had become insufficient — an episode that led the Fed to relaunch standing repo operations to durably stabilize this market, considered critical to the smooth functioning of the entire financial system.",
  },
};
