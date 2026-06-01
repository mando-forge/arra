import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { GlobalWrapper } from "@/components/layout/global-wrapper"

export function MethodologySection() {
  const faqItems = [
    {
      id: "item-1",
      question: "CLARITY OVER CHAOS",
      answer:
        "The noise of emerging technology is deafening. We filter out the hype and build tools that provide definitive clarity. If a tool doesn't simplify the complex, it doesn't leave the forge.",
    },
    {
      id: "item-2",
      question: "TRANSFORMATION OVER PROFIT",
      answer:
        "We are not here to build incremental improvements for quick exits. We are building infrastructure that changes how systems fundamentally operate. The mission dictates the revenue, not the reverse.",
    },
    {
      id: "item-3",
      question: "SILENCE UNTIL READINESS",
      answer:
        "We operate in stealth because the work demands focus. We do not announce intentions; we deploy capabilities. The bridge is revealed only when it is structurally sound enough to cross.",
    },
    {
      id: "item-4",
      question: "STRUCTURAL INTEGRITY",
      answer:
        "Code is law. Architecture is destiny. We obsess over the foundational stability of our platforms, ensuring they can withstand the massive scale of the future we are building toward.",
    }
  ]

  return (
    <section className="relative w-full flex-col items-center justify-center py-32">
      <GlobalWrapper>
          <div className="mb-16">
            <p className="text-primary text-sm tracking-[0.2em] uppercase font-bold mb-4">■ PHASE II ACTIVE</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-[0.2em] uppercase text-white leading-tight">THE<br/>VERGENCE<br/>PROTOCOL</h2>
            <p className="mt-8 text-sm tracking-[0.2em] text-white/50 uppercase border-l border-primary/50 pl-4 font-mono">HOW WE WIELD EMERGING TECH AS RAW ENERGY TO TRANSFORM SOCIETY.</p>
          </div>

          <div className="w-full lg:w-3/4 mx-auto border-t border-white/10 pt-10">
            <Accordion
              type="single"
              collapsible
              className="-mb-1 w-full"
              defaultValue="item-1"
            >
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="space-y-1 border-white/10"
                >
                  <AccordionTrigger className="group flex w-full justify-between py-6 hover:no-underline hover:text-primary transition-colors">
                    <div className="text-white max-w-[80%] cursor-pointer text-left text-xl md:text-2xl tracking-[0.2em] font-bold uppercase transition">
                      {item.question}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="flex justify-start pb-8">
                    <div className="text-white/60 max-w-[90%] text-base md:text-lg font-mono">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
      </GlobalWrapper>
    </section>
  )
}
