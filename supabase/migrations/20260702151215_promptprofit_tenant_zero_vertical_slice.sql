-- PromptProfit Tenant Zero: commercial foundation + behavioral vertical slice
-- This migration is designed for hosted Supabase and remote-first deployment.

create extension if not exists pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

do $$
begin
  create type public.subscription_status as enum (
    'trialing',
    'active',
    'past_due',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.subscription_plan as enum (
    'free',
    'growth',
    'scale'
  );
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- IDENTITY + MULTI-TENANCY
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.workspaces(id) on delete cascade,
  plan public.subscription_plan not null default 'free',
  status public.subscription_status not null default 'trialing',
  billing_provider text,
  provider_subscription_id text unique,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  domain text not null,
  public_key text not null unique default replace(gen_random_uuid()::text, '-', ''),
  is_active boolean not null default true,
  first_event_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workspace_id, domain)
);

-- ============================================================
-- BEHAVIORAL INTELLIGENCE VERTICAL SLICE
-- ============================================================

create table if not exists public.pp_sessions (
  id uuid primary key,
  website_id uuid not null references public.websites(id) on delete cascade,
  visitor_id uuid not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  event_count integer not null default 0,
  page_count integer not null default 0,
  intent_score integer not null default 0,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.pp_events (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  session_id uuid not null references public.pp_sessions(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'page_view',
      'scroll',
      'click',
      'exit_intent',
      'flow_shown',
      'flow_dismissed',
      'lead_submitted'
    )
  ),
  event_data jsonb not null default '{}'::jsonb,
  client_timestamp timestamptz,
  received_at timestamptz not null default now()
);

create table if not exists public.pp_decisions (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  session_id uuid not null references public.pp_sessions(id) on delete cascade,
  decision_type text not null,
  flow_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.pp_leads (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  session_id uuid not null references public.pp_sessions(id) on delete cascade,
  email text not null,
  source_page text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (website_id, session_id, email)
);

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================

create index if not exists websites_workspace_id_idx
  on public.websites(workspace_id);

create index if not exists workspace_members_user_id_idx
  on public.workspace_members(user_id);

create index if not exists pp_sessions_website_last_seen_idx
  on public.pp_sessions(website_id, last_seen_at desc);

create index if not exists pp_events_session_received_idx
  on public.pp_events(session_id, received_at desc);

create index if not exists pp_events_website_received_idx
  on public.pp_events(website_id, received_at desc);

create index if not exists pp_leads_website_created_idx
  on public.pp_leads(website_id, created_at desc);

create unique index if not exists pp_decisions_one_flow_per_session_idx
  on public.pp_decisions(session_id, flow_id)
  where flow_id is not null;

-- ============================================================
-- AUTH PROFILE CREATION
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- Browser SDK traffic never talks directly to Supabase.
-- Trusted Next.js API routes use the service role for ingestion.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.websites enable row level security;
alter table public.pp_sessions enable row level security;
alter table public.pp_events enable row level security;
alter table public.pp_decisions enable row level security;
alter table public.pp_leads enable row level security;

create policy "users_can_read_own_profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "members_can_read_workspaces"
on public.workspaces
for select
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = workspaces.id
      and wm.user_id = auth.uid()
  )
);

create policy "members_can_read_workspace_members"
on public.workspace_members
for select
using (
  exists (
    select 1
    from public.workspace_members viewer
    where viewer.workspace_id = workspace_members.workspace_id
      and viewer.user_id = auth.uid()
  )
);

create policy "members_can_read_subscriptions"
on public.subscriptions
for select
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = subscriptions.workspace_id
      and wm.user_id = auth.uid()
  )
);

create policy "members_can_read_websites"
on public.websites
for select
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = websites.workspace_id
      and wm.user_id = auth.uid()
  )
);

create policy "members_can_read_sessions"
on public.pp_sessions
for select
using (
  exists (
    select 1
    from public.websites website
    join public.workspace_members wm
      on wm.workspace_id = website.workspace_id
    where website.id = pp_sessions.website_id
      and wm.user_id = auth.uid()
  )
);

create policy "members_can_read_events"
on public.pp_events
for select
using (
  exists (
    select 1
    from public.websites website
    join public.workspace_members wm
      on wm.workspace_id = website.workspace_id
    where website.id = pp_events.website_id
      and wm.user_id = auth.uid()
  )
);

create policy "members_can_read_decisions"
on public.pp_decisions
for select
using (
  exists (
    select 1
    from public.websites website
    join public.workspace_members wm
      on wm.workspace_id = website.workspace_id
    where website.id = pp_decisions.website_id
      and wm.user_id = auth.uid()
  )
);

create policy "members_can_read_leads"
on public.pp_leads
for select
using (
  exists (
    select 1
    from public.websites website
    join public.workspace_members wm
      on wm.workspace_id = website.workspace_id
    where website.id = pp_leads.website_id
      and wm.user_id = auth.uid()
  )
);

