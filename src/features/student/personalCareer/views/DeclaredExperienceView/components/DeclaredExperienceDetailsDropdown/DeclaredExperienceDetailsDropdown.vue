<script setup lang="ts">
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'deleteSelected'): void
  (e: 'shareSelected'): void
}>()

const { t } = useI18n()

enum DeclaredExperienceDetailsDropdownEvents {
  UPDATE = 'update',
  DELETE = 'delete',
  SHARE = 'share',
}

const menuItems = computed<AvDropdownItem[]>(() => [
  {
    name: DeclaredExperienceDetailsDropdownEvents.UPDATE,
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('global.buttons.update')
  },
  {
    name: DeclaredExperienceDetailsDropdownEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('global.buttons.delete')
  },
  {
    name: DeclaredExperienceDetailsDropdownEvents.SHARE,
    icon: MDI_ICONS.SHARE_VARIANT_OUTLINE,
    label: t('global.buttons.share')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeclaredExperienceDetailsDropdownEvents.UPDATE:
      emit('updateSelected')
      break
    case DeclaredExperienceDetailsDropdownEvents.DELETE:
      emit('deleteSelected')
      break
    case DeclaredExperienceDetailsDropdownEvents.SHARE:
      emit('shareSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetailsDropdown.dropdown')"
    :trigger-label="t('student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetailsDropdown.dropdown')"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
