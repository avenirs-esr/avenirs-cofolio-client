# Migration / refactor template (temporary skill)

A migration skill carries an in-progress, multi-session piece of work (migration,
refactor, epic) so any session can resume it from the skill alone. It is **temporary**:
it is deleted once the user confirms the work is done (see "Lifecycle" in SKILL.md).

Name: `<slug>-<name>-migration` (e.g. `onesquare-bff-domain-layer-migration`).

Layout:

```
<AGENTS_SKILLS_DIR>/<slug>-<name>-migration/
├── SKILL.md       status, goal, target pattern, checklist, decisions, pitfalls, done
└── plan/          the plan, design docs, ticket drafts (never in a repo-level plans/ folder)
    ├── <name>.md
    └── jira/00-epic.md, 01-….md …
```

SKILL.md links to `plan/<name>.md` ("read it first"); `plan/` is deleted with the skill.

## Frontmatter

~~~yaml
---
name: <slug>-<name>-migration
description: >-
  TEMPORARY skill — delete once the <name> migration is done. In-progress migration
  that <one sentence: from what to what>. Use whenever working on, continuing,
  reviewing or asking about <name>, <old/new folder names, aliases, function names,
  vocabulary people will use>, or when touching <paths being migrated>.
metadata:
  learned-at: "<YYYY-MM-DD>"
  source-commit: "<HEAD_COMMIT>"
  status: "in-progress"
  temporary: "true"
---
~~~

## Body

~~~markdown
# <Name> migration (in progress)

> ⚠️ Temporary skill. Deleted when the migration is done — see "Definition of done".

## Status
One line: what is done, what is next, last updated date.

## Goal and why
What changes and the reason (the bug, cost or limitation it removes).

## Target pattern
The rule every migrated piece must follow, with a minimal ❌ before / ✅ after
example taken from code that is already migrated.

## Checklist
| Item (feature / file / module) | State | Notes |
|---|---|---|
| `path/or/feature` | ✅ done (commit/PR) | |
| `path/or/feature` | ⬜ todo | blocked by … |

## Decisions
- <decision> — <why>. (User corrections win; keep only the final word.)

## Pitfalls
- Don't do X because Y (things discovered while migrating).

## Definition of done
- [ ] Checklist fully ✅ and merged.
- [ ] Lasting rules moved into permanent skills: <which skill(s)>.
- [ ] Old paths/names fixed in every other skill (`grep -rn "<old path>" .agents/skills`).
- [ ] This skill deleted.
~~~
