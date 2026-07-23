alter table public.websites

add column if not exists activation_state text
default 'WORKSPACE_CREATED',

add column if not exists installation_method text,

add column if not exists installer_email text,

add column if not exists installer_name text,

add column if not exists sdk_installed_at timestamptz,

add column if not exists activated_at timestamptz;