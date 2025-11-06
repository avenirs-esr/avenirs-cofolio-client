<script lang="ts" setup>
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'deleteSelected'): void
}>()

enum AdditionalSkillSettingPopoverEvents {
  UPDATE = 'update',
  DELETE = 'delete'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: AdditionalSkillSettingPopoverEvents.UPDATE,
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('student.views.studentAdditionalSkillView.settings.update')
  },
  {
    name: AdditionalSkillSettingPopoverEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.views.studentAdditionalSkillView.settings.delete')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case AdditionalSkillSettingPopoverEvents.UPDATE:
      emit('updateSelected')
      break
    case AdditionalSkillSettingPopoverEvents.DELETE:
      emit('deleteSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('student.views.studentAdditionalSkillView.settings.ariaLabel')"
    :trigger-label="t('student.views.studentAdditionalSkillView.settings.ariaLabel')"
    @item-selected="handleItemSelected"
  />
</template>
