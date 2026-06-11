<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { type DeclaredActivityDetailsDTO, EActivityStatus, EDeclaredActivityStatus, EFeedbackStatus, invalidateGetActivityPresentation, useAskForFeedback, useFinish } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import FinishDeclaredActivity
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/FinishDeclaredActivity/FinishDeclaredActivity.vue'
import RequestFeedback
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/interactions/RequestFeedback/RequestFeedback.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveTabActionsProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveTabActionsProps>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateFinish, isPending: isFinishPending } = useFinish()
const { mutate: mutateAskForFeedback, isPending: isFeedbackPending } = useAskForFeedback()

const lastFeedback = computed(() => declaredActivityDetails.feedbacks?.at(-1) ?? null)
const isLastFeedbackPending = computed(() => lastFeedback.value?.status === EFeedbackStatus.IN_PROCESS)
const remainingFeedbacks = computed(() => declaredActivityDetails.activity.feedbackAllowedIterations - (declaredActivityDetails.feedbacks?.length ?? 0))

const isDeclaredActivityInProgress = computed(() => declaredActivityDetails.status === EDeclaredActivityStatus.IN_PROGRESS)

const actionsHint = computed(() => {
  if (declaredActivityDetails.status === EDeclaredActivityStatus.SUBSCRIBED) {
    return undefined
  }
  if (declaredActivityDetails.finishedAt) {
    return t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivity.finishedAt', {
      date: new Date(declaredActivityDetails.finishedAt).toLocaleDateString('fr-FR'),
    })
  }
  if (isLastFeedbackPending.value) {
    return t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.feedbackPending')
  }
  if (remainingFeedbacks.value <= 0) {
    return t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.maximumFeedbackReached')
  }
  return undefined
})

function finishDeclaredActivity () {
  mutateFinish({ declaredActivityId: declaredActivityDetails.id }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivityConfirmModal.error'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, declaredActivityDetails.id))
      addSuccessMessage({
        timeout: 2000,
        description: t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivityConfirmModal.success'),
      })
    },
  })
}

function requestFeedback () {
  mutateAskForFeedback({ declaredActivityId: declaredActivityDetails.id }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.error'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, declaredActivityDetails.id))
      addSuccessMessage({
        timeout: 2000,
        description: t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.success'),
      })
    },
  })
}
</script>

<template>
  <div
    class="av-row av-justify-end av-gap-md"
    data-testid="perspective-tab-actions"
  >
    <RequestFeedback
      v-if="isDeclaredActivityInProgress"
      :disabled="isLastFeedbackPending || remainingFeedbacks <= 0"
      :is-loading="isFeedbackPending || isFinishPending || isLoading"
      :remaining-feedbacks="remainingFeedbacks"
      @request-feedback="requestFeedback"
    />
    <FinishDeclaredActivity
      :status="declaredActivityDetails.status"
      :is-loading="isFeedbackPending || isFinishPending || isLoading"
      @finished="finishDeclaredActivity"
    />
  </div>
  <div class="av-row av-justify-end">
    <span
      v-if="actionsHint"
      class="av-text-text2"
      data-testid="actions-hint"
    >
      {{ actionsHint }}
    </span>
  </div>
</template>
