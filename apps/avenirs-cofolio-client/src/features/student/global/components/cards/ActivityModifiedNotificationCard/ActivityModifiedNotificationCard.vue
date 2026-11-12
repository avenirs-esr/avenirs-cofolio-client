<script setup lang="ts">
import type { ActivityModifiedParameters, NotificationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { I18nT, useI18n } from 'vue-i18n'
import { ActivityModifiedParametersUpdatedFieldsItem } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import NotificationCard from '@/common/notifications/components/NotificationCard/NotificationCard.vue'

const { notification } = defineProps<{ notification: NotificationDTO }>()

const emit = defineEmits<{
  (e: 'redirect'): void
  (e: 'seen', id: string): void
}>()

const { t } = useI18n()

const to = computed(() => notification.elementId
  ? ({
      name: ROUTES.STUDENT.ACTIVITY.name,
      params: { id: notification.elementId },
    })
  : undefined)

const parameters = computed(() => notification.parameters as ActivityModifiedParameters | undefined)

const isSubActivityEdit = computed(() => parameters.value?.updatedFields?.includes(ActivityModifiedParametersUpdatedFieldsItem.SUB_ACTIVITIES))
const isSectionEdit = computed(() => !isSubActivityEdit.value)

const activityName = computed(() => parameters.value?.activityTitle ?? '')

const sectionTypes = computed(() => (parameters.value?.updatedFields ?? []).filter(field => field !== ActivityModifiedParametersUpdatedFieldsItem.SUB_ACTIVITIES))
const sectionCount = computed(() => Math.max(sectionTypes.value.length, 1))

const subActivitiesTitles = computed(() => parameters.value?.updatedSubActivityTitles ?? [])
const subActivitiesCount = computed(() => Math.max(subActivitiesTitles.value.length, 1))
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
        scope="global"
        tag="span"
      >

        <template #activityName>
          <span class="av-text-bold">{{ activityName }}</span>
        </template>

      </I18nT>
      <I18nT
        v-if="isSectionEdit"
        keypath="student.global.cards.ActivityModifiedNotificationCard.updatedFields.content"
        :plural="sectionCount"
        scope="global"
        tag="span"
      >
        <template #sectionTypes>
          <template
            v-for="(type, index) in sectionTypes"
            :key="index"
          >
            <span class="av-text-bold">{{ t(`student.global.cards.ActivityModifiedNotificationCard.updatedFields.types.${type}`) }}</span>
            <template v-if="index < sectionCount - 1">, </template>
          </template>
        </template>
      </I18nT>
      <I18nT
        v-else-if="isSubActivityEdit"
        keypath="student.global.cards.ActivityModifiedNotificationCard.updatedSubActivityTitles.content"
        :plural="subActivitiesCount"
        scope="global"
        tag="span"
      >
        <template #subActivitiesTitles>
          <template
            v-for="(title, index) in subActivitiesTitles"
            :key="index"
          >
            <span class="av-text-bold">{{ title }}</span>
            <template v-if="index < subActivitiesCount - 1">, </template>
          </template>
        </template>
      </I18nT>
    </span>
  </NotificationCard>
</template>
