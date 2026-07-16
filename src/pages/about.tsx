import { ArraReveal, ArraSection, EngravingFigure } from "@/components/arra"
import { images } from "@/content/arra"
import { motion, type Variants } from "framer-motion"
import { BlurFade } from "@/components/ui/blur-fade"
import { MagicCard } from "@/components/ui/magic-card"
import { FlickeringGrid } from "@/components/ui/flickering-grid"

const founders = [
  {
    name: "Oliver O",
    role: "Co-founder",
    image: images.founderOliver,
    note: "Oliver focuses on product direction and engineering, making sure what we build actually solves real problems.",
  },
  {
    name: "Omega N",
    role: "Co-founder",
    image: images.founderOmega,
    note: "Omega brings an operational perspective, keeping the work grounded in community needs and practical execution.",
  },
]

const headingText = "Two founders building from Imphal, Manipur."
const words = headingText.split(" ")



const foundersContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
}

const founderItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
}

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden arra-section surface-light pb-14 pt-32 md:pb-24 md:pt-40 px-6 md:px-12 lg:px-24">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <FlickeringGrid
            className="absolute inset-0 size-full z-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-30"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={0.1}
          />
        </div>

        <div className="w-full relative z-10 max-w-7xl mx-auto">
          <ArraReveal>
            <p className="mono-label">About us</p>
          </ArraReveal>
          
          <h1 className="serif-display mt-7 max-w-5xl text-balance text-[clamp(2.75rem,8vw,6rem)] leading-[0.94]">
            {words.map((word, i) => (
              <BlurFade 
                key={i} 
                delay={0.15 + i * 0.05} 
                inView 
                className="inline-block mr-[0.25em]"
              >
                {word}
              </BlurFade>
            ))}
          </h1>

          <ArraReveal>
            <div className="mt-8 grid gap-6 border-t border-border pt-6 md:grid-cols-[1.1fr_0.9fr]">
              <p className="body-copy max-w-2xl text-lg opacity-80">
                ARRA-CORE is a bootstrapped technology company in Imphal, Manipur. We're building web applications that help our community grow and create opportunities.
              </p>
              <p className="body-copy max-w-xl opacity-70">
                We're doing this with our own hands and our own resources. No outside funding, no shortcuts — just focused work on things that matter.
              </p>
            </div>
          </ArraReveal>
        </div>
      </section>

      <ArraSection
        id="founders"
        tone="split"
        eyebrow="The founders"
        title="The team behind ARRA-CORE"
        description="ARRA-CORE is built by two co-founders who handle everything — from code to design to community conversations. We're small by choice and focused by necessity."
      >
        <motion.div 
          className="mt-12 grid gap-6 lg:grid-cols-2"
          variants={foundersContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10px" }}
        >
          {founders.map((founder, index) => (
            <motion.div key={founder.name} variants={founderItem} className="h-full">
              <MagicCard 
                className="h-full pt-4 cursor-pointer bg-transparent shadow-none border-t border-border rounded-none" 
                gradientColor="var(--arra-fjord)" 
                gradientOpacity={0.1}
              >
                <div className="mb-4 flex items-baseline justify-between gap-4 px-4 md:px-5 pt-2">
                  <p className="mono-label">0{index + 1}</p>
                  <p className="text-sm opacity-60">{founder.role}</p>
                </div>
                <EngravingFigure
                  src={founder.image.src}
                  alt={founder.image.alt}
                  tone="light"
                  className="shadow-none border-0 bg-transparent"
                  frameClassName="aspect-square w-full"
                  imageClassName="h-full w-full object-cover"
                  caption={
                    <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
                      <h2 className="serif-display text-3xl">{founder.name}</h2>
                      <p className="body-copy text-sm opacity-75">{founder.note}</p>
                    </div>
                  }
                />
              </MagicCard>
            </motion.div>
          ))}
        </motion.div>
      </ArraSection>
    </>
  )
}
