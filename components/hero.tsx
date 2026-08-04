'use client';

import { ArrowRight, Calendar, Sparkles, Lock } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { usePricing } from '@/components/pricing-context';
import { useTrial } from '@/components/trial-context';
import { useSubscription } from '@/components/subscription-context';
import { useAuth } from '@/lib/auth-context';
import { useBooking } from '@/components/booking-context';
import { useGate, CAL_URL } from '@/components/gate-context';

export function Hero() {
  const { setOpen: setPricingOpen } = usePricing();
  const { setOpen: setTrialOpen } = useTrial();
  const { hasActivePlan } = useSubscription();
  const { status } = useAuth();
  const { booked, setBooked } = useBooking();
  const { requestPurchase } = useGate();

  const canPurchase = status === 'authenticated' && booked;

  function handleBuySubscription() {
    requestPurchase(() => setPricingOpen(true));
  }

  function handleBuyTrial() {
    requestPurchase(() => setTrialOpen(true));
  }

  function handleBookCall() {
    setBooked();
  }

  if (hasActivePlan) {
    return (
      <section
        id="top"
        className="relative overflow-hidden px-5 pt-32 pb-20 sm:px-6 sm:pt-40 sm:pb-24 lg:px-8 lg:pt-44 lg:pb-28"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid mask-radial-faded opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[440px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-400/20 blur-[120px]"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 py-1.5 pl-2 pr-3.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-700">
                <Sparkles className="h-3 w-3" />
                New
              </span>
              <span>Autonomous agents now qualify leads 24/7</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>

          <Reveal delay={80} className="mt-6">
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[4.4rem]">
              Autonomous AI infrastructure
              <br className="hidden sm:block" />{' '}
              <span className="text-gradient-emerald">for lead qualification</span>
              <br className="hidden sm:block" /> and growth.
            </h1>
          </Reveal>

          <Reveal delay={160} className="mx-auto mt-6 max-w-2xl">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
              Smart agents passively find, filter, and qualify incoming leads in
              real-time, removing routine work.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="/dashboard"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 text-sm font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-7 text-sm font-semibold text-foreground transition-all hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              <Calendar className="h-4 w-4" />
              Book a call
            </a>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pt-32 pb-20 sm:px-6 sm:pt-40 sm:pb-24 lg:px-8 lg:pt-44 lg:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid mask-radial-faded opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[440px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-400/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 py-1.5 pl-2 pr-3.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.7rem] font-semibold text-emerald-700">
              <Sparkles className="h-3 w-3" />
              New
            </span>
            <span>Autonomous agents now qualify leads 24/7</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <Reveal delay={80} className="mt-6">
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[4.4rem]">
            Autonomous AI infrastructure
            <br className="hidden sm:block" />{' '}
            <span className="text-gradient-emerald">for lead qualification</span>
            <br className="hidden sm:block" /> and growth.
          </h1>
        </Reveal>

        <Reveal delay={160} className="mx-auto mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            Smart agents passively find, filter, and qualify incoming leads in
            real-time, removing routine work.
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={handleBuySubscription}
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 text-sm font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            {canPurchase ? (
              <>
                Buy subscription
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Buy subscription
              </>
            )}
          </button>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBookCall}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-7 text-sm font-semibold text-foreground transition-all hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            <Calendar className="h-4 w-4" />
            {booked ? 'Booked — book another' : 'Book a call'}
          </a>
          <button
            type="button"
            onClick={handleBuyTrial}
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-foreground transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            {canPurchase ? (
              <>
                Buy paid trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Buy paid trial
              </>
            )}
          </button>
        </Reveal>

        {!canPurchase && (
          <Reveal delay={320}>
            <p className="mt-4 text-xs text-muted-foreground">
              {status !== 'authenticated'
                ? 'Sign in required to purchase'
                : !booked
                  ? 'Book a call to unlock purchase'
                  : ''}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
