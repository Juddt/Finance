import { randomInt, randomFloat, type Rng } from "@/lib/prng";
import { buildChoices, type QuestionTemplate } from "@/lib/question-templates";
import { mcqTemplate, trueFalseTemplate } from "@/lib/question-template-kit";

function fmt(n: number, locale: "fr" | "en", decimals = 2): string {
  return n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const linearSkewNumericTemplate: QuestionTemplate = {
  id: "m08-skew-lineaire-calcul",
  conceptId: "m08-skew-smile-surface",
  kind: "numeric",
  difficulty: "medium",
  generate: (rng: Rng) => {
    const ivAtm = randomInt(rng, 15, 30);
    const betaPct = -1 * randomInt(rng, 5, 20);
    const moneyness = randomInt(rng, 80, 95) / 100;
    const beta = betaPct / 100;
    const iv = Math.round((ivAtm / 100 + beta * Math.log(moneyness)) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `IV_ATM=${ivAtm}%, pente de skew β=${betaPct}%, un strike à K/F0=${moneyness.toFixed(2)}. Avec l'approximation IV(K) ≈ IV_ATM + β×ln(K/F0), quelle est l'IV de ce strike, en % ?`,
        en: `IV_ATM=${ivAtm}%, skew slope β=${betaPct}%, a strike at K/F0=${moneyness.toFixed(2)}. Using the approximation IV(K) ≈ IV_ATM + β×ln(K/F0), what is this strike's IV, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.3",
      hint: { fr: "IV(K) ≈ IV_ATM + β×ln(K/F0).", en: "IV(K) ≈ IV_ATM + β×ln(K/F0)." },
      numeric: { value: iv, tolerance: 0.3 },
      calculation: {
        fr: `IV ≈ ${ivAtm}% + (${betaPct}%)×ln(${moneyness.toFixed(2)}) ≈ ${ivAtm}% + (${betaPct}%)×(${Math.log(moneyness).toFixed(4)}) ≈ ${fmt(iv, "fr")}%.`,
        en: `IV ≈ ${ivAtm}% + (${betaPct}%)×ln(${moneyness.toFixed(2)}) ≈ ${ivAtm}% + (${betaPct}%)×(${Math.log(moneyness).toFixed(4)}) ≈ ${fmt(iv, "en")}%.`,
      },
      explanation: {
        fr: "Pour K<F0 (un strike de put OTM typique), ln(K/F0) est négatif, donc avec un β négatif (skew equity typique), le terme correctif est positif : l'IV augmente pour les strikes bas, conformément au skew.",
        en: "For K<F0 (a typical OTM put strike), ln(K/F0) is negative, so with a negative β (typical equity skew), the correction term is positive: IV rises for low strikes, consistent with the skew.",
      },
      commonMistake: {
        fr: "Oublier de prendre le logarithme du ratio K/F0, en utilisant directement K/F0 dans la formule.",
        en: "Forgetting to take the logarithm of the K/F0 ratio, using K/F0 directly in the formula.",
      },
    };
  },
};

const equitySkewSignTemplate: QuestionTemplate = {
  id: "m08-skew-signe-equity",
  conceptId: "m08-skew-smile-surface",
  kind: "mcq",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "Sur un marché actions typique, comparez la volatilité implicite d'un put OTM et celle d'un call OTM de même distance à la monnaie.",
      en: "In a typical equity market, compare the implied volatility of an OTM put and an OTM call at the same distance from the money.",
    },
    choices: buildChoices([
      { id: "put-higher", label: { fr: "Le put OTM a une IV plus élevée que le call OTM", en: "The OTM put has a higher IV than the OTM call" } },
      { id: "call-higher", label: { fr: "Le call OTM a une IV plus élevée que le put OTM", en: "The OTM call has a higher IV than the OTM put" } },
    ]),
    hint: { fr: "Pensez à la demande de protection contre les baisses de marché.", en: "Think about demand for protection against market declines." },
    correctChoiceIds: ["put-higher"],
    explanation: {
      fr: "Sur les actions, le skew est typiquement négatif : les puts OTM (protection à la baisse) ont une IV plus élevée que les calls OTM, reflétant la demande de protection et l'effet de levier.",
      en: "For equities, skew is typically negative: OTM puts (downside protection) have higher IV than OTM calls, reflecting protection demand and the leverage effect.",
    },
    commonMistake: {
      fr: "Inverser la relation typique entre put et call OTM sur les actions.",
      en: "Reversing the typical put/call OTM relationship for equities.",
    },
  }),
};

const surfaceDimensionsTemplate: QuestionTemplate = {
  id: "m08-skew-dimensions-surface",
  conceptId: "m08-skew-smile-surface",
  kind: "true_false",
  difficulty: "easy",
  generate: () => ({
    prompt: {
      fr: "La surface de volatilité combine deux dimensions : la variation par strike (skew/smile) et la variation par échéance (structure par terme).",
      en: "The volatility surface combines two dimensions: variation by strike (skew/smile) and variation by maturity (term structure).",
    },
    choices: buildChoices([
      { id: "true", label: { fr: "Vrai", en: "True" } },
      { id: "false", label: { fr: "Faux", en: "False" } },
    ]),
    correctChoiceIds: ["true"],
    explanation: {
      fr: "Vrai : la surface de volatilité est une nappe à deux dimensions (strike × échéance), le skew/smile étant sa coupe à échéance fixe, la structure par terme sa coupe à strike fixe.",
      en: "True: the volatility surface is a two-dimensional sheet (strike × maturity), with the skew/smile being its cross-section at fixed maturity, the term structure its cross-section at fixed strike.",
    },
    commonMistake: {
      fr: "Réduire la surface de volatilité à une seule dimension (uniquement le strike, ou uniquement l'échéance).",
      en: "Reducing the volatility surface to a single dimension (only strike, or only maturity).",
    },
  }),
};

const vocabTemplate: QuestionTemplate = {
  id: "m08-skew-vocab",
  conceptId: "m08-skew-smile-surface",
  kind: "fill_blank",
  difficulty: "medium",
  generate: () => ({
    prompt: {
      fr: "La position relative du strike par rapport au spot ou au forward, utilisée pour comparer des options sur une échelle indépendante du niveau de prix, s'appelle la ______.",
      en: "The strike's relative position versus spot or forward, used to compare options on a scale independent of the price level, is called ______.",
    },
    fillBlankPlaceholder: { fr: "un mot", en: "one word" },
    acceptedAnswers: ["moneyness"],
    hint: { fr: "Le même mot qu'en anglais financier.", en: "The English finance term itself." },
    explanation: {
      fr: "La moneyness (souvent K/S0 ou K/F0) permet de comparer des options de strikes différents sur une échelle standardisée.",
      en: "Moneyness (often K/S0 or K/F0) lets you compare options of different strikes on a standardized scale.",
    },
    commonMistake: {
      fr: "Confondre moneyness avec le strike absolu K, qui n'est pas comparable d'un actif à l'autre.",
      en: "Confusing moneyness with the absolute strike K, which isn't comparable across assets.",
    },
  }),
};

const comprehensionTemplate = mcqTemplate({
  id: "m08-skew-surface-comprehension",
  conceptId: "m08-skew-smile-surface",
  difficulty: "easy",
  prompt: {
    fr: "À quoi sert principalement une surface de volatilité implicite pour un desk d'options ?",
    en: "What is an implied volatility surface mainly used for by an options desk?",
  },
  choices: [
    { id: "consistent-pricing", label: { fr: "Fournir, pour n'importe quel couple (strike, échéance), une volatilité cohérente permettant de pricer des options non directement cotées", en: "Providing, for any (strike, maturity) pair, a consistent volatility that lets you price options not directly quoted" } },
    { id: "single-number", label: { fr: "Résumer tout le marché des options en un seul chiffre de volatilité", en: "Summarizing the entire options market into a single volatility number" } },
    { id: "historical-only", label: { fr: "Retracer l'historique des prix passés du sous-jacent", en: "Tracing the underlying's historical past prices" } },
  ],
  correctId: "consistent-pricing",
  hint: { fr: "La surface est une nappe 2D interpolée à partir des IV réellement cotées sur le marché.", en: "The surface is a 2D sheet interpolated from the IVs actually quoted in the market." },
  explanation: {
    fr: "La surface de volatilité interpole/extrapole, à partir des IV effectivement cotées sur le marché, une valeur pour tout couple (strike, échéance) — y compris ceux non directement traités — ce qui permet de pricer et couvrir de façon cohérente des options exotiques ou peu liquides.",
    en: "The volatility surface interpolates/extrapolates, from the IVs actually quoted in the market, a value for any (strike, maturity) pair — including ones not directly traded — which allows consistently pricing and hedging exotic or illiquid options.",
  },
  commonMistake: {
    fr: "Croire qu'une seule volatilité implicite (par exemple l'ATM) suffit à représenter tout le marché des options.",
    en: "Believing a single implied volatility (e.g. the ATM one) is enough to represent the entire options market.",
  },
});

const stickyStrikeVsStickyDeltaTemplate = mcqTemplate({
  id: "m08-skew-surface-sticky-strike-vs-delta",
  conceptId: "m08-skew-smile-surface",
  difficulty: "hard",
  prompt: {
    fr: "Que suppose une dynamique de surface \"sticky delta\", par opposition à \"sticky strike\", lorsque le spot bouge ?",
    en: "What does a \"sticky delta\" surface dynamic assume, as opposed to \"sticky strike\", when spot moves?",
  },
  choices: [
    { id: "shifts-with-spot", label: { fr: "La courbe d'IV se décale avec le spot : l'IV associée à chaque niveau de moneyness (delta) reste fixe, pas l'IV associée à chaque strike absolu", en: "The IV curve shifts with spot: the IV attached to each moneyness (delta) level stays fixed, not the IV attached to each absolute strike" } },
    { id: "iv-fixed-per-strike", label: { fr: "L'IV de chaque strike absolu reste identique quel que soit le mouvement du spot", en: "Each absolute strike's IV stays identical regardless of spot's move" } },
    { id: "no-difference", label: { fr: "Les deux hypothèses sont strictement équivalentes en toutes circonstances", en: "The two assumptions are strictly equivalent in all circumstances" } },
  ],
  correctId: "shifts-with-spot",
  hint: { fr: "\"Sticky\" = ce qui reste fixe quand le spot bouge : le strike absolu, ou le delta/moneyness ?", en: "\"Sticky\" = what stays fixed when spot moves: the absolute strike, or the delta/moneyness?" },
  explanation: {
    fr: "Sous \"sticky strike\", l'IV attachée à chaque strike absolu K ne change pas quand le spot bouge, alors que sous \"sticky delta\" (ou sticky moneyness), c'est l'IV attachée à chaque niveau de delta/moneyness qui reste fixe, ce qui fait alors bouger la courbe entière avec le spot — cette hypothèse affecte directement le Delta effectif d'une option (Delta total = Delta BS + terme de skew).",
    en: "Under \"sticky strike\", the IV attached to each absolute strike K doesn't change as spot moves, whereas under \"sticky delta\" (or sticky moneyness), it's the IV attached to each delta/moneyness level that stays fixed, which then shifts the whole curve with spot — this assumption directly affects an option's effective Delta (total Delta = BS Delta + skew term).",
  },
  commonMistake: {
    fr: "Traiter sticky strike et sticky delta comme un détail théorique sans conséquence pratique sur le calcul du Delta de couverture.",
    en: "Treating sticky strike and sticky delta as a theoretical detail with no practical consequence for computing the hedging Delta.",
  },
});

const whatIfFlatIvExoticTemplate = mcqTemplate({
  id: "m08-skew-surface-what-if-iv-plate",
  conceptId: "m08-skew-smile-surface",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un desk price une option exotique dont le payoff dépend fortement d'un strike très éloigné de la monnaie, en utilisant une seule IV ATM plate au lieu de la surface complète. Quelle est la conséquence la plus probable ?",
    en: "A desk prices an exotic option whose payoff strongly depends on a strike far from the money, using a single flat ATM IV instead of the full surface. What is the most likely consequence?",
  },
  choices: [
    { id: "mispricing", label: { fr: "Un mauvais pricing, car le skew fait que l'IV réelle à ce strike diffère significativement de l'IV ATM", en: "Mispricing, since the skew means the actual IV at that strike differs significantly from the ATM IV" } },
    { id: "no-impact", label: { fr: "Aucune conséquence, car le skew n'affecte que les options vanilles, jamais les exotiques", en: "No consequence, since skew only affects vanilla options, never exotics" } },
    { id: "always-cheaper", label: { fr: "Le prix obtenu est toujours plus élevé que le prix correct", en: "The obtained price is always higher than the correct price" } },
  ],
  correctId: "mispricing",
  hint: { fr: "Le skew existe précisément parce que l'IV varie avec le strike — l'ignorer revient à mal pricer tout payoff sensible à un strike éloigné de l'ATM.", en: "Skew exists precisely because IV varies with strike — ignoring it mis-prices any payoff sensitive to a strike far from ATM." },
  explanation: {
    fr: "Le skew/smile signifie précisément que l'IV varie avec le strike : utiliser une IV ATM unique pour un payoff sensible à un strike éloigné (option digitale, barrière, etc.) ignore cette information et conduit à un mauvais pricing, dans un sens qui dépend du signe du skew et de la position du strike concerné.",
    en: "Skew/smile precisely means IV varies with strike: using a single ATM IV for a payoff sensitive to a distant strike (digital, barrier option, etc.) ignores this information and leads to mispricing, in a direction that depends on the skew's sign and the relevant strike's position.",
  },
  commonMistake: {
    fr: "Supposer qu'une seule volatilité ATM est une approximation acceptable pour tout type de payoff, y compris les plus sensibles au skew.",
    en: "Assuming a single ATM volatility is an acceptable approximation for any payoff type, including those most sensitive to skew.",
  },
});

const whatIfInvertedTermStructureTemplate = mcqTemplate({
  id: "m08-skew-surface-what-if-structure-inversee",
  conceptId: "m08-skew-smile-surface",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "La structure par terme de volatilité ATM montre une IV à 1 mois nettement plus élevée que l'IV à 1 an sur un indice actions. Que suggère typiquement cette configuration ?",
    en: "The ATM volatility term structure shows a 1-month IV noticeably higher than the 1-year IV on an equity index. What does this configuration typically suggest?",
  },
  choices: [
    { id: "near-term-event", label: { fr: "Le marché anticipe une incertitude ou un événement notable à court terme, au-delà de ce qu'il anticipe en moyenne à long terme", en: "The market anticipates near-term uncertainty or a notable event, beyond what it expects on average longer term" } },
    { id: "always-normal", label: { fr: "C'est la configuration normale et permanente de tout marché d'options", en: "This is the normal, permanent configuration of any options market" } },
    { id: "pricing-error", label: { fr: "C'est nécessairement une erreur de cotation sans interprétation économique possible", en: "It is necessarily a quoting error with no possible economic interpretation" } },
  ],
  correctId: "near-term-event",
  hint: { fr: "Une structure par terme \"inversée\" (court terme > long terme) est l'exception, pas la norme habituelle.", en: "An \"inverted\" term structure (near-term > long-term) is the exception, not the usual norm." },
  explanation: {
    fr: "Une structure par terme inversée (IV courte plus élevée que l'IV longue) signale typiquement une incertitude ou un événement identifié à court terme (résultats, décision de banque centrale, élection) : la structure par terme redevient généralement croissante avec la maturité en l'absence de tels événements proches.",
    en: "An inverted term structure (short-dated IV higher than long-dated IV) typically signals near-term uncertainty or an identified event (earnings, central bank decision, election): the term structure usually reverts to being upward-sloping with maturity absent such near-term events.",
  },
  commonMistake: {
    fr: "Ignorer la forme de la structure par terme et ne regarder qu'un seul point de maturité isolé.",
    en: "Ignoring the term structure's shape and looking only at a single isolated maturity point.",
  },
});

const totalVarianceInterpolationNumericTemplate: QuestionTemplate = {
  id: "m08-skew-surface-calcul-interpolation-variance",
  conceptId: "m08-skew-smile-surface",
  kind: "numeric",
  difficulty: "hard",
  generate: (rng: Rng) => {
    const iv1m = randomFloat(rng, 18, 25, 1);
    const t1 = 1 / 12;
    const iv3m = randomFloat(rng, iv1m + 1, iv1m + 6, 1);
    const t3 = 3 / 12;
    const var1 = (iv1m / 100) ** 2 * t1;
    const var3 = (iv3m / 100) ** 2 * t3;
    const t2 = 2 / 12;
    const w = (t2 - t1) / (t3 - t1);
    const varInterp = var1 + w * (var3 - var1);
    const iv2m = Math.round(Math.sqrt(varInterp / t2) * 10000) / 100;

    return {
      isScenario: true,
      prompt: {
        fr: `La surface cote IV(1 mois)=${fmt(iv1m, "fr", 1)}% et IV(3 mois)=${fmt(iv3m, "fr", 1)}%. En interpolant linéairement la variance totale (σ²×T) entre ces deux points, quelle IV obtient-on à 2 mois, en % ?`,
        en: `The surface quotes IV(1 month)=${fmt(iv1m, "en", 1)}% and IV(3 months)=${fmt(iv3m, "en", 1)}%. Linearly interpolating total variance (σ²×T) between these two points, what IV do you get at 2 months, in %?`,
      },
      numericUnit: { fr: "%", en: "%" },
      numericTolerance: "± 0.4",
      hint: { fr: "On interpole σ²×T, pas σ directement, puis on redivise par T et on prend la racine.", en: "You interpolate σ²×T, not σ directly, then divide back by T and take the square root." },
      numeric: { value: iv2m, tolerance: 0.4 },
      calculation: {
        fr: `Var(1m)=${fmt(iv1m, "fr", 1)}%²×(1/12)≈${fmt(var1, "fr", 5)}. Var(3m)=${fmt(iv3m, "fr", 1)}%²×(3/12)≈${fmt(var3, "fr", 5)}. Interpolation linéaire en T (poids ${fmt(w, "fr", 2)}) → Var(2m)≈${fmt(varInterp, "fr", 5)}. IV(2m)=√(Var(2m)/(2/12))≈${fmt(iv2m, "fr")}%.`,
        en: `Var(1m)=${fmt(iv1m, "en", 1)}%²×(1/12)≈${fmt(var1, "en", 5)}. Var(3m)=${fmt(iv3m, "en", 1)}%²×(3/12)≈${fmt(var3, "en", 5)}. Linear interpolation in T (weight ${fmt(w, "en", 2)}) → Var(2m)≈${fmt(varInterp, "en", 5)}. IV(2m)=√(Var(2m)/(2/12))≈${fmt(iv2m, "en")}%.`,
      },
      explanation: {
        fr: "Contrairement à l'approximation de skew (qui interpole l'IV entre strikes), la construction cohérente de la structure par terme interpole la variance totale (σ²×T) entre maturités puis en redéduit l'IV, car c'est cette quantité qui s'additionne naturellement dans le temps et garantit l'absence d'arbitrage de calendrier.",
        en: "Unlike the skew approximation (which interpolates IV across strikes), consistently building the term structure interpolates total variance (σ²×T) across maturities and then derives IV back from it, since this is the quantity that naturally adds up over time and guarantees no calendar arbitrage.",
      },
      commonMistake: {
        fr: "Interpoler directement l'IV en pourcentage entre les deux maturités, au lieu d'interpoler la variance totale.",
        en: "Directly interpolating the IV percentage between the two maturities, instead of interpolating total variance.",
      },
    };
  },
};

const linearIvInterpolationMistakeTemplate = trueFalseTemplate({
  id: "m08-skew-surface-erreur-interpolation-lineaire",
  conceptId: "m08-skew-smile-surface",
  difficulty: "hard",
  statement: {
    fr: "Interpoler linéairement l'IV en pourcentage (et non la variance totale) entre deux maturités cotées garantit toujours l'absence d'arbitrage de calendrier sur la surface.",
    en: "Linearly interpolating the IV percentage (rather than total variance) between two quoted maturities always guarantees no calendar arbitrage on the surface.",
  },
  correct: false,
  hint: { fr: "La quantité qui s'additionne naturellement dans le temps est σ²×T, pas σ.", en: "The quantity that naturally adds up over time is σ²×T, not σ." },
  explanation: {
    fr: "Faux : interpoler directement l'IV en pourcentage peut produire une variance totale (σ²×T) non monotone en T, ce qui crée un arbitrage de calendrier — la construction correcte interpole la variance totale, seule quantité qui s'additionne naturellement dans le temps.",
    en: "False: directly interpolating the IV percentage can produce a total variance (σ²×T) that is non-monotonic in T, creating calendar arbitrage — the correct construction interpolates total variance, the only quantity that naturally adds up over time.",
  },
  commonMistake: {
    fr: "Interpoler l'IV comme n'importe quelle grandeur linéaire, sans vérifier la monotonie de la variance totale qui en résulte.",
    en: "Interpolating IV like any linear quantity, without checking the monotonicity of the resulting total variance.",
  },
});

const structurerScenarioTemplate = mcqTemplate({
  id: "m08-skew-surface-scenario-structureur",
  conceptId: "m08-skew-smile-surface",
  difficulty: "medium",
  isScenario: true,
  prompt: {
    fr: "Un structureur doit pricer un produit structuré avec une échéance de 18 mois, alors que la surface de volatilité ne cote directement que des maturités à 1, 6, 12 et 24 mois. Comment procède-t-il typiquement ?",
    en: "A structurer must price a structured product with an 18-month maturity, while the volatility surface only directly quotes 1, 6, 12, and 24-month maturities. What do they typically do?",
  },
  choices: [
    { id: "interpolate-surface", label: { fr: "Interpoler la surface (en variance totale) entre les maturités cotées encadrantes pour obtenir une IV cohérente à 18 mois", en: "Interpolate the surface (in total variance) between the surrounding quoted maturities to get a consistent 18-month IV" } },
    { id: "refuse-price", label: { fr: "Refuser de pricer, faute de cotation directe à exactement 18 mois", en: "Refuse to price, for lack of a direct quote at exactly 18 months" } },
    { id: "use-12m-only", label: { fr: "Utiliser directement l'IV à 12 mois sans aucun ajustement", en: "Directly use the 12-month IV with no adjustment" } },
  ],
  correctId: "interpolate-surface",
  hint: { fr: "La surface est justement construite pour fournir une valeur cohérente à n'importe quelle maturité intermédiaire.", en: "The surface is precisely built to provide a consistent value at any intermediate maturity." },
  explanation: {
    fr: "La surface de volatilité est construite pour couvrir tout couple (strike, échéance), y compris les maturités non directement cotées : le structureur interpole (en variance totale, pour éviter tout arbitrage de calendrier) entre les points cotés encadrants afin d'obtenir une IV utilisable à 18 mois.",
    en: "The volatility surface is built to cover any (strike, maturity) pair, including maturities not directly quoted: the structurer interpolates (in total variance, to avoid calendar arbitrage) between the surrounding quoted points to obtain a usable 18-month IV.",
  },
  commonMistake: {
    fr: "Utiliser telle quelle l'IV de la maturité cotée la plus proche, sans interpolation, pour une échéance intermédiaire.",
    en: "Using the nearest quoted maturity's IV as-is, with no interpolation, for an intermediate maturity.",
  },
});

const riskManagerCalendarArbitrageScenarioTemplate = mcqTemplate({
  id: "m08-skew-surface-scenario-arbitrage-calendrier",
  conceptId: "m08-skew-smile-surface",
  difficulty: "hard",
  isScenario: true,
  prompt: {
    fr: "Un risk manager observe que, sur la surface d'un desk, la variance totale (σ²×T) au strike ATM décroît entre la maturité 6 mois et la maturité 12 mois. Que doit-il en conclure ?",
    en: "A risk manager observes that, on a desk's surface, the total variance (σ²×T) at the ATM strike decreases between the 6-month and 12-month maturity. What should they conclude?",
  },
  choices: [
    { id: "calendar-arb", label: { fr: "La surface contient une incohérence (arbitrage de calendrier potentiel), car la variance totale doit être croissante avec la maturité", en: "The surface contains an inconsistency (potential calendar arbitrage), since total variance must be increasing with maturity" } },
    { id: "normal-situation", label: { fr: "C'est une situation parfaitement normale et sans conséquence", en: "This is a perfectly normal situation with no consequence" } },
    { id: "just-skew", label: { fr: "Cela reflète simplement le skew, sans lien avec un quelconque arbitrage", en: "This simply reflects the skew, with no link to any arbitrage" } },
  ],
  correctId: "calendar-arb",
  hint: { fr: "La variance totale cumulée ne peut pas diminuer quand on ajoute du temps : sinon, on pourrait construire une position sans risque et gagnante.", en: "Cumulative total variance cannot decrease as time is added: otherwise, one could build a riskless, profitable position." },
  explanation: {
    fr: "La variance totale ATM (σ²×T) doit être croissante (ou au moins non décroissante) avec la maturité, sans quoi il devient possible de construire un calendar spread générant un profit sans risque : une variance totale décroissante entre deux maturités signale donc une incohérence de la surface à corriger, indépendamment de la forme du skew.",
    en: "Total ATM variance (σ²×T) must be increasing (or at least non-decreasing) with maturity, otherwise it becomes possible to build a calendar spread generating a riskless profit: a decreasing total variance between two maturities therefore signals a surface inconsistency to fix, independent of the skew's shape.",
  },
  commonMistake: {
    fr: "Confondre une incohérence de structure par terme (arbitrage de calendrier) avec une simple caractéristique du skew, qui sont deux dimensions distinctes de la surface.",
    en: "Confusing a term-structure inconsistency (calendar arbitrage) with a simple skew feature, which are two distinct dimensions of the surface.",
  },
});

export const templates: QuestionTemplate[] = [
  linearSkewNumericTemplate,
  equitySkewSignTemplate,
  surfaceDimensionsTemplate,
  vocabTemplate,
  comprehensionTemplate,
  stickyStrikeVsStickyDeltaTemplate,
  whatIfFlatIvExoticTemplate,
  whatIfInvertedTermStructureTemplate,
  totalVarianceInterpolationNumericTemplate,
  linearIvInterpolationMistakeTemplate,
  structurerScenarioTemplate,
  riskManagerCalendarArbitrageScenarioTemplate,
];
