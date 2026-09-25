create extension if not exists pgcrypto;

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique check (room_code ~ '^[A-Z0-9]{6}$'),
  status text not null default 'waiting' check (status in ('waiting','active','finished')),
  active_experiment text check (active_experiment is null or active_experiment in ('simulation','replace-world','evidence-chain','brain-vat','ai-consciousness','teleporter','replace-yourself')),
  results_revealed boolean not null default false,
  discussion_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '8 hours'
);

create table if not exists public.class_host_secrets (
  session_id uuid primary key references public.class_sessions(id) on delete cascade,
  token_hash text not null
);

create table if not exists public.class_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on delete cascade,
  token_hash text not null,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.class_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on delete cascade,
  participant_id uuid not null references public.class_participants(id) on delete cascade,
  experiment_id text not null check (experiment_id in ('simulation','replace-world','evidence-chain','brain-vat','ai-consciousness','teleporter','replace-yourself')),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 20000),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, participant_id, experiment_id)
);

alter table public.class_sessions enable row level security;
alter table public.class_host_secrets enable row level security;
alter table public.class_participants enable row level security;
alter table public.class_responses enable row level security;

revoke all on public.class_host_secrets, public.class_participants, public.class_responses from anon, authenticated;
grant select on public.class_sessions to anon, authenticated;
create policy "active class sessions are readable" on public.class_sessions for select to anon, authenticated using (expires_at > now());

create or replace function public.make_room_code() returns text language sql volatile as $$
  select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1), '') from generate_series(1, 6);
$$;

create or replace function public.create_class_session()
returns table(session_id uuid, room_code text, host_token text) language plpgsql security definer set search_path = public as $$
declare new_session public.class_sessions; raw_token text := gen_random_uuid()::text; candidate text;
begin
  loop candidate := public.make_room_code(); exit when not exists(select 1 from public.class_sessions s where s.room_code=candidate); end loop;
  insert into public.class_sessions(room_code) values(candidate) returning * into new_session;
  insert into public.class_host_secrets(session_id,token_hash) values(new_session.id,encode(digest(raw_token,'sha256'),'hex'));
  return query select new_session.id,new_session.room_code,raw_token;
end $$;

create or replace function public.join_class_session(p_room_code text)
returns table(session_id uuid, participant_id uuid, participant_token text) language plpgsql security definer set search_path = public as $$
declare target uuid; participant uuid:=gen_random_uuid(); raw_token text:=gen_random_uuid()::text;
begin
  select id into target from public.class_sessions where room_code=upper(p_room_code) and status<>'finished' and expires_at>now();
  if target is null then raise exception 'ROOM_UNAVAILABLE'; end if;
  insert into public.class_participants(id,session_id,token_hash) values(participant,target,encode(digest(raw_token,'sha256'),'hex'));
  return query select target,participant,raw_token;
end $$;

create or replace function public.update_class_session(p_session_id uuid,p_host_token text,p_status text,p_active_experiment text,p_results_revealed boolean,p_discussion_visible boolean)
returns public.class_sessions language plpgsql security definer set search_path = public as $$
declare result public.class_sessions;
begin
  if not exists(select 1 from public.class_host_secrets where session_id=p_session_id and token_hash=encode(digest(p_host_token,'sha256'),'hex')) then raise exception 'HOST_AUTH_FAILED'; end if;
  update public.class_sessions set status=p_status,active_experiment=p_active_experiment,results_revealed=p_results_revealed,discussion_visible=p_discussion_visible,updated_at=now() where id=p_session_id returning * into result;
  return result;
end $$;

create or replace function public.submit_class_response(p_session_id uuid,p_participant_id uuid,p_participant_token text,p_experiment_id text,p_payload jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists(select 1 from public.class_participants where id=p_participant_id and session_id=p_session_id and token_hash=encode(digest(p_participant_token,'sha256'),'hex')) then raise exception 'PARTICIPANT_AUTH_FAILED'; end if;
  insert into public.class_responses(session_id,participant_id,experiment_id,payload) values(p_session_id,p_participant_id,p_experiment_id,p_payload)
  on conflict(session_id,participant_id,experiment_id) do update set payload=excluded.payload,updated_at=now();
  update public.class_participants set last_seen_at=now() where id=p_participant_id;
end $$;

create or replace function public.get_host_snapshot(p_session_id uuid,p_host_token text)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
 if not exists(select 1 from public.class_host_secrets where session_id=p_session_id and token_hash=encode(digest(p_host_token,'sha256'),'hex')) then raise exception 'HOST_AUTH_FAILED'; end if;
 return jsonb_build_object('participantCount',(select count(*) from public.class_participants where session_id=p_session_id),'responses',(select coalesce(jsonb_agg(jsonb_build_object('experimentId',experiment_id,'payload',payload)),'[]'::jsonb) from public.class_responses where session_id=p_session_id));
end $$;

grant execute on function public.create_class_session() to anon, authenticated;
grant execute on function public.join_class_session(text) to anon, authenticated;
grant execute on function public.update_class_session(uuid,text,text,text,boolean,boolean) to anon, authenticated;
grant execute on function public.submit_class_response(uuid,uuid,text,text,jsonb) to anon, authenticated;
grant execute on function public.get_host_snapshot(uuid,text) to anon, authenticated;

alter publication supabase_realtime add table public.class_sessions;
