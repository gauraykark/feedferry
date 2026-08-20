-- =============================================
--  Feed Ferry — Supabase Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('donor', 'ngo', 'volunteer')),
  city        TEXT,
  district    TEXT,
  state       TEXT,
  location    TEXT,  -- legacy compat field (= city)
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Profile is inserted explicitly from the app; this is a safety net
  RETURN NEW;
END;
$$;

-- =============================================
-- DONATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS donations (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id           UUID REFERENCES profiles(id) ON DELETE CASCADE,
  donor_name         TEXT,
  donor_location     TEXT,
  food_name          TEXT NOT NULL,
  food_category      TEXT,
  veg_type           TEXT,
  quantity           NUMERIC NOT NULL,
  unit               TEXT DEFAULT 'kg',
  expiry_at          TIMESTAMPTZ,
  pickup_state       TEXT,
  pickup_district    TEXT,
  pickup_city        TEXT,
  pickup_address_line TEXT,
  description        TEXT,
  status             TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','collected','in-transit','delivered','completed')),
  accepted_by        UUID REFERENCES profiles(id),
  accepted_at        TIMESTAMPTZ,
  collected_at       TIMESTAMPTZ,
  in_transit_at      TIMESTAMPTZ,
  delivered_at       TIMESTAMPTZ,
  assigned_to        UUID REFERENCES profiles(id),
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_key TEXT NOT NULL,
  sender_id        UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name      TEXT,
  receiver_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message          TEXT NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast conversation loading
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_key);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- =============================================
-- CONTACTS (landing page contact form)
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT,
  email      TEXT,
  message    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts  ENABLE ROW LEVEL SECURITY;

-- PROFILES: anyone can read, only own row can write
CREATE POLICY "Public profiles readable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- DONATIONS: readable by all authenticated, insert by donors, update by NGOs/donors
CREATE POLICY "Donations readable by authenticated" ON donations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Donors can insert" ON donations FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "NGOs and donors can update" ON donations FOR UPDATE USING (
  auth.uid() = donor_id OR auth.uid() = accepted_by
);

-- MESSAGES: only participants can read/write
CREATE POLICY "Messages readable by participants" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
);

-- CONTACTS: insert only (public)
CREATE POLICY "Anyone can submit contact" ON contacts FOR INSERT WITH CHECK (true);

-- =============================================
-- ENABLE REALTIME for messages and donations
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE donations;
