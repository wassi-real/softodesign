-- URL Shortener Tables
create table url_shortener (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  original_url text not null,
  short_code text unique not null,
  custom_alias text unique, -- Optional custom alias
  title text, -- Optional title for the link
  description text, -- Optional description
  click_count integer default 0,
  is_active boolean default true,
  expires_at timestamptz, -- Optional expiration date
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- URL Click Analytics
create table url_clicks (
  id uuid primary key default gen_random_uuid(),
  url_id uuid references url_shortener(id) on delete cascade not null,
  ip_address text,
  user_agent text,
  referer text,
  country text,
  city text,
  device_type text, -- mobile, desktop, tablet
  browser text,
  os text,
  clicked_at timestamptz default now()
);

-- Indexes for performance
create index idx_url_shortener_short_code on url_shortener(short_code);
create index idx_url_shortener_user_id on url_shortener(user_id);
create index idx_url_shortener_custom_alias on url_shortener(custom_alias);
create index idx_url_clicks_url_id on url_clicks(url_id);
create index idx_url_clicks_clicked_at on url_clicks(clicked_at);

-- Enable Row Level Security
alter table url_shortener enable row level security;
alter table url_clicks enable row level security;

-- RLS Policies for url_shortener
create policy "Users can view their own shortened URLs"
  on url_shortener for select
  using (auth.uid() = user_id);

create policy "Users can insert their own shortened URLs"
  on url_shortener for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own shortened URLs"
  on url_shortener for update
  using (auth.uid() = user_id);

create policy "Users can delete their own shortened URLs"
  on url_shortener for delete
  using (auth.uid() = user_id);

-- Public read access for active URLs (for redirects)
create policy "Public can view active shortened URLs"
  on url_shortener for select
  using (is_active = true);

-- RLS Policies for url_clicks
create policy "Users can view clicks for their URLs"
  on url_clicks for select
  using (
    exists (
      select 1 from url_shortener
      where url_shortener.id = url_clicks.url_id
      and url_shortener.user_id = auth.uid()
    )
  );

create policy "Anyone can insert clicks (for analytics)"
  on url_clicks for insert
  with check (true);

-- Function to generate random short code
create or replace function generate_short_code(length integer default 6)
returns text as $$
declare
  chars text := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
begin
  for i in 1..length loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  
  -- Check if code already exists
  while exists (select 1 from url_shortener where short_code = result) loop
    result := '';
    for i in 1..length loop
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    end loop;
  end loop;
  
  return result;
end;
$$ language plpgsql;

-- Function to update click count
create or replace function update_click_count()
returns trigger as $$
begin
  update url_shortener
  set click_count = click_count + 1,
      updated_at = now()
  where id = new.url_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to update click count on insert
create trigger update_url_click_count
  after insert on url_clicks
  for each row
  execute function update_click_count();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for url_shortener updated_at
create trigger update_url_shortener_updated_at
  before update on url_shortener
  for each row
  execute function update_updated_at_column();

