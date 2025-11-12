-- Helper function to generate slug from name
create or replace function generate_slug(name text)
returns text as $$
begin
  return lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));
end;
$$ language plpgsql;

-- Function to calculate Softo Score
create or replace function calculate_softo_score(
  p_listing_type text,
  p_listing_id uuid
)
returns numeric as $$
declare
  v_score numeric := 0;
  v_review_count bigint;
  v_avg_rating numeric;
  v_verified boolean;
  v_featured boolean;
begin
  -- Base score for verification
  if p_listing_type = 'saas_tool' then
    select verified, featured into v_verified, v_featured from saas_tools where id = p_listing_id;
  elsif p_listing_type = 'agency' then
    select verified, featured into v_verified, v_featured from agencies where id = p_listing_id;
  elsif p_listing_type = 'founder' then
    select verified into v_verified from founders where id = p_listing_id;
    v_featured := false;
  end if;
  
  if v_verified then
    v_score := v_score + 20;
  end if;
  
  if v_featured then
    v_score := v_score + 10;
  end if;
  
  -- Score from reviews
  select count(*), avg(rating) into v_review_count, v_avg_rating
  from reviews
  where listing_type = p_listing_type and listing_id = p_listing_id;
  
  if v_review_count > 0 then
    v_score := v_score + (v_review_count * 2); -- 2 points per review
    v_score := v_score + (coalesce(v_avg_rating, 0) * 5); -- 5 points per rating point
  end if;
  
  return least(v_score, 100); -- Cap at 100
end;
$$ language plpgsql security definer;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers to auto-update updated_at
create trigger update_saas_tools_updated_at before update on saas_tools
  for each row execute function update_updated_at_column();

create trigger update_agencies_updated_at before update on agencies
  for each row execute function update_updated_at_column();

create trigger update_founders_updated_at before update on founders
  for each row execute function update_updated_at_column();

create trigger update_reviews_updated_at before update on reviews
  for each row execute function update_updated_at_column();

