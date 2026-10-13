import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const staffAdminGroupsRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.GROUPS,
  component: () => import('@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'),
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

export const staffAdminUsersRoute: AvRoute = {
  ...ROUTES.STAFF.ADMIN.USERS,
  component: () => import('@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STAFF.ADMIN.USERS],
  },
}

export const staffAdminRoutes: AvRoute[] = [
  staffAdminGroupsRoute,
  staffAdminSkillsRoute,
  staffAdminUsersRoute,
]
