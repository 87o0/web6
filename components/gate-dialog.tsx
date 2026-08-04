'use client';

import * as React from 'react';
import { ArrowRight, Calendar, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useGate, CAL_URL } from '@/components/gate-context';

export function GateDialog() {
  const { stage, close, resolveAuth, resolveBooking } = useGate();
  const open = stage !== 'closed';

  function handleOpenChange(next: boolean) {
    if (!next) close();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border-border bg-background p-0 sm:rounded-2xl">
          <div className="sr-only">
            <DialogTitle>
              {stage === 'auth' ? 'Sign in required' : 'Book a call required'}
            </DialogTitle>
            <DialogDescription>
              {stage === 'auth'
                ? 'You need an account before you can purchase a plan.'
                : 'You need to book a call before you can purchase a plan.'}
            </DialogDescription>
          </div>

          {stage === 'auth' ? (
            <div className="px-6 py-7">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                  Create your account
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                You need to sign up or sign in before you can purchase a
                subscription or paid trial. It only takes a moment.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={resolveAuth}
                  className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Sign up / Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Maybe later
                </button>
              </div>
            </div>
          ) : stage === 'booking' ? (
            <div className="px-6 py-7">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-100 text-emerald-700">
                  <Calendar className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                  Book a call first
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Before purchasing, book a short consultation with our team so we
                can understand your needs and set you up for success. Once
                booked, you can complete your purchase.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href={CAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={resolveBooking}
                  className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Calendar className="h-4 w-4" />
                  Book a call
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Maybe later
                </button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
