import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { ROUTE_ROLES } from '@/common/constants/route-roles'
import { withRequiredRoles } from '@/common/utils/route/route'
import { studentActivitiesRoutes } from '@/features/student/activities/routes'
import { projectBuildProjectRoutes } from '@/features/student/buildProject/routes'
import { studentProjectDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/student/declaredSkills/routes'
import { studentToolsKitRoute, studentToolsKitRoutes } from '@/features/student/kit/routes'
import { declaredProgramRoute, personalCareerRoute } from '@/features/student/personalCareer'
import {
  declaredExperienceRoute,
  declaredExperienceUpdateRoute,
  declaredProgramUpdateRoute,
} from '@/features/student/personalCareer/routes'
import { studentSelfKnowledgeCategoryRoute, studentSelfKnowledgeElementUpdateRoute } from '@/features/student/selfKnowledge'
import { studentSkillsRoute } from '@/features/student/skills/routes'
import {
  studentToolsTraceRoute,
  studentToolsTracesRoute,
  studentToolsUpdateTraceRoute,
  studentTraceRoute,
  studentTracesRoutes,
} from '@/features/student/traces/routes'

const breadcrumb = [...BASE_BREADCRUMBS.STUDENT.HOME.BASE]

export default [
  {
    path: '/student',
    component: () => import('@/features/student/global/layouts/StudentLayout/StudentLayout.vue'),
    meta: {
      roles: [EUserCategory.STUDENT],
      cguRouteName: ROUTES.STUDENT.CGU.name,
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
        ...ROUTES.STUDENT.CGU,
        component: () => import('@/common/views/CguView/CguView.vue'),
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
        ...ROUTES.STUDENT.PERSONAL_DATA,
        component: () => import('@/common/views/PersonalDataView/PersonalDataView.vue'),
        meta: { breadcrumb },
      },
      ...withRequiredRoles(
        ROUTE_ROLES.STUDENT.PORTFOLIO,
        studentProjectDeclaredSkillRoute,
        studentSkillsRoute,
        declaredProgramRoute,
        declaredProgramUpdateRoute,
        personalCareerRoute,
        declaredExperienceRoute,
        declaredExperienceUpdateRoute,
        ...projectBuildProjectRoutes,
        ...studentTracesRoutes,
        studentSelfKnowledgeCategoryRoute,
        studentSelfKnowledgeElementUpdateRoute,
        studentUpdateDeclaredSkillRoute,
        studentTraceRoute,
      ),
      ...withRequiredRoles(ROUTE_ROLES.STUDENT.ACTIVITIES, ...studentActivitiesRoutes),
      ...withRequiredRoles(
        ROUTE_ROLES.STUDENT.TOOLS,
        ...studentToolsKitRoutes,
        studentToolsKitRoute,
        studentToolsTracesRoute,
        studentToolsTraceRoute,
        studentToolsUpdateTraceRoute,
      ),

      {
        ...ROUTES.STUDENT.ABOUT,
        component: () => import('@/features/student/global/views/StudentAboutView/StudentAboutView.vue'),
        meta: { breadcrumb },
      }
    ],
  },
]
