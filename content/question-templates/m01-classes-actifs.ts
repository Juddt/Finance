import { pick, randomInt, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const discountPriceNumericTemplate: QuestionTemplate = {
  id: "m01-classes-escompte-calcul",
  conceptId: "m01-classes-actifs",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 20) * 100_000;
    const rPct = randomInt(rng, 1, 6);
    const days = randomInt(rng, 30, 270);
    const r = rPct / 100;
    const P = Math.round(F * (1 - r * (days / 360)) * 100) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un billet de trésorerie de valeur nominale F = ${fmt(F, "fr", 0)}, taux d'escompte r = ${rPct}%, échéance dans ${days} jours. Quel est son prix aujourd'hui ?`,
        en: `A commercial paper with face value F = ${fmt(F, "en", 0)}, discount rate r = ${rPct}%, maturing in ${days} days. What is its price today?`,
      },
      numericUnit: { fr: "même devise que F", en: "same currency as F" },
      numericTolerance: "± 20",
      hint: { fr: "P = F × (1 − r × d/360).", en: "P = F × (1 − r × d/360)." },
      numeric: { value: P, tolerance: 20 },
      calculation: {
        fr: `P = ${fmt(F, "fr", 0)} × (1 − ${rPct}%×${days}/360) ≈ ${fmt(P, "fr")}.`,
        en: `P = ${fmt(F, "en", 0)} × (1 − ${rPct}%×${days}/360) ≈ ${fmt(P, "en")}.`,
      },
      explanation: {
        fr: "Cette convention d'escompte simple est typique du marché monétaire, différente de l'actualisation composée du marché obligataire.",
        en: "This simple discounting convention is typical of the money market, different from the bond market's compound discounting.",
      },
      commonMistake: {
        fr: "Appliquer une actualisation composée (1+r)^T comme pour une obligation, au lieu de la convention d'escompte simple du marché monétaire.",
        en: "Applying compound discounting (1+r)^T as for a bond, instead of the money market's simple discounting convention.",
      },
    };
  },
};

const marketClassificationTemplate: QuestionTemplate = {
  id: "m01-classes-classification",
  conceptId: "m01-classes-actifs",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const scenario = pick(
      rng,
      [
        { id: "primary", fr: "une entreprise émet de nouvelles actions pour la première fois lors d'une introduction en bourse", en: "a company issues new shares for the first time during an IPO" },
        { id: "secondary", fr: "un investisseur revend des actions déjà en circulation à un autre investisseur", en: "an investor resells already-circulating shares to another investor" },
      ] as const
    );

    return {
      prompt: {
        fr: `Quand ${scenario.fr}, sur quel marché cette opération a-t-elle lieu ?`,
        en: `When ${scenario.en}, on which market does this transaction happen?`,
      },
      choices: buildChoices([
        { id: "primary", label: { fr: "Marché primaire", en: "Primary market" } },
        { id: "secondary", label: { fr: "Marché secondaire", en: "Secondary market" } },
      ]),
      hint: { fr: "S'agit-il d'une première émission ou d'un simple échange entre investisseurs ?", en: "Is this a first issuance or a simple exchange between investors?" },
      correctChoiceIds: [scenario.id],
      explanation:
        scenario.id === "primary"
          ? { fr: "Une émission initiale de titres, avec un flux vers l'émetteur, se déroule sur le marché primaire.", en: "An initial securities issuance, with a flow to the issuer, happens on the primary market." }
          : { fr: "Un échange entre deux investisseurs sur des titres déjà émis se déroule sur le marché secondaire, sans flux vers l'émetteur d'origine.", en: "An exchange between two investors on already-issued securities happens on the secondary market, with no flow to the original issuer." },
      commonMistake: {
        fr: "Confondre marché primaire/secondaire avec marché organisé/de gré à gré, deux axes de classification indépendants.",
        en: "Confusing primary/secondary market with organized/OTC market, two independent classification axes.",
      },
    };
  },
};

const moneyVsCapitalTemplate: QuestionTemplate = {
  id: "m01-classes-monetaire-capitaux",
  conceptId: "m01-classes-actifs",
  kind: "true_false",
  difficulty: "easy",
  generate: (rng: Rng) => {
    const months = randomInt(rng, 1, 11);
    return {
      prompt: {
        fr: `Un instrument de dette à ${months} mois relève du marché de capitaux, pas du marché monétaire.`,
        en: `A debt instrument with a ${months}-month maturity belongs to the capital market, not the money market.`,
      },
      choices: buildChoices([
        { id: "true", label: { fr: "Vrai", en: "True" } },
        { id: "false", label: { fr: "Faux", en: "False" } },
      ]),
      correctChoiceIds: ["false"],
      explanation: {
        fr: `Faux : le marché monétaire regroupe les instruments de dette à court terme, conventionnellement moins d'un an — ${months} mois en fait donc partie.`,
        en: `False: the money market covers short-term debt instruments, conventionally under one year — ${months} months therefore belongs to it.`,
      },
      commonMistake: {
        fr: "Oublier le seuil conventionnel d'un an séparant marché monétaire et marché de capitaux.",
        en: "Forgetting the conventional one-year threshold separating the money market from the capital market.",
      },
    };
  },
};

const vocabTemplate: QuestionTemplate = {
  id: "m01-classes-vocab",
  conceptId: "m01-classes-actifs",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Un marché négocié bilatéralement entre deux parties, sans standardisation obligatoire ni chambre de compensation centrale, est dit de gré à ______.",
      en: "A market negotiated bilaterally between two parties, with no mandatory standardization or central clearinghouse, is said to be over-the-______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word (counter)" },
    acceptedAnswers: ["gre", "gré", "counter"],
    hint: { fr: "L'abréviation OTC en anglais.", en: "The OTC abbreviation." },
    explanation: {
      fr: "Un marché \"de gré à gré\" (OTC) s'oppose au marché organisé, standardisé et compensé centralement.",
      en: "An \"over-the-counter\" (OTC) market is the opposite of the organized, standardized, centrally-cleared market.",
    },
    commonMistake: {
      fr: "Confondre marché de gré à gré avec marché secondaire — ce sont deux axes de classification distincts.",
      en: "Confusing over-the-counter with secondary market — these are two distinct classification axes.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m01-classes-comprehension-utilite",
  conceptId: "m01-classes-actifs",
  difficulty: "easy",
  prompt: {
    fr: "À quoi sert de situer un instrument financier sur trois axes (durée, stade de vie, lieu de négociation) plutôt que de simplement lui donner un nom ?",
    en: "What's the point of placing a financial instrument on three axes (duration, life stage, trading venue) rather than simply naming it?",
  },
  choices: [
    { id: "anticipate", label: { fr: "Anticiper ses caractéristiques (liquidité, risque de contrepartie, standardisation) même pour un instrument jamais rencontré", en: "Anticipating its characteristics (liquidity, counterparty risk, standardization) even for a never-before-seen instrument" } },
    { id: "naming", label: { fr: "Uniquement respecter une convention de vocabulaire académique sans utilité pratique", en: "Only following an academic vocabulary convention with no practical use" } },
  ],
  correctId: "anticipate",
  hint: { fr: "Une grille à trois axes permet de classer même un produit totalement nouveau.", en: "A three-axis grid lets you classify even a totally new product." },
  explanation: {
    fr: "Ce découpage en trois axes indépendants est une grille de lecture générale : elle permet de positionner n'importe quel instrument, y compris un produit inédit, sans avoir besoin d'une catégorie toute faite pour lui.",
    en: "This three independent-axis breakdown is a general reading grid: it lets you position any instrument, including an unfamiliar product, without needing a ready-made category for it.",
  },
  commonMistake: {
    fr: "Voir cette classification comme un simple exercice de vocabulaire plutôt qu'un outil d'anticipation des risques.",
    en: "Seeing this classification as a mere vocabulary exercise rather than a risk-anticipation tool.",
  },
});

const forwardVsFutureComparisonTemplate = mcqTemplate({
  id: "m01-classes-comparaison-forward-future",
  conceptId: "m01-classes-actifs",
  difficulty: "medium",
  prompt: {
    fr: "Un forward de change et un future sur indice sont tous deux des dérivés. Sur quel axe de classification se distinguent-ils le plus nettement ?",
    en: "An FX forward and an equity index future are both derivatives. On which classification axis do they differ most clearly?",
  },
  choices: [
    { id: "venue", label: { fr: "Le lieu de négociation : forward de gré à gré (OTC) contre future sur marché organisé", en: "Trading venue: OTC forward versus exchange-traded future" } },
    { id: "duration", label: { fr: "La durée : les forwards sont toujours court terme, les futures toujours long terme", en: "Duration: forwards are always short-term, futures always long-term" } },
  ],
  correctId: "venue",
  hint: { fr: "L'un se négocie bilatéralement, l'autre sur une bourse standardisée.", en: "One trades bilaterally, the other on a standardized exchange." },
  explanation: {
    fr: "Le forward est typiquement négocié de gré à gré (bilatéral, sur mesure), le future sur un marché organisé (standardisé, chambre de compensation) — l'axe \"lieu de négociation\" est ce qui les sépare le plus structurellement.",
    en: "The forward is typically traded OTC (bilateral, tailor-made), the future on an organized market (standardized, clearinghouse) — the \"trading venue\" axis is what most structurally separates them.",
  },
  commonMistake: {
    fr: "Croire que la durée détermine le choix forward/future, alors que c'est le degré de standardisation qui est la vraie différence structurelle.",
    en: "Believing duration determines the forward/future choice, when the degree of standardization is the real structural difference.",
  },
});

const whatIfPrivatePlacementTemplate = mcqTemplate({
  id: "m01-classes-whatif-placement-prive",
  conceptId: "m01-classes-actifs",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Une entreprise émet de nouvelles obligations en les vendant directement et discrètement à quelques investisseurs institutionnels, sans passer par une bourse (placement privé). S'agit-il d'un marché organisé ou de gré à gré ?",
    en: "A company issues new bonds by selling them directly and privately to a handful of institutional investors, without going through an exchange (private placement). Is this an organized or an over-the-counter market?",
  },
  choices: [
    { id: "otc", label: { fr: "De gré à gré : une émission primaire peut parfaitement se faire hors bourse, sans standardisation obligatoire", en: "Over-the-counter: a primary issuance can perfectly well happen off-exchange, with no mandatory standardization" } },
    { id: "organized", label: { fr: "Marché organisé, car toute émission de titre passe obligatoirement par une bourse", en: "Organized market, since any security issuance must go through an exchange" } },
  ],
  correctId: "otc",
  hint: { fr: "Le lieu de négociation (organisé/OTC) est indépendant du stade de vie (primaire/secondaire).", en: "The trading venue (organized/OTC) is independent of the life stage (primary/secondary)." },
  explanation: {
    fr: "Ce cas illustre précisément l'indépendance des deux axes : une émission primaire (première vente) peut très bien se dérouler de gré à gré, sans jamais passer par un marché organisé.",
    en: "This case precisely illustrates the two axes' independence: a primary issuance (first sale) can very well happen OTC, without ever going through an organized market.",
  },
  commonMistake: {
    fr: "Supposer à tort que \"marché primaire\" implique automatiquement \"marché organisé\", alors que ce sont deux axes indépendants.",
    en: "Wrongly assuming \"primary market\" automatically implies \"organized market\", when these are two independent axes.",
  },
});

const whatIfResaleOtcTemplate = trueFalseTemplate({
  id: "m01-classes-whatif-revente-otc",
  conceptId: "m01-classes-actifs",
  difficulty: "medium",
  isScenario: true,
  statement: {
    fr: "Si deux investisseurs échangent entre eux une obligation déjà émise via un accord bilatéral, hors de toute bourse, cette transaction reste néanmoins un échange de marché secondaire.",
    en: "If two investors exchange an already-issued bond between themselves via a bilateral agreement, outside any exchange, this transaction is nonetheless still a secondary market exchange.",
  },
  correct: true,
  explanation: {
    fr: "Vrai : le caractère \"secondaire\" dépend uniquement du fait que le titre a déjà été émis (pas de flux vers l'émetteur), pas du lieu où la transaction se déroule — une transaction secondaire peut parfaitement avoir lieu de gré à gré.",
    en: "True: the \"secondary\" nature depends solely on the security having already been issued (no flow to the issuer), not on where the transaction happens — a secondary transaction can perfectly well happen OTC.",
  },
  commonMistake: {
    fr: "Croire à tort qu'une transaction hors bourse ne peut être que primaire, en confondant les deux axes de classification.",
    en: "Wrongly believing an off-exchange transaction can only be primary, confusing the two classification axes.",
  },
});

const impliedYieldNumericTemplate: QuestionTemplate = {
  id: "m01-classes-taux-implicite-calcul",
  conceptId: "m01-classes-actifs",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const F = randomInt(rng, 5, 20) * 100_000;
    const days = randomInt(rng, 60, 270);
    const P = Math.round(F * randomInt(rng, 96, 99) / 100 / 100) * 100;
    const rPct = Math.round(((1 - P / F) * (360 / days)) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `Un billet de trésorerie de valeur nominale F = ${fmt(F, "fr", 0)} se négocie aujourd'hui à P = ${fmt(P, "fr", 0)}, échéance dans ${days} jours. Quel est le taux d'escompte implicite r, en % ?`,
        en: `A commercial paper with face value F = ${fmt(F, "en", 0)} trades today at P = ${fmt(P, "en", 0)}, maturing in ${days} days. What is the implied discount rate r, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.15",
      hint: { fr: "Inversez P = F×(1−r×d/360) pour isoler r.", en: "Invert P = F×(1−r×d/360) to isolate r." },
      numeric: { value: rPct, tolerance: 0.15 },
      calculation: {
        fr: `r = (1 − P/F) × 360/d = (1 − ${fmt(P, "fr", 0)}/${fmt(F, "fr", 0)}) × 360/${days} ≈ ${fmt(rPct, "fr")}%.`,
        en: `r = (1 − P/F) × 360/d = (1 − ${fmt(P, "en", 0)}/${fmt(F, "en", 0)}) × 360/${days} ≈ ${fmt(rPct, "en")}%.`,
      },
      explanation: {
        fr: "Contrairement au calcul direct du prix à partir du taux, ici il faut isoler r dans la formule à partir du prix observé — l'opération inverse, tout aussi utile pour lire un taux de marché à partir d'une cotation.",
        en: "Unlike directly computing price from the rate, here r must be isolated from the observed price — the inverse operation, just as useful for reading a market rate off a quote.",
      },
      commonMistake: {
        fr: "Oublier de multiplier par 360/d à la fin, ou oublier le facteur (1 − P/F).",
        en: "Forgetting to multiply by 360/d at the end, or forgetting the (1 − P/F) factor.",
      },
    };
  },
};

const thresholdErrorTemplate = mcqTemplate({
  id: "m01-classes-erreur-seuil",
  conceptId: "m01-classes-actifs",
  difficulty: "medium",
  prompt: {
    fr: "Un étudiant affirme : « Un instrument à 13 mois est presque à un an, donc il relève encore du marché monétaire. » Où est l'erreur ?",
    en: "A student claims: \"A 13-month instrument is almost a year, so it still belongs to the money market.\" What is the error?",
  },
  choices: [
    { id: "threshold", label: { fr: "Le seuil d'un an est une convention nette : au-delà, l'instrument relève du marché de capitaux, quel que soit l'écart", en: "The one-year threshold is a clean-cut convention: beyond it, the instrument belongs to the capital market, however small the gap" } },
    { id: "approx", label: { fr: "Aucune erreur : la proximité d'un an suffit à rester dans le marché monétaire par approximation", en: "No error: proximity to one year is enough to stay in the money market by approximation" } },
  ],
  correctId: "threshold",
  hint: { fr: "Une convention de classification n'admet pas d'\"à peu près\".", en: "A classification convention doesn't admit \"roughly\"." },
  explanation: {
    fr: "Le seuil d'un an est une convention stricte, pas une zone floue : un instrument à 13 mois relève sans ambiguïté du marché de capitaux, même s'il n'est \"que\" un mois au-delà du seuil.",
    en: "The one-year threshold is a strict convention, not a fuzzy zone: a 13-month instrument unambiguously belongs to the capital market, even if it's \"only\" one month past the threshold.",
  },
  commonMistake: {
    fr: "Traiter une convention de classification nette comme une zone d'approximation graduelle.",
    en: "Treating a clean classification convention as a gradual approximation zone.",
  },
});

const threeAxisScenarioTemplate = mcqTemplate({
  id: "m01-classes-scenario-trois-axes",
  conceptId: "m01-classes-actifs",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un bon du Trésor à 9 mois, déjà en circulation, s'échange entre deux banques sur une plateforme électronique standardisée avec chambre de compensation. Comment le classer sur les trois axes (durée / stade / lieu) ?",
    en: "A 9-month Treasury bill, already in circulation, trades between two banks on a standardized electronic platform with a clearinghouse. How is it classified on the three axes (duration / stage / venue)?",
  },
  choices: [
    { id: "correct", label: { fr: "Marché monétaire (< 1 an) + marché secondaire (déjà émis) + marché organisé (chambre de compensation)", en: "Money market (< 1 year) + secondary market (already issued) + organized market (clearinghouse)" } },
    { id: "wrong", label: { fr: "Marché de capitaux + marché primaire + marché de gré à gré", en: "Capital market + primary market + over-the-counter market" } },
  ],
  correctId: "correct",
  hint: { fr: "Vérifiez chacun des trois axes séparément, sans les mélanger.", en: "Check each of the three axes separately, without mixing them up." },
  explanation: {
    fr: "9 mois < 1 an (marché monétaire), le titre est \"déjà en circulation\" (marché secondaire), et la présence d'une chambre de compensation standardisée signale un marché organisé — les trois axes se lisent indépendamment.",
    en: "9 months < 1 year (money market), the security is \"already in circulation\" (secondary market), and the presence of a standardized clearinghouse signals an organized market — the three axes read independently.",
  },
  commonMistake: {
    fr: "Supposer qu'un bon du Trésor est automatiquement \"marché de capitaux\" du seul fait qu'il s'agit d'un titre d'État, sans vérifier sa maturité réelle.",
    en: "Assuming a Treasury bill is automatically \"capital market\" just because it's a government security, without checking its actual maturity.",
  },
});

const ipoScenarioTemplate = mcqTemplate({
  id: "m01-classes-scenario-ipo",
  conceptId: "m01-classes-actifs",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Le jour de son introduction en bourse, une entreprise vend ses nouvelles actions à des investisseurs institutionnels via ses banques conseils, avant même leur première cotation publique. À quel marché cette vente initiale appartient-elle ?",
    en: "On its IPO day, a company sells its new shares to institutional investors through its advisory banks, before their first public listing. Which market does this initial sale belong to?",
  },
  choices: [
    { id: "primary", label: { fr: "Marché primaire : c'est la toute première émission de ces actions, avec un flux vers l'émetteur", en: "Primary market: this is the very first issuance of these shares, with a flow to the issuer" } },
    { id: "secondary", label: { fr: "Marché secondaire, puisque des investisseurs institutionnels sont impliqués", en: "Secondary market, since institutional investors are involved" } },
  ],
  correctId: "primary",
  hint: { fr: "Le type d'investisseur (institutionnel ou non) ne détermine pas l'axe primaire/secondaire.", en: "The investor type (institutional or not) doesn't determine the primary/secondary axis." },
  explanation: {
    fr: "Le marché primaire se définit par le flux de capital vers l'émetteur lors d'une première émission, indépendamment du type d'investisseur qui achète — la cotation publique du lendemain, elle, ouvrira le marché secondaire.",
    en: "The primary market is defined by the capital flow to the issuer during a first issuance, independent of the investor type buying — the next day's public listing, meanwhile, will open the secondary market.",
  },
  commonMistake: {
    fr: "Croire que la présence d'investisseurs institutionnels sophistiqués signale automatiquement un marché secondaire.",
    en: "Believing the presence of sophisticated institutional investors automatically signals a secondary market.",
  },
});

export const templates: QuestionTemplate[] = [
  discountPriceNumericTemplate,
  marketClassificationTemplate,
  moneyVsCapitalTemplate,
  vocabTemplate,
  comprehensionTemplate,
  forwardVsFutureComparisonTemplate,
  whatIfPrivatePlacementTemplate,
  whatIfResaleOtcTemplate,
  impliedYieldNumericTemplate,
  thresholdErrorTemplate,
  threeAxisScenarioTemplate,
  ipoScenarioTemplate,
];
