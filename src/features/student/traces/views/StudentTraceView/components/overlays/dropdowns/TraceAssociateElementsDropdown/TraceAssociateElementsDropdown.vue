<script lang="ts" setup>
import { ICONS } from '@/features/student/global/icons'
import { AvDropdown } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'activitiesSelected'): void
  (e: 'skillsSelected'): void
}>()

enum TraceAssociateElementsDropdownEvents {
  ACTIVITIES = 'activities',
  SKILLS = 'skills'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: TraceAssociateElementsDropdownEvents.ACTIVITIES,
    icon: ICONS.ACTIVITY,
    label: t('student.traces.views.StudentTraceView.TraceAssociateElementsDropdown.activities')
  },
  {
    name: TraceAssociateElementsDropdownEvents.SKILLS,
    icon: ICONS.SKILLS,
    label: t('student.traces.views.StudentTraceView.TraceAssociateElementsDropdown.skills')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case TraceAssociateElementsDropdownEvents.ACTIVITIES:
      emit('activitiesSelected')
      break
    case TraceAssociateElementsDropdownEvents.SKILLS:
      emit('skillsSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="`${t('global.buttons.associate')}...`"
    :trigger-label="`${t('global.buttons.associate')}...`"
    :trigger-icon="ICONS.ASSOCIATED"
    trigger-variant="FLAT"
    width="max-content"
    data-testid="trace-associate-elements-dropdown"
    @item-selected="handleItemSelected"
  />
</template>
