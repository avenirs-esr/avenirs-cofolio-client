<script lang="ts" setup>
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'unsubscribeSelected'): void
}>()

enum ActivityDetailedDropdownEvents {
  UNSUBSCRIBE = 'unsubscribe',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: ActivityDetailedDropdownEvents.UNSUBSCRIBE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.buildProject.activities.buttons.unsubscribe')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case ActivityDetailedDropdownEvents.UNSUBSCRIBE:
      emit('unsubscribeSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    data-testid="activity-library-dropdown"
    :items="menuItems"
    :trigger-aria-label="t('global.buttons.moreActions')"
    :trigger-label="t('global.buttons.moreActions')"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
