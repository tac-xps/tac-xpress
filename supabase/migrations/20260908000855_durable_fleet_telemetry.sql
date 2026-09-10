create table if not exists public.fleet_telemetry (
  vehicle_id uuid primary key references public.vehicles(id) on delete cascade,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  heading double precision not null check (heading >= 0 and heading < 360),
  speed double precision not null check (speed between 0 and 400),
  observed_at timestamptz not null,
  received_at timestamptz not null default now()
);
create index if not exists fleet_telemetry_observed_at_idx on public.fleet_telemetry (observed_at desc);
alter table public.fleet_telemetry enable row level security;
revoke all on public.fleet_telemetry from public, anon, authenticated;
grant all on public.fleet_telemetry to service_role;
