-- Update founders table structure
-- Remove startup_name and startup_website
-- Add founder_name, pfp (profile picture URL), and social_links (JSONB)

alter table founders
  drop column if exists startup_name,
  drop column if exists startup_website;

alter table founders
  add column if not exists founder_name text,
  add column if not exists pfp text, -- profile picture URL
  add column if not exists social_links jsonb; -- e.g., {"twitter": "https://twitter.com/...", "linkedin": "https://linkedin.com/..."}

-- Bio column already exists, so we don't need to add it

