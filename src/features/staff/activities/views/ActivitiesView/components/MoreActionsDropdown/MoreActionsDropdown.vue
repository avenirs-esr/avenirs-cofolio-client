<script lang="ts" setup>
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useI18n } from 'vue-i18n'
import { EActivityStatus, ERole } from '@/api/avenir-esr'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'

export interface MoreActionsDropdownProps {
  isLeader: boolean
  activityStatus: EActivityStatus
}

const { activityStatus, isLeader } = defineProps<MoreActionsDropdownProps>()

const emit = defineEmits<{
  (e: AllowedActions): void
}>()

type AllowedActions = Action.NAVIGATE_TO_FEEDBACKS | Action.UNPUBLISH | Action.DELETE | Action.CLONE

const { t } = useI18n()
const { roles } = useCurrentUser()

const canDelete = computed(() => activityStatus === EActivityStatus.DRAFT || roles.value.includes(ERole.ROLE_SUPER_ADMIN))

const actions = computed<(Action | ActionItem)[]>(() => ([
  {
    type: Action.NAVIGATE_TO_FEEDBACKS,
    disabled: activityStatus !== EActivityStatus.PUBLISHED || !isLeader,
    disabledTooltip: !isLeader
      ? t(
          'staff.activities.views.ActivitiesView.MoreActionsDropdown.leaderOnlyTooltip'
        )
      : t(
          'staff.activities.views.ActivitiesView.MoreActionsDropdown.navigateToFeedbacksDisabledTooltip'
        ),
  },
  {
    type: Action.UNPUBLISH,
    disabled: activityStatus !== EActivityStatus.PUBLISHED || !isLeader,
    disabledTooltip: !isLeader
      ? t(
          'staff.activities.views.ActivitiesView.MoreActionsDropdown.leaderOnlyTooltip'
        )
      : t(
          'staff.activities.views.ActivitiesView.MoreActionsDropdown.unpublishDisabledTooltip'
        ),
  },
  {
    type: Action.DELETE,
    disabled: !canDelete.value || !isLeader,
    disabledTooltip: !isLeader
      ? t(
          'staff.activities.views.ActivitiesView.MoreActionsDropdown.leaderOnlyTooltip'
        )
      : t(
          'staff.activities.views.ActivitiesView.MoreActionsDropdown.deleteDisabledTooltip'
        ),
  },
  Action.CLONE
]))
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
