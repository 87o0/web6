'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useBooking } from '@/components/booking-context';

type GateStage = 'closed' | 'auth';

type GateContextValue = {
  stage: GateStage;
  pendingAction: (() => void) | null;
  /** Gate a specific plan-selection action. Auth required; booking is optional. */
  requestPurchase: (action: () => void) => void;
  close: () => void;
  resolveAuth: () => void;
};

const GateContext = React.createContext<GateContextValue | null>(null);

const DEMO_USER = {
  name: 'Alex Morgan',
  email: 'alex.morgan@leadprime.app',
  image:
    'https://lh3.googleusercontent.com/a/ACg8ocLJ7Y9fZ3kJnJKqGRzMpZvKqRBzQq9kO7t0m9LJhYxQ=s96-c',
};

export const CAL_URL = 'https://cal.com/leadprime/consultation-15-30-min';

export function GateProvider({ children }: { children: React.ReactNode }) {
  const { status, signIn } = useAuth();
  const [stage, setStage] = React.useState<GateStage>('closed');
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);

  const requestPurchase = React.useCallback(
    (action: () => void) => {
      if (status !== 'authenticated') {
        setPendingAction(() => action);
        setStage('auth');
        return;
      }
      action();
    },
    [status],
  );

  const close = React.useCallback(() => {
    setStage('closed');
    setPendingAction(null);
  }, []);

  const resolveAuth = React.useCallback(() => {
    if (status !== 'authenticated') {
      signIn(DEMO_USER);
    }
    setStage('closed');
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [status, signIn, pendingAction]);

  const value = React.useMemo<GateContextValue>(
    () => ({
      stage,
      pendingAction,
      requestPurchase,
      close,
      resolveAuth,
    }),
    [stage, pendingAction, requestPurchase, close, resolveAuth],
  );

  return <GateContext.Provider value={value}>{children}</GateContext.Provider>;
}

export function useGate() {
  const ctx = React.useContext(GateContext);
  if (!ctx) {
    throw new Error('useGate must be used within a GateProvider');
  }
  return ctx;
}
