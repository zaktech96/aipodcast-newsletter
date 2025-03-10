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
      <div className="w-full">
        <HeroSection />
      </div>
      <div className="flex my-8 w-full justify-center items-center">
        <SideBySide />
      </div>
      <div className="flex flex-col p-2 w-full justify-center items-center">
        <MarketingCards />
      </div>
      <div className="flex justify-center items-center w-full my-[4rem] min-h-[200px]">
        <div className="w-full max-w-2xl mx-auto">
          <Pricing />
        </div>
      </div>
      <div className="flex justify-center items-center w-full my-[4rem] min-h-[200px]">
        <div className="w-full max-w-2xl mx-auto">
          <WaitlistForm />
        </div>
      </div>
      <div className="flex justify-center items-center w-full my-[4rem]">
        <FAQ />
      </div>
      
      <FloatingCTA />
    </PageWrapper>
  );
}
