alter table public.pp_lead_outcomes
  add column if not exists next_action text,
  add column if not exists next_action_at timestamptz;

create index if not exists pp_lead_outcomes_next_action_idx
  on public.pp_lead_outcomes (workspace_id, next_action_at)
  where next_action_at is not null;
