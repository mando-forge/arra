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
  { label: "Our Work", href: "/work" },
  { label: "Contact", href: "/contact" },
]

export const images = {
  hero: {
    src: "/images/arra-cel-hero-field-journal-v3.png",
    alt: "Two co-founders, seen from behind, looking across a quiet landscape in Imphal, Manipur",
  },
  governance: {
    src: "/images/arra-cel-responsible-foundations-v2.png",
    alt: "Two co-founders, seen from behind, reviewing notes in a bright studio",
  },
  topographic: {
    src: "/images/arra-cel-regional-terrain-v3.png",
    alt: "Layered mountains, water, vegetation, and two homes rendered as a restrained landscape illustration",
  },
  explorations: {
    src: "/images/arra-cel-explorations-v2.png",
    alt: "Two co-founders, seen from behind, observing connected areas of learning, community, and growth",
  },
  founderOliver: {
    src: "/images/arra-cel-founder-oliver-rear-v2.png",
    alt: "Rear-view flat illustration of ARRA-CORE co-founder Oliver O in modern clothing",
  },
  founderOmega: {
    src: "/images/arra-cel-founder-omega-rear-v2.png",
    alt: "Rear-view flat illustration of ARRA-CORE co-founder Omega N in modern clothing",
  },
} satisfies Record<string, ImageAsset>

export const principles: Principle[] = [
  {
    title: "Build with purpose",
    body: "Every feature we ship solves a real problem we've seen in our community.",
  },
  {
    title: "Start where we are",
    body: "We build for Imphal first, learning from what's real around us.",
  },
  {
    title: "Ship honestly",
    body: "We share what's working and what isn't — no inflated promises.",
  },
  {
    title: "Foundations first",
    body: "Privacy, accessibility, and reliability are built in from day one.",
  },
]

export const trustItems: TrustItem[] = [
  {
    icon: ShieldCheck,
    text: "Security from the start",
    body: "We treat security as a baseline, not an afterthought.",
  },
  {
    icon: LockKeyhole,
    text: "Your data, handled carefully",
    body: "We keep clear boundaries on how information is stored and used.",
  },
  {
    icon: FileCheck2,
    text: "Transparent decisions",
    body: "We document our reasoning and share it openly.",
  },
  {
    icon: ServerCog,
    text: "Built for real conditions",
    body: "Our applications work on the connections and devices people actually use.",
  },
  {
    icon: SearchCheck,
    text: "Community-led direction",
    body: "What we build next is shaped by what the community needs.",
  },
  {
    icon: Eye,
    text: "People over automation",
    body: "Technology should support people, not replace their judgment.",
  },
  {
    icon: Layers3,
    text: "Growing together",
    body: "We're investing in our own skills while building tools that create opportunities.",
  },
]

export const faqs: FAQItem[] = [
  {
    question: "What does ARRA-CORE do?",
    answer:
      "ARRA-CORE is a bootstrapped technology company in Imphal, Manipur. We're two founders building web applications for our community. We haven't launched yet, but we're actively building.",
  },
  {
    question: "When will ARRA-CORE launch?",
    answer:
      "We're building as fast as two people can. We'll share more as things are ready — no premature announcements.",
  },
  {
    question: "What is ARRA-CORE building?",
    answer:
      "Web applications that help our community grow and create local job opportunities. We're focused on Imphal right now.",
  },
  {
    question: "How can I connect with ARRA-CORE?",
    answer:
      "We'd love to hear from you. Use the contact form or email us at transmission@arra-core.tech.",
  },
]

export const contactIntents = [
  "General conversation",
  "Potential collaboration",
  "Say hello",
  "Community supporter",
]

export const mailToPilot =
  "mailto:transmission@arra-core.tech?subject=ARRA-CORE%20Conversation"

