import { ROUTES } from '@/common/constants'
import { staffAdminGroupsRoute, staffAdminSkillsRoute, staffAdminUsersRoute } from '@/features/staff/admin/routes'
import AdminInstitutionGroupsView from '@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'
import AdminInstitutionSkillsView from '@/features/staff/admin/views/AdminInstitutionSkillsView/AdminInstitutionSkillsView.vue'
import AdminInstitutionUsersView from '@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  staffAdminGroupsRoute,
  ROUTES.STAFF.ADMIN.GROUPS,
  AdminInstitutionGroupsView
)

testRoute(
  staffAdminSkillsRoute,
  ROUTES.STAFF.ADMIN.SKILLS,
  AdminInstitutionSkillsView
)

testRoute(
  staffAdminUsersRoute,
  ROUTES.STAFF.ADMIN.USERS,
  AdminInstitutionUsersView
)
