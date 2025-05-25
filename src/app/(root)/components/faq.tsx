import { TitleText } from "@/src/shared/layout/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/shared/ui/accordion";
import { IconChevronRight } from "@tabler/icons-react";

const Faq = () => {
  return (
    <section
      id="faq"
      className="flex w-full flex-col bg-neutral-50 px-6 py-12 text-black"
    >
      <TitleText textStyles={`font-bebas text-lg text-neutral-400 uppercase`}>
        <h2>faq</h2>
      </TitleText>

      <Accordion
        className="flex w-full flex-col"
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        variants={{
          expanded: {
            opacity: 1,
            scale: 1,
          },
          collapsed: {
            opacity: 0,
            scale: 0.7,
          },
        }}
      >
        <AccordionItem value="getting-started" className="py-2">
          <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center">
              <IconChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
              <div className="accordion_title">What is Know?</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="accordion_content">
              Know is an e-commerce platform that empowers African artists by
              connecting them to a global marketplace. It simplifies showcasing,
              selling, and shipping artwork internationally while ensuring
              secure, low-cost transactions through blockchain and logistics
              integration.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="artist-payment" className="py-2">
          <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center">
              <IconChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
              <div className="accordion_title">How do artists get paid?</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="accordion_content">
              Artists receive payments in USDC (a stablecoin) on Stellar and can
              easily convert their earnings to local fiat currencies via an
              Anchor. Withdrawals can be made directly to bank accounts or
              mobile money wallets, with low fees and real-time transaction
              updates.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="buyer-payment" className="py-2">
          <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center">
              <IconChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
              <div className="accordion_title">
                Do buyers need to use cryptocurrency?
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="accordion_content">
              No. Buyers deposit fiat currency (e.g., USD, NGN) through Know’s
              Anchor integration. This fiat is converted into USDC in the
              background, enabling a seamless purchase experience without
              requiring crypto knowledge.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="safety" className="py-2">
          <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center">
              <IconChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
              <div className="accordion_title">
                Is it safe to buy art on Know?
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="accordion_content">
              Yes. Transactions are secure and transparent, thanks to blockchain
              integration with Stellar. Additionally, artists are verified, and
              shipments are tracked in real-time, ensuring a trustworthy
              experience for buyers.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="supported-currency" className="py-2">
          <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center">
              <IconChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
              <div className="accordion_title">
                What currencies are supported?
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="accordion_content">
              Fiat deposits in local currencies (such as NGN, USD, EUR) are
              supported via Link Anchor. These are automatically converted to
              USDC on the Stellar blockchain for smooth global transactions.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery-time" className="py-2">
          <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center">
              <IconChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
              <div className="accordion_title">
                How long does delivery take?
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="accordion_content">
              Delivery times depend on the destination and shipping tier
              selected. However, Know uses FedEx’s international network for
              reliable and timely delivery, and all shipments include real-time
              tracking.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="track-order" className="py-2">
          <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center">
              <IconChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
              <div className="accordion_title">Can I track my order?</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="accordion_content">
              Yes. Both artists and buyers receive real-time notifications on
              shipment status, including tracking links.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="wallet" className="py-2">
          <AccordionTrigger className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50">
            <div className="flex items-center">
              <IconChevronRight className="h-4 w-4 text-zinc-950 transition-transform duration-200 group-data-expanded:rotate-90 dark:text-zinc-50" />
              <div className="accordion_title">
                Do I need a crypto wallet to use Know?
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="origin-left">
            <p className="accordion_content">
              No. Know automatically creates a Stellar muxed account for every
              user. This allows you to send, receive, and track payments
              securely without needing to manage a traditional crypto wallet.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Faq;
