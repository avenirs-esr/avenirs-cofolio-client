import type { RouteLocationRaw } from 'vue-router'
import { EUniverse, EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'

/**
 * Stand-in while there is no session or data is invalid.
 */
export const INVALID_UNIVERSE = 'INVALID_UNIVERSE' as unknown as EUniverse

/**
 * Stand-in while there is no valid universe.
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
 * Priority used to pick the default universe (lowest value wins).
 */
export const UNIVERSE_PRIORITY: Record<EUserCategory, number> = {
  [EUniverse.STUDENT]: 1,
  [EUniverse.STAFF]: 0
}

/**
 * Maps each universe to its corresponding home route.
 */
export const UNIVERSE_HOME = {
  [EUniverse.STUDENT]: ROUTES.STUDENT.HOME,
  [EUniverse.STAFF]: ROUTES.STAFF.HOME
} satisfies Record<EUniverse, RouteLocationRaw>
