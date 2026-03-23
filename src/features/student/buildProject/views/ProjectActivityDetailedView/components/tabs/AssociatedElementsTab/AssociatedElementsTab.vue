<script lang="ts" setup>
import type { DeclaredActivityAssociationsDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import AssociatedTracesCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import ActivityAssociateElementsDropdown
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/ActivityAssociateElementsDropdown/ActivityAssociateElementsDropdown.vue'
import DeleteActivityAssociatedElementsDropdown from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteActivityAssociatedElementsDropdown/DeleteActivityAssociatedElementsDropdown.vue'
import AssociateTracesModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.vue'
import DeleteActivityAssociatedSkillsModal from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedSkillsModal/DeleteActivityAssociatedSkillsModal.vue'
import DeleteActivityAssociatedTracesModal from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedTracesModal/DeleteActivityAssociatedTracesModal.vue'

export interface AssociatedElementsTabProps {
  associations: DeclaredActivityAssociationsDTO
  declaredActivityId: string
}

const { associations } = defineProps<AssociatedElementsTabProps>()

const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showTracesModal, displayModal: displayTracesModal, hideModal: hideTracesModal } = useModal()
const { showModal: showAssociateTracesModal, displayModal: displayAssociateTracesModal, hideModal: hideAssociateTracesModal } = useModal()

const tracesAssociations = computed(() => {
  return associations.traceAssociations.map(traceAssociation => ({
    id: traceAssociation.associationId,
    title: traceAssociation.trace.title
  }))
})
</script>

<template>
  <div class="av-col av-gap-xl av-pt-xl">
    <div class="av-row av-flex-fill av-justify-end av-gap-md">
      <DeleteActivityAssociatedElementsDropdown
        @skills-selected="displaySkillsModal"
        @traces-selected="displayTracesModal"
      />
      <ActivityAssociateElementsDropdown
        @traces-selected="displayAssociateTracesModal"
      />
    </div>

    <AssociatedTracesCard
      :associated-traces="associations.traceAssociations"
    />
  </div>

  <DeleteActivityAssociatedSkillsModal
    :show="showSkillsModal"
    @cancel="hideSkillsModal"
    @deleted="hideSkillsModal"
  />

  <DeleteActivityAssociatedTracesModal
    :show="showTracesModal"
    :declared-activity-id="declaredActivityId"
    :associations="tracesAssociations"
    @cancel="hideTracesModal"
    @deleted="hideTracesModal"
  />

  <AssociateTracesModal
    :show="showAssociateTracesModal"
    :declared-activity-id="declaredActivityId"
    @cancel="hideAssociateTracesModal"
    @associated="hideAssociateTracesModal"
  />
</template>
