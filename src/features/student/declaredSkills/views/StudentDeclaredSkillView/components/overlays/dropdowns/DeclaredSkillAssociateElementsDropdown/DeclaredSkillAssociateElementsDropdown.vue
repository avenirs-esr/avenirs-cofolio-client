<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import { AvDropdown } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'activitiesSelected'): void
}>()

enum DeclaredSkillAssociateElementsDropdownEvents {
  ACTIVITIES = 'activities',
}

const { t } = useI18n()

const menuItems = computed(() => [
  {
    name: DeclaredSkillAssociateElementsDropdownEvents.ACTIVITIES,
    icon: ICONS.ACTIVITY,
    label: t('student.declaredSkills.views.StudentDeclaredSkillView.DeclaredSkillAssociateElementsDropdown.activities')
  }
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeclaredSkillAssociateElementsDropdownEvents.ACTIVITIES:
      emit('activitiesSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    data-testid="declared-skill-associate-elements-dropdown"
    :items="menuItems"
    :trigger-aria-label="`${t('global.buttons.associate')}...`"
    :trigger-label="`${t('global.buttons.associate')}...`"
    :trigger-icon="ICONS.ASSOCIATED"
    trigger-variant="FLAT"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>
