/*
# User Profiles — profiles table

## Summary
Creates a `profiles` table that stores the user's first name and last name
collected during sign-up. Each row corresponds to one Supabase auth user
and is automatically created on first sign-up / Google OAuth sign-in via a
trigger function.

## New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users ON DELETE CASCADE)
  - `first_name` (text, nullable)
  - `last_name` (text, nullable)
  - `email` (text, synced from auth.users)
  - `avatar_url` (text, optional)
  - `created_at` (timestamptz, defaults to now())
  - `updated_at` (timestamptz, defaults to now())

## Functions
- `handle_new_user()`: trigger that creates a profile row when a new auth
  user is inserted. Pulls names from raw_user_meta_data.

## Triggers
- `on_auth_user_created`: fires AFTER INSERT on auth.users.

## Security
- RLS enabled on `profiles`.
- Authenticated users can read and update only their own profile row.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_avatar_url text;
  v_full_name text;
BEGIN
  v_first_name := (new.raw_user_meta_data->>'first_name');
  v_last_name := (new.raw_user_meta_data->>'last_name');
  v_avatar_url := COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture');

  IF v_first_name IS NULL AND v_last_name IS NULL THEN
    v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name');
    IF v_full_name IS NOT NULL THEN
      v_first_name := split_part(v_full_name, ' ', 1);
      v_last_name := CASE
        WHEN position(' ' in v_full_name) > 0
        THEN substring(v_full_name from position(' ' in v_full_name) + 1)
        ELSE NULL
      END;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, first_name, last_name, email, avatar_url)
  VALUES (new.id, v_first_name, v_last_name, new.email, v_avatar_url);

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();