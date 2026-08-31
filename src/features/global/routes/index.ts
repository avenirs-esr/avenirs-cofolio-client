import type { RoutePageProps } from '@/common/types'
import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { staffActivitiesRoutes } from '@/features/activities/routes'
import { staffActivityFeedbacksRoute, staffStudentTrackingFeedbacksRoutes } from '@/features/feedbacks/routes'
import { studentProjectDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/declaredSkills'
import { studentProjectSkillsRoute } from '@/features/skills'
import { declaredProgramRoute } from '@/features/personalCareer'
import { declaredExperienceRoute, declaredExperienceUpdateRoute, declaredProgramUpdateRoute, personalCareerRoute } from '@/features/personalCareer/routes'
import { projectActivitiesRoutes, projectTrajectoriesRoutes, studentActivitiesCatalogRoute, studentActivityRoute } from '@/features/buildProject/routes'
import { studentSelfKnowledgeCategoryRoute, studentSelfKnowledgeElementUpdateRoute } from '@/features/selfKnowledge'
import { studentToolsKitRoute } from '@/features/kit/routes'
import { studentToolsTraceRoute, studentToolsTracesRoute } from '@/features/traces'
import { studentToolsUpdateTraceRoute, studentTraceRoute, studentUpdateTraceRoute } from '@/features/traces/routes'

const footerLegalProps: RoutePageProps = {
  breadcrumbLinksRaw: [
    { textKey: 'staff.global.navigation.tabs.home', to: ROUTES.STAFF.HOME },
  ]
}

export default [
  {
    path: '/staff',
    component: () => import('@/features/global/layouts/StaffLayout/StaffLayout.vue'),
    meta: {
      roles: [EUserCategory.STAFF]
    },
    children: [
      {
        ...ROUTES.STAFF.HOME,
        component: () =>
          import('@/features/global/views/StaffHomeView/StaffHomeView.vue'),
      },
      {
        ...ROUTES.STAFF.ACCESSIBILITY,
        props: () => footerLegalProps,
        component: () =>
          import('@/common/views/AccessibilityView/AccessibilityView.vue'),
      },
      {
        ...ROUTES.STAFF.COOKIES,
        props: () => footerLegalProps,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
      },
      {
        ...ROUTES.STAFF.LEGAL,
        props: () => footerLegalProps,
        component: () =>
          import('@/common/views/LegalView/LegalView.vue'),
      },
      {
        ...ROUTES.STAFF.PERSONAL_DATA,
        props: () => footerLegalProps,
        component: () =>
          import('@/common/views/PersonalDataView/PersonalDataView.vue'),
      },
      ...staffActivitiesRoutes,
      staffActivityFeedbacksRoute,
      ...staffStudentTrackingFeedbacksRoutes,
    ]
  },
  {
    path: '/student',
    component: () => import('@/features/global/layouts/StudentLayout/StudentLayout.vue'),
    meta: {
      roles: [EUserCategory.STUDENT]
    },
    children: [
      {
        ...ROUTES.STUDENT.HOME,
        component: () => import('@/features/global/views/StudentHomeView/StudentHomeView.vue'),
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
        component: () => import('@/features/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'),
      },
      {
        ...ROUTES.STUDENT.EVENTS,
        component: () => import('@/features/global/views/StudentEventsView/StudentEventsView.vue'),
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
        component: () => import('@/features/global/views/StudentAboutView/StudentAboutView.vue'),
      },
      {
        ...ROUTES.STUDENT.MAILBOX,
        component: () => import('@/features/user/views/StudentMailboxView/StudentMailboxView.vue'),
      },
    ],
  },
]
