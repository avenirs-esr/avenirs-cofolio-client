<script lang="ts" setup>
import type { EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { EActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { isDeclaredActivityCompleted, isDeclaredActivitySubmittedForAssessment, isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'

export interface ActivityDetailedDropdownProps {
  status: EDeclaredActivityStatus
  activityStatus: EActivityStatus
}

const { status, activityStatus } = defineProps<ActivityDetailedDropdownProps>()

const emit = defineEmits<{
  (e: AllowedAction): void
}>()

type AllowedAction = Action.UPDATE | Action.ASSOCIATE | Action.DISSOCIATE | Action.UNSUBSCRIBE | Action.RESUBSCRIBE | Action.DELETE

const { t } = useI18n()

const isUnsubscribed = computed(() => isDeclaredActivityUnsubscribed(status))

const actionDisabledState = computed(() => {
  let disabledTooltip: string | undefined

  if (isDeclaredActivityUnsubscribed(status)) {
    disabledTooltip = t('student.activities.views.ActivityView.ActivityDetailedDropdown.associateAction.unsubscribedDisabledTooltip')
  }
  else if (isDeclaredActivitySubmittedForAssessment(status)) {
    disabledTooltip = t('student.activities.views.ActivityView.ActivityDetailedDropdown.associateAction.submittedDisabledTooltip')
  }
  else if (isDeclaredActivityCompleted(status)) {
    disabledTooltip = t('student.activities.views.ActivityView.ActivityDetailedDropdown.associateAction.completedDisabledTooltip')
  }
  return {
    disabled: !!disabledTooltip,
    disabledTooltip
  }
})

const associateAction = computed<ActionItem>(() => ({
  type: Action.ASSOCIATE,
  ...actionDisabledState.value
}))

const dissociateAction = computed<ActionItem>(() => ({
  type: Action.DISSOCIATE,
  ...actionDisabledState.value
}))

const deleteAction = computed<ActionItem>(() => ({
  type: Action.DELETE,
  disabled: !isUnsubscribed.value,
  disabledTooltip: t('student.activities.views.ActivityView.ActivityDetailedDropdown.deleteAction.disabledTooltip')
}))

const resubscribeAction = computed<ActionItem>(() => ({
  type: Action.RESUBSCRIBE,
  disabled: activityStatus === EActivityStatus.UNPUBLISHED,
  disabledTooltip: t('student.activities.views.ActivitiesCatalogView.unpublishedTooltip')
}))

const actions = computed(() => (
  [
    deleteAction.value,
    associateAction.value,
    dissociateAction.value,
    ...(isUnsubscribed.value ? [resubscribeAction.value] : [Action.UPDATE, Action.UNSUBSCRIBE])
  ]
))
</script>

<template>
  <ManageEntityDropdown
    :entity-name="t('global.ManageEntityDropdown.entityNames.activity')"
    :actions="actions"
    @action-selected="(action) => emit(action as AllowedAction)"
  />
</template>
