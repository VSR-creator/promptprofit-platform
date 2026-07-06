create table if not exists public.launch_diagnostics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  business_type text not null,
  website_or_instagram text not null,
  main_offer text not null,
  desired_action text not null,
  biggest_issue text not null,
  email text not null,
  source text not null default 'launch_site',
  campaign text not null default 'instagram_launch',
  entry_point text not null default 'free_diagnostic',
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists launch_diagnostics_created_at_idx
  on public.launch_diagnostics (created_at desc);

create index if not exists launch_diagnostics_email_idx
  on public.launch_diagnostics (email);
