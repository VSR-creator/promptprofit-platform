-- ============================================================
-- PromptProfit Cloud Alpha
-- Installation Persistence
-- ============================================================

create table if not exists public.pp_installations (

    id uuid primary key default gen_random_uuid(),

    workspace_id uuid not null
        references public.workspaces(id)
        on delete cascade,

    website_id uuid not null
        references public.websites(id)
        on delete cascade,

    installation_method text not null,

    installer_name text,

    installer_email text,

    sdk_installed boolean not null default false,

    sdk_verified boolean not null default false,

    first_event_received boolean not null default false,

    installation_completed boolean not null default false,

    installed_at timestamptz,

    verified_at timestamptz,

    first_event_at timestamptz,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    constraint pp_installations_method_check
        check (
            installation_method in (
                'self',
                'agency',
                'developer',
                'hosting',
                'other'
            )
        ),

    constraint pp_installations_unique_website
        unique (website_id)

);

create index if not exists
pp_installations_workspace_idx
on public.pp_installations(workspace_id);

create index if not exists
pp_installations_website_idx
on public.pp_installations(website_id);