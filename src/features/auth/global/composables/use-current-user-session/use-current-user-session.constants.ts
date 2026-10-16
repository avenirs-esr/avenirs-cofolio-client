import type { RouteLocationRaw } from 'vue-router'
import { ERole, EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'

/**
 * Stand-in while there is no session or data is invalid.
 */
export const INVALID_USER_CATEGORY = 'INVALID_USER_CATEGORY' as unknown as EUserCategory

/**
 * Maps each role to its corresponding user category.
 */
export const ROLE_USER_CATEGORY: Record<ERole, EUserCategory> = {
  [ERole.ROLE_STUDENT]: EUserCategory.STUDENT,
  [ERole.ROLE_STAFF]: EUserCategory.STAFF,
  [ERole.ROLE_ADMIN]: EUserCategory.STAFF,
  [ERole.ROLE_SUPER_ADMIN]: EUserCategory.STAFF,
}

/**
 * Priority used to pick the default category (lowest value wins).
 */
export const USER_CATEGORY_PRIORITY: Record<EUserCategory, number> = {
  [EUserCategory.STUDENT]: 1,
  [EUserCategory.STAFF]: 0
}

/**
 * Maps each user category to its corresponding home route.
 */
export const USER_CATEGORY_HOME: Record<EUserCategory, RouteLocationRaw> = {
  [EUserCategory.STUDENT]: ROUTES.STUDENT.HOME,
  [EUserCategory.STAFF]: ROUTES.STAFF.HOME
}
