import { ESelfKnowledgeCategoryType, useGetSelfKnowledgeCategories } from '@/api/avenir-esr'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'
import { type MaybeRef, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export function useSelfKnowledgeCategory (categoryId: MaybeRef<string>) {
  const { data: fetchedCategories } = useGetSelfKnowledgeCategories()
  const { t } = useI18n()

  const categories = computed(() => fetchedCategories.value ?? [])

  const category = computed(() =>
    categories.value.find(cat => cat.id === toValue(categoryId))
  )

  const categoryType = computed(
    () => category.value?.type ?? ESelfKnowledgeCategoryType.STRENGTHS
  )

  const categoryTypeLabel = computed(() =>
    t(`student.selfKnowledge.categoryType.${categoryType.value}`, { count: 2 })
  )

  const categoryIcon = computed(() =>
    getSelfKnowledgeCategoryIcon(categoryType.value)
  )

  return {
    category,
    categoryType,
    categoryTypeLabel,
    categoryIcon
  }
}
