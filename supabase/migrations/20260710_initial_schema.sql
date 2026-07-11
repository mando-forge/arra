-- Contact submissions (replaces mailto: form)
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  intent TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog/Updates
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Chat conversations
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website',
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable pgvector for AI knowledge base
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base for RAG
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Contact submissions policies
CREATE POLICY "Enable insert for all users" ON contact_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable select for admins only" ON contact_submissions FOR SELECT TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Posts policies
CREATE POLICY "Enable select for published posts" ON posts FOR SELECT TO public USING (status = 'published');
CREATE POLICY "Enable all access for admins" ON posts FOR ALL TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Subscribers policies
CREATE POLICY "Enable insert for all users" ON subscribers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable select for admins only" ON subscribers FOR SELECT TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Knowledge base policies
CREATE POLICY "Enable select for all users" ON knowledge_base FOR SELECT TO public USING (true);
CREATE POLICY "Enable all access for admins" ON knowledge_base FOR ALL TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Chat policies
CREATE POLICY "Enable insert for all users" ON chat_conversations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON chat_conversations FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for all users" ON chat_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON chat_messages FOR SELECT TO public USING (true);
