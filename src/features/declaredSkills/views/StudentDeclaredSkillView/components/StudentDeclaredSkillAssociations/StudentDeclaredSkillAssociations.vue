<script setup lang="ts">
import type { DeclaredActivityAssociationDTO, DeclaredExperienceAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { EAssociationContextType } from '@/api/avenir-esr'
import AssociationElementsDropdown
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import { QuerySuspense } from '@/common/components'
import { useModal } from '@/common/composables'
import AssociatedDeclaredActivitiesCard
  from '@/features/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.vue'
import AssociatedTracesCard
  from '@/features/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import AssociateActivitiesToDeclaredSkillModal
  from '@/features/declaredSkills/components/overlays/modals/AssociateActivitiesToDeclaredSkillModal/AssociateActivitiesToDeclaredSkillModal.vue'
import AssociateDeclaredExperiencesToDeclaredSkillModal
  from '@/features/declaredSkills/components/overlays/modals/AssociateDeclaredExperiencesToDeclaredSkillModal/AssociateDeclaredExperiencesToDeclaredSkillModal.vue'
import DeleteDeclaredSkillAssociatedActivitiesModal
  from '@/features/declaredSkills/components/overlays/modals/DeleteDeclaredSkillAssociatedActivitiesModal/DeleteDeclaredSkillAssociatedActivitiesModal.vue'
import DeleteDeclaredSkillAssociatedTracesModal
  from '@/features/declaredSkills/components/overlays/modals/DeleteDeclaredSkillAssociatedTracesModal/DeleteDeclaredSkillAssociatedTracesModal.vue'
import { isDeletableDeclaredActivityAssociation } from '@/features/declaredSkills/rules/declared-activity-association.rules'
import { AssociatedDeclaredExperiencesCard } from '@/features/personalCareer'
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
  showModal: showAssociateActivitiesModal,
  displayModal: displayAssociateActivitiesModal,
  hideModal: hideAssociateActivitiesModal
} = useModal()

const {
  showModal: showDeleteActivitiesModal,
  displayModal: displayDeleteActivitiesModal,
  hideModal: hideDeleteActivitiesModal
} = useModal()

const {
  showModal: showAssociateDeclaredExperiencesModal,
  displayModal: displayAssociateDeclaredExperiencesModal,
  hideModal: hideAssociateDeclaredExperiencesModal
} = useModal()

const {
  showModal: showDeleteTracesModal,
  displayModal: displayDeleteTracesModal,
  hideModal: hideDeleteTracesModal
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
])

function onSelectAssociationType (type: EAssociationContextType) {
  switch (type) {
    case EAssociationContextType.DECLARED_ACTIVITY:
      displayAssociateActivitiesModal()
      break
    case EAssociationContextType.DECLARED_EXPERIENCE:
      displayAssociateDeclaredExperiencesModal()
      break
    default:
      break
  }
}

function handleDeleteSelect (type: EAssociationContextType) {
  if (type === EAssociationContextType.TRACE) {
    displayDeleteTracesModal()
    return
  }

  displayDeleteActivitiesModal()
}

function onAssociated (type: EAssociationContextType) {
  switch (type) {
    case EAssociationContextType.DECLARED_ACTIVITY:
      hideAssociateActivitiesModal()
      break
    case EAssociationContextType.DECLARED_EXPERIENCE:
      hideAssociateDeclaredExperiencesModal()
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
    :show="showAssociateActivitiesModal"
    :declared-skill-id="declaredSkillId"
    @cancel="hideAssociateActivitiesModal"
    @associated="() => onAssociated(EAssociationContextType.DECLARED_ACTIVITY)"
  />

  <AssociateDeclaredExperiencesToDeclaredSkillModal
    :show="showAssociateDeclaredExperiencesModal"
    :declared-skill-id="declaredSkillId"
    @cancel="hideAssociateDeclaredExperiencesModal"
    @associated="() => onAssociated(EAssociationContextType.DECLARED_EXPERIENCE)"
  />

  <DeleteDeclaredSkillAssociatedActivitiesModal
    :show="showDeleteActivitiesModal"
    :declared-skill-progress-id="declaredSkillId"
    :associations="associatedDeclaredActivities"
    @cancel="hideDeleteActivitiesModal"
    @deleted="hideDeleteActivitiesModal"
  />

  <DeleteDeclaredSkillAssociatedTracesModal
    :show="showDeleteTracesModal"
    :declared-skill-progress-id="declaredSkillId"
    :associations="associatedTraces"
    @cancel="hideDeleteTracesModal"
    @deleted="hideDeleteTracesModal"
  />
</template>
