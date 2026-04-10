<script setup lang="ts">
import { EDeclaredActivityStatus, type TraceAssociationsDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import { AssociatedDeclaredActivitiesCard } from '@/features/student/buildProject'
import { AssociatedDeclaredSkillsCard } from '@/features/student/declaredSkills'
import DeleteTraceAssociatedElementsDropdown
  from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/DeleteTraceAssociatedElementsDropdown/DeleteTraceAssociatedElementsDropdown.vue'
import TraceAssociateElementsDropdown
  from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/TraceAssociateElementsDropdown/TraceAssociateElementsDropdown.vue'
import AssociateActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import AssociateDeclaredSkillsToTracesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsToTracesModal/AssociateDeclaredSkillsToTracesModal.vue'
import DeleteTraceAssociatedActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.vue'
import DeleteTraceAssociatedSkillsModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedSkillsModal/DeleteTraceAssociatedSkillsModal.vue'

export interface TraceAssociationsProps {
  associations: TraceAssociationsDTO
  traceId: string
}

const { associations, traceId } = defineProps<TraceAssociationsProps>()

const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showActivitiesModal, displayModal: displayActivitiesModal, hideModal: hideActivitiesModal } = useModal()
const { showModal: showAssociateActivitiesModal, displayModal: displayAssociateActivitiesModal, hideModal: hideAssociateActivitiesModal } = useModal()
const { showModal: showAssociationModal, displayModal: displayAssociationModal, hideModal: hideAssociationModal } = useModal()

const declaredSkillAssociations = computed(() => associations.declaredSkillAssociations ?? [])
const declaredActivityAssociations = computed(() => associations.declaredActivityAssociations ?? [])

const deletableDeclaredActivityAssociations = computed(() => declaredActivityAssociations.value.filter(({ declaredActivity }) => declaredActivity.status !== EDeclaredActivityStatus.COMPLETED))
</script>

<template>
  <div
    class="av-col av-gap-xl av-pt-xl"
    data-testid="trace-associations"
  >
    <div class="av-row av-flex-fill av-justify-end av-gap-md">
      <DeleteTraceAssociatedElementsDropdown
        :activities-disabled="deletableDeclaredActivityAssociations.length === 0"
        :skills-disabled="declaredSkillAssociations.length === 0"
        @activities-selected="displayActivitiesModal"
        @skills-selected="displaySkillsModal"
      />
      <TraceAssociateElementsDropdown
        @skills-selected="displayAssociationModal"
        @activities-selected="displayAssociateActivitiesModal"
      />
    </div>

    <slot name="caption" />

    <AssociatedDeclaredSkillsCard
      :associated-declared-skills="declaredSkillAssociations"
    />

    <AssociatedDeclaredActivitiesCard :associated-activities="declaredActivityAssociations" />
  </div>

  <AssociateActivitiesModal
    :show="showAssociateActivitiesModal"
    :trace-id="traceId"
    @cancel="hideAssociateActivitiesModal"
    @associated="hideAssociateActivitiesModal"
  />

  <DeleteTraceAssociatedSkillsModal
    :show="showSkillsModal"
    :trace-id="traceId"
    :associations="declaredSkillAssociations"
    @cancel="hideSkillsModal"
    @deleted="hideSkillsModal"
  />

  <DeleteTraceAssociatedActivitiesModal
    :show="showActivitiesModal"
    :trace-id="traceId"
    :associations="deletableDeclaredActivityAssociations"
    @cancel="hideActivitiesModal"
    @deleted="hideActivitiesModal"
  />

  <AssociateDeclaredSkillsToTracesModal
    :show="showAssociationModal"
    :trace-id="traceId"
    @cancel="hideAssociationModal"
    @associated="hideAssociationModal"
  />
</template>
