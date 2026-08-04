'use client';

import { ChartBar as BarChart3, Boxes, Clock, Filter, Plug, Target, Zap } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { cn } from '@/lib/utils';

type Feature = {
  title: string;
  description: string;
  icon: React.ElementType;
  className: string;
  visual: React.ReactNode;
};

const Sparkline = ({ color }: { color: string }) => (
  <svg
    viewBox="0 0 120 40"
    fill="none"
    className="h-10 w-full"
    preserveAspectRatio="none"
  >
    <path
      d="M2 32 L18 26 L34 30 L50 18 L66 22 L82 10 L98 14 L118 4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AccBar = ({ value }: { value: number }) => (
  <div className="flex items-end gap-1.5 h-16">
    {[40, 62, 78, 88, 96].map((h, i) => (
      <div
        key={i}
        className={cn(
          'flex-1 rounded-t-sm transition-all',
          i === 4 ? 'bg-emerald-500' : 'bg-emerald-200/80'
        )}
        style={{ height: `${(h / 100) * value}%`, opacity: 0.4 + i * 0.12 }}
      />
    ))}
  </div>
);

const IntegrationChips = () => {
  const tools = ['CRM', 'Slack', 'Gmail', 'HubSpot', 'API', 'Zapier'];
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((t) => (
        <span
          key={t}
          className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
        >
          {t}
        </span>
      ))}
    </div>
  );
};

const features: Feature[] = [
  {
    title: 'High qualification accuracy',
    description:
      'Agents evaluate every lead against your criteria — intent, fit, and timing — so only sales-ready conversations reach your team.',
    icon: Target,
    className: 'sm:col-span-2 sm:row-span-2',
    visual: (
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-emerald-50/80 to-background p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Qualification accuracy
            </p>
            <p className="font-display text-3xl font-bold text-foreground">
              98.4%
            </p>
          </div>
          <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            +12.3% MoM
          </div>
        </div>
        <div className="mt-4">
          <AccBar value={92} />
        </div>
        <div className="mt-3">
          <Sparkline color="#10b981" />
        </div>
        <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-emerald-300/30 blur-2xl" />
      </div>
    ),
  },
  {
    title: 'Plug-and-play integrations',
    description:
      'Connect your CRM, inbox, and data sources in minutes. LeadPrime syncs continuously and never breaks your existing stack.',
    icon: Plug,
    className: 'sm:col-span-2',
    visual: <IntegrationChips />,
  },
  {
    title: '24/7 autonomous operation',
    description:
      'Agents work around the clock — qualifying inbound leads while you sleep and handing off warm conversations at sunrise.',
    icon: Clock,
    className: '',
    visual: (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-4">
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
          <span className="relative block h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>
        <p className="text-sm font-medium text-foreground">Live · always on</p>
      </div>
    ),
  },
  {
    title: 'Real-time intent filtering',
    description:
      'Surface buying signals the moment they appear. Suppress junk automatically and prioritize the leads most likely to convert.',
    icon: Filter,
    className: '',
    visual: (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 p-4">
        <Zap className="h-5 w-5 text-emerald-600" />
        <span className="text-sm font-medium text-foreground">
          Signal scored instantly
        </span>
      </div>
    ),
  },
  {
    title: 'Built for scale',
    description:
      'From a single founder to thousands of inbound leads a day — the same infrastructure grows with every stage of your pipeline.',
    icon: Boxes,
    className: 'sm:col-span-2',
    visual: (
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Leads / day', value: '12k+', icon: BarChart3 },
          { label: 'Avg. response', value: '< 2 min', icon: Zap },
          { label: 'Uptime', value: '99.99%', icon: Clock },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-border bg-background/70 p-3"
          >
            <s.icon className="h-4 w-4 text-emerald-600" />
            <p className="mt-2 font-display text-lg font-bold text-foreground">
              {s.value}
            </p>
            <p className="text-[0.7rem] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Platform
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Everything you need to qualify leads on autopilot.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            A complete infrastructure layer that finds, filters, and routes
            high-intent leads — so your team only talks to the people ready to
            buy.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-4 sm:grid-rows-3">
          {features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={i * 70}
              className={cn('sm:col-span-1', feature.className)}
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-xl hover:shadow-foreground/5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-emerald-600 transition-colors group-hover:bg-emerald-50">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-5">{feature.visual}</div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
