-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  first_name text,
  last_name text,
  phone text,
  emergency_contact text,
  pb_5k text,
  pb_10k text,
  pb_half text,
  pb_full text,
  created_at timestamptz default now()
);

-- Clubs
create table clubs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  location text,
  created_by uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  logo_url text,
  invite_token text unique default encode(gen_random_bytes(16), 'hex')
);

-- Club members
create table club_members (
  id uuid primary key default uuid_generate_v4(),
  club_id uuid references clubs(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'member' check (role in ('organiser', 'member')),
  joined_at timestamptz default now(),
  status text not null default 'active' check (status in ('active', 'inactive')),
  unique(club_id, user_id)
);

-- Runs
create table runs (
  id uuid primary key default uuid_generate_v4(),
  club_id uuid references clubs(id) on delete cascade not null,
  title text not null,
  date date not null,
  time time not null,
  meeting_point text not null,
  distance_km numeric(5,2),
  route_url text,
  notes text,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled', 'completed')),
  created_by uuid references auth.users(id) not null,
  created_at timestamptz default now()
);

-- Pace groups
create table pace_groups (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references runs(id) on delete cascade not null,
  label text not null,
  min_pace text,
  max_pace text,
  leader_name text
);

-- RSVPs
create table rsvps (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references runs(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  pace_group_id uuid references pace_groups(id) on delete set null,
  status text not null default 'going' check (status in ('going', 'not_going', 'maybe')),
  created_at timestamptz default now(),
  unique(run_id, user_id)
);

-- Attendance
create table attendance (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references runs(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  confirmed_at timestamptz default now(),
  unique(run_id, user_id)
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  club_id uuid references clubs(id) on delete cascade not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'free' check (plan in ('free', 'club')),
  status text not null default 'active',
  created_at timestamptz default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table clubs enable row level security;
alter table club_members enable row level security;
alter table runs enable row level security;
alter table pace_groups enable row level security;
alter table rsvps enable row level security;
alter table attendance enable row level security;
alter table subscriptions enable row level security;

-- Profiles: users can read/write their own
create policy "profiles_own" on profiles for all using (auth.uid() = user_id);

-- Clubs: members can read their clubs
create policy "clubs_member_read" on clubs for select using (
  exists (select 1 from club_members where club_id = clubs.id and user_id = auth.uid() and status = 'active')
);
create policy "clubs_organiser_write" on clubs for all using (created_by = auth.uid());
create policy "clubs_insert" on clubs for insert with check (created_by = auth.uid());

-- Club members: organisers can manage, members can read own club
create policy "club_members_read" on club_members for select using (
  user_id = auth.uid() or
  exists (select 1 from club_members cm where cm.club_id = club_members.club_id and cm.user_id = auth.uid() and cm.role = 'organiser')
);
create policy "club_members_insert" on club_members for insert with check (user_id = auth.uid());
create policy "club_members_organiser_update" on club_members for update using (
  exists (select 1 from club_members cm where cm.club_id = club_members.club_id and cm.user_id = auth.uid() and cm.role = 'organiser')
);

-- Runs: club members can read, organisers can write
create policy "runs_member_read" on runs for select using (
  exists (select 1 from club_members where club_id = runs.club_id and user_id = auth.uid() and status = 'active')
);
create policy "runs_organiser_write" on runs for all using (
  exists (select 1 from club_members where club_id = runs.club_id and user_id = auth.uid() and role = 'organiser')
);

-- Pace groups: visible to club members
create policy "pace_groups_read" on pace_groups for select using (
  exists (
    select 1 from runs r
    join club_members cm on cm.club_id = r.club_id
    where r.id = pace_groups.run_id and cm.user_id = auth.uid() and cm.status = 'active'
  )
);
create policy "pace_groups_organiser_write" on pace_groups for all using (
  exists (
    select 1 from runs r
    join club_members cm on cm.club_id = r.club_id
    where r.id = pace_groups.run_id and cm.user_id = auth.uid() and cm.role = 'organiser'
  )
);

-- RSVPs
create policy "rsvps_read" on rsvps for select using (
  exists (
    select 1 from runs r
    join club_members cm on cm.club_id = r.club_id
    where r.id = rsvps.run_id and cm.user_id = auth.uid() and cm.status = 'active'
  )
);
create policy "rsvps_own_write" on rsvps for all using (user_id = auth.uid());
create policy "rsvps_insert" on rsvps for insert with check (user_id = auth.uid());

-- Attendance
create policy "attendance_read" on attendance for select using (
  exists (
    select 1 from runs r
    join club_members cm on cm.club_id = r.club_id
    where r.id = attendance.run_id and cm.user_id = auth.uid() and cm.status = 'active'
  )
);
create policy "attendance_organiser_write" on attendance for all using (
  exists (
    select 1 from runs r
    join club_members cm on cm.club_id = r.club_id
    where r.id = attendance.run_id and cm.user_id = auth.uid() and cm.role = 'organiser'
  )
);

-- Subscriptions: organiser can read their club subscription
create policy "subscriptions_read" on subscriptions for select using (
  exists (select 1 from club_members where club_id = subscriptions.club_id and user_id = auth.uid() and role = 'organiser')
);

-- Function to auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Safety check-ins
create table if not exists safety_checkins (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references runs(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  confirmed_at timestamptz default now(),
  unique(run_id, user_id)
);

alter table safety_checkins enable row level security;

create policy "safety_member_own" on safety_checkins for all using (user_id = auth.uid());
create policy "safety_organiser_read" on safety_checkins for select using (
  exists (
    select 1 from runs r
    join club_members cm on cm.club_id = r.club_id
    where r.id = safety_checkins.run_id and cm.user_id = auth.uid() and cm.role = 'organiser'
  )
);
