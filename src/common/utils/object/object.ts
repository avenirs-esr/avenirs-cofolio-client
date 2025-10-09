/**
 *
 * @param obj
 * @returns the same object without undefined, null or empty properties
 */
export function removeEmpty<T extends object> (obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_key, value]) => {
      if ((value === undefined || value === null)
        || (typeof value === 'string' && value.trim() === '')
        || (Array.isArray(value) && value.length === 0)) {
        return false
      }
      return true
    })
  ) as T
}
