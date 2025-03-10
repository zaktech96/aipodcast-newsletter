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
      <section id="hero" className="w-full">
        <HeroSection />
      </section>
      
      <section id="benefits" className="flex my-8 w-full justify-center items-center">
        <SideBySide />
      </section>
      
      <section id="technologies" className="flex flex-col p-2 w-full justify-center items-center">
        <MarketingCards />
      </section>
      
      <section id="pricing" className="flex justify-center items-center w-full my-[4rem] min-h-[200px]">
        <div className="w-full max-w-6xl mx-auto">
          <Pricing />
        </div>
      </section>
      
      <section id="waitlist" className="flex justify-center items-center w-full my-[4rem] min-h-[200px]">
        <div className="w-full max-w-2xl mx-auto">
          <WaitlistForm />
        </div>
      </section>
      
      <section id="faq" className="flex justify-center items-center w-full my-[4rem]">
        <FAQ />
      </section>
      
      <FloatingCTA />
    </PageWrapper>
  );
}
