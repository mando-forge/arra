import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArraEvidenceItem,
  ArraReveal,
  ArraSection,
  EngravingFigure,
} from "@/components/arra"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { BlurFade } from "@/components/ui/blur-fade"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Typewriter } from "@/components/typewriter"
import { faqs, images, principles, trustItems } from "@/content/arra"

const fieldNotes = [
  "Regional infrastructure realities",
  "Human workflows and coordination",
  "Responsible technology foundations",
]

const operatingNotes = [
  "Listen before defining",
  "Study before building",
  "Decide with evidence",
  "Share when the work is ready",
]

export default function Home() {
  return (
    <>
      <Hero />
      <Posture />
      <Approach />
      <Principles />
      <FAQ />
    </>
  )
}


function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="home" className="relative overflow-hidden min-h-[min(calc(100vh-6.75rem),50rem)] flex items-center py-12 md:py-16 lg:py-0 px-6 md:px-12 lg:px-24">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {!shouldReduceMotion && (
          <FlickeringGrid
            className="absolute inset-0 size-full z-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-30"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
          />
        )}
      </div>

      <div className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 sm:gap-10 lg:gap-12 items-center max-w-7xl mx-auto">
        {/* Left Column — Text */}
        <div className="flex flex-col items-start">
          <BlurFade delay={0.2} inView>
            <h1 className="font-serif text-[clamp(2.5rem,4.2vw,4rem)] font-semibold leading-[1.08] tracking-[-0.025em]">
              <span className="sr-only">
                Rethinking technology and ecology, geography, context, design, systems
              </span>
              <span aria-hidden="true">
                Rethinking technology
                <br />
                and{" "}
                <Typewriter
                  words={["ecology", "geography", "context", "design", "systems"]}
                  className="text-[var(--arra-ochre)]"
                  speed={80}
                  delayBetweenWords={2500}
                  cursorChar="|"
                />
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.35} inView>
            <span className="block w-12 h-[2px] mt-8 bg-[var(--arra-ochre)]" aria-hidden="true" />
          </BlurFade>

          <BlurFade delay={0.5} inView>
            <p className="mt-6 text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[1.45] text-foreground/75 max-w-[26rem]">
              Thoughtful innovation,<br />
              grounded in place.
            </p>
          </BlurFade>

          <BlurFade delay={0.65} inView>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 mt-10">
              <InteractiveHoverButton href="#vision" className="h-13 px-6 text-sm bg-primary-foreground text-primary">
                Explore the vision
              </InteractiveHoverButton>
              <Link
                className="inline-flex items-center gap-3 py-2 border-b border-current text-[0.92rem] hover:text-primary transition-colors group ml-2 sm:ml-4"
                to="/contact"
              >
                Start a conversation
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </BlurFade>
        </div>

        {/* Right Column — Video */}
        <motion.div 
          initial={{ opacity: 0, clipPath: "inset(10% 0% 10% 0%)" }}
          animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative w-full aspect-[4/3] sm:aspect-[8/5] max-h-[min(70vh,34rem)] 3xl:max-h-[min(70vh,42rem)] mx-auto overflow-hidden rounded-none animate-pulse-once bg-muted/10"
        >
          <video
            autoPlay={!shouldReduceMotion}
            muted={true}
            loop={!shouldReduceMotion}
            playsInline={true}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src="/video/home-hero-bg.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>
    </section>
  )
}

function Posture() {
  return (
    <section id="vision" className="arra-section surface-split py-20 md:py-28 px-6 md:px-12 lg:px-24">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid gap-16 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] items-start">
          <ArraReveal>
            <p className="eyebrow text-[var(--arra-fjord)]">Our posture</p>
            <h2 className="mt-5 font-serif text-[clamp(2.65rem,3.3vw,3.1rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
              Clarity before scale.<br />
              Context over assumption.
            </h2>
            <p className="body-copy mt-6">
              ARRA is an early-stage technology company focused on thoughtful
              innovation and long-term regional transformation. We work to
              understand the right problems before shaping solutions.
            </p>
            <div className="mt-8 border-t border-border group/list" aria-label="Fields of attention">
              {fieldNotes.map((item, index) => (
                <div 
                  key={item} 
                  className="grid grid-cols-[3rem_1fr] gap-4 py-4 border-b border-border transition-all duration-300 hover:pl-2 group-hover/list:opacity-50 hover:!opacity-100 cursor-default"
                >
                  <span className="font-mono text-[0.7rem] text-[var(--arra-fjord)] transition-colors duration-300">0{index + 1}</span>
                  <p className="text-[0.95rem] font-medium transition-colors duration-300">{item}</p>
                </div>
              ))}
            </div>
          </ArraReveal>

          <ArraReveal>
            <EngravingFigure
              src={images.topographic.src}
              alt={images.topographic.alt}
              frameClassName="aspect-[3/1] w-full h-full"
              imageClassName="object-contain"
            />
          </ArraReveal>
        </div>
      </div>
    </section>
  )
}

function Approach() {
  return (
    <ArraSection
      id="approach"
      tone="light"
      eyebrow="Working method"
      title="Careful work before public claims"
      description="ARRA is in a formative stage. Research, observation, and disciplined thinking give future decisions a stronger foundation."
      className="border-t border-foreground/10"
    >
      <div className="grid md:grid-cols-2 3xl:grid-cols-4 border-t border-border mt-14">
        {principles.map((principle, index) => (
          <article 
            key={principle.title} 
            className="grid min-h-[15rem] content-between p-6 border-b border-border md:even:border-l-[0px] md:odd:border-r transition-all duration-300 hover:bg-[var(--arra-mist)]/30 group/principle"
          >
            <ArraReveal className="h-full flex flex-col justify-between">
              <p className="eyebrow transition-colors duration-300 group-hover/principle:text-[var(--arra-ochre)]">0{index + 1}</p>
              <div className="mt-8">
                <h3 className="font-serif text-[1.8rem] font-semibold leading-[1.05]">{principle.title}</h3>
                <p className="mt-4 text-[0.94rem] leading-[1.6] text-foreground/70">{principle.body}</p>
              </div>
            </ArraReveal>
          </article>
        ))}
      </div>

      <ArraReveal className="grid gap-10 mt-16 p-6 md:p-11 bg-[var(--arra-mist)] text-[var(--arra-spruce)] md:grid-cols-[minmax(0,1.1fr)_minmax(17rem,0.7fr)]">
        <div>
          <p className="eyebrow">Operating notes</p>
          <h3 className="max-w-[39rem] mt-4 font-serif text-[clamp(2rem,3.5vw,3.5rem)] font-semibold leading-none">No premature roadmap. No inflated promise.</h3>
        </div>
        <ol className="border-t border-[var(--arra-spruce)]/20 group/ops">
          {operatingNotes.map((note, index) => (
            <li 
              key={note} 
              className="grid grid-cols-[3rem_1fr] py-3 border-b border-[var(--arra-spruce)]/20 text-[0.95rem] transition-all duration-300 hover:pl-2 group-hover/ops:opacity-50 hover:!opacity-100 cursor-default"
            >
              <span className="font-mono text-[0.68rem] text-[var(--arra-fjord)]">0{index + 1}</span>
              <span className="transition-colors duration-300">{note}</span>
            </li>
          ))}
        </ol>
      </ArraReveal>
    </ArraSection>
  )
}

function Principles() {
  return (
    <ArraSection
      id="principles"
      tone="split"
      eyebrow="Responsible foundations"
      title="Accountability starts before launch"
      description="Even before a public product, these commitments guide how ARRA evaluates ideas and shapes internal work."
      className="border-t border-foreground/10"
    >
      <div className="grid gap-14 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] items-start mt-14">
        <ArraReveal>
          <EngravingFigure
            src={images.governance.src}
            alt={images.governance.alt}
            frameClassName="aspect-[4/3]"
            meta="Field note 03 · Responsible foundations"
            caption={
              <h3 className="serif-display text-3xl leading-tight md:text-4xl">
                Technology should keep human responsibility in view.
              </h3>
            }
          />
        </ArraReveal>

        <div className="grid md:grid-cols-2 border-t border-border">
          {trustItems.slice(0, 6).map(({ icon, text, body }, index) => (
            <article 
              key={text} 
              className="grid min-h-[13.5rem] content-between p-6 border-b border-border md:even:border-l-[0px] md:odd:border-r transition-all duration-300 hover:bg-muted/10 group/trust"
            >
              <ArraReveal className="h-full w-full">
                <ArraEvidenceItem 
                  icon={icon} 
                  title={text} 
                  body={body}
                  index={index}
                  className="h-full bg-transparent shadow-none p-0 md:p-0 min-h-0"
                />
              </ArraReveal>
            </article>
          ))}
        </div>
      </div>
    </ArraSection>
  )
}

function FAQ() {
  return (
    <ArraSection
      id="faq"
      tone="light"
      eyebrow="Questions"
      title="Direct answers for an early company"
      description="ARRA is preparing with intention. These answers clarify the current stage without overstatement."
      className="border-t border-foreground/10"
    >
      <div className="grid gap-14 md:grid-cols-[minmax(15rem,0.58fr)_minmax(0,1.42fr)] items-start mt-14">
        <ArraReveal>
          <aside className="p-7 bg-[var(--arra-mist)] text-[var(--arra-spruce)] md:sticky md:top-28 border border-border/20">
            <p className="eyebrow">Public language</p>
            <h3 className="mt-5 font-serif text-[2.35rem] font-semibold leading-none">Clear, measured, and useful.</h3>
            <span className="block w-10 h-[2px] mt-5 bg-[var(--arra-ochre)]" aria-hidden="true" />
            <p className="mt-5 text-[0.95rem] leading-[1.65]">
              We are not announcing a product, partnership, or public roadmap
              yet. The current message is simple: the company is preparing
              with intention.
            </p>
          </aside>
        </ArraReveal>

        <ArraReveal>
          <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-border">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`} className="border-b border-border">
                <AccordionTrigger className="group/faq flex items-center gap-5 w-full py-6 text-left no-underline hover:no-underline transition-all duration-300">
                  <span className="flex items-center justify-center size-9 shrink-0 rounded-sm border border-border/50 bg-transparent font-mono text-[0.65rem] text-muted-foreground/60 tracking-[0.15em] transition-all duration-300 group-hover/faq:border-[var(--arra-ochre)]/40 group-hover/faq:text-[var(--arra-ochre)] group-hover/faq:bg-[var(--arra-ochre)]/5 group-aria-expanded/accordion-trigger:border-[var(--arra-ochre)]/40 group-aria-expanded/accordion-trigger:text-[var(--arra-ochre)] group-aria-expanded/accordion-trigger:bg-[var(--arra-ochre)]/5">
                    0{index + 1}
                  </span>
                  <span className="font-serif text-[clamp(1.25rem,2vw,1.65rem)] font-semibold leading-[1.25] tracking-[-0.01em] transition-colors duration-300 group-hover/faq:text-primary">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pl-5 sm:pl-14 pr-4 sm:pr-6 text-[0.98rem] leading-[1.75] text-foreground/70">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ArraReveal>
      </div>
    </ArraSection>
  )
}

