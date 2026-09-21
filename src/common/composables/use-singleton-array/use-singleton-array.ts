import type { ComputedRef, Ref } from 'vue'

/**
 * A composable that creates a computed array from a single reactive value, ensuring the array always contains either one element or is empty.
 * @param modelRef The reactive reference to a single value of type T or null.
 * @returns A computed reference to an array containing the single value from modelRef, or an empty array if modelRef is null.
 */
export function useSingletonArray<T> (modelRef: Ref<T | null>): ComputedRef<Array<T>> {
  return computed({
    get: () => (modelRef.value != null ? [modelRef.value] : []),
    set: (val) => {
      modelRef.value = Array.isArray(val) && val.length > 0 ? val[0] : null
    }
  })
}
