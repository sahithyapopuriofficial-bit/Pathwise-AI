-- Run this migration in Supabase before using the feature. It is safe on a new project.
create table if not exists public.job_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  job_title text not null,
  employment_type text not null,
  work_mode text not null,
  location text not null,
  match_score integer not null check (match_score between 0 and 100),
  required_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  job_description text not null,
  apply_url text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists job_recommendations_user_match_score_idx
  on public.job_recommendations (user_id, match_score desc);

alter table public.job_recommendations enable row level security;

drop policy if exists "Users can read their job recommendations" on public.job_recommendations;
drop policy if exists "Users can insert their job recommendations" on public.job_recommendations;
drop policy if exists "Users can delete their job recommendations" on public.job_recommendations;

create policy "Users can read their job recommendations" on public.job_recommendations
  for select using (auth.uid() = user_id);
create policy "Users can insert their job recommendations" on public.job_recommendations
  for insert with check (auth.uid() = user_id);
create policy "Users can delete their job recommendations" on public.job_recommendations
  for delete using (auth.uid() = user_id);
