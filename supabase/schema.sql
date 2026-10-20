-- ================================================================
-- FocusFlow Database Schema & Row Level Security (RLS)
-- Run this script in the Supabase SQL Editor (https://supabase.com)
-- ================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table (Automatically synced with Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  avatar_url text,
  calendar_ical_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- 3. Categories Table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  color text default '#f43f5e',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Users can view own categories" 
  on public.categories for select 
  using (auth.uid() = user_id);

create policy "Users can create own categories" 
  on public.categories for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own categories" 
  on public.categories for update 
  using (auth.uid() = user_id);

create policy "Users can delete own categories" 
  on public.categories for delete 
  using (auth.uid() = user_id);

-- 4. Focus Sessions Table
create table if not exists public.focus_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  category_name text not null,
  category_color text default '#f43f5e',
  notes text,
  duration_minutes integer not null,
  is_break boolean default false,
  screenshots text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.focus_sessions enable row level security;

create policy "Users can view own focus sessions" 
  on public.focus_sessions for select 
  using (auth.uid() = user_id);

create policy "Users can insert own focus sessions" 
  on public.focus_sessions for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own focus sessions" 
  on public.focus_sessions for update 
  using (auth.uid() = user_id);

create policy "Users can delete own focus sessions" 
  on public.focus_sessions for delete 
  using (auth.uid() = user_id);

-- 5. Automatic Profile Creation on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Insert default starter categories for the new user
  insert into public.categories (user_id, name, color)
  values 
    (new.id, 'Product understanding', '#e11d48'),
    (new.id, 'Zenuidesign', '#ef4444'),
    (new.id, 'Post Ideation', '#3b82f6'),
    (new.id, 'Deep Coding', '#10b981'),
    (new.id, 'General', '#8b5cf6');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute upon signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Storage Bucket for Screenshots
-- Note: Create a bucket named "screenshots" in Supabase Storage with "Public" access enabled.
-- Policy: Only authenticated users can upload to their own user directory
insert into storage.buckets (id, name, public) 
values ('screenshots', 'screenshots', true)
on conflict (id) do nothing;

create policy "Users can upload screenshots"
  on storage.objects for insert
  with check (bucket_id = 'screenshots' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Public screenshot viewing"
  on storage.objects for select
  using (bucket_id = 'screenshots');
