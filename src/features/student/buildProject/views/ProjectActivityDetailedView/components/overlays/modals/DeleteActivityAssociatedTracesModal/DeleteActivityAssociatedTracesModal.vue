<script lang="ts" setup>
import type { AssociationsDeleteRequest } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { IdTitleList } from '@/types'
import { useDeleteDeclaredActivityAssociationsMutation } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { ICONS } from '@/features/student/global/icons'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface DeleteActivityAssociatedTracesModalProps {
  show: boolean
  declaredActivityId: string
  associations: IdTitleList
}

const { declaredActivityId, associations } = defineProps<DeleteActivityAssociatedTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const selectedIds = ref<string[]>([])

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
    selectedIds.value = []
    emit('deleted')
  },
})

function onConfirmDelete () {
  const associationsDeleteRequest: AssociationsDeleteRequest = {
    idsToDelete: selectedIds.value
  }

  deleteDeclaredActivityAssociations({
    declaredActivityId,
    associationsDeleteRequest
  })
}

const selectableElements = associations.map(association => ({
  id: association.id,
  title: association.title,
}))

function onCancel () {
  selectedIds.value = []
  emit('cancel')
}
</script>

<template>
  <DeleteAssociationsModal
    :show="show"
    :associations="associations"
    :selected-association-ids="selectedIds"
    :is-loading="isPending"
    @cancel="onCancel"
    @confirm-delete="onConfirmDelete"
  >
    <CompactCardSelector
      v-model="selectedIds"
      :elements="selectableElements"
      :icon="ICONS.TRACES"
      color="var(--text1)"
      background-color="var(--light-background-neutral)"
      checkbox-color="var(--dark-background-primary1)"
      overlay-color="var(--dark-background-primary1)"
      :overlay-opacity="0.25"
    />
  </DeleteAssociationsModal>
</template>
