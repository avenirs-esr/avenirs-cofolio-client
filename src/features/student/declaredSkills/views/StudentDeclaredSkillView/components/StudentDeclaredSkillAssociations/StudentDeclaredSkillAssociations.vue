<script setup lang="ts">
import type { DeclaredActivityAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
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
import DeclaredSkillAssociateElementsDropdown
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/overlays/dropdowns/DeclaredSkillAssociateElementsDropdown/DeclaredSkillAssociateElementsDropdown.vue'
import DeleteDeclaredSkillAssociatedElementsDropdown
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/overlays/dropdowns/DeleteDeclaredSkillAssociatedElementsDropdown/DeleteDeclaredSkillAssociatedElementsDropdown.vue'
import { useI18n } from 'vue-i18n'

interface StudentDeclaredSkillAssociationsProps {
  declaredSkillId: string
  associatedDeclaredActivities: DeclaredActivityAssociationDTO[]
  associatedTraces: TraceAssociationDTO[]
  associationsError?: BaseApiException | null
  countAssociations?: number
}

const {
  declaredSkillId,
  associatedTraces,
  associatedDeclaredActivities,
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
        <DeleteDeclaredSkillAssociatedElementsDropdown
          :activities-disabled="deletableDeclaredActivityAssociations.length === 0"
          @activities-selected="displayDeleteActivitiesModal"
        />
        <DeclaredSkillAssociateElementsDropdown
          @activities-selected="displayAssociateActivitiesModal"
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
