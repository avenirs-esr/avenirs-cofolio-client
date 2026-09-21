<script lang="ts" setup>
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown, { type ManageEntityDropdownProps } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'updateSelected'): void
  (e: 'deleteSelected'): void
}>()

const { t } = useI18n()

const actions = computed<ManageEntityDropdownProps['actions']>(() => [
  Action.UPDATE,
  Action.DELETE
])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.UPDATE:
      emit('updateSelected')
      break
    case Action.DELETE:
      emit('deleteSelected')
      break
  }
}
</script>

<template>
  <ManageEntityDropdown
    :actions="actions"
    :entity-name="t('student.declaredSkills.views.StudentDeclaredSkillView.settingDropdown.entityName')"
    @action-selected="handleActionSelected"
  />
</template>
