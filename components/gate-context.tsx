'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useBooking } from '@/components/booking-context';

type GateStage = 'closed' | 'auth' | 'booking';

type GateContextValue = {
  stage: GateStage;
  pendingAction: (() => void) | null;
  requestPurchase: (action: () => void) => void;
  close: () => void;
  resolveAuth: () => void;
  resolveBooking: () => void;
};

const GateContext = React.createContext<GateContextValue | null>(null);

const DEMO_USER = {
  name: 'Alex Morgan',
  email: 'alex.morgan@leadprime.app',
  image:
    'https://lh3.googleusercontent.com/a/ACg8ocLJ7Y9fZ3kJnJKqGRzMpZvKqRBzQq9kO7t0m9LJhYxQ=s96-c',
};

const CAL_URL = 'https://cal.com/leadprime/consultation-15-30-min';

export function GateProvider({ children }: { children: React.ReactNode }) {
  const { status, signIn } = useAuth();
  const { booked, setBooked } = useBooking();
  const [stage, setStage] = React.useState<GateStage>('closed');
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);

  const requestPurchase = React.useCallback(
    (action: () => void) => {
      if (status !== 'authenticated') {
        setPendingAction(() => action);
        setStage('auth');
        return;
      }
      if (!booked) {
        setPendingAction(() => action);
        setStage('booking');
        return;
      }
      action();
    },
    [status, booked],
  );

  const close = React.useCallback(() => {
    setStage('closed');
    setPendingAction(null);
  }, []);

  const resolveAuth = React.useCallback(() => {
    if (status !== 'authenticated') {
      signIn(DEMO_USER);
    }
    setStage('booking');
  }, [status, signIn]);

  const resolveBooking = React.useCallback(() => {
    setBooked();
    setStage('closed');
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [setBooked, pendingAction]);

  const value = React.useMemo<GateContextValue>(
    () => ({
      stage,
      pendingAction,
      requestPurchase,
      close,
      resolveAuth,
      resolveBooking,
    }),
    [stage, pendingAction, requestPurchase, close, resolveAuth, resolveBooking],
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

export { CAL_URL };
