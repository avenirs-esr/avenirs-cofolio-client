---
name: cofolio-student-kit
description: "Reference for Cofolio's student Kit (Outils > Kit): valorized skills, experiences, activities, programs, self-knowledge and traces; StudentToolsKitView, Valorized*Container/Item, KitValorizationToggleFormField, ExportKitModal, DOCX generation, media ZIP download and TOOLS_KIT routes. Use when changing or answering questions about valorization, kit cards, kit exports, download-media, or kit breadcrumbs."
metadata:
  learned-at: "2026-11-13"
  source-commit: "bce01b2f8"
---

# Student Kit

Paths in this skill are relative to `apps/avenirs-cofolio-client/src/`, unless otherwise specified. The Kit is a read-only aggregation of entities with `valorized: true`, not a separately stored Kit. The student marks items for the Kit on each entity's update form; the Kit itself only lists and exports them. API hooks and DTOs come from the Orval-generated client in `@avenirs-esr/shared/api/avenir-esr`.

## Flow map

| Student action / content | Component / hook | HTTP method + endpoint |
|---|---|---|
| Open Kit | `StudentToolsKitView` → `useCurrentUser()` | `GET /me/{userCategory}/overview` for profile |
| Read valorized skills | `ValorizedDeclaredSkillsContainer` → `useGetSkillProgresses` | `GET /me/skill-progress?isValorized=true&pageSize=100` |
| Read professional/other experiences | `ValorizedDeclaredExperiencesContainer` ×2 → `useGetDeclaredExperienceView` | `GET /me/declared/experiences/view?isValorized=true&pageSize=100` |
| Read activities | `ValorizedActivitiesContainer` → `useGetDeclaredActivitiesView` | `GET /me/activity-progress?isValorized=true&pageSize=100` |
| Read programs | `ValorizedDeclaredProgramsContainer` → `useGetDeclaredPrograms` | `GET /me/declared/programs?isValorized=true&pageSize=100` |
| Read interests/other self-knowledge | `ValorizedSelfKnowledgeContainer` ×2 → `useGetSelfKnowledgeElements` | `GET /me/self-knowledge/elements` with category, `isValorized`, pagination |
| Read associated/unassociated traces | two `Valorized*TracesContainer` → `useTracesView` | `POST /me/traces/view?pageSize=100`, body `{ isAssociated, isValorized: true }` |
| Export text | `ExportKitModal` → `useExportKit.generateKitDocx` | Reuse valorized list queries; client-side `.docx` download |
| Export media | `ExportKitModal` → `useDownloadMedia` | `GET /me/kit/download-media` → `.zip` download |

## Rules and gotchas

- Text tab has skills, professional/other experiences, activities, programs, interests and other self-knowledge. Multimedia tab has associated and non-associated traces. DOCX contains profile plus the six text sections; traces are **not** included in the DOCX.
- The form accepts one or both export options and a nonblank name up to `KIT_NAME_MAX_LENGTH = 80`. It exports text first, then media. The ZIP is produced by the backend; the DOCX is generated in the browser.
- Every list query requests at most 100 entries; the professional/other experience split is performed **after** the common paginated response, so its displayed counts are the filtered page length, not separate server totals.
- The profile uses `useCurrentUser()` and the active category, not a hard-coded `useGetProfile(STUDENT)` call. The common Kit URL is a student route, guarded by student category plus `ROLE_STUDENT_EMPLOYMENT_KIT` through the parent router.
- `KitValorizationToggleFormField` changes the owning form's `valorized` field; saving that form persists it. Do not add a Kit-specific toggle mutation.

## Change map

| Concern | Location |
|---|---|
| Page and cards | `features/student/kit/views/StudentToolsKitView/`, `features/student/kit/components/cards/` |
| Export modal and validation | `.../components/overlay/ExportKitModal/`, `.../composables/use-export-kit-form/`, `features/student/kit/rules/export-kit.rules.ts`, `config.ts` |
| DOCX and image conversion | `features/student/kit/composables/use-export-kit/` |
| Kit-scoped navigation | `features/student/kit/routes/index.ts`, `common/constants/route-names.ts` |
| Valorization field | `features/student/global/components/interaction/formFields/KitValorizationToggleFormField/` and owners' update forms |
| MSW download mock | `__mocks__/msw/handlers/student/kit.handlers.ts` |

Read [page-and-valorization.md](references/page-and-valorization.md) for component hierarchy, list filters, empty states and how items become valorized. Read [export-and-api.md](references/export-and-api.md) for export form, download behavior, generated query contracts and DOCX sections. Read [routes.md](references/routes.md) for Kit route names, destination views and breadcrumbs.
