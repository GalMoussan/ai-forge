-- AI-Forge Initial Schema
-- Migration: 20260227000001_initial_schema

-- ========================================
-- PROFILES (extends auth.users)
-- ========================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- IDEAS (The Foundry items)
-- ========================================
CREATE TYPE idea_status AS ENUM ('active', 'threshold_reached', 'building', 'launched');
CREATE TYPE idea_category AS ENUM ('automation', 'creativity', 'productivity', 'analysis', 'other');

CREATE TABLE ideas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT now(),
  title           TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 100),
  description     TEXT NOT NULL CHECK (char_length(description) BETWEEN 20 AND 1000),
  submitter_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category        idea_category NOT NULL DEFAULT 'other',
  status          idea_status DEFAULT 'active',
  vote_count      INT DEFAULT 0 CHECK (vote_count >= 0),
  backer_count    INT DEFAULT 0 CHECK (backer_count >= 0),
  vote_threshold  INT DEFAULT 500,
  funding_goal    INT,                    -- cents, Phase 2 only
  funding_raised  INT DEFAULT 0,          -- cents
  tags            TEXT[] DEFAULT '{}',
  image_url       TEXT
);

-- Index for sorting by votes (primary sort in Foundry)
CREATE INDEX ideas_vote_count_idx ON ideas(vote_count DESC);
CREATE INDEX ideas_status_idx ON ideas(status);
CREATE INDEX ideas_created_at_idx ON ideas(created_at DESC);

-- ========================================
-- SUPPORTS (votes + Phase 2 pledges)
-- ========================================
CREATE TYPE support_type AS ENUM ('vote', 'pledge');

CREATE TABLE supports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT now(),
  idea_id     UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        support_type DEFAULT 'vote',
  amount      INT,                        -- cents, NULL for votes
  UNIQUE (idea_id, user_id)               -- one support per user per idea
);

CREATE INDEX supports_idea_id_idx ON supports(idea_id);
CREATE INDEX supports_user_id_idx ON supports(user_id);

-- ========================================
-- COMMENTS (threaded discussion)
-- ========================================
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT now(),
  idea_id     UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE
);

CREATE INDEX comments_idea_id_idx ON comments(idea_id);
CREATE INDEX comments_parent_id_idx ON comments(parent_id);

-- ========================================
-- TRIGGERS: Denormalized vote_count
-- ========================================
CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ideas SET vote_count = vote_count + 1 WHERE id = NEW.idea_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ideas SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.idea_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_inserted
  AFTER INSERT ON supports
  FOR EACH ROW WHEN (NEW.type = 'vote')
  EXECUTE FUNCTION increment_vote_count();

CREATE TRIGGER on_vote_deleted
  AFTER DELETE ON supports
  FOR EACH ROW WHEN (OLD.type = 'vote')
  EXECUTE FUNCTION decrement_vote_count();

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Ideas
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ideas are viewable by everyone" ON ideas FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create ideas" ON ideas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own ideas" ON ideas FOR UPDATE USING (auth.uid() = submitter_id);

-- Supports
ALTER TABLE supports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Supports are viewable by everyone" ON supports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can support ideas" ON supports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own support" ON supports FOR DELETE USING (auth.uid() = user_id);

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- ENABLE REALTIME
-- ========================================
ALTER PUBLICATION supabase_realtime ADD TABLE ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE supports;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
