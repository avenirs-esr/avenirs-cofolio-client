<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { EUserCategory, NotificationDTOType } from '@/api/avenir-esr'
import NotificationsPopover from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.vue'
import ActivityModifiedNotificationCard from '@/features/student/global/components/cards/ActivityModifiedNotificationCard/ActivityModifiedNotificationCard.vue'
import AssessmentSentNotificationCard from '@/features/student/global/components/cards/AssessmentSentNotificationCard/AssessmentSentNotificationCard.vue'

const { t } = useI18n()
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
      </ul>
    </template>

    <template #default="{ notification, onRedirect, onSeen }">
      <ActivityModifiedNotificationCard
        v-if="notification.type === NotificationDTOType.ACTIVITY_MODIFIED"
        :notification="notification"
        @redirect="onRedirect"
        @seen="onSeen"
      />
      <AssessmentSentNotificationCard
        v-else-if="notification.type === NotificationDTOType.ASSESSMENT_SENT"
        :notification="notification"
        @redirect="onRedirect"
        @seen="onSeen"
      />
    </template>
  </NotificationsPopover>
</template>
