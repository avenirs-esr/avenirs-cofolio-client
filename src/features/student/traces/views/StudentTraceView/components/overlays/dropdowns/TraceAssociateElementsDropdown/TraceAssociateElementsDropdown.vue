<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import { AvDropdown } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TraceAssociateElementsDropdownProps {
  disabled?: boolean
}

const { disabled = false } = defineProps<TraceAssociateElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'activitiesSelected'): void
  (e: 'skillsSelected'): void
  (e: 'experiencesSelected'): void
}>()

enum TraceAssociateElementsDropdownEvents {
  ACTIVITIES = 'activities',
  EXPERIENCES = 'experiences',
  SKILLS = 'skills'
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: TraceAssociateElementsDropdownEvents.ACTIVITIES,
    icon: ICONS.ACTIVITY,
    label: t('global.associations.elementsToAssociate.activities'),
    disabled,
  },
  ...(
    __DEMO_MODE__
      ? []
      : [{
          name: TraceAssociateElementsDropdownEvents.EXPERIENCES,
          icon: ICONS.EXPERIENCES,
          label: t('global.associations.elementsToAssociate.experiences'),
          disabled,
        }]
  ),
  {
    name: TraceAssociateElementsDropdownEvents.SKILLS,
    icon: ICONS.SKILLS,
    label: t('global.associations.elementsToAssociate.skills'),
    disabled,
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
    case TraceAssociateElementsDropdownEvents.EXPERIENCES:
      emit('experiencesSelected')
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
