# ARRA Nordic Field Journal — Design QA

## Comparison target

- Source visual truth: `./docs/design/arra-nordic-field-journal-cel-shaded-target-v2.png`
- Browser-rendered implementation: `./docs/design/implementation-home-desktop-normalized-v2.png`
- Viewport: browser override `1501 × 1070`; captured page raster `1486 × 1059` at device-pixel-ratio 1, matching the source raster exactly
- State: home route, top of page, light theme, desktop navigation closed, chat closed

## Comparison evidence

- Full-view comparison: `./docs/design/design-qa-comparison-full-final.png`
- Focused hero comparison: `./docs/design/design-qa-comparison-hero-final.png`
- Focused posture comparison: `./docs/design/design-qa-comparison-posture-final.png`
- Mobile home: `./docs/design/implementation-home-mobile-final.png`
- Mobile illustration crop: `./docs/design/implementation-home-mobile-art-final.png`
- Mobile contact: `./docs/design/implementation-contact-mobile-final.png`
- Mobile chat sheet: `./docs/design/implementation-chat-mobile.png`

Focused comparisons were required because the source depends on precise headline wrapping, character scale, image crop, and the isolated regional illustration treatment. The hero and posture crops make those details readable at 1:1 scale.

## Findings

No actionable P0, P1, or P2 differences remain.

The implementation preserves the source composition: a three-line editorial hero, a 5/7 text-and-image relationship, a full-height journal rail, restrained calls to action, generous paper negative space, and an isolated regional landscape directly below the fold. All generated characters are rear-facing Northeast Indian founders in modern clothing, with no visible faces.

## Required fidelity review

- Fonts and typography: EB Garamond provides the editorial display voice; Instrument Sans handles body and navigation copy; IBM Plex Mono is limited to field-note labels and metadata. Display wrapping, weight, line height, and the three-line hero hierarchy match the source closely at the normalized viewport.
- Spacing and layout rhythm: the header, hero top edge, image baseline, journal rail, CTA row, section boundary, posture heading, and regional illustration align with the source. Desktop and `390 × 844` mobile layouts have no horizontal overflow.
- Colors and visual tokens: chalk, paper, spruce, fjord, mist, and ochre tokens reproduce the source's warm-white field-journal balance. Gradients, neon effects, image filters, grayscale, and blend modes are absent.
- Image quality and asset fidelity: visible illustrations are real project raster assets with clean flat blocks and hard-edged cel shadows. The final hero uses an enlarged rear-view founder pair; the regional study uses an isolated landscape with large negative space. No CSS art, inline SVG stand-ins, emoji, or placeholders replace source imagery.
- Copy and content: public copy remains honest about ARRA's research stage. “Explorations” is used instead of product claims, and founder/contact language avoids covert or inflated framing.

## Comparison history

### Iteration 1 — browser preflight

- Evidence: `./docs/design/implementation-desktop-v1.png`
- Earlier P2 findings: the hero wrapped into two lines instead of three; the image stopped short of the source's right edge; the header wordmark used the display serif; the posture copy was vertically misaligned; route changes retained the previous scroll position.
- Fixes: forced source-faithful headline breaks, extended the hero grid to the right edge, restored a tracked sans wordmark, aligned the posture content to the illustration top, and added route scroll restoration.

### Iteration 2 — normalized visual comparison

- Evidence: `./docs/design/design-qa-comparison-full-v2.png`
- Earlier P2 findings: the founder pair was too small and low in the hero; the regional illustration was a tall framed scene instead of the source's isolated panoramic landscape; the paper tone was too dark.
- Fixes: regenerated the hero with a larger rear-facing founder pair, created a source-faithful panoramic terrain asset, changed the regional slot to a 3:1 contained composition, and lightened the paper token.

### Iteration 3 — post-fix comparison

- Evidence: `./docs/design/design-qa-comparison-full-final.png`, `./docs/design/design-qa-comparison-hero-final.png`, and `./docs/design/design-qa-comparison-posture-final.png`
- Result: the previous P2 findings are resolved. No new P0, P1, or P2 issues were found.

## Browser verification

- Primary navigation and active-route states
- Mobile menu open, close, and route navigation
- Automatic scroll restoration on route changes
- Theme toggle to dark and back to light
- FAQ expansion
- Chat open/close on desktop and as a mobile bottom sheet
- Contact labels, required fields, selectable intent, unobstructed mobile layout, and safe public error/success states in code
- About and Explorations routes, including successful loading of all active illustrations
- Browser console checked on home and contact: no errors
- Contact and chat network submissions were not sent during QA, avoiding creation of external test data

## Follow-up polish

- P3: the implementation intentionally omits the unlaunched Blog link, labels the research territory as “Explorations,” and retains the functional theme and chat controls. These are product-honesty and existing-functionality decisions rather than visual regressions.
- P3: the final hero pair sits slightly farther right than the conceptual source while preserving the same right-third focal composition and rear-facing treatment.

## Implementation checklist

- [x] Match desktop composition and headline wrapping
- [x] Replace active raster imagery with the approved cel-shaded family
- [x] Preserve large negative spaces and the Nordic paper palette
- [x] Verify desktop and mobile navigation, responsive layout, and interactive states
- [x] Verify no horizontal overflow or console errors
- [x] Pass the final side-by-side visual comparison

final result: passed

---

# ARRA Admin Quiet Operations — Design QA

## Comparison target

- Source visual truth: `./docs/design/arra-admin-quiet-operations-target.png`
- Browser-rendered implementation: `./docs/design/arra-admin-quiet-operations-implementation.png`
- Viewport: `1440 × 1024`, desktop, light theme, authenticated admin, overview with an empty production dataset
- Full-view comparison: `./docs/design/arra-admin-quiet-operations-comparison.png`
- Focused header comparison: `./docs/design/arra-admin-header-comparison.png`
- Focused workspace comparison: `./docs/design/arra-admin-workspace-comparison.png`
- Mobile evidence: `./docs/design/arra-admin-quiet-operations-mobile.png` at `390 × 844`

## Findings

No actionable P0, P1, or P2 visual differences remain.

- Fonts and typography: EB Garamond, Instrument Sans, and IBM Plex Mono preserve the target's editorial display, functional body, and metadata hierarchy. The implementation uses slightly larger live headings at some breakpoints while retaining the same optical structure.
- Spacing and layout: the top navigation, three-column desktop frame, daybook rail, primary draft workspace, river image, right activity rail, and thin divider rhythm match the selected composition. Mobile collapses to a single readable column without horizontal overflow.
- Colors and tokens: the implementation uses the existing chalk, paper, spruce, mist, fjord, and ochre tokens. Neon cyan, glass effects, animated border beams, gradients, and fictional telemetry are absent from the active experience.
- Image quality: the river and bamboo assets are dedicated project rasters generated for the selected target, with matching subject, crop, palette, and field-journal treatment. No CSS or inline-SVG stand-ins are used.
- Copy and content: target mock records were replaced with honest live-data states. With no current posts, inquiries, or documents, the UI invites the first field note and reports clear inbox/knowledge empty states rather than displaying fictional activity.

## Comparison history

### Initial implementation pass

- The first browser capture matched the selected hierarchy and proportions without a P0/P1/P2 mismatch.
- Intentional differences: target sample data became real empty states; the left daybook schedule became derived work counts; the central CTA changes from continuing a draft to creating one when no draft exists.
- Post-build browser checks found no console errors.

## Interaction and responsive verification

- Authenticated dashboard load and database-backed empty states
- Primary field-note CTA navigation to the CMS workspace
- Desktop top navigation and mobile sheet navigation
- Account menu and sign-out redirect
- Theme control presence and keyboard-accessible semantic controls
- Mobile overview at `390 × 844` with no horizontal overflow or clipped primary action
- Premium login screen and secure contact form rendered without console errors

## Follow-up polish

- P3: once real field notes exist, verify long titles and excerpts against the target's line lengths.
- P3: enable Supabase leaked-password protection and enroll the admin account in MFA before treating authentication hardening as operationally complete.

final result: passed
