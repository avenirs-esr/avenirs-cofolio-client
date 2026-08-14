import type { ComputedRef, Ref } from 'vue'

export function useSingletonArray<T> (modelRef: Ref<T | null>): ComputedRef<Array<T>> {
  return computed({
    get: () => (modelRef.value != null ? [modelRef.value] : []),
    set: (val) => {
      modelRef.value = val.length > 0 ? val[0] : null
    }
  })
}
