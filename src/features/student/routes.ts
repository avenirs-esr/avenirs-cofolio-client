import type { RouteRecordRaw } from 'vue-router'

export const STUDENT_HOME_ROUTE = 'student-home'
export const STUDENT_EDUCATION_SKILLS_ROUTE = 'student-education-skills'
export const STUDENT_EDUCATION_PRACTICE_ROUTE = 'student-education-practice'
export const STUDENT_PROJECT_SKILLS_ROUTE = 'student-project-skills'
export const STUDENT_PROJECT_EXPERIENCES_ROUTE = 'student-project-experiences'
export const STUDENT_PROJECT_TRAJECTORIES_ROUTE = 'student-project-trajectories'
export const STUDENT_TOOLS_TRACKS_ROUTE = 'student-tools-tracks'
export const STUDENT_TOOLS_PAGES_ROUTE = 'student-tools-pages'
export const STUDENT_TOOLS_RESUMES_ROUTE = 'student-tools-resumes'
export const STUDENT_ABOUT_ROUTE = 'student-about'
export const STUDENT_NOTIFICATIONS_ROUTE = 'student-notifications'
export const STUDENT_MESSAGES_ROUTE = 'student-messages'

const routes: RouteRecordRaw[] = [
  {
    path: '/student',
    component: () => import('@/features/student/layouts/StudentLayout.vue'),
    children: [
      {
        path: '',
        name: STUDENT_HOME_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'education/skills',
        name: STUDENT_EDUCATION_SKILLS_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'education/practice',
        name: STUDENT_EDUCATION_PRACTICE_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'projects/skills',
        name: STUDENT_PROJECT_SKILLS_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'projects/experiences',
        name: STUDENT_PROJECT_EXPERIENCES_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'projects/trajectories',
        name: STUDENT_PROJECT_TRAJECTORIES_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'tools/tracks',
        name: STUDENT_TOOLS_TRACKS_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'tools/pages',
        name: STUDENT_TOOLS_PAGES_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'tools/resumes',
        name: STUDENT_TOOLS_RESUMES_ROUTE,
        component: () =>
          import('@/features/student/views/StudentHomeView.vue'),
      },
      {
        path: 'about',
        name: STUDENT_ABOUT_ROUTE,
        component: () =>
          import('@/features/student/views/StudentAboutView.vue'),
      },
      {
        path: 'notifications',
        name: STUDENT_NOTIFICATIONS_ROUTE,
        component: () =>
          import('@/features/student/views/StudentAboutView.vue'),
      },
      {
        path: 'messages',
        name: STUDENT_MESSAGES_ROUTE,
        component: () =>
          import('@/features/student/views/StudentAboutView.vue'),
      },
    ],
  },
]

export default routes
