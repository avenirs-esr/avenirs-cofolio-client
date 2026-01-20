import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const personalCareerRoute: AvRoute = {
  ...ROUTES.STUDENT.PERSONAL_CAREER,
  component: () => import('@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'),
  redirect: { name: ROUTES.STUDENT.PERSONAL_CAREER_MY_CAREER.name },
  children: [
    {
      ...ROUTES.STUDENT.PERSONAL_CAREER_MY_CAREER,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/MyCareerSection/MyCareerSection.vue'),
    },
    {
      ...ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/ProgramsSection.vue'),
    },
    {
      ...ROUTES.STUDENT.PERSONAL_CAREER_ACTIVITIES,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/ActivitiesSection/ActivitiesSection.vue'),
    },
    {
      ...ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/ExperiencesSection.vue'),
    }
  ]
}

export const declaredProgramRoute: AvRoute = {
  ...ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED,
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'),
}

export const declaredProgramUpdateRoute: AvRoute = {
  ...ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM,
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.vue'),
}

export const declaredExperienceRoute: AvRoute = {
  ...ROUTES.STUDENT.DECLARED_EXPERIENCE,
  props: route => ({
    experienceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'),
}
