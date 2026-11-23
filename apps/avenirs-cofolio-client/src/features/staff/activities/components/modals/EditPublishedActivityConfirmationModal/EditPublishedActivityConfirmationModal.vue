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

const hasEnrolledStudent = computed(() => activity.hasEnrolledStudent ?? false)

const title = computed(() => t(`${i18nKey}.title.subActivity`, { title: activity.title }))
const description = computed(() => {
  const parentTitle = parentActivity.value?.title ?? ''
  return hasEnrolledStudent.value
    ? t(`${i18nKey}.withEnrolledStudents.subActivity`, { parentTitle })
    : t(`${i18nKey}.withoutEnrolledStudents.subActivity`, { parentTitle })
})
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :title="title"
    :description="description"
    @close="emit('close')"
    @confirm="emit('confirm')"
  />
</template>
