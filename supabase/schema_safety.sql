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
