import AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'
import CookiesView from '@/common/views/CookiesView/CookiesView.vue'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import PersonnalDataView from '@/common/views/PersonnalDataView/PersonnalDataView.vue'
import StudentLayout from '@/features/student/global/layouts/StudentLayout/StudentLayout.vue'
import StudentAboutView from '@/features/student/global/views/StudentAboutView/StudentAboutView.vue'
import StudentApcUnavailableView from '@/features/student/global/views/StudentApcUnavailableView/StudentApcUnavailableView.vue'
import StudentDeliverablesView from '@/features/student/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'
import StudentEventsView from '@/features/student/global/views/StudentEventsView/StudentEventsView.vue'
import StudentHomeView from '@/features/student/global/views/StudentHomeView/StudentHomeView.vue'
import StudentProjectExperiencesView from '@/features/student/global/views/StudentProjectExperiencesView/StudentProjectExperiencesView.vue'
import StudentProjectTrajectoriesView from '@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import StudentToolsPagesView from '@/features/student/global/views/StudentToolsPagesView/StudentToolsPagesView.vue'
import StudentToolsResumesView from '@/features/student/global/views/StudentToolsResumesView/StudentToolsResumesView.vue'
import index, {
  studentAboutRoute,
  studentAccessibilityRoute,
  studentAdditionalSkillRoute,
  studentAmsRoute,
  studentApcUnavailableRoute,
  studentCookiesRoute,
  studentDeliverablesRoute,
  studentEducationAmsRoute,
  studentEducationSkillsRoute,
  studentEventsRoute,
  studentHomeRoute,
  studentLegalRoute,
  studentMailboxRoute,
  studentNotificationsRoute,
  studentPersonnalDataRoute,
  studentProjectExperiencesRoute,
  studentProjectSkillsRoute,
  studentProjectTrajectoriesRoute,
  studentSkillRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentToolsTracesRoute,
  studentTraceRoute,
  studentUpdateAdditionalSkillRoute,
} from '@/features/student/routes'
import StudentEducationSkillsView from '@/features/student/skills/views/StudentEducationSkillsView/StudentEducationSkillsView.vue'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import StudentSkillView from '@/features/student/skills/views/StudentSkillView/StudentSkillView.vue'
import StudentMailboxView from '@/features/student/user/components/composites/StudentMailboxView/StudentMailboxView.vue'
import StudentNotificationsView from '@/features/student/user/components/composites/StudentNotificationsView/StudentNotificationsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { testRoute } from 'tests/utils'

testRoute(
  studentHomeRoute,
  {
    path: '',
    name: 'student-home',
  },
  StudentHomeView
)

testRoute(
  studentAccessibilityRoute,
  {
    path: 'accessibility',
    name: 'student-accessibility',
  },
  AccessibilityView
)

testRoute(
  studentCookiesRoute,
  {
    path: 'cookies',
    name: 'student-cookies',
  },
  CookiesView
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
  studentLegalRoute,
  {
    path: 'legal',
    name: 'student-legal',
  },
  LegalView
)

testRoute(
  studentPersonnalDataRoute,
  {
    path: 'personnal-data',
    name: 'student-personnal-data',
  },
  PersonnalDataView
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

BddTest().given('the student root route', () => {
  const studentRootRoute = index.find(route => route.path === '/student')
  BddTest().when('getting the route', () => {
    BddTest().then('it should exist and have correct base config', () => {
      expect(studentRootRoute).toBeDefined()
      expect(studentRootRoute?.path).toBe('/student')
      expect(studentRootRoute?.component).toBeDefined()
      expect(studentRootRoute?.children).toEqual([
        studentHomeRoute,
        studentAccessibilityRoute,
        studentAdditionalSkillRoute,
        studentAmsRoute,
        studentCookiesRoute,
        studentDeliverablesRoute,
        studentEducationSkillsRoute,
        studentEducationAmsRoute,
        studentEventsRoute,
        studentLegalRoute,
        studentPersonnalDataRoute,
        studentProjectSkillsRoute,
        studentProjectExperiencesRoute,
        studentProjectTrajectoriesRoute,
        studentSkillRoute,
        studentToolsTracesRoute,
        studentToolsPagesRoute,
        studentToolsResumesRoute,
        studentTraceRoute,
        studentUpdateAdditionalSkillRoute,
        studentAboutRoute,
        studentMailboxRoute,
        studentNotificationsRoute,
        studentApcUnavailableRoute,
      ])
    })

    BddTest().when('loading the route', () => {
      BddTest().then('it should dynamically import StudentLayout component', async () => {
        const componentLoader = studentRootRoute?.component as () => Promise<{ default: unknown }>
        const componentModule = await componentLoader()
        expect(componentModule).toBeDefined()
        expect(componentModule.default).toBe(StudentLayout)
      })
    })
  })
})
