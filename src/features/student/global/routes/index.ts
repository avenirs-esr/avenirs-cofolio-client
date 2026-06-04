import type { RoutePageProps } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { projectActivitiesRoutes, projectTrajectoriesRoutes } from '@/features/student/buildProject/routes'
import { studentProjectDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/student/declaredSkills/routes'
import { declaredProgramRoute, personalCareerRoute } from '@/features/student/personalCareer'
import { declaredExperienceRoute, declaredExperienceUpdateRoute, declaredProgramUpdateRoute } from '@/features/student/personalCareer/routes'
import { studentSelfKnowledgeCategoryRoute, studentSelfKnowledgeElementUpdateRoute } from '@/features/student/selfKnowledge'
import { studentEducationSkillRoute, studentEducationSkillsRoute, studentProjectSkillRoute, studentProjectSkillsRoute, studentSkillRoute } from '@/features/student/skills/routes'
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
      studentEducationSkillRoute,
      studentEducationSkillsRoute,
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
      studentProjectSkillRoute,
      studentProjectSkillsRoute,
      declaredProgramRoute,
      declaredProgramUpdateRoute,
      personalCareerRoute,
      declaredExperienceRoute,
      declaredExperienceUpdateRoute,
      ...projectActivitiesRoutes,
      ...projectTrajectoriesRoutes,
      studentSelfKnowledgeCategoryRoute,
      studentSelfKnowledgeElementUpdateRoute,
      studentSkillRoute,
      {
        ...ROUTES.STUDENT.TOOLS_PAGES,
        component: () => import('@/features/student/global/views/StudentToolsPagesView/StudentToolsPagesView.vue'),
      },
      studentToolsTracesRoute,
      studentToolsTraceRoute,
      studentToolsUpdateTraceRoute,
      studentTraceRoute,
      {
        ...ROUTES.STUDENT.TOOLS_RESUMES,
        component: () => import('@/features/student/global/views/StudentToolsResumesView/StudentToolsResumesView.vue'),
      },
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
      {
        ...ROUTES.STUDENT.NOTIFICATIONS,
        component: () => import('@/features/student/user/views/StudentNotificationsView/StudentNotificationsView.vue'),
      },
      {
        ...ROUTES.STUDENT.APC_UNAVAILABLE,
        component: () => import('@/features/student/global/views/StudentApcUnavailableView/StudentApcUnavailableView.vue'),
      },
    ],
  },
]
