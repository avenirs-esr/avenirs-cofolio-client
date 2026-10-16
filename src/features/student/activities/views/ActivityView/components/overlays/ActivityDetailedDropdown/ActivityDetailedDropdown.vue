<script lang="ts" setup>
import { EActivityStatus, type EDeclaredActivityStatus } from '@/api/avenir-esr'
import { isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
import { Action, type ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

export interface ActivityDetailedDropdownProps {
  status: EDeclaredActivityStatus
  activityStatus: EActivityStatus
}

const { status, activityStatus } = defineProps<ActivityDetailedDropdownProps>()

const emit = defineEmits<{
  (e: AllowedAction): void
}>()

type AllowedAction = Action.UPDATE | Action.UNSUBSCRIBE | Action.RESUBSCRIBE | Action.DELETE | Action.ASSOCIATE | Action.DISSOCIATE

const { t } = useI18n()

const isUnsubscribed = computed(() => isDeclaredActivityUnsubscribed(status))

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

const associateAction = computed<ActionItem>(() => ({
  type: Action.ASSOCIATE,
  disabledTooltip: t('student.activities.views.ActivitiesCatalogView.associate')
}))

const dissociateAction = computed<ActionItem>(() => ({
  type: Action.DISSOCIATE,
  disabledTooltip: t('student.activities.views.ActivitiesCatalogView.dissociate')
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
