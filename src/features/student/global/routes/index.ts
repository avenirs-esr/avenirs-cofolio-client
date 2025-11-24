import { ROUTE_NAMES } from '@/common/constants'
import { studentAdditionalSkillRoute, studentUpdateAdditionalSkillRoute } from '@/features/student/additionalSkills/routes'
import { studentAmsRoute, studentEducationAmsRoute } from '@/features/student/ams/routes'
import { studentSelfKnowledgeCategoriesRoute } from '@/features/student/selfKnowledge'
import { studentEducationSkillsRoute, studentProjectSkillsRoute, studentSkillRoute } from '@/features/student/skills/routes'
import { studentToolsTracesRoute, studentTraceRoute } from '@/features/student/traces/routes'

export default [
  {
    path: '/student',
    component: () => import('@/features/student/global/layouts/StudentLayout/StudentLayout.vue'),
    children: [
      {
        ...ROUTE_NAMES.STUDENT.HOME,
        component: () => import('@/features/student/global/views/StudentHomeView/StudentHomeView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.ACCESSIBILITY,
        component: () => import('@/common/views/AccessibilityView/AccessibilityView.vue'),
      },
      studentAdditionalSkillRoute,
      studentAmsRoute,
      {
        ...ROUTE_NAMES.STUDENT.COOKIES,
        component: () => import('@/common/views/CookiesView/CookiesView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.DELIVERABLES,
        component: () => import('@/features/student/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'),
      },
      studentEducationSkillsRoute,
      studentEducationAmsRoute,
      {
        ...ROUTE_NAMES.STUDENT.EVENTS,
        component: () => import('@/features/student/global/views/StudentEventsView/StudentEventsView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.LEGAL,
        component: () => import('@/common/views/LegalView/LegalView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.PERSONNAL_DATA,
        component: () => import('@/common/views/PersonnalDataView/PersonnalDataView.vue'),
      },
      studentProjectSkillsRoute,
      {
        ...ROUTE_NAMES.STUDENT.PROJECT_EXPERIENCES,
        component: () => import('@/features/student/global/views/StudentProjectExperiencesView/StudentProjectExperiencesView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.PROJECT_TRAJECTORIES,
        component: () => import('@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'),
      },
      studentSelfKnowledgeCategoriesRoute,
      studentSkillRoute,
      studentToolsTracesRoute,
      {
        ...ROUTE_NAMES.STUDENT.TOOLS_PAGES,
        component: () => import('@/features/student/global/views/StudentToolsPagesView/StudentToolsPagesView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.TOOLS_RESUMES,
        component: () => import('@/features/student/global/views/StudentToolsResumesView/StudentToolsResumesView.vue'),
      },
      studentTraceRoute,
      studentUpdateAdditionalSkillRoute,
      {
        ...ROUTE_NAMES.STUDENT.ABOUT,
        component: () => import('@/features/student/global/views/StudentAboutView/StudentAboutView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.MAILBOX,
        component: () => import('@/features/student/user/components/composites/StudentMailboxView/StudentMailboxView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.NOTIFICATIONS,
        component: () => import('@/features/student/user/components/composites/StudentNotificationsView/StudentNotificationsView.vue'),
      },
      {
        ...ROUTE_NAMES.STUDENT.APC_UNAVAILABLE,
        component: () => import('@/features/student/global/views/StudentApcUnavailableView/StudentApcUnavailableView.vue'),
      },
    ],
  },
]
