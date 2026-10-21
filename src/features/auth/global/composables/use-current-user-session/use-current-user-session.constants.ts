import type { RouteLocationRaw } from 'vue-router'
import { EUniverse, EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'

/**
 * Stand-in while there is no session or data is invalid.
 */
export const INVALID_USER_CATEGORY = 'INVALID_USER_CATEGORY' as unknown as EUserCategory

/**
 * Maps each universe to its corresponding user category.
 */
export const UNIVERSE_USER_CATEGORY: Record<EUniverse, EUserCategory> = {
  [EUniverse.STUDENT]: EUserCategory.STUDENT,
  [EUniverse.STAFF]: EUserCategory.STAFF,
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
export const USER_CATEGORY_HOME = {
  [EUserCategory.STUDENT]: ROUTES.STUDENT.HOME,
  [EUserCategory.STAFF]: ROUTES.STAFF.HOME
} satisfies Record<EUserCategory, RouteLocationRaw>
