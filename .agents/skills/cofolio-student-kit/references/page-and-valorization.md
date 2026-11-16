# Kit page, cards and valorization

Paths below start at `apps/avenirs-cofolio-client/src/`.

`features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue`: `PageTitle` with information tooltip and `ExportKitButton` action; `QuerySuspense` wraps `ProfileCard` populated from `useCurrentUser().profile` (active category); `KitContentTabs` renders `AvTabs`, initially text (index 0), then multimedia. There is no Kit Pinia store or Kit entity.

| Tab and section | Component in `views/StudentToolsKitView/components/` | Query and display rule |
|---|---|---|
| Text: skills | `ValorizedDeclaredSkillsContainer` → `ValorizedDeclaredSkillItem` | `useGetSkillProgresses({ isValorized: true, pageSize: 100 })`; count from `page.totalElements` |
| Text: professional / other experiences | `ValorizedDeclaredExperiencesContainer` twice → `ValorizedDeclaredExperienceItem` | One `useGetDeclaredExperienceView({ isValorized: true, pageSize: 100 })` query shared by two containers; client filter via `isProfessional(experience, professionalExperience)`; count is **filtered page length**. See-all uses `TOOLS_KIT_EXPERIENCES?type=PROFESSIONAL|OTHER` |
| Text: activities | `ValorizedActivitiesContainer` → `ValorizedActivityItem` | `useGetDeclaredActivitiesView({ isValorized: true, pageSize: 100 })` |
| Text: programs | `ValorizedDeclaredProgramsContainer` → `ValorizedDeclaredProgramItem` | `useGetDeclaredPrograms({ isValorized: true, pageSize: 100 })` |
| Text: interests / other self-knowledge | `ValorizedSelfKnowledgeContainer` twice → `ValorizedSelfKnowledgeItem` | `useGetSelfKnowledgeElements({ selfKnowledgeCategories: [INTERESTS] / all except INTERESTS, isValorized: true, pageSize: 100 })`; only "other" shows category badges |
| Multimedia: associated / unassociated traces | `ValorizedAssociatedTracesContainer` / `ValorizedNonAssociatedTracesContainer` → `TraceValorizedItem` | `useTracesView({ isAssociated: true/false, isValorized: true }, { pageSize: 100 })` uses **POST**, not GET |

Apart from experiences, displayed count comes from `page.totalElements`. Containers use `isFetching` for the loading state. `features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.vue` wraps the list in a collapsible `Card` + `QuerySuspense` (error/loading/empty) and renders optional see-all links; text containers provide empty messages, while trace containers do not pass an explicit empty state or see-all link. The page itself does not paginate beyond 100.

`ValorizedItem` maps type (`types/valorized.types.ts`: `ValorizedItemType` plus `ESelfKnowledgeCategory`) to Kit-scoped detail routes for trace, experience, program, skill and activity. **Self-knowledge is an exception**: its access action uses `ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY` with `parentId` and `?elementId=itemId`, not the Kit-scoped category route. `TraceValorizedItem` adds attachment, author and AI badges, date/size and a truncated personal note.

The shared `features/student/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.vue` renders the parent TanStack `form.Field name="valorized"` through `ValorizeToggle`; update emits a `change` boolean too. Owners: `features/student/traces/views/StudentTraceView/components/UpdateTraceForm/`, `features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillForm/`, `features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/`, `features/student/personalCareer/views/DeclaredProgramUpdateView/components/DeclaredProgramUpdateForm/`, `features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/`, `features/student/activities/components/drawers/UpdateActivityDrawer/`. The owner's save persists the flag; the Kit never issues a valorization mutation.
