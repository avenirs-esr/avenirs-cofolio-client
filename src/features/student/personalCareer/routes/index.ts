import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const personalCareerRoute: AvRoute = {
  ...ROUTES.STUDENT.PERSONAL_CAREER,
  component: () => import('@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT,
    ],
  },
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
      ...ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/ExperiencesSection.vue'),
    }
  ]
}

export const declaredProgramRoute: AvRoute = {
  ...ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED,
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DECLARED_PROGRAMS,
    ],
  }
}

export const declaredProgramUpdateRoute: AvRoute = {
  ...ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM,
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DECLARED_PROGRAMS,
    ],
  }
}

export const declaredExperienceRoute: AvRoute = {
  ...ROUTES.STUDENT.DECLARED_EXPERIENCE,
  props: route => ({
    experienceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.EXPERIENCES,
    ],
  }
}

export const declaredExperienceUpdateRoute: AvRoute = {
  ...ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE,
  props: route => ({
    experienceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/personalCareer/views/DeclaredExperienceUpdateView/DeclaredExperienceUpdateView.vue'),
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT,
      META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.EXPERIENCES,
    ],
  }
}
