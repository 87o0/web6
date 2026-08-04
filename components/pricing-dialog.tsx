'use client';

import * as React from 'react';
import { Check, ArrowRight, Zap, Building2, Rocket } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { usePricing } from '@/components/pricing-context';
import { useSubscription } from '@/components/subscription-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Plan = {
  name: string;
  price: string;
  limit: string;
  description: string;
  audience: string;
  icon: React.ElementType;
  highlight?: boolean;
  cta: string;
};

const plans: Plan[] = [
  {
    name: 'Starter',
    price: '$990',
    limit: '1,500 target dialogues per month',
    description:
      'Full platform access including AI script training, scoring, CRM integrations, dedicated account manager, and turn-key infrastructure setup.',
    audience: 'For quick launch and low-volume traffic.',
    icon: Rocket,
    cta: 'Choose Starter',
  },
  {
    name: 'Pro',
    price: '$1,990',
    limit: '10,000 target dialogues per month',
    description:
      'Full platform access plus an expanded resource pool for high-performance workflows.',
    audience: 'For growing B2B companies and sales teams.',
    icon: Zap,
    highlight: true,
    cta: 'Choose Pro',
  },
  {
    name: 'Enterprise',
    price: '$3,990',
    limit: '35,000 target dialogues per month',
    description:
      'Full platform access plus maximum server priority designed for massive lead loads.',
    audience:
      'For large-scale B2B platforms, media buyers, and teams with giant lead flow.',
    icon: Building2,
    cta: 'Choose Enterprise',
  },
];

export function PricingDialog() {
  const { open, setOpen } = usePricing();
  const { setSubscription } = useSubscription();
  const { toast } = useToast();

  function handleChoosePlan() {
    setSubscription();
    toast({
      title: 'Subscription activated',
      description: 'Your plan is now active. Welcome to LeadPrime.',
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-5xl gap-0 overflow-hidden rounded-2xl border-border bg-background p-0 sm:rounded-2xl">
          <div className="sr-only">
            <DialogTitle>LeadPrime pricing plans</DialogTitle>
            <DialogDescription>
              Choose the LeadPrime plan that fits your lead volume.
            </DialogDescription>
          </div>

          <div className="border-b border-border px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Choose your plan
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick a tier that matches your lead volume. Upgrade or
                  downgrade anytime.
                </p>
              </div>
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
                {plans.length} plans available
              </span>
            </div>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'flex flex-col bg-background p-6 sm:p-7',
                  plan.highlight && 'bg-emerald-50/30'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-lg border',
                      plan.highlight
                        ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                        : 'border-border bg-secondary text-foreground'
                    )}
                  >
                    <plan.icon className="h-4 w-4" />
                  </span>
                  {plan.highlight && (
                    <span className="rounded-full bg-foreground px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-background">
                      Most popular
                    </span>
                  )}
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">
                  {plan.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    / mo
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-foreground/80">
                  {plan.limit}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-secondary/60 p-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-xs leading-relaxed text-foreground/80">
                    {plan.audience}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleChoosePlan}
                  className={cn(
                    'group mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    plan.highlight
                      ? 'bg-foreground text-background shadow-lg shadow-foreground/10 hover:opacity-90'
                      : 'border border-border bg-background text-foreground hover:bg-secondary'
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-secondary/40 px-6 py-4 text-center sm:px-8">
            <p className="text-xs text-muted-foreground">
              All plans include full platform access, CRM integrations, and a
              dedicated account manager. Need a custom volume?{' '}
              <a
                href="https://cal.com/leadprime/consultation-15-30-min"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Book a call with our team.
              </a>
            </p>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}