'use client';

import * as React from 'react';

type SubscriptionStatus = 'none' | 'subscription' | 'trial';

type SubscriptionContextValue = {
  status: SubscriptionStatus;
  hasActivePlan: boolean;
  setSubscription: () => void;
  setTrial: () => void;
  clear: () => void;
};

const SubscriptionContext = React.createContext<SubscriptionContextValue | null>(null);

const STORAGE_KEY = 'leadprime:subscription';

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

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<SubscriptionStatus>('none');
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setStatus(readStoredStatus());
    setHydrated(true);
  }, []);

  const persist = React.useCallback((next: SubscriptionStatus) => {
    try {
      if (next === 'none') {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      /* ignore persistence failures */
    }
    setStatus(next);
  }, []);

  const value = React.useMemo<SubscriptionContextValue>(
    () => ({
      status: hydrated ? status : 'none',
      hasActivePlan: hydrated && status !== 'none',
      setSubscription: () => persist('subscription'),
      setTrial: () => persist('trial'),
      clear: () => persist('none'),
    }),
    [status, hydrated, persist],
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
