-- Seed data for development
-- 5 sample ideas to populate The Foundry during development

-- Note: submitter_id is NULL for seed data (anonymous submissions)

INSERT INTO ideas (title, description, category, tags, vote_count) VALUES
(
  'AI Meeting Summarizer',
  'An AI tool that joins any video call (Zoom, Meet, Teams) and generates structured summaries with action items, decisions made, and participant contributions — delivered to your inbox within 2 minutes of the call ending.',
  'productivity',
  ARRAY['meetings', 'summaries', 'automation', 'enterprise'],
  342
),
(
  'Personal Brand Voice AI',
  'Train an AI on your existing writing (emails, posts, docs) so it can generate new content that genuinely sounds like you — not generic AI. Learns your vocabulary, sentence rhythm, and tone.',
  'creativity',
  ARRAY['writing', 'personal-brand', 'content', 'voice'],
  287
),
(
  'Code Review Explainer',
  'Paste any pull request diff and get a plain-English explanation of what changed, why it matters, and what risks it introduces. Built for engineering managers and non-technical stakeholders.',
  'automation',
  ARRAY['code-review', 'engineering', 'explainability'],
  201
),
(
  'AI Research Digest',
  'Subscribe to any topic and get a weekly digest of the most relevant AI papers, summarized into 3-bullet executive summaries. Filters out noise, surfaces signal.',
  'analysis',
  ARRAY['research', 'papers', 'digest', 'learning'],
  178
),
(
  'Prompt Library Manager',
  'A searchable, version-controlled library for your best AI prompts. Tag by use case, track what works, share with your team, and get AI-suggested improvements on existing prompts.',
  'productivity',
  ARRAY['prompts', 'productivity', 'team', 'library'],
  156
);
