# AGENTS.md

This file provides guidance to AI agent when working with code in this repository.

# Continuous learning and improvement

When you explore the code for a feature or component, implement new feature, understand new rules, then call the skill `/learn` to guarantee that the knowledge persisted as skills.

## Learning after tasks

When a task is done **and validated by the user** (tests/type-check pass and the user confirms, e.g. "nice", "done", "first step is done"), capture what was learned with the `learn` skill (`/learn`) into `.agents/skills/`:
- **Ask first**: "Should I `/learn` this now or later?" Learn immediately only if the user already asked for it.
- Patch the existing feature skill (e.g. `staff-activities`, `staff-feedbacks`, `student-activities`, `student-declared-skills`, `cofolio-*`, `backoffice-*`, `shared-*`); create a new `cofolio-<module>-<feature>`, `backoffice-<module>-<feature>` or `shared-<subject>` skill only if none covers the feature. Existing unprefixed skills keep their name.
- Record the final state only, at the level of detail described in the `learn` skill ("Level of detail for this repo"): functional rules, view structure, routes and components, API endpoints called, form rules, stores. Also record decisions and their why, user corrections (the last word wins), gotchas and open questions. Skip abandoned attempts unless they teach "don't do X because Y".
- Skip trivial tasks (typos, one-line fixes) — don't ask.
- This "ask first" rule is for features only. Patterns/corrections (learned immediately, no confirmation) and in-progress migrations (temporary `cofolio-<name>-migration` / `backoffice-<name>-migration` skill, deleted after the user confirms it's done) follow the "Continuous learning" rules of the `learn` skill and the global `~/.agents/AGENTS.md`.