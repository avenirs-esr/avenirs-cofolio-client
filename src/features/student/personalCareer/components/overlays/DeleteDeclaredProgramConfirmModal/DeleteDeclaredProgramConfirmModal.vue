<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useDeleteDeclaredProgramMutation } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredProgramConfirmModalProps {
  show: boolean
  declaredProgramIds: string[]
}

const { declaredProgramIds } = defineProps<DeleteDeclaredProgramConfirmModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { mutate: deletePrograms } = useDeleteDeclaredProgramMutation({
  onSuccess: () => {
    addSuccessMessage(t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.success', { count: declaredProgramIds.length }))
    emit('confirm')
  },
  onError: (error) => {
    addErrorMessage({
      title: t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.error', { count: declaredProgramIds.length }),
      description: error.message
    })
  }
})
</script>

<template>
  <ConfirmationModal
    :show="show"
    :title="t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.title', { count: declaredProgramIds.length })"
    :description="t('student.personalCareer.overlays.DeleteDeclaredProgramConfirmModal.description')"
    @close="emit('close')"
    @confirm="deletePrograms({ declaredProgramIds })"
  />
</template>
