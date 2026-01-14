<script lang="ts" setup>
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'deleteSelected'): void
}>()

enum DeclaredSkillSettingPopoverEvents {
  UPDATE = 'update',
  DELETE = 'delete'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: DeclaredSkillSettingPopoverEvents.UPDATE,
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('student.declaredSkills.views.StudentDeclaredSkillView.settingDropdown.update')
  },
  {
    name: DeclaredSkillSettingPopoverEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.declaredSkills.views.StudentDeclaredSkillView.settingDropdown.delete')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeclaredSkillSettingPopoverEvents.UPDATE:
      emit('updateSelected')
      break
    case DeclaredSkillSettingPopoverEvents.DELETE:
      emit('deleteSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('student.declaredSkills.views.StudentDeclaredSkillView.settingDropdown.ariaLabel')"
    :trigger-label="t('student.declaredSkills.views.StudentDeclaredSkillView.settingDropdown.ariaLabel')"
    @item-selected="handleItemSelected"
  />
</template>
