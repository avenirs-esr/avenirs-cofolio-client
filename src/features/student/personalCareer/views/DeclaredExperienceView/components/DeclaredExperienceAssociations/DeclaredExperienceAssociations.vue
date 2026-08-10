<script setup lang="ts">
import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationElementsDropdown
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import { QuerySuspense } from '@/common/components'
import { useModal } from '@/common/composables'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import DeleteDeclaredExperienceAssociatedTracesModal
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/overlays/modals/DeleteDeclaredExperienceAssociatedTracesModal/DeleteDeclaredExperienceAssociatedTracesModal.vue'
import { useI18n } from 'vue-i18n'

interface DeclaredExperienceAssociationsProps {
  declaredExperienceId: string
  traceAssociations: TraceAssociationDTO[]
  associationsError?: BaseApiException | null | undefined
}

const { declaredExperienceId, traceAssociations } = defineProps<DeclaredExperienceAssociationsProps>()

const { t } = useI18n()

const {
  showModal: showDeleteTracesModal,
  displayModal: displayDeleteTracesModal,
  hideModal: hideDeleteTracesModal
} = useModal()

const countAssociations = computed(() => traceAssociations.length)

const deleteItems = computed(() => [
  { type: EAssociationContextType.TRACE, disabled: traceAssociations.length === 0 },
])
</script>

<template>
  <div class="declared-experience-associations-container">
    <div
      class="av-col av-gap-xl av-pt-xl"
      data-testid="declared-experience-associations"
    >
      <div class="av-row av-flex-fill av-justify-end av-gap-md">
        <AssociationElementsDropdown
          variant="delete"
          data-testid="delete-declared-experience-associated-elements-dropdown"
          :items="deleteItems"
          @select="displayDeleteTracesModal"
        />
      </div>

      <QuerySuspense
        :error="associationsError"
        :error-title="t('student.personalCareer.views.DeclaredExperienceView.errors.fetchAssociations')"
        :empty-state-message="t('student.personalCareer.views.DeclaredExperienceView.empty.associations')"
        :is-empty="countAssociations === 0"
      >
        <AssociatedTracesCard :associated-traces="traceAssociations" />
      </QuerySuspense>
    </div>
  </div>

  <DeleteDeclaredExperienceAssociatedTracesModal
    :show="showDeleteTracesModal"
    :experience-id="declaredExperienceId"
    :associations="traceAssociations"
    @cancel="hideDeleteTracesModal"
    @deleted="hideDeleteTracesModal"
  />
</template>
