<script lang="ts" setup>
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'unsubscribeSelected'): void
}>()

enum ActivityDetailedDropdownEvents {
  UPDATE = 'update',
  UNSUBSCRIBE = 'unsubscribe',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: ActivityDetailedDropdownEvents.UPDATE,
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('global.buttons.update')
  },
  {
    name: ActivityDetailedDropdownEvents.UNSUBSCRIBE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.buildProject.activities.buttons.unsubscribe')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case ActivityDetailedDropdownEvents.UPDATE:
      emit('updateSelected')
      break
    case ActivityDetailedDropdownEvents.UNSUBSCRIBE:
      emit('unsubscribeSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityDetailedDropdown.triggerLabel')"
    :trigger-label="t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityDetailedDropdown.triggerLabel')"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
