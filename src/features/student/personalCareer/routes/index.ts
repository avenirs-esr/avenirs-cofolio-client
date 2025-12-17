import { ROUTE_NAMES } from '@/common/constants'

export const personalCareerRoute = {
  ...ROUTE_NAMES.STUDENT.PERSONAL_CAREER,
  component: () => import('@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'),
  redirect: { name: ROUTE_NAMES.STUDENT.PERSONAL_CAREER_MY_CAREER.name },
  children: [
    {
      ...ROUTE_NAMES.STUDENT.PERSONAL_CAREER_MY_CAREER,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/MyCareerSection/MyCareerSection.vue'),
    },
    {
      ...ROUTE_NAMES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/DeclaredProgramsSection/DeclaredProgramsSection.vue'),
    },
    {
      ...ROUTE_NAMES.STUDENT.PERSONAL_CAREER_ACTIVITIES,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/ActivitiesSection/ActivitiesSection.vue'),
    },
    {
      ...ROUTE_NAMES.STUDENT.PERSONAL_CAREER_EXPERIENCES,
      component: () => import('@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/ExperiencesSection.vue'),
    }
  ]
}
