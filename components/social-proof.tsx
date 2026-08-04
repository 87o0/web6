'use client';

import { Reveal } from '@/components/reveal';

type Partner = {
  name: string;
  svg: React.ReactNode;
};

const PartnerLogo = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-2 text-foreground/55 transition-colors duration-300 hover:text-foreground/90">
    {children}
    <span className="font-display text-lg font-semibold tracking-tight">
      {label}
    </span>
  </div>
);

const partners: Partner[] = [
  {
    name: 'Northwind',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <path
          d="M3 22 L10 6 L14 14 L18 6 L25 22"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: 'Vertex',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <path d="M14 3 L25 22 L3 22 Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Loop',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2.2" />
        <path d="M14 4 a10 10 0 0 1 0 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Quanta',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
        <rect x="15" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
        <rect x="4" y="15" width="20" height="9" rx="2" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    name: 'Helix',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <path d="M6 4 C22 8 6 14 22 18 M22 4 C6 8 22 14 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M14 22 L14 25" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Monolith',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="9" y="3" width="10" height="22" rx="1.5" stroke="currentColor" strokeWidth="2.2" />
        <path d="M9 10 L19 10 M9 18 L19 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Cobalt',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="14" cy="14" r="4.5" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
];

export function SocialProof() {
  return (
    <section
      id="customers"
      className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Trusted by industry leaders
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Powering revenue teams at fast-moving companies.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-2 items-center gap-x-8 gap-y-10 border-y border-border/70 py-10 sm:grid-cols-3 lg:grid-cols-7">
            {partners.map((partner) => (
              <PartnerLogo key={partner.name} label={partner.name}>
                {partner.svg}
              </PartnerLogo>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
