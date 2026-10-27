import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { ROUTE_ROLES } from '@/common/constants/route-roles'
import { withRequiredRoles } from '@/common/utils/route/route'

export const staffAdminGroupRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.GROUP.DEFAULT,
  props: route => ({
    groupId: route.params.id,
  }),
  component: () => import('@/features/staff/admin/views/InstitutionGroupDetailedView/InstitutionGroupDetailedView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.GROUPS],
  },
}

export const staffAdminGroupsRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.GROUPS,
  component: () => import('@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.GROUPS],
  },
}

export const staffAdminGroupUserRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.GROUP.USER,
  props: route => ({
    groupId: route.params.groupId,
    userId: route.params.userId,
  }),
  component: () => import('@/features/staff/admin/views/InstitutionUserDetailedView/InstitutionUserDetailedView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.GROUPS],
  },
}

export const staffAdminSkillsRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.SKILLS,
  component: () => import('@/features/staff/admin/views/AdminInstitutionSkillsView/AdminInstitutionSkillsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.SKILLS],
  },
}

export const staffAdminUserRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.USER,
  props: route => ({
    userId: route.params.id,
  }),
  component: () => import('@/features/staff/admin/views/InstitutionUserDetailedView/InstitutionUserDetailedView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.USERS],
  },
}

export const staffAdminUsersRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.USERS,
  component: () => import('@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.USERS],
  },
}

export const staffAdminGroupsRoutes: AvRoute[] = withRequiredRoles(
  ROUTE_ROLES.STAFF.ADMIN_GROUPS,
  staffAdminGroupRoute,
  staffAdminGroupsRoute,
  staffAdminGroupUserRoute,
)

export const staffAdminSkillsRoutes: AvRoute[] = withRequiredRoles(
  ROUTE_ROLES.STAFF.ADMIN_SKILLS,
  staffAdminSkillsRoute,
)

export const staffAdminUsersRoutes: AvRoute[] = withRequiredRoles(
  ROUTE_ROLES.STAFF.ADMIN_USERS,
  staffAdminUserRoute,
  staffAdminUsersRoute,
)

export const staffAdminRoutes: AvRoute[] = [
  ...staffAdminGroupsRoutes,
  ...staffAdminSkillsRoutes,
  ...staffAdminUsersRoutes
]
