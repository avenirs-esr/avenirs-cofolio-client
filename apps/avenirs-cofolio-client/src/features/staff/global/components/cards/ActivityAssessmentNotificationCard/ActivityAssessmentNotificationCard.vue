<script setup lang="ts">
import type { AssessmentRequestNotificationParameters, NotificationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { I18nT } from 'vue-i18n'
import { ROUTES } from '@/common/constants'
import NotificationCard from '@/common/notifications/components/NotificationCard/NotificationCard.vue'
import { toFullName } from '@/common/utils/user/user'

const { notification } = defineProps<{ notification: NotificationDTO }>()

const emit = defineEmits<{
  (e: 'redirect'): void
  (e: 'seen', id: string): void
}>()

const parameters = computed(() => notification.parameters as AssessmentRequestNotificationParameters | undefined)
const declaredActivityId = computed(() => parameters.value?.activityId)
const to = computed(() => declaredActivityId.value !== undefined
  ? ({
      name: ROUTES.STAFF.ACTIVITY_ASSESSMENT.name,
      params: { declaredActivityId: declaredActivityId.value },
    })
  : undefined)
</script>

<template>
  <NotificationCard
    :id="notification.id"
    :seen="notification.seen"
    :created-at="notification.createdAt"
    :to="to"
    data-testid="activity-assessment-notification-card"
    @redirect="emit('redirect')"
    @seen="emit('seen', $event)"
  >
    <span data-testid="activity-assessment-notification-card-content">
      <I18nT
        keypath="staff.global.cards.ActivityAssessmentNotificationCard.content"
        scope="global"
        tag="span"
      >
        <template #studentName>
          <span class="av-text-bold">{{ toFullName(parameters?.studentFirstName, parameters?.studentLastName) }}</span>
        </template>

        <template #activityName>
          <span class="av-text-bold">{{ parameters?.activityTitle }}</span>
        </template>
      </I18nT>
    </span>
  </NotificationCard>
</template>
