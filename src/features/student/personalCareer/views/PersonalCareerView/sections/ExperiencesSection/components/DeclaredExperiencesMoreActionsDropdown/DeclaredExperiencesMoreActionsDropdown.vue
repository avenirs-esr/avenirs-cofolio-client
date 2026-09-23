<script setup lang="ts">
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'addSelected'): void
  (e: 'deleteSelected'): void
}>()
const { t } = useI18n()

const actions = computed<Action[]>(() => [Action.ADD, Action.DELETE])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.ADD:
      emit('addSelected')
      break
    case Action.DELETE:
      emit('deleteSelected')
      break
  }
}
</script>

<template>
  <div class="av-row av-justify-end">
    <ManageEntityDropdown
      :actions="actions"
      :entity-name="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesMoreActionsDropdown.entityName')"
      width="max-content"
      @action-selected="handleActionSelected"
    />
  </div>
</template>
