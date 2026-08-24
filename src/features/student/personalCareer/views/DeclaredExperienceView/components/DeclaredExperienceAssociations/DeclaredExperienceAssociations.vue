<script setup lang="ts">
import type { DeclaredSkillAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationElementsDropdown
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import { QuerySuspense } from '@/common/components'
import { useModal } from '@/common/composables'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import { AssociatedDeclaredSkillsCard } from '@/features/student/declaredSkills'
import AssociateDeclaredSkillsToDeclaredExperienceModal
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/overlays/modals/AssociateDeclaredSkillsToDeclaredExperienceModal/AssociateDeclaredSkillsToDeclaredExperienceModal.vue'
import AssociateTracesToDeclaredExperienceModal
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/overlays/modals/AssociateTracesToDeclaredExperienceModal/AssociateTracesToDeclaredExperienceModal.vue'
import DeleteDeclaredExperienceAssociatedDeclaredSkillsModal
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/overlays/modals/DeleteDeclaredExperienceAssociatedDeclaredSkillsModal/DeleteDeclaredExperienceAssociatedDeclaredSkillsModal.vue'
import DeleteDeclaredExperienceAssociatedTracesModal
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/overlays/modals/DeleteDeclaredExperienceAssociatedTracesModal/DeleteDeclaredExperienceAssociatedTracesModal.vue'
import { useI18n } from 'vue-i18n'

interface DeclaredExperienceAssociationsProps {
  declaredExperienceId: string
  traceAssociations: TraceAssociationDTO[]
  declaredSkillAssociations: DeclaredSkillAssociationDTO[]
  associationsError?: BaseApiException | null | undefined
}

const { declaredExperienceId, traceAssociations, declaredSkillAssociations } = defineProps<DeclaredExperienceAssociationsProps>()

const { t } = useI18n()

const {
  showModal: showDeleteTracesModal,
  displayModal: displayDeleteTracesModal,
  hideModal: hideDeleteTracesModal
} = useModal()

const {
  showModal: showDeleteDeclaredSkillsModal,
  displayModal: displayDeleteDeclaredSkillsModal,
  hideModal: hideDeleteDeclaredSkillsModal
} = useModal()

const {
  showModal: showAssociateTracesModal,
  displayModal: displayAssociateTracesModal,
  hideModal: hideAssociateTracesModal
} = useModal()

const {
  showModal: showAssociateDeclaredSkillsModal,
  displayModal: displayAssociateDeclaredSkillsModal,
  hideModal: hideAssociateDeclaredSkillsModal
} = useModal()

const countAssociations = computed(() => traceAssociations.length + declaredSkillAssociations.length)

const deleteItems = computed(() => [
  { type: EAssociationContextType.TRACE, disabled: traceAssociations.length === 0 },
  { type: EAssociationContextType.DECLARED_SKILL, disabled: declaredSkillAssociations.length === 0 },
])

const associateItems = computed(() => [
  { type: EAssociationContextType.TRACE },
  { type: EAssociationContextType.DECLARED_SKILL },
])

function handleDeleteSelect (type: EAssociationContextType) {
  if (type === EAssociationContextType.DECLARED_SKILL) {
    displayDeleteDeclaredSkillsModal()
    return
  }

  displayDeleteTracesModal()
}

function handleAssociateSelect (type: EAssociationContextType) {
  if (type === EAssociationContextType.DECLARED_SKILL) {
    displayAssociateDeclaredSkillsModal()
    return
  }

  displayAssociateTracesModal()
}

function onAssociated () {
  hideAssociateTracesModal()
}

function onDeclaredSkillsAssociated () {
  hideAssociateDeclaredSkillsModal()
}
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
          :disabled="countAssociations === 0"
          @select="handleDeleteSelect"
        />
        <AssociationElementsDropdown
          variant="associate"
          data-testid="associate-declared-experience-elements-dropdown"
          :items="associateItems"
          @select="handleAssociateSelect"
        />
      </div>

      <QuerySuspense
        :error="associationsError"
        :error-title="t('student.personalCareer.views.DeclaredExperienceView.errors.fetchAssociations')"
        :empty-state-message="t('student.personalCareer.views.DeclaredExperienceView.empty.associations')"
        :is-empty="countAssociations === 0"
      >
        <div class="av-col av-gap-md">
          <AssociatedTracesCard :associated-traces="traceAssociations" />
          <AssociatedDeclaredSkillsCard :associated-declared-skills="declaredSkillAssociations" />
        </div>
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

  <DeleteDeclaredExperienceAssociatedDeclaredSkillsModal
    :show="showDeleteDeclaredSkillsModal"
    :experience-id="declaredExperienceId"
    :associations="declaredSkillAssociations"
    @cancel="hideDeleteDeclaredSkillsModal"
    @deleted="hideDeleteDeclaredSkillsModal"
  />

  <AssociateTracesToDeclaredExperienceModal
    :show="showAssociateTracesModal"
    :declared-experience-id="declaredExperienceId"
    @cancel="hideAssociateTracesModal"
    @associated="onAssociated"
  />

  <AssociateDeclaredSkillsToDeclaredExperienceModal
    :show="showAssociateDeclaredSkillsModal"
    :declared-experience-id="declaredExperienceId"
    @cancel="hideAssociateDeclaredSkillsModal"
    @associated="onDeclaredSkillsAssociated"
  />
</template>
