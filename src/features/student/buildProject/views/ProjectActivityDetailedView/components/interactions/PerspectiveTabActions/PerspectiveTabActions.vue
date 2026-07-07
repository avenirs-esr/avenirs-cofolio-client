<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { type DeclaredActivityDetailsDTO, EActivityStatus, EDeclaredActivityStatus, EFeedbackStatus, invalidateGetActivityPresentation, invalidateGetDeclaredActivityDetails, useAskForFeedback, useFinish } from '@/api/avenir-esr'
import { canCreateFeedbackRequest, computeRemainingFeedbacks } from '@/common/activities/rules/activities.rules'
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
const { isLoading: isTaskLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateFinish, isPending: isFinishPending } = useFinish()
const { mutate: mutateAskForFeedback, isPending: isFeedbackPending } = useAskForFeedback()

const remainingFeedbacks = computed(() => computeRemainingFeedbacks(declaredActivityDetails))

const isDeclaredActivityInProgress = computed(() => declaredActivityDetails.status === EDeclaredActivityStatus.IN_PROGRESS)
const isDeclaredActivitySubmitted = computed(() => declaredActivityDetails.status === EDeclaredActivityStatus.SUBMITTED)

const lastFeedback = computed(() => declaredActivityDetails.feedbacks?.at(0))

const isRequestFeedbackDisabled = computed(() => !canCreateFeedbackRequest(declaredActivityDetails, remainingFeedbacks.value))

const actionsHintInfo = computed(() => {
  if (declaredActivityDetails.status === EDeclaredActivityStatus.SUBSCRIBED) {
    return undefined
  }
  if (declaredActivityDetails.finishedAt) {
    return {
      text: t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivity.finishedAt', {
        date: new Date(declaredActivityDetails.finishedAt).toLocaleDateString('fr-FR'),
      }),
      type: 'finished',
    }
  }

  if (lastFeedback.value?.status === EFeedbackStatus.NEW && isDeclaredActivitySubmitted.value) {
    return {
      text: t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.updatableFeedback', {
        date: lastFeedback.value ? new Date(lastFeedback.value.createdAt).toLocaleDateString('fr-FR') : '',
      }),
      type: 'updatable-feedback',
    }
  }

  if (isDeclaredActivitySubmitted.value) {
    return {
      text: t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.feedbackPending'),
      type: 'feedback-pending',
    }
  }

  if (remainingFeedbacks.value === 0) {
    return {
      text: t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.maximumFeedbackReached'),
      type: 'max-feedback-reached',
    }
  }
  return undefined
})

const isLoading = computed(() => isFeedbackPending.value || isFinishPending.value || isTaskLoading.value)

function finishDeclaredActivity () {
  mutateFinish({ declaredActivityId: declaredActivityDetails.id }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivityConfirmModal.error'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, declaredActivityDetails.id),
        invalidateGetDeclaredActivityDetails(queryClient, declaredActivityDetails.id),
      ]))
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
      await withTaskLoading(() => Promise.all([
        invalidateGetActivityPresentation(queryClient, EActivityStatus.PUBLISHED, declaredActivityDetails.id),
        invalidateGetDeclaredActivityDetails(queryClient, declaredActivityDetails.id),
      ]))
      addSuccessMessage({
        timeout: 2000,
        description: t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.success'),
      })
    },
  })
}
</script>

<template>
  <div class="av-col av-gap-sm">
    <div
      class="av-row av-justify-end av-gap-md"
      data-testid="perspective-tab-actions"
    >
      <RequestFeedback
        v-if="isDeclaredActivityInProgress || isDeclaredActivitySubmitted"
        :feedback-created-at="lastFeedback?.createdAt"
        :feedback-status="lastFeedback?.status "
        :disabled="isRequestFeedbackDisabled"
        :is-loading="isFeedbackPending || isFinishPending || isLoading"
        :remaining-feedbacks="remainingFeedbacks"
        @request-feedback="requestFeedback"
      />
      <FinishDeclaredActivity
        :status="declaredActivityDetails.status"
        :is-loading="isLoading"
        @finished="finishDeclaredActivity"
      />
    </div>
    <div class="av-row av-justify-end">
      <span
        v-if="actionsHintInfo"
        class="caption-regular av-text-text2 av-text-right"
        data-testid="actions-hint"
        :data-type="actionsHintInfo.type"
      >
        {{ actionsHintInfo.text }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

@include dsav.min-width(md) {
  span[data-type="updatable-feedback"] {
    width: 38%;
  }
}
</style>
