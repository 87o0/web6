/*
# Media Catalog — media_items table + storage bucket

## Summary
Adds a dedicated media catalog feature to the client dashboard. Users can
upload, browse, filter, and delete media assets (photos, videos, links, files,
presentations) that are stored in Supabase Storage with metadata tracked in
the `media_items` table.

## New Tables
- `media_items`
  - `id` (uuid, primary key)
  - `category` (text, one of: photo_video | link | file | presentation)
  - `name` (text, display name of the asset)
  - `storage_path` (text, path inside the `media-catalog` bucket; nullable for links)
  - `url` (text, public URL of the asset or external link)
  - `mime_type` (text, MIME type of the uploaded file; nullable for links)
  - `size_bytes` (bigint, file size in bytes; nullable for links)
  - `thumbnail_url` (text, optional thumbnail/preview URL)
  - `created_at` (timestamptz, defaults to now())

## Storage
- Creates a public storage bucket named `media-catalog` so uploaded assets
  can be served back to the dashboard gallery.

## Security
- This app has no sign-in screen (the dashboard is reached via a demo
  "Sign in" button that sets a local session only). The frontend therefore
  talks to Supabase with the anon key for its entire lifetime.
- RLS is enabled on `media_items`.
- Four separate CRUD policies are added scoped to `TO anon, authenticated`
  so the anon-key client can read, insert, update, and delete its own catalog
  entries. `USING (true)` is intentional here because the catalog is a
  single-tenant shared workspace (no per-user ownership), matching the rest
  of the app which has no real auth.
- Storage bucket policies allow public read + anon upload/overwrite/delete
  so the dashboard can manage files.

## Notes
1. The app uses the anon key exclusively, so every policy lists `anon`.
2. `storage_path` is nullable because `link` category items have no file.
3. `mime_type` and `size_bytes` are nullable for the same reason.
*/

CREATE TABLE IF NOT EXISTS media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('photo_video', 'link', 'file', 'presentation')),
  name text NOT NULL,
  storage_path text,
  url text NOT NULL,
  mime_type text,
  size_bytes bigint,
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_media_items" ON media_items;
CREATE POLICY "anon_select_media_items" ON media_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_media_items" ON media_items;
CREATE POLICY "anon_insert_media_items" ON media_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_media_items" ON media_items;
CREATE POLICY "anon_update_media_items" ON media_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_media_items" ON media_items;
CREATE POLICY "anon_delete_media_items" ON media_items FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
SELECT 'media-catalog', 'media-catalog', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'media-catalog'
);

DROP POLICY IF EXISTS "anon_read_media_catalog" ON storage.objects;
CREATE POLICY "anon_read_media_catalog" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'media-catalog');

DROP POLICY IF EXISTS "anon_insert_media_catalog" ON storage.objects;
CREATE POLICY "anon_insert_media_catalog" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'media-catalog');

DROP POLICY IF EXISTS "anon_update_media_catalog" ON storage.objects;
CREATE POLICY "anon_update_media_catalog" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'media-catalog') WITH CHECK (bucket_id = 'media-catalog');

DROP POLICY IF EXISTS "anon_delete_media_catalog" ON storage.objects;
CREATE POLICY "anon_delete_media_catalog" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'media-catalog');