<script setup lang="ts">
import { EUserCategory, NotificationDTOType } from '@/api/avenir-esr'
import NotificationsPopover from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.vue'
import ActivityFeedbackNotificationCard from '@/features/staff/global/components/cards/ActivityFeedbackNotificationCard/ActivityFeedbackNotificationCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <NotificationsPopover :user-category="EUserCategory.STAFF">
    <template #empty>
      <span
        class="b2-light"
        data-testid="staff-notifications-popover-contexts-header"
      >
        {{ t('global.notifications.NotificationsPopover.contexts.header') }}
      </span>
      <ul
        class="b2-regular av-pl-lg"
        data-testid="staff-notifications-popover-contexts"
      >
        <li><span>{{ t('staff.user.overlays.StaffNotificationsPopover.contexts.feedback') }}</span></li>
      </ul>
    </template>
    <template #default="{ notification: n, onRedirect, onSeen }">
      <ActivityFeedbackNotificationCard
        v-if="n.type === NotificationDTOType.ASK_FOR_FEEDBACK"
        :notification="n"
        @redirect="onRedirect"
        @seen="onSeen"
      />
    </template>
  </NotificationsPopover>
</template>
