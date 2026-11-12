<script lang="ts" setup>
import type { EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { EActivityStatus, EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { isDeclaredActivityCompleted, isDeclaredActivitySubmittedForAssessment, isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
import ManageAssociableEntityDropdown from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'

export interface ActivityDetailedDropdownProps {
  status: EDeclaredActivityStatus
  activityStatus: EActivityStatus
  elementId: string
  hasAssociations: boolean
}

const { status, activityStatus, elementId, hasAssociations } = defineProps<ActivityDetailedDropdownProps>()

const emit = defineEmits<{
  (e: AllowedAction): void
}>()

type AllowedAction = Action.UPDATE | Action.UNSUBSCRIBE | Action.RESUBSCRIBE | Action.DELETE

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

const updateAction = computed<ActionItem>(() => ({
  type: Action.UPDATE
}))

const unsubscribeAction = computed<ActionItem>(() => ({
  type: Action.UNSUBSCRIBE
}))

const ownActions = computed(() => [deleteAction.value, ...(isUnsubscribed.value
  ? [resubscribeAction.value]
  : [updateAction.value, unsubscribeAction.value])])

function onAction (action: Action, handleAction: (a: Action) => void) {
  switch (action) {
    case Action.ASSOCIATE:
    case Action.DISSOCIATE:
      handleAction(action)
      break
    case Action.UPDATE:
      emit(Action.UPDATE)
      break
    case Action.RESUBSCRIBE:
      emit(Action.RESUBSCRIBE)
      break
    case Action.UNSUBSCRIBE:
      emit(Action.UNSUBSCRIBE)
      break
    case Action.DELETE:
      emit(Action.DELETE)
      break
  }
}
</script>

<template>
  <ManageAssociableEntityDropdown
    :context-type="EAssociationContextType.DECLARED_ACTIVITY"
    :element-id="elementId"
    :has-associations="hasAssociations"
    :associate-override="actionDisabledState"
  >
    <template #default="{ associateAction, dissociateAction, handleAction }">
      <ManageEntityDropdown
        data-testid="activity-view-detailed-dropdown"
        :entity-name="t('global.ManageEntityDropdown.entityNames.activity')"
        :actions="[...ownActions, associateAction, dissociateAction]"
        @action-selected="(action) => onAction(action, handleAction)"
      />
    </template>
  </ManageAssociableEntityDropdown>
</template>
