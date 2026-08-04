'use client';

import * as React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { SubscriptionProvider } from '@/components/subscription-context';
import { BookingProvider } from '@/components/booking-context';
import { GateProvider } from '@/components/gate-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <BookingProvider>
          <GateProvider>{children}</GateProvider>
        </BookingProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
