import type { WritableComputedRef } from 'vue'
import { useQueryParam } from '@/common/composables/use-query-param/use-query-param'
import { useRoute } from 'vue-router'

export function useQueryParamIndex<T extends string> (
  values: readonly T[],
  key: string
): WritableComputedRef<number> {
  if (values.length === 0) {
    throw new Error('useQueryParamIndex: values must not be empty')
  }

  if (import.meta.env.DEV) {
    if (values.some(value => !value.trim())) {
      console.warn('useQueryParamIndex: values should not contain empty strings')
    }

    if ((new Set(values)).size !== values.length) {
      console.warn('useQueryParamIndex: values should be unique')
    }

    if (!key.trim()) {
      console.warn('useQueryParamIndex: key should not be empty')
    }
  }

  const route = useRoute()
  const { setQueryParamValue } = useQueryParam()

  return computed({
    get () {
      const index = values.indexOf(route.query[key] as T)
      return index !== -1 ? index : 0
    },

    set (index: number) {
      const value = values[index]

      if (!value) {
        if (import.meta.env.DEV) {
          console.warn(`useQueryParamIndex: invalid index "${index}"`)
        }
        return
      }

      setQueryParamValue(key, index === 0 ? undefined : value)
    }
  })
}
