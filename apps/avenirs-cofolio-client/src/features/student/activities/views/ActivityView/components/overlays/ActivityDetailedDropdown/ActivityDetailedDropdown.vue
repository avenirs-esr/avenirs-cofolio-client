<script lang="ts" setup>
import type { EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { EActivityStatus, EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { isDeclaredActivityCompleted, isDeclaredActivitySubmittedForAssessment, isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageAssociableEntityDropdown from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.vue'

export interface ActivityDetailedDropdownProps {
  declaredActivityId: string
  status: EDeclaredActivityStatus
  activityStatus: EActivityStatus
}

const { status, activityStatus } = defineProps<ActivityDetailedDropdownProps>()

const emit = defineEmits<{
  (e: AllowedAction): void
}>()

type AllowedAction = Action.UPDATE | Action.UNSUBSCRIBE | Action.RESUBSCRIBE | Action.DELETE

const { t } = useI18n()

const isUnsubscribed = computed(() => isDeclaredActivityUnsubscribed(status))

const actionInteractiveProps = computed(() => {
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

const actions = computed(() => (
  [
    deleteAction.value,
    ...(isUnsubscribed.value ? [resubscribeAction.value] : [Action.UPDATE, Action.UNSUBSCRIBE])
  ]
))
</script>

<template>
  <ManageAssociableEntityDropdown
    :actions="actions"
    :entity-name="t('global.ManageEntityDropdown.entityNames.activity')"
    :context-type="EAssociationContextType.DECLARED_ACTIVITY"
    :element-id="declaredActivityId"
    :association-interactive-props="actionInteractiveProps"
    :dissociation-interactive-props="actionInteractiveProps"
    @update="emit(Action.UPDATE)"
    @unsubscribe="emit(Action.UNSUBSCRIBE)"
    @delete="emit(Action.DELETE)"
    @resubscribe="emit(Action.RESUBSCRIBE)"
  />
</template>
