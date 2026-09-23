<script setup lang="ts">
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.ADD | Action.DELETE

const { t } = useI18n()

const actions = computed<Action[]>(() => [Action.ADD, Action.DELETE])
</script>

<template>
  <ManageEntityDropdown
    :actions="actions"
    :entity-name="t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsMoreActionsDropdown.entityName')"
    width="max-content"
    @action-selected="(action) => emit(action as AllowedActions)"
  />
</template>

<style scoped lang="scss">

</style>
