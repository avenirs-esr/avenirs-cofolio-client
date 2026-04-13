<script lang="ts" setup>
import type { DeclaredActivityAssociationsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { QuerySuspense } from '@/common/components'
import { useModal } from '@/common/composables'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import ActivityAssociateElementsDropdown
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/ActivityAssociateElementsDropdown/ActivityAssociateElementsDropdown.vue'
import DeleteActivityAssociatedElementsDropdown
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteActivityAssociatedElementsDropdown/DeleteActivityAssociatedElementsDropdown.vue'
import AssociateTracesModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.vue'
import DeleteActivityAssociatedSkillsModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedSkillsModal/DeleteActivityAssociatedSkillsModal.vue'
import DeleteActivityAssociatedTracesModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedTracesModal/DeleteActivityAssociatedTracesModal.vue'
import { AssociatedDeclaredSkillsCard } from '@/features/student/declaredSkills'

export interface AssociatedElementsTabProps {
  associations: DeclaredActivityAssociationsDTO
  declaredActivityId: string
  countAssociations: number
  error?: BaseApiException | null
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
        :traces-disabled="tracesAssociations.length === 0"
        @skills-selected="displaySkillsModal"
        @traces-selected="displayTracesModal"
      />
      <ActivityAssociateElementsDropdown
        @traces-selected="displayAssociateTracesModal"
      />
    </div>

    <QuerySuspense
      :error="error"
      :is-empty="countAssociations === 0"
    >
      <AssociatedDeclaredSkillsCard
        :associated-declared-skills="associations.declaredSkillAssociations"
      />
      <AssociatedTracesCard
        :associated-traces="associations.traceAssociations"
      />
    </QuerySuspense>
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
