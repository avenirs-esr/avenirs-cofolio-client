import { ROUTES } from '@/common/constants'
import AccessibilityView
  from '@/common/views/AccessibilityView/AccessibilityView.vue'
import CookiesView
  from '@/common/views/CookiesView/CookiesView.vue'
import LegalView
  from '@/common/views/LegalView/LegalView.vue'
import PersonnalDataView
  from '@/common/views/PersonnalDataView/PersonnalDataView.vue'

import routes from '@/features/student/global/routes'
import StudentAboutView
  from '@/features/student/global/views/StudentAboutView/StudentAboutView.vue'
import StudentApcUnavailableView
  from '@/features/student/global/views/StudentApcUnavailableView/StudentApcUnavailableView.vue'
import StudentDeliverablesView
  from '@/features/student/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'
import StudentEventsView
  from '@/features/student/global/views/StudentEventsView/StudentEventsView.vue'
import StudentHomeView
  from '@/features/student/global/views/StudentHomeView/StudentHomeView.vue'
import StudentProjectTrajectoriesView
  from '@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import StudentToolsPagesView
  from '@/features/student/global/views/StudentToolsPagesView/StudentToolsPagesView.vue'
import StudentToolsResumesView
  from '@/features/student/global/views/StudentToolsResumesView/StudentToolsResumesView.vue'
import { declaredProgramRoute, personalCareerRoute } from '@/features/student/personalCareer'
import { declaredExperienceRoute, declaredExperienceUpdateRoute } from '@/features/student/personalCareer/routes'
import DeclaredExperienceUpdateView from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/DeclaredExperienceUpdateView.vue'
import DeclaredExperienceView from '@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'
import DeclaredProgramDetailedView from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'
import PersonalCareerView from '@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'
import StudentMailboxView
  from '@/features/student/user/views/StudentMailboxView/StudentMailboxView.vue'
import StudentNotificationsView
  from '@/features/student/user/views/StudentNotificationsView/StudentNotificationsView.vue'
import { testRoute } from 'tests/utils'

const [root] = routes
const children = root.children!

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.HOME.name)!,
  {
    path: ROUTES.STUDENT.HOME.path,
    name: ROUTES.STUDENT.HOME.name,
  },
  StudentHomeView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.ACCESSIBILITY.name)!,
  ROUTES.STUDENT.ACCESSIBILITY,
  AccessibilityView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.COOKIES.name)!,
  ROUTES.STUDENT.COOKIES,
  CookiesView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.DELIVERABLES.name)!,
  ROUTES.STUDENT.DELIVERABLES,
  StudentDeliverablesView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.EVENTS.name)!,
  ROUTES.STUDENT.EVENTS,
  StudentEventsView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.LEGAL.name)!,
  ROUTES.STUDENT.LEGAL,
  LegalView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.PERSONNAL_DATA.name)!,
  ROUTES.STUDENT.PERSONNAL_DATA,
  PersonnalDataView
)

testRoute(personalCareerRoute, ROUTES.STUDENT.PERSONAL_CAREER, PersonalCareerView)
testRoute(declaredProgramRoute, ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED, DeclaredProgramDetailedView)
testRoute(declaredExperienceRoute, ROUTES.STUDENT.DECLARED_EXPERIENCE, DeclaredExperienceView)
testRoute(declaredExperienceUpdateRoute, ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE, DeclaredExperienceUpdateView)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.PROJECT_TRAJECTORIES.name)!,
  ROUTES.STUDENT.PROJECT_TRAJECTORIES,
  StudentProjectTrajectoriesView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.TOOLS_PAGES.name)!,
  ROUTES.STUDENT.TOOLS_PAGES,
  StudentToolsPagesView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.TOOLS_RESUMES.name)!,
  ROUTES.STUDENT.TOOLS_RESUMES,
  StudentToolsResumesView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.ABOUT.name)!,
  ROUTES.STUDENT.ABOUT,
  StudentAboutView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.MAILBOX.name)!,
  ROUTES.STUDENT.MAILBOX,
  StudentMailboxView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.NOTIFICATIONS.name)!,
  ROUTES.STUDENT.NOTIFICATIONS,
  StudentNotificationsView
)

testRoute(
  children.find(r => r.name === ROUTES.STUDENT.APC_UNAVAILABLE.name)!,
  ROUTES.STUDENT.APC_UNAVAILABLE,
  StudentApcUnavailableView
)
