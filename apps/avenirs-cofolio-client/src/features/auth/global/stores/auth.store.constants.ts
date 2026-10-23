/**
 * Storage entry holding the session only: identical in every tab of the browser
 * (localStorage).
 */
export const AUTH_SESSION_KEY = 'auth-session'

/**
 * Storage entry holding the user preferences (selected universe), never synced between the
 * open tabs:
 * - in the sessionStorage, those of the tab, restored on reload;
 * - in the localStorage, the last ones chosen in any tab, which a new tab starts with.
 */
export const AUTH_PREFS_KEY = 'auth-prefs'
