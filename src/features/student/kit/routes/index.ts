import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentToolsKitRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT,
  component: () => import('@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.BASE],
  },
}

export const studentToolsKitSkillsRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_SKILLS,
  component: () => import('@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SKILLS],
  },
}

export const studentToolsKitSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () => import('@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SKILLS],
  },
}

export const studentToolsKitUpdateSkillRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_UPDATE_SKILL,
  props: route => ({
    skillId: route.params.id,
  }),
  component: () => import('@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SKILLS],
  },
}

export const studentToolsKitActivitiesRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_ACTIVITIES,
  component: () => import('@/features/student/activities/views/ActivitiesView/ActivitiesView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.ACTIVITIES],
  },
}

export const studentToolsKitActivityRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_ACTIVITY,
  props: route => ({
    id: route.params.id,
  }),
  component: () => import('@/features/student/activities/views/ActivityView/ActivityView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.ACTIVITIES],
  },
}

export const studentToolsKitPersonalCareerRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_PERSONAL_CAREER,
  component: () => import('@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.PERSONAL_CAREER.BASE],
  },
  redirect: { name: ROUTES.STUDENT.TOOLS_KIT_PERSONAL_CAREER.name },
  children: [
    {
      ...ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAMS,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/ProgramsSection.vue'),
    },
    {
      ...ROUTES.STUDENT.TOOLS_KIT_EXPERIENCES,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/ExperiencesSection.vue'),
      props: route => ({
        type: route.query.type,
      }),
    }
  ]
}

export const studentToolsKitDeclaredProgramRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAM,
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.PERSONAL_CAREER.DECLARED_PROGRAMS],
  }
}

export const studentToolsKitUpdateDeclaredProgramRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_UPDATE_DECLARED_PROGRAM,
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.PERSONAL_CAREER.DECLARED_PROGRAMS],
  }
}

export const studentToolsKitExperienceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_EXPERIENCE,
  props: route => ({
    experienceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.PERSONAL_CAREER.EXPERIENCES],
  }
}

export const studentToolsKitBuildProjectRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_BUILD_PROJECT,
  component: () => import('@/features/student/global/views/StudentBuildProjectView/StudentBuildProjectView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.BUILD_PROJECT],
  },
}

export const studentToolsKitSelfKnowledgeCategoryRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_SELFKNOWLEDGE_CATEGORY,
  props: route => ({
    categoryId: route.params.id,
  }),
  component: () =>
    import('@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SELF_KNOWLEDGE]
  }
}

export const studentToolsKitSelfKnowledgeElementUpdateRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_SELFKNOWLEDGE_ELEMENT_UPDATE,
  props: route => ({
    categoryId: route.params.categoryId,
    elementId: route.params.elementId,
  }),
  component: () =>
    import('@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/SelfKnowledgeElementUpdateView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SELF_KNOWLEDGE]
  }
}

export const studentToolsKitTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () => import('@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.TRACES],
  },
}

export const studentToolsKitUpdateTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_UPDATE_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () => import('@/features/student/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.TRACES],
  },
}

export const studentToolsKitRoutes: AvRoute[] = [
  studentToolsKitRoute,
  studentToolsKitSkillsRoute,
  studentToolsKitSkillRoute,
  studentToolsKitUpdateSkillRoute,
  studentToolsKitActivitiesRoute,
  studentToolsKitActivityRoute,
  studentToolsKitPersonalCareerRoute,
  studentToolsKitDeclaredProgramRoute,
  studentToolsKitUpdateDeclaredProgramRoute,
  studentToolsKitExperienceRoute,
  studentToolsKitBuildProjectRoute,
  studentToolsKitSelfKnowledgeCategoryRoute,
  studentToolsKitSelfKnowledgeElementUpdateRoute,
  studentToolsKitTraceRoute,
  studentToolsKitUpdateTraceRoute
]
