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
import DeleteDeclaredSkillAssociatedActivitiesModal
  from '@/features/student/declaredSkills/components/overlays/modals/DeleteDeclaredSkillAssociatedActivitiesModal/DeleteDeclaredSkillAssociatedActivitiesModal.vue'
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
  showModal: showAssociateActivitiesModal,
  displayModal: displayAssociateActivitiesModal,
  hideModal: hideAssociateActivitiesModal
} = useModal()

const {
  showModal: showDeleteActivitiesModal,
  displayModal: displayDeleteActivitiesModal,
  hideModal: hideDeleteActivitiesModal
} = useModal()

const deletableDeclaredActivityAssociations = computed(() =>
  associatedDeclaredActivities.filter(isDeletableDeclaredActivityAssociation))

const deleteItems = computed(() => [
  { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: deletableDeclaredActivityAssociations.value.length === 0 },
])

const associateItems = computed(() => [
  { type: EAssociationContextType.DECLARED_ACTIVITY },
])

function onAssociated () {
  hideAssociateActivitiesModal()
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
          @select="displayDeleteActivitiesModal"
        />
        <AssociationElementsDropdown
          variant="associate"
          data-testid="declared-skill-associate-elements-dropdown"
          :items="associateItems"
          @select="displayAssociateActivitiesModal"
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
    @associated="onAssociated"
  />

  <DeleteDeclaredSkillAssociatedActivitiesModal
    :show="showDeleteActivitiesModal"
    :declared-skill-progress-id="declaredSkillId"
    :associations="associatedDeclaredActivities"
    @cancel="hideDeleteActivitiesModal"
    @deleted="hideDeleteActivitiesModal"
  />
</template>
