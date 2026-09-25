<script lang="ts" setup>
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementsDropdownProps {
  categoryType: ESelfKnowledgeCategory
}

const { categoryType } = defineProps<SelfKnowledgeElementsDropdownProps>()

const emit = defineEmits<{
  (e: SelfKnowledgeElementsDropdownEvents): void
}>()

const { t } = useI18n()

const isCategoryDeletable = computed(() => ![
  ESelfKnowledgeCategory.VALUES,
  ESelfKnowledgeCategory.STRENGTHS,
  ESelfKnowledgeCategory.ASPIRATIONS
].includes(categoryType))

enum SelfKnowledgeElementsDropdownEvents {
  ADD = 'add',
  DELETE = 'delete',
  DELETE_CATEGORY = 'deleteCategory'
}

const menuItems = computed<AvDropdownItem[]>(() => {
  const items = [
    {
      name: SelfKnowledgeElementsDropdownEvents.ADD,
      icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
      label: t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.buttons.add')
    },
    {
      name: SelfKnowledgeElementsDropdownEvents.DELETE,
      icon: MDI_ICONS.TRASH_CAN_OUTLINE,
      label: t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.buttons.delete')
    },
  ]

  if (isCategoryDeletable.value) {
    items.push({
      name: SelfKnowledgeElementsDropdownEvents.DELETE_CATEGORY,
      icon: MDI_ICONS.TRASH_CAN_OUTLINE,
      label: t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.buttons.deleteCategory')
    })
  }

  return items
})
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.buttons.trigger')"
    :trigger-label="t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.buttons.trigger')"
    width="max-content"
    @item-selected="(item) => emit(item as SelfKnowledgeElementsDropdownEvents)"
  />
</template>
