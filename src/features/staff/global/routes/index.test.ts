import { ROUTES } from '@/common/constants'
import AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'
import CookiesView from '@/common/views/CookiesView/CookiesView.vue'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import PersonalDataView from '@/common/views/PersonalDataView/PersonalDataView.vue'
import ActivityFeedbacksView from '@/features/staff/feedbacks/views/ActivityFeedbacksView/ActivityFeedbacksView.vue'
import FeedbacksView from '@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import routes from '@/features/staff/global/routes'
import StaffHomeView from '@/features/staff/global/views/StaffHomeView/StaffHomeView.vue'
import { testRoute } from 'tests/utils'

const [root] = routes
const children = root.children!

testRoute(
  children.find(r => r.name === ROUTES.STAFF.HOME.name)!,
  ROUTES.STAFF.HOME,
  StaffHomeView
)

testRoute(
  children.find(r => r.name === ROUTES.STAFF.ACCESSIBILITY.name)!,
  ROUTES.STAFF.ACCESSIBILITY,
  AccessibilityView
)

testRoute(
  children.find(r => r.name === ROUTES.STAFF.COOKIES.name)!,
  ROUTES.STAFF.COOKIES,
  CookiesView
)

testRoute(
  children.find(r => r.name === ROUTES.STAFF.LEGAL.name)!,
  ROUTES.STAFF.LEGAL,
  LegalView
)

testRoute(
  children.find(r => r.name === ROUTES.STAFF.PERSONAL_DATA.name)!,
  ROUTES.STAFF.PERSONAL_DATA,
  PersonalDataView
)

testRoute(
  children.find(r => r.name === ROUTES.STAFF.ACTIVITY_FEEDBACKS.name)!,
  ROUTES.STAFF.ACTIVITY_FEEDBACKS,
  ActivityFeedbacksView
)

testRoute(
  children.find(r => r.name === ROUTES.STAFF.STUDENT_FEEDBACKS.name)!,
  ROUTES.STAFF.STUDENT_FEEDBACKS,
  FeedbacksView
)
