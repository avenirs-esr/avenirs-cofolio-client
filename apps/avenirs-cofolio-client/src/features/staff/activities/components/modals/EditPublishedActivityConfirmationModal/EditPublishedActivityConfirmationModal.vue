<script setup lang="ts">
import type { ActivityContentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { ConfirmationModal } from '@avenirs-esr/shared'
import { EActivityStatus, useGetActivityContent } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'

export interface EditPublishedActivityConfirmationModalProps {
  opened: boolean
  activity: ActivityContentDTO
}

const {
  opened,
  activity,
} = defineProps<EditPublishedActivityConfirmationModalProps>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const { t } = useI18n()

const i18nKey = 'staff.activities.modals.EditPublishedActivityConfirmationModal'

const parentActivityId = computed(() => activity.mainActivityId ?? '')
const isSubActivity = computed(() => !!parentActivityId.value)

const { data: parentActivity } = useGetActivityContent(EActivityStatus.PUBLISHED, parentActivityId, {
  query: {
    enabled: isSubActivity
  }
})

const activityTypeKey = computed(() => isSubActivity.value ? 'subActivity' : 'activity')
const enrollmentKey = computed(() => activity.hasEnrolledStudent ? 'withEnrolledStudents' : 'withoutEnrolledStudents')

const title = computed(() => t(`${i18nKey}.title.${activityTypeKey.value}`, { title: activity.title }))

const consequence = computed(() => t(`${i18nKey}.${enrollmentKey.value}.${activityTypeKey.value}`, { parentTitle: parentActivity.value?.title ?? '' }))

const subActivitiesComplement = computed(() => !isSubActivity.value && activity.subActivities.length > 0
  ? t(`${i18nKey}.subActivitiesComplement`, activity.subActivities.length)
  : undefined)

const description = computed(() => [consequence.value, subActivitiesComplement.value].filter(Boolean).join(' '))
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :title="title"
    :description="description"
    data-testid="edit-published-activity-confirmation-modal"
    @close="emit('close')"
    @confirm="emit('confirm')"
  />
</template>
