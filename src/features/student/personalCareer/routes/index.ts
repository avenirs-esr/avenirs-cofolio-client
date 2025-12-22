import { ROUTES } from '@/common/constants'

export const personalCareerRoute = {
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
