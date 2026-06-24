<script setup lang="ts">
import { EUserCategory, NotificationDTOType } from '@/api/avenir-esr'
import NotificationsPopover from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.vue'
import ActivityFeedbackNotificationCard from '@/features/staff/global/components/cards/ActivityFeedbackNotificationCard/ActivityFeedbackNotificationCard.vue'
</script>

<template>
  <NotificationsPopover :user-category="EUserCategory.STAFF">
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
