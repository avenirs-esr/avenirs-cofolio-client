<script lang="ts" setup>
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'deleteSelected'): void
}>()

const { t } = useI18n()

enum SelfKnowledgeElementDetailsDropdownEvents {
  UPDATE = 'update',
  DELETE = 'delete',
}

const menuItems = computed<AvDropdownItem[]>(() => [
  {
    name: SelfKnowledgeElementDetailsDropdownEvents.UPDATE,
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('global.buttons.update')
  },
  {
    name: SelfKnowledgeElementDetailsDropdownEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('global.buttons.delete')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case SelfKnowledgeElementDetailsDropdownEvents.UPDATE:
      emit('updateSelected')
      break
    case SelfKnowledgeElementDetailsDropdownEvents.DELETE:
      emit('deleteSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('student.selfKnowledge.views.SelfKnowledgeCategoryView.dropdown')"
    :trigger-label="t('student.selfKnowledge.views.SelfKnowledgeCategoryView.dropdown')"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>

<style lang="scss" scoped>
</style>
