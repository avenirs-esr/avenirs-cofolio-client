<script lang="ts" setup>
import { ICONS } from '@/features/student/global/icons'
import { AvDropdown, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteTraceAssociatedElementsDropdownProps {
  skillsDisabled?: boolean
  activitiesDisabled?: boolean
}

const { skillsDisabled = false, activitiesDisabled = false } = defineProps<DeleteTraceAssociatedElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'skillsSelected'): void
  (e: 'activitiesSelected'): void
}>()

enum DeleteTraceAssociatedElementsDropdownEvents {
  SKILLS = 'skills',
  ACTIVITIES = 'activities',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: DeleteTraceAssociatedElementsDropdownEvents.SKILLS,
    icon: ICONS.SKILLS,
    label: t('student.traces.views.StudentTraceView.DeleteTraceAssociatedElementsDropdown.skills'),
    disabled: skillsDisabled,
  },
  {
    name: DeleteTraceAssociatedElementsDropdownEvents.ACTIVITIES,
    icon: ICONS.ACTIVITY,
    label: t('student.traces.views.StudentTraceView.DeleteTraceAssociatedElementsDropdown.activities'),
    disabled: activitiesDisabled,
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeleteTraceAssociatedElementsDropdownEvents.SKILLS:
      emit('skillsSelected')
      break
    case DeleteTraceAssociatedElementsDropdownEvents.ACTIVITIES:
      emit('activitiesSelected')
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
