'use client';

import * as React from 'react';

type TrialContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const TrialContext = React.createContext<TrialContextValue | null>(null);

export function TrialProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open]);
  return (
    <TrialContext.Provider value={value}>{children}</TrialContext.Provider>
  );
}

export function useTrial() {
  const ctx = React.useContext(TrialContext);
  if (!ctx) {
    throw new Error('useTrial must be used within a TrialProvider');
  }
  return ctx;
}
