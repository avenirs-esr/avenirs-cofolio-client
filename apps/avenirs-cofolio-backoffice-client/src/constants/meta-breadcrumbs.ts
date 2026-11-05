import { ROUTES } from '@/constants/route-names'

/**
 * Breadcrumb metadata organized by application module.
 */
export const META_BREADCRUMBS = {
  /**
   * Breadcrumb metadata for the global alert module.
   */
  GLOBAL_ALERT: {
    DEFAULT: { textKey: 'global.MainNavigation.globalAlert' },
  },

  /**
   * Breadcrumb metadata for the home module.
   */
  HOME: { textKey: 'global.MainNavigation.home', to: ROUTES.HOME },

  /**
   * Breadcrumb metadata for the national tools module.
   */
  NATIONAL_TOOLS: { textKey: 'global.MainNavigation.nationalTools', to: ROUTES.NATIONAL_TOOLS },

  /**
   * Breadcrumb metadata for the terms of service module.
   */
  TERMS_OF_SERVICE: { textKey: 'global.MainNavigation.termsOfService', to: ROUTES.TERMS_OF_SERVICE },
} as const

/**
 * Breadcrumb paths organized by application module.
 */
export const BASE_BREADCRUMBS = {
  /**
   * Breadcrumb paths for the global alert module.
   */
  GLOBAL_ALERT: {
    BASE: [META_BREADCRUMBS.HOME, META_BREADCRUMBS.GLOBAL_ALERT.DEFAULT],
  },

  /**
   * Breadcrumb paths for the home module.
   */
  HOME: {
    BASE: [META_BREADCRUMBS.HOME],
  },

  /**
   * Breadcrumb paths for the national tools module.
   */
  NATIONAL_TOOLS: {
    BASE: [META_BREADCRUMBS.HOME, META_BREADCRUMBS.NATIONAL_TOOLS],
  },

  /**
   * Breadcrumb paths for the terms of service module.
   */
  TERMS_OF_SERVICE: {
    BASE: [META_BREADCRUMBS.HOME, META_BREADCRUMBS.TERMS_OF_SERVICE],
  },
}
