import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const MEDIA_BUCKET = 'media-catalog';

export type MediaCategory = 'photo_video' | 'link' | 'file' | 'presentation';

export type MediaItem = {
  id: string;
  category: MediaCategory;
  name: string;
  storage_path: string | null;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  thumbnail_url: string | null;
  created_at: string;
};
