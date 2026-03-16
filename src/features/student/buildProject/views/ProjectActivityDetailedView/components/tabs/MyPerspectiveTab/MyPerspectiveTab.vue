<script lang="ts" setup>
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { useFinishDeclaredActivityMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import MyPerspectiveCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/MyPerspectiveCard.vue'
import FinishDeclaredActivity
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/FinishDeclaredActivity/FinishDeclaredActivity.vue'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveTabProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveTabProps>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const { mutate: finishDeclaredActivity, isPending } = useFinishDeclaredActivityMutation({
  onError: (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivityConfirmModal.error'),
      description: error.message,
    })
  },
  onSuccess: () => {
    addSuccessMessage({
      timeout: 2000,
      description: t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivityConfirmModal.success'),
    })
  },
})

function onDeclaredActivityFinished () {
  finishDeclaredActivity({
    declaredActivityId: declaredActivityDetails.id,
  })
}
</script>

<template>
  <div
    class="av-col av-gap-sm"
    data-testid="my-perspective-tab"
  >
    <div>
      <MyPerspectiveCard
        :activity-id="declaredActivityDetails.id"
        :perspective="declaredActivityDetails.reflection"
      />
    </div>

    <FinishDeclaredActivity
      :finished-at="declaredActivityDetails.finishedAt"
      :status="declaredActivityDetails.status"
      :disabled="isPending"
      @finished="onDeclaredActivityFinished"
    />
  </div>
</template>
