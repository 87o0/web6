'use client';

import * as React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { AuthDialogProvider } from '@/components/auth-dialog-context';
import { AuthDialog } from '@/components/auth-dialog';
import { SubscriptionProvider } from '@/components/subscription-context';
import { BookingProvider } from '@/components/booking-context';
import { GateProvider } from '@/components/gate-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthDialogProvider>
        <SubscriptionProvider>
          <BookingProvider>
            <GateProvider>
              {children}
              <AuthDialog />
            </GateProvider>
          </BookingProvider>
        </SubscriptionProvider>
      </AuthDialogProvider>
    </AuthProvider>
  );
}
