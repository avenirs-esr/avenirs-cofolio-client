<script lang="ts" setup>
import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { ICONS } from '@/features/student/global/icons'
import { useDeleteTraceAssociationsMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface DeleteTraceAssociatedActivitiesModalProps {
  show: boolean
  traceId: string
  associations: DeclaredActivityAssociationDTO[]
}

const { traceId, associations } = defineProps<DeleteTraceAssociatedActivitiesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const selectedIds = ref<string[]>([])

const selectableElements = computed(() => associations.map(({ associationId, declaredActivity }) => ({
  id: associationId,
  title: declaredActivity.title,
})))

const { mutate: deleteTraceAssociations } = useDeleteTraceAssociationsMutation({
  onError: (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.generic'),
      description: error.message,
    })
  },
  onSuccess: () => {
    addSuccessMessage({
      timeout: 2000,
      description: t('student.global.overlays.modals.DeleteAssociationsModal.success', { count: selectedIds.value.length }),
    })
    selectedIds.value = []
    emit('deleted')
  },
})

function onConfirmDelete () {
  deleteTraceAssociations({
    traceId,
    associationIds: selectedIds.value
  })
}

function onCancel () {
  selectedIds.value = []
  emit('cancel')
}
</script>

<template>
  <DeleteAssociationsModal
    :show="show"
    :associations="selectableElements"
    :selected-association-ids="selectedIds"
    @cancel="onCancel"
    @confirm-delete="onConfirmDelete"
  >
    <CompactCardSelector
      v-model="selectedIds"
      :elements="selectableElements"
      :icon="ICONS.ACTIVITY"
    />
  </DeleteAssociationsModal>
</template>
