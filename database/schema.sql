create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  phone_number text not null check (phone_number ~ '^[6-9][0-9]{9}$'),
  shop_type text not null,
  city_town text not null,
  privacy_consent boolean not null default true,
  consent_recorded_at timestamptz not null default now(),
  source_path text,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_city_town_idx on public.leads (city_town);
create index if not exists leads_shop_type_idx on public.leads (shop_type);

alter table public.leads enable row level security;

comment on table public.leads is 'Lead enquiries from DSE Consultancy website forms.';
comment on column public.leads.privacy_consent is 'True when the visitor agreed to be contacted and have their details stored.';
