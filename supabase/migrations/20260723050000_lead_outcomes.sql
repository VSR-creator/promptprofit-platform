create table if not exists public.pp_lead_outcomes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  website_id uuid not null references public.websites(id) on delete cascade,
  lead_id uuid not null unique references public.pp_leads(id) on delete cascade,

  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'won', 'lost')),

  assigned_to text,
  first_contacted_at timestamptz,
  qualified_at timestamptz,
  closed_at timestamptz,

  estimated_value numeric(12,2),
  currency text not null default 'ZAR',
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pp_lead_outcomes_workspace_status_idx
  on public.pp_lead_outcomes (workspace_id, status, created_at desc);

create index if not exists pp_lead_outcomes_website_status_idx
  on public.pp_lead_outcomes (website_id, status, created_at desc);

create or replace function public.set_pp_lead_outcome_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pp_lead_outcomes_updated_at on public.pp_lead_outcomes;

create trigger pp_lead_outcomes_updated_at
before update on public.pp_lead_outcomes
for each row
execute function public.set_pp_lead_outcome_updated_at();