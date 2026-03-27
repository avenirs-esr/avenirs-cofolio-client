<script lang="ts" setup>
import { ICONS } from '@/features/student/global/icons'
import { AvDropdown } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'skillsSelected'): void
}>()

enum TraceAssociateElementsDropdownEvents {
  SKILLS = 'skills'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: TraceAssociateElementsDropdownEvents.SKILLS,
    icon: ICONS.SKILLS,
    label: t('student.traces.views.StudentTraceView.TraceAssociateElementsDropdown.skills')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
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
    @item-selected="handleItemSelected"
  />
</template>
