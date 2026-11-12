-- Poveznice – baza podataka (Supabase)
-- Pokretanje: Supabase → SQL Editor → New query → zalijepi cijelu datoteku → Run.
-- Datoteku je sigurno pokrenuti više puta.

-- ============ PROFILI ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  friend_code text not null unique default upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6)),
  subscriber_until timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists profiles_nickname_lower on public.profiles (lower(nickname));

-- Novi korisnik automatski dobiva profil s privremenim nadimkom.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, 'Igrač ' || upper(substr(replace(new.id::text, '-', ''), 1, 5)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ REZULTATI ============
create table if not exists public.results (
  user_id uuid not null references auth.users(id) on delete cascade,
  puzzle_date date not null,
  won boolean not null,
  mistakes smallint not null check (mistakes between 0 and 4),
  guesses jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, puzzle_date)
);

-- ============ PRIJATELJI ============
create table if not exists public.friendships (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

-- ============ PRAVA PRISTUPA (RLS) ============
alter table public.profiles enable row level security;
alter table public.results enable row level security;
alter table public.friendships enable row level security;

drop policy if exists "vlastiti profil" on public.profiles;
create policy "vlastiti profil" on public.profiles for select using (auth.uid() = id);

drop policy if exists "vlastiti rezultati - citanje" on public.results;
create policy "vlastiti rezultati - citanje" on public.results for select using (auth.uid() = user_id);

-- Rezultat se upisuje jednom po danu i ne može biti za budući dan (prema hrvatskom vremenu).
drop policy if exists "vlastiti rezultati - upis" on public.results;
create policy "vlastiti rezultati - upis" on public.results for insert
  with check (auth.uid() = user_id and puzzle_date <= (now() at time zone 'Europe/Zagreb')::date + 1);

drop policy if exists "vlastiti prijatelji - citanje" on public.friendships;
create policy "vlastiti prijatelji - citanje" on public.friendships for select using (auth.uid() = user_id);

drop policy if exists "vlastiti prijatelji - brisanje" on public.friendships;
create policy "vlastiti prijatelji - brisanje" on public.friendships for delete using (auth.uid() = user_id);

-- Pretplatu (subscriber_until) mijenja samo webhook za naplatu, nikad korisnik.

-- ============ FUNKCIJE ============
create or replace function public.set_nickname(p_nick text)
returns text language plpgsql security definer set search_path = public as $$
declare n text := btrim(p_nick);
begin
  if auth.uid() is null then raise exception 'Nisi prijavljen/a.'; end if;
  if length(n) < 3 or length(n) > 20 then raise exception 'Nadimak mora imati 3 do 20 znakova.'; end if;
  if n !~ '^[A-Za-zČĆŽŠĐčćžšđ0-9_. -]+$' then raise exception 'Nadimak smije sadržavati samo slova, brojke, razmak, točku, crticu i podvlaku.'; end if;
  begin
    update public.profiles set nickname = n where id = auth.uid();
  exception when unique_violation then
    raise exception 'Taj nadimak je zauzet.';
  end;
  return n;
end $$;

create or replace function public.add_friend(p_code text)
returns text language plpgsql security definer set search_path = public as $$
declare fid uuid; fnick text;
begin
  if auth.uid() is null then raise exception 'Nisi prijavljen/a.'; end if;
  select id, nickname into fid, fnick from public.profiles where friend_code = upper(btrim(p_code));
  if fid is null then raise exception 'Ne postoji igrač s tim kodom.'; end if;
  if fid = auth.uid() then raise exception 'To je tvoj vlastiti kod.'; end if;
  insert into public.friendships (user_id, friend_id) values (auth.uid(), fid), (fid, auth.uid())
    on conflict do nothing;
  return fnick;
end $$;

create or replace function public.leaderboard(p_date date)
returns table (nickname text, won boolean, mistakes smallint, finished_at timestamptz, is_me boolean, is_friend boolean)
language sql stable security definer set search_path = public as $$
  with r as (
    select p.nickname, r.won, r.mistakes, r.created_at as finished_at,
           r.user_id = auth.uid() as is_me,
           exists (select 1 from public.friendships f where f.user_id = auth.uid() and f.friend_id = r.user_id) as is_friend,
           row_number() over (order by r.won desc, r.mistakes asc, r.created_at asc) as rn
    from public.results r join public.profiles p on p.id = r.user_id
    where r.puzzle_date = p_date
  )
  select nickname, won, mistakes, finished_at, is_me, is_friend
  from r where rn <= 100 or is_me or is_friend
  order by rn;
$$;

revoke all on function public.set_nickname(text) from public, anon;
revoke all on function public.add_friend(text) from public, anon;
revoke all on function public.leaderboard(date) from public, anon;
grant execute on function public.set_nickname(text) to authenticated;
grant execute on function public.add_friend(text) to authenticated;
grant execute on function public.leaderboard(date) to authenticated;
