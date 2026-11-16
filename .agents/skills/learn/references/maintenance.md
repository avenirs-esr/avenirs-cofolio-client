# Maintaining learned skills

## Updating an existing skill

Read its full `SKILL.md` and the references you will change. Merge rather than append: update facts contradicted by current code and remove stale rules. Add trigger vocabulary to `description`; bump the quoted `metadata.learned-at` and `metadata.source-commit` fields when present. If the overview grows past ~400 lines, move detail into references or split a feature by independent sub-parts.

## Automatic learning

The repository/global AGENTS instructions can invoke `/learn` without the user typing it:

- A user-stated convention or correction → update/create its thematic conventions skill immediately; no confirmation. Report `Learned: <rule> → <skill>`.
- A completed migration step → update its temporary skill's checklist/status.
- Do not interview or ask questions in automatic mode. Verify against code before writing and report one concise line per skill.

## Learning this conversation

When asked to learn the session, harvest verified code flows and locations, root causes, final decisions and user corrections. Ignore temporary debugging and discarded attempts unless they teach a lasting pitfall. Map each finding to its owner (feature, conventions or structure), verify against the final code, patch existing skills first and report every created/updated skill so the user can catch misclassification.

## Temporary migration skills

A migration/refactor/POC/epic skill exists only while the work is in progress. Follow [migration-template.md](migration-template.md):

1. **Start:** Once the plan is approved or the first step begins, create or patch `<slug>-<name>-migration`, with a description beginning `TEMPORARY skill`, `metadata.status: "in-progress"` and `metadata.temporary: "true"`. Store any plan, design or ticket drafts under the skill's own `plan/` directory, never repo-level `.agents/plans/`; move an existing plan there and fix its links. Point to it from the overview.
2. **Continue:** On each step update checklist, status, decisions and pitfalls; bump learned date and source commit. Include target pattern and exact paths so any later session can resume.
3. **Close:** Ask the user **"Is the <name> migration done?"** when the checklist appears complete. Only after an explicit yes, transfer lasting rules to permanent skills, search all skills for old paths/names and update references, delete the temporary skill including its `plan/`, and report where knowledge moved. Never close it autonomously. For older hand-written temporary skills, follow their own definition of done.
