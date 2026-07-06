-- PromptProfit multi-tenant dashboard foundation.
-- Every operational record is scoped through workspace -> website.

create table if not exists workspace_outcome_playbooks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references workspaces(id) on delete cascade,

  primary_outcome text not null default 'lead_captured',
  response_target_seconds integer not null default 900,
  value_model text not null default 'pipeline_value',
  default_lead_value numeric(12,2),

  lead_stages jsonb not null default
    '["new","contacted","qualified","won","lost"]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint workspace_outcome_playbooks_primary_outcome_check
    check (primary_outcome in ('lead_captured', 'meeting_booked', 'sale_closed')),

  constraint workspace_outcome_playbooks_value_model_check
    check (value_model in ('manual', 'fixed_lead_value', 'pipeline_value')),

  constraint workspace_outcome_playbooks_response_target_check
    check (response_target_seconds > 0)
);

alter table pp_leads
  add column if not exists status text not null default 'new',
  add column if not exists first_contacted_at timestamptz,
  add column if not exists qualified_at timestamptz,
  add column if not exists won_at timestamptz,
  add column if not exists lost_at timestamptz,
  add column if not exists estimated_value numeric(12,2),
  add column if not exists assigned_to uuid,
  add column if not exists updated_at timestamptz not null default now();

alter table pp_leads
  drop constraint if exists pp_leads_status_check;

alter table pp_leads
  add constraint pp_leads_status_check
  check (status in ('new', 'contacted', 'qualified', 'won', 'lost'));

create index if not exists pp_leads_website_status_created_at_idx
  on pp_leads (website_id, status, created_at desc);

create index if not exists pp_leads_website_first_contacted_at_idx
  on pp_leads (website_id, first_contacted_at);

insert into workspace_outcome_playbooks (
  workspace_id,
  outcome_type,
  response_target_seconds,
  value_model,
  lead_stages
)
select
  id,
  case
    when name = 'PromptProfit' then 'meeting_booked'
    when name = 'VSR Technology' then 'lead_captured'
    else 'lead_captured'
  end,
  case
    when name = 'PromptProfit' then 900
    when name = 'VSR Technology' then 120
    else 900
  end,
  'pipeline_value',
  '["new","contacted","qualified","won","lost"]'::jsonb
from workspaces
where name in ('PromptProfit', 'VSR Technology')
on conflict (workspace_id) do update
set
  primary_outcome = excluded.primary_outcome,
  response_target_seconds = excluded.response_target_seconds,
  value_model = excluded.value_model,
  lead_stages = excluded.lead_stages,
  updated_at = now();