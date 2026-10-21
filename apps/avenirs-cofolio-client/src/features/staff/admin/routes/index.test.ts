import { testRoute } from 'tests/utils'
import { ROUTES } from '@/common/constants'
import { staffAdminGroupRoute, staffAdminGroupsRoute, staffAdminGroupUserRoute, staffAdminSkillsRoute, staffAdminUserRoute, staffAdminUsersRoute } from '@/features/staff/admin/routes'
import AdminInstitutionGroupsView from '@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'
import AdminInstitutionSkillsView from '@/features/staff/admin/views/AdminInstitutionSkillsView/AdminInstitutionSkillsView.vue'
import AdminInstitutionUsersView from '@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'
import InstitutionGroupDetailedView from '@/features/staff/admin/views/InstitutionGroupDetailedView/InstitutionGroupDetailedView.vue'
import InstitutionUserDetailedView from '@/features/staff/admin/views/InstitutionUserDetailedView/InstitutionUserDetailedView.vue'

testRoute(
  staffAdminGroupRoute,
  ROUTES.STAFF.ADMIN.GROUP.DEFAULT,
  InstitutionGroupDetailedView
)

testRoute(
  staffAdminGroupsRoute,
  ROUTES.STAFF.ADMIN.GROUPS,
  AdminInstitutionGroupsView
)

testRoute(
  staffAdminGroupUserRoute,
  ROUTES.STAFF.ADMIN.GROUP.USER,
  InstitutionUserDetailedView
)

testRoute(
  staffAdminSkillsRoute,
  ROUTES.STAFF.ADMIN.SKILLS,
  AdminInstitutionSkillsView
)

testRoute(
  staffAdminUserRoute,
  ROUTES.STAFF.ADMIN.USER,
  InstitutionUserDetailedView
)

testRoute(
  staffAdminUsersRoute,
  ROUTES.STAFF.ADMIN.USERS,
  AdminInstitutionUsersView
)
