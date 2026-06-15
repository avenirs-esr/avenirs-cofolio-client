<script lang="ts" setup>
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'deleteSelected'): void
}>()

enum TracesActionsDropdownEvents {
  DELETE = 'delete'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: TracesActionsDropdownEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.traces.views.StudentToolsTracesView.traceActionsDropdown.delete')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case TracesActionsDropdownEvents.DELETE:
      emit('deleteSelected')
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
