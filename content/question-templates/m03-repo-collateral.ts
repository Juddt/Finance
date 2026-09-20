import { randomFloat, randomInt, type Rng } from "@/lib/prng";
import type { QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const vocabTemplate: QuestionTemplate = {
  id: "m03-repo-vocab",
  conceptId: "m03-repo-collateral",
  kind: "fill_blank",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "La différence entre la valeur de marché du collatéral et le cash effectivement prêté, qui protège le prêteur contre une baisse de prix, s'appelle la ______.",
      en: "The gap between the collateral's market value and the cash actually lent, which protects the lender against a price drop, is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un mot (terme anglais courant)", en: "one word" },
    acceptedAnswers: ["decote", "haircut"],
    hint: { fr: "Le même mot qu'en anglais financier.", en: "The English finance term itself." },
    explanation: {
      fr: "La décote (haircut) est la marge de sécurité entre la valeur du collatéral et le cash prêté, qui protège le prêteur si le prix du collatéral baisse pendant la durée du repo.",
      en: "The haircut is the safety margin between the collateral's value and the cash lent, protecting the lender if the collateral's price falls during the repo's life.",
    },
    commonMistake: {
      fr: "Confondre la décote avec le taux repo lui-même, qui rémunère le prêt, alors que la décote est une protection contre le risque de prix.",
      en: "Confusing the haircut with the repo rate itself, which compensates the loan, when the haircut is a protection against price risk.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m03-repo-comprehension",
  conceptId: "m03-repo-collateral",
  difficulty: "easy",
  prompt: {
    fr: "À quoi sert principalement le marché du repo pour une banque ou un teneur de marché en obligations ?",
    en: "What is the repo market mainly used for by a bank or bond dealer?",
  },
  choices: [
    { id: "short-term-funding", label: { fr: "Se financer à court terme à moindre coût, en mettant en pension des titres qu'il détient déjà comme collatéral", en: "Obtaining cheap short-term funding, by repoing out securities already held as collateral" } },
    { id: "long-term-investment", label: { fr: "Réaliser un investissement de long terme dans des obligations", en: "Making a long-term investment in bonds" } },
    { id: "unsecured-lending", label: { fr: "Prêter du cash sans aucune garantie à d'autres institutions financières", en: "Lending cash to other financial institutions with no guarantee at all" } },
  ],
  correctId: "short-term-funding",
  hint: { fr: "Le repo transforme un titre détenu en cash disponible immédiatement, à un coût réduit grâce à la garantie.", en: "A repo turns a held security into immediately available cash, at a reduced cost thanks to the collateral." },
  explanation: {
    fr: "Le repo permet à une banque ou un teneur de marché de transformer temporairement des titres qu'il détient en cash disponible immédiatement, à un taux d'intérêt réduit puisque le prêt est garanti par ce collatéral : c'est la principale source de financement à court terme des acteurs qui détiennent d'importants portefeuilles d'obligations.",
    en: "A repo lets a bank or dealer temporarily turn securities it holds into immediately available cash, at a reduced interest rate since the loan is collateralized: it is the main source of short-term funding for players holding large bond portfolios.",
  },
  commonMistake: {
    fr: "Croire que le repo est un investissement de long terme dans des obligations, alors qu'il s'agit d'un outil de financement à très court terme (souvent au jour le jour).",
    en: "Believing a repo is a long-term investment in bonds, when it is a very short-term (often overnight) funding tool.",
  },
});

const securedVsUnsecuredComparisonTemplate = mcqTemplate({
  id: "m03-repo-comparaison-garanti-non-garanti",
  conceptId: "m03-repo-collateral",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi le taux repo (prêt garanti par un collatéral) est-il typiquement bien inférieur au taux d'un prêt interbancaire non garanti de même durée ?",
    en: "Why is the repo rate (a collateral-secured loan) typically much lower than an unsecured interbank loan rate of the same maturity?",
  },
  choices: [
    { id: "lower-risk", label: { fr: "Le prêteur de cash est protégé par le collatéral en cas de défaut de l'emprunteur, ce qui réduit fortement le risque qu'il prend", en: "The cash lender is protected by the collateral in case the borrower defaults, which strongly reduces the risk taken" } },
    { id: "no-difference", label: { fr: "Il n'y a en réalité aucune différence de risque entre les deux types de prêt", en: "There is in fact no risk difference between the two loan types" } },
    { id: "unsecured-lower", label: { fr: "C'est en réalité le prêt non garanti qui est le moins cher des deux", en: "It is in fact the unsecured loan that is the cheaper of the two" } },
  ],
  correctId: "lower-risk",
  hint: { fr: "Le collatéral protège le prêteur : que se passe-t-il pour le taux exigé quand le risque de perte baisse ?", en: "Collateral protects the lender: what happens to the required rate when the risk of loss falls?" },
  explanation: {
    fr: "Un prêt garanti par un collatéral de qualité expose le prêteur à un risque bien plus faible qu'un prêt non garanti (en cas de défaut, il peut vendre le collatéral pour se rembourser) : ce risque réduit se traduit mécaniquement par un taux d'intérêt exigé plus bas, ce qui explique l'écart persistant entre taux repo et taux interbancaire non garanti.",
    en: "A loan secured by quality collateral exposes the lender to much lower risk than an unsecured loan (in case of default, they can sell the collateral to recover their money): this reduced risk mechanically translates into a lower required interest rate, which explains the persistent gap between repo rates and unsecured interbank rates.",
  },
  commonMistake: {
    fr: "Croire que le taux d'un prêt ne dépend que de sa durée, sans tenir compte de la présence ou non d'une garantie.",
    en: "Believing a loan's rate depends only on its maturity, without accounting for whether it is collateralized or not.",
  },
});

const gcVsSpecialComparisonTemplate = mcqTemplate({
  id: "m03-repo-comparaison-gc-special",
  conceptId: "m03-repo-collateral",
  difficulty: "hard",
  prompt: {
    fr: "Quelle différence sépare un repo \"general collateral\" (GC) d'un repo \"spécial\" ?",
    en: "What difference separates a \"general collateral\" (GC) repo from a \"special\" repo?",
  },
  choices: [
    { id: "specific-vs-any", label: { fr: "Le repo spécial porte sur un titre précis très demandé (souvent pour couvrir une vente à découvert), le repo GC accepte n'importe quel titre éligible d'une catégorie", en: "A special repo involves one specific, highly sought-after security (often to cover a short sale), a GC repo accepts any eligible security from a category" } },
    { id: "maturity-difference", label: { fr: "Seule leur durée diffère, le GC étant toujours plus long que le spécial", en: "Only their maturity differs, with GC always longer than special" } },
    { id: "no-real-difference", label: { fr: "Ce sont deux noms différents pour exactement la même opération", en: "These are two different names for exactly the same transaction" } },
  ],
  correctId: "specific-vs-any",
  hint: { fr: "Pensez à un vendeur à découvert qui a besoin d'emprunter UN titre précis, pas n'importe quelle obligation d'État.", en: "Think of a short seller who needs to borrow ONE specific security, not just any government bond." },
  explanation: {
    fr: "Sur un repo GC, l'emprunteur de cash peut livrer n'importe quel titre éligible d'une catégorie (peu importe lequel) : le taux reflète les conditions générales du marché monétaire. Sur un repo spécial, un titre PRÉCIS est demandé (par exemple pour couvrir une vente à découvert sur ce titre exact) : la forte demande pour ce titre spécifique fait baisser le taux repo qui lui est associé, parfois bien en dessous du taux GC.",
    en: "In a GC repo, the cash borrower can deliver any eligible security from a category (it doesn't matter which): the rate reflects general money market conditions. In a special repo, one SPECIFIC security is requested (e.g. to cover a short sale on that exact security): strong demand for that specific security pushes down the associated repo rate, sometimes well below the GC rate.",
  },
  commonMistake: {
    fr: "Traiter tous les repos comme équivalents, sans distinguer le cas où le collatéral lui-même (pas seulement le cash) est l'objet de la demande.",
    en: "Treating all repos as equivalent, without distinguishing the case where the collateral itself (not just the cash) is the object of demand.",
  },
});

const whatIfCollateralScarcityTemplate = mcqTemplate({
  id: "m03-repo-what-if-rarete-collateral",
  conceptId: "m03-repo-collateral",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "De nombreux vendeurs à découvert ont besoin d'emprunter la même obligation d'État précise pour livrer leurs ventes. Que se passe-t-il typiquement sur le taux repo spécial de ce titre ?",
    en: "Many short sellers need to borrow the same specific government bond to deliver their sales. What typically happens to that security's special repo rate?",
  },
  choices: [
    { id: "rate-drops-possibly-negative", label: { fr: "Le taux repo de ce titre chute, potentiellement en territoire négatif : le prêteur de cash accepte de payer pour obtenir ce collatéral très demandé", en: "That security's repo rate drops, potentially into negative territory: the cash lender agrees to pay to obtain this highly demanded collateral" } },
    { id: "rate-unaffected", label: { fr: "Le taux repo de ce titre n'est pas affecté par la demande d'emprunt de titres", en: "That security's repo rate is unaffected by demand to borrow it" } },
    { id: "rate-rises", label: { fr: "Le taux repo de ce titre augmente fortement dans ce scénario", en: "That security's repo rate rises sharply in this scenario" } },
  ],
  correctId: "rate-drops-possibly-negative",
  hint: { fr: "C'est le TITRE qui est demandé ici, pas le cash : qui doit payer pour obtenir quoi ?", en: "It is the SECURITY that is in demand here, not the cash: who must pay to get what?" },
  explanation: {
    fr: "Quand la demande pour EMPRUNTER un titre précis (pas le cash) dépasse largement l'offre disponible, le \"prix\" de ce titre spécifique en repo s'ajuste à la baisse : le taux repo spécial chute, pouvant même devenir négatif — le détenteur du titre (prêteur de collatéral, emprunteur de cash) est alors payé pour prêter son titre plutôt que l'inverse.",
    en: "When demand to BORROW a specific security (not the cash) far exceeds available supply, that specific security's repo \"price\" adjusts downward: the special repo rate falls, potentially even turning negative — the security's holder (collateral lender, cash borrower) then gets paid to lend their security rather than the other way around.",
  },
  commonMistake: {
    fr: "Raisonner comme si le taux repo ne dépendait que de l'offre et de la demande de cash, en oubliant que la demande pour un collatéral précis peut aussi le faire bouger, dans le sens opposé.",
    en: "Reasoning as if the repo rate only depended on cash supply and demand, forgetting that demand for a specific collateral can also move it, in the opposite direction.",
  },
});

const whatIfHaircutIncreaseTemplate = mcqTemplate({
  id: "m03-repo-what-if-hausse-decote",
  conceptId: "m03-repo-collateral",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "En période de forte volatilité de marché, les prêteurs de cash augmentent la décote (haircut) exigée sur un même collatéral, de 2% à 8%. Pour un même titre apporté en garantie, quel est l'effet sur le cash que l'emprunteur peut obtenir ?",
    en: "During a period of high market volatility, cash lenders raise the required haircut on the same collateral, from 2% to 8%. For the same security posted as collateral, what is the effect on the cash the borrower can raise?",
  },
  choices: [
    { id: "less-cash", label: { fr: "L'emprunteur obtient moins de cash pour le même titre, car la décote réduit la part de la valeur du collatéral prêtée en cash", en: "The borrower raises less cash for the same security, since the haircut reduces the share of the collateral's value lent as cash" } },
    { id: "more-cash", label: { fr: "L'emprunteur obtient davantage de cash pour le même titre", en: "The borrower raises more cash for the same security" } },
    { id: "no-change", label: { fr: "Le montant de cash obtenu ne dépend pas de la décote appliquée", en: "The cash amount raised does not depend on the applied haircut" } },
  ],
  correctId: "less-cash",
  hint: { fr: "Cash prêté = Valeur du collatéral × (1 − décote).", en: "Cash lent = Collateral value × (1 − haircut)." },
  explanation: {
    fr: "Une hausse de la décote réduit directement la part de la valeur du collatéral que le prêteur accepte de prêter en cash (Cash = Valeur × (1 − décote)) : en période de stress, les prêteurs relèvent les décotes pour se protéger d'une chute plus probable du prix du collatéral, ce qui réduit d'autant la capacité de financement des détenteurs de titres — un canal d'assèchement de la liquidité en temps de crise.",
    en: "A higher haircut directly reduces the share of the collateral's value the lender agrees to lend as cash (Cash = Value × (1 − haircut)): in stressed periods, lenders raise haircuts to protect against a more likely drop in the collateral's price, which correspondingly reduces securities holders' funding capacity — a channel through which liquidity dries up during a crisis.",
  },
  commonMistake: {
    fr: "Croire que la décote n'a qu'un rôle théorique, sans conséquence directe sur le montant de cash réellement disponible pour l'emprunteur.",
    en: "Believing the haircut is only a theoretical concept, with no direct consequence on the cash amount actually available to the borrower.",
  },
});

const repurchasePriceNumericTemplate: QuestionTemplate = {
  id: "m03-repo-calcul-prix-rachat",
  conceptId: "m03-repo-collateral",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const price = randomInt(rng, 50, 200) * 1_000_000;
    const rateBp = randomInt(rng, 200, 450);
    const days = randomInt(rng, 1, 7);
    const rate = rateBp / 10000;
    const repurchasePrice = Math.round(price * (1 + rate * (days / 360)));

    return {
      isScenario: true,
      prompt: {
        fr: `Un repo porte sur un prix initial de ${fmt(price, "fr", 0)}, un taux repo de ${fmt(rateBp / 100, "fr", 2)}% et une durée de ${days} jour(s). Quel est le prix de rachat, en arrondissant à l'unité ?`,
        en: `A repo has an initial price of ${fmt(price, "en", 0)}, a repo rate of ${fmt(rateBp / 100, "en", 2)}%, and a ${days}-day term. What is the repurchase price, rounded to the nearest unit?`,
      },
      numericUnit: { fr: "même devise que le prix", en: "same currency as the price" },
      numericTolerance: "± 500",
      hint: { fr: "P_rachat = P × (1 + r_repo × jours/360).", en: "P_repurchase = P × (1 + r_repo × days/360)." },
      numeric: { value: repurchasePrice, tolerance: 500 },
      calculation: {
        fr: `P_rachat = ${fmt(price, "fr", 0)} × (1 + ${fmt(rateBp / 100, "fr", 2)}% × ${days}/360) ≈ ${fmt(repurchasePrice, "fr", 0)}.`,
        en: `P_repurchase = ${fmt(price, "en", 0)} × (1 + ${fmt(rateBp / 100, "en", 2)}% × ${days}/360) ≈ ${fmt(repurchasePrice, "en", 0)}.`,
      },
      explanation: {
        fr: "Le prix de rachat d'un repo s'obtient en appliquant un intérêt simple, au taux repo, sur la durée exacte du repo exprimée en fraction d'année (convention actif/360 sur les marchés monétaires) — l'écart entre les deux prix EST l'intérêt du prêt, pas un profit ou une perte sur le titre lui-même.",
        en: "A repo's repurchase price is obtained by applying simple interest, at the repo rate, over the repo's exact term expressed as a fraction of a year (actual/360 convention in money markets) — the gap between the two prices IS the loan's interest, not a profit or loss on the security itself.",
      },
      commonMistake: {
        fr: "Utiliser une base de 365 jours au lieu de 360, la convention standard des marchés monétaires pour ce type de calcul.",
        en: "Using a 365-day basis instead of 360, the standard money market convention for this type of calculation.",
      },
    };
  },
};

const haircutNumericTemplate: QuestionTemplate = {
  id: "m03-repo-calcul-decote",
  conceptId: "m03-repo-collateral",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const collateralValue = randomInt(rng, 80, 150) * 1_000_000;
    const haircutPct = randomFloat(rng, 1, 6, 1);
    const cashLent = Math.round(collateralValue * (1 - haircutPct / 100));
    const impliedHaircut = Math.round(((collateralValue - cashLent) / collateralValue) * 1000) / 10;

    return {
      isScenario: true,
      prompt: {
        fr: `Un collatéral vaut ${fmt(collateralValue, "fr", 0)} sur le marché. Le prêteur de cash accepte de prêter ${fmt(cashLent, "fr", 0)} contre ce collatéral. Quelle décote (haircut) cela représente-t-il, en % ?`,
        en: `A collateral is worth ${fmt(collateralValue, "en", 0)} in the market. The cash lender agrees to lend ${fmt(cashLent, "en", 0)} against this collateral. What haircut does this represent, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.2",
      hint: { fr: "h = (Valeur du collatéral − Cash prêté) / Valeur du collatéral.", en: "h = (Collateral value − Cash lent) / Collateral value." },
      numeric: { value: impliedHaircut, tolerance: 0.2 },
      calculation: {
        fr: `h = (${fmt(collateralValue, "fr", 0)} − ${fmt(cashLent, "fr", 0)}) / ${fmt(collateralValue, "fr", 0)} ≈ ${fmt(impliedHaircut, "fr")}%.`,
        en: `h = (${fmt(collateralValue, "en", 0)} − ${fmt(cashLent, "en", 0)}) / ${fmt(collateralValue, "en", 0)} ≈ ${fmt(impliedHaircut, "en")}%.`,
      },
      explanation: {
        fr: "La décote se lit comme la part de la valeur du collatéral que le prêteur \"retient\" par sécurité, en ne prêtant pas la totalité de sa valeur de marché en cash : c'est la marge de protection directement disponible si le prix du collatéral baisse pendant la durée du repo.",
        en: "The haircut reads as the share of the collateral's value the lender \"withholds\" for safety, by not lending its entire market value as cash: it is the protection margin directly available if the collateral's price falls during the repo's life.",
      },
      commonMistake: {
        fr: "Diviser l'écart par le montant de cash prêté au lieu de la valeur du collatéral, ce qui donne un résultat légèrement différent de la convention standard.",
        en: "Dividing the gap by the cash lent instead of the collateral's value, which gives a slightly different result from the standard convention.",
      },
    };
  },
};

const repoRateVsCouponMistakeTemplate = trueFalseTemplate({
  id: "m03-repo-erreur-taux-vs-coupon",
  conceptId: "m03-repo-collateral",
  difficulty: "medium",
  statement: {
    fr: "Le taux repo appliqué à une mise en pension dépend directement du taux de coupon de l'obligation utilisée comme collatéral.",
    en: "The repo rate applied to a repurchase agreement directly depends on the coupon rate of the bond used as collateral.",
  },
  correct: false,
  hint: { fr: "Le taux repo est le prix du financement à court terme, pas une caractéristique intrinsèque du titre prêté.", en: "The repo rate is the price of short-term funding, not an intrinsic feature of the lent security." },
  explanation: {
    fr: "Faux : le taux repo reflète les conditions du marché du financement à court terme (offre et demande de cash, et éventuellement rareté de ce collatéral précis pour un repo spécial), pas le coupon de l'obligation mise en pension — un titre à coupon élevé et un titre à coupon faible peuvent parfaitement se financer au même taux repo GC.",
    en: "False: the repo rate reflects short-term funding market conditions (cash supply and demand, and possibly scarcity of that specific collateral for a special repo), not the coupon of the bond being repoed — a high-coupon bond and a low-coupon bond can perfectly well fund at the same GC repo rate.",
  },
  commonMistake: {
    fr: "Chercher un lien mécanique entre le coupon d'une obligation et le taux repo auquel elle peut être financée, alors que ce sont deux marchés distincts.",
    en: "Looking for a mechanical link between a bond's coupon and the repo rate at which it can be funded, when these are two distinct markets.",
  },
});

const fundingDeskScenarioTemplate = mcqTemplate({
  id: "m03-repo-scenario-desk-financement",
  conceptId: "m03-repo-collateral",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le desk de financement d'une banque détient un large portefeuille d'obligations d'État et doit lever du cash au jour le jour pour financer les positions du desk de trading. Quelle solution est la plus cohérente avec cet objectif ?",
    en: "A bank's funding desk holds a large government bond portfolio and needs to raise overnight cash to fund the trading desk's positions. Which solution is most consistent with this objective?",
  },
  choices: [
    { id: "repo-out-bonds", label: { fr: "Mettre en pension (repo) une partie du portefeuille obligataire pour obtenir du cash au taux repo, généralement avantageux", en: "Repo out part of the bond portfolio to obtain cash at the generally favorable repo rate" } },
    { id: "sell-bonds-outright", label: { fr: "Vendre définitivement les obligations sur le marché secondaire", en: "Permanently sell the bonds on the secondary market" } },
    { id: "unsecured-loan", label: { fr: "Emprunter le même montant sans aucune garantie, au taux interbancaire non garanti", en: "Borrow the same amount with no guarantee at all, at the unsecured interbank rate" } },
  ],
  correctId: "repo-out-bonds",
  hint: { fr: "Le desk veut du cash TEMPORAIRE sans se séparer définitivement de ses obligations, et au meilleur taux possible.", en: "The desk wants TEMPORARY cash without permanently parting with its bonds, at the best possible rate." },
  explanation: {
    fr: "Le repo est l'outil précisément conçu pour ce besoin : obtenir du cash temporairement, à un taux avantageux grâce à la garantie apportée par les obligations détenues, sans avoir à les vendre définitivement (ce qui bouclerait la position du desk de trading) ni à emprunter au taux non garanti, plus coûteux.",
    en: "A repo is the tool precisely designed for this need: obtaining cash temporarily, at a favorable rate thanks to the collateral provided by the held bonds, without having to permanently sell them (which would close out the trading desk's position) or borrow at the costlier unsecured rate.",
  },
  commonMistake: {
    fr: "Vendre définitivement des titres pour un besoin de cash purement temporaire, ce qui revient à liquider une position au lieu de simplement la financer.",
    en: "Permanently selling securities for a purely temporary cash need, which amounts to liquidating a position instead of simply funding it.",
  },
});

const sofrConstructionScenarioTemplate = mcqTemplate({
  id: "m03-repo-scenario-construction-sofr",
  conceptId: "m03-repo-collateral",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le SOFR (Secured Overnight Financing Rate), taux de référence qui a progressivement remplacé le LIBOR USD, est calculé à partir de quelles transactions ?",
    en: "SOFR (Secured Overnight Financing Rate), the reference rate that progressively replaced USD LIBOR, is computed from which transactions?",
  },
  choices: [
    { id: "actual-repo-transactions", label: { fr: "Des transactions repo au jour le jour réellement observées sur le marché du collatéral d'État américain", en: "Actual overnight repo transactions observed in the US government collateral market" } },
    { id: "bank-declarations", label: { fr: "Des déclarations volontaires de banques sur le taux auquel elles pensent pouvoir emprunter", en: "Voluntary bank declarations on the rate at which they believe they could borrow" } },
    { id: "stock-market-data", label: { fr: "Des données du marché actions, sans lien avec le financement à court terme", en: "Equity market data, unrelated to short-term funding" } },
  ],
  correctId: "actual-repo-transactions",
  hint: { fr: "Le \"S\" de SOFR signifie \"Secured\" (garanti) : quel marché est garanti par du collatéral d'État ?", en: "The \"S\" in SOFR stands for \"Secured\": which market is secured by government collateral?" },
  explanation: {
    fr: "Le SOFR est calculé à partir de transactions repo réellement exécutées sur le marché du collatéral d'État américain (contrairement au LIBOR, basé sur des déclarations de banques, entaché de scandales de manipulation) : cette base sur des transactions réelles et un marché large et liquide en fait un taux de référence jugé plus robuste et plus difficile à manipuler.",
    en: "SOFR is computed from repo transactions actually executed in the US government collateral market (unlike LIBOR, based on bank declarations, tainted by manipulation scandals): this basis in real transactions and a broad, liquid market makes it a reference rate seen as more robust and harder to manipulate.",
  },
  commonMistake: {
    fr: "Croire que les nouveaux taux de référence comme le SOFR reposent, comme le LIBOR, sur des déclarations bancaires plutôt que sur des transactions de marché observées.",
    en: "Believing new reference rates like SOFR rely, like LIBOR, on bank declarations rather than on observed market transactions.",
  },
});

const repoStressEventScenarioTemplate = mcqTemplate({
  id: "m03-repo-scenario-crise-liquidite",
  conceptId: "m03-repo-collateral",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Le taux repo au jour le jour bondit brutalement bien au-dessus du taux directeur de la banque centrale, signe d'une pénurie soudaine de cash disponible sur ce marché pourtant jugé très sûr. Quelle action est la plus cohérente pour une banque centrale cherchant à stabiliser ce marché critique ?",
    en: "The overnight repo rate suddenly jumps well above the central bank's policy rate, signaling a sudden shortage of available cash in this otherwise very safe market. What action is most consistent for a central bank seeking to stabilize this critical market?",
  },
  choices: [
    { id: "inject-liquidity-via-repo", label: { fr: "Injecter de la liquidité en menant elle-même des opérations de repo, prêtant du cash contre collatéral au marché", en: "Inject liquidity by conducting its own repo operations, lending cash against collateral to the market" } },
    { id: "do-nothing", label: { fr: "Ne rien faire, le marché du repo n'ayant aucune importance systémique", en: "Do nothing, since the repo market has no systemic importance" } },
    { id: "raise-policy-rate", label: { fr: "Relever immédiatement son taux directeur pour calmer la tension", en: "Immediately raise its policy rate to calm the stress" } },
  ],
  correctId: "inject-liquidity-via-repo",
  hint: { fr: "Une pénurie de cash se résout en... apportant du cash, via l'outil même dont le marché a besoin.", en: "A cash shortage is resolved by... providing cash, via the very tool the market needs." },
  explanation: {
    fr: "Face à une tension inhabituelle sur le marché du repo (taux au jour le jour s'envolant bien au-dessus du taux directeur), la réponse naturelle d'une banque centrale est d'injecter elle-même de la liquidité via des opérations de repo, prêtant du cash contre collatéral pour ramener le taux vers sa cible — exactement la réponse apportée par la Fed lors de l'épisode de tension du marché repo américain de septembre 2019, qui l'a conduite à relancer des opérations de repo permanentes.",
    en: "Facing unusual stress in the repo market (overnight rate spiking well above the policy rate), a central bank's natural response is to inject liquidity itself via repo operations, lending cash against collateral to bring the rate back toward its target — exactly the response the Fed gave during the September 2019 US repo market stress episode, which led it to relaunch standing repo operations.",
  },
  commonMistake: {
    fr: "Sous-estimer l'importance systémique du marché du repo, alors qu'une tension prolongée sur ce marché peut se propager à l'ensemble du système financier.",
    en: "Underestimating the repo market's systemic importance, when prolonged stress in this market can spread across the entire financial system.",
  },
});

export const templates: QuestionTemplate[] = [
  vocabTemplate,
  comprehensionTemplate,
  securedVsUnsecuredComparisonTemplate,
  gcVsSpecialComparisonTemplate,
  whatIfCollateralScarcityTemplate,
  whatIfHaircutIncreaseTemplate,
  repurchasePriceNumericTemplate,
  haircutNumericTemplate,
  repoRateVsCouponMistakeTemplate,
  fundingDeskScenarioTemplate,
  sofrConstructionScenarioTemplate,
  repoStressEventScenarioTemplate,
];
