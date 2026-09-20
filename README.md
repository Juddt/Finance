# Finance Academy

Plateforme bilingue FR/EN de cours structurés et quiz pour la finance de marché
(public visé : M2 Ingénierie Financière). Ce dépôt est un **scaffold** issu du
document de cadrage fourni (architecture, modèle de données, catalogue
complet, un parcours pilote de bout en bout) — pas une application finie.

## Lancer le projet en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) (redirige vers `/fr`).

```bash
npm run test    # vitest — moteur de révision espacée + correction
npm run lint    # eslint
npm run build   # build de production (vérifie aussi les types)
```

Aucune base de données externe n'est requise pour ce scaffold : la
persistance utilisateur (sessions, tentatives, révisions) est un store
fichier local (`lib/store.ts`, données dans `.data/`, jamais commitées). Voir
plus bas pour la cible de production (Supabase).

## Déploiement GitHub Pages (démo de test)

GitHub Pages ne sert que des fichiers statiques (pas de serveur Node), donc
les routes API, les cookies et `proxy.ts` sont incompatibles — voir
[la documentation Next.js sur l'export statique](https://nextjs.org/docs/app/guides/static-exports#unsupported-features).
Un build dédié (`npm run build:pages`, alias `output: "export"`) contourne ça :

- Les routes API, `proxy.ts` et `components/QuizSlot.tsx` (voir plus bas) sont
  remplacés le temps du build par `scripts/build-static.mjs`, puis restaurés —
  le build normal (`npm run dev` / `npm run build`) n'est jamais impacté.
- **Le quiz est corrigé 100 % côté navigateur** (`lib/quiz-engine-client.ts`,
  rejoue `gradeAnswer`/`scheduleReview` en local) et la progression est
  stockée en `localStorage`, par navigateur — pas de compte, pas de
  synchronisation entre appareils, effacée si le visiteur vide ses données de
  site.
- **Conséquence assumée sur la sécurité** : pour que la correction puisse
  tourner sans serveur, les templates de questions (`content/question-templates/`,
  qui embarquent leur propre logique de correction dans `generate()`,
  normalement strictement serveur — voir plus bas) sont inclus dans le
  bundle JavaScript envoyé au navigateur pour *cette version uniquement*
  (`lib/content-registry-client.ts`). N'importe qui peut les lire dans les
  DevTools. C'est acceptable pour tester l'application, pas pour un usage
  réel — voir « Ce qui n'est pas fait ». Le build normal (Vercel/Node) n'est
  pas concerné : vérifié par grep après chaque build que le texte des
  templates n'apparaît pas dans `.next/static`.

**Mise en route (une fois)** : Settings → Pages → Source : **GitHub Actions**
sur le dépôt GitHub. Le workflow `.github/workflows/deploy-pages.yml` build et
déploie ensuite automatiquement à chaque push sur `main`.

**Tester en local avant de pousser** :

```bash
npm run build:pages   # génère ./out
npx serve out          # ou tout serveur statique équivalent
```

Le `basePath` par défaut est `/Finance` (nom du dépôt). Si le dépôt est
renommé ou déployé ailleurs, ajuster `NEXT_PUBLIC_BASE_PATH` dans
`next.config.ts` ou le passer en variable d'environnement au build.

## Ce qui est fait

- **Architecture** Next.js (App Router) / TypeScript / Tailwind v4, routage
  bilingue par segment `/fr`, `/en` (`proxy.ts` + `app/[locale]`), dictionnaires
  d'interface FR/EN (`i18n/`).
- **Catalogue complet** : les 13 modules du document (M01–M13) sont
  entièrement transcrits en 8 catégories / 19 chapitres / **112 notions**
  (`content/catalog/`), avec titre + objectif bilingues et référence à la
  ligne source du cadrage (`sourceRef`, ex. `M02-4`) pour chaque notion. Une
  matrice de couverture (`getCoverageMatrix()`) est générée directement depuis
  le catalogue — aucune notion demandée n'a été supprimée ; celles non
  rédigées sont marquées `upcoming` (« À venir ») et ne comptent pas comme
  disponibles dans les statistiques.
- **110 notions publiées de bout en bout** (`content/lessons/`, liste exacte
  des IDs dans `lib/content-registry.ts`), couvrant treize modules désormais
  complets (ou quasi-complets) : M01 Banques/marchés/fondamentaux (13/13, avec
  indicateurs macro, anticipations de taux directeurs, actions/dividendes,
  indices/ETF et points de change à terme/FX swap ajoutés), M02
  Forwards/futures/matières premières (7/7), M03 Obligations/taux/crédit
  (13/13, avec repo/collatéral avant le taux sans risque, CS01/DV01 par
  maturité (key rate duration, pentification/aplatissement)/carry & roll-down
  après le DV01, et les obligations convertibles en clôture), M04 FRA & swaps
  de taux (9/9, avec clearing
  central/ISDA-CSA suivi d'exposition future/CVA puis de la construction de
  courbe zéro-coupon par bootstrap, avant le cadre multi-courbe et les swaps
  d'inflation en clôture), M05 Options vanilles & stratégies (4/4), M06 Brownien &
  Black-Scholes (7/7), M07 Greeks & couverture dynamique (6/6), M08
  Volatilité & variance (6/8 — 2 intitulés laissés `upcoming` faute de
  confirmation, voir section « Ce qui reste à valider »), M09
  Corrélation/dispersion/paniers (5/5), M10 Options barrières & digitales
  (9/9), M11 Produits structurés & autocalls (5/5), M12 Machine learning
  appliqué à la finance (7/7), M13 Compléments (19/19 — mathématiques
  financières avec valorisation actions DCF/comparables, gestion de
  portefeuille, risques, trading/microstructure, réglementation avec sources
  officielles datées, programmation, entretiens). Les catégories **Taux et
  crédit** (M03+M04), **Fondamentaux → chapitre M01**, **Produits dérivés**
  (M02+M05+M09+M10+M11), **Machine learning** (M12) et **M13 (tous ses
  chapitres)** sont publiées à 100% ; **Modèles quantitatifs** (M06+M07+M08)
  est bien avancée. Chaque cours
  respecte la structure imposée — objectif → intuition → **rappel de
  prérequis** → **vocabulaire** défini avant usage → définition → utilité →
  exemple → **explication alternative** (pour un lecteur bloqué) → formule
  (KaTeX, variables/unités/hypothèses) → calcul détaillé → **mini-code
  Python commenté** (M12 et M13-prog, champ `pythonExample` optionnel) →
  interprétation → pièges → 3 points à retenir → section « Approfondir »
  dépliable avec démonstration — et deux niveaux de lecture (essentiel
  toujours visible, démonstration technique dépliable à la demande).
- **Banque de questions à variantes réelles** (`lib/question-templates.ts`,
  `content/question-templates/`, PRNG seedé dans `lib/prng.ts`, fabriques
  mutualisées dans `lib/question-template-kit.ts` pour les familles
  qualitatives) : 968 templates (en cours d'enrichissement vers ≥ 12
  familles réellement distinctes par notion — compréhension, comparaison,
  raisonnement conditionnel, calcul, erreur fréquente, mises en situation —
  plutôt qu'une simple variation de chiffres) génèrent des exercices avec
  des paramètres tirés au hasard (montants, taux, dates, scénarios) et
  **recalculent systématiquement** la bonne réponse et l'explication à
  partir de ces paramètres — changer l'ordre des réponses ne suffit jamais
  à faire une nouvelle question. 5 formats : QCM, vrai/faux, calcul
  numérique (tolérance explicite), texte à trous (mots-clés/variantes,
  jamais une égalité stricte de chaîne) et
  lecture de graphique (`components/PayoffChart.tsx`, SVG généré des
  paramètres réels, pas une image décorative). 48 tests vérifient la
  structure et la reproductibilité de chaque template sur 30 seeds.
- **Sessions d'entraînement illimitées et variées** (`lib/store.ts` +
  `lib/quiz-engine-client.ts`, même logique dans les deux moteurs) : mini-quiz
  par notion, quiz par chapitre, quiz de catégorie complète, mix personnalisé
  multi-catégories, et mode **Revoir mes erreurs** (notions où une carte de
  révision a déjà un échec). Longueur de session 5/10/20 questions ou mode
  continu. Sélection **adaptative** (`lib/adaptive-quiz.ts`) : démarre au
  niveau intermédiaire, redescend en facile après deux échecs consécutifs,
  monte en difficile après trois réussites d'affilée ; jamais deux fois de
  suite le même template, sauf pour l'exercice similaire volontaire.
- **Correction qui fait apprendre** (`components/QuizShell.tsx`) : indice
  affiché à la demande avant la solution, puis bonne réponse + explication +
  calcul détaillé + erreur fréquente + lien direct vers le cours de la
  notion, puis **« Réessayer avec un exercice similaire »** (nouvelle
  variante du même template, immédiate, ne compte pas dans la longueur de
  session) avant de passer à la question suivante.
- **Pages Révisions et Progression** (`/revisions`, `/progress`) : notions
  dues selon la répétition espacée, et statut par catégorie (à découvrir / en
  cours / fragile / maîtrisée / à réactiver — voir doc section 5). La
  navigation principale (Cours, Révisions, Quiz, Progression) est
  entièrement active ; seule la bibliothèque de formules reste un point
  d'entrée désactivé.
- **Correction et progression côté serveur** (`lib/store.ts`,
  `app/api/study-sessions/**`) : les templates de questions (qui embarquent
  leur propre logique de correction) ne sont jamais importés par un
  composant client dans le build normal et n'apparaissent pas dans le bundle
  navigateur (vérifié par grep après chaque build de production — voir «
  Déploiement GitHub Pages » pour l'unique exception assumée). Les
  tentatives sont idempotentes (clé = identifiant d'instance de question,
  généré une fois par tirage), l'ownership session/question est vérifié
  côté serveur, les écritures sont sérialisées pour éviter une course entre
  requêtes concurrentes — y compris pour ne jamais compter deux fois la même
  réponse en cas de double clic ou de retry réseau.
- **Note du quiz par notion, visible avant d'ouvrir le cours** (`lib/store.ts`
  `conceptQuizScores`, `lib/quiz-engine-client.ts` pour le build statique,
  `components/ConceptListEntry.tsx` et `components/LessonScoreBadge.tsx`) :
  le quiz intégré à une notion (mode "concept") a une longueur fixe (tous ses
  templates) ; sa complétion fige un score correct/total, affiché directement
  dans la liste catalogue (lien coloré vert ≥80%, orange ≥50%, rouge sinon +
  badge "x/y") et en haut de la page notion, pour repérer une mauvaise note
  et y retourner sans avoir à rouvrir le cours. Écrasé à chaque nouvelle
  tentative complète.
- **Moteur de révision espacée** (`lib/srs.ts`) : portage TypeScript testé du
  script du document (intervalles 1/3/7/14/30/60 jours, anti-inflation en cas
  de révision anticipée ou de correction déjà vue le même jour, échec →
  retour en fin de session + J+1). Les cartes sont maintenant indexées par
  *template* (famille stable de question), pas par instance générée, pour
  que la progression survive au changement de variante. 12 tests unitaires.
- **Correction numérique et texte libre locale-aware** (`lib/grading.ts`) :
  accepte `5,2` et `5.2`, distingue `5%` de `5` en valeur décimale,
  tolérance explicite par question numérique ; le texte à trous est comparé
  normalisé (minuscules, accents retirés) contre une liste de réponses
  acceptées. 9 tests unitaires.
- **Toggle de langue** (`components/LanguageToggle.tsx`) qui change
  uniquement le segment de langue dans l'URL : la page et les paramètres de
  requête (question active via `?q=`) sont conservés. La session de quiz et
  la réponse déjà sélectionnée ne sont **pas** conservées au changement de
  langue dans ce scaffold — limitation connue, voir section suivante.
- **Schéma SQL cible Supabase/PostgreSQL** (`db/migrations/0001_init.sql`) :
  toutes les tables du document (catalogue, cours versionnés, questions/
  solutions privées, sessions, tentatives, révision espacée, progression,
  favoris, signalements, matrice de couverture), RLS activé partout où le
  document le demande, schéma `private` non exposé aux rôles `anon`/
  `authenticated` pour les solutions. **Non exécutée** sur un projet Supabase
  réel dans cette livraison (voir « Ce qui reste à valider »).

## Ce qui n'est PAS fait (volontairement, pour ce scaffold)

- **2 des 112 notions du catalogue n'ont pas de cours rédigé** (module M08,
  intitulés laissés « À venir » faute de confirmation) : 110 sont publiées
  (voir ci-dessus). Le catalogue affiche « À venir » pour les
  autres et elles ne comptent pas dans la couverture publiée, ni dans les
  quiz de chapitre/catégorie/mix personnalisé (un chapitre ou une catégorie
  sans aucune notion publiée n'apparaît simplement pas dans le hub `/quiz`)
  — voir livraison progressive demandée en section 8 du document. Le moteur
  (templates, sessions adaptatives, SRS) est désormais réutilisable tel
  quel pour chaque nouvelle notion rédigée.
- **Pas de Supabase branché** : le store fichier local (`lib/store.ts`)
  respecte le même contrat (correction serveur, idempotence, isolation par
  utilisateur) mais n'est pas une base de données réelle, ne survit pas à un
  redéploiement, et n'a pas de RLS — c'est un stand-in pour développer et
  tester l'application avant de migrer vers `db/migrations/0001_init.sql`.
- **Identité utilisateur minimale** : un cookie httpOnly opaque
  (`lib/session.ts`) tient lieu d'utilisateur, sans authentification réelle
  (pas de Supabase Auth, pas d'email/mot de passe). Suffisant pour
  développer le moteur de progression, pas pour un lancement.
- **Pas de préservation d'état du quiz au changement de langue** : le
  document demande de conserver « la même page, la question active, la
  réponse sélectionnée ». Seuls la page et l'index de question (`?q=`) sont
  conservés ; changer de langue recrée une session de quiz côté serveur
  (nouvelle grille de correction dans l'autre langue) et efface la réponse
  en cours de saisie. À corriger avant d'aller au-delà du parcours pilote.
- **Recherche FR/EN, favoris et bibliothèque de formules** : toujours des
  points d'entrée visibles mais désactivés (« Formules » grisée dans
  `app/[locale]/layout.tsx`) — Révisions, Quiz et Progression sont
  maintenant actifs.
- **Le build GitHub Pages n'a pas de correction serveur** : c'est une démo de
  test, pas une alternative à l'architecture Supabase visée. Voir
  « Déploiement GitHub Pages » ci-dessus pour le détail de ce qui change
  (templates de questions côté client, progression en localStorage
  uniquement).

## Ce qui reste à valider avant d'aller plus loin

Repris du document de cadrage (section E), toujours vrai pour ce scaffold :

1. **Deux intitulés à confirmer avant rédaction** (conservés tels quels dans
   le catalogue, `needsClarification: true`) :
   - `m08-replication-echange-ecart` (M08-6) — « réplication d'un échange
     d'écart », probablement liée à la réplication du variance swap.
   - `m08-modele-avellaneda` (M08-8) — référence exacte du modèle
     d'Avellaneda à préciser, à ne pas confondre avec Avellaneda-Stoikov
     (market making).
2. Les cours/annales de l'utilisateur et les sources autorisées pour aligner
   exemples, conventions et démonstrations des 41 notions restantes.
3. La stack d'un éventuel site existant à faire évoluer : aucun dépôt de ce
   type n'a été trouvé/inspecté (ce dépôt a été créé vide pour ce projet).
4. Revue technique et pédagogique de chaque cours rédigé (le contenu de
   `m02-forward-contract-value` suit Hull, *Options, Futures, and Other
   Derivatives* — à faire relire).
5. Exécuter et tester `db/migrations/0001_init.sql` sur un projet Supabase
   réel, avec tests des policies RLS (autorisations réellement accordées, pas
   supposées).

## Hypothèses prises pour ce scaffold

- **8 catégories** au lieu des 6 domaines cités en exemple dans le document
  (« bases, taux, dérivés, risques, modèles quantitatifs, machine learning ») :
  `Dérivés` et `Modèles quantitatifs` sont séparés (produits vs. modèles de
  pricing), et deux catégories supplémentaires (`Gestion de portefeuille`,
  `Outils et préparation aux entretiens`) logent sans perte les sujets
  transverses de M13 (portefeuille, programmation, entretiens) qui ne
  rentraient dans aucun des 6 domaines cités. Voir `content/catalog/categories.ts`.
- **M13 découpé en 18 notions** réparties dans 7 chapitres (un par sous-thème
  du document : mathématiques financières, gestion de portefeuille, risques,
  trading/microstructure, réglementation, programmation, entretiens), pour
  respecter la consigne « une ligne regroupant plusieurs objectifs doit être
  découpée en plusieurs micro-leçons si nécessaire ».
- **Store fichier local** en attendant Supabase (voir ci-dessus) : décision
  pragmatique pour livrer un parcours testable sans dépendance à un projet
  cloud, en gardant le même contrat d'API.
- Aucune donnée statistique n'est inventée : la couverture, les notions
  étudiées et les notions maîtrisées affichées sur la page catalogue sont
  calculées en direct depuis le catalogue et la progression réelle de
  l'utilisateur (`lib/store.ts#getCatalogStats`), jamais codées en dur.
- **« Revoir mes erreurs » se déclenche dès le premier échec** (`lapses > 0`
  sur une carte de révision), pas seulement pour les notions « fragile » —
  décision volontairement large pour que le mode soit utile tôt, même avec
  peu d'historique.
- **La session de mini-quiz d'une notion n'est pas adaptative** (elle
  parcourt une fois chaque template disponible) ; l'adaptation de difficulté
  s'applique aux sessions plus longues (chapitre/catégorie/mix/révision),
  où elle a un historique suffisant pour être pertinente.

## Architecture

```
app/[locale]/                page d'accueil (catalogue), page notion+quiz, quiz (hub/session), revisions, progress, layout (nav, toggle langue)
app/api/                     route handlers : catalog, lessons/:id, study-sessions (+ next/similar/attempts), reviews/due, progress, profile
app/layout.tsx, app/page.tsx  filet pour la racine "/" du build GitHub Pages (redirige vers "/fr")
proxy.ts                     redirige "/" -> "/fr" (convention Next.js 16, ex-middleware.ts) ; absent du build GitHub Pages
components/                  LanguageToggle, Formula (KaTeX serveur), PayoffChart (SVG), QuizShell (UI quiz partagée)
components/QuizRunner.tsx     backend serveur (fetch /api/**) ; components/StaticQuizRunner.tsx = backend local/localStorage
components/QuizSlot.tsx       point d'entrée swappable entre les deux (voir scripts/build-static.mjs)
components/QuizSessionPage.tsx, CustomQuizBuilder.tsx, RevisionsList.tsx, ProgressBoard.tsx  pages quiz/révisions/progression
content/catalog/             catégories, chapitres, 112 notions (M01-M13), matrice de couverture
content/lessons/              contenu bilingue des 56 cours publiés (prérequis, vocabulaire, explication alternative)
content/question-templates/   968 templates de questions à variantes (110 notions, enrichissement en cours vers ≥12/notion), serveur uniquement — sauf build GitHub Pages
lib/                         srs.ts, grading.ts, prng.ts, question-templates.ts, adaptive-quiz.ts, session-spec.ts,
                              store.ts, session.ts, content-registry(-client).ts, quiz-engine-client.ts
i18n/                        config locales + dictionnaires d'interface FR/EN
db/migrations/0001_init.sql   schéma cible Supabase/PostgreSQL (tables + RLS), non exécuté
scripts/build-static.mjs      build GitHub Pages : swap proxy.ts/app/api/QuizSlot.tsx, output: "export"
.github/workflows/deploy-pages.yml  CI : build + déploiement GitHub Pages sur push main
```

## Sources

- Contenu de `m02-forward-contract-value`, `m02-couverture-forward`,
  `m03-duration`, `m05-call-put` : J. Hull, *Options, Futures, and Other
  Derivatives* (pricing des forwards par non-arbitrage et portefeuille de
  réplication, duration/convexité, payoff des options vanilles), convention
  composition continue sans dividende.
- Contenu de `m03-risque-credit` : présentation standard du risque de
  crédit et des agences de notation (S&P, Moody's, Fitch) ; modèle
  structurel de Merton cité par son nom usuel, sans reproduire de
  démonstration propriétaire.
- Routage i18n : [documentation Next.js](https://nextjs.org/docs/app/guides/internationalization).
- Isolation des données : [RLS Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).
