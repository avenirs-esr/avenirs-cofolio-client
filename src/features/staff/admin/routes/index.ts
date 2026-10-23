import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

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

export const staffAdminGroupsRoutes: AvRoute[] = [
  staffAdminGroupRoute,
  staffAdminGroupsRoute,
  staffAdminGroupUserRoute,
]

export const staffAdminRoutes: AvRoute[] = [
  ...staffAdminGroupsRoutes,
  staffAdminSkillsRoute,
  staffAdminUserRoute,
  staffAdminUsersRoute,
]
