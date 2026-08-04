import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { HowItWorks } from '@/components/how-it-works';
import { SocialProof } from '@/components/social-proof';
import { Footer } from '@/components/footer';
import { PricingProvider } from '@/components/pricing-context';
import { PricingDialog } from '@/components/pricing-dialog';
import { TrialProvider } from '@/components/trial-context';
import { TrialDialog } from '@/components/trial-dialog';
import { GateDialog } from '@/components/gate-dialog';

export default function Home() {
  return (
    <PricingProvider>
      <TrialProvider>
        <div className="relative min-h-screen bg-background">
          <Navbar />
          <main>
            <Hero />
            <Features />
            <HowItWorks />
            <SocialProof />
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
