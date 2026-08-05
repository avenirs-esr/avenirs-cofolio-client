<script lang="ts" setup>
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeElementsDropdownProps {
  categoryType: ESelfKnowledgeCategory
}

const { categoryType } = defineProps<SelfKnowledgeElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'addSelected'): void
  (e: 'deleteSelected'): void
  (e: 'shareSelected'): void
  (e: 'deleteCategorySelected'): void
}>()

const { t } = useI18n()

const isDemo = __DEMO_MODE__

const isCategoryDeletable = computed(() => ![
  ESelfKnowledgeCategory.VALUES,
  ESelfKnowledgeCategory.STRENGTHS,
  ESelfKnowledgeCategory.ASPIRATIONS
].includes(categoryType))

enum SelfKnowledgeElementsDropdownEvents {
  ADD = 'add',
  DELETE = 'delete',
  SHARE = 'share',
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

  if (!isDemo) {
    items.push({
      name: SelfKnowledgeElementsDropdownEvents.SHARE,
      icon: MDI_ICONS.SHARE_VARIANT_OUTLINE,
      label: t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.buttons.share')
    })
  }

  if (isCategoryDeletable.value) {
    items.push({
      name: SelfKnowledgeElementsDropdownEvents.DELETE_CATEGORY,
      icon: MDI_ICONS.TRASH_CAN_OUTLINE,
      label: t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.buttons.deleteCategory')
    })
  }

  return items
})

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case SelfKnowledgeElementsDropdownEvents.ADD:
      emit('addSelected')
      break
    case SelfKnowledgeElementsDropdownEvents.DELETE:
      emit('deleteSelected')
      break
    case SelfKnowledgeElementsDropdownEvents.SHARE:
      emit('shareSelected')
      break
    case SelfKnowledgeElementsDropdownEvents.DELETE_CATEGORY:
      emit('deleteCategorySelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('global.buttons.moreActions')"
    :trigger-label="t('global.buttons.moreActions')"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
