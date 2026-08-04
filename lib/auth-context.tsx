'use client';

import * as React from 'react';

type AuthUser = {
  name: string;
  email: string;
  image?: string;
};

type AuthSession = {
  user: AuthUser;
};

type AuthContextValue = {
  session: AuthSession | null;
  status: 'authenticated' | 'unauthenticated';
  signIn: (user: AuthUser) => void;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'leadprime:session';

function readStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setSession(readStoredSession());
    setHydrated(true);
  }, []);

  const signIn = React.useCallback((user: AuthUser) => {
    const next: AuthSession = { user };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore persistence failures */
    }
    setSession(next);
  }, []);

  const signOut = React.useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore persistence failures */
    }
    setSession(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      session,
      status: hydrated && session ? 'authenticated' : 'unauthenticated',
      signIn,
      signOut,
    }),
    [session, hydrated, signIn, signOut],
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
