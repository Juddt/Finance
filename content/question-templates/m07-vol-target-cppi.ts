import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 0): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const cppiExposureNumericTemplate: QuestionTemplate = {
  id: "m07-cppi-exposition-calcul",
  conceptId: "m07-vol-target-cppi",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const V = randomInt(rng, 90, 150);
    const P = V - randomInt(rng, 5, 30);
    const m = randomInt(rng, 3, 6);
    const exposure = m * (V - P);

    return {
      isScenario: true,
      prompt: {
        fr: `Un CPPI a une valeur de portefeuille V=${V}, un plancher actualisé P=${P}, et un multiplicateur m=${m}. Quelle est l'exposition à l'actif risqué ?`,
        en: `A CPPI has portfolio value V=${V}, discounted floor P=${P}, and multiplier m=${m}. What is the risky asset exposure?`,
      },
      numericUnit: { fr: "même devise que V", en: "same currency as V" },
      numericTolerance: "± 1",
      hint: { fr: "Exposition = m × (V − P).", en: "Exposure = m × (V − P)." },
      numeric: { value: exposure, tolerance: 1 },
      calculation: { fr: `Coussin = ${V}−${P} = ${V - P}. Exposition = ${m}×${V - P} = ${fmt(exposure, "fr")}.`, en: `Cushion = ${V}−${P} = ${V - P}. Exposure = ${m}×${V - P} = ${fmt(exposure, "en")}.` },
      explanation: {
        fr: "L'exposition ne peut jamais dépasser la valeur totale du portefeuille en pratique — si m×coussin > V, l'exposition est plafonnée à V (règle non modélisée ici pour simplifier).",
        en: "In practice, exposure can never exceed the portfolio's total value — if m×cushion > V, exposure is capped at V (a rule not modeled here for simplicity).",
      },
      commonMistake: {
        fr: "Multiplier m par V au lieu de multiplier m par le coussin (V−P).",
        en: "Multiplying m by V instead of multiplying m by the cushion (V−P).",
      },
    };
  },
};

const volTargetDirectionTemplate: QuestionTemplate = {
  id: "m07-voltarget-direction",
  conceptId: "m07-vol-target-cppi",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const volRising = pick(rng, [true, false] as const);
    return {
      prompt: {
        fr: `Dans une stratégie Vol Target, la volatilité réalisée observée ${volRising ? "augmente fortement" : "diminue fortement"}. Que devient l'allocation à l'actif risqué ?`,
        en: `In a Vol Target strategy, observed realized volatility ${volRising ? "rises sharply" : "falls sharply"}. What happens to the risky asset allocation?`,
      },
      choices: buildChoices([
        { id: "down", label: { fr: "Elle diminue", en: "It decreases" } },
        { id: "up", label: { fr: "Elle augmente", en: "It increases" } },
      ]),
      hint: { fr: "Allocation = min(1, σ_cible/σ_réalisée).", en: "Allocation = min(1, σ_target/σ_realized)." },
      correctChoiceIds: [volRising ? "down" : "up"],
      explanation: volRising
        ? { fr: "Une volatilité réalisée plus élevée au dénominateur réduit le ratio σ_cible/σ_réalisée, donc l'allocation diminue — le mécanisme désinvestit en période agitée.", en: "A higher realized volatility in the denominator lowers the σ_target/σ_realized ratio, so the allocation decreases — the mechanism de-risks in turbulent periods." }
        : { fr: "Une volatilité réalisée plus basse augmente le ratio σ_cible/σ_réalisée, donc l'allocation augmente (jusqu'au plafond de 100%) — le mécanisme réinvestit en période calme.", en: "A lower realized volatility raises the σ_target/σ_realized ratio, so the allocation increases (up to the 100% cap) — the mechanism re-invests in calm periods." },
      commonMistake: {
        fr: "Inverser la relation entre volatilité observée et allocation à l'actif risqué.",
        en: "Reversing the relationship between observed volatility and risky asset allocation.",
      },
    };
  },
};

const cppiGuaranteeTemplate: QuestionTemplate = {
  id: "m07-cppi-garantie",
  conceptId: "m07-vol-target-cppi",
  kind: "true_false",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un CPPI garantit absolument que la valeur du portefeuille ne descendra jamais sous le plancher, en toutes circonstances de marché.",
      en: "A CPPI absolutely guarantees the portfolio's value will never fall below the floor, under all market circumstances.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["false"],
    explanation: {
      fr: "Faux : un gap de marché suffisamment brutal entre deux rééquilibrages (un krach) peut faire passer le portefeuille sous le plancher, malgré le mécanisme de désinvestissement automatique — ce n'est pas une garantie absolue.",
      en: "False: a sufficiently sharp market gap between two rebalances (a crash) can push the portfolio below the floor, despite the automatic de-risking mechanism — not an absolute guarantee.",
    },
    commonMistake: {
      fr: "Croire que le mécanisme CPPI élimine tout risque de gap, quelle que soit l'ampleur du choc de marché.",
      en: "Believing the CPPI mechanism eliminates all gap risk, whatever the market shock's magnitude.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m07-cppi-vocab",
  conceptId: "m07-vol-target-cppi",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Dans un CPPI, la différence entre la valeur du portefeuille et le plancher actualisé s'appelle le ______.",
      en: "In a CPPI, the gap between the portfolio's value and the discounted floor is called the ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["coussin", "cushion"],
    hint: { fr: "La marge de sécurité disponible, comme un « coussin » amortisseur.", en: "The available safety margin, like a cushioning \"pillow\"." },
    explanation: {
      fr: "Le coussin (cushion) est la marge de sécurité disponible au-dessus du plancher, qui détermine directement l'exposition à l'actif risqué via le multiplicateur.",
      en: "The cushion is the available safety margin above the floor, which directly determines risky asset exposure via the multiplier.",
    },
    commonMistake: {
      fr: "Confondre le coussin avec la valeur totale du portefeuille, alors que c'est seulement l'excédent au-dessus du plancher.",
      en: "Confusing the cushion with the portfolio's total value, when it is only the excess above the floor.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m07-cppi-comprehension-utilite",
  conceptId: "m07-vol-target-cppi",
  difficulty: "medium",
  prompt: {
    fr: "Pourquoi des stratégies comme le CPPI ou le Vol Target ajustent-elles DYNAMIQUEMENT l'exposition au risque plutôt que de fixer une allocation fixe une fois pour toutes (par exemple 60% actions / 40% obligations) ?",
    en: "Why do strategies like CPPI or Vol Target DYNAMICALLY adjust risk exposure rather than fixing an allocation once and for all (e.g. 60% equities / 40% bonds)?",
  },
  choices: [
    { id: "adapt-to-conditions", label: { fr: "Pour adapter automatiquement le niveau de risque pris aux conditions de marché réelles (proximité d'un plancher, volatilité observée), plutôt que de subir passivement un risque potentiellement inadapté", en: "To automatically adapt the risk level taken to actual market conditions (proximity to a floor, observed volatility), rather than passively bearing a potentially unsuited risk" } },
    { id: "guarantee-return", label: { fr: "Pour garantir un rendement positif fixe, quelles que soient les conditions de marché", en: "To guarantee a fixed positive return, whatever market conditions are" } },
    { id: "no-real-benefit", label: { fr: "Il n'y a aucun avantage réel, une allocation fixe donnerait toujours un résultat équivalent", en: "There's no real benefit, a fixed allocation would always give an equivalent result" } },
  ],
  correctId: "adapt-to-conditions",
  hint: { fr: "Une allocation fixe prend le même risque en période calme et en période agitée — est-ce toujours souhaitable ?", en: "A fixed allocation takes the same risk in calm and turbulent periods — is that always desirable?" },
  explanation: {
    fr: "Une allocation fixe expose à un niveau de risque identique quelles que soient les conditions de marché, ce qui peut être dangereusement inadapté (trop de risque en période agitée, trop peu en période calme). Le CPPI ajuste l'exposition selon la distance au plancher de protection ; le Vol Target l'ajuste selon la volatilité réellement observée : les deux mécanismes automatisent une gestion du risque réactive, sans intervention humaine constante.",
    en: "A fixed allocation exposes to an identical risk level regardless of market conditions, which can be dangerously unsuited (too much risk in turbulent periods, too little in calm ones). CPPI adjusts exposure based on distance to the protection floor; Vol Target adjusts it based on actually observed volatility: both mechanisms automate reactive risk management, with no constant human intervention.",
  },
  commonMistake: {
    fr: "Croire qu'une allocation fixe et une stratégie dynamique donnent le même profil de risque au fil du temps, en ignorant l'intérêt spécifique de l'ajustement automatique aux conditions de marché.",
    en: "Believing a fixed allocation and a dynamic strategy give the same risk profile over time, ignoring the specific value of automatically adjusting to market conditions.",
  },
});

const cppiVsVolTargetComparisonTemplate = mcqTemplate({
  id: "m07-cppi-comparaison-cppi-voltarget",
  conceptId: "m07-vol-target-cppi",
  difficulty: "hard",
  prompt: {
    fr: "Comparez le déclencheur qui fait varier l'exposition au risque dans un CPPI et dans une stratégie Vol Target. Sur quoi chaque mécanisme se base-t-il principalement ?",
    en: "Compare the trigger that varies risk exposure in a CPPI and in a Vol Target strategy. What does each mechanism primarily rely on?",
  },
  choices: [
    { id: "cushion-vs-vol", label: { fr: "Le CPPI se base sur la distance entre la valeur du portefeuille et un plancher de protection (le coussin) ; le Vol Target se base sur le niveau de volatilité réalisée récente, indépendamment de tout plancher", en: "CPPI is based on the gap between the portfolio's value and a protection floor (the cushion); Vol Target is based on the level of recent realized volatility, independent of any floor" } },
    { id: "same-trigger", label: { fr: "Les deux mécanismes se basent exactement sur le même déclencheur", en: "Both mechanisms are based on exactly the same trigger" } },
    { id: "reversed", label: { fr: "Le CPPI se base sur la volatilité, le Vol Target sur un plancher de protection", en: "CPPI is based on volatility, Vol Target on a protection floor" } },
  ],
  correctId: "cushion-vs-vol",
  hint: { fr: "L'un des deux mécanismes est explicitement construit autour d'un plancher de protection du capital ; l'autre ne mentionne jamais de plancher.", en: "One of the two mechanisms is explicitly built around a capital protection floor; the other never mentions a floor." },
  explanation: {
    fr: "Le CPPI (M07) ajuste l'exposition en fonction du coussin (V−P), la marge de sécurité au-dessus d'un plancher de protection explicite : son objectif premier est de protéger un montant minimal garanti. Le Vol Target ajuste l'exposition en fonction de la volatilité réalisée récente, indépendamment de tout plancher : son objectif est de maintenir un niveau de risque CONSTANT (mesuré en volatilité), sans notion de protection du capital intégrée au mécanisme lui-même.",
    en: "CPPI (M07) adjusts exposure based on the cushion (V−P), the safety margin above an explicit protection floor: its primary goal is to protect a guaranteed minimum amount. Vol Target adjusts exposure based on recent realized volatility, independent of any floor: its goal is to maintain a CONSTANT risk level (measured in volatility), with no capital-protection notion built into the mechanism itself.",
  },
  commonMistake: {
    fr: "Confondre les deux mécanismes ou croire qu'ils poursuivent le même objectif, alors que l'un vise la protection du capital (CPPI) et l'autre la stabilité du niveau de risque (Vol Target).",
    en: "Confusing the two mechanisms or believing they pursue the same goal, when one targets capital protection (CPPI) and the other risk-level stability (Vol Target).",
  },
});

const whatIfCushionZeroTemplate = mcqTemplate({
  id: "m07-cppi-whatif-coussin-nul",
  conceptId: "m07-vol-target-cppi",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un krach fait chuter la valeur d'un portefeuille CPPI jusqu'à exactement égaler son plancher actualisé (coussin = 0). Que devient l'exposition à l'actif risqué à ce moment, et que se passe-t-il si le marché se redresse ensuite ?",
    en: "A crash drives a CPPI portfolio's value down to exactly equal its discounted floor (cushion = 0). What happens to the risky asset exposure at that point, and what happens if the market later rebounds?",
  },
  choices: [
    { id: "cash-lock", label: { fr: "L'exposition tombe à zéro (\"cash lock\") : le portefeuille reste investi à 100% en actif sans risque, et ne profitera plus d'un éventuel redressement ultérieur du marché", en: "Exposure falls to zero (\"cash lock\"): the portfolio stays 100% invested in the risk-free asset, and will no longer benefit from any later market rebound" } },
    { id: "automatic-recovery", label: { fr: "L'exposition remonte automatiquement dès que le marché se redresse, sans aucune conséquence durable", en: "Exposure automatically rises again as soon as the market rebounds, with no lasting consequence" } },
    { id: "forced-liquidation", label: { fr: "Le portefeuille doit être immédiatement liquidé et clôturé", en: "The portfolio must be immediately liquidated and closed" } },
  ],
  correctId: "cash-lock",
  hint: { fr: "Exposition = m × coussin : que devient l'exposition si le coussin est exactement nul ? Et d'où viendrait un nouveau coussin si tout est en actif sans risque ?", en: "Exposure = m × cushion: what happens to exposure if the cushion is exactly zero? And where would a new cushion come from if everything is in the risk-free asset?" },
  explanation: {
    fr: "Quand le coussin atteint zéro, l'exposition à l'actif risqué (m × coussin) tombe elle aussi à zéro : le portefeuille est alors intégralement investi en actif sans risque, un phénomène appelé « cash lock ». Comme il n'y a plus rien investi dans l'actif risqué, un redressement ultérieur du marché ne profite plus du tout au portefeuille, qui reste bloqué en cash jusqu'à l'échéance — une conséquence durable et irréversible du mécanisme, pas une simple pause temporaire.",
    en: "When the cushion reaches zero, risky asset exposure (m × cushion) also falls to zero: the portfolio is then entirely invested in the risk-free asset, a phenomenon called \"cash lock\". Since nothing is left invested in the risky asset, a later market rebound no longer benefits the portfolio at all, which stays locked in cash until maturity — a lasting, irreversible consequence of the mechanism, not a simple temporary pause.",
  },
  commonMistake: {
    fr: "Croire que le mécanisme CPPI se \"réactive\" automatiquement dès que le marché remonte, en oubliant qu'un coussin nul signifie qu'il n'y a plus aucun capital risqué disponible pour profiter de ce redressement.",
    en: "Believing the CPPI mechanism \"reactivates\" automatically as soon as the market rises again, forgetting a zero cushion means no risky capital at all remains available to benefit from that rebound.",
  },
});

const whatIfLowTargetVolTemplate = mcqTemplate({
  id: "m07-cppi-whatif-cible-vol-basse",
  conceptId: "m07-vol-target-cppi",
  difficulty: "medium",
  prompt: {
    fr: "Un fonds Vol Target fixe une volatilité cible très basse (5% par an), destinée à des investisseurs très prudents. Même en période de marché très calme (volatilité réalisée à 8%), l'allocation à l'actif risqué reste-t-elle proche de 100% ?",
    en: "A Vol Target fund sets a very low target volatility (5% per year), meant for very cautious investors. Even in a very calm market period (realized volatility at 8%), does the risky asset allocation stay close to 100%?",
  },
  choices: [
    { id: "stays-low", label: { fr: "Non : l'allocation = min(1, 5%/8%) ≈ 62%, restant bien en dessous de 100% même en période calme, car la cible elle-même est très basse", en: "No: allocation = min(1, 5%/8%) ≈ 62%, staying well below 100% even in a calm period, since the target itself is very low" } },
    { id: "near-hundred", label: { fr: "Oui, une période calme fait toujours tendre l'allocation vers 100%, quelle que soit la cible", en: "Yes, a calm period always pushes allocation toward 100%, whatever the target" } },
    { id: "zero", label: { fr: "L'allocation tombe à zéro, car la volatilité réalisée dépasse la cible", en: "Allocation falls to zero, since realized volatility exceeds the target" } },
  ],
  correctId: "stays-low",
  hint: { fr: "Allocation = min(1, σ_cible/σ_réalisée) : appliquez directement la formule avec ces deux chiffres.", en: "Allocation = min(1, σ_target/σ_realized): directly apply the formula with these two numbers." },
  explanation: {
    fr: "Même dans un marché jugé \"calme\" en absolu (8% de volatilité réalisée), une cible de volatilité très basse (5%) reste inférieure à cette volatilité réalisée : le ratio σ_cible/σ_réalisée = 5%/8% ≈ 0,625 limite l'allocation à environ 62%, pas 100%. Le niveau de la cible elle-même, choisi selon le profil de risque de l'investisseur, détermine donc directement à quel point l'allocation peut réellement approcher 100%, même en période favorable.",
    en: "Even in a market judged \"calm\" in absolute terms (8% realized volatility), a very low volatility target (5%) remains below that realized volatility: the ratio σ_target/σ_realized = 5%/8% ≈ 0.625 caps allocation at about 62%, not 100%. The target level itself, chosen based on the investor's risk profile, therefore directly determines how close allocation can actually get to 100%, even in a favorable period.",
  },
  commonMistake: {
    fr: "Croire qu'une période de marché \"calme\" pousse toujours l'allocation vers 100%, sans tenir compte du niveau spécifique de la cible de volatilité choisie par le fonds.",
    en: "Believing a \"calm\" market period always pushes allocation toward 100%, without accounting for the specific target volatility level chosen by the fund.",
  },
});

const twoInvestorProfilesScenarioTemplate = mcqTemplate({
  id: "m07-cppi-scenario-deux-profils-investisseurs",
  conceptId: "m07-vol-target-cppi",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une société de gestion propose deux fonds Vol Target : le Fonds Prudent (cible 6%) et le Fonds Dynamique (cible 15%). Dans un même contexte de marché, quel fonds aura généralement l'allocation à l'actif risqué la plus élevée ?",
    en: "An asset manager offers two Vol Target funds: the Cautious Fund (6% target) and the Dynamic Fund (15% target). In the same market context, which fund will generally have the higher risky asset allocation?",
  },
  choices: [
    { id: "dynamic-higher", label: { fr: "Le Fonds Dynamique : une cible de volatilité plus élevée autorise structurellement une allocation plus importante, pour un même niveau de volatilité réalisée", en: "The Dynamic Fund: a higher volatility target structurally allows a larger allocation, for the same realized volatility level" } },
    { id: "cautious-higher", label: { fr: "Le Fonds Prudent, dont la cible plus basse implique une allocation plus élevée", en: "The Cautious Fund, whose lower target implies a higher allocation" } },
    { id: "always-same", label: { fr: "Les deux fonds ont toujours exactement la même allocation, la cible n'ayant aucun effet", en: "Both funds always have exactly the same allocation, the target having no effect" } },
  ],
  correctId: "dynamic-higher",
  hint: { fr: "Allocation = min(1, σ_cible/σ_réalisée) : à volatilité réalisée identique, quel effet a une cible plus élevée au numérateur ?", en: "Allocation = min(1, σ_target/σ_realized): with identical realized volatility, what effect does a higher target have in the numerator?" },
  explanation: {
    fr: "À volatilité réalisée identique, une cible plus élevée (15% contre 6%) donne un ratio σ_cible/σ_réalisée plus grand, donc une allocation à l'actif risqué plus élevée : c'est exactement ce qui permet à une société de gestion de proposer plusieurs fonds Vol Target adaptés à différents profils de risque investisseur, en modulant simplement le seul paramètre de cible de volatilité, sans changer le reste du mécanisme.",
    en: "With identical realized volatility, a higher target (15% vs 6%) gives a larger σ_target/σ_realized ratio, hence a higher risky asset allocation: this is exactly what lets an asset manager offer several Vol Target funds suited to different investor risk profiles, simply by adjusting the single volatility target parameter, with no change to the rest of the mechanism.",
  },
  commonMistake: {
    fr: "Croire que la cible de volatilité n'est qu'un paramètre cosmétique, sans réaliser qu'elle détermine directement et proportionnellement le niveau d'allocation à l'actif risqué.",
    en: "Believing the volatility target is just a cosmetic parameter, without realizing it directly and proportionally determines the risky asset allocation level.",
  },
});

const volTargetAllocationNumericTemplate: QuestionTemplate = {
  id: "m07-cppi-allocation-voltarget-calcul",
  conceptId: "m07-vol-target-cppi",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const targetPct = randomInt(rng, 5, 15);
    const realizedPct = randomInt(rng, 5, 30);
    const allocation = Math.round(Math.min(1, targetPct / realizedPct) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un fonds Vol Target a une volatilité cible de ${targetPct}% et observe une volatilité réalisée récente de ${realizedPct}%. Quelle est l'allocation à l'actif risqué (en %, plafonnée à 100%) ?`,
        en: `A Vol Target fund has a target volatility of ${targetPct}% and observes recent realized volatility of ${realizedPct}%. What is the allocation to the risky asset (in %, capped at 100%)?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 1",
      hint: { fr: "Allocation = min(1, σ_cible/σ_réalisée), exprimée en %.", en: "Allocation = min(1, σ_target/σ_realized), expressed as %." },
      numeric: { value: allocation, tolerance: 1 },
      calculation: {
        fr: `Allocation = min(100%, ${targetPct}%/${realizedPct}%) = min(100%, ${((targetPct / realizedPct) * 100).toFixed(1)}%) = ${fmt(allocation, "fr")}%.`,
        en: `Allocation = min(100%, ${targetPct}%/${realizedPct}%) = min(100%, ${((targetPct / realizedPct) * 100).toFixed(1)}%) = ${fmt(allocation, "en")}%.`,
      },
      explanation: {
        fr: "Ce calcul illustre directement le mécanisme central du Vol Target : l'allocation augmente quand la volatilité réalisée baisse (se rapprochant de 100%), et diminue quand elle grimpe, tout en restant toujours plafonnée à 100% (pas d'effet de levier dans la version simple du mécanisme).",
        en: "This calculation directly illustrates Vol Target's central mechanism: allocation rises as realized volatility falls (approaching 100%), and falls as it climbs, while always staying capped at 100% (no leverage in the simple version of the mechanism).",
      },
      commonMistake: {
        fr: "Oublier le plafonnement à 100% quand la volatilité cible dépasse la volatilité réalisée, ou inverser le ratio (réalisée/cible au lieu de cible/réalisée).",
        en: "Forgetting the 100% cap when the target volatility exceeds realized volatility, or inverting the ratio (realized/target instead of target/realized).",
      },
    };
  },
};

const highMultiplierErrorTemplate = trueFalseTemplate({
  id: "m07-cppi-erreur-multiplicateur-eleve",
  conceptId: "m07-vol-target-cppi",
  difficulty: "medium",
  statement: {
    fr: "Choisir un multiplicateur m très élevé dans un CPPI est toujours préférable, puisque cela augmente l'exposition (et donc le potentiel de gain) sans inconvénient particulier.",
    en: "Choosing a very high multiplier m in a CPPI is always preferable, since it increases exposure (and so upside potential) with no particular downside.",
  },
  correct: false,
  explanation: {
    fr: "Faux : un multiplicateur élevé amplifie aussi le risque qu'un gap de marché (un mouvement brutal entre deux rééquilibrages) fasse chuter le portefeuille sous le plancher, voire l'annule complètement — c'est le risque de gap propre au CPPI (déjà signalé). Un m plus élevé accélère la croissance en marché favorable, mais rend aussi le \"cash lock\" plus probable en cas de choc, un compromis à calibrer, pas un simple avantage sans contrepartie.",
    en: "False: a higher multiplier also amplifies the risk that a market gap (a sharp move between two rebalances) pushes the portfolio below the floor, or even wipes it out — CPPI's inherent gap risk (already flagged). A higher m accelerates growth in a favorable market, but also makes a \"cash lock\" more likely in a shock, a trade-off to calibrate, not a plain cost-free advantage.",
  },
  commonMistake: {
    fr: "Voir le multiplicateur uniquement comme un levier de performance, en oubliant qu'il amplifie proportionnellement le risque de gap et de cash lock.",
    en: "Seeing the multiplier only as a performance lever, forgetting it proportionally amplifies gap and cash-lock risk.",
  },
});

const capitalGuaranteeProductScenarioTemplate = mcqTemplate({
  id: "m07-cppi-scenario-produit-garanti",
  conceptId: "m07-vol-target-cppi",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Une banque conçoit un produit structuré garantissant 90% du capital initial à l'échéance, tout en cherchant à participer à la hausse d'un indice actions. Quel mécanisme, entre CPPI et Vol Target, est structurellement le mieux adapté à cet objectif de plancher explicite ?",
    en: "A bank designs a structured product guaranteeing 90% of the initial capital at maturity, while seeking to participate in an equity index's rise. Which mechanism, between CPPI and Vol Target, is structurally best suited to this explicit floor objective?",
  },
  choices: [
    { id: "cppi", label: { fr: "Le CPPI, construit spécifiquement autour d'un plancher de protection explicite (ici, 90% du capital)", en: "CPPI, specifically built around an explicit protection floor (here, 90% of capital)" } },
    { id: "vol-target", label: { fr: "Le Vol Target, dont le mécanisme garantit également un plancher de capital", en: "Vol Target, whose mechanism also guarantees a capital floor" } },
    { id: "either-works", label: { fr: "Les deux mécanismes offrent une garantie de capital rigoureusement équivalente", en: "Both mechanisms offer a rigorously equivalent capital guarantee" } },
  ],
  correctId: "cppi",
  hint: { fr: "Un seul des deux mécanismes intègre explicitement la notion de plancher de protection du capital dans sa construction même.", en: "Only one of the two mechanisms explicitly builds the notion of a capital protection floor into its very construction." },
  explanation: {
    fr: "Le CPPI est précisément conçu autour d'un plancher explicite (ici 90% du capital initial actualisé) : l'exposition à l'actif risqué est directement pilotée par la distance à ce plancher (le coussin), rendant ce mécanisme structurellement adapté à un objectif de protection de capital. Le Vol Target, lui, ne vise qu'à stabiliser le niveau de risque (volatilité) sans notion de plancher intégrée : il ne garantit rien sur le niveau minimal de capital préservé, et serait donc mal adapté seul à cet objectif précis.",
    en: "CPPI is precisely designed around an explicit floor (here 90% of the discounted initial capital): risky asset exposure is directly driven by the distance to that floor (the cushion), making this mechanism structurally suited to a capital-protection objective. Vol Target, however, only aims to stabilize the risk level (volatility) with no floor notion built in: it guarantees nothing about the minimum capital preserved, and would therefore be poorly suited alone to this specific objective.",
  },
  commonMistake: {
    fr: "Croire que toute stratégie qui ajuste dynamiquement l'exposition offre automatiquement une garantie de capital, en confondant la gestion du niveau de risque (Vol Target) avec la protection explicite d'un plancher (CPPI).",
    en: "Believing any strategy that dynamically adjusts exposure automatically offers a capital guarantee, confusing risk-level management (Vol Target) with an explicit floor protection (CPPI).",
  },
});

export const templates: QuestionTemplate[] = [
  cppiExposureNumericTemplate,
  volTargetDirectionTemplate,
  cppiGuaranteeTemplate,
  vocabTemplate,
  comprehensionTemplate,
  cppiVsVolTargetComparisonTemplate,
  whatIfCushionZeroTemplate,
  whatIfLowTargetVolTemplate,
  twoInvestorProfilesScenarioTemplate,
  volTargetAllocationNumericTemplate,
  highMultiplierErrorTemplate,
  capitalGuaranteeProductScenarioTemplate,
];
