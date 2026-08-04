'use client';

import * as React from 'react';
import { Search, Cpu, Send, Trophy, ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { cn } from '@/lib/utils';

type Step = {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  bullets: string[];
  accent: string;
};

const steps: Step[] = [
  {
    number: '01',
    title: 'Lead Discovery',
    description:
      'Automatic gathering from all sources — forms, email, ads, chat, and referrals converge into one unified pipeline.',
    icon: Search,
    bullets: ['Forms & landing pages', 'Email & chat', 'Paid ad sources'],
    accent: 'from-sky-500/15 to-sky-500/0',
  },
  {
    number: '02',
    title: 'Processing & Qualification',
    description:
      'AI deeply evaluates the quality and relevance of each lead against your criteria — intent, fit, timing, and budget.',
    icon: Cpu,
    bullets: ['Intent scoring', 'ICP matching', 'Auto-enrichment'],
    accent: 'from-emerald-500/15 to-emerald-500/0',
  },
  {
    number: '03',
    title: 'Personalized Outreach',
    description:
      'Agents prepare and send a targeted offer to the right client — written in your voice, timed to their moment of intent.',
    icon: Send,
    bullets: ['Context-aware drafts', 'Smart send timing', 'A/B tested'],
    accent: 'from-violet-500/15 to-violet-500/0',
  },
  {
    number: '04',
    title: 'Sales',
    description:
      'Closing the deal and converting the qualified lead into an actual customer — with a clean handoff to your team.',
    icon: Trophy,
    bullets: ['Warm handoff', 'CRM sync', 'Revenue attribution'],
    accent: 'from-amber-500/15 to-amber-500/0',
  },
];

export function HowItWorks() {
  const [active, setActive] = React.useState(0);

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-y border-border/60 bg-secondary/40 px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-sm mask-radial-faded opacity-40"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Four steps from inbound to closed-won.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            A transparent pipeline you can watch work. Tap a step to see what
            happens underneath.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[repeat(4,1fr)] lg:items-start">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 90} className="h-full">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  'group relative flex h-full w-full flex-col rounded-2xl border bg-card p-6 text-left transition-all duration-300',
                  active === i
                    ? 'border-foreground/20 shadow-xl shadow-foreground/5'
                    : 'border-border hover:border-foreground/10 hover:shadow-md'
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b opacity-0 transition-opacity duration-300',
                    step.accent,
                    active === i && 'opacity-100'
                  )}
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className={cn(
                      'inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors',
                      active === i
                        ? 'border-transparent bg-foreground text-background'
                        : 'border-border bg-background text-foreground'
                    )}
                  >
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl font-bold text-foreground/10 transition-colors group-hover:text-foreground/15">
                    {step.number}
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                <div
                  className={cn(
                    'relative grid transition-all duration-300',
                    active === i
                      ? 'mt-4 grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-1.5 border-t border-border pt-4">
                      {step.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {active === i && i < steps.length - 1 && (
                    <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-foreground/20 lg:block">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          Hover or tap any step to explore the details.
        </Reveal>
      </div>
    </section>
  );
}
