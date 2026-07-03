-- ============================================================
-- Notes table — stores text highlights and annotations
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS notes (
  -- Unique identifier, auto-generated UUID
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- The slug of the article this note belongs to (e.g. "pythagoras-monochord")
  article_slug  TEXT        NOT NULL,

  -- The heading of the section where the highlight was made (nullable)
  section_heading TEXT,

  -- The exact text the user highlighted / selected
  selected_text TEXT        NOT NULL,

  -- The user's personal annotation for this highlight
  note_content  TEXT        NOT NULL,

  -- Character offset where the selection starts within the article body (nullable)
  char_start    INTEGER,

  -- Character offset where the selection ends within the article body (nullable)
  char_end      INTEGER,

  -- Timestamp of when the note was first created
  created_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamp of the most recent edit (kept in sync via trigger below)
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes for fast querying
-- ============================================================

-- Filter notes by article quickly
CREATE INDEX IF NOT EXISTS idx_notes_article_slug
  ON notes (article_slug);

-- Sort notes by creation time quickly (most common sort direction: newest first)
CREATE INDEX IF NOT EXISTS idx_notes_created_at
  ON notes (created_at DESC);

-- ============================================================
-- updated_at trigger — keeps updated_at current on every PATCH
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER notes_set_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Row-Level Security
-- Allow all operations (no auth — personal-use app)
-- ============================================================

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all"
  ON notes
  FOR ALL
  USING (true)
  WITH CHECK (true);
