import { ROUTES } from '@/common/constants'
import AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'
import CookiesView from '@/common/views/CookiesView/CookiesView.vue'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import PersonalDataView from '@/common/views/PersonalDataView/PersonalDataView.vue'
import ActivityFeedbackDetailsView from '@/features/feedbacks/views/ActivityFeedbackDetailsView/ActivityFeedbackDetailsView.vue'
import FeedbacksView from '@/features/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import routes from '@/features/global/routes'
import StaffHomeView from '@/features/global/views/StaffHomeView/StaffHomeView.vue'
import StudentAboutView from '@/features/global/views/StudentAboutView/StudentAboutView.vue'
import StudentDeliverablesView from '@/features/global/views/StudentDeliverablesView/StudentDeliverablesView.vue'
import StudentEventsView from '@/features/global/views/StudentEventsView/StudentEventsView.vue'
import StudentHomeView from '@/features/global/views/StudentHomeView/StudentHomeView.vue'
import StudentProjectTrajectoriesView from '@/features/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import StudentToolsKitView from '@/features/kit/views/StudentToolsKitView/StudentToolsKitView.vue'
import DeclaredExperienceUpdateView from '@/features/personalCareer/views/DeclaredExperienceUpdateView/DeclaredExperienceUpdateView.vue'
import DeclaredExperienceView from '@/features/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'
import DeclaredProgramDetailedView from '@/features/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'
import PersonalCareerView from '@/features/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'
import StudentMailboxView from '@/features/user/views/StudentMailboxView/StudentMailboxView.vue'
import { testRoute } from 'tests/utils'

const [root1, root2] = routes
const children1 = root1.children!
const children2 = root2.children!

testRoute(
  children1.find(r => r.name === ROUTES.STAFF.HOME.name)!,
  ROUTES.STAFF.HOME,
  StaffHomeView
)

testRoute(
  children1.find(r => r.name === ROUTES.STAFF.ACCESSIBILITY.name)!,
  ROUTES.STAFF.ACCESSIBILITY,
  AccessibilityView
)

testRoute(
  children1.find(r => r.name === ROUTES.STAFF.COOKIES.name)!,
  ROUTES.STAFF.COOKIES,
  CookiesView
)

testRoute(
  children1.find(r => r.name === ROUTES.STAFF.LEGAL.name)!,
  ROUTES.STAFF.LEGAL,
  LegalView
)

testRoute(
  children1.find(r => r.name === ROUTES.STAFF.PERSONAL_DATA.name)!,
  ROUTES.STAFF.PERSONAL_DATA,
  PersonalDataView
)

testRoute(
  children1.find(r => r.name === ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name)!,
  ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK,
  ActivityFeedbackDetailsView
)

testRoute(
  children1.find(r => r.name === ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS.name)!,
  ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS,
  FeedbacksView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.HOME.name)!,
  {
    path: ROUTES.STUDENT.HOME.path,
    name: ROUTES.STUDENT.HOME.name,
  },
  StudentHomeView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.ACCESSIBILITY.name)!,
  ROUTES.STUDENT.ACCESSIBILITY,
  AccessibilityView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.COOKIES.name)!,
  ROUTES.STUDENT.COOKIES,
  CookiesView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.DELIVERABLES.name)!,
  ROUTES.STUDENT.DELIVERABLES,
  StudentDeliverablesView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.EVENTS.name)!,
  ROUTES.STUDENT.EVENTS,
  StudentEventsView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.LEGAL.name)!,
  ROUTES.STUDENT.LEGAL,
  LegalView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.PERSONAL_DATA.name)!,
  ROUTES.STUDENT.PERSONAL_DATA,
  PersonalDataView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.PERSONAL_CAREER.name)!,
  ROUTES.STUDENT.PERSONAL_CAREER,
  PersonalCareerView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name)!,
  ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED,
  DeclaredProgramDetailedView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.DECLARED_EXPERIENCE.name)!,
  ROUTES.STUDENT.DECLARED_EXPERIENCE,
  DeclaredExperienceView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE.name)!,
  ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE,
  DeclaredExperienceUpdateView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.PROJECT_TRAJECTORIES.name)!,
  ROUTES.STUDENT.PROJECT_TRAJECTORIES,
  StudentProjectTrajectoriesView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.TOOLS_KIT.name)!,
  ROUTES.STUDENT.TOOLS_KIT,
  StudentToolsKitView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.ABOUT.name)!,
  ROUTES.STUDENT.ABOUT,
  StudentAboutView
)

testRoute(
  children2.find(r => r.name === ROUTES.STUDENT.MAILBOX.name)!,
  ROUTES.STUDENT.MAILBOX,
  StudentMailboxView
)
