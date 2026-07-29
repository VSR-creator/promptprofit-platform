alter table websites
add column if not exists installation_status text
default 'NOT_INSTALLED';

alter table websites
add column if not exists installed_at timestamptz;

alter table websites
add column if not exists last_seen_at timestamptz;

alter table websites
add column if not exists total_events integer
default 0;