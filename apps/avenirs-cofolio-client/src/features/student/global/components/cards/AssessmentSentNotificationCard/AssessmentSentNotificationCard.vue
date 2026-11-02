<script setup lang="ts">
import type { AssessmentSentParameters, NotificationDTO } from '@/api/avenir-esr'
import { I18nT } from 'vue-i18n'
import { ROUTES } from '@/common/constants'
import NotificationCard from '@/common/notifications/components/NotificationCard/NotificationCard.vue'

const { notification } = defineProps<{ notification: NotificationDTO }>()

const emit = defineEmits<{
  (e: 'redirect'): void
  (e: 'seen', id: string): void
}>()

const to = computed(() => notification.elementId
  ? ({
      name: ROUTES.STUDENT.ACTIVITY.name,
      params: { id: notification.elementId },
    })
  : undefined)

const parameters = computed(() => notification.parameters as AssessmentSentParameters | undefined)
const activityName = computed(() => parameters.value?.activityTitle ?? '')
</script>

<template>
  <NotificationCard
    :id="notification.id"
    :seen="notification.seen"
    :created-at="notification.createdAt"
    :to="to"
    data-testid="assessment-sent-notification-card"
    @redirect="emit('redirect')"
    @seen="emit('seen', $event)"
  >
    <span data-testid="assessment-sent-notification-card-content">
      <I18nT
        keypath="student.global.cards.AssessmentSentNotificationCard.content"
        scope="global"
        tag="span"
      >
        <template #activityName>
          <span class="av-text-bold">{{ activityName }}</span>
        </template>
      </I18nT>
    </span>
  </NotificationCard>
</template>
