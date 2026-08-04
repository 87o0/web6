'use client';

import * as React from 'react';

type BookingContextValue = {
  booked: boolean;
  setBooked: () => void;
  clear: () => void;
};

const BookingContext = React.createContext<BookingContextValue | null>(null);

const STORAGE_KEY = 'leadprime:booking';

function readStoredBooking(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booked, setBookedState] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setBookedState(readStoredBooking());
    setHydrated(true);
  }, []);

  const setBooked = React.useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* ignore persistence failures */
    }
    setBookedState(true);
  }, []);

  const clear = React.useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore persistence failures */
    }
    setBookedState(false);
  }, []);

  const value = React.useMemo<BookingContextValue>(
    () => ({
      booked: hydrated && booked,
      setBooked,
      clear,
    }),
    [booked, hydrated, setBooked, clear],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = React.useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return ctx;
}
