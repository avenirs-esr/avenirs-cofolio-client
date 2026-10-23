<script lang="ts" setup>
import type { ManageEntityDropdownProps } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.UPDATE | Action.DELETE | Action.ASSOCIATE | Action.DISSOCIATE

const { t } = useI18n()

const actions = computed<ManageEntityDropdownProps['actions']>(() => [
  Action.UPDATE,
  Action.DELETE,
  Action.ASSOCIATE,
  Action.DISSOCIATE
])
</script>

<template>
  <ManageEntityDropdown
    :actions="actions"
    :entity-name="t('student.declaredSkills.views.StudentDeclaredSkillView.settingDropdown.entityName')"
    @action-selected="(action) => emit(action as AllowedActions)"
  />
</template>
