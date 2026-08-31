<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import type { IdTitle } from '@/types'
import {
  EActivityStatus,
  invalidateGetActivityPresentation,
  useSubscribeActivity
} from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface SubscribeActivityConfirmModalProps {
  show: boolean
  activity: IdTitle
}

const { activity } = defineProps<SubscribeActivityConfirmModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'subscribed'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateSubscribeActivity } = useSubscribeActivity()

function subscribe () {
  mutateSubscribeActivity(
    {
      activityId: activity.id,
      data: {}
    },
    {
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, activity.id))
        addSuccessMessage(t('student.buildProject.activities.overlays.SubscribeActivityConfirmModal.success'))
        emit('subscribed')
      },
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('student.buildProject.activities.overlays.SubscribeActivityConfirmModal.error'),
          description: getErrorMessage(error)
        })
      }
    }
  )
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :is-loading="isLoading"
    data-testid="subscribe-activity-confirm-modal"
    @close="$emit('cancel')"
    @confirm="subscribe"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="subscribe-activity-confirm-modal__header"
      >
        <span
          class="b2-bold av-text-text1"
          data-testid="subscribe-activity-confirm-modal__title"
        >
          {{ t('student.buildProject.activities.overlays.SubscribeActivityConfirmModal.title', { title: activity.title }) }}
        </span>
      </div>
    </template>

    <div />
  </ConfirmationModal>
</template>
