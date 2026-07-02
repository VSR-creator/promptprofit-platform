

-- PromptProfit Tenant Zero bootstrap
-- Replace YOUR_AUTH_USER_UUID before running this migration.
insert into public.profiles (id, full_name)
values ('b85b8b47-fefc-41c3-9567-545e441f98c8', 'PromptProfit Founder')
on conflict (id) do update
set full_name = excluded.full_name;
with workspace_upsert as (
insert into public.workspaces (name, slug, created_by)
values (
'PromptProfit',
'promptprofit',
'b85b8b47-fefc-41c3-9567-545e441f98c8'
)
on conflict (slug) do update
set
name = excluded.name,
created_by = excluded.created_by
returning id
),
workspace_id as (
select id from workspace_upsert
union all
select id
from public.workspaces
where slug = 'promptprofit'
limit 1
)
insert into public.workspace_members (workspace_id, user_id, role)
select id, 'b85b8b47-fefc-41c3-9567-545e441f98c8', 'owner'
from workspace_id
on conflict (workspace_id, user_id) do update
set role = 'owner';
with workspace_id as (
select id
from public.workspaces
where slug = 'promptprofit'
)
insert into public.subscriptions (workspace_id, plan, status)
select id, 'growth', 'trialing'
from workspace_id
on conflict (workspace_id) do update
set
plan = excluded.plan,
status = excluded.status;
with workspace_id as (
select id
from public.workspaces
where slug = 'promptprofit'
)
insert into public.websites (workspace_id, name, domain)
select
id,
'PromptProfit Marketing Site',
'promptprofit.co.za'
from workspace_id
on conflict (workspace_id, domain) do update
set
name = excluded.name,
is_active = true;

