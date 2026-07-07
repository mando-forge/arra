import { useEffect } from "react"
import Lenis from "lenis"
import { ArrowRight, Mail, MapPin } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArraEvidenceItem,
  ArraField,
  ArraReveal,
  ArraSection,
  EngravingFigure,
} from "@/components/arra"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  contactIntents,
  faqs,
  images,
  mailToPilot,
  principles,
  trustItems,
} from "@/content/arra"
import { Header } from "@/layout/header"

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { MagicCard } from "@/components/ui/magic-card"
import { TextEffect } from "@/components/ui/text-effect"
import { AnimatedGroup } from "@/components/ui/animated-group"

const fieldNotes = [
  "Regional infrastructure realities",
  "Human workflows and coordination",
  "Responsible technology foundations",
]

const operatingNotes = [
  "Listen before defining",
  "Study before building",
  "Decide with evidence",
  "Share only when ready",
]

const heroMeta = ["ARRA CORE / v0.1.0", "Northeast India", "Research stage"]

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ anchors: true })
    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-3 focus:text-xs focus:font-semibold focus:text-background"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Vision />
        <Approach />
        <Principles />
        <FAQ />
        <Contact />
      </main>
    </div>
  )
}

function Hero() {
  return (
    <section
      id="home"
      className="arra-section surface-split pt-24 pb-14 md:pt-28 md:pb-18"
    >
      <div className="editorial-shell">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_30rem] xl:items-end">
          <ArraReveal className="grid gap-8">
            <div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 pb-4">
                {heroMeta.map((item) => (
                  <span key={item} className="mono-label">
                    {item}
                  </span>
                ))}
              </div>
              <h1 className="serif-display mt-7 max-w-5xl text-[clamp(3.25rem,10vw,7rem)] leading-[0.92] text-balance uppercase">
                <TextEffect per="word" preset="fade">
                  Technology for Northeast India
                </TextEffect>
              </h1>
            </div>

            <div className="grid gap-6 pt-8 md:grid-cols-[0.85fr_1fr]">
              <p className="body-copy opacity-[0.84]">
                ARRA is an early-stage technology company focused on thoughtful
                innovation and long-term regional transformation.
              </p>
              <AnimatedGroup preset="fade" className="compact-copy opacity-[0.74]">
                <p>We are building quietly, with care, discipline, and respect for what is still taking shape.</p>
                <p>No inflated claims. No premature roadmap.</p>
                <p>Just the foundation for serious work.</p>
              </AnimatedGroup>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#vision">
                <InteractiveHoverButton className="h-12 px-7 font-mono text-xs font-semibold uppercase sm:h-14 sm:px-8 sm:text-sm">
                  Explore the vision
                </InteractiveHoverButton>
              </a>
              <Button
                asChild
                variant="outline"
                className="arra-cta h-12 border-foreground/20 bg-transparent px-7 font-mono text-xs font-semibold text-foreground uppercase hover:bg-foreground hover:text-background sm:h-14 sm:px-8 sm:text-sm"
              >
                <a href="#contact">
                  <span className="hidden sm:inline">
                    Start a conversation
                  </span>
                  <span className="sm:hidden">Contact</span>
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </ArraReveal>

          <ArraReveal delay={100}>
            <EngravingFigure
              src={images.hero.src}
              alt={images.hero.alt}
              loading="eager"
              tone="light"
              className="w-full max-w-[30rem] justify-self-start xl:max-w-none"
              frameClassName="aspect-[16/10]"
              imageClassName="object-center"
              meta={
                <span className="flex justify-between gap-4">
                  <span>Founder signal</span>
                  <span>Northeast India</span>
                </span>
              }
            />
          </ArraReveal>
        </div>
      </div>
    </section>
  )
}

function Vision() {
  return (
    <ArraSection
      id="vision"
      tone="light"
      eyebrow="Vision"
      title="Real conditions before assumptions"
      description="Meaningful progress begins with understanding the people, systems, and environments a company serves. ARRA's long-term ambition is to contribute to a stronger, more connected Northeast India through work that is practical, reliable, and relevant."
    >
      <div className="mt-9 grid gap-6 lg:grid-cols-[0.95fr_1fr]">
        <ArraReveal>
          <EngravingFigure
            src={images.topographic.src}
            alt={images.topographic.alt}
            tone="light"
            frameClassName="aspect-[16/11] min-h-[20rem] md:min-h-[24rem]"
            meta="Regional perspective"
            caption={
              <h3 className="serif-display max-w-xl text-3xl leading-[0.96] uppercase md:text-4xl">
                Shaped by place. Built for wider relevance.
              </h3>
            }
          />
        </ArraReveal>

        <ArraReveal delay={90}>
          <div className="grid h-full bg-muted overflow-hidden">
            <div className="p-7 md:p-8">
              <p className="mono-label">Field discipline</p>
              <h3 className="serif-display mt-7 max-w-xl text-3xl leading-[0.96] uppercase md:text-4xl">
                Start with the region
              </h3>
              <p className="body-copy mt-5 opacity-[0.78]">
                Northeast India is not a backdrop. Its complexity,
                infrastructure realities, and potential shape how ARRA thinks
                about technology and long-term value.
              </p>
            </div>
            <div className="mx-7 md:mx-8">
              {fieldNotes.map((item, index) => (
                <div
                  key={item}
                  className="grid grid-cols-[3rem_1fr] items-center border-t border-foreground/10 py-4"
                >
                  <span className="mono-label">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-6 font-semibold">{item}</p>
                </div>
              ))}
            </div>
            <div className="h-7 md:h-8" />
          </div>
        </ArraReveal>
      </div>
    </ArraSection>
  )
}

function Approach() {
  return (
    <ArraSection
      id="approach"
      tone="blue"
      eyebrow="Approach"
      title="Careful work before public claims"
      description="ARRA is in a formative stage. Our focus is on internal research, observation, and disciplined thinking so future decisions can be made with clarity."
    >
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle, index) => (
            <ArraReveal key={principle.title} delay={index * 45}>
              <MagicCard 
                className="grid min-h-52 content-between p-6 border-0 shadow-none bg-white/8 backdrop-blur-sm cursor-pointer text-current"
                gradientColor="rgba(255,255,255,0.15)"
              >
                <p className="mono-label relative z-10 opacity-60">0{index + 1}</p>
                <div className="relative z-10">
                  <h3 className="text-lg leading-6 font-semibold">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 opacity-[0.65]">
                    {principle.body}
                  </p>
                </div>
              </MagicCard>
            </ArraReveal>
          ))}
        </div>

        <ArraReveal className="mt-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="p-7 md:p-8 bg-white/8 backdrop-blur-sm">
              <h3 className="serif-display max-w-3xl text-3xl leading-[0.96] uppercase md:text-4xl">
                No product claims, technical choices, or roadmaps yet
              </h3>
              <p className="body-copy mt-5 opacity-[0.7]">
                Those decisions will be shaped over time by real requirements,
                evidence, and usefulness. For now, our responsibility is to
                build the foundation carefully and communicate with restraint.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {operatingNotes.map((note, index) => (
                <div
                  key={note}
                  className="grid min-h-32 content-between bg-white/8 backdrop-blur-sm p-6"
                >
                  <p className="mono-label opacity-60">Note 0{index + 1}</p>
                  <p className="text-base leading-6 font-semibold">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </ArraReveal>
    </ArraSection>
  )
}

function Principles() {
  return (
    <ArraSection
      id="principles"
      tone="light"
      eyebrow="Principles"
      title="Accountability starts before launch"
      description="Even before a public product, these commitments guide how ARRA evaluates ideas and shapes internal work."
    >
      <div className="mt-9 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <ArraReveal>
          <EngravingFigure
            src={images.governance.src}
            alt={images.governance.alt}
            tone="light"
            frameClassName="aspect-[16/12] min-h-[18rem]"
            meta="Trust posture"
            caption={
              <h3 className="serif-display text-3xl leading-[0.96] uppercase md:text-4xl">
                <TextEffect per="word" preset="fade">
                  Responsible foundations, early
                </TextEffect>
              </h3>
            }
          />
        </ArraReveal>

        <div className="grid gap-3 sm:grid-cols-2">
          {trustItems.map(({ icon, text, body }, index) => (
            <ArraReveal key={text} delay={index * 35}>
              <ArraEvidenceItem icon={icon} title={text} body={body} />
            </ArraReveal>
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
      tone="split"
      eyebrow="FAQ"
      title="Direct answers for an early company"
      description="ARRA is preparing with intention. These answers clarify the current stage without overstatement."
    >
      <div className="mt-9 grid gap-8 lg:grid-cols-[0.42fr_1fr]">
        <ArraReveal>
          <aside className="sticky top-28 p-7 bg-muted">
            <p className="mono-label">Public language</p>
            <h3 className="serif-display mt-8 text-3xl leading-[0.96] uppercase md:text-4xl">
              Clear. Measured. No inflated promise.
            </h3>
            <p className="body-copy mt-5 opacity-[0.68]">
              ARRA is not announcing a product, partnership, or public roadmap
              yet. The current message is simple: the company is preparing with
              intention.
            </p>
          </aside>
        </ArraReveal>

        <ArraReveal delay={90}>
          <div>
            <Accordion type="single" collapsible defaultValue="item-0">
              {faqs.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${index}`}
                  className="px-1 py-4 border-b border-foreground/10 last:border-0"
                >
                  <AccordionTrigger className="text-left text-lg leading-6 font-semibold hover:no-underline md:text-xl">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="body-copy pb-5 opacity-[0.68]">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ArraReveal>
      </div>
    </ArraSection>
  )
}

function Contact() {
  return (
    <section
      id="contact"
      className="arra-section surface-blue py-16 md:py-20"
    >
      <div className="editorial-shell">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_28rem]">
          <ArraReveal>
            <div className="grid min-h-[28rem] min-w-0 content-between gap-10">
              <div>
                <p className="mono-label">Contact</p>
                <h2 className="serif-display mt-7 max-w-3xl text-[2.45rem] leading-[0.94] text-balance uppercase sm:text-[clamp(3rem,5.8vw,5.75rem)] sm:leading-[0.92]">
                  Start a conversation
                </h2>
                <p className="body-copy mt-5 opacity-[0.78]">
                  We welcome thoughtful conversations with founders,
                  collaborators, and individuals aligned with serious long-term
                  work.
                </p>
              </div>

              <div className="grid max-w-md gap-3">
                <a
                  href="mailto:transmission@arra.tech"
                  className="flex items-center gap-4 bg-white/10 px-6 py-3.5 transition-colors hover:bg-white/20"
                >
                  <Mail className="size-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 text-sm leading-6 font-semibold break-words md:text-base">
                    transmission@arra.tech
                  </span>
                </a>
                <div className="flex items-center gap-4 bg-white/10 px-6 py-3.5">
                  <MapPin className="size-5 shrink-0" aria-hidden="true" />
                  <span className="text-sm leading-6 font-semibold md:text-base">
                    Northeast India
                  </span>
                </div>
              </div>
            </div>
          </ArraReveal>

          <ArraReveal delay={100}>
            <form
              action={mailToPilot}
              method="post"
              encType="text/plain"
              className="surface-light w-full max-w-full min-w-0 p-7 md:p-8"
            >
              <div className="grid gap-5">
                <ArraField label="Name">
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    className="contact-field px-4 focus-visible:ring-0 dark:bg-transparent"
                  />
                </ArraField>
                <ArraField label="Email">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="contact-field px-4 focus-visible:ring-0 dark:bg-transparent"
                  />
                </ArraField>
                <ArraField label="Conversation type">
                  <select
                    id="intent"
                    name="intent"
                    className="contact-field w-full appearance-none px-4 py-2 outline-none focus-visible:ring-0 bg-transparent"
                    defaultValue={contactIntents[0]}
                  >
                    {contactIntents.map((intent) => (
                      <option key={intent} className="bg-background text-foreground">
                        {intent}
                      </option>
                    ))}
                  </select>
                </ArraField>
                <ArraField
                  label="Message"
                  hint="This frontend-only form opens your email client with the message content."
                >
                  <Textarea
                    id="message"
                    name="message"
                    className="contact-field min-h-36 resize-none px-4 py-3 focus-visible:ring-0 dark:bg-transparent"
                    required
                  />
                </ArraField>
              </div>
              <Button
                type="submit"
                className="mt-7 h-13 w-full bg-foreground px-6 font-mono text-sm font-semibold text-background uppercase tracking-wide hover:bg-foreground/90"
              >
                Send message
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </form>
          </ArraReveal>
        </div>
      </div>

      <Footer />
    </section>
  )
}

function Footer() {
  const groups = [
    { title: "Company", links: ["Vision", "Approach", "Principles"] },
    { title: "Stage", links: ["Early-stage", "Research", "Preparation"] },
    { title: "Focus", links: ["Northeast India", "Innovation", "Trust"] },
  ]

  return (
    <footer className="editorial-shell mt-10 pt-8">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="serif-display text-4xl leading-none uppercase">ARRA</p>
          <p className="compact-copy mt-4 opacity-[0.74]">
            An early-stage technology company from Northeast India, focused on
            thoughtful innovation and long-term regional transformation.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mono-label text-[0.64rem]">{group.title}</p>
              <div className="mt-4 grid gap-2 text-sm opacity-[0.74]">
                {group.links.map((link) => (
                  <span key={link}>{link}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4 pt-6 text-xs md:flex-row md:items-center md:justify-between">
        <p className="opacity-[0.74]">ARRA. Technology for Northeast India.</p>
        <div className="flex flex-wrap gap-5">
          <a className="opacity-[0.74] hover:opacity-100" href="#home">
            Home
          </a>
          <a className="opacity-[0.74] hover:opacity-100" href="#approach">
            Approach
          </a>
          <a className="opacity-[0.74] hover:opacity-100" href="#contact">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
