'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Radar, Zap, Filter, Gauge, MessageSquare, FolderOpen, Layers } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PricingProvider } from '@/components/pricing-context';
import { PricingDialog } from '@/components/pricing-dialog';
import { TrialProvider } from '@/components/trial-context';
import { TrialDialog } from '@/components/trial-dialog';
import { GateDialog } from '@/components/gate-dialog';

type Capability = {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
};

const capabilities: Capability[] = [
  {
    number: '01',
    title: 'Parsing',
    description:
      'Searches and finds incoming leads scored 5–10, continuously scanning every channel for prospects that match your criteria.',
    icon: Radar,
    accent: 'from-sky-500/15 to-sky-500/0',
  },
  {
    number: '02',
    title: 'Super Parsing',
    description:
      'A highly efficient search mode engineered for ultra-hot, high-quality leads scored 9–10 — the ones ready to buy right now.',
    icon: Zap,
    accent: 'from-amber-500/15 to-amber-500/0',
  },
  {
    number: '03',
    title: 'Lead Classification & Qualification',
    description:
      'Automatically classifies and qualifies every incoming lead, sorting by intent, fit, and readiness so you never waste a moment on the wrong prospect.',
    icon: Filter,
    accent: 'from-emerald-500/15 to-emerald-500/0',
  },
  {
    number: '04',
    title: 'Speed to Lead',
    description:
      'Instantly responds the moment a hot "A-Lead" is found — someone who urgently needs a solution to their problem. First to reply wins, and LeadPrime replies in milliseconds.',
    icon: Gauge,
    accent: 'from-rose-500/15 to-rose-500/0',
  },
  {
    number: '05',
    title: 'Smart Personalized Outreach',
    description:
      'This is professional sales communication, not dumb spam or a scam. LeadPrime writes highly personalized messages like an expert sales manager — tailored to each prospect\'s context, pain points, and tone.',
    icon: MessageSquare,
    accent: 'from-violet-500/15 to-violet-500/0',
  },
  {
    number: '06',
    title: 'Media Catalog',
    description:
      'Sends photos, videos, links, files, and media assets to clients directly within the conversation — everything needed to present your product convincingly, delivered at the perfect moment.',
    icon: FolderOpen,
    accent: 'from-cyan-500/15 to-cyan-500/0',
  },
  {
    number: '07',
    title: 'Multimodal Understanding',
    description:
      'Capable of understanding not just text, but also photos, videos, links, files, media, voice messages, and Telegram video notes ("кружочки") — comprehending the full context of every interaction a prospect sends.',
    icon: Layers,
    accent: 'from-teal-500/15 to-teal-500/0',
  },
];

export default function AboutPage() {
  return (
    <PricingProvider>
      <TrialProvider>
        <div className="relative min-h-screen bg-background">
          <Navbar />
          <main>
            {/* Introduction */}
            <section
              id="top"
              className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8 lg:pt-44 lg:pb-24"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-grid mask-radial-faded opacity-70"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 h-[440px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-400/20 blur-[120px]"
              />

              <div className="relative mx-auto max-w-4xl">
                <Reveal>
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 py-1.5 pl-2 pr-3.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back to home</span>
                  </Link>
                </Reveal>

                <Reveal delay={80} className="mt-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    About LeadPrime
                  </p>
                  <h1 className="mt-3 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.75rem]">
                    An autonomous AI system that{' '}
                    <span className="text-gradient-emerald">replaces your sales department</span>.
                  </h1>
                </Reveal>

                <Reveal delay={160} className="mt-6 max-w-2xl">
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    LeadPrime is not a tool for your sales team — it <em className="font-medium not-italic text-foreground">is</em> your sales team.
                    It costs less than human reps, performs better, and handles a far larger volume of work
                    around the clock. While a human representative can manage a handful of conversations at a
                    time, LeadPrime processes thousands simultaneously — finding, qualifying, and converting
                    leads without fatigue, without delay, and without missed opportunities.
                  </p>
                </Reveal>

                <Reveal delay={240} className="mt-6 max-w-2xl">
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Every function a traditional sales department performs — prospecting, qualifying,
                    responding, nurturing, and closing — is handled autonomously by intelligent agents that
                    never sleep and never let a hot lead go cold.
                  </p>
                </Reveal>
              </div>
            </section>

            {/* How it works — core functionality */}
            <section className="relative overflow-hidden border-y border-border/60 bg-secondary/40 px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
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
                    Core functionality, end to end.
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Seven capabilities that together replace an entire sales department — from the first
                    inbound signal to a fully qualified, nurtured prospect.
                  </p>
                </Reveal>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {capabilities.map((cap, i) => (
                    <Reveal key={cap.number} delay={i * 80} className="h-full">
                      <div className="group relative flex h-full w-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/10 hover:shadow-xl hover:shadow-foreground/5">
                        <div
                          aria-hidden
                          className={cap.accent + ' pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b opacity-0 transition-opacity duration-300 group-hover:opacity-100'}
                        />
                        <div className="relative flex items-center justify-between">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
                            <cap.icon className="h-5 w-5" />
                          </span>
                          <span className="font-display text-3xl font-bold text-foreground/10 transition-colors group-hover:text-foreground/15">
                            {cap.number}
                          </span>
                        </div>
                        <h3 className="relative mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
                          {cap.title}
                        </h3>
                        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                          {cap.description}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          </main>
          <Footer />
          <PricingDialog />
          <TrialDialog />
          <GateDialog />
        </div>
      </TrialProvider>
    </PricingProvider>
  );
}
