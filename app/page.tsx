import MarketingCards from '@/components/homepage/marketing-cards';
import Pricing from '@/components/homepage/pricing';
import SideBySide from '@/components/homepage/side-by-side';
import PageWrapper from '@/components/wrapper/page-wrapper';
import { WaitlistForm } from '@/lib/components/waitlist-form';
import FloatingCTA from '@/components/homepage/floating-cta';
import FAQ from '@/components/homepage/faq';
import HeroSection from '@/components/homepage/hero-section';

export default function Home() {
  return (
    <PageWrapper>
      <section id="hero" className="w-full min-h-screen">
        <HeroSection />
      </section>
      
      <section id="features" className="flex py-24 md:py-32 w-full justify-center items-center">
        <SideBySide />
      </section>
      
      <section id="stack" className="flex flex-col py-24 md:py-32 w-full justify-center items-center">
        <MarketingCards />
      </section>
      
      <section id="pricing" className="flex justify-center items-center w-full py-24 md:py-32 min-h-[600px]">
        <div className="w-full max-w-6xl mx-auto">
          <Pricing />
        </div>
      </section>
      
      <section id="waitlist" className="flex justify-center items-center w-full py-24 md:py-32 min-h-[400px]">
        <div className="w-full max-w-2xl mx-auto">
          <WaitlistForm />
        </div>
      </section>
      
      <section id="faq" className="flex justify-center items-center w-full py-24 md:py-32">
        <FAQ />
      </section>
      
      <FloatingCTA />
    </PageWrapper>
  );
}
