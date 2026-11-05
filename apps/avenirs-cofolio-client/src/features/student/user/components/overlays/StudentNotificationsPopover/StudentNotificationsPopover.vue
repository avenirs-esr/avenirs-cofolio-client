<script setup lang="ts">
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { EUserCategory, NotificationDTOType } from '@/api/avenir-esr'
import NotificationsPopover from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.vue'
import ActivityModifiedNotificationCard from '@/features/student/global/components/cards/ActivityModifiedNotificationCard/ActivityModifiedNotificationCard.vue'
import AssessmentModifiedNotificationCard from '@/features/student/global/components/cards/AssessmentModifiedNotificationCard/AssessmentModifiedNotificationCard.vue'
import AssessmentSentNotificationCard from '@/features/student/global/components/cards/AssessmentSentNotificationCard/AssessmentSentNotificationCard.vue'

const { t } = useI18n()

const notificationComponents: Partial<Record<NotificationDTOType, Component>> = {
  [NotificationDTOType.ACTIVITY_MODIFIED]: ActivityModifiedNotificationCard,
  [NotificationDTOType.ASSESSMENT_MODIFIED]: AssessmentModifiedNotificationCard,
  [NotificationDTOType.ASSESSMENT_SENT]: AssessmentSentNotificationCard
}
</script>

<template>
  <NotificationsPopover :user-category="EUserCategory.STUDENT">
    <template #empty>
      <span
        class="b2-light"
        data-testid="student-notifications-popover-contexts-header"
      >
        {{ t('global.notifications.NotificationsPopover.contexts.header') }}
      </span>
      <ul
        class="b2-regular av-pl-lg"
        data-testid="student-notifications-popover-contexts"
      >
        <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.contexts.activityModified') }}</span></li>
        <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.contexts.assessmentSent') }}</span></li>
        <li><span>{{ t('student.user.overlays.StudentNotificationsPopover.contexts.assessmentModified') }}</span></li>
      </ul>
    </template>

    <template #default="{ notification, onRedirect, onSeen }">
      <component
        :is="notificationComponents[notification.type]"
        v-if="notificationComponents[notification.type]"
        :notification="notification"
        @redirect="onRedirect"
        @seen="onSeen"
      />
    </template>
  </NotificationsPopover>
</template>
