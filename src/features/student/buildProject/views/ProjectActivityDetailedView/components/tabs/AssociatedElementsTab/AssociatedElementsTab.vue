<script lang="ts" setup>
import type { DeclaredActivityAssociationsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { EAssociationContextType } from '@/api/avenir-esr'
import { isActivityAssociationToTraceDisabled } from '@/common/activities/rules/activities.rules'
import AssociationElementsDropdown
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import { QuerySuspense } from '@/common/components'
import { useModal } from '@/common/composables'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import TraceAssociationLimitCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.vue'
import AssociateDeclaredSkillToActivityModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/modals/AssociateDeclaredSkillToActivityModal/AssociateDeclaredSkillToActivityModal.vue'
import AssociateTracesToDeclaredActivity
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/modals/AssociateTracesModal/AssociateTracesToDeclaredActivity.vue'
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

const deleteItems = computed(() => [
  { type: EAssociationContextType.DECLARED_SKILL, disabled: skillsAssociations.value.length === 0 },
  { type: EAssociationContextType.TRACE, disabled: traceAssociationsDisabled || tracesAssociations.value.length === 0 },
])

const associateItems = computed(() => [
  { type: EAssociationContextType.TRACE, disabled: traceAssociationsDisabled || maxTraceAssociationsReached },
  { type: EAssociationContextType.DECLARED_SKILL },
])

function onDeleteSelect (type: EAssociationContextType) {
  switch (type) {
    case EAssociationContextType.DECLARED_SKILL:
      displaySkillsModal()
      break
    case EAssociationContextType.TRACE:
      displayTracesModal()
      break
  }
}

function onAssociateSelect (type: EAssociationContextType) {
  switch (type) {
    case EAssociationContextType.TRACE:
      displayAssociateTracesModal()
      break
    case EAssociationContextType.DECLARED_SKILL:
      displayAssociateSkillsModal()
      break
  }
}

const traceAssociationEnabled = computed(() => !isActivityAssociationToTraceDisabled({ traceAllowedAssociations }))
</script>

<template>
  <div class="av-col av-gap-xl av-pt-xl">
    <div class="av-col av-gap-sm">
      <div class="av-row av-flex-fill av-justify-end av-gap-md">
        <AssociationElementsDropdown
          variant="delete"
          data-testid="delete-activity-associated-elements-dropdown"
          :items="deleteItems"
          @select="onDeleteSelect"
        />
        <AssociationElementsDropdown
          variant="associate"
          data-testid="activity-associate-elements-dropdown"
          :items="associateItems"
          @select="onAssociateSelect"
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
        v-if="traceAssociationEnabled"
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

  <AssociateTracesToDeclaredActivity
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
