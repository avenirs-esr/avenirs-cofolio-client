<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useDeleteDeclaredExperienceMutation } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredExperienceConfirmModalProps {
  show: boolean
  declaredExperienceIds: string[]
}

const { declaredExperienceIds } = defineProps<DeleteDeclaredExperienceConfirmModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { mutate: deleteExperiences } = useDeleteDeclaredExperienceMutation({
  onSuccess: () => {
    addSuccessMessage(t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.success', { count: declaredExperienceIds.length }))
    emit('confirm')
  },
  onError: (error) => {
    addErrorMessage({
      title: t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.error', { count: declaredExperienceIds.length }),
      description: error.message
    })
  }
})
</script>

<template>
  <ConfirmationModal
    :show="show"
    :title="t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.title', { count: declaredExperienceIds.length })"
    :description="t('student.personalCareer.overlays.DeleteDeclaredExperienceConfirmModal.description')"
    @close="emit('close')"
    @confirm="deleteExperiences({ declaredExperienceIds })"
  />
</template>
