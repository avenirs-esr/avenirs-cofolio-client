import { testRoute } from 'tests/utils'
import { ROUTES } from '@/common/constants'
import { staffAdminGroupRoute, staffAdminGroupsRoute, staffAdminInstitutionsRoute, staffAdminPermissionsRoute, staffAdminProgramsRoute, staffAdminRolesRoute, staffAdminSkillsRoute, staffAdminToolsRoutes, staffAdminUsersRoute } from '@/features/staff/admin/routes'
import AdminInstitutionGroupsView from '@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'
import AdminInstitutionSkillsView from '@/features/staff/admin/views/AdminInstitutionSkillsView/AdminInstitutionSkillsView.vue'
import AdminInstitutionsView from '@/features/staff/admin/views/AdminInstitutionsView/AdminInstitutionsView.vue'
import AdminInstitutionUsersView from '@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'
import AdminPermissionsView from '@/features/staff/admin/views/AdminPermissionsView/AdminPermissionsView.vue'
import AdminProgramsView from '@/features/staff/admin/views/AdminProgramsView/AdminProgramsView.vue'
import AdminRolesView from '@/features/staff/admin/views/AdminRolesView/AdminRolesView.vue'
import AdminToolsView from '@/features/staff/admin/views/AdminToolsView/AdminToolsView.vue'
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
  staffAdminInstitutionsRoute,
  ROUTES.STAFF.ADMIN.INSTITUTIONS,
  AdminInstitutionsView
)

testRoute(
  staffAdminPermissionsRoute,
  ROUTES.STAFF.ADMIN.PERMISSIONS,
  AdminPermissionsView
)

testRoute(
  staffAdminProgramsRoute,
  ROUTES.STAFF.ADMIN.PROGRAMS,
  AdminProgramsView
)

testRoute(
  staffAdminRolesRoute,
  ROUTES.STAFF.ADMIN.ROLES,
  AdminRolesView
)

testRoute(
  staffAdminSkillsRoute,
  ROUTES.STAFF.ADMIN.SKILLS,
  AdminInstitutionSkillsView
)

testRoute(
  staffAdminToolsRoutes,
  ROUTES.STAFF.ADMIN.TOOLS,
  AdminToolsView
)

testRoute(
  staffAdminUsersRoute,
  ROUTES.STAFF.ADMIN.USERS,
  AdminInstitutionUsersView
)
