'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Users,
  TrendingUp,
  Gauge,
  Activity,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Metric = {
  label: string;
  value: number;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
};

const METRIC_CONFIG: Omit<Metric, 'value'>[] = [
  {
    label: 'Total leads found',
    delta: 'Awaiting data',
    trend: 'flat',
    icon: Users,
  },
  {
    label: 'Category A leads',
    delta: 'Score 8–10',
    trend: 'flat',
    icon: TrendingUp,
    accent: true,
  },
  {
    label: 'Category B leads',
    delta: 'Score 5–7',
    trend: 'flat',
    icon: Gauge,
  },
  {
    label: 'Total touches spent',
    delta: 'Awaiting data',
    trend: 'flat',
    icon: Activity,
  },
];

type LiveEvent = {
  id: string;
  company: string;
  channel: string;
  score: number;
  category: 'A' | 'B';
  status: string;
  time: string;
};

export default function DashboardPage() {
  const { session, status } = useAuth();

  const metrics: Metric[] = METRIC_CONFIG.map((m) => ({ ...m, value: 0 }));

  const [events, setEvents] = React.useState<LiveEvent[]>([]);

  const activeNow = events.length;
  const activeCategoryA = events.filter((e) => e.category === 'A').length;

  const user = session?.user;
  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'LP';

  return (
    <div className="min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[280px] bg-gradient-to-b from-emerald-50/60 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-6 lg:px-8">
        <Header
          status={status}
          userName={user?.name ?? 'Not signed in'}
          userEmail={user?.email ?? ''}
          userImage={user?.image}
          initials={initials}
        />

        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Real-time overview of your lead qualification pipeline.
              </p>
            </div>
          </div>

          <SummaryCards metrics={metrics} />
          <LiveActivityFeed
            events={events}
            activeNow={activeNow}
            activeCategoryA={activeCategoryA}
          />
        </div>
      </div>
    </div>
  );
}

function Header({
  status,
  userName,
  userEmail,
  userImage,
  initials,
}: {
  status: 'authenticated' | 'unauthenticated';
  userName: string;
  userEmail: string;
  userImage?: string;
  initials: string;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Avatar className="h-11 w-11 ring-2 ring-background shadow-sm">
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {userName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {userEmail || 'Not signed in'}
          </p>
        </div>
        {status === 'authenticated' ? (
          <Badge className="ml-1 border-emerald-200 bg-emerald-100 text-emerald-700">
            Active
          </Badge>
        ) : null}
      </div>

      <Link href="/dashboard/media">
        <Button className="h-10 rounded-full px-5 font-semibold shadow-sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Media Catalog
        </Button>
      </Link>
    </header>
  );
}

function SummaryCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} metric={m} />
      ))}
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const { label, value, delta, trend, icon: Icon, accent } = metric;
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-shadow hover:shadow-md',
        accent && 'border-emerald-200'
      )}
    >
      {accent ? (
        <div
          aria-hidden
          className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-emerald-100/70"
        />
      ) : null}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs font-medium uppercase tracking-wide">
            {label}
          </CardDescription>
          <span
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-lg',
              accent
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl font-bold tracking-tight text-foreground">
          {value.toLocaleString()}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'font-medium',
              trend === 'up' && 'text-emerald-600',
              trend === 'down' && 'text-foreground/70',
              trend === 'flat' && 'text-muted-foreground'
            )}
          >
            {delta}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveActivityFeed({
  events,
  activeNow,
  activeCategoryA,
}: {
  events: LiveEvent[];
  activeNow: number;
  activeCategoryA: number;
}) {
  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Live activity feed
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 bg-secondary py-1.5 pl-2 pr-3 text-foreground"
            >
              <Activity className="h-3.5 w-3.5 text-emerald-600" />
              {activeNow} processing now
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 border-emerald-200 bg-emerald-100 py-1.5 pl-2 pr-3 text-emerald-700"
            >
              <Zap className="h-3.5 w-3.5" />
              {activeCategoryA} Category A active
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Leads being actively processed by your qualification agents in
          real-time.
        </p>

        {events.length === 0 ? (
          <div className="mt-1 flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
              <Activity className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              No activity yet
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Live lead events will appear here as your qualification agents
              process incoming leads.
            </p>
          </div>
        ) : (
          <div className="mt-1 divide-y divide-border/70 overflow-hidden rounded-lg border border-border/60">
            {events.map((e) => (
              <ActivityRow key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ActivityRow({ event }: { event: LiveEvent }) {
  const isA = event.category === 'A';
  return (
    <div className="flex items-center gap-3 bg-background/40 px-4 py-3 transition-colors hover:bg-secondary/40">
      <span
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          isA
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        {event.score}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {event.company}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          via {event.channel}
        </p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          'shrink-0',
          isA
            ? 'border-emerald-300 text-emerald-700'
            : 'border-border text-muted-foreground'
        )}
      >
        Cat {event.category}
      </Badge>
      <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
        {event.status}
      </span>
      <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {event.time}
      </span>
    </div>
  );
}
