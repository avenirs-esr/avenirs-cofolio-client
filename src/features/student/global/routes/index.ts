import { ROUTES } from '@/common/constants'
import { studentAmsRoute, studentEducationAmsRoute } from '@/features/student/ams/routes'
import { studentDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/student/declaredSkills/routes'
import { declaredProgramRoute, personalCareerRoute } from '@/features/student/personalCareer'
import { declaredExperienceRoute, declaredExperienceUpdateRoute, declaredProgramUpdateRoute } from '@/features/student/personalCareer/routes'
import { studentSelfKnowledgeCategoryRoute, studentSelfKnowledgeElementUpdateRoute } from '@/features/student/selfKnowledge'
import { studentEducationSkillsRoute, studentProjectSkillsRoute, studentSkillRoute } from '@/features/student/skills/routes'
import { studentToolsTracesRoute, studentTraceRoute } from '@/features/student/traces/routes'

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
        component: () => import('@/common/views/AccessibilityView/AccessibilityView.vue'),
      },
      studentDeclaredSkillRoute,
      studentAmsRoute,
      {
        ...ROUTES.STUDENT.COOKIES,
        component: () => import('@/common/views/CookiesView/CookiesView.vue'),
      },
      {
        ...ROUTES.STUDENT.DELIVERABLES,
        component: () => import('@/features/student/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'),
      },
      studentEducationSkillsRoute,
      studentEducationAmsRoute,
      {
        ...ROUTES.STUDENT.EVENTS,
        component: () => import('@/features/student/global/views/StudentEventsView/StudentEventsView.vue'),
      },
      {
        ...ROUTES.STUDENT.LEGAL,
        component: () => import('@/common/views/LegalView/LegalView.vue'),
      },
      {
        ...ROUTES.STUDENT.PERSONNAL_DATA,
        component: () => import('@/common/views/PersonnalDataView/PersonnalDataView.vue'),
      },
      studentProjectSkillsRoute,
      declaredProgramRoute,
      declaredProgramUpdateRoute,
      personalCareerRoute,
      declaredExperienceRoute,
      declaredExperienceUpdateRoute,
      {
        ...ROUTES.STUDENT.PROJECT_TRAJECTORIES,
        component: () => import('@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'),
      },
      studentSelfKnowledgeCategoryRoute,
      studentSelfKnowledgeElementUpdateRoute,
      studentSkillRoute,
      studentToolsTracesRoute,
      {
        ...ROUTES.STUDENT.TOOLS_PAGES,
        component: () => import('@/features/student/global/views/StudentToolsPagesView/StudentToolsPagesView.vue'),
      },
      {
        ...ROUTES.STUDENT.TOOLS_RESUMES,
        component: () => import('@/features/student/global/views/StudentToolsResumesView/StudentToolsResumesView.vue'),
      },
      studentTraceRoute,
      studentUpdateDeclaredSkillRoute,
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
