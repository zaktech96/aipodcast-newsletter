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
      
      <section id="benefits" className="flex py-24 md:py-32 w-full justify-center items-center px-4 sm:px-6">
        <SideBySide />
      </section>
      
      <section id="stack" className="flex flex-col py-24 md:py-32 w-full justify-center items-center px-4 sm:px-6">
        <MarketingCards />
      </section>
      
      <section id="pricing" className="flex justify-center items-center w-full py-24 md:py-32 min-h-[600px] px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <Pricing />
        </div>
      </section>
      
      <section id="waitlist" className="flex justify-center items-center w-full py-24 md:py-32 min-h-[400px] px-4 sm:px-6">
        <div className="w-full max-w-2xl mx-auto">
          <WaitlistForm />
        </div>
      </section>
      
      <section id="faq" className="flex justify-center items-center w-full py-24 md:py-32 px-4 sm:px-6">
        <FAQ />
      </section>
      
      <FloatingCTA />
    </PageWrapper>
  );
}
