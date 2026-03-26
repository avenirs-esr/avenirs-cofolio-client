<script lang="ts" setup>
import { ICONS } from '@/features/student/global/icons'
import { AvDropdown } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'tracesSelected'): void
}>()

enum ActivityAssociateElementsDropdownEvents {
  TRACES = 'traces',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: ActivityAssociateElementsDropdownEvents.TRACES,
    icon: ICONS.TRACES,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityAssociateElementsDropdown.traces')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case ActivityAssociateElementsDropdownEvents.TRACES:
      emit('tracesSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    data-testid="activity-associate-elements-dropdown"
    :items="menuItems"
    :trigger-aria-label="`${t('global.buttons.associate')}...`"
    :trigger-label="`${t('global.buttons.associate')}...`"
    :trigger-icon="ICONS.ASSOCIATED"
    trigger-variant="FLAT"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
