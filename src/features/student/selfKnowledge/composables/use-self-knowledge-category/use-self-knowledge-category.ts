import type { MaybeRef } from 'vue'
import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSelfKnowledgeCategoryIcon } from '@/features/student/selfKnowledge/utils/category.utils'

export function useSelfKnowledgeCategory (categoryType: MaybeRef<ESelfKnowledgeCategory>) {
  const { t } = useI18n()

  const type = computed(() => toValue(categoryType))

  const categoryTypeLabel = computed(() =>
    t(`student.selfKnowledge.categoryType.${type.value}`, { count: 2 })
  )

  const categoryTitle = computed(() =>
    t(`student.selfKnowledge.categories.${type.value}.title`)
  )

  const categoryDescription = computed(() =>
    t(`student.selfKnowledge.categories.${type.value}.description`)
  )

  const categoryIcon = computed(() =>
    getSelfKnowledgeCategoryIcon(type.value)
  )

  return {
    categoryType: type,
    categoryTypeLabel,
    categoryTitle,
    categoryDescription,
    categoryIcon
  }
}
