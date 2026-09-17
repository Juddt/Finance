import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

const COMMODITIES = ["blé", "pétrole brut", "cuivre", "gaz naturel"] as const;
const COMMODITIES_EN = ["wheat", "crude oil", "copper", "natural gas"] as const;

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const netCarryNumericTemplate: QuestionTemplate = {
  id: "m02-matieres-f0-calcul",
  conceptId: "m02-matieres-premieres",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const idx = randomInt(rng, 0, COMMODITIES.length - 1);
    const S0 = randomInt(rng, 30, 400);
    const rPct = randomInt(rng, 1, 5);
    const uPct = randomInt(rng, 1, 6);
    const yPct = randomInt(rng, 0, 5);
    const netRate = (rPct + uPct - yPct) / 100;
    const F0 = Math.round(S0 * (1 + netRate) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Pour du ${COMMODITIES[idx]}, S0 = ${S0}, r = ${rPct}%, coût de stockage u = ${uPct}%, rendement de convenance y = ${yPct}%, T = 1 an. Quel est le prix forward F0 ?`,
        en: `For ${COMMODITIES_EN[idx]}, S0 = ${S0}, r = ${rPct}%, storage cost u = ${uPct}%, convenience yield y = ${yPct}%, T = 1 year. What is the forward price F0?`,
      },
      numericUnit: { fr: "même unité que S0", en: "same unit as S0" },
      numericTolerance: "± 0.5",
      hint: {
        fr: "F0 = S0 × (1 + r + u − y)^T.",
        en: "F0 = S0 × (1 + r + u − y)^T.",
      },
      numeric: { value: F0, tolerance: 0.5 },
      calculation: {
        fr: `Taux net = ${rPct}% + ${uPct}% − ${yPct}% = ${(netRate * 100).toFixed(2)}%. F0 = ${S0} × (1 + ${netRate.toFixed(4)}) = ${fmt(F0, "fr")}.`,
        en: `Net rate = ${rPct}% + ${uPct}% − ${yPct}% = ${(netRate * 100).toFixed(2)}%. F0 = ${S0} × (1 + ${netRate.toFixed(4)}) = ${fmt(F0, "en")}.`,
      },
      explanation: {
        fr: "Le stockage se comporte comme un coût de financement supplémentaire ; le rendement de convenance se comporte comme un revenu implicite qui réduit ce coût net.",
        en: "Storage behaves like an extra financing cost; the convenience yield behaves like an implicit income that reduces this net cost.",
      },
      commonMistake: {
        fr: "Oublier de soustraire y, ou inverser son signe (le rendement de convenance diminue F0, il ne l'augmente pas).",
        en: "Forgetting to subtract y, or flipping its sign (the convenience yield lowers F0, it does not raise it).",
      },
    };
  },
};

const highConvenienceTemplate: QuestionTemplate = {
  id: "m02-matieres-convenance-actif",
  conceptId: "m02-matieres-premieres",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "shortage", fr: "les stocks mondiaux de cette matière première viennent de chuter fortement", en: "global inventories of this commodity have just fallen sharply" },
        { id: "surplus", fr: "les stocks mondiaux de cette matière première sont exceptionnellement abondants", en: "global inventories of this commodity are exceptionally abundant" },
      ] as const
    );

    const correctId = scenario.id === "shortage" ? "up" : "down";

    return {
      prompt: {
        fr: `Si ${scenario.fr}, que devient probablement le rendement de convenance y ?`,
        en: `If ${scenario.en}, what likely happens to the convenience yield y?`,
      },
      choices: buildChoices([
        { id: "up", label: { fr: "Il augmente", en: "It rises" } },
        { id: "down", label: { fr: "Il diminue", en: "It falls" } },
      ]),
      hint: {
        fr: "Le rendement de convenance reflète la valeur d'avoir le stock physique sous la main en cas de pénurie.",
        en: "The convenience yield reflects the value of having physical stock on hand in case of shortage.",
      },
      correctChoiceIds: [correctId],
      explanation:
        scenario.id === "shortage"
          ? { fr: "Des stocks bas rendent la détention physique plus précieuse (risque de rupture plus élevé) : le rendement de convenance augmente.", en: "Low inventories make physical holding more valuable (higher shortage risk): the convenience yield rises." }
          : { fr: "Des stocks abondants rendent la détention physique moins urgente : le rendement de convenance diminue.", en: "Abundant inventories make physical holding less urgent: the convenience yield falls." },
      commonMistake: {
        fr: "Confondre le rendement de convenance avec le coût de stockage, qui répond à d'autres facteurs (taille de l'entrepôt, assurance...).",
        en: "Confusing the convenience yield with the storage cost, which responds to different factors (warehouse size, insurance...).",
      },
    };
  },
};

const goldTrueFalseTemplate: QuestionTemplate = {
  id: "m02-matieres-or-vrai-faux",
  conceptId: "m02-matieres-premieres",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "L'or, principalement détenu comme actif d'investissement plutôt que consommé industriellement, a en général un rendement de convenance proche de zéro.",
      en: "Gold, mostly held as an investment asset rather than industrially consumed, generally has a convenience yield close to zero.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : contrairement au blé ou au pétrole, l'or n'est presque jamais en risque de \"rupture d'approvisionnement\" pour un usage industriel critique, donc le bénéfice de le détenir physiquement plutôt qu'à terme est faible.",
      en: "True: unlike wheat or oil, gold is almost never at risk of a critical industrial supply shortage, so the benefit of holding it physically rather than forward is small.",
    },
    commonMistake: {
      fr: "Appliquer le même raisonnement de rendement de convenance élevé à tous les actifs physiques sans distinction.",
      en: "Applying the same high-convenience-yield reasoning to all physical assets without distinction.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m02-matieres-vocab",
  conceptId: "m02-matieres-premieres",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'avantage immatériel de détenir un stock physique tout de suite plutôt qu'un contrat à terme, par exemple pour ne jamais être en rupture de production, s'appelle le rendement de ______.",
      en: "The intangible benefit of holding physical stock right now rather than a forward contract, for example to never run short for production, is called the ______ yield.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["convenance", "convenience"],
    hint: {
      fr: "Le terme français utilisé dans le cours.",
      en: "The English finance term.",
    },
    explanation: {
      fr: "Le rendement de convenance (convenience yield) réduit le coût de portage net d'une matière première.",
      en: "The convenience yield reduces a commodity's net cost of carry.",
    },
    commonMistake: {
      fr: "Confondre ce terme avec le coût de stockage, qui a l'effet opposé sur le prix forward.",
      en: "Confusing this term with the storage cost, which has the opposite effect on the forward price.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m02-matieres-comprehension-utilite",
  conceptId: "m02-matieres-premieres",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi le prix forward d'une matière première physique (F0 = S0 × (1 + r + u − y)^T) a-t-il besoin de deux termes supplémentaires (u et y) par rapport à la formule simple d'un actif financier sans revenu (F0 = S0 × (1+r)^T) ?",
    en: "Why does a physical commodity's forward price (F0 = S0 × (1 + r + u − y)^T) need two extra terms (u and y) compared to the simple formula for an income-free financial asset (F0 = S0 × (1+r)^T)?",
  },
  choices: [
    { id: "physical-costs-benefits", label: { fr: "Parce que détenir un actif physique implique des coûts réels (stockage) et un bénéfice immatériel (disponibilité immédiate) qu'un actif financier n'a pas", en: "Because holding a physical asset involves real costs (storage) and an intangible benefit (immediate availability) a financial asset doesn't have" } },
    { id: "regulatory", label: { fr: "Parce que la réglementation impose des termes supplémentaires uniquement pour les matières premières", en: "Because regulation mandates extra terms only for commodities" } },
    { id: "no-reason", label: { fr: "Il n'y a pas de vraie raison, c'est une convention arbitraire", en: "There's no real reason, it's an arbitrary convention" } },
  ],
  correctId: "physical-costs-benefits",
  hint: { fr: "Pensez à ce que possède physiquement le détenteur d'un baril de pétrole, que ne possède pas le détenteur d'une action.", en: "Think about what the physical holder of a barrel of oil has, that a stockholder does not." },
  explanation: {
    fr: "Détenir une matière première physique coûte réellement de l'argent (u, le stockage, l'assurance, le transport) mais procure aussi un avantage immatériel (y, le rendement de convenance : ne jamais être en rupture pour la production). Un actif financier sans revenu n'a ni l'un ni l'autre, d'où la formule simplifiée F0 = S0 × (1+r)^T qui lui suffit.",
    en: "Holding a physical commodity genuinely costs money (u, storage, insurance, transport) but also provides an intangible benefit (y, the convenience yield: never running short for production). An income-free financial asset has neither, hence the simplified F0 = S0 × (1+r)^T formula that suffices for it.",
  },
  commonMistake: {
    fr: "Traiter toutes les classes d'actifs avec la même formule de non-arbitrage simple, en oubliant les spécificités physiques des matières premières.",
    en: "Treating all asset classes with the same simple no-arbitrage formula, forgetting commodities' physical specifics.",
  },
});

const goldVsOilComparisonTemplate = mcqTemplate({
  id: "m02-matieres-comparaison-or-petrole-penurie",
  conceptId: "m02-matieres-premieres",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "L'or (détenu comme investissement, stocks abondants) et le pétrole en pleine pénurie de raffinage (stocks physiques très bas) sont comparés. Lequel des deux a, structurellement à ce moment, le rendement de convenance le plus élevé ?",
    en: "Gold (held as an investment, abundant inventories) and oil during a refining shortage (very low physical inventories) are compared. Which of the two structurally has the higher convenience yield at that moment?",
  },
  choices: [
    { id: "oil", label: { fr: "Le pétrole : ses stocks bas rendent la détention physique immédiate précieuse", en: "Oil: its low inventories make immediate physical holding valuable" } },
    { id: "gold", label: { fr: "L'or : son statut d'actif d'investissement lui donne toujours le rendement de convenance le plus élevé", en: "Gold: its investment-asset status always gives it the highest convenience yield" } },
    { id: "equal", label: { fr: "Les deux ont un rendement de convenance comparable, indépendamment du niveau des stocks", en: "Both have a comparable convenience yield, regardless of inventory levels" } },
  ],
  correctId: "oil",
  hint: { fr: "Le rendement de convenance reflète la valeur de disposer du stock physique immédiatement en cas de pénurie — pas le statut \"prestigieux\" de l'actif.", en: "The convenience yield reflects the value of having physical stock immediately available during a shortage — not the asset's \"prestigious\" status." } ,
  explanation: {
    fr: "Le pétrole en pénurie de raffinage a des stocks physiques tendus : détenir le baril tout de suite, plutôt que d'attendre un contrat à terme, devient très précieux pour un raffineur qui ne peut pas se permettre une rupture de production — le rendement de convenance grimpe. L'or, détenu majoritairement à des fins d'investissement avec des stocks abondants, n'a quasiment jamais ce besoin urgent de disponibilité physique, donc son rendement de convenance reste proche de zéro même en période de tension sur d'autres marchés.",
    en: "Oil in a refining shortage has tight physical inventories: holding the barrel right now, rather than waiting for a forward contract, becomes very valuable for a refiner who cannot afford a production shortfall — the convenience yield rises. Gold, mostly held for investment with abundant inventories, almost never has this urgent need for physical availability, so its convenience yield stays near zero even during stress in other markets.",
  },
  commonMistake: {
    fr: "Croire que le rendement de convenance dépend du \"prestige\" ou de la valeur de l'actif plutôt que de la tension réelle entre l'offre physique disponible et le besoin industriel immédiat.",
    en: "Believing the convenience yield depends on the asset's \"prestige\" or value rather than the real tension between available physical supply and immediate industrial need.",
  },
});

const whatIfStorageCostSpikeTemplate = mcqTemplate({
  id: "m02-matieres-whatif-hausse-cout-stockage",
  conceptId: "m02-matieres-premieres",
  difficulty: "medium",
  prompt: {
    fr: "Toutes choses égales par ailleurs (même r, même y), si le coût de stockage u augmente fortement (ex. pénurie de capacité de stockage disponible), que devient le prix forward F0 d'une matière première ?",
    en: "All else equal (same r, same y), if the storage cost u rises sharply (e.g. a shortage of available storage capacity), what happens to a commodity's forward price F0?",
  },
  choices: [
    { id: "up", label: { fr: "F0 augmente", en: "F0 rises" } },
    { id: "down", label: { fr: "F0 diminue", en: "F0 falls" } },
    { id: "same", label: { fr: "F0 ne change pas, seul le rendement de convenance compte", en: "F0 stays the same, only the convenience yield matters" } },
  ],
  correctId: "up",
  hint: { fr: "F0 = S0 × (1 + r + u − y)^T : u apparaît avec un signe positif, comme r.", en: "F0 = S0 × (1 + r + u − y)^T: u carries a positive sign, just like r." },
  explanation: {
    fr: "u agit exactement comme un coût de financement supplémentaire dans la formule : plus il est élevé, plus il est coûteux de porter physiquement la matière première jusqu'à l'échéance, et plus le prix forward qui compense ce coût est élevé.",
    en: "u acts exactly like an extra financing cost in the formula: the higher it is, the more expensive it is to physically carry the commodity to maturity, and the higher the forward price that compensates for that cost.",
  },
  commonMistake: {
    fr: "Confondre l'effet du coût de stockage (qui augmente F0) avec celui du rendement de convenance (qui le diminue) — les deux jouent en sens opposé.",
    en: "Confusing the storage cost's effect (which raises F0) with the convenience yield's (which lowers it) — the two act in opposite directions.",
  },
});

const whatIfNewStorageTechTemplate = mcqTemplate({
  id: "m02-matieres-whatif-nouvelle-techno-stockage",
  conceptId: "m02-matieres-premieres",
  difficulty: "medium",
  prompt: {
    fr: "Une nouvelle technologie de stockage rend l'entreposage d'une matière première nettement moins coûteux qu'avant (u diminue fortement). Toutes choses égales par ailleurs, quel est l'effet sur F0 ?",
    en: "A new storage technology makes warehousing a commodity significantly cheaper than before (u falls sharply). All else equal, what is the effect on F0?",
  },
  choices: [
    { id: "down", label: { fr: "F0 diminue, se rapprochant d'avantage de S0 × (1+r)^T", en: "F0 falls, moving closer to S0 × (1+r)^T" } },
    { id: "up", label: { fr: "F0 augmente", en: "F0 rises" } },
    { id: "unaffected", label: { fr: "F0 n'est jamais affecté par le coût de stockage", en: "F0 is never affected by storage cost" } },
  ],
  correctId: "down",
  hint: { fr: "Un coût de portage plus faible réduit la prime que le prix forward doit compenser.", en: "A lower carry cost reduces the premium the forward price must compensate for." },
  explanation: {
    fr: "Une baisse de u réduit directement le coût net de portage, donc le prix forward par non-arbitrage baisse en conséquence, se rapprochant du cas d'un actif purement financier — une illustration concrète de l'effet mécanique du terme u dans la formule.",
    en: "A drop in u directly reduces the net carry cost, so the no-arbitrage forward price falls accordingly, moving closer to the case of a purely financial asset — a concrete illustration of the term u's mechanical effect in the formula.",
  },
  commonMistake: {
    fr: "Croire qu'un progrès technique de stockage n'a d'impact que sur les coûts opérationnels de l'entreprise, sans effet sur le prix forward coté sur le marché.",
    en: "Believing a storage technology improvement only affects a company's operating costs, with no effect on the market-quoted forward price.",
  },
});

const impliedConvenienceYieldNumericTemplate: QuestionTemplate = {
  id: "m02-matieres-rendement-convenance-implicite-calcul",
  conceptId: "m02-matieres-premieres",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const idx = randomInt(rng, 0, COMMODITIES.length - 1);
    const S0 = randomInt(rng, 30, 300);
    const rPct = randomInt(rng, 1, 5);
    const uPct = randomInt(rng, 1, 6);
    const yPct = randomInt(rng, 0, 5);
    const netRate = (rPct + uPct - yPct) / 100;
    const F0 = Math.round(S0 * (1 + netRate) * 100) / 100;
    const impliedYPct = Math.round((rPct + uPct - (F0 / S0 - 1) * 100) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Pour du ${COMMODITIES[idx]}, S0 = ${S0}, F0 coté = ${F0.toFixed(2)}, r = ${rPct}%, coût de stockage u = ${uPct}%, T = 1 an. Quel rendement de convenance y est implicite dans ce prix forward ?`,
        en: `For ${COMMODITIES_EN[idx]}, S0 = ${S0}, quoted F0 = ${F0.toFixed(2)}, r = ${rPct}%, storage cost u = ${uPct}%, T = 1 year. What convenience yield y is implied by this forward price?`,
      },
      numericUnit: { fr: "% par an", en: "% per year" },
      numericTolerance: "± 0.15",
      hint: { fr: "Inversez F0 = S0 × (1 + r + u − y) : y = r + u − (F0/S0 − 1).", en: "Invert F0 = S0 × (1 + r + u − y): y = r + u − (F0/S0 − 1)." },
      numeric: { value: impliedYPct, tolerance: 0.15 },
      calculation: {
        fr: `(F0/S0 − 1) = ${((F0 / S0 - 1) * 100).toFixed(2)}%. y = ${rPct}% + ${uPct}% − ${((F0 / S0 - 1) * 100).toFixed(2)}% ≈ ${impliedYPct.toFixed(2)}%.`,
        en: `(F0/S0 − 1) = ${((F0 / S0 - 1) * 100).toFixed(2)}%. y = ${rPct}% + ${uPct}% − ${((F0 / S0 - 1) * 100).toFixed(2)}% ≈ ${impliedYPct.toFixed(2)}%.`,
      },
      explanation: {
        fr: "Extraire le rendement de convenance implicite d'un prix forward coté permet de mesurer, sans l'observer directement, à quel point le marché juge la disponibilité physique immédiate précieuse à cet instant — un indicateur avancé de tension sur les stocks.",
        en: "Extracting the convenience yield implied by a quoted forward price lets you measure, without observing it directly, how valuable the market judges immediate physical availability to be at that moment — a leading indicator of inventory tightness.",
      },
      commonMistake: {
        fr: "Oublier d'inverser le signe de y lors de l'isolement dans la formule, ce qui inverse la conclusion (une convenance forte semblerait faible, et inversement).",
        en: "Forgetting to flip y's sign when isolating it in the formula, which reverses the conclusion (a high convenience yield would look low, and vice versa).",
      },
    };
  },
};

const notACashFlowErrorTemplate = trueFalseTemplate({
  id: "m02-matieres-erreur-convenance-pas-cash",
  conceptId: "m02-matieres-premieres",
  difficulty: "medium",
  statement: {
    fr: "Le rendement de convenance est un flux de trésorerie réel que le détenteur physique de la matière première reçoit périodiquement, comme un dividende d'action.",
    en: "The convenience yield is a real cash flow that the commodity's physical holder periodically receives, like a stock dividend.",
  },
  correct: false,
  explanation: {
    fr: "Faux : contrairement à un dividende, le rendement de convenance n'est PAS un flux de trésorerie effectivement versé. C'est un avantage implicite, subjectif et non observable directement (la tranquillité de ne jamais être à court de matière première pour la production), que l'on ne peut estimer qu'indirectement, en inversant la formule de non-arbitrage à partir des prix observés.",
    en: "False: unlike a dividend, the convenience yield is NOT an actually paid cash flow. It is an implicit, subjective, not directly observable benefit (the peace of mind of never running short of the commodity for production), which can only be estimated indirectly, by inverting the no-arbitrage formula from observed prices.",
  },
  commonMistake: {
    fr: "Traiter le rendement de convenance comme un revenu monétaire concret et directement observable, au lieu d'un avantage implicite déduit des prix de marché.",
    en: "Treating the convenience yield as a concrete, directly observable monetary income, instead of an implicit benefit inferred from market prices.",
  },
});

const storeOrRollScenarioTemplate = mcqTemplate({
  id: "m02-matieres-scenario-stocker-ou-rouler",
  conceptId: "m02-matieres-premieres",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un négociant en blé hésite : stocker physiquement son blé jusqu'à la prochaine récolte, ou vendre maintenant et racheter un contrat à terme plus tard (« rouler »). Dans quel contexte le stockage physique devient-il relativement plus attractif ?",
    en: "A wheat trader is torn between physically storing their wheat until the next harvest, or selling now and buying a later forward contract (\"rolling\"). In what context does physical storage become relatively more attractive?",
  },
  choices: [
    { id: "high-y", label: { fr: "Quand le rendement de convenance est élevé (marché tendu, risque de pénurie perçu comme important)", en: "When the convenience yield is high (a tight market, a perceived meaningful shortage risk)" } },
    { id: "high-u", label: { fr: "Quand le coût de stockage u est très élevé, indépendamment du reste", en: "When the storage cost u is very high, regardless of everything else" } },
    { id: "never", label: { fr: "Le stockage physique n'est jamais économiquement justifié face à un contrat à terme", en: "Physical storage is never economically justified versus a forward contract" } },
  ],
  correctId: "high-y",
  hint: { fr: "Le rendement de convenance mesure précisément l'avantage de détenir le stock physique tout de suite plutôt qu'un contrat papier.", en: "The convenience yield precisely measures the benefit of holding the physical stock right now rather than a paper contract." },
  explanation: {
    fr: "Un rendement de convenance élevé signifie que le marché valorise fortement la disponibilité physique immédiate (crainte de pénurie, besoin de continuité de production) : dans ce contexte, stocker physiquement plutôt que de dépendre d'un contrat à terme (qui ne livre qu'à l'échéance) devient relativement plus attractif, malgré le coût de stockage à payer.",
    en: "A high convenience yield means the market strongly values immediate physical availability (shortage fears, a need for production continuity): in that context, physically storing rather than relying on a forward contract (which only delivers at maturity) becomes relatively more attractive, despite the storage cost to pay.",
  },
  commonMistake: {
    fr: "Ne raisonner que sur le coût de stockage seul, en oubliant que c'est l'arbitrage entre ce coût ET le rendement de convenance qui détermine la décision optimale.",
    en: "Reasoning only on the storage cost alone, forgetting it's the trade-off between that cost AND the convenience yield that determines the optimal decision.",
  },
});

const termStructureTensionScenarioTemplate = mcqTemplate({
  id: "m02-matieres-scenario-structure-terme-tension",
  conceptId: "m02-matieres-premieres",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un analyste observe que le forward 1 mois sur le cuivre est nettement moins cher que le forward 12 mois (contango marqué à court terme, presque plat à long terme). Comment interprète-t-il typiquement cette structure en termes de rendement de convenance ?",
    en: "An analyst observes that the 1-month copper forward is markedly cheaper than the 12-month forward (a marked short-term contango, nearly flat long-term). How would they typically interpret this structure in terms of convenience yield?",
  },
  choices: [
    { id: "low-near-high-far", label: { fr: "Un rendement de convenance faible à court terme (stocks disponibles suffisants pour l'instant), sans tension de disponibilité anticipée à long terme", en: "A low near-term convenience yield (currently sufficient available inventories), with no anticipated availability tension long-term" } },
    { id: "shortage-now", label: { fr: "Une pénurie physique sévère et immédiate, ce qui impliquerait plutôt une backwardation à court terme", en: "A severe, immediate physical shortage, which would instead imply short-term backwardation" } },
    { id: "no-link", label: { fr: "Cette structure ne renseigne en rien sur le rendement de convenance", en: "This structure tells us nothing about the convenience yield" } },
  ],
  correctId: "low-near-high-far",
  hint: { fr: "Un contango marqué signale au contraire l'ABSENCE de tension immédiate sur les stocks, pas une pénurie.", en: "A marked contango signals the ABSENCE of immediate inventory tension, not a shortage." },
  explanation: {
    fr: "Un contango prononcé à court terme (F0 nettement au-dessus de S0) est cohérent avec un rendement de convenance faible : le marché ne valorise pas fortement la détention physique immédiate, signe que les stocks sont jugés suffisants pour couvrir la demande proche. Une pénurie sévère produirait l'effet inverse (backwardation, rendement de convenance élevé), pas un contango marqué.",
    en: "A pronounced short-term contango (F0 well above S0) is consistent with a low convenience yield: the market does not heavily value immediate physical holding, a sign inventories are judged sufficient to cover near-term demand. A severe shortage would produce the opposite effect (backwardation, a high convenience yield), not a marked contango.",
  },
  commonMistake: {
    fr: "Associer systématiquement un prix forward élevé à une pénurie, en oubliant que c'est au contraire la backwardation (F0 en dessous de S0) qui signale une tension de disponibilité immédiate.",
    en: "Systematically associating a high forward price with a shortage, forgetting it is instead backwardation (F0 below S0) that signals immediate availability tension.",
  },
});

export const templates: QuestionTemplate[] = [
  netCarryNumericTemplate,
  highConvenienceTemplate,
  goldTrueFalseTemplate,
  vocabTemplate,
  comprehensionTemplate,
  goldVsOilComparisonTemplate,
  whatIfStorageCostSpikeTemplate,
  whatIfNewStorageTechTemplate,
  impliedConvenienceYieldNumericTemplate,
  notACashFlowErrorTemplate,
  storeOrRollScenarioTemplate,
  termStructureTensionScenarioTemplate,
];
