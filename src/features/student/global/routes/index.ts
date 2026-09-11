import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { projectActivitiesRoutes, projectTrajectoriesRoutes, studentActivitiesCatalogRoute, studentActivityRoute } from '@/features/student/buildProject/routes'
import { studentProjectDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/student/declaredSkills/routes'
import { studentToolsKitRoute } from '@/features/student/kit/routes'
import { declaredProgramRoute, personalCareerRoute } from '@/features/student/personalCareer'
import { declaredExperienceRoute, declaredExperienceUpdateRoute, declaredProgramUpdateRoute } from '@/features/student/personalCareer/routes'
import { studentSelfKnowledgeCategoryRoute, studentSelfKnowledgeElementUpdateRoute } from '@/features/student/selfKnowledge'
import { studentProjectSkillsRoute } from '@/features/student/skills/routes'
import { studentToolsTraceRoute, studentToolsTracesRoute, studentToolsUpdateTraceRoute, studentTraceRoute, studentUpdateTraceRoute } from '@/features/student/traces/routes'

const breadcrumb = [META_BREADCRUMBS.STUDENT.HOME]

export default [
  {
    path: '/student',
    component: () => import('@/features/student/global/layouts/StudentLayout/StudentLayout.vue'),
    meta: {
      roles: [EUserCategory.STUDENT]
    },
    children: [
      {
        ...ROUTES.STUDENT.HOME,
        component: () => import('@/features/student/global/views/StudentHomeView/StudentHomeView.vue'),
      },
      {
        ...ROUTES.STUDENT.ACCESSIBILITY,
        component: () => import('@/common/views/AccessibilityView/AccessibilityView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STUDENT.COOKIES,
        component: () => import('@/common/views/CookiesView/CookiesView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STUDENT.DELIVERABLES,
        component: () => import('@/features/student/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STUDENT.EVENTS,
        component: () => import('@/features/student/global/views/StudentEventsView/StudentEventsView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STUDENT.LEGAL,
        component: () => import('@/common/views/LegalView/LegalView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STUDENT.PERSONAL_DATA,
        component: () => import('@/common/views/PersonalDataView/PersonalDataView.vue'),
        meta: { breadcrumb },
      },
      studentProjectDeclaredSkillRoute,
      studentProjectSkillsRoute,
      declaredProgramRoute,
      declaredProgramUpdateRoute,
      personalCareerRoute,
      declaredExperienceRoute,
      declaredExperienceUpdateRoute,
      ...projectActivitiesRoutes,
      ...projectTrajectoriesRoutes,
      studentActivitiesCatalogRoute,
      studentActivityRoute,
      studentSelfKnowledgeCategoryRoute,
      studentSelfKnowledgeElementUpdateRoute,
      studentToolsKitRoute,
      studentToolsTracesRoute,
      studentToolsTraceRoute,
      studentToolsUpdateTraceRoute,
      studentTraceRoute,
      studentUpdateDeclaredSkillRoute,
      studentUpdateTraceRoute,
      {
        ...ROUTES.STUDENT.ABOUT,
        component: () => import('@/features/student/global/views/StudentAboutView/StudentAboutView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STUDENT.MAILBOX,
        component: () => import('@/features/student/user/views/StudentMailboxView/StudentMailboxView.vue'),
        meta: { breadcrumb },
      },
    ],
  },
]
