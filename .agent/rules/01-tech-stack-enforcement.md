---
trigger: always_on
---

# Rule: UI/UX & Backend Architecture Enforcement

## UI Initialization & Component Rules
- **Prohibited Action:** Do not write custom raw CSS/HTML for primitive components (buttons, modals, forms).
- **Enforced Preset:** The project relies on a strictly locked shadcn environment. If UI initialization is required, use exactly: `pnpm dlx shadcn@latest init --preset b2p86qOxM --template vitetemplate`.
- **Ali Imam Registry:** For marketing blocks, sections, and complex components, install directly from the AI Registry: `pnpm dlx shadcn add @aliimam/[component-name]`.
- **Styling:** Use Tailwind v4 `@theme` variables in `src/index.css`. All dynamic class logic must pass through the `cn` utility in `@/lib/utils`.

## Database Rules
- All schema design, authentication, and backend logic must be optimized for either **Supabase** (Postgres/RLS) or **Convex** (Reactive TypeScript backend). 
- Favor real-time data subscriptions over traditional REST polling.

## Package Manager Rules
- **Prohibited Action:** Do NOT use `npm` or `npx` for any package installations or script executions.
- **Enforced Tool:** The project is built using `pnpm`. Always use `pnpm install`, `pnpm add`, `pnpm run`, or `pnpm dlx` instead of their npm equivalents.