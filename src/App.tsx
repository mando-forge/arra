import { useEffect, useRef, type Ref } from "react"
import Lenis from "lenis"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArraBentoCard,
  ArraEvidenceItem,
  ArraField,
  ArraReveal,
  ArraSection,
  TopographicPanel,
} from "@/components/arra"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Marquee } from "@/components/ui/marquee"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { TextReveal } from "@/components/ui/text-reveal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  audienceCards,
  contactIntents,
  enterpriseChecklist,
  faqs,
  images,
  mailToPilot,
  operatingSteps,
  principles,
  productAreas,
  readinessSignals,
  roadmap,
  storyMarkers,
  trustItems,
} from "@/content/arra"
import { Header } from "@/layout/header"
import { cn } from "@/lib/utils"

export default function App() {
  useEffect(() => {
    const lenis = new Lenis()
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="relative z-10">
        <Hero />
        <Vision />
        <Philosophy />
        <Products />
        <Audience />
        <OperatingModel />
        <EnterpriseReadiness />
        <Roadmap />
        <Trust />
        <FAQ />
        <Contact />
      </main>
    </div>
  )
}

function Hero() {
  return (
    <section id="home" className="relative isolate min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-20">
      <FlickeringGrid 
        className="absolute inset-0 -z-10 opacity-35"
        squareSize={4}
        gridGap={6}
        color="#8B5CF6"
        maxOpacity={0.25}
        flickerChance={0.15}
      />
      
      <div className="container-enterprise text-center">
        <ArraReveal delay={150}>
          <h1 className="text-[18vw] leading-[0.8] font-bold tracking-tighter text-foreground uppercase drop-shadow-2xl">
            ARRA
          </h1>
        </ArraReveal>
        <ArraReveal delay={300}>
          <p className="mt-6 text-2xl md:text-4xl font-medium tracking-tight text-muted-foreground mx-auto max-w-4xl">
            Where clarity begins. Context, intelligence, and direction for work that is still being shaped with patience.
          </p>
        </ArraReveal>
        <ArraReveal delay={450}>
          <div className="mt-12 flex justify-center gap-4">
            <InteractiveHoverButton href="#vision" className="text-sm px-8 h-14 border-primary/20 hover:border-primary/50">
              Explore the vision
            </InteractiveHoverButton>
          </div>
        </ArraReveal>
      </div>
    </section>
  )
}

function Vision() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])

  return (
    <ArraSection
      id="vision"
      eyebrow="Vision"
      title="A patient attempt to make technology more understandable."
      description="ARRA is still early. The work is focused on learning how context, intelligence, and direction can help people move through complex work with more clarity."
    >
      <div className="mt-14 grid items-start gap-10 lg:grid-cols-[0.86fr_1fr]">
        <ArraReveal>
          <TopographicPanel className="min-h-[560px]" ref={containerRef}>
            <motion.img
              style={{ y }}
              src={images.topographic.src}
              sizes="(min-width: 1024px) 44vw, 100vw"
              alt={images.topographic.alt}
              className="absolute inset-0 h-[124%] w-full object-cover object-right"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            <div className="absolute bottom-0 max-w-xl p-6 md:p-8">
              <p className="text-sm font-semibold text-primary">
                Topographic Intelligence
              </p>
              <h3 className="mt-3 text-3xl leading-tight font-semibold text-foreground">
                Understand the terrain before deciding what should be built.
              </h3>
            </div>
          </TopographicPanel>
        </ArraReveal>

        <div className="grid gap-4">
          <ArraReveal>
            <SignalBeamPanel />
          </ArraReveal>
          {storyMarkers.map(({ icon: Icon, title, body }, index) => (
            <ArraReveal key={title} delay={index * 70}>
              <ArraBentoCard className="p-7">
                <Icon className="mb-7 size-6 text-primary" />
                <h3 className="text-xl font-semibold text-card-foreground">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
              </ArraBentoCard>
            </ArraReveal>
          ))}
        </div>
      </div>

      <div className="nordic-panel mt-12 grid gap-6 rounded-lg border border-border/75 bg-card/62 p-6 lg:grid-cols-[0.8fr_1fr] lg:p-8">
        <h3 className="text-2xl leading-tight font-semibold text-foreground md:text-3xl">
          Manipur is not a decorative backdrop. It is part of ARRA's operating
          discipline.
        </h3>
        <div className="space-y-5 leading-7 text-muted-foreground">
          <p>
            Uneven infrastructure, deep cultural intelligence, complex
            coordination problems, and a generation of ambitious builders create
            a useful standard: technology must be legible, resilient, and
            valuable in real conditions.
          </p>
          <p>
            That is why ARRA's visual language uses hills, pathways, and quiet
            signals. It represents a simple philosophy: understand the landscape
            before claiming to change it.
          </p>
        </div>
      </div>
    </ArraSection>
  )
}

function SignalBeamPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const terrainRef = useRef<HTMLDivElement | null>(null)
  const contextRef = useRef<HTMLDivElement | null>(null)
  const judgmentRef = useRef<HTMLDivElement | null>(null)
  const directionRef = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={containerRef}
      className="nordic-panel relative overflow-hidden rounded-lg border border-border/75 bg-card/72 p-5 md:min-h-[300px] md:p-6"
    >
      <div className="section-grid absolute inset-0 opacity-25" />
      <div className="relative z-10 grid gap-4 md:h-full md:min-h-[252px] md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-5">
          <SignalNode ref={terrainRef} label="Terrain" value="Place" />
          <SignalNode ref={contextRef} label="Context" value="Signals" />
        </div>

        <SignalNode
          ref={directionRef}
          label="Direction"
          value="Clarity"
          emphasis
        />

        <div className="grid gap-4 md:gap-5">
          <SignalNode ref={judgmentRef} label="Judgment" value="Human" />
          <div className="rounded-md border border-border/70 bg-background/62 p-4">
            <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
              Living system
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Useful intelligence should make the route easier to inspect.
            </p>
          </div>
        </div>
      </div>

      <AnimatedBeam
        className="hidden md:block motion-reduce:hidden"
        containerRef={containerRef}
        fromRef={terrainRef}
        toRef={directionRef}
        curvature={-28}
        pathColor="color-mix(in oklch, var(--primary) 42%, transparent)"
        gradientStartColor="var(--primary)"
        gradientStopColor="var(--accent)"
        duration={6}
        pathWidth={1.5}
        pathOpacity={0.16}
      />
      <AnimatedBeam
        className="hidden md:block motion-reduce:hidden"
        containerRef={containerRef}
        fromRef={contextRef}
        toRef={directionRef}
        curvature={26}
        pathColor="color-mix(in oklch, var(--primary) 42%, transparent)"
        gradientStartColor="var(--primary)"
        gradientStopColor="var(--accent)"
        duration={7}
        delay={1.1}
        pathWidth={1.5}
        pathOpacity={0.16}
      />
      <AnimatedBeam
        className="hidden md:block motion-reduce:hidden"
        containerRef={containerRef}
        fromRef={judgmentRef}
        toRef={directionRef}
        reverse
        curvature={-16}
        pathColor="color-mix(in oklch, var(--primary) 42%, transparent)"
        gradientStartColor="var(--accent)"
        gradientStopColor="var(--primary)"
        duration={6.5}
        delay={0.4}
        pathWidth={1.5}
        pathOpacity={0.16}
      />
    </div>
  )
}

const SignalNode = ({
  ref,
  label,
  value,
  emphasis = false,
}: {
  ref: Ref<HTMLDivElement>
  label: string
  value: string
  emphasis?: boolean
}) => (
  <div
    ref={ref}
    className={cn(
      "relative z-10 rounded-md border border-border/75 bg-background/72 p-4 text-center backdrop-blur",
      emphasis && "border-primary/45 bg-primary/10 px-5 py-6"
    )}
  >
    <p className="text-[0.68rem] font-medium tracking-[0.16em] text-primary uppercase">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
  </div>
)

function Philosophy() {
  return (
    <section className="relative z-0 border-b border-border/55">
      <TextReveal className="font-mono tracking-wide">
        Understand the landscape before claiming to change it.
      </TextReveal>
    </section>
  )
}

function Products() {
  return (
    <ArraSection
      id="products"
      tone="soft"
      eyebrow="Direction"
      title="Four areas of exploration, not public products."
      description="ARRA is studying a few connected directions privately. Nothing here should be read as a launched product, public roadmap, or final promise."
    >
      <div className="mt-24 flex flex-col gap-32">
        {productAreas.map(
          ({ icon: Icon, title, description, narrative, signals }, index) => (
            <ArraReveal
              key={title}
              delay={index * 50}
              className="group flex flex-col md:flex-row gap-8 md:gap-16 md:items-start"
            >
              <div className="md:w-1/3 text-primary shrink-0">
                <Icon className="size-16 mb-8 text-primary/80" />
                <h3 className="text-5xl md:text-[4rem] leading-none font-bold tracking-tighter text-foreground">
                  {title}
                </h3>
              </div>
              <div className="md:w-2/3 pt-3">
                <p className="text-2xl md:text-3xl leading-relaxed font-medium text-muted-foreground">
                  {description}
                </p>
                <p className="mt-8 text-lg md:text-xl leading-8 text-foreground/70 max-w-2xl">
                  {narrative}
                </p>
                <div className="mt-12 flex flex-wrap gap-4">
                  {signals.map((signal) => (
                    <span
                      key={signal}
                      className="text-sm font-mono tracking-widest uppercase text-muted-foreground/80"
                    >
                      [{signal}]
                    </span>
                  ))}
                </div>
              </div>
            </ArraReveal>
          )
        )}
      </div>
    </ArraSection>
  )
}

function Audience() {
  return (
    <ArraSection
      id="ecosystem"
      eyebrow="Who we are learning from"
      title="ARRA is listening to people carrying complex work."
      description="The company is still forming its ideas. These audiences represent the kinds of problems ARRA wants to understand before revealing specific projects."
    >
      <div className="mt-20 flex flex-col gap-24">
        {audienceCards.map(({ icon: Icon, title, body }, index) => (
          <ArraReveal key={title} delay={index * 70}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="md:w-1/3 text-primary shrink-0">
                <Icon className="size-16 mb-6 text-primary/80" />
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
                  {title}
                </h3>
              </div>
              <div className="md:w-2/3 pt-2">
                <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </div>
          </ArraReveal>
        ))}
      </div>

      <ArraReveal className="mt-32">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary">
              Learning and workflow
            </p>
            <h3 className="mt-6 text-4xl leading-tight font-bold tracking-tighter text-foreground md:text-5xl">
              Human capability stays at the center of the system.
            </h3>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
              A teacher preparing a lesson, a founder planning a project, an
              operator tracking decisions, and a developer reviewing a change
              all face the same hidden cost: scattered context. ARRA is studying
              how useful software might make that context easier to follow.
            </p>
          </div>
          <div className="order-1 lg:order-2 overflow-hidden mix-blend-luminosity opacity-80 hover:opacity-100 transition-opacity duration-700">
            <img
              src={images.learning.src}
              alt={images.learning.alt}
              className="w-full h-auto object-cover grayscale contrast-125"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </ArraReveal>
    </ArraSection>
  )
}

function OperatingModel() {
  return (
    <ArraSection
      id="process"
      tone="panel"
      eyebrow="Operating model"
      title="Small team, careful work, no premature reveal."
      description="The two-founder journey is intentionally narrow: understand the problem, shape small private experiments, review honestly, and reveal only when the work is mature enough."
    >
      <div className="mt-24 grid gap-16 lg:grid-cols-4">
        {operatingSteps.map((step, index) => (
          <ArraReveal key={step.phase} delay={index * 80}>
            <div className="relative">
              <span className="absolute -top-10 -left-4 text-[8rem] leading-none font-bold text-foreground/[0.03] -z-10">
                0{index + 1}
              </span>
              <p className="text-sm font-mono tracking-widest text-primary uppercase">
                {step.phase}
              </p>
              <h3 className="mt-6 text-2xl font-bold tracking-tighter text-foreground">
                {step.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          </ArraReveal>
        ))}
      </div>

      <div className="mt-32 grid gap-12 lg:grid-cols-4">
        {principles.map((principle, index) => (
          <ArraReveal key={principle.title} delay={index * 70}>
            <div className="border-t-2 border-primary/20 pt-8">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {principle.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
            </div>
          </ArraReveal>
        ))}
      </div>
    </ArraSection>
  )
}

function EnterpriseReadiness() {
  return (
    <ArraSection
      id="readiness"
      eyebrow="Principles"
      title="The work is early, so the commitments stay measured."
      description="ARRA is not ready to reveal product details. This section explains the internal posture the founders want to keep while the work is still in the pipeline."
    >
      <div className="mt-20 grid gap-16 md:grid-cols-2">
        {readinessSignals.map(({ icon: Icon, label, title, body }, index) => (
          <ArraReveal key={title} delay={index * 70}>
            <div>
              <Icon className="mb-6 size-10 text-primary/80" />
              <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase">
                {label}
              </p>
              <h3 className="mt-4 text-3xl font-bold tracking-tighter text-foreground">
                {title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{body}</p>
            </div>
          </ArraReveal>
        ))}
      </div>

      <ArraReveal className="mt-32 border-t border-primary/20 pt-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h3 className="text-4xl leading-tight font-bold tracking-tighter text-foreground md:text-5xl">
              We are preparing quietly before asking for attention.
            </h3>
            <p className="mt-8 text-xl leading-relaxed text-muted-foreground">
              ARRA is not announcing a product, pilot, or public roadmap yet. The
              current focus is to keep the thinking clear, the scope honest, and
              the technical habits responsible.
            </p>
            <InteractiveHoverButton href={mailToPilot} className="mt-12 text-sm px-8 h-14 border-primary/20 hover:border-primary/50">
              Start a conversation
            </InteractiveHoverButton>
          </div>
          <div className="grid gap-6 content-start">
            {enterpriseChecklist.map((item) => (
              <div
                key={item}
                className="flex gap-4 items-start"
              >
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                <span className="text-lg leading-relaxed text-foreground/80">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ArraReveal>
    </ArraSection>
  )
}

function Roadmap() {
  return (
    <ArraSection
      id="roadmap"
      tone="soft"
      eyebrow="Path"
      title="A simple direction, without premature promises."
      description="The path is intentionally modest: do the private groundwork, validate carefully, and reveal specific projects only when they are ready."
    >
      <div className="mt-20 flex flex-col md:flex-row gap-12 lg:gap-24">
        {roadmap.map((item, index) => (
          <ArraReveal key={item.phase} delay={index * 80} className="flex-1">
            <div className="relative border-l-2 border-primary/30 pl-8 pb-16">
              <span className="absolute -left-[17px] top-0 flex size-8 items-center justify-center rounded-full bg-background border border-primary/30">
                <div className="size-2.5 rounded-full bg-primary" />
              </span>
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                {item.phase}
              </p>
              <h3 className="mt-4 text-3xl font-bold tracking-tighter text-foreground">
                {item.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {item.details.map((detail) => (
                  <div
                    key={detail}
                    className="flex gap-4 items-start text-foreground/80"
                  >
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary/80" />
                    <span className="text-base leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </ArraReveal>
        ))}
      </div>
    </ArraSection>
  )
}

function Trust() {
  return (
    <ArraSection
      id="trust"
      eyebrow="Trust"
      title="Trust has to start before anything launches."
      description="ARRA has not launched a public product yet. The point is to build habits around privacy, accessibility, maintainability, and responsible use before anything is revealed."
    >
      <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_0.92fr] items-center">
        <ArraReveal>
          <div className="overflow-hidden mix-blend-luminosity opacity-80 hover:opacity-100 transition-opacity duration-700">
            <img
              src={images.governance.src}
              alt={images.governance.alt}
              className="w-full aspect-[16/11] object-cover grayscale contrast-125"
              loading="lazy"
              decoding="async"
            />
          </div>
        </ArraReveal>
        <div className="flex items-center overflow-hidden">
          <Marquee pauseOnHover vertical className="h-[500px] [--duration:35s]">
            {trustItems.map(({ icon, text }) => (
              <ArraEvidenceItem
                key={text}
                icon={icon}
                title={text}
                body="Treated as an early working principle while the company is still shaping its projects."
              />
            ))}
          </Marquee>
        </div>
      </div>
    </ArraSection>
  )
}

function FAQ() {
  return (
    <ArraSection
      id="faq"
      tone="panel"
      eyebrow="FAQ"
      title="Clear answers for early visitors."
      description="ARRA is early, private, and still shaping its work. These answers keep the public message honest."
    >
      <div className="mt-20 grid gap-16 lg:grid-cols-[0.62fr_1fr]">
        <ArraReveal>
          <MessageSquare className="mb-8 size-12 text-primary/80" />
          <h3 className="text-4xl leading-tight font-bold tracking-tighter text-foreground">
            A young startup, still learning what should be built.
          </h3>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            The page should explain the direction without pretending that ARRA
            has already launched a product or is ready to reveal its private
            projects.
          </p>
        </ArraReveal>
        <ArraReveal delay={100}>
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`} className="border-primary/20 py-2">
                <AccordionTrigger className="text-left text-xl font-bold tracking-tight hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-lg leading-relaxed text-muted-foreground">
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

function Contact() {
  return (
    <section id="contact" className="py-32 md:py-48">
      <div className="container-enterprise grid gap-16 lg:grid-cols-[0.85fr_1fr]">
        <ArraReveal>
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">Contact</p>
          <h2 className="mt-6 text-5xl leading-[1.1] font-bold tracking-tighter text-foreground md:text-6xl">
            Talk to ARRA about the journey.
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            ARRA welcomes thoughtful conversations, but the company is not ready to reveal project details or announce a launch.
          </p>
          <div className="mt-16 grid gap-8">
            <a
              href="mailto:transmission@arra.tech"
              className="flex items-center gap-6 group"
            >
              <div className="size-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <Mail className="size-5 text-primary" />
              </div>
              <span className="text-xl font-medium">transmission@arra.tech</span>
            </a>
            <div className="flex items-center gap-6">
              <div className="size-12 rounded-full border border-primary/20 flex items-center justify-center">
                <MapPin className="size-5 text-primary" />
              </div>
              <span className="text-xl font-medium">Manipur, India</span>
            </div>
          </div>
        </ArraReveal>

        <ArraReveal delay={100}>
          <form
            action="mailto:transmission@arra.tech"
            method="post"
            encType="text/plain"
            className="p-2 md:p-8"
          >
            <div className="grid gap-12">
              <ArraField label="Name">
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  className="h-12 border-0 border-b-2 border-primary/20 rounded-none bg-transparent px-0 text-xl shadow-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
              </ArraField>
              <ArraField label="Email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-12 border-0 border-b-2 border-primary/20 rounded-none bg-transparent px-0 text-xl shadow-none focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
              </ArraField>
              <ArraField label="Conversation type">
                <select
                  id="intent"
                  name="intent"
                  className="h-12 border-0 border-b-2 border-primary/20 rounded-none bg-transparent px-0 text-xl shadow-none focus-visible:ring-0 focus-visible:border-primary outline-none transition-colors w-full appearance-none"
                  defaultValue={contactIntents[0]}
                >
                  {contactIntents.map((intent) => (
                    <option key={intent} className="bg-background">{intent}</option>
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
                  className="min-h-32 border-0 border-b-2 border-primary/20 rounded-none bg-transparent px-0 text-xl shadow-none focus-visible:ring-0 focus-visible:border-primary resize-none transition-colors"
                  required
                />
              </ArraField>
            </div>
            <InteractiveHoverButton
              type="submit"
              className="mt-16 text-sm px-10 h-14 border-primary/20 hover:border-primary/50 w-full md:w-auto"
            >
              Send message
            </InteractiveHoverButton>
          </form>
        </ArraReveal>
      </div>

      <Footer />
    </section>
  )
}

function Footer() {
  const groups = [
    { title: "Company", links: ["Vision", "Process", "Path"] },
    {
      title: "Direction",
      links: ["AI research", "Learning", "Developer support"],
    },
    { title: "Trust", links: ["Privacy", "Accessibility", "Responsible use"] },
  ]

  return (
    <footer className="container-enterprise mt-20 border-t border-border pt-8">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-lg font-semibold text-foreground">ARRA</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            An early-stage technology startup from Manipur, exploring context,
            intelligence, and direction with patience.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-foreground">
                {group.title}
              </p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <span key={link}>{link}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>ARRA. Early-stage technology startup from Manipur.</p>
        <div className="flex flex-wrap gap-5">
          <a className="hover:text-foreground" href="#home">
            Home
          </a>
          <a className="hover:text-foreground" href="#products">
            Direction
          </a>
          <a className="hover:text-foreground" href="#contact">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
