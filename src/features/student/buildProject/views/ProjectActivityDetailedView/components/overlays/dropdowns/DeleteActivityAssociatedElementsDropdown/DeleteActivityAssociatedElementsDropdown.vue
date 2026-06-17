<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteActivityAssociatedElementsDropdownProps {
  tracesDisabled: boolean
}

const { tracesDisabled } = defineProps<DeleteActivityAssociatedElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'skillsSelected'): void
  (e: 'tracesSelected'): void
}>()

enum DeleteActivityAssociatedElementsDropdownEvents {
  SKILLS = 'skills',
  TRACES = 'traces',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: DeleteActivityAssociatedElementsDropdownEvents.SKILLS,
    icon: ICONS.SKILLS,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.DeleteActivityAssociatedElementsDropdown.skills'),
  },
  {
    name: DeleteActivityAssociatedElementsDropdownEvents.TRACES,
    icon: ICONS.TRACES,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.DeleteActivityAssociatedElementsDropdown.traces'),
    disabled: tracesDisabled
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeleteActivityAssociatedElementsDropdownEvents.SKILLS:
      emit('skillsSelected')
      break
    case DeleteActivityAssociatedElementsDropdownEvents.TRACES:
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
