<script lang="ts" setup>
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'

export interface ManageSubActivitiesDropdownProps extends AvInteractiveProps {}

type AllowedActions = Action.ADD

defineProps<ManageSubActivitiesDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

const { t } = useI18n()

const actions = [Action.ADD]
</script>

<template>
  <ManageEntityDropdown
    v-bind="$props"
    :actions
    :entity-name="t('staff.activities.views.EditNationalActivityView.ManageSubActivitiesDropdown.entityName')"
    @action-selected="(action) => emit(action as AllowedActions)"
  />
</template>
