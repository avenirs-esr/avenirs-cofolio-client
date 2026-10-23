<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.UPDATE | Action.DELETE | Action.ASSOCIATE | Action.DISSOCIATE

const { t } = useI18n()

const actions = computed<Action[]>(() => [Action.UPDATE, Action.DELETE, Action.ASSOCIATE, Action.DISSOCIATE])
</script>

<template>
  <div class="av-row av-justify-end">
    <ManageEntityDropdown
      :actions="actions"
      :entity-name="t('student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetailsDropdown.entityName')"
      width="max-content"
      @action-selected="(action) => emit(action as AllowedActions)"
    />
  </div>
</template>
