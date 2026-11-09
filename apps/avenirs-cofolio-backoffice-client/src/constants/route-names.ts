/**
 * Route names and paths organized by application module.
 */
export const ROUTES = {
  /**
   * Route names and paths for the global alert module.
   */
  GLOBAL_ALERT: {
    DETAILS: { name: 'global-alert-details', path: '/global-alert/details' },
    UPDATE: { name: 'global-alert-update', path: '/global-alert/update' },
  },

  /**
   * Route names and paths for the home module.
   */
  HOME: { name: 'home', path: '/' },

  /**
   * Route names and paths for the national tools module.
   */
  NATIONAL_TOOLS: { name: 'national-tools', path: '/national-tools' },

  /**
   * Route names and paths for the terms of service module.
   */
  TERMS_OF_SERVICE: { name: 'terms-of-service', path: '/terms-of-service' },
} as const
