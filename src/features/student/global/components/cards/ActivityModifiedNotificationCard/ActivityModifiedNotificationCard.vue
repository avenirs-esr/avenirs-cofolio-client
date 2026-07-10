<script setup lang="ts">
import type { ActivityModifiedParameters, NotificationDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import NotificationCard from '@/common/notifications/components/NotificationCard/NotificationCard.vue'
import { I18nT, useI18n } from 'vue-i18n'

const { notification } = defineProps<{ notification: NotificationDTO }>()

const emit = defineEmits<{
  (e: 'redirect'): void
  (e: 'seen', id: string): void
}>()

const { t } = useI18n()

const to = computed(() => notification.elementId
  ? ({
      name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
      params: { id: notification.elementId },
    })
  : undefined)

const parameters = computed(() => notification.parameters as ActivityModifiedParameters | undefined)
const activityName = computed(() => parameters.value?.activityTitle ?? '')
const sectionTypes = computed(() => parameters.value?.updatedFields ?? [])
const sectionCount = computed(() => Math.max(sectionTypes.value.length, 1))
</script>

<template>
  <NotificationCard
    :id="notification.id"
    :seen="notification.seen"
    :created-at="notification.createdAt"
    :to="to"
    data-testid="activity-modified-notification-card"
    @redirect="emit('redirect')"
    @seen="emit('seen', $event)"
  >
    <span data-testid="activity-modified-notification-card-content">
      <I18nT
        keypath="student.global.cards.ActivityModifiedNotificationCard.content"
        :plural="sectionCount"
        scope="global"
        tag="span"
      >
        <template #activityName>
          <span class="av-text-bold">{{ activityName }}</span>
        </template>

        <template #sectionTypes>
          <template
            v-for="(type, index) in sectionTypes"
            :key="index"
          >
            <span class="av-text-bold">{{ t(`student.global.cards.ActivityModifiedNotificationCard.updatedFields.${type}`) }}</span>
            <template v-if="index < sectionCount - 1">, </template>
          </template>
        </template>
      </I18nT>
    </span>
  </NotificationCard>
</template>
