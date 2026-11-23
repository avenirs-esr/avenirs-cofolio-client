<script lang="ts" setup>
import type { AvDropdownProps } from '@avenirs-esr/avenirs-dsav'
import type { ActionItem } from '@avenirs-esr/shared'
import { Action, ManageEntityDropdown } from '@avenirs-esr/shared'
import { EActivityStatus, ERole } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'

export interface MoreActionsDropdownProps {
  isLeader: boolean
  activityStatus: EActivityStatus
  triggerSize?: AvDropdownProps['triggerSize']
}

const { activityStatus, isLeader, triggerSize } = defineProps<MoreActionsDropdownProps>()

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
    :trigger-size="triggerSize"
    width="max-content"
    icon-only
    @action-selected="(action) => emit(action as AllowedActions)"
  />
</template>
