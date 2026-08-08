'use client';

import * as React from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthUser = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
};

type AuthSession = {
  user: AuthUser;
};

type AuthContextValue = {
  session: AuthSession | null;
  status: 'authenticated' | 'unauthenticated';
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

type ProfileRow = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

function toAuthUser(user: User, profile?: ProfileRow | null): AuthUser {
  const meta = user.user_metadata as Record<string, string> | null;
  const firstName = profile?.first_name ?? meta?.first_name ?? '';
  const lastName = profile?.last_name ?? meta?.last_name ?? '';
  const fullName =
    profile?.first_name || profile?.last_name
      ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
      : meta?.full_name || meta?.name || user.email?.split('@')[0] || 'User';
  return {
    id: user.id,
    name: fullName,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: user.email ?? '',
    image: profile?.avatar_url ?? meta?.avatar_url ?? meta?.picture ?? undefined,
  };
}

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  return data as ProfileRow | null;
}

function toAuthSession(session: Session | null): AuthSession | null {
  if (!session?.user) return null;
  return { user: toAuthUser(session.user) };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authSession, setAuthSession] = React.useState<AuthSession | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (data.session?.user) {
        const profile = await fetchProfile(data.session.user.id);
        if (!mounted) return;
        setAuthSession({ user: toAuthUser(data.session.user, profile) });
      } else {
        setAuthSession(null);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!mounted) return;
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (!mounted) return;
          setAuthSession({ user: toAuthUser(session.user, profile) });
        } else {
          setAuthSession(null);
        }
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = React.useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signUp = React.useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          },
        },
      });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signInWithGoogle = React.useCallback(async () => {
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    setAuthSession(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      session: authSession,
      status: authSession ? 'authenticated' : 'unauthenticated',
      loading,
      signInWithPassword,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [authSession, loading, signInWithPassword, signUp, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
