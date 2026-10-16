<script lang="ts" setup>
import type { EDeclaredActivityStatus } from '@/api/avenir-esr'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useI18n } from 'vue-i18n'
import { EActivityStatus } from '@/api/avenir-esr'
import { isDeclaredActivitySubmitted, isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
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

const associateAction = computed<ActionItem>(() => {
  let disabled = false
  let disabledTooltip

  if (isDeclaredActivityUnsubscribed(status)) {
    disabled = true
    disabledTooltip = t('student.activities.views.ActivityView.ActivityDetailedDropdown.associateAction.unsubscribedDisabledTooltip')
  }
  else if (isDeclaredActivitySubmitted(status)) {
    disabled = true
    disabledTooltip = t('student.activities.views.ActivityView.ActivityDetailedDropdown.associateAction.submittedDisabledTooltip')
  }

  return {
    type: Action.ASSOCIATE,
    disabled,
    disabledTooltip
  }
})

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
    Action.DISSOCIATE,
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
