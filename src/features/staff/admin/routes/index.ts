import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const staffAdminGroupRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.GROUP,
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

export const staffAdminInstitutionsRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.INSTITUTIONS,
  component: () => import('@/features/staff/admin/views/AdminInstitutionsView/AdminInstitutionsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.INSTITUTIONS],
  },
}

export const staffAdminPermissionsRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.PERMISSIONS,
  component: () => import('@/features/staff/admin/views/AdminPermissionsView/AdminPermissionsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.PERMISSIONS],
  },
}

export const staffAdminProgramsRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.PROGRAMS,
  component: () => import('@/features/staff/admin/views/AdminProgramsView/AdminProgramsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.PROGRAMS],
  },
}

export const staffAdminRolesRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.ROLES,
  component: () => import('@/features/staff/admin/views/AdminRolesView/AdminRolesView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.ROLES],
  },
}

export const staffAdminSkillsRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.SKILLS,
  component: () => import('@/features/staff/admin/views/AdminInstitutionSkillsView/AdminInstitutionSkillsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.SKILLS],
  },
}

export const staffAdminToolsRoutes: AvRoute = {
  ...ROUTES.STAFF.ADMIN.TOOLS,
  component: () => import('@/features/staff/admin/views/AdminToolsView/AdminToolsView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.TOOLS],
  },
}

export const staffAdminUsersRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.USERS,
  component: () => import('@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.USERS],
  },
}

export const staffAdminRoutes: AvRoute[] = [
  staffAdminGroupRoute,
  staffAdminGroupsRoute,
  staffAdminInstitutionsRoute,
  staffAdminPermissionsRoute,
  staffAdminProgramsRoute,
  staffAdminRolesRoute,
  staffAdminSkillsRoute,
  staffAdminToolsRoutes,
  staffAdminUsersRoute,
]
