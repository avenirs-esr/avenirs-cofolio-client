<script lang="ts" setup>
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'deleteSelected'): void
}>()

enum ManageDeclaredProgramDropdownEvents {
  UPDATE = 'update',
  DELETE = 'delete'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: ManageDeclaredProgramDropdownEvents.UPDATE,
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('global.buttons.update')
  },
  {
    name: ManageDeclaredProgramDropdownEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('global.buttons.delete')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case ManageDeclaredProgramDropdownEvents.UPDATE:
      emit('updateSelected')
      break
    case ManageDeclaredProgramDropdownEvents.DELETE:
      emit('deleteSelected')
      break
  }
}
</script>

<template>
  <div class="av-row av-justify-end">
    <AvDropdown
      :items="menuItems"
      :trigger-aria-label="t('student.personalCareer.views.DeclaredProgramDetailedView.ManageDeclaredProgramDropdown.trigger')"
      :trigger-label="t('student.personalCareer.views.DeclaredProgramDetailedView.ManageDeclaredProgramDropdown.trigger')"
      width="max-content"
      @item-selected="handleItemSelected"
    />
  </div>
</template>
