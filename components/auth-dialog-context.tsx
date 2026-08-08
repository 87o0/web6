'use client';

import * as React from 'react';

type AuthMode = 'signin' | 'signup';

type AuthDialogContextValue = {
  open: boolean;
  mode: AuthMode;
  setOpen: (open: boolean) => void;
  openAuth: (mode?: AuthMode) => void;
  close: () => void;
};

const AuthDialogContext = React.createContext<AuthDialogContextValue | null>(null);

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpenState] = React.useState(false);
  const [mode, setMode] = React.useState<AuthMode>('signin');

  const setOpen = React.useCallback((next: boolean) => {
    setOpenState(next);
  }, []);

  const openAuth = React.useCallback((next: AuthMode = 'signin') => {
    setMode(next);
    setOpenState(true);
  }, []);

  const close = React.useCallback(() => {
    setOpenState(false);
  }, []);

  const value = React.useMemo<AuthDialogContextValue>(
    () => ({ open, mode, setOpen, openAuth, close }),
    [open, mode, setOpen, openAuth, close],
  );

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog() {
  const ctx = React.useContext(AuthDialogContext);
  if (!ctx) {
    throw new Error('useAuthDialog must be used within an AuthDialogProvider');
  }
  return ctx;
}
