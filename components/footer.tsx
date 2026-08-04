'use client';

import { usePricing } from '@/components/pricing-context';
import { useGate } from '@/components/gate-context';

type FooterLink = {
  label: string;
  target?: string;
  action?: 'pricing';
};

type FooterGroup = {
  title: string;
  links: FooterLink[];
};

const groups: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', target: 'how-it-works' },
      { label: 'Pricing', action: 'pricing' },
    ],
  },
  {
    title: 'Company',
    links: [{ label: 'About' }, { label: 'Contact' }],
  },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function Footer() {
  const { setOpen: setPricingOpen } = usePricing();
  const { requestPurchase } = useGate();

  return (
    <footer className="border-t border-border px-5 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="max-w-xs">
            <p className="font-display text-xl font-bold tracking-tight text-foreground">
              LeadPrime
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Autonomous AI infrastructure that finds, filters, and qualifies
              leads in real-time — so your team only talks to the people ready
              to buy.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-foreground">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.target ? (
                      <button
                        type="button"
                        onClick={() => scrollToSection(link.target!)}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </button>
                    ) : link.action === 'pricing' ? (
                      <button
                        type="button"
                        onClick={() => requestPurchase(() => setPricingOpen(true))}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            © 2026 LeadPrime, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
