<script lang="ts" setup>
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'associateSelected'): void
  (e: 'deleteSelected'): void
  (e: 'updateSelected'): void
}>()

enum TraceSettingsPopoverEvents {
  ASSOCIATE = 'associate',
  DELETE = 'delete',
  UPDATE = 'update'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: TraceSettingsPopoverEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.traces.views.StudentTraceView.settings.delete')
  },
  {
    name: TraceSettingsPopoverEvents.ASSOCIATE,
    icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
    label: t('student.traces.views.StudentTraceView.settings.associate')
  },
  {
    name: TraceSettingsPopoverEvents.UPDATE,
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('student.traces.views.StudentTraceView.settings.update')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case TraceSettingsPopoverEvents.DELETE:
      emit('deleteSelected')
      break
    case TraceSettingsPopoverEvents.ASSOCIATE:
      emit('associateSelected')
      break
    case TraceSettingsPopoverEvents.UPDATE:
      emit('updateSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('global.buttons.moreActions')"
    :trigger-label="t('global.buttons.moreActions')"
    @item-selected="handleItemSelected"
  />
</template>
