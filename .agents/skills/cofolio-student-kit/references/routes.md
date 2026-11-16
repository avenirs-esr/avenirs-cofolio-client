# Kit navigation routes

`apps/avenirs-cofolio-client/src/features/student/kit/routes/index.ts` exports `studentToolsKitRoute` and `studentToolsKitRoutes`. They are included under the `/student` layout in `features/student/global/routes/index.ts` via `withRequiredRoles(ROUTE_ROLES.STUDENT.TOOLS, ...studentToolsKitRoutes, studentToolsKitRoute, ...)`, so the user needs the STUDENT category and `ROLE_STUDENT_EMPLOYMENT_KIT`. **Gotcha:** `studentToolsKitRoutes` already contains `studentToolsKitRoute`, so this registration repeats the Kit page route. Route constants live in `common/constants/route-names.ts`; paths below are the constant's relative path strings (nested children also inherit their parent route).

| `ROUTES.STUDENT` key | Relative path | View / behavior |
|---|---|---|
| `TOOLS_KIT` | `tools/kit` | `StudentToolsKitView` |
| `TOOLS_KIT_SKILLS` | `tools/kit/skills` | `StudentProjectSkillsView` |
| `TOOLS_KIT_SKILL` | `tools/kit/skill/:id` | `StudentDeclaredSkillView`, `skillId` prop |
| `TOOLS_KIT_UPDATE_SKILL` | `tools/kit/update-skill/:id` | `StudentUpdateDeclaredSkillView` |
| `TOOLS_KIT_ACTIVITIES` | `tools/kit/activities` | `ActivitiesView` |
| `TOOLS_KIT_ACTIVITY` | `tools/kit/activity/:id` | `ActivityView`, `id` prop |
| `TOOLS_KIT_PERSONAL_CAREER` | `tools/kit/personal-career` | `PersonalCareerView` with programs/experiences child routes |
| `TOOLS_KIT_DECLARED_PROGRAMS` | `tools/kit/declared-programs` | `ProgramsSection` child |
| `TOOLS_KIT_EXPERIENCES` | `tools/kit/experiences` | `ExperiencesSection` child, `?type=` query prop |
| `TOOLS_KIT_DECLARED_PROGRAM` / `TOOLS_KIT_UPDATE_DECLARED_PROGRAM` | `tools/kit/declared-program/:id` / `tools/kit/update-declared-program/:id` | Program detail / update |
| `TOOLS_KIT_EXPERIENCE` | `tools/kit/experience/:id` | `DeclaredExperienceView`, `experienceId` prop |
| `TOOLS_KIT_BUILD_PROJECT` | `tools/kit/build-project` | `StudentBuildProjectView` |
| `TOOLS_KIT_SELFKNOWLEDGE_CATEGORY` | `tools/kit/self-knowledge/:id` | `SelfKnowledgeCategoryView`, `categoryId` prop |
| `TOOLS_KIT_SELFKNOWLEDGE_ELEMENT_UPDATE` | `tools/kit/self-knowledge/:categoryId/:elementId/update` | `SelfKnowledgeElementUpdateView`, `categoryId` and `elementId` props |
| `TOOLS_KIT_TRACE` / `TOOLS_KIT_UPDATE_TRACE` | `tools/kit/trace/:id` / `tools/kit/update-trace/:id` | Trace detail / update, `traceId` prop |

Every Kit route provides `BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.*` metadata appropriate to its destination; the copied routes reuse other student feature views while keeping Kit navigation context. `features/student/kit/index.ts` currently exports nothing (`export default {}`); existing cross-feature Kit routes are imported directly from its `routes` barrel.
