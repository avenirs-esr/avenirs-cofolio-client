import { ROUTES } from '@/common/constants'
import AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'
import CookiesView from '@/common/views/CookiesView/CookiesView.vue'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import PersonalDataView from '@/common/views/PersonalDataView/PersonalDataView.vue'
import routes from '@/features/auth/global/routes'
import LoginView from '@/features/auth/global/views/LoginView/LoginView.vue'
import { testRoute } from 'tests/utils'

const [root] = routes
const children = root.children!

testRoute(
  children.find(r => r.name === ROUTES.AUTH.ACCESSIBILITY.name)!,
  ROUTES.AUTH.ACCESSIBILITY,
  AccessibilityView
)

testRoute(
  children.find(r => r.name === ROUTES.AUTH.COOKIES.name)!,
  ROUTES.AUTH.COOKIES,
  CookiesView
)

testRoute(
  children.find(r => r.name === ROUTES.AUTH.LEGAL.name)!,
  ROUTES.AUTH.LEGAL,
  LegalView
)

testRoute(
  children.find(r => r.name === ROUTES.AUTH.LOGIN.name)!,
  ROUTES.AUTH.LOGIN,
  LoginView
)

testRoute(
  children.find(r => r.name === ROUTES.AUTH.PERSONAL_DATA.name)!,
  ROUTES.AUTH.PERSONAL_DATA,
  PersonalDataView
)
