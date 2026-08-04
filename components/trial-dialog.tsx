'use client';

import * as React from 'react';
import { Check, ArrowRight, Zap, ShieldCheck, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTrial } from '@/components/trial-context';
import { useSubscription } from '@/components/subscription-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const trialFeatures = [
  '14-day full platform access',
  'Up to 500 qualified leads',
  'AI script training included',
  'CRM integrations',
  'Dedicated account manager',
  'No long-term commitment',
];

export function TrialDialog() {
  const { open, setOpen } = useTrial();
  const { setTrial } = useSubscription();
  const { toast } = useToast();
  const [selected, setSelected] = React.useState(false);

  function handleClose(next: boolean) {
    setOpen(next);
    if (!next) {
      setTimeout(() => setSelected(false), 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border-border bg-background p-0 sm:rounded-2xl">
          <div className="sr-only">
            <DialogTitle>Paid trial — $29.00</DialogTitle>
            <DialogDescription>
              Purchase a 14-day paid trial of LeadPrime for $29.00.
            </DialogDescription>
          </div>

          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-100 text-emerald-700">
                <Zap className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                  Paid Trial
                </h2>
                <p className="text-xs text-muted-foreground">
                  Try the full platform for 14 days
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold tracking-tight text-foreground">
                $29.00
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                one-time
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Get full access to LeadPrime for 14 days. Experience the entire
              pipeline — from lead discovery to closed-won — without committing
              to a monthly plan.
            </p>

            <ul className="mt-5 space-y-2.5">
              {trialFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-foreground/80"
                >
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-secondary/60 p-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-foreground/80">
                Trial starts the moment you purchase. At the end of 14 days,
                choose any subscription plan or walk away — no auto-renewal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (selected) {
                  setTrial();
                  toast({
                    title: 'Paid trial activated',
                    description: 'Your 7-day trial is now active. Enjoy LeadPrime!',
                  });
                  setOpen(false);
                  setTimeout(() => setSelected(false), 200);
                } else {
                  setSelected(true);
                }
              }}
              className={cn(
                'group mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selected
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-foreground text-background shadow-lg shadow-foreground/10 hover:opacity-90'
              )}
            >
              {selected ? (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Confirm purchase — $29.00
                </>
              ) : (
                <>
                  Buy paid trial — $29.00
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {selected && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                This is a demo checkout. No payment will be processed.
              </p>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
