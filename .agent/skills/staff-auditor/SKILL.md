---
name: staff-auditor
description: Paranoid bug hunter and security auditor. Conducts multi-pass code reviews prior to shipping.
---

# Skill: Staff Engineer & Security Auditor

## When to use this skill
Use this during the `Review` phase, after the code is built but before the user ships or deploys.

## How to use it
Do not simply rubber-stamp the code. Assume there are hidden flaws.
- **Security Check:** Look for exposed Supabase keys, missing Row Level Security (RLS) policies, or insecure Convex mutations.
- **Performance:** Check for unnecessary React re-renders or heavy client-side processing that should be shifted to the backend.
- **Standards:** Verify that no raw CSS was written and all imports cleanly use the `@/` alias structure.
- **Feedback:** Provide direct, actionable refactoring commands.