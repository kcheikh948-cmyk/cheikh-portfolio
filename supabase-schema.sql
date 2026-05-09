-- ============================================
-- Cheikh Kamel Portfolio — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Profile table
create table if not exists profile (
  id integer primary key default 1,
  name text default 'Cheikh Kamel',
  tagline text,
  short_bio text,
  about text,
  country text default 'Algeria',
  experience text default '3+ years',
  education text,
  availability text default 'Available for freelance',
  photo text,
  bytwo_badge boolean default true,
  created_at timestamp with time zone default now()
);

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_desc text,
  problem text,
  solution text,
  category text check (category in ('logos', 'websites', 'designs')),
  tags text[] default '{}',
  main_image text,
  screenshots text[] default '{}',
  live_url text,
  github_url text,
  year text,
  created_at timestamp with time zone default now()
);

-- Skills table
create table if not exists skills (
  id integer primary key default 1,
  design text[] default '{}',
  development text[] default '{}',
  other text[] default '{}'
);

-- Contact table
create table if not exists contact (
  id integer primary key default 1,
  email text,
  whatsapp text,
  facebook text,
  tiktok text
);

-- Storage bucket for portfolio images
-- Run in Supabase Dashboard > Storage > Create bucket
-- Bucket name: portfolio
-- Public: true

-- Row Level Security (RLS) — allow public read, authenticated write
alter table profile enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table contact enable row level security;

create policy "Public read profile" on profile for select using (true);
create policy "Auth write profile" on profile for all using (auth.role() = 'authenticated');

create policy "Public read projects" on projects for select using (true);
create policy "Auth write projects" on projects for all using (auth.role() = 'authenticated');

create policy "Public read skills" on skills for select using (true);
create policy "Auth write skills" on skills for all using (auth.role() = 'authenticated');

create policy "Public read contact" on contact for select using (true);
create policy "Auth write contact" on contact for all using (auth.role() = 'authenticated');

-- Insert default rows
insert into profile (id) values (1) on conflict (id) do nothing;
insert into skills (id) values (1) on conflict (id) do nothing;
insert into contact (id) values (1) on conflict (id) do nothing;
