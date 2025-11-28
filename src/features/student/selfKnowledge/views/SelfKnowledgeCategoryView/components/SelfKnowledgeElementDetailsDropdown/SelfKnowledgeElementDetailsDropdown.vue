<script lang="ts" setup>
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'deleteSelected'): void
  (e: 'shareSelected'): void
}>()

const { t } = useI18n()

enum SelfKnowledgeElementDetailsDropdownEvents {
  UPDATE = 'update',
  DELETE = 'delete',
  SHARE = 'share',
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
  },
  {
    name: SelfKnowledgeElementDetailsDropdownEvents.SHARE,
    icon: MDI_ICONS.SHARE_VARIANT_OUTLINE,
    label: t('global.buttons.share')
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
    case SelfKnowledgeElementDetailsDropdownEvents.SHARE:
      emit('shareSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('student.views.selfKnowledgeCategoryView.dropdown')"
    :trigger-label="t('student.views.selfKnowledgeCategoryView.dropdown')"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>

<style lang="scss" scoped>
</style>
