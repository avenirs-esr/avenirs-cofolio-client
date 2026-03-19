<script lang="ts" setup>
import type { AssociationsDeleteRequest } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { useDeleteDeclaredActivityAssociationsMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface DeleteActivityAssociatedTracesModalProps {
  show: boolean
  declaredActivityId: string
}

const { declaredActivityId } = defineProps<DeleteActivityAssociatedTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const { mutate: deleteDeclaredActivityAssociations, isPending } = useDeleteDeclaredActivityAssociationsMutation({
  onError: (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.generic'),
      description: error.message,
    })
  },
  onSuccess: () => {
    addSuccessMessage({
      timeout: 2000,
      description: t('student.buildProject.activities.views.ProjectActivityDetailedView.DeleteActivityAssociatedTracesModal.success'),
    })
    emit('deleted')
  },
})

const dummyAssociations = [
  { id: '1', title: '(Placeholder) Trace 1' },
  { id: '2', title: '(Placeholder) Trace 2' },
  { id: '3', title: '(Placeholder) Trace 3' }
]

const dummySelectedAssociationIds = ['1', '2']

function onConfirmDelete () {
  const associationsDeleteRequest: AssociationsDeleteRequest = {
    idsToDelete: dummySelectedAssociationIds
  }

  deleteDeclaredActivityAssociations({
    declaredActivityId,
    associationsDeleteRequest
  })
}
</script>

<template>
  <DeleteAssociationsModal
    :show="show"
    :associations="dummyAssociations"
    :selected-association-ids="dummySelectedAssociationIds"
    :is-loading="isPending"
    @cancel="emit('cancel')"
    @confirm-delete="onConfirmDelete"
  >
    <div class="av-col">
      <span
        v-for="association in dummyAssociations"
        :key="association.id"
      >
        {{ association.title }}
      </span>
    </div>
  </DeleteAssociationsModal>
</template>
