import { generateImageRunData } from '@/features/student/kit/composables/use-export-kit/utils'
import { useQuery } from '@tanstack/vue-query'
import { type MaybeRefOrGetter, toValue } from 'vue'

interface UseImageRunDataQueryParams {
  url: MaybeRefOrGetter<string | undefined>
  width: MaybeRefOrGetter<number>
  height: MaybeRefOrGetter<number>
}

export function useImageRunDataQuery ({ url, width, height }: UseImageRunDataQueryParams) {
  return useQuery({
    queryKey: ['image-data', toValue(url), toValue(width), toValue(height)],
    queryFn: () => generateImageRunData({
      url: toValue(url)!,
      requiredWidth: toValue(width),
      requiredHeight: toValue(height)
    }),
    enabled: computed(() => !!toValue(url)),
  })
}
