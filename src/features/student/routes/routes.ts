import type { AvRoute } from '@/common/types/router.types'
import type StudentLayout from '@/features/student/layouts/StudentLayout/StudentLayout.vue'
import type StudentAboutView from '@/features/student/views/StudentAboutView/StudentAboutView.vue'
import type StudentApcUnavailableView from '@/features/student/views/StudentApcUnavailableView/StudentApcUnavailableView.vue'
import type StudentDeliverablesView from '@/features/student/views/StudentDeliverablesView/StudentDeliverablesView.vue'
import type StudentEducationActivitiesView from '@/features/student/views/StudentEducationActivitiesView/StudentEducationActivitiesView.vue'
import type StudentEducationSkillsView from '@/features/student/views/StudentEducationSkillsView/StudentEducationSkillsView.vue'
import type StudentEventsView from '@/features/student/views/StudentEventsView/StudentEventsView.vue'
import type StudentHomeView from '@/features/student/views/StudentHomeView/StudentHomeView.vue'
import type StudentMailboxView from '@/features/student/views/StudentMailboxView/StudentMailboxView.vue'
import type StudentNotificationsView from '@/features/student/views/StudentNotificationsView/StudentNotificationsView.vue'
import type StudentProjectExperiencesView from '@/features/student/views/StudentProjectExperiencesView/StudentProjectExperiencesView.vue'
import type StudentProjectSkillsView from '@/features/student/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import type StudentProjectTrajectoriesView from '@/features/student/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import type StudentSkillView from '@/features/student/views/StudentSkillView/StudentSkillView.vue'
import type StudentToolsPagesView from '@/features/student/views/StudentToolsPagesView/StudentToolsPagesView.vue'
import type StudentToolsResumesView from '@/features/student/views/StudentToolsResumesView/StudentToolsResumesView.vue'
import type StudentToolsTracesView from '@/features/student/views/StudentToolsTracesView/StudentToolsTracesView.vue'
import type { RouteRecordRaw } from 'vue-router'

export const studentHomeRoute: AvRoute = {
  path: '',
  name: 'student-home',
  component: () =>
    import('@/features/student/views/StudentHomeView/StudentHomeView.vue') as Promise<{
      default: typeof StudentHomeView
    }>,
}

export const studentDeliverablesRoute: AvRoute = {
  path: 'deliverables',
  name: 'student-deliverables',
  component: () =>
    import('@/features/student/views/StudentDeliverablesView/StudentDeliverablesView.vue') as Promise<{
      default: typeof StudentDeliverablesView
    }>,
}

export const studentEventsRoute: AvRoute = {
  path: 'events',
  name: 'student-events',
  component: () =>
    import('@/features/student/views/StudentEventsView/StudentEventsView.vue') as Promise<{
      default: typeof StudentEventsView
    }>,
}

export const studentEducationSkillsRoute: AvRoute = {
  path: 'education/skills',
  name: 'student-education-skills',
  component: () =>
    import('@/features/student/views/StudentEducationSkillsView/StudentEducationSkillsView.vue') as Promise<{
      default: typeof StudentEducationSkillsView
    }>,
}

export const studentEducationActivitiesRoute: AvRoute = {
  path: 'education/activities',
  name: 'student-education-activities',
  component: () =>
    import('@/features/student/views/StudentEducationActivitiesView/StudentEducationActivitiesView.vue') as Promise<{
      default: typeof StudentEducationActivitiesView
    }>,
}

export const studentProjectSkillsRoute: AvRoute = {
  path: 'projects/skills',
  name: 'student-project-skills',
  component: () =>
    import('@/features/student/views/StudentProjectSkillsView/StudentProjectSkillsView.vue') as Promise<{
      default: typeof StudentProjectSkillsView
    }>,
}

export const studentProjectExperiencesRoute: AvRoute = {
  path: 'projects/experiences',
  name: 'student-project-experiences',
  component: () =>
    import('@/features/student/views/StudentProjectExperiencesView/StudentProjectExperiencesView.vue') as Promise<{
      default: typeof StudentProjectExperiencesView
    }>,
}

export const studentProjectTrajectoriesRoute: AvRoute = {
  path: 'projects/trajectories',
  name: 'student-project-trajectories',
  component: () =>
    import('@/features/student/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue') as Promise<{
      default: typeof StudentProjectTrajectoriesView
    }>,
}

export const studentSkillRoute: AvRoute = {
  path: 'skill/:id',
  name: 'student-skill',
  component: () =>
    import('@/features/student/views/StudentSkillView/StudentSkillView.vue') as Promise<{
      default: typeof StudentSkillView
    }>,
}

export const studentToolsTracesRoute: AvRoute = {
  path: 'tools/traces',
  name: 'student-tools-traces',
  component: () =>
    import('@/features/student/views/StudentToolsTracesView/StudentToolsTracesView.vue') as Promise<{
      default: typeof StudentToolsTracesView
    }>,
}

export const studentToolsPagesRoute: AvRoute = {
  path: 'tools/pages',
  name: 'student-tools-pages',
  component: () =>
    import('@/features/student/views/StudentToolsPagesView/StudentToolsPagesView.vue') as Promise<{
      default: typeof StudentToolsPagesView
    }>,
}

export const studentToolsResumesRoute: AvRoute = {
  path: 'tools/resumes',
  name: 'student-tools-resumes',
  component: () =>
    import('@/features/student/views/StudentToolsResumesView/StudentToolsResumesView.vue') as Promise<{
      default: typeof StudentToolsResumesView
    }>,
}

export const studentAboutRoute: AvRoute = {
  path: 'about',
  name: 'student-about',
  component: () =>
    import('@/features/student/views/StudentAboutView/StudentAboutView.vue') as Promise<{
      default: typeof StudentAboutView
    }>,
}

export const studentMailboxRoute: AvRoute = {
  path: 'mailbox',
  name: 'student-mailbox',
  component: () =>
    import('@/features/student/views/StudentMailboxView/StudentMailboxView.vue') as Promise<{
      default: typeof StudentMailboxView
    }>,
}

export const studentNotificationsRoute: AvRoute = {
  path: 'notifications',
  name: 'student-notifications',
  component: () =>
    import('@/features/student/views/StudentNotificationsView/StudentNotificationsView.vue') as Promise<{
      default: typeof StudentNotificationsView
    }>,
}

export const studentApcUnavailableRoute: AvRoute = {
  path: 'apc-unavailable',
  name: 'student-apc-unavailable',
  component: () =>
    import('@/features/student/views/StudentApcUnavailableView/StudentApcUnavailableView.vue') as Promise<{
      default: typeof StudentApcUnavailableView
    }>,
}

const routes: RouteRecordRaw[] = [
  {
    path: '/student',
    component: () => import('@/features/student/layouts/StudentLayout/StudentLayout.vue') as Promise<{
      default: typeof StudentLayout
    }>,
    children: [
      studentHomeRoute,
      studentDeliverablesRoute,
      studentEducationSkillsRoute,
      studentEducationActivitiesRoute,
      studentEventsRoute,
      studentProjectSkillsRoute,
      studentProjectExperiencesRoute,
      studentProjectTrajectoriesRoute,
      studentSkillRoute,
      studentToolsTracesRoute,
      studentToolsPagesRoute,
      studentToolsResumesRoute,
      studentAboutRoute,
      studentMailboxRoute,
      studentNotificationsRoute,
      studentApcUnavailableRoute
    ],
  },
]

export default routes
