import { ROUTES } from '@/common/constants'
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
