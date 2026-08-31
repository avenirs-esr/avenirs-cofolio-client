<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import {
  type DeclaredSkillAssociationDTO,
  type DeclaredSkillProgressDTO,
  invalidateGetDeclaredExperience,
  invalidateGetDeclaredExperienceAssociations,
  useDeleteDeclaredExperienceAssociations
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ICONS } from '@/common/constants'
import CompactCardSelector from '@/features/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeleteAssociationsModal from '@/features/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.vue'
import { useToasterStore } from '@/store'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredExperienceAssociatedDeclaredSkillsModalProps {
  show: boolean
  experienceId: string
  associations: DeclaredSkillAssociationDTO[]
}

const { experienceId, associations } = defineProps<DeleteDeclaredExperienceAssociatedDeclaredSkillsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { isLoading, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const selectedIds = ref<string[]>([])

const selectableElements = computed(() => associations.map(({ associationId, declaredSkill }) => ({
  id: associationId,
  title: declaredSkill.title,
  showSlot: true,
  baseElement: declaredSkill
})))

const { mutate: deleteDeclaredExperienceAssociations } = useDeleteDeclaredExperienceAssociations({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async () => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredExperienceAssociations(queryClient, experienceId),
        invalidateGetDeclaredExperience(queryClient, experienceId),
      ]))
      addSuccessMessage({
        timeout: 2000,
        description: t('student.global.overlays.modals.DeleteAssociationsModal.success', { count: selectedIds.value.length }),
      })
      selectedIds.value = []
      emit('deleted')
    }
  }
})

function onConfirmDelete () {
  deleteDeclaredExperienceAssociations({
    experienceId,
    data: { idsToDelete: selectedIds.value }
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
    :is-loading="isLoading"
    @cancel="onCancel"
    @confirm-delete="onConfirmDelete"
  >
    <CompactCardSelector
      v-model="selectedIds"
      :elements="selectableElements"
      :icon="ICONS.SKILLS"
    >
      <template #default="{ element }">
        <AvBadge
          :label="t(`student.declaredSkills.declaredSkillTypes.${(element as DeclaredSkillProgressDTO).type}`)"
          color="var(--text1)"
          border-color="var(--other-border-skill-card)"
          background-color="var(--surface-background)"
          :icon="MDI_ICONS.BOOKMARK_CHECK"
          small
          ellipsis
        />
      </template>
    </CompactCardSelector>
  </DeleteAssociationsModal>
</template>
