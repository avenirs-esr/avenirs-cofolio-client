<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'

type AllowedActions = Action.ADD

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

const { t } = useI18n()

const actions = computed(() => [
  Action.ADD,
])
</script>

<template>
  <ManageEntityDropdown
    :actions
    :entity-name="t('staff.activities.views.EditNationalActivityView.ManageSubActivitiesDropdown.entityName')"
    width="max-content"
    @action-selected="(action) => emit(action as AllowedActions)"
  />
</template>
