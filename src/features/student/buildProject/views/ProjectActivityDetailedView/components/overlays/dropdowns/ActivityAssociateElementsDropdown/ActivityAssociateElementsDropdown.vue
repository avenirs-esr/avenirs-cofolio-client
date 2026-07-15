<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import { AvDropdown } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityAssociateElementsDropdownProps {
  tracesDisabled?: boolean
}

const { tracesDisabled = false } = defineProps<ActivityAssociateElementsDropdownProps>()

const emit = defineEmits<{
  (e: 'tracesSelected'): void
  (e: 'skillsSelected'): void
}>()

enum ActivityAssociateElementsDropdownEvents {
  TRACES = 'traces',
  SKILLS = 'skills',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: ActivityAssociateElementsDropdownEvents.TRACES,
    icon: ICONS.TRACES,
    label: t('global.associations.elementsToAssociate.traces'),
    disabled: tracesDisabled
  },
  {
    name: ActivityAssociateElementsDropdownEvents.SKILLS,
    icon: ICONS.SKILLS,
    label: t('global.associations.elementsToAssociate.skills')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case ActivityAssociateElementsDropdownEvents.TRACES:
      emit('tracesSelected')
      break
    case ActivityAssociateElementsDropdownEvents.SKILLS:
      emit('skillsSelected')
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
