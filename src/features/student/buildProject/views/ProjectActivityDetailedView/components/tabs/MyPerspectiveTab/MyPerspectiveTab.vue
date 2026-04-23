<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { type DeclaredActivityDetailsDTO, invalidateGetActivityDetail, useFinish } from '@/api/avenir-esr'
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
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()

const { mutate: mutateFinish, isPending } = useFinish()

function finishDeclaredActivity () {
  mutateFinish({ declaredActivityId: declaredActivityDetails.id }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivityConfirmModal.error'),
        description: error.message,
      })
    },
    onSuccess: async () => {
      await invalidateGetActivityDetail(queryClient, declaredActivityDetails.id)
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
      :disabled="isPending"
      @finished="finishDeclaredActivity"
    />
  </div>
</template>
