-- Community Posts
create table community_posts (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid references founders(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Community Comments
create table community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references community_posts(id) on delete cascade not null,
  founder_id uuid references founders(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index idx_community_posts_founder on community_posts(founder_id);
create index idx_community_posts_created on community_posts(created_at desc);
create index idx_community_comments_post on community_comments(post_id);
create index idx_community_comments_founder on community_comments(founder_id);
create index idx_community_comments_created on community_comments(created_at desc);

-- Row Level Security Policies
alter table community_posts enable row level security;
alter table community_comments enable row level security;

-- Allow anyone to read posts
create policy "Anyone can read posts" on community_posts
  for select using (true);

-- Allow founders to create posts
create policy "Founders can create posts" on community_posts
  for insert with check (
    exists (
      select 1 from founders
      where founders.id = community_posts.founder_id
      and founders.user_id = auth.uid()
    )
  );

-- Allow post owners to update their posts
create policy "Post owners can update their posts" on community_posts
  for update using (
    exists (
      select 1 from founders
      where founders.id = community_posts.founder_id
      and founders.user_id = auth.uid()
    )
  );

-- Allow post owners to delete their posts
create policy "Post owners can delete their posts" on community_posts
  for delete using (
    exists (
      select 1 from founders
      where founders.id = community_posts.founder_id
      and founders.user_id = auth.uid()
    )
  );

-- Allow anyone to read comments
create policy "Anyone can read comments" on community_comments
  for select using (true);

-- Allow founders to create comments
create policy "Founders can create comments" on community_comments
  for insert with check (
    exists (
      select 1 from founders
      where founders.id = community_comments.founder_id
      and founders.user_id = auth.uid()
    )
  );

-- Allow comment owners to update their comments
create policy "Comment owners can update their comments" on community_comments
  for update using (
    exists (
      select 1 from founders
      where founders.id = community_comments.founder_id
      and founders.user_id = auth.uid()
    )
  );

-- Allow comment owners to delete their comments
create policy "Comment owners can delete their comments" on community_comments
  for delete using (
    exists (
      select 1 from founders
      where founders.id = community_comments.founder_id
      and founders.user_id = auth.uid()
    )
  );

