<script setup lang="ts">
import type { DeclaredActivityAssociationDTO, DeclaredExperienceAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationElementsDropdown
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import { QuerySuspense } from '@/common/components'
import { useModal } from '@/common/composables'
import AssociatedDeclaredActivitiesCard
  from '@/features/student/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.vue'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import AssociateActivitiesToDeclaredSkillModal
  from '@/features/student/declaredSkills/components/overlays/modals/AssociateActivitiesToDeclaredSkillModal/AssociateActivitiesToDeclaredSkillModal.vue'
import AssociateDeclaredExperiencesToDeclaredSkillModal
  from '@/features/student/declaredSkills/components/overlays/modals/AssociateDeclaredExperiencesToDeclaredSkillModal/AssociateDeclaredExperiencesToDeclaredSkillModal.vue'
import AssociateTracesToDeclaredSkillModal
  from '@/features/student/declaredSkills/components/overlays/modals/AssociateTracesToDeclaredSkillModal/AssociateTracesToDeclaredSkillModal.vue'
import DeleteDeclaredSkillAssociatedActivitiesModal
  from '@/features/student/declaredSkills/components/overlays/modals/DeleteDeclaredSkillAssociatedActivitiesModal/DeleteDeclaredSkillAssociatedActivitiesModal.vue'
import DeleteDeclaredSkillAssociatedTracesModal
  from '@/features/student/declaredSkills/components/overlays/modals/DeleteDeclaredSkillAssociatedTracesModal/DeleteDeclaredSkillAssociatedTracesModal.vue'
import { isDeletableDeclaredActivityAssociation } from '@/features/student/declaredSkills/rules/declared-activity-association.rules'
import { AssociatedDeclaredExperiencesCard } from '@/features/student/personalCareer'
import { useI18n } from 'vue-i18n'

interface StudentDeclaredSkillAssociationsProps {
  declaredSkillId: string
  associatedDeclaredActivities: DeclaredActivityAssociationDTO[]
  associatedDeclaredExperiences: DeclaredExperienceAssociationDTO[]
  associatedTraces: TraceAssociationDTO[]
  associationsError?: BaseApiException | null
  countAssociations?: number
}

const {
  declaredSkillId,
  associatedTraces,
  associatedDeclaredActivities,
  associatedDeclaredExperiences,
  associationsError,
  countAssociations
} = defineProps<StudentDeclaredSkillAssociationsProps>()

const emit = defineEmits<{
  (e: 'associated'): void
}>()

const { t } = useI18n()

const {
  modalOpened: associateActivitiesModalOpened,
  openModal: openAssociateActivitiesModal,
  closeModal: closeAssociateActivitiesModal
} = useModal()

const {
  modalOpened: deleteActivitiesModalOpened,
  openModal: openDeleteActivitiesModal,
  closeModal: closeDeleteActivitiesModal
} = useModal()

const {
  modalOpened: associateDeclaredExperiencesModalOpened,
  openModal: openAssociateDeclaredExperiencesModal,
  closeModal: closeAssociateDeclaredExperiencesModal
} = useModal()

const {
  modalOpened: associateTracesModalOpened,
  openModal: openAssociateTracesModal,
  closeModal: closeAssociateTracesModal
} = useModal()

const {
  modalOpened: deleteTracesModalOpened,
  openModal: openDeleteTracesModal,
  closeModal: closeDeleteTracesModal
} = useModal()

const deletableDeclaredActivityAssociations = computed(() =>
  associatedDeclaredActivities.filter(isDeletableDeclaredActivityAssociation))

const deleteItems = computed(() => [
  { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: deletableDeclaredActivityAssociations.value.length === 0 },
  { type: EAssociationContextType.TRACE, disabled: associatedTraces.length === 0 },
])

const isDeleteDropdownDisabled = computed(() => deleteItems.value.every(item => item.disabled))

const associateItems = computed(() => [
  { type: EAssociationContextType.DECLARED_ACTIVITY },
  { type: EAssociationContextType.DECLARED_EXPERIENCE },
  { type: EAssociationContextType.TRACE },
])

function onSelectAssociationType (type: EAssociationContextType) {
  switch (type) {
    case EAssociationContextType.DECLARED_ACTIVITY:
      openAssociateActivitiesModal()
      break
    case EAssociationContextType.DECLARED_EXPERIENCE:
      openAssociateDeclaredExperiencesModal()
      break
    case EAssociationContextType.TRACE:
      openAssociateTracesModal()
      break
    default:
      break
  }
}

function handleDeleteSelect (type: EAssociationContextType) {
  if (type === EAssociationContextType.TRACE) {
    openDeleteTracesModal()
    return
  }

  openDeleteActivitiesModal()
}

function onAssociated (type: EAssociationContextType) {
  switch (type) {
    case EAssociationContextType.DECLARED_ACTIVITY:
      closeAssociateActivitiesModal()
      break
    case EAssociationContextType.DECLARED_EXPERIENCE:
      closeAssociateDeclaredExperiencesModal()
      break
    case EAssociationContextType.TRACE:
      closeAssociateTracesModal()
      break
    default:
      return
  }
  emit('associated')
}
</script>

<template>
  <div class="student-declared-skill-associations-container">
    <div
      class="av-col av-gap-xl av-pt-xl"
      data-testid="declared-skill-associations"
    >
      <div class="av-row av-flex-fill av-justify-end av-gap-md">
        <AssociationElementsDropdown
          variant="delete"
          data-testid="delete-declared-skill-associated-elements-dropdown"
          :items="deleteItems"
          :disabled="isDeleteDropdownDisabled"
          @select="handleDeleteSelect"
        />
        <AssociationElementsDropdown
          variant="associate"
          data-testid="declared-skill-associate-elements-dropdown"
          :items="associateItems"
          @select="onSelectAssociationType"
        />
      </div>

      <QuerySuspense
        :error="associationsError"
        :error-title="t('student.declaredSkills.views.StudentDeclaredSkillView.errors.fetchAssociations')"
        :empty-state-message="t('student.declaredSkills.views.StudentDeclaredSkillView.empty.associations')"
        :is-empty="countAssociations === 0"
      >
        <div class="av-col av-gap-md">
          <AssociatedTracesCard :associated-traces="associatedTraces" />
          <AssociatedDeclaredActivitiesCard :associated-activities="associatedDeclaredActivities" />
          <AssociatedDeclaredExperiencesCard :associated-experiences="associatedDeclaredExperiences" />
        </div>
      </QuerySuspense>
    </div>
  </div>

  <AssociateActivitiesToDeclaredSkillModal
    :opened="associateActivitiesModalOpened"
    :declared-skill-id="declaredSkillId"
    @cancel="closeAssociateActivitiesModal"
    @associated="() => onAssociated(EAssociationContextType.DECLARED_ACTIVITY)"
  />

  <AssociateDeclaredExperiencesToDeclaredSkillModal
    :opened="associateDeclaredExperiencesModalOpened"
    :declared-skill-id="declaredSkillId"
    @cancel="closeAssociateDeclaredExperiencesModal"
    @associated="() => onAssociated(EAssociationContextType.DECLARED_EXPERIENCE)"
  />

  <AssociateTracesToDeclaredSkillModal
    :opened="associateTracesModalOpened"
    :declared-skill-id="declaredSkillId"
    @cancel="closeAssociateTracesModal"
    @associated="() => onAssociated(EAssociationContextType.TRACE)"
  />

  <DeleteDeclaredSkillAssociatedActivitiesModal
    :opened="deleteActivitiesModalOpened"
    :declared-skill-progress-id="declaredSkillId"
    :associations="associatedDeclaredActivities"
    @cancel="closeDeleteActivitiesModal"
    @deleted="closeDeleteActivitiesModal"
  />

  <DeleteDeclaredSkillAssociatedTracesModal
    :opened="deleteTracesModalOpened"
    :declared-skill-progress-id="declaredSkillId"
    :associations="associatedTraces"
    @cancel="closeDeleteTracesModal"
    @deleted="closeDeleteTracesModal"
  />
</template>
