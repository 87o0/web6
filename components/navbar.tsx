'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useAuthDialog } from '@/components/auth-dialog-context';
import { useSubscription } from '@/components/subscription-context';
import { useBooking } from '@/components/booking-context';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const { session, status, signOut } = useAuth();
  const { openAuth } = useAuthDialog();
  const { hasActivePlan, clear: clearSubscription } = useSubscription();
  const { clear: clearBooking } = useBooking();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = React.useCallback(() => {
    clearSubscription();
    clearBooking();
    signOut();
  }, [clearSubscription, clearBooking, signOut]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="font-display text-[1.35rem] font-bold tracking-tight text-foreground"
          aria-label="LeadPrime home"
        >
          LeadPrime
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          {status === 'authenticated' && session?.user && hasActivePlan ? (
            <Link
              href="/dashboard"
              className="hidden h-9 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
            >
              Dashboard
            </Link>
          ) : null}
          {status === 'authenticated' && session?.user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {session.user.name ?? session.user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-9 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuth('signin')}
                className="inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="inline-flex h-9 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
