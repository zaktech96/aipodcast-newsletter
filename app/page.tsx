import { AccordionComponent } from '@/components/homepage/accordion-component';
import { Footer } from '@/components/wrapper/footer';
import HeroSection from '@/components/homepage/hero-section';
import MarketingCards from '@/components/homepage/marketing-cards';
import Pricing from '@/components/homepage/pricing';
import SideBySide from '@/components/homepage/side-by-side';
import PageWrapper from '@/components/wrapper/page-wrapper';
import config from '@/config';
import { WaitlistForm } from '@/lib/components/waitlist-form';
import { PaymentSetupNotice } from '@/components/payment-setup-notice';
import { EmailSetupNotice } from '@/components/email-setup-notice';

export default function Home() {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
        <HeroSection />
      </div>
      <div className="flex my-[8r em] w-full justify-center items-center">
        <SideBySide />
      </div>
      <div className="flex flex-col p-2 w-full justify-center items-center">
        <MarketingCards />
      </div>
      <div className="flex justify-center items-center w-full my-[4rem] min-h-[200px]">
        <div className="w-full max-w-2xl mx-auto">
          {config.payments.enabled ? <Pricing /> : <PaymentSetupNotice />}
        </div>
      </div>
      <div className="flex justify-center items-center w-full my-[4rem] min-h-[200px]">
        <div className="w-full max-w-2xl mx-auto">
          {config.email.enabled ? <WaitlistForm /> : <EmailSetupNotice />}
        </div>
      </div>
      <div className="flex justify-center items-center w-full my-[4rem]">
        <AccordionComponent />
      </div>
    </PageWrapper>
  );
}
