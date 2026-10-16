import { testRoute } from 'tests/utils'
import { ROUTES } from '@/common/constants'
import { staffAdminGroupRoute, staffAdminGroupsRoute, staffAdminSkillsRoute, staffAdminUsersRoute } from '@/features/staff/admin/routes'
import AdminInstitutionGroupsView from '@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'
import AdminInstitutionSkillsView from '@/features/staff/admin/views/AdminInstitutionSkillsView/AdminInstitutionSkillsView.vue'
import AdminInstitutionUsersView from '@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'
import InstitutionGroupDetailedView from '@/features/staff/admin/views/InstitutionGroupDetailedView/InstitutionGroupDetailedView.vue'

testRoute(
  staffAdminGroupRoute,
  ROUTES.STAFF.ADMIN.GROUP,
  InstitutionGroupDetailedView
)

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
