<script lang="ts" setup>
import { ICONS } from '@/features/student/global/icons'
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'skillsSelected'): void
  (e: 'tracesSelected'): void
}>()

enum DeleteAssociatedElementsDropdownEvents {
  SKILLS = 'skills',
  TRACES = 'traces',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: DeleteAssociatedElementsDropdownEvents.SKILLS,
    icon: ICONS.SKILLS,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.DeleteAssociatedElementsDropdown.skills')
  },
  {
    name: DeleteAssociatedElementsDropdownEvents.TRACES,
    icon: ICONS.TRACES,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.DeleteAssociatedElementsDropdown.traces')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeleteAssociatedElementsDropdownEvents.SKILLS:
      emit('skillsSelected')
      break
    case DeleteAssociatedElementsDropdownEvents.TRACES:
      emit('tracesSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="`${t('global.buttons.delete')}...`"
    :trigger-label="`${t('global.buttons.delete')}...`"
    :trigger-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
