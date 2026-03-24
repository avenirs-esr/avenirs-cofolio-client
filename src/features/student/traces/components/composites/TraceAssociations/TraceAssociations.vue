<script setup lang="ts">
import type { TraceAssociationsDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import StudentTraceDeclaredSkillAssociationCard from '@/features/student/traces/components/cards/StudentTraceDeclaredSkillAssociationCard/StudentTraceDeclaredSkillAssociationCard.vue'
import DeleteTraceAssociatedElementsDropdown from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/DeleteTraceAssociatedElementsDropdown/DeleteTraceAssociatedElementsDropdown.vue'
import DeleteTraceAssociatedActivitiesModal from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.vue'
import DeleteTraceAssociatedSkillsModal from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedSkillsModal/DeleteTraceAssociatedSkillsModal.vue'
import isEmpty from 'lodash-es/isEmpty'

export interface TraceAssociationsProps {
  associations: TraceAssociationsDTO
  traceId: string
}

const { associations, traceId } = defineProps<TraceAssociationsProps>()
const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showActivitiesModal, displayModal: displayActivitiesModal, hideModal: hideActivitiesModal } = useModal()

const declaredSkillAssociations = computed(() => associations.declaredSkillAssociations ? associations.declaredSkillAssociations : [])

const activityAssociations = computed(() => associations.declaredActivityAssociations ? associations.declaredActivityAssociations : [])
</script>

<template>
  <div class="av-col av-gap-xl av-pt-xl">
    <div class="av-row av-flex-fill av-justify-end av-gap-md">
      <DeleteTraceAssociatedElementsDropdown
        :activities-disabled="isEmpty(activityAssociations)"
        :skills-disabled="isEmpty(declaredSkillAssociations)"
        @activities-selected="displayActivitiesModal"
        @skills-selected="displaySkillsModal"
      />
    </div>

    <slot name="caption" />

    <StudentTraceDeclaredSkillAssociationCard
      v-for="declaredSkill in declaredSkillAssociations"
      :key="declaredSkill.id"
      :declared-skill="declaredSkill"
    />
  </div>

  <DeleteTraceAssociatedSkillsModal
    :show="showSkillsModal"
    @cancel="hideSkillsModal"
    @deleted="hideSkillsModal"
  />

  <DeleteTraceAssociatedActivitiesModal
    :show="showActivitiesModal"
    :trace-id="traceId"
    :associations="activityAssociations"
    @cancel="hideActivitiesModal"
    @deleted="hideActivitiesModal"
  />
</template>
