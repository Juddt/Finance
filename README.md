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

## Ce qui est fait

- **Architecture** Next.js (App Router) / TypeScript / Tailwind v4, routage
  bilingue par segment `/fr`, `/en` (`proxy.ts` + `app/[locale]`), dictionnaires
  d'interface FR/EN (`i18n/`).
- **Catalogue complet** : les 13 modules du document (M01–M13) sont
  entièrement transcrits en 8 catégories / 19 chapitres / **97 notions**
  (`content/catalog/`), avec titre + objectif bilingues et référence à la
  ligne source du cadrage (`sourceRef`, ex. `M02-4`) pour chaque notion. Une
  matrice de couverture (`getCoverageMatrix()`) est générée directement depuis
  le catalogue — aucune notion demandée n'a été supprimée ; celles non
  rédigées sont marquées `upcoming` (« À venir ») et ne comptent pas comme
  disponibles dans les statistiques.
- **Un parcours vertical complet et publié** : la notion `m02-forward-contract-value`
  (« Valeur d'un forward à la conclusion », M02-4) a un cours bilingue complet
  respectant la structure imposée (objectif → intuition → définition →
  utilité → exemple → formule → variables/hypothèses → calcul détaillé →
  interprétation → pièges → 3 points à retenir → section « Approfondir »
  dépliable avec démonstration), rendu avec KaTeX (`components/Formula.tsx`,
  rendu serveur), et 3 questions (QCM, vrai/faux, calcul numérique avec
  tolérance) corrigées côté serveur.
- **Correction et progression côté serveur** (`lib/store.ts`,
  `app/api/study-sessions/**`) : les solutions (`content/questions/*.solutions.ts`)
  ne sont jamais importées par un composant client et n'apparaissent pas dans
  le bundle navigateur (vérifié après build de production). Les tentatives
  sont idempotentes (clé `clientAttemptKey`), l'ownership session/question est
  vérifié côté serveur, les écritures sont sérialisées pour éviter une
  course entre requêtes concurrentes.
- **Moteur de révision espacée** (`lib/srs.ts`) : portage TypeScript testé du
  script du document (intervalles 1/3/7/14/30/60 jours, anti-inflation en cas
  de révision anticipée ou de correction déjà vue le même jour, échec →
  retour en fin de session + J+1). 12 tests unitaires.
- **Correction numérique locale-aware** (`lib/grading.ts`) : accepte `5,2`
  et `5.2`, distingue `5%` de `5` en valeur décimale, tolérance explicite
  par question. 7 tests unitaires.
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

- **96 des 97 notions du catalogue n'ont pas de cours rédigé** : seule
  `m02-forward-contract-value` est publiée. Le catalogue affiche « À venir »
  pour les autres et elles ne comptent pas dans la couverture publiée — voir
  livraison progressive demandée en section 8 du document.
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
- **Recherche FR/EN, favoris, glossaire bilingue, bibliothèque de formules,
  pages Révisions/Quiz/Progression** de la navigation principale : présents
  dans l'interface comme des points d'entrée visibles mais désactivés/non
  implémentés (`nav` grisée dans `app/[locale]/layout.tsx`).
- **Aucune démo de contenu ML (M12) ni de code Python commenté** : le
  catalogue liste les notions et objectifs pédagogiques demandés pour M12,
  mais aucun cours n'est rédigé (contrainte « quel problème / quand l'éviter
  / mini-code Python » du document à honorer à la rédaction).

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
   exemples, conventions et démonstrations des 96 notions restantes.
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

## Architecture

```
app/[locale]/                page d'accueil (catalogue), page notion+quiz, layout (nav, toggle langue)
app/api/                     route handlers : catalog, lessons/:id, study-sessions, attempts, reviews/due, profile
proxy.ts                     redirige "/" -> "/fr" (convention Next.js 16, ex-middleware.ts)
components/                  LanguageToggle, Formula (KaTeX serveur), QuizRunner (client)
content/catalog/             catégories, chapitres, 97 notions (M01-M13), matrice de couverture
content/lessons/              contenu bilingue du cours pilote publié
content/questions/            questions publiques + solutions (fichier .solutions.ts, serveur uniquement)
lib/                         srs.ts, grading.ts, store.ts, session.ts, content-registry.ts, question/lesson types
i18n/                        config locales + dictionnaires d'interface FR/EN
db/migrations/0001_init.sql   schéma cible Supabase/PostgreSQL (tables + RLS), non exécuté
```

## Sources

- Contenu de `m02-forward-contract-value` : J. Hull, *Options, Futures, and
  Other Derivatives* (pricing des forwards par non-arbitrage et portefeuille
  de réplication), convention composition continue sans dividende.
- Routage i18n : [documentation Next.js](https://nextjs.org/docs/app/guides/internationalization).
- Isolation des données : [RLS Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).
