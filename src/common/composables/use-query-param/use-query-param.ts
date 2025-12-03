import { type LocationQueryValue, useRoute, useRouter } from 'vue-router'

/**
 * A composable to watch for changes in a specific query parameter from the current URL.
 * It executes a handler function whenever the specified query parameter's value changes.
 *
 * @param {string} queryParamName - The name of the query parameter to watch.
 * @param {(value: LocationQueryValue | LocationQueryValue[]) => void} handler - The function to execute when the query parameter changes. It receives the new value as an argument.
 * @param {boolean} [immediate] - If true, the handler is executed immediately upon initialization with the current value of the query parameter.
 *
 * @example
 * // In a Vue component
 * import { useWatchQueryParam } from '@/common/composables'
 *
 * export default {
 *   setup() {
 *     useWatchQueryParam('search', (newValue) => {
 *       console.log('Search query changed to:', newValue)
 *     })
 *
 *     // With immediate set to false
 *     useWatchQueryParam('filter', (newValue) => {
 *       console.log('Filter changed to:', newValue)
 *     }, false)
 *   }
 * }
 */
export function useWatchQueryParam (queryParamName: string, handler: (value: LocationQueryValue | LocationQueryValue[]) => void, immediate = true) {
  const route = useRoute()

  watch(() => route.query[queryParamName], (newValue) => {
    handler(newValue === undefined ? null : newValue)
  }, { immediate })
}

/**
 * A composable to simplify updating URL query parameters.
 *
 * It provides a `setQueryParamValue` function that updates the URL with a new
 * value for a specified query parameter, preserving existing query parameters.
 *
 * @returns {{setQueryParamValue: (queryParamName: string, value: LocationQueryValue | LocationQueryValue[]) => void}} An object containing the `setQueryParamValue` function.
 *
 * @example
 * // In a Vue component
 * import { useSetQueryParam } from '@/common/composables'
 *
 * export default {
 *   setup() {
 *     const { setQueryParamValue } = useSetQueryParam()
 *
 *     // Set a single value
 *     setQueryParamValue('search', 'new-value')
 *
 *     // Set an array value
 *     setQueryParamValue('filters', ['a', 'b'])
 *   }
 * }
 */

interface UseQueryParamReturn {
  setQueryParamValue: (queryParamName: string, value: LocationQueryValue | LocationQueryValue[]) => void
}

export function useQueryParam (): UseQueryParamReturn {
  const router = useRouter()
  const route = useRoute()

  function setQueryParamValue (queryParamName: string, value: LocationQueryValue | LocationQueryValue[]) {
    router.replace({ query: { ...route.query, [queryParamName]: value } })
  }

  return {
    setQueryParamValue
  }
}
