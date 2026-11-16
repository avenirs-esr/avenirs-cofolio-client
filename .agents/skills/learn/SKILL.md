---
name: learn
description: "Persist durable codebase knowledge as project-local OpenCode skills. Use for /learn requests about features, modules, components, architecture, testing patterns, conventions, migrations, or this conversation; also use after deep exploration worth preserving, when the user corrects a convention, and when an in-progress migration changes status."
---

# Learn

Turn verified codebase knowledge and user decisions into skills future sessions can use without repeating the investigation. Prefer exact paths, rules and the reason behind decisions. A learned skill should let its reader answer questions or change the subject safely.

## Workflow

1. **Resolve the repository.** From its root run `bash .agents/skills/learn/scripts/context.sh` to obtain `REPO_ROOT`, `REPO_SLUG`, `AGENTS_SKILLS_DIR`, `HEAD_COMMIT`, workspaces and existing skills. Write project knowledge to `<REPO_ROOT>/.agents/skills/`; use `~/.agents/skills/` only outside a repo or when explicitly asked for a global skill.
2. **Choose the owner.** Classify the request (feature, module, convention, structure, test strategy, migration or conversation). Search existing local and global skill names and descriptions before creating anything. Patch an overlapping skill in place, including one with an old unprefixed name; avoid near-duplicates. In this monorepo name new skills `cofolio-<module>-<feature>`, `backoffice-<module>-<feature>` or `shared-<subject>` according to their owner. Elsewhere use `<repo-slug>-<subject>`. Group conventions by theme, not by individual rule. See [skill-content.md](references/skill-content.md).
3. **Verify and scope the knowledge.** Reuse the conversation, then inspect code only where needed. Keep the final verified behavior, user corrections, decisions and gotchas; mark uncertain matters as open questions. Never record log statements or logging inventories. For multi-app features, trace UI → shared client → backend when the layers exist. See [skill-content.md](references/skill-content.md).
4. **Write with `skill-creator`.** Load `skill-creator`; follow its concise, trigger-focused description, anatomy and progressive disclosure guidance. Skip its interview, eval and benchmark loop for learned knowledge. Keep `SKILL.md` a short overview and route detailed facts into `references/` by concern. Patch existing content by reconciling changed facts, not appending blindly. Use this repo's dated/source-commit frontmatter convention for learned skills; see [skill-content.md](references/skill-content.md).
5. **Expose new project skills.** After creating a skill in `.agents/skills/<name>/`, check whether `.claude/skills/` and `.github/skills/` exist. For each directory that exists, create `<directory>/<name>` as a relative symlink to `../../.agents/skills/<name>` if that path does not already exist. Do not create missing skill directories or overwrite an existing file or symlink; verify each new link resolves to the skill. This also applies to newly created temporary migration skills, not to updates of existing skills.
6. **Maintain the lifecycle.** For an in-progress refactor or epic, maintain a temporary migration skill and its plan within that skill; do not close it without user confirmation. When asked to learn the current conversation, map each durable finding to its owning skill. See [maintenance.md](references/maintenance.md).
7. **Report.** State which skills were created or patched, their `.agents` paths, references added and any open questions. Keep automatic-mode reports to one line per skill.

## Select the right reference

- [skill-content.md](references/skill-content.md): classification, naming examples, feature depth, templates, frontmatter and large/monorepo features. Read before writing a feature or a new skill.
- [maintenance.md](references/maintenance.md): patching, automatic corrections, conversation harvesting and temporary migration lifecycle. Read when updating an existing skill or working across sessions.
- [pattern-template.md](references/pattern-template.md): a single convention inside a thematic skill; use when the user establishes or corrects a rule.
- [migration-template.md](references/migration-template.md): format for a temporary migration/refactor/epic skill.
- [feature-checklist.md](references/feature-checklist.md): generic cross-stack prompts; use only when the repo-specific detail guide in `skill-content.md` does not cover a layer.
