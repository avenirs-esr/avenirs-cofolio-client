import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'
import { getSelfKnowledgeCategories, type SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
import { commonQueryKeys } from '@/features/student/global'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const selfKnowledgeCommonQueryKey = [...commonQueryKeys, 'self-knowledge', 'categories']

const TWO_MINUTES = 2 * 60 * 1000

export function useSelfKnowledgeCategoriesQuery (): UseQueryReturnType<SelfKnowledgeCategoryDTO[], BaseApiException> & {
  categories: Ref<SelfKnowledgeCategoryDTO[]>
} {
  const queryKey = computed(() => [...selfKnowledgeCommonQueryKey])

  const queryFn = computed(() => async (): Promise<SelfKnowledgeCategoryDTO[]> => {
    return await getSelfKnowledgeCategories()
  })

  const query = useQuery<SelfKnowledgeCategoryDTO[], BaseApiException >({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES
  })

  const categories = computed(() => query.data.value ?? [])

  return {
    ...query,
    categories
  }
}
