<script setup lang="ts">
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'addSelected'): void
  (e: 'deleteSelected'): void
  (e: 'shareSelected'): void
}>()
const { t } = useI18n()

enum ProgramsMoreActionsDropdownEvents {
  ADD = 'add',
  DELETE = 'delete',
  SHARE = 'share',
}

const isDemoMode = __DEMO_MODE__

const menuItems = computed<AvDropdownItem[]>(() => {
  const allItems = [
    {
      name: ProgramsMoreActionsDropdownEvents.ADD,
      icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
      label: t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsMoreActionsDropdown.add'),
      demo: true
    },
    {
      name: ProgramsMoreActionsDropdownEvents.SHARE,
      icon: MDI_ICONS.SHARE_VARIANT_OUTLINE,
      label: t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsMoreActionsDropdown.share')
    },
    {
      name: ProgramsMoreActionsDropdownEvents.DELETE,
      icon: MDI_ICONS.TRASH_CAN_OUTLINE,
      label: t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsMoreActionsDropdown.delete'),
      demo: true
    },
  ]
  return isDemoMode ? allItems.filter(item => item.demo) : allItems
})

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case ProgramsMoreActionsDropdownEvents.ADD:
      emit('addSelected')
      break
    case ProgramsMoreActionsDropdownEvents.DELETE:
      emit('deleteSelected')
      break
    case ProgramsMoreActionsDropdownEvents.SHARE:
      emit('shareSelected')
      break
  }
}
</script>

<template>
  <AvDropdown
    :items="menuItems"
    :trigger-aria-label="t('global.buttons.moreActions')"
    :trigger-label="t('global.buttons.moreActions')"
    width="max-content"
    @item-selected="handleItemSelected"
  />
</template>

<style scoped lang="scss">

</style>
