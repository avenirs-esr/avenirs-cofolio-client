<script setup lang="ts">
import type { AskForFeedbackParameters, NotificationDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import NotificationCard from '@/common/notifications/components/NotificationCard/NotificationCard.vue'
import { I18nT } from 'vue-i18n'

const { notification: n } = defineProps<{ notification: NotificationDTO }>()

const emit = defineEmits<{
  (e: 'redirect'): void
  (e: 'seen', id: string): void
}>()

const parameters = computed(() => n.parameters as AskForFeedbackParameters | undefined)
const to = computed(() => n.elementId !== undefined
  ? ({
      name: ROUTES.STAFF.ACTIVITY_FEEDBACK_DETAILS.name,
      params: { feedbackId: n.elementId },
    })
  : undefined)
</script>

<template>
  <NotificationCard
    :id="n.id"
    :seen="n.seen"
    :created-at="n.createdAt"
    :to="to"
    data-testid="activity-feedback-notification-card"
    @redirect="emit('redirect')"
    @seen="emit('seen', $event)"
  >
    <span data-testid="activity-feedback-notification-card-content">
      <I18nT
        keypath="staff.global.cards.ActivityFeedbackNotificationCard.content"
        scope="global"
        tag="span"
      >
        <template #studentName>
          <span class="av-text-bold">{{ parameters?.studentLastName }} {{ parameters?.studentFirstName }}</span>
        </template>

        <template #activityName>
          <span class="av-text-bold">{{ parameters?.activityTitle }}</span>
        </template>
      </I18nT>
    </span>
  </NotificationCard>
</template>
