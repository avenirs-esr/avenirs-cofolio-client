import type { RoutePageProps } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { projectActivitiesRoutes, projectTrajectoriesRoutes, studentActivitiesCatalogRoute, studentActivityRoute } from '@/features/student/buildProject/routes'
import { studentProjectDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/student/declaredSkills/routes'
import { studentToolsKitRoute } from '@/features/student/kit/routes'
import { declaredProgramRoute, personalCareerRoute } from '@/features/student/personalCareer'
import { declaredExperienceRoute, declaredExperienceUpdateRoute, declaredProgramUpdateRoute } from '@/features/student/personalCareer/routes'
import { studentSelfKnowledgeCategoryRoute, studentSelfKnowledgeElementUpdateRoute } from '@/features/student/selfKnowledge'
import { studentProjectSkillsRoute } from '@/features/student/skills/routes'
import { studentToolsTraceRoute, studentToolsTracesRoute, studentToolsUpdateTraceRoute, studentTraceRoute, studentUpdateTraceRoute } from '@/features/student/traces/routes'

const footerLegalProps: RoutePageProps = {
  breadcrumbLinksRaw: [
    { textKey: 'student.global.navigation.tabs.home', to: ROUTES.STUDENT.HOME },
  ]
}

export default [
  {
    path: '/student',
    component: () => import('@/features/student/global/layouts/StudentLayout/StudentLayout.vue'),
    children: [
      {
        ...ROUTES.STUDENT.HOME,
        component: () => import('@/features/student/global/views/StudentHomeView/StudentHomeView.vue'),
      },
      {
        ...ROUTES.STUDENT.ACCESSIBILITY,
        props: () => footerLegalProps,
        component: () => import('@/common/views/AccessibilityView/AccessibilityView.vue'),
      },
      {
        ...ROUTES.STUDENT.COOKIES,
        props: () => footerLegalProps,
        component: () => import('@/common/views/CookiesView/CookiesView.vue'),
      },
      {
        ...ROUTES.STUDENT.DELIVERABLES,
        component: () => import('@/features/student/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'),
      },
      {
        ...ROUTES.STUDENT.EVENTS,
        component: () => import('@/features/student/global/views/StudentEventsView/StudentEventsView.vue'),
      },
      {
        ...ROUTES.STUDENT.LEGAL,
        props: () => footerLegalProps,
        component: () => import('@/common/views/LegalView/LegalView.vue'),
      },
      {
        ...ROUTES.STUDENT.PERSONAL_DATA,
        props: () => footerLegalProps,
        component: () => import('@/common/views/PersonalDataView/PersonalDataView.vue'),
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
      },
      {
        ...ROUTES.STUDENT.MAILBOX,
        component: () => import('@/features/student/user/views/StudentMailboxView/StudentMailboxView.vue'),
      },
    ],
  },
]
