# Learned skill content and format

## Classify and name

| Kind | Example | Destination |
|---|---|---|
| Feature | Order or checkout flow | `<slug>-<feature>-feature`, or split by sub-feature |
| Module / component | Auth module, DataTable | `<slug>-<name>-module` / `-component`, or its owning feature |
| Convention / test strategy | `vi.waitFor` preference, store testing | `<slug>-testing-conventions`, `<slug>-api-conventions` etc.; one section per rule |
| Structure | Feature folder layout | `<slug>-project-structure` |
| In-progress migration / refactor / epic | Move X to Y | Temporary `<slug>-<name>-migration`; see [maintenance.md](maintenance.md) |
| Conversation | `/learn what we did here` | All affected owning feature, conventions and structure skills |

In this repo, `<slug>` means **the app**, not the repo slug: `cofolio-` for `apps/avenirs-cofolio-client`, `backoffice-` for `apps/avenirs-cofolio-backoffice-client`, `shared-` for `packages/shared`. The skills of all workspaces share `.agents/skills/`, so the prefix makes ownership visible. Other repositories use their kebab-case repo slug; for instance, `oneSquare` → `onesquare-order-feature`.

Before creating a skill, inspect descriptions of overlapping skills in `.agents/skills/` and `~/.agents/skills/`. Patch an existing one even if its name predates the convention; renaming could break invocations. Mention its naming mismatch in the report if relevant. Avoid creating a near-duplicate merely to obtain the new prefix.

## Gather verified knowledge

Reuse the conversation first. Verify facts against current code, distinguishing observed behavior from hypotheses. Record user decisions and corrections (latest instruction wins); omit abandoned experiments unless they establish a useful "don't do X because Y". Never record log messages, codes, levels, fields or logging inventories: they change too easily.

- **Feature, module, component:** Capture functional rules and states, routes/views/components, hooks and HTTP endpoints, form fields and validation, stores/persistence, cross-feature dependencies, tests and open questions. Write for a reader who should not have to rescan the feature.
- **Convention:** Rule, why it prevents a problem, where it applies and a minimal ❌/✅ example drawn from or modeled on actual code. Use [pattern-template.md](pattern-template.md).
- **Structure:** Annotated folder tree to useful depth, naming/import/barrel/alias rules and where new files belong.
- **Migration:** Goal, target pattern with before/after, status, file-path checklist, decisions, pitfalls and definition of done. Use [migration-template.md](migration-template.md).

## Feature depth for this repo

Match the depth of `.agents/skills/staff-activities/` and `.agents/skills/staff-feedbacks/`. A future session should answer functional questions and change the feature from the skill alone.

- **`SKILL.md` (ideally <200 lines):** purpose and domain terms, end-to-end table `user action → view/component → query/mutation hook → HTTP method + endpoint`, key functional rules, "where to look/change" table, open questions and a reference index specifying when to read each file.
- **`references/` (one file per concern):** views/components, forms, API/queries and stores as needed. Capture:
  - Business rules: statuses and transitions, roles, limits and exact values, empty/error/loading/disabled states, visibility conditions.
  - Views/routes: tabs, sections, modals/drawers, component tree and key props/events; route name/path/view/guard/params/query and constants.
  - API: hook, HTTP method/endpoint, params/body and response DTOs, query keys, invalidations, polling/autosave triggers. Generated Orval hooks are in `@avenirs-esr/shared/api/avenir-esr`; never edit generated code.
  - Forms: fields/components, DTO mappings, defaults, exact validators and i18n error keys, enabled-submit logic, create/update/autosave and unsaved-change behavior.
  - Stores: state, getters/actions, readers/writers, persistence keys and reset behavior.
- Use exact file paths, component/hook/store/type names, enums and constants. Mark unverified items as open questions rather than asserting them.

For a large feature (>~6–8 reference files or independently worked sub-parts), create a short umbrella skill pointing to self-contained sub-feature skills and cross-link them. In a monorepo with front and back, trace the feature end to end (UI → front client → BFF/back endpoint → mapping → downstream services). Prefix reference names by layer when useful (`front-…`, `bff-…`, `shared-…`); put the cross-layer flow in the overview.

## Write through skill-creator

Load `skill-creator` before writing. Use only files a future session will actually need: `SKILL.md` and focused `references/`, optionally deterministic tested scripts/assets. Keep descriptions trigger-rich, with actual domain terms and component names; the description is visible before loading the body. Avoid deep reference nesting and duplicate prose. Skip `skill-creator`'s interview/eval/benchmark/package loop for ordinary `/learn` documentation.

The repo-specific learned-skill convention additionally records the verification date and source commit in frontmatter (a local extension of `skill-creator`'s base `name`/`description` format):

```yaml
---
name: cofolio-order-feature
description: "Cofolio order workflow, OrderView and order API. Use when working on orders, deliveries or their tests."
metadata:
  learned-at: "<YYYY-MM-DD>"
  source-commit: "<HEAD_COMMIT>"
---
```

Double-quote metadata values; otherwise YAML may interpret dates or digit-only hashes as non-strings. A future session can assess staleness with `git diff <source-commit> --stat -- <paths>`. Keep the skill's own `SKILL.md` overview concise and move depth to referenced files.
