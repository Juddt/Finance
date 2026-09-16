import type { LessonContent } from "@/lib/lesson-types";

export const m13TypologieRisques: LessonContent = {
  conceptId: "m13-typologie-risques",
  glossary: [
    { term: { fr: "Risque de contrepartie", en: "Counterparty risk" }, definition: { fr: "Le risque que l'autre partie à un contrat (souvent un dérivé de gré à gré) ne remplisse pas ses obligations, distinct du risque de crédit sur un titre de dette classique.", en: "The risk that the other party to a contract (often an OTC derivative) fails to fulfill its obligations, distinct from credit risk on a classic debt security." } },
  ],
  intuition: {
    fr: "\"Le risque\" en finance n'est pas une notion unique : une même position peut être exposée simultanément à plusieurs familles de risque très différentes dans leur nature, leurs causes et la façon de s'en couvrir — les confondre conduit à une gestion des risques incomplète, où une couverture contre un type de risque laisse l'exposition à un autre totalement ignorée.",
    en: "\"Risk\" in finance isn't a single notion: the same position can be simultaneously exposed to several risk families very different in nature, causes, and how to hedge against them — confusing them leads to incomplete risk management, where a hedge against one risk type leaves exposure to another completely ignored.",
  },
  definition: {
    fr: "Le risque de marché est l'exposition aux mouvements des prix, taux ou volatilités (déjà largement couvert via les Greeks, M07). Le risque de crédit est le risque qu'un émetteur de dette fasse défaut (M03-2). Le risque de contrepartie est spécifique aux contrats bilatéraux (dérivés de gré à gré) : le risque que la contrepartie du contrat, pas l'émetteur d'un titre, ne remplisse pas ses obligations. Le risque de liquidité est le risque de ne pas pouvoir acheter ou vendre un actif rapidement sans impact significatif sur son prix (déjà rencontré pour les produits structurés, M11-1). Le risque opérationnel couvre les pertes dues à des défaillances internes (erreurs humaines, systèmes informatiques, fraude) plutôt qu'à des mouvements de marché.",
    en: "Market risk is exposure to price, rate or volatility movements (already largely covered via the Greeks, M07). Credit risk is the risk a debt issuer defaults (M03-2). Counterparty risk is specific to bilateral contracts (OTC derivatives): the risk the contract's counterparty, not a security's issuer, fails to fulfill its obligations. Liquidity risk is the risk of being unable to quickly buy or sell an asset without significantly impacting its price (already encountered for structured products, M11-1). Operational risk covers losses due to internal failures (human error, IT systems, fraud) rather than market movements.",
  },
  utility: {
    fr: "Cette typologie structure toute l'organisation de la gestion des risques d'une institution financière (départements distincts, mesures et réglementations spécifiques à chaque type) et rappelle qu'une position peut sembler \"couverte\" sur un plan (par exemple, delta-neutre sur le risque de marché) tout en restant pleinement exposée à un autre risque totalement différent (crédit de la contrepartie du swap utilisé pour la couverture, par exemple).",
    en: "This typology structures a financial institution's entire risk management organization (separate departments, measures and regulations specific to each type) and reminds us a position can seem \"hedged\" on one front (e.g., delta-neutral on market risk) while remaining fully exposed to a completely different risk (the credit of the swap counterparty used for the hedge, for example).",
  },
  example: {
    fr: "Une banque qui achète une protection contre le risque de défaut d'une entreprise via un CDS (M03-6) réduit son risque de crédit sur cette entreprise, mais reste exposée au risque de contrepartie : si le vendeur du CDS lui-même fait faillite au moment où la protection devrait se déclencher, la couverture ne fonctionne pas — exactement le scénario qui a amplifié la crise de 2008 avec l'effondrement de certains vendeurs de protection majeurs.",
    en: "A bank buying protection against a company's default risk via a CDS (M03-6) reduces its credit risk on that company, but remains exposed to counterparty risk: if the CDS seller itself goes bankrupt precisely when the protection should trigger, the hedge doesn't work — exactly the scenario that amplified the 2008 crisis with the collapse of certain major protection sellers.",
  },
  alternativeExplanation: {
    fr: "Gérer les risques financiers, c'est comme sécuriser une maison contre plusieurs dangers distincts : une alarme anti-intrusion (risque de marché) ne protège pas contre un incendie (risque de crédit), qui ne protège pas contre un dégât des eaux causé par un voisin négligent (risque de contrepartie), qui ne protège pas contre le vol d'un employé de maison (risque opérationnel) — chaque risque nécessite sa propre protection spécifique.",
    en: "Managing financial risks is like securing a house against several distinct dangers: a burglar alarm (market risk) doesn't protect against a fire (credit risk), which doesn't protect against water damage caused by a careless neighbor (counterparty risk), which doesn't protect against theft by a house employee (operational risk) — each risk requires its own specific protection.",
  },
  formula: {
    latex: "\\text{Perte totale} \\approx \\text{Risque}_{\\text{marché}} + \\text{Risque}_{\\text{crédit}} + \\text{Risque}_{\\text{contrepartie}} + \\text{Risque}_{\\text{liquidité}} + \\text{Risque}_{\\text{opérationnel}}",
    variables: [
      { symbol: "\\text{Risque}_{\\text{contrepartie}}", description: { fr: "Perte potentielle liée à la défaillance d'une contrepartie sur un contrat bilatéral, distincte du crédit d'un émetteur", en: "Potential loss tied to a counterparty's default on a bilateral contract, distinct from an issuer's credit" } },
      { symbol: "\\text{Risque}_{\\text{opérationnel}}", description: { fr: "Perte due à une défaillance interne (processus, systèmes, personnes), indépendante des mouvements de marché", en: "Loss due to an internal failure (process, systems, people), independent of market movements" } },
    ],
    assumptions: { fr: "Décomposition additive simplifiée à but pédagogique ; en pratique, ces risques interagissent et ne s'additionnent pas toujours simplement (voir stress tests, M13-risques-a).", en: "Simplified additive decomposition for teaching purposes; in practice, these risks interact and don't always simply add up (see stress tests, M13-risques-a)." },
    units: { fr: "Perte dans la devise du portefeuille.", en: "Loss in the portfolio's currency." },
    example: { fr: "Une position peut être parfaitement couverte en risque de marché (delta-neutre) tout en restant totalement exposée aux quatre autres catégories de risque.", en: "A position can be perfectly hedged for market risk (delta-neutral) while remaining fully exposed to the other four risk categories." },
  },
  calculation: {
    fr: "1) Pour chaque position ou portefeuille, identifier séparément l'exposition à chacune des cinq familles de risque. 2) Vérifier qu'une couverture mise en place pour un type de risque ne crée pas ou n'ignore pas une exposition à un autre type (par exemple, une couverture via dérivé de gré à gré introduit du risque de contrepartie). 3) Appliquer les outils de mesure appropriés à chaque famille (Greeks pour le marché, VaR de crédit ou spread pour le crédit, limites d'exposition pour la contrepartie, ratios de liquidité pour la liquidité, cartographie des incidents pour l'opérationnel).",
    en: "1) For each position or portfolio, separately identify exposure to each of the five risk families. 2) Check that a hedge put in place for one risk type doesn't create or ignore exposure to another (for example, an OTC derivative hedge introduces counterparty risk). 3) Apply the appropriate measurement tools to each family (Greeks for market, credit VaR or spread for credit, exposure limits for counterparty, liquidity ratios for liquidity, incident mapping for operational).",
  },
  interpretation: {
    fr: "Une gestion des risques complète nécessite de cartographier ces cinq familles séparément pour chaque position, plutôt que de se concentrer uniquement sur le risque le plus visible ou le plus facilement mesurable (souvent le risque de marché). Les crises financières les plus graves impliquent typiquement l'interaction de plusieurs risques simultanément (un choc de marché déclenchant des défauts de crédit, qui déclenchent à leur tour des défaillances de contrepartie et un assèchement de liquidité).",
    en: "Comprehensive risk management requires separately mapping these five families for each position, rather than focusing solely on the most visible or easily measurable risk (often market risk). The most severe financial crises typically involve several risks interacting simultaneously (a market shock triggering credit defaults, which in turn trigger counterparty failures and a liquidity drought).",
  },
  pitfalls: {
    fr: "Croire qu'une position \"couverte\" (par exemple, delta-neutre) est totalement sans risque, en oubliant les risques de contrepartie, de liquidité ou opérationnel qui subsistent indépendamment de la couverture de marché. Autre piège fréquent : sous-estimer le risque opérationnel car il ne provient pas de mouvements de marché et semble donc moins \"financier\", alors qu'il a causé certaines des plus grandes pertes de l'histoire bancaire (fraude, erreurs de trading).",
    en: "Believing a \"hedged\" position (e.g., delta-neutral) is entirely risk-free, forgetting counterparty, liquidity or operational risks that persist independent of the market hedge. Another frequent trap: underestimating operational risk since it doesn't come from market movements and so seems less \"financial\", when it has caused some of banking history's largest losses (fraud, trading errors).",
  },
  keyPoints: {
    fr: [
      "Cinq grandes familles de risque : marché, crédit, contrepartie, liquidité, opérationnel — chacune distincte dans sa nature et sa gestion.",
      "Une couverture contre un type de risque peut laisser une exposition totale à un autre type, voire en créer une nouvelle.",
      "Les crises les plus graves impliquent typiquement l'interaction simultanée de plusieurs de ces risques.",
    ],
    en: [
      "Five major risk families: market, credit, counterparty, liquidity, operational — each distinct in nature and management.",
      "A hedge against one risk type can leave full exposure to another, or even create a new one.",
      "The most severe crises typically involve the simultaneous interaction of several of these risks.",
    ],
  },
  advancedDemonstration: {
    fr: "La distinction entre risque de crédit et risque de contrepartie, souvent confondue, est cruciale en pratique réglementaire : le risque de crédit sur une obligation est un montant fixe connu (le nominal), tandis que le risque de contrepartie sur un dérivé (par exemple un swap, M04-2) varie dans le temps avec la valeur de marché du contrat lui-même — un swap qui a une valeur de marché positive pour vous représente une exposition de contrepartie, mais cette exposition peut devenir nulle ou même s'inverser si le marché évolue, ce qui explique pourquoi la réglementation (CVA, M13-reg-a) exige un calcul dynamique de cette exposition plutôt qu'un montant fixe comme pour le crédit obligataire classique.",
    en: "The distinction between credit risk and counterparty risk, often confused, is crucial in regulatory practice: credit risk on a bond is a known fixed amount (the face value), while counterparty risk on a derivative (e.g. a swap, M04-2) varies over time with the contract's own market value — a swap with positive market value for you represents a counterparty exposure, but this exposure can become zero or even reverse as the market moves, which explains why regulation (CVA, M13-reg-a) requires a dynamic calculation of this exposure rather than a fixed amount like classic bond credit.",
  },
};
