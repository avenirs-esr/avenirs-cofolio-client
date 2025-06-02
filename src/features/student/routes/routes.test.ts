import StudentLayout from '@/features/student/layouts/StudentLayout/StudentLayout.vue'
import StudentAboutView from '@/features/student/views/StudentAboutView/StudentAboutView.vue'
import StudentApcUnavailableView from '@/features/student/views/StudentApcUnavailableView/StudentApcUnavailableView.vue'
import StudentDeliverablesView from '@/features/student/views/StudentDeliverablesView/StudentDeliverablesView.vue'
import StudentEducationActivitiesView from '@/features/student/views/StudentEducationActivitiesView/StudentEducationActivitiesView.vue'
import StudentEducationSkillsView from '@/features/student/views/StudentEducationSkillsView/StudentEducationSkillsView.vue'
import StudentEventsView from '@/features/student/views/StudentEventsView/StudentEventsView.vue'
import StudentHomeView from '@/features/student/views/StudentHomeView/StudentHomeView.vue'
import StudentMailboxView from '@/features/student/views/StudentMailboxView/StudentMailboxView.vue'
import StudentNotificationsView from '@/features/student/views/StudentNotificationsView/StudentNotificationsView.vue'
import StudentProjectExperiencesView from '@/features/student/views/StudentProjectExperiencesView/StudentProjectExperiencesView.vue'
import StudentProjectSkillsView from '@/features/student/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import StudentProjectTrajectoriesView from '@/features/student/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import StudentSkillView from '@/features/student/views/StudentSkillView/StudentSkillView.vue'
import StudentToolsPagesView from '@/features/student/views/StudentToolsPagesView/StudentToolsPagesView.vue'
import StudentToolsResumesView from '@/features/student/views/StudentToolsResumesView/StudentToolsResumesView.vue'
import StudentToolsTracksView from '@/features/student/views/StudentToolsTracksView/StudentToolsTracksView.vue'
import { testRoute } from 'tests/utils'
import routes, {
  studentAboutRoute,
  studentApcUnavailableRoute,
  studentDeliverablesRoute,
  studentEducationActivitiesRoute,
  studentEducationSkillsRoute,
  studentEventsRoute,
  studentHomeRoute,
  studentMailboxRoute,
  studentNotificationsRoute,
  studentProjectExperiencesRoute,
  studentProjectSkillsRoute,
  studentProjectTrajectoriesRoute,
  studentSkillRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentToolsTracksRoute
} from './routes'

testRoute(
  studentHomeRoute,
  {
    path: '',
    name: 'student-home',
  },
  StudentHomeView
)

testRoute(
  studentDeliverablesRoute,
  {
    path: 'deliverables',
    name: 'student-deliverables',
  },
  StudentDeliverablesView
)

testRoute(
  studentEventsRoute,
  {
    path: 'events',
    name: 'student-events',
  },
  StudentEventsView
)

testRoute(
  studentEducationSkillsRoute,
  {
    path: 'education/skills',
    name: 'student-education-skills',
  },
  StudentEducationSkillsView
)

testRoute(
  studentEducationActivitiesRoute,
  {
    path: 'education/activities',
    name: 'student-education-activities',
  },
  StudentEducationActivitiesView
)

testRoute(
  studentProjectSkillsRoute,
  {
    path: 'projects/skills',
    name: 'student-project-skills',
  },
  StudentProjectSkillsView
)

testRoute(
  studentProjectExperiencesRoute,
  {
    path: 'projects/experiences',
    name: 'student-project-experiences',
  },
  StudentProjectExperiencesView
)

testRoute(
  studentProjectTrajectoriesRoute,
  {
    path: 'projects/trajectories',
    name: 'student-project-trajectories',
  },
  StudentProjectTrajectoriesView
)

testRoute(
  studentSkillRoute,
  {
    path: 'skill/:id',
    name: 'student-skill',
  },
  StudentSkillView
)

testRoute(
  studentToolsTracksRoute,
  {
    path: 'tools/tracks',
    name: 'student-tools-tracks',
  },
  StudentToolsTracksView
)

testRoute(
  studentToolsPagesRoute,
  {
    path: 'tools/pages',
    name: 'student-tools-pages',
  },
  StudentToolsPagesView
)

testRoute(
  studentToolsResumesRoute,
  {
    path: 'tools/resumes',
    name: 'student-tools-resumes',
  },
  StudentToolsResumesView
)

testRoute(
  studentAboutRoute,
  {
    path: 'about',
    name: 'student-about',
  },
  StudentAboutView
)

testRoute(
  studentMailboxRoute,
  {
    path: 'mailbox',
    name: 'student-mailbox',
  },
  StudentMailboxView
)

testRoute(
  studentNotificationsRoute,
  {
    path: 'notifications',
    name: 'student-notifications',
  },
  StudentNotificationsView
)

testRoute(
  studentApcUnavailableRoute,
  {
    path: 'apc-unavailable',
    name: 'student-apc-unavailable',
  },
  StudentApcUnavailableView
)

describe('student root route', () => {
  const studentRootRoute = routes.find(route => route.path === '/student')

  it('should exist and have correct base config', () => {
    expect(studentRootRoute).toBeDefined()
    expect(studentRootRoute?.path).toBe('/student')
    expect(studentRootRoute?.component).toBeDefined()
    expect(studentRootRoute?.children).toEqual([
      studentHomeRoute,
      studentDeliverablesRoute,
      studentEducationSkillsRoute,
      studentEducationActivitiesRoute,
      studentEventsRoute,
      studentProjectSkillsRoute,
      studentProjectExperiencesRoute,
      studentProjectTrajectoriesRoute,
      studentSkillRoute,
      studentToolsTracksRoute,
      studentToolsPagesRoute,
      studentToolsResumesRoute,
      studentAboutRoute,
      studentMailboxRoute,
      studentNotificationsRoute,
      studentApcUnavailableRoute,
    ])
  })

  it('should dynamically import StudentLayout component', async () => {
    const componentLoader = studentRootRoute?.component as () => Promise<{ default: unknown }>
    const componentModule = await componentLoader()
    expect(componentModule).toBeDefined()
    expect(componentModule.default).toBe(StudentLayout)
  })
})
