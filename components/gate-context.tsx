'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAuthDialog } from '@/components/auth-dialog-context';

type GateStage = 'closed' | 'auth';

type GateContextValue = {
  stage: GateStage;
  pendingAction: (() => void) | null;
  /** Gate a specific plan-selection action. Auth required. */
  requestPurchase: (action: () => void) => void;
  close: () => void;
  resolveAuth: () => void;
};

const GateContext = React.createContext<GateContextValue | null>(null);

export const CAL_URL = 'https://cal.com/leadprime/consultation-15-30-min';

export function GateProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const { openAuth } = useAuthDialog();
  const [stage, setStage] = React.useState<GateStage>('closed');
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);

  const requestPurchase = React.useCallback(
    (action: () => void) => {
      if (status !== 'authenticated') {
        setPendingAction(() => action);
        setStage('auth');
        openAuth('signup');
        return;
      }
      action();
    },
    [status, openAuth],
  );

  const close = React.useCallback(() => {
    setStage('closed');
    setPendingAction(null);
  }, []);

  const resolveAuth = React.useCallback(() => {
    setStage('closed');
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

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
