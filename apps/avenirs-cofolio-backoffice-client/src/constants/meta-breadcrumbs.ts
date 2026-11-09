import { ROUTES } from '@/constants/route-names'

/**
 * Breadcrumb metadata organized by application module.
 */
export const META_BREADCRUMBS = {
  /**
   * Breadcrumb metadata for the global alert module.
   */
  GLOBAL_ALERT: {
    DETAILS: { textKey: 'global.MainNavigation.globalAlert', to: ROUTES.GLOBAL_ALERT.DETAILS },
    UPDATE: { textKey: 'global.components.navigation.UpdatePageTitle.update', to: ROUTES.GLOBAL_ALERT.UPDATE }
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
    DETAILS: [META_BREADCRUMBS.HOME, META_BREADCRUMBS.GLOBAL_ALERT.DETAILS],
    UPDATE: [
      META_BREADCRUMBS.HOME,
      META_BREADCRUMBS.GLOBAL_ALERT.DETAILS,
      META_BREADCRUMBS.GLOBAL_ALERT.UPDATE
    ],
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
