<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { type DeclaredActivityDetailsDTO, EActivityStatus, invalidateGetActivityPresentation, useFinish } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import MyPerspectiveCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/MyPerspectiveCard.vue'
import FinishDeclaredActivity
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/FinishDeclaredActivity/FinishDeclaredActivity.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveTabProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveTabProps>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { mutate: mutateFinish, isPending } = useFinish()

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
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="my-perspective-tab"
  >
    <div class="av-pt-md">
      <MyPerspectiveCard
        :activity-id="declaredActivityDetails.id"
        :perspective="declaredActivityDetails.reflection"
      />
    </div>

    <FinishDeclaredActivity
      :finished-at="declaredActivityDetails.finishedAt"
      :status="declaredActivityDetails.status"
      :is-loading="isPending || isLoading"
      @finished="finishDeclaredActivity"
    />
  </div>
</template>
