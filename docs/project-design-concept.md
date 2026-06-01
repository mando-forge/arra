# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## UI/UX DESIGN ARCHITECTURE: MOKORO "NEXUS"
**Version:** 3.0.0 (The Expanded Cinematic Lore)
**Platform:** Single Page Application (SPA) - React 19 + Vite 8
**Framework:** Tailwind CSS v4, shadcn/ui, Ali Imam AI Registry
**Core Ethos:** 70% Earthling (Manipur Grit) / 30% Mando (Outer Rim Sci-Fi)

---

## 1. EXECUTIVE SUMMARY
MOKORO is an emerging tech startup operating in stealth mode from the Manipur sector. This PRD outlines an award-winning, Behance-tier digital experience. The interface strictly forbids generic SaaS "Template Slop" (e.g., metric counters, generic testimonials, floating thumbnails). Instead, it demands a brutalist, highly cinematic, and deeply immersive narrative flow. The design visualizes "The World Between Worlds"—a gateway connecting grounded reality to the infinite void of the future.

---

## 2. GLOBAL DESIGN SYSTEM (THE FORGE RULES)

To achieve a globally recognized aesthetic, the UI must strictly adhere to the following atomic rules:

### 2.1 The Plumb Line Protocol (Layout Constraints)
No content shall suffer from "Ultra-Wide Bleed" or random floating placement. The application utilizes a Universal Container for strict vertical synchronization.
*   **The Global Wrapper:** `mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-24`
*   **Asymmetry:** Layouts favor heavy, anchored left-aligned typography counterbalanced by right-aligned visual voids or data-streams.

### 2.2 Brutalist Geometry & Theming
*   **Border Radius:** Strictly `--radius: 0`. No pills, no rounded corners. Every button, input, image mask, and panel is a razor-sharp 90-degree cut.
*   **Background:** Obsidian Void (`oklch(0.147 0.004 49.25)`). True dark mode only.
*   **Primary Accent:** Electric Ethereal Cyan (`oklch(0.7 0.15 200)`). Used strictly for 1px glowing borders, terminal cursors, and drop-shadow glows. Absolutely NO solid background fill buttons.
*   **Typography:** *Instrument Sans Variable*. Headings are heavy, tracked-out uppercase (`tracking-[0.2em]`).

### 2.3 Motion & Media Constraints (The Physics Rule)
The hallmark of the MOKORO visual experience relies on a highly specific cinematic dichotomy tailored for advanced rendering. All primary visual assets (images and future background animation videos) must obey this strict physical law:
*   **Static Subjects:** Characters (e.g., the founders) must remain perfectly motionless. They must stand directly on the natural hilltop ground—no artificial platforms or pedestals.
*   **Fixed Perspective:** The camera angle remains entirely fixed and locked directly behind the subjects. The characters will not move or turn.
*   **Dynamic Environments:** Motion is exclusively driven by environmental physics—intense wind sweeping across the grass, fast-moving white storm clouds rolling through the sky, and precise bird flight paths traversing the frame.

---

## 3. SPA NARRATIVE ARCHITECTURE (SECTION BY SECTION)

The single-page scroll is an unbroken descent into the Covert. Generic SaaS elements are strictly forbidden.

### ACT I: The Gateway (Hero Section)
*   **UX Goal:** The breathtaking hook. A cinematic immersion setting the 70/30 Earth/Mando aesthetic.
*   **Visual Render:** A full-viewport background. The two founders stand on a natural Manipur hilltop, looking into a massive glowing geometric portal in the sky. The left side is heavily masked in a black gradient to ensure text readability.
*   **Typography:** Ghost text "MOKORO" at `12rem` size, 5% opacity in the background. Foreground heading: "The Pathway Between What Is, And What Can Be" featuring a vertical gradient text mask.
*   **Interactivity:** Glassmorphic, 0-radius CTA "INITIALIZE SEQUENCE" with a glowing cyan border. 
*   **Anchoring:** Bottom glassmorphic stats bar locked to the Plumb Line grid.

### ACT II: The Severed Node (Problem / Reality)
*   **UX Goal:** Ground the user in the gritty reality of the sector.
*   **UI Layout:** Maximum negative space (`py-40`). A massive, left-aligned typography block constrained by `max-w-3xl`.
*   **Visual Render:** No heavy imagery. The background transitions into a very faint, 1px cyan dotted grid representing a fractured network.
*   **Narrative Copy:** *"The storms in our sector have severed connections. We do not wait for the future; we step into the void and build the bridge ourselves."*

### ACT III: The Pathfinders (Team Section)
*   **UX Goal:** Introduce the founders (Oliver. O & Omega. N) as elite navigators.
*   **UI Layout:** A high-contrast Bento Grid component (`@aliimam/bento-grid`).
*   **Visual Render:** 
    *   *Main Panel:* "The Navigators." Subtle abstract data-streams flowing downward.
    *   *Sub Panels:* "The Nexus" (Stealth philosophy) and "Step by Step" (Methodology).
*   **Interactivity:** Hovering over a Bento panel dims the others slightly, while the hovered panel's 1px border ignites with a glowing cyan box-shadow (`shadow-[0_0_15px_var(--primary)]`).

### ACT IV: The Vault (Teasing the Products)
*   **UX Goal:** Showcase that actual, formidable technology is being built without breaking stealth mode or showing generic software dashboards.
*   **UI Layout:** A rigid, brutalist grid of "Redacted" blocks or Lockboxes.
*   **Visual Render:** Black, 0-radius cards labeled with classified codenames (e.g., `ASSET: OMEGA-PROTOCOL`, `ASSET: KINETIC-ENGINE`). 
*   **Interactivity:** Upon hover, the black redaction scrambles away (using a cryptographic text-reveal effect) to show highly stylized, glowing cyan wireframes or data-nodes, instantly snapping back to black when the mouse leaves.

### ACT V: The Vergence Protocol (Methodology)
*   **UX Goal:** Explain the technical philosophy without revealing proprietary code.
*   **UI Layout:** An asymmetrical split. Left side locked heading ("The Vergence Protocol"), right side interactive `shadcn/accordion`.
*   **Content Items:** Focus on "Clarity over Chaos," "Transformation over Profit," and "Silence until Readiness." 

### ACT VI: The Nav-Computer (Roadmap)
*   **UX Goal:** A visual timeline proving that MOKORO has a calculated trajectory.
*   **UI Layout:** A vertical tracking timeline aligned to the left of the Plumb Line grid. 
*   **Visual Render:** A single, sharp 1px vertical line that glows electric cyan dynamically as the user scrolls past specific temporal nodes.
*   **Content:** Instead of corporate quarters (Q1/Q2), use cinematic phases: `Phase I: The Forge Ignites`, `Phase II: Covert Architecture Lock`, `Phase III: Nexus Expansion`. 

### ACT VII: The Guild (Call for Talent)
*   **UX Goal:** A magnetic call to arms for engineers, designers, and visionaries to join the startup.
*   **UI Layout:** A relentless, full-width Marquee banner (`@aliimam/marquee`) scrolling fast behind a stark, brutalist call-to-action block.
*   **Visual Render:** The Marquee text repeatedly flashes philosophical tenets: `// BUILD THE BRIDGE // DO NOT WAIT // FORGE THE FUTURE //`. Foreground text reads: *"We are searching for artisans in the void. Join the Covert."*

### ACT VIII: The Resonance (Footer & Comms Relay)
*   **UX Goal:** A highly exclusive contact point for allies, framed as a terminal command line.
*   **UI Layout:** Centered, sharply cut terminal window bounded by the `max-w-4xl` container.
*   **Visual Render:** A blinking cyan terminal cursor (`_`). 
*   **Form Structure:** 
    *   `> INPUT ALIAS:` (Name)
    *   `> ORIGIN COORDINATES:` (Email)
    *   `> TRANSMIT FREQUENCY:` (Message)
*   **Footer Anchor:** A strict 4-column grid displaying the final origin point: *Sector Location: Manipur, Earth. (Operating from an undisclosed nexus).*

---

## 4. TECHNICAL EXECUTION DIRECTIVES

1.  **Strict Aliasing:** All imports must utilize the predefined `@/components` and `@/lib` paths.
2.  **Dynamic Class Merging:** Heavy reliance on the `cn` utility to merge complex Tailwind v4 hover states and theme variables without collision.
3.  **Package Management:** Execution of this architecture strictly requires `pnpm`. Integration of Ali Imam registry blocks via `pnpm dlx shadcn add @aliimam/[name]`. The use of `npm` or `npx` is prohibited.