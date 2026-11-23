<script lang="ts" setup>
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { ActionItem } from '@avenirs-esr/shared'
import { Action, ManageEntityDropdown } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'

export interface ManageSubActivitiesDropdownProps extends AvInteractiveProps {
  hasSubActivities?: boolean
  hasEnrolledStudent?: boolean
}

type AllowedActions = Action.ADD | Action.DELETE

const {
  hasSubActivities = false,
  hasEnrolledStudent = false,
  ...interactiveProps
} = defineProps<ManageSubActivitiesDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

const { t } = useI18n()

const actions = computed<(Action | ActionItem)[]>(() => [
  Action.ADD,
  {
    type: Action.DELETE,
    disabled: hasEnrolledStudent || !hasSubActivities,
    disabledTooltip: hasEnrolledStudent
      ? t('staff.activities.views.EditNationalActivityView.ManageSubActivitiesDropdown.deleteEnrolledStudentTooltip')
      : t('staff.activities.views.EditNationalActivityView.ManageSubActivitiesDropdown.deleteEmptyTooltip'),
  },
])
</script>

<template>
  <ManageEntityDropdown
    v-bind="interactiveProps"
    :actions
    :entity-name="t('staff.activities.views.EditNationalActivityView.ManageSubActivitiesDropdown.entityName')"
    @action-selected="(action) => emit(action as AllowedActions)"
  />
</template>
