<script lang="ts" setup>
import { EActivityStatus } from '@/api/avenir-esr'
import { Action, type ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useI18n } from 'vue-i18n'

export interface MoreActionsDropdownProps {
  activityStatus: EActivityStatus
}

const { activityStatus } = defineProps<MoreActionsDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.NAVIGATE_TO_FEEDBACKS | Action.UNPUBLISH | Action.DELETE | Action.CLONE

const { t } = useI18n()

const actions = computed<(Action | ActionItem)[]>(() => [
  {
    type: Action.NAVIGATE_TO_FEEDBACKS,
    disabled: activityStatus !== EActivityStatus.PUBLISHED,
    disabledTooltip: t('staff.activities.views.ActivitiesView.MoreActionsDropdown.navigateToFeedbacksDisabledTooltip')
  },
  {
    type: Action.UNPUBLISH,
    disabled: activityStatus !== EActivityStatus.PUBLISHED,
    disabledTooltip: t('staff.activities.views.ActivitiesView.MoreActionsDropdown.unpublishDisabledTooltip')
  },
  {
    type: Action.DELETE,
    disabled: activityStatus !== EActivityStatus.DRAFT,
    disabledTooltip: t('staff.activities.views.ActivitiesView.MoreActionsDropdown.deleteDisabledTooltip')
  },
  Action.CLONE
])
</script>

<template>
  <ManageEntityDropdown
    :entity-name="t('global.ManageEntityDropdown.entityNames.activity')"
    data-testid="more-actions-dropdown"
    :actions="actions"
    width="max-content"
    icon-only
    @action-selected="(action) => emit(action as AllowedActions)"
  />
</template>
