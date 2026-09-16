-- Finance Academy — schéma cible Supabase/PostgreSQL (section C du document de cadrage).
--
-- Cette migration n'a PAS été exécutée sur un projet Supabase dans cette livraison
-- (voir README, section "Ce qui reste à valider"). Le MVP applicatif fourni utilise
-- un store fichier local qui respecte le même contrat (voir lib/store.ts) ; migrer
-- vers Supabase consiste à brancher les mêmes fonctions sur ces tables et policies.
--
-- Conventions : UUID pour les identifiants, timestamptz pour les dates/heures.
-- Les traductions référencent la même entité : changer de langue ne crée ni second
-- cours ni seconde progression.

create extension if not exists pgcrypto;

-- ============================================================================
-- Profils et préférences
-- ============================================================================

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  timezone text not null default 'Europe/Paris',
  daily_minutes integer not null default 10 check (daily_minutes > 0),
  created_at timestamptz not null default now()
);
-- Aucun rôle privilégié ici : un utilisateur ne peut jamais modifier ses propres droits.

-- ============================================================================
-- Catalogue : catégories -> chapitres -> notions
-- ============================================================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  position integer not null,
  icon text not null,
  color text not null
);

create table public.category_translations (
  category_id uuid not null references public.categories(id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  title text not null,
  summary text not null,
  primary key (category_id, locale)
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  position integer not null
);

create table public.chapter_translations (
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  title text not null,
  summary text not null,
  primary key (chapter_id, locale)
);

create table public.concepts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  level text not null check (level in ('essential', 'advanced')),
  estimated_minutes integer not null check (estimated_minutes > 0)
);

create table public.concept_translations (
  concept_id uuid not null references public.concepts(id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  title text not null,
  objective text not null,
  primary key (concept_id, locale)
);

create table public.chapter_concepts (
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  position integer not null,
  primary key (chapter_id, concept_id)
);

create table public.concept_prerequisites (
  concept_id uuid not null references public.concepts(id) on delete cascade,
  prerequisite_id uuid not null references public.concepts(id) on delete cascade,
  primary key (concept_id, prerequisite_id),
  check (concept_id <> prerequisite_id)
);
-- L'absence de cycle dans les prérequis doit être vérifiée à l'import (hors SQL pur).

-- ============================================================================
-- Cours (révisions versionnées) et formules
-- ============================================================================

create table public.lesson_revisions (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references public.concepts(id) on delete cascade,
  revision integer not null,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'published')),
  published_at timestamptz,
  unique (concept_id, revision)
);

create table public.lesson_translations (
  lesson_revision_id uuid not null references public.lesson_revisions(id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  -- content_blocks: tableau ordonné de sections typées
  -- (objectif, intuition, definition, utilite, exemple, formule, calcul, interpretation, pieges, points_cles, quiz)
  content_blocks jsonb not null,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'validated')),
  primary key (lesson_revision_id, locale)
);

create table public.formulas (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references public.concepts(id) on delete cascade,
  latex text not null,
  convention_key text not null
);

create table public.formula_translations (
  formula_id uuid not null references public.formulas(id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  title text not null,
  variables jsonb not null,
  assumptions text not null,
  units text not null,
  example text not null,
  primary key (formula_id, locale)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  private_document_id uuid,
  locator text,
  accessed_at timestamptz not null,
  check (url is not null or private_document_id is not null)
);

create table public.lesson_sources (
  lesson_revision_id uuid not null references public.lesson_revisions(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  primary key (lesson_revision_id, source_id)
);

-- ============================================================================
-- Questions, versions et solutions privées
-- ============================================================================

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references public.concepts(id) on delete cascade,
  question_family_id uuid,
  kind text not null check (kind in ('mcq', 'true_false', 'fill_blank', 'numeric', 'chart_reading', 'scenario'))
);

create table public.question_revisions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  lesson_revision_id uuid not null references public.lesson_revisions(id),
  revision integer not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'published')),
  unique (question_id, revision)
);

create table public.question_translations (
  question_revision_id uuid not null references public.question_revisions(id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  prompt text not null,
  -- choices: [{ id: string, label: string }, ...] — IDs stables, jamais par position
  choices jsonb,
  hint text,
  primary key (question_revision_id, locale)
);

-- Schéma non exposé aux rôles anon/authenticated : les solutions ne sortent jamais côté client.
create schema private;

create table private.question_solutions (
  question_revision_id uuid primary key references public.question_revisions(id) on delete cascade,
  -- answer_spec: { correctChoiceIds?: string[], numeric?: { value, tolerance, unit }, keywords?: string[] }
  answer_spec jsonb not null,
  grading_version text not null default 'v1'
);

create table private.solution_translations (
  question_revision_id uuid not null references private.question_solutions(question_revision_id) on delete cascade,
  locale text not null check (locale in ('fr', 'en')),
  explanation text not null,
  calculation text,
  common_mistake text,
  primary key (question_revision_id, locale)
);

-- ============================================================================
-- Sessions d'étude, tentatives, révision espacée, progression
-- ============================================================================

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  mode text not null check (mode in ('course', 'training', 'exam')),
  locale text not null check (locale in ('fr', 'en')),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.session_items (
  session_id uuid not null references public.study_sessions(id) on delete cascade,
  position integer not null,
  question_revision_id uuid not null references public.question_revisions(id),
  state text not null default 'pending' check (state in ('pending', 'answered', 'requeued')),
  primary key (session_id, position)
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  session_id uuid not null references public.study_sessions(id) on delete cascade,
  question_revision_id uuid not null references public.question_revisions(id),
  client_attempt_key text not null,
  answer jsonb not null,
  is_correct boolean not null,
  score numeric not null,
  answered_at timestamptz not null default now(),
  duration_ms integer not null check (duration_ms >= 0),
  unique (user_id, client_attempt_key)
);
-- is_correct/score sont calculés côté serveur : jamais un booléen envoyé par le navigateur.

create table public.review_cards (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  revision_seen_id uuid not null references public.question_revisions(id),
  step smallint not null default 0 check (step between 0 and 6),
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  last_study_day date,
  lapses integer not null default 0 check (lapses >= 0),
  algorithm_version text not null default 'simple-v1',
  primary key (user_id, question_id)
);

create table public.concept_progress (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  status text not null default 'to-discover'
    check (status in ('to-discover', 'in-progress', 'fragile', 'mastered', 'to-reactivate')),
  mastery_score numeric not null default 0,
  last_studied_at timestamptz,
  rule_version text not null default 'simple-v1',
  primary key (user_id, concept_id)
);
-- Agrégat recalculable depuis attempts/review_cards : jamais une vérité saisie par le client.

create table public.bookmarks (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, concept_id)
);

create table public.issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  lesson_revision_id uuid references public.lesson_revisions(id),
  question_revision_id uuid references public.question_revisions(id),
  message text not null,
  status text not null default 'open' check (status in ('open', 'triaged', 'resolved')),
  check (lesson_revision_id is not null or question_revision_id is not null)
);

-- ============================================================================
-- Matrice de couverture (section 8 du document)
-- ============================================================================

create table public.curriculum_requirements (
  id uuid primary key default gen_random_uuid(),
  source_text text not null,
  clarification_status text not null default 'clear' check (clarification_status in ('clear', 'to_confirm'))
);

create table public.requirement_concepts (
  requirement_id uuid not null references public.curriculum_requirements(id) on delete cascade,
  concept_id uuid not null references public.concepts(id) on delete cascade,
  primary key (requirement_id, concept_id)
);

-- ============================================================================
-- Index
-- ============================================================================

create index review_cards_due_idx on public.review_cards (user_id, due_at);
create index attempts_answered_idx on public.attempts (user_id, answered_at);
create index concept_progress_status_idx on public.concept_progress (user_id, status);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.study_sessions enable row level security;
alter table public.session_items enable row level security;
alter table public.attempts enable row level security;
alter table public.review_cards enable row level security;
alter table public.concept_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.issue_reports enable row level security;

revoke all on public.profiles, public.study_sessions, public.session_items,
  public.attempts, public.review_cards, public.concept_progress,
  public.bookmarks, public.issue_reports
  from anon, authenticated;

-- Lecture publique du catalogue et des contenus publiés uniquement ; les brouillons
-- restent réservés aux éditeurs (rôle applicatif séparé, non couvert ici).
grant select on public.categories, public.category_translations,
  public.chapters, public.chapter_translations,
  public.concepts, public.concept_translations, public.chapter_concepts,
  public.concept_prerequisites, public.formulas, public.formula_translations
  to anon, authenticated;

grant select on public.lesson_revisions, public.lesson_translations,
  public.question_revisions, public.question_translations
  to anon, authenticated;
-- Le filtrage status = 'published' se fait via ces policies :

alter table public.lesson_revisions enable row level security;
alter table public.lesson_translations enable row level security;
alter table public.question_revisions enable row level security;
alter table public.question_translations enable row level security;

create policy "Read published lessons" on public.lesson_revisions
  for select to anon, authenticated using (status = 'published');

create policy "Read published lesson translations" on public.lesson_translations
  for select to anon, authenticated using (
    exists (
      select 1 from public.lesson_revisions lr
      where lr.id = lesson_revision_id and lr.status = 'published'
    )
  );

create policy "Read published questions" on public.question_revisions
  for select to anon, authenticated using (status = 'published');

create policy "Read published question translations" on public.question_translations
  for select to anon, authenticated using (
    exists (
      select 1 from public.question_revisions qr
      where qr.id = question_revision_id and qr.status = 'published'
    )
  );

grant select on public.profiles to authenticated;
create policy "Read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Update own profile preferences" on public.profiles
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
-- Le champ locale/timezone/daily_minutes est modifiable par le propriétaire ; aucun rôle n'existe ici.

grant select on public.study_sessions, public.session_items, public.attempts,
  public.review_cards, public.concept_progress, public.bookmarks, public.issue_reports
  to authenticated;

create policy "Read own study sessions" on public.study_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Read own session items" on public.session_items
  for select to authenticated using (
    exists (select 1 from public.study_sessions s where s.id = session_id and s.user_id = (select auth.uid()))
  );
create policy "Read own attempts" on public.attempts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Read own review cards" on public.review_cards
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Read own concept progress" on public.concept_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Read own bookmarks" on public.bookmarks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Manage own bookmarks" on public.bookmarks
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Read own issue reports" on public.issue_reports
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own issue reports" on public.issue_reports
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- Aucune policy d'écriture client sur study_sessions/session_items/attempts/review_cards/
-- concept_progress : seul le rôle serveur (service_role, jamais exposé au navigateur)
-- écrit ces tables, dans une transaction atomique par tentative (voir lib/store.ts pour
-- l'équivalent applicatif du MVP, et section B du document pour le flux détaillé).

-- private.* n'a aucun droit anon/authenticated : uniquement accessible au rôle serveur.
revoke all on all tables in schema private from anon, authenticated;
