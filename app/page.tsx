import Hero from '@/components/homepage/hero';
import Features from '@/components/homepage/features';
import HowItWorks from '@/components/homepage/how-it-works';
import Testimonials from '@/components/homepage/testimonials';
import Pricing from '@/components/homepage/pricing';
import FAQ from '@/components/homepage/faq';
import CTA from '@/components/homepage/cta';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-background to-background/80">
        <Hero />
      </section>

      {/* Features Grid */}
      <section className="w-full py-20 bg-muted/50">
        <Features />
      </section>

      {/* How It Works */}
      <section className="w-full py-20">
        <HowItWorks />
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 bg-muted/50">
        <Testimonials />
      </section>

      {/* Pricing */}
      <section className="w-full py-20">
        <Pricing />
      </section>

      {/* FAQ */}
      <section className="w-full py-20 bg-muted/50">
        <FAQ />
      </section>

      {/* Call to Action */}
      <section className="w-full py-20">
        <CTA />
      </section>
    </main>
  );
}
