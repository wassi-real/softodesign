-- SaaS Tools Directory
create table saas_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category text, -- Marketing, Finance, Design, Development, etc.
  logo_url text,
  website_url text,
  pricing_tier text, -- Free, Freemium, Paid, Enterprise
  pricing_url text,
  tags text[], -- Array of tags
  integration_badges text[], -- e.g., ["Stripe", "Notion", "Zapier"]
  screenshots text[], -- Array of screenshot URLs
  verified boolean default false,
  featured boolean default false,
  softo_score numeric default 0, -- Combination of engagement, reviews, verification
  owner_id uuid references auth.users(id), -- Who submitted/owns this listing
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Agency & Service Directory
create table agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  service_type text, -- Design, Marketing, Dev, SEO, Branding, etc.
  logo_url text,
  website_url text,
  portfolio_url text,
  location text,
  pricing_tiers jsonb, -- JSON object with pricing tiers
  verified boolean default false,
  featured boolean default false,
  softo_score numeric default 0,
  owner_id uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Founder Directory
create table founders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) unique not null,
  founder_name text,
  pfp text, -- profile picture URL
  bio text,
  social_links jsonb, -- e.g., {"twitter": "https://twitter.com/...", "linkedin": "https://linkedin.com/...", "github": "https://github.com/...", "website": "https://..."}
  tools_used uuid[] default array[]::uuid[], -- Array of saas_tools.id (deprecated, use founder_stacks instead)
  agencies_hired uuid[] default array[]::uuid[], -- Array of agencies.id (deprecated, use founder_agencies instead)
  verified boolean default false,
  softo_score numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Founder's Stack (tools they use)
create table founder_stacks (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid references founders(id) on delete cascade,
  tool_id uuid references saas_tools(id) on delete cascade,
  added_at timestamptz default now(),
  unique(founder_id, tool_id)
);

-- Founder's Agencies (agencies they've hired)
create table founder_agencies (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid references founders(id) on delete cascade,
  agency_id uuid references agencies(id) on delete cascade,
  hired_at timestamptz default now(),
  unique(founder_id, agency_id)
);

-- Reviews & Ratings
create table reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references auth.users(id) not null,
  listing_type text not null, -- 'saas_tool', 'agency', or 'founder'
  listing_id uuid not null, -- ID of the tool/agency/founder being reviewed
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  verified_reviewer boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Stripe Payments & Subscriptions
create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  stripe_payment_id text unique,
  payment_type text not null, -- 'verification', 'featured', 'lead', 'subscription'
  listing_type text, -- 'saas_tool', 'agency', 'founder'
  listing_id uuid,
  amount numeric not null,
  currency text default 'usd',
  status text default 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  metadata jsonb, -- Additional payment metadata
  created_at timestamptz default now()
);

-- Featured Listings (subscriptions)
create table featured_listings (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null, -- 'saas_tool', 'agency'
  listing_id uuid not null,
  stripe_subscription_id text,
  start_date timestamptz default now(),
  end_date timestamptz,
  active boolean default true,
  created_at timestamptz default now()
);

-- Analytics (for Pro tier)
create table listing_analytics (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null,
  listing_id uuid not null,
  event_type text not null, -- 'view', 'search', 'click', 'contact'
  user_id uuid references auth.users(id),
  metadata jsonb,
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_saas_tools_category on saas_tools(category);
create index idx_saas_tools_verified on saas_tools(verified);
create index idx_saas_tools_featured on saas_tools(featured);
create index idx_agencies_service_type on agencies(service_type);
create index idx_agencies_verified on agencies(verified);
create index idx_agencies_featured on agencies(featured);
create index idx_founders_user_id on founders(user_id);
create index idx_reviews_listing on reviews(listing_type, listing_id);
create index idx_payments_user on payments(user_id);
create index idx_analytics_listing on listing_analytics(listing_type, listing_id);

