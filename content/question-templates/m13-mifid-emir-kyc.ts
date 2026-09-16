import { pick, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";

const frameworkPurposeTemplate: QuestionTemplate = {
  id: "m13-mifid-emir-kyc-objectif",
  conceptId: "m13-mifid-emir-kyc",
  kind: "mcq",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const framework = pick(rng, ["mifid", "emir"] as const);
    return {
      prompt: framework === "mifid"
        ? { fr: "Quel est l'objectif principal de MiFID II ?", en: "What is MiFID II's main objective?" }
        : { fr: "Quel est l'objectif principal d'EMIR ?", en: "What is EMIR's main objective?" },
      choices: buildChoices([
        { id: "correct", label: framework === "mifid"
          ? { fr: "Encadrer la relation avec le client final (transparence, meilleure exécution)", en: "Governing the relationship with the end client (transparency, best execution)" }
          : { fr: "Encadrer le risque de contrepartie entre institutions via la compensation centrale et le reporting", en: "Governing counterparty risk between institutions via central clearing and reporting" } },
        { id: "wrong", label: framework === "mifid"
          ? { fr: "Encadrer la compensation centrale des dérivés entre institutions", en: "Governing derivatives' central clearing between institutions" }
          : { fr: "Encadrer la transparence pré/post-négociation envers le client final", en: "Governing pre/post-trade transparency toward the end client" } },
      ]),
      hint: { fr: "L'un des deux cadres concerne la relation avec le client, l'autre le risque entre institutions.", en: "One framework concerns the client relationship, the other the risk between institutions." },
      correctChoiceIds: ["correct"],
      explanation: framework === "mifid"
        ? { fr: "MiFID II impose des obligations de transparence pré/post-négociation et de meilleure exécution envers le client final, contrairement à EMIR qui encadre le risque entre institutions.", en: "MiFID II imposes pre/post-trade transparency and best execution obligations toward the end client, unlike EMIR which governs risk between institutions." }
        : { fr: "EMIR impose la compensation centrale obligatoire et le reporting des dérivés pour réduire le risque de contrepartie entre institutions, contrairement à MiFID II qui encadre la relation avec le client.", en: "EMIR imposes mandatory central clearing and derivatives reporting to reduce counterparty risk between institutions, unlike MiFID II which governs the client relationship." },
      commonMistake: {
        fr: "Confondre les objectifs respectifs de MiFID II et EMIR, deux cadres complémentaires mais distincts.",
        en: "Confusing MiFID II's and EMIR's respective objectives, two complementary but distinct frameworks.",
      },
    };
  },
};

const amlrDirectiveVsRegulationTemplate: QuestionTemplate = {
  id: "m13-mifid-emir-kyc-amlr-reglement",
  conceptId: "m13-mifid-emir-kyc",
  kind: "true_false",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "L'AMLR remplace une approche par directive (interprétation nationale variable) par un règlement directement applicable de façon uniforme dans tous les États membres de l'UE.",
      en: "AMLR replaces a directive-based approach (variable national interpretation) with a regulation directly and uniformly applicable across all EU member states.",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : le passage d'une directive (transposition nationale variable) à un règlement (application directe et uniforme) est précisément l'un des changements structurels majeurs apportés par l'AMLR au dispositif LCB-FT européen.",
      en: "True: shifting from a directive (variable national transposition) to a regulation (direct, uniform application) is precisely one of the major structural changes AMLR brings to the European AML-CFT framework.",
    },
    commonMistake: {
      fr: "Croire qu'une directive et un règlement européens ont exactement le même statut juridique d'application dans les États membres.",
      en: "Believing a European directive and regulation have exactly the same legal application status in member states.",
    },
  }),
};

const activeAccountTemplate: QuestionTemplate = {
  id: "m13-mifid-emir-kyc-active-account",
  conceptId: "m13-mifid-emir-kyc",
  kind: "mcq",
  difficulty: "hard",
  generate: () => ({
    prompt: {
      fr: "Quel objectif poursuit l'Active Account Requirement introduit par EMIR 3.0 ?",
      en: "What objective does the Active Account Requirement introduced by EMIR 3.0 pursue?",
    },
    choices: buildChoices([
      { id: "sovereignty", label: { fr: "Réduire la dépendance de l'UE aux chambres de compensation de pays tiers pour certains dérivés systémiques", en: "Reducing the EU's dependence on third-country clearing houses for certain systemic derivatives" } },
      { id: "unrelated", label: { fr: "Simplifier les obligations de meilleure exécution sous MiFID II", en: "Simplifying MiFID II's best execution obligations" } },
    ]),
    hint: { fr: "Ce mécanisme a une dimension de souveraineté financière européenne.", en: "This mechanism has a European financial sovereignty dimension." },
    correctChoiceIds: ["sovereignty"],
    explanation: {
      fr: "L'Active Account Requirement oblige les contreparties européennes à maintenir un compte actif auprès d'une chambre de compensation établie dans l'UE pour certains dérivés jugés systémiques, réduisant la concentration géographique du risque auprès de chambres de pays tiers.",
      en: "The Active Account Requirement requires European counterparties to maintain an active account with an EU-established clearing house for certain systemic derivatives, reducing geographic risk concentration at third-country clearing houses.",
    },
    commonMistake: {
      fr: "Confondre cette exigence avec une obligation liée à MiFID II plutôt qu'à EMIR.",
      en: "Confusing this requirement with a MiFID II-related obligation rather than an EMIR one.",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m13-mifid-emir-kyc-vocab",
  conceptId: "m13-mifid-emir-kyc",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "L'exigence de surveillance continue de la relation client (pas uniquement à l'entrée en relation), introduite par l'AMLR, est appelée le KYC ______.",
      en: "The requirement for continuous monitoring of the client relationship (not just at onboarding), introduced by AMLR, is called ______ KYC.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["perpetuel", "perpétuel", "perpetual"],
    hint: { fr: "Le contraire d'une vérification ponctuelle unique.", en: "The opposite of a single one-off check." },
    explanation: {
      fr: "Le KYC perpétuel (pKYC) introduit par l'AMLR (article 26) exige une surveillance continue de la relation client, plutôt qu'une simple vérification d'identité au moment de l'entrée en relation.",
      en: "Perpetual KYC (pKYC), introduced by AMLR (Article 26), requires continuous monitoring of the client relationship, rather than a simple identity check at onboarding.",
    },
    commonMistake: {
      fr: "Confondre le KYC perpétuel avec la vérification d'identité initiale réalisée uniquement à l'ouverture de la relation d'affaires.",
      en: "Confusing perpetual KYC with the initial identity check performed only when the business relationship opens.",
    },
  }),
};

export const templates: QuestionTemplate[] = [frameworkPurposeTemplate, amlrDirectiveVsRegulationTemplate, activeAccountTemplate, vocabTemplate];
