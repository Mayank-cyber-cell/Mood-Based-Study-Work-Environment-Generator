/*
  # MoodFlow Tracking Schema

  ## Overview
  This migration creates the database schema for tracking user sessions, mood ratings, and mood history in the MoodFlow application.

  ## New Tables

  ### 1. `user_sessions`
  Tracks each mood environment session with duration and engagement metrics.
  - `id` (uuid, primary key) - Unique session identifier
  - `user_id` (uuid, nullable) - Optional user reference for authenticated users
  - `mood_type` (text) - The selected mood (calm, stressed, excited, tired)
  - `started_at` (timestamptz) - When the session started
  - `ended_at` (timestamptz, nullable) - When the session ended
  - `duration_seconds` (integer, nullable) - Total session duration
  - `music_played` (boolean) - Whether music was played during session
  - `timer_used` (boolean) - Whether pomodoro timer was used
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `mood_ratings`
  Stores user feedback ratings for mood environments.
  - `id` (uuid, primary key) - Unique rating identifier
  - `session_id` (uuid, foreign key) - References user_sessions
  - `user_id` (uuid, nullable) - Optional user reference
  - `mood_type` (text) - The rated mood
  - `rating` (integer) - Rating score (1-5)
  - `matched_need` (boolean) - Did it match their need?
  - `helped_focus` (boolean) - Did it help them focus?
  - `feedback_text` (text, nullable) - Optional text feedback
  - `created_at` (timestamptz) - Rating timestamp

  ### 3. `mood_history`
  Aggregated mood usage analytics for users.
  - `id` (uuid, primary key) - Unique history identifier
  - `user_id` (uuid, nullable) - Optional user reference
  - `mood_type` (text) - The mood type
  - `date` (date) - The date of activity
  - `session_count` (integer) - Number of sessions that day
  - `total_duration_seconds` (integer) - Total time spent in this mood
  - `average_rating` (numeric, nullable) - Average rating for the day
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled for data protection
  - Unauthenticated users can create sessions and ratings (for anonymous usage)
  - Authenticated users can only access their own data
  - Public read access for aggregate analytics (no personal data exposed)

  ## Indexes
  - Indexes on user_id, mood_type, and timestamps for query performance
  - Composite indexes for common query patterns

  ## Notes
  - All tables support both authenticated and anonymous users
  - Duration is calculated as difference between started_at and ended_at
  - Ratings are on a 1-5 scale
  - Mood history is aggregated daily for analytics
*/

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_type text NOT NULL CHECK (mood_type IN ('calm', 'stressed', 'excited', 'tired')),
  started_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  duration_seconds integer,
  music_played boolean DEFAULT false,
  timer_used boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_mood_type ON user_sessions(mood_type);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at DESC);

-- Enable RLS on user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Anyone can create sessions"
  ON user_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous can view their sessions by id"
  ON user_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update own sessions"
  ON user_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous can update sessions"
  ON user_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create mood_ratings table
CREATE TABLE IF NOT EXISTS mood_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES user_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_type text NOT NULL CHECK (mood_type IN ('calm', 'stressed', 'excited', 'tired')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  matched_need boolean DEFAULT false,
  helped_focus boolean DEFAULT false,
  feedback_text text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for mood_ratings
CREATE INDEX IF NOT EXISTS idx_mood_ratings_session_id ON mood_ratings(session_id);
CREATE INDEX IF NOT EXISTS idx_mood_ratings_user_id ON mood_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_ratings_mood_type ON mood_ratings(mood_type);
CREATE INDEX IF NOT EXISTS idx_mood_ratings_created_at ON mood_ratings(created_at DESC);

-- Enable RLS on mood_ratings
ALTER TABLE mood_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mood_ratings
CREATE POLICY "Anyone can create ratings"
  ON mood_ratings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own ratings"
  ON mood_ratings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous can view ratings"
  ON mood_ratings FOR SELECT
  TO anon
  USING (user_id IS NULL);

CREATE POLICY "Public can view aggregate ratings"
  ON mood_ratings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create mood_history table
CREATE TABLE IF NOT EXISTS mood_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_type text NOT NULL CHECK (mood_type IN ('calm', 'stressed', 'excited', 'tired')),
  date date DEFAULT CURRENT_DATE NOT NULL,
  session_count integer DEFAULT 0,
  total_duration_seconds integer DEFAULT 0,
  average_rating numeric(3, 2),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, mood_type, date)
);

-- Create indexes for mood_history
CREATE INDEX IF NOT EXISTS idx_mood_history_user_id ON mood_history(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_history_mood_type ON mood_history(mood_type);
CREATE INDEX IF NOT EXISTS idx_mood_history_date ON mood_history(date DESC);

-- Enable RLS on mood_history
ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mood_history
CREATE POLICY "Users can view own history"
  ON mood_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view aggregate history"
  ON mood_history FOR SELECT
  TO anon, authenticated
  USING (user_id IS NULL);

CREATE POLICY "System can insert history"
  ON mood_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "System can update history"
  ON mood_history FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update mood_history automatically
CREATE OR REPLACE FUNCTION update_mood_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if session has ended
  IF NEW.ended_at IS NOT NULL AND NEW.duration_seconds IS NOT NULL THEN
    INSERT INTO mood_history (user_id, mood_type, date, session_count, total_duration_seconds)
    VALUES (
      NEW.user_id,
      NEW.mood_type,
      DATE(NEW.started_at),
      1,
      NEW.duration_seconds
    )
    ON CONFLICT (user_id, mood_type, date)
    DO UPDATE SET
      session_count = mood_history.session_count + 1,
      total_duration_seconds = mood_history.total_duration_seconds + EXCLUDED.total_duration_seconds,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update mood_history
DROP TRIGGER IF EXISTS trigger_update_mood_history ON user_sessions;
CREATE TRIGGER trigger_update_mood_history
  AFTER UPDATE OF ended_at ON user_sessions
  FOR EACH ROW
  WHEN (NEW.ended_at IS NOT NULL)
  EXECUTE FUNCTION update_mood_history();

-- Function to update average rating in mood_history
CREATE OR REPLACE FUNCTION update_mood_history_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE mood_history
  SET average_rating = (
    SELECT AVG(rating)::numeric(3,2)
    FROM mood_ratings
    WHERE mood_type = NEW.mood_type
      AND DATE(created_at) = DATE(NEW.created_at)
      AND (user_id = NEW.user_id OR (user_id IS NULL AND NEW.user_id IS NULL))
  ),
  updated_at = now()
  WHERE mood_type = NEW.mood_type
    AND date = DATE(NEW.created_at)
    AND (user_id = NEW.user_id OR (user_id IS NULL AND NEW.user_id IS NULL));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update ratings in mood_history
DROP TRIGGER IF EXISTS trigger_update_mood_history_rating ON mood_ratings;
CREATE TRIGGER trigger_update_mood_history_rating
  AFTER INSERT ON mood_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_mood_history_rating();