# ARRA UI/UX Audit and Nordic 2026 Enhancement Plan

## Current Diagnosis

The live ARRA page already moved away from the older dark sci-fi Mokoro direction and now uses a calm founder-story landing page. The visual foundation is appropriate, but it still feels plain because too many sections share the same pattern: warm background, centered container, heading, card grid, repeated rounded panels, and similar vertical spacing.

The reference screenshot works because it has a stronger editorial rhythm: compact hero, generous whitespace, one clear image moment per idea, thinner surface treatment, and section-to-section variation. ARRA should keep that restraint while adding more authorship and material quality.

## Issues Found

- Hero hierarchy is clear but conservative. The image is treated like a secondary card instead of a primary brand signal.
- Section rhythm repeats. Vision, Direction, Audience, Process, Principles, Path, Trust, FAQ, and Contact all use similar headings and white cards.
- The surface palette leans warm and papery, but it needs cooler Nordic mist, slate, and restrained ochre/teal accents so it does not read as a flat beige template.
- Cards have consistent polish, but not enough material variation: no tactile grain, maker marks, editorial rails, or differentiated panel scales.
- The design has many boxes. It needs more open layouts, object-like image placement, and structural lines that feel intentional rather than decorative.
- Copy is appropriately honest, but the content could be arranged with more confidence: fewer equal-weight cards, more primary/secondary hierarchy.

## 2026/Nordic Direction

- Nordic minimalism: clarity, functional restraint, natural surfaces, quiet craft, and human warmth.
- 2026 premium UI: bold typography used as architecture, subtle motion, tactile CSS texture, semantic structure, and fewer generic bento patterns.
- Human-authored feel: visible craft marks, paper grain, topographic texture, asymmetry, and imperfect-but-controlled detail.
- Performance-aware execution: CSS texture and layout hierarchy instead of heavy WebGL or unnecessary effects.

## Enhancement Plan

1. Strengthen the hero.
   - Make ARRA a stronger first-viewport signal.
   - Use a more architectural two-column composition with a large image field, compact proof rail, and a quiet location badge.
   - Add a refined paper/mist background texture and structural side rails.

2. Upgrade the material system.
   - Add cool Nordic surface tokens beside the existing warm paper.
   - Use thin borders, subtle grain, inset highlights, and low-contrast panels.
   - Keep radius at 8px or below and avoid loud shadows.

3. Break the repeated card rhythm.
   - Create more variation between sections: editorial split, manifesto band, process rail, compact evidence stack, and image-led trust block.
   - Make important content larger and supporting content smaller, instead of letting every card have equal visual priority.

4. Make the page feel premium but honest.
   - Add detail where it supports the ARRA story: terrain marks, quiet waypoints, founders imagery, measured CTAs.
   - Avoid launch-language, inflated metrics, pricing, testimonials, or public-product dashboards.

5. Verify responsive quality.
   - Build/typecheck the Vite app.
   - Inspect desktop and mobile screenshots for overlap, bland density, and content flow.

