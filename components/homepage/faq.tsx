import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';

export function FAQ() {
  return (
    <div className="flex flex-col w-[70%] lg:w-[50%]">
      <h2
        className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold text-center tracking-tight dark:text-white text-gray-900`}
      >
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full mt-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <span className="font-medium">What's included in the Titan boilerplate?</span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Titan includes everything you need to build a modern SaaS: NextJS, TypeScript,
              Tailwind CSS, authentication with Clerk, database with Supabase/Prisma, payments with
              Stripe, and emails with Plunk. It's all pre-configured and ready to use.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <span className="font-medium">How do I get started with Titan?</span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Getting started is simple. Clone the repository, install dependencies, and you're
              ready to go. We provide comprehensive documentation and examples to help you
              understand the codebase and start building right away.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <span className="font-medium">Can I customize the boilerplate?</span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Absolutely! Titan is designed to be fully customizable. You can modify the UI, add or
              remove features, change the styling, and adapt it to your specific needs. The codebase
              is well-organized and follows best practices for easy modification.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            <span className="font-medium">Is Titan suitable for production?</span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Yes! Titan is built with production in mind. It includes essential security features,
              performance optimizations, and follows best practices for scalability.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
