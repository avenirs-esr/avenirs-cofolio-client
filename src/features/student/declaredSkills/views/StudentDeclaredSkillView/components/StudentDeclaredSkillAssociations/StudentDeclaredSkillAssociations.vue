<script setup lang="ts">
import type { DeclaredActivityAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import AssociatedDeclaredActivitiesCard
  from '@/features/student/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.vue'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import AssociateActivitiesToDeclaredSkillModal
  from '@/features/student/declaredSkills/components/overlays/modals/AssociateActivitiesToDeclaredSkillModal/AssociateActivitiesToDeclaredSkillModal.vue'
import DeclaredSkillAssociateElementsDropdown
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/overlays/dropdowns/DeclaredSkillAssociateElementsDropdown/DeclaredSkillAssociateElementsDropdown.vue'

const {
  declaredSkillId,
  associatedTraces,
  associatedDeclaredActivities
} = defineProps<{
  declaredSkillId: string
  associatedDeclaredActivities: DeclaredActivityAssociationDTO[]
  associatedTraces: TraceAssociationDTO[]
}>()

const emit = defineEmits<{
  (e: 'associated'): void
}>()

const {
  showModal: showAssociateActivitiesModal,
  displayModal: displayAssociateActivitiesModal,
  hideModal: hideAssociateActivitiesModal
} = useModal()

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
        <DeclaredSkillAssociateElementsDropdown
          @activities-selected="displayAssociateActivitiesModal"
        />
      </div>
      <AssociatedTracesCard :associated-traces="associatedTraces" />
      <AssociatedDeclaredActivitiesCard :associated-activities="associatedDeclaredActivities" />
    </div>
  </div>

  <AssociateActivitiesToDeclaredSkillModal
    :show="showAssociateActivitiesModal"
    :declared-skill-id="declaredSkillId"
    @cancel="hideAssociateActivitiesModal"
    @associated="onAssociated"
  />
</template>
