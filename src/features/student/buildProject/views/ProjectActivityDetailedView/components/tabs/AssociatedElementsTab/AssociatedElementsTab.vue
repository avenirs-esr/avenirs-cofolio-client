<script lang="ts" setup>
import type { DeclaredActivityAssociationsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { QuerySuspense } from '@/common/components'
import { useModal } from '@/common/composables'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import TraceAssociationLimitCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.vue'
import AssociateDeclaredSkillToActivityModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/modals/AssociateDeclaredSkillToActivityModal/AssociateDeclaredSkillToActivityModal.vue'
import ActivityAssociateElementsDropdown
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/ActivityAssociateElementsDropdown/ActivityAssociateElementsDropdown.vue'
import DeleteActivityAssociatedElementsDropdown
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteActivityAssociatedElementsDropdown/DeleteActivityAssociatedElementsDropdown.vue'
import AssociateTracesModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesModal.vue'
import DeleteActivityAssociatedElementsModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/DeleteActivityAssociatedElementsModal/DeleteActivityAssociatedElementsModal.vue'
import { AssociatedDeclaredSkillsCard } from '@/features/student/declaredSkills'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementsTabProps {
  associations: DeclaredActivityAssociationsDTO
  declaredActivityId: string
  countAssociations: number
  traceAllowedAssociations: number
  error?: BaseApiException | null
  isLoading?: boolean
  traceAssociationsDisabled?: boolean
  maxTraceAssociationsReached?: boolean
}

const {
  associations,
  traceAllowedAssociations,
  traceAssociationsDisabled = false,
  maxTraceAssociationsReached = false
} = defineProps<AssociatedElementsTabProps>()

const { t } = useI18n()
const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showTracesModal, displayModal: displayTracesModal, hideModal: hideTracesModal } = useModal()
const { showModal: showAssociateTracesModal, displayModal: displayAssociateTracesModal, hideModal: hideAssociateTracesModal } = useModal()
const { showModal: showAssociateSkillsModal, displayModal: displayAssociateSkillsModal, hideModal: hideAssociateSkillsModal } = useModal()

const tracesAssociations = computed(() => {
  return associations.traceAssociations.map(traceAssociation => ({
    id: traceAssociation.associationId,
    title: traceAssociation.trace.title
  }))
})

const skillsAssociations = computed(() => {
  return associations.declaredSkillAssociations.map(skillAssociation => ({
    id: skillAssociation.associationId,
    title: skillAssociation.declaredSkill.title
  }))
})
</script>

<template>
  <div class="av-col av-gap-xl av-pt-xl">
    <div class="av-col av-gap-sm">
      <div class="av-row av-flex-fill av-justify-end av-gap-md">
        <DeleteActivityAssociatedElementsDropdown
          :traces-disabled="traceAssociationsDisabled || tracesAssociations.length === 0"
          :skills-disabled="skillsAssociations.length === 0"
          @skills-selected="displaySkillsModal"
          @traces-selected="displayTracesModal"
        />
        <ActivityAssociateElementsDropdown
          :traces-disabled="traceAssociationsDisabled || maxTraceAssociationsReached"
          @traces-selected="displayAssociateTracesModal"
          @skills-selected="displayAssociateSkillsModal"
        />
      </div>
      <span
        v-if="maxTraceAssociationsReached"
        class="caption-light av-text-right"
        data-testid="max-trace-associations-reached"
      >
        {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveSection.AssociatedElementsTab.maxTraceAssociationsReached') }}
      </span>
    </div>
    <div class="av-col av-gap-md">
      <TraceAssociationLimitCard
        :trace-allowed-associations="traceAllowedAssociations"
      />
    </div>

    <QuerySuspense
      :error="error"
      :is-empty="countAssociations === 0"
      :is-loading="isLoading"
    >
      <div class="av-col av-gap-md">
        <AssociatedDeclaredSkillsCard
          :associated-declared-skills="associations.declaredSkillAssociations"
        />
        <AssociatedTracesCard
          :associated-traces="associations.traceAssociations"
          :trace-allowed-associations="traceAllowedAssociations"
        />
      </div>
    </QuerySuspense>
  </div>

  <DeleteActivityAssociatedElementsModal
    :show="showSkillsModal"
    :declared-activity-id="declaredActivityId"
    :associations="skillsAssociations"
    data-testid="delete-activity-associated-skills-modal"
    @cancel="hideSkillsModal"
    @deleted="hideSkillsModal"
  />

  <DeleteActivityAssociatedElementsModal
    :show="showTracesModal"
    :declared-activity-id="declaredActivityId"
    :associations="tracesAssociations"
    data-testid="delete-activity-associated-traces-modal"
    @cancel="hideTracesModal"
    @deleted="hideTracesModal"
  />

  <AssociateTracesModal
    :show="showAssociateTracesModal"
    :declared-activity-id="declaredActivityId"
    @cancel="hideAssociateTracesModal"
    @associated="hideAssociateTracesModal"
  />

  <AssociateDeclaredSkillToActivityModal
    :show="showAssociateSkillsModal"
    :activity-id="declaredActivityId"
    @cancel="hideAssociateSkillsModal"
    @associated="hideAssociateSkillsModal"
  />
</template>
