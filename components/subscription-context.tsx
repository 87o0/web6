'use client';

import * as React from 'react';

type SubscriptionStatus = 'none' | 'subscription' | 'trial';

type PlanName = 'Starter' | 'Pro' | 'Enterprise';

export type { PlanName };

type SubscriptionContextValue = {
  status: SubscriptionStatus;
  hasActivePlan: boolean;
  activePlan: PlanName | null;
  setSubscription: (plan?: PlanName) => void;
  setTrial: () => void;
  clear: () => void;
};

const SubscriptionContext = React.createContext<SubscriptionContextValue | null>(null);

const STORAGE_KEY = 'leadprime:subscription';
const PLAN_KEY = 'leadprime:plan';

function readStoredStatus(): SubscriptionStatus {
  if (typeof window === 'undefined') return 'none';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'subscription' || raw === 'trial') return raw;
    return 'none';
  } catch {
    return 'none';
  }
}

function readStoredPlan(): PlanName | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (raw === 'Starter' || raw === 'Pro' || raw === 'Enterprise') return raw;
    return null;
  } catch {
    return null;
  }
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<SubscriptionStatus>('none');
  const [activePlan, setActivePlan] = React.useState<PlanName | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setStatus(readStoredStatus());
    setActivePlan(readStoredPlan());
    setHydrated(true);
  }, []);

  const persist = React.useCallback(
    (next: SubscriptionStatus, plan?: PlanName | null) => {
      try {
        if (next === 'none') {
          window.localStorage.removeItem(STORAGE_KEY);
          window.localStorage.removeItem(PLAN_KEY);
        } else {
          window.localStorage.setItem(STORAGE_KEY, next);
          if (plan) {
            window.localStorage.setItem(PLAN_KEY, plan);
          } else {
            window.localStorage.removeItem(PLAN_KEY);
          }
        }
      } catch {
        /* ignore persistence failures */
      }
      setStatus(next);
      setActivePlan(plan ?? null);
    },
    [],
  );

  const value = React.useMemo<SubscriptionContextValue>(
    () => ({
      status: hydrated ? status : 'none',
      hasActivePlan: hydrated && status !== 'none',
      activePlan: hydrated ? activePlan : null,
      setSubscription: (plan?: PlanName) => persist('subscription', plan ?? null),
      setTrial: () => persist('trial', null),
      clear: () => persist('none', null),
    }),
    [status, activePlan, hydrated, persist],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = React.useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return ctx;
}
