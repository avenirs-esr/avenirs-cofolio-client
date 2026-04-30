import type { Ref } from 'vue'
import { useRouteQuery } from '@vueuse/router'

interface UseQueryParamEnumOptions<E> {
  defaultKey?: Extract<keyof E, string>
  showDefault?: boolean
}

/**
 * A composable that creates a writable computed ref syncing an enum value with a query parameter.
 *
 * Behavior:
 * - Reads from the URL when a valid value is present
 * - Falls back to a local default when the URL value is missing or invalid
 * - Updates the URL when the value changes
 * - Removes the query parameter when the value equals the default (unless showDefault is true)
 * - Uses normalized keys in the URL (lowercase, "_" → "-")
 *
 * @param enumObject Enum to bind to the query parameter
 * @param queryParamName Name of the query parameter
 * @param options Optional configuration
 * @returns Writable ref linked to the query parameter
 *
 * @example
 * enum Status {
 *   ALL = 'all',
 *   IN_PROGRESS = 'in_progress',
 *   DONE = 'done'
 * }
 *
 * const status = useQueryParamEnum(Status, 'status')
 *
 * status.value = Status.IN_PROGRESS
 * // URL: ?status=in-progress
 *
 * @example
 * // Custom default key
 * const status = useQueryParamEnum(Status, 'status', { defaultKey: 'DONE' })
 * // No URL param -> status.value === Status.DONE
 *
 * @example
 * // Keep default value in URL
 * const status = useQueryParamEnum(Status, 'status', { showDefault: true })
 * // status.value = Status.ALL -> URL: ?status=all
 */
export function useQueryParamEnum<E extends Record<string, string | number>> (
  enumObject: E,
  queryParamName: string,
  options?: UseQueryParamEnumOptions<E>
): Ref<E[keyof E]> {
  const qpName = queryParamName.trim()

  const keyByQueryString = new Map<string, string>()
  const keyByValue = new Map<E[keyof E], string>()
  let firstKey: string | undefined

  for (const k of Object.keys(enumObject)) {
    if (Number.isNaN(Number(k))) {
      if (firstKey === undefined) {
        firstKey = k
      }

      const normalizedKey = k.toLowerCase().replace(/_/g, '-')
      keyByQueryString.set(normalizedKey, k)
      keyByValue.set(enumObject[k] as E[keyof E], normalizedKey)
    }
  }

  if (firstKey === undefined) {
    throw new Error('useQueryParamEnum: enum must not be empty')
  }

  const defaultKey = options?.defaultKey ?? firstKey
  const defaultValue = enumObject[defaultKey] as E[keyof E]

  return useRouteQuery<string | undefined, E[keyof E]>(qpName, undefined, {
    transform: {
      get: (value) => {
        if (typeof value === 'string') {
          const key = keyByQueryString.get(value.toLowerCase())
          if (key !== undefined) {
            return enumObject[key] as E[keyof E]
          }
        }

        return defaultValue
      },
      set: (value) => {
        const normalizedKey = keyByValue.get(value)
        if (normalizedKey === undefined) {
          throw new Error(`useQueryParamEnum: invalid value "${value}"`)
        }

        if (value === defaultValue && !options?.showDefault) {
          return undefined
        }

        return normalizedKey
      }
    }
  })
}
