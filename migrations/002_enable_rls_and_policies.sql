-- Enable Row Level Security
alter table saas_tools enable row level security;
alter table agencies enable row level security;
alter table founders enable row level security;
alter table founder_stacks enable row level security;
alter table founder_agencies enable row level security;
alter table reviews enable row level security;
alter table payments enable row level security;
alter table featured_listings enable row level security;
alter table listing_analytics enable row level security;

-- Policies for saas_tools
create policy "Anyone can view published saas tools" on saas_tools
  for select using (true);

create policy "Users can create their own saas tool listings" on saas_tools
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own saas tool listings" on saas_tools
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own saas tool listings" on saas_tools
  for delete using (auth.uid() = owner_id);

-- Policies for agencies
create policy "Anyone can view published agencies" on agencies
  for select using (true);

create policy "Users can create their own agency listings" on agencies
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own agency listings" on agencies
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own agency listings" on agencies
  for delete using (auth.uid() = owner_id);

-- Policies for founders
create policy "Anyone can view founder profiles" on founders
  for select using (true);

create policy "Users can create their own founder profile" on founders
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own founder profile" on founders
  for update using (auth.uid() = user_id);

-- Policies for founder_stacks
create policy "Users can view their own stack" on founder_stacks
  for select using (auth.uid() = (select user_id from founders where id = founder_id));

create policy "Users can add to their own stack" on founder_stacks
  for insert with check (auth.uid() = (select user_id from founders where id = founder_id));

create policy "Users can remove from their own stack" on founder_stacks
  for delete using (auth.uid() = (select user_id from founders where id = founder_id));

-- Policies for founder_agencies
create policy "Users can view their own agencies" on founder_agencies
  for select using (auth.uid() = (select user_id from founders where id = founder_id));

create policy "Users can add to their own agencies" on founder_agencies
  for insert with check (auth.uid() = (select user_id from founders where id = founder_id));

create policy "Users can remove from their own agencies" on founder_agencies
  for delete using (auth.uid() = (select user_id from founders where id = founder_id));

-- Policies for reviews
create policy "Anyone can view reviews" on reviews
  for select using (true);

create policy "Verified users can create reviews" on reviews
  for insert with check (auth.uid() = reviewer_id and verified_reviewer = true);

create policy "Users can update their own reviews" on reviews
  for update using (auth.uid() = reviewer_id);

create policy "Users can delete their own reviews" on reviews
  for delete using (auth.uid() = reviewer_id);

-- Policies for payments
create policy "Users can view their own payments" on payments
  for select using (auth.uid() = user_id);

create policy "System can create payments" on payments
  for insert with check (true);

-- Policies for featured_listings
create policy "Anyone can view featured listings" on featured_listings
  for select using (true);

-- Policies for listing_analytics
create policy "Listing owners can view their analytics" on listing_analytics
  for select using (
    (listing_type = 'saas_tool' and listing_id in (select id from saas_tools where owner_id = auth.uid())) or
    (listing_type = 'agency' and listing_id in (select id from agencies where owner_id = auth.uid()))
  );

create policy "System can create analytics events" on listing_analytics
  for insert with check (true);

