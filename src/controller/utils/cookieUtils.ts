/**
 * Cookie utility functions for reading, writing and deleting cookies
 */

/**
 * Get a cookie value by name
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string|null} The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
}

/**
 * Set a cookie with the given name and value
 * @param {string} name - The name of the cookie
 * @param {string} value - The value to store
 * @param {number} days - Number of days until the cookie expires
 */
export function setCookie(name: string, value: string, days: number = 30): void {
    let expires = ""
    if (days) {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

/**
 * Delete a cookie by name
 * @param {string} name - The name of the cookie to delete
 */
export function deleteCookie(name: string): void {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}