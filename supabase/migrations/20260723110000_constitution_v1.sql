-- PromptProfit Database Constitution v1
-- Replace legacy workspace_outcome_playbooks with canonical schema.

drop table if exists public.workspace_outcome_playbooks cascade;

create table public.workspace_outcome_playbooks (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null unique
    references public.workspaces(id)
    on delete cascade,

  primary_outcome text not null default 'lead_captured',

  response_target_seconds integer not null default 900,

  value_model text not null default 'pipeline_value',

  default_lead_value numeric(12,2),

  lead_stages jsonb not null default
    '["new","contacted","qualified","won","lost"]'::jsonb,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint workspace_outcome_playbooks_primary_outcome_check
    check (
      primary_outcome in (
        'lead_captured',
        'meeting_booked',
        'sale_closed'
      )
    ),

  constraint workspace_outcome_playbooks_value_model_check
    check (
      value_model in (
        'manual',
        'fixed_lead_value',
        'pipeline_value'
      )
    ),

  constraint workspace_outcome_playbooks_response_target_check
    check (response_target_seconds > 0)
);

create index if not exists
workspace_outcome_playbooks_workspace_idx
on public.workspace_outcome_playbooks(workspace_id);