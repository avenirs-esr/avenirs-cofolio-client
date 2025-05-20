import type { AvRoute } from '@/common/types/router.types'
import type { RouteRecordRaw } from 'vue-router'

export const studentHomeRoute: AvRoute = {
  name: 'student-home',
  path: '',
  component: () =>
    import('@/features/student/views/StudentHomeView.vue'),
}

export const studentDeliverablesRoute: AvRoute = {
  path: 'deliverables',
  name: 'student-deliverables',
  component: () =>
    import('@/features/student/views/StudentDeliverablesView.vue'),
}

export const studentEventsRoute: AvRoute = {
  path: 'events',
  name: 'student-events',
  component: () =>
    import('@/features/student/views/StudentEventsView.vue'),
}

export const studentEducationSkillsRoute: AvRoute = {
  path: 'education/skills',
  name: 'student-education-skills',
  component: () =>
    import('@/features/student/views/StudentEducationSkillsView.vue'),
}

export const studentEducationActivitiesRoute: AvRoute = {
  path: 'education/activities',
  name: 'student-education-activities',
  component: () =>
    import('@/features/student/views/StudentEducationActivitiesView.vue'),
}

export const studentProjectSkillsRoute: AvRoute = {
  path: 'projects/skills',
  name: 'student-project-skills',
  component: () =>
    import('@/features/student/views/StudentProjectSkillsView.vue'),
}

export const studentProjectExperiencesRoute: AvRoute = {
  path: 'projects/experiences',
  name: 'student-project-experiences',
  component: () =>
    import('@/features/student/views/StudentProjectExperiencesView.vue'),
}

export const studentProjectTrajectoriesRoute: AvRoute = {
  path: 'projects/trajectories',
  name: 'student-project-trajectories',
  component: () =>
    import('@/features/student/views/StudentProjectTrajectoriesView.vue'),
}

export const studentToolsTracksRoute: AvRoute = {
  path: 'tools/tracks',
  name: 'student-tools-tracks',
  component: () =>
    import('@/features/student/views/StudentToolsTracksView.vue'),
}

export const studentToolsPagesRoute: AvRoute = {
  path: 'tools/pages',
  name: 'student-tools-pages',
  component: () =>
    import('@/features/student/views/StudentToolsPagesView.vue'),
}

export const studentToolsResumesRoute: AvRoute = {
  path: 'tools/resumes',
  name: 'student-tools-resumes',
  component: () =>
    import('@/features/student/views/StudentToolsResumesView.vue'),
}

export const studentAboutRoute: AvRoute = {
  path: 'about',
  name: 'student-about',
  component: () =>
    import('@/features/student/views/StudentAboutView.vue'),
}

export const studentMailboxRoute: AvRoute = {
  path: 'mailbox',
  name: 'student-mailbox',
  component: () =>
    import('@/features/student/views/StudentMailboxView.vue')
}

export const studentNotificationsRoute: AvRoute = {
  path: 'notifications',
  name: 'student-notifications',
  component: () =>
    import('@/features/student/views/StudentNotificationsView.vue')
}

const routes: RouteRecordRaw[] = [
  {
    path: '/student',
    component: () => import('@/features/student/layouts/StudentLayout.vue'),
    children: [
      studentHomeRoute,
      studentDeliverablesRoute,
      studentEducationSkillsRoute,
      studentEducationActivitiesRoute,
      studentEventsRoute,
      studentProjectSkillsRoute,
      studentProjectExperiencesRoute,
      studentProjectTrajectoriesRoute,
      studentToolsTracksRoute,
      studentToolsPagesRoute,
      studentToolsResumesRoute,
      studentAboutRoute,
      studentMailboxRoute,
      studentNotificationsRoute
    ],
  },
]

export default routes
