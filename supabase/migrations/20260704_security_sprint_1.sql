begin;

-- ---------------------------------------------------------------------------
-- 1. Reusable workspace authorization helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.can_operate_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.role in ('owner', 'admin', 'operator')
  );
$$;

revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.can_operate_workspace(uuid) from public;

grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.can_operate_workspace(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Enable RLS on identity and tenancy tables
-- ---------------------------------------------------------------------------

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.profiles enable row level security;
alter table public.pp_lead_outcomes enable row level security;

-- ---------------------------------------------------------------------------
-- 3. Workspace, membership, and profile policies
-- ---------------------------------------------------------------------------

drop policy if exists "workspace members can read their workspace" on public.workspaces;
create policy "workspace members can read their workspace"
on public.workspaces
for select
to authenticated
using (public.is_workspace_member(id));

drop policy if exists "users can read memberships in their workspaces" on public.workspace_members;
create policy "users can read memberships in their workspaces"
on public.workspace_members
for select
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists "users can read their own profile" on public.profiles;
create policy "users can read their own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 4. Lead-outcome policies
-- ---------------------------------------------------------------------------

drop policy if exists "workspace members can read lead outcomes" on public.pp_lead_outcomes;
create policy "workspace members can read lead outcomes"
on public.pp_lead_outcomes
for select
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists "workspace operators can update lead outcomes" on public.pp_lead_outcomes;
create policy "workspace operators can update lead outcomes"
on public.pp_lead_outcomes
for update
to authenticated
using (public.can_operate_workspace(workspace_id))
with check (public.can_operate_workspace(workspace_id));

commit;