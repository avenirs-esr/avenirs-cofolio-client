<script setup lang="ts">
import { AvDropdown, type AvDropdownItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'addSelected'): void
  (e: 'deleteSelected'): void
  (e: 'shareSelected'): void
}>()
const { t } = useI18n()

enum DeclaredExperiencesMoreActionsDropdownEvents {
  ADD = 'add',
  DELETE = 'delete',
  SHARE = 'share',
}

const menuItems = computed<AvDropdownItem[]>(() => [
  {
    name: DeclaredExperiencesMoreActionsDropdownEvents.ADD,
    icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
    label: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesMoreActionsDropdown.add')
  },
  {
    name: DeclaredExperiencesMoreActionsDropdownEvents.SHARE,
    icon: MDI_ICONS.SHARE_VARIANT_OUTLINE,
    label: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesMoreActionsDropdown.share')
  },
  {
    name: DeclaredExperiencesMoreActionsDropdownEvents.DELETE,
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesMoreActionsDropdown.delete')
  },
])

function handleItemSelected (itemName: string) {
  switch (itemName) {
    case DeclaredExperiencesMoreActionsDropdownEvents.ADD:
      emit('addSelected')
      break
    case DeclaredExperiencesMoreActionsDropdownEvents.DELETE:
      emit('deleteSelected')
      break
    case DeclaredExperiencesMoreActionsDropdownEvents.SHARE:
      emit('shareSelected')
      break
  }
}
</script>

<template>
  <div class="av-row av-justify-end">
    <AvDropdown
      :items="menuItems"
      :trigger-aria-label="t('global.buttons.moreActions')"
      :trigger-label="t('global.buttons.moreActions')"
      width="max-content"
      @item-selected="handleItemSelected"
    />
  </div>
</template>
