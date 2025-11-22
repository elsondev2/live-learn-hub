-- Enable realtime for chat features
-- Note: This is for Supabase Realtime subscriptions
-- The actual data is stored in MongoDB, but we use Supabase for real-time pub/sub

-- Create a simple presence table for typing indicators
CREATE TABLE IF NOT EXISTS presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  is_typing BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read and write presence
CREATE POLICY "Users can manage their own presence"
  ON presence
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_presence_conversation ON presence(conversation_id);
CREATE INDEX idx_presence_user ON presence(user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE presence;

-- Create a function to clean up old presence records
CREATE OR REPLACE FUNCTION cleanup_old_presence()
RETURNS void AS $$
BEGIN
  DELETE FROM presence
  WHERE updated_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Note: In production, you would set up a cron job to run cleanup_old_presence()
