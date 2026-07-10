import type { LucideIcon } from "lucide-react"
import {
  Eye,
  FileCheck2,
  Layers3,
  LockKeyhole,
  SearchCheck,
  ServerCog,
  ShieldCheck,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
}

export type ImageAsset = {
  src: string
  srcSet?: string
  alt: string
}

export type Principle = {
  title: string
  body: string
}

export type TrustItem = {
  icon: LucideIcon
  text: string
  body: string
}

export type FAQItem = {
  question: string
  answer: string
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Explorations", href: "/products" },
  { label: "Contact", href: "/contact" },
]

export const images = {
  hero: {
    src: "/images/arra-cel-hero-field-journal-v3.png",
    alt: "Two Northeast Indian co-founders, seen from behind, looking across a quiet mountain landscape",
  },
  governance: {
    src: "/images/arra-cel-responsible-foundations-v2.png",
    alt: "Two Northeast Indian co-founders, seen from behind, reviewing field notes in a bright studio",
  },
  topographic: {
    src: "/images/arra-cel-regional-terrain-v3.png",
    alt: "Layered Northeast Indian mountains, water, vegetation, and two homes rendered as a restrained field-journal landscape",
  },
  explorations: {
    src: "/images/arra-cel-explorations-v2.png",
    alt: "Two Northeast Indian co-founders, seen from behind, observing connected areas of learning, community, and movement",
  },
  founderOliver: {
    src: "/images/arra-cel-founder-oliver-rear-v2.png",
    alt: "Rear-view flat illustration of ARRA co-founder Oliver O in modern clothing",
  },
  founderOmega: {
    src: "/images/arra-cel-founder-omega-rear-v2.png",
    alt: "Rear-view flat illustration of ARRA co-founder Omega N in modern clothing",
  },
} satisfies Record<string, ImageAsset>

export const principles: Principle[] = [
  {
    title: "Clarity before scale",
    body: "We work to understand the right problem before defining the public shape of the solution.",
  },
  {
    title: "Context over assumption",
    body: "Decisions should be informed by real conditions, especially the needs and constraints of Northeast India.",
  },
  {
    title: "Measured communication",
    body: "We will share specific products, technologies, and roadmaps only when they are mature enough to discuss responsibly.",
  },
  {
    title: "Responsible foundations",
    body: "Privacy, accessibility, reliability, and careful execution are treated as early standards, not later additions.",
  },
]

export const trustItems: TrustItem[] = [
  {
    icon: ShieldCheck,
    text: "Security considered from the beginning",
    body: "Risk, access, and system integrity are part of the company standard from the earliest stage.",
  },
  {
    icon: LockKeyhole,
    text: "Responsible handling of data",
    body: "Information should be treated with care, clear boundaries, and practical accountability.",
  },
  {
    icon: FileCheck2,
    text: "Clear decision practices",
    body: "The company favors documented reasoning and disciplined review over rushed public claims.",
  },
  {
    icon: ServerCog,
    text: "Practical reliability standards",
    body: "Future work should be designed for real operating conditions, not ideal environments alone.",
  },
  {
    icon: SearchCheck,
    text: "Evidence-led direction",
    body: "Product and technology choices will be shaped over time by need, relevance, and usefulness.",
  },
  {
    icon: Eye,
    text: "Human judgment preserved",
    body: "Technology should support people without making responsibility harder to see.",
  },
  {
    icon: Layers3,
    text: "Patient internal capability",
    body: "ARRA is investing in the operating habits required to build with quality over time.",
  },
]

export const faqs: FAQItem[] = [
  {
    question: "What does ARRA do?",
    answer:
      "ARRA is an early-stage technology company from Northeast India. We have not launched a public product or service yet. Our current work is focused on research, internal capability building, and preparing the foundation for future projects.",
  },
  {
    question: "Why is ARRA not sharing product details?",
    answer:
      "We believe public claims should follow maturity. Our current areas of exploration are not a product roadmap. Specific products, technical choices, and timelines will be shared only when the work has enough clarity to justify public attention.",
  },
  {
    question: "What is ARRA's focus?",
    answer:
      "Our long-term focus is technology innovation and regional transformation for Northeast India. The exact direction will be shaped over time by evidence, need, and practical relevance.",
  },
  {
    question: "How can I connect with ARRA?",
    answer:
      "We welcome thoughtful conversations with people who value serious, long-term work. The contact section below is the best place to begin.",
  },
]

export const contactIntents = [
  "General conversation",
  "Potential collaboration",
  "Founder introduction",
  "Long-term supporter",
]

export const mailToPilot =
  "mailto:transmission@arra.tech?subject=ARRA%20Conversation"
